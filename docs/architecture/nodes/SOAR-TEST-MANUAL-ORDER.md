---
id: SOAR-TEST-MANUAL-ORDER
name: "Manual order tests"
type: test
status: verified
layer: testing
module: manual-orders
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, test, testing, verified]
---

# Manual order tests

| Field | Value |
| --- | --- |
| Description | Manual order service route context and lifecycle tests including Gate.io contract-size proof. |
| File path | apps/api/src/modules/orders/orders.manualContext.contractSize.service.test.ts |
| Related files | apps/api/src/modules/orders/orders-positions.e2e.test.ts, apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related | [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]] |
| API related | [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-ORDERS]] |
| Agent related |  |
| Notes | LIVE mutation remains approval-gated. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
