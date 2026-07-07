from __future__ import annotations

import logging
import time

import httpx

logger = logging.getLogger(__name__)

# HTB now splits endpoints across API versions.
PROFILE_API  = "https://labs.hackthebox.com/api/v4"
ACTIVITY_API = "https://labs.hackthebox.com/api/v5"


class HTBProvider:
    """Fetches public Hack The Box profile data. Returns a structured snapshot dict.
    Knows nothing about the frontend or output format."""

    def __init__(self, user_id: str, api_token: str | None, timeout: int = 15):
        self.user_id   = user_id
        self.api_token = api_token
        self.timeout   = timeout

    # ── HTTP ──────────────────────────────────────────────────────────────

    def _headers(self) -> dict[str, str]:
        h = {"Accept": "application/json", "Content-Type": "application/json"}
        if self.api_token:
            h["Authorization"] = f"Bearer {self.api_token}"
        return h

    def _get(self, client: httpx.Client, url: str) -> dict:
        resp = client.get(url, headers=self._headers())
        if resp.status_code == 401 and not self.api_token:
            logger.warning(
                "HTB API returned 401. Set HTB_API_TOKEN in GitHub Actions secrets."
            )
        resp.raise_for_status()
        data = resp.json()
        if not isinstance(data, dict):
            raise ValueError(f"Unexpected response type {type(data)} from {url}")
        return data

    # ── Endpoint fetchers ─────────────────────────────────────────────────

    def _fetch_profile(self, client: httpx.Client) -> dict:
        """GET /api/v4/profile/{userId} → normalized profile fields."""
        raw = self._get(client, f"{PROFILE_API}/profile/{self.user_id}")
        p   = raw.get("profile", {})
        return {
            "rank":                 p.get("rank", ""),
            "ranking":              p.get("ranking"),
            "points":               p.get("points", 0),
            "user_owns":            p.get("user_owns", 0),
            "system_owns":          p.get("system_owns", 0),
            "current_rank_progress": p.get("current_rank_progress"),
            "next_rank":            p.get("next_rank"),
        }

    def _fetch_activity(self, client: httpx.Client) -> list[dict]:
        """GET /api/v5/user/profile/activity/{userId}?page=1 → normalized activity list.

        v5 uses 'ownDate' instead of 'date'. Normalize to 'date' so the diff
        engine and state manager can read activity timestamps without change.
        """
        raw = self._get(
            client, f"{ACTIVITY_API}/user/profile/activity/{self.user_id}?page=1"
        )
        items = raw.get("data", [])
        if not isinstance(items, list):
            raise ValueError("Activity response 'data' is not a list")
        normalized = []
        for item in items:
            entry = dict(item)
            if "date" not in entry and "ownDate" in entry:
                entry["date"] = entry["ownDate"]
            normalized.append(entry)
        return normalized

    def _fetch_badges(self, client: httpx.Client) -> list[dict]:
        """GET /api/v4/profile/badges/{userId}?rare=8 → raw badges list."""
        raw = self._get(client, f"{PROFILE_API}/profile/badges/{self.user_id}?rare=8")
        badges = raw.get("badges", [])
        if not isinstance(badges, list):
            raise ValueError("Badges response 'badges' is not a list")
        return badges

    def _fetch_machine_progress(self, client: httpx.Client) -> dict:
        """GET /api/v4/profile/progress/machines/{userId} → raw machine progress."""
        return self._get(client, f"{PROFILE_API}/profile/progress/machines/{self.user_id}")

    # ── Public interface ──────────────────────────────────────────────────

    def fetch(self) -> dict:
        start  = time.monotonic()
        errors: list[str] = []

        profile_data:       dict       = {}
        activity_data:      list[dict] = []
        badges_data:        list[dict] = []
        machine_progress:   dict       = {}

        with httpx.Client(timeout=self.timeout) as client:
            try:
                profile_data = self._fetch_profile(client)
                logger.info("HTB: profile fetched (rank=%s, user_owns=%s, system_owns=%s)",
                            profile_data.get("rank"), profile_data.get("user_owns"),
                            profile_data.get("system_owns"))
            except Exception as exc:
                errors.append(f"profile: {exc}")
                logger.warning("HTB profile fetch failed: %s", exc)

            try:
                activity_data = self._fetch_activity(client)
                logger.info("HTB: fetched %d activity items", len(activity_data))
            except Exception as exc:
                errors.append(f"activity: {exc}")
                logger.warning("HTB activity fetch failed: %s", exc)

            try:
                badges_data = self._fetch_badges(client)
                logger.info("HTB: fetched %d badges", len(badges_data))
            except Exception as exc:
                errors.append(f"badges: {exc}")
                logger.warning("HTB badges fetch failed: %s", exc)

            try:
                machine_progress = self._fetch_machine_progress(client)
                logger.info("HTB: machine progress fetched")
            except Exception as exc:
                errors.append(f"machine_progress: {exc}")
                logger.warning("HTB machine progress fetch failed: %s", exc)

        elapsed_ms = int((time.monotonic() - start) * 1000)
        core_failed = any(e.startswith(("profile:", "activity:")) for e in errors)
        ok = not core_failed

        if ok:
            logger.info("HTB: provider completed in %dms", elapsed_ms)
        else:
            logger.warning("HTB provider failure (%dms): %s", elapsed_ms, "; ".join(errors))

        return {
            # Profile telemetry — consumed by build_telemetry() in updater.py
            "rank":                  profile_data.get("rank", ""),
            "ranking":               profile_data.get("ranking"),
            "points":                profile_data.get("points", 0),
            "user_owns":             profile_data.get("user_owns", 0),
            "system_owns":           profile_data.get("system_owns", 0),
            "current_rank_progress": profile_data.get("current_rank_progress"),
            "next_rank":             profile_data.get("next_rank"),
            # Activity — consumed by diff_engine.py / activity_engine.py
            "activity":              activity_data,
            # Extended data — available for future use
            "badges":                badges_data,
            "machine_progress":      machine_progress,
            # Provider health
            "ok":                    ok,
            "error":                 "; ".join(errors) if errors else None,
            "response_ms":           elapsed_ms,
        }
