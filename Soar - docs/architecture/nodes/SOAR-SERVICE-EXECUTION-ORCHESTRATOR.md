---
id: SOAR-SERVICE-EXECUTION-ORCHESTRATOR
name: "Execution orchestrator"
type: service
status: verified
layer: backend
module: api-engine
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, service, backend, verified]
---

# Execution orchestrator

| Field | Value |
| --- | --- |
| Description | Runtime/manual execution orchestrator path for submitted close reuse and live lifecycle truth. |
| File path | apps/api/src/modules/engine/executionOrchestrator.service.ts |
| Related files | apps/api/src/modules/engine/executionOrchestrator.helpers.ts |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ORDERS]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-SERVICE-ORDERS]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDERS]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-ORDER-POSITIONS-E2E]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Submitted close dedupe truth is covered here. |

## Relations

- uses <- [[SOAR-SERVICE-ORDERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
