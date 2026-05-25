---
id: SOAR-DB-BOT-ASSISTANT-CONFIG
name: "BotAssistantConfig model"
type: database_model
status: verified_local
layer: data
module: bots
feature: ai-assistant-foundation
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, database_model, data, verified_local]
---

# BotAssistantConfig model

| Field | Value |
| --- | --- |
| Description | BotAssistantConfig model for main assistant settings per bot. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-USER]] |
| Used by | [[SOAR-SERVICE-BOT-ASSISTANT]], [[SOAR-FEATURE-BOT-SETUP]] |
| UI related | [[SOAR-COMP-BOTS-ASSISTANT-TAB]] |
| API related | [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]], [[SOAR-API-BOT-ASSISTANT-DRY-RUN]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-AI-ASSISTANT-API]] |
| Docs related | [[SOAR-DOC-ASSISTANT-RUNTIME]] |
| Agent related |  |
| Notes | Main assistant config persistence. |

## Relations

- reads_writes <- [[SOAR-SERVICE-BOT-ASSISTANT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
