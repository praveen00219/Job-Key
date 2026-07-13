from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_role
from ..models import Candidate, Company, Offer, User, Vacancy
from ..pagination import Page, PageParams, paginate
from ..schemas import OfferOut, OfferRespond
from ..security import get_current_user

router = APIRouter(prefix="/api/offers", tags=["offers"])


def _to_out(o: Offer) -> OfferOut:
    out = OfferOut.model_validate(o)
    out.candidate_name = o.candidate.name
    out.vacancy_title = o.vacancy.title
    return out


@router.get("", response_model=Page[OfferOut])
def list_offers(
    params: PageParams = Depends(),
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Candidate-facing: offers for candidates matching this user's email.
    # Employer-facing: offers on this user's own vacancies.
    if current.role == "candidate":
        stmt = select(Offer).join(Offer.candidate).where(Candidate.email == current.email)
    else:
        stmt = select(Offer).join(Offer.vacancy).join(Vacancy.company).where(Company.owner_id == current.id)
    rows, total = paginate(db, stmt.order_by(Offer.created_at.desc()), params)
    return Page(items=[_to_out(o) for o in rows], total=total, page=params.page, size=params.size)


@router.post("/{offer_id}/respond", response_model=OfferOut)
def respond_to_offer(
    offer_id: int,
    payload: OfferRespond,
    current: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    offer = db.get(Offer, offer_id)
    if offer is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Offer not found")
    if offer.candidate.email != current.email:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your offer")
    if offer.status != "Pending":
        raise HTTPException(status.HTTP_409_CONFLICT, "This offer has already been responded to")

    if payload.action == "accept":
        offer.status = "Accepted"
    elif payload.action == "reject":
        offer.status = "Rejected"
    elif payload.action == "counter":
        offer.status = "Countered"
        offer.counter_message = payload.message
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "action must be accept, reject, or counter")

    db.commit()
    db.refresh(offer)
    return _to_out(offer)
