# PMPLC-36 Exchange Fee Pending Helper Task

## Header
- ID: PMPLC-36
- Title: refactor(api-orders): centralize exchange fee pending decision
- Task Type: refactor
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-35
- Priority: P0
- Iteration: PMPLC-36
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-34 and PMPLC-35 fixed fee-pending behavior around rejected stale exchange
fees. The remaining maintainability risk was keeping pending truth inline in
the DB-backed service, where raw event fee and accepted fee truth can be
confused again.

## Goal
Move the exchange `feePending` decision into the pure exchange-event helper
module with no-DB coverage for accepted exact fee, rejected raw fee, existing
pending preservation, and already-settled exact fee.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- Canonical planning and context docs for PMPLC-36 closure evidence.

## Implementation Plan
1. Add a pure helper for fee-pending decision.
2. Cover accepted exact fee, rejected raw fee, unresolved existing pending, and
   settled exact fee cases.
3. Replace inline service pending branching with the helper result.
4. Run focused helper, DB-backed exchange-event, runtime/order, typecheck,
   guardrails, lint, and diff checks.
5. Update context and planning truth.

## Acceptance Criteria
- PMPLC-34/35 behavior remains unchanged.
- Pending clearance is tied to accepted fee truth, not raw event fee.
- Pending recovery remains available for unresolved estimated fee truth.
- Settled `EXCHANGE_FILL` state is not reopened.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting boundary has pure helper and DB-backed service evidence.

## Forbidden
- Changing fee reconciliation behavior.
- Duplicating pending decision branches in service code.
- Reopening pending for settled exact exchange fee.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`22/22`)
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`15/15`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`96/96`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only

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
- Rollback note: revert PMPLC-36 helper/service/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: fee-pending decision was correct after PMPLC-35 but still inline in
  service orchestration.
- Gap: raw fee versus accepted fee truth needed a durable pure boundary.
- Architecture constraints: reuse existing helper boundary; no new system.

### 2. Select One Priority Task
- Selected task: PMPLC-36 centralize exchange fee pending decision.
- Priority rationale: ARCHITECT iteration after TESTER-mode fee recovery.
- Deferred: additional behavioral audits remain separate slices.

### 3. Plan Implementation
- Files or surfaces to modify: exchange helpers, helper tests, service import.
- Logic: return both persisted `feePending` and `shouldKeepFeePending`.
- Edge cases: accepted exact fee, rejected raw fee, settled exact fee, pending
  preservation before terminal status.

### 4. Execute Implementation
- Implementation notes: replaced inline pending branch with helper output.

### 5. Verify and Test
- Validation performed: helper tests, DB-backed exchange-event suite, focused
  runtime/order pack, API typecheck, repository guardrails, lint, diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: keep inline branch; rejected because this is a
  money-impacting truth boundary after PMPLC-34/35.
- Technical debt introduced: no
- Scalability assessment: no DB/runtime cost beyond local helper call.
- Refinements made: helper uses accepted fee truth explicitly.

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
- Task summary: exchange fee-pending decision now lives in a pure helper with
  no-DB tests while the service reuses the helper for PMPLC-34/35 behavior.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `history/tasks/position-management-exchange-fee-pending-helper-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
