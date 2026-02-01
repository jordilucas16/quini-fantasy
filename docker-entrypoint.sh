#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Quini Fantasy - Starting Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verify database exists (created at build time)
if [ ! -f "/app/data/quini_fantasy.db" ]; then
    echo "❌ ERROR: Database not found! This should have been created at build time."
    exit 1
fi

echo "✅ Database found at /app/data/quini_fantasy.db"
echo "📊 Database size: $(ls -lh /app/data/quini_fantasy.db | awk '{print $5}')"

# Quick database verification
echo "🔍 Verifying database contents..."
uv run python -c "
from quini_fantasy.database import SessionLocal
from quini_fantasy.models import Player, Round
db = SessionLocal()
player_count = db.query(Player).count()
round_count = db.query(Round).count()
print(f'  - Players: {player_count}')
print(f'  - Rounds: {round_count}')
if player_count < 100:
    print('❌ ERROR: Too few players in database!')
    exit(1)
print('✅ Database verification passed')
db.close()
"

if [ $? -ne 0 ]; then
    echo "❌ Database verification failed!"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Starting Uvicorn Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the FastAPI server
exec uv run uvicorn quini_fantasy.main:app --host 0.0.0.0 --port "${PORT:-8000}"
