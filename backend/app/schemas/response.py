from pydantic import BaseModel

class OnboardResponse(BaseModel):
    status: str
    application_id: str
    message: str

class UploadResponse(BaseModel):
    status: str
    message: str
    files_received: list[str]