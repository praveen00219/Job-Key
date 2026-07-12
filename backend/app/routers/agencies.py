from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_role
from ..models import Agency, User
from ..security import get_current_user

router = APIRouter(prefix="/api/agencies", tags=["agencies"])

# PRD tier thresholds (placements) -> (tier name, platform fee %)
TIER_LADDER = [
    (0, "Worker Bee", 20),
    (11, "Honey Maker", 20),
    (51, "Queen's Guard", 18),
    (151, "Hive Legend", 15),
]


def tier_for(placements: int) -> tuple[str, int]:
    tier, fee = TIER_LADDER[0][1], TIER_LADDER[0][2]
    for threshold, name, pct in TIER_LADDER:
        if placements >= threshold:
            tier, fee = name, pct
    return tier, fee


class AgencyOut(BaseModel):
    id: int
    name: str
    vetting_status: str
    tier: str
    placements_count: int
    platform_fee_pct: int

    model_config = {"from_attributes": True}


class AgencyUpsert(BaseModel):
    name: str


def _serialize(agency: Agency) -> AgencyOut:
    tier, fee = tier_for(agency.placements_count)
    if agency.tier != tier:
        agency.tier = tier
    return AgencyOut(
        id=agency.id,
        name=agency.name,
        vetting_status=agency.vetting_status,
        tier=agency.tier,
        placements_count=agency.placements_count,
        platform_fee_pct=fee,
    )


def get_or_404(db: Session, current: User) -> Agency:
    agency = db.scalar(select(Agency).where(Agency.owner_id == current.id))
    if agency is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No agency profile yet — complete onboarding")
    return agency


@router.get("/me", response_model=AgencyOut)
def get_my_agency(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _serialize(get_or_404(db, current))


@router.put("/me", response_model=AgencyOut)
def upsert_my_agency(
    payload: AgencyUpsert,
    current: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    agency = db.scalar(select(Agency).where(Agency.owner_id == current.id))
    if agency is None:
        agency = Agency(owner_id=current.id, name=payload.name)
        db.add(agency)
    else:
        agency.name = payload.name
    db.commit()
    db.refresh(agency)
    return _serialize(agency)
