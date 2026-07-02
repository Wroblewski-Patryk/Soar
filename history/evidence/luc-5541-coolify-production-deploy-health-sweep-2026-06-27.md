# LUC-5541 Coolify Production Deploy Health Sweep

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / STALE_TOKEN_RESIDUAL**
- Issue: [LUC-5541](/LUC/issues/LUC-5541)
- Evidence window: 2026-06-27T15:50Z to 2026-06-27T15:53Z
- Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Read-only deploy-health diagnosis for Soar production after fresh board/user
observations that recent Coolify deploys failed.

Included:

- public smoke for API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info`
- protected `/workers/ready` through stale token path and fresh login path
- runtime freshness
- rollback guard
- Web build-info provenance readback
- read-only Coolify project/environment/resource/deployment projection
- source-control and process-cleanup posture

Excluded:

- deploy, push, restart, rollback execution, environment edit,
  secret/account readback, database/Redis mutation, raw log capture,
  production account mutation, exchange action, order, position,
  subscription/payment mutation, or live-trading action

## Wake Context

The wake payload scoped this heartbeat to [LUC-5541](/LUC/issues/LUC-5541)
with no pending comments and `fallbackFetchNeeded=false`. Checkout was already
claimed by the harness, so this heartbeat did not call checkout again.

Heartbeat context showed the issue persisted as `blocked` without
first-class blockers. The issue description explicitly treats recent failed
Coolify deploy observations as fresh operational facts and asks for a
read-only deploy diagnosis even when protected smoke gates remain limited.

## Public And Protected Smoke

Stale-token command:

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- FAIL API `/workers/ready` -> `401`

Interpretation: the pre-bound `SMOKE_AUTH_TOKEN` path remains stale or
insufficient for protected worker readiness.

Fresh-login command, with `SMOKE_AUTH_TOKEN` suppressed only for the child
process:

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- PASS API `/workers/ready` -> `200`

Interpretation: protected workers readiness is healthy through the approved
fresh login path; the stale token is not evidence of an active worker outage.

## Build Info

Production Web `/api/build-info` returned:

- `gitSha`: `42177530f2a2ddc22832133b545bccab6ab404eb`
- `gitRef`: `main`
- `buildId`: `Urnq8xtZUh932c0e3vKGl`
- `metadataGeneratedAt`: `2026-06-15T21:00:54.489Z`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-27T15:52:18.558Z`

`env-runtime` remains diagnostic-only provenance and is not release-grade
build metadata. Build provenance/redeploy sequencing stays a separate release
owner lane.

## Public Timing

Five samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:5` | 200.9 | 64.0 | 200.9, 24.4, 28.6, 35.6, 30.6 |
| API `/ready` | `200:5` | 34.9 | 30.6 | 31.1, 34.9, 32.2, 27.2, 27.7 |
| Web `/` | `200:5` | 168.3 | 82.2 | 168.3, 61.9, 56.1, 58.1, 66.6 |
| Web `/api/build-info` | `200:5` | 43.2 | 36.0 | 43.2, 34.2, 33.9, 33.3, 35.6 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Runtime Freshness

Command:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and
`DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential
family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `13624 ms`, threshold `60000 ms`
- market data freshness: PASS, age `13624 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

## Rollback Guard

Command:

```powershell
node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `ROLLBACK_GUARD_AUTH_EMAIL` and
`ROLLBACK_GUARD_AUTH_PASSWORD` mapped from the approved smoke credential family
only in the child process.

Result:

- `shouldRollback`: `false`
- reasons: none
- workers ready: `ready`
- topology status: `healthy`
- required worker families: `backtest`, `execution`, `market-data`,
  `market-stream`
- freshness: PASS
- running runtime sessions: `5`
- stale session ids: none
- alerts: none

## Coolify / VPS Read-Only Projection

Secret handling:

- Present binding names were checked without values:
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_API_APP_ID`, `COOLIFY_SOAR_WEB_APP_ID`,
  `COOLIFY_SOAR_APP_ID`, `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`,
  `COOLIFY_SOAR_REDIS_RESOURCE_ID`, `COOLIFY_SOAR_TEAM_ID`,
  `COOLIFY_TEAM_ID`, and `VPS_HOST`.
- No token values, raw resource ids, internal URLs, cookies, credentials,
  database values, raw deployment objects, or log bodies were printed or
  stored.

Authenticated Coolify `GET` projection:

| Check | Result | Timing |
| --- | --- | ---: |
| `GET /api/v1/version` | pass `200` | 182 ms |
| `GET /api/v1/teams/current` | pass `200` | 110 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200`, project `Soar` | 59 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 66 ms |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass `200`, environment `production` | 117 ms |
| `GET /api/v1/resources` | pass `200` | 203 ms |
| `GET /api/v1/deployments` | pass `200` | 54 ms |

Production environment projection:

- selector name: `LuckySparrow`
- applications: `6`
- application rows:
  `workers-backtest`, `soar-web`, `workers-market-stream`,
  `workers-execution`, `soar-api`, `workers-market-data`
- application statuses: `running:unknown` for all six rows
- restart counts:
  `workers-backtest=0`, `soar-web=1`, `workers-market-stream=0`,
  `workers-execution=2`, `soar-api=2`, `workers-market-data=0`
- databases: `postgresql` and `redis`, both `running:healthy`
- global resources: `17`
- visible deployment rows: `0`

Host-level VPS pressure, proxy/container-engine pressure, and sanitized
log-window capture were not attempted because this runner exposes `VPS_HOST`
but no approved `SSH*` or dedicated read-only `VPS_*` status credential family.

## Source-Control Closure

Repository state at sweep time:

- branch: `main...origin/main [ahead 13, behind 1]`
- dirty worktree: pre-existing mixed same-day state/evidence/package metadata
  changes from other lanes
- commit: not created
- push: not needed and not authorized
- deploy impact: none

This issue produced only evidence/state updates and did not change runtime
code, package behavior, deployment config, or production state.

## Validation

- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`:
  public PASS, protected `/workers/ready` failed through stale token with
  `401`.
- Same deploy smoke with `SMOKE_AUTH_TOKEN` suppressed:
  all checks passed, including protected `/workers/ready`.
- `node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch`:
  PASS.
- `node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch`:
  PASS, `shouldRollback=false`.
- Public timing:
  API `/health`, API `/ready`, Web `/`, and Web `/api/build-info` all returned
  `200:5`.
- `node --test scripts/checkCoolifyStackEnv.test.mjs`:
  PASS (`11/11`).
- Read-only Coolify `GET` projection:
  PASS, zero visible deployment rows.

## Cleanup

This heartbeat did not start dev servers, Docker containers, Playwright, or
headless browsers. No browser cleanup was required.

## Disposition

[LUC-5541](/LUC/issues/LUC-5541) can close as a read-only deploy-health
checkpoint:

- no active Coolify deployment queue was visible
- production API/Web endpoints passed
- protected workers readiness passed through fresh login
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- PostgreSQL and Redis report `running:healthy`
- no duplicate deploy incident is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready`
- Coolify application rows continue reporting `running:unknown`
- host-level VPS pressure/log-window evidence still requires approved
  read-only host-status credentials
- Web build-info still reports diagnostic `metadataSource=env-runtime`

No deploy, push, restart, rollback execution, env edit, secret/account
readback, DB/Redis mutation, raw log capture, production account mutation,
subscription/payment mutation, exchange mutation, order, position, or
live-trading action occurred.
