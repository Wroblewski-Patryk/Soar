---
id: SOAR-TEST-WEB-SHELL-UI
name: "Web shell and UI tests"
type: test
status: verified_local
layer: testing
module: web
feature: web-residual-surfaces
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Web shell and UI tests

| Field | Value |
| --- | --- |
| Description | Aggregate Web shell UI form layout PWA dashboard accessibility and wallet route tests. |
| File path | apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx |
| Related files | apps/web/src/app/dashboard/wallets/page.test.tsx, apps/web/src/app/dashboard/wallets/[id]/page.test.tsx, apps/web/src/ui/components/TableUi.test.tsx, apps/web/src/ui/components/Tabs.test.tsx, apps/web/src/ui/components/ThemeSwitch.test.tsx, apps/web/src/ui/components/ViewState.test.tsx, apps/web/src/ui/forms/FormFields.test.tsx, apps/web/src/ui/forms/FormPrimitives.test.tsx, apps/web/src/ui/forms/validationFeedback.test.ts, apps/web/src/ui/layout/dashboard/DashboardRouteProgress.test.tsx, apps/web/src/ui/layout/dashboard/Footer.layout.test.tsx, apps/web/src/ui/layout/dashboard/Header.responsive.test.tsx, apps/web/src/ui/layout/dashboard/IsometricModeToggle.test.tsx, apps/web/src/ui/layout/dashboard/LanguageSwitcher.test.tsx, apps/web/src/ui/layout/dashboard/PageTitle.a11y.test.tsx, apps/web/src/ui/layout/dashboard/RiskNoticeFooter.test.tsx, apps/web/src/ui/layout/dashboard/SafetyBar.test.tsx, apps/web/src/ui/layout/public/Footer.layout.test.tsx, apps/web/src/ui/layout/public/Header.test.tsx, apps/web/src/ui/pwa/serviceWorkerCacheContract.test.ts, apps/web/src/ui/pwa/ServiceWorkerRegistration.test.tsx, apps/web/src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx |
| Parent | [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-PAGE-DASHBOARD]], [[SOAR-FEATURE-WALLETS]], [[SOAR-HOOK-CLOSE-RUNTIME-POSITION-ACTION]] |
| Used by | [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] |
| UI related | [[SOAR-PAGE-DASHBOARD]] |
| API related | [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-SHARED]], [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Residual Web shell and UI proof. |

## Relations

- verified_by <- [[SOAR-HOOK-CLOSE-RUNTIME-POSITION-ACTION]] (verified_local)
- verified_by <- [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
