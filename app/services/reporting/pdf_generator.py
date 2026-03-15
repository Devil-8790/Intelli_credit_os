import os
import json
import textwrap
from fpdf import FPDF
from fpdf.enums import XPos, YPos

# Ensure reports directory exists
REPORTS_DIR = "data/reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

class CreditReportPDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 16)
        self.cell(0, 10, "Vivriti Capital - AI Underwriting Report", border=False, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def generate_pdf_report(application_id: str, db_record) -> str:
    """
    Takes the SQLite database record and generates a downloadable PDF.
    Bypasses FPDF2's buggy word-wrapper by using Python's native textwrap.
    """
    pdf = CreditReportPDF()
    pdf.add_page()
    pdf.set_font("helvetica", size=10)

    # 1. Gather all data safely
    entity = db_record.entity_data or {}
    financials = db_record.extracted_data or {}
    analysis = db_record.final_analysis or {}

    def write_section(title, data_dict):
        # Section Header
        pdf.ln(5)
        pdf.set_font("helvetica", "B", 12)
        pdf.cell(0, 8, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font("helvetica", size=10)

        # Convert dictionary to a clean, formatted JSON string
        text_block = json.dumps(data_dict, indent=2)

        # Nuke any weird characters (emojis, smart quotes) that crash PDF fonts
        text_block = text_block.encode('latin-1', 'replace').decode('latin-1')

        # Use Python's built-in textwrap instead of FPDF's buggy multi_cell!
        # This guarantees it NEVER crashes on horizontal space errors.
        for raw_line in text_block.split('\n'):
            # Wrap each line to exactly 85 characters max
            wrapped_lines = textwrap.wrap(raw_line, width=85)
            
            # If it was an empty line, print an empty line
            if not wrapped_lines:
                pdf.cell(0, 5, "", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                
            for line in wrapped_lines:
                # Print line-by-line using basic cell (impossible to crash)
                pdf.cell(0, 5, line, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Print the 3 main sections
    write_section("1. Applicant Overview", entity)
    write_section("2. AI Extracted Financials", financials)
    write_section("3. Market News & Final SWOT Decision", analysis)

    file_path = os.path.join(REPORTS_DIR, f"{application_id}_report.pdf")
    pdf.output(file_path)
    
    return file_path