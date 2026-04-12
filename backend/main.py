import os
import sys
from dotenv import load_dotenv

# Load environment variables FIRST, before any other imports
load_dotenv()

print("[START] App starting...")
print(f"   Python version: {sys.version}")
print(f"   ROBOFLOW_API_KEY: {'SET' if os.getenv('ROBOFLOW_API_KEY') else 'NOT SET'}")
print(f"   SENDER_EMAIL: {'SET' if os.getenv('SENDER_EMAIL') else 'NOT SET'}")
print(f"   APP_PASSWORD: {'SET' if os.getenv('APP_PASSWORD') else 'NOT SET'}")
print("[OK] Environment loaded")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import analyze, report

app = FastAPI(
    title="EcoSpectra API",
    description="AI-Powered Plastic Pollution Detection & Reporting",
    version="1.0.0"
)

# CORS (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(report.router)

print("[OK] Routes initialized")

@app.get("/")
def root():
    return {"message": "Backend running"}