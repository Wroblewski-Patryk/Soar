---
id: SOAR-TYPES-POSITIONS
name: "Positions DTO and contract schemas"
type: model
status: verified_local
layer: backend
module: api-positions
feature: positions
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, model, backend, verified_local]
---

# Positions DTO and contract schemas

| Field | Value |
| --- | --- |
| Description | Zod schemas and DTO contracts for position filters management mode and manual parameter updates. |
| File path | apps/api/src/modules/positions/positions.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-POSITIONS]] |
| Used by | [[SOAR-CONTROLLER-POSITIONS]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-POSITIONS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-POSITIONS-SERVICE]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | DTO boundary normalizes symbols and manual update payloads. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
