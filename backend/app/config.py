"""Environment-based configuration for Lexyra."""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

BACKEND_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_ROOT / ".env")


def _csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    cloudflare_api_token: str = os.getenv(
        "CLOUDFLARE_API_TOKEN", ""
    ).strip()

    cloudflare_account_id: str = os.getenv(
        "CLOUDFLARE_ACCOUNT_ID", ""
    ).strip()

    cloudflare_model: str = os.getenv(
        "CLOUDFLARE_MODEL",
        "@cf/meta/llama-3.1-8b-instruct",
    ).strip()

    frontend_origin: str = os.getenv(
        "FRONTEND_ORIGIN",
        "http://localhost:5173",
    ).strip()

    max_input_chars: int = int(os.getenv("MAX_INPUT_CHARS", "10000"))

    request_timeout_seconds: float = float(
        os.getenv("REQUEST_TIMEOUT_SECONDS", "60")
    )

    @property
    def frontend_origins(self) -> list[str]:
        return _csv(self.frontend_origin)


settings = Settings()