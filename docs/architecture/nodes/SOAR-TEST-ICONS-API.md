---
id: SOAR-TEST-ICONS-API
name: "Icons API tests"
type: test
status: verified_local
layer: testing
module: api-icons
feature: api-support-routes
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Icons API tests

| Field | Value |
| --- | --- |
| Description | Icon lookup API e2e tests. |
| File path | apps/api/src/modules/icons/icons.e2e.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-API-ICON-LOOKUP]], [[SOAR-SERVICE-ICONS]] |
| Used by | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-SUPPORT-ROUTES]] |
| Docs related | [[SOAR-DOC-API-ICONS]] |
| Agent related |  |
| Notes | Primary icon route proof. |

## Relations

- verified_by <- [[SOAR-API-ICON-LOOKUP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
