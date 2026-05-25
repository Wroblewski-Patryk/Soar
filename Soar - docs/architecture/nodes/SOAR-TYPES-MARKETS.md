---
id: SOAR-TYPES-MARKETS
name: "Market universe DTO schemas"
type: validation
status: verified_local
layer: backend
module: api-markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Market universe DTO schemas

| Field | Value |
| --- | --- |
| Description | Market universe create update and catalog query schemas with symbol normalization contract. |
| File path | apps/api/src/modules/markets/markets.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-MARKETS]] |
| Used by | [[SOAR-CONTROLLER-MARKETS]], [[SOAR-SERVICE-MARKETS]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-MARKETS-API]] |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | DTO boundary normalizes market universe inputs. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
