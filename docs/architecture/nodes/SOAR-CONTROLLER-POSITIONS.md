---
id: SOAR-CONTROLLER-POSITIONS
name: "Positions controller"
type: controller
status: verified_local
layer: backend
module: api-positions
feature: positions
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Positions controller

| Field | Value |
| --- | --- |
| Description | Express controller for positions list read live status exchange snapshot takeover rebind orphan repair management mode and manual update routes. |
| File path | apps/api/src/modules/positions/positions.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children | [[SOAR-API-POSITION-LIST]], [[SOAR-API-POSITION-GET]], [[SOAR-API-POSITION-LIVE-STATUS]], [[SOAR-API-POSITION-EXCHANGE-SNAPSHOT]], [[SOAR-API-POSITION-TAKEOVER-STATUS]], [[SOAR-API-POSITION-TAKEOVER-REBIND]], [[SOAR-API-POSITION-ORPHAN-REPAIR]], [[SOAR-API-POSITION-MANAGEMENT-MODE]], [[SOAR-API-POSITION-MANUAL-UPDATE]] |
| Depends on | [[SOAR-TYPES-POSITIONS]], [[SOAR-SERVICE-POSITIONS]], [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| Used by | [[SOAR-FEATURE-POSITIONS]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-LIST]], [[SOAR-API-POSITION-EXCHANGE-SNAPSHOT]], [[SOAR-API-POSITION-MANUAL-UPDATE]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-POSITIONS-SERVICE]], [[SOAR-TEST-POSITIONS-SNAPSHOT]], [[SOAR-TEST-POSITIONS-TAKEOVER-ORPHAN]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Controller keeps user auth and typed error mapping at API boundary. |

## Relations

- validates_with -> [[SOAR-TYPES-POSITIONS]] (verified_local)
- delegates -> [[SOAR-SERVICE-POSITIONS]] (verified_local)
- uses -> [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] (verified_local)
- delegates <- [[SOAR-API-POSITION-LIST]] (verified_local)
- delegates <- [[SOAR-API-POSITION-GET]] (verified_local)
- delegates <- [[SOAR-API-POSITION-LIVE-STATUS]] (verified_local)
- delegates <- [[SOAR-API-POSITION-EXCHANGE-SNAPSHOT]] (verified_local)
- delegates <- [[SOAR-API-POSITION-TAKEOVER-STATUS]] (verified_local)
- delegates <- [[SOAR-API-POSITION-TAKEOVER-REBIND]] (verified_local)
- delegates <- [[SOAR-API-POSITION-ORPHAN-REPAIR]] (verified_local)
- delegates <- [[SOAR-API-POSITION-MANAGEMENT-MODE]] (verified_local)
- delegates <- [[SOAR-API-POSITION-MANUAL-UPDATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
