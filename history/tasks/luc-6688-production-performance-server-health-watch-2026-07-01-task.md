# LUC-6688 Production Performance And Server Health Watch

## Header

- ID: LUC-6688
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production performance and server health
- Requirement Rows: production smoke, worker readiness, rollback guard
- Quality Scenario Rows: deployment reliability, operational readiness
- Risk Rows: production Web unavailable, worker readiness unavailable
- Iteration: 2026-07-01 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6688-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-01
- Mission Status: BLOCKED

## Process Self-Audit

- [x] All seven autonomous loop steps are represented.
- [x] No loop step was skipped.
- [x] Exactly one priority task was selected.
- [x] Operation mode recorded for this heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence with current production evidence.

## Context

[LUC-6688](/LUC/issues/LUC-6688) is a scoped DRE heartbeat for current Soar
production performance and server health. Prior watches showed API readiness
healthy while Web and backtest-worker resources remained unhealthy.

## Goal

Verify the current production health signal without mutating production, record
evidence, and route the next action to the correct restoration owner.

## Constraints

- Use existing ops smoke and guard scripts.
- Stay read-only.
- Do not deploy, push, restart, roll back, edit env, read back secrets, mutate
  DB/Redis, mutate production accounts, or perform trading/payment actions.
- Do not create duplicate restoration work while [LUC-6331](/LUC/issues/LUC-6331)
  remains the active owner path.

## Definition of Done

- [x] Public API/Web smoke executed.
- [x] Protected worker readiness, runtime freshness, and rollback guard checked.
- [x] Sanitized Coolify production projection captured.
- [x] Source-control/deploy impact recorded.
- [x] Project state and module confidence updated.
- [x] Paperclip issue disposition reported as blocked with unblock owner/action.

## Forbidden

- New systems or parallel ops mechanisms.
- Temporary bypasses.
- Production mutation without explicit approval.
- Secret value logging.

## Validation Evidence

- Tests:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> FAIL, Web `503`.
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> FAIL, Web `503`, workers `503`.
  - `pnpm run -s ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` with process-local smoke auth mapping -> PASS.
  - `pnpm run -s ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` with process-local smoke auth mapping -> FAIL, `shouldRollback=true`.
- Manual checks:
  - sanitized Coolify read-only projection showed `soar-web` and `workers-backtest` as `exited:unhealthy`, with `8` queued deployments.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable, no requirement status changed beyond current blocked evidence.
- Quality scenarios updated: not applicable, no scenario contract changed.
- Risk register updated: yes.
- Reality status: blocked.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: API `/health` and `/ready` pass; Web `/` and
  `/api/build-info` fail with `503`; `/workers/ready` fails with `503`.
- Rollback note: rollback guard says `shouldRollback=true` for
  `workers_ready_endpoint_http_503`; no rollback was executed.
- Observability or alerting impact: alerts endpoint returned no critical alerts
  inside rollback guard.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: production Web and protected worker readiness still fail with `503`.
- Gaps: no approved mutation path in this DRE heartbeat.
- Inconsistencies: runtime freshness passes despite worker readiness failing.
- Architecture constraints: Coolify production mutation remains gated.

### 2. Select One Priority Mission Objective

- Selected task: current production health and rollback posture watch.
- Priority rationale: release-critical production availability blocker.
- Deferred: implementation and mutation work remains with [LUC-6331](/LUC/issues/LUC-6331).

### 3. Plan Implementation

- Run read-only smoke, freshness, rollback, and Coolify projection checks.
- Write evidence and state updates.
- Mark the issue blocked with the named restoration owner/action.

### 4. Execute Implementation

- Checks executed with existing scripts and read-only Coolify API calls.
- No runtime mutations performed.

### 5. Verify and Test

- API health/ready passed.
- Web/build-info and worker readiness failed.
- Runtime freshness passed.
- Rollback guard requested action.

### 6. Self-Review

- Existing scripts were reused.
- No duplicate restoration child is warranted because [LUC-6331](/LUC/issues/LUC-6331) is the active path.
- No source code or deploy mutation occurred.

### 7. Update Documentation and Knowledge

- Evidence: `history/evidence/luc-6688-production-performance-server-health-watch-2026-07-01.md`.
- Task packet: this file.
- State ledgers updated: active mission, next steps, project state, task board,
  system health, module confidence, and risk register.

## Result Report

`BLOCKED / API_HEALTH_READY_PASS / PRODUCTION_WEB_503 / WORKERS_READY_503 /
SOAR_WEB_EXITED_UNHEALTHY / WORKERS_BACKTEST_EXITED_UNHEALTHY /
RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

Next owner: Ops Release Lead / board-approved Coolify mutation owner on
[LUC-6331](/LUC/issues/LUC-6331).
