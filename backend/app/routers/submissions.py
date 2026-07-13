from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_role
from ..models import Candidate, Submission, User, Vacancy, WatchlistItem
from ..pagination import Page, PageParams, paginate
from ..routers.agencies import get_or_404
from ..schemas import SubmissionCreate, SubmissionOut, SubmissionStatusUpdate
from ..security import get_current_user

router = APIRouter(tags=["submissions"])


def _to_out(s: Submission) -> SubmissionOut:
    out = SubmissionOut.model_validate(s)
    out.candidate_name = s.candidate.name
    out.vacancy_title = s.vacancy.title
    return out


@router.get("/api/submissions", response_model=Page[SubmissionOut])
def list_submissions(
    params: PageParams = Depends(),
    current: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    agency = get_or_404(db, current)
    stmt = select(Submission).where(Submission.agency_id == agency.id).order_by(Submission.submitted_at.desc())
    rows, total = paginate(db, stmt, params)
    return Page(items=[_to_out(s) for s in rows], total=total, page=params.page, size=params.size)


@router.post("/api/submissions", response_model=SubmissionOut, status_code=status.HTTP_201_CREATED)
def create_submission(
    payload: SubmissionCreate,
    current: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    agency = get_or_404(db, current)
    if not payload.consent_confirmed:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Candidate consent must be confirmed before submitting")

    vacancy = db.get(Vacancy, payload.vacancy_id)
    candidate = db.get(Candidate, payload.candidate_id)
    if vacancy is None or candidate is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vacancy or candidate not found")

    # PRD duplicate rule: same candidate+vacancy is blocked outright.
    dup = db.scalar(
        select(Submission).where(
            Submission.vacancy_id == payload.vacancy_id, Submission.candidate_id == payload.candidate_id
        )
    )
    if dup:
        raise HTTPException(status.HTTP_409_CONFLICT, "This candidate has already been submitted to this vacancy")

    submission = Submission(
        vacancy_id=payload.vacancy_id,
        candidate_id=payload.candidate_id,
        agency_id=agency.id,
        commission_pct=payload.commission_pct,
        notes=payload.notes,
        consent_confirmed=payload.consent_confirmed,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return _to_out(submission)


@router.patch("/api/submissions/{submission_id}/status", response_model=SubmissionOut)
def update_submission_status(
    submission_id: int,
    payload: SubmissionStatusUpdate,
    current: User = Depends(require_role("employer")),
    db: Session = Depends(get_db),
):
    submission = db.get(Submission, submission_id)
    if submission is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Submission not found")
    if submission.vacancy.company.owner_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your vacancy")
    submission.status = payload.status
    if payload.status == "Placed":
        submission.agency.placements_count += 1
    db.commit()
    db.refresh(submission)
    return _to_out(submission)


# --- watchlist (PRD flow R2) --------------------------------------------------


@router.get("/api/watchlist", response_model=list[int])
def get_watchlist(current: User = Depends(require_role("recruiter")), db: Session = Depends(get_db)):
    agency = get_or_404(db, current)
    items = db.scalars(select(WatchlistItem).where(WatchlistItem.agency_id == agency.id)).all()
    return [i.vacancy_id for i in items]


@router.post("/api/watchlist/{vacancy_id}", status_code=status.HTTP_204_NO_CONTENT)
def add_to_watchlist(
    vacancy_id: int, current: User = Depends(require_role("recruiter")), db: Session = Depends(get_db)
):
    agency = get_or_404(db, current)
    exists = db.scalar(
        select(WatchlistItem).where(WatchlistItem.agency_id == agency.id, WatchlistItem.vacancy_id == vacancy_id)
    )
    if not exists:
        db.add(WatchlistItem(agency_id=agency.id, vacancy_id=vacancy_id))
        db.commit()


@router.delete("/api/watchlist/{vacancy_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_watchlist(
    vacancy_id: int, current: User = Depends(require_role("recruiter")), db: Session = Depends(get_db)
):
    agency = get_or_404(db, current)
    item = db.scalar(
        select(WatchlistItem).where(WatchlistItem.agency_id == agency.id, WatchlistItem.vacancy_id == vacancy_id)
    )
    if item:
        db.delete(item)
        db.commit()
