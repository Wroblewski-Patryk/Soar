# LUC-6854 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `BLOCKED / PRODUCTION_WEB_503 / WORKERS_READY_503 / AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE / RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`
- Issue: [LUC-6854](/LUC/issues/LUC-6854)
- Evidence date: 2026-07-02
- Generated at UTC: 2026-07-02T10:40:00Z
- Scope: QVE read-only production acceptance and performance sweep.

## Safety Boundary

- No product code, commit, push, deploy, restart, rollback execution, env edit,
  secret/account value readback, DB/Redis mutation, production account
  mutation, exchange/payment mutation, order, position, subscription mutation,
  or live-trading action occurred.
- Production audit-login refs were used only through process environment
  bindings. Secret values, cookies, tokens, and protected response bodies were
  not written to artifacts.

## Validation

### Public Deploy Smoke

Command:

```powershell
$env:SMOKE_TIMEOUT_MS='10000'
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `FAIL`.

- API `/health`: `PASS 200`
- API `/ready`: `PASS 200`
- Web `/`: `FAIL 503`
- Web `/api/build-info`: `FAIL 503`

### Protected Worker Readiness

Command used existing production audit auth bindings without printing secret
values.

```powershell
$env:SMOKE_TIMEOUT_MS='10000'
$env:SMOKE_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:SMOKE_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL`.

- API `/health`: `PASS 200`
- API `/ready`: `PASS 200`
- Web `/`: `FAIL 503`
- Web `/api/build-info`: `FAIL 503`
- API `/workers/ready`: `FAIL 503`

### Runtime Freshness

Command:

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:DEPLOY_FRESHNESS_TIMEOUT_MS='10000'
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness
```

Result: `PASS`.

- worker heartbeat age: `8611 ms`
- market data age: `8611 ms`
- runtime signal lag: `0 ms`
- running sessions: `5`
- stale session IDs: `[]`

### Rollback Guard

Command:

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:ROLLBACK_GUARD_TIMEOUT_MS='10000'
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:rollback-guard
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`.

- checked at: `2026-07-02T10:37:47.711Z`
- `shouldRollback`: `true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`

### Production UI Module Clickthrough

Command:

```powershell
pnpm run -s ops:ui:prod-clickthrough -- --today 2026-07-02 --output-json history/artifacts/luc-6854-prod-ui-module-clickthrough-2026-07-02.json --output-md history/evidence/luc-6854-prod-ui-module-clickthrough-2026-07-02.md
```

Result: `FAIL`.

- Dashboard auth: `login:present`
- Admin auth: `login:present`
- Public routes: `FAIL:4`
- Dashboard routes: `FAIL:18`
- Admin routes: `FAIL:3`
- Legacy redirects: `FAIL:3`
- Build-info: `503`
- Evidence: `history/evidence/luc-6854-prod-ui-module-clickthrough-2026-07-02.md`
- Artifact: `history/artifacts/luc-6854-prod-ui-module-clickthrough-2026-07-02.json`

### Production Auth Session Browser Proof

Command:

```powershell
pnpm run -s ops:prod-auth:proof -- --today 2026-07-02 --output-json history/artifacts/luc-6854-prod-auth-session-browser-proof-2026-07-02.json --output-md history/evidence/luc-6854-prod-auth-session-browser-proof-2026-07-02.md --i-understand-production-auth-proof
```

Result: `FAIL` before browser/session proof.

- Error: `build-info does not match expected SHA`
- Cause: production Web `/api/build-info` returned `503`
- No auth-session artifact was written because the script fails closed before
  browser proof when build-info is unavailable.

## Representative HTTP Timing

Command:

```powershell
curl.exe -L -s -o NUL -w "%{http_code} %{time_total}" --max-time 15 <url>
```

Result:

- API `/health`: `200`, `0.300070s`
- API `/ready`: `200`, `0.554321s`
- Web `/`: `503`, `0.214113s`
- Web `/auth/login`: `503`, `0.591402s`
- Web `/api/build-info`: `503`, `0.261373s`
- API `/workers/ready` unauthenticated: `401`, `0.431520s`

## Source Control

- Repo: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch: `main`
- HEAD: `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- `origin/main`: `c357d957741f56835f27a1fc3a948dad43a91036`
- Git relation: `main...origin/main` is `[ahead 22, behind 3]`
- Worktree: dirty before this heartbeat from existing lanes; this heartbeat
  added only scoped [LUC-6854](/LUC/issues/LUC-6854) evidence/task/artifact
  files.
- Commit/push: not attempted.
- Deploy impact: none.

## Interpretation

- Authenticated production acceptance is not executable while production Web
  and build-info return `503`.
- API `/health`, API `/ready`, and runtime freshness pass, so the evidence does
  not show a total API/runtime outage.
- Protected worker readiness still returns `503`, and rollback guard returns
  `shouldRollback=true`.

## Existing Unblock Path

- Ops Release Lead / board-approved Coolify mutation owner continues
  [LUC-6331](/LUC/issues/LUC-6331) to restore production Web/build-info and
  backtest-worker readiness.
- After [LUC-6331](/LUC/issues/LUC-6331) is resolved, QVE should rerun:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  - `pnpm run -s ops:deploy:runtime-freshness`
  - `pnpm run -s ops:deploy:rollback-guard`
  - `pnpm run -s ops:ui:prod-clickthrough -- --today <date>`
  - `pnpm run -s ops:prod-auth:proof -- --today <date> --i-understand-production-auth-proof`
