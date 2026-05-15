from inference_sdk import InferenceHTTPClient
from config import ROBOFLOW_API_KEY, API_URL, WORKSPACE, WORKFLOW_ID
import tempfile
import os

client = InferenceHTTPClient(
    api_url=API_URL,
    api_key=ROBOFLOW_API_KEY
)

def detect_objects(image_file):
    # Save uploaded image temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        temp.write(image_file)
        temp_path = temp.name

    try:
        result = client.run_workflow(
            workspace_name=WORKSPACE,
            workflow_id=WORKFLOW_ID,
            images={"image": temp_path},
            parameters={
                "classes": "plastic bottle"
            },
            use_cache=True
        )
    finally:
        # Clean up temp file to avoid filling disk on Render
        try:
            os.unlink(temp_path)
        except OSError:
            pass

    return result