---
id: CHAIN-PROFILE-API-KEYS
type: function_chain
status: verified_local
feature: profile-api-keys
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Profile API Keys credential lifecycle chain

- Feature: profile-api-keys
- Trigger: [[SOAR-FEATURE-PROFILE-API-KEYS]]
- Tests: [[SOAR-TEST-PROFILE-API-KEYS-API]], [[SOAR-TEST-PROFILE-API-KEY-PROBE]], [[SOAR-TEST-PROFILE-API-KEYS-WEB]]
- Docs: [[SOAR-DOC-API-PROFILE]], [[SOAR-DOC-WEB-PROFILE]]
- Evidence: docs/modules/api-profile.md;docs/modules/web-profile.md
- Missing links: Fresh authenticated browser proof and secret-bearing production probe proof remain separate

## Execution Chain

1. [[SOAR-FEATURE-PROFILE-API-KEYS]]
2. [[SOAR-PAGE-PROFILE]]
3. [[SOAR-COMP-API-KEYS-LIST]]
4. [[SOAR-COMP-API-KEY-FORM]]
5. [[SOAR-HOOK-USE-API-KEYS]]
6. [[SOAR-SERVICE-WEB-API-KEYS]]
7. [[SOAR-API-PROFILE-APIKEY-LIST]]
8. [[SOAR-API-PROFILE-APIKEY-CREATE]]
9. [[SOAR-API-PROFILE-APIKEY-UPDATE]]
10. [[SOAR-API-PROFILE-APIKEY-DELETE]]
11. [[SOAR-API-PROFILE-APIKEY-TEST]]
12. [[SOAR-API-PROFILE-APIKEY-STORED-TEST]]
13. [[SOAR-API-PROFILE-APIKEY-ROTATE]]
14. [[SOAR-API-PROFILE-APIKEY-REVOKE]]
15. [[SOAR-CONTROLLER-PROFILE-API-KEYS]]
16. [[SOAR-TYPES-PROFILE-API-KEYS]]
17. [[SOAR-SERVICE-PROFILE-API-KEYS]]
18. [[SOAR-SERVICE-PROFILE-API-KEY-PROBE]]
19. [[SOAR-SERVICE-EXCHANGE-API-KEY-PROBE-CLIENT]]
20. [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]]
21. [[SOAR-FEATURE-EXCHANGE-ADAPTER]]
22. [[SOAR-DB-API-KEY]]
23. [[SOAR-DB-LOG]]
24. [[SOAR-DB-USER]]
25. [[SOAR-FEATURE-WALLETS]]
26. [[SOAR-API-WALLET-PREVIEW-BALANCE]]
27. [[SOAR-FEATURE-BOT-RUNTIME]]
28. [[SOAR-TEST-PROFILE-API-KEYS-API]]
29. [[SOAR-TEST-PROFILE-API-KEY-PROBE]]
30. [[SOAR-TEST-PROFILE-API-KEYS-WEB]]
31. [[SOAR-DOC-API-PROFILE]]
32. [[SOAR-DOC-WEB-PROFILE]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
