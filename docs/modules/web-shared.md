# Web Deep-Dive: Shared Feature Helpers

## Metadata
- Module name: `shared`
- Layer: `web`
- Source path: `apps/web/src/features/shared`
- Owner: frontend/shared-ui
- Last updated: 2026-06-04
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
| `apps/web/src/ui/components/Tabs.test.tsx` | Shared tablist and tab-panel behavior | Component |
| `apps/web/src/ui/forms/FormFields.test.tsx` | Shared form field rendering and validation display | Component |
| `apps/web/src/ui/layout/dashboard/Header.responsive.test.tsx` | Dashboard header responsive behavior | Component |
| `apps/web/src/ui/layout/dashboard/PageTitle.a11y.test.tsx` | Dashboard page title accessibility behavior | Component |
| `apps/web/src/ui/layout/public/Header.test.tsx` | Public header navigation behavior | Component |
| `apps/web/src/ui/pwa/ServiceWorkerRegistration.test.tsx` | PWA service worker registration UI behavior | Component |

Suggested validation command:
```powershell
pnpm --filter web test -- src/features/shared/dcaLadderCell.test.tsx src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/trailingStopDisplay.test.ts src/ui/components/DataTable.test.tsx src/ui/components/TableUi.test.tsx src/ui/components/ViewState.test.tsx src/ui/components/StatusBadge.test.tsx src/ui/components/Tabs.test.tsx src/ui/forms/FormFields.test.tsx src/ui/forms/FormPrimitives.test.tsx src/ui/forms/validationFeedback.test.ts src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/public/Header.test.tsx src/ui/pwa/ServiceWorkerRegistration.test.tsx
```

## 8A. Architecture-Awareness Gap Triage

`LUC-2021` triaged the 2026-06-03 architecture-awareness inferred
test/doc-link gaps for shared UI. The scanner currently creates implementation
entities for `apps/web/src/ui/**` components from source files, but it does not
promote every nearby `*.test.*` file or this module doc as a direct relation on
each generated component. Treat the resulting "without inferred tests/docs"
signal as follows:

| Shared UI surface | Current evidence | Triage status | Next action |
| --- | --- | --- | --- |
| `DataTable`, `TableUi`, `ViewState`, `StatusBadge`, `Tabs`, `ThemeSwitch` | Focused component tests exist under `apps/web/src/ui/components` and are also represented by `SOAR-TEST-WEB-RESIDUAL-SURFACES` / `SOAR-TEST-WEB-SHELL-UI`. | Evidence present, scanner relation incomplete. | Keep local test coverage; improve graph relation generation or registry mapping in a Docs Memory lane before treating these as missing tests. |
| `FormField`, `FormFields`, `FormGrid`, `FormPageShell`, `FormSectionCard`, `FormMobileActionBar`, `FormValidationSummary`, `FormAlert` | Focused form primitive tests exist under `apps/web/src/ui/forms`. | Evidence present, scanner relation incomplete. | Keep form primitive tests in the shared UI validation command and map direct graph relations when the scanner supports stable shared UI component nodes. |
| Dashboard/public layout and PWA primitives | Focused layout/PWA tests exist under `apps/web/src/ui/layout/**` and `apps/web/src/ui/pwa/**`. | Evidence present, scanner relation incomplete. | Keep route/layout smoke separate from route-level browser proof. |
| `ConfirmModal`, `FormModal`, `useAsyncConfirm` | Covered indirectly through consuming feature tests and usage relations; no focused shared primitive test was found in this triage. | Real follow-up candidate. | Add focused modal/async-confirm tests when modal behavior changes or when Docs Memory promotes per-component shared UI graph nodes. |
| `AppLogoLink`, `FooterPreferencesSwitchers`, `InlinePager`, `ProfileButton`, `SkipToContentLink` | Covered indirectly through layout/table consumers; no focused primitive test was found in this triage. | Low-risk follow-up candidate. | Add focused tests if these primitives change; otherwise keep layout/table tests as the current proof boundary. |
| Skeleton loading primitives | Used by `ViewState` and loading surfaces; no focused primitive test was found in this triage. | Low-risk follow-up candidate. | Add focused tests only if loader semantics become user-action-bearing or accessibility-sensitive beyond current `ViewState` coverage. |

This triage is documentation and evidence classification only. It does not
claim fresh browser, production, protected, or release readiness proof.

## 9. Open Issues and Follow-Ups
- Keep this module limited to cross-feature helpers; move single-consumer code back to the owning feature.
