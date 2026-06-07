# LUC-2594 - Workers Execution Coolify Crash Metadata Diagnosis (2026-06-07)

## Context

Paperclip DRE heartbeat for [LUC-2594](/LUC/issues/LUC-2594), the read-only
diagnosis child created by [LUC-2590](/LUC/issues/LUC-2590).

Wake payload:

- reason: `issue_assigned`
- issue: [LUC-2594](/LUC/issues/LUC-2594)
- fallback fetch needed: `false`
- pending comments: `0/0`
- checkout: already claimed by harness, not repeated

## Goal

Classify the `workers-execution` Coolify crash metadata from
`2026-06-06T04:12:15.000000Z` using read-only, redacted evidence.

## Scope

- Coolify project/environment readback for the `Soar / production` hierarchy.
- Coolify application metadata for `workers-execution`.
- Coolify application log endpoint pattern summary.
- Coolify deployment endpoint visibility.
- Local source inspection of the visible worker log vocabulary.
- Local env-check regression for the Coolify stack checker.

## Constraints

- No deploy, restart, rollback, environment edit, database action, protected
  smoke, account action, exchange action, or live-trading action.
- Do not persist secret values, raw resource ids, cookies, tokens, or raw log
  payloads.
- Treat host-level retained logs, terminal export, and protected worker
  readiness/freshness as separate approval-gated paths.

## Definition of Done

- Crash metadata is classified as specifically as retained read-only evidence
  allows.
- Evidence limits are explicit.
- Parent [LUC-2590](/LUC/issues/LUC-2590) can close its child blocker without
  pretending protected worker readiness is verified.

## Forbidden

- Redeploy/restart/rollback.
- Raw Coolify logs or UUIDs in repository artifacts.
- Secret-bearing output.
- Host-level or terminal access without a fresh explicit approval.

## Stage

`verification`

## Evidence

Timestamp: `2026-06-06T22:40:21Z` UTC.

### Coolify Read-Only Metadata

Command class: authenticated read-only Coolify API calls using configured
Paperclip-provided environment bindings. Secret values and raw ids were not
printed or persisted.

- `GET /api/v1/projects/{project-id}/production`: pass.
- Production resource projection: six applications, one PostgreSQL, one Redis.
- `workers-execution` status: `running:unknown`.
- `workers-execution` restart metadata:
  - `restart_count=2`
  - `last_restart_type=crash`
  - `last_restart_at=2026-06-06T04:12:15.000000Z`
- Branch metadata: `main`.
- Git commit metadata: present, not persisted.
- Public FQDN: absent, as expected for a private worker.

### Log Endpoint Pattern Summary

- `GET /api/v1/applications/{workers-execution}/logs`: `200`.
- Retained tail size visible to this token: `100` non-empty lines.
- Current-tail signals:
  - heartbeat/current processing signal present;
  - runtime position automation skip messages present;
  - no `fatal` pattern;
  - no OOM/out-of-memory pattern;
  - no process-exit pattern;
  - no Prisma/Postgres/Redis dependency failure pattern;
  - no module/startup packaging failure pattern.

Redacted first/last-line hints showed current processing/skip messages only,
for example execution-context unresolved and BOT-origin position ownership
skip classifications. Local source inspection maps those messages to expected
skip branches in `runtimePositionAutomation.service.ts`; they are not throw or
process-exit paths.

### Deployment Endpoint Visibility

- `GET /api/v1/applications/{workers-execution}/deployments`: `404` in this
  token context.
- `GET /api/v1/deployments`: `200`, `0` rows visible.
- `GET /api/v1/applications`: `200`, `13` rows visible.

Interpretation: the current Coolify token does not expose a retained deployment
row or crash-window deployment log that can explain the restart metadata.

### Local Source Correlation

Relevant local source:

- `apps/api/Dockerfile.worker.execution` directly starts
  `node dist/workers/execution.worker.js`.
- `apps/api/src/workers/execution.worker.ts` starts worker heartbeat,
  `livePositionReconciliationLoop`, `runtimeSignalLoop`, and
  `runtimeScanLoop`; `ensureRuntimeSignalLoopStarted` catches startup errors
  and records telemetry rather than exiting.
- `scripts/start-workers-prod.mjs` would exit when a child worker exits, but
  the execution worker Dockerfile does not use that aggregate wrapper.
- `runtimePositionAutomation.service.ts` contains the visible skip-message
  vocabulary for unresolved execution context and BOT-origin position ownership.

This source correlation supports classifying the retained tail as current
non-fatal runtime processing, not as the crash signature.

### Validation

```text
corepack pnpm run ops:coolify-stack:env-check:test
```

Result: pass (`8/8`).

One local PowerShell probe attempt failed before any Coolify request because
the shell does not support the `??` operator. The probe was rerun with
PowerShell-compatible conditionals and succeeded.

## Classification

`unknown_from_retained_coolify_evidence`.

The crash metadata is real and still present in Coolify, but the retained
read-only Coolify evidence available to this DRE lane does not classify it as:

- OOM/resource exhaustion;
- process exit signature;
- database/Redis dependency failure;
- exchange/API credential failure;
- deploy/build/startup packaging failure.

The accessible application log tail appears to be live/current output after
the crash and does not include the `2026-06-06T04:12:15Z` pre-crash window.

## Result Report

Outcome: `done` for the read-only diagnosis scope.

What is verified:

- `workers-execution` crash metadata persists exactly as reported by
  [LUC-2590](/LUC/issues/LUC-2590).
- Coolify app logs endpoint is reachable for this resource.
- Current retained tail has no fatal/OOM/process-exit/dependency/startup
  failure signature.
- Deployment history is not visible enough in this token context to explain
  the restart.
- Local code maps visible skip messages to non-fatal runtime branches.

What remains outside this issue:

- Protected `/workers/ready`, runtime freshness, and alerts remain
  approval/auth-gated.
- Host-level retained container/journal logs or Coolify UI deployment history,
  if required, need a separate explicit approval naming resource, evidence
  path, and no-secret handling.
- No production readiness claim changes from this diagnosis alone.

No production mutation occurred.
