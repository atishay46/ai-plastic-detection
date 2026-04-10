import requests
import base64
import tempfile
import os


def detect_objects(image_file):
    """
    Accept raw image bytes, save to temp file, send to Roboflow API,
    return the JSON response.
    """
    # Read API key at call time (after load_dotenv has run in main.py)
    api_key = os.getenv("ROBOFLOW_API_KEY", "")

    if not api_key:
        print("[WARN] ROBOFLOW_API_KEY is not set -- returning empty result")
        return {"predictions": []}

    # Save uploaded image bytes to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        temp.write(image_file)
        temp_path = temp.name

    # Run inference via Roboflow HTTP API
    result = _run_inference(temp_path, api_key)

    # Clean up temp file
    try:
        os.unlink(temp_path)
    except OSError:
        pass

    return result


def _run_inference(image_path: str, api_key: str) -> dict:
    """Send image to Roboflow serverless API and return JSON response."""
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    img_base64 = base64.b64encode(image_bytes).decode("utf-8")

    url = f"https://serverless.roboflow.com/mysto-x/general-segmentation-api-2?api_key={api_key}"

    try:
        response = requests.post(url, json={"image": img_base64}, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"[ERROR] Roboflow API error: {e}")
        return {"predictions": []}