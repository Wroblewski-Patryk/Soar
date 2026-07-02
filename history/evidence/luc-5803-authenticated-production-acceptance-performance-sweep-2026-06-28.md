# LUC-5803 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `PASS / VERIFIED_PRODUCTION / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_PASS / RUNTIME_HEALTHY`
- Issue: [LUC-5803](/LUC/issues/LUC-5803)
- Evidence date: 2026-06-28
- Environment: production
- API: `https://api.soar.luckysparrow.ch`
- Web: `https://soar.luckysparrow.ch`
- Deployed build-info SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`
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
| Public/protected deploy smoke | PASS | `node scripts/deploySmokeCheck.mjs`; `/health`, `/ready`, Web `/`, Web `/api/build-info`, and protected `/workers/ready` all returned `200`. |
| Build-info readback | PASS | Auth/UI proof artifacts observed `gitSha=42177530f2a2ddc22832133b545bccab6ab404eb`. |
| Auth-session browser proof | PASS | `history/evidence/luc-5803-prod-auth-session-browser-proof-2026-06-28.md`; raw JSON `history/artifacts/luc-5803-prod-auth-session-browser-proof-2026-06-28.json`. |
| UI module clickthrough | PASS | `history/evidence/luc-5803-prod-ui-module-clickthrough-2026-06-28.md`; raw JSON `history/artifacts/luc-5803-prod-ui-module-clickthrough-2026-06-28.json`. |
| Runtime freshness | PASS | `workerHeartbeat`, `marketData`, `runtimeSignalLag`, and `runtimeSessions` passed; `runningCount=5`; no stale sessions. |
| Rollback guard | PASS | `shouldRollback=false`, `reasons=[]`, worker topology `healthy`, alerts `[]`. |
| Timing sample | PASS | `history/artifacts/luc-5803-production-performance-timing-2026-06-28.json`; all sampled public/dashboard/admin endpoints returned `200`. |
| Browser/process cleanup | PASS | No `chrome-headless-shell`, `chrome`, or `msedge` validation processes found after browser proof. |

## Performance Snapshot

- Public API/Web timing returned `200` for all sampled targets.
- Authenticated API timing returned `200` for all sampled dashboard/admin
  targets.
- Slowest observed sample: `/dashboard/markets/catalog` at `1513.6 ms`.
- Focused `/dashboard/markets/catalog` follow-up returned `200:8`, max
  `275.9 ms`, with later samples back in the low double-digit millisecond
  range.
- Representative p95/max values:
  - API `/health`: p95/max `266.7 ms`.
  - API `/ready`: p95/max `25.0 ms`.
  - Web `/`: p95/max `86.8 ms`.
  - Web `/api/build-info`: p95/max `25.9 ms`.
  - API `/dashboard/markets/catalog`: p95/max `1513.6 ms`.
  - API `/admin/subscriptions/plans`: p95/max `30.4 ms`.

## Auth And Route Coverage

- Auth-session proof passed:
  unauthenticated dashboard redirects to login, authenticated dashboard renders,
  invalid token redirects to `session=expired`, logout clears session,
  `/auth/me` after logout returns `401`, and dashboard after logout redirects
  to login.
- UI module clickthrough passed:
  public `PASS:4`, dashboard `PASS:18`, admin `PASS:3`, legacy redirects
  `PASS:3`.

## Residual Risk

- Release-grade build provenance remains a release/Ops residual because this
  sweep only verified production build-info readback, not source-control or
  deploy provenance.
- One `/dashboard/markets/catalog` cold sample reached `1513.6 ms` and the
  first focused follow-up sample reached `275.9 ms`; the same endpoint then
  normalized. Keep routine watch coverage, but this evidence window does not
  prove a sustained latency incident.
- Host-level VPS pressure, proxy/container log-window evidence, and Coolify
  deployment-row readback were not part of this QVE heartbeat and require
  approved Ops read-only credentials if the board wants that deeper server
  health layer refreshed.
- Source-control closure was not attempted because the shared worktree was
  already mixed dirty and divergent before this task (`main...origin/main`
  `ahead 15, behind 1`).
