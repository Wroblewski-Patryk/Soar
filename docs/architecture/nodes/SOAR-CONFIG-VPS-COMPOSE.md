---
id: SOAR-CONFIG-VPS-COMPOSE
name: "VPS docker compose topology"
type: config
status: verified_local
layer: operations
module: deployment
feature: ops-config-pipeline
risk_level: 85
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Deployment topology reference; protected production evidence remains separate.
tags: [soar-map, config, operations, verified_local]
---

# VPS docker compose topology

| Field | Value |
| --- | --- |
| Description | VPS/Coolify compose topology reference for deployed services. |
| File path | docker-compose.vps.yml |
| Related files | docker-compose.yml, docker-compose.coolify.yml |
| Parent | [[SOAR-FEATURE-OPS-CONFIG-PIPELINE]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-ROOT-PACKAGE]], [[SOAR-CONFIG-LOCAL-COMPOSE]] |
| Used by | [[SOAR-CONFIG-COOLIFY-STACK-COMPOSE]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-GUARDRAILS]] |
| Tests related | [[SOAR-DOC-COOLIFY-VPS]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- checks <- [[SOAR-TEST-GUARDRAILS]] (verified_local)
- parallels <- [[SOAR-CONFIG-LOCAL-COMPOSE]] (verified_local)
- describes <- [[SOAR-DOC-COOLIFY-VPS]] (verified_local)
- extends <- [[SOAR-CONFIG-COOLIFY-STACK-COMPOSE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
