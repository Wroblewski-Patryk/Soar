---
id: CHAIN-BOT-SETUP
type: function_chain
status: verified_local
feature: bot-setup
risk_level: critical
last_verified_at: 2026-06-04
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
5. [[SOAR-PAGE-BOT-NEW-ALIAS]]
6. [[SOAR-PAGE-BOT-EDIT]]
7. [[SOAR-PAGE-BOT-PREVIEW]]
8. [[SOAR-PAGE-BOT-DETAIL-ALIAS]]
9. [[SOAR-COMP-BOT-FORM-PAGE-CONTENT]]
10. [[SOAR-COMP-BOT-CREATE-EDIT-FORM]]
11. [[SOAR-SERVICE-WEB-BOTS-API]]
12. [[SOAR-API-BOT-LIST]]
13. [[SOAR-API-BOT-GET]]
14. [[SOAR-API-BOT-CREATE]]
15. [[SOAR-API-BOT-UPDATE]]
16. [[SOAR-API-BOT-DELETE]]
17. [[SOAR-API-BOT-RUNTIME-GRAPH]]
18. [[SOAR-API-BOT-MARKET-GROUPS-LIST]]
19. [[SOAR-API-BOT-MARKET-GROUP-CREATE]]
20. [[SOAR-API-BOT-MARKET-GROUP-STRATEGY-ATTACH]]
21. [[SOAR-CONTROLLER-BOTS]]
22. [[SOAR-TYPES-BOTS]]
23. [[SOAR-SERVICE-BOTS]]
24. [[SOAR-SERVICE-BOT-CONTEXT-VALIDATION]]
25. [[SOAR-SERVICE-BOT-ACTIVATION-POLICY]]
26. [[SOAR-SERVICE-BOT-CANONICAL-UPDATE-SCOPE]]
27. [[SOAR-SERVICE-BOT-MARKET-GROUPS]]
28. [[SOAR-FEATURE-WALLETS]]
29. [[SOAR-FEATURE-PROFILE-API-KEYS]]
30. [[SOAR-DB-BOT]]
31. [[SOAR-DB-WALLET]]
32. [[SOAR-DB-API-KEY]]
33. [[SOAR-DB-STRATEGY]]
34. [[SOAR-DB-MARKET-UNIVERSE]]
35. [[SOAR-DB-BOT-MARKET-GROUP]]
36. [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]]
37. [[SOAR-TEST-BOT-SETUP-API]]
38. [[SOAR-TEST-BOT-SETUP-WEB]]
39. [[SOAR-DOC-API-BOTS]]
40. [[SOAR-DOC-WEB-BOTS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
