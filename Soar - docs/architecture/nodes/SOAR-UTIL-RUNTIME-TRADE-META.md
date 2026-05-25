---
id: SOAR-UTIL-RUNTIME-TRADE-META
name: "Dashboard runtime trade metadata"
type: utility
status: verified_local
layer: frontend
module: web-dashboard-home
feature: web-runtime-surfaces
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Dashboard runtime trade metadata

| Field | Value |
| --- | --- |
| Description | Runtime trade metadata helpers for dashboard trade and order presentation. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeTradeMeta.ts |
| Related files |  |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-DB-TRADE]], [[SOAR-DB-ORDER]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-TRADES]] |
| Database related | [[SOAR-DB-TRADE]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Trade metadata utility. |

## Relations

- uses <- [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
