---
id: CHAIN-BOT-SETUP
type: function_chain
status: verified_local
feature: bot-setup
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Bot setup and canonical topology chain

- Feature: bot-setup
- Trigger: [[SOAR-FEATURE-BOT-SETUP]]
- Tests: [[SOAR-TEST-BOT-SETUP-API]], [[SOAR-TEST-BOT-SETUP-WEB]]
- Docs: [[SOAR-DOC-API-BOTS]], [[SOAR-DOC-WEB-BOTS]]
- Evidence: docs/modules/api-bots.md;docs/modules/web-bots.md
- Missing links: Fresh authenticated browser proof and LIVE activation proof remain separate

## Execution Chain

1. [[SOAR-FEATURE-BOT-SETUP]]
2. [[SOAR-PAGE-BOTS-LIST]]
3. [[SOAR-COMP-BOTS-LIST-TABLE]]
4. [[SOAR-PAGE-BOT-CREATE]]
5. [[SOAR-PAGE-BOT-EDIT]]
6. [[SOAR-PAGE-BOT-PREVIEW]]
7. [[SOAR-COMP-BOT-FORM-PAGE-CONTENT]]
8. [[SOAR-COMP-BOT-CREATE-EDIT-FORM]]
9. [[SOAR-SERVICE-WEB-BOTS-API]]
10. [[SOAR-API-BOT-LIST]]
11. [[SOAR-API-BOT-GET]]
12. [[SOAR-API-BOT-CREATE]]
13. [[SOAR-API-BOT-UPDATE]]
14. [[SOAR-API-BOT-DELETE]]
15. [[SOAR-API-BOT-RUNTIME-GRAPH]]
16. [[SOAR-API-BOT-MARKET-GROUPS-LIST]]
17. [[SOAR-API-BOT-MARKET-GROUP-CREATE]]
18. [[SOAR-API-BOT-MARKET-GROUP-STRATEGY-ATTACH]]
19. [[SOAR-CONTROLLER-BOTS]]
20. [[SOAR-TYPES-BOTS]]
21. [[SOAR-SERVICE-BOTS]]
22. [[SOAR-SERVICE-BOT-CONTEXT-VALIDATION]]
23. [[SOAR-SERVICE-BOT-ACTIVATION-POLICY]]
24. [[SOAR-SERVICE-BOT-CANONICAL-UPDATE-SCOPE]]
25. [[SOAR-SERVICE-BOT-MARKET-GROUPS]]
26. [[SOAR-FEATURE-WALLETS]]
27. [[SOAR-FEATURE-PROFILE-API-KEYS]]
28. [[SOAR-DB-BOT]]
29. [[SOAR-DB-WALLET]]
30. [[SOAR-DB-API-KEY]]
31. [[SOAR-DB-STRATEGY]]
32. [[SOAR-DB-MARKET-UNIVERSE]]
33. [[SOAR-DB-BOT-MARKET-GROUP]]
34. [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]]
35. [[SOAR-TEST-BOT-SETUP-API]]
36. [[SOAR-TEST-BOT-SETUP-WEB]]
37. [[SOAR-DOC-API-BOTS]]
38. [[SOAR-DOC-WEB-BOTS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
