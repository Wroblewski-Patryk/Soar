---
id: CHAIN-AUTH-SESSION-DEEP
type: function_chain
status: verified_local
feature: auth-session
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Auth session deep chain

- Feature: auth-session
- Trigger: [[SOAR-PAGE-LOGIN]]
- Tests: [[SOAR-TEST-WEB-AUTH-FORMS]], [[SOAR-TEST-WEB-AUTH-HOOKS]], [[SOAR-TEST-WEB-AUTH-CONTEXT]], [[SOAR-TEST-WEB-AUTH-PUBLIC]], [[SOAR-TEST-WEB-AUTH-FORM-TYPES]], [[SOAR-TEST-API-AUTH-SESSION-DEEP]], [[SOAR-TEST-API-AUTH-SERVICE]], [[SOAR-TEST-API-AUTH-COOKIE]], [[SOAR-TEST-API-AUTH-JWT]], [[SOAR-TEST-API-AUTH-ERRORS]]
- Docs: [[SOAR-DOC-API-AUTH]], [[SOAR-DOC-WEB-AUTH]]
- Evidence: history/tasks/architecture-graph-auth-session-deep-backfill-2026-05-24-task.md
- Missing links: Fresh production auth browser proof remains separate

## Execution Chain

1. [[SOAR-FEATURE-AUTH-SESSION]]
2. [[SOAR-PAGE-PUBLIC-HOME]]
3. [[SOAR-PAGE-LOGIN]]
4. [[SOAR-PAGE-REGISTER]]
5. [[SOAR-COMP-LOGIN-FORM]]
6. [[SOAR-COMP-REGISTER-FORM]]
7. [[SOAR-UI-PASSWORD-VISIBILITY-TOGGLE]]
8. [[SOAR-HOOK-USE-LOGIN-FORM]]
9. [[SOAR-HOOK-USE-REGISTER-FORM]]
10. [[SOAR-HOOK-USE-HYDRATION-READY]]
11. [[SOAR-CONTEXT-WEB-AUTH]]
12. [[SOAR-SERVICE-WEB-AUTH]]
13. [[SOAR-TYPES-WEB-AUTH-FORMS]]
14. [[SOAR-API-AUTH-LOGIN]]
15. [[SOAR-API-AUTH-REGISTER]]
16. [[SOAR-API-AUTH-ME]]
17. [[SOAR-API-AUTH-LOGOUT]]
18. [[SOAR-CONTROLLER-AUTH]]
19. [[SOAR-SERVICE-AUTH]]
20. [[SOAR-SERVICE-AUTH-COOKIE]]
21. [[SOAR-SERVICE-AUTH-JWT]]
22. [[SOAR-SERVICE-AUTH-ERRORS]]
23. [[SOAR-SERVICE-AUTH-SESSION-TOKEN]]
24. [[SOAR-TYPES-AUTH]]
25. [[SOAR-DB-USER]]
26. [[SOAR-TEST-WEB-AUTH-FORMS]]
27. [[SOAR-TEST-WEB-AUTH-HOOKS]]
28. [[SOAR-TEST-WEB-AUTH-CONTEXT]]
29. [[SOAR-TEST-WEB-AUTH-PUBLIC]]
30. [[SOAR-TEST-WEB-AUTH-FORM-TYPES]]
31. [[SOAR-TEST-API-AUTH-SESSION-DEEP]]
32. [[SOAR-TEST-API-AUTH-SERVICE]]
33. [[SOAR-TEST-API-AUTH-COOKIE]]
34. [[SOAR-TEST-API-AUTH-JWT]]
35. [[SOAR-TEST-API-AUTH-ERRORS]]
36. [[SOAR-DOC-API-AUTH]]
37. [[SOAR-DOC-WEB-AUTH]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
