# JobKey API — Backend Foundation (Phase 11)

FastAPI + SQLAlchemy backend. SQLite by default for zero-install dev; set `DATABASE_URL` to a
Postgres DSN for staging/production (`postgresql+psycopg://user:pass@host/db`).

## Run it

```bash
py -3.12 -m venv venv
venv/Scripts/pip install -r requirements.txt   # venv/bin/pip on macOS/Linux
venv/Scripts/python seed.py                    # creates jobkey.db + one login per role
venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

Interactive API docs: http://localhost:8000/docs

Seeded logins (all password `password123`):

| Email | Role |
|---|---|
| `employer@jobkey.dev` | employer |
| `recruiter@jobkey.dev` | recruiter |
| `candidate@jobkey.dev` | candidate |

The Vite dev server proxies `/api/*` to `http://localhost:8000` (see `frontend/vite.config.ts`), so
running both servers together is enough for the frontend to talk to real data — no `.env` needed
for local dev.

## What's wired vs. still mocked

- **Real**: JWT auth (register/login/me/forgot/reset, PRD's 5-attempt / 30-minute lockout),
  companies, agencies (with tier/fee ladder), vacancies + screening questions, candidates (CRM,
  LinkedIn-URL duplicate detection), submissions (bid + PRD duplicate-submission rule), watchlist,
  organic applications (public apply endpoint), offers (accept/reject/counter), invoices, earnings
  summary + payout-minimum enforcement, notifications.
- **Frontend wiring so far**: the Employer `AuthContext` (login/signup/forgot/reset) and the
  Vacancies list page are wired to real endpoints; everything else in the frontend still reads
  its own mock data modules under `frontend/src/lib/mock*.ts`. Each carries a
  `// TODO: replace with API call` marker at its original mock boundary — wiring the rest through
  is incremental, page by page, in later sessions.
- **Deferred to Phase 12**: Stripe Connect (real payouts/invoicing), LinkedIn OAuth, transactional
  email (verification/reset links actually being sent), S3 file storage, CV-parsing/matching,
  search, Redis.

## Structure

```
app/
  main.py         FastAPI app, CORS, router registration, create_all
  config.py       Settings (env-overridable)
  database.py     SQLAlchemy engine/session
  models.py       ORM models for every core entity
  schemas.py      Pydantic request/response models
  security.py     Password hashing (PBKDF2) + JWT issue/verify
  deps.py         require_role() dependency
  routers/        auth, companies, agencies, vacancies, candidates,
                  submissions (+ watchlist), offers, applications, invoices
                  (+ earnings/payouts), notifications
seed.py           Dev-data seeder
```
