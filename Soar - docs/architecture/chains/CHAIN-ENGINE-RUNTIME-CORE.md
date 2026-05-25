---
id: CHAIN-ENGINE-RUNTIME-CORE
type: function_chain
status: verified_local
feature: engine-runtime-core
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Engine runtime core chain

- Feature: engine-runtime-core
- Trigger: [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]]
- Tests: [[SOAR-TEST-ENGINE-RUNTIME-CORE]]
- Docs: [[SOAR-DOC-EXECUTION-LIFECYCLE]], [[SOAR-DOC-API-BOTS]]
- Evidence: history/tasks/architecture-graph-engine-runtime-core-backfill-2026-05-24-task.md
- Missing links: Fresh end-to-end runtime journey and protected LIVE exchange mutation proof remain separate

## Execution Chain

1. [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]]
2. [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]]
3. [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]]
4. [[SOAR-SERVICE-RUNTIME-TOPOLOGY-CACHE]]
5. [[SOAR-SERVICE-RUNTIME-FINAL-CANDLE-DECISION]]
6. [[SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD]]
7. [[SOAR-SERVICE-RUNTIME-EXECUTION-DEDUPE]]
8. [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]]
9. [[SOAR-SERVICE-RUNTIME-ORDER-LIFETIME]]
10. [[SOAR-SERVICE-RUNTIME-POSITION-LIFETIME]]
11. [[SOAR-SERVICE-RUNTIME-METRICS]]
12. [[SOAR-SERVICE-RUNTIME-TELEMETRY]]
13. [[SOAR-SERVICE-SIMULATOR]]
14. [[SOAR-SERVICE-PAPER-RUNTIME]]
15. [[SOAR-SERVICE-PRETRADE-RISK]]
16. [[SOAR-SERVICE-RULE-EVALUATOR]]
17. [[SOAR-SERVICE-RUNTIME-AUTOMATION]]
18. [[SOAR-FEATURE-EXCHANGE-ADAPTER]]
19. [[SOAR-DB-BOT]]
20. [[SOAR-DB-RUNTIME-SESSION]]
21. [[SOAR-DB-POSITION]]
22. [[SOAR-DB-ORDER]]
23. [[SOAR-DB-TRADE]]
24. [[SOAR-TEST-ENGINE-RUNTIME-CORE]]
25. [[SOAR-DOC-EXECUTION-LIFECYCLE]]
26. [[SOAR-DOC-API-BOTS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
