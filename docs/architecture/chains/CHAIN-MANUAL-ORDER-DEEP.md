---
id: CHAIN-MANUAL-ORDER-DEEP
type: function_chain
status: verified_local
feature: manual-order
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Manual order deep execution chain

- Feature: manual-order
- Trigger: [[SOAR-COMP-HOME-LIVE-WIDGETS]]
- Tests: [[SOAR-TEST-WEB-MANUAL-ORDER]], [[SOAR-TEST-ORDER-SERVICE]], [[SOAR-TEST-ORDER-POSITIONS-E2E]], [[SOAR-TEST-ORDER-QUANTITY-RULES]], [[SOAR-TEST-ORDER-EXCHANGE-EVENTS]]
- Docs: [[SOAR-DOC-WEB-ORDERS]], [[SOAR-DOC-API-ORDERS]], [[SOAR-DOC-EXECUTION-LIFECYCLE]]
- Evidence: history/audits/live-exchange-execution-parity-2026-05-23-task.md
- Missing links: Protected production manual/bot readback and approval-gated LIVE mutation proof

## Execution Chain

1. [[SOAR-COMP-HOME-LIVE-WIDGETS]]
2. [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]]
3. [[SOAR-SERVICE-WEB-BOTS-API]]
4. [[SOAR-API-MANUAL-CONTEXT]]
5. [[SOAR-API-ORDER-OPEN]]
6. [[SOAR-CONTROLLER-ORDERS]]
7. [[SOAR-TYPES-ORDERS]]
8. [[SOAR-SERVICE-ORDERS]]
9. [[SOAR-SERVICE-MANUAL-CONTEXT]]
10. [[SOAR-SERVICE-ORDER-QUANTITY-RULES]]
11. [[SOAR-SERVICE-PRETRADE]]
12. [[SOAR-FEATURE-EXCHANGE-ADAPTER]]
13. [[SOAR-SERVICE-EXECUTION-ORCHESTRATOR]]
14. [[SOAR-SERVICE-ORDER-LIFECYCLE]]
15. [[SOAR-SERVICE-ORDER-EXCHANGE-EVENTS]]
16. [[SOAR-DB-ORDER]]
17. [[SOAR-DB-ORDER-FILL]]
18. [[SOAR-DB-POSITION]]
19. [[SOAR-DB-TRADE]]
20. [[SOAR-TEST-WEB-MANUAL-ORDER]]
21. [[SOAR-TEST-ORDER-SERVICE]]
22. [[SOAR-TEST-ORDER-POSITIONS-E2E]]
23. [[SOAR-TEST-ORDER-QUANTITY-RULES]]
24. [[SOAR-TEST-ORDER-EXCHANGE-EVENTS]]
25. [[SOAR-DOC-WEB-ORDERS]]
26. [[SOAR-DOC-API-ORDERS]]
27. [[SOAR-DOC-EXECUTION-LIFECYCLE]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
