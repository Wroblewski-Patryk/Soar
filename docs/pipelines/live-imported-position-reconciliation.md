# Pipeline: Live imported position reconciliation

Updated: 2026-05-03

## Trigger
System or operator imports/reconciles exchange-side LIVE positions, or user
requests takeover/orphan repair from dashboard positions/runtime surfaces.

## User/System Action
- Exchange snapshot is read through exchange-owned authenticated boundary.
- Ownership is resolved by wallet/API-key, bot, symbol scope, and management
  flags.
- Rebind/repair proceeds only when proof is deterministic.

## Involved Frontend Files
- `apps/web/src/features/positions/services/positions.service.ts`
- `apps/web/src/features/dashboard-home/*`
- `apps/web/src/features/bots/*`

## Involved Backend Files
- `apps/api/src/modules/positions/*`
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
- `apps/api/src/modules/exchange/*`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`

## Involved Services
- Live position reconciliation service.
- Imported position history hydrator.
- Runtime external position owner.
- Exchange authenticated read service.
- Runtime position automation and serialization.

## Data Read/Write
- Reads `ApiKey`, `Wallet`, `Bot`, `BotMarketGroup`, `MarketUniverse`,
  `SymbolGroup`.
- Reads/writes `Position`, `Trade`, `Order`.
- Reads runtime state and exchange snapshots.

## Failure Points
- Ambiguous ownership.
- Missing wallet-first API key proof.
- Legacy bot/symbol-only ownership assumptions.
- Imported position entry or mark-price degradation.
- DCA/protection state undercount after restart.

## Tests
- `runtimeExternalPositionOwner.service.test.ts`
- `positions.takeover-status.e2e.test.ts`
- `positions.orphan-repair.e2e.test.ts`
- `livePositionReconciliation.service.test.ts`
- `importedPositionHistoryHydrator.service.test.ts`
- `runtimePositionAutomation.service.test.ts`

## Related Docs
- `docs/modules/api-positions.md`
- `docs/modules/api-bots.md`
- `docs/modules/api-exchange.md`
- `docs/architecture/reference/live-position-restart-continuity-contract.md`
- `docs/architecture/reference/position-close-attribution-contract.md`
- `docs/planning/live-import-ownership-wallet-scope-task-2026-05-03.md`

## Known Gaps
- Production evidence must be checked in latest planning/context files for any
  operator-reported LIVE case before marking a specific incident closed.
