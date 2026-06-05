# LUC-2055 API Platform Safety Architecture Gap Review

Issue: [LUC-2055](/LUC/issues/LUC-2055)
Parent: [LUC-2053](/LUC/issues/LUC-2053)
Role: Security Review Lead
Stage: verification
Operation process: regression evidence loop / release-deploy gate
Date: 2026-06-05

## Context

`CHAIN-API-PLATFORM-SAFETY` is listed in `docs/status/function-journey-index.md`
as `verified_local` with an explicit remaining gap:
`missing_proof:Fresh adversarial security review remains separate`.

The chain row in `docs/architecture/indices/function-chain-evidence-index.csv`
maps the platform safety scope to runtime/config helpers, middleware guards,
shared error/logger utilities, API support routes, and module docs. This review
covers the requested security posture without production mutation.

Existing dirty worktree entries before this review were not mine and were not
modified:

- `.agents/state/module-confidence-ledger.md`
- `.agents/state/system-health.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/operations/runtime-config-ledger.csv`
- `history/evidence/luc-2054-coolify-read-only-production-status-access-2026-06-05.md`
- `history/tasks/luc-2054-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md`

## Goal

Produce an adversarial security review disposition for API platform safety:
unauthorized access, session/cookie misuse, origin bypass, rate-limit bypass,
secret leakage, and fail-closed behavior.

## Constraints

- Do not mutate production, credentials, account state, deployment state,
  database state, live trading state, or exchange settings.
- Do not expose secret values in repo artifacts or issue comments.
- Split implementation follow-up into child issues only if this review finds a
  concrete one-owner defect.

## Definition of Done

- Code/docs/test evidence is named.
- Existing tests are classified as sufficient or missing.
- Release impact is explicit.
- Residual risk is documented.

## Forbidden

- No workaround paths.
- No broad product implementation.
- No deploy, push, restart, rollback, env edit, or protected production smoke.
- No secret value readback or screenshot capture.

## Reviewed Surfaces

| Surface | Evidence | Disposition |
| --- | --- | --- |
| Config readiness | `apps/api/src/config/criticalSecretsReadiness.ts`, `apps/api/src/router/index.ts`, `apps/api/src/config/criticalSecretsReadiness.test.ts`, `apps/api/src/router/health-readiness.test.ts` | Implemented. Startup blocks invalid critical secrets except the documented legacy API-key-encryption compatibility path; public `/ready` still fails closed when only legacy encryption is present and does not expose detailed missing/issue data. |
| Proxy trust | `apps/api/src/config/proxyTrust.ts`, `apps/api/src/config/proxyTrust.test.ts`, `apps/api/src/index.ts` | Implemented. Production does not trust private ranges by default; explicit proxy allowlist is required. |
| Runtime execution config | `apps/api/src/config/runtimeExecution.ts`, `apps/api/src/router/index.ts`, `apps/api/src/router/health-readiness.test.ts` | Implemented for protected readiness diagnostics. LIVE no-order guard booleans are exposed only through admin + ops-network protected `/ready/details`; raw env names are not returned. |
| Auth middleware | `apps/api/src/middleware/requireAuth.ts`, `apps/api/src/modules/auth/auth.jwt.ts`, `apps/api/src/modules/auth/sessionToken.ts`, `apps/api/src/middleware/requireAuth.test.ts`, adversarial JWT/session tests | Implemented. JWT issuer/audience/algorithm are constrained; sessionVersion is checked server-side; DB lookup failure returns 503 instead of allowing access. |
| Role and ops-only access | `apps/api/src/middleware/requireRole.ts`, `apps/api/src/middleware/requireOpsNetwork.ts`, `apps/api/src/router/index.ts`, `apps/api/src/router/admin.routes.ts` | Implemented. Admin and operational diagnostics are server-side gated. |
| Rate limiting | `apps/api/src/middleware/rateLimit.ts`, `apps/api/src/middleware/rateLimit.test.ts`, `apps/api/src/modules/auth/auth.routes.ts` | Implemented. Production fails closed with 503 when Redis is unavailable unless an explicit fallback is allowed; auth routes have IP and auth-identity scoped limiters. |
| Trusted origin / cookie CSRF guard | `apps/api/src/middleware/requireTrustedOrigin.ts`, `apps/api/src/middleware/requireTrustedOrigin.unit.test.ts`, `apps/api/src/index.ts` | Implemented. Cookie-backed state changes reject untrusted origins; SameSite=None cookie writes require origin. Bearer-only writes are not origin-blocked. |
| Request logging | `apps/api/src/middleware/requestLogger.ts`, `apps/api/src/middleware/requestLogger.test.ts` | Implemented. Sensitive query keys are redacted before URL logging. |
| Shared logger redaction | `apps/api/src/lib/logger.ts`, `apps/api/src/lib/logger.test.ts` | Implemented. Sensitive top-level/nested/array/error fields are redacted; error messages/stacks are not logged raw. |
| Error handling | `apps/api/src/middleware/errorHandler.ts`, `apps/api/src/lib/httpErrorMapper.ts`, `apps/api/src/utils/apiError.ts` | Implemented by inspection. 5xx paths are logged through redacted logger and API error responses are mapped. |
| Security headers/static avatars | `apps/api/src/index.ts`, `apps/api/src/router/security-headers.test.ts` | Implemented. Helmet baseline headers are present and avatar static route denies dotfiles/index fallback with nosniff. |

