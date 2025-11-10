# VaultChain Frontend Authentication Guide

## Flow Overview

```
User action → React Hook Form + Zod validation → Auth client
          ↘ password strength feedback / remember-me handling
Persist session (localStorage or sessionStorage + secure cookie)
          ↓
/api/v1/auth/login or /api/v1/auth/register (NestJS JWT)
          ↓
AuthContext refresh → JWT stored + profile fetched (/auth/me)
          ↓
Dashboard (protected by middleware + AuthProvider)
```

- **Login:** `POST /api/v1/auth/login` returns `{ accessToken, expiresIn, user }`.
- **Signup:** `POST /api/v1/auth/register` mirrors login and auto-signs in the user.
- **Profile:** `GET /api/v1/auth/me` hydrates the `UserMenu`, sidebar identity, and personalized dashboard greeting.

## Client Components

| Component | Responsibility |
|-----------|----------------|
| `components/auth/login-form.tsx` | Shadcn card with remember-me control, toast-driven errors, retry action, and skeleton overlay during submission. |
| `components/auth/signup-form.tsx` | Adds password strength indicator, confirmation validation, and optimistic onboarding copy. |
| `components/auth/password-checklist.tsx` | Animates per-rule strength feedback. |
| `components/auth/session-expired-notice.tsx` | Fixed alert prompting a re-login whenever the JWT timer lapses. |
| `context/auth-context.tsx` | Centralizes user state, status, auto-logout timers, and exposes `login`, `logout`, `refresh`. |
| `components/layout/user-menu.tsx` & `components/layout/sidebar.tsx` | Consume `useAuth` to render real user data, avatars, roles, and sign-out flows. |

## Storage & Middleware

- **Token storage:** `persistSession` writes the JWT to either `localStorage` (remember me) or `sessionStorage`, augments it with `expiresAt`, and mirrors it to a secure `vc-auth` cookie for middleware checks.
- **Middleware (`frontend/middleware.ts`):** Guards every route except `/login`, `/signup`, and `/forgot-password`. Authenticated users hitting `/login` or `/signup` are bounced back to `/`.
- **Auto logout:** `AuthProvider` schedules a timeout using the JWT expiry, clears storage, emits a toast, and surfaces the session-expired alert.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base REST endpoint for auth + market APIs | `http://localhost:4000/api/v1` |

Ensure backend is running with matching JWT secret + PostgreSQL connection (see `backend/.env.example`).

## Local Development

```bash
pnpm install
pnpm dev:backend        # start NestJS API (port 4000)
pnpm dev                # start Next.js dashboard (port 3000)
```

1. Visit `http://localhost:3000/signup` to create an account.
2. JWT + profile are synced automatically; protected dashboard routes (`/`, `/markets`, etc.) now load.
3. Use the user menu → **Sign out** to clear storage and return to `/login`.

## Deployment Notes

- **Frontend (Vercel or similar):**
  - Provide `NEXT_PUBLIC_API_BASE_URL` via project settings.
  - `vc-auth` cookie is `SameSite=Strict` + `Secure`, so deploy over HTTPS.
- **Backend (Railway/Fly/Render):**
  - Run `pnpm prisma migrate deploy --schema=prisma/schema.prisma`.
  - Supply `JWT_SECRET`, `JWT_EXPIRES_IN`, `PASSWORD_PEPPER`, and `DATABASE_URL`.

## Screenshots & QA

- `/login`: zero-trust hero, remember-me checkbox, forgot password link, skeleton overlay.
- `/signup`: password strength checklist with animated bar, onboarding copy, success toast.
- `/`: personalized greeting banner + header/menu pulling authenticated identity.

_Tip:_ Use the browser devtools `Application → Storage` panel to verify `vaultchain.auth` entry and `vc-auth` cookie lifecycle while testing remember-me and sign-out scenarios.
