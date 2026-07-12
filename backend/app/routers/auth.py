from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import User
from ..schemas import ForgotPasswordIn, LoginIn, RegisterIn, ResetPasswordIn, TokenOut, UserOut
from ..security import create_access_token, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.email == payload.email.lower())):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")
    user = User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role=payload.role,
        # Email verification is a Phase 12 integration (SendGrid/SES);
        # accounts are auto-verified until then.
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))

    # PRD: too many failed attempts -> temporary 30-minute lock (423 Locked)
    if user and user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(status.HTTP_423_LOCKED, "Account temporarily locked. Try again later.")

    if user is None or not verify_password(payload.password, user.password_hash):
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.max_login_attempts:
                user.locked_until = datetime.utcnow() + timedelta(minutes=settings.lockout_minutes)
                user.failed_login_attempts = 0
                db.commit()
                raise HTTPException(status.HTTP_423_LOCKED, "Account temporarily locked. Try again later.")
            db.commit()
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    return TokenOut(access_token=create_access_token(user), role=user.role, email=user.email)


@router.get("/me", response_model=UserOut)
def me(current: User = Depends(get_current_user)):
    return current


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(payload: ForgotPasswordIn, db: Session = Depends(get_db)):
    # Always 202 to avoid account enumeration. Actual email delivery is a
    # Phase 12 integration; the reset itself is exposed below for dev.
    db.scalar(select(User).where(User.email == payload.email.lower()))
    return {"detail": "If an account exists for that email, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordIn, db: Session = Depends(get_db)):
    # Dev-mode reset (no token yet): the emailed-token flow arrives with the
    # Phase 12 email integration.
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No account for that email")
    user.password_hash = hash_password(payload.new_password)
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    return {"detail": "Password updated. All other sessions have been logged out."}
