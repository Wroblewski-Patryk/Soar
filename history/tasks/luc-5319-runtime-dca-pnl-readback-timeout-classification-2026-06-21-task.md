# Task

## Header
- ID: LUC-5319
- Title: Runtime DCA/PnL readback timeout classification
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Priority: P1
- Module Confidence Rows: SOAR-BOT-RUNTIME-001
- Requirement Rows: REQ-FUNC-003 / REQ-FUNC-021
- Risk Rows: RISK-003
- Iteration: 2026-06-21
- Operation Mode: BUILDER
- Mission ID: LUC-5319-RUNTIME-DCA-PNL-READBACK-TIMEOUT-CLASSIFICATION-2026-06-21
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] Source-of-truth state and prior evidence were reviewed.
- [x] Affected module confidence and requirement rows were identified.
- [x] The task improves release confidence, not only code appearance.

## Mission Block
- Mission objective: classify and close the slow runtime positions/symbol-stats readback signal from [LUC-5310](/LUC/issues/LUC-5310).
- Release objective advanced: Bot Runtime DCA/PnL local proof can run under the default focused Vitest budget.
- Included slices: API Bot Runtime e2e test harness for PnL parity and imported DCA visibility.
- Explicit exclusions: production proof, deploy, push, restart, env edit, secret/account readback, exchange mutation, order/position/payment/subscription mutation, live-trading action, broad runtime rewrite.
- Stop conditions: default-timeout focused proof passes or a product-route defect is isolated.
- Handoff expectation: close [LUC-5319](/LUC/issues/LUC-5319) if verified; route a smaller backend performance issue only if the route remains slow after harness cleanup.

## Context
[LUC-5310](/LUC/issues/LUC-5310) verified DCA/PnL correctness but recorded slow first-read timings and a default `5000ms` Vitest timeout. The same assertions passed with `--testTimeout=15000`, so this task had to distinguish product read-model latency from local DB/test setup cost.

## Goal
Make the focused runtime DCA/PnL route proofs deterministic under the default focused test contract without weakening product assertions.

## Scope
- `apps/api/src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`

## Implementation Plan
1. Reproduce the default-timeout PnL parity failure.
2. Rerun with explicit timeout to confirm product assertions still pass.
3. Inspect the runtime positions/symbol-stats read path and shared e2e reset.
4. Move destructive DB fixture cleanup from per-test `beforeEach` into file-level `beforeAll` for these unique-fixture files.
5. Verify both focused files under the default timeout, individually and together.
6. Update task/state evidence and close the Paperclip issue.

## Acceptance Criteria
- Default-timeout PnL parity focused test passes.
- Imported DCA visibility focused test passes under default timeout.
- Combined focused runtime DCA/PnL pack passes under default timeout.
- Product route assertions remain unchanged.

## Definition of Done
- [x] Failure reproduced.
- [x] Root cause classified.
- [x] Smallest repair applied.
- [x] Focused validation passed.
- [x] Source-of-truth state updated.
- [x] No production or protected mutation performed.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts --sequence.concurrent=false --reporter=verbose` initially failed: first test timed out at `5000ms`.
  - Same PnL file passed with `--testTimeout=15000` (`2/2`), confirming product assertions.
  - After repair, default PnL file passed (`2/2`); formerly failing test completed in `4783ms`.
  - After repair, default imported-DCA file passed (`7/7`); first test completed in `4775ms`.
  - Combined default focused pack passed (`2` files / `9` tests); first imported-DCA test `4922ms`, first PnL parity test `4697ms`.
- Manual checks: inspected runtime positions/symbol-stats read services and shared e2e reset helper.
- High-risk checks: no production, LIVE exchange, secret, account, deploy, push, restart, or env mutation.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not changed; existing Bot Runtime requirements remain locally verified, production proof still gated separately.
- Risk register updated: not changed; no new product risk identified.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: Bot Runtime route/read-model source and prior evidence.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; no runtime architecture change.

## Autonomous Loop Evidence

### 1. Analyze Current State
- The default PnL parity file still failed under `5000ms`; expanded timeout passed.
- The runtime assertions were valid; the slow portion was tied to shared DB-backed e2e cleanup and first-file setup.

### 2. Select One Priority Mission Objective
- Selected task: close [LUC-5319](/LUC/issues/LUC-5319).
- Priority rationale: this was the remaining Backend Runtime confidence lane explicitly routed by PM.

### 3. Plan Implementation
- Repair the focused test harness only if product route assertions still pass.

### 4. Execute Implementation
- Replaced per-test destructive `resetBotsE2eState` with file-level `beforeAll` reset in the two focused files.
- Kept per-test fallback mock reset for PnL parity.

### 5. Verify and Test
- Focused PnL parity, imported DCA visibility, and combined two-file pack passed under default timeout.

### 6. Self-Review
- Simpler option considered: raising `testTimeout`; rejected because it would hide the harness issue.
- Technical debt introduced: no.
- Scalability assessment: unique per-test users/bots keep these files isolated without repeated global table deletion.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet plus Soar state/context ledgers.
- Learning journal updated: not applicable; no recurring new pitfall beyond existing DB-e2e isolation practice.

## Review Checklist
- [x] Process self-audit completed.
- [x] Exactly one priority task completed.
- [x] Architecture alignment confirmed.
- [x] Existing systems reused.
- [x] No workaround paths introduced.
- [x] No logic duplication introduced.
- [x] Definition of Done evidence attached.
- [x] Relevant validations run.
- [x] Docs/context updated.

## Result Report
- Task summary: classified the slow DCA/PnL readback as a local DB-backed e2e harness timeout caused by destructive per-test cleanup, not a product read-model correctness defect.
- Files changed:
  - `apps/api/src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
  - `history/tasks/luc-5319-runtime-dca-pnl-readback-timeout-classification-2026-06-21-task.md`
- How tested: focused and combined Vitest commands listed above.
- What is incomplete: protected production DCA/PnL runtime readback remains separately approval-gated.
- Next steps: no backend follow-up required for this local timeout signal; release/source-control owner still owns branch divergence and commit/push/deploy sequencing.
- Decisions made: no runtime code change; no product performance child created.
