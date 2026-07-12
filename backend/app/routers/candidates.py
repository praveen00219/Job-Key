from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_role
from ..models import Agency, Candidate, User
from ..routers.agencies import get_or_404
from ..schemas import CandidateCreate, CandidateOut
from ..security import get_current_user

router = APIRouter(prefix="/api/candidates", tags=["candidates"])


@router.get("", response_model=list[CandidateOut])
def list_candidates(
    q: str | None = None,
    current: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    agency = get_or_404(db, current)
    stmt = select(Candidate).where(Candidate.agency_id == agency.id)
    if q:
        stmt = stmt.where(Candidate.name.ilike(f"%{q}%"))
    return db.scalars(stmt.order_by(Candidate.created_at.desc())).all()


@router.get("/{candidate_id}", response_model=CandidateOut)
def get_candidate(candidate_id: int, current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    candidate = db.get(Candidate, candidate_id)
    if candidate is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Candidate not found")
    return candidate


@router.post("", response_model=CandidateOut, status_code=status.HTTP_201_CREATED)
def create_candidate(
    payload: CandidateCreate,
    current: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    agency = get_or_404(db, current)
    if payload.linkedin_url:
        # PRD: LinkedIn URL is the duplicate-detection key within an agency's CRM
        dup = db.scalar(
            select(Candidate).where(
                Candidate.agency_id == agency.id, Candidate.linkedin_url == payload.linkedin_url
            )
        )
        if dup:
            raise HTTPException(status.HTTP_409_CONFLICT, "This candidate is already in your CRM")
    candidate = Candidate(agency_id=agency.id, **payload.model_dump())
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


@router.get("/check-duplicate/by-linkedin", response_model=CandidateOut | None)
def check_duplicate(
    linkedin_url: str,
    current: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    """Used by the Chrome extension's CE4 duplicate-detection flow."""
    agency = get_or_404(db, current)
    return db.scalar(
        select(Candidate).where(Candidate.agency_id == agency.id, Candidate.linkedin_url == linkedin_url)
    )
