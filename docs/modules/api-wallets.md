# API Deep-Dive: Wallets Module

## Metadata
- Module name: `wallets`
- Layer: `api`
- Source path: `apps/api/src/modules/wallets`
- Owner: backend/trading-domain
- Last updated: 2026-05-09
- Related planning task: `RUNTIME-AUDIT-22`

## Canonical Architecture Linkage
Canonical wallet and execution-context rules live in:
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/10_safety-entitlements-and-risk.md`

## 1. Purpose and Scope
- Owns wallet lifecycle and balance preview APIs for dashboard trading setup.
- Provides canonical wallet context (mode, exchange, market type, base currency, allocation, apiKey) used by bots.
- Wallet creation is the required prerequisite step before creating a bot.

Out of scope:
- API key storage lifecycle (profile api-keys module).
- Runtime order execution flow (orders/engine/exchange modules).

## 2. Boundaries and Dependencies
- Mounted under `/dashboard/wallets`.
- Depends on:
  - Prisma wallet and bot relations.
  - exchange capability guards (`LIVE_EXECUTION`, `PAPER_PRICING_FEED`, market type/base currency support).
  - market catalog integration for metadata enrichment.
  - encrypted API key decryption and authenticated exchange balance fetch for
    preview.

## 3. Data and Contract Surface
- Command contracts:
  - `CreateWalletSchema`, `UpdateWalletSchema`
  - mode-dependent validation for LIVE allocation + apiKey binding
- Query contracts:
  - `ListWalletsQuerySchema`
  - `WalletMetadataQuerySchema`
  - `WalletBalancePreviewSchema`
  - `WalletAnalyticsQuerySchema` validates `source` against the canonical
    `WalletCashflowSource` enum and rejects inverted `from`/`to` date ranges
    at the API boundary.
- Key invariants:
  - LIVE wallet requires compatible API key from same exchange.
  - mode/exchange must be supported by capability map.
  - Gate.io public `PAPER` wallet create/update is allowed through
    `PAPER_PRICING_FEED`; Gate.io `LIVE` wallet create/update remains
    fail-closed while `LIVE_EXECUTION` is unsupported.
  - Gate.io stored API keys may be used for wallet balance preview through the
    authenticated-read boundary. Gate.io `LIVE` wallet create/update remains
    fail-closed while `LIVE_EXECUTION` is unsupported.
  - wallet cannot be deleted when linked bot exists.
- WAPR contract lock (implemented):
  - list payload remains source for table inline API key status mapping (`apiKeyId` presence).
  - dedicated paper reset command is canonical contract (`POST /dashboard/wallets/:id/reset-paper`), separate from generic wallet update.
  - paper reset is non-destructive and reset-baseline aware via wallet checkpoint (`paperResetAt`).
  - reset guards are fail-closed (`PAPER`-only, owned wallet only, blocked when open paper positions or active paper open orders exist).
- V1CAP contract lock (implemented):
  - shared capital-allocation mapping is reused by wallet preview and runtime capital snapshot paths (no duplicated percent/fixed logic).
  - runtime/operator read models expose capital-source truth explicitly (`PAPER_INITIAL_BALANCE`, `PAPER_RESET_CHECKPOINT`, `LIVE_EXCHANGE_BALANCE`) together with allocation metadata and `paperResetAt`.
  - `LIVE` balance preview and runtime both treat refreshed authenticated exchange balance as the authority after deposits.

## 4. Runtime Flows
- Create/update wallet flow:
  1. Normalize and validate payload.
  2. Enforce exchange capability for selected mode.
  3. Enforce LIVE api-key ownership and exchange compatibility.
  4. Persist wallet with normalized base currency and allocation fields.
- Metadata flow:
  1. Resolve supported market types for exchange.
  2. Fetch market catalog when available.
  3. Return per-marketType base currency options with fallback source marker.
- Preview balance flow:
  1. Validate owned API key for user+exchange.
  2. Decrypt credentials and fetch exchange balance snapshot.
  3. Compute reference balance using allocation mode/value.
  4. Return preview payload with source and fetched timestamp.
- Paper reset flow:
  1. Validate wallet ownership and `PAPER` mode.
  2. Verify no open paper positions and no active paper open orders.
  3. Persist reset checkpoint for paper capital baseline (`paperResetAt`), without deleting history rows.
  4. Return deterministic success payload for caller refresh.
- Runtime/read-model capital flow:
  1. Resolve one runtime capital snapshot from wallet mode, wallet checkpoint, authenticated exchange balance, and reserved margin.
  2. Keep `PAPER` active capital scoped to wallet baseline + realized PnL since `paperResetAt`.
  3. Keep `LIVE` active capital exchange-authoritative and then map it through allocation mode/value.
  4. Return explicit capital-source/allocation/reset metadata to monitoring read models.
- Wallet performance open-PnL flow:
  1. Aggregate direct selected-wallet open positions by `userId + walletId`.
  2. For `LIVE` wallets with an API key, also aggregate imported open
     positions with `walletId=null`, `origin=EXCHANGE_SYNC`, and `externalId`
     prefixed by the selected wallet API key id.
  3. Keep another user's, another API key's, or unlinked imported positions
     excluded from wallet performance summary.
  4. Reuse the same scope for the latest overall wallet snapshot point's
     current `botOpenPnl` / `botPnl` fields.
  5. Earlier timeline points, including the last point in a filtered historical
     response, remain historical snapshot/cashflow points and must not receive
     current open PnL without persisted historical evidence.
  6. Do not alter wallet balance snapshots, cashflow events, or equity
     timeline markers from this derived open-PnL read.

## 5. API and UI Integration
- Representative routes:
  - `GET /dashboard/wallets`
  - `GET /dashboard/wallets/metadata`
  - `POST /dashboard/wallets/preview-balance`
  - `GET /dashboard/wallets/:id`
  - `POST /dashboard/wallets`
  - `PUT /dashboard/wallets/:id`
  - `DELETE /dashboard/wallets/:id`
  - `POST /dashboard/wallets/:id/reset-paper`
- Rate limits:
  - read: 120/min
  - write: 40/min
  - preview-balance: 20/min (user+exchange scoped)

## 6. Security and Risk Guardrails
- Auth required for all wallet endpoints.
- Strong input validation for LIVE mode and allocation fields.
- LIVE preview requires owned encrypted API key and exchange match.
- Delete protection prevents orphan bot references and unsafe teardown.
- Paper reset contract is explicitly fail-closed and mode-bound:
  - no reset for `LIVE`,
  - no reset when paper execution scope is still open (`positions`/`orders`).

## 7. Observability and Operations
- Preview path updates `apiKey.lastUsed` for operational traceability.
- Metadata responses declare source (`MARKET_CATALOG` vs `EXCHANGE_CAPABILITIES`) for fallback diagnostics.

## 8. Test Coverage and Evidence
- Primary tests:
  - `wallets.e2e.test.ts`
  - `runtimeCapitalContext.service.test.ts` (capital-baseline parity scope)
  - `bots.monitoring-aggregate.e2e.test.ts` (runtime monitoring capital-source parity)
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts
```

## 9. Open Issues and Follow-Ups
- Expand positions/open-orders/trade-history support beyond Binance as
  exchange adapters mature.
- Add explicit audit log entries for wallet create/update/delete events.
