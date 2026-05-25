---
id: SOAR-TEST-DASHBOARD-RUNTIME-SIGNALS
name: "Dashboard runtime signals tests"
type: test
status: verified_local
layer: testing
module: web-dashboard-home
feature: web-runtime-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Dashboard runtime signals tests

| Field | Value |
| --- | --- |
| Description | Dashboard runtime signals section tests. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx |
| Related files |  |
| Parent | [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]] |
| Used by | [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Dashboard runtime signal proof. |

## Relations

- verified_by <- [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
