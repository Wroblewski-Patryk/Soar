# API Deep-Dive: Auth Module

## Metadata
- Module name: `auth`
- Layer: `api`
- Source path: `apps/api/src/modules/auth`
- Owner: backend/core
- Last updated: 2026-07-11
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

Last classified: 2026-07-11 under [LUC-498](/LUC/issues/LUC-498).

| Source entity | Owner doc | Classification | Expected proof |
| --- | --- | --- | --- |
| `apps/api/src/modules/auth/auth.cookie.ts#getSessionCookieBaseOptions` | `docs/modules/api-auth.md` | Shared Account access session cookie option helper that enforces `httpOnly`, root path, environment-driven `secure`, and allowed SameSite policy for controller and middleware cookie writes. | Architecture-awareness `documents` relation from this doc plus `auth.cookie.test.ts` when cookie option semantics change. |
| `apps/api/src/modules/auth/auth.session.ts` | `docs/modules/api-auth.md` | Auth session helper boundary for current-user/session bootstrap behavior and fail-closed session response shaping. | Architecture-awareness `documents` relation from this doc plus auth session/cookie/JWT tests when behavior changes. |
| `apps/api/src/modules/auth/auth.controller.ts#register` | `docs/modules/api-auth.md` | Registration controller handler that validates input, creates the account with default subscription bootstrap, signs the remember session token, and sets the auth cookie. | Architecture-awareness `documents` relation from this doc plus DB-backed `auth.e2e.test.ts` register route proof when registration or cookie bootstrap changes. |
| `apps/api/src/modules/auth/auth.controller.ts#login` | `docs/modules/api-auth.md` | Login controller handler that authenticates credentials, selects remember-aware cookie lifetime, sets the session cookie, and returns the public user payload. | Architecture-awareness `documents` relation from this doc plus DB-backed `auth.e2e.test.ts` login and cookie TTL proof when login behavior changes. |
| `apps/api/src/modules/auth/auth.controller.ts#me` | `docs/modules/api-auth.md` | Current-user controller handler that reads cookie and bearer session candidates, fails closed on stale or invalid sessions, and refreshes the canonical cookie when needed. | Architecture-awareness `documents` relation from this doc plus DB-backed `auth.e2e.test.ts` `/auth/me` proof when session candidate handling changes. |
| `apps/api/src/modules/auth/auth.controller.ts#logout` | `docs/modules/api-auth.md` | Logout controller handler that increments `sessionVersion`, clears the auth cookie, and prevents reuse of the same cookie or bearer token after logout. | Architecture-awareness `documents` relation from this doc plus DB-backed `auth.e2e.test.ts` logout invalidation proof when logout behavior changes. |
| `apps/api/src/modules/auth/auth.controller.ts#clearSession` | `docs/modules/api-auth.md` | Controller-local session clearing path that clears the `token` cookie before fail-closed current-user responses and logout invalidation. | Architecture-awareness `documents` relation from this doc plus DB-backed `auth.e2e.test.ts` logout and `/auth/me` stale-session proof when controller session clearing changes. |
| `apps/api/src/modules/auth/auth.controller.ts#setSessionCookie` | `docs/modules/api-auth.md` | Controller-local session cookie writer that combines shared base options, domain resolution, and route-specific max age for register, login, and session healing responses. | Architecture-awareness `documents` relation from this doc plus DB-backed register/login and `/auth/me` duplicate-cookie proof when cookie setting changes. |
| `apps/api/src/modules/auth/auth.controller.ts#clearSessionCookie` | `docs/modules/api-auth.md` | Controller-local session cookie clearer that combines shared base options and domain resolution to expire the `token` cookie on logout and fail-closed current-user paths. | Architecture-awareness `documents` relation from this doc plus DB-backed logout and stale-session proof when cookie clearing changes. |
| `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv` | `docs/modules/api-auth.md` | Auth e2e test helper that restores JWT-related environment variables after secret-rotation scenarios so Account access route proof stays isolated from later cases. | Architecture-awareness `documents` relation from this doc plus DB-backed `auth.e2e.test.ts` route proof when JWT env restoration or test isolation changes. |
| `apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry` | `docs/modules/api-auth.md` | JWT previous-secret rotation-window parser that treats an absent expiry as no previous-secret window, requires configured expiry values to be valid ISO datetimes, and suppresses expired previous secrets before verification. | Architecture-awareness `documents` relation from this doc plus `auth.jwt.test.ts` when previous-secret rotation-window parsing or fail-closed expiry validation changes. |
| `apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets` | `docs/modules/api-auth.md` | JWT secret resolver that requires configured primary signing material, appends configured previous secrets for rotation verification, and fails closed when the auth signing secret is absent. | Architecture-awareness `documents` relation from this doc plus `auth.jwt.test.ts` when JWT secret resolution, rotation, or fail-closed configuration behavior changes. |
| `apps/api/src/middleware/requireAuth.test.ts#expectSessionCookieCleared` | `docs/modules/api-auth.md` | Middleware proof helper that asserts stale or invalid Account access session candidates actively clear the `token` cookie instead of leaving dead sessions in place. | Architecture-awareness `documents` relation from this doc plus focused `requireAuth` middleware tests when cookie-clearing semantics change. |
| `apps/api/src/middleware/requireAuth.ts#requireAuth` | `docs/modules/api-auth.md` | Protected-route authentication guard for Account access and dashboard/admin API route identity boundaries. | Architecture-awareness `documents` relation from this doc plus `requireAuth` middleware tests when behavior changes. |
| `apps/api/src/middleware/requireAuth.ts#clearSession` | `docs/modules/api-auth.md` | Protected-route session clearing path for stale, invalid, expired, or deleted-user session candidates in Account access. | Architecture-awareness `documents` relation from this doc plus `requireAuth` middleware tests when behavior changes. |
| `apps/api/src/middleware/requireTrustedOrigin.test.ts#createSessionCookie` | `docs/modules/api-auth.md` | Trusted-origin middleware test helper that creates a real auth session cookie for state-changing Account access guard coverage. | Architecture-awareness `documents` relation from this doc plus `requireTrustedOrigin` middleware tests when cookie bootstrap or origin-gate semantics change. |
