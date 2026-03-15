import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Path, HTTPException, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from app.schemas.response import UploadResponse
from typing import List, Annotated
from fastapi.responses import FileResponse

from app.services.workflow import UnderwritingWorkflow
from app.core.database import get_db, ApplicationRecord # Import DB tools
from app.services.reporting.pdf_generator import generate_pdf_report

router = APIRouter()

@router.post("/{application_id}/upload", response_model=UploadResponse)
async def upload_documents(
    application_id: Annotated[str, Path(description="The unique ID of the application")], 
    background_tasks: BackgroundTasks, 
    files: Annotated[List[UploadFile], File(description="Upload financial documents")],
    db: Session = Depends(get_db) # <-- Inject the DB session here
):
    # Verify the ID exists in SQLite
    app_record = db.query(ApplicationRecord).filter(ApplicationRecord.id == application_id).first()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found in database")

    saved_file_paths = []
    temp_dir = tempfile.gettempdir()
    
    for file in files:
        file_path = os.path.join(temp_dir, f"{application_id}_{file.filename}")
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        saved_file_paths.append(file_path)
        
    # Pass the DB session into the workflow
    workflow = UnderwritingWorkflow(db_session=db)
    background_tasks.add_task(workflow.process_uploaded_documents, application_id, saved_file_paths)
        
    return UploadResponse(
        status="success",
        message="Documents received. Fully automated pipeline running.",
        files_received=[f.filename for f in files]
    )

@router.get("/{application_id}/status")
async def get_application_status(
    application_id: str,
    db: Session = Depends(get_db)
):
    """
    Fetch the current status and all associated data for a given application.
    The frontend will poll this endpoint every few seconds to update the UI.
    """
    # 1. Query the SQLite database for the application
    app_record = db.query(ApplicationRecord).filter(ApplicationRecord.id == application_id).first()
    
    # 2. Handle the case where the ID doesn't exist
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found in database")
        
    # 3. Return the complete package to the frontend
    return {
        "application_id": app_record.id,
        "status": app_record.status,
        "entity_data": app_record.entity_data or {},
        "extracted_data": app_record.extracted_data or {},
        "final_analysis": app_record.final_analysis or {}
    }
@router.get("/{application_id}/download-report")
async def download_credit_report(
    application_id: str,
    db: Session = Depends(get_db)
):
    """
    Phase 3: Generates and serves the final PDF report for the frontend to download.
    """
    # 1. Fetch the data from SQLite
    app_record = db.query(ApplicationRecord).filter(ApplicationRecord.id == application_id).first()
    
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")
        
    if app_record.status != "completed":
        raise HTTPException(status_code=400, detail="Analysis is not yet completed.")

    try:
        # 2. Generate the PDF file on disk
        pdf_file_path = generate_pdf_report(application_id, app_record)
        
        # 3. Serve the file to the user's browser as a download
        return FileResponse(
            path=pdf_file_path,
            filename=f"Vivriti_Credit_Report_{application_id}.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")