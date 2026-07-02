# LUC-6109 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `BLOCKED / AUTH_LOGOUT_SESSION_INVALIDATION_REPRODUCED / RUNTIME_HEALTHY / PERFORMANCE_PASS`
- Issue: [LUC-6109](/LUC/issues/LUC-6109)
- Evidence date: 2026-06-29
- Environment: production
- API: `https://api.soar.luckysparrow.ch`
- Web: `https://soar.luckysparrow.ch`
- Deployed build-info SHA: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- Scope: read-only QA verification, except the existing auth proof's logout-session check.

## Boundary

No deploy, push, restart, rollback execution, env edit, DB/Redis mutation, raw
log capture, production account mutation, subscription/payment mutation,
exchange mutation, order, position, live-trading action, or secret/account
readback occurred. Production credentials were consumed only by approved
redacted smoke/auth scripts through injected environment variables.

## Validation

| Check | Result | Evidence |
| --- | --- | --- |
| Public/protected deploy smoke | PASS | `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`; `/health`, `/ready`, Web `/`, Web `/api/build-info`, and protected `/workers/ready` returned `200`. |
| Auth-session browser proof | FAIL | `history/evidence/luc-6109-prod-auth-session-browser-proof-2026-06-29.md`; logout API returned `502`; `/auth/me` after failed logout returned `200`. |
| Auth-session retry | FAIL | `history/evidence/luc-6109-prod-auth-session-browser-proof-retry-2026-06-29.md`; reproduced the same logout `502` and post-logout `/auth/me -> 200` failure. |
| UI module clickthrough | PASS | `history/evidence/luc-6109-prod-ui-module-clickthrough-2026-06-29.md`; public `PASS:4`, dashboard `PASS:18`, admin `PASS:3`, legacy `PASS:3`. |
| Runtime freshness | PASS | `workerHeartbeat`, `marketData`, `runtimeSignalLag`, and `runtimeSessions` passed; `runningCount=5`; no stale sessions. |
| Rollback guard | PASS | `shouldRollback=false`, `reasons=[]`, worker topology `healthy`, alerts `[]`. |
| Timing sample | PASS | `history/artifacts/luc-6109-production-performance-timing-2026-06-29.json`; public and authenticated sampled endpoints returned expected `200` statuses. |

## Failure Detail

The production auth-session browser proof passed these steps before the failure:

- build-info freshness
- auth token resolved through login
- unauthenticated dashboard redirects to login
- authenticated dashboard renders
- invalid token redirects to `session=expired`

The repeated failure is specific:

- `POST /auth/logout` returned `502`
- subsequent `GET /auth/me` with the same token returned `200`

That means the logout/session invalidation acceptance criterion is not met.
Because the retry reproduced the same result, this issue should not close as
production-accepted until a backend/auth repair is completed and QA reruns this
same proof.

## Performance Snapshot

- API `/health`: `200:5`, max `62.5 ms`.
- API `/ready`: `200:5`, max `23.8 ms`.
- Web `/`: `200:5`, max `78.9 ms`.
- Web `/api/build-info`: `200:5`, max `29.3 ms`.
- Authenticated API `/dashboard/markets/catalog`: `200:5`, max `1573.5 ms`.
- Authenticated API `/admin/subscriptions/plans`: `200:5`, max `37.2 ms`.
- Authenticated API `/workers/ready`: `200:5`, max `31.0 ms`.

The markets catalog still shows the known cold first-sample behavior but did
not fail the representative timing sample.

## Runtime Snapshot

- `workerHeartbeat`: PASS, age `5639 ms` at freshness command and `5775 ms`
  during rollback guard.
- `marketData`: PASS, age `5639 ms` at freshness command and `5775 ms`
  during rollback guard.
- `runtimeSignalLag`: PASS, age `0 ms`.
- `runtimeSessions`: PASS, `runningCount=5`, `staleSessionIds=[]`.
- Rollback decision: `shouldRollback=false`, `reasons=[]`, `alerts=[]`.

## Residual Risk

- Production auth logout/session invalidation is failed and must be repaired by
  Backend/Auth before this acceptance issue can close.
- Release-grade source-control/build provenance remains a separate release/Ops
  gate because this sweep verified deployed build-info readback, not source
  provenance.
- Host-level VPS pressure, proxy/container log-window evidence, and Coolify
  deployment-row readback were not part of this QVE heartbeat and require
  approved Ops read-only credentials if refreshed.
- Source-control closure was not attempted because the shared workspace was
  already heavily dirty before this task.
