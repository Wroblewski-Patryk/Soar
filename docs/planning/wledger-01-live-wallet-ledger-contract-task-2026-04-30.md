# Task

## Header
- ID: WLEDGER-01
- Title: Freeze LIVE wallet ledger data model and completeness semantics
- Task Type: design
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: WLEDGER-00
- Priority: P2

## Context
`WLEDGER-00` established the product target for LIVE wallet performance
analytics. Before DB/API/exchange work begins, the repository needs an
implementation-grade architecture contract for model semantics, event
classification, completeness states, formulas, and module boundaries.

## Goal
Freeze the target ledger contract so future implementation can be split safely
without inventing incompatible accounting rules.

## Scope
- `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- `docs/architecture/reference/wallet-source-of-truth-contract.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- `docs/planning/live-wallet-cashflow-ledger-and-equity-timeline-plan-2026-04-30.md`
- source-of-truth sync in `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`, and `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Publish the detailed ledger architecture contract.
2. Link it from the wallet source-of-truth contract.
3. Extend exchange access ownership to cover future wallet cashflow history
   reads.
4. Mark `WLEDGER-01` closed in the queued plan and context files.
5. Run repository guardrails.

## Acceptance Criteria
- Persistent model semantics are defined for balance snapshots, cashflow events,
  and equity points.
- Cashflow classification rules cover deposits, withdrawals, transfers, bot PnL,
  fees, funding, and unknown adjustments.
- Completeness semantics are explicit.
- Future exchange-history reads remain behind the exchange module boundary.

## Definition of Done
- [x] Architecture contract published.
- [x] Wallet and exchange architecture linked.
- [x] Planning queue updated.
- [x] Source-of-truth context synchronized.
- [x] Repository guardrails passed.

## Forbidden
- Code changes in this docs-only slice.
- Bypassing exchange authenticated-read ownership.
- Counting raw balance drift as bot PnL.
- Hiding partial ledger coverage.

## Validation Evidence
- Tests: not applicable, documentation-only task.
- Guardrails: `pnpm run quality:guardrails`
- Manual checks: reviewed contract against the accepted `5 + 10 deposit, +1 bot PnL`
  scenario and withdrawal handling.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/wallet-source-of-truth-contract.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: completed in scope.

## Result Report
- Task summary: Detailed LIVE wallet ledger contract published and linked.
- Files changed: listed in Scope.
- How tested: repository guardrails.
- What is incomplete: implementation remains queued.
- Next steps: `WLEDGER-02 db`.
