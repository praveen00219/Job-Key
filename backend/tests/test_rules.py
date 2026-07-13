"""Named tests for the business rules in ROADMAP.md's rules table —
the table made executable (one test per rule the backend implements today;
later modules extend this file)."""

import pytest

from app.routers.agencies import tier_for
from tests.conftest import make_candidate, make_vacancy


@pytest.mark.parametrize(
    ("placements", "tier", "fee"),
    [
        (0, "Worker Bee", 20),
        (10, "Worker Bee", 20),
        (11, "Honey Maker", 20),
        (50, "Honey Maker", 20),
        (51, "Queen's Guard", 18),
        (150, "Queen's Guard", 18),
        (151, "Hive Legend", 15),
        (500, "Hive Legend", 15),
    ],
)
def test_rule_fee_ladder(placements, tier, fee):
    assert tier_for(placements) == (tier, fee)


def test_rule_commission_bid_range_8_to_25(client, db_session, employer, recruiter):
    _, company, _ = employer
    _, agency, headers = recruiter
    vacancy = make_vacancy(db_session, company)
    candidate = make_candidate(db_session, agency)

    def submit(pct):
        return client.post(
            "/api/submissions",
            json={
                "vacancy_id": vacancy.id,
                "candidate_id": candidate.id,
                "commission_pct": pct,
                "consent_confirmed": True,
            },
            headers=headers,
        )

    assert submit(7).status_code == 422  # below PRD floor
    assert submit(26).status_code == 422  # above PRD ceiling
    assert submit(15).status_code == 201


def test_rule_duplicate_submission_blocked(client, db_session, employer, recruiter):
    """PRD: same candidate + same vacancy is blocked outright."""
    _, company, _ = employer
    _, agency, headers = recruiter
    vacancy = make_vacancy(db_session, company)
    candidate = make_candidate(db_session, agency)
    payload = {
        "vacancy_id": vacancy.id,
        "candidate_id": candidate.id,
        "commission_pct": 12,
        "consent_confirmed": True,
    }
    assert client.post("/api/submissions", json=payload, headers=headers).status_code == 201
    assert client.post("/api/submissions", json=payload, headers=headers).status_code == 409


def test_rule_submission_requires_consent(client, db_session, employer, recruiter):
    _, company, _ = employer
    _, agency, headers = recruiter
    vacancy = make_vacancy(db_session, company)
    candidate = make_candidate(db_session, agency)
    res = client.post(
        "/api/submissions",
        json={
            "vacancy_id": vacancy.id,
            "candidate_id": candidate.id,
            "commission_pct": 12,
            "consent_confirmed": False,
        },
        headers=headers,
    )
    assert res.status_code == 400


def test_rule_payout_minimum_500(client, recruiter):
    """PRD: minimum payout threshold is £500."""
    _, _, headers = recruiter
    assert client.post("/api/payouts/request", json={"amount": 499}, headers=headers).status_code == 400
    assert client.post("/api/payouts/request", json={"amount": 500}, headers=headers).status_code == 202


def test_rule_crm_linkedin_duplicate_409(client, recruiter):
    """PRD: LinkedIn URL is the unique candidate ID within an agency's CRM."""
    _, _, headers = recruiter
    payload = {"name": "Dup Person", "linkedin_url": "https://linkedin.com/in/dup-person"}
    assert client.post("/api/candidates", json=payload, headers=headers).status_code == 201
    assert client.post("/api/candidates", json=payload, headers=headers).status_code == 409
