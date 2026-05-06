# PMPLC-33 Exchange Fee Refresh Helper Task

## Header
- ID: PMPLC-33
- Title: refactor(api-orders): centralize exchange fee refresh decision
- Task Type: refactor
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-32
- Priority: P0
- Iteration: PMPLC-33
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-31 and PMPLC-32 established the fee refresh boundary: fee-only refresh is
allowed for a known fill missing fee truth, but stale unknown terminal fill
events must not mutate settled fees. That boundary was still inline in the
DB-backed service.

## Goal
Move the exchange fee refresh/backfill decision into the pure exchange-event
helper module with focused no-DB tests, preserving PMPLC-31 and PMPLC-32
behavior.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- Canonical planning and context docs for PMPLC-33 closure evidence.

## Implementation Plan
1. Add a pure helper for fee refresh and backfill decisions.
2. Cover normal refresh, known missing-fee backfill, stale unknown fill block,
   and already-fee-settled known fill cases.
3. Replace the inline service condition with the helper result.
4. Run focused helper, DB-backed exchange-event, runtime/order, typecheck,
   guardrails, lint, and diff checks.
5. Update context and planning truth.

## Acceptance Criteria
- No behavior change to PMPLC-31 known-fill fee backfill.
- No behavior change to PMPLC-32 stale unknown-fill guard.
- Fee refresh/backfill decision is no-DB testable.
- Exchange-event service keeps orchestration ownership rather than embedding
  decision branching.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting boundary has pure helper and DB-backed service evidence.

## Forbidden
- Changing fee reconciliation behavior.
- Duplicating the fee decision in multiple service branches.
- Weakening terminal event lifecycle or stale-fee idempotency.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`18/18`)
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`13/13`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`90/90`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only
- Manual checks: not applicable.
- Screenshots/logs: not applicable.
- High-risk checks: PMPLC-31/32 DB-backed regressions remain green.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/live-fee-reconciliation-contract.md`,
  `docs/architecture/06_execution-lifecycle.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert PMPLC-33 helper/service/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: the fee refresh boundary was correct but embedded inline in the
  DB-backed service.
- Gap: architecture maintainability for a money-impacting idempotency decision.
- Architecture constraints: reuse existing helper boundary; no new system.

### 2. Select One Priority Task
- Selected task: PMPLC-33 centralize exchange fee refresh decision.
- Priority rationale: ARCHITECT iteration after PMPLC-31/32 behavior fixes.
- Deferred: additional behavioral audits remain separate PMPLC slices.

### 3. Plan Implementation
- Files or surfaces to modify: exchange helpers, helper tests, service import.
- Logic: return both `shouldRefreshFeeDetails` and
  `shouldBackfillExistingFillFee`.
- Edge cases: stale unknown fill, known missing fee, known already-settled fee.

### 4. Execute Implementation
- Implementation notes: replaced inline boolean logic with pure helper output.

### 5. Verify and Test
- Validation performed: helper tests, DB-backed exchange-event suite, focused
  runtime/order pack, API typecheck, repository guardrails, lint, diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: leaving inline logic; rejected because PMPLC-31/32
  are a critical fee boundary now worth pure coverage.
- Technical debt introduced: no
- Scalability assessment: no new DB queries or runtime cost beyond local helper
  call.
- Refinements made: helper returns explicit backfill intent to avoid repeating
  the condition at call sites.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP plan, next-commits queue.
- Context updated: project state and task board.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: exchange fee refresh/backfill decision now lives in a pure
  helper with no-DB tests, while the service reuses the helper for PMPLC-31/32
  behavior.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `docs/planning/position-management-exchange-fee-refresh-helper-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
