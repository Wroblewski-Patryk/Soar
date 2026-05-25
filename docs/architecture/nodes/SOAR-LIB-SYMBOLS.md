---
id: SOAR-LIB-SYMBOLS
name: "API symbols library"
type: utility
status: verified_local
layer: backend
module: api-lib
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Shared symbol utility.
tags: [soar-map, utility, backend, verified_local]
---

# API symbols library

| Field | Value |
| --- | --- |
| Description | Shared symbol normalization helpers used by markets runtime and exchange paths. |
| File path | apps/api/src/lib/symbols.ts |
| Related files | apps/api/src/lib/symbols.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-MARKETS]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-SERVICE-MARKET-CATALOG-SYMBOL-RESOLVER]], [[SOAR-SERVICE-RUNTIME-SYMBOL-CATALOG-RESOLVER]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-LIB-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[high]] |
| Notes |  |

## Relations

- used_by -> [[SOAR-SERVICE-MARKET-CATALOG-SYMBOL-RESOLVER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
