"""BLACKBOX Sentinel — entry point.

Orchestrates the full pipeline:
  load state → fetch providers → diff → generate events → build outputs → write JSON → save state
"""

from __future__ import annotations

import json
import logging
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

# Ensure repo root is on the path when run directly
_REPO_ROOT = Path(__file__).parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

from sentinel.config import Config
from sentinel.core.activity_engine import generate_events
from sentinel.core.diff_engine import diff
from sentinel.core.state_manager import StateManager
from sentinel.models.activity import ActivityEvent
from sentinel.models.status import ProviderStatus, SentinelStatus
from sentinel.models.telemetry import GitHubTelemetry, HTBTelemetry, Telemetry
from sentinel.output.writer import Writer
from sentinel.providers.github_provider import GitHubProvider
from sentinel.providers.htb_provider import HTBProvider

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("sentinel")


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _load_existing_activity(output_dir: Path) -> list[ActivityEvent]:
    path = output_dir / "activity.json"
    if not path.exists():
        return []
    try:
        envelope = json.loads(path.read_text(encoding="utf-8"))
        raw_list = envelope.get("data", envelope) if isinstance(envelope, dict) else envelope
        return [ActivityEvent.from_dict(e) for e in raw_list if isinstance(e, dict)]
    except Exception as exc:
        logger.warning("Could not load existing activity.json: %s", exc)
        return []


def _load_existing_telemetry(output_dir: Path) -> dict | None:
    path = output_dir / "telemetry.json"
    if not path.exists():
        return None
    try:
        envelope = json.loads(path.read_text(encoding="utf-8"))
        return envelope.get("data", envelope) if isinstance(envelope, dict) else None
    except Exception as exc:
        logger.warning("Could not load existing telemetry.json: %s", exc)
        return None


def _build_github_telemetry(github_result: dict, prev_telem: dict | None) -> GitHubTelemetry:
    if not github_result.get("ok") and prev_telem:
        # Preserve last good values
        pg = prev_telem.get("github", {})
        return GitHubTelemetry(
            repositories=pg.get("repositories", 0),
            latestRepository=pg.get("latestRepository", ""),
            lastCommit=pg.get("lastCommit", ""),
        )
    repos = github_result.get("repos", [])
    latest = repos[0] if repos else {}
    return GitHubTelemetry(
        repositories=github_result.get("repo_count", 0),
        latestRepository=latest.get("name", ""),
        lastCommit=latest.get("pushed_at") or "",
    )


def _build_htb_telemetry(htb_result: dict, prev_telem: dict | None) -> HTBTelemetry:
    if not htb_result.get("ok") and prev_telem:
        ph = prev_telem.get("htb", {})
        return HTBTelemetry(
            machinesSolved=ph.get("machinesSolved", 0),
            rank=ph.get("rank", ""),
            globalRanking=ph.get("globalRanking"),
        )
    return HTBTelemetry(
        machinesSolved=htb_result.get("user_owns", 0),
        rank=htb_result.get("rank", ""),
        globalRanking=htb_result.get("ranking"),
    )


def _build_provider_status(
    provider_id: str,
    name: str,
    category: str,
    result: dict,
    prev_sync_times: dict,
) -> ProviderStatus:
    now = _now_iso()
    ok = result.get("ok", False)
    ms = result.get("response_ms", 0)
    response_time = f"{ms / 1000:.2f}s" if ms else None

    last_good = prev_sync_times.get(provider_id) if not ok else now

    return ProviderStatus(
        id=provider_id,
        name=name,
        category=category,
        status="ONLINE" if ok else "OFFLINE",
        lastSuccessfulSync=now if ok else prev_sync_times.get(provider_id),
        lastAttempt=now,
        responseTime=response_time if ok else None,
        error=result.get("error"),
    )


def _build_current_state(
    github_result: dict,
    htb_result: dict,
    prev_sync_times: dict,
) -> dict:
    now = _now_iso()
    activity = htb_result.get("activity", [])
    activity_ids = [item["id"] for item in activity if item.get("id")]
    last_ts = max((item.get("date", "") for item in activity), default="") if activity else ""

    new_sync_times = dict(prev_sync_times)
    if github_result.get("ok"):
        new_sync_times["github"] = now
    if htb_result.get("ok"):
        new_sync_times["htb"] = now

    return {
        "timestamp": now,
        "github": {
            "repo_count": github_result.get("repo_count", 0),
            "repos": github_result.get("repos", []),
            "ok": github_result.get("ok", False),
        },
        "htb": {
            "ranking": htb_result.get("ranking"),
            "rank": htb_result.get("rank", ""),
            "points": htb_result.get("points", 0),
            "user_owns": htb_result.get("user_owns", 0),
            "system_owns": htb_result.get("system_owns", 0),
            "activity": activity,
            "recent_activity_ids": activity_ids,
            "last_activity_timestamp": last_ts,
            "ok": htb_result.get("ok", False),
        },
        "provider_sync_times": new_sync_times,
    }


