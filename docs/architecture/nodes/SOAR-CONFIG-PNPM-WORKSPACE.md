---
id: SOAR-CONFIG-PNPM-WORKSPACE
name: "pnpm workspace manifest"
type: config
status: verified_local
layer: tooling
module: workspace
feature: ops-config-pipeline
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Workspace shape used by pnpm filtered commands.
tags: [soar-map, config, tooling, verified_local]
---

# pnpm workspace manifest

| Field | Value |
| --- | --- |
| Description | Workspace package boundary manifest for API Web mobile and shared packages. |
| File path | pnpm-workspace.yaml |
| Related files | package.json |
| Parent | [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-ROOT-PACKAGE]] |
| Used by | [[SOAR-CONFIG-API-PACKAGE]], [[SOAR-CONFIG-WEB-PACKAGE]], [[SOAR-CONFIG-MOBILE-PACKAGE]], [[SOAR-CONFIG-SHARED-PACKAGE]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-GUARDRAILS]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Docs related |  |
| Agent related | [[high]] |
| Notes |  |

## Relations

- includes -> [[SOAR-CONFIG-API-PACKAGE]] (verified_local)
- includes -> [[SOAR-CONFIG-WEB-PACKAGE]] (verified_local)
- includes -> [[SOAR-CONFIG-MOBILE-PACKAGE]] (verified_local)
- includes -> [[SOAR-CONFIG-SHARED-PACKAGE]] (verified_local)
- uses <- [[SOAR-CONFIG-ROOT-PACKAGE]] (verified_local)
- executes <- [[SOAR-PIPELINE-GITHUB-CI]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
