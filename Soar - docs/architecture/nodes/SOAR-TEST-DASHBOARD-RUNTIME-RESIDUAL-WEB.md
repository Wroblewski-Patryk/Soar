---
id: SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB
name: "Dashboard runtime residual Web tests"
type: test
status: verified_local
layer: testing
module: web-dashboard-home
feature: dashboard-runtime
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Dashboard runtime residual Web tests

| Field | Value |
| --- | --- |
| Description | Dashboard runtime residual tests for aggregate error history wallet manual-order scope venue open-order source preview parity runtime origin helpers market bar sidebar and runtime selection view-model. |
| File path | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx |
| Related files | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx, apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx, apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx, apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx, apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx, apps/web/src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx, apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-origin.test.tsx, apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test-helpers.ts, apps/web/src/features/dashboard-home/components/LiveMarketBar.test.tsx, apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx, apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts, apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx |
| Parent | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-COMP-HOME-LIVE-WIDGETS]], [[SOAR-COMP-LIVE-MARKET-BAR]], [[SOAR-COMP-RUNTIME-SIDEBAR-SECTION]], [[SOAR-HOOK-RUNTIME-SELECTION-VIEWMODEL]], [[SOAR-HOOK-HOME-LIVE-WIDGETS-CONTROLLER]] |
| Used by | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related | [[SOAR-PAGE-DASHBOARD]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]], [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Aggregate proof for residual dashboard runtime Web drift. |

## Relations

- verified_by <- [[SOAR-FEATURE-DASHBOARD-RUNTIME]] (verified_local)
- verified_by <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (verified_local)
- verified_by <- [[SOAR-COMP-LIVE-MARKET-BAR]] (verified_local)
- verified_by <- [[SOAR-COMP-RUNTIME-SIDEBAR-SECTION]] (verified_local)
- verified_by <- [[SOAR-HOOK-RUNTIME-SELECTION-VIEWMODEL]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
