from app.models import Offer
from tests.conftest import make_candidate, make_user, make_vacancy, login


def _make_offer(db, company, agency=None, candidate_email="cand@test.dev"):
    vacancy = make_vacancy(db, company, "Offer Role", slug=f"offer-role-{candidate_email}")
    candidate = make_candidate(db, agency, "Offer Person", email=candidate_email)
    offer = Offer(vacancy_id=vacancy.id, candidate_id=candidate.id, base_salary=60000)
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


def test_employer_lists_own_offers(client, db_session, employer):
    """Regression for audit finding B1: the employer branch of GET /api/offers
    used Django-style `has(company__owner_id=...)` and raised at runtime."""
    user, company, headers = employer
    _make_offer(db_session, company)

    res = client.get("/api/offers", headers=headers)
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["total"] == 1
    assert body["items"][0]["vacancy_title"] == "Offer Role"


def test_candidate_sees_only_their_offers(client, db_session, employer):
    _, company, _ = employer
    _make_offer(db_session, company, candidate_email="mine@test.dev")
    _make_offer(db_session, company, candidate_email="other@test.dev")

    make_user(db_session, "mine@test.dev", "candidate")
    headers = login(client, "mine@test.dev")
    res = client.get("/api/offers", headers=headers)
    assert res.status_code == 200
    assert res.json()["total"] == 1


def test_candidate_responds_accept(client, db_session, employer):
    _, company, _ = employer
    offer = _make_offer(db_session, company, candidate_email="resp@test.dev")
    make_user(db_session, "resp@test.dev", "candidate")
    headers = login(client, "resp@test.dev")

    res = client.post(f"/api/offers/{offer.id}/respond", json={"action": "accept"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["status"] == "Accepted"

    # A second response is rejected — the offer is settled.
    res = client.post(f"/api/offers/{offer.id}/respond", json={"action": "reject"}, headers=headers)
    assert res.status_code == 409


def test_candidate_counter_offer_records_message(client, db_session, employer):
    _, company, _ = employer
    offer = _make_offer(db_session, company, candidate_email="counter@test.dev")
    make_user(db_session, "counter@test.dev", "candidate")
    headers = login(client, "counter@test.dev")

    res = client.post(
        f"/api/offers/{offer.id}/respond",
        json={"action": "counter", "message": "I'd sign at 65k"},
        headers=headers,
    )
    assert res.status_code == 200
    assert res.json()["status"] == "Countered"


def test_stranger_cannot_respond_to_offer(client, db_session, employer):
    _, company, _ = employer
    offer = _make_offer(db_session, company, candidate_email="owner@test.dev")
    make_user(db_session, "stranger@test.dev", "candidate")
    headers = login(client, "stranger@test.dev")
    res = client.post(f"/api/offers/{offer.id}/respond", json={"action": "accept"}, headers=headers)
    assert res.status_code == 403
