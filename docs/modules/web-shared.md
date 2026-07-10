# Web Deep-Dive: Shared Feature Helpers

## Metadata
- Module name: `shared`
- Layer: `web`
- Source path: `apps/web/src/features/shared`
- Owner: frontend/shared-ui
- Last updated: 2026-07-10
- Related planning task: `V1CLOSEOUT-07`

## 1. Purpose and Scope
- Provides feature-level shared presentation helpers used by runtime-adjacent dashboard surfaces.
- Keeps DCA ladder rendering and runtime monitoring formatting consistent between dashboard-home and bot monitoring views.

Out of scope:
- Route ownership.
- API data fetching.
- Generic design-system primitives owned by `apps/web/src/ui`.

## 2. Boundaries and Dependencies
- Core files:
  - `dcaLadderCell.tsx`
  - `runtimeMonitoringFormatters.ts`
- Generic shared UI primitives:
  - `apps/web/src/ui/components/DataTable.tsx`
  - `apps/web/src/ui/components/TableUi.tsx`
  - `apps/web/src/ui/components/ViewState.tsx`
  - `apps/web/src/ui/components/StatusBadge.tsx`
  - `apps/web/src/ui/components/Tabs.tsx`
  - `apps/web/src/ui/components/ThemeSwitch.tsx`
  - `apps/web/src/ui/forms/*`
  - `apps/web/src/ui/layout/*`
  - `apps/web/src/ui/pwa/*`
- Tests:
  - `dcaLadderCell.test.tsx`
  - `runtimeMonitoringFormatters.test.ts`
  - `apps/web/src/ui/components/DataTable.test.tsx`
  - `apps/web/src/ui/components/TableUi.test.tsx`
  - `apps/web/src/ui/components/ViewState.test.tsx`
  - `apps/web/src/ui/components/StatusBadge.test.tsx`
  - `apps/web/src/ui/components/SharedUiPrimitives.test.tsx`
  - `apps/web/src/ui/components/Tabs.test.tsx`
  - `apps/web/src/ui/components/ThemeSwitch.test.tsx`
  - `apps/web/src/ui/forms/FormFields.test.tsx`
  - `apps/web/src/ui/forms/FormPrimitives.test.tsx`
  - `apps/web/src/ui/forms/validationFeedback.test.ts`
  - `apps/web/src/ui/layout/dashboard/*.test.tsx`
  - `apps/web/src/ui/layout/public/*.test.tsx`
  - `apps/web/src/ui/pwa/*.test.tsx`
- Consumed by:
  - dashboard-home runtime widgets
  - bots monitoring/runtime views
  - dashboard and public layout shells
  - shared form-based create/edit flows

## 3. Data and Contract Surface
- DCA ladder helpers format planned/executed levels without duplicating table-specific logic.
- Runtime monitoring formatters normalize status/action display values for shared operator tables.

## 4. Runtime Flows
- Consumers pass already-fetched runtime payload fields into shared helpers.
- Helpers return display-ready values and components without owning request lifecycle or mutation behavior.

## 5. UI Integration
- Shared helpers must preserve parity between dashboard-home and bot monitoring surfaces.
- New runtime table formatting should be added here when it is used by more than one feature module.

## 6. Security and Risk Guardrails
- No direct API or auth access.
- No trading command authority.
- Helpers must not infer runtime truth that is absent from API payloads.

## 7. Observability and Operations
- No standalone telemetry.
- Fail-soft formatting should prefer neutral empty output over invented trading state.

## 8. Test Coverage and Evidence
Tests:
| Test file | Scope | Level |
| --- | --- | --- |
| `apps/web/src/features/shared/dcaLadderCell.test.tsx` | DCA ladder helper rendering and value semantics | Component |
| `apps/web/src/features/shared/runtimeMonitoringFormatters.test.ts` | Shared runtime table/status formatting helpers | Unit |
| `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx` | Downstream integration of shared runtime formatting in dashboard tables | Component |
| `apps/web/src/features/bots/utils/trailingStopDisplay.test.ts` | Shared display conventions reused by bot/runtime monitoring surfaces | Unit |
| `apps/web/src/ui/components/DataTable.test.tsx` | Shared table sorting, paging, and search behavior | Component |
| `apps/web/src/ui/components/TableUi.test.tsx` | Shared table primitive rendering | Component |
| `apps/web/src/ui/components/ViewState.test.tsx` | Loading, empty, error, degraded, and success state primitives | Component |
| `apps/web/src/ui/components/StatusBadge.test.tsx` | Shared status badge semantics | Component |
| `apps/web/src/ui/components/SharedUiPrimitives.test.tsx` | Shared modal, footer preference, profile navigation, loading skeleton, skip-link, pager, logo, async confirm, and details-dropdown primitives | Component |
| `apps/web/src/ui/components/Tabs.test.tsx` | Shared tablist and tab-panel behavior | Component |
| `apps/web/src/ui/forms/FormFields.test.tsx` | Shared form field rendering and validation display | Component |
| `apps/web/src/ui/layout/dashboard/Header.responsive.test.tsx` | Dashboard header responsive behavior | Component |
| `apps/web/src/ui/layout/dashboard/PageTitle.a11y.test.tsx` | Dashboard page title accessibility behavior | Component |
| `apps/web/src/ui/layout/public/Header.test.tsx` | Public header navigation behavior | Component |
| `apps/web/src/ui/pwa/ServiceWorkerRegistration.test.tsx` | PWA service worker registration UI behavior | Component |

