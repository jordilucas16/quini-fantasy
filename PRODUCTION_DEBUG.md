# Production Database Initialization Debug

## Problem Statement
Production database shows players from non-La Liga teams (Rodri/Man City, Fabian Ruiz/PSG, etc.) despite CSV files containing only La Liga players.

## Root Cause Investigation

### Possible Causes Investigated

1. **CSV files not in Docker image** ✅ FIXED
   - Added verification step in Dockerfile to fail build if CSV missing
   - Added extensive logging to show CSV file paths and contents

2. **Database path mismatch** ✅ VERIFIED OK
   - `database.py` uses: `/app/data/quini_fantasy.db`
   - `docker-entrypoint.sh` deletes: `/app/data/quini_fantasy.db`
   - Paths match correctly

3. **Script failures ignored** ✅ FIXED
   - Added explicit exit codes on failure
   - Added verification that database file was created
   - Added player count verification

4. **Data validation missing** ✅ FIXED
   - Added team verification in load_players.py
   - Script now fails if non-La Liga teams detected
   - Shows all unique teams in logs

## Changes Made

### 1. Enhanced `docker-entrypoint.sh`
- Added debug output showing directory contents
- Verify CSV files exist before loading
- Show first 10 lines of CSV
- Exit with error if any step fails
- Verify database file was created

### 2. Enhanced `load_players.py`
- Extensive debug logging showing:
  - File paths and existence checks
  - Directory contents
  - First 5 players being loaded
  - All unique teams found in CSV
- **Validation**: Fails if any non-La Liga teams detected
- **Verification**: Confirms player count in DB matches loaded count

### 3. Enhanced `seed.py`
- Shows first 10 players in database
- Shows all unique teams in database
- Helps verify correct data was loaded

### 4. Enhanced `Dockerfile`
- **Build-time verification**: Fails if CSV files missing
- Ensures CSV files are in the image

### 5. Added Debug API Endpoint
- `GET /api/debug/database-info`
- Returns:
  - Total player count
  - All unique teams
  - Sample of 20 players
- **Use this to verify production database contents**

## Local Verification

✅ Tested locally:
```bash
rm -f data/quini_fantasy.db
uv run python -m quini_fantasy.load_players
uv run python -m quini_fantasy.seed
```

Results:
- 521 players loaded
- 20 La Liga teams only
- No non-La Liga teams found
- Verification passed

## Deployment Instructions

### Step 1: Commit and Push Changes
```bash
git add -A
git commit -m "Add extensive database initialization debugging and validation"
git push origin main
```

### Step 2: Trigger Render Redeploy
- Render should auto-deploy on push to main
- OR manually redeploy in Render dashboard

### Step 3: Monitor Deployment Logs
Watch for these key log sections:

1. **Build logs**: Should show "✓ CSV files verified in Docker image"
2. **Startup logs**: Should show:
   - DEBUG: Contents of /app/data/csv_laliga
   - First 10 lines of CSV (should be La Liga players)
   - Teams found in CSV (should be 20 La Liga teams)
   - ✓ VERIFICATION PASSED: All teams are La Liga teams
   - DEBUG: First 10 players in database (should be La Liga)
   - DEBUG: Unique teams in database (should be 20 La Liga teams)

### Step 4: Verify Production Database
Visit: `https://quini-fantasy.onrender.com/api/debug/database-info`

Check:
- `total_players`: Should be ~521
- `unique_teams`: Should be 20 La Liga teams ONLY
- `sample_players`: Should all be from La Liga teams

### Step 5: Check Active Round
Visit: `https://quini-fantasy.onrender.com/api/rounds/active`

Verify all 22 players in matchups are from La Liga teams.

## Expected vs Actual Teams

### Expected (La Liga only):
- Alavés, Athletic Club, Atlético Madrid, Barcelona
- Celta Vigo, Elche, Espanyol, Getafe, Girona
- Levante, Mallorca, Osasuna, Oviedo
- Rayo Vallecano, Real Betis, Real Madrid, Real Sociedad
- Sevilla, Valencia, Villarreal
- **Total: 20 teams**

### NOT ALLOWED (should NEVER appear):
- Manchester City, Arsenal, Chelsea, Liverpool (England)
- PSG, Lyon, Marseille (France)
- AC Milan, Inter, Juventus (Italy)
- Bayern Munich, Dortmund (Germany)
- Al-Nassr, Al-Hilal (Saudi Arabia)

## If Problem Persists

If production still shows wrong players after this deployment:

1. Check build logs for "CSV files verified" message
2. Check startup logs for teams found - should match expected list
3. Call `/api/debug/database-info` endpoint
4. Share full deployment logs for deeper investigation

Possible remaining issues:
- Render caching old Docker layers (try "Clear build cache" in dashboard)
- Multiple instances with old data (free tier shouldn't have this)
- CDN/browser caching API responses (unlikely but possible)

## Cleanup After Fix

Once verified working, consider:
1. Remove `/api/debug/database-info` endpoint (security)
2. Reduce debug logging verbosity in production
3. Keep validation checks (non-La Liga team detection)
