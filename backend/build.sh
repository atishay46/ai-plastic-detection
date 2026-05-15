#!/usr/bin/env bash
# Build script for Render deployment
# Handles the opencv-python → opencv-python-headless swap

set -e

echo ">>> Upgrading pip..."
pip install --upgrade pip setuptools wheel

echo ">>> Installing requirements..."
pip install -r requirements.txt

echo ">>> Replacing opencv-python with headless variant..."
pip uninstall -y opencv-python 2>/dev/null || true
pip install opencv-python-headless>=4.8.1.78,<=4.10.0.84

echo ">>> Build complete!"
