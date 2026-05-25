---
id: SOAR-CONFIG-PROXY-TRUST
name: "Proxy trust config"
type: config
status: verified_local
layer: backend
module: api-config
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Proxy trust platform config.
tags: [soar-map, config, backend, verified_local]
---

# Proxy trust config

| Field | Value |
| --- | --- |
| Description | Proxy trust configuration for deployed API request handling. |
| File path | apps/api/src/config/proxyTrust.ts |
| Related files | apps/api/src/config/proxyTrust.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-ROOT]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-CONFIG-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[high]] |
| Notes |  |

## Relations

- uses <- [[SOAR-MIDDLEWARE-TRUSTED-ORIGIN]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
