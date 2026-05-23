# Task

## Header
- ID: RUNTIME-AUDIT-31
- Title: Attach effective strategy to DCA funds-exhausted telemetry
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-30
- Priority: P1
- Iteration: 49
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position automation resolves an effective strategy for imported or
strategy-null bot positions before lifecycle management. DCA funds-exhausted
telemetry still sends `position.strategyId`, which can be `null` for imported
LIVE positions even when canonical bot scope resolves a single effective
strategy.

## Goal
Keep dashboard/runtime telemetry strategy context aligned with the effective
runtime lifecycle strategy when DCA is blocked by capital limits.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard signal/block rows can appear detached
  from the configured strategy for imported or strategy-null positions.
- Expected product or reliability outcome: DCA block telemetry uses the same
  effective strategy provenance as close and DCA execution paths.
- How success will be observed: regression test proves a strategy-null
  imported LIVE position with one canonical strategy link records
  `PRETRADE_BLOCKED` telemetry with that effective strategy id.
- Post-launch learning needed: no

## Deliverable For This Stage
A failing-then-passing runtime automation telemetry regression and scoped fix.

## Constraints
- reuse existing effective strategy resolution
- do not change position lifecycle decision semantics
- do not add new telemetry systems
- keep fail-closed behavior for unresolved/multi-strategy provenance

## Implementation Plan
1. Add a regression for strategy-null imported LIVE position DCA funds
   exhausted telemetry.
2. Change DCA funds-exhausted telemetry to use `effectiveStrategyId`.
3. Run focused runtime automation tests, relevant engine/runtime suites,
   typecheck, guardrails, lint, and diff review.
4. Sync source-of-truth docs and context.

## Acceptance Criteria
- [x] DCA funds-exhausted telemetry uses effective strategy provenance.
- [x] Existing position close and DCA execution paths remain unchanged.
- [x] Strategy-null imported positions still fail closed when strategy
  provenance is ambiguous.
- [x] Source-of-truth docs are updated.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this runtime telemetry slice.
- [x] Regression test fails before the fix and passes after the fix.
- [x] Relevant validation commands pass.
- [x] Diff review confirms no workaround, duplicate pipeline, or unrelated
  cleanup was introduced.

## Forbidden
- new systems without approval
- duplicated strategy provenance logic
- temporary bypasses or dashboard-only masking
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - FAIL before fix:
    `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.service.test.ts -t "records DCA funds-exhausted telemetry with effective strategy" --sequence.concurrent=false`
    recorded `strategyId: undefined` for an imported strategy-null position.
  - PASS after fix:
    `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.service.test.ts -t "records DCA funds-exhausted telemetry with effective strategy" --sequence.concurrent=false`
  - PASS:
    `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.service.test.ts --sequence.concurrent=false`
    (`35/35`)
  - PASS: `pnpm --filter api run typecheck`
  - PASS: `pnpm run quality:guardrails`
  - PASS: `pnpm run lint`
- Manual checks: diff review of telemetry provenance change.
- Screenshots/logs: not applicable
- High-risk checks: money-impacting lifecycle decision semantics unchanged;
  telemetry provenance only.

## Architecture Evidence
- Architecture source reviewed: docs/architecture/01_overview-and-principles.md,
  docs/architecture/reference/runtime-signal-merge-contract.md,
  docs/modules/system-modules.md
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous DCA block telemetry
  strategy attribution.
- Observability or alerting impact: improves event provenance.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: DCA funds-exhausted telemetry sends `position.strategyId`.
- Gaps: no test covers effective strategy attribution for strategy-null
  imported positions in this telemetry path.
- Inconsistencies: close telemetry and close execution use effective strategy
  provenance, while DCA funds-exhausted block telemetry does not.
- Architecture constraints: explicit ownership/provenance and fail-closed
  runtime decisions.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-31`.
- Priority rationale: dashboard runtime signal/block truth should reflect the
  same strategy provenance used by lifecycle decisions.
- Why other candidates were deferred: broader live/paper lifecycle audits
  remain, but this is a small, reversible provenance fix.

### 3. Plan Implementation
- Files or surfaces to modify: runtime automation service/test, task board,
  project state, next commits queue.
- Logic: pass `effectiveStrategyId` to DCA funds-exhausted telemetry.
- Edge cases: strategy-null imported position with one canonical strategy link,
  unresolved provenance, existing non-imported strategy-owned positions.

### 4. Execute Implementation
- Implementation notes: added a regression for an imported LIVE
  strategy-null position with one canonical strategy link and DCA blocked by
  funds. Changed DCA funds-exhausted telemetry to pass `effectiveStrategyId`.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full runtime
  position automation service test suite, API typecheck, repository guardrails,
  lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: dashboard-side fallback was rejected because
  telemetry should be correct at source.
- Technical debt introduced: no
- Scalability assessment: reuses existing effective strategy resolution.
- Refinements made: none needed.

### 7. Update Documentation and Knowledge
- Docs updated: this task document and `docs/planning/mvp-next-commits.md`.
- Context updated: `.codex/context/PROJECT_STATE.md` and
  `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: DCA funds-exhausted telemetry now uses effective strategy
  provenance for imported or strategy-null bot positions.
- Files changed:
  `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`,
  `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`, and this task document.
- How tested: focused failing-then-passing regression, full runtime position
  automation service tests, API typecheck, guardrails, lint, and diff review.
- What is incomplete: nothing for this slice.
- Next steps: continue the next one-slice audit across live/paper lifecycle and
  dashboard truth surfaces.
- Decisions made: fix telemetry at source by reusing `effectiveStrategyId`.
