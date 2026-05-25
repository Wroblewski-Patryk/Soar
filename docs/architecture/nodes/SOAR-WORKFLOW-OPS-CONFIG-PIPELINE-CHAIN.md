---
id: SOAR-WORKFLOW-OPS-CONFIG-PIPELINE-CHAIN
name: "Operations config and pipeline workflow"
type: workflow
status: verified_local
layer: operations
module: ops
feature: ops-config-pipeline
risk_level: 85
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Backfill workflow node for operations config and pipeline slice.
tags: [soar-map, workflow, operations, verified_local]
---

# Operations config and pipeline workflow

| Field | Value |
| --- | --- |
| Description | Workflow from workspace manifests through package scripts compose topology CI and guardrail proof. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-OPS-CONFIG-PIPELINE.md |
| Parent | [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-ROOT-PACKAGE]], [[SOAR-CONFIG-PNPM-WORKSPACE]], [[SOAR-PIPELINE-GITHUB-CI]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-GUARDRAILS]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]], [[SOAR-DOC-COOLIFY-VPS]] |
| Docs related | [[SOAR-AGENT-COORDINATOR]] |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
