---
id: SOAR-CONFIG-LOCAL-COMPOSE
name: "Local docker compose topology"
type: config
status: verified_local
layer: operations
module: local-dev
feature: ops-config-pipeline
risk_level: 85
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Local infra topology is validated by existing guardrails and local proof tasks.
tags: [soar-map, config, operations, verified_local]
---

# Local docker compose topology

| Field | Value |
| --- | --- |
| Description | Local compose topology for development infrastructure services. |
| File path | docker-compose.yml |
| Related files | docker-compose.vps.yml |
| Parent | [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-ROOT-PACKAGE]] |
| Used by | [[SOAR-CONFIG-VPS-COMPOSE]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-GUARDRAILS]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Docs related |  |
| Agent related | [[high]] |
| Notes |  |

## Relations

- parallels -> [[SOAR-CONFIG-VPS-COMPOSE]] (verified_local)
- checks <- [[SOAR-TEST-GUARDRAILS]] (verified_local)
- describes <- [[SOAR-DOC-LOCAL-DEVELOPMENT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
