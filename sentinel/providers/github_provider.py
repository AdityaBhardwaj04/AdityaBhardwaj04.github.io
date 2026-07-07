from __future__ import annotations

import logging
import time

import httpx

logger = logging.getLogger(__name__)


class GitHubProvider:
    """Fetches public GitHub data for a user. Returns a structured snapshot dict.
    Knows nothing about the frontend or output format."""

    BASE = "https://api.github.com"

    def __init__(self, username: str, token: str | None, max_release_checks: int = 5, timeout: int = 15):
        self.username = username
        self.token = token
        self.max_release_checks = max_release_checks
        self.timeout = timeout

    def _headers(self) -> dict[str, str]:
        h = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
        if self.token:
            h["Authorization"] = f"Bearer {self.token}"
        return h

    def _get(self, client: httpx.Client, url: str) -> dict | list | None:
        resp = client.get(url, headers=self._headers())
        resp.raise_for_status()
        return resp.json()

    def fetch(self) -> dict:
        start = time.monotonic()
        try:
            with httpx.Client(timeout=self.timeout) as client:
                repos_raw = self._get(
                    client,
                    f"{self.BASE}/users/{self.username}/repos?per_page=100&sort=updated",
                )
                if not isinstance(repos_raw, list):
                    raise ValueError("Unexpected repos response shape")

                repos = [
                    {
                        "name": r["name"],
                        "pushed_at": r.get("pushed_at") or "",
                        "created_at": r.get("created_at") or "",
                        "latest_release": None,
                    }
                    for r in repos_raw
                    if not r.get("fork", False)
                ]

                # Check latest release for the N most recently pushed repos
                for repo in repos[: self.max_release_checks]:
                    try:
                        rel = self._get(
                            client,
                            f"{self.BASE}/repos/{self.username}/{repo['name']}/releases/latest",
                        )
                        if isinstance(rel, dict):
                            repo["latest_release"] = rel.get("tag_name")
                    except httpx.HTTPStatusError as e:
                        if e.response.status_code == 404:
                            pass  # no releases for this repo
                        else:
                            logger.debug("Release check failed for %s: %s", repo["name"], e)
                    except Exception as e:
                        logger.debug("Release check failed for %s: %s", repo["name"], e)

            elapsed_ms = int((time.monotonic() - start) * 1000)
            logger.info("GitHub: fetched %d repos in %dms", len(repos), elapsed_ms)
            return {
                "repo_count": len(repos),
                "repos": repos,
                "ok": True,
                "error": None,
                "response_ms": elapsed_ms,
            }

        except Exception as exc:
            elapsed_ms = int((time.monotonic() - start) * 1000)
            logger.warning("GitHub provider failed: %s", exc)
            return {
                "repo_count": 0,
                "repos": [],
                "ok": False,
                "error": str(exc),
                "response_ms": elapsed_ms,
            }
