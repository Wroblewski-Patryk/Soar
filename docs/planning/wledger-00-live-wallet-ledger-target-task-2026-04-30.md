# Task

## Header
- ID: WLEDGER-00
- Title: Freeze LIVE wallet cashflow ledger and equity timeline target
- Task Type: design
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: wallet source-of-truth contract
- Priority: P2

## Context
The dashboard can show current LIVE wallet runtime balance and a current
delta, but full wallet insight requires a history-aware model that separates
user-added or user-removed capital from bot trading performance.

## Goal
Document the target architecture and implementation plan for LIVE wallet
cashflow ledger, contributed capital, bot PnL, and equity timeline.

## Scope
- `docs/architecture/reference/wallet-source-of-truth-contract.md`
- `docs/product/product.md`
- `docs/product/known-limits.md`
- `docs/modules/system-modules.md`
- `docs/planning/live-wallet-cashflow-ledger-and-equity-timeline-plan-2026-04-30.md`
- source-of-truth sync in `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`, and `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Extend wallet architecture with target cashflow/equity semantics.
2. Record product and known-limit implications.
3. Identify module ownership across wallets, exchange, API reads, and web.
4. Publish an implementation plan with small future slices.
5. Run repository guardrails.

## Acceptance Criteria
- The target model separates contributed capital from bot PnL.
- Deposits, withdrawals, and transfers are explicitly covered.
- Unclassified exchange adjustments are explicit and not silently counted as
  bot PnL.
- Future implementation slices are documented.

## Definition of Done
- [x] Architecture target recorded.
- [x] Product docs aligned.
- [x] Known MVP limitation recorded.
- [x] Implementation plan queued.
- [x] Source-of-truth context synchronized.
- [x] Repository guardrails passed.

## Forbidden
- Code changes in this docs-only slice.
- Fake accounting assumptions.
- Treating raw balance drift as bot PnL.

## Validation Evidence
- Tests: not applicable, documentation-only task.
- Guardrails: `pnpm run quality:guardrails`
- Manual checks: reviewed updated docs for consistency with accepted user
  scenario.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/wallet-source-of-truth-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no, target direction was confirmed in chat.
- Follow-up architecture doc updates: completed in scope.

## Result Report
- Task summary: Documented target LIVE wallet ledger/equity model.
- Files changed: listed in Scope.
- How tested: repository guardrails.
- What is incomplete: implementation remains queued.
- Next steps: execute `WLEDGER-01..WLEDGER-10` slices from the plan.
