# Internationalization And Copy Reachability Audit - 2026-05-19

Audit ID: `AUD-22`
Status: current local
Environment: local

## Scope

This audit verifies route-reachable copy coverage, hardcoded UI literal
guardrails, locale namespace behavior, and repository language policy alignment.

## Evidence Run

| Check | Result | Evidence |
| --- | --- | --- |
| Route-reachable i18n audit | PASS | `corepack pnpm i18n:audit:route-reachable:web`; findings `0`, localCopy `0`, fallbackPl `0`, hardcoded `0`; artifact `history/artifacts/_artifacts-l10nq-d-coverage-audit-latest.json` |
| Focused Web i18n pack | PASS | `corepack pnpm --filter web exec vitest run src/i18n/translations.test.ts src/i18n/guardrails.test.ts src/i18n/namespaceRegistry.test.ts src/i18n/routeLocaleSmoke.test.ts src/i18n/I18nProvider.test.tsx src/i18n/I18nProvider.route-loading.test.tsx src/i18n/useLocaleFormatting.test.tsx src/i18n/useOptionalI18n.test.tsx`; `8` files / `26` tests |
| Language policy inspection | PASS | `docs/governance/language-policy.md` requires repository artifacts in English and user communication in the user's language |
| Guardrail coverage | PASS | Repository guardrails also passed during closure validation and include CQLT copy/hardcoded UI literal checks |

## Findings

| ID | Severity | Status | Finding | Evidence / Next Action |
| --- | --- | --- | --- | --- |
| AUD-I18N-001 | P0 | passed | Route-reachable i18n audit has no findings. | `findings=0`, `localCopy=0`, `fallbackPl=0`, `hardcoded=0`. |
| AUD-I18N-002 | P0 | passed | Focused i18n tests pass across translations, namespace registry, provider loading, locale formatting, and optional i18n behavior. | Web i18n pack passed (`8` files / `26` tests). |
| AUD-I18N-003 | P1 | passed | Repository language policy remains explicit and aligned with this task. | New audit artifacts are written in English; user communication remains Polish. |
| AUD-I18N-004 | P2 | open future gate | Future route/copy changes must rerun route-reachable i18n audit. | Keep `i18n:audit:route-reachable:web` in copy/route change gates. |

## Result

`AUD-22` is current locally. No route-reachable copy, fallback Polish, local
copy, or hardcoded UI literal findings were detected in the current audit.
