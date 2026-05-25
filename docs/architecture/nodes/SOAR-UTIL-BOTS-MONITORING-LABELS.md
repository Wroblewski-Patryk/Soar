---
id: SOAR-UTIL-BOTS-MONITORING-LABELS
name: "Bots monitoring runtime labels"
type: utility
status: verified_local
layer: frontend
module: web-bots
feature: web-runtime-surfaces
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Bots monitoring runtime labels

| Field | Value |
| --- | --- |
| Description | Bot monitoring runtime label helpers. |
| File path | apps/web/src/features/bots/components/bots-management/monitoringRuntimeLabels.ts |
| Related files |  |
| Parent | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| Children |  |
| Depends on | [[SOAR-DOC-WEB-BOTS]] |
| Used by | [[SOAR-COMP-BOTS-MONITORING-ATTRIBUTION-PILLS]], [[SOAR-COMP-MONITORING-FUTURE-SIGNALS]] |
| UI related | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Bot monitoring label utility. |

## Relations

- uses <- [[SOAR-COMP-BOTS-MONITORING-ATTRIBUTION-PILLS]] (verified_local)
- uses <- [[SOAR-COMP-MONITORING-FUTURE-SIGNALS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
