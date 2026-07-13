from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base
from .timeutils import utcnow

USER_ROLES = ("employer", "recruiter", "candidate", "admin")  # admin issued only by A9 tooling


class User(Base):
    """Employer, Recruiter, or Candidate account (admin arrives in module A9)."""

    __tablename__ = "users"
    __table_args__ = (CheckConstraint(f"role IN {USER_ROLES}", name="ck_users_role"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="employer")
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    # Bumped on password reset/change: access tokens carry this as `ver`, so a
    # bump instantly invalidates every outstanding session (A1).
    token_version: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    company: Mapped["Company | None"] = relationship(back_populates="owner", uselist=False)
    agency: Mapped["Agency | None"] = relationship(back_populates="owner", uselist=False)


class AuthToken(Base):
    """Single-use, expiring tokens: email verification, password reset, and
    refresh tokens (rotated on every use). Only the SHA-256 of the raw token
    is stored."""

    __tablename__ = "auth_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    purpose: Mapped[str] = mapped_column(String(20))  # verify_email | password_reset | refresh
    token_hash: Mapped[str] = mapped_column(String(64), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    used_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    user: Mapped[User] = relationship()


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(255))
    industry: Mapped[str] = mapped_column(String(120), default="")
    size: Mapped[str] = mapped_column(String(50), default="")
    location: Mapped[str] = mapped_column(String(255), default="")
    description: Mapped[str] = mapped_column(Text, default="")

    owner: Mapped[User] = relationship(back_populates="company")
    vacancies: Mapped[list["Vacancy"]] = relationship(back_populates="company")


class Agency(Base):
    __tablename__ = "agencies"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(255))
    vetting_status: Mapped[str] = mapped_column(String(20), default="pending")  # pending | approved | rejected
    tier: Mapped[str] = mapped_column(String(30), default="Worker Bee")
    placements_count: Mapped[int] = mapped_column(Integer, default=0)

    owner: Mapped[User] = relationship(back_populates="agency")


class Vacancy(Base):
    __tablename__ = "vacancies"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    department: Mapped[str] = mapped_column(String(120), default="")
    employment_type: Mapped[str] = mapped_column(String(30), default="Full-time")
    workplace: Mapped[str] = mapped_column(String(20), default="Hybrid")
    location: Mapped[str] = mapped_column(String(255), default="")
    salary_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    salary_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    salary_visible: Mapped[bool] = mapped_column(Boolean, default=True)
    description: Mapped[str] = mapped_column(Text, default="")
    requirements: Mapped[str] = mapped_column(Text, default="")
    skills: Mapped[str] = mapped_column(Text, default="")  # comma-separated for MVP
    marketplace_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    access_mode: Mapped[str] = mapped_column(String(30), default="Open Marketplace")
    status: Mapped[str] = mapped_column(String(20), default="Active")  # Draft | Active | Paused | Closed | Filled
    posted_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    company: Mapped[Company] = relationship(back_populates="vacancies")
    screening_questions: Mapped[list["ScreeningQuestion"]] = relationship(back_populates="vacancy")
    applications: Mapped[list["Application"]] = relationship(back_populates="vacancy")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="vacancy")


class ScreeningQuestion(Base):
    __tablename__ = "screening_questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    vacancy_id: Mapped[int] = mapped_column(ForeignKey("vacancies.id"))
    text: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(20), default="Text")  # Text | Yes/No | Number | Multiple Choice
    required: Mapped[bool] = mapped_column(Boolean, default=False)
    knockout: Mapped[bool] = mapped_column(Boolean, default=False)
    order: Mapped[int] = mapped_column(Integer, default=0)

    vacancy: Mapped[Vacancy] = relationship(back_populates="screening_questions")


class Candidate(Base):
    """A person in a recruiter's CRM (or an organic applicant)."""

    __tablename__ = "candidates"

    id: Mapped[int] = mapped_column(primary_key=True)
    agency_id: Mapped[int | None] = mapped_column(ForeignKey("agencies.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), default="")
    phone: Mapped[str] = mapped_column(String(50), default="")
    linkedin_url: Mapped[str | None] = mapped_column(String(500), unique=True, nullable=True)  # PRD: unique id
    current_role: Mapped[str] = mapped_column(String(255), default="")
    current_company: Mapped[str] = mapped_column(String(255), default="")
    location: Mapped[str] = mapped_column(String(255), default="")
    skills: Mapped[str] = mapped_column(Text, default="")
    source: Mapped[str] = mapped_column(String(30), default="Direct")
    match_pct: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Application(Base):
    """Organic (direct) application to a vacancy."""

    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True)
    vacancy_id: Mapped[int] = mapped_column(ForeignKey("vacancies.id"))
    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"))
    stage: Mapped[str] = mapped_column(String(30), default="Applied")
    status: Mapped[str] = mapped_column(String(30), default="Under Review")  # candidate-facing simplified status
    applied_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    vacancy: Mapped[Vacancy] = relationship(back_populates="applications")
    candidate: Mapped[Candidate] = relationship()


class Submission(Base):
    """Recruiter bid: candidate submitted to a vacancy with a commission %."""

    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(primary_key=True)
    vacancy_id: Mapped[int] = mapped_column(ForeignKey("vacancies.id"))
    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"))
    agency_id: Mapped[int] = mapped_column(ForeignKey("agencies.id"))
    commission_pct: Mapped[float] = mapped_column(Float)
    notes: Mapped[str] = mapped_column(Text, default="")
    consent_confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(30), default="Pending")  # Pending|Interview|Offer|Placed|Rejected
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    vacancy: Mapped[Vacancy] = relationship(back_populates="submissions")
    candidate: Mapped[Candidate] = relationship()
    agency: Mapped[Agency] = relationship()


class Offer(Base):
    __tablename__ = "offers"

    id: Mapped[int] = mapped_column(primary_key=True)
    vacancy_id: Mapped[int] = mapped_column(ForeignKey("vacancies.id"))
    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"))
    base_salary: Mapped[int] = mapped_column(Integer)
    bonus: Mapped[str] = mapped_column(String(255), default="")
    benefits: Mapped[str] = mapped_column(Text, default="")
    start_date: Mapped[str] = mapped_column(String(50), default="")
    contract_type: Mapped[str] = mapped_column(String(30), default="Permanent")
    status: Mapped[str] = mapped_column(String(30), default="Pending")  # Pending|Accepted|Rejected|Countered|Expired|Withdrawn
    counter_message: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    vacancy: Mapped[Vacancy] = relationship()
    candidate: Mapped[Candidate] = relationship()


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[str] = mapped_column(String(50), unique=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    candidate_name: Mapped[str] = mapped_column(String(255))
    vacancy_title: Mapped[str] = mapped_column(String(255))
    commission_pct: Mapped[float] = mapped_column(Float)
    gross_commission: Mapped[int] = mapped_column(Integer)
    vat: Mapped[int] = mapped_column(Integer, default=0)
    total: Mapped[int] = mapped_column(Integer)
    due_date: Mapped[str] = mapped_column(String(50), default="")
    status: Mapped[str] = mapped_column(String(20), default="Issued")  # Draft|Issued|Paid|Overdue


class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    agency_id: Mapped[int] = mapped_column(ForeignKey("agencies.id"))
    vacancy_id: Mapped[int] = mapped_column(ForeignKey("vacancies.id"))

    vacancy: Mapped[Vacancy] = relationship()


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str] = mapped_column(Text, default="")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
