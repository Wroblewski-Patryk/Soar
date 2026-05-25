---
id: CHAIN-REPORTS
type: function_chain
status: verified_local
feature: reports
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Reports performance evidence chain

- Feature: reports
- Trigger: [[SOAR-PAGE-REPORTS]]
- Tests: [[SOAR-TEST-REPORTS-API]], [[SOAR-TEST-REPORTS-WEB]]
- Docs: [[SOAR-DOC-API-REPORTS]], [[SOAR-DOC-WEB-REPORTS]]
- Evidence: docs/modules/api-reports.md;docs/modules/web-reports.md
- Missing links: Fresh authenticated browser proof and production report readback remain separate

## Execution Chain

1. [[SOAR-FEATURE-REPORTS]]
2. [[SOAR-PAGE-REPORTS]]
3. [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]]
4. [[SOAR-SERVICE-WEB-REPORTS]]
5. [[SOAR-SERVICE-WEB-BACKTESTS]]
6. [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]]
7. [[SOAR-API-BACKTEST-RUN-LIST]]
8. [[SOAR-API-BACKTEST-RUN-REPORT]]
9. [[SOAR-CONTROLLER-REPORTS]]
10. [[SOAR-SERVICE-REPORTS]]
11. [[SOAR-SERVICE-REPORT-MODE-AGGREGATOR]]
12. [[SOAR-DB-BACKTEST-REPORT]]
13. [[SOAR-DB-BACKTEST-TRADE]]
14. [[SOAR-DB-TRADE]]
15. [[SOAR-DB-BOT]]
16. [[SOAR-FEATURE-BACKTESTS]]
17. [[SOAR-TEST-REPORTS-API]]
18. [[SOAR-TEST-REPORTS-WEB]]
19. [[SOAR-DOC-API-REPORTS]]
20. [[SOAR-DOC-WEB-REPORTS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
