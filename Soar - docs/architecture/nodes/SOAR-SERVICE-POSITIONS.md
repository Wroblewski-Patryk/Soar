---
id: SOAR-SERVICE-POSITIONS
name: "Positions service"
type: service
status: verified_local
layer: backend
module: api-positions
feature: positions
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Positions service

| Field | Value |
| --- | --- |
| Description | Position repository service for list get manual updates snapshots takeover status rebind and orphan repair. |
| File path | apps/api/src/modules/positions/positions.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-CONTROLLER-POSITIONS]], [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-POSITIONS-SERVICE]], [[SOAR-TEST-POSITIONS-SNAPSHOT]], [[SOAR-TEST-POSITIONS-TAKEOVER-ORPHAN]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Core service node for positions backfill. |

## Relations

- reads_writes -> [[SOAR-DB-POSITION]] (verified_local)
- uses -> [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)
- uses -> [[SOAR-SERVICE-POSITION-SNAPSHOT-NORMALIZATION]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] (verified_local)
- delegates <- [[SOAR-CONTROLLER-POSITIONS]] (verified_local)
- uses <- [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
