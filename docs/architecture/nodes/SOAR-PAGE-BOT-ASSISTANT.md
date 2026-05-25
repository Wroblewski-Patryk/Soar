---
id: SOAR-PAGE-BOT-ASSISTANT
name: "Bot assistant page"
type: page
status: verified_local
layer: frontend
module: web-bots
feature: ai-assistant-foundation
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Bot assistant page

| Field | Value |
| --- | --- |
| Description | Canonical selected-bot assistant configuration route. |
| File path | apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx |
| Related files | apps/web/src/app/dashboard/bots/assistant/page.tsx |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-COMP-BOTS-ASSISTANT-TAB]] |
| Used by | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| UI related | [[SOAR-COMP-BOTS-ASSISTANT-TAB]] |
| API related | [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]], [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related | [[SOAR-DB-BOT-ASSISTANT-CONFIG]], [[SOAR-DB-BOT-SUBAGENT-CONFIG]] |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Legacy assistant route redirects to this selected-bot route. |

## Relations

- renders -> [[SOAR-COMP-BOTS-MANAGEMENT]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
