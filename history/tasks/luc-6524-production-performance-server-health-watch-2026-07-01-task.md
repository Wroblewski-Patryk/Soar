# Task

## Header
- ID: LUC-6524
- Title: Soar Production Performance And Server Health Watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: 11 SPM / Ops coordination
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production runtime health / worker readiness / Coolify production topology
- Requirement Rows: production deploy smoke, protected worker readiness, runtime freshness, rollback guard
- Quality Scenario Rows: reliability, availability, observability, production readiness
- Risk Rows: production Web unavailable, backtest worker readiness unavailable, rollback guard action required
- Iteration: 2026-07-01 Paperclip heartbeat
- Operation Mode: BUILDER
- Mission ID: `LUC-6524-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-01`
- Mission Status: BLOCKED

## Mission Block
- Mission objective: refresh read-only production health and performance watch evidence for [LUC-6524](/LUC/issues/LUC-6524).
- Release objective advanced: V1 production readiness truth and fail-closed restoration routing.
- Included slices: deploy smoke, runtime freshness, rollback guard, public timing, Coolify read-only projection, evidence/state updates, issue disposition.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, raw log capture, production account mutation, subscription/payment mutation, exchange mutation, order, position, and live-trading action.
- Stop conditions: production mutation required or unrelated dirty worktree prevents coherent local commit.

## Context

[LUC-6524](/LUC/issues/LUC-6524) is the current recurring production
performance and server-health watch. The wake comment selected a local
repair/source-control closure lane, allowing local repository inspection,
relevant validation, and a local commit only if evidence supports closure.

Recent same-day watches already showed API health up while public Web and
protected worker readiness were unavailable with `503`; this heartbeat
refreshed that state from current read-only probes.

## Goal

Produce current, read-only production health evidence and give
[LUC-6524](/LUC/issues/LUC-6524) a clear disposition with source-control
closure.

## Constraints

- Read-only production and Coolify checks only.
- No push, deploy, restart, rollback execution, env edit, DB/Redis mutation,
  account mutation, exchange/payment action, order, position, subscription
  mutation, or live-trading action.
- Do not disclose secret values.
- Do not stage unrelated dirty worktree changes.

## Forbidden

- Push, deploy, restart, rollback execution, protected smoke/live account
  mutation, secret disclosure, DB/Redis mutation, exchange/payment mutation,
  subscription mutation, order, position, or live-trading action.

## Implementation Plan

1. Acknowledge the scoped wake payload and local repair/source-control lane.
2. Read current Soar mission and production-watch state.
3. Run read-only deploy smoke, runtime freshness, rollback guard, public timing, and Coolify projection.
4. Persist LUC-6524 evidence and task notes.
5. Update state/context with the blocked production watch result.
6. Update the Paperclip issue as blocked on the existing restoration owner path.

## Acceptance Criteria

- Current production smoke result is recorded.
- Runtime freshness result is recorded.
- Rollback guard result is recorded.
- Coolify read-only resource projection is recorded.
- Source-control closure decision is recorded.
- The issue disposition names the unblock owner/action.

## Definition of Done

- [x] Current production deploy smoke captured.
- [x] Runtime freshness and rollback guard captured.
- [x] Coolify read-only production projection captured.
- [x] Evidence and task notes written.
- [x] State/context notes updated.
- [x] Paperclip disposition recorded or attempted with evidence.

## Validation Evidence

- `pnpm exec node scripts/deploySmokeCheck.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> FAIL on Web and workers readiness.
- `pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 12000` with process-local `DEPLOY_FRESHNESS_*` aliases -> PASS.
- `pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch` with process-local `ROLLBACK_GUARD_*` aliases -> FAIL with `shouldRollback=true`.
- Node public timing sample -> API `200`, Web `503`.
- Coolify read-only production projection -> `soar-web` and `workers-backtest` `exited:unhealthy`.

## Result Report

- Task summary: refreshed read-only production watch and confirmed current production block.
- Files changed: this task file, matching evidence file, and state/context append notes.
- How tested: deploy smoke, runtime freshness, rollback guard, timing sample, Coolify read-only projection.
- What is incomplete: production Web and protected worker readiness recovery.
- Next steps: [LUC-6331](/LUC/issues/LUC-6331) restores production Web/backtest worker, then DRE/QVE rerun the watch.
- Decisions made: [LUC-6524](/LUC/issues/LUC-6524) should be blocked, not done.
- Commit/no-commit decision: not committed because unrelated dirty worktree state predates this heartbeat; push/deploy were forbidden and not needed.
