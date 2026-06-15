# Task

## Header
- ID: LUC-3839
- Title: Bound production runtime aggregate dashboard latency
- Task Type: fix
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: Core Backend Engineer
- Depends on: LUC-3832 production diagnosis
- Priority: P0
- Module Confidence Rows: `api-bots` runtime aggregate, `web-dashboard-home`
- Requirement Rows: Bot Runtime aggregate authenticated dashboard read
- Quality Scenario Rows: authenticated dashboard latency, backend reliability
- Risk Rows: production aggregate latency, stale or partial aggregate fallback
- Iteration: 2026-06-14
- Operation Mode: BUILDER
- Mission ID: LUC-3839-BOUND-PRODUCTION-RUNTIME-AGGREGATE-DASHBOARD-LATENCY-2026-06-14
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the assigned backend implementation heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented through current mission state and canonical architecture/runtime ledgers.
- [x] `.agents/core/mission-control.md` was represented through the active [LUC-3832](/LUC/issues/LUC-3832) performance incident mission.
- [x] Missing or template-like state tables were not in scope.
- [x] Affected module confidence rows were identified.
- [x] Affected quality and risk rows were identified.
- [x] The task improves release confidence by bounding an authenticated dashboard production bottleneck.

## Mission Block
- Mission objective: reduce the backend tail risk on `GET /dashboard/bots/:id/runtime-monitoring/aggregate` identified by [LUC-3832](/LUC/issues/LUC-3832).
- Release objective advanced: authenticated dashboard sellability and production-readiness.
- Included slices: backend aggregate runtime helper, aggregate read default bounds, focused regression test, runtime config ledger.
- Explicit exclusions: deploy, push, production restart, production smoke, database/Redis mutation, web UI redesign.
- Checkpoint cadence: single heartbeat implementation plus focused proof.
- Stop conditions: local focused regression passes and full typecheck is either green or explicitly blocked by environment.
- Handoff expectation: QA/Ops should run protected production dashboard proof after source promotion/deploy by the appropriate release lane.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, active mission | Integration and state updates | This task packet and board/state sync | Focused test and diff check | DONE |
| Backend | Core Backend Engineer | [LUC-3832](/LUC/issues/LUC-3832) evidence | aggregate read/runtime helper | Bounded subquery timeout and bounded session fanout defaults | `runtimeMonitoringAggregateConcurrency.test.ts` | DONE |
| QA/Test | Core Backend Engineer | existing aggregate tests | focused unit regression | Session selection cap regression | `2/2` focused tests pass | DONE |
| Ops/Docs | Core Backend Engineer | `docs/operations/runtime-config-ledger.csv` | runtime config ledger | Updated default timeout/cap rows | diff review | DONE |

## Context
[LUC-3832](/LUC/issues/LUC-3832) reproduced authenticated production dashboard load with `GET /dashboard/bots/:id/runtime-monitoring/aggregate` tailing at `26312 ms` and `25702 ms`, while auth, document load, runtime sessions, runtime graph, and bot list remained materially faster.

Code inspection found the aggregate default slow-subquery timeout was `25000 ms`, despite the runtime config ledger saying `15000 ms`. The aggregate session fanout also defaulted to unlimited within the incoming `sessionsLimit`, because the running/completed caps defaulted to `0`.

## Goal
Bound aggregate dashboard latency by default without adding a workaround path or changing the public endpoint contract.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRuntime.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts`
- `docs/operations/runtime-config-ledger.csv`

## Implementation Plan
1. Lower the default aggregate subquery timeout from `25000 ms` to `5000 ms`, preserving env override.
2. Add default aggregate fanout caps: 2 freshest RUNNING sessions and 2 freshest non-RUNNING sessions, preserving env overrides.
3. Move session selection into the pure runtime helper so it can be tested without Prisma initialization.
4. Add a focused regression proving newest bounded session selection.
5. Update runtime config ledger with the new defaults and verification status.

## Acceptance Criteria
- Focused aggregate runtime helper test passes.
- No new route or fallback subsystem is introduced.
- Runtime config ledger matches code defaults.
- Full API typecheck is run or its environment blocker is recorded.

## Definition of Done
- [x] Backend aggregate default timeout and fanout are bounded.
- [x] Focused regression passes.
- [x] Runtime config source of truth is updated.
- [x] No production mutation occurs.
- [ ] Full API typecheck passes. It is blocked in this worktree by missing dependency resolution for API packages.

## Validation Evidence
- Tests:
  - PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts --run` (`2/2`).
  - BLOCKED: `pnpm --filter api run typecheck` failed before checking this change because the worktree cannot resolve API dependencies including `express`, `@prisma/client`, `vitest`, `zod`, `redis`, `supertest`, and others (`TS2307`).
