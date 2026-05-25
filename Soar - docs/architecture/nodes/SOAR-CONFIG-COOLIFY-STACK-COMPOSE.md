---
id: SOAR-CONFIG-COOLIFY-STACK-COMPOSE
name: "Coolify Service Stack compose topology"
type: config
status: verified_local
layer: operations
module: deployment
feature: ops-config-pipeline
risk_level: 70
completion_percent: 2026-05-25
last_verified_at: verified_local
verification_status: Compose config validates locally; production Coolify deployment and protected smoke remain pending.
tags: [soar-map, config, operations, verified_local]
---

# Coolify Service Stack compose topology

| Field | Value |
| --- | --- |
| Description | Production-oriented Coolify Service Stack manifest for API Web and split worker app processes using external production Postgres and Redis. |
| File path | docker-compose.coolify.yml |
| Related files | .env.coolify.example, docker-compose.vps.yml, docker-compose.coolify.shared-api-image.yml |
| Parent | [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-VPS-COMPOSE]], [[SOAR-DOC-COOLIFY-VPS]] |
| Used by | [[SOAR-PIPELINE-GITHUB-CI]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-GUARDRAILS]] |
| Tests related | [[SOAR-DOC-COOLIFY-VPS]] |
| Docs related | [[SOAR-AGENT-COORDINATOR]] |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- extends -> [[SOAR-CONFIG-VPS-COMPOSE]] (verified_local)
- verified_by -> [[SOAR-TEST-GUARDRAILS]] (verified_local)
- has_source <- [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] (verified_local)
- describes <- [[SOAR-DOC-COOLIFY-VPS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
