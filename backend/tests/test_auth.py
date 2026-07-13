from app.config import settings
from tests.conftest import login, make_user


def test_register_verify_then_login(client):
    """A1 flow: register -> unverified login blocked -> verify -> login OK."""
    res = client.post("/api/auth/register", json={"email": "new@test.dev", "password": "password123"})
    assert res.status_code == 201
    assert res.json()["role"] == "employer"
    assert res.json()["is_verified"] is False

    # Login before verification is refused
    res = client.post("/api/auth/login", json={"email": "new@test.dev", "password": "password123"})
    assert res.status_code == 403

    # Complete verification via the dev-mode token lookup (email lands in A10)
    token = client.get("/api/auth/dev/token", params={"email": "new@test.dev", "purpose": "verify_email"}).json()["token"]
    res = client.post("/api/auth/verify-email", json={"token": token})
    assert res.status_code == 200
    assert res.json()["is_verified"] is True

    res = client.post("/api/auth/login", json={"email": "new@test.dev", "password": "password123"})
    assert res.status_code == 200
    body = res.json()
    assert body["access_token"] and body["refresh_token"]
    assert body["email"] == "new@test.dev"


def test_register_duplicate_email_conflicts(client):
    client.post("/api/auth/register", json={"email": "dup@test.dev", "password": "password123"})
    res = client.post("/api/auth/register", json={"email": "dup@test.dev", "password": "password123"})
    assert res.status_code == 409


def test_login_wrong_password_401(client, db_session):
    make_user(db_session, "u@test.dev", "employer")
    res = client.post("/api/auth/login", json={"email": "u@test.dev", "password": "nope-nope"})
    assert res.status_code == 401


def test_rule_login_lockout_after_max_attempts(client, db_session):
    """PRD: 5 failed attempts -> temporary lock (423), even with the right password."""
    make_user(db_session, "lock@test.dev", "employer")
    for _ in range(settings.max_login_attempts - 1):
        res = client.post("/api/auth/login", json={"email": "lock@test.dev", "password": "wrong"})
        assert res.status_code == 401
    res = client.post("/api/auth/login", json={"email": "lock@test.dev", "password": "wrong"})
    assert res.status_code == 423
    res = client.post("/api/auth/login", json={"email": "lock@test.dev", "password": "password123"})
    assert res.status_code == 423


def test_me_requires_token(client):
    assert client.get("/api/auth/me").status_code == 401


def test_me_returns_current_user(client, db_session):
    make_user(db_session, "me@test.dev", "recruiter")
    headers = login(client, "me@test.dev")
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["email"] == "me@test.dev"
    assert res.json()["role"] == "recruiter"


def test_validation_error_envelope_is_flat_detail_string(client):
    res = client.post("/api/auth/register", json={"email": "not-an-email", "password": "short"})
    assert res.status_code == 422
    detail = res.json()["detail"]
    assert isinstance(detail, str) and detail
