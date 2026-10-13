"""FastAPI entry point for Lexyra."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.cloudfare import enhance_text
from app.schemas import EnhanceRequest, EnhanceResponse

app = FastAPI(
    title="Lexyra API",
    description="Turn rough writing into clear, professional language while preserving meaning.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "app": "Lexyra"}


@app.post("/api/enhance", response_model=EnhanceResponse)
async def enhance(request: EnhanceRequest) -> EnhanceResponse:
    enhanced = await enhance_text(request.text, request.style)
    return EnhanceResponse(
        original_text=request.text,
        enhanced_text=enhanced,
        style=request.style,
    )
