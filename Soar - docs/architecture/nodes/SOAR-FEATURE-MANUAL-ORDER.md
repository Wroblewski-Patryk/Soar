---
id: SOAR-FEATURE-MANUAL-ORDER
name: "Manual order execution"
type: feature
status: verified
layer: fullstack
module: manual-orders
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified]
---

# Manual order execution

| Field | Value |
| --- | --- |
| Description | Manual PAPER/LIVE order context placement validation lifecycle cancel and close mapping. |
| File path | docs/architecture/traceability-matrix.md |
| Related files | docs/modules/api-orders.md, docs/architecture/06_execution-lifecycle.md |
| Parent |  |
| Children | [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]], [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]], [[SOAR-SERVICE-ORDERS]], [[SOAR-DB-ORDER]] |
| Depends on | [[SOAR-FEATURE-DASHBOARD-RUNTIME]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related | [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]] |
| API related | [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | LIVE mutation remains approval-gated even when local implementation is verified. |

## Relations

- verified_by -> [[SOAR-TEST-ORDER-SERVICE]] (verified_local)
- verified_by -> [[SOAR-TEST-ORDER-POSITIONS-E2E]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-MANUAL-ORDER]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-ORDERS]] (partially_verified)
- verified_by -> [[SOAR-TEST-API-RESIDUAL-EVIDENCE]] (verified_local)
- context_for <- [[SOAR-FEATURE-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
