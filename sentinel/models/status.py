from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ProviderStatus:
    id: str                       # "github" | "htb"
    name: str                     # "GitHub" | "Hack The Box"
    category: str                 # "development" | "training" | "infrastructure" | "certifications" | "news"
    status: str                   # "ONLINE" | "DEGRADED" | "OFFLINE"
    lastSuccessfulSync: str | None
    lastAttempt: str
    responseTime: str | None      # "0.32s" or null
    error: str | None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "status": self.status,
            "lastSuccessfulSync": self.lastSuccessfulSync,
            "lastAttempt": self.lastAttempt,
            "responseTime": self.responseTime,
            "error": self.error,
        }


@dataclass
class SentinelStatus:
    status: str          # "ONLINE" | "DEGRADED" | "OFFLINE"
    automation: str
    lastSync: str
    runtime: str         # "2.31 seconds"
    version: str
    providers: list[ProviderStatus]

    def to_dict(self) -> dict:
        return {
            "status": self.status,
            "automation": self.automation,
            "lastSync": self.lastSync,
            "runtime": self.runtime,
            "version": self.version,
            "providers": [p.to_dict() for p in self.providers],
        }
