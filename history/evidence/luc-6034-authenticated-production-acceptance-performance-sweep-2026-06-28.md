# LUC-6034 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `PASS / VERIFIED_PRODUCTION / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_PASS / RUNTIME_HEALTHY`
- Issue: [LUC-6034](/LUC/issues/LUC-6034)
- Evidence date: 2026-06-28
- Environment: production
- API: `https://api.soar.luckysparrow.ch`
- Web: `https://soar.luckysparrow.ch`
- Deployed build-info SHA: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- Scope: read-only QA verification only.

## Read-Only Boundary

No deploy, push, restart, rollback execution, env edit, DB/Redis mutation, raw
log capture, production account mutation, subscription/payment mutation,
exchange mutation, order, position, live-trading action, or secret/account
readback occurred. Auth credentials were consumed from injected environment
variables and were not written to artifacts.

## Validation

| Check | Result | Evidence |
| --- | --- | --- |
| Public/protected deploy smoke | PASS | `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`; `/health`, `/ready`, Web `/`, Web `/api/build-info`, and protected `/workers/ready` returned `200` through audit login env mapping. |
| Current stale token path | FAIL-CLOSED | Same smoke without audit login mapping returned public rows `200`, Web build-info SHA match, and protected `/workers/ready` `401`, consistent with known stale `SMOKE_AUTH_TOKEN` residual. |
| Build-info readback | PASS | Web build-info returned `gitSha=3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`. |
| Auth-session browser proof | PASS | `history/evidence/luc-6034-prod-auth-session-browser-proof-retry-2026-06-28.md`; unauthenticated dashboard redirects to login, authenticated dashboard renders, invalid token redirects to `session=expired`, logout clears session, `/auth/me` after logout returns `401`, and dashboard after logout redirects to login. |
| UI module clickthrough | PASS | `history/evidence/luc-6034-prod-ui-module-clickthrough-2026-06-28.md`; public `PASS:4`, dashboard `PASS:18`, admin `PASS:3`, legacy `PASS:3`. |
| Runtime freshness | PASS | `workerHeartbeat`, `marketData`, `runtimeSignalLag`, and `runtimeSessions` passed; `runningCount=5`; no stale sessions. |
| Rollback guard | PASS | `shouldRollback=false`, `reasons=[]`, worker topology `healthy`, alerts `[]`. |
| Timing sample | PASS | `history/artifacts/luc-6034-production-performance-timing-2026-06-28.json`; all public sampled endpoints returned `200`; unauthenticated protected API rows returned expected `401`. |

## Performance Snapshot

- API `/health`: `200:8`, max `227.1 ms`.
- API `/ready`: `200:8`, max `45.4 ms`.
- Web `/`: `200:8`, max `92.9 ms`.
- Web `/api/build-info`: `200:8`, max `29.1 ms`.
- Unauthenticated protected API checks failed closed quickly:
  `/dashboard/markets/catalog` returned `401:3`, max `20.5 ms`;
  `/admin/subscriptions/plans` returned `401:3`, max `24.8 ms`.

## Runtime Snapshot

- `workerHeartbeat`: PASS, age `5993 ms` at freshness command and `11695 ms`
  during rollback guard.
- `marketData`: PASS, age `5993 ms` at freshness command and `11695 ms`
  during rollback guard.
- `runtimeSignalLag`: PASS, age `0 ms`.
- `runtimeSessions`: PASS, `runningCount=5`, `staleSessionIds=[]`.
- Rollback decision: `shouldRollback=false`, `reasons=[]`, `alerts=[]`.

## Residual Risk

- Stale pre-bound `SMOKE_AUTH_TOKEN` still returns protected `401`; the
  approved audit-login mapping passes. Cleanup remains owned by the separate
  Security/Ops secret-binding lane.
- Release-grade build provenance remains a release/Ops residual because this
  sweep verified production build-info readback, not source-control or deploy
  provenance.
- Host-level VPS pressure, proxy/container log-window evidence, and Coolify
  deployment-row readback were not part of this QVE heartbeat and require
  approved Ops read-only credentials if refreshed.
- Source-control closure was not attempted because the shared worktree was
  already mixed dirty and divergent before this task (`main...origin/main`
  `ahead 15, behind 2`).

