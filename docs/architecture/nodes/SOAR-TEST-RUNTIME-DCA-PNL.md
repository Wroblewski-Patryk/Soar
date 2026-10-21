---
id: SOAR-TEST-RUNTIME-DCA-PNL
name: "Runtime DCA exchange PnL tests"
type: test
status: verified
layer: testing
module: bot-runtime
feature: runtime-dca-pnl
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, test, testing, verified]
---

# Runtime DCA exchange PnL tests

| Field | Value |
| --- | --- |
| Description | Regression proving exchange PnL threshold truth for DCA automation. |
| File path | apps/api/src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts |
| Related files | apps/api/src/modules/engine/positionManagement.service.test.ts, apps/api/src/modules/engine/runtimePaperBasicDcaPersistence.e2e.test.ts, apps/api/src/modules/engine/runtimePaperBacktestOneCycle.e2e.test.ts, apps/api/src/modules/engine/runtimePaperBacktestLeveragedCycle.e2e.test.ts, apps/api/src/modules/engine/runtimePaperFuturesBalanceProof.e2e.test.ts, apps/api/src/modules/engine/runtimeBinanceFuturesInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeGateFuturesInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeBinanceFuturesDcaSlInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeGateFuturesDcaSlInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeBinanceSpotDcaTpInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeGateSpotDcaTpInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeBinanceSpotDcaSlInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeGateSpotDcaSlInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeBinanceSpotUnfundedDcaSlInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeGateSpotUnfundedDcaSlInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeBinanceFuturesUnfundedDcaSlInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeGateFuturesUnfundedDcaSlInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeBinanceFuturesPositiveDcaTtpInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeBinanceFuturesNegativeDcaTslInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeGateFuturesPositiveDcaTtpInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeGateFuturesNegativeDcaTslInternalLiveCycle.e2e.test.ts, apps/api/src/modules/engine/runtimeGateFuturesThreeModeNegativeDcaTslParity.e2e.test.ts, apps/api/src/modules/engine/runtimeBinanceSpotThreeModeBasicDcaTpParity.e2e.test.ts |
| Parent | [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| Used by | [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| UI related |  |
| API related | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-POSITION-PNL-LIFECYCLE]] |
| Agent related |  |
| Notes | Production readback is separate. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
