---
id: SOAR-CONFIG-ROOT-PACKAGE
name: "Root package manifest"
type: config
status: verified_local
layer: tooling
module: workspace
feature: ops-config-pipeline
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, config, tooling, verified_local]
---

# Root package manifest

| Field | Value |
| --- | --- |
| Description | Root package manifest defining workspace scripts quality gates graph commands and orchestration entrypoints. |
| File path | package.json |
| Related files | pnpm-workspace.yaml |
| Parent | [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-PNPM-WORKSPACE]] |
| Used by | [[SOAR-CONFIG-API-PACKAGE]], [[SOAR-CONFIG-WEB-PACKAGE]], [[SOAR-CONFIG-MOBILE-PACKAGE]], [[SOAR-CONFIG-SHARED-PACKAGE]] |
| UI related |  |
| API related | [[SOAR-PIPELINE-GITHUB-CI]] |
| Database related |  |
| Tests related | [[SOAR-TEST-GUARDRAILS]] |
| Docs related | [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Agent related |  |
| Notes | Root command source includes architecture graph generation and drift audit scripts. |

## Relations

- uses -> [[SOAR-CONFIG-PNPM-WORKSPACE]] (verified_local)
- defines_command -> [[SOAR-TEST-GUARDRAILS]] (verified_local)
- has_source <- [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] (verified_local)
- executes <- [[SOAR-PIPELINE-GITHUB-CI]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
