---
id: CHAIN-LOGS-AUDIT
type: function_chain
status: verified_local
feature: logs-audit
risk_level: high
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Logs Audit Trail evidence chain

- Feature: logs-audit
- Trigger: [[SOAR-PAGE-LOGS]]
- Tests: [[SOAR-TEST-LOGS-API]], [[SOAR-TEST-LOGS-WEB]]
- Docs: [[SOAR-DOC-API-LOGS]], [[SOAR-DOC-WEB-LOGS]]
- Evidence: docs/modules/api-logs.md;docs/modules/web-logs.md
- Missing links: Fresh authenticated browser proof and production action-produced readback remain separate

## Execution Chain

1. [[SOAR-FEATURE-LOGS-AUDIT]]
2. [[SOAR-PAGE-LOGS]]
3. [[SOAR-COMP-AUDIT-TRAIL-VIEW]]
4. [[SOAR-SERVICE-WEB-LOGS]]
5. [[SOAR-API-LOGS-LIST]]
6. [[SOAR-CONTROLLER-LOGS]]
7. [[SOAR-TYPES-LOGS]]
8. [[SOAR-SERVICE-LOGS]]
9. [[SOAR-DB-LOG]]
10. [[SOAR-FEATURE-PROFILE-API-KEYS]]
11. [[SOAR-FEATURE-BOT-SETUP]]
12. [[SOAR-TEST-LOGS-API]]
13. [[SOAR-TEST-LOGS-WEB]]
14. [[SOAR-DOC-API-LOGS]]
15. [[SOAR-DOC-WEB-LOGS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
