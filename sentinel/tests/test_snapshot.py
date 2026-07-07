"""Unit tests for sentinel.core.snapshot.

Run from the repo root:
    python -m pytest sentinel/tests/ -v
"""

from __future__ import annotations

import sys
from pathlib import Path

# Ensure the repo root is on sys.path so the sentinel package is importable
# when running pytest from any directory.
_REPO_ROOT = Path(__file__).parent.parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

from sentinel.core.snapshot import (
    SNAPSHOT_SCHEMA_VERSION,
    build_snapshot,
    pack_snapshot,
    snapshot_changed,
)

# ── Test fixtures ─────────────────────────────────────────────────────────────
# Raw provider results as they come out of the provider classes.
# HTB activity uses "type" (the API field name); build_snapshot maps it to
# "flag_type" in the snapshot.

_GITHUB_ONLINE: dict = {
    "ok": True,
    "repo_count": 2,
    "repos": [
        {"name": "repo-b", "pushed_at": "2026-07-01T00:00:00Z", "latest_release": None},
        {"name": "repo-a", "pushed_at": "2026-06-01T00:00:00Z", "latest_release": "v1.0"},
    ],
}

_HTB_ONLINE: dict = {
    "ok": True,
    "ranking": 500,
    "rank": "Hacker",
    "points": 100,
    "user_owns": 3,
    "system_owns": 1,
    "activity": [
        {"id": 201, "name": "Machine-B", "object_type": "machine", "type": "root",
         "date": "2026-07-01T00:00:00Z"},
        {"id": 200, "name": "Machine-A", "object_type": "machine", "type": "user",
         "date": "2026-06-01T00:00:00Z"},
    ],
}

_GITHUB_OFFLINE: dict = {
    "ok": False, "repo_count": 0, "repos": [], "response_ms": 0,
}

_HTB_OFFLINE: dict = {
    "ok": False, "rank": "", "ranking": None, "points": 0,
    "user_owns": 0, "system_owns": 0, "activity": [], "response_ms": 0,
}


def _make_state(snapshot: dict) -> dict:
    """Wrap a snapshot in the format persisted to previous_state.json."""
    return {"portfolio_snapshot": pack_snapshot(snapshot)}


# ── First run ─────────────────────────────────────────────────────────────────


def test_first_run_empty_state_is_always_changed():
    snap = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    assert snapshot_changed({}, snap)


def test_first_run_missing_snapshot_key_is_always_changed():
    snap = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    assert snapshot_changed({"other_key": "value"}, snap)


# ── No changes ────────────────────────────────────────────────────────────────


def test_identical_provider_data_is_unchanged():
    snap = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    assert not snapshot_changed(_make_state(snap), snap)


def test_second_call_with_same_data_is_unchanged():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    assert snap1 == snap2
    assert not snapshot_changed(_make_state(snap1), snap2)


# ── GitHub-only changes ───────────────────────────────────────────────────────


def test_new_github_repo_detected():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    github_with_new_repo = {
        **_GITHUB_ONLINE,
        "repo_count": 3,
        "repos": _GITHUB_ONLINE["repos"] + [
            {"name": "repo-c", "pushed_at": "2026-07-05T00:00:00Z", "latest_release": None}
        ],
    }
    snap2 = build_snapshot(github_with_new_repo, _HTB_ONLINE, snap1)
    assert snapshot_changed(_make_state(snap1), snap2)


def test_github_repo_count_change_detected():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot({**_GITHUB_ONLINE, "repo_count": 99}, _HTB_ONLINE, snap1)
    assert snapshot_changed(_make_state(snap1), snap2)


def test_github_new_release_detected():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    repos_updated = [
        {"name": "repo-b", "pushed_at": "2026-07-01T00:00:00Z", "latest_release": "v2.0"},
        {"name": "repo-a", "pushed_at": "2026-06-01T00:00:00Z", "latest_release": "v1.0"},
    ]
    snap2 = build_snapshot({**_GITHUB_ONLINE, "repos": repos_updated}, _HTB_ONLINE, snap1)
    assert snapshot_changed(_make_state(snap1), snap2)


# ── HTB-only changes ──────────────────────────────────────────────────────────


