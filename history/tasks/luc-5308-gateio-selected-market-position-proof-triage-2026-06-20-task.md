# Task

## Header

- ID: LUC-5308
- Title: Gate.io selected-market position creation proof/repair triage
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-5307](/LUC/issues/LUC-5307)
- Priority: P0
- Module Confidence Rows: exchange adapter; orders; positions; bot runtime; Gate.io selected-market proof
- Requirement Rows: Gate.io selected-market position creation; order lifecycle; fail-closed behavior
- Quality Scenario Rows: functional correctness; exchange safety; local proof reliability
- Risk Rows: Gate.io selected-market position creation not production-proven
- Iteration: 2026-06-20 QVE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5308-GATEIO-SELECTED-MARKET-POSITION-PROOF-TRIAGE-2026-06-20
- Mission Status: VERIFIED_LOCAL / DONE

## Context

[LUC-5307](/LUC/issues/LUC-5307) identified Gate.io selected-market position
creation as a high-priority proof/repair lane. The required proof covers
selected market/symbol mapping, manual/bot order path, order persistence,
position creation/readback, and fail-closed behavior. LIVE mutation was not
approved.

Continuation note: [LUC-5311](/LUC/issues/LUC-5311) repaired the broader
orders/positions e2e blocker, so this task resumed and consumed that repair
with a dedicated Gate.io PAPER selected-market order-to-position proof.

## Goal

Run the smallest safe local verification for Gate.io selected-market position
creation and route a narrow repair/proof follow-up if full proof cannot be
closed.

## Constraints

- Use PAPER-first or read-only production-safe paths.
- Do not run unapproved LIVE orders or exchange-side mutations.
- Do not read or store secrets, cookies, tokens, credentials, or account data.
- Keep verification focused; no broad refactor or deploy.

## Definition of Done

- [x] Read issue context and parent evidence.
- [x] Identify current local proof surfaces.
- [x] Run focused safe API validation.
- [x] Record passing and failing evidence.
- [x] Create a child Backend/Integration follow-up for blocking repair/proof.
- [x] Consume [LUC-5311](/LUC/issues/LUC-5311) after child completion.
- [x] Add dedicated Gate.io PAPER selected-market e2e proof.
- [x] Rerun parent verification command successfully.
- [x] Update source-of-truth state.
- [x] Update Paperclip issue disposition.

## Forbidden

- Production deploy, restart, rollback, env edit, database/Redis mutation
  outside local test cleanup.
- Secret/account readback or raw credential artifacts.
- Unapproved LIVE order, exchange action, payment/subscription mutation, or
  live-trading action.
- Broad refactor or workaround-only bypass.

## Validation Evidence

- Focused local PASS:
  `pnpm --filter api exec vitest run src/modules/orders/orders.manualContext.contractSize.service.test.ts src/modules/orders/orders.quantityRules.test.ts src/modules/orders/orders.positionScope.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/orders/orders.service.test.ts -t "Gate.io|PAPER MARKET fill creates a new position|manual PAPER MARKET add|reuses owned imported LIVE position|fails closed" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000`
  passed with `4` test files, `13` tests.
- Broader local FAIL:
  `pnpm --filter api exec vitest run src/modules/orders/orders.manualContext.contractSize.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts -t "Gate.io|PAPER MARKET fill creates a new position|position|manual-order context" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000`
  failed in `apps/api/src/modules/orders/orders-positions.e2e.test.ts` with
  `4` failed tests.
- Follow-up issue created:
  [LUC-5311](/LUC/issues/LUC-5311).
- Continuation focused PASS:
  `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "Gate.io PAPER position" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000`
  passed with `1` test file, `1` test, `23` skipped.
- Continuation parent PASS:
  `pnpm --filter api exec vitest run src/modules/orders/orders.manualContext.contractSize.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts -t "Gate.io|PAPER MARKET fill creates a new position|position|manual-order context" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000`
  passed with `4` test files passed, `1` skipped; `40` tests passed,
  `72` skipped.
- Evidence report:
  `history/evidence/luc-5308-gateio-selected-market-position-proof-triage-2026-06-20.md`.

## Result Report

- Task summary: Gate.io selected-market position creation is locally verified
  for the PAPER-safe selected-market path. The added e2e test proves selected
  market/symbol mapping, manual order context, order persistence, fill
  lifecycle, position creation, and runtime position readback for a Gate.io
  PAPER selected bot. Existing fail-closed and broader order/position proofs
  also pass in the parent command after [LUC-5311](/LUC/issues/LUC-5311).
- Files changed:
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
  - `history/evidence/luc-5308-gateio-selected-market-position-proof-triage-2026-06-20.md`
  - `history/tasks/luc-5308-gateio-selected-market-position-proof-triage-2026-06-20-task.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: focused and parent API vitest commands listed above.
- What is incomplete: production/live Gate.io order or position proof remains
  separately protected and was not authorized or executed.
- Next steps: none for local [LUC-5308](/LUC/issues/LUC-5308) closure. Any
  production/LIVE Gate.io proof must be a separate protected approval lane.
- Deployment impact: none.
