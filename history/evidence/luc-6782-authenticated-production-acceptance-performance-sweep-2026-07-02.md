# LUC-6782 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `BLOCKED / PRODUCTION_WEB_503 / WORKERS_READY_503 / AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE / RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`
- Issue: [LUC-6782](/LUC/issues/LUC-6782)
- Evidence date: 2026-07-02
- Generated at UTC: 2026-07-02T04:37:24Z
- Scope: QVE read-only production acceptance and performance sweep.

## Safety Boundary

- No product code, commit, push, deploy, restart, rollback execution, env edit,
  secret/account value readback, DB/Redis mutation, production account
  mutation, exchange/payment mutation, order, position, subscription mutation,
  or live-trading action occurred.
- Production audit-login refs were used through environment-only script inputs.
  Secret values, cookies, tokens, and protected response bodies were not
  printed or written to artifacts.

## Validation

### `pnpm run -s ops:deploy:smoke`

- Exit: `1`
- API `/health`: `PASS 200`
- API `/ready`: `PASS 200`
- Web `/`: `FAIL status 503`
- Web `/api/build-info`: `FAIL status 503`
- API `/workers/ready`: `FAIL status 503`

### `pnpm run -s ops:deploy:runtime-freshness`

- Exit: `0`
- Result: `PASS`
- Worker heartbeat age: `18179 ms`
- Market data age: `18179 ms`
- Runtime signal lag: `0 ms`
- Runtime sessions: `PASS`, running count `5`, stale session IDs `[]`

### `pnpm run -s ops:deploy:rollback-guard`

- Exit: `1`
- `shouldRollback`: `true`
- Reasons: `workers_ready_endpoint_http_503`
- Runtime freshness in rollback guard: `PASS`
- Alerts: `[]`

### `pnpm run -s ops:ui:prod-clickthrough -- --today 2026-07-02`

- Exit: `1`
- Result: `FAIL`
- Dashboard auth: `login:present`
- Admin auth: `login:present`
- Public routes: `FAIL:4`
- Dashboard routes: `FAIL:18`
- Admin routes: `FAIL:3`
- Legacy redirects: `FAIL:3`
- Evidence:
  `history/evidence/luc-6782-prod-ui-module-clickthrough-2026-07-02.md`
- Artifact:
  `history/artifacts/luc-6782-prod-ui-module-clickthrough-2026-07-02.json`

### `pnpm run -s ops:prod-auth:proof -- --today 2026-07-02 --i-understand-production-auth-proof`

- Exit: `1`
- Result: blocked before browser proof because Web `/api/build-info` returned
  `503`, so build-info freshness could not pass.
- No auth proof artifact was written by the script because it fails before
  evidence emission when build-info is unavailable.

## Interpretation

- Authenticated production acceptance is not executable while the production Web
  service returns `503` for public, auth, dashboard, admin, and build-info
  routes.
- API health/readiness and runtime freshness remain healthy enough to show that
  the failure is not a total API outage.
- The rollback guard is still actioning `shouldRollback=true` due to protected
  `/workers/ready` returning `503`.

## Existing Unblock Path

- Ops Release Lead / board-approved Coolify mutation owner continues
  [LUC-6331](/LUC/issues/LUC-6331) to restore production Web/build-info and
  backtest-worker readiness.
- After [LUC-6331](/LUC/issues/LUC-6331) is resolved, QVE should rerun:
  - `pnpm run -s ops:deploy:smoke`
  - `pnpm run -s ops:deploy:runtime-freshness`
  - `pnpm run -s ops:deploy:rollback-guard`
  - `pnpm run -s ops:ui:prod-clickthrough -- --today <date>`
  - `pnpm run -s ops:prod-auth:proof -- --today <date> --i-understand-production-auth-proof`
