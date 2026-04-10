from inference_sdk import InferenceHTTPClient
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

    result = client.run_workflow(
        workspace_name=WORKSPACE,
        workflow_id=WORKFLOW_ID,
        images={"image": temp_path},
        parameters={
            "classes": "plastic bottle"
        },
        use_cache=True
    )

    return result