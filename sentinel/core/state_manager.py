from __future__ import annotations

import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class StateManager:
    """Loads and saves the runtime state snapshot used for change detection.

    Uses atomic writes (temp file + rename) to avoid corrupt state on crash.
    Returns {} on first run or when the file is missing/malformed.
    """

    def __init__(self, state_file: Path):
        self.state_file = state_file

    def load(self) -> dict:
        if not self.state_file.exists():
            logger.info("No previous state found — treating this as a bootstrap run.")
            return {}
        try:
            data = json.loads(self.state_file.read_text(encoding="utf-8"))
            logger.info("Loaded previous state from %s", self.state_file)
            return data if isinstance(data, dict) else {}
        except Exception as exc:
            logger.warning("Could not parse previous state (%s) — starting fresh.", exc)
            return {}

    def save(self, state: dict) -> None:
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.state_file.with_suffix(".tmp")
        try:
            tmp.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
            tmp.replace(self.state_file)
            logger.info("State saved to %s", self.state_file)
        except Exception as exc:
            logger.error("Failed to save state: %s", exc)
            if tmp.exists():
                tmp.unlink(missing_ok=True)
            raise
