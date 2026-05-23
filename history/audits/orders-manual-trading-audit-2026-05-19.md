# Orders And Manual Trading Audit - 2026-05-19

## Scope

Audit ID: `AUD-12`

Purpose: verify the discrepancy risk between documented orders/manual trading
contracts and the current implementation.

This audit inspected and validated:

- manual-order context and selected-bot scope
- PAPER order lifecycle and immediate market fill behavior
- order list/read ownership isolation
- open/cancel/close command paths
- active-only open-order filtering and source labels
- exchange-backed cancel fail-closed boundary
- LIVE risk guards without live-money mutation
- fills, fees, fee backfill, and exchange-event reconciliation
- quantity rules and position scope
- Dashboard Home manual-order and open-order UI action states

## Result

Status: `current local / current historical production-safe PAPER proof`

The audited local orders/manual trading implementation is aligned with the
documented V1 contracts for the audited scope. Focused API and Web proofs
passed.

The latest production-safe PAPER proof remains historical 2026-05-14 evidence
for disposable order open/read/cancel lifecycle. No production journey was
rerun in this audit.

## Validation Run

| Command / Proof | Result | Notes |
| --- | --- | --- |
| `corepack pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx` | PASS | `8` files, `46` tests. Covers manual-order submit/validation/context/venue/scope, open-order source/action states, close action hook, and runtime table presenters. |
| `corepack pnpm run go-live:infra:up` | PASS | Started local Postgres/Redis for DB-backed API proof. |
| `corepack pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.liveCancelBoundary.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/orders/orders.quantityRules.test.ts src/modules/orders/orders.positionScope.test.ts` | PASS | `10` files, `121` tests. Covers order lifecycle, ownership, active filtering, PAPER/LIVE open contracts, risk guards, exchange-backed fail-closed cancel/close behavior, fills, fees, exchange events, quantity rules, and position scope. |
| `corepack pnpm run go-live:infra:down` | PASS | Local Postgres/Redis containers and network were removed after validation. |

## Architecture And Documentation Parity

Reviewed sources:

- `docs/modules/api-orders.md`
- `docs/modules/web-dashboard-home.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/10_safety-entitlements-and-risk.md`
- `docs/analysis/reusable-audit-registry.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

No new architecture-code mismatch was found for `AUD-12`. The current local
orders/manual-trading evidence supports the documented unified lifecycle and
fail-closed boundary contracts for the audited scope.

## Findings

| ID | Severity | Finding | Evidence | Status |
| --- | --- | --- | --- | --- |
| AUD-ORD-001 | P0 | Manual-order context, selected-bot scope, and UI lifecycle/action states are current locally. | Web pack passed `8` files / `46` tests; API pack passed `10` files / `121` tests. | closed |
| AUD-ORD-002 | P0 | Order lifecycle, ownership, active filtering, fills, fees, and exchange events are current locally. | API pack passed `10` files / `121` tests. | closed |
| AUD-ORD-003 | P0 | Exchange-backed cancel/close and LIVE mutation boundaries remain fail-closed locally. | API pack includes live cancel boundary and LIVE risk guard coverage. | closed |
| AUD-ORD-004 | P1 | Fresh production proof was not rerun. | Latest accepted production-safe PAPER order fixture proof is from 2026-05-14. | open freshness follow-up |
| AUD-ORD-005 | P1 | LIVE order/cancel/close mutation remains explicitly excluded. | No LIVE exchange-side mutation was run, by design. | explicit exclusion |

## Safety Notes

- No production journey was run.
- No LIVE order, cancel, close, activation, or exchange-side mutation was run.
- No existing production data was mutated.
- Local Postgres/Redis were started only for DB-backed tests and then stopped.

## Current Reusable Audit State

`AUD-12` is current for local V1 orders/manual-trading behavior and remains
backed by historical production-safe PAPER fixture evidence from 2026-05-14.

Keep this audit open for:

1. refreshing production-safe PAPER order proof after future deployments;
2. any explicit safe plan for LIVE order/cancel/close mutation proof;
3. rerunning the same focused packs after order lifecycle, exchange-event,
   manual-order context, dashboard open-order, or risk-guard changes.
