from tests.conftest import make_vacancy


def test_list_requires_auth(client):
    assert client.get("/api/vacancies").status_code == 401


def test_pagination_envelope(client, db_session, employer):
    _, company, headers = employer
    for i in range(7):
        make_vacancy(db_session, company, f"Role {i}", slug=f"role-{i}")

    res = client.get("/api/vacancies?page=2&size=3", headers=headers)
    assert res.status_code == 200
    body = res.json()
    assert set(body) == {"items", "total", "page", "size"}
    assert body["total"] == 7
    assert body["page"] == 2
    assert len(body["items"]) == 3


def test_create_requires_company_profile(client, db_session):
    from tests.conftest import make_user, login

    make_user(db_session, "nocompany@test.dev", "employer")
    headers = login(client, "nocompany@test.dev")
    res = client.post("/api/vacancies", json={"title": "X"}, headers=headers)
    assert res.status_code == 400


def test_create_generates_unique_slug(client, employer):
    _, _, headers = employer
    first = client.post("/api/vacancies", json={"title": "Data Engineer"}, headers=headers)
    second = client.post("/api/vacancies", json={"title": "Data Engineer"}, headers=headers)
    assert first.status_code == 201 and second.status_code == 201
    assert first.json()["slug"] != second.json()["slug"]


def test_rule_screening_questions_max_10(client, db_session, employer):
    """PRD: at most 10 screening questions per vacancy."""
    _, company, headers = employer
    vacancy = make_vacancy(db_session, company, "Quizzy Role")
    for i in range(10):
        res = client.post(
            f"/api/vacancies/{vacancy.id}/screening-questions",
            params={"text": f"Q{i}?"},
            headers=headers,
        )
        assert res.status_code == 201
    res = client.post(
        f"/api/vacancies/{vacancy.id}/screening-questions", params={"text": "Q11?"}, headers=headers
    )
    assert res.status_code == 400


def test_recruiter_cannot_create_vacancy(client, recruiter):
    _, _, headers = recruiter
    res = client.post("/api/vacancies", json={"title": "Nope"}, headers=headers)
    assert res.status_code == 403
