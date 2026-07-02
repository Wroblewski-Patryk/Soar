# LUC-6551 Authenticated Production Acceptance And Performance Sweep

Date: 2026-07-01

## Scope

Read-only QVE production acceptance and performance sweep for Soar production.

No deploy, push, restart, rollback execution, env edit, secret/account value
readback, DB/Redis mutation, production account mutation, exchange/payment
mutation, order, position, subscription mutation, or live-trading action was
performed.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- Worktree: dirty before this heartbeat from unrelated lanes; this heartbeat
  added only scoped LUC-6551 evidence/artifacts/state notes.

## Credential Boundary

Current runner bindings were checked by name/length only:

- `PROD_UI_AUDIT_API_BASE_URL`: present
- `PROD_UI_AUDIT_WEB_BASE_URL`: absent in this runner
- `PROD_UI_AUDIT_AUTH_EMAIL`: absent in this runner
- `PROD_UI_AUDIT_AUTH_PASSWORD`: absent in this runner
- `SMOKE_AUTH_TOKEN`: absent in this runner

Secret values, cookies, tokens, passwords, account payloads, and screenshots
were not printed or stored.

## Checks

### Production Deploy Smoke

```powershell
$env:SMOKE_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:SMOKE_WEB_BASE_URL='https://soar.luckysparrow.ch'
pnpm run -s ops:deploy:smoke
```

Result: `FAIL`

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `503`
- Web `/api/build-info`: `503`
- API `/workers/ready`: `401` in this unauthenticated smoke runner

### Runtime Freshness

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'
pnpm run -s ops:deploy:runtime-freshness
```

Result: `PASS`

- worker heartbeat age: `12465 ms`
- market data age: `12465 ms`
- runtime signal lag: `0 ms`
- runtime sessions: `5` running, stale session ids `[]`
- runtime decision activity: `SKIP`, not required for running sessions

### Rollback Guard

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL='https://api.soar.luckysparrow.ch'
pnpm run -s ops:deploy:rollback-guard
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at `2026-07-01T04:39:44.414Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`

No rollback was executed.

### Production UI Clickthrough

```powershell
pnpm run -s ops:ui:prod-clickthrough -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --output-json history/artifacts/luc-6551-prod-ui-module-clickthrough-2026-07-01.json --output-md history/evidence/luc-6551-prod-ui-module-clickthrough-2026-07-01.md --today 2026-07-01
```

Result: `FAIL`

- public routes: `FAIL:4`
- dashboard routes: `FAIL:18`
- admin routes: `FAIL:3`
- legacy redirects: `FAIL:3`
- Web build-info status: `503`
- dashboard auth: `login:present`
- admin auth: `login:present`

### Representative Performance

Authenticated browser acceptance and Web performance are not executable while
the production Web frontend returns `503`. Runtime freshness remains healthy,
so the current release risk is availability/readiness, not stale worker or
market runtime data.

An attempted ad hoc PowerShell timing sample was discarded because
`Invoke-WebRequest` returned local `ERR` results inconsistent with the
project-native Node smoke results. The accepted evidence for this heartbeat is
the project-native deploy smoke, runtime freshness, rollback guard, and
clickthrough artifact.

## Interpretation

Authenticated browser acceptance cannot be accepted in this heartbeat.
Production API health/readiness and runtime freshness are healthy, but the
production Web frontend is unavailable and protected worker readiness is not
acceptable for release. This matches the production restoration class already
tracked by [LUC-6331](/LUC/issues/LUC-6331), not a fresh Backend/Auth repair
finding.

## Evidence

- UI clickthrough markdown:
  `history/evidence/luc-6551-prod-ui-module-clickthrough-2026-07-01.md`
- UI clickthrough JSON:
  `history/artifacts/luc-6551-prod-ui-module-clickthrough-2026-07-01.json`
- Task packet:
  `history/tasks/luc-6551-authenticated-production-acceptance-performance-sweep-2026-07-01-task.md`

## Disposition

`BLOCKED / PRODUCTION_WEB_503 / WORKERS_READY_NOT_ACCEPTABLE /
AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE / RUNTIME_FRESHNESS_PASS /
ROLLBACK_GUARD_ACTION_REQUIRED`.

Paperclip control-plane result:

- `GET /api/health` on `http://127.0.0.1:3201` returned `ok`.
- `GET /api/issues/LUC-6551/heartbeat-context` returned `in_progress` before
  status update.
