---
id: SOAR-PAGE-POSITIONS-LEGACY
name: "Legacy /dashboard/positions route"
type: page
status: verified_local
layer: frontend
module: web-positions
feature: positions
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-12
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Legacy /dashboard/positions route

| Field | Value |
| --- | --- |
| Description | Legacy positions route redirected to canonical runtime positions surface. |
| File path | apps/web/src/middleware.ts |
| Related files | apps/web/src/app/dashboard/bots/runtime/page.tsx, apps/web/src/middleware.test.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-DOC-DASHBOARD-ROUTE-MAP]] |
| Used by | [[SOAR-PAGE-DASHBOARD]] |
| UI related | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| API related |  |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WEB-POSITIONS]] |
| Docs related | [[SOAR-DOC-WEB-POSITIONS]] |
| Agent related |  |
| Notes | Dedicated positions page is intentionally not a primary V1 surface. |

## Relations

- redirects_to -> [[SOAR-PAGE-DASHBOARD]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
