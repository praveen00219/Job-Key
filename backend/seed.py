"""Seed the dev database with one login per role plus a few sample records,
mirroring the frontend's mock data so real API responses feel familiar.
Run: venv/Scripts/python.exe seed.py
"""

from app.database import Base, SessionLocal, engine
from app.models import Agency, Candidate, Company, User, Vacancy
from app.security import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

if db.query(User).count() > 0:
    print("Database already seeded — skipping. Delete jobkey.db to reseed.")
else:
    employer = User(email="employer@jobkey.dev", password_hash=hash_password("password123"), role="employer", is_verified=True)
    recruiter = User(email="recruiter@jobkey.dev", password_hash=hash_password("password123"), role="recruiter", is_verified=True)
    candidate = User(email="candidate@jobkey.dev", password_hash=hash_password("password123"), role="candidate", is_verified=True)
    db.add_all([employer, recruiter, candidate])
    db.flush()

    company = Company(
        owner_id=employer.id,
        name="TechCorp",
        industry="Technology",
        size="51-200 employees",
        location="London, UK",
        description="TechCorp builds developer tooling used by thousands of engineering teams.",
    )
    agency = Agency(owner_id=recruiter.id, name="TalentBridge Recruiting", vetting_status="approved", placements_count=7)
    db.add_all([company, agency])
    db.flush()

    vacancy = Vacancy(
        company_id=company.id,
        slug="senior-software-engineer-techcorp",
        title="Senior Software Engineer",
        department="Engineering",
        employment_type="Full-time",
        workplace="Remote",
        location="London, UK",
        salary_min=70000,
        salary_max=90000,
        description="Join our platform team building the next generation of developer tools.",
        requirements="5+ years experience,Strong TypeScript,Distributed systems",
        skills="TypeScript,React,Node.js,PostgreSQL",
        status="Active",
    )
    db.add(vacancy)

    db.add(
        Candidate(
            agency_id=agency.id,
            name="Alex Chen",
            email="alex.chen@example.com",
            current_role="Software Engineer",
            current_company="StartupCo",
            location="Manchester, UK",
            skills="React,TypeScript,GraphQL",
            source="LinkedIn",
            match_pct=88,
        )
    )

    db.commit()
    print("Seeded:")
    print("  employer@jobkey.dev / password123")
    print("  recruiter@jobkey.dev / password123")
    print("  candidate@jobkey.dev / password123")

db.close()
