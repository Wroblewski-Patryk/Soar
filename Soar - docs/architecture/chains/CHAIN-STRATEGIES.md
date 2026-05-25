---
id: CHAIN-STRATEGIES
type: function_chain
status: verified_local
feature: strategies
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Strategy authoring and indicator catalog chain

- Feature: strategies
- Trigger: [[SOAR-FEATURE-STRATEGIES]]
- Tests: [[SOAR-TEST-STRATEGIES-API]], [[SOAR-TEST-STRATEGY-INDICATORS]], [[SOAR-TEST-STRATEGIES-WEB]], [[SOAR-TEST-STRATEGY-FORM-UTILS]]
- Docs: [[SOAR-DOC-API-STRATEGIES]], [[SOAR-DOC-WEB-STRATEGIES]]
- Evidence: docs/modules/api-strategies.md;docs/modules/web-strategies.md
- Missing links: Fresh authenticated browser proof and production strategy mutation proof remain separate

## Execution Chain

1. [[SOAR-FEATURE-STRATEGIES]]
2. [[SOAR-PAGE-STRATEGIES-LIST]]
3. [[SOAR-COMP-STRATEGIES-LIST]]
4. [[SOAR-PAGE-STRATEGY-CREATE]]
5. [[SOAR-PAGE-STRATEGY-EDIT]]
6. [[SOAR-PAGE-STRATEGY-ID-ROOT]]
7. [[SOAR-COMP-STRATEGY-FORM]]
8. [[SOAR-COMP-STRATEGY-FORM-SECTIONS]]
9. [[SOAR-COMP-STRATEGY-PRESET-PICKER]]
10. [[SOAR-SERVICE-WEB-STRATEGIES]]
11. [[SOAR-SERVICE-STRATEGY-FORM-MAPPER]]
12. [[SOAR-SERVICE-STRATEGY-PRESETS]]
13. [[SOAR-API-STRATEGY-LIST]]
14. [[SOAR-API-STRATEGY-GET]]
15. [[SOAR-API-STRATEGY-CREATE]]
16. [[SOAR-API-STRATEGY-UPDATE]]
17. [[SOAR-API-STRATEGY-DELETE]]
18. [[SOAR-API-STRATEGY-IMPORT]]
19. [[SOAR-API-STRATEGY-EXPORT]]
20. [[SOAR-API-STRATEGY-INDICATORS]]
21. [[SOAR-CONTROLLER-STRATEGIES]]
22. [[SOAR-TYPES-STRATEGIES]]
23. [[SOAR-SERVICE-STRATEGIES]]
24. [[SOAR-SERVICE-STRATEGY-CONFIG-VALIDATION]]
25. [[SOAR-SERVICE-STRATEGY-INDICATORS]]
26. [[SOAR-DB-STRATEGY]]
27. [[SOAR-DB-BOT]]
28. [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]]
29. [[SOAR-FEATURE-BOT-SETUP]]
30. [[SOAR-FEATURE-BOT-RUNTIME]]
31. [[SOAR-TEST-STRATEGIES-API]]
32. [[SOAR-TEST-STRATEGY-INDICATORS]]
33. [[SOAR-TEST-STRATEGIES-WEB]]
34. [[SOAR-TEST-STRATEGY-FORM-UTILS]]
35. [[SOAR-DOC-API-STRATEGIES]]
36. [[SOAR-DOC-WEB-STRATEGIES]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
