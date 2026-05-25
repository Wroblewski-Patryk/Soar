---
id: SOAR-TEST-GUARDRAILS
name: "Repository guardrails test"
type: test
status: verified_local
layer: testing
module: quality
feature: ops-config-pipeline
risk_level: 90
completion_percent: 2026-05-25
last_verified_at: verified_local
verification_status: Quality gate used by this graph mission.
tags: [soar-map, test, testing, verified_local]
---

# Repository guardrails test

| Field | Value |
| --- | --- |
| Description | Repository guardrails command covering lockfile source budgets Docker env and secret-argv policy. |
| File path | scripts/repoGuardrails.mjs |
| Related files | scripts/repoGuardrails.test.mjs |
| Parent | [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-ROOT-PACKAGE]], [[SOAR-CONFIG-API-PACKAGE]], [[SOAR-CONFIG-WEB-PACKAGE]], [[SOAR-CONFIG-LOCAL-COMPOSE]], [[SOAR-CONFIG-VPS-COMPOSE]], [[SOAR-CONFIG-COOLIFY-STACK-COMPOSE]] |
| Used by | [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-GUARDRAILS]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- checks -> [[SOAR-CONFIG-API-PACKAGE]] (verified_local)
- checks -> [[SOAR-CONFIG-WEB-PACKAGE]] (verified_local)
- checks -> [[SOAR-CONFIG-LOCAL-COMPOSE]] (verified_local)
- checks -> [[SOAR-CONFIG-VPS-COMPOSE]] (verified_local)
- defines_command <- [[SOAR-CONFIG-ROOT-PACKAGE]] (verified_local)
- executes <- [[SOAR-PIPELINE-GITHUB-CI]] (verified_local)
- verified_by <- [[SOAR-CONFIG-COOLIFY-STACK-COMPOSE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
