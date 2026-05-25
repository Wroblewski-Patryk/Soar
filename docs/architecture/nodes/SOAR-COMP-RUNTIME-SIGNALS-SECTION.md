---
id: SOAR-COMP-RUNTIME-SIGNALS-SECTION
name: "RuntimeSignalsSection"
type: component
status: verified_local
layer: frontend
module: web-dashboard-home
feature: web-runtime-surfaces
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-25
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# RuntimeSignalsSection

| Field | Value |
| --- | --- |
| Description | Dashboard runtime signals section for current signal state and indicator context. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx |
| Related files | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-UTIL-RUNTIME-DERIVATIONS]], [[SOAR-UTIL-RUNTIME-UI-HELPERS]], [[SOAR-UTIL-RUNTIME-SIGNAL-CONDITION-STATE]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME-SIGNALS]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Runtime signal surface. |

## Relations

- uses -> [[SOAR-UTIL-RUNTIME-DERIVATIONS]] (verified_local)
- uses -> [[SOAR-UTIL-RUNTIME-UI-HELPERS]] (verified_local)
- uses -> [[SOAR-UTIL-RUNTIME-SIGNAL-CONDITION-STATE]] (verified_local)
- verified_by -> [[SOAR-TEST-DASHBOARD-RUNTIME-SIGNALS]] (verified_local)
- composes <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
