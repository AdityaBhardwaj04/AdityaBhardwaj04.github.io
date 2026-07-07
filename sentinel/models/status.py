from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ProviderStatus:
    id: str        # "github" | "htb"
    name: str      # "GitHub" | "Hack The Box"
    category: str  # "development" | "training"
    status: str    # "ONLINE" | "DEGRADED" | "OFFLINE"
    error: str | None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "status": self.status,
            "error": self.error,
        }


@dataclass
class SentinelStatus:
    status: str    # "ONLINE" | "DEGRADED" | "OFFLINE"
    automation: str
    version: str
    providers: list[ProviderStatus]

    def to_dict(self) -> dict:
        return {
            "status": self.status,
            "automation": self.automation,
            "version": self.version,
            "providers": [p.to_dict() for p in self.providers],
        }
