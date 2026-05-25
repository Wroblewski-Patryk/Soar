---
id: SOAR-TEST-WEB-POSITIONS
name: "Web positions tests"
type: test
status: verified_local
layer: testing
module: web-positions
feature: positions
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Web positions tests

| Field | Value |
| --- | --- |
| Description | Middleware legacy redirect and Dashboard/Bot runtime position surface tests. |
| File path | apps/web/src/middleware.test.ts |
| Related files | apps/web/src/app/dashboard/bots/runtime/page.test.tsx, apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-PAGE-POSITIONS-LEGACY]], [[SOAR-WEB-POSITIONS-SERVICE]], [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| Used by | [[SOAR-FEATURE-POSITIONS]] |
| UI related | [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| API related | [[SOAR-API-POSITION-MANUAL-UPDATE]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-POSITIONS]] |
| Agent related |  |
| Notes | Visible positions UX is embedded in runtime surfaces. |

## Relations

- verified_by <- [[SOAR-FEATURE-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
