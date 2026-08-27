---
id: CHAIN-API-PLATFORM-SAFETY
type: function_chain
status: verified_local
feature: api-platform-safety
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# API platform safety chain

- Feature: api-platform-safety
- Trigger: [[SOAR-CONFIG-RUNTIME-EXECUTION]]
- Tests: [[SOAR-TEST-API-PLATFORM-SAFETY]], [[SOAR-TEST-API-CONFIG-SAFETY]], [[SOAR-TEST-API-MIDDLEWARE-SAFETY]], [[SOAR-TEST-API-LIB-SAFETY]]
- Docs: [[SOAR-DOC-API-ROOT]], [[SOAR-DOC-LOCAL-DEVELOPMENT]], [[SOAR-DOC-TESTING]]
- Evidence: history/tasks/architecture-graph-api-platform-safety-backfill-2026-05-24-task.md
- Missing links: Fresh adversarial security review remains separate

## Execution Chain

1. [[SOAR-FEATURE-API-PLATFORM-SAFETY]]
2. [[SOAR-CONFIG-CRITICAL-SECRETS-READINESS]]
3. [[SOAR-CONFIG-PROXY-TRUST]]
4. [[SOAR-CONFIG-RUNTIME-EXECUTION]]
5. [[SOAR-LIB-ENV]]
6. [[SOAR-MIDDLEWARE-REQUIRE-AUTH]]
7. [[SOAR-MIDDLEWARE-RATE-LIMIT]]
8. [[SOAR-MIDDLEWARE-REQUEST-LOGGER]]
9. [[SOAR-MIDDLEWARE-OPS-NETWORK]]
10. [[SOAR-MIDDLEWARE-TRUSTED-ORIGIN]]
11. [[SOAR-MIDDLEWARE-ERROR-HANDLER]]
12. [[SOAR-LIB-ERRORS]]
13. [[SOAR-LIB-HTTP-ERROR-MAPPER]]
14. [[SOAR-LIB-LOGGER]]
15. [[SOAR-LIB-SYMBOLS]]
16. [[SOAR-ROUTER-API-ROOT]]
17. [[SOAR-TEST-API-PLATFORM-SAFETY]]
18. [[SOAR-TEST-API-CONFIG-SAFETY]]
19. [[SOAR-TEST-API-MIDDLEWARE-SAFETY]]
20. [[SOAR-TEST-API-LIB-SAFETY]]
21. [[SOAR-DOC-API-ROOT]]
22. [[SOAR-DOC-LOCAL-DEVELOPMENT]]
23. [[SOAR-DOC-TESTING]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
