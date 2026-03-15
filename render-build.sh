#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -o errexit

# Update pip and install all dependencies
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Create the data/reports directory just in case it's missing
mkdir -p data/reports

echo "Build process completed successfully!"