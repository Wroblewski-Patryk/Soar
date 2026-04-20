# API Deep-Dive: Orders Module

## Metadata
- Module name: `orders`
- Layer: `api`
- Source path: `apps/api/src/modules/orders`
- Owner: backend/trading-domain
- Last updated: 2026-04-20
- Related planning task: `UOLF-01`

## Canonical Architecture Linkage
Canonical order and lifecycle rules live in:
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/10_safety-entitlements-and-risk.md`

## 1. Purpose and Scope
- Owns order read + command API:
  - list/get orders
  - open/cancel/close commands
- Bridges command path between PAPER simulation and LIVE exchange side effects.
- Applies pre-trade symbol constraints and optional leverage/margin convergence for LIVE.

Out of scope:
- Signal generation and strategy evaluation.
- Position ownership reconciliation domain logic (positions module).

## 2. Boundaries and Dependencies
- Mounted under `/dashboard/orders`.
- Depends on:
  - `prisma` order persistence.
  - exchange connector/adapter (`CcxtFuturesConnector`, `LiveOrderAdapter`).
  - encrypted API-key resolution and bot LIVE context validation.
  - env-driven pretrade cache/convergence controls.

## 3. Data and Contract Surface
- Input DTOs:
  - `OpenOrderDto`, `CancelOrderDto`, `CloseOrderDto`, list query DTO.
- Output:
  - persisted order records with LIVE metadata (exchange order ids/fills/fees where available).
- LIVE invariants:
  - requires `riskAck`, LIVE bot mode, active opt-in, compatible API key.
  - enforces symbol trading rules and quantity/notional checks.

## 4. Runtime Flows
- Open order:
  1. Validate payload and mode context.
  2. For LIVE, resolve bot + API key + connector rules.
  3. Optionally converge leverage/margin mode.
  4. Place order via live adapter with retries + fee reconciliation.
  5. Persist normalized order state.
- Cancel/close:
  - resolve ownership and apply lifecycle transition with optional LIVE side effect.

## 5. API and UI Integration
- Routes:
  - `GET /dashboard/orders`
  - `GET /dashboard/orders/:id`
  - `POST /dashboard/orders/open`
  - `POST /dashboard/orders/:id/cancel`
  - `POST /dashboard/orders/:id/close`

## 6. Security and Risk Guardrails
- Auth + ownership checks on every route.
- LIVE execution requires explicit risk acknowledgement.
- Strict mode toggles can fail closed when leverage/margin convergence fails.

## 7. Observability and Operations
- Exchange attempt/retry/failure metrics emitted through adapter path.
- Caches for symbol rules/exposure/convergence reduce repetitive exchange calls.
- Contract/e2e tests cover order-position interactions.

## 8. Test Coverage and Evidence
- Primary tests:
  - `orders.service.test.ts`
  - `orders-positions.e2e.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts
```

## 9. Open Issues and Follow-Ups
- Continue typed-error migration to replace message-based branching.
- Review cache invalidation strategy under high-frequency LIVE execution load.

## 10. Manual-Order Context Contract Freeze (`UXR-H-01`)
- Contract purpose:
  - provide one API source-of-truth payload for dashboard manual-order context and min-executable quantity guidance.
- Write-path invariants:
  - `POST /dashboard/orders/open` remains canonical write command for manual orders,
  - risk-ack and existing pretrade/exchange guards remain unchanged.
- Frozen read contract target (`UXR-H-02` implementation scope):
  - selected `botId + symbol` context endpoint returns:
    - resolved `orderType` (explicit fallback `MARKET` when unresolved),
    - resolved `marginMode`,
    - resolved `leverage`,
    - current market reference price,
    - quantity constraints (`minAmount`, precision step, `minNotional`, `minExecutableQty`),
    - optional side-aware summary primitives for web rendering.
- Guardrails:
  - context endpoint is read-only and does not place/modify orders,
  - web must render API constraints, not duplicate exchange-rule formulas independently.

## 11. Unified Manual and Bot Order Lifecycle Contract (`UOLF-01`)
- Contract status:
  - supersedes `SOPR-C` `order-only` semantics as canonical target contract.
  - implementation rollout is tracked in `UOLF-02..UOLF-15`.
- Canonical lifecycle:
  - `entry intent -> order created -> order status evolves -> fill confirmed -> position opened/updated`.
- Command-path invariants:
  - `POST /dashboard/orders/open` remains canonical manual-entry write path.
  - command path must not open positions directly.
  - position lifecycle authority is downstream fill handling only.
- Fill-authority invariants:
  - `LIVE`: exchange fill/sync evidence is authority for position-open visibility.
  - `PAPER`: paper fill adapter/engine is authority for position-open visibility.
  - position-open transition requires a resolved positive fill price.
  - unresolved fill price keeps order in waiting lifecycle state (no synthetic `entryPrice=0` position creation).
- Context and scope invariants:
  - selected-bot context is strict for mode/wallet/strategy attribution.
  - when `botId` is provided, server-side canonical bot context is authoritative for order lifecycle ownership.
  - manual and runtime opens converge to one lifecycle authority (no divergent write semantics).
  - runtime/open orchestration forwards `markPrice` into `POST /dashboard/orders/open` MARKET payload to preserve fill-price integrity.
- Operator diagnostics contract:
  - API/web must support explicit lifecycle state communication:
    - submitted,
    - waiting_for_fill,
    - filled,
    - position_opened,
    - imported_from_exchange,
    - blocked.
- Guardrails:
  - no cross-bot or cross-mode leakage in write/read paths.
  - no return to `order-only` operator semantics in canonical docs after this contract freeze.

## 12. Manual-Order Strategy Context Symbol Contract (`MURC`)
- Manual-order context strategy matching that depends on market-universe-backed symbols must use the shared formula:
  - `final = unique(filter_result U whitelist) - blacklist`.
- Edge rules:
  - if filter is disabled and whitelist is empty, symbol set is empty,
  - blacklist-only configuration cannot introduce symbols.
- Parity requirement:
  - manual-order symbol matching remains consistent with bots runtime and backtests for the same universe input.

## 13. Open Orders Source and Active-Only Contract (`OOSC`)
- Source-label contract for dashboard Open Orders rows:
  - `USER -> Manual`,
  - `BOT -> Bot`,
  - `EXCHANGE_SYNC -> Imported`,
  - `BACKTEST -> Imported` (defensive fallback).
- Write-side contract:
  - manual dashboard open-order command (`POST /dashboard/orders/open`) persists explicit `origin=USER` and follows unified `UOLF` lifecycle semantics.
- Read-side contract:
  - runtime open-orders payload consumed by dashboard includes per-row `origin`.
- Implementation note (2026-04-20):
  - manual open-order write path (`orders.service.openOrder`) persists explicit `origin=USER`,
  - runtime open-orders read projection includes `origin` for both session and aggregate monitoring responses.
- Active-only guardrail (unchanged):
  - Open Orders response scope remains limited to:
    - `PENDING`,
    - `OPEN`,
    - `PARTIALLY_FILLED`.
- Scope lock:
  - no new orders-history table in this wave.
