---
id: CHAIN-AUTH-SESSION
type: function_chain
status: verified
feature: auth-session
risk_level: high
last_verified_at: 2026-05-14
tags: [soar-map, function-chain, verified]
---

# Auth session login chain

- Feature: auth-session
- Trigger: [[SOAR-PAGE-LOGIN]]
- Tests: [[SOAR-TEST-AUTH-SESSION]]
- Docs: [[SOAR-DOC-TRACEABILITY]], [[SOAR-DOC-API-AUTH]], [[SOAR-DOC-WEB-AUTH]]
- Evidence: history/evidence/prod-auth-session-browser-proof-84711599-2026-05-14.md
- Missing links: none recorded

## Execution Chain

1. [[SOAR-PAGE-LOGIN]]
2. [[SOAR-COMP-LOGIN-FORM]]
3. [[SOAR-API-AUTH-LOGIN]]
4. [[SOAR-DB-USER]]
5. [[SOAR-API-AUTH-ME]]
6. [[SOAR-TEST-AUTH-SESSION]]
7. [[SOAR-DOC-API-AUTH]]
8. [[SOAR-DOC-WEB-AUTH]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