def test_htb_rank_change_detected():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot(_GITHUB_ONLINE, {**_HTB_ONLINE, "rank": "Pro Hacker"}, snap1)
    assert snapshot_changed(_make_state(snap1), snap2)


def test_htb_ranking_change_detected():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot(_GITHUB_ONLINE, {**_HTB_ONLINE, "ranking": 100}, snap1)
    assert snapshot_changed(_make_state(snap1), snap2)


def test_htb_new_machine_solve_detected():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    htb_new_solve = {
        **_HTB_ONLINE,
        "user_owns": 4,
        "activity": _HTB_ONLINE["activity"] + [
            {"id": 202, "name": "Machine-C", "object_type": "machine", "type": "user",
             "date": "2026-07-05T00:00:00Z"},
        ],
    }
    snap2 = build_snapshot(_GITHUB_ONLINE, htb_new_solve, snap1)
    assert snapshot_changed(_make_state(snap1), snap2)


# ── Offline fallback ──────────────────────────────────────────────────────────


def test_github_offline_preserves_previous_github_section():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot(_GITHUB_OFFLINE, _HTB_ONLINE, snap1)
    assert snap2["github"] == snap1["github"]


def test_htb_offline_preserves_previous_htb_section():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot(_GITHUB_ONLINE, _HTB_OFFLINE, snap1)
    assert snap2["htb"] == snap1["htb"]


def test_github_offline_htb_change_still_detected():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot(_GITHUB_OFFLINE, {**_HTB_ONLINE, "rank": "Elite"}, snap1)
    assert snapshot_changed(_make_state(snap1), snap2)
    assert snap2["github"] == snap1["github"]


def test_htb_offline_github_change_still_detected():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    github_changed = {**_GITHUB_ONLINE, "repo_count": 10}
    snap2 = build_snapshot(github_changed, _HTB_OFFLINE, snap1)
    assert snapshot_changed(_make_state(snap1), snap2)
    assert snap2["htb"] == snap1["htb"]


def test_both_offline_snapshot_unchanged():
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot(_GITHUB_OFFLINE, _HTB_OFFLINE, snap1)
    assert snap1 == snap2
    assert not snapshot_changed(_make_state(snap1), snap2)


# ── Snapshot schema versioning ────────────────────────────────────────────────


def test_schema_version_mismatch_forces_regeneration():
    snap = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    stale_state = {
        "portfolio_snapshot": {
            "snapshotSchema": SNAPSHOT_SCHEMA_VERSION + 1,
            "snapshot": snap,
        }
    }
    assert snapshot_changed(stale_state, snap)


def test_matching_schema_version_with_same_data_is_unchanged():
    snap = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    state = {
        "portfolio_snapshot": {
            "snapshotSchema": SNAPSHOT_SCHEMA_VERSION,
            "snapshot": snap,
        }
    }
    assert not snapshot_changed(state, snap)


def test_pack_snapshot_embeds_schema_version():
    snap = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    packed = pack_snapshot(snap)
    assert packed["snapshotSchema"] == SNAPSHOT_SCHEMA_VERSION
    assert packed["snapshot"] == snap


# ── Deterministic ordering ────────────────────────────────────────────────────


def test_github_repos_sorted_alphabetically_regardless_of_input_order():
    reversed_repos = {**_GITHUB_ONLINE, "repos": list(reversed(_GITHUB_ONLINE["repos"]))}
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot(reversed_repos, _HTB_ONLINE, {})
    assert snap1 == snap2
    assert [r["name"] for r in snap1["github"]["repos"]] == ["repo-a", "repo-b"]


def test_htb_activity_sorted_by_date_then_id_regardless_of_input_order():
    reversed_activity = {**_HTB_ONLINE, "activity": list(reversed(_HTB_ONLINE["activity"]))}
    snap1 = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    snap2 = build_snapshot(_GITHUB_ONLINE, reversed_activity, {})
    assert snap1 == snap2
    ids = [a["id"] for a in snap1["htb"]["activity"]]
    assert ids == [200, 201]


def test_flag_type_mapped_from_htb_type_field():
    snap = build_snapshot(_GITHUB_ONLINE, _HTB_ONLINE, {})
    activity = {a["id"]: a for a in snap["htb"]["activity"]}
    assert activity[200]["flag_type"] == "user"
    assert activity[201]["flag_type"] == "root"
