from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import onboarding, extraction

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Core backend for enterprise credit underwriting automation."
)

# Crucial for allowing your React/Next.js frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to frontend localhost URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include the modular routers
app.include_router(
    onboarding.router, 
    prefix=f"{settings.API_V1_STR}/underwriting", 
    tags=["1. Entity Onboarding"]
)

app.include_router(
    extraction.router, 
    prefix=f"{settings.API_V1_STR}/underwriting", 
    tags=["2. Document Extraction"]
)

@app.get("/")
async def root():
    return {"message": "FinTech Underwriter Pro API is running. Visit /docs for the Swagger UI."}

if __name__ == "__main__":
    import uvicorn
    # Run from the root directory using: python -m app.main
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)