---
id: SOAR-TEST-WEB-RUNTIME-SURFACES
name: "Web runtime surfaces tests"
type: test
status: verified_local
layer: testing
module: web-runtime
feature: web-runtime-surfaces
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Web runtime surfaces tests

| Field | Value |
| --- | --- |
| Description | Aggregate Web runtime surface tests for dashboard runtime helpers signals onboarding and bot monitoring sections. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx |
| Related files | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts, apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeOnboardingConfig.test.tsx, apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx, apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.test.ts, apps/web/src/features/bots/components/bots-management/MonitoringFutureSignalsSection.test.tsx, apps/web/src/features/bots/components/BotsManagement.portfolio-history.test.tsx |
| Parent | [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]], [[SOAR-COMP-BOTS-MONITORING-TAB]], [[SOAR-UTIL-RUNTIME-DERIVATIONS]] |
| Used by | [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]], [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]], [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Aggregate Web runtime UI proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
