---
id: CHAIN-BOT-RUNTIME-CORE
type: function_chain
status: verified_local
feature: bot-runtime
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Bot Runtime monitoring core chain

- Feature: bot-runtime
- Trigger: [[SOAR-PAGE-BOT-RUNTIME]]
- Tests: [[SOAR-TEST-BOT-RUNTIME-API]], [[SOAR-TEST-BOT-RUNTIME-WEB]]
- Docs: [[SOAR-DOC-API-BOTS]], [[SOAR-DOC-WEB-BOTS]]
- Evidence: history/audits/bots-runtime-truth-audit-2026-05-19.md
- Missing links: Fresh authenticated production runtime readback remains separate

## Execution Chain

1. [[SOAR-PAGE-BOT-RUNTIME]]
2. [[SOAR-COMP-BOTS-MANAGEMENT]]
3. [[SOAR-SERVICE-WEB-BOTS-API]]
4. [[SOAR-API-BOT-RUNTIME-AGGREGATE]]
5. [[SOAR-API-BOT-RUNTIME-SESSIONS]]
6. [[SOAR-API-BOT-RUNTIME-SESSION-GET]]
7. [[SOAR-API-BOT-RUNTIME-SYMBOL-STATS]]
8. [[SOAR-API-BOT-RUNTIME-POSITIONS]]
9. [[SOAR-API-BOT-RUNTIME-TRADES]]
10. [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]]
11. [[SOAR-CONTROLLER-BOTS]]
12. [[SOAR-TYPES-BOTS]]
13. [[SOAR-SERVICE-RUNTIME-AGGREGATE]]
14. [[SOAR-SERVICE-RUNTIME-SESSIONS]]
15. [[SOAR-SERVICE-RUNTIME-SYMBOL-STATS]]
16. [[SOAR-SERVICE-RUNTIME-POSITIONS-READ]]
17. [[SOAR-SERVICE-RUNTIME-TRADES]]
18. [[SOAR-SERVICE-RUNTIME-POSITION-COMMAND]]
19. [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]]
20. [[SOAR-SERVICE-RUNTIME-AUTOMATION]]
21. [[SOAR-FEATURE-EXCHANGE-ADAPTER]]
22. [[SOAR-DB-RUNTIME-SESSION]]
23. [[SOAR-DB-POSITION]]
24. [[SOAR-DB-ORDER]]
25. [[SOAR-DB-TRADE]]
26. [[SOAR-TEST-BOT-RUNTIME-API]]
27. [[SOAR-TEST-BOT-RUNTIME-WEB]]
28. [[SOAR-DOC-API-BOTS]]
29. [[SOAR-DOC-WEB-BOTS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
