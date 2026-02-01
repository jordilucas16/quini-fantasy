#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Quini Fantasy - Starting Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Remove old database if it exists (free tier has no persistence)
if [ -f "/app/data/quini_fantasy.db" ]; then
    echo "🗑️  Removing old database..."
    rm -f /app/data/quini_fantasy.db
fi

echo "📦 Initializing database from CSV..."

# Load players from CSV
if [ -f "/app/data/csv_laliga/standard_stats_20260122.csv" ]; then
    echo "📊 Loading players from CSV..."
    uv run python -m quini_fantasy.load_players
else
    echo "⚠️  ERROR: No players CSV found at /app/data/csv_laliga/standard_stats_20260122.csv"
    echo "Available files:"
    ls -la /app/data/
    exit 1
fi

# Create initial round
echo "🎮 Creating initial round (Jornada 22)..."
uv run python -m quini_fantasy.seed

echo "✓ Database initialized successfully"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Starting Uvicorn Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the FastAPI server
exec uv run uvicorn quini_fantasy.main:app --host 0.0.0.0 --port "${PORT:-8000}"
