"""Script to load players from CSV files into the database."""

import csv
from pathlib import Path

from quini_fantasy.database import SessionLocal, init_db
from quini_fantasy.models import Player


def normalize_position(pos: str) -> str:
    """Normalize position abbreviations to standard format."""
    pos = pos.upper().strip()
    if pos == "GK":
        return "GK"
    elif pos in ["DF", "CB", "RB", "LB", "RWB", "LWB"]:
        return "DF"
    elif pos in ["MF", "CM", "DM", "AM", "RM", "LM"]:
        return "MF"
    elif pos in ["FW", "ST", "CF", "LW", "RW"]:
        return "FW"
    # Handle compound positions like "DF,MF" or "FW,MF"
    if "," in pos:
        first_pos = pos.split(",")[0].strip()
        return normalize_position(first_pos)
    return pos


def load_players_from_csv() -> None:
    """Load players from standard_stats and goalkeeping_stats CSV files."""
    init_db()
    db = SessionLocal()

    try:
        # Get CSV file paths
        base_dir = Path(__file__).resolve().parent.parent.parent
        csv_dir = base_dir / "data" / "csv_laliga"
        standard_stats_path = csv_dir / "standard_stats_20260122.csv"
        goalkeeping_stats_path = csv_dir / "goalkeeping_stats_20260122.csv"

        if not standard_stats_path.exists():
            raise FileNotFoundError(
                f"Standard stats CSV not found: {standard_stats_path}"
            )
        if not goalkeeping_stats_path.exists():
            raise FileNotFoundError(
                f"Goalkeeping stats CSV not found: {goalkeeping_stats_path}"
            )

        # Clear existing players
        print("Clearing existing players...")
        db.query(Player).delete()
        db.commit()

        # Load goalkeeper stats into a dictionary
        gk_stats = {}
        print(f"Loading goalkeeper stats from {goalkeeping_stats_path}...")
        with open(goalkeeping_stats_path, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Skip header rows (sometimes CSVs have duplicate headers)
                if row["Player"] == "Player" or row["GA"] == "GA":
                    continue

                player_name = row["Player"].strip()
                gk_stats[player_name] = {
                    "goals_against": int(row["GA"]) if row["GA"] else 0,
                    "saves": int(row["Saves"]) if row["Saves"] else 0,
                    "clean_sheets": int(row["CS"]) if row["CS"] else 0,
                    "penalties_saved": int(row["PKsv"]) if row["PKsv"] else 0,
                }

        # Load all players from standard stats
        players = []
        print(f"Loading players from {standard_stats_path}...")
        with open(standard_stats_path, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Skip header rows
                if row["Player"] == "Player" or row["Gls"] == "Gls":
                    continue

                player_name = row["Player"].strip()
                position = normalize_position(row["Pos"])
                team = row["Squad"].strip()

                # Parse numeric fields with defaults
                try:
                    matches_90s = float(row["90s"]) if row["90s"] else 0.0
                    goals = int(row["Gls"]) if row["Gls"] else 0
                    assists = int(row["Ast"]) if row["Ast"] else 0
                    yellow_cards = int(row["CrdY"]) if row["CrdY"] else 0
                    red_cards = int(row["CrdR"]) if row["CrdR"] else 0
                except (ValueError, KeyError) as e:
                    print(f"Warning: Error parsing stats for {player_name}: {e}")
                    continue

                # Calculate avg_points according to the scoring system
                # Goals: 3, Assists: 1.5, Yellow: -0.5, Red: -2, Matches: 0.2
                total_points = (
                    goals * 3
                    + assists * 1.5
                    - yellow_cards * 0.5
                    - red_cards * 2
                    + matches_90s * 0.2
                )
                # Divide by 21 jornadas to get average per round
                avg_points = total_points / 21

                # Create player object (avg_points will be set below)
                player = Player(
                    name=player_name,
                    team=team,
                    position=position,
                    matches_90s=matches_90s,
                    goals=goals,
                    assists=assists,
                    yellow_cards=yellow_cards,
                    red_cards=red_cards,
                )

                # Add goalkeeper stats if available
                if position == "GK" and player_name in gk_stats:
                    gk_data = gk_stats[player_name]
                    player.goals_against = gk_data["goals_against"]
                    player.saves = gk_data["saves"]
                    player.clean_sheets = gk_data["clean_sheets"]
                    player.penalties_saved = gk_data["penalties_saved"]

                    # Recalculate avg_points for goalkeepers
                    # Base + GK: Clean sheets: 3, Penalties: 2.5, GA: -1, Saves: 1
                    gk_total_points = (
                        total_points  # Base stats already calculated above
                        + gk_data["clean_sheets"] * 3
                        + gk_data["penalties_saved"] * 2.5
                        - gk_data["goals_against"] * 1
                        + gk_data["saves"] * 1
                    )
                    player.avg_points = round(gk_total_points / 21, 2)
                else:
                    player.avg_points = round(avg_points, 2)

                players.append(player)
                db.add(player)

        db.commit()
        print(f"Successfully loaded {len(players)} players into the database!")

        # Show position breakdown
        position_counts: dict[str, int] = {}
        for player in players:
            count = position_counts.get(player.position, 0)
            position_counts[player.position] = count + 1

        print("\nPosition breakdown:")
        for pos, count in sorted(position_counts.items()):
            print(f"  {pos}: {count} players")

    except Exception as e:
        db.rollback()
        print(f"Error loading players: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    load_players_from_csv()
