from __future__ import annotations

import logging

from sentinel.models.activity import (
    EVENT_METADATA,
    EVENT_PRIORITY,
    ActivityEvent,
    make_event_id,
)

logger = logging.getLogger(__name__)


def _build_htb_url(name: str) -> str:
    slug = name.replace(" ", "-")
    return f"https://app.hackthebox.com/machines/{slug}"


def _build_github_url(username: str, repo: str, tag: str | None = None) -> str:
    base = f"https://github.com/{username}/{repo}"
    return f"{base}/releases/tag/{tag}" if tag else base


def generate_events(
    changes: list[dict],
    existing: list[ActivityEvent],
    github_username: str,
    htb_user_id: str,
    max_events: int,
) -> list[ActivityEvent]:
    """Map change dicts → ActivityEvents, merge with existing, deduplicate, and
    return the top max_events sorted by (priority DESC, date DESC)."""

    new_events: list[ActivityEvent] = []

    for change in changes:
        kind = change.get("kind", "")
        meta = EVENT_METADATA.get(kind, {"icon": "terminal", "source": ""})
        priority = EVENT_PRIORITY.get(kind, 50)

        if kind == "htb_solve":
            name = change.get("name", "Unknown")
            obj = change.get("object_type", "machine")
            flag = change.get("flag_type", "user")

            if obj == "machine":
                flag_label = "Root Own" if flag == "root" else "User Own"
                title = f"{flag_label} — {name}"
            else:
                title = f"Completed HTB Challenge: {name}"

            event = ActivityEvent(
                id=make_event_id(change["date"], "htb", title),
                date=change["date"],
                type="htb",
                title=title,
                priority=priority,
                source=meta["source"],
                icon=meta["icon"],
                url=_build_htb_url(name),
            )
            new_events.append(event)

        elif kind == "htb_rank_improved":
            title = f"HTB Rank: {change.get('rank', '')}"
            event = ActivityEvent(
                id=make_event_id(change["date"], "htb", title),
                date=change["date"],
                type="htb",
                title=title,
                priority=priority,
                source=meta["source"],
                icon=meta["icon"],
                url=f"https://app.hackthebox.com/profile/{htb_user_id}",
            )
            new_events.append(event)

        elif kind == "github_repo":
            repo = change.get("name", "")
            title = f"New repo: {repo}"
            event = ActivityEvent(
                id=make_event_id(change["date"], "github", title),
                date=change["date"],
                type="github",
                title=title,
                priority=priority,
                source=meta["source"],
                icon=meta["icon"],
                url=_build_github_url(github_username, repo),
            )
            new_events.append(event)

        elif kind == "github_release":
            repo = change.get("name", "")
            tag = change.get("tag", "")
            title = f"Released {repo} {tag}"
            event = ActivityEvent(
                id=make_event_id(change["date"], "github", title),
                date=change["date"],
                type="github",
                title=title,
                priority=priority,
                source=meta["source"],
                icon=meta["icon"],
                url=_build_github_url(github_username, repo, tag),
            )
            new_events.append(event)

        elif kind == "github_push":
            repo = change.get("name", "")
            title = f"Pushed: {repo}"
            event = ActivityEvent(
                id=make_event_id(change["date"], "github", title),
                date=change["date"],
                type="github",
                title=title,
                priority=priority,
                source=meta["source"],
                icon=meta["icon"],
                url=_build_github_url(github_username, repo),
            )
            new_events.append(event)

    # Merge new + existing; deduplicate by key()
    seen: set[tuple] = set()
    merged: list[ActivityEvent] = []
    for event in new_events + existing:
        k = event.key()
        if k not in seen:
            seen.add(k)
            merged.append(event)

    # Sort: priority DESC, then date DESC
    merged.sort(key=lambda e: (e.priority, e.date), reverse=True)
    result = merged[:max_events]

    logger.info(
        "Activity engine: %d new event(s), %d existing → %d final event(s)",
        len(new_events),
        len(existing),
        len(result),
    )
    return result
