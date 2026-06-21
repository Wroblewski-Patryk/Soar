# LUC-5308 Gate.io Selected-Market Position Creation Proof Triage - 2026-06-20

## Status

- Issue: [LUC-5308](/LUC/issues/LUC-5308)
- Result: `DONE / VERIFIED_LOCAL / GATEIO_PAPER_SELECTED_MARKET_POSITION_PROVEN`
- Follow-up blocker: [LUC-5311](/LUC/issues/LUC-5311) closed and consumed.
- Scope: local QA/runtime proof triage for Gate.io selected-market position creation.
- Production mutation: none.

## Findings

Focused local contract proof passed for the safe pieces currently covered by
existing tests:

- Gate.io futures manual-order context resolves through the selected
  market-universe venue and uses Gate.io contract-size truth.
- Gate.io futures quantity rules use contract size for min-notional checks.
- Gate.io execution capability matrix explicitly supports authenticated reads,
  `LIVE_ORDER_SUBMIT`, and `LIVE_ORDER_CANCEL`.
- Generic order lifecycle service tests still prove PAPER MARKET fill can
  create a new position, same-symbol PAPER adds can reuse/reprice, and
  conflicting LIVE/open-position cases fail closed.
- Gate.io runtime final-candle routing/fallback tests pass and preserve exact
  Gate.io runtime topology.

Continuation after [LUC-5311](/LUC/issues/LUC-5311) added and verified the
previously missing dedicated local e2e proof for the complete Gate.io PAPER
selected-market path:

`selected market/symbol mapping -> order persistence -> fill lifecycle -> position creation/readback -> off-scope/fail-closed behavior`.

The new e2e test is
`creates and reads back a Gate.io PAPER position from selected-market manual order scope`
in `apps/api/src/modules/orders/orders-positions.e2e.test.ts`. It proves:

- Gate.io PAPER bot selected-market context normalizes `adausdt` to `ADAUSDT`.
- Manual order context resolves the selected bot, strategy leverage, `MARKET`
  order type, and `ISOLATED` margin mode.
- Manual PAPER market open returns `201`, persists a filled `USER` order, and
  links the selected bot, wallet, strategy, symbol, and created position id.
- The created position is persisted as `OPEN`, `LONG`, `USER`, selected bot
  and selected strategy scoped.
- Runtime positions readback returns `200` and includes the created position in
  `openItems`.

The previously blocking broader HTTP orders/positions e2e surface now passes
locally after [LUC-5311](/LUC/issues/LUC-5311).

## Validation

### Focused PASS

Command:

```powershell
pnpm --filter api exec vitest run src/modules/orders/orders.manualContext.contractSize.service.test.ts src/modules/orders/orders.quantityRules.test.ts src/modules/orders/orders.positionScope.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/orders/orders.service.test.ts -t "Gate.io|PAPER MARKET fill creates a new position|manual PAPER MARKET add|reuses owned imported LIVE position|fails closed" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000
```

Result:

- PASS
- `4` test files passed, `1` skipped
- `13` tests passed, `37` skipped

### Blocking FAIL

Command:

```powershell
pnpm --filter api exec vitest run src/modules/orders/orders.manualContext.contractSize.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts -t "Gate.io|PAPER MARKET fill creates a new position|position|manual-order context" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000
```

Result:

- FAIL
- `apps/api/src/modules/orders/orders-positions.e2e.test.ts` failed `4` tests:
  - manual-order context fallback expected `markPrice=null` but received a live mark price,
  - two manual open HTTP tests returned `400` instead of `201`,
  - selected LIVE dashboard EXCHANGE_SYNC close returned `500` instead of `200`.

### Continuation PASS After LUC-5311

Command:

```powershell
pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "Gate.io PAPER position" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000
```

Result:

- PASS
- `1` test file passed
- `1` test passed, `23` skipped
- Note: runtime positions readback in this focused test returned `200` after
  about `12.6s`, so the proof uses the issue's explicit `45000ms` timeout.

Command:

```powershell
pnpm --filter api exec vitest run src/modules/orders/orders.manualContext.contractSize.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts -t "Gate.io|PAPER MARKET fill creates a new position|position|manual-order context" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000
```

Result:

- PASS
- `4` test files passed, `1` skipped
- `40` tests passed, `72` skipped

## Disposition

[LUC-5308](/LUC/issues/LUC-5308) is closed as local QA proof complete. The
[LUC-5311](/LUC/issues/LUC-5311) blocker is resolved and consumed. Production
or LIVE Gate.io order/position proof remains a separate protected approval
lane and was not executed here.

No deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation outside local test cleanup, exchange action, order,
position, payment/subscription mutation, or live-trading action occurred.
