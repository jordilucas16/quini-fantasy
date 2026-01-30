"""Pydantic schemas for request/response validation."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Auth schemas
class UserCreate(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response (no password)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    username: str
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    """Schema for JWT token response."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class AuthStatusResponse(BaseModel):
    """Schema for auth status check."""

    authenticated: bool
    user: UserResponse | None = None


# Player schemas
class PlayerResponse(BaseModel):
    """Schema for player response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    team: str
    position: str
    photo_url: str | None
    avg_points: float

    # Standard stats (all players)
    matches_90s: float
    goals: int
    assists: int
    yellow_cards: int
    red_cards: int

    # Goalkeeper stats (optional, only for GK)
    goals_against: int | None = None
    saves: int | None = None
    clean_sheets: int | None = None
    penalties_saved: int | None = None


# Matchup schemas
class MatchupResponse(BaseModel):
    """Schema for matchup response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    player_a: PlayerResponse
    player_b: PlayerResponse
    order: int
    result: str | None


# Round schemas
class RoundResponse(BaseModel):
    """Schema for round response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    deadline: datetime
    is_active: bool
    matchups: list[MatchupResponse] = []


# Prediction schemas
class PredictionCreate(BaseModel):
    """Schema for creating a prediction."""

    round_id: int
    selections: dict[int, str]  # matchup_id -> 'A' or 'B'


class PredictionResponse(BaseModel):
    """Schema for prediction response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    round_id: int
    selections: str  # JSON string
    submitted_at: datetime
    score: int | None


class PredictionHistoryResponse(BaseModel):
    """Schema for prediction history with round info."""

    id: int
    round_name: str
    submitted_at: datetime
    score: int | None
    total_matchups: int


class MatchupDetailResponse(BaseModel):
    """Schema for matchup with user selection and result."""

    id: int
    order: int
    player_a: PlayerResponse
    player_b: PlayerResponse
    user_selection: str  # 'A' or 'B'
    result: str | None  # 'A', 'B', or None if not resolved
    is_correct: bool | None  # True if user was right, None if not resolved


class PredictionDetailResponse(BaseModel):
    """Schema for detailed prediction with matchups."""

    id: int
    round_id: int
    round_name: str
    submitted_at: datetime
    score: int | None
    correct_count: int
    total_count: int
    matchups: list[MatchupDetailResponse]


# Ranking schemas
class RankingEntryResponse(BaseModel):
    """Schema for a single ranking entry."""

    rank: int
    username: str
    total_score: int
