---
id: SOAR-COMP-BOTS-MONITORING-PROTECTION-CELL
name: "BotsMonitoringProtectionCell"
type: component
status: verified_local
layer: frontend
module: web-bots
feature: web-runtime-surfaces
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# BotsMonitoringProtectionCell

| Field | Value |
| --- | --- |
| Description | Bot monitoring protection-state cell for DCA TP SL TTP TSL display. |
| File path | apps/web/src/features/bots/components/bots-management/BotsMonitoringProtectionCell.tsx |
| Related files |  |
| Parent | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| Children |  |
| Depends on | [[SOAR-UTIL-BOTS-MONITORING-FORMATTERS]] |
| Used by | [[SOAR-COMP-BOTS-MONITORING-SECTIONS]] |
| UI related | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Protection-state UI cell. |

## Relations

- composes <- [[SOAR-COMP-BOTS-MONITORING-SECTIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
