"""API routes for the application."""

import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from quini_fantasy.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    require_auth,
    verify_password,
)
from quini_fantasy.database import get_db
from quini_fantasy.models import Matchup, Prediction, Round, User
from quini_fantasy.schemas import (
    AuthStatusResponse,
    MatchupDetailResponse,
    PredictionCreate,
    PredictionDetailResponse,
    PredictionHistoryResponse,
    PredictionResponse,
    RoundResponse,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)

router = APIRouter()


# Auth endpoints
@router.post("/auth/signup", response_model=TokenResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)) -> TokenResponse:
    """Register a new user."""
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya esta registrado",
        )

    # Check if username already exists
    existing_username = (
        db.query(User).filter(User.username == user_data.username).first()
    )
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya esta en uso",
        )

    # Create user
    user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hash_password(user_data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create token
    token = create_access_token({"user_id": user.id})

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/auth/login", response_model=TokenResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    """Login with email and password."""
    user = db.query(User).filter(User.email == user_data.email).first()

    if user is None or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contrasena incorrectos",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario desactivado",
        )

    token = create_access_token({"user_id": user.id})

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/auth/me", response_model=AuthStatusResponse)
def get_auth_status(
    current_user: User | None = Depends(get_current_user),
) -> AuthStatusResponse:
    """Check authentication status and get current user info."""
    if current_user is None:
        return AuthStatusResponse(authenticated=False)

    return AuthStatusResponse(
        authenticated=True,
        user=UserResponse.model_validate(current_user),
    )


# Round endpoints
@router.get("/rounds/active", response_model=RoundResponse | None)
def get_active_round(db: Session = Depends(get_db)) -> RoundResponse | None:
    """Get the currently active round with matchups."""
    round_obj = db.query(Round).filter(Round.is_active).first()
    if round_obj is None:
        return None

    # Load matchups with players
    matchups = (
        db.query(Matchup)
        .filter(Matchup.round_id == round_obj.id)
        .order_by(Matchup.order)
        .all()
    )

    return RoundResponse(
        id=round_obj.id,
        name=round_obj.name,
        deadline=round_obj.deadline,
        is_active=round_obj.is_active,
        matchups=[
            {
                "id": m.id,
                "player_a": m.player_a,
                "player_b": m.player_b,
                "order": m.order,
                "result": m.result,
            }
            for m in matchups
        ],
    )


# Prediction endpoints
@router.post("/predictions", response_model=PredictionResponse)
def create_prediction(
    prediction_data: PredictionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
) -> PredictionResponse:
    """Submit predictions for a round. Requires authentication."""
    # Check round exists and is active
    round_obj = db.query(Round).filter(Round.id == prediction_data.round_id).first()
    if round_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Jornada no encontrada",
        )

    if not round_obj.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La jornada no esta activa",
        )

    # Check if user already submitted for this round
    existing = (
        db.query(Prediction)
        .filter(
            Prediction.user_id == current_user.id,
            Prediction.round_id == prediction_data.round_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya has enviado predicciones para esta jornada",
        )

    # Validate selections
    matchups = db.query(Matchup).filter(Matchup.round_id == round_obj.id).all()
    matchup_ids = {m.id for m in matchups}

    for matchup_id, selection in prediction_data.selections.items():
        if matchup_id not in matchup_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Emparejamiento {matchup_id} no existe en esta jornada",
            )
        if selection not in ("A", "B"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La seleccion debe ser 'A' o 'B'",
            )

    if len(prediction_data.selections) != len(matchups):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debes seleccionar todos los emparejamientos",
        )

    # Create prediction
    prediction = Prediction(
        user_id=current_user.id,
        round_id=prediction_data.round_id,
        selections=json.dumps(prediction_data.selections),
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return PredictionResponse.model_validate(prediction)


@router.get("/predictions/history", response_model=list[PredictionHistoryResponse])
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
) -> list[PredictionHistoryResponse]:
    """Get the current user's prediction history."""
    predictions = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user.id)
        .order_by(Prediction.submitted_at.desc())
        .all()
    )

    result = []
    for pred in predictions:
        round_obj = db.query(Round).filter(Round.id == pred.round_id).first()
        matchup_count = (
            db.query(Matchup).filter(Matchup.round_id == pred.round_id).count()
        )

        result.append(
            PredictionHistoryResponse(
                id=pred.id,
                round_name=round_obj.name if round_obj else "Unknown",
                submitted_at=pred.submitted_at,
                score=pred.score,
                total_matchups=matchup_count,
            )
        )

    return result


@router.get("/predictions/{round_id}", response_model=PredictionResponse | None)
def get_prediction_for_round(
    round_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
) -> PredictionResponse | None:
    """Get the current user's prediction for a specific round."""
    prediction = (
        db.query(Prediction)
        .filter(
            Prediction.user_id == current_user.id,
            Prediction.round_id == round_id,
        )
        .first()
    )

    if prediction is None:
        return None

    return PredictionResponse.model_validate(prediction)


@router.get(
    "/predictions/{prediction_id}/detail", response_model=PredictionDetailResponse
)
def get_prediction_detail(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
) -> PredictionDetailResponse:
    """Get detailed prediction with matchups and results."""
    prediction = (
        db.query(Prediction)
        .filter(
            Prediction.id == prediction_id,
            Prediction.user_id == current_user.id,
        )
        .first()
    )

    if prediction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediccion no encontrada",
        )

    round_obj = db.query(Round).filter(Round.id == prediction.round_id).first()
    if round_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Jornada no encontrada",
        )

    matchups = (
        db.query(Matchup)
        .filter(Matchup.round_id == prediction.round_id)
        .order_by(Matchup.order)
        .all()
    )

    selections = json.loads(prediction.selections)
    correct_count = 0
    matchup_details = []

    for matchup in matchups:
        user_selection = selections.get(str(matchup.id), "A")
        is_correct = None
        if matchup.result is not None:
            is_correct = user_selection == matchup.result
            if is_correct:
                correct_count += 1

        matchup_details.append(
            MatchupDetailResponse(
                id=matchup.id,
                order=matchup.order,
                player_a=matchup.player_a,
                player_b=matchup.player_b,
                user_selection=user_selection,
                result=matchup.result,
                is_correct=is_correct,
            )
        )

    return PredictionDetailResponse(
        id=prediction.id,
        round_id=prediction.round_id,
        round_name=round_obj.name,
        submitted_at=prediction.submitted_at,
        score=prediction.score,
        correct_count=correct_count,
        total_count=len(matchups),
        matchups=matchup_details,
    )
