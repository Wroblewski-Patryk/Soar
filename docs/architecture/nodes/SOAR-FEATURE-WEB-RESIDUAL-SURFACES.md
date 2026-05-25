---
id: SOAR-FEATURE-WEB-RESIDUAL-SURFACES
name: "Web residual surfaces"
type: feature
status: verified_local
layer: frontend
module: web
feature: web-residual-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, frontend, verified_local]
---

# Web residual surfaces

| Field | Value |
| --- | --- |
| Description | Residual Web route hook service icon offline and strategy UI surfaces mapped from drift audit. |
| File path | docs/modules/web-bots.md |
| Related files | docs/modules/web-icons.md, docs/modules/web-shared.md |
| Parent |  |
| Children | [[SOAR-PAGE-BOT-NEW-ALIAS]], [[SOAR-PAGE-BOT-DETAIL-ALIAS]], [[SOAR-PAGE-OFFLINE]], [[SOAR-HOOK-BOTS-LIST-CONTROLLER]], [[SOAR-HOOK-BOTS-MONITORING-CONTROLLER]], [[SOAR-SERVICE-BOTS-MONITORING-AGGREGATE]], [[SOAR-HOOK-COIN-ICON-LOOKUP]], [[SOAR-SERVICE-WEB-ICONS]], [[SOAR-COMP-SORTABLE-THRESHOLD-LIST-EDITOR]] |
| Depends on | [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-STRATEGIES]], [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Used by | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related | [[SOAR-PAGE-BOTS-LIST]], [[SOAR-PAGE-BOT-RUNTIME]], [[SOAR-COMP-STRATEGY-FORM]] |
| API related | [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-ICON-LOOKUP]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]], [[SOAR-DOC-WEB-ICONS]], [[SOAR-DOC-WEB-SHARED]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled from remaining Web drift. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-BOT-NEW-ALIAS]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-BOT-DETAIL-ALIAS]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-OFFLINE]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-ICONS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-SHARED]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-BOTS]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-SHELL-UI]] (verified_local)
- has_ui_action -> [[SOAR-HOOK-CLOSE-RUNTIME-POSITION-ACTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
