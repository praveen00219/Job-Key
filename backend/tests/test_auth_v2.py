"""Module A1: token lifecycle, refresh rotation, session invalidation."""

from datetime import timedelta

from app.models import AuthToken
from app.timeutils import utcnow
from tests.conftest import login, make_user


def _register(client, email):
    res = client.post("/api/auth/register", json={"email": email, "password": "password123"})
    assert res.status_code == 201
    return client.get("/api/auth/dev/token", params={"email": email, "purpose": "verify_email"}).json()["token"]


def test_verify_token_is_single_use(client):
    token = _register(client, "once@test.dev")
    assert client.post("/api/auth/verify-email", json={"token": token}).status_code == 200
    assert client.post("/api/auth/verify-email", json={"token": token}).status_code == 400


def test_verify_bad_token_400(client):
    assert client.post("/api/auth/verify-email", json={"token": "garbage"}).status_code == 400


def test_expired_token_rejected(client, db_session):
    _register(client, "expired@test.dev")
    db_session.query(AuthToken).update({"expires_at": utcnow() - timedelta(minutes=1)})
    db_session.commit()
    token = client.get(
        "/api/auth/dev/token", params={"email": "expired@test.dev", "purpose": "verify_email"}
    ).json()["token"]
    assert client.post("/api/auth/verify-email", json={"token": token}).status_code == 400


def test_register_admin_role_rejected(client):
    res = client.post(
        "/api/auth/register", json={"email": "evil@test.dev", "password": "password123", "role": "admin"}
    )
    assert res.status_code == 422


def test_refresh_rotation(client, db_session):
    make_user(db_session, "rot@test.dev", "employer")
    res = client.post("/api/auth/login", json={"email": "rot@test.dev", "password": "password123"})
    first_refresh = res.json()["refresh_token"]

    # First use succeeds and returns a NEW refresh token
    res = client.post("/api/auth/refresh", json={"refresh_token": first_refresh})
    assert res.status_code == 200
    second_refresh = res.json()["refresh_token"]
    assert second_refresh != first_refresh

    # The consumed token is dead (single-use rotation)
    assert client.post("/api/auth/refresh", json={"refresh_token": first_refresh}).status_code == 401
    # The new one works
    assert client.post("/api/auth/refresh", json={"refresh_token": second_refresh}).status_code == 200


def test_password_reset_flow_invalidates_sessions(client, db_session):
    """B2 regression: reset now requires the emailed token, and a successful
    reset kills every outstanding access + refresh token."""
    make_user(db_session, "reset@test.dev", "employer")
    res = client.post("/api/auth/login", json={"email": "reset@test.dev", "password": "password123"})
    old_access = {"Authorization": f"Bearer {res.json()['access_token']}"}
    old_refresh = res.json()["refresh_token"]

    # Tokenless reset is impossible now (schema requires token)
    assert (
        client.post("/api/auth/reset-password", json={"email": "reset@test.dev", "new_password": "newpass123"}).status_code
        == 422
    )

    client.post("/api/auth/forgot-password", json={"email": "reset@test.dev"})
    token = client.get(
        "/api/auth/dev/token", params={"email": "reset@test.dev", "purpose": "password_reset"}
    ).json()["token"]
    res = client.post("/api/auth/reset-password", json={"token": token, "new_password": "newpass123"})
    assert res.status_code == 200

    # Old access token invalidated (token_version bump), old refresh revoked
    assert client.get("/api/auth/me", headers=old_access).status_code == 401
    assert client.post("/api/auth/refresh", json={"refresh_token": old_refresh}).status_code == 401

    # Old password dead, new one works
    assert client.post("/api/auth/login", json={"email": "reset@test.dev", "password": "password123"}).status_code == 401
    assert client.post("/api/auth/login", json={"email": "reset@test.dev", "password": "newpass123"}).status_code == 200


def test_change_password_returns_fresh_pair_and_kills_old_session(client, db_session):
    make_user(db_session, "chg@test.dev", "employer")
    res = client.post("/api/auth/login", json={"email": "chg@test.dev", "password": "password123"})
    old_access = {"Authorization": f"Bearer {res.json()['access_token']}"}

    res = client.patch(
        "/api/auth/password",
        json={"current_password": "password123", "new_password": "changed456"},
        headers=old_access,
    )
    assert res.status_code == 200
    new_access = {"Authorization": f"Bearer {res.json()['access_token']}"}

    assert client.get("/api/auth/me", headers=old_access).status_code == 401
    assert client.get("/api/auth/me", headers=new_access).status_code == 200


def test_change_password_wrong_current_400(client, db_session):
    make_user(db_session, "wrongcur@test.dev", "employer")
    headers = login(client, "wrongcur@test.dev")
    res = client.patch(
        "/api/auth/password",
        json={"current_password": "not-my-password", "new_password": "changed456"},
        headers=headers,
    )
    assert res.status_code == 400


def test_logout_revokes_refresh_tokens(client, db_session):
    make_user(db_session, "out@test.dev", "employer")
    res = client.post("/api/auth/login", json={"email": "out@test.dev", "password": "password123"})
    headers = {"Authorization": f"Bearer {res.json()['access_token']}"}
    refresh = res.json()["refresh_token"]

    assert client.post("/api/auth/logout", headers=headers).status_code == 204
    assert client.post("/api/auth/refresh", json={"refresh_token": refresh}).status_code == 401


def test_resend_verification_invalidates_previous_link(client):
    first = _register(client, "resend@test.dev")
    client.post("/api/auth/resend-verification", json={"email": "resend@test.dev"})
    second = client.get(
        "/api/auth/dev/token", params={"email": "resend@test.dev", "purpose": "verify_email"}
    ).json()["token"]
    assert first != second
    assert client.post("/api/auth/verify-email", json={"token": first}).status_code == 400
    assert client.post("/api/auth/verify-email", json={"token": second}).status_code == 200
