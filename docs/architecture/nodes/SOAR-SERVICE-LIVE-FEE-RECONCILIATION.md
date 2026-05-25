---
id: SOAR-SERVICE-LIVE-FEE-RECONCILIATION
name: "Live fee reconciliation service"
type: service
status: verified_local
layer: backend
module: exchange
feature: exchange-adapter
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Live fee reconciliation service

| Field | Value |
| --- | --- |
| Description | Reconciles live exchange fee and fill metadata after order execution. |
| File path | apps/api/src/modules/exchange/liveFeeReconciliation.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] |
| Used by | [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]], [[SOAR-SERVICE-ORDER-EXCHANGE-EVENTS]] |
| UI related |  |
| API related | [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]] |
| Database related | [[SOAR-DB-ORDER-FILL]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-LIVE-FEE-RECONCILIATION]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Fee source/pending truth must remain explicit. |

## Relations

- uses <- [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
