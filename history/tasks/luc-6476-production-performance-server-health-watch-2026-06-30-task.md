# Task

## Header
- ID: LUC-6476
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
- Mission ID: `LUC-6476-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-30`
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: refresh read-only production health and performance watch evidence for LUC-6476.
- Release objective advanced: V1 production readiness truth, fail-closed rollback decision, and operational restoration routing.
- Included slices: deploy smoke, runtime freshness, rollback guard, public timing, Coolify read-only projection, evidence/state updates, issue disposition.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, raw log capture, production account mutation, subscription/payment mutation, exchange mutation, order, position, live-trading action.
- Checkpoint cadence: one bounded heartbeat with durable evidence.
- Stop conditions: production mutation required, protected credential missing, or Paperclip issue write unavailable after local evidence is recorded.
- Handoff expectation: blocked disposition naming restoration owner/action.

## Context

This is a recurring DRE production watch for Soar. Recent same-day evidence
already showed production Web `503` and protected worker readiness `503`.
This heartbeat refreshes the signal under [LUC-6476](/LUC/issues/LUC-6476)
without mutating production.

## Goal

Produce current, read-only production health evidence and give
[LUC-6476](/LUC/issues/LUC-6476) a clear disposition.

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
- `pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 12000` with process-local `DEPLOY_FRESHNESS_*` aliases -> PASS.
- `pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch` with process-local `ROLLBACK_GUARD_*` aliases -> FAIL with `shouldRollback=true`.
- Public timing sample -> API `200`, Web `503`.
- Coolify read-only projection -> `soar-web` and `workers-backtest` `exited:unhealthy`.

## Deployment / Ops Evidence

- Deploy impact: none
- Env or secret changes: none
- Health-check impact: confirms API health/ready pass, Web and protected worker readiness fail
- Smoke steps updated: no
- Rollback note: rollback guard recommends action with `shouldRollback=true`; no rollback was executed
- Observability or alerting impact: alerts endpoint returned no alerts inside rollback guard
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production Web and protected worker readiness still fail.
- Gaps: restoration must happen on [LUC-6331](/LUC/issues/LUC-6331), not this watch.
- Inconsistencies: first protected freshness/rollback attempts failed with `401` until smoke login variables were mapped to each script namespace.
- Architecture constraints: DRE read-only watch only; no runtime mutation.

### 2. Select One Priority Mission Objective
- Selected task: LUC-6476 production performance/server-health watch.
- Priority rationale: issue assigned with critical priority and current production degradation.
- Why other candidates were deferred: existing LUC-6331 restoration owns repair.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state files only.
- Logic: no product logic changes.
- Edge cases: protected auth namespace mismatch handled via process-local alias mapping without printing secret values.

### 4. Execute Implementation
- Implementation notes: no code implementation; evidence-only verification.

### 5. Verify and Test
- Validation performed: deploy smoke, runtime freshness, rollback guard, public timing, Coolify read-only projection.
- Result: blocked production watch with API reachable, Web unavailable, backtest worker readiness unavailable.

### 6. Self-Review
- Simpler option considered: reuse prior watch evidence only.
- Technical debt introduced: no
- Scalability assessment: existing scripts remain the reusable path.
- Refinements made: recorded initial `401` namespace mismatch and accepted only the rerun with process-local script aliases.

### 7. Update Documentation and Knowledge
- Docs updated: LUC-6476 evidence/task and state/context append notes.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report

- Task summary: refreshed read-only production watch and confirmed current production block.
- Files changed: this task file, matching evidence file, and state/context append notes.
- How tested: deploy smoke, runtime freshness, rollback guard, timing sample, Coolify read-only projection.
- What is incomplete: production Web and protected worker readiness recovery.
- Next steps: [LUC-6331](/LUC/issues/LUC-6331) restores production Web/backtest worker, then DRE reruns the watch.
- Decisions made: [LUC-6476](/LUC/issues/LUC-6476) should be blocked, not done.
- Paperclip control-plane: PATCH with full comment timed out after `12s`; status-only blocked retry timed out after `8s`, so board mutation is unconfirmed and must be retried by the next control-plane-capable heartbeat if it did not land.
