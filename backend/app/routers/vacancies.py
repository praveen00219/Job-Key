import re

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_role
from ..models import Application, Company, ScreeningQuestion, User, Vacancy
from ..pagination import Page, PageParams, paginate
from ..schemas import ScreeningQuestionOut, VacancyCreate, VacancyOut, VacancyUpdate
from ..security import get_current_user

router = APIRouter(prefix="/api/vacancies", tags=["vacancies"])


def _slugify(title: str, db: Session) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") or "vacancy"
    slug = base
    n = 1
    while db.scalar(select(Vacancy).where(Vacancy.slug == slug)):
        n += 1
        slug = f"{base}-{n}"
    return slug


def _to_out(v: Vacancy, db: Session) -> VacancyOut:
    count = db.scalar(select(func.count()).select_from(Application).where(Application.vacancy_id == v.id)) or 0
    out = VacancyOut.model_validate(v)
    out.applications_count = count
    out.screening_questions = [ScreeningQuestionOut.model_validate(q) for q in v.screening_questions]
    return out


@router.get("", response_model=Page[VacancyOut])
def list_vacancies(
    marketplace: bool = False,
    status_filter: str | None = None,
    params: PageParams = Depends(),
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    """List vacancies. `marketplace=true` returns every agency-visible vacancy
    (recruiter Browse tab); otherwise scoped to the current employer's own company.
    """
    stmt = select(Vacancy)
    if marketplace:
        stmt = stmt.where(Vacancy.marketplace_enabled.is_(True), Vacancy.status == "Active")
    else:
        company = db.scalar(select(Company).where(Company.owner_id == current.id))
        if company is None:
            return Page(items=[], total=0, page=params.page, size=params.size)
        stmt = stmt.where(Vacancy.company_id == company.id)
    if status_filter:
        stmt = stmt.where(Vacancy.status == status_filter)
    rows, total = paginate(db, stmt.order_by(Vacancy.posted_at.desc()), params)
    return Page(items=[_to_out(v, db) for v in rows], total=total, page=params.page, size=params.size)


@router.get("/{vacancy_id}", response_model=VacancyOut)
def get_vacancy(vacancy_id: int, db: Session = Depends(get_db)):
    vacancy = db.get(Vacancy, vacancy_id)
    if vacancy is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vacancy not found")
    return _to_out(vacancy, db)


@router.get("/by-slug/{slug}", response_model=VacancyOut)
def get_vacancy_by_slug(slug: str, db: Session = Depends(get_db)):
    vacancy = db.scalar(select(Vacancy).where(Vacancy.slug == slug))
    if vacancy is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vacancy not found")
    return _to_out(vacancy, db)


@router.post("", response_model=VacancyOut, status_code=status.HTTP_201_CREATED)
def create_vacancy(
    payload: VacancyCreate,
    current: User = Depends(require_role("employer")),
    db: Session = Depends(get_db),
):
    company = db.scalar(select(Company).where(Company.owner_id == current.id))
    if company is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Complete your company profile before posting a vacancy")
    vacancy = Vacancy(company_id=company.id, slug=_slugify(payload.title, db), **payload.model_dump())
    db.add(vacancy)
    db.commit()
    db.refresh(vacancy)
    return _to_out(vacancy, db)


@router.patch("/{vacancy_id}", response_model=VacancyOut)
def update_vacancy(
    vacancy_id: int,
    payload: VacancyUpdate,
    current: User = Depends(require_role("employer")),
    db: Session = Depends(get_db),
):
    vacancy = db.get(Vacancy, vacancy_id)
    if vacancy is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vacancy not found")
    if vacancy.company.owner_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your vacancy")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(vacancy, field, value)
    db.commit()
    db.refresh(vacancy)
    return _to_out(vacancy, db)


@router.delete("/{vacancy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vacancy(
    vacancy_id: int,
    current: User = Depends(require_role("employer")),
    db: Session = Depends(get_db),
):
    vacancy = db.get(Vacancy, vacancy_id)
    if vacancy is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vacancy not found")
    if vacancy.company.owner_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your vacancy")
    db.delete(vacancy)
    db.commit()


@router.post("/{vacancy_id}/screening-questions", response_model=ScreeningQuestionOut, status_code=status.HTTP_201_CREATED)
def add_screening_question(
    vacancy_id: int,
    text: str,
    type: str = "Text",
    required: bool = False,
    knockout: bool = False,
    current: User = Depends(require_role("employer")),
    db: Session = Depends(get_db),
):
    vacancy = db.get(Vacancy, vacancy_id)
    if vacancy is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vacancy not found")
    if vacancy.company.owner_id != current.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your vacancy")
    existing = db.scalar(select(func.count()).select_from(ScreeningQuestion).where(ScreeningQuestion.vacancy_id == vacancy_id))
    if existing >= 10:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Maximum 10 screening questions per vacancy")
    question = ScreeningQuestion(
        vacancy_id=vacancy_id, text=text, type=type, required=required, knockout=knockout, order=existing
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question
