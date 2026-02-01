"""Seed script to populate the database with initial data."""

import random
from datetime import UTC, datetime, timedelta

from quini_fantasy.database import SessionLocal, init_db
from quini_fantasy.models import Matchup, Player, Round


def create_random_matchups(db, round_id: int, num_matchups: int = 11) -> list[Matchup]:
    """Create random matchups from available players without repetition."""
    # Get all players with enough matches played
    all_players = db.query(Player).filter(Player.matches_90s >= 1.0).all()

    if len(all_players) < num_matchups * 2:
        raise ValueError(
            f"Not enough players for {num_matchups} matchups. "
            f"Need {num_matchups * 2}, have {len(all_players)}"
        )

    # Shuffle and select 22 random players
    random.shuffle(all_players)
    selected_players = all_players[: num_matchups * 2]

    # Create matchups from pairs
    matchups = []
    for i in range(num_matchups):
        player_a = selected_players[i * 2]
        player_b = selected_players[i * 2 + 1]

        matchup = Matchup(
            round_id=round_id,
            player_a_id=player_a.id,
            player_b_id=player_b.id,
            order=i,
        )
        db.add(matchup)
        matchups.append(matchup)

    return matchups


def seed_database() -> None:
    """Populate database with a new round and random matchups."""
    print("=" * 80)
    print("DEBUG: seed_database() started")
    print("=" * 80)

    init_db()
    db = SessionLocal()

    try:
        # Check if players exist
        player_count = db.query(Player).count()
        if player_count == 0:
            print("No players found in database!")
            print("Please run: make load-players")
            return

        print(f"Found {player_count} players in database")

        # Debug: Show first 10 players in database
        sample_players = db.query(Player).limit(10).all()
        print("\nDEBUG: First 10 players in database:")
        for p in sample_players:
            print(f"  - {p.name} ({p.team}, {p.position})")

        # Debug: Show unique teams in database
        all_players = db.query(Player).all()
        teams_in_db = set(p.team for p in all_players)
        print(f"\nDEBUG: Unique teams in database ({len(teams_in_db)}):")
        for team in sorted(teams_in_db):
            print(f"  - {team}")

        # Check if there's already an active round
        active_round = db.query(Round).filter(Round.is_active.is_(True)).first()
        if active_round:
            print(f"Active round already exists: {active_round.name}")
            print("Skipping seed...")
            return

        # Get the latest round number
        latest_round = db.query(Round).order_by(Round.id.desc()).first()
        if latest_round:
            # Extract number from name like "Jornada 20"
            try:
                last_num = int(latest_round.name.split()[-1])
                next_num = last_num + 1
            except (ValueError, IndexError):
                next_num = 22  # Default to current jornada
        else:
            next_num = 22  # Default to current jornada (changed from 1)

        # Create new round
        round_obj = Round(
            name=f"Jornada {next_num}",
            deadline=datetime.now(UTC) + timedelta(days=3),
            is_active=True,
        )
        db.add(round_obj)
        db.flush()

        # Create 11 random matchups
        matchups = create_random_matchups(db, round_obj.id, num_matchups=11)

        db.commit()

        print("\nDatabase seeded successfully!")
        print(f"  - Round created: {round_obj.name}")
        print(f"  - Deadline: {round_obj.deadline.strftime('%Y-%m-%d %H:%M')}")
        print(f"  - {len(matchups)} matchups created")
        print("\nMatchups:")
        for i, matchup in enumerate(matchups, 1):
            print(
                f"  {i}. {matchup.player_a.name} ({matchup.player_a.team}) "
                f"vs {matchup.player_b.name} ({matchup.player_b.team})"
            )

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
