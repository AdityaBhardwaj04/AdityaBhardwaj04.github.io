from __future__ import annotations

import re
from dataclasses import dataclass, field

# Centralised event metadata registry.
# Add one entry here when a new provider/event kind is introduced — ActivityEngine
# looks up icon and source from this dict, with no hardcoded mappings elsewhere.
EVENT_METADATA: dict[str, dict[str, str]] = {
    "htb_solve":         {"icon": "terminal",    "source": "Hack The Box"},
    "htb_rank_improved": {"icon": "trophy",      "source": "Hack The Box"},
    "github_repo":       {"icon": "github",      "source": "GitHub"},
    "github_release":    {"icon": "shield",      "source": "GitHub"},
    "github_push":       {"icon": "github",      "source": "GitHub"},
    "certification":     {"icon": "certificate", "source": "Certification"},
}

# Centralised priority table — higher wins when trimming to MAX_ACTIVITY_EVENTS.
EVENT_PRIORITY: dict[str, int] = {
    "htb_solve":         100,
    "certification":      95,
    "github_repo":        90,
    "github_release":     80,
    "htb_rank_improved":  75,
    "github_push":        20,
    "readme_update":      10,
}


def make_event_id(date: str, event_type: str, title: str) -> str:
    """Generate a stable, deterministic event ID from its core fields."""
    date_part = date.replace("-", "")
    slug = re.sub(r"[^a-z0-9]+", "_", title.lower()).strip("_")
    slug = re.sub(r"_+", "_", slug)[:40]
    return f"evt_{date_part}_{event_type}_{slug}"


@dataclass
class ActivityEvent:
    id: str
    date: str        # "2026-07-05"
    type: str        # "htb" | "github"
    title: str       # "Solved HTB: Reactor"
    priority: int = field(default=50)
    source: str = field(default="")
    icon: str = field(default="terminal")
    url: str | None = field(default=None)

    def key(self) -> tuple[str, str, str]:
        return (self.date, self.type, self.title)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "date": self.date,
            "type": self.type,
            "title": self.title,
            "priority": self.priority,
            "source": self.source,
            "icon": self.icon,
            "url": self.url,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "ActivityEvent":
        return cls(
            id=d.get("id", ""),
            date=d.get("date", ""),
            type=d.get("type", ""),
            title=d.get("title", ""),
            priority=d.get("priority", 50),
            source=d.get("source", ""),
            icon=d.get("icon", "terminal"),
            url=d.get("url"),
        )
