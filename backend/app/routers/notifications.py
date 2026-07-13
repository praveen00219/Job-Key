from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Notification, User
from ..pagination import Page, PageParams, paginate
from ..security import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


class NotificationOut(BaseModel):
    id: int
    title: str
    body: str
    is_read: bool

    model_config = {"from_attributes": True}


@router.get("", response_model=Page[NotificationOut])
def list_notifications(
    params: PageParams = Depends(),
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Notification).where(Notification.user_id == current.id).order_by(Notification.created_at.desc())
    rows, total = paginate(db, stmt, params)
    return Page(items=rows, total=total, page=params.page, size=params.size)


@router.post("/mark-all-read", status_code=204)
def mark_all_read(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notifications = db.scalars(select(Notification).where(Notification.user_id == current.id, Notification.is_read.is_(False))).all()
    for n in notifications:
        n.is_read = True
    db.commit()
