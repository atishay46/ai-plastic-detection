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

    # Extract image dimensions from result for PPI calculation
    try:
        pred_block = result[0].get("predictions", {})
        image_width = pred_block.get("image", {}).get("width", 1)
        image_height = pred_block.get("image", {}).get("height", 1)
    except (IndexError, AttributeError):
        image_width = 1
        image_height = 1

    ppi_result = calculate_ppi(
        predictions,
        image_width,
        image_height
    )

    return {
        "count": ppi_result["bottle_count"],
        "ppi": ppi_result["ppi"],
        "severity": ppi_result["severity"],
        "coverage_percentage": ppi_result["coverage_percentage"],
        "density_factor": ppi_result["density_factor"],
        "average_confidence": ppi_result["average_confidence"],
        "predictions": predictions
    }