def main() -> None:
    pipeline_start = time.monotonic()
    cfg = Config()
    logger.info("BLACKBOX Sentinel v%s starting", cfg.VERSION)

    state_mgr = StateManager(cfg.STATE_FILE)
    previous_state = state_mgr.load()
    prev_sync_times: dict = previous_state.get("provider_sync_times", {})

    existing_events = _load_existing_activity(cfg.OUTPUT_DIR)
    prev_telem = _load_existing_telemetry(cfg.OUTPUT_DIR)

    # ── Providers (independent — one failure does not stop the other) ─────────
    github_provider = GitHubProvider(
        username=cfg.GITHUB_USERNAME,
        token=cfg.GITHUB_TOKEN,
        max_release_checks=cfg.MAX_RELEASE_CHECKS,
        timeout=cfg.REQUEST_TIMEOUT,
    )
    htb_provider = HTBProvider(
        user_id=cfg.HTB_USER_ID,
        api_token=cfg.HTB_API_TOKEN,
        timeout=cfg.REQUEST_TIMEOUT,
    )

    github_result: dict = {}
    htb_result: dict = {}

    try:
        github_result = github_provider.fetch()
    except Exception as exc:
        logger.error("GitHub provider raised unexpectedly: %s", exc)
        github_result = {"ok": False, "error": str(exc), "repo_count": 0, "repos": [], "response_ms": 0}

    try:
        htb_result = htb_provider.fetch()
    except Exception as exc:
        logger.error("HTB provider raised unexpectedly: %s", exc)
        htb_result = {"ok": False, "error": str(exc), "rank": "", "ranking": None,
                      "points": 0, "user_owns": 0, "system_owns": 0, "activity": [], "response_ms": 0}

    # ── Diff & events ─────────────────────────────────────────────────────────
    current_state = _build_current_state(github_result, htb_result, prev_sync_times)
    changes = diff(previous_state, current_state)
    events = generate_events(
        changes=changes,
        existing=existing_events,
        github_username=cfg.GITHUB_USERNAME,
        htb_user_id=cfg.HTB_USER_ID,
        max_events=cfg.MAX_ACTIVITY_EVENTS,
    )

    # ── Telemetry ─────────────────────────────────────────────────────────────
    gh_telem = _build_github_telemetry(github_result, prev_telem)
    htb_telem = _build_htb_telemetry(htb_result, prev_telem)
    telemetry = Telemetry(
        github=gh_telem,
        htb=htb_telem,
        lastUpdated=_now_iso(),
    )

    # ── Status ────────────────────────────────────────────────────────────────
    runtime_s = time.monotonic() - pipeline_start
    runtime_str = f"{runtime_s:.2f} seconds"

    gh_status = _build_provider_status("github", "GitHub", "development", github_result, prev_sync_times)
    htb_status = _build_provider_status("htb", "Hack The Box", "training", htb_result, prev_sync_times)

    all_ok = github_result.get("ok") and htb_result.get("ok")
    any_ok = github_result.get("ok") or htb_result.get("ok")
    overall = "ONLINE" if all_ok else ("DEGRADED" if any_ok else "OFFLINE")

    sentinel_status = SentinelStatus(
        status=overall,
        automation=cfg.AUTOMATION,
        lastSync=_now_iso(),
        runtime=runtime_str,
        version=cfg.VERSION,
        providers=[gh_status, htb_status],
    )

    # ── Write ─────────────────────────────────────────────────────────────────
    writer = Writer(output_dir=cfg.OUTPUT_DIR, schema_version=cfg.SCHEMA_VERSION)
    writer.write_all(events, sentinel_status, telemetry)

    # ── Persist state ─────────────────────────────────────────────────────────
    state_mgr.save(current_state)

    logger.info(
        "Sentinel complete — status=%s providers=[GitHub:%s HTB:%s] events=%d runtime=%s",
        overall,
        gh_status.status,
        htb_status.status,
        len(events),
        runtime_str,
    )


if __name__ == "__main__":
    main()
