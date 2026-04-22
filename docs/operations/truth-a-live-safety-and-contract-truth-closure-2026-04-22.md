# TRUTH-A Closure Evidence (2026-04-22)

Status: Closed
Wave: `TRUTH-A`

## Objective

Close the remaining false-safety and false-contract drift after `SCALE`:

- LIVE orders must resolve credentials from canonical bot or wallet ownership
  only
- authenticated exchange-read routes must expose truthful support and source
  semantics
- web guardrails must catch the literal JSX and presenter patterns operators
  really see

## Delivered

### LIVE Order Safety

- Removed the forbidden fallback from LIVE order execution that previously
  selected the most recent user API key on the same exchange.
- `resolveLiveExecutionApiKey` now resolves credentials only from:
  - canonically bot-bound API key
  - canonically wallet-bound API key
- Missing canonical ownership now fails closed with the existing explicit
  `LIVE_API_KEY_REQUIRED` domain error.

### Authenticated Exchange-Read Truth

- Added canonical authenticated read contract boundary in
  `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`.
- Declared support truth explicitly per operation family:
  - `BALANCE_PREVIEW`
  - `POSITIONS_SNAPSHOT`
  - `OPEN_ORDERS_SNAPSHOT`
- Current truth is explicit and fail-closed:
  - `BINANCE`: supported
  - `BYBIT`, `OKX`, `KRAKEN`, `COINBASE`: unsupported
- Wallet balance preview and positions/open-orders snapshot flows now derive
  `source` from actual exchange ownership instead of hardcoded `BINANCE`.
- Unsupported authenticated read combinations now return explicit
  `EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED` details instead of pretending
  generic exchange support.
- Removed double-decrypt drift from wallet balance preview so shared
  authenticated connectors own decryption exactly once.

### Web Guardrail Truth

- Hardened `scripts/repoGuardrails.mjs` and
  `apps/web/src/i18n/guardrails.test.ts` to detect:
  - JSX prop literals such as `*Label`, `*Title`, `*Description`,
    `*Placeholder`, `*Hint`, `*Text`, `emptyText`
  - nullish string fallbacks on `origin`, `source`, `status`, `reason`
- Removed runtime-dashboard literal leaks by moving action/origin/strategy
  labels in `HomeLiveWidgets` and runtime helper pills to canonical i18n keys.
- Closed newly surfaced shared-ui debt by making `ConfirmModal`, `DataTable`,
  and `SearchableMultiSelect` i18n-ready through canonical `public.sharedUi.*`
  defaults.

## Validation

- `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/wallets/wallets.e2e.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts` PASS
- `pnpm --filter web exec vitest run src/i18n/guardrails.test.ts` PASS
- `pnpm run quality:guardrails` PASS
- `pnpm --filter api run build` PASS
- `pnpm --filter web run build` PASS
- `pnpm run typecheck` PASS

## Follow-On Rule

Future agents must treat:

- LIVE execution credential ownership,
- authenticated exchange-read support truth,
- and shared UI default copy ownership

as frozen contracts. No new fallback, placeholder exchange claim, or shared UI
literal may be introduced without updating the canonical contract and queue in
the same change.
