from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_role
from ..models import Application, Candidate, User, Vacancy
from ..schemas import ApplicationCreate, ApplicationOut
from ..security import get_current_user

router = APIRouter(prefix="/api/applications", tags=["applications"])


def _to_out(a: Application) -> ApplicationOut:
    out = ApplicationOut.model_validate(a)
    out.vacancy_title = a.vacancy.title
    out.company_name = a.vacancy.company.name
    return out


@router.get("", response_model=list[ApplicationOut])
def list_my_applications(current: User = Depends(require_role("candidate")), db: Session = Depends(get_db)):
    applications = db.scalars(
        select(Application).join(Application.candidate).where(Candidate.email == current.email)
    ).all()
    return [_to_out(a) for a in applications]


@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_vacancy(payload: ApplicationCreate, db: Session = Depends(get_db)):
    """Public: no auth required to apply (PRD flow C1 — candidates apply
    before/without creating a JobKey account; the account is tied by email)."""
    vacancy = db.get(Vacancy, payload.vacancy_id)
    if vacancy is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vacancy not found")

    candidate = db.scalar(select(Candidate).where(Candidate.email == payload.email))
    if candidate is None:
        candidate = Candidate(name=payload.name, email=payload.email, phone=payload.phone, source="Direct")
        db.add(candidate)
        db.flush()

    dup = db.scalar(
        select(Application).where(Application.vacancy_id == payload.vacancy_id, Application.candidate_id == candidate.id)
    )
    if dup:
        raise HTTPException(status.HTTP_409_CONFLICT, "You have already applied to this vacancy")

    application = Application(vacancy_id=payload.vacancy_id, candidate_id=candidate.id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return _to_out(application)


@router.post("/{application_id}/withdraw", response_model=ApplicationOut)
def withdraw_application(
    application_id: int, current: User = Depends(require_role("candidate")), db: Session = Depends(get_db)
):
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Application not found")
    if application.candidate.email != current.email:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your application")
    application.status = "Withdrawn"
    db.commit()
    db.refresh(application)
    return _to_out(application)
