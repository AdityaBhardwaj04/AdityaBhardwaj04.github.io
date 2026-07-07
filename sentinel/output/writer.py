from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from pathlib import Path

from sentinel.models.activity import ActivityEvent
from sentinel.models.status import SentinelStatus
from sentinel.models.telemetry import Telemetry

logger = logging.getLogger(__name__)


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _wrap(schema_version: int, data: object) -> dict:
    """Wrap portfolio data in the schema envelope.

    ``generatedAt`` records when the portfolio last meaningfully changed.
    It is set only when the writer is actually called — which only happens
    when the snapshot comparison detected a change — so it never advances
    on no-op Sentinel runs.
    """
    return {
        "schemaVersion": schema_version,
        "generatedAt": _now_iso(),
        "data": data,
    }


def _write_atomic(path: Path, payload: dict, schema_version: int) -> None:
    """Write JSON atomically: write to .tmp then rename."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    try:
        wrapped = _wrap(schema_version, payload)
        tmp.write_text(
            json.dumps(wrapped, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        tmp.replace(path)
        logger.info("Wrote %s", path.name)
    except Exception as exc:
        logger.error("Failed to write %s: %s", path.name, exc)
        tmp.unlink(missing_ok=True)
        raise


class Writer:
    """Writes the three portfolio JSON files to public/data/.

    Only called when a meaningful portfolio change is detected. Failure
    isolation: if a provider failed, the corresponding telemetry section
    falls back to the previous run's values so the portfolio never shows zeros.
    """

    def __init__(self, output_dir: Path, schema_version: int):
        self.output_dir = output_dir
        self.schema_version = schema_version

    def write_activity(self, events: list[ActivityEvent]) -> None:
        data = [e.to_dict() for e in events]
        _write_atomic(self.output_dir / "activity.json", data, self.schema_version)

    def write_sentinel(self, status: SentinelStatus) -> None:
        _write_atomic(self.output_dir / "sentinel.json", status.to_dict(), self.schema_version)

    def write_telemetry(self, telemetry: Telemetry) -> None:
        _write_atomic(self.output_dir / "telemetry.json", telemetry.to_dict(), self.schema_version)

    def write_all(
        self,
        events: list[ActivityEvent],
        status: SentinelStatus,
        telemetry: Telemetry,
    ) -> None:
        self.write_activity(events)
        self.write_sentinel(status)
        self.write_telemetry(telemetry)
        logger.info("All portfolio JSON files written to %s", self.output_dir)
