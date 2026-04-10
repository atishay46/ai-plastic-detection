from fastapi import APIRouter, UploadFile, File
from services.roboflow_service import detect_objects
from services.ppi_service import calculate_ppi

router = APIRouter()

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()

    result = detect_objects(contents)

    predictions = []

    # Extract predictions safely
    try:
        predictions = result[0]["predictions"]["predictions"]
    except:
        predictions = []

    count = len(predictions)

    ppi, severity = calculate_ppi(count)

    return {
        "count": count,
        "ppi": ppi,
        "severity": severity,
        "predictions": predictions
    }