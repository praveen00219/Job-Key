# JobKey — Frontend

Frontend for the **JobKey** recruitment marketplace. This first phase implements the
**Employer Authentication flow** from the Figma design, plus the reusable design system that
the rest of the product will build on.

## Tech stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** — theme built from the Figma design tokens (`tailwind.config.ts`)
- **shadcn/ui-style primitives** (Radix), restyled to the JobKey brand
- **react-router-dom** — routing
- **react-hook-form + zod** — form state & validation
- **lucide-react** — icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Auth screens & routes

| Route | Screen |
|-------|--------|
| `/signup` | Create Employer Account (email, password strength meter, T&C) |
| `/verify-email` | Check Your Email (post sign-up) |
| `/verify-email/success` | Email Verified (auto-redirects) |
| `/verify-email/expired` | Verification Link Expired |
| `/login` | Welcome Back / Sign in (with inline error state) |
| `/account-locked` | Account Temporarily Locked |
| `/forgot-password` | Reset Your Password |
| `/forgot-password/sent` | Check Your Email (reset link + resend countdown) |
| `/reset-password` | Set a new password |
| `/reset-password/success` | Password Updated |
| `/reset-password/expired` | Reset Link Expired |
| `/dashboard` | Authenticated placeholder (Phase 2) |

## Demo credentials

Auth is mocked (no backend yet). The happy path (sign in → dashboard) works with:

- **Email:** `demo@jobkey.com`
- **Password:** `Password1!`

Any other credentials return "Invalid email or password"; 5 failed attempts routes to the
Account Locked screen.

## Project structure

```
src/
├── components/
│   ├── ui/       shadcn-style primitives (button, input, label, checkbox)
│   └── auth/     AuthLayout, JobKeyLogo, HexagonBackground, FeaturedIcon,
│                 PasswordStrengthMeter, NextStepsCard, PasswordInput, …
├── context/      AuthContext (mock, backend-ready — see the `// TODO` seams)
├── hooks/        useCountdown
├── lib/          utils (cn), validation (zod), password (strength), routes
└── pages/auth/   the 12 auth screens
```

## Connecting a backend (later)

`src/context/AuthContext.tsx` holds every auth action (`signup`, `login`, `requestPasswordReset`,
`resetPassword`, …) as async mocks marked `// TODO: replace with API call`. Swapping those bodies
for real API requests is all that's needed — the component-facing surface stays the same.

## Roadmap

Phase 2+: company-profile onboarding wizard, employer dashboard, vacancy creation, the recruiter
side (marketplace / CRM / earnings), candidate application flow, and the Chrome extension UI.
