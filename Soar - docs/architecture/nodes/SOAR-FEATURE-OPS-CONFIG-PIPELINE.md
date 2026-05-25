---
id: SOAR-FEATURE-OPS-CONFIG-PIPELINE
name: "Operations config and pipeline feature"
type: feature
status: verified_local
layer: operations
module: ops
feature: ops-config-pipeline
risk_level: 80
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Config/pipeline graph backfill only; no runtime behavior changed.
tags: [soar-map, feature, operations, verified_local]
---

# Operations config and pipeline feature

| Field | Value |
| --- | --- |
| Description | Repository workspace package manifests compose topology and CI pipeline configuration surface. |
| File path | docs/engineering/local-development.md |
| Related files | docs/operations/coolify-linux-vps-setup-guide.md, docs/operations/post-deploy-smoke-checklist.md |
| Parent |  |
| Children | [[SOAR-CONFIG-ROOT-PACKAGE]], [[SOAR-CONFIG-PNPM-WORKSPACE]], [[SOAR-CONFIG-API-PACKAGE]], [[SOAR-CONFIG-WEB-PACKAGE]], [[SOAR-CONFIG-MOBILE-PACKAGE]], [[SOAR-CONFIG-SHARED-PACKAGE]], [[SOAR-CONFIG-LOCAL-COMPOSE]], [[SOAR-CONFIG-VPS-COMPOSE]], [[SOAR-PIPELINE-GITHUB-CI]] |
| Depends on | [[SOAR-DOC-LOCAL-DEVELOPMENT]], [[SOAR-DOC-COOLIFY-VPS]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-GUARDRAILS]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]], [[SOAR-DOC-COOLIFY-VPS]] |
| Docs related | [[SOAR-AGENT-COORDINATOR]] |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- has_source -> [[SOAR-CONFIG-ROOT-PACKAGE]] (verified_local)
- documented_by -> [[SOAR-DOC-LOCAL-DEVELOPMENT]] (verified_local)
- documented_by -> [[SOAR-DOC-TESTING]] (verified_local)
- documented_by -> [[SOAR-DOC-COOLIFY-VPS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
