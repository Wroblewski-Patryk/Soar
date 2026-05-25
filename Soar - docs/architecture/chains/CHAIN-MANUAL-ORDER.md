---
id: CHAIN-MANUAL-ORDER
type: function_chain
status: verified_local
feature: manual-order
risk_level: critical
last_verified_at: 2026-05-23
tags: [soar-map, function-chain, verified_local]
---

# Manual order execution chain

- Feature: manual-order
- Trigger: [[SOAR-COMP-HOME-LIVE-WIDGETS]]
- Tests: [[SOAR-TEST-MANUAL-ORDER]]
- Docs: [[SOAR-DOC-EXECUTION-LIFECYCLE]], [[SOAR-DOC-API-ORDERS]]
- Evidence: history/audits/live-exchange-execution-parity-2026-05-23-task.md
- Missing links: Approval-gated LIVE mutation proof

## Execution Chain

1. [[SOAR-COMP-HOME-LIVE-WIDGETS]]
2. [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]]
3. [[SOAR-API-MANUAL-CONTEXT]]
4. [[SOAR-API-ORDER-OPEN]]
5. [[SOAR-SERVICE-ORDERS]]
6. [[SOAR-FEATURE-EXCHANGE-ADAPTER]]
7. [[SOAR-DB-ORDER]]
8. [[SOAR-DB-POSITION]]
9. [[SOAR-DB-TRADE]]
10. [[SOAR-TEST-MANUAL-ORDER]]
11. [[SOAR-DOC-EXECUTION-LIFECYCLE]]
12. [[SOAR-DOC-API-ORDERS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
