import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinTech Underwriter Pro API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    


    class Config:
        case_sensitive = True

settings = Settings()