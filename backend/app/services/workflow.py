import asyncio
import logging
import os
from typing import List

from sqlalchemy.orm import Session
from app.core.database import ApplicationRecord

# Import our custom AI services
from app.services.document_intelligence.parser import document_parser
from app.services.reasoning_engine.agent import map_markdown_to_schema
from app.services.secondary_research.scraper import fetch_company_news
from app.services.reasoning_engine.agent import generate_final_report

# Configure basic logging for the console
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UnderwritingWorkflow:
    """
    Central orchestrator for the B2B Credit Underwriting pipeline.
    Controls the flow of data between the UI, the SQLite Database, and the AI Services.
    """
    
    def __init__(self, db_session: Session):
        self.db = db_session 

    def _update_status(self, app_id: str, new_status: str):
        """Helper to quickly update the application status in the SQLite DB."""
        app_record = self.db.query(ApplicationRecord).filter(ApplicationRecord.id == app_id).first()
        if app_record:
            app_record.status = new_status
            self.db.commit()
    def _filter_financial_content(self, markdown_text: str, max_chars: int = 150000) -> str:
        """
        Chops the markdown into chunks and scores them. 
        Prioritizes chunks with financial keywords and Markdown tables (|).
        """
        keywords = ["balance sheet", "profit and loss", "income statement", "cash flow", 
                    "assets", "liabilities", "equity", "revenue", "ebitda", "turnover",
                    "net profit", "shareholder", "borrowings", "total comprehensive income"]
        
        # Split the massive document into rough sections/paragraphs
        chunks = markdown_text.split('\n\n')
        
        scored_chunks = []
        for chunk in chunks:
            lower_chunk = chunk.lower()
            
            # 1 point for every financial keyword
            keyword_score = sum(lower_chunk.count(kw) for kw in keywords) * 10
            # 1 point for every table column divider (this finds the actual tables!)
            table_score = chunk.count('|') 
            
            total_score = keyword_score + table_score
            scored_chunks.append((total_score, chunk))
            
        # Sort chunks so the highest-scoring (most financial) ones are at the top
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        
        # Rebuild the document using only the best parts, up to our safe character limit
        filtered_text = ""
        for score, chunk in scored_chunks:
            # Only include chunks that actually look like financial data (score > 0)
            if score > 0:
                if len(filtered_text) + len(chunk) < max_chars:
                    filtered_text += chunk + "\n\n"
                else:
                    break # We hit our safety limit!
                    
        return filtered_text
    
    async def process_uploaded_documents(self, application_id: str, saved_file_paths: List[str]):
        logger.info(f"[{application_id}] Starting REAL document extraction workflow...")
        self._update_status(application_id, "processing_documents")
        
        try:
            raw_markdown = ""
            file_names = []
            
            for file_path in saved_file_paths:
                file_name = os.path.basename(file_path)
                file_names.append(file_name)
                
                logger.info(f"[{application_id}] Parsing {file_name} with LlamaParse...")
                markdown_content = await document_parser.extract_text(file_path)
                
                if markdown_content:
                    raw_markdown += f"\n\n### SOURCE DOCUMENT: {file_name} ###\n\n"
                    raw_markdown += markdown_content
            
            # --- THE MAGIC HAPPENS HERE ---
            logger.info(f"[{application_id}] Filtering out marketing fluff to find financial tables...")
            filtered_markdown = self._filter_financial_content(raw_markdown, max_chars=150000)
            
            logger.info(f"[{application_id}] Sending {len(filtered_markdown)} highly relevant chars to Gemini...")
            extracted_schema = await map_markdown_to_schema(filtered_markdown, file_names)
            
            # Save extraction to SQLite Database
            app_record = self.db.query(ApplicationRecord).filter(ApplicationRecord.id == application_id).first()
            if app_record:
                app_record.extracted_data = extracted_schema
                self.db.commit()
            
            # Auto-Trigger Phase 2 (Keep your 35s sleep here to bypass rate limits!)
            logger.info(f"[{application_id}] Extraction saved. Sleeping for 35s to bypass API Rate Limits...")
            await asyncio.sleep(35) 
            
            logger.info(f"[{application_id}] Waking up! Triggering Phase 2...")
            await self.run_pre_cognitive_analysis(application_id)
            
        except Exception as e:
            logger.error(f"[{application_id}] Workflow failed: {str(e)}")
            self._update_status(application_id, "failed_extraction")

    async def run_pre_cognitive_analysis(self, application_id: str):
        """
        WORKFLOW PHASE 2: Triggered automatically after Phase 1.
        """
        logger.info(f"[{application_id}] Starting REAL pre-cognitive analysis...")
        self._update_status(application_id, "running_analysis")
        
        try:
            # 1. Fetch record from DB to get the entity details and extracted financials
            app_record = self.db.query(ApplicationRecord).filter(ApplicationRecord.id == application_id).first()
            if not app_record:
                raise ValueError("Application record not found in database.")
                
            entity_data = app_record.entity_data or {}
            approved_financials = app_record.extracted_data or {}
            
            company_details = entity_data.get("company_details", {})
            loan_request = entity_data.get("loan_request", {})
            
            # 2. Run the Web Scraper (FIXED: Searching by Sector instead of CIN!)
            sector = company_details.get("sector", "Finance")
            logger.info(f"[{application_id}] Scraping web for: {sector} news...")
            
            news_data = await fetch_company_news(
                company_name=sector, # Swapped to ensure we get results
                sector=sector
            )
            
            # 3. Run the LLM Reasoning Engine for final SWOT and Decision
            final_report = await generate_final_report(
                extracted_financials=approved_financials,
                loan_request=loan_request,
                news_data=news_data
            )
            
            # Attach the scraped news to the final payload so the frontend can display it
            final_report["secondary_research_feed"] = news_data
            
            # 4. Save the final report to SQLite and complete the process
            app_record.final_analysis = final_report
            app_record.status = "completed"
            self.db.commit()
            
            logger.info(f"[{application_id}] Full pipeline complete. Data permanently saved to SQLite.")
            
        except Exception as e:
            logger.error(f"[{application_id}] Phase 2 failed: {str(e)}")
            self._update_status(application_id, "failed_analysis")