- `POST /api/issues/LUC-6551/comments` timed out locally after `15s`, but
  follow-up heartbeat-context readback showed `totalComments=1` and latest
  comment id `467b06f9-89bf-427a-bc34-d2cb727070be`.
- `PATCH /api/issues/LUC-6551` returned `identifier=LUC-6551` and
  `status=blocked`.

## Next Owner

Ops Release Lead / board-approved Coolify mutation owner resolves
[LUC-6331](/LUC/issues/LUC-6331) by restoring or rolling back `soar-web` and
`workers-backtest`, then QVE reruns deploy smoke, runtime freshness, rollback
guard, UI clickthrough, authenticated browser acceptance, and representative
performance timing with approved auth bindings.

## Comment-Triggered Recheck

At the 2026-07-01 wake for comment
`467b06f9-89bf-427a-bc34-d2cb727070be`, QVE treated the latest comment as a
blocker confirmation rather than an unblock signal. A bounded read-only recheck
was run before preserving the blocked disposition.

Commands:

```powershell
pnpm run -s ops:deploy:smoke
curl.exe -sS -o NUL -w "API /health HTTP %{http_code} time_total=%{time_total}\n" https://api.soar.luckysparrow.ch/health
curl.exe -sS -o NUL -w "API /ready HTTP %{http_code} time_total=%{time_total}\n" https://api.soar.luckysparrow.ch/ready
curl.exe -sS -o NUL -w "API /workers/ready HTTP %{http_code} time_total=%{time_total}\n" https://api.soar.luckysparrow.ch/workers/ready
pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- default `ops:deploy:smoke`: `FAIL`, all five default-binding checks returned
  `fetch failed`; current runner has no `SMOKE_API_BASE_URL`,
  `SMOKE_WEB_BASE_URL`, `SMOKE_AUTH_TOKEN`, `SMOKE_AUTH_EMAIL`, or
  `SMOKE_AUTH_PASSWORD` bindings.
- audit auth binding name/length check: `PROD_UI_AUDIT_AUTH_EMAIL` present,
  `PROD_UI_AUDIT_AUTH_PASSWORD` present; values were not printed or stored.
- explicit production curl checks: API `/health -> 200`, API `/ready -> 200`,
  unauthenticated API `/workers/ready -> 401`.
- explicit production deploy smoke: `FAIL`; API `/health -> 200`, API
  `/ready -> 200`, Web `/ -> 503`, Web `/api/build-info -> 503`, API
  `/workers/ready -> 401`.

Interpretation:

Production Web remains unavailable, so authenticated browser acceptance and Web
performance are still not executable. The issue remains blocked on
[LUC-6331](/LUC/issues/LUC-6331) and the named unblock owner/action is still
Ops Release Lead / board-approved Coolify mutation owner restoring or rolling
back `soar-web` and `workers-backtest`.

## Reopened Comment Recheck

At the 2026-07-01 wake for comment
`a7041a06-ac02-4cf7-9868-4c3baa82c2ff`, QVE treated the latest comment as a
confirmation of the existing blocker, not an unblock signal. The scope remained
read-only production verification. No deploy, restart, rollback, env edit,
secret readback, DB/Redis mutation, production account mutation, exchange or
payment action, order, position, subscription mutation, or live-trading action
occurred.

Command:

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- API `/health -> 200`: pass.
- API `/ready -> 200`: pass.
- Web `/ -> 503`: fail.
- Web `/api/build-info -> 503`: fail.
- API `/workers/ready -> 401`: fail-closed in the unauthenticated runner.

Interpretation:

Production Web remains unavailable, so authenticated browser acceptance and Web
performance are still not executable. [LUC-6551](/LUC/issues/LUC-6551) remains
blocked by [LUC-6331](/LUC/issues/LUC-6331). The unblock owner/action remains
Ops Release Lead / board-approved Coolify mutation owner restoring or rolling
back `soar-web` and `workers-backtest`, then QVE reruns acceptance with
approved auth bindings.
