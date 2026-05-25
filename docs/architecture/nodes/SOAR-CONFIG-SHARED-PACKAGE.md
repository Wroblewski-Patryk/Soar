---
id: SOAR-CONFIG-SHARED-PACKAGE
name: "Shared package manifest"
type: config
status: verified_local
layer: tooling
module: shared
feature: ops-config-pipeline
risk_level: 85
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Shared workspace package boundary.
tags: [soar-map, config, tooling, verified_local]
---

# Shared package manifest

| Field | Value |
| --- | --- |
| Description | Shared library package manifest for workspace-level shared contracts. |
| File path | libs/shared/package.json |
| Related files | package.json, pnpm-workspace.yaml |
| Parent | [[SOAR-CONFIG-PNPM-WORKSPACE]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-ROOT-PACKAGE]], [[SOAR-CONFIG-PNPM-WORKSPACE]] |
| Used by | [[SOAR-PIPELINE-GITHUB-CI]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-GUARDRAILS]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Docs related |  |
| Agent related | [[medium]] |
| Notes |  |

## Relations

- includes <- [[SOAR-CONFIG-PNPM-WORKSPACE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