- Manual checks:
  - PASS: `git diff --check -- apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts apps/api/src/modules/bots/runtimeMonitoringAggregateRuntime.service.ts apps/api/src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts docs/operations/runtime-config-ledger.csv` returned exit `0` with CRLF warnings only.
- Screenshots/logs: not applicable.
- High-risk checks: no deploy, push, restart, env edit, production smoke, DB/Redis mutation, exchange, order, position, payment/subscription, or live-trading action.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable for this bounded repair.
- Quality scenarios updated: not applicable; system health updated instead.
- Risk register updated: not applicable; system health/module confidence updated.
- Reality status: partially verified.

## Architecture Evidence
- Architecture source reviewed: `SOAR-SERVICE-RUNTIME-AGGREGATE`, Bot Runtime aggregate chain and runtime config ledger.
- Fits approved architecture: yes.
- Mismatch discovered: yes; ledger said default timeout `15000 ms`, code used `25000 ms`.
- Decision required from user: no.
- Follow-up architecture doc updates: runtime config ledger updated; architecture graph refresh is not required for this helper-level default change.

## Deployment / Ops Evidence
- Deploy impact: medium, because a future push can trigger Coolify auto-redeploy.
- Env or secret changes: none required; existing env overrides remain available.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the timeout/cap defaults or set env overrides to previous behavior if protected production proof shows unacceptable aggregate truncation.
- Observability or alerting impact: no new instrumentation.
- Staged rollout or feature flag: env overrides act as operational rollback controls.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production aggregate tail matched the `25000 ms` code timeout.
- Gaps: full API typecheck unavailable due dependency resolution in worktree.
- Inconsistencies: runtime config ledger stale against code.
- Architecture constraints: reuse existing aggregate cache/timeout/fallback mechanisms.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-3839](/LUC/issues/LUC-3839) backend aggregate latency bound.
- Priority rationale: critical production dashboard bottleneck.
- Why other candidates were deferred: web and ops verification are separate lanes after backend default bound.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read/runtime helper, focused test, runtime config ledger.
- Logic: cap session selection and reduce slow subquery fallback budget.
- Edge cases: freshest RUNNING and non-RUNNING session ordering; env override preservation.

### 4. Execute Implementation
- Implementation notes: moved selection helper to pure runtime helper to avoid Prisma dependency in focused test.

### 5. Verify and Test
- Validation performed: focused Vitest regression, diff check, API typecheck attempt.
- Result: focused regression passes; full typecheck is environment-blocked by unresolved dependencies.

### 6. Self-Review
- Simpler option considered: only lower timeout. Rejected because fanout could still multiply the tail across sessions.
- Technical debt introduced: no.
- Scalability assessment: bounded fanout reduces worst-case dashboard load and keeps env knobs for production tuning.
- Refinements made: pure helper extraction avoids heavy test imports.

### 7. Update Documentation and Knowledge
- Docs updated: runtime config ledger, task packet, state/context files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validation was run or blocker recorded.
- [x] Docs/context were updated.

## Result Report
- Task summary: bounded the runtime aggregate default slow-subquery budget to `5000 ms` and default session fanout to 2 freshest RUNNING plus 2 freshest non-RUNNING sessions.
- Files changed: listed in Scope.
- How tested: focused aggregate runtime helper test passes; diff check passes; full API typecheck blocked by missing dependency resolution.
- What is incomplete: protected production dashboard proof after deploy/source promotion remains a QA/Ops release lane.
- Next steps: run source-control/release closure, then protected production dashboard aggregate proof to confirm the production tail is below the target.
- Decisions made: keep env overrides as rollback/tuning controls instead of adding a new feature flag.
