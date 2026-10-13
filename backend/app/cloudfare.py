"""Cloudflare Workers AI integration for Lexyra."""

from functools import lru_cache

import httpx
from fastapi import HTTPException

from app.config import settings
from app.prompts import build_messages
from app.schemas import WritingStyle


@lru_cache(maxsize=1)
def _client() -> httpx.AsyncClient:
    if not settings.cloudflare_api_token:
        raise HTTPException(
            status_code=503,
            detail="Lexyra's AI service is not configured.",
        )

    if not settings.cloudflare_account_id:
        raise HTTPException(
            status_code=503,
            detail="Lexyra's AI service is not configured.",
        )

    return httpx.AsyncClient(
        base_url="https://api.cloudflare.com/client/v4/",
        headers={
            "Authorization": f"Bearer {settings.cloudflare_api_token}",
            "Content-Type": "application/json",
        },
        timeout=settings.request_timeout_seconds,
    )


async def enhance_text(text: str, style: WritingStyle) -> str:
    """Rewrite text using Cloudflare Workers AI."""

    client = _client()

    model = settings.cloudflare_model.strip()
    account_id = settings.cloudflare_account_id.strip()

    if not model.startswith("@"):
        raise HTTPException(
            status_code=500,
            detail="The configured Cloudflare model identifier is invalid.",
        )

    endpoint = f"accounts/{account_id}/ai/run/{model}"

    try:
        response = await client.post(
            endpoint,
            json={
                "messages": build_messages(text, style),
                "max_tokens": 700,
                "temperature": 0.4,
            },
        )

        if response.is_error:
            print(
                f"Cloudflare Workers AI error: "
                f"HTTP {response.status_code}: {response.text}"
            )

        response.raise_for_status()
        payload = response.json()

        if not payload.get("success"):
            print(f"Cloudflare Workers AI response: {payload}")
            raise HTTPException(
                status_code=502,
                detail="Cloudflare Workers AI could not generate your text.",
            )

        result = payload.get("result") or {}
        content = result.get("response", "")

        if not isinstance(content, str) or not content.strip():
            raise HTTPException(
                status_code=502,
                detail="The AI model returned an empty response.",
            )

        return content.strip()

    except HTTPException:
        raise

    except httpx.TimeoutException as exc:
        print(f"Cloudflare Workers AI timeout: {exc}")
        raise HTTPException(
            status_code=504,
            detail="Lexyra's AI service took too long to respond.",
        ) from exc

    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code

        if status in (401, 403):
            raise HTTPException(
                status_code=503,
                detail="Lexyra could not authenticate with Cloudflare.",
            ) from exc

        if status == 429:
            raise HTTPException(
                status_code=503,
                detail="Lexyra's AI service is temporarily busy.",
            ) from exc

        raise HTTPException(
            status_code=502,
            detail="Cloudflare Workers AI could not generate your text.",
        ) from exc

    except httpx.RequestError as exc:
        print(f"Cloudflare Workers AI connection error: {exc}")
        raise HTTPException(
            status_code=502,
            detail="Lexyra could not connect to Cloudflare Workers AI.",
        ) from exc