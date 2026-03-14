import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Orchestrator
ORCHESTRATOR_SECRET = os.getenv("ORCHESTRATOR_SECRET", "dev_secret_key_123")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
FRONTEND_IP_ALLOWLIST = [
    ip.strip()
    for ip in os.getenv("FRONTEND_IP_ALLOWLIST", "127.0.0.1,::1").split(",")
    if ip.strip()
]

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_AI_API_KEY")

# Optional keys for next phases
LANGSMITH_API_KEY = os.getenv("LANGSMITH_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
FRED_API_KEY = os.getenv("FRED_API_KEY")