## Adversarial Review Notes

- Unauthorized access: protected dashboard/admin/ops routes are server-side
  gated through `requireAuth`, `requireRole('ADMIN')`, and `requireOpsNetwork`.
  Missing/invalid tokens fail closed; auth DB lookup failure returns 503.
- Session/cookie misuse: cookies are httpOnly, secure in production, and
  SameSite defaults to lax; SameSite=None cookie-backed writes require a trusted
  Origin/Referer. Duplicate token cookies prefer newest valid token by `iat`.
- Origin bypass: CORS allows only configured origins; cookie-backed
  state-changing calls reject untrusted origins. This does not cover non-cookie
  bearer-token requests by design.
- Rate-limit bypass: auth routes use both IP and identity buckets. API-key test
  limiter fingerprints raw key material before keying buckets; raw API keys are
  not used directly in limiter key output. Production Redis failure denies the
  request instead of silently falling back.
- Secret leakage: public readiness hides missing/issue detail; protected
  readiness is admin + ops-network gated. Logger and request logger tests prove
  secret-looking fields and query keys are redacted.
- Fail-closed behavior: rate-limit backend outage, auth DB outage, invalid JWT
  claims, missing critical readiness, Redis-required outage, DB-readiness outage,
  and unsafe cookie-origin combinations all deny or report not-ready.

## Verification

Passed:

```powershell
$env:NODE_ENV='test'; pnpm --filter api exec vitest run src/middleware/rateLimit.test.ts src/middleware/requireTrustedOrigin.unit.test.ts src/middleware/requestLogger.test.ts src/lib/logger.test.ts src/config/criticalSecretsReadiness.test.ts src/config/proxyTrust.test.ts src/router/security-headers.test.ts --run --reporter=dot
```

Result: `7` files passed, `25` tests passed.

Passed:

```powershell
$env:NODE_ENV='test'; pnpm run test:adversarial:api-assistant
```

Result: `8` files passed, `29` tests passed.

Blocked environmental verification:

```powershell
pnpm --filter api exec vitest run src/middleware/rateLimit.test.ts src/middleware/requireTrustedOrigin.unit.test.ts src/middleware/requestLogger.test.ts src/lib/logger.test.ts src/middleware/requireAuth.test.ts src/config/criticalSecretsReadiness.test.ts src/config/proxyTrust.test.ts src/router/security-headers.test.ts src/router/health-readiness.test.ts --run --reporter=dot
```

Result: `7` files passed, `2` files failed, `28/42` tests passed. The failures
were DB-backed `requireAuth.test.ts` and `health-readiness.test.ts` cases blocked
by local Postgres unavailability at `localhost:5432`, plus related timeouts.
This is not treated as evidence of a platform-safety implementation regression;
it is recorded as an environment-bound proof gap for DB-backed auth/readiness
route tests.

## Security Disposition

`CHAIN-API-PLATFORM-SAFETY` remains `verified_local` for the reviewed
architecture surfaces. Existing focused tests are sufficient for the requested
fresh adversarial local review. No concrete new one-owner implementation defect
was found, so no child implementation issue is required from this lane.

## Release Impact

V1 impact: `warns_v1`, not a new block.

Rationale:

- The reviewed platform safety controls are implemented and locally verified.
- Production/browser proof is explicitly not implied by this local review.
- Existing residual risk around legacy API-key-encryption startup compatibility
  remains documented in `RISK-SEC-2026-05-25-002`; public readiness still fails
  closed when only legacy encryption material is configured.
- Fresh DB-backed auth/readiness route proof requires local DB availability or a
  separate DB-backed verification lane before upgrading this from local security
  disposition to broader release readiness.

## Result Report

- Files changed: this task artifact only.
- Commit: not committed.
- Push: not needed.
- Deploy impact: none.
- Production/account/secret/live-trading impact: none.
- Residual risk: DB-backed auth/readiness route proof could not run in this
  heartbeat because local Postgres was unavailable.
