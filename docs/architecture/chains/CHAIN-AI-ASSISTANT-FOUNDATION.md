---
id: CHAIN-AI-ASSISTANT-FOUNDATION
type: function_chain
status: verified_local
feature: ai-assistant-foundation
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# AI Assistant foundation chain

- Feature: ai-assistant-foundation
- Trigger: [[SOAR-PAGE-BOT-ASSISTANT]]
- Tests: [[SOAR-TEST-AI-ASSISTANT-API]], [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]], [[SOAR-TEST-AI-ASSISTANT-WEB]], [[SOAR-TEST-AI-PROTOCOL-HARNESS]]
- Docs: [[SOAR-DOC-ASSISTANT-RUNTIME]], [[SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT]], [[SOAR-DOC-AI-TESTING-PROTOCOL]], [[SOAR-DOC-AI-INTEGRATION]]
- Evidence: history/tasks/ai-assistant-foundation-protocol-harness-2026-05-23-task.md
- Missing links: Hot-path runtime AI trading remains deferred and requires separate red-team proof

## Execution Chain

1. [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]]
2. [[SOAR-PAGE-BOT-ASSISTANT]]
3. [[SOAR-COMP-BOTS-MANAGEMENT]]
4. [[SOAR-COMP-BOTS-ASSISTANT-TAB]]
5. [[SOAR-HOOK-BOTS-ASSISTANT-CONTROLLER]]
6. [[SOAR-SERVICE-WEB-BOTS-API]]
7. [[SOAR-API-BOT-ASSISTANT-CONFIG-GET]]
8. [[SOAR-API-BOT-ASSISTANT-CONFIG-UPSERT]]
9. [[SOAR-API-BOT-SUBAGENT-UPSERT]]
10. [[SOAR-API-BOT-SUBAGENT-DELETE]]
11. [[SOAR-API-BOT-ASSISTANT-DRY-RUN]]
12. [[SOAR-CONTROLLER-BOTS]]
13. [[SOAR-TYPES-BOTS]]
14. [[SOAR-SERVICE-BOT-ASSISTANT]]
15. [[SOAR-SERVICE-ASSISTANT-ORCHESTRATOR]]
16. [[SOAR-DB-BOT-ASSISTANT-CONFIG]]
17. [[SOAR-DB-BOT-SUBAGENT-CONFIG]]
18. [[SOAR-DB-BOT]]
19. [[SOAR-TEST-AI-ASSISTANT-API]]
20. [[SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR]]
21. [[SOAR-TEST-AI-ASSISTANT-WEB]]
22. [[SOAR-TEST-AI-PROTOCOL-HARNESS]]
23. [[SOAR-DOC-ASSISTANT-RUNTIME]]
24. [[SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT]]
25. [[SOAR-DOC-AI-TESTING-PROTOCOL]]
26. [[SOAR-DOC-AI-INTEGRATION]]
27. [[SOAR-AGENT-AI-RED-TEAM]]
28. [[SOAR-PROMPT-AI-RED-TEAM]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
