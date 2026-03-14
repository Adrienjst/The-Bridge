#!/bin/bash
# start_orchestrator.sh
# Simple startup script for the local LangGraph Mega-Copilot backend

# Ensure we are in the orchestrator directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Source virtual environment if it exists
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo "Warning: Virtual environment not found at venv/bin/activate"
    echo "Please run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

echo "Starting StructLab Orchestrator on http://localhost:8000 ..."
# Run uvicorn server with hot reload
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
