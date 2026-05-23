# Markets And Strategy Configuration Audit - 2026-05-19

## Metadata

| Field | Value |
| --- | --- |
| Audit ID | `AUD-15` |
| Registry family | Markets And Strategy Configuration |
| Stage | verification |
| Environment | local |
| Status | current local / current historical production-safe fixture proof |
| Production journey | not run |
| LIVE exchange mutation | not run |
| Exchange-side mutation | not run |
| Existing production data mutation | not run |

## Scope

This audit compares current market-universe and strategy configuration behavior
with the documented architecture/module contracts for:

- market universe CRUD, ownership, catalog import, and capability behavior,
- canonical symbol composition:
  `final = unique(filter_result U whitelist) - blacklist`,
- active-bot and historical-backtest mutation guards,
- strategy CRUD, import/export, clone payload, and config validation,
- indicator catalog, taxonomy, and presentation parity,
- inactive-bot safe edits and active-bot lock UI,
- Web route shells and form/table state behavior.

Canonical references:

- `docs/analysis/reusable-audit-registry.md`
- `docs/modules/api-markets.md`
- `docs/modules/web-markets.md`
- `docs/modules/api-strategies.md`
- `docs/modules/web-strategies.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

## Evidence Run

| Proof | Result | Evidence |
| --- | --- | --- |
| Focused Web markets/strategies pack | PASS | `corepack pnpm --filter web exec vitest run src/app/dashboard/markets/list/page.test.tsx src/app/dashboard/markets/create/page.test.tsx src/app/dashboard/markets/[id]/edit/page.test.tsx src/features/markets/components/MarketUniversesTable.test.tsx src/features/markets/components/MarketUniverseForm.test.tsx src/app/dashboard/strategies/list/page.test.tsx src/app/dashboard/strategies/create/page.test.tsx src/app/dashboard/strategies/[id]/page.test.tsx src/app/dashboard/strategies/[id]/edit/page.test.tsx src/features/strategies/components/StrategiesList.test.tsx src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/components/StrategyPresetPicker.test.tsx src/features/strategies/components/StrategyFormSections/Indicators.test.tsx src/features/strategies/presets/strategyPresets.test.ts src/features/strategies/utils/StrategyForm.map.test.ts src/features/strategies/utils/strategyNumericInput.test.ts src/features/strategies/utils/strategyCloseValidation.test.ts src/features/strategies/utils/indicatorPresentation.test.ts src/features/strategies/utils/indicatorTaxonomy.test.ts`; `19` files, `60` tests. |
| Focused API markets/strategies pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts src/modules/strategies/strategies.e2e.test.ts src/modules/strategies/strategyConfigValidation.test.ts src/modules/strategies/indicators/indicators.service.test.ts`; `4` files, `35` tests. |
| Local DB/Redis lifecycle | PASS | `corepack pnpm run go-live:infra:up` before DB-backed API tests and `corepack pnpm run go-live:infra:down` after proof. |

## Architecture-To-Code Parity

| Contract Area | Current Implementation Truth | Parity |
| --- | --- | --- |
| Market routes | API docs and router surface list/create/get/update/delete universe routes plus catalog. Web docs and tests cover list/create/edit route shells. | aligned |
| Symbol composition | API and Web tests cover whitelist/blacklist composition, empty result behavior, and preview parity with the canonical formula. | aligned |
| Catalog behavior | API tests cover Binance/Gate.io catalog behavior, placeholder persistence, and explicit not-implemented catalog response for unsupported catalog paths. | aligned |
| Active-bot market guards | API tests cover active bot update/delete blocking, inactive PAPER/LIVE edit allowance, deactivation-through-bot-API edits, stale legacy links, active primary bot drift blocking, and ownership isolation. | aligned |
| Backtest history guard | Module docs define delete blocking when historical backtests reference a universe; existing 2026-05-14 snapshot-history proof remains the accepted historical evidence. | aligned, not rerun in this focused pack |
| Strategy CRUD/import/export | API strategy e2e covers CRUD, export/import package contracts, invalid import rejection, ownership isolation, and active/inactive bot guards. | aligned |
| Strategy config validation | API unit tests and Web form tests cover advanced TSL validation, DCA reachability/reordered validation, zero lifetime, numeric normalization, and close validation helpers. | aligned |
| Indicator registry/presentation | API indicator service test and Web indicator taxonomy/presentation/section tests cover catalog parity and deterministic form rendering. | aligned |
| Web active-bot recovery | Strategy edit route tests cover allowed inactive linked-bot submit and active-bot lock rendering with recovery action. | aligned |

## Findings

| ID | Severity | Status | Finding | Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| `AUD-MKTSTR-004` | P1 | open freshness follow-up | Fresh production-safe market/strategy fixture proof was not rerun. Historical disposable market/strategy fixture evidence remains accepted for the 2026-05-14 deployment target. | `history/evidence/prod-fixture-action-proof-457bce05-2026-05-14.md`; this audit's local Web/API packs. | Refresh production-safe disposable fixture proof after future deployments. |
| `AUD-MKTSTR-005` | P2 | documented follow-up | Market docs still call for stronger metadata telemetry for catalog source freshness. | `docs/modules/api-markets.md` section 9. | Track as observability follow-up, especially before treating catalog freshness as an operator-facing SLO. |
| `AUD-MKTSTR-006` | P2 | documented follow-up | Strategy docs still call for migrating string-based error signaling to typed domain errors and keeping indicator catalog synchronized with Web presentation contracts. Current tests prove behavior but not that migration. | `docs/modules/api-strategies.md` section 9; focused strategy tests. | Plan typed strategy domain errors and keep indicator parity tests in the audit pack. |
| `AUD-MKTSTR-007` | P3 | documented UX follow-up | Web strategy docs still list remaining full i18n coverage and richer dirty-state/conflict handling as follow-ups. | `docs/modules/web-strategies.md` section 9. | Track under UX/i18n/product polish audits rather than runtime correctness. |

## Result

`AUD-15` is current locally for market-universe composition, catalog behavior,
market and strategy CRUD, active-bot guards, strategy import/export/config
validation, indicator registry parity, and Web market/strategy route/form/table
states.

No code behavior was changed. No production journey, LIVE mutation,
exchange-side mutation, or existing production data mutation was performed.
