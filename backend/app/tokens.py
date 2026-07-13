"""Single-use auth tokens (module A1): email verification, password reset,
and rotating refresh tokens. Raw tokens go to the user (dev: console log);
only SHA-256 hashes are stored."""

import hashlib
import secrets
from datetime import timedelta

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from .config import settings
from .models import AuthToken, User
from .timeutils import utcnow

PURPOSE_TTL = {
    "verify_email": timedelta(hours=settings.verify_token_expires_hours),
    "password_reset": timedelta(minutes=settings.reset_token_expires_minutes),
    "refresh": timedelta(days=settings.refresh_expires_days),
}

# Dev-mode only: remembers the latest raw token per (email, purpose) so the
# dev-token endpoint and E2E tests can complete flows without an email
# provider (arrives in A10). Never populated when dev_mode is off.
_dev_last_tokens: dict[tuple[str, str], str] = {}


def _hash(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()


def issue_token(db: Session, user: User, purpose: str) -> str:
    raw = secrets.token_urlsafe(32)
    db.add(
        AuthToken(
            user_id=user.id,
            purpose=purpose,
            token_hash=_hash(raw),
            expires_at=utcnow() + PURPOSE_TTL[purpose],
        )
    )
    db.commit()
    if settings.dev_mode:
        _dev_last_tokens[(user.email, purpose)] = raw
        if purpose != "refresh":
            # Stand-in for email delivery until module A10.
            print(f"[dev-mail] {purpose} token for {user.email}: {raw}")
    return raw


def consume_token(db: Session, raw: str, purpose: str) -> User | None:
    """Validate a raw token and mark it used. Returns its user, or None if
    the token is unknown, wrong-purpose, expired, or already used."""
    token = db.scalar(
        select(AuthToken).where(AuthToken.token_hash == _hash(raw), AuthToken.purpose == purpose)
    )
    if token is None or token.used_at is not None or token.expires_at < utcnow():
        return None
    token.used_at = utcnow()
    db.commit()
    return db.get(User, token.user_id)


def revoke_tokens(db: Session, user_id: int, purpose: str) -> None:
    """Mark all of a user's outstanding tokens of one purpose as used
    (e.g. kill every refresh token after a password reset)."""
    db.execute(
        update(AuthToken)
        .where(AuthToken.user_id == user_id, AuthToken.purpose == purpose, AuthToken.used_at.is_(None))
        .values(used_at=utcnow())
    )
    db.commit()


def dev_peek_token(email: str, purpose: str) -> str | None:
    """Dev-mode only: latest raw token issued for (email, purpose)."""
    return _dev_last_tokens.get((email, purpose))
