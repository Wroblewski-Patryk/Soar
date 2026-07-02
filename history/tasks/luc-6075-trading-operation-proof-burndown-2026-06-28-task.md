# Task

## Header
- ID: LUC-6075
- Title: Continue safe no-live browser-review burn-down from V1 readiness map
- Task Type: verification
- Current Stage: verification
- Status: VERIFIED_LOCAL_PROOF_SLICE
- Owner: QA/Test
- Depends on: [LUC-6004](/LUC/issues/LUC-6004), [LUC-6010](/LUC/issues/LUC-6010)
- Priority: P1
- Module Confidence Rows: Trading operation / app-completion browser-review backlog
- Requirement Rows: Trading operation row-level proof
- Quality Scenario Rows: safe no-live/no-money local proof
- Risk Rows: live-money mutation boundary, row-linkage backlog
- Iteration: 2026-06-28
- Operation Mode: TESTER
- Mission ID: LUC-6075-TRADING-OPERATION-PROOF-BURNDOWN-2026-06-28
- Mission Status: VERIFIED_LOCAL_PROOF_SLICE

## Context

[LUC-6004](/LUC/issues/LUC-6004) extracted the Trading operation app-completion
drill-down and partially verified safe browser/state behavior. It deferred four
`implemented_needs_proof` rows and routed the heavy `HomeLiveWidgets` timeout to
[LUC-6010](/LUC/issues/LUC-6010). [LUC-6010](/LUC/issues/LUC-6010) later proved
the heavy component packet with deterministic split tests.

## Goal

Continue the burn-down with the smallest safe no-live proof slice by verifying
the four remaining `implemented_needs_proof` Trading operation rows from
[LUC-6004](/LUC/issues/LUC-6004).

## Constraints

- Stay inside the QVE lane: verification evidence and issue disposition only.
- Do not deploy, push, restart, mutate production, read secrets/accounts, call
  live exchanges, create orders, open/close positions, mutate subscriptions, or
  run live-trading actions.
- Reuse existing focused tests instead of broad workspace gates.
- Preserve unrelated dirty worktree changes.

## Definition of Done

- The four deferred rows are named with exact paths and proof commands.
- Focused local proof commands pass or fail with recorded evidence.
- Evidence packet and task record exist.
- Source-control closure records no commit/push/deploy from this QA lane.
- Residual backlog and next owner are explicit.

## Forbidden

- Live exchange mutation.
- Order, position, subscription, payment, credential, secret, deployment,
  restart, rollback, or production account mutation.
- Broad refactors or product code changes.

## Implementation Plan

1. Read the LUC-6004 drill-down and LUC-6010 split-proof evidence.
2. Identify exact existing tests for the four deferred proof rows.
3. Run the smallest local proof commands.
4. Record evidence, residual risk, and final disposition.

## Acceptance Criteria

- Web utility proof passes for `runtimeSignalLabelKeys.ts`,
  `strategyThresholdItems.ts`, and `marketStream.ts`.
- Script contract proof passes for `runProdPositionsProof.mjs`.
- Remaining browser/doc/test-link rows are not overstated as closed.
- No protected or live-money action occurs.

## Result Report

- Task summary:
  verified the four Trading operation rows that [LUC-6004](/LUC/issues/LUC-6004)
  deferred as `implemented_needs_proof`.
- Files changed:
  `history/evidence/luc-6075-trading-operation-proof-burndown-2026-06-28.md`,
  `history/tasks/luc-6075-trading-operation-proof-burndown-2026-06-28-task.md`,
  plus source-of-truth state updates.
- How tested:
  `pnpm --filter web exec vitest run src/features/bots/utils/runtimeSignalLabelKeys.test.ts src/lib/sharedWebUtilities.test.ts src/lib/marketStream.test.ts --reporter=verbose`
  passed `3` files / `15` tests.
  `pnpm exec node --test scripts/runProdPositionsProof.test.mjs` passed `5/5`.
- What is incomplete:
  Trading operation still has `137` browser-review rows, `44` missing-doc-link
  rows, and `28` missing-test-link rows from the [LUC-6004](/LUC/issues/LUC-6004)
  drill-down.
- Source-control closure:
  not committed and not pushed from this QA lane because the shared checkout has
  a large pre-existing mixed dirty/divergent state. No deploy impact.
- Next owner:
  QVE/Docs can continue row-linkage burn-down; Frontend should only receive a
  child issue if a concrete UI defect is reproduced.
