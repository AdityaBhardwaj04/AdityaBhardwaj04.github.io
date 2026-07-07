import json
import os
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent


def _read_version() -> str:
    try:
        pkg = json.loads((REPO_ROOT / "package.json").read_text(encoding="utf-8"))
        return pkg.get("version", "1.0.0")
    except Exception:
        return "1.0.0"


class Config:
    # Identities — override via env vars in CI; defaults centralised here
    GITHUB_USERNAME: str = os.environ.get("SENTINEL_GITHUB_USERNAME", "AdityaBhardwaj04")
    HTB_USER_ID: str = os.environ.get("SENTINEL_HTB_USER_ID", "3113017")

    # Optional auth tokens
    GITHUB_TOKEN: str | None = os.environ.get("GITHUB_TOKEN")
    HTB_API_TOKEN: str | None = os.environ.get("HTB_API_TOKEN")

    # Paths
    STATE_FILE: Path = REPO_ROOT / "sentinel" / "data" / "previous_state.json"
    OUTPUT_DIR: Path = REPO_ROOT / "public" / "data"

    # Sentinel metadata
    VERSION: str = _read_version()
    SCHEMA_VERSION: int = 1
    AUTOMATION: str = "GitHub Actions"
    MAX_ACTIVITY_EVENTS: int = 5
    REQUEST_TIMEOUT: int = 15
    MAX_RELEASE_CHECKS: int = 5
