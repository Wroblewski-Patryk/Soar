# Task

## Header
- ID: RUNTIME-AUDIT-32
- Title: Attach effective strategy to runtime automation skip telemetry
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-31
- Priority: P1
- Iteration: 50
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position automation skip telemetry records `PRETRADE_BLOCKED` events
for operator-visible fail-closed paths. The helper currently emits
`position.strategyId`, so imported or strategy-null positions can lose the
canonical single-strategy attribution even when the bot scope resolves one
effective strategy.

## Goal
Keep runtime automation skip telemetry aligned with the effective lifecycle
strategy provenance used by DCA and close paths.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomationSkipTelemetry.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard skip/block rows for imported positions
  can appear detached from the configured strategy.
- Expected product or reliability outcome: fail-closed automation skip events
  carry the same effective strategy provenance as lifecycle decisions when it
  is unambiguous.
- How success will be observed: regression test proves a strategy-null
  imported LIVE position with one canonical strategy link records
  `PRETRADE_BLOCKED` skip telemetry with that strategy id.
- Post-launch learning needed: no

## Deliverable For This Stage
A failing-then-passing runtime automation skip telemetry regression and scoped
fix.

## Constraints
- reuse existing effective strategy resolution
- do not change skip/fail-closed decision semantics
- keep ambiguous multi-strategy provenance unassigned
- do not add new telemetry systems

## Implementation Plan
1. Add a regression for imported strategy-null LIVE skip telemetry.
2. Resolve effective strategy before skip branches that emit telemetry.
3. Let the skip telemetry helper accept the resolved strategy id.
4. Run focused and full runtime automation tests plus standard repo gates.

## Acceptance Criteria
- [x] Skip telemetry uses effective strategy provenance when unambiguous.
- [x] Ambiguous/missing provenance still emits no strategy id.
- [x] Existing fail-closed skip behavior remains unchanged.
- [x] Source-of-truth docs are updated.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this runtime telemetry slice.
- [x] Regression test fails before the fix and passes after the fix.
- [x] Relevant validation commands pass.
- [x] Diff review confirms no workaround, duplicate pipeline, or unrelated
  cleanup was introduced.

## Forbidden
- dashboard-only fallback masking
- duplicate strategy provenance logic
- temporary bypasses
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - FAIL before fix:
    `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.service.test.ts -t "records skip telemetry with effective strategy" --sequence.concurrent=false`
    recorded `strategyId: undefined` for an imported strategy-null recovered
    position.
  - PASS after fix:
    `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.service.test.ts -t "records skip telemetry with effective strategy" --sequence.concurrent=false`
  - PASS:
    `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.service.test.ts --sequence.concurrent=false`
    (`36/36`)
  - PASS: `pnpm --filter api run typecheck`
  - PASS: `pnpm run quality:guardrails`
  - PASS: `pnpm run lint`
- Manual checks: diff review of fail-closed skip telemetry provenance.
- Screenshots/logs: not applicable
- High-risk checks: fail-closed behavior is unchanged; only event provenance is
  enriched.

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
- Rollback note: revert this commit to restore previous skip telemetry
  strategy attribution.
- Observability or alerting impact: improves event provenance.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime automation skip telemetry emits `position.strategyId`.
- Gaps: no regression covers strategy-null imported skip telemetry with a
  single canonical strategy link.
- Inconsistencies: DCA block and close telemetry now use effective strategy,
  but fail-closed skip telemetry does not.
- Architecture constraints: explicit ownership/provenance and fail-closed
  runtime decisions.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-32`.
- Priority rationale: TESTER-mode audit found a neighboring dashboard event
  truth drift after the DCA block telemetry fix.
- Why other candidates were deferred: broader lifecycle audits remain, but
  this is a small, reversible provenance fix.

### 3. Plan Implementation
- Files or surfaces to modify: runtime automation service, skip telemetry
  helper/test, task board, project state, next commits queue.
- Logic: compute effective strategy before skip telemetry branches and pass it
  into the event helper.
- Edge cases: imported recovered-unactionable position, ambiguous multi-strategy
  provenance, existing direct strategy-owned positions.

### 4. Execute Implementation
- Implementation notes: added a regression for an imported LIVE
  strategy-null recovered position with one canonical strategy link. Resolved
  effective strategy before skip telemetry branches and passed it into the
  telemetry helper.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full runtime
  position automation service test suite, API typecheck, repository guardrails,
  lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: changing only dashboard read fallback was rejected
  because event provenance should be correct at write time.
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
- Task summary: runtime automation skip telemetry now uses effective strategy
  provenance for imported or strategy-null positions when it is unambiguous.
- Files changed:
  `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`,
  `apps/api/src/modules/engine/runtimePositionAutomationSkipTelemetry.ts`,
  `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`, and this task document.
- How tested: focused failing-then-passing regression, full runtime position
  automation service tests, API typecheck, guardrails, lint, and diff review.
- What is incomplete: nothing for this slice.
- Next steps: continue the next one-slice audit across live/paper lifecycle and
  dashboard truth surfaces.
- Decisions made: keep event provenance at write-time by reusing
  `effectiveStrategyId`.
