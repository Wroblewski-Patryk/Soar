---
id: SOAR-TEST-AI-ASSISTANT-WEB
name: "AI Assistant Web tests"
type: test
status: verified_local
layer: testing
module: web-bots
feature: ai-assistant-foundation
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# AI Assistant Web tests

| Field | Value |
| --- | --- |
| Description | Bot assistant route and UI tests for selected-bot assistant configuration surfaces. |
| File path | apps/web/src/app/dashboard/bots/[id]/assistant/page.test.tsx |
| Related files | apps/web/src/app/dashboard/bots/assistant/page.test.tsx, apps/web/src/features/bots/components/BotsManagement.test.tsx |
| Parent | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| Children |  |
| Depends on | [[SOAR-PAGE-BOT-ASSISTANT]], [[SOAR-COMP-BOTS-ASSISTANT-TAB]], [[SOAR-HOOK-BOTS-ASSISTANT-CONTROLLER]] |
| Used by | [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] |
| UI related | [[SOAR-PAGE-BOT-ASSISTANT]], [[SOAR-COMP-BOTS-ASSISTANT-TAB]] |
| API related | [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]] |
| Database related | [[SOAR-DB-BOT-ASSISTANT-CONFIG]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Primary assistant Web proof. |

## Relations

- verifies -> [[SOAR-COMP-BOTS-ASSISTANT-TAB]] (verified_local)
- verified_by <- [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