Suggested validation command:
```powershell
pnpm --filter web test -- src/features/shared/dcaLadderCell.test.tsx src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/trailingStopDisplay.test.ts src/ui/components/DataTable.test.tsx src/ui/components/SharedUiPrimitives.test.tsx src/ui/components/TableUi.test.tsx src/ui/components/ViewState.test.tsx src/ui/components/StatusBadge.test.tsx src/ui/components/Tabs.test.tsx src/ui/forms/FormFields.test.tsx src/ui/forms/FormPrimitives.test.tsx src/ui/forms/validationFeedback.test.ts src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/public/Header.test.tsx src/ui/pwa/ServiceWorkerRegistration.test.tsx
```

## 8A. Architecture-Awareness Gap Triage

`LUC-2021`, `LUC-2105`, `LUC-2123`, `LUC-2138`, `LUC-2164`, and `LUC-2199`
triaged architecture-awareness doc/test-link rows for shared Web surfaces.
This section keeps the module deep dive explicit: the rows below are exact
test-table mappings for evidence-present shared surfaces, not inferred
coverage claims. Remaining graph drift should be treated as scanner relation
maintenance unless a listed test file is removed or a shared behavior changes.

Shared UI and shell tests:
| Shared surface | Tests | Level | Status |
| --- | --- | --- | --- |
| `DataTable`, table state, sorting, paging, search | `apps/web/src/ui/components/DataTable.test.tsx`; `apps/web/src/ui/components/data-table/useDataTableColumnVisibilityState.test.ts` | Component/unit | Exact local tests present |
| `TableUi`, `ViewState`, `StatusBadge`, `Tabs`, `ThemeSwitch` | `apps/web/src/ui/components/TableUi.test.tsx`; `apps/web/src/ui/components/ViewState.test.tsx`; `apps/web/src/ui/components/StatusBadge.test.tsx`; `apps/web/src/ui/components/Tabs.test.tsx`; `apps/web/src/ui/components/ThemeSwitch.test.tsx` | Component | Exact local tests present |
| `ConfirmModal`, `FormModal`, `useAsyncConfirm`, `AppLogoLink`, `FooterPreferencesSwitchers`, `InlinePager`, `ProfileButton`, `SkipToContentLink`, `useDetailsDropdown`, skeleton loading primitives | `apps/web/src/ui/components/SharedUiPrimitives.test.tsx` | Component | Exact local tests present |
| Shared form fields, primitives, validation feedback | `apps/web/src/ui/forms/FormFields.test.tsx`; `apps/web/src/ui/forms/FormPrimitives.test.tsx`; `apps/web/src/ui/forms/validationFeedback.test.ts` | Component/unit | Exact local tests present |
| Dashboard/public layout and PWA shell primitives | `apps/web/src/ui/layout/dashboard/Footer.layout.test.tsx`; `apps/web/src/ui/layout/dashboard/Header.responsive.test.tsx`; `apps/web/src/ui/layout/dashboard/PageTitle.a11y.test.tsx`; `apps/web/src/ui/layout/public/Footer.layout.test.tsx`; `apps/web/src/ui/layout/public/Header.test.tsx`; `apps/web/src/ui/pwa/ServiceWorkerRegistration.test.tsx` | Component | Exact local tests present |

Shared feature helper tests:
| Shared surface | Tests | Level | Status |
| --- | --- | --- | --- |
| DCA ladder rendering and runtime monitoring formatters | `apps/web/src/features/shared/dcaLadderCell.test.tsx`; `apps/web/src/features/shared/runtimeMonitoringFormatters.test.ts` | Component/unit | Exact local tests present |
| Dashboard runtime table presenter integration | `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx` | Component | Exact downstream integration test present |
| Bot/runtime shared display conventions | `apps/web/src/features/bots/utils/trailingStopDisplay.test.ts`; `apps/web/src/features/bots/utils/runtimeSignalLabelKeys.test.ts` | Unit | Exact local tests present |

