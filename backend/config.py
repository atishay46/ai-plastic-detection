import os
from dotenv import load_dotenv

load_dotenv()

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY", "")
API_URL = os.getenv("ROBOFLOW_API_URL", "https://serverless.roboflow.com")
WORKSPACE = os.getenv("WORKSPACE", "mysto-x")
WORKFLOW_ID = os.getenv("WORKFLOW_ID", "general-segmentation-api-2")