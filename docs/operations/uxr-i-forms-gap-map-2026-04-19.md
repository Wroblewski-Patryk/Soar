# UXR-I Residual Forms Consistency Gap Map (2026-04-19)

Status: active (`UXR-I-02`)  
Scope owner: Frontend Builder  
Source wave: `docs/planning/uxr-i-dashboard-forms-consistency-refresh-plan-2026-04-19.md`

## Audit Method
- Scope-limited code audit on `UXR-I` routes/forms only:
  - wrappers in `apps/web/src/app/dashboard/*/(create|[id]/edit)/page.tsx` (+ wallet/bot wrapper content components),
  - form components:
    - `WalletCreateEditForm`
    - `MarketUniverseForm`
    - `BacktestCreateForm`
    - `StrategyForm`
    - `BotCreateEditForm`
- Guardrail baseline review:
  - `scripts/repoGuardrails.mjs`
  - `apps/web/src/i18n/guardrails.test.ts`
- Wrapper hardcoded-copy scan:
  - no hardcoded wrapper literals detected in audited files (`hardcoded-literal-matches=0`).

## Gap Matrix
| Area | Current state | Gap | Planned task |
| --- | --- | --- | --- |
| Wrapper i18n copy (`wallets`, `markets`, `strategies`, `backtests`, `bots`) | Wrapper titles/breadcrumbs/actions are key-driven via `t(...)`. No inline locale dictionaries found in audited scope. | No copy drift found (keep guarded). | `UXR-I-04`, `UXR-I-05` (regression lock + wrapper parity cleanup only where needed). |
| Wrapper save-action parity | `markets` edit/create use `submitting` + `disabled` on desktop/mobile action buttons. `wallets` and `bots` wrappers render save actions without wrapper-level disabled/submitting state. | Save-action interaction contract still drifts across wrappers. | `UXR-I-05` |
| Mobile sticky action parity | `wallets`, `bots`, `markets` wrappers use `FormMobileActionBar`; `strategies` and `backtests` create/edit wrappers do not. | Inconsistent mobile save reachability for long forms. | `UXR-I-05`, `UXR-I-12` |
| Shared form primitives usage | All audited forms already import generic fields from `@/ui/forms` (no cross-feature generic controls detected). | No active import-coupling violation; needs guardrail lock for regression safety. | `UXR-I-03`, `UXR-I-04` |
| Markets form IA consistency | `MarketUniverseForm` still uses raw grid sections (`md:grid-cols-4`, `lg/xl:grid-cols-2`) and mixed local layout blocks. | Section IA and spacing still less aligned with shared section-card pattern used in other forms. | `UXR-I-07` |
| Bots form density | `BotCreateEditForm` uses dense `FormGrid columns={3}` for top config area. | Readability/scanability drift versus two-column contract from refresh brief. | `UXR-I-10` |
| Validation behavior parity | All audited forms use summary + first-invalid `scrollIntoView` path. | Behavior mostly aligned; needs one shared guardrail to prevent future per-form divergence. | `UXR-I-11` |
| Wrapper-level guardrail coverage | `i18n/guardrails.test.ts` monitors only a subset of route-reachable files and currently misses most `UXR-I` wrappers. | Regression guard for wrapper copy drift is incomplete for `UXR-I` route set. | `UXR-I-04` |
| Wrapper test coverage | Existing page tests cover `wallets` and `bots`; missing focused tests for `markets`, `strategies`, and `backtests` create/edit wrappers. | Incomplete regression safety for wrapper consistency contract. | `UXR-I-13` |

## Route-by-Route Snapshot
| Route | Wrapper copy/i18n | Save action parity | Mobile action parity | Status |
| --- | --- | --- | --- | --- |
| `/dashboard/wallets/create` + `/dashboard/wallets/[id]/edit` | OK | Partial (no wrapper-level submitting/disabled contract) | OK | residual |
| `/dashboard/markets/create` + `/dashboard/markets/[id]/edit` | OK | OK | OK | mostly aligned |
| `/dashboard/strategies/create` + `/dashboard/strategies/[id]/edit` | OK | Partial (desktop-only action path) | Missing | residual |
| `/dashboard/backtests/create` | OK | Partial (desktop-only action path) | Missing | residual |
| `/dashboard/bots/create` + `/dashboard/bots/[id]/edit` | OK | Partial (no wrapper-level submitting/disabled contract) | OK | residual |

## Risk Register (UXR-I-A follow-up)
- Risk: wrapper behavior regression while normalizing save actions.
  - Mitigation: lock wrappers in focused page tests before broad refactor (`UXR-I-13`).
- Risk: form-layout refactor in markets/bots introduces functional drift.
  - Mitigation: migrate rendering/layout layer only, keep payload/domain logic untouched (`UXR-I-07`, `UXR-I-10`).
- Risk: i18n copy regressions reintroduced in wrapper shells.
  - Mitigation: expand monitored route set in guardrail test (`UXR-I-04`).

## Next Execution Order (Confirmed)
1. `UXR-I-03` normalize shared `ui/forms` API surface (non-breaking).
2. `UXR-I-04` guardrail lock (`import boundary` + `wrapper copy` coverage).
3. `UXR-I-05..UXR-I-12` module-by-module parity closures.