Shared i18n, utility, and support tests:
| Shared surface | Tests | Level | Status |
| --- | --- | --- | --- |
| i18n guardrails, namespace registry, translations, provider, locale formatting | `apps/web/src/i18n/namespaceRegistry.test.ts`; `apps/web/src/i18n/translations.test.ts`; `apps/web/src/i18n/useLocaleFormatting.test.tsx`; `apps/web/src/i18n/useOptionalI18n.test.tsx`; `apps/web/src/i18n/I18nProvider.test.tsx`; `apps/web/src/i18n/routeLocaleSmoke.test.ts` | Unit/component | Exact local tests present |
| Shared Web API/error/navigation/numeric/public-base utilities | `apps/web/src/lib/api.test.ts`; `apps/web/src/lib/async.test.ts`; `apps/web/src/lib/errorResolver.test.ts`; `apps/web/src/lib/navigation.test.ts`; `apps/web/src/lib/numericInput.test.ts`; `apps/web/src/lib/publicApiBaseUrl.test.ts` | Unit | Exact local tests present |
| Aggregate shared Web utilities, theme bootstrap, text/time/forms/storage/symbol helpers | `apps/web/src/lib/sharedWebUtilities.test.ts` | Unit | Exact aggregate test present |
| Web Vitest setup support | `apps/web/src/vitestSetupSupport.test.tsx` | Unit/support | Exact support test present |
| Shared declaration consumer proof | `apps/web/src/features/exchanges/exchangeCapabilities.test.ts` | Unit/type-consumer | Exact consumer proof present |

This triage is documentation and evidence classification only. It does not
claim fresh browser, production, protected, or release readiness proof.

### LUC-2131 Web Lib And I18n Sample Classification

`LUC-2131` normalized the 2026-06-05 architecture-awareness top actionable
missing doc/test samples for shared Web i18n, generic `apps/web/src/lib`
utilities, theme bootstrap, data-table/form/dropdown helpers, and dashboard
header style helpers. These rows have clear shared Web ownership and are
mapped through `docs/architecture/relations/documentation-links.csv`.

| Sample group | Owner/module | Status | Expected proof |
| --- | --- | --- | --- |
| `apps/web/src/i18n/__fixtures__/guardrails.seed-regression.tsx`, `namespaceRegistry.ts`, `translations.ts`, `useLocaleFormatting.ts`, `useOptionalI18n.ts` | `web-shared` / frontend shared i18n | Documentation mapped; focused tests exist in `apps/web/src/i18n/*.test.*`, plus route-locale smoke coverage. | Keep i18n guardrail, namespace, translation parity, route locale smoke, provider, and formatting tests in `SOAR-TEST-WEB-RESIDUAL-SURFACES`; add new tests only when i18n behavior changes. |
| `apps/web/src/lib/api.ts`, `async.ts`, `errorResolver.ts`, `getAxiosMessage.ts`, `handleError.ts`, `navigation.ts`, `numericInput.ts`, `publicApiBaseUrl.ts` | `web-shared` / frontend shared utilities | Documentation mapped; focused utility tests exist in colocated `apps/web/src/lib/*.test.ts`. | Keep focused utility tests in `SOAR-TEST-WEB-RESIDUAL-SURFACES`; scanner may still require direct relation generation for per-file test links. |
| `apps/web/src/lib/cloneNaming.ts`, `storage.ts`, `symbols.ts`, `text.ts`, `time.ts`, `forms.ts`, `marketStream.ts` | `web-shared` / frontend shared utilities | Documentation mapped; behavior is covered by `sharedWebUtilities.test.ts` or downstream Web component/service tests where the helper is integration-facing. | Treat aggregate test proof as present but not equivalent to per-file scanner relations; add focused tests if helper semantics become independently risk-bearing. |
| `apps/web/src/security/themeBootstrap.ts` and `apps/web/src/ui/layout/dashboard/headerControlStyles.ts` | `web-shared` / dashboard shell utilities | Documentation mapped; `sharedWebUtilities.test.ts` validates persisted theme/locale bootstrap and stable dashboard header class helpers. | Keep this as aggregate shell utility proof; no runtime smoke is claimed by this documentation mapping. |
| `useDataTableColumnVisibilityState.ts`, `validationFeedback.ts`, `useDetailsDropdown.ts` | `web-shared` / shared UI helpers | Documentation mapped; focused or primitive tests exist in `useDataTableColumnVisibilityState.test.ts`, `validationFeedback.test.ts`, and `SharedUiPrimitives.test.tsx`. | Keep these in shared UI validation. Remaining graph gaps are direct relation generation gaps, not current evidence gaps. |

### LUC-2138 Shared Web Missing-Test Relation Classification

`LUC-2138` rechecked the current top shared Web missing-test rows from the
architecture-awareness report generated at `2026-06-05T09:10:34.335Z`. The
sampled UI/forms/layout/lib/theme/dropdown/header rows are covered by focused
or aggregate local tests. `apps/web/vitest.setup.ts` is a test-harness support
surface exercised by Web Vitest runs, and `libs/shared/index.d.ts` is a type
declaration surface whose appropriate proof remains typecheck/consumer coverage
rather than a UI unit test. No new focused coverage gap was found.

