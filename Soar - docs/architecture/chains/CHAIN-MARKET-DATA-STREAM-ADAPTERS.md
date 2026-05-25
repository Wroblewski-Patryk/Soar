---
id: CHAIN-MARKET-DATA-STREAM-ADAPTERS
type: function_chain
status: verified_local
feature: market-data-stream-adapters
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Market data and stream adapters chain

- Feature: market-data-stream-adapters
- Trigger: [[SOAR-SERVICE-MARKET-DATA]]
- Tests: [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]]
- Docs: [[SOAR-DOC-API-MARKETS]], [[SOAR-DOC-API-MARKET-STREAM]], [[SOAR-DOC-EXCHANGE-OWNERSHIP]]
- Evidence: history/tasks/architecture-graph-market-data-stream-adapters-backfill-2026-05-24-task.md
- Missing links: Fresh live exchange stream proof remains separate

## Execution Chain

1. [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]]
2. [[SOAR-SERVICE-BINANCE-PUBLIC-REST]]
3. [[SOAR-SERVICE-BINANCE-USER-DATA-STREAM]]
4. [[SOAR-SERVICE-CCXT-SPOT-CONNECTOR]]
5. [[SOAR-SERVICE-MARKET-DATA]]
6. [[SOAR-SERVICE-INDICATOR-ADAPTER]]
7. [[SOAR-SERVICE-BINANCE-STREAM]]
8. [[SOAR-SERVICE-MARKET-STREAM]]
9. [[SOAR-SERVICE-MARKET-STREAM-FANOUT]]
10. [[SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS]]
11. [[SOAR-SERVICE-IMPORTED-POSITION-HISTORY-HYDRATOR]]
12. [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]]
13. [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]]
14. [[SOAR-DB-POSITION]]
15. [[SOAR-DB-TRADE]]
16. [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]]
17. [[SOAR-DOC-API-MARKETS]]
18. [[SOAR-DOC-API-MARKET-STREAM]]
19. [[SOAR-DOC-EXCHANGE-OWNERSHIP]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
