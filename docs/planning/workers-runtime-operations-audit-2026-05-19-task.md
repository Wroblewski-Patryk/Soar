# Task: Workers And Runtime Operations Audit - 2026-05-19

## Context

The user requested reusable layer-by-layer discrepancy audits between the
application implementation and architecture/module descriptions. `AUD-08`
covers split worker topology, readiness, queue ownership, runtime freshness,
market-stream fanout, process cleanup, and observability.

## Goal

Refresh `AUD-08` with current local evidence and record implementation vs
architecture/documentation discrepancies without changing runtime behavior.

## Scope

- `docs/analysis/reusable-audit-registry.md`
- `docs/architecture/02_system-topology.md`
- `docs/architecture/codebase-map.md`
- `docs/operations/deployment-readiness-gates.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `apps/api/src/workers/**`
- `apps/api/src/router/*readiness*`
- `apps/api/src/modules/market-stream/**`
- `apps/api/src/queue/**`
- `apps/api/src/modules/backtests/backtestRun*.ts`
- `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
- `apps/api/src/modules/engine/runtime-flow.e2e.test.ts`

## Constraints

- No production journey.
- No LIVE order/cancel/close.
- No exchange-side mutation.
- No existing production data mutation.
- Keep repository artifacts in English.

## Definition Of Done

- Focused API worker/runtime proof is run and recorded.
- Architecture-to-code parity is summarized.
- Open gaps are recorded with stable IDs.
- Local DB/Redis infra is stopped after DB-backed tests.
- A reusable Markdown and JSON audit artifact exists.

## Forbidden

- Do not change product behavior during the audit.
- Do not perform LIVE-money or exchange-side mutation.
- Do not overclaim production freshness from local tests.

## Result Report

Completed on 2026-05-19.

Validation:

- `corepack pnpm --filter api exec vitest run src/workers/workerOwnership.test.ts src/workers/marketStreamWorkerConfig.test.ts src/workers/marketStreamSubscriptions.service.test.ts src/router/workers-health-readiness.test.ts src/router/workers-runtime-freshness.test.ts src/router/health-readiness.test.ts src/queue/queueTuning.test.ts src/modules/market-stream/marketStreamFanout.test.ts src/modules/market-stream/marketStream.routes.e2e.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts src/modules/market-stream/exchangePollingStream.service.test.ts src/modules/market-stream/exchangePollingStream.fanout.test.ts src/modules/market-stream/binanceStream.service.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestRunQueue.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtime-flow.e2e.test.ts`
  - PASS: `17` files, `85` tests.
  - Expected stderr: `marketStreamFanout.test.ts` intentionally simulates
    initial Redis startup failure (`redis_booting`) before retry success.
- `corepack pnpm run go-live:infra:down`
  - PASS: local Postgres/Redis stopped after DB-backed tests.

Artifacts:

- `docs/operations/workers-runtime-operations-audit-2026-05-19.md`
- `docs/operations/workers-runtime-operations-audit-2026-05-19.json`

Residual risk:

- Fresh production protected worker/process proof was not rerun.
- Gate.io/second-LIVE production runtime shape remains outside the verified
  release slice.