Fresh validation:

```powershell
pnpm --filter web test -- src/features/shared/dcaLadderCell.test.tsx src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/trailingStopDisplay.test.ts src/ui/components/DataTable.test.tsx src/ui/components/SharedUiPrimitives.test.tsx src/ui/components/TableUi.test.tsx src/ui/components/ViewState.test.tsx src/ui/components/StatusBadge.test.tsx src/ui/components/Tabs.test.tsx src/ui/components/ThemeSwitch.test.tsx src/ui/components/data-table/useDataTableColumnVisibilityState.test.ts src/ui/forms/FormFields.test.tsx src/ui/forms/FormPrimitives.test.tsx src/ui/forms/validationFeedback.test.ts src/ui/layout/dashboard/Footer.layout.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/public/Footer.layout.test.tsx src/ui/layout/public/Header.test.tsx src/ui/pwa/ServiceWorkerRegistration.test.tsx src/lib/api.test.ts src/lib/async.test.ts src/lib/errorResolver.test.ts src/lib/navigation.test.ts src/lib/numericInput.test.ts src/lib/publicApiBaseUrl.test.ts src/lib/sharedWebUtilities.test.ts
```

Result: PASS (`28` files / `145` tests). Remaining report signal is direct
scanner relation incompleteness, not a current Test Automation blocker.

### LUC-2164 Priority Test Relation Readback

`LUC-2164` converted the evidence-present shared Web UI/form/layout/lib sample
rows from generic missing-test signals into direct scanner-readable test
relations through `docs/architecture/relations/priority-test-links.csv`. No
new focused coverage gap was found. Fresh architecture-awareness readback
generated `2026-06-05T10:28:04.175Z` with `14267` entities and `22197`
relations; actionable missing tests improved from `920` to `896`, and the
targeted LUC-2164 priority paths remaining in actionable missing-test samples
read back as `0`.

`apps/web/vitest.setup.ts` remains classified as test-harness support and
`libs/shared/index.d.ts` as a type declaration surface; they are not
user-facing shared UI component test gaps.

### LUC-2199 Web Support-Surface Test Relation Audit

`LUC-2199` closed the two assigned Web support/type missing-test rows without
reclassifying them as user-facing UI components. `apps/web/vitest.setup.ts`
now has focused support proof in `apps/web/src/vitestSetupSupport.test.tsx`,
which verifies jest-dom matcher loading plus global Next/profile mocks.
`libs/shared/index.d.ts` now has consumer type proof in
`apps/web/src/features/exchanges/exchangeCapabilities.test.ts`, which asserts
the Web exchange option and capability types stay aligned with shared
declarations. Both rows are linked through
`docs/architecture/relations/priority-test-links.csv`.

Validation passed:

```powershell
pnpm --filter web test -- src/vitestSetupSupport.test.tsx src/features/exchanges/exchangeCapabilities.test.ts
```

Result: PASS (`2` files / `4` tests). Architecture-awareness refresh generated
`2026-06-05T12:40:45.169Z` with `14322` entities and `22433` relations;
actionable missing-test rows read back as `859`, and both support rows were
absent from stored actionable samples.

### LUC-2186 App Shell Doc-Link Closure

`LUC-2186` normalized residual app-shell missing-doc relation rows from the
2026-06-05 architecture-awareness report. These files are Web shell/PWA/layout
entrypoints, not new runtime behavior.

| Source entity | Owner/module | Status | Expected proof |
| --- | --- | --- | --- |
| `apps/web/src/app/(public)/layout.tsx` | `web-shared` / public shell | Documentation mapped through `docs/architecture/relations/documentation-links.csv`. | Keep public layout component tests and route smoke separate from this doc-link mapping. |
| `apps/web/src/app/dashboard/layout.tsx` | `web-shared` / dashboard shell | Documentation mapped through `docs/architecture/relations/documentation-links.csv`. | Keep dashboard layout/header/a11y tests and protected route proof separate from this doc-link mapping. |
| `apps/web/src/app/layout.tsx` | `web-shared` / root shell | Documentation mapped through `docs/architecture/relations/documentation-links.csv`. | Keep Web typecheck/build and shell tests as behavior proof when root layout changes. |
| `apps/web/src/app/manifest.ts` | `web-shared` / PWA shell | Documentation mapped through `docs/architecture/relations/documentation-links.csv`. | Keep PWA/service-worker tests as behavior proof when manifest or cache semantics change. |

## 9. Open Issues and Follow-Ups
- Keep this module limited to cross-feature helpers; move single-consumer code back to the owning feature.
