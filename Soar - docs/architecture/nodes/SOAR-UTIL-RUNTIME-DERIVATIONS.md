---
id: SOAR-UTIL-RUNTIME-DERIVATIONS
name: "Dashboard runtime derivations"
type: utility
status: verified_local
layer: frontend
module: web-dashboard-home
feature: web-runtime-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Dashboard runtime derivations

| Field | Value |
| --- | --- |
| Description | Dashboard runtime derivation helpers for runtime display state. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts |
| Related files | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Used by | [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]], [[SOAR-COMP-RUNTIME-SIDEBAR-SECTION]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME-HELPERS]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Runtime derivation helper. |

## Relations

- uses <- [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]] (verified_local)
- uses <- [[SOAR-HOOK-RUNTIME-SELECTION-VIEWMODEL]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
