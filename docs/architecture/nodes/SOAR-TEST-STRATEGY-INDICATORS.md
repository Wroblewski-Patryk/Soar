---
id: SOAR-TEST-STRATEGY-INDICATORS
name: "Strategy indicators tests"
type: test
status: verified_local
layer: testing
module: api-strategies
feature: strategies
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Strategy indicators tests

| Field | Value |
| --- | --- |
| Description | Indicator catalog service tests for metadata shape and availability. |
| File path | apps/api/src/modules/strategies/indicators/indicators.service.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGY-INDICATORS]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Used by | [[SOAR-FEATURE-STRATEGIES]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-STRATEGY-INDICATORS]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Indicator catalog proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
