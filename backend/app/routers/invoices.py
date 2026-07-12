from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_role
from ..models import Company, Invoice, Submission, User
from ..schemas import InvoiceOut
from ..security import get_current_user

router = APIRouter(tags=["invoices"])

PAYOUT_MINIMUM = 500  # PRD: minimum payout threshold (£)


@router.get("/api/invoices", response_model=list[InvoiceOut])
def list_invoices(current: User = Depends(require_role("employer")), db: Session = Depends(get_db)):
    company = db.scalar(select(Company).where(Company.owner_id == current.id))
    if company is None:
        return []
    return db.scalars(select(Invoice).where(Invoice.company_id == company.id)).all()


class EarningsSummary(BaseModel):
    available_balance: int
    pending: int
    total_earned: int
    total_placements: int
    payout_minimum: int = PAYOUT_MINIMUM


@router.get("/api/earnings/summary", response_model=EarningsSummary)
def earnings_summary(current: User = Depends(require_role("recruiter")), db: Session = Depends(get_db)):
    from ..routers.agencies import get_or_404

    agency = get_or_404(db, current)
    placed = db.scalars(select(Submission).where(Submission.agency_id == agency.id, Submission.status == "Placed")).all()
    # Simplified: commission earned = commission_pct against a flat 50k reference
    # salary until Vacancy.salary is wired into the placement record.
    total_earned = sum(int(s.commission_pct / 100 * 50000) for s in placed)
    return EarningsSummary(
        available_balance=total_earned,
        pending=0,
        total_earned=total_earned,
        total_placements=len(placed),
    )


class PayoutRequest(BaseModel):
    amount: int


@router.post("/api/payouts/request", status_code=status.HTTP_202_ACCEPTED)
def request_payout(payload: PayoutRequest, current: User = Depends(require_role("recruiter"))):
    if payload.amount < PAYOUT_MINIMUM:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Minimum payout is £{PAYOUT_MINIMUM}")
    # Stripe Connect payout wiring lands in Phase 12.
    return {"detail": "Payout requested. Processed within 3-5 business days."}
