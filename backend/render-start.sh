#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -o errexit

# Start Uvicorn
# We bind to 0.0.0.0 and use the $PORT variable provided by Render
python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}