---
id: SOAR-SERVICE-WEB-BOTS-API
name: "Web bots/order API service"
type: service
status: verified
layer: frontend
module: web-bots
feature: manual-order
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, service, frontend, verified]
---

# Web bots/order API service

| Field | Value |
| --- | --- |
| Description | Web service layer used by dashboard runtime surfaces for bot runtime and order-related API calls. |
| File path | apps/web/src/features/bots/services/bots.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]], [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-ORDER-CLOSE]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-ORDER-OPEN]], [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-ORDER-CLOSE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-WEB-ORDERS]] |
| Agent related |  |
| Notes | Web client boundary for manual/open-order actions. |

## Relations

- calls -> [[SOAR-API-ORDER-OPEN]] (verified_local)
- calls -> [[SOAR-API-ORDER-CANCEL]] (verified_local)
- calls -> [[SOAR-API-ORDER-CLOSE]] (verified_local)
- calls -> [[SOAR-API-BOT-RUNTIME-AGGREGATE]] (verified_local)
- calls -> [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] (verified_local)
- calls -> [[SOAR-API-BOT-LIST]] (verified_local)
- calls -> [[SOAR-API-BOT-GET]] (verified_local)
- calls -> [[SOAR-API-BOT-CREATE]] (verified_local)
- calls -> [[SOAR-API-BOT-UPDATE]] (verified_local)
- calls -> [[SOAR-API-BOT-DELETE]] (verified_local)
- calls -> [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]] (verified_local)
- calls -> [[SOAR-API-BOT-ASSISTANT-CONFIG-UPSERT]] (verified_local)
- calls -> [[SOAR-API-BOT-SUBAGENT-UPSERT]] (verified_local)
- calls -> [[SOAR-API-BOT-SUBAGENT-DELETE]] (verified_local)
- calls -> [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] (verified_local)
- calls -> [[SOAR-API-BOT-RUNTIME-AGGREGATE]] (verified_local)
- calls -> [[SOAR-API-BOT-RUNTIME-POSITIONS]] (verified_local)
- uses <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (verified_local)
- uses <- [[SOAR-COMP-BOTS-MANAGEMENT]] (verified_local)
- calls <- [[SOAR-COMP-BOTS-LIST-TABLE]] (verified_local)
- calls <- [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] (verified_local)
- calls <- [[SOAR-HOOK-BOTS-ASSISTANT-CONTROLLER]] (verified_local)
- calls <- [[SOAR-COMP-BOTS-MONITORING-TAB]] (verified_local)
- calls <- [[SOAR-HOOK-BOTS-LIST-CONTROLLER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
