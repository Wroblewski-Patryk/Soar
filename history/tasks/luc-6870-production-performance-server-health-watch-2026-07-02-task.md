# Task

## Header
- ID: LUC-6870
- Title: Production Performance And Server Health Watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: Production deploy/runtime health; Soar V1 release readiness
- Requirement Rows: production Web/API/worker readiness; rollback guard
- Quality Scenario Rows: reliability, deployability, performance
- Risk Rows: production Web and worker readiness risk
- Iteration: 2026-07-02 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: `LUC-6870-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-02`
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Project memory and mission state were reviewed through current Soar state files.
- [x] Missing or template-like state tables were confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: rerun read-only production performance and server-health watch for [LUC-6870](/LUC/issues/LUC-6870).
- Release objective advanced: fail-closed production readiness evidence.
- Included slices: Paperclip readback, public/protected deploy smoke, runtime freshness, rollback guard, HTTP timing, sanitized Coolify status projection.
- Explicit exclusions: deploy, restart, rollback execution, env edits, DB/Redis mutation, account mutation, exchange/payment mutation, trading actions, secret value readback.
- Checkpoint cadence: one heartbeat.
- Stop conditions: first-class production blocker confirmed and routed.
- Handoff expectation: block on [LUC-6331](/LUC/issues/LUC-6331), then rerun DRE/QVE smoke after restoration.

## Context
[LUC-6870](/LUC/issues/LUC-6870) is the recurring Soar production performance
and server-health watch. Prior July 2 DRE watches showed API health passing
while Web and protected worker readiness failed with `503`.

## Goal
Produce fresh, read-only production health evidence and route the issue to a
clear final disposition.

## Scope
- Files: this task record, DRE evidence packet, state/context ledgers.
- Runtime surfaces: `https://api.soar.luckysparrow.ch`, `https://soar.luckysparrow.ch`, Coolify read-only API.
- No source/runtime mutation.

## Implementation Plan
1. Read issue heartbeat context.
2. Run public deploy smoke.
3. Run protected worker readiness smoke using existing bindings without printing secrets.
4. Run runtime freshness and rollback guard.
5. Capture representative HTTP timing.
6. Capture sanitized Coolify projection.
7. Update source-of-truth state and block the issue on existing restoration path.

## Acceptance Criteria
- Production health evidence is current for 2026-07-02.
- Failed checks are named with endpoint/status evidence.
- No duplicate repair child is created when [LUC-6331](/LUC/issues/LUC-6331) already owns restoration.
- Issue disposition is explicit.

## Definition of Done
- [x] Read-only production checks completed.
- [x] Evidence file created.
- [x] Project state updated.
- [x] Paperclip issue updated to `blocked` with [LUC-6331](/LUC/issues/LUC-6331) as blocker.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- deploy, restart, rollback execution, env edit, DB/Redis mutation, production account mutation, or secret value readback

## Validation Evidence
- Tests:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> FAIL, Web `503`.
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> FAIL, Web `503`, `/workers/ready` `503`.
  - `pnpm run -s ops:deploy:runtime-freshness` -> PASS.
  - `pnpm run -s ops:deploy:rollback-guard` -> FAIL, `shouldRollback=true`, `workers_ready_endpoint_http_503`.
- Manual checks: representative `curl.exe` timing sample.
- Screenshots/logs: sanitized command output captured in evidence.
- High-risk checks: protected smoke used existing bindings; secret values were not printed or stored.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Risk register updated: yes.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: deployment smoke checklist and rollback playbook.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: confirmed unhealthy Web and worker readiness.
- Smoke steps updated: no.
- Rollback note: rollback guard recommends action; execution remains with approved mutation owner.
- Observability or alerting impact: Coolify status and queued deployments recorded.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production Web and protected worker readiness return `503`.
- Gaps: authenticated dashboard performance cannot be accepted while Web is `503`.
- Inconsistencies: API health and runtime freshness pass while Web and backtest worker app resources are unhealthy.
- Architecture constraints: read-only watch; no mutation without approval.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: current mission/state files, smoke checklist, rollback playbook, prior DRE evidence.
- Rows created or corrected: current [LUC-6870](/LUC/issues/LUC-6870) evidence rows.
- Assumptions recorded: [LUC-6331](/LUC/issues/LUC-6331) remains the active restoration path.
- Blocking unknowns: root cause of unhealthy Coolify application resources.
- Why it was safe to continue: all checks were read-only.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6870](/LUC/issues/LUC-6870).
- Priority rationale: critical routine execution assigned to DRE.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state files only.
- Logic: native ops scripts and sanitized read-only API projections.
- Edge cases: avoid secret value output; treat production mutation as forbidden.

### 4. Execute Implementation
- Implementation notes: no code changes; evidence-only state update.

### 5. Verify and Test
- Validation performed: deploy smoke, runtime freshness, rollback guard, timing, Coolify projection.
- Result: blocked on Web/worker readiness.

### 6. Self-Review
- Simpler option considered: reuse prior [LUC-6850](/LUC/issues/LUC-6850) evidence.
- Technical debt introduced: no.
- Scalability assessment: routine evidence format remains repeatable.
- Refinements made: fresh timings show fast `503`, not slow dashboard loading.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence/state files.
- Context updated: active mission, next steps, task board, project state, module confidence, risk register, system health, requirements matrix, regression log.
- Learning journal updated: not applicable.

## Result Report

- Task summary: Fresh read-only watch confirms API/runtime are healthy but Web and protected worker readiness remain failed.
- Files changed: task/evidence/state docs only.
- How tested: deploy smoke, runtime freshness, rollback guard, timing, Coolify projection.
- What is incomplete: production Web/backtest worker restoration.
- Next steps: [LUC-6331](/LUC/issues/LUC-6331) owner restores services; DRE/QVE rerun checks.
- Decisions made: no duplicate repair child; route to existing restoration blocker.
