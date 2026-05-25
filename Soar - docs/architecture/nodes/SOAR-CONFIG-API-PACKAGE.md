---
id: SOAR-CONFIG-API-PACKAGE
name: "API package manifest"
type: config
status: verified_local
layer: tooling
module: api
feature: ops-config-pipeline
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: API package script boundary.
tags: [soar-map, config, tooling, verified_local]
---

# API package manifest

| Field | Value |
| --- | --- |
| Description | API package manifest defining API scripts dependencies and test/typecheck entrypoints. |
| File path | apps/api/package.json |
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
| Agent related | [[critical]] |
| Notes |  |

## Relations

- includes <- [[SOAR-CONFIG-PNPM-WORKSPACE]] (verified_local)
- checks <- [[SOAR-TEST-GUARDRAILS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
