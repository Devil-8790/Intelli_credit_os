import os
import logging
import nest_asyncio
from llama_parse import LlamaParse
from typing import Optional
from dotenv import load_dotenv
load_dotenv()
# Required to run LlamaParse asynchronously inside FastAPI loops
nest_asyncio.apply()

logger = logging.getLogger(__name__)

class DocumentParser:
    """
    Cloud-native document parsing engine.
    Offloads 100% of the heavy PDF OCR and table extraction to LlamaParse servers.
    """
    
    def __init__(self):
        # Initialize LlamaParse to output strict Markdown
        api_key = os.getenv("LLAMA_CLOUD_API_KEY")
        if not api_key:
            logger.error("CRITICAL: LLAMA_CLOUD_API_KEY is not set in environment variables.")
            
        self.llama_parser = LlamaParse(
            api_key=api_key,
            result_type="markdown",
            verbose=True,
            language="en"
        )

    async def extract_text(self, file_path: str) -> Optional[str]:
        """
        Sends the file to LlamaParse and returns the structured Markdown.
        """
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return None

        logger.info(f"Offloading {file_path} extraction to LlamaParse Cloud...")
        
        try:
            # Use the async method (aload_data) to keep FastAPI highly responsive
            parsed_docs = await self.llama_parser.aload_data(file_path)
            
            # Combine all pages into a single continuous markdown string
            full_markdown = "\n\n".join([doc.text for doc in parsed_docs])
            logger.info(f"Successfully extracted {len(full_markdown)} characters of Markdown.")
            
            return full_markdown
            
        except Exception as e:
            logger.error(f"LlamaParse cloud extraction failed on {file_path}: {e}")
            raise e

# Instantiate a global parser object to be imported by your workflow
document_parser = DocumentParser()