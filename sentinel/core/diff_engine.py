from __future__ import annotations

import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


def _today_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def diff(previous: dict, current: dict) -> list[dict]:
    """Compare two state snapshots and return a list of change dicts.

    Each change dict has at minimum: source, kind, date.
    Extra fields depend on the kind (name, tag, etc.).
    """
    changes: list[dict] = []
    is_bootstrap = not previous  # first run with no prior state

    # ── GitHub ────────────────────────────────────────────────────────────────
    prev_github = previous.get("github", {})
    curr_github = current.get("github", {})

    if curr_github.get("ok", True):
        prev_names: set[str] = {r["name"] for r in prev_github.get("repos", [])}
        prev_pushed: dict[str, str] = {r["name"]: r["pushed_at"] for r in prev_github.get("repos", [])}
        prev_releases: dict[str, str | None] = {
            r["name"]: r.get("latest_release") for r in prev_github.get("repos", [])
        }

        for repo in curr_github.get("repos", []):
            name = repo["name"]
            date = (repo.get("created_at") or _today_utc())[:10]
            push_date = (repo.get("pushed_at") or _today_utc())[:10]
            release_tag = repo.get("latest_release")

            # New repository
            if not is_bootstrap and name not in prev_names:
                logger.debug("Change: new repo %s", name)
                changes.append({"source": "github", "kind": "github_repo", "name": name, "date": date})

            # New release/tag
            if release_tag and release_tag != prev_releases.get(name):
                if not is_bootstrap or release_tag:
                    logger.debug("Change: new release %s @ %s", name, release_tag)
                    changes.append({
                        "source": "github",
                        "kind": "github_release",
                        "name": name,
                        "tag": release_tag,
                        "date": push_date,
                    })

            # Recent push (pushed_at changed, non-bootstrap)
            if not is_bootstrap and name in prev_pushed and repo.get("pushed_at") != prev_pushed[name]:
                logger.debug("Change: push on %s", name)
                changes.append({"source": "github", "kind": "github_push", "name": name, "date": push_date})

    # ── Hack The Box ──────────────────────────────────────────────────────────
    prev_htb = previous.get("htb", {})
    curr_htb = current.get("htb", {})

    if curr_htb.get("ok", True):
        prev_activity_ids: set[int] = set(prev_htb.get("recent_activity_ids", []))
        prev_last_ts: str = prev_htb.get("last_activity_timestamp", "")

        for item in curr_htb.get("activity", []):
            item_id = item.get("id")
            item_date = (item.get("date") or _today_utc())[:10]
            item_ts = item.get("date") or ""

            # Bootstrap: seed from the full activity feed
            if is_bootstrap:
                logger.debug("Bootstrap: adding HTB activity id=%s", item_id)
                changes.append({
                    "source": "htb",
                    "kind": "htb_solve",
                    "object_type": item.get("object_type", "machine"),
                    "flag_type": item.get("type", "user"),
                    "name": item.get("name", ""),
                    "date": item_date,
                    "item_id": item_id,
                })
                continue

            # Normal run: detect new activity by ID and timestamp
            is_new_id = item_id and item_id not in prev_activity_ids
            is_new_ts = item_ts and item_ts > prev_last_ts if prev_last_ts else False
            if is_new_id or is_new_ts:
                logger.debug("Change: new HTB activity id=%s name=%s", item_id, item.get("name"))
                changes.append({
                    "source": "htb",
                    "kind": "htb_solve",
                    "object_type": item.get("object_type", "machine"),
                    "flag_type": item.get("type", "user"),
                    "name": item.get("name", ""),
                    "date": item_date,
                    "item_id": item_id,
                })

        # Rank improvement (lower ranking number = better)
        prev_ranking = prev_htb.get("ranking")
        curr_ranking = curr_htb.get("ranking")
        if not is_bootstrap and prev_ranking and curr_ranking and curr_ranking < prev_ranking:
            logger.debug("Change: HTB rank improved %s → %s", prev_ranking, curr_ranking)
            changes.append({
                "source": "htb",
                "kind": "htb_rank_improved",
                "rank": curr_htb.get("rank", ""),
                "date": _today_utc(),
            })

    logger.info("Diff complete: %d change(s) detected", len(changes))
    return changes
