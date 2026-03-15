from pydantic import BaseModel, Field
from typing import Dict, Any

class CompanyDetails(BaseModel):
    cin: str = Field(..., example="L65910MH1986PLC039803")
    pan: str = Field(..., example="ABCDE1234F")
    sector: str = Field(..., example="NBFC")
    turnover_inr: float = Field(..., gt=0, example=500000000)

class LoanRequest(BaseModel):
    loan_type: str = Field(..., example="Term Loan")
    expected_amount_inr: float = Field(..., gt=0, example=20000000)
    tenure_months: int = Field(..., gt=0, example=36)
    expected_interest_rate: float = Field(..., gt=0, example=12.5)

class OnboardRequest(BaseModel):
    company_details: CompanyDetails
    loan_request: LoanRequest

# --- ADD THIS NEW SCHEMA ---
class ApprovalRequest(BaseModel):
    # We use Dict[str, Any] so it can accept any flexible JSON schema the frontend sends back
    approved_schema: Dict[str, Any] = Field(
        ..., 
        description="The finalized, human-verified JSON schema."
    )
    approved_by: str = Field(
        ..., 
        example="Karan Sahni",
        description="The name or ID of the human analyst who verified the data."
    )