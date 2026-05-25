# API Deep-Dive: Exchange Module

## Metadata
- Module name: `exchange`
- Layer: `api`
- Source path: `apps/api/src/modules/exchange`
- Owner: backend/trading-integration
- Last updated: 2026-05-21
- Related planning task: `ARCH-AUDIT-01`

## 1. Purpose and Scope
- Encapsulates exchange integration primitives behind canonical exchange
  boundaries for Binance and the selected V1 second-exchange target, Gate.io.
- Provides:
  - connector lifecycle and exchange-side order operations
  - live order submit/cancel, retry, and fee reconciliation adapters
  - exchange capability and exact-operation support matrices
  - symbol trading-rule resolution for pre-trade validation
  - API-key probe client construction for profile connection tests
  - public/authenticated read boundaries for market data, snapshots, wallet
    balance previews, and wallet cashflow history

Out of scope:
- Public route ownership.
- Trading decision logic (engine module).
- Production readiness claims for live-money exchange mutation. Implementation
  capability is not sufficient proof; submit/cancel/close claims require fresh
  approved evidence for the exact `(exchange, marketType, operation)` tuple.

## 2. Boundaries and Dependencies
- No direct router mount; consumed by orders, engine, profile API-key probe,
  positions, wallets, market-stream, market-data, and markets capability
  checks.
- Depends on:
  - CCXT integration.
  - metrics store for exchange runtime metrics.
  - reconciliation helper services (`liveFeeReconciliation`).

## 3. Data and Contract Surface
- Core contracts:
  - `CcxtFuturesConnectorConfig`, `CcxtFuturesOrderRequest`, `CcxtFuturesOrderResult`.
  - `PlaceLiveOrderInput` and adapter result with fee metadata.
- Capability contracts:
  - `EXCHANGE_CAPABILITIES` compatibility matrix and `assertExchangeCapability`.
  - exact operation support in `exchangeAdapterBoundary.service.ts`.
  - market-type/base-currency context mappings.
- Key outputs for callers:
  - order id/status/fill payload.
  - fee source (`ESTIMATED`/`EXCHANGE_FILL`) and pending flags.
  - symbol trading rules (`minAmount`, `minNotional`, precision).
  - normalized account snapshots, open orders, trade history, balance previews,
    and wallet cashflow entries where supported.

## 4. Runtime Flows
- LIVE order flow:
  1. Parse/validate adapter input.
  2. Place order through CCXT connector.
  3. Retry on retryable transport/error patterns.
  4. Reconcile final fees/fills via exchange data.
  5. Emit exchange metrics and structured logs.
- Capability check flow:
  - caller asserts exchange supports required feature before operation.
- API-key probe flow:
  1. Profile module requests a probe through the exchange-owned client factory.
  2. Exchange module creates the CCXT-backed client with exchange-specific
     `defaultType` semantics.
  3. Profile module maps the probe result into user-facing permission status.

## 5. API and UI Integration
- No direct endpoints.
- Indirect API consumers:
  - `/dashboard/orders/open` LIVE path.
  - `/dashboard/orders/:id/cancel` LIVE exchange-backed cancel path.
  - profile API-key connection tests.
  - positions exchange snapshot routes.
  - wallets balance preview and cashflow analytics.
  - markets and market-stream exchange data consumers.

## 6. Security and Risk Guardrails
- Exchange capability assertions fail closed for unsupported providers/features.
- LIVE retries bounded by max attempts/backoff policy.
- Connector validates position-side constraints in hedge/one-way modes.
- LIVE exchange-side mutation remains approval-gated and must not be inferred
  from local adapter tests or authenticated-read proof.

## 7. Observability and Operations
- Structured logging for live-order success/retry/failure events.
- Metrics: attempt/retry/failure counters + reconciliation delay signals.
- Environment toggles support strict/optional convergence behavior in caller modules.

## 8. Test Coverage and Evidence
- Representative tests:
  - `exchangeApiKeyProbe.service.test.ts`
  - `exchangeAdapterBoundary.service.test.ts`
  - `exchangeAuthenticatedRead.service.test.ts`
  - `ccxtFuturesConnector.service.test.ts`
  - `liveOrderAdapter.service.test.ts`
  - `exchangeSymbolRules.service.test.ts`
  - `liveFeeReconciliation.service.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/ccxtFuturesConnector.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/exchangeSymbolRules.service.test.ts src/modules/exchange/liveFeeReconciliation.service.test.ts
```

## 9. Open Issues and Follow-Ups
- Continue migrating legacy broad capability checks toward exact
  `(exchange, marketType, operation)` support wherever new flows are added.
- Keep direct CCXT/client construction inside `modules/exchange`; feature
  modules consume exchange-owned boundaries only.
