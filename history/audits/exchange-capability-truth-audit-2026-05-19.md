# Exchange Capability Truth Audit - 2026-05-19

## Scope

Audit ID: `AUD-09`

Purpose: verify the discrepancy between the canonical exchange capability
architecture and the implementation that currently exists in code.

This audit inspected:

- exchange architecture and ownership contracts
- API exchange capability, authenticated-read, adapter registry, and adapter
  boundary services
- shared exchange compatibility matrix
- Web exchange capability gating
- source ownership for CCXT and hardcoded exchange transport

## Result

Status: `current local / exact market-type operation matrix implemented`

The project has strong local exchange-boundary evidence:

- CCXT/client construction is owned by `apps/api/src/modules/exchange`
- public market data and authenticated reads are routed through exchange-owned
  services
- `ExchangeContext = (exchange, marketType)` is used by the adapter registry
- Gate.io app `FUTURES` maps to CCXT `swap`
- unsupported market contexts fail closed in the registry
- operation support is explicit per exchange, market type, and operation for
  authenticated reads and live submit/cancel
- Web broad exchange capability gates fail closed for unknown exchanges

The implementation now matches the target architecture's exact operation
capability shape. `docs/architecture/reference/exchange-access-ownership-matrix.md`
says exact operation support should resolve by:

```text
(exchange, marketType, operation)
```

Current operation capability services now resolve by that same shape, while the
adapter registry still owns connector bootstrap for the exact exchange context.

## Architecture Claim Checked

`docs/architecture/09_integrations-deployment-and-runtime-services.md` states
that the canonical integration key is `ExchangeContext = (exchange,
marketType)` and that the next-step scalable matrix must resolve support by
`exchange`, `marketType`, and `operation family`.

`docs/architecture/reference/exchange-access-ownership-matrix.md` allows older
exchange-level flags only as compatibility-stage truth and states that
stage-2 exact operation truth wins when stage-1 and stage-2 disagree.

## Code Truth Checked

Compatibility-stage exchange-level truth:

- `libs/shared/index.js`
- `apps/api/src/modules/exchange/exchangeCapabilities.ts`
- `apps/web/src/features/exchanges/exchangeCapabilities.ts`

Exact operation truth currently by exchange + market type + operation:

- `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.ts`
- `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`

Exact exchange context registry:

- `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.ts`

Consumers:

- wallets, bots, markets, profile API keys, positions, orders, engine runtime
  defaults, Web bots/wallets/profile/dashboard/markets capability gates.

## Validation Run

| Command | Result | Notes |
| --- | --- | --- |
| `corepack pnpm --dir apps/api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts --reporter=default` | PASS | `2` files, `4` tests. Covers exact `(exchange, marketType, operation)` support and authenticated-read unsupported error details. |
| `corepack pnpm --dir apps/api exec vitest run src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAdapterRegistry.service.test.ts --reporter=default` | PASS | `2` files, `17` tests. Covers exact exchange context registry, Gate.io swap mapping, and adapter boundary behavior. |
| `corepack pnpm --dir apps/api exec vitest run src/modules/orders/orders.service.test.ts --reporter=default` | PASS after local infra startup | `1` file, `38` tests. The first attempt failed because local Postgres was not running; rerun passed after `go-live:infra:up`. |
| `corepack pnpm --dir apps/api run typecheck` | PASS | API TypeScript compile proof after exact matrix refactor. |
| `corepack pnpm run quality:guardrails` | PASS | Confirms source and monolith budgets after the refactor. |
| `pnpm --filter web exec vitest run src/features/exchanges/exchangeCapabilities.test.ts src/features/exchanges/components/ExchangeConnectionsView.test.tsx` | PASS | `2` files, `3` tests. Covers broad Web exchange capability gating and exchange connection UI. |
| `corepack pnpm --dir apps/api exec vitest run src/modules/wallets/walletCashflowClassifier.service.test.ts src/modules/orders/orders.service.test.ts --reporter=default` | PASS after local infra startup | `2` files, `41` tests. Covers the neutral type alias consumers. |
| `rg -n 'ccxt|binance\\.com|fapi\\.binance|api\\.binance|gate\\.io|gateio|new Ccxt|createBinance' apps/api/src apps/web/src -g '*.ts' -g '*.tsx'` | PASS | Exchange SDK/REST construction remains under exchange/market-stream boundaries; non-exchange modules now import neutral exchange-owned type aliases. |

## Discrepancies

| ID | Severity | Discrepancy | Evidence | Required Decision |
| --- | --- | --- | --- | --- |
| AUD-EXCH-002 | P1 | Operation capability support is now keyed by market type. | `supportsExchangeExecutionCapability(exchange, marketType, operation)` and `supportsAuthenticatedExchangeRead(exchange, marketType, operation)` now accept `marketType`. Exchange adapter boundary, wallet preview, and positions snapshot consumers pass market type into the contract. | Closed by exact matrix refactor; keep future exchange additions on this contract. |
| AUD-EXCH-007 | P3 | Non-exchange modules no longer depend on CCXT-named exchange-module types. | `orders.service.ts` imports `ExchangeOrderFill`; `walletCashflowClassifier.service.ts` imports `ExchangeWalletCashflowHistoryEntry`; both aliases are exported from `apps/api/src/modules/exchange/exchangeData.types.ts`. | Closed by neutral exchange-owned contract aliases. |

## Aligned Areas

| Area | Status | Evidence |
| --- | --- | --- |
| SDK ownership | aligned | CCXT imports and REST URLs are confined to exchange or market-stream exchange-owned modules. |
| Adapter registry key | aligned | `resolveExchangeAdapterRegistryEntry(context)` requires `exchange` and `marketType`. |
| Gate.io futures mapping | aligned | Registry maps app `GATEIO/FUTURES` to CCXT `swap`; focused test passes. |
| Unsupported exchange context | aligned | `KRAKEN/FUTURES` fails closed with `ExchangeContextUnsupportedError`. |
| Operation separation | aligned | Authenticated reads, live submit, and live cancel are separate operation names, market-type scoped, and tested independently. |
| Web broad gates | compatible | Web gates use exchange-level compatibility flags, which architecture allows only as stage-1 entry truth. |

## Safety Notes

- No production journey was run.
- No LIVE order, cancel, close, or exchange-side mutation was run.
- No existing production data was mutated.
- No local Docker infrastructure was required for this audit.
- No browser or dev server process was started for this audit.

## Current Reusable Audit State

`AUD-09` is now `current local` for exact operation capability granularity and
neutral exchange-owned type naming. Future exchange additions should keep both
properties intact.
