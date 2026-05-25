---
id: SOAR-TYPES-ICONS
name: "Icons DTO schemas"
type: validation
status: verified_local
layer: backend
module: api-icons
feature: api-support-routes
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Icons DTO schemas

| Field | Value |
| --- | --- |
| Description | Icon lookup query schema for symbol lists and response shape. |
| File path | apps/api/src/modules/icons/icons.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-ICONS]] |
| Used by | [[SOAR-CONTROLLER-ICONS]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]] |
| Database related |  |
| Tests related | [[SOAR-TEST-ICONS-API]] |
| Docs related | [[SOAR-DOC-API-ICONS]] |
| Agent related |  |
| Notes | Validation boundary for icon lookup query. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-ICONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
