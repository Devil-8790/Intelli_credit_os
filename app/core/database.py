from sqlalchemy import create_engine, Column, String, JSON
from sqlalchemy.orm import sessionmaker, declarative_base

# This creates a file called 'underwriter.db' in your root folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./underwriter.db"

# check_same_thread=False is needed for SQLite in FastAPI background tasks
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# --- OUR DATABASE TABLE ---
class ApplicationRecord(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, index=True)
    status = Column(String, default="onboarded")
    
    # We use JSON columns so we can just dump our dictionaries straight in!
    entity_data = Column(JSON, default={})
    extracted_data = Column(JSON, default={})
    final_analysis = Column(JSON, default={})

# Generate the database and tables automatically
Base.metadata.create_all(bind=engine)

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()