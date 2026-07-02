# LUC-5531 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `DONE / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_WATCHFUL / RUNTIME_HEALTHY`
- Issue: [LUC-5531](/LUC/issues/LUC-5531)
- Evidence date: 2026-06-27
- Environment: production
- Production build-info SHA observed: `42177530f2a2ddc22832133b545bccab6ab404eb`

## Scope

Read-only QA verification for production Soar:

- public API/Web smoke;
- authenticated dashboard/admin/module reachability;
- auth/session fail-closed behavior;
- lightweight route timing;
- runtime freshness;
- rollback guard.

No deploy, push, restart, rollback, env edit, secret/account value readback,
database/Redis mutation, exchange action, order, position, payment/subscription
mutation, or live-trading action was performed.

## Commands And Results

| Check | Command | Result |
| --- | --- | --- |
| Public smoke | `node scripts/deploySmokeCheck.mjs --api-base-url <prod-api> --web-base-url <prod-web> --no-workers` with clean `SMOKE_AUTH_*` | PASS: API `/health` 200, API `/ready` 200, Web `/` 200, Web `/api/build-info` 200 |
| Initial full smoke | `pnpm run -s ops:deploy:smoke` with mapped `SMOKE_*` auth | TIMEOUT before script summary at 124s; superseded by clean public smoke plus runtime/rollback checks |
| Initial no-worker smoke | `pnpm run -s ops:deploy:smoke -- --no-workers` | FAIL before script summary; superseded by direct node clean-env run |
| UI module clickthrough | `node scripts/runProdUiModuleClickthroughAudit.mjs --today 2026-06-27` | PASS |
| Auth/session proof initial | `node scripts/runProdAuthSessionBrowserProof.mjs --i-understand-production-auth-proof` | FAIL: missing `PROD_AUTH_*` token source |
| Auth/session proof mapped | `node scripts/runProdAuthSessionBrowserProof.mjs --i-understand-production-auth-proof --web-base-url <prod-web> --api-base-url <prod-api> --auth-email <audit-email> --auth-password <audit-password> --today 2026-06-27` | Wrapper TIMEOUT at 244s, but script artifacts were written and report PASS for all auth/session steps |
| Route timing | PowerShell five-sample `Invoke-WebRequest` probe for API `/health`, API `/ready`, Web `/`, Web `/api/build-info` | PASS statuses; API `/health` had one low-second outlier |
| Runtime freshness | `node scripts/checkPostDeployRuntimeFreshness.mjs --base-url <prod-api> --auth-email <admin-email> --timeout-ms 15000` with password via env | PASS |
| Rollback guard | `node scripts/evaluateRollbackGuard.mjs --base-url <prod-api> --auth-email <admin-email>` with password via env | PASS: `shouldRollback=false`, no alerts |

## Acceptance Evidence

### Public Smoke

All public smoke checks passed:

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`

### Authenticated UI Clickthrough

Artifact:

- `docs/operations/prod-ui-module-clickthrough-2026-06-27.md`
- `docs/operations/_artifacts-prod-ui-module-clickthrough-2026-06-27.json`

Result:

- public routes: `PASS:4`
- dashboard routes: `PASS:18`
- admin routes: `PASS:3`
- legacy redirects: `PASS:3`
- blockers: `none`

### Auth Session Browser Proof

Artifact:

- `docs/operations/prod-auth-session-browser-proof-current-2026-06-27.md`
- `docs/operations/_artifacts-prod-auth-session-browser-proof-current-2026-06-27.json`

Result:

- build-info freshness: `PASS`
- auth token resolved from login: `PASS`
- unauthenticated dashboard redirects to `/auth/login`: `PASS`
- authenticated dashboard renders: `PASS`
- invalid token redirects to `/auth/login?session=expired`: `PASS`
- logout API clears session: `PASS`
- `/auth/me` after logout fails closed with `401`: `PASS`
- dashboard after logout redirects to login: `PASS`
- blockers: `none`

### Timing Window

Five-sample route timing:

- API `/health`: all `200`, max about `3995.9 ms`, average about `1097.6 ms`
- API `/ready`: all `200`, max about `314.7 ms`, average about `231.1 ms`
- Web `/`: all `200`, max about `719.4 ms`, average about `340.2 ms`
- Web `/api/build-info`: all `200`, max about `179.6 ms`, average about `118.7 ms`

Interpretation:

- no outage or failed response;
- API `/health` still shows intermittent low-second latency tails and should
  remain under the existing DRE/Ops watch pattern if it recurs.

### Runtime Freshness

`ops:deploy:runtime-freshness` passed:

- worker heartbeat: `PASS`, age `7819 ms`
- market data: `PASS`, age `7819 ms`
- runtime signal lag: `PASS`, age `0 ms`
- runtime sessions: `PASS`, `runningCount=5`, no stale session ids
- runtime decision activity: `SKIP`, disabled for running sessions

### Rollback Guard

Rollback guard result:

- `shouldRollback=false`
- `reasons=[]`
- `alerts=[]`
- workers ready: `ready`
- topology status: `healthy`
- required worker families: `backtest`, `execution`, `market-data`, `market-stream`
- freshness: `PASS`

## Cleanup

- Validation-created `.tmp/prod-auth-cdp-1782572076399` was removed.
- Final process check returned no `msedge`, `chrome`, or
  `chrome-headless-shell` rows.
- No dev server, Playwright, Docker, database, or watcher process was started
  by this heartbeat.

## Process-Lost Retry Recheck

- Wake reason: `process_lost_retry`.
- Fresh read-only public smoke recheck passed before issue closure:
  `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  returned `200` for API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info`.
- Fresh process cleanup check returned no `msedge`, `chrome`, or
  `chrome-headless-shell` rows.

## Residual Risk

- API `/health` had one low-second timing outlier in this five-sample window.
  This is not an outage, and runtime freshness plus rollback guard are green,
  but DRE/Ops should continue narrow correlation if outliers recur or affect
  `/ready`, dashboard, workers readiness, or user journeys.
- The mapped auth-session command hit the wrapper timeout after writing PASS
  artifacts. The artifact is usable, but future script ergonomics could improve
  by exiting immediately after report write and browser cleanup.
