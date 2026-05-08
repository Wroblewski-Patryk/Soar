# API Deep-Dive: Market-Stream Module

## Metadata
- Module name: `market-stream`
- Layer: `api`
- Source path: `apps/api/src/modules/market-stream`
- Owner: backend/runtime-infra
- Last updated: 2026-05-08
- Related planning task: `EXCHANGE2-05`

## 1. Purpose and Scope
- Owns approved exchange market-data ingestion and normalized runtime market-stream event contracts.
- Supports Binance websocket ingestion by default and opt-in Gate.io public polling
  through the exchange adapter boundary.
- Provides server-side event fan-out bridge and SSE route for dashboard consumers.
- Standardizes ticker/candle normalization for downstream runtime engine and UI.

Out of scope:
- Strategy decisioning/execution (engine).
- Historical batch ingestion (market-data/backtests).

## 2. Boundaries and Dependencies
- Mounted under `/dashboard/market-stream` via dashboard router.
- Depends on:
  - websocket transport (`ws`/global WebSocket adapters) for Binance.
  - exchange-owned public ticker/candle reader for Gate.io polling.
  - in-process fan-out subscription bridge.
  - API error helper for SSE validation failures.
- Consumed by:
  - engine runtime signal loop.
  - dashboard SSE clients.

## 3. Data and Contract Surface
- Stream event contract (`MarketStreamEvent`):
  - `ticker` events (`lastPrice`, `priceChangePercent24h`)
  - `candle` events (OHLCV + interval + final flag)
- SSE contract:
  - endpoint: `GET /dashboard/market-stream/events`
  - supports `symbols` filter and `interval` filter.
  - emits event IDs, heartbeat comments (`: ping`), and periodic `health` events.
- Guardrails:
  - hard symbol limit (`MARKET_STREAM_MAX_SYMBOLS = 20`).

## 4. Runtime Flows
- Worker flow:
  1. Resolve dynamic subscriptions from configured/env symbols and active bot
     scope.
  2. Use Binance websocket ingestion unless `MARKET_STREAM_EXCHANGE=GATEIO`.
  3. For Gate.io, poll public ticker/candle data through
     `exchangePublicMarketData.service.ts` and publish canonical events.
  4. Publish normalized events to fan-out subscribers.
- SSE flow:
  1. Validate symbol count/filter params.
  2. Open streaming headers.
  3. Forward matching events with incrementing IDs.
  4. Emit heartbeat comments + health telemetry.

## 5. API and UI Integration
- Direct endpoint:
  - `GET /dashboard/market-stream/events`
- UI integration:
  - dashboard home live widgets.
  - runtime views requiring near-real-time ticker/candle updates.

## 6. Security and Risk Guardrails
- Dashboard auth boundary applies (`requireAuth` on dashboard router).
- Symbol filter limit prevents unbounded per-client subscriptions.
- SSE health events expose lag/connected state for client-side stale handling.

## 7. Observability and Operations
- Worker logs subscription/open/error events through stream logger contract.
- Gate.io polling logs per-symbol ticker/candle failures and continues polling
  other symbols without publishing malformed events.
- SSE health payload includes last-event timestamp and lag.
- Contract tests verify SSE format + symbol-limit validation.

## 8. Test Coverage and Evidence
- Primary tests:
  - `binanceStream.service.test.ts`
  - `exchangePollingStream.service.test.ts`
  - `marketStream.routes.contract.test.ts`
  - `marketStream.routes.e2e.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/market-stream/binanceStream.service.test.ts src/modules/market-stream/exchangePollingStream.service.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts src/modules/market-stream/marketStream.routes.e2e.test.ts
```

## 9. Open Issues and Follow-Ups
- Gate.io paper pricing capability remains disabled until runtime evidence
  proves the opt-in polling worker path in a target environment.
- Consider persistent fan-out/backpressure strategy if concurrency grows significantly.
