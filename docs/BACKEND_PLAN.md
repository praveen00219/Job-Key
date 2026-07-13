# JobKey — Modular Backend Plan (A0–A11)

Replaces the old monolithic Phases 11–14. Findings referenced (B*, F*) are in
[AUDIT.md](./AUDIT.md). Confirmed decisions: Admin portal after core wiring · SQLite dev +
Alembic with Postgres via `DATABASE_URL` · testing bar = pytest API tests + one committed
Playwright E2E per module, both in CI · wired pages hard-cut to API-only (mock data migrates to
the seed script; no silent fallbacks).

**Principles:** vertical slices (backend + frontend wiring + tests ship together) · each module
independently reviewable in days not weeks · PRD business rules enforced server-side and asserted
in tests · Alembic migration per module · every module ends green in CI.

**Definition of Done (every module):** Alembic migration applies cleanly to an existing dev DB ·
pytest suite for the module's rules/authz/error cases passes · one committed Playwright E2E
happy-path over the wired page(s) passes against the running stack · seed script extended so wired
pages look as rich as the mocks did · `npm run build` + `lint` clean · ROADMAP status updated.

## Development order

```
A0 ─► A1 ─► A2 ─► A3 ─► A4 ─► A5 ─► A6 ─► A7a ─► A7b ─► A7c ─► A8 ─► A9 ─► A10 ─► A11
hardening auth  employer────ATS   recruiter──mkt/CRM   submissions→offers→money   cross  admin  integr. QA
```

- A0 first: everything later depends on migrations + test harness + CI (B1 is the proof).
- Employer chain (A2→A4) before recruiter chain (A5→A7): submissions need vacancies + pipelines;
  money needs submissions.
- A8 (notifications) retrofits onto events that must exist first; A9 (admin) administers real data
  and replaces A5's interim approval endpoint; A10 integrations need A9's templates and A7's
  invoice model.

## Modules

### A0 — Platform hardening & dev infrastructure *(no features; pays the audit debt)*
- **Backend:** fix B1 (offers query + regression test); Alembic init + baseline; pytest + httpx
  harness (in-memory SQLite, factories); pagination convention (`?page/size` →
  `{items,total,page,size}`) on existing list endpoints; consistent error envelope; timezone-safe
  timestamp helper (B7); `.env.example`.
- **Frontend:** TanStack Query + shared `QueryBoundary` loading/error/empty components; ESLint +
  Prettier; fix F1/F2/F6; committed E2E harness in `frontend/e2e/`.
- **CI:** GitHub Actions — backend pytest, frontend lint+build, E2E job.
- **Acceptance:** CI green; a test that would have caught B1; `alembic upgrade head` from scratch
  equals the `create_all` schema.

### A1 — Auth & sessions v2
- **APIs:** tokened verify-email + reset-password (single-use, expiring; delivery = dev-log until
  A10); `POST /auth/refresh` rotation; `PATCH /auth/password`.
- **DB:** `auth_tokens` (purpose, hash, expiry, used_at); `users.role` constrained.
- **Rules:** lockout unchanged; verification required pre-login (seeds pre-verified); reset
  invalidates sessions.
- **Frontend:** `RequireAuth roles=[…]` guards per portal group; role-based landing; Security
  settings tab; 401 → session-expired redirect via the Query layer.
- **Acceptance:** pytest: token lifecycle, lockout, refresh rotation, role gates. E2E: signup →
  dev-verify → login → wrong-role blocked → logout.

### A2 — Employer company profile & dashboard
- **APIs:** companies CRUD extended (logo/photo paths, culture fields); `GET
  /api/dashboard/employer` aggregates.
- **DB:** extend `companies`; `activity_events` (also feeds A8/A9).
- **Wire (hard-cut):** `DashboardPage`, Settings→Profile (real editor), Settings→Team (invites via
  A1 tokens). Billing stays display-only.
- **Acceptance:** dashboard numbers derived from seeded rows (pytest); E2E: edit profile →
  dashboard reflects it.

### A3 — Vacancies complete
- **APIs:** wizard-shaped create (all 5 steps), full update, status transitions
  (Draft→Active→Paused/Closed/Filled, legality-checked), screening-question CRUD (≤10, knockout),
  share-link slug.
- **DB:** extend `vacancies` (experience range, team access, pipeline template ref).
- **Wire:** `VacancyCreatePage` (real submit), `VacanciesListPage` (drop mock fallback),
  `VacancyDetailPage` Overview + Settings tabs.
- **Acceptance:** pytest: transition matrix, question limit, slug uniqueness. E2E: wizard →
  list → publish → `/jobs/:slug`.

