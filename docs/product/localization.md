# Localization Reference

## Scope and Contract
Localization contract for CryptoSparrow is:
- `en` (default locale)
- `pl`

These are the only supported current-version languages. Earlier `pt-PT`
implementation notes below are historical and do not establish a supported
Portuguese product locale. See the
[Current Version Product Contract](./current-version-contract.md).

No Portuguese locale is in the current delivery.

## Canonical Sources
- `apps/web/src/i18n/translations.ts`
- `apps/web/src/i18n/namespaceRegistry.ts`
- `apps/web/src/i18n/I18nProvider.tsx`
- `docs/ux/localization-qa.md`

## Namespace and Route Loading Policy
- Translations are organized by explicit namespaces (public/auth/admin/dashboard modules).
- Runtime dictionary resolution is route-scoped via `resolveNamespacesForRoute(...)`.
- Provider resolves locale text from route-scoped dictionary first, then route-scoped EN fallback.
- Missing key diagnostics are logged in development only and include route + expected namespaces.

## UI and Content Rules
- User-facing strings must be sourced from i18n keys (no hardcoded copy in production components).
- Language switcher labels must come from translation keys.
- Retained Portuguese code or copy is future/experimental scope and must not
  be counted as current supported-language coverage.

## Documentation Language Rule
Canonical repository documentation is written in English by default.
If a legacy non-English document is touched, normalize it to English in the same task or add it to governance backlog.

## Historical Coverage Baseline (2026-04-17)
- Dashboard shell, home, bots, backtests wrappers, and language switcher are on `en/pl/pt` path.
- Namespace parity and i18n guardrail tests are required in CI/local validation before release tasks are closed.
