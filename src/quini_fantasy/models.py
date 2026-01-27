"""SQLAlchemy models for the application."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from quini_fantasy.database import Base


class User(Base):
    """User model for authentication."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    predictions: Mapped[list["Prediction"]] = relationship(
        "Prediction", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username={self.username})>"


class Round(Base):
    """Round/Jornada model."""

    __tablename__ = "rounds"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    deadline: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    matchups: Mapped[list["Matchup"]] = relationship(
        "Matchup", back_populates="round", cascade="all, delete-orphan"
    )
    predictions: Mapped[list["Prediction"]] = relationship(
        "Prediction", back_populates="round", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Round(id={self.id}, name={self.name})>"


class Player(Base):
    """Football player model."""

    __tablename__ = "players"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    team: Mapped[str] = mapped_column(String(100), nullable=False)
    position: Mapped[str] = mapped_column(String(10), nullable=False)  # GK, DF, MF, FW
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Standard stats (all players)
    matches_90s: Mapped[float] = mapped_column(Float, default=0.0)  # 90s played
    goals: Mapped[int] = mapped_column(Integer, default=0)  # Gls
    assists: Mapped[int] = mapped_column(Integer, default=0)  # Ast
    yellow_cards: Mapped[int] = mapped_column(Integer, default=0)  # CrdY
    red_cards: Mapped[int] = mapped_column(Integer, default=0)  # CrdR

    # Goalkeeper stats (only for GK position)
    goals_against: Mapped[int | None] = mapped_column(Integer, nullable=True)  # GA
    saves: Mapped[int | None] = mapped_column(Integer, nullable=True)  # Saves
    clean_sheets: Mapped[int | None] = mapped_column(Integer, nullable=True)  # CS
    penalties_saved: Mapped[int | None] = mapped_column(Integer, nullable=True)  # PKsv

    # Calculated field
    avg_points: Mapped[float] = mapped_column(Float, default=0.0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    def __repr__(self) -> str:
        return f"<Player(id={self.id}, name={self.name}, team={self.team})>"


class Matchup(Base):
    """Matchup between two players in a round."""

    __tablename__ = "matchups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    round_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("rounds.id"), nullable=False
    )
    player_a_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("players.id"), nullable=False
    )
    player_b_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("players.id"), nullable=False
    )
    order: Mapped[int] = mapped_column(Integer, default=0)  # Position in the list
    result: Mapped[str | None] = mapped_column(
        String(1), nullable=True
    )  # 'A', 'B', or None if not resolved

    # Relationships
    round: Mapped["Round"] = relationship("Round", back_populates="matchups")
    player_a: Mapped["Player"] = relationship("Player", foreign_keys=[player_a_id])
    player_b: Mapped["Player"] = relationship("Player", foreign_keys=[player_b_id])

    def __repr__(self) -> str:
        return f"<Matchup(id={self.id}, round={self.round_id})>"


class Prediction(Base):
    """User prediction for a round."""

    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    round_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("rounds.id"), nullable=False
    )
    selections: Mapped[str] = mapped_column(
        Text, nullable=False
    )  # JSON string of matchup_id -> 'A' or 'B'
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    score: Mapped[int | None] = mapped_column(
        Integer, nullable=True
    )  # Points earned after round ends

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="predictions")
    round: Mapped["Round"] = relationship("Round", back_populates="predictions")

    def __repr__(self) -> str:
        return f"<Prediction(id={self.id}, user={self.user_id}, round={self.round_id})>"
