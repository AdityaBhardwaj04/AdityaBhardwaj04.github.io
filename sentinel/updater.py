"""BLACKBOX Sentinel — entry point.

Pipeline (every 6 hours):
  load state → fetch providers → build snapshot → compare snapshot
    → UNCHANGED: log summary, persist state, exit (no file writes, no commit)
    →   CHANGED: generate events, build JSON, write files, persist state

``generatedAt`` in public JSON represents when the portfolio last changed, not
when Sentinel last ran. Files are byte-identical between runs when the portfolio
has not changed, so git produces no diff and no commit is triggered.
"""

from __future__ import annotations

import json
import logging
import sys
import time
from pathlib import Path

_REPO_ROOT = Path(__file__).parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

from sentinel.config import Config
from sentinel.core.activity_engine import generate_events
from sentinel.core.diff_engine import diff
from sentinel.core.snapshot import build_snapshot, pack_snapshot, snapshot_changed
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


# ── Helpers ───────────────────────────────────────────────────────────────────


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
) -> ProviderStatus:
    return ProviderStatus(
        id=provider_id,
        name=name,
        category=category,
        status="ONLINE" if result.get("ok", False) else "OFFLINE",
        error=result.get("error"),
    )


def _build_current_state(
    github_result: dict,
    htb_result: dict,
    prev_sync_times: dict,
    previous_state: dict,
) -> dict:
    # When a provider is offline, preserve its previous state so the diff engine
    # has correct reference data on the recovery run. Mirrors snapshot.py's offline
    # fallback: a transient outage must never corrupt the change-detection baseline.
    if github_result.get("ok"):
        github_state: dict = {
            "repo_count": github_result.get("repo_count", 0),
            "repos": github_result.get("repos", []),
            "ok": True,
        }
    else:
        prev_gh = previous_state.get("github", {})
        github_state = {
            "repo_count": prev_gh.get("repo_count", 0),
            "repos": prev_gh.get("repos", []),
            "ok": False,
        }

    if htb_result.get("ok"):
        activity = htb_result.get("activity", [])
        activity_ids = [item["id"] for item in activity if item.get("id") is not None]
        last_ts = max((item.get("date", "") for item in activity), default="") if activity else ""
        htb_state: dict = {
            "ranking": htb_result.get("ranking"),
            "rank": htb_result.get("rank", ""),
            "points": htb_result.get("points", 0),
            "user_owns": htb_result.get("user_owns", 0),
            "system_owns": htb_result.get("system_owns", 0),
            "activity": activity,
            "recent_activity_ids": activity_ids,
            "last_activity_timestamp": last_ts,
            "ok": True,
        }
    else:
        prev_htb = previous_state.get("htb", {})
        htb_state = {
            "ranking": prev_htb.get("ranking"),
            "rank": prev_htb.get("rank", ""),
            "points": prev_htb.get("points", 0),
            "user_owns": prev_htb.get("user_owns", 0),
            "system_owns": prev_htb.get("system_owns", 0),
            "activity": prev_htb.get("activity", []),
            "recent_activity_ids": prev_htb.get("recent_activity_ids", []),
            "last_activity_timestamp": prev_htb.get("last_activity_timestamp", ""),
            "ok": False,
        }

    new_sync_times = dict(prev_sync_times)
    if github_result.get("ok"):
        new_sync_times["github"] = True
    if htb_result.get("ok"):
        new_sync_times["htb"] = True

    return {
        "github": github_state,
        "htb": htb_state,
        "provider_sync_times": new_sync_times,
    }


def _log_summary(
    runtime_s: float,
    github_result: dict,
    htb_result: dict,
    changed: bool,
    files_written: bool,
) -> None:
    def _status(result: dict) -> str:
        return "ONLINE" if result.get("ok") else "OFFLINE"

    def _ms(result: dict) -> str:
        ms = result.get("response_ms", 0)
        return f"{ms / 1000:.2f}s" if ms else "n/a"

    separator = "─" * 51
    lines = [
        separator,
        "  Sentinel complete",
        f"  Runtime:          {runtime_s:.2f}s",
        f"  GitHub:           {_status(github_result)} ({_ms(github_result)})",
        f"  HTB:              {_status(htb_result)} ({_ms(htb_result)})",
        f"  Snapshot changed: {'YES' if changed else 'NO'}",
        f"  Files written:    {'YES' if files_written else 'NO'}",
        f"  Commit required:  {'YES' if files_written else 'NO'}",
        separator,
    ]
    for line in lines:
        logger.info(line)


