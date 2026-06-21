# Task

## Header
- ID: LUC-5311
- Title: Repair orders/positions e2e blocker for Gate.io selected-market proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: CTO / Backend
- Priority: P1
- Module Confidence Rows: orders; positions; bot runtime; exchange adapter; Gate.io selected-market position creation
- Mission ID: LUC-5311-ORDERS-POSITIONS-E2E-GATEIO-SELECTED-MARKET-REPAIR-2026-06-20
- Mission Status: VERIFIED

## Context
[LUC-5308](/LUC/issues/LUC-5308) could not close Gate.io selected-market position creation because the broader orders/positions HTTP e2e proof failed in `apps/api/src/modules/orders/orders-positions.e2e.test.ts` with four failures.

## Goal
Repair or correctly classify the orders/positions e2e blocker without bypassing unified order lifecycle, selected-market scope, canonical LIVE context, or fail-closed exchange contracts.

## Scope
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- Source-of-truth updates for LUC-5311 evidence and module confidence

## Implementation Plan
1. Reproduce the exact failing LUC-5308 command.
2. Classify stale test expectations versus real backend/test-runtime issues.
3. Patch only the minimum required backend/test contract.
4. Re-run focused orders/positions and the full issue validation command.
5. Update module confidence and Paperclip issue disposition.

## Acceptance Criteria
- The four `orders-positions.e2e.test.ts` failures from LUC-5308 are green.
- Test runtime does not attempt real LIVE exchange boundary execution for default-deps HTTP e2e.
- Service-level tests with injected LIVE execution deps still execute and assert fill behavior.
- No production exchange order, deploy, push, restart, env edit, secret readback, account mutation, or live-trading action occurs.

## Definition of Done
- Focused failing cases pass.
- Full LUC-5311 validation command passes.
- Source-of-truth files record evidence and residual risk.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "selected bot context|LIVE risk guards|selected from LIVE dashboard flow" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000` PASS (`1` file, `3` tests, `20` skipped).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.manualContext.contractSize.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts -t "Gate.io|PAPER MARKET fill creates a new position|position|manual-order context" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000` PASS (`4` files passed, `1` skipped; `39` tests passed, `72` skipped).
- Manual checks:
  - Diff reviewed for scope. No controller diagnostic logging left behind.
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md` not changed; existing unified order lifecycle and exchange boundary ownership preserved.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the two touched runtime/test files if the test-runtime sentinel causes unintended local behavior.
- Observability or alerting impact: none

## Security / Privacy Evidence
- Data classification: local test data only.
- Trust boundaries: default test runtime no longer attempts to decrypt placeholder LIVE API keys or call exchange boundary; custom injected LIVE deps still execute in service tests.
- Secret handling: no real secret values read or written.
- Fail-closed behavior: production and non-test LIVE execution path unchanged; custom-deps service tests still prove LIVE fill behavior.
- Residual risk: production Gate.io selected-market proof remains approval/protected-input gated and was not executed.

## Result Report
- Task summary: Repaired LUC-5311 by aligning orders test-runtime detection with existing `NODE_ENV === 'test' || VITEST === 'true'` convention, scoped only to default exchange-boundary deps, and fixed stale LIVE e2e fixtures to include canonical API-key and continuity facts.
- Files changed:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/active-mission.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `history/tasks/luc-5311-orders-positions-e2e-gateio-selected-market-repair-2026-06-20-task.md`
- How tested: focused red-case e2e and full LUC-5311 validation command passed.
- What is incomplete: no protected production/live Gate.io order or position proof was run.
- Next steps: QVE/parent [LUC-5308](/LUC/issues/LUC-5308) can consume this local backend proof; production/live proof still requires separate approval and protected inputs.
- Decisions made: treat the original non-null mark-price failure as caused by missing Vitest sentinel in backend test runtime, not as desired e2e exchange access.
