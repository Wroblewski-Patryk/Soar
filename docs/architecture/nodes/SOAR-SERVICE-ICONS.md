---
id: SOAR-SERVICE-ICONS
name: "Icons lookup service"
type: service
status: verified_local
layer: backend
module: api-icons
feature: api-support-routes
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Icons lookup service

| Field | Value |
| --- | --- |
| Description | Coin icon lookup service used by the icon route. |
| File path | apps/api/src/modules/icons/icons.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-TYPES-ICONS]] |
| Used by | [[SOAR-CONTROLLER-ICONS]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]] |
| Database related |  |
| Tests related | [[SOAR-TEST-ICONS-API]] |
| Docs related | [[SOAR-DOC-API-ICONS]] |
| Agent related |  |
| Notes | Service boundary for deterministic icon metadata lookup. |

## Relations

- calls <- [[SOAR-CONTROLLER-ICONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
