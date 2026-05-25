---
id: SOAR-SERVICE-BACKTEST-DATA-GATEWAY
name: "Backtest data gateway"
type: service
status: verified_local
layer: backend
module: api-backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Backtest data gateway

| Field | Value |
| --- | --- |
| Description | Backtest candle and supplemental market data gateway. |
| File path | apps/api/src/modules/backtests/backtestDataGateway.ts |
| Related files | apps/api/src/modules/backtests/backtestDataGateway.test.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-SERVICE-BACKTEST-RUN-JOB]], [[SOAR-SERVICE-BACKTEST-REPLAY-CORE]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-BACKTEST-REPLAY]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Market data gateway boundary. |

## Relations

- uses <- [[SOAR-SERVICE-BACKTEST-RUN-JOB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
