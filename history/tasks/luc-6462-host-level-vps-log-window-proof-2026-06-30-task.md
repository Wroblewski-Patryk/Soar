# Task

## Header
- ID: LUC-6462
- Title: Soar LUC-6459 Host-Level VPS / Log-Window Proof
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: DRE / Ops Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production runtime health / worker readiness / Coolify production topology
- Requirement Rows: host-level VPS proof, production deploy smoke, protected worker readiness, runtime freshness, rollback guard
- Quality Scenario Rows: reliability, availability, observability, deployability
- Risk Rows: production Web unavailable, backtest worker unavailable, host proof access unavailable, rollback guard action required
- Iteration: 2026-06-30 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: `LUC-6462-HOST-LEVEL-VPS-LOG-WINDOW-PROOF-2026-06-30`
- Mission Status: BLOCKED

## Context

[LUC-6462](/LUC/issues/LUC-6462) is a DRE child of
[LUC-6459](/LUC/issues/LUC-6459). Recent production watches
[LUC-6445](/LUC/issues/LUC-6445), [LUC-6424](/LUC/issues/LUC-6424), and
[LUC-6439](/LUC/issues/LUC-6439) show API health/readiness and runtime
freshness pass while Web `/`, Web `/api/build-info`, and protected
`/workers/ready` return `503`.

## Goal

Capture the strongest approved read-only host/Coolify/log-window evidence for
the current production health failure, relate it to [LUC-6331](/LUC/issues/LUC-6331),
and give [LUC-6462](/LUC/issues/LUC-6462) a clear final disposition.

## Constraints

- No deploy.
- No push.
- No restart.
- No rollback execution.
- No env edit.
- No secret or account value readback.
- No production DB/Redis mutation.
- No raw log-body persistence.
- No account, exchange/payment, order, position, subscription, or live-trading mutation.

## Implementation Plan

1. Read scoped wake payload, DRE role contract, Soar mission state, and prior
   production watch evidence.
2. Check access bindings by name only.
3. Attempt minimal read-only host proof through current `VPS_HOST`.
4. Capture read-only Coolify production application status and log-window API
   summaries without raw log persistence.
5. Rerun minimal correlated deploy smoke, runtime freshness, and rollback guard.
6. Persist evidence and state notes.
7. Update [LUC-6462](/LUC/issues/LUC-6462) with a clear blocked disposition and
   named unblock owner/action.

## Acceptance Criteria

- Current host proof state is recorded.
- Current Coolify resource status is recorded.
- Current log-window availability/summary is recorded.
- Current production smoke/runtime/rollback correlation is recorded.
- No mutation or secret/raw-log disclosure occurs.
- The issue disposition names the unblock owner/action and relation to
  [LUC-6331](/LUC/issues/LUC-6331).

## Definition of Done

- [x] Host SSH proof attempted safely and blocker recorded.
- [x] Coolify read-only production projection captured.
- [x] Redacted log-window summary captured.
- [x] Deploy smoke rerun captured.
- [x] Runtime freshness rerun captured.
- [x] Rollback guard rerun captured.
- [x] Evidence and project-state notes written.
- [x] Paperclip disposition recorded or attempted with evidence.

## Validation Evidence

- `ssh -o BatchMode=yes -o ConnectTimeout=8 ... $env:VPS_HOST ...` ->
  `Permission denied (publickey,password)`; `SSH_AUTH_SOCK` absent.
- Coolify production endpoint -> `200`; resources endpoint -> `200`; `17`
  visible resource rows.
- `soar-web` -> `exited:unhealthy`; log API -> `400 Application is not running.`
- `workers-backtest` -> `exited:unhealthy`; log API -> `400 Application is not running.`
- `soar-api`, `workers-execution`, `workers-market-data`, and
  `workers-market-stream` log APIs -> `200` with redacted 120-line summaries.
- `pnpm exec node scripts/deploySmokeCheck.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` ->
  FAIL on Web and protected workers readiness.
- `pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 12000` ->
  PASS with process-local audit-login env mapping.
- `pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch` ->
  `shouldRollback=true`, reason `workers_ready_endpoint_http_503`.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: confirms API health/ready pass, Web and protected
  worker readiness fail.
- Smoke steps updated: no.
- Rollback note: rollback guard recommends action; no rollback was executed.
- Observability/log impact: Coolify log API cannot expose Web/backtest logs
  while both applications are not running; no raw logs persisted.

## Result Report

- Task summary: captured read-only Coolify/log-window evidence and proved true
  host shell proof is currently blocked by missing SSH authentication.
- Files changed: this task file, matching evidence file, and state/context
  append notes.
- How tested: SSH auth probe, Coolify production/log/deployment reads, deploy
  smoke, runtime freshness, rollback guard.
- What is incomplete: direct VPS shell pressure and host Docker/journal
  summaries.
- Next steps: [LUC-6331](/LUC/issues/LUC-6331) restores production Web and
  backtest-worker; Ops/Security binds approved read-only host access if direct
  host proof remains required; DRE/QVE rerun proofs after restoration.
- Decisions made: [LUC-6462](/LUC/issues/LUC-6462) should be blocked, not
  done, because host-level SSH proof is unavailable and production remains
  unhealthy.
