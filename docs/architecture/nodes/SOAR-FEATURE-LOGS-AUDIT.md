---
id: SOAR-FEATURE-LOGS-AUDIT
name: "Logs Audit Trail feature"
type: feature
status: verified_local
layer: fullstack
module: logs
feature: logs-audit
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Logs Audit Trail feature

| Field | Value |
| --- | --- |
| Description | Authenticated audit-log read and trace inspection feature for operator activity. |
| File path | docs/modules/api-logs.md |
| Related files | docs/modules/web-logs.md |
| Parent |  |
| Children | [[SOAR-PAGE-LOGS]], [[SOAR-API-LOGS-LIST]], [[SOAR-SERVICE-LOGS]] |
| Depends on | [[SOAR-FEATURE-PROFILE-API-KEYS]], [[SOAR-FEATURE-BOT-SETUP]] |
| Used by | [[SOAR-FEATURE-PROFILE-API-KEYS]], [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-PAGE-LOGS]], [[SOAR-COMP-AUDIT-TRAIL-VIEW]] |
| API related | [[SOAR-API-LOGS-LIST]] |
| Database related | [[SOAR-DB-LOG]] |
| Tests related | [[SOAR-TEST-LOGS-API]], [[SOAR-TEST-LOGS-WEB]] |
| Docs related | [[SOAR-DOC-API-LOGS]], [[SOAR-DOC-WEB-LOGS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Dedicated Logs/Audit Trail chain backfilled across page component Web service API controller schema service DB tests and docs. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-LOGS]] (verified_local)
- observes -> [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)
- observes -> [[SOAR-FEATURE-BOT-SETUP]] (verified_local)
- verified_by -> [[SOAR-TEST-LOGS-API]] (verified_local)
- verified_by -> [[SOAR-TEST-LOGS-WEB]] (verified_local)
- documented_by -> [[SOAR-DOC-API-LOGS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-LOGS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
