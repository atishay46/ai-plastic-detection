from fastapi import APIRouter, UploadFile, File
from services.roboflow_service import detect_objects
from services.ppi_service import calculate_ppi

router = APIRouter()

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()

    # Call Roboflow API
    result = detect_objects(contents)

    # SAFE + FLEXIBLE extraction (handles all formats)
    try:
        # Case 1: nested predictions (most common)
        if isinstance(result.get("predictions"), dict):
            predictions = result.get("predictions", {}).get("predictions", [])
        else:
            # Case 2: direct list
            predictions = result.get("predictions", [])
    except:
        predictions = []

    # Filter low-confidence detections (optional but better)
    predictions = [
        p for p in predictions
        if p.get("confidence", 0) > 0.3
    ]

    count = len(predictions)

    # Calculate PPI
    ppi, severity = calculate_ppi(count)

    return {
        "count": count,
        "ppi": ppi,
        "severity": severity,
        "predictions": predictions
    }