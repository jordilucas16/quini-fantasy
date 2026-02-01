#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Quini Fantasy - Starting Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "DEBUG: Current directory: $(pwd)"
echo "DEBUG: Contents of /app:"
ls -la /app/
echo ""
echo "DEBUG: Contents of /app/data:"
ls -la /app/data/ || echo "ERROR: /app/data does not exist!"
echo ""
echo "DEBUG: Contents of /app/data/csv_laliga:"
ls -la /app/data/csv_laliga/ || echo "ERROR: /app/data/csv_laliga does not exist!"
echo ""

# Remove old database if it exists (free tier has no persistence)
if [ -f "/app/data/quini_fantasy.db" ]; then
    echo "🗑️  Removing old database..."
    rm -f /app/data/quini_fantasy.db
fi

echo "📦 Initializing database from CSV..."

# Load players from CSV
if [ -f "/app/data/csv_laliga/standard_stats_20260122.csv" ]; then
    echo "📊 CSV files found, loading players..."
    echo "DEBUG: First 10 lines of standard_stats CSV:"
    head -10 /app/data/csv_laliga/standard_stats_20260122.csv
    echo ""

    echo "DEBUG: Running load_players script..."
    uv run python -m quini_fantasy.load_players

    if [ $? -ne 0 ]; then
        echo "⚠️  ERROR: load_players script failed!"
        exit 1
    fi

    echo "✓ Players loaded successfully"
else
    echo "⚠️  ERROR: No players CSV found at /app/data/csv_laliga/standard_stats_20260122.csv"
    echo "ERROR: Available files in /app:"
    find /app -name "*.csv" -type f || echo "No CSV files found in /app!"
    exit 1
fi

# Verify database was created
if [ ! -f "/app/data/quini_fantasy.db" ]; then
    echo "⚠️  ERROR: Database file was not created!"
    exit 1
fi

echo "DEBUG: Database file size: $(ls -lh /app/data/quini_fantasy.db | awk '{print $5}')"

# Create initial round
echo "🎮 Creating initial round (Jornada 22)..."
uv run python -m quini_fantasy.seed

if [ $? -ne 0 ]; then
    echo "⚠️  ERROR: seed script failed!"
    exit 1
fi

echo "✓ Database initialized successfully"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Starting Uvicorn Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the FastAPI server
exec uv run uvicorn quini_fantasy.main:app --host 0.0.0.0 --port "${PORT:-8000}"
