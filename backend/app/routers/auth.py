from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import User
from ..schemas import (
    ChangePasswordIn,
    ForgotPasswordIn,
    LoginIn,
    RefreshIn,
    RegisterIn,
    ResendVerificationIn,
    ResetPasswordIn,
    TokenOut,
    UserOut,
    VerifyEmailIn,
)
from ..security import create_access_token, get_current_user, hash_password, verify_password
from ..timeutils import utcnow
from ..tokens import consume_token, dev_peek_token, issue_token, revoke_tokens

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _token_response(db: Session, user: User) -> TokenOut:
    return TokenOut(
        access_token=create_access_token(user),
        refresh_token=issue_token(db, user, "refresh"),
        role=user.role,
        email=user.email,
    )


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.email == payload.email.lower())):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")
    user = User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role=payload.role,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    issue_token(db, user, "verify_email")  # delivery = dev log until A10 email lands
    return user


@router.post("/verify-email", response_model=UserOut)
def verify_email(payload: VerifyEmailIn, db: Session = Depends(get_db)):
    user = consume_token(db, payload.token, "verify_email")
    if user is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Verification link is invalid or has expired")
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user


@router.post("/resend-verification", status_code=status.HTTP_202_ACCEPTED)
def resend_verification(payload: ResendVerificationIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user and not user.is_verified:
        revoke_tokens(db, user.id, "verify_email")
        issue_token(db, user, "verify_email")
    # Always 202 to avoid account enumeration.
    return {"detail": "If an unverified account exists for that email, a new link has been sent."}


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))

    # PRD: too many failed attempts -> temporary 30-minute lock (423 Locked)
    if user and user.locked_until and user.locked_until > utcnow():
        raise HTTPException(status.HTTP_423_LOCKED, "Account temporarily locked. Try again later.")

    if user is None or not verify_password(payload.password, user.password_hash):
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.max_login_attempts:
                user.locked_until = utcnow() + timedelta(minutes=settings.lockout_minutes)
                user.failed_login_attempts = 0
                db.commit()
                raise HTTPException(status.HTTP_423_LOCKED, "Account temporarily locked. Try again later.")
            db.commit()
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    if not user.is_verified:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Email not verified")

    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    return _token_response(db, user)


@router.post("/refresh", response_model=TokenOut)
def refresh(payload: RefreshIn, db: Session = Depends(get_db)):
    """Rotate a refresh token: the presented token is consumed (single-use)
    and a fresh access + refresh pair is issued."""
    user = consume_token(db, payload.refresh_token, "refresh")
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token is invalid or has expired")
    return _token_response(db, user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Revoke all outstanding refresh tokens; the access token simply expires."""
    revoke_tokens(db, current.id, "refresh")


@router.get("/me", response_model=UserOut)
def me(current: User = Depends(get_current_user)):
    return current


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(payload: ForgotPasswordIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user:
        revoke_tokens(db, user.id, "password_reset")
        issue_token(db, user, "password_reset")
    # Always 202 to avoid account enumeration.
    return {"detail": "If an account exists for that email, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordIn, db: Session = Depends(get_db)):
    """Tokened reset (closes audit finding B2): requires the single-use link
    token; bumps token_version so every existing session dies."""
    user = consume_token(db, payload.token, "password_reset")
    if user is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Reset link is invalid or has expired")
    user.password_hash = hash_password(payload.new_password)
    user.token_version += 1
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    revoke_tokens(db, user.id, "refresh")
    return {"detail": "Password updated. All sessions have been logged out."}


@router.patch("/password", response_model=TokenOut)
def change_password(
    payload: ChangePasswordIn,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Authenticated password change; invalidates every other session and
    returns a fresh token pair so the caller stays logged in."""
    if not verify_password(payload.current_password, current.password_hash):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Current password is incorrect")
    current.password_hash = hash_password(payload.new_password)
    current.token_version += 1
    db.commit()
    revoke_tokens(db, current.id, "refresh")
    return _token_response(db, current)


if settings.dev_mode:

    @router.get("/dev/token")
    def dev_token(email: str, purpose: str):
        """Dev-mode only (guarded by settings.dev_mode): expose the latest raw
        token so flows can be completed before A10's email integration."""
        raw = dev_peek_token(email.lower(), purpose)
        if raw is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No token issued for that email/purpose")
        return {"token": raw}
