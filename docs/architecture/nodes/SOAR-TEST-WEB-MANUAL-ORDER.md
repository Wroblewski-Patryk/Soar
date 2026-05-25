---
id: SOAR-TEST-WEB-MANUAL-ORDER
name: "Web manual order tests"
type: test
status: verified
layer: testing
module: web-dashboard-home
feature: manual-order
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, test, testing, verified]
---

# Web manual order tests

| Field | Value |
| --- | --- |
| Description | Dashboard Home manual order and open-order action tests. |
| File path | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx |
| Related files | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx, apps/web/src/features/dashboard-home/hooks/useManualOrderController.test.tsx |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]], [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]], [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| API related | [[SOAR-API-ORDER-OPEN]], [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-ORDER-CLOSE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]], [[SOAR-DOC-WEB-ORDERS]] |
| Agent related |  |
| Notes | UI side of manual order graph. |

## Relations

- verified_by <- [[SOAR-FEATURE-MANUAL-ORDER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
