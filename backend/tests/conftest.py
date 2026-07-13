"""Shared test fixtures: an in-memory SQLite app instance + per-role clients.

Each test function gets a fresh database (StaticPool keeps the single
in-memory connection alive across sessions within a test).
"""

import os

# Speed: drop PBKDF2 work factor for tests (must be set before app imports).
os.environ.setdefault("JOBKEY_PBKDF2_ITERATIONS", "1000")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import Agency, Candidate, Company, User, Vacancy
from app.security import hash_password


@pytest.fixture()
def db_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    session = TestingSession()
    yield session
    session.close()


@pytest.fixture()
def client(db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def make_user(db, email: str, role: str, password: str = "password123") -> User:
    user = User(email=email, password_hash=hash_password(password), role=role, is_verified=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login(client, email: str, password: str = "password123") -> dict:
    res = client.post("/api/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200, res.text
    return {"Authorization": f"Bearer {res.json()['access_token']}"}


@pytest.fixture()
def employer(db_session, client):
    """Employer user + company; returns (user, company, auth headers)."""
    user = make_user(db_session, "employer@test.dev", "employer")
    company = Company(owner_id=user.id, name="TestCorp")
    db_session.add(company)
    db_session.commit()
    db_session.refresh(company)
    return user, company, login(client, user.email)


@pytest.fixture()
def recruiter(db_session, client):
    """Recruiter user + approved agency; returns (user, agency, auth headers)."""
    user = make_user(db_session, "recruiter@test.dev", "recruiter")
    agency = Agency(owner_id=user.id, name="TestAgency", vetting_status="approved")
    db_session.add(agency)
    db_session.commit()
    db_session.refresh(agency)
    return user, agency, login(client, user.email)


@pytest.fixture()
def candidate_user(db_session, client):
    user = make_user(db_session, "candidate@test.dev", "candidate")
    return user, login(client, user.email)


def make_vacancy(db, company: Company, title: str = "Test Engineer", **kwargs) -> Vacancy:
    slug = kwargs.pop("slug", title.lower().replace(" ", "-"))
    vacancy = Vacancy(company_id=company.id, slug=slug, title=title, **kwargs)
    db.add(vacancy)
    db.commit()
    db.refresh(vacancy)
    return vacancy


def make_candidate(db, agency: Agency | None, name: str = "Test Person", **kwargs) -> Candidate:
    candidate = Candidate(agency_id=agency.id if agency else None, name=name, **kwargs)
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate
