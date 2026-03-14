import re
import html
import logging

logger = logging.getLogger(__name__)

# Common injection phrases or system prompt reveals
INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"you are now",
    r"jailbreak",
    r"system prompt",
    r"<\|.*\|>",
    r"forget your",
    r"act as",
    r"who are you really",
    r"what are your instructions"
]

class SecurityException(Exception):
    pass

def sanitize_user_input(text: str, max_chars: int = 4000) -> str:
    """
    Sanitizes user input to prevent basic Prompt Injection and XSS before passing to LangGraph.
    Throws SecurityException if malicious intent is detected.
    """
    if not text:
        return ""
        
    # 1. Truncate extreme length (Basic DOS prevention context-window stuffing)
    if len(text) > max_chars:
        logger.warning(f"Input truncated from {len(text)} to {max_chars} chars.")
        text = text[:max_chars]

    # 2. Heuristic Pattern Matching
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            logger.error(f"Prompt injection detected for pattern: {pattern}")
            raise SecurityException("PROMPT_INJECTION_DETECTED")
            
    # 3. HTML Escaping for downstream client safety
    return html.escape(text)
