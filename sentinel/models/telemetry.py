from __future__ import annotations

from dataclasses import dataclass


@dataclass
class GitHubTelemetry:
    repositories: int
    latestRepository: str
    lastCommit: str  # ISO datetime of most recent push

    def to_dict(self) -> dict:
        return {
            "repositories": self.repositories,
            "latestRepository": self.latestRepository,
            "lastCommit": self.lastCommit,
        }


@dataclass
class HTBTelemetry:
    machinesSolved: int
    rank: str
    globalRanking: int | None

    def to_dict(self) -> dict:
        return {
            "machinesSolved": self.machinesSolved,
            "rank": self.rank,
            "globalRanking": self.globalRanking,
        }


@dataclass
class Telemetry:
    github: GitHubTelemetry
    htb: HTBTelemetry

    def to_dict(self) -> dict:
        return {
            "github": self.github.to_dict(),
            "htb": self.htb.to_dict(),
        }
