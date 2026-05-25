---
id: CHAIN-OPS-CONFIG-PIPELINE
type: function_chain
status: verified_local
feature: ops-config-pipeline
risk_level: high
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Operations config and pipeline chain

- Feature: ops-config-pipeline
- Trigger: [[SOAR-CONFIG-ROOT-PACKAGE]]
- Tests: [[SOAR-TEST-GUARDRAILS]]
- Docs: [[SOAR-DOC-LOCAL-DEVELOPMENT]], [[SOAR-DOC-TESTING]], [[SOAR-DOC-COOLIFY-VPS]]
- Evidence: history/tasks/architecture-graph-ops-config-pipeline-backfill-2026-05-24-task.md
- Missing links: Remote CI run status and protected production deployment proof remain separate

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
10. [[SOAR-PIPELINE-GITHUB-CI]]
11. [[SOAR-TEST-GUARDRAILS]]
12. [[SOAR-DOC-LOCAL-DEVELOPMENT]]
13. [[SOAR-DOC-TESTING]]
14. [[SOAR-DOC-COOLIFY-VPS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