### A4 — Pipeline & applications (ATS core)
- **APIs:** per-vacancy pipeline stages (min 3/max 10; Application+Onboarding locked — same rule
  A9's default-pipeline builder configures platform-wide); stage PATCH with progression audit;
  screening answers + knockout auto-reject; candidate-facing simplified-status derivation.
- **DB:** `pipeline_stages`, `stage_transitions`, `screening_answers`.
- **Wire:** Kanban (drag persists), candidate review drawer, candidate portal
  `ApplyPage`/`CandidateApplicationsPage`; public-jobs API replaces `mockPublicJobs` (SSG reads
  API at build time — smallest honest change wins).
- **Acceptance:** pytest: stage rules, knockout, status mapping. E2E: public apply → Kanban card →
  drag → candidate sees updated status.

### A5 — Recruiter & agency accounts (vetting)
- **APIs:** onboarding submission (both variants); vetting status machine
  (pending→under_review→action_required→approved/rejected) + **interim admin-only approval
  endpoint** (UI in A9); team invites; tier recompute on placement.
- **DB:** onboarding submissions + document paths; team membership.
- **Wire:** both onboarding wizards, status pages (poll real status), `AgencyTeamPage` team CRUD;
  Performance-tab decision here.
- **Acceptance:** pytest: status machine + role gates. E2E: submit onboarding → API-approve →
  recruiter dashboard unlocks.

### A6 — Marketplace, watchlist & CRM
- **APIs:** browse (filters + pagination, access modes Open/Invite-only/Tier-restricted enforced),
  alerts CRUD; CRM adds folders/tags/communication-log, CSV import, LinkedIn-import stub.
- **DB:** `folders`, `candidate_tags`, `communication_logs`, `vacancy_alerts`.
- **Wire:** `MarketplacePage`, `CandidatesPage`, `CandidateDetailPage`, Add-Candidate/LinkedIn
  modals; extension duplicate-check hits the real endpoint (pasted-token dev auth).
- **Acceptance:** pytest: access modes by tier, duplicate rules, alert matching. E2E: save
  candidate → CRM → watchlist add → extension data shape.

### A7 — Submissions, offers & money *(three thin sub-slices)*
- **A7a Submissions/bids:** employer review (accept/reject + reason), same-candidate+company
  flagging, Placed → placements → tier. Wires recruiter `SubmissionsPage` + `SubmitToVacancyPage`,
  employer `BidsPage`; extension quick-submit.
- **A7b Offers:** creation from pipeline, candidate respond, counter-offer first-class, expiry.
  Wires `OffersPage`/`OfferDetailPage`, candidate `OfferResponsePage`.
- **A7c Invoices/earnings/payouts:** invoice on placement (commission % × real salary, tier
  platform fee, VAT, Net-30 — kills the £50k hack), transaction ledger, payout requests (£500
  min), payment-extension accept/decline. Wires `InvoicesPage`, `EarningsPage`, Agency Financials.
- **Acceptance:** pytest: fee-math golden cases per tier, refund table (66/33/0) encoded,
  duplicate/flag rules, payout minimum. E2E: submit → accept → place → invoice → earnings →
  payout request.

### A8 — Notifications service
- One `notify(user, event, payload)` helper retrofitted onto A2–A7 mutation sites (~25 PRD
  triggers); feed pagination + unread count; extension badge endpoint. Messages page: thread-lite
  vs. keep-stub decision at module start (default keep stub).
- **Wire:** bell + panel in all three top-navs; extension popup reads real feed/badge.
- **Acceptance:** pytest parametrized over the trigger matrix (each fires exactly once). E2E: bid
  accepted → bell increments → mark-all-read clears extension badge.

### A9 — Admin portal (frontend + backend)
- Admin role + guard; Dashboard aggregates; Activity Feed (reads `activity_events`); Users
  management (**vetting approval UI replaces A5's interim endpoint**, suspend/reactivate);
  Operations oversight; Configuration — General platform settings, Fees & Commission + Recruiter
  Tiers (ladder moves from code to DB config), Email Templates (consumed by A10), default
  Pipeline builder (feeds A4), Notifications config.
- Starts with its own scoped Figma drill-down of the ~16 screens (`4468:34832`).
- **Acceptance:** pytest: admin authz everywhere; config changes take effect (fee ladder read from
  DB). E2E: approve pending recruiter in UI → recruiter portal unlocks.

### A10 — Integrations *(formerly Phase 12, sliced; each behind a feature flag)*
Stripe Connect → LinkedIn OAuth (candidate login) → transactional email (makes A1 tokens real;
consumes A9 templates) → S3/R2 file storage (CV 10MB / logo 2MB / photos ≤6) → CV parsing +
matching.

### A11 — Hardening, GDPR & QA *(formerly Phases 13–14)*
Rate limiting, session timeout, GDPR export/delete, security pass, load testing, then the 90-case
Recruiter Portal test suite (67 P0 must pass).

## Verification model

- Per module: the Definition of Done, enforced by CI on every push.
- Cross-module: the E2E suite is cumulative — module N runs specs 1…N.
- Business rules: every row of ROADMAP.md's rules table becomes a named pytest
  (`test_rule_payout_minimum`, `test_rule_fee_ladder`, …).
- Exit: A11 runs the 67 P0 documented test cases against the full stack.
