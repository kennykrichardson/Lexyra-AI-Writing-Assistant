"""FastAPI entry point for Lexyra."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
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

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def root():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="theme-color" content="#eee7dc">
        <title>Lexyra API</title>
        <style>
            * { box-sizing: border-box; }

            body {
                margin: 0;
                min-height: 100vh;
                display: grid;
                place-items: center;
                padding: 24px;
                background: #eee7dc;
                color: #302b26;
                font-family: Inter, system-ui, sans-serif;
            }

            main {
                width: 100%;
                max-width: 560px;
                padding: 48px 32px;
                text-align: center;
                background: rgba(255, 255, 255, 0.58);
                border: 1px solid #d9d0c3;
                border-radius: 24px;
                box-shadow: 0 20px 60px rgba(48, 43, 38, 0.08);
            }

            .mark {
                font-size: 38px;
                margin-bottom: 12px;
            }

            h1 {
                margin: 0;
                font-family: Georgia, serif;
                font-size: clamp(36px, 8vw, 52px);
                letter-spacing: -2px;
            }

            p {
                color: #746b60;
                line-height: 1.7;
                margin: 16px 0 28px;
            }

            .status {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 13px;
                border-radius: 999px;
                background: #e4eadc;
                color: #42613b;
                font-size: 13px;
                font-weight: 600;
            }

            .dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #54834a;
            }

            nav {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 12px;
            }

            a {
                padding: 11px 16px;
                border: 1px solid #d9d0c3;
                border-radius: 10px;
                color: #302b26;
                text-decoration: none;
                font-size: 14px;
                transition: background 0.2s ease;
            }

            a:hover { background: #eee7dc; }

            footer {
                margin-top: 32px;
                color: #93897c;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <main>
            <div class="mark">✳</div>
            <h1>Lexyra</h1>
            <p>
                A little more clarity. A little less friction.
                The API powering your writing assistant is here.
            </p>

            <div class="status">
                <span class="dot"></span>
                API is responding
            </div>

            <nav style="margin-top: 28px">
                <a href="/docs">API Documentation</a>
                <a href="/api/health">Health Check</a>
            </nav>

            <footer>Lexyra API · Built for better writing.</footer>
        </main>
    </body>
    </html>
    """

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
