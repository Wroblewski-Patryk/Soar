# WLEDGER-07..09 Wallet Preview UI Task

## Header
- ID: WLEDGER-07..09
- Title: Add wallet preview route with ledger-backed summary, chart, and events
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: WLEDGER-06
- Priority: P1

## Context
The API now exposes wallet performance summary, equity timeline, and cashflow
events. Operators need an entry point from the wallets table and one coherent
preview screen to inspect wallet capital, bot PnL, deposits/withdrawals, and
unclassified adjustments.

## Goal
Add `wallets -> wallet -> preview` UI using existing dashboard patterns and
shared table actions.

## Scope
- Wallet list table action.
- `dashboardRoutes.wallets.preview`.
- `apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx`.
- Wallet analytics service/types.
- Wallet preview component with summary, SVG timeline, markers, and cashflow
  event table.
- EN/PL/PT wallet namespace copy.

## Implementation Plan
1. Add wallet analytics response types and service methods.
2. Add canonical preview route and table action using `TablePresetLinkAction`.
3. Build preview page with `PageTitle`, `LoadingState`, `ErrorState`, and
   `EmptyState`.
4. Render summary cards, completeness warning, responsive SVG equity chart, and
   cashflow events using existing dashboard styling.
5. Add focused tests, run relevant web/API validation, sync docs/context, commit,
   and push if gates pass.

## Acceptance Criteria
- Wallet table has one preview action using shared button styling.
- `/dashboard/wallets/:id/preview` loads summary, timeline, and events from the
  prepared API.
- Loading, error, empty/partial, and success states are represented.
- The page is responsive and keyboard-accessible through normal links/buttons.
- No new bespoke button style or standalone design system is introduced.

## Definition of Done
- [x] Preview action added to wallet table.
- [x] Preview route and component added.
- [x] Summary/chart/events render ledger-backed API data.
- [x] Focused tests pass.
- [x] Web typecheck/build or agreed relevant validation passes.
- [x] Planning/context docs updated.
- [x] Commit and push completed.

## Forbidden
- New button style outside shared `TableUi`.
- Fake chart data.
- Treating deposits/withdrawals as bot PnL in the UI.
- Replacing existing wallet list/edit routes.

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- WalletsListTable WalletPreviewPanel --run` => PASS (4/4)
  - `pnpm --filter web run typecheck` => PASS
  - `pnpm --filter web run build` => PASS
  - `pnpm i18n:audit:route-reachable:web` => PASS (`findings=0`)
  - `pnpm run quality:guardrails` => PASS
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm --filter api run test -- src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/walletCashflowClassifier.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/exchange/ccxtFuturesConnector.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts --run` => PASS (57/57)
- Manual checks:
  - Route build output includes `/dashboard/wallets/[id]/preview`.
  - Wallet list action target is `/dashboard/wallets/:id/preview`.
- Screenshots/logs:
  - Not captured; component-level render tests cover success and partial ledger states.
- High-risk checks:
  - Wallet amount rendering avoids `Intl` currency formatting for crypto symbols such as `USDT`.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing dashboard wallet/list/form patterns and `docs/ux/dashboard-design-system.md`
- Existing shared pattern reused: `PageTitle`, `ViewState`, `TableUi`, dashboard cards/table styling
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: link/button labels, chart `role=img`, table semantics
- Parity evidence: wallet table action uses shared `TablePresetLinkAction` `preview` preset; preview page reuses dashboard card/table/view-state patterns.

## Result Report
- Task summary: added wallet preview navigation and a ledger-backed preview surface with summary cards, equity timeline, and cashflow event table.
- Files changed: wallet routes, wallet list table, wallet analytics web service/types, wallet preview route/component/tests, EN/PL/PT copy, and canonical planning/context docs.
- How tested: focused wallet web tests, web typecheck, web build, route-reachable i18n audit, repository guardrails, API typecheck, and focused wallet/exchange/runtime API tests.
- What is incomplete: none.
- Next steps: continue with the next protected wallet/dashboard insight slice after deploy verification.
