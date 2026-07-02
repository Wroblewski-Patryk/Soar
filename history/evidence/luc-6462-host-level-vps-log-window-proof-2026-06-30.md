# LUC-6462 Host-Level VPS / Log-Window Proof

Date: 2026-06-30

## Scope

Read-only DRE evidence capture for current Soar production Web `503` and
protected backtest-worker readiness `503`.

No deploy, push, restart, rollback execution, env edit, database/Redis
mutation, production account mutation, exchange/payment mutation, order,
position, subscription mutation, live-trading action, secret value readback, or
raw log-body storage was performed.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `dedb0e532defe0afddf12c5a5d130295a72af660`
- Worktree: dirty before this heartbeat from unrelated lanes; this heartbeat
  adds only LUC-6462 evidence/task/state notes.

## Wake Context

[LUC-6462](/LUC/issues/LUC-6462) was assigned under parent
[LUC-6459](/LUC/issues/LUC-6459) to obtain host-level VPS/log-window evidence
for current production health. The inline wake had no pending comments and did
not require fallback thread fetch.

## Host-Level SSH Attempt

Command class: read-only SSH probe against `VPS_HOST`, without printing the host
value or any secrets.

Result: `BLOCKED`

- `VPS_HOST`: present by name.
- `SSH_AUTH_SOCK`: absent.
- SSH returned `Permission denied (publickey,password)`.
- No host shell commands executed, so direct `uptime`, disk, memory,
  `docker ps`, `journalctl`, or host `docker logs` proof could not be captured.

Unblock owner/action: Ops/Security must bind an approved read-only SSH
principal or agent socket for the DRE runtime, or provide an approved
host-status collector that can run names-only pressure and redacted last-window
Docker/journal summaries.

## Coolify Production Projection

Authenticated read-only Coolify API calls used current environment bindings by
name only. No tokens, raw resource ids, internal URLs, or raw Coolify objects
were stored.

- project production endpoint: `200`
- global resources endpoint: `200`
- visible resource rows: `17`
- production application rows: `6`
- PostgreSQL: `running:healthy`
- Redis: `running:healthy`

Application projection:

| Resource | Status | Log Window | Deployment Rows | Source Ref |
| --- | --- | --- | ---: | --- |
| `soar-web` | `exited:unhealthy` | `400 Application is not running.` | 8 | `main` / `b894e5dd30614` |
| `workers-backtest` | `exited:unhealthy` | `400 Application is not running.` | 8 | `main` / `HEAD` |
| `soar-api` | `running:unknown` | `200`, 120-line redacted summary | 8 | `main` / `HEAD` |
| `workers-execution` | `running:unknown`, restart count `2` | `200`, 120-line redacted summary | 8 | `main` / `HEAD` |
| `workers-market-data` | `running:unknown` | `200`, 120-line redacted summary | 8 | `main` / `HEAD` |
| `workers-market-stream` | `running:unknown` | `200`, 120-line redacted summary | 8 | `main` / `HEAD` |

Deployment rows: the latest sampled rows for all six applications remain
`queued` at short commit `3bd65e21d09f`, created
`2026-06-28T06:23:11Z`. No redeploy or retry was triggered.

## Redacted Log-Window Summary

Coolify application log endpoint behavior:

- `soar-web`: unavailable through API because Coolify reports the application is
  not running. This correlates with Web `/` and `/api/build-info` returning
  `503`.
- `workers-backtest`: unavailable through API because Coolify reports the
  application is not running. This correlates with protected
  `/workers/ready -> 503`.
- `soar-api`: last 120 returned lines had no `error`, `exception`, `fatal`,
  `traceback`, `timeout`, `prisma`, `redis`, `postgres`, `permission denied`,
  `cannot find`, or `module not found` hits; sampled summary included `503`
  hits and `ready` hits from request/health traffic.
- `workers-execution`: last 120 returned lines had no sampled error-pattern
  hits; first ISO timestamp in returned window was
  `2026-06-30T19:56:52.600Z`.
- `workers-market-data`: last 120 returned lines had no sampled error-pattern
  hits except one `503` token; first ISO timestamp in returned window was
  `2026-06-30T19:27:01.358Z`.
- `workers-market-stream`: last 120 returned lines had no sampled
  error-pattern hits.

Raw log bodies were not persisted.

## Correlated Runtime Checks

### Deploy Smoke

```powershell
$env:SMOKE_TIMEOUT_MS='12000'
pnpm exec node scripts/deploySmokeCheck.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL`

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 503`
- `WEB /api/build-info -> 503`
- `API /workers/ready -> 503`

### Runtime Freshness

Command used process-local mapping from the approved audit-login namespace to
`DEPLOY_FRESHNESS_*` without printing values.

```powershell
pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 12000
```

Result: `PASS`

- worker heartbeat: `PASS`, age `4249 ms`
- market data: `PASS`, age `4249 ms`
- runtime signal lag: `PASS`, age `0 ms`
- runtime sessions: `PASS`, running count `5`, stale session ids `[]`
- runtime decision activity: `SKIP`, not required for running sessions

### Rollback Guard

Command used process-local mapping from the approved audit-login namespace to
`ROLLBACK_GUARD_*` without printing values.

```powershell
$env:ROLLBACK_GUARD_TIMEOUT_MS='12000'
pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at `2026-06-30T19:57:44.130Z`
- `shouldRollback=true`
- reason: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`

No rollback was executed.

## Diagnosis

The current production failure is not explained by API, database, Redis,
market-data freshness, or runtime-session freshness. The strongest read-only
evidence is resource-level availability:

- `soar-web` is `exited:unhealthy` in Coolify and public Web routes return
  `503`.
- `workers-backtest` is `exited:unhealthy` in Coolify and protected
  `/workers/ready` returns `503`.
- Other worker/API application rows are not crash-confirmed by this projection,
  and their accessible log windows did not show sampled fatal/error patterns.

Direct host proof remains blocked by missing SSH authentication, so this packet
is a Coolify/log-window proof plus an explicit host-credential blocker.

## Disposition

`BLOCKED / COOLIFY_LOG_WINDOW_PROOF_CAPTURED / HOST_SSH_PROOF_BLOCKED /
PRODUCTION_WEB_503 / WORKERS_BACKTEST_EXITED_UNHEALTHY /
ROLLBACK_GUARD_ACTION_REQUIRED`.

## Next Owner

[LUC-6331](/LUC/issues/LUC-6331) remains the active production restoration
path for Web and backtest-worker recovery. Ops/Security should separately bind
approved read-only SSH/host-status access if the board requires true host shell
pressure/log proof beyond Coolify API evidence. DRE/QVE rerun the production
watch and acceptance proofs after [LUC-6331](/LUC/issues/LUC-6331) resolves.
