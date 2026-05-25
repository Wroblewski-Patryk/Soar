---
id: SOAR-CONTROLLER-ICONS
name: "Icons controller"
type: controller
status: verified_local
layer: backend
module: api-icons
feature: api-support-routes
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Icons controller

| Field | Value |
| --- | --- |
| Description | Icons controller for lookup query parsing and response mapping. |
| File path | apps/api/src/modules/icons/icons.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-TYPES-ICONS]], [[SOAR-SERVICE-ICONS]] |
| Used by | [[SOAR-API-ICON-LOOKUP]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]] |
| Database related |  |
| Tests related | [[SOAR-TEST-ICONS-API]] |
| Docs related | [[SOAR-DOC-API-ICONS]] |
| Agent related |  |
| Notes | Controller boundary for icon lookup. |

## Relations

- calls -> [[SOAR-SERVICE-ICONS]] (verified_local)
- validates_with -> [[SOAR-TYPES-ICONS]] (verified_local)
- routes_to <- [[SOAR-API-ICON-LOOKUP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
