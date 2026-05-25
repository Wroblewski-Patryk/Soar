---
id: SOAR-PAGE-DASHBOARD
name: "Dashboard page"
type: page
status: partially_verified
layer: frontend
module: web-dashboard-home
feature: dashboard-runtime
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-23
verification_status: partially_verified
tags: [soar-map, page, frontend, partially_verified]
---

# Dashboard page

| Field | Value |
| --- | --- |
| Description | Authenticated dashboard home route and operator runtime surface. |
| File path | apps/web/src/app/dashboard/page.tsx |
| Related files | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx |
| Parent | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Requires authenticated browser proof after current public reachability is restored. |

## Relations

- contains -> [[SOAR-COMP-HOME-LIVE-WIDGETS]] (partially_verified)
- redirects_to <- [[SOAR-PAGE-POSITIONS-LEGACY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
