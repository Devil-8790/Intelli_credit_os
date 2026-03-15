import logging
import asyncio
from ddgs import DDGS

logger = logging.getLogger(__name__)

async def fetch_company_news(company_name: str, sector: str, max_results: int = 5) -> list:
    """
    Scrapes live news articles related to the company and its sector.
    Returns a list of dictionaries containing headlines, sources, and URLs.
    """
    logger.info(f"Initiating live web scraping for: {company_name} ({sector})")
    
    try:
        # We wrap the synchronous DDGS call in a thread so it doesn't block FastAPI
        def _perform_search():
            with DDGS() as ddgs:
                # We build a targeted search query
                query = f"{company_name} {sector} financial news market trends"
                # .news() fetches news articles specifically, not just general web pages
                results = list(ddgs.news(query, max_results=max_results))
                return results

        raw_results = await asyncio.to_thread(_perform_search)
        
        cleaned_news = []
        if raw_results:
            for item in raw_results:
                cleaned_news.append({
                    "headline": item.get("title", "No Title"),
                    "source": item.get("source", "Unknown Source"),
                    "date": item.get("date", "Unknown Date"),
                    "url": item.get("url", "")
                })
                
        logger.info(f"Successfully scraped {len(cleaned_news)} recent news articles.")
        return cleaned_news

    except Exception as e:
        logger.error(f"Web scraping failed for {company_name}: {str(e)}")
        # Return an empty list so the app doesn't crash if the search engine blocks us
        return []