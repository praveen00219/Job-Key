from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


# --- auth ---------------------------------------------------------------------


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    # Self-registration never grants admin (admin accounts are created by A9 tooling).
    role: Literal["employer", "recruiter", "candidate"] = "employer"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: str
    email: str


class UserOut(BaseModel):
    id: int
    email: str
    role: str
    is_verified: bool

    model_config = {"from_attributes": True}


class VerifyEmailIn(BaseModel):
    token: str


class ResendVerificationIn(BaseModel):
    email: EmailStr


class RefreshIn(BaseModel):
    refresh_token: str


class ForgotPasswordIn(BaseModel):
    email: EmailStr


class ResetPasswordIn(BaseModel):
    token: str
    new_password: str = Field(min_length=8)


class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)


# --- vacancies ------------------------------------------------------------------


class ScreeningQuestionOut(BaseModel):
    id: int
    text: str
    type: str
    required: bool
    knockout: bool

    model_config = {"from_attributes": True}


class VacancyOut(BaseModel):
    id: int
    slug: str
    title: str
    department: str
    employment_type: str
    workplace: str
    location: str
    salary_min: int | None
    salary_max: int | None
    salary_visible: bool
    status: str
    marketplace_enabled: bool
    access_mode: str
    posted_at: datetime
    applications_count: int = 0
    screening_questions: list[ScreeningQuestionOut] = []

    model_config = {"from_attributes": True}


class VacancyCreate(BaseModel):
    title: str
    department: str = ""
    employment_type: str = "Full-time"
    workplace: str = "Hybrid"
    location: str = ""
    salary_min: int | None = None
    salary_max: int | None = None
    salary_visible: bool = True
    description: str = ""
    requirements: str = ""
    skills: str = ""
    marketplace_enabled: bool = True
    access_mode: str = "Open Marketplace"
    status: str = "Active"


class VacancyUpdate(BaseModel):
    title: str | None = None
    status: str | None = None
    marketplace_enabled: bool | None = None
    access_mode: str | None = None


# --- candidates -------------------------------------------------------------------


class CandidateOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    linkedin_url: str | None
    current_role: str
    current_company: str
    location: str
    skills: str
    source: str
    match_pct: int

    model_config = {"from_attributes": True}


class CandidateCreate(BaseModel):
    name: str
    email: str = ""
    phone: str = ""
    linkedin_url: str | None = None
    current_role: str = ""
    current_company: str = ""
    location: str = ""
    skills: str = ""
    source: str = "Direct"


# --- submissions ------------------------------------------------------------------


class SubmissionOut(BaseModel):
    id: int
    vacancy_id: int
    candidate_id: int
    commission_pct: float
    notes: str
    status: str
    submitted_at: datetime
    candidate_name: str = ""
    vacancy_title: str = ""

    model_config = {"from_attributes": True}


class SubmissionCreate(BaseModel):
    vacancy_id: int
    candidate_id: int
    commission_pct: float = Field(ge=8, le=25)  # PRD bid range
    notes: str = ""
    consent_confirmed: bool


class SubmissionStatusUpdate(BaseModel):
    status: str


# --- offers ------------------------------------------------------------------------


class OfferOut(BaseModel):
    id: int
    vacancy_id: int
    candidate_id: int
    base_salary: int
    bonus: str
    benefits: str
    start_date: str
    contract_type: str
    status: str
    candidate_name: str = ""
    vacancy_title: str = ""

    model_config = {"from_attributes": True}


class OfferRespond(BaseModel):
    action: str  # accept | reject | counter
    message: str = ""


# --- applications (organic, candidate-facing) --------------------------------------


class ApplicationOut(BaseModel):
    id: int
    vacancy_id: int
    status: str
    applied_at: datetime
    vacancy_title: str = ""
    company_name: str = ""

    model_config = {"from_attributes": True}


class ApplicationCreate(BaseModel):
    vacancy_id: int
    name: str
    email: str
    phone: str = ""
    answers: dict[int, str] = {}


# --- invoices -----------------------------------------------------------------------


class InvoiceOut(BaseModel):
    id: int
    number: str
    candidate_name: str
    vacancy_title: str
    commission_pct: float
    gross_commission: int
    vat: int
    total: int
    due_date: str
    status: str

    model_config = {"from_attributes": True}
