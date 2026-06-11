# LUC-2767 - Coolify Production Deploy Health Sweep (2026-06-07)

## Header

- ID: LUC-2767
- Title: Coolify production deploy health sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Deployment and Reliability Engineer
- Depends on: protected production smoke/auth gates remain separate
- Priority: P0
- Mission ID: LUC-2767-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-07
- Mission Status: VERIFIED_PUBLIC_PARTIAL_PROTECTED_BLOCKED

## Context

Paperclip DRE heartbeat for [LUC-2767](/LUC/issues/LUC-2767), scoped to a
read-only production deploy health sweep after recent Coolify deploy-failure
concern. Wake payload had no pending comments and `fallbackFetchNeeded=false`.
Checkout was already claimed by the harness and was not repeated.

## Goal

Refresh current no-secret production deploy health evidence:

- source commit alignment,
- public API/Web health,
- Coolify project/environment/resource readback,
- redacted log/restart signals,
- rollback and protected readiness posture.

## Constraints

- No deploy, restart, rollback, environment edit, database action, team setting
  change, account action, exchange action, live-trading action, or protected
  smoke rerun.
- Do not print or persist secret values, raw Coolify resource ids, cookies,
  tokens, account passwords, or raw logs.
- Treat protected workers/runtime/alerts checks as fail-closed unless an
  approved read-only production principal is available for this lane.

## Definition of Done

- Current read-only production health facts are captured with timestamps.
- Any unresolved deploy/runtime signal has an owner/action.
- Paperclip issue disposition is explicit.

## Forbidden

- Production mutation of any kind.
- Raw Coolify logs or identifiers in repository artifacts.
- Secret-bearing output.

## Stage

`verification`

## Evidence

Timestamp window: `2026-06-07T10:32:30Z` through `2026-06-07T10:34:16Z` UTC.

### Source Ref Snapshot

- Local `HEAD`: `0e9f8da8174b2d4053196c436757997efcef5b0b`
- Local `origin/main`: `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- Production Web `/api/build-info`: `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- Production build-info metadata source: `github-branch`
- Production build-info checkedAt: `2026-06-07T10:32:30.956Z`
- Production build id: present

Disposition: deployed public Web build-info matches local `origin/main`, not
the dirty local `HEAD`.

### Public Deploy Smoke

Command:

```text
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers
```

Result:

- `PASS API /health -> 200`
- `PASS API /ready -> 200`
- `PASS WEB / -> 200`
- `PASS WEB /api/build-info -> 200`

The public API/Web surface is reachable in this sweep.

### Coolify Read-Only Projection

Command class: authenticated read-only Coolify API calls using configured
environment bindings. Secret values, raw resource ids, and raw logs were not
printed or persisted.

- visible applications: `13`
- visible resources: `17`
- visible deployments: `0`
- projected Soar production resource count: `8`

Resource projection:

| Resource | Kind | Status |
| --- | --- | --- |
| `soar-web` | application | `running:unknown` |
| `soar-api` | application | `running:unknown` |
| `workers-backtest` | application | `running:unknown` |
| `workers-execution` | application | `running:unknown` |
| `workers-market-data` | application | `running:unknown` |
| `workers-market-stream` | application | `running:unknown` |
| `postgresql` | standalone-postgresql | `running:healthy` |
| `redis` | standalone-redis | `running:healthy` |

Application restart projection:

| App | Restart metadata |
| --- | --- |
| `soar-api` | `restart_count=0` |
| `soar-web` | `restart_count=0` |
| `workers-backtest` | `restart_count=0` |
| `workers-execution` | `restart_count=2`, `last_restart_type=crash`, `last_restart_at=2026-06-06T04:12:15.000000Z` |
| `workers-market-data` | `restart_count=0` |
| `workers-market-stream` | `restart_count=0` |

Redacted retained log pattern summary:

| App | Pattern summary |
| --- | --- |
| `soar-api` | no checked `error`, fatal, OOM, dependency, startup, or worker heartbeat pattern |
| `soar-web` | contains `error` string; no fatal/OOM/dependency/startup pattern |
| `workers-backtest` | heartbeat pattern present; no checked error/fatal/crash pattern |
| `workers-execution` | heartbeat and runtime skip patterns present; no checked error/fatal/crash pattern |
| `workers-market-data` | heartbeat pattern present; no checked error/fatal/crash pattern |
| `workers-market-stream` | no checked error/fatal/crash pattern |

Diagnosis: no public outage is visible. The retained Coolify metadata for
`workers-execution` crash remains present and matches the earlier
[LUC-2594](/LUC/issues/LUC-2594) classification:
`unknown_from_retained_coolify_evidence`. This sweep did not find a new
deploy-failure signature in redacted retained log patterns.

### Protected Readiness / Rollback Posture

Command:

```text
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Result:

- failed with `HTTP 401`

Command:

```text
node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result:

- `shouldRollback: true`
- reasons:
  - `workers_ready_endpoint_http_401`
  - `runtime_freshness_endpoint_http_401`
  - `alerts_endpoint_http_401`

Interpretation: this is a fail-closed no-secret result, not proof that workers
are unhealthy. Protected worker readiness, runtime freshness, and alerts still
require an approved read-only production principal.

### Local Tooling Checks

- `corepack pnpm softwarehouse:control-tick`: failed because
  `softwarehouse:control-tick` is not exposed in this checkout.
- `node scripts/checkCoolifyStackEnv.mjs`: failed against the heartbeat process
  environment because the run has Coolify API bindings but not the full deploy
  stack env names; it reported variable names only and redacted secret-like
  values. This is not classified as production stack env failure.
- `node --test scripts/checkCoolifyStackEnv.test.mjs`: PASS (`11/11`).
- `node --test scripts/deploySmokeCheck.test.mjs scripts/checkPostDeployRuntimeFreshness.test.mjs`: PASS (`6/6`).

## Result Report

Outcome: `done` for this read-only deploy health sweep.

Verified:

- public API/Web production smoke is green;
- production Web build-info matches local `origin/main`;
- Coolify read-only project/resource projection succeeds;
- canonical Soar production inventory remains eight resources;
- PostgreSQL and Redis report `running:healthy`;
- retained logs do not show a new fatal/crash/dependency startup signature in
  the checked pattern classes;
- no production mutation occurred.

Not verified:

- protected `/workers/ready`, runtime freshness, and alerts remain `401` in
  this no-secret lane;
- Coolify deployments API did not expose recent deployment rows in this token
  context;
- `workers-execution` retained crash cause remains unknown from retained
  Coolify evidence and is not newly explained by this sweep.

No deploy, restart, rollback, environment edit, database action, protected
smoke, account action, secret disclosure, exchange action, push, commit, or
live-trading action occurred.
