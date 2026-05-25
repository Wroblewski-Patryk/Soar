# Pipeline: Manual order execution

Updated: 2026-05-03

## Trigger
User opens, closes, or cancels an order from dashboard runtime/order controls.

## User/System Action
- UI requests manual order context for selected bot/symbol.
- User submits order command.
- API validates ownership, mode, sizing, lifecycle, and exchange constraints.
- PAPER fills locally; LIVE routes through exchange adapter boundary.

## Involved Frontend Files
- `apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/*`
- `apps/web/src/features/bots/*`
- `apps/web/src/features/orders/services/orders.service.ts`

## Involved Backend Files
- `apps/api/src/modules/orders/orders.routes.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.manualContext.service.ts`
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/engine/*`
- `apps/api/src/modules/exchange/*`
- `apps/api/src/modules/positions/*`

## Involved Services
- Manual context service.
- Order service/lifecycle service.
- Pre-trade, runtime order lifetime, execution orchestrator.
- Exchange live order adapter.
- Position and trade lifecycle services.

## Data Read/Write
- Reads `Bot`, `Wallet`, `Strategy`, `MarketUniverse`, `ApiKey`.
- Writes or updates `Order`, `OrderFill`, `Position`, `Trade`.
- Reads/writes runtime session/event data when command belongs to active
  runtime context.

## Failure Points
- Stale frontend selected bot/symbol context.
- Insufficient wallet/capital or exchange minimum order block.
- Same-symbol open position conflict.
- LIVE exchange adapter/capability failure.
- Unauthorized user/bot/order ownership.

## Tests
- `orders.service.test.ts`
- `orders.manual-paper-market.e2e.test.ts`
- `orders-positions.e2e.test.ts`
- `orders.exchangeEvents.service.test.ts`
- dashboard manual-order focused tests under `apps/web/src/features/dashboard-home`.

## Related Docs
- `docs/modules/api-orders.md`
- `docs/modules/api-positions.md`
- `docs/modules/web-dashboard-home.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`

## Known Gaps
- This pipeline documents the current command path but does not enumerate every
  exchange-specific adapter branch. Use `docs/architecture/reference/exchange-access-ownership-matrix.md`
  for exchange-boundary ownership.
