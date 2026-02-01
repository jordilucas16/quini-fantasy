#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Quini Fantasy - Starting Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if database exists
if [ ! -f "/app/data/quini_fantasy.db" ]; then
    echo "📦 Database not found. Initializing..."

    # Load players from CSV
    if [ -f "/app/data/csv_laliga/standard_stats_20260122.csv" ]; then
        echo "📊 Loading players from CSV..."
        uv run python -m quini_fantasy.load_players
    else
        echo "⚠️  No players CSV found. Skipping player data."
    fi

    # Create initial round
    echo "🎮 Creating initial round..."
    uv run python -m quini_fantasy.seed

    echo "✓ Database initialized successfully"
else
    echo "✓ Database found at /app/data/quini_fantasy.db"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Starting Uvicorn Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the FastAPI server
exec uv run uvicorn quini_fantasy.main:app --host 0.0.0.0 --port "${PORT:-8000}"
