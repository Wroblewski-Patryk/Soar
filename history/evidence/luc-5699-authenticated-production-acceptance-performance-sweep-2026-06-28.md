# LUC-5699 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `PASS / VERIFIED_PRODUCTION / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_PASS / RUNTIME_HEALTHY`
- Issue: [LUC-5699](/LUC/issues/LUC-5699)
- Evidence date: 2026-06-28
- Environment: production
- API: `https://api.soar.luckysparrow.ch`
- Web: `https://soar.luckysparrow.ch`
- Deployed build-info SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`
- Build metadata source: `env-runtime`
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
| Build-info readback | PASS | `gitSha=42177530f2a2ddc22832133b545bccab6ab404eb`, `gitRef=main`, `metadataSource=env-runtime`. |
| Auth-session browser proof | PASS | `history/evidence/luc-5699-prod-auth-session-browser-proof-2026-06-28.md`; raw JSON `history/artifacts/luc-5699-prod-auth-session-browser-proof-2026-06-28.json`. |
| UI module clickthrough | PASS | `history/evidence/luc-5699-prod-ui-module-clickthrough-2026-06-28.md`; raw JSON `history/artifacts/luc-5699-prod-ui-module-clickthrough-2026-06-28.json`. |
| Runtime freshness | PASS | `workerHeartbeat`, `marketData`, `runtimeSignalLag`, and `runtimeSessions` passed; `runningCount=5`; no stale sessions. |
| Rollback guard | PASS | `shouldRollback=false`, `reasons=[]`, worker topology `healthy`, alerts `[]`. |
| Timing sample | PASS | `history/artifacts/luc-5699-production-performance-timing-2026-06-28.json`; all sampled public/dashboard/admin endpoints returned `200`. |
| Browser/process cleanup | PASS | No `chrome-headless-shell`, `chrome`, or `msedge` validation processes found after browser proof. |

## Performance Snapshot

- Public API/Web timing returned `200` for all sampled targets.
- Authenticated API timing returned `200` for all sampled dashboard/admin
  targets.
- Slowest observed sample: `/dashboard/markets/catalog` at `139.1 ms`.
- Representative p95/max values:
  - API `/health`: p95/max `60.5 ms`.
  - API `/ready`: p95/max `28.2 ms`.
  - Web `/`: p95/max `134.9 ms`.
  - Web `/api/build-info`: p95/max `31.9 ms`.
  - API `/dashboard/markets/catalog`: p95/max `139.1 ms`.
  - API `/admin/subscriptions/plans`: p95/max `41.9 ms`.

## Auth And Route Coverage

- Auth-session proof passed:
  unauthenticated dashboard redirects to login, authenticated dashboard renders,
  invalid token redirects to `session=expired`, logout clears session, `/auth/me`
  after logout returns `401`, and dashboard after logout redirects to login.
- UI module clickthrough passed:
  public `PASS:4`, dashboard `PASS:18`, admin `PASS:3`, legacy redirects
  `PASS:3`.

## Residual Risk

- Release-grade build provenance remains a release/Ops residual because
  build-info still reports `metadataSource=env-runtime`.
- Host-level VPS pressure, proxy/container log-window evidence, and Coolify
  deployment-row readback were not part of this QA heartbeat and require
  approved Ops read-only credentials if the board wants that deeper server
  health layer refreshed.
- Source-control closure was not attempted because the shared worktree was
  already mixed dirty and divergent before this task (`main...origin/main`
  `ahead 14, behind 1`).
