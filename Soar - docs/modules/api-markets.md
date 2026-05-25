# API Deep-Dive: Markets Module

## Metadata
- Module name: `markets`
- Layer: `api`
- Source path: `apps/api/src/modules/markets`
- Owner: backend/trading-domain
- Last updated: 2026-05-14
- Related planning task: `POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14`

## Canonical Architecture Linkage
Canonical market-scope and context rules live in:
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/05_strategy-signal-and-decision-flow.md`

## 1. Purpose and Scope
- Owns market universe CRUD and exchange market catalog read APIs.
- Resolves effective symbol sets using one canonical composition contract:
  - `final = unique(filter_result U whitelist) - blacklist`.
- Ensures market universes cannot be mutated while tied to active bot execution paths.
- Blocks market-universe deletion while owned backtest history still references
  the universe through the run seed, because new backtests preserve immutable
  creation-time universe context.

Out of scope:
- Bot runtime orchestration and signal evaluation.
- Wallet account lifecycle.

## 2. Boundaries and Dependencies
- Mounted under `/dashboard/markets`.
- Depends on:
  - `prisma` for `marketUniverse` and related symbol-group updates.
  - exchange capability guard (`MARKET_CATALOG`).
  - symbol normalization helpers (`resolveUniverseSymbols`).
  - Binance public catalog and ticker enrichment path (with test fallback data).

## 3. Data and Contract Surface
- Universe contracts:
  - `CreateMarketUniverseDto`
  - `UpdateMarketUniverseDto`
- Input normalization contract:
  - `baseCurrency` is normalized to uppercase at the DTO boundary.
  - `whitelist` and `blacklist` entries are trimmed, normalized to uppercase,
    deduped, and keep the operator-provided first occurrence order.
- Canonical symbol-composition edge rules:
  - `filter_result` exists only when `minQuoteVolumeEnabled=true`.
  - `filter off + empty whitelist` => empty result.
  - blacklist-only input does not add symbols.
  - blacklist always subtracts from the final set.
- Catalog contract includes:
  - `exchange`, `marketType`, `baseCurrency`, `baseCurrencies`, `markets[]`.
- Guardrails:
  - active-bot usage block for updates/deletes (`MARKET_UNIVERSE_USED_BY_ACTIVE_BOT`).
  - historical backtest usage block for deletes (`MARKET_UNIVERSE_LINKED_RECORDS`).

## 4. Runtime Flows
- Catalog flow:
  1. Assert exchange capability.
  2. Resolve cached or fresh catalog entries.
  3. Select effective base currency.
  4. Return filtered/sorted market list.
- Universe update flow:
  1. Validate ownership.
  2. Ensure not used by active bot.
  3. Persist universe.
  4. Sync dependent symbol-group symbols through the shared contract resolver.
- Universe delete flow:
  1. Validate ownership.
  2. Ensure not used by active bot.
  3. Ensure no owned backtest history references `seedConfig.marketUniverseId`.
  4. Delete dependent inactive symbol-group/bot-market links in one transaction.

## 5. API and UI Integration
- Routes:
  - `GET /dashboard/markets/universes`
  - `GET /dashboard/markets/universes/:id`
  - `GET /dashboard/markets/catalog`
  - `POST /dashboard/markets/universes`
  - `PUT /dashboard/markets/universes/:id`
  - `DELETE /dashboard/markets/universes/:id`

## 6. Security and Risk Guardrails
- Dashboard auth + ownership isolation for all universe operations.
- Capability assertion fails closed for unsupported exchanges.
- Active-runtime guardrail prevents mutation drift against running bots.
- Backtest-history guardrail preserves simulation auditability after universe
  edits/deletes.

## 7. Observability and Operations
- Catalog fetch has in-memory cache and fallback behavior.
- Public-market fetch failures degrade to cached/test fixtures instead of hard outage.

## 8. Test Coverage and Evidence
- Primary test:
  - `apps/api/src/modules/markets/markets.e2e.test.ts`
- 2026-05-14 snapshot-history proof:
  - `markets.e2e.test.ts` verifies universe deletion returns `409` while owned
    historical backtest runs reference the universe.
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/markets/markets.e2e.test.ts
```

## 9. Open Issues and Follow-Ups
- Keep all new market-universe consumers on the shared resolver path to avoid contract drift.
- Evaluate stronger metadata telemetry for catalog source freshness.
