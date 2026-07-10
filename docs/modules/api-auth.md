# API Deep-Dive: Auth Module

## Metadata
- Module name: `auth`
- Layer: `api`
- Source path: `apps/api/src/modules/auth`
- Owner: backend/core
- Last updated: 2026-07-05
- Related planning task: `DCP-04`

## 1. Purpose and Scope
- Handles account registration, login, session bootstrap, and logout.
- Issues JWT-based session tokens and returns public user payload.
- Initializes default subscription state during registration transaction.

Out of scope:
- Dashboard resource authorization (handled by `requireAuth` middleware on dashboard/admin routers).
- API key management (profile module).

## 2. Boundaries and Dependencies
- Router mount: `/auth` via `apps/api/src/router/index.ts`.
- Depends on:
  - `prisma` for user/sessionVersion data.
  - password hashing utils (`hashPassword`, `comparePassword`).
  - JWT/session helpers (`auth.jwt`, `auth.session`, cookie helpers).
  - subscriptions bootstrap (`ensureSubscriptionCatalog`, `ensureDefaultSubscriptionForUser`).
- Consumed by web auth flows (`/auth/login`, `/auth/register`) and session bootstrap calls.

## 3. Data and Contract Surface
- Input contracts: `RegisterInput`, `LoginInput` (`auth.types.ts`).
- Output contracts:
  - registration returns public user profile.
  - login returns `{ token, user }` where user matches `publicUserSelect`.
- Invariants:
  - unique email enforced before create.
  - login requires password validation.
  - `sessionVersion` carried in token payload for forced logout/session invalidation.

## 4. Runtime Flows
- Register:
  1. Check duplicate email.
  2. Hash password.
  3. Create user in transaction.
  4. Ensure subscription catalog/default assignment.
- Login:
  1. Load user + password hash + `sessionVersion`.
  2. Validate password.
  3. Sign token with remember-aware TTL.
  4. Return token + public user fields.
- Logout:
  - Token/cookie invalidation handled in controller/cookie helpers.

## 5. API and UI Integration
- Routes:
  - `POST /auth/register`
  - `GET /auth/me`
  - `POST /auth/login`
  - `POST /auth/logout`
- Rate limits:
  - auth general limiter.
  - stricter login limiter.

## 6. Security and Risk Guardrails
- Passwords are never stored plaintext (hash-only persistence).
- Session token includes `sessionVersion` for revocation after sensitive actions.
- Auth endpoints are rate-limited to reduce brute-force pressure.
- Public response uses `publicUserSelect` (no password leakage).

## 7. Observability and Operations
- Auth outcomes surface through standard request logging.
- Cookie/session behavior covered by dedicated auth cookie/session tests.

## 8. Test Coverage and Evidence
- Primary tests:
  - `apps/api/src/modules/auth/auth.e2e.test.ts`
  - `apps/api/src/modules/auth/auth.service.test.ts`
  - `apps/api/src/modules/auth/auth.cookie.test.ts`
  - `apps/api/src/modules/auth/auth.jwt.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/auth/auth.e2e.test.ts src/modules/auth/auth.service.test.ts src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.jwt.test.ts
```

## 9. Open Issues and Follow-Ups
- Migrate remaining message-string failures to typed auth errors in optimization wave.
- Continue hardening session invalidation semantics around account deletion and password rotation.

## 10. Architecture-Awareness Doc-Link Classification

Last classified: 2026-07-10 under [LUC-242](/LUC/issues/LUC-242).

| Source entity | Owner doc | Classification | Expected proof |
| --- | --- | --- | --- |
| `apps/api/src/modules/auth/auth.session.ts` | `docs/modules/api-auth.md` | Auth session helper boundary for current-user/session bootstrap behavior and fail-closed session response shaping. | Architecture-awareness `documents` relation from this doc plus auth session/cookie/JWT tests when behavior changes. |
| `apps/api/src/modules/auth/auth.controller.ts#clearSession` | `docs/modules/api-auth.md` | Controller-local session clearing path that clears the `token` cookie before fail-closed current-user responses and logout invalidation. | Architecture-awareness `documents` relation from this doc plus DB-backed `auth.e2e.test.ts` logout and `/auth/me` stale-session proof when controller session clearing changes. |
| `apps/api/src/middleware/requireAuth.test.ts#expectSessionCookieCleared` | `docs/modules/api-auth.md` | Middleware proof helper that asserts stale or invalid Account access session candidates actively clear the `token` cookie instead of leaving dead sessions in place. | Architecture-awareness `documents` relation from this doc plus focused `requireAuth` middleware tests when cookie-clearing semantics change. |
| `apps/api/src/middleware/requireAuth.ts#requireAuth` | `docs/modules/api-auth.md` | Protected-route authentication guard for Account access and dashboard/admin API route identity boundaries. | Architecture-awareness `documents` relation from this doc plus `requireAuth` middleware tests when behavior changes. |
| `apps/api/src/middleware/requireAuth.ts#clearSession` | `docs/modules/api-auth.md` | Protected-route session clearing path for stale, invalid, expired, or deleted-user session candidates in Account access. | Architecture-awareness `documents` relation from this doc plus `requireAuth` middleware tests when behavior changes. |
| `apps/api/src/middleware/requireTrustedOrigin.test.ts#createSessionCookie` | `docs/modules/api-auth.md` | Trusted-origin middleware test helper that creates a real auth session cookie for state-changing Account access guard coverage. | Architecture-awareness `documents` relation from this doc plus `requireTrustedOrigin` middleware tests when cookie bootstrap or origin-gate semantics change. |
