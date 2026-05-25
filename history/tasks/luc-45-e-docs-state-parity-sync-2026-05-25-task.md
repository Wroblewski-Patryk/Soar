# Task

## Header
- ID: LUC-45-E
- Title: [Soar][LUC-45] Docs/state parity sync
- Task Type: documentation
- Current Stage: planning
- Status: IN_PROGRESS
- Owner: Docs/Memory Lead
- Depends on: LUC-45-A, LUC-45-B, LUC-45-C, LUC-45-D
- Priority: P0

## Context
Final controller closure requires truthful parity across board, state, requirement, risk, and confidence ledgers.

## Goal
Synchronize all source-of-truth ledgers with validated lane outputs and residual risks.

## Scope
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

## Required Output
- Parity update packet linking lane outputs to state changes.
- Explicit closure recommendation for coordinator.

## Validation
- Link/path sanity checks.
- Consistent status vocabulary across ledgers.

## Acceptance Criteria
- [ ] All impacted state files reflect latest lane evidence.
- [ ] Residual risks and blockers are explicit and non-optimistic.
- [ ] Coordinator receives clear closure recommendation.
