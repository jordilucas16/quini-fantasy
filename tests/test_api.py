"""API integration tests."""

from __future__ import annotations

from datetime import datetime
import json

from quini_fantasy.auth import create_access_token, hash_password
from quini_fantasy.models import Matchup, Player, Prediction, Round, User


def _auth_headers(user: User) -> dict[str, str]:
    token = create_access_token({"user_id": user.id})
    return {"Authorization": f"Bearer {token}"}


def _create_user(
    db,
    *,
    email: str = "alice@example.com",
    username: str = "alice",
    password: str = "password123",
    is_active: bool = True,
) -> User:
    user = User(
        email=email,
        username=username,
        password_hash=hash_password(password),
        is_active=is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _create_player(db, *, name: str, team: str, position: str = "MF") -> Player:
    player = Player(name=name, team=team, position=position)
    db.add(player)
    db.commit()
    db.refresh(player)
    return player


def _create_round(db, *, name: str = "Jornada 1", is_active: bool = True) -> Round:
    round_obj = Round(name=name, deadline=datetime.utcnow(), is_active=is_active)
    db.add(round_obj)
    db.commit()
    db.refresh(round_obj)
    return round_obj


def _create_matchup(
    db,
    *,
    round_obj: Round,
    player_a: Player,
    player_b: Player,
    order: int,
    result: str | None = None,
) -> Matchup:
    matchup = Matchup(
        round_id=round_obj.id,
        player_a_id=player_a.id,
        player_b_id=player_b.id,
        order=order,
        result=result,
    )
    db.add(matchup)
    db.commit()
    db.refresh(matchup)
    return matchup


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_signup_and_login(client):
    signup_payload = {
        "email": "ana@example.com",
        "username": "ana",
        "password": "secret123",
    }

    signup_response = client.post("/api/auth/signup", json=signup_payload)
    assert signup_response.status_code == 200
    signup_data = signup_response.json()
    assert signup_data["token_type"] == "bearer"
    assert signup_data["user"]["email"] == signup_payload["email"]

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": signup_payload["email"],
            "password": signup_payload["password"],
        },
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert login_data["user"]["username"] == signup_payload["username"]


