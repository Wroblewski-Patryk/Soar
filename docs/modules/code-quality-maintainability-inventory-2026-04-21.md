# Code Quality Maintainability Inventory

Date: 2026-04-22  
Wave: `SCALE-A` (inventory sync after `CQLT` + `L10NQ-E`)

## Purpose

Record the concrete offenders confirmed during the first CQLT execution slice so
future refactors can stay inventory-first and regression-locked.

## Web Local Copy and Hardcoded UI Inventory

Opening `CQLT` inventory confirmed production files with local copy ownership
or route-level hardcoded UI literals:

- `apps/web/src/context/AuthContext.tsx`
- `apps/web/src/app/(public)/page.tsx`
- `apps/web/src/features/profile/hooks/useApiKeys.ts`
- `apps/web/src/ui/components/ProfileButton.tsx`
- `apps/web/src/ui/components/ThemeSwitch.tsx`
- `apps/web/src/ui/layout/dashboard/PageTitle.tsx`
- `apps/web/src/features/backtest/components/backtestRunDetails.copy.ts`

Opening shared component exceptions:

- `apps/web/src/ui/components/ViewState.tsx`
- `apps/web/src/ui/forms/FormValidationSummary.tsx`
- `apps/web/src/features/backtest/components/BacktestCreateForm.tsx`
- `apps/web/src/features/backtest/components/BacktestRunDetails.tsx`

Resolution update:

- `CQLT-12..CQLT-14` removed local copy dictionaries from profile,
  strategies, and wallet form surfaces by moving them to canonical namespaces.
- `L10NQ-E` closed the residual route-reachable localization wave on
  `2026-04-21`; the former local-copy and shared-exception surfaces listed
  above now resolve through canonical namespaces or translation-backed shared
  helpers.
- final closure evidence for the residual wave is published in
  `docs/operations/l10nq-e-residual-route-reachable-i18n-closure-2026-04-21.md`
- `SCALE-02` guardrail-truth audit on 2026-04-22 confirmed these historical
  offenders no longer match active local-copy or hardcoded-literal patterns,
  so the corresponding allowlist exceptions were removed in `SCALE-03`.
- the only remaining temporary hardcoded-literal allowlist entry is
  `apps/web/src/features/backtest/components/BacktestCreateForm.tsx`
  (numeric input placeholders intentionally kept in component scope for now).

## Oversized Production Module Inventory

Current production modules above the staged decomposition threshold
(`1000` lines), measured on 2026-04-22:

- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx` (`1545`)
- `apps/web/src/features/backtest/components/BacktestRunDetails.tsx` (`1197`)

Historical opening hotspots now below threshold after `CQLT` decomposition:

- `apps/api/src/modules/orders/orders.service.ts` (`690`)
- `apps/web/src/features/bots/components/BotsManagement.tsx` (`865`)
- `apps/api/src/modules/bots/botsCommand.service.ts` (`780`)
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx` (`911`)
- `apps/api/src/modules/backtests/backtests.service.ts` (`896`)
- `apps/web/src/features/wallets/components/WalletCreateEditForm.tsx` (`538`)

Near-threshold seams worth watching next:

- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.service.ts`

## API Ownership and Fallback Inventory

Confirmed API hotspots for exchange bootstrap, fallback drift, or repeated
shared logic:

- `apps/api/src/modules/wallets/wallets.service.ts`
  `ccxt` bootstrap + base-currency fallbacks + metadata fallback response.
- `apps/api/src/modules/exchange/ccxtFuturesConnector.service.ts`
  `ccxt` bootstrap + symbol/order normalization fallback.
- `apps/api/src/modules/exchange/exchangeSymbolRules.service.ts`
  previously direct `ccxt` bootstrap (migrated in `SCALE-B` to canonical
  `exchangePublicRead.service.ts` boundary).
- `apps/api/src/modules/positions/positions.service.ts`
  previously direct authenticated `ccxt` bootstrap (migrated in `SCALE-B` to
  canonical `exchangeAuthenticatedRead.service.ts` boundary).
- `apps/api/src/modules/orders/orders.manualContext.service.ts`
  previously consumed symbol rules through connector-local lookup; now
  delegated to canonical metadata contract (`exchangeMetadataContract.service.ts`).
- `apps/api/src/modules/wallets/wallets.service.ts`
  previously owned market metadata + authenticated balance preview bootstrap in
  module-local logic; now delegated to canonical metadata and authenticated
  read boundaries.
- `apps/api/src/middleware/rateLimit.ts`
  Redis fail-open to in-memory limiter.
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
  runtime reference-balance fallback path.
- `apps/api/src/modules/orders/orders.service.ts`
  fallback API-key lookup and live order status fallback behavior.
- `apps/api/src/modules/bots/runtimeMarketDataFallback.service.ts`
  runtime fallback market-data cache ownership.
- `apps/api/src/lib/symbols.ts`
  canonical `USDT` fallback normalization.

## Fallback Classification Matrix

Allowed and permanent:

- `apps/api/src/lib/symbols.ts`
  canonical `USDT` symbol normalization for symbol parsing compatibility.
- `apps/api/src/modules/orders/orders.service.ts`
  compatible fallback from exchange-reported live order status to order-type
  semantics (`MARKET -> FILLED`, otherwise `OPEN`) when venue status is absent.

Temporary compatibility bridges:

- `apps/api/src/modules/orders/orders.service.ts`
  fallback API-key lookup by exchange when a LIVE bot has no matching
  wallet-bound API key; keep until all LIVE wallet/bot paths are guaranteed to
  own canonical API-key binding.
- `apps/api/src/middleware/rateLimit.ts`
  Redis-unavailable failover to in-memory limiter for local/offline safety.
- `apps/api/src/modules/backtests/backtestRange.service.ts`
  base-currency inference from symbol suffix when no market-universe context is
  present for legacy single-symbol backtests.

Forbidden in critical or ownership-sensitive paths:

- hidden base-currency inference for bot command validation
- wallet-context assumptions when updating bot market-group ownership
- silent market-universe compatibility guesses during bot write flows

Resolution evidence:

- `CQLT-31` removed the hidden `USDT` fallback from `botsCommand.service`
  update-path validation; bot updates now fail closed with explicit
  `walletNotFound` when wallet context is unresolved instead of inferring a
  synthetic base currency.

## Legacy Bridge Sunset Freeze

Compatibility-only bridges that remain intentional after `CQLT`:

- `apps/api/src/modules/orders/orders.service.ts`
  wrapper around `getManualOrderContextService` preserves test-mode
  deterministic connector stubbing for the historical manual-order contract.
- `apps/api/src/modules/backtests/backtestRange.service.ts`
  `resolveEffectiveMaxCandlesFromSeed` still reads legacy `maxCandles` from
  persisted seed config while newer runs store `requestedMaxCandles` and
  `effectiveMaxCandles`.
- `apps/api/src/modules/orders/orders.service.ts`
  LIVE API-key fallback lookup remains temporary until wallet-owned API-key
  binding is universal across migrated LIVE bot flows.

Sunset rule:

- new compatibility bridges require explicit inventory entry plus queue item;
  undocumented legacy fallbacks are now considered forbidden maintainability
  debt.

## Duplicate Shared Helper Snapshot

Canonical snapshot artifact:

- `docs/modules/_artifacts-cqlt-duplicate-helper-snapshot-2026-04-21.json`

Tracked seam families:

- DCA ladder and summary formatting across dashboard and bots monitoring
- runtime badge/status formatting across dashboard and bots runtime views
- async load-error-retry state choreography across profile/strategies/wallets

## Extraction Order Freeze

1. Migrate shared i18n/error helpers in `AuthContext` and profile/strategies
   surfaces.
2. Extract shared dashboard/bots formatting helpers.
3. Split web monoliths behind focused UI regressions.
4. Split API monoliths after shared helper and adapter boundaries are explicit.
