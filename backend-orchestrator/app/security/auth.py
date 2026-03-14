from typing import Optional

import jwt
from fastapi import HTTPException, Request, status
from supabase import Client, create_client

from app.config import (
    ENVIRONMENT,
    SUPABASE_JWT_SECRET,
    SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_URL,
)

# Only enforce strict presence of secrets in production
if ENVIRONMENT != "development" and not (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and SUPABASE_JWT_SECRET):
    raise RuntimeError(
        "Supabase security configuration is missing (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET)."
    )

# Lazy client initialization to avoid crashes in local dev without keys
_supabase_client: Optional[Client] = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    _supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def _extract_bearer_token(request: Request) -> Optional[str]:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        if ENVIRONMENT == "development":
            return None
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization token.")
    return auth_header.split(" ", 1)[1]


def verify_supabase_jwt(request: Request) -> Optional[dict]:
    """
    Dependency that validates the incoming Supabase user token.
    Bypasses validation in development if no token is provided.
    """
    token = _extract_bearer_token(request)
    
    if ENVIRONMENT == "development" and not token:
        # Provide a mock user for local testing
        mock_user = {"id": "local-dev-user", "email": "dev@structlab.local"}
        request.state.supabase_user = mock_user
        return mock_user

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization token.")

    try:
        if not SUPABASE_JWT_SECRET:
            raise ValueError("SUPABASE_JWT_SECRET is missing")
        jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    except (jwt.PyJWTError, ValueError) as exc:
        if ENVIRONMENT == "development":
             mock_user = {"id": "local-dev-user", "email": "dev@structlab.local"}
             request.state.supabase_user = mock_user
             return mock_user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Supabase token.") from exc

    if not _supabase_client:
         if ENVIRONMENT == "development":
             mock_user = {"id": "local-dev-user", "email": "dev@structlab.local"}
             request.state.supabase_user = mock_user
             return mock_user
         raise HTTPException(status_code=500, detail="Supabase client not initialized.")

    user_response = _supabase_client.auth.get_user(token)
    user = getattr(user_response, "user", None)
    if not user:
        if ENVIRONMENT == "development":
             mock_user = {"id": "local-dev-user", "email": "dev@structlab.local"}
             request.state.supabase_user = mock_user
             return mock_user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User session could not be validated.")

    request.state.supabase_user = user
    return user
