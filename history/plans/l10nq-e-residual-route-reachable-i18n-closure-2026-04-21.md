# L10NQ-E Residual Route-Reachable i18n Closure

Date: 2026-04-21  
Wave: `L10NQ-E`  
Status: Closed

## Scope Closed

- audit signal-quality hardening for route-reachable i18n
- residual public-shell and dashboard-shell copy migration
- residual profile API-key hook copy migration
- residual wallets and markets table copy migration
- residual backtests details copy retirement into canonical namespaces
- shared `ViewState` and `FormValidationSummary` fallback localization
- residual i18n regression pack and closure sync

## Final Audit Result

Latest `pnpm i18n:audit:route-reachable:web` result:

- `findings=0`
- `localCopy=0`
- `fallbackPl=0`
- `hardcoded=0`

Updated artifact:

- `history/artifacts/_artifacts-l10nq-d-coverage-audit-latest.json`

## Validation Evidence

- `pnpm i18n:audit:route-reachable:web`
- `pnpm run quality:guardrails`
- `pnpm --filter web exec vitest run src/i18n/routeLocaleSmoke.test.ts src/i18n/guardrails.test.ts src/i18n/namespaceRegistry.test.ts src/i18n/translations.test.ts`
- `pnpm --filter web run build`
- `pnpm run typecheck`

## Closure Notes

- translation infrastructure files under `apps/web/src/i18n/` are now excluded
  from route-debt scoring, so audit closure evidence no longer mixes namespace
  source files with real route debt
- residual public/profile/backtests/shared copy now resolves through canonical
  namespaces instead of local per-file locale maps
- `backtestRunDetails.copy.ts` no longer owns locale dictionaries; it is now a
  translation-backed adapter over `dashboard.backtests.details.*`

## Outcome

`L10NQ` no longer carries residual route-reachable follow-up debt. The web
localization baseline is now one scalable contract:

- canonical per-route namespaces
- route-aware dictionary loading
- guardrails against local copy and hardcoded UI literals
- one route-reachable audit that reports only actionable production debt
