# Task

## Header
- ID: LUC-6445
- Title: Soar Production Performance And Server Health Watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production runtime health / worker readiness / Coolify production topology
- Requirement Rows: production deploy smoke, protected worker readiness, runtime freshness, rollback guard
- Quality Scenario Rows: reliability, availability, observability
- Risk Rows: production Web unavailable, backtest worker readiness unavailable, rollback guard action required
- Iteration: 2026-06-30 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: `LUC-6445-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-30`
- Mission Status: BLOCKED

## Context

This is a recurring DRE production watch for Soar. Recent same-day evidence
already showed production Web `503` and protected worker readiness `503`.
This heartbeat refreshes the signal under [LUC-6445](/LUC/issues/LUC-6445)
without mutating production.

## Goal

Produce current, read-only production health evidence and give
[LUC-6445](/LUC/issues/LUC-6445) a clear disposition.

## Scope

Evidence-only operations slice:

- production deploy smoke
- runtime freshness
- rollback guard
- public timing sample
- Coolify read-only production projection
- state and task-board notes
- Paperclip issue disposition

Excluded:

- deploy, push, restart, rollback execution, env edit, secret/account value
  readback, DB/Redis mutation, raw log capture, production account mutation,
  subscription/payment mutation, exchange mutation, order, position, and
  live-trading action

## Implementation Plan

1. Read scoped wake, DRE role, and current Soar mission state.
2. Inspect available production health scripts and protected env binding names
   without printing values.
3. Run read-only smoke, runtime freshness, rollback guard, timing, and Coolify
   projection checks.
4. Persist evidence and state notes.
5. Mark the issue blocked on the existing restoration path when production
   Web/worker readiness remains unavailable.

## Acceptance Criteria

- Current production smoke result is recorded.
- Runtime freshness result is recorded.
- Rollback guard result is recorded.
- Coolify read-only resource projection is recorded.
- No mutation or secret value readback occurs.
- The issue disposition names the unblock owner/action.

## Definition of Done

- [x] Current production deploy smoke captured.
- [x] Runtime freshness and rollback guard captured.
- [x] Coolify read-only production projection captured.
- [x] Evidence and state notes written.
- [x] Paperclip disposition recorded or attempted with evidence.

## Validation Evidence

- `pnpm exec node scripts/deploySmokeCheck.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> FAIL on Web and workers readiness.
- `pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 12000` -> PASS.
- `pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch` -> FAIL with `shouldRollback=true`.
- Public timing sample -> API `200`, Web `503`, API `/ready` slow at `11012.8 ms`.
- Coolify read-only projection -> `soar-web` and `workers-backtest` `exited:unhealthy`.

## Deployment / Ops Evidence

- Deploy impact: none
- Env or secret changes: none
- Health-check impact: confirms API health/ready pass, Web and protected worker readiness fail
- Smoke steps updated: no
- Rollback note: rollback guard recommends action with `shouldRollback=true`; no rollback was executed
- Observability or alerting impact: alerts endpoint returned no alerts inside rollback guard
- Staged rollout or feature flag: not applicable

## Result Report

- Task summary: refreshed read-only production watch and confirmed current production block.
- Files changed: this task file, matching evidence file, and state/context append notes.
- How tested: deploy smoke, runtime freshness, rollback guard, timing sample, Coolify read-only projection.
- What is incomplete: production Web and protected worker readiness recovery.
- Next steps: [LUC-6331](/LUC/issues/LUC-6331) restores production Web/backtest worker, then DRE reruns the watch.
- Decisions made: [LUC-6445](/LUC/issues/LUC-6445) should be blocked, not done.