def test_signup_rejects_duplicate_email(client, db_session):
    _create_user(db_session, email="dup@example.com", username="user1")

    response = client.post(
        "/api/auth/signup",
        json={
            "email": "dup@example.com",
            "username": "user2",
            "password": "secret123",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "El email ya esta registrado"


def test_signup_rejects_duplicate_username(client, db_session):
    _create_user(db_session, email="unique@example.com", username="dupuser")

    response = client.post(
        "/api/auth/signup",
        json={
            "email": "new@example.com",
            "username": "dupuser",
            "password": "secret123",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "El nombre de usuario ya esta en uso"


def test_login_rejects_invalid_password(client, db_session):
    _create_user(db_session, email="bob@example.com", username="bob")

    response = client.post(
        "/api/auth/login",
        json={"email": "bob@example.com", "password": "wrongpass"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Email o contrasena incorrectos"


def test_auth_me_authenticated_and_unauthenticated(client, db_session):
    user = _create_user(db_session, email="eve@example.com", username="eve")

    unauth_response = client.get("/api/auth/me")
    assert unauth_response.status_code == 200
    assert unauth_response.json() == {"authenticated": False, "user": None}

    auth_response = client.get("/api/auth/me", headers=_auth_headers(user))
    assert auth_response.status_code == 200
    auth_data = auth_response.json()
    assert auth_data["authenticated"] is True
    assert auth_data["user"]["email"] == user.email


def test_get_active_round_none(client):
    response = client.get("/api/rounds/active")
    assert response.status_code == 200
    assert response.json() is None


def test_get_active_round_with_matchups(client, db_session):
    round_obj = _create_round(db_session, name="Jornada 5", is_active=True)
    player_a = _create_player(db_session, name="Player A", team="Team A")
    player_b = _create_player(db_session, name="Player B", team="Team B")
    player_c = _create_player(db_session, name="Player C", team="Team C")
    player_d = _create_player(db_session, name="Player D", team="Team D")

    _create_matchup(
        db_session,
        round_obj=round_obj,
        player_a=player_a,
        player_b=player_b,
        order=1,
    )
    _create_matchup(
        db_session,
        round_obj=round_obj,
        player_a=player_c,
        player_b=player_d,
        order=2,
    )

    response = client.get("/api/rounds/active")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == round_obj.id
    assert data["is_active"] is True
    assert len(data["matchups"]) == 2
    assert [m["order"] for m in data["matchups"]] == [1, 2]


def test_create_prediction_requires_all_matchups(client, db_session):
    user = _create_user(db_session)
    round_obj = _create_round(db_session, is_active=True)
    player_a = _create_player(db_session, name="Player A", team="Team A")
    player_b = _create_player(db_session, name="Player B", team="Team B")
    player_c = _create_player(db_session, name="Player C", team="Team C")
    player_d = _create_player(db_session, name="Player D", team="Team D")

    matchup1 = _create_matchup(
        db_session,
        round_obj=round_obj,
        player_a=player_a,
        player_b=player_b,
        order=1,
    )
    _create_matchup(
        db_session,
        round_obj=round_obj,
        player_a=player_c,
        player_b=player_d,
        order=2,
    )

    response = client.post(
        "/api/predictions",
        headers=_auth_headers(user),
        json={
            "round_id": round_obj.id,
            "selections": {matchup1.id: "A"},
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Debes seleccionar todos los emparejamientos"


def test_create_prediction_rejects_invalid_selection(client, db_session):
    user = _create_user(db_session, email="invalid@example.com", username="invalid")
    round_obj = _create_round(db_session, is_active=True)
    player_a = _create_player(db_session, name="Player A", team="Team A")
    player_b = _create_player(db_session, name="Player B", team="Team B")

    matchup = _create_matchup(
        db_session,
        round_obj=round_obj,
        player_a=player_a,
        player_b=player_b,
        order=1,
    )

    response = client.post(
        "/api/predictions",
        headers=_auth_headers(user),
        json={
            "round_id": round_obj.id,
            "selections": {matchup.id: "C"},
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "La seleccion debe ser 'A' o 'B'"


def test_create_prediction_success_and_duplicate(client, db_session):
    user = _create_user(db_session, email="pred@example.com", username="pred")
    round_obj = _create_round(db_session, is_active=True)
    player_a = _create_player(db_session, name="Player A", team="Team A")
    player_b = _create_player(db_session, name="Player B", team="Team B")
    player_c = _create_player(db_session, name="Player C", team="Team C")
    player_d = _create_player(db_session, name="Player D", team="Team D")

    matchup1 = _create_matchup(
        db_session,
        round_obj=round_obj,
        player_a=player_a,
        player_b=player_b,
        order=1,
    )
    matchup2 = _create_matchup(
        db_session,
        round_obj=round_obj,
        player_a=player_c,
        player_b=player_d,
        order=2,
    )

    response = client.post(
        "/api/predictions",
        headers=_auth_headers(user),
        json={
            "round_id": round_obj.id,
            "selections": {matchup1.id: "A", matchup2.id: "B"},
        },
    )

    assert response.status_code == 200

    duplicate_response = client.post(
        "/api/predictions",
        headers=_auth_headers(user),
        json={
            "round_id": round_obj.id,
            "selections": {matchup1.id: "A", matchup2.id: "B"},
        },
    )

    assert duplicate_response.status_code == 400
    assert (
        duplicate_response.json()["detail"]
        == "Ya has enviado predicciones para esta jornada"
    )


def test_prediction_detail_scoring(client, db_session):
    user = _create_user(db_session, email="detail@example.com", username="detail")
    round_obj = _create_round(db_session, is_active=True)
    player_a = _create_player(db_session, name="Player A", team="Team A")
    player_b = _create_player(db_session, name="Player B", team="Team B")
    player_c = _create_player(db_session, name="Player C", team="Team C")
    player_d = _create_player(db_session, name="Player D", team="Team D")

    matchup1 = _create_matchup(
        db_session,
        round_obj=round_obj,
        player_a=player_a,
        player_b=player_b,
        order=1,
        result="A",
    )
    matchup2 = _create_matchup(
        db_session,
        round_obj=round_obj,
        player_a=player_c,
        player_b=player_d,
        order=2,
        result="A",
    )

    prediction = Prediction(
        user_id=user.id,
        round_id=round_obj.id,
        selections=json.dumps({str(matchup1.id): "A", str(matchup2.id): "B"}),
    )
    db_session.add(prediction)
    db_session.commit()
    db_session.refresh(prediction)

    response = client.get(
        f"/api/predictions/{prediction.id}/detail",
        headers=_auth_headers(user),
    )

    assert response.status_code == 200
    data = response.json()
    assert data["correct_count"] == 1
    assert data["total_count"] == 2
    assert len(data["matchups"]) == 2
