import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.request import OnboardRequest
from app.schemas.response import OnboardResponse
from app.core.database import get_db, ApplicationRecord # Import our DB tools

router = APIRouter()

@router.post("/onboard", response_model=OnboardResponse)
async def onboard_entity(request: OnboardRequest, db: Session = Depends(get_db)):
    """Step 1: Create a new application in the SQLite Database."""
    
    # Generate a unique ID
    application_id = f"app_{uuid.uuid4().hex[:8]}"
    
    # Create a new database row
    new_app = ApplicationRecord(
        id=application_id,
        status="onboarded",
        entity_data=request.model_dump() # Convert Pydantic request to a dictionary
    )
    
    # Save to SQLite
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    
    return OnboardResponse(
        application_id=application_id,
        status="success",
        message="Entity successfully onboarded to the SQLite database."
    )