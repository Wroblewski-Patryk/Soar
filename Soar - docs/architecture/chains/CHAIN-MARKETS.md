---
id: CHAIN-MARKETS
type: function_chain
status: verified_local
feature: markets
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Market universe authoring and catalog chain

- Feature: markets
- Trigger: [[SOAR-FEATURE-MARKETS]]
- Tests: [[SOAR-TEST-MARKETS-API]], [[SOAR-TEST-MARKETS-WEB]]
- Docs: [[SOAR-DOC-API-MARKETS]], [[SOAR-DOC-WEB-MARKETS]]
- Evidence: docs/modules/api-markets.md;docs/modules/web-markets.md
- Missing links: Fresh authenticated browser proof and production market mutation proof remain separate

## Execution Chain

1. [[SOAR-FEATURE-MARKETS]]
2. [[SOAR-PAGE-MARKETS-LIST]]
3. [[SOAR-COMP-MARKET-UNIVERSES-TABLE]]
4. [[SOAR-PAGE-MARKET-CREATE]]
5. [[SOAR-PAGE-MARKET-EDIT]]
6. [[SOAR-COMP-MARKET-UNIVERSE-FORM]]
7. [[SOAR-COMP-MARKET-SEARCHABLE-MULTISELECT]]
8. [[SOAR-SERVICE-WEB-MARKETS]]
9. [[SOAR-SERVICE-MARKET-UNIVERSE-HELPERS]]
10. [[SOAR-API-MARKET-UNIVERSE-LIST]]
11. [[SOAR-API-MARKET-UNIVERSE-GET]]
12. [[SOAR-API-MARKET-CATALOG]]
13. [[SOAR-API-MARKET-UNIVERSE-CREATE]]
14. [[SOAR-API-MARKET-UNIVERSE-UPDATE]]
15. [[SOAR-API-MARKET-UNIVERSE-DELETE]]
16. [[SOAR-CONTROLLER-MARKETS]]
17. [[SOAR-TYPES-MARKETS]]
18. [[SOAR-SERVICE-MARKETS]]
19. [[SOAR-SERVICE-MARKET-CATALOG-SYMBOL-RESOLVER]]
20. [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]]
21. [[SOAR-DB-MARKET-UNIVERSE]]
22. [[SOAR-DB-SYMBOL-GROUP]]
23. [[SOAR-DB-BOT]]
24. [[SOAR-DB-BOT-MARKET-GROUP]]
25. [[SOAR-FEATURE-BOT-SETUP]]
26. [[SOAR-FEATURE-BOT-RUNTIME]]
27. [[SOAR-TEST-MARKETS-API]]
28. [[SOAR-TEST-MARKETS-WEB]]
29. [[SOAR-DOC-API-MARKETS]]
30. [[SOAR-DOC-WEB-MARKETS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
