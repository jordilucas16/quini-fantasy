# Multi-stage build for Quini Fantasy
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build Python backend
FROM python:3.11-slim AS backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy Python dependencies files and README (needed by hatchling)
COPY pyproject.toml uv.lock README.md ./

# Install Python dependencies
RUN uv sync --frozen --no-dev

# Copy backend source
COPY src/ ./src/

# Copy data directory with CSV files (CRITICAL for database initialization)
COPY data/ ./data/

# Verify CSV files were copied (fail build if missing)
RUN test -f ./data/csv_laliga/standard_stats_20260122.csv || (echo "ERROR: CSV files not copied!" && exit 1)
RUN echo "✓ CSV files verified in Docker image"

# BUILD DATABASE AT BUILD TIME (not runtime!)
RUN echo "🏗️  Building database from CSVs..." && \
    uv run python -m quini_fantasy.load_players && \
    uv run python -m quini_fantasy.seed && \
    echo "✅ Database built successfully" && \
    ls -lh /app/data/quini_fantasy.db

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 8000

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Start script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
