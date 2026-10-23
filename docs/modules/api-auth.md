# API Deep-Dive: Auth Module

## Metadata
- Module name: `auth`
- Layer: `api`
- Source path: `apps/api/src/modules/auth`
- Owner: backend/core
- Last updated: 2026-10-19
- Related planning task: `DCP-04`

## 1. Purpose and Scope
- Handles account registration, login, session bootstrap, and logout.
- Issues JWT-based human browser sessions in an HttpOnly cookie and returns public user payload.
- Registration creates an account without assigning a subscription plan.

Out of scope:
- Dashboard resource authorization (handled by `requireAuth` middleware on dashboard/admin routers).
- API key management (profile module).

## 2. Boundaries and Dependencies
- Router mount: `/auth` via `apps/api/src/router/index.ts`.
- Depends on:
  - `prisma` for user/sessionVersion data.
  - password hashing utils (`hashPassword`, `comparePassword`).
  - JWT/session helpers (`auth.jwt`, `auth.session`, cookie helpers).
  - admin subscription assignment is a separate, human-operated flow.
- Consumed by web auth flows (`/auth/login`, `/auth/register`) and session bootstrap calls.

## 3. Data and Contract Surface
- Input contracts: `RegisterInput`, `LoginInput` (`auth.types.ts`).
- Output contracts:
  - registration and login return public user data; the session JWT is set in a cookie, not returned in the JSON body.
- Invariants:
  - unique email enforced before create.
  - login requires password validation.
  - `sessionVersion` carried in token payload for forced logout/session invalidation.
  - newly issued browser sessions use audience `cryptosparrow-human-session` and signed `sessionKind=human`.
  - older `cryptosparrow-app` tokens never gain browser authority by moving from Bearer to Cookie.

## 4. Runtime Flows
- Register:
  1. Check duplicate email.
  2. Hash password.
  3. Create user in transaction.
  4. Leave plan assignment to an administrator; registration grants no plan entitlement.
- Login:
  1. Load user + password hash + `sessionVersion`.
  2. Validate password.
  3. Sign a human-session token with remember-aware TTL.
  4. Set the HttpOnly cookie and return public user fields.
- Logout:
  - A human cookie session increments `sessionVersion` and clears the cookie.
  - An old cookie is cleared without promotion or server-side version increment; a Bearer request cannot revoke a human session through logout.

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
- The old audience remains valid as a legacy API credential for compatible domain reads/writes, but an old cookie is rejected with 401 and requires a fresh login. The separate human audience plus cookie use is required for account, key, and administrator mutations.
- `/auth/me` does not copy a Bearer token into a browser cookie.
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
