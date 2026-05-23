# WLEDGER-06 LIVE Wallet Analytics Read API Task

## Header
- ID: WLEDGER-06
- Title: Expose wallet performance summary, timeline, and cashflow APIs
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: WLEDGER-02, WLEDGER-04, WLEDGER-05
- Priority: P1

## Context
The ledger now has persisted balance snapshots and initial/classified cashflow
events. The web needs read endpoints before it can show wallet performance
cards, cashflow markers, or a timeline.

## Goal
Expose wallet analytics APIs with completeness state from the persisted ledger.

## Scope
- `apps/api/src/modules/wallets/wallets.routes.ts`
- `apps/api/src/modules/wallets/wallets.controller.ts`
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.types.ts`
- Focused wallet API e2e coverage.

## Implementation Plan
1. Add query parsing for wallet analytics reads.
2. Add performance summary read model.
3. Add equity timeline read model with cashflow markers.
4. Add cashflow events list endpoint.
5. Validate ownership, not-found behavior, and response shape through existing
   authenticated wallet e2e flow.

## Acceptance Criteria
- Summary returns current balances, contributed capital, bot PnL fields, delta,
  unclassified adjustments, and completeness.
- Timeline returns equity points and markers.
- Cashflow endpoint returns persisted wallet cashflow events.
- Cross-user ownership still resolves through existing wallet ownership lookup.

## Definition of Done
- [x] API routes added.
- [x] Read model implemented.
- [x] Focused wallet e2e passed.
- [x] API typecheck passed.
- [x] Source-of-truth planning/context docs updated.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/walletCashflowClassifier.service.test.ts`
- Manual checks: API typecheck passed.
- High-risk checks: read model does not infer bot PnL from raw balance drift.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Result Report
- Task summary: added wallet performance summary, equity timeline, and cashflow events APIs.
- Files changed: wallet routes/controller/service/types, wallet e2e, planning/context docs.
- How tested: focused API tests and typecheck.
- What is incomplete: web summary/chart/dashboard integration remains queued.
- Next steps: WLEDGER-07 web wallet performance summary.
