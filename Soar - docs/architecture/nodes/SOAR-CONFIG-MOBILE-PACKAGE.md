---
id: SOAR-CONFIG-MOBILE-PACKAGE
name: "Mobile package manifest"
type: config
status: verified_local
layer: tooling
module: mobile
feature: ops-config-pipeline
risk_level: 80
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Mobile remains scaffold-only per project state.
tags: [soar-map, config, tooling, verified_local]
---

# Mobile package manifest

| Field | Value |
| --- | --- |
| Description | Mobile package manifest for scaffold-only Expo/native package scope. |
| File path | apps/mobile/package.json |
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
