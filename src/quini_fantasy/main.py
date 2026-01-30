"""FastAPI application entry point."""

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from quini_fantasy.api import router
from quini_fantasy.database import init_db

app = FastAPI(
    title="Quini Fantasy API",
    description="API para la aplicacion de quiniela de fantasy football",
    version="0.1.0",
)

# CORS configuration
# In production (Render), allow all origins for simplicity
# In development, restrict to localhost
is_production = os.getenv("RENDER") is not None
allowed_origins = ["*"] if is_production else [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    """Initialize database on startup."""
    init_db()


@app.get("/health")
def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


# Serve static frontend files in production
if is_production:
    # Path to built frontend
    frontend_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"

    if frontend_dist.exists():
        # Mount static files (JS, CSS, images, etc.)
        app.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")

        # Serve index.html for all non-API routes (SPA fallback)
        from fastapi.responses import FileResponse

        @app.get("/{full_path:path}")
        async def serve_frontend(full_path: str):
            """Serve frontend SPA for all non-API routes."""
            # If requesting a static file that exists, serve it
            file_path = frontend_dist / full_path
            if file_path.exists() and file_path.is_file():
                return FileResponse(file_path)

            # Otherwise, serve index.html (SPA routing)
            return FileResponse(frontend_dist / "index.html")
