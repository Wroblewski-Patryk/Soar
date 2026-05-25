---
id: SOAR-FEATURE-WEB-RUNTIME-SURFACES
name: "Web runtime surfaces"
type: feature
status: verified_local
layer: frontend
module: web-runtime
feature: web-runtime-surfaces
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, frontend, verified_local]
---

# Web runtime surfaces

| Field | Value |
| --- | --- |
| Description | Dashboard runtime and bot monitoring UI sections helpers labels formatters future signals onboarding sidebar and portfolio history surfaces. |
| File path | docs/modules/web-dashboard-home.md |
| Related files | docs/modules/web-bots.md |
| Parent |  |
| Children | [[SOAR-COMP-RUNTIME-SIDEBAR-SECTION]], [[SOAR-COMP-RUNTIME-ONBOARDING-SECTION]], [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]], [[SOAR-COMP-BOTS-MONITORING-TAB]], [[SOAR-COMP-MONITORING-FUTURE-SIGNALS]], [[SOAR-COMP-BOTS-PORTFOLIO-HISTORY-SECTION]] |
| Depends on | [[SOAR-FEATURE-DASHBOARD-RUNTIME]], [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]], [[SOAR-FEATURE-POSITIONS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]], [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]], [[SOAR-DOC-WEB-BOTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled from Web component/test drift around runtime surfaces. |

## Relations

- extends -> [[SOAR-COMP-HOME-LIVE-WIDGETS]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-RUNTIME-SURFACES]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-DASHBOARD-HOME]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-BOTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
