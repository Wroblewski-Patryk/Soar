# Workers And Runtime Operations Audit - 2026-05-19

## Metadata

| Field | Value |
| --- | --- |
| Audit ID | `AUD-08` |
| Registry family | Workers And Runtime Operations |
| Stage | verification |
| Environment | local |
| Status | current local / current historical production-safe protected runtime proof |
| Production journey | not run |
| LIVE exchange mutation | not run |
| Exchange-side mutation | not run |
| Existing production data mutation | not run |

## Scope

This audit compares current worker/runtime operations behavior with documented
architecture and operations contracts for:

- split/inline worker ownership and topology,
- protected worker health/readiness and `/ready` diagnostics,
- runtime freshness pass/fail/skip behavior,
- market-stream source config, subscriptions, fanout, routes, and retry,
- Exchange polling and Binance stream parsing,
- queue tuning and backtest job persistence,
- runtime-flow telemetry and execution orchestration.

Canonical references:

- `docs/analysis/reusable-audit-registry.md`
- `docs/architecture/02_system-topology.md`
- `docs/architecture/codebase-map.md`
- `docs/operations/deployment-readiness-gates.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

## Evidence Run

| Proof | Result | Evidence |
| --- | --- | --- |
| Focused API worker/runtime operations pack | PASS | `corepack pnpm --filter api exec vitest run src/workers/workerOwnership.test.ts src/workers/marketStreamWorkerConfig.test.ts src/workers/marketStreamSubscriptions.service.test.ts src/router/workers-health-readiness.test.ts src/router/workers-runtime-freshness.test.ts src/router/health-readiness.test.ts src/queue/queueTuning.test.ts src/modules/market-stream/marketStreamFanout.test.ts src/modules/market-stream/marketStream.routes.e2e.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts src/modules/market-stream/exchangePollingStream.service.test.ts src/modules/market-stream/exchangePollingStream.fanout.test.ts src/modules/market-stream/binanceStream.service.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestRunQueue.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtime-flow.e2e.test.ts`; `17` files, `85` tests. |
| Expected failover stderr | PASS / expected | `marketStreamFanout.test.ts` intentionally simulates an initial Redis startup failure (`redis_booting`) and verifies retry behavior. |
| Local DB/Redis lifecycle | PASS | `corepack pnpm run go-live:infra:up` before DB-backed API tests and `corepack pnpm run go-live:infra:down` after proof. |

## Architecture-To-Code Parity

| Contract Area | Current Implementation Truth | Parity |
| --- | --- | --- |
| Worker ownership/topology | Worker ownership tests cover split/inline process ownership rules and candidate workers. | aligned |
| Health/readiness | Worker health/readiness and global `/ready` tests cover protected diagnostics and fail-closed readiness behavior. | aligned |
| Runtime freshness | Runtime freshness tests cover pass/fail/skip states for worker heartbeat, market data, runtime signal lag, and runtime sessions. | aligned |
| Market stream | Source config, subscription service, fanout retry, SSE route contracts, exchange polling fanout, and Binance stream parsing tests passed. | aligned |
| Queue/job processing | Queue tuning, backtest queue, and backtest job persistence tests passed. | aligned |
| Runtime telemetry | Runtime-flow and execution orchestrator tests passed, covering PAPER runtime lifecycle and orchestration behavior. | aligned |

## Findings

| ID | Severity | Status | Finding | Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| `AUD-WRK-004` | P1 | open freshness follow-up | Fresh production protected worker/process proof was not rerun. Historical production proof remains accepted for deployed `457bce05`. | `history/releases/v1-release-gate-prod-457bce05-2026-05-14-full-ready.md`; `history/evidence/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`; this audit's local pack. | Refresh production-safe protected worker/process proof after future deployments or worker topology changes. |
| `AUD-WRK-005` | P1 | explicit exclusion | Gate.io/second-LIVE production runtime shape remains deferred/outside the verified release slice. | Module confidence ledger and exchange capability audits. | Do not claim broader multi-LIVE production runtime proof until planned and explicitly approved. |
| `AUD-WRK-006` | P2 | expected failover noise | Market stream fanout retry test logs an intentional Redis startup failure. The test passed and verifies retry behavior. | `marketStreamFanout.test.ts` stderr: `redis_booting`. | Keep expected stderr documented so future audits do not misclassify it as an operational regression. |

## Result

`AUD-08` is current locally for worker topology, protected health/readiness,
runtime freshness, market-stream fanout/subscriptions/routes, queue tuning,
backtest job persistence, execution orchestration, and PAPER runtime-flow
telemetry.

No code behavior was changed. No production journey, LIVE mutation,
exchange-side mutation, or existing production data mutation was performed.
