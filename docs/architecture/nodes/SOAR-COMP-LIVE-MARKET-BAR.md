---
id: SOAR-COMP-LIVE-MARKET-BAR
name: "LiveMarketBar"
type: component
status: verified_local
layer: frontend
module: web-dashboard-home
feature: dashboard-runtime
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# LiveMarketBar

| Field | Value |
| --- | --- |
| Description | Dashboard live market bar for selected runtime market status and stream context. |
| File path | apps/web/src/features/dashboard-home/components/LiveMarketBar.tsx |
| Related files | apps/web/src/features/dashboard-home/components/LiveMarketBar.test.tsx |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-MARKET-STREAM-FANOUT]], [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Dashboard market stream surface. |

## Relations

- observes -> [[SOAR-API-MARKET-STREAM-EVENTS]] (verified_local)
- verified_by -> [[SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB]] (verified_local)
- composes <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