# ── Main pipeline ─────────────────────────────────────────────────────────────


def main() -> None:
    pipeline_start = time.monotonic()
    cfg = Config()
    logger.info("BLACKBOX Sentinel v%s starting", cfg.VERSION)

    state_mgr = StateManager(cfg.STATE_FILE)
    previous_state = state_mgr.load()
    prev_sync_times: dict = previous_state.get("provider_sync_times", {})

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
        github_result = {
            "ok": False, "error": str(exc),
            "repo_count": 0, "repos": [], "response_ms": 0,
        }

    try:
        htb_result = htb_provider.fetch()
    except Exception as exc:
        logger.error("HTB provider raised unexpectedly: %s", exc)
        htb_result = {
            "ok": False, "error": str(exc),
            "rank": "", "ranking": None, "points": 0,
            "user_owns": 0, "system_owns": 0, "activity": [], "response_ms": 0,
        }

    # ── Snapshot comparison ───────────────────────────────────────────────────
    # Extract the raw content from the versioned stored snapshot.
    stored_snapshot = previous_state.get("portfolio_snapshot", {})
    previous_snapshot_content = (
        stored_snapshot.get("snapshot", {})
        if isinstance(stored_snapshot, dict)
        else {}
    )
    current_snapshot = build_snapshot(github_result, htb_result, previous_snapshot_content)
    changed = snapshot_changed(previous_state, current_snapshot)

    current_state = _build_current_state(github_result, htb_result, prev_sync_times, previous_state)

    if not changed:
        logger.info("Snapshot unchanged — skipping JSON generation.")
        state_mgr.save({**current_state, "portfolio_snapshot": pack_snapshot(current_snapshot)})
        _log_summary(time.monotonic() - pipeline_start, github_result, htb_result,
                     changed=False, files_written=False)
        return

    logger.info("Snapshot changed — generating portfolio JSON.")

    # ── Diff & events ─────────────────────────────────────────────────────────
    existing_events = _load_existing_activity(cfg.OUTPUT_DIR)
    changes = diff(previous_state, current_state)
    events = generate_events(
        changes=changes,
        existing=existing_events,
        github_username=cfg.GITHUB_USERNAME,
        htb_user_id=cfg.HTB_USER_ID,
        max_events=cfg.MAX_ACTIVITY_EVENTS,
    )

    # ── Telemetry ─────────────────────────────────────────────────────────────
    prev_telem = _load_existing_telemetry(cfg.OUTPUT_DIR)
    telemetry = Telemetry(
        github=_build_github_telemetry(github_result, prev_telem),
        htb=_build_htb_telemetry(htb_result, prev_telem),
    )

    # ── Status ────────────────────────────────────────────────────────────────
    gh_status = _build_provider_status("github", "GitHub", "development", github_result)
    htb_status = _build_provider_status("htb", "Hack The Box", "training", htb_result)

    all_ok = github_result.get("ok") and htb_result.get("ok")
    any_ok = github_result.get("ok") or htb_result.get("ok")
    overall = "ONLINE" if all_ok else ("DEGRADED" if any_ok else "OFFLINE")

    sentinel_status = SentinelStatus(
        status=overall,
        automation=cfg.AUTOMATION,
        version=cfg.VERSION,
        providers=[gh_status, htb_status],
    )

    # ── Write ─────────────────────────────────────────────────────────────────
    writer = Writer(output_dir=cfg.OUTPUT_DIR, schema_version=cfg.SCHEMA_VERSION)
    writer.write_all(events, sentinel_status, telemetry)

    # ── Persist state ─────────────────────────────────────────────────────────
    state_mgr.save({**current_state, "portfolio_snapshot": pack_snapshot(current_snapshot)})

    _log_summary(time.monotonic() - pipeline_start, github_result, htb_result,
                 changed=True, files_written=True)


if __name__ == "__main__":
    main()
