# LUC-2590 - Coolify Production Deploy Health Sweep (2026-06-07)

## Context

Paperclip DRE heartbeat for [LUC-2590](/LUC/issues/LUC-2590), scoped to
read-only Coolify/VPS deploy health diagnosis after fresh board/user
observations that recent Coolify deploys may have failed.

Wake payload:

- reason: `issue_assigned`
- issue: [LUC-2590](/LUC/issues/LUC-2590)
- fallback fetch needed: `false`
- pending comments: `0/0`
- checkout: already claimed by harness, not repeated

## Goal

Check production deploy health without exposing credentials:

- Coolify project/environment/resource status
- public API/Web health and build-info
- source commit alignment
- read-only deployment/log availability
- rollback/protected readiness posture
- required follow-up when diagnosis cannot close safely

## Constraints

- No deploy, restart, rollback, environment edit, database action, team setting
  change, protected smoke, account action, exchange action, or live-trading
  action.
- Do not print or persist secret values, raw resource ids, cookies, tokens, or
  raw logs that may contain secret-adjacent material.
- Treat protected `/workers/ready`, runtime freshness, alerts, host logs, and
  terminal access as fail-closed unless approved through the proper owner path.

## Definition of Done

- Read-only production health facts are captured with timestamps.
- Any unresolved deploy/runtime signal has a named owner/action.
- Paperclip issue disposition is explicit.

## Forbidden

- Redeploy/restart/rollback.
- Raw Coolify logs or IDs in repository artifacts.
- Secret-bearing output.

## Stage

`verification`

## Evidence

Timestamp: `2026-06-06T22:32:42Z` through `2026-06-06T22:35:04Z` UTC.

### Source Ref Snapshot

- Local `HEAD`: `9e0e4e09dd993eee65b505f97007831958618609`
- Local `origin/main`: `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- Production Web `/api/build-info`: `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- Production build-info metadata source: `github-branch`
- Production build id: present (`Xnn0H5fuVVTeahYMA8tvy`)

Disposition: deployed public Web build-info matches local `origin/main`, not
the dirty local `HEAD`.

### Coolify Project/Environment Read

Command class: authenticated read-only Coolify API calls using configured
Paperclip-provided environment bindings. Secret values and raw ids were not
printed.

- `GET /api/v1/projects/{project-id}/production`: `ok`
- canonical production resource count: `8`

Resource projection:

| Resource | Kind | Status |
| --- | --- | --- |
| `soar-web` | application | `running:unknown` |
| `soar-api` | application | `running:unknown` |
| `workers-backtest` | application | `running:unknown` |
| `workers-execution` | application | `running:unknown` |
| `workers-market-data` | application | `running:unknown` |
| `workers-market-stream` | application | `running:unknown` |
| `postgresql` | PostgreSQL | `running:healthy` |
| `redis` | Redis | `running:healthy` |

Read-only API reachability:

- `GET /api/v1/deployments`: `200`, `0` rows visible in this token context.
- `GET /api/v1/applications`: `200`, `13` rows visible.
- `GET /api/v1/resources`: `200`, `17` rows visible.

App-scoped endpoint probes:

- `/api/v1/applications/{uuid}/logs`: `200` for sampled Soar apps.
- `/api/v1/applications/{uuid}/deployments`: `404` for sampled Soar apps.

Raw UUIDs and raw logs were not persisted.

### Public Smoke

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

### Log/Restart Summary

Read-only log endpoint was reachable for sampled apps. Only pattern summaries
were recorded.

| App | Restart metadata | Log pattern summary |
| --- | --- | --- |
| `soar-api` | `restart_count=0`, no current restart type | tail contains `server_started`; no `fatal`, OOM, or `error` pattern |
| `soar-web` | `restart_count=0`, no current restart type | tail contains an `error` string; raw text not persisted |
| `workers-backtest` | `restart_count=0`, no current restart type | tail contains `worker_heartbeat`; no `fatal`, OOM, or `error` pattern |
| `workers-execution` | `last_restart_type=crash`, `last_restart_at=2026-06-06T04:12:15.000000Z`, `restart_count=2` | sampled tail did not expose `fatal`, OOM, or `error` pattern |
| `workers-market-data` | `restart_count=0`, no current restart type | tail contains `worker_heartbeat`; no `fatal`, OOM, or `error` pattern |
| `workers-market-stream` | `restart_count=0`, no current restart type | no `fatal`, OOM, or `error` pattern in sampled tail |

Diagnosis: no public outage is visible, but `workers-execution` has fresh crash
metadata that is not explained by the accessible log tail.

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
are unhealthy. Protected worker readiness, runtime freshness, and alert checks
still require an approved read-only principal.

## Follow-Up Created

Created child issue [LUC-2594](/LUC/issues/LUC-2594):

- title: `[Soar][Ops][LUC-2590] Diagnose workers-execution Coolify crash metadata read-only`
- owner: DRE
- status at creation: `todo`
- scope: retrieve and classify read-only, redacted evidence for
  `workers-execution` crash metadata without deploy/restart/rollback/protected
  smoke or secret exposure.

## Result Report

Outcome at sweep time: `blocked by child diagnosis`; final outcome after
[LUC-2594](/LUC/issues/LUC-2594) closure addendum: `done`.

What is verified:

- Coolify project/environment read succeeds.
- Canonical production inventory remains eight resources.
- PostgreSQL and Redis report `running:healthy`.
- Public API/Web smoke passes.
- Production Web build-info matches local `origin/main`.

What is not verified:

- Protected `/workers/ready`, runtime freshness, and alerts remain `401` in
  this no-secret lane.
- `workers-execution` crash cause is unknown from accessible Coolify tail logs.
- Coolify deployments API did not expose recent deployment rows in this token
  context.

No production mutation occurred.

## Closure Addendum - 2026-06-07

Child diagnosis [LUC-2594](/LUC/issues/LUC-2594) completed and the parent
blocker was cleared in Paperclip.

- [LUC-2594](/LUC/issues/LUC-2594) classification:
  `unknown_from_retained_coolify_evidence`.
- The `workers-execution` crash metadata remains real, but retained Coolify
  read-only evidence did not classify it as OOM/resource, process-exit,
  database/Redis dependency, exchange credential, deploy, or startup failure.
- [LUC-2590](/LUC/issues/LUC-2590) final Paperclip disposition: `done`, with
  no remaining first-class blockers.
- Protected worker readiness/freshness/alerts remain separate auth-gated
  release proof, not verified by this sweep or the child diagnosis.

Evidence:
`history/tasks/luc-2594-workers-execution-coolify-crash-metadata-diagnosis-2026-06-07-task.md`.
