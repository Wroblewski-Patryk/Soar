# API Deep-Dive: Positions Module

## Metadata
- Module name: `positions`
- Layer: `api`
- Source path: `apps/api/src/modules/positions`
- Owner: backend/trading-domain
- Last updated: 2026-05-08
- Related planning task: `RUNTIME-AUDIT-23`

## 1. Purpose and Scope
- Owns position read and external reconciliation surfaces for dashboard operations.
- Provides:
  - list/get position APIs
  - live reconciliation status
  - exchange snapshot fetch
  - takeover status classification and rebind entrypoint
  - management mode switch endpoint

Out of scope:
- Order command lifecycle (orders module).
- Strategy signal execution decisions (engine).

## 2. Boundaries and Dependencies
- Mounted under `/dashboard/positions`.
- Depends on:
  - `prisma` position/order/apiKey persistence.
  - CCXT Binance snapshots for external positions/open orders.
  - live reconciliation service and takeover classification helpers.

## 3. Data and Contract Surface
- Contracts include:
  - `ListPositionsQuerySchema`
  - `ExternalTakeoverStatusResponse`
  - `ExchangePositionSnapshot` / `ExchangeOpenOrderSnapshot`
  - management mode update payloads.
- List/read contract:
  - dashboard `symbol` filters are trimmed and normalized to uppercase at the
    DTO boundary before Prisma filters are built.
- Status model:
  - `OWNED_AND_MANAGED`, `UNOWNED`, `AMBIGUOUS`, `MANUAL_ONLY`.
- Error contract:
  - `ExchangeSnapshotError` with explicit code categories.

## 4. Runtime Flows
- Snapshot flow:
  1. Resolve usable API key.
  2. Enforce exchange operation capability before any test fallback or
     connector call.
  3. Fetch external positions/open orders.
  4. Normalize payload shape.
  5. Update `lastUsed` metadata for key only after a supported snapshot read.
- Gate.io stored keys may exist as placeholders, but explicit
  `apiKeyId` snapshot reads fail closed with
  `EXCHANGE_EXECUTION_CAPABILITY_UNSUPPORTED` while `POSITIONS_SNAPSHOT` is
  disabled; `lastUsed` remains unchanged on rejection.
- Takeover status flow:
  - classify open exchange-synced positions by ownership/management/sync-state.
  - canonical management truth is wallet-owned:
    - `apiKey.syncExternalPositions` enables external snapshot ingestion,
    - `wallet.manageExternalPositions` enables `BOT_MANAGED` takeover,
    - API-key-level `manageExternalPositions` is compatibility-only and must
      not decide takeover ownership.
- Rebind flow:
  - attempts deterministic rebind of candidate external positions to owned bot context.
- Local orphan repair flow:
  - scans open local `BOT` / `USER` positions without `botId`,
  - matches candidate bots through active enabled canonical
    `BotMarketGroup.symbolGroup` rows before direct legacy `Bot.symbolGroup`,
  - resolves repaired `strategyId` from existing position provenance or a
    single enabled canonical `MarketGroupStrategyLink`,
  - uses direct `Bot.symbolGroup` / `Bot.strategyId` only as compatibility
    fallback for legacy bots without active canonical market groups,
  - leaves ambiguous strategy provenance unresolved instead of guessing.
- LIVE reconciliation continuity flow:
  - resolves recovered/imported bot continuity context from active canonical
    `BotMarketGroup` and enabled `MarketGroupStrategyLink` rows before direct
    legacy `Bot.strategyId`,
  - uses direct strategy only as compatibility fallback when canonical
    topology is unavailable.
  - `RUNTIME-AUDIT-03` revalidated this continuity contract while closing the
    shared bot update-scope helper edge where canonical topology without
    enabled links must stay non-actionable instead of falling back to legacy
    strategy ids.

## 5. API and UI Integration
- Routes:
  - `GET /dashboard/positions`
  - `GET /dashboard/positions/:id`
  - `GET /dashboard/positions/live-status`
  - `GET /dashboard/positions/exchange-snapshot`
  - `GET /dashboard/positions/takeover-status`
  - `POST /dashboard/positions/takeover-rebind`
  - `PATCH /dashboard/positions/:id/management-mode`

## 6. Security and Risk Guardrails
- Dashboard auth boundary + user ownership checks.
- Exchange snapshot fetch uses decrypted key in-process only.
- Management/takeover flows preserve explicit managed/manual state boundaries.

## 7. Observability and Operations
- Reconciliation/takeover correctness covered by dedicated e2e + service tests.
- Snapshot route has deterministic test-mode fallback responses.

## 8. Test Coverage and Evidence
- Primary tests:
  - `livePositionReconciliation.service.test.ts`
  - `positions.service.test.ts`
  - `positions-live-status.e2e.test.ts`
  - `positions.exchangeSnapshot.e2e.test.ts`
  - `positions.takeover-status.e2e.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/positions/positions.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions-live-status.e2e.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts --run --sequence.concurrent=false
```

## 9. Open Issues and Follow-Ups
- Continue hardening takeover ambiguity handling as additional exchanges are enabled.
- Align error taxonomy with typed API-level mapping strategy.
