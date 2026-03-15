import os
import json
import logging
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# Initialize the NEW Google GenAI Client
# It automatically picks up GEMINI_API_KEY from your .env file
try:
    client = genai.Client()
except Exception as e:
    logger.error(f"CRITICAL: Failed to initialize Gemini Client. Is GEMINI_API_KEY set? Error: {e}")

# --- Define the Expected Output Schema ---
# Note: The new SDK prefers strict types over 'Any'. We use float/str to be safe.
class ExtractedField(BaseModel):
    value: float = Field(description="The extracted numerical value. If missing, return 0.0.")
    confidence_score: float = Field(description="A score between 0.0 and 1.0 indicating how certain you are of this extraction.")
    source_document: str = Field(description="The name of the document this was found in. If missing, return 'Unknown'.")

class FinancialSchema(BaseModel):
    total_revenue: ExtractedField
    net_profit: ExtractedField
    debt_to_equity_ratio: ExtractedField
    shareholding_promoter_pct: ExtractedField

class ExtractionResponse(BaseModel):
    financials: FinancialSchema

# --- The AI Extraction Logic ---

async def map_markdown_to_schema(markdown_text: str, document_names: list[str]) -> dict:
    """
    Acts as a Senior Credit Analyst.
    Reads the LlamaParse markdown and extracts strict JSON using the new google-genai SDK.
    """
    logger.info("Initializing New Gemini 2.5 Reasoning Engine for Schema Mapping...")
    
    prompt = f"""
    You are an expert Enterprise Credit Analyst. 
    Your job is to read the following raw financial documents (converted to markdown) and extract key metrics.
    
    INSTRUCTIONS:
    1. Extract the required financial fields.
    2. If a value is clearly stated, give a high confidence_score (e.g., 0.95).
    3. If you have to calculate a value (like Debt-to-Equity) or guess based on unclear tables, give a low confidence_score (e.g., 0.40) so a human knows to review it.
    4. The source documents provided are: {', '.join(document_names)}.
    
    RAW DOCUMENT MARKDOWN:
    -----------------------
    {markdown_text}
    -----------------------
    """

    try:
        # The new SDK uses client.aio.models.generate_content for async calls
        # and wraps settings in types.GenerateContentConfig
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ExtractionResponse,
                temperature=0.1, # Keep it low so it doesn't hallucinate numbers
            ),
        )
        
        # Parse the string response into a Python dictionary
        extracted_json = json.loads(response.text)
        logger.info("Successfully mapped markdown to JSON schema.")
        return extracted_json
        
    except Exception as e:
        logger.error(f"Gemini extraction failed: {str(e)}")
        # Return a safe fallback so the UI doesn't crash
        return {"error": "Failed to map schema. Please review manually."}
# ... (Keep your existing Phase 1 code at the top of the file) ...

# --- Phase 2: Final Report Schemas ---

class SWOTAnalysis(BaseModel):
    strengths: list[str]
    weaknesses: list[str]
    opportunities: list[str]
    threats: list[str]

class FinalDecision(BaseModel):
    recommendation: str = Field(description="Must be strictly 'APPROVED', 'REJECTED', or 'NEEDS MANUAL REVIEW'")
    overall_confidence: float = Field(description="Score from 0.0 to 1.0 representing confidence in this decision.")
    reasoning: list[str] = Field(description="Bullet points explaining exactly WHY this decision was made, referencing both the financials and the news.")

class FinalReportResponse(BaseModel):
    decision_engine: FinalDecision
    swot_analysis: SWOTAnalysis

# --- Phase 2: The Final Decision Logic ---

async def generate_final_report(extracted_financials: dict, loan_request: dict, news_data: list) -> dict:
    """
    Takes the human-approved financials, the original loan request, and the scraped news.
    Forces Gemini to output a final SWOT analysis and decision.
    """
    logger.info("Initializing Gemini for Final SWOT and Decision Engine...")
    
    prompt = f"""
    You are the Chief Credit Officer at Vivriti Capital.
    Your task is to review a B2B loan application and generate a final investment report.
    
    1. LOAN REQUEST DETAILS:
    {json.dumps(loan_request, indent=2)}
    
    2. VERIFIED FINANCIAL DATA (Extracted from Entity Documents):
    {json.dumps(extracted_financials, indent=2)}
    
    3. RECENT MARKET NEWS & SECONDARY RESEARCH:
    {json.dumps(news_data, indent=2)}
    
    INSTRUCTIONS:
    - Analyze the financials against the requested loan amount. 
    - Incorporate the market news into your SWOT analysis (e.g., if news is bad, add it to Threats).
    - Make a definitive loan recommendation. Provide detailed reasoning.
    """

    try:
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=FinalReportResponse,
                temperature=0.3, # Slightly higher temperature allows for better SWOT reasoning
            ),
        )
        
        final_report_json = json.loads(response.text)
        logger.info("Successfully generated Final Report and SWOT analysis.")
        return final_report_json
        
    except Exception as e:
        logger.error(f"Gemini final report generation failed: {str(e)}")
        return {"error": "Failed to generate final report."}