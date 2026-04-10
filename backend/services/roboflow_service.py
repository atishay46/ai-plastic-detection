import requests
import base64
import os

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")

def run_inference(image_path):
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    img_base64 = base64.b64encode(image_bytes).decode("utf-8")

    url = f"https://serverless.roboflow.com/mysto-x/general-segmentation-api-2?api_key={ROBOFLOW_API_KEY}"

    response = requests.post(
        url,
        json={
            "image": img_base64
        }
    )

    return response.json()
from config import ROBOFLOW_API_KEY, API_URL, WORKSPACE, WORKFLOW_ID
import tempfile

client = InferenceHTTPClient(
    api_url=API_URL,
    api_key=ROBOFLOW_API_KEY
)

def detect_objects(image_file):
    # Save uploaded image temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        temp.write(image_file)
        temp_path = temp.name

    result = run_inference(file_path)

    return response.json()