# Task: Markets And Strategy Configuration Audit - 2026-05-19

## Context

The user requested reusable layer-by-layer discrepancy audits between the
application implementation and architecture/module descriptions. `AUD-15`
covers market-universe composition, catalog behavior, strategy CRUD/import/
export, config validation, indicator registry, and active-bot guards.

## Goal

Refresh `AUD-15` with current local evidence and record implementation vs
architecture/documentation discrepancies without changing runtime behavior.

## Scope

- `docs/analysis/reusable-audit-registry.md`
- `docs/modules/api-markets.md`
- `docs/modules/web-markets.md`
- `docs/modules/api-strategies.md`
- `docs/modules/web-strategies.md`
- `apps/api/src/modules/markets/**`
- `apps/api/src/modules/strategies/**`
- `apps/web/src/features/markets/**`
- `apps/web/src/features/strategies/**`
- `apps/web/src/app/dashboard/markets/**`
- `apps/web/src/app/dashboard/strategies/**`

## Constraints

- No production journey.
- No LIVE order/cancel/close.
- No exchange-side mutation.
- No existing production data mutation.
- Keep repository artifacts in English.

## Definition Of Done

- Focused Web markets/strategies proof is run and recorded.
- Focused API markets/strategies proof is run and recorded.
- Architecture-to-code parity is summarized.
- Open gaps are recorded with stable IDs.
- Local DB/Redis infra is stopped after DB-backed tests.
- A reusable Markdown and JSON audit artifact exists.

## Forbidden

- Do not change product behavior during the audit.
- Do not perform LIVE-money or exchange-side mutation.
- Do not overclaim production freshness from local tests.

## Result Report

Completed on 2026-05-19.

Validation:

- `corepack pnpm --filter web exec vitest run src/app/dashboard/markets/list/page.test.tsx src/app/dashboard/markets/create/page.test.tsx src/app/dashboard/markets/[id]/edit/page.test.tsx src/features/markets/components/MarketUniversesTable.test.tsx src/features/markets/components/MarketUniverseForm.test.tsx src/app/dashboard/strategies/list/page.test.tsx src/app/dashboard/strategies/create/page.test.tsx src/app/dashboard/strategies/[id]/page.test.tsx src/app/dashboard/strategies/[id]/edit/page.test.tsx src/features/strategies/components/StrategiesList.test.tsx src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/components/StrategyPresetPicker.test.tsx src/features/strategies/components/StrategyFormSections/Indicators.test.tsx src/features/strategies/presets/strategyPresets.test.ts src/features/strategies/utils/StrategyForm.map.test.ts src/features/strategies/utils/strategyNumericInput.test.ts src/features/strategies/utils/strategyCloseValidation.test.ts src/features/strategies/utils/indicatorPresentation.test.ts src/features/strategies/utils/indicatorTaxonomy.test.ts`
  - PASS: `19` files, `60` tests.
- `corepack pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts src/modules/strategies/strategies.e2e.test.ts src/modules/strategies/strategyConfigValidation.test.ts src/modules/strategies/indicators/indicators.service.test.ts`
  - PASS: `4` files, `35` tests.
- `corepack pnpm run go-live:infra:down`
  - PASS: local Postgres/Redis stopped after DB-backed tests.

Artifacts:

- `docs/operations/markets-strategies-configuration-audit-2026-05-19.md`
- `docs/operations/markets-strategies-configuration-audit-2026-05-19.json`

Residual risk:

- Fresh production-safe market/strategy fixture proof was not rerun.
- Market catalog source freshness telemetry remains a documented follow-up.
- Typed strategy domain errors remain a documented follow-up.
- Web strategy full i18n and dirty-state/conflict handling remain documented
  follow-ups.
