# LUC-2231 API Platform Safety Adversarial Review

Date: 2026-06-05
Owner: Security Review Lead
Issue: [LUC-2231](/LUC/issues/LUC-2231)
Chain: `CHAIN-API-PLATFORM-SAFETY`
Stage: verification
Status: partially verified locally; no confirmed product defect found

## Scope

Reviewed the local API platform safety boundary for:

- auth/session middleware and token parsing
- trusted-origin guard for cookie-backed state-changing requests
- ops-network private/proxy boundary
- rate-limit identity and Redis degradation policy
- request/error logging redaction
- startup critical-secret readiness
- proxy trust and baseline security headers

Explicit exclusions:

- no production secret access
- no protected production smoke
- no account, subscription, API-key, exchange, or live-trading mutation
- no remediation implementation

## Threat Model

Assets:

- user sessions and JWTs
- exchange API-key material and API-key test payloads
- authenticated API routes and admin/ops endpoints
- production topology metadata in errors/logs

Actors:

- unauthenticated web attacker
- authenticated user probing cross-user or admin-only behavior
- attacker spoofing proxy/origin headers
- operator mistake exposing secrets in logs or CLI output

Trust boundaries:

- browser to API
- cookie-backed browser state changes vs bearer-token API calls
- reverse proxy to Express `trust proxy`
- public internet to ops-only endpoints
- API process to Redis/Postgres
- application errors to HTTP responses and logs

## Abuse Cases Reviewed

| Abuse Case | Expected Control | Local Evidence | Result |
| --- | --- | --- | --- |
| Cross-site cookie-backed POST without trusted origin | `requireTrustedOrigin` blocks SameSite=None missing origin and untrusted origin before mutation | `requireTrustedOrigin.unit.test.ts` passed; DB-backed route test blocked by local Postgres | partially verified |
| Bearer-token API call incorrectly forced through browser origin policy | trusted-origin guard bypasses non-cookie bearer writes | `requireTrustedOrigin.unit.test.ts` passed | verified locally |
| Spoofed `X-Forwarded-For` reaches ops route from untrusted socket peer | `requireOpsNetwork` ignores forwarded IP unless socket peer is trusted | `requireOpsNetwork.test.ts` passed | verified locally |
| Production private-network ops access allowed by default | production default denies private network unless explicitly enabled | `requireOpsNetwork.test.ts` passed | verified locally |
| Redis outage silently disables rate limits in production | rate limiter fails closed with `503` and degraded header | `rateLimit.test.ts` passed | verified locally |
| API-key test payload leaks in rate-limit key/logs | API key is fingerprinted, not persisted in key text | `rateLimit.test.ts` passed | verified locally |
| Sensitive query/log/error content leaks into logs or HTTP responses | request logger and module logger redact secret-like keys and error messages | `requestLogger.test.ts`, `logger.test.ts`, `apiError.test.ts` passed | verified locally |
| Placeholder or missing critical secrets pass readiness | startup readiness flags missing/placeholder material | `criticalSecretsReadiness.test.ts` passed | verified locally |
| Production proxy trust accepts private proxies implicitly | `createTrustProxyMatcher` does not trust private ranges by default in production | `proxyTrust.test.ts` passed | verified locally |

## Commands

PASS:

```powershell
pnpm --filter api exec vitest run src/middleware/rateLimit.test.ts src/middleware/requireTrustedOrigin.unit.test.ts src/middleware/requireOpsNetwork.test.ts src/middleware/requestLogger.test.ts src/lib/logger.test.ts src/utils/apiError.test.ts src/config/criticalSecretsReadiness.test.ts src/config/proxyTrust.test.ts src/router/security-headers.test.ts --reporter=basic
```

Result: passed the focused non-DB platform safety subset. Observed API app startup log during `security-headers.test.ts`; process exited cleanly.

PASS:

```powershell
pnpm --filter api exec vitest run src/modules/auth/auth.jwt.test.ts src/modules/auth/sessionToken.test.ts src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.errors.test.ts --reporter=default
```

Result: `4` files / `14` tests passed.

PASS:

```powershell
pnpm --filter api exec vitest run src/middleware/requireRole.test.ts src/lib/httpErrorMapper.test.ts src/lib/errors.test.ts --reporter=default
```

Result: `3` files / `12` tests passed.

BLOCKED BY LOCAL INFRA:

```powershell
pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts src/middleware/requireTrustedOrigin.test.ts --reporter=default
```

Result: `3` tests passed, `7` failed before route assertions because Prisma could not reach local Postgres at `localhost:5432`.

Environment checks:

- `Get-NetTCPConnection -LocalPort 5432` returned no listener.
- `docker ps` could not connect to Docker Desktop Linux engine.

## Findings

No confirmed API platform safety product defect was found in the non-DB local review scope.

Residual evidence gap:

- DB-backed auth/session and route-level trusted-origin proof could not run in this heartbeat because local Postgres and Docker were unavailable. This is an environment blocker for route-level proof, not a demonstrated product regression.
- Production/browser proof remains outside this issue by scope.

## Security Decision

`CHAIN-API-PLATFORM-SAFETY` has fresh adversarial local review evidence for the middleware/config/logging/redaction controls covered by non-DB tests. Do not use this artifact to claim protected production auth, production browser behavior, or DB-backed route e2e proof.

No child implementation issue is required from this review. A QA/Backend DB-backed route rerun remains appropriate when local Postgres is available or a separate DB-backed proof lane is opened.
