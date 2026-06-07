# LUC-2667 - Coolify Production Deploy Health Sweep (2026-06-07)

## Context

Paperclip DRE heartbeat for [LUC-2667](/LUC/issues/LUC-2667), scoped to a
read-only production deploy health sweep after fresh Coolify deploy-failure
concern. Wake payload had no pending comments and `fallbackFetchNeeded=false`.
Checkout was already claimed by the harness and was not repeated.

## Goal

Check current production deploy health without exposing credentials:

- source commit alignment,
- public API/Web health,
- Coolify project/environment/resource readback,
- redacted log/restart signal,
- rollback/protected readiness posture.

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

Timestamp: `2026-06-07T04:32:22Z` through `2026-06-07T04:32:52Z` UTC.

### Source Ref Snapshot

- Local `HEAD`: `9e0e4e09dd993eee65b505f97007831958618609`
- Local `origin/main`: `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- Production Web `/api/build-info`: `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- Production build-info metadata source: `github-branch`
- Production build id: present

Disposition: deployed public Web build-info matches local `origin/main`, not
the dirty local `HEAD`.

### Public Endpoint Probes

- `https://api.soar.luckysparrow.ch/health`: `200`
- `https://api.soar.luckysparrow.ch/ready`: `200`
- `https://soar.luckysparrow.ch/`: `200`
- `https://soar.luckysparrow.ch/api/build-info`: `200`

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

- Soar project visible: `true`
- configured production environment read: `ok`
- visible Coolify resource count: `17`
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

Read-only API reachability:

- `GET /api/v1/deployments`: `200`, `0` rows visible in this token context.
- `GET /api/v1/applications`: `200`, `13` rows visible.
- `GET /api/v1/resources`: `200`, `17` rows visible.

Redacted app log/restart projection:

| App | Restart metadata | Log pattern summary |
| --- | --- | --- |
| `soar-api` | `restart_count=0` | none of checked patterns |
| `soar-web` | `restart_count=0` | contains `error` string |
| `workers-execution` | `restart_count=2`, `last_restart_type=crash`, `last_restart_at=2026-06-06T04:12:15.000000Z` | contains `worker_heartbeat`; no fresh retained-tail classification |
| `workers-market-stream` | `restart_count=0` | none of checked patterns |

Diagnosis: no public outage is visible. The same retained Coolify metadata for
`workers-execution` crash remains present and was already classified in
[LUC-2594](/LUC/issues/LUC-2594) as
`unknown_from_retained_coolify_evidence`; this heartbeat did not find a new
deploy-failure signature in the redacted retained tail.

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

## Result Report

Outcome: `done` for this read-only deploy health sweep.

What is verified:

- public API/Web production health is green;
- production Web build-info matches local `origin/main`;
- Coolify read-only project/resource projection succeeds;
- canonical Soar production inventory remains eight resources;
- PostgreSQL and Redis report `running:healthy`;
- no production mutation occurred.

What is not verified:

- protected `/workers/ready`, runtime freshness, and alerts remain `401` in
  this no-secret lane;
- Coolify deployments API did not expose recent deployment rows in this token
  context;
- `workers-execution` retained crash cause remains unknown from retained
  Coolify evidence and is not newly explained by this sweep.

No deploy, restart, rollback, environment edit, database action, protected
smoke, account action, secret disclosure, exchange action, or live-trading
action occurred.
