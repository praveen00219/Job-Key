# JobKey — Project Audit Report (2026-07-13)

Snapshot audit taken at the Phase 11 pause, before the modular backend rebuild
(see [BACKEND_PLAN.md](./BACKEND_PLAN.md)). Findings are referenced by ID (B* backend,
F* frontend) from the module plan; each finding names the module that resolves it.

## 1. What exists and is verified working

- **Frontend** (`frontend/`): ~50 routes across 4 surfaces, one shared design system (blue
  Employer/Candidate, orange Recruiter via `tone` props), builds clean including SSG prerender of
  public job pages (`scripts/prerender.mjs` + hydration-aware `main.tsx`). All features were
  screenshot-verified against Figma during their build phases.
- **Chrome extension** (`extension/`): zero-build MV3, verified by loading into a real browser.
- **Backend** (`backend/`): FastAPI + SQLAlchemy 2.0, 41 routes, JWT auth with the PRD lockout
  (5 fails → 30-min 423), tier/fee ladder, duplicate-submission and payout-minimum rules, seeded
  dev DB. Employer `AuthContext` and `VacanciesListPage` wired and E2E-verified.

## 2. Backend findings (ranked)

| # | Severity | Finding | Where | Fixed in |
|---|---|---|---|---|
| B1 | **Bug (runtime)** | `Offer.vacancy.has(company__owner_id=…)` is Django syntax, not SQLAlchemy — the employer branch of `GET /api/offers` raises at runtime. Shipped because only curl-tested paths were verified → drives the new testing bar. | `app/routers/offers.py` | A0 |
| B2 | **Critical (security, known dev-mode)** | `POST /auth/reset-password` resets any account by email alone — no token. | `app/routers/auth.py` | A1 |
| B3 | High | No migrations — `create_all` only. | `app/main.py` | A0 |
| B4 | High | Zero backend tests; no CI. | repo-wide | A0 |
| B5 | Medium | No pagination on list endpoints; no error-shape convention. | all routers | A0 |
| B6 | Medium | JWT: default secret, 12-h expiry, no refresh/rotation; no `.env.example`. | `app/config.py` | A0 (env) / A1 (tokens) |
| B7 | Medium | `datetime.utcnow` (naive, deprecated in 3.12) for all timestamps. | `app/models.py` | A0 |
| B8 | Low | Modeling shortcuts: skills as comma-strings; `Invoice` denormalizes names; earnings vs. flat £50k reference; missing charter entities (Folder, CommunicationLog, PipelineStage, Transaction, Payout, Refund, Rating, CounterOffer). | `app/models.py`, `app/routers/invoices.py` | A4–A7 |
| B9 | Low | Single-file `models.py`/`schemas.py` won't scale through 12 modules. | `app/` | split when it hurts |

## 3. Frontend findings

| # | Severity | Finding | Where | Fixed in |
|---|---|---|---|---|
| F1 | **Bug** | Recruiter nav "Follow-ups" is a dead link (`/recruiter/follow-ups` → catch-all → `/login`). Root cause: the Figma frame named "Follow-ups" is actually the Earnings page; the nav item was never reconciled. | `RecruiterTopNav.tsx` | A0 |
| F2 | Bug (minor) | Employer nav "Workflow" points at `/settings` — mislabeled destination. | `EmployerTopNav.tsx` | A0 |
| F3 | High | No route guards — authenticated routes render without a session. | `App.tsx` | A1 |
| F4 | Medium | 18 page files still read `mock*.ts`; `VacanciesListPage` carries a dual mock/live path (hard-cut per confirmed policy). | `src/pages/**` | A2–A8 |
| F5 | Medium | No shared server-state layer; each wired page hand-rolls fetch/loading/error. | `src/lib/api.ts` | A0 (TanStack Query) |
| F6 | Low | `/offers/:id` hardcoded outside `ROUTES`; `lint` script runs only `tsc`; main chunk >500 kB; React Router v7 future-flag warnings. | various | A0 |

## 4. Tooling / DevOps gaps (all confirmed absent at audit time)

No ESLint/Prettier configs · no test files in project code · no `.github/` CI · no Dockerfiles ·
no `.env`/`.env.example` · Playwright verification scripts lived in the session scratchpad, not
the repo. All addressed in module A0.

## 5. Figma design review (all user roles)

File `s7feos7ReDa4Hh7xCexuJH` — four portals in three giant sibling frames. Layer names are
**systematically unreliable** (three confirmed mislabels); always verify by rendered content.

| Portal | Node | Theme | Coverage status |
|---|---|---|---|
| **Employer** | `3960:51372` | Blue | Fully built (Ph 1–4). Undesigned-but-stubbed: 6 of 8 Settings tabs, Messages. No "Bids" screen existed — built from PRD. |
| **Recruiter/Agency** | `3823:39998` | Orange | Fully built (Ph 5–8). Mislabel: Earnings frame named "Follow-ups" (`2552:13188`). Agency Performance tab undesigned (stub). No follow-ups screen exists despite the old nav item (→ F1). |
| **Candidate** | inside Employer frame | Blue | Public job page from the employer's "Preview job post" (`2845:78445`). "Job Seeker LogIn/Register" frames are mislabeled employer-auth copies. No designs for apply/tracking/offer — built from PRD C1–C3. |
| **Admin** | `4468:34832` | Blue | **~16 designed screens, zero built** (→ module A9). Nav: Dashboard · Activity Feed · Users ▾ · Operations ▾ · System ▾. Configuration tabs: General (platform identity, regional, security policy, API, file storage, backup), Fees & Commission, Recruiter Tiers, Email Templates, **Pipeline (platform default-pipeline builder, min 3/max 10 stages — matches the PRD rule)**, Notifications. Plus user-management tables and approval/detail flows. Layer names unreliable (most screens named "All Recruiters"). |
| **Chrome extension** | — | Orange | No designs exist; built from PRD CE1–CE4. |

**Verdict:** no built screen contradicts its design; every gap is either an honest PRD-derived
build or a marked stub. The one whole-portal gap is Admin.

## 6. Remaining frontend work (paired to modules)

| Item | Source | Size | Lands in |
|---|---|---|---|
| Fix dead "Follow-ups" nav link + "Workflow" nav label | F1/F2 | XS | A0 |
| Route guards + role-based redirect + session-expiry handling | F3 | S | A1 |
| Shared loading/error/empty components + TanStack Query | F5 | S | A0 |
| Wire 18 mock-driven pages (hard-cut) | F4 | — | A2–A8 (each module wires its own pages) |
| Settings tabs: Profile, Team, Security (Benefits/ActivityLog/DataPrivacy stay stubs — undesigned, PRD-thin) | Ph 2 stubs | M | A2 / A1 |
| VacancyDetailPage Overview + Settings tabs | Ph 3 stubs | S | A3 |
| Agency Performance tab (undesigned — decide build-from-PRD vs. keep stub) | Ph 5 stub | S | A5 |
| In-app notification bell + panel | PRD | M | A8 |
| Messages page (thread-lite vs. defer — decide at A8) | Ph 2 stub | M | A8 |
| **Admin portal — full build (~16 screens)** | Figma `4468:34832` | XL | A9 |
| Extension: swap mock constants for real API calls | Ph 10 | M | A6/A7/A8 |
