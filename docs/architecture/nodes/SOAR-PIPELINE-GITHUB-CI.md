---
id: SOAR-PIPELINE-GITHUB-CI
name: "GitHub CI workflow"
type: pipeline
status: verified_local
layer: ci
module: github-actions
feature: ops-config-pipeline
risk_level: 80
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: CI graph node; current change does not inspect remote run status.
tags: [soar-map, pipeline, ci, verified_local]
---

# GitHub CI workflow

| Field | Value |
| --- | --- |
| Description | GitHub Actions CI workflow for repository validation. |
| File path | .github/workflows/ci.yml |
| Related files | package.json, pnpm-workspace.yaml |
| Parent | [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-ROOT-PACKAGE]], [[SOAR-CONFIG-PNPM-WORKSPACE]], [[SOAR-CONFIG-API-PACKAGE]], [[SOAR-CONFIG-WEB-PACKAGE]], [[SOAR-CONFIG-MOBILE-PACKAGE]], [[SOAR-CONFIG-SHARED-PACKAGE]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-GUARDRAILS]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- executes -> [[SOAR-CONFIG-ROOT-PACKAGE]] (verified_local)
- executes -> [[SOAR-CONFIG-PNPM-WORKSPACE]] (verified_local)
- executes -> [[SOAR-TEST-GUARDRAILS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
