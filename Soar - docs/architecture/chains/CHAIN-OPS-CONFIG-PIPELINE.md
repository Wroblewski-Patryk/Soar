---
id: CHAIN-OPS-CONFIG-PIPELINE
type: function_chain
status: verified_local
feature: ops-config-pipeline
risk_level: high
last_verified_at: 2026-05-25
tags: [soar-map, function-chain, verified_local]
---

# Operations config and pipeline chain

- Feature: ops-config-pipeline
- Trigger: [[SOAR-CONFIG-ROOT-PACKAGE]]
- Tests: [[SOAR-TEST-GUARDRAILS]]
- Docs: [[SOAR-DOC-LOCAL-DEVELOPMENT]], [[SOAR-DOC-TESTING]], [[SOAR-DOC-COOLIFY-VPS]]
- Evidence: history/tasks/coolify-service-stack-migration-2026-05-25-task.md
- Missing links: Production Coolify stack deployment and protected proof remain separate

## Execution Chain

1. [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]]
2. [[SOAR-CONFIG-ROOT-PACKAGE]]
3. [[SOAR-CONFIG-PNPM-WORKSPACE]]
4. [[SOAR-CONFIG-API-PACKAGE]]
5. [[SOAR-CONFIG-WEB-PACKAGE]]
6. [[SOAR-CONFIG-MOBILE-PACKAGE]]
7. [[SOAR-CONFIG-SHARED-PACKAGE]]
8. [[SOAR-CONFIG-LOCAL-COMPOSE]]
9. [[SOAR-CONFIG-VPS-COMPOSE]]
10. [[SOAR-CONFIG-COOLIFY-STACK-COMPOSE]]
11. [[SOAR-PIPELINE-GITHUB-CI]]
12. [[SOAR-TEST-GUARDRAILS]]
13. [[SOAR-DOC-LOCAL-DEVELOPMENT]]
14. [[SOAR-DOC-TESTING]]
15. [[SOAR-DOC-COOLIFY-VPS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
