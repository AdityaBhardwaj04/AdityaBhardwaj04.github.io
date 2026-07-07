"""Canonical portfolio snapshot for change detection.

A snapshot captures only meaningful portfolio content — repository facts and
HTB statistics. All Sentinel runtime metadata (timestamps, response times,
sync markers) is excluded so identical provider data always produces identical
JSON output, making byte-for-byte git comparisons reliable.

Versioning
----------
SNAPSHOT_SCHEMA_VERSION guards the on-disk format. When the schema changes,
old cached snapshots are automatically invalidated and a fresh commit is
generated. Bump the version whenever the shape of the snapshot dict changes.

Offline fallback
----------------
If a provider is offline (ok=False) its previous snapshot section is preserved.
A transient network failure therefore never appears as a portfolio change, and
the online provider's changes are still detected normally.
"""

from __future__ import annotations

SNAPSHOT_SCHEMA_VERSION = 1


# ── Public API ────────────────────────────────────────────────────────────────


def build_snapshot(
    github_result: dict,
    htb_result: dict,
    previous_snapshot: dict,
) -> dict:
    """Return a deterministic, content-only snapshot from raw provider results.

    ``previous_snapshot`` must be the raw snapshot dict (not the versioned
    wrapper returned by ``pack_snapshot``). Pass ``{}`` on first run.
    """
    github_snap = (
        _build_github_section(github_result)
        if github_result.get("ok")
        else previous_snapshot.get("github", {})
    )

    htb_snap = (
        _build_htb_section(htb_result)
        if htb_result.get("ok")
        else previous_snapshot.get("htb", {})
    )

    return {"github": github_snap, "htb": htb_snap}


def snapshot_changed(previous_state: dict, current_snapshot: dict) -> bool:
    """Return True if the portfolio content has meaningfully changed.

    Also returns True when:
    - No previous snapshot exists (first run).
    - The stored snapshot schema version differs from the current one, which
      forces a full regeneration after a Sentinel schema upgrade.
    """
    stored = previous_state.get("portfolio_snapshot")
    if not stored:
        return True
    if stored.get("snapshotSchema") != SNAPSHOT_SCHEMA_VERSION:
        return True
    return stored.get("snapshot") != current_snapshot


def pack_snapshot(snapshot: dict) -> dict:
    """Wrap a snapshot dict with its schema version for persistent storage.

    Store the return value as ``state["portfolio_snapshot"]``. Retrieve the
    raw content with ``stored["snapshot"]`` when passing to ``build_snapshot``.
    """
    return {"snapshotSchema": SNAPSHOT_SCHEMA_VERSION, "snapshot": snapshot}


# ── Internal helpers ──────────────────────────────────────────────────────────


def _build_github_section(github_result: dict) -> dict:
    repos = sorted(
        [
            {
                "name": r["name"],
                "pushed_at": r.get("pushed_at") or "",
                "latest_release": r.get("latest_release"),
            }
            for r in github_result.get("repos", [])
        ],
        key=lambda r: r["name"],
    )
    return {
        "repo_count": github_result.get("repo_count", 0),
        "repos": repos,
    }


def _build_htb_section(htb_result: dict) -> dict:
    activity = sorted(
        [
            {
                "id": item["id"],
                "name": item.get("name", ""),
                "object_type": item.get("object_type", ""),
                "flag_type": item.get("type", ""),
                "date": item.get("date", ""),
            }
            for item in htb_result.get("activity", [])
            if item.get("id") is not None
        ],
        key=lambda a: (a["date"], a["id"]),
    )
    return {
        "ranking": htb_result.get("ranking"),
        "rank": htb_result.get("rank", ""),
        "points": htb_result.get("points", 0),
        "user_owns": htb_result.get("user_owns", 0),
        "system_owns": htb_result.get("system_owns", 0),
        "activity": activity,
    }
