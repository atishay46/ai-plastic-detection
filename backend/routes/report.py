from fastapi import APIRouter
from services.email_service import send_report

router = APIRouter()

@router.post("/report")
def report_issue(data: dict):
    response = send_report(data)
    return response