from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_role
from ..models import Company, User
from ..security import get_current_user

router = APIRouter(prefix="/api/companies", tags=["companies"])


class CompanyOut(BaseModel):
    id: int
    name: str
    industry: str
    size: str
    location: str
    description: str

    model_config = {"from_attributes": True}


class CompanyUpsert(BaseModel):
    name: str
    industry: str = ""
    size: str = ""
    location: str = ""
    description: str = ""


@router.get("/me", response_model=CompanyOut)
def get_my_company(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    company = db.scalar(select(Company).where(Company.owner_id == current.id))
    if company is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No company profile yet — complete onboarding")
    return company


@router.put("/me", response_model=CompanyOut)
def upsert_my_company(
    payload: CompanyUpsert,
    current: User = Depends(require_role("employer")),
    db: Session = Depends(get_db),
):
    company = db.scalar(select(Company).where(Company.owner_id == current.id))
    if company is None:
        company = Company(owner_id=current.id, **payload.model_dump())
        db.add(company)
    else:
        for field, value in payload.model_dump().items():
            setattr(company, field, value)
    db.commit()
    db.refresh(company)
    return company
