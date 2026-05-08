# V1 Paper/Live Backend Runtime Parity

## Header
- ID: V1-PAPER-LIVE-BACKEND-RUNTIME-PARITY-2026-05-08
- Title: fix(api-runtime): keep paper/live execution orchestration adapter-pure
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: architecture runtime contracts
- Priority: P0
- Iteration: 1
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected: backend paper/live runtime parity.
- [x] Operation mode matches the selected first iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The user asked to stop treating paper/live bot readiness as disconnected tiny
tasks and to establish one coherent backend V1 line before Web visualization.
Architecture requires PAPER and LIVE to share decision logic, lifecycle
ordering, and diagnostics, with approved differences limited to execution
adapter, fill model, exchange side effects, and account balance authority.

## Goal
Remove a concrete backend runtime parity leak where
`executionOrchestrator.service` reaches directly into Prisma during close
settlement even when tests or runtime callers provide adapter gateways.

## Success Signal
- User or operator problem: paper/live backend confidence is weakened when
  adapter-pure parity tests unexpectedly require a live database.
- Expected product or reliability outcome: orchestration close settlement uses
  the same gateway boundary as order, position, event, trade, and dedupe flows.
- How success will be observed: focused PAPER/LIVE parity tests pass without
  a database connection.
- Post-launch learning needed: no

## Scope
- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- Focused engine parity tests.
- Planning/context docs for evidence.

## Implementation Plan
1. Move entry-fee aggregation behind the existing runtime trade gateway.
2. Keep the default gateway backed by Prisma for real runtime execution.
3. Make injected in-memory gateways explicitly provide zero entry-fee truth
   where appropriate.
4. Run focused runtime parity validation and broader touched-scope checks.
5. Update source-of-truth state with the result and next backend runtime line.

## Acceptance Criteria
- PAPER close path no longer contacts Prisma when injected gateways are used.
- LIVE waiting-fill path remains fail-closed/submitted until exchange fill is
  confirmed.
- BACKTEST core and PAPER runtime decision outcomes remain equivalent for the
  focused parity scenarios.
- No new runtime system, workaround, or duplicated lifecycle logic is added.

## Definition of Done
- [x] Focused engine parity tests pass.
- [x] API typecheck passes or any blocker is recorded.
- [x] Repository guardrails pass or any blocker is recorded.
- [x] Architecture alignment and docs/context are updated.
- [x] Full local API suite passes with test-only API-key encryption env.
- [x] API and workspace production builds pass.

## Forbidden
- New execution system.
- Mock-only production behavior.
- Direct database calls inside adapter-pure orchestration branches when an
  existing gateway boundary can own the dependency.
- Architecture changes without explicit approval.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/executionAdapterParity.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts src/modules/engine/runtimeCrashRetry.regression.test.ts --run`
    -> PASS (`4` files, `26/26` tests).
  - `pnpm --filter api run test -- src/modules/engine/runtimeSignalMerge.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimeOrderLifetime.service.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts --run`
    -> PARTIAL/BLOCKED: non-DB unit/runtime tests passed (`7` files,
    `138/138` tests); DB-backed e2e/default-query tests were blocked before
    assertions because local Postgres at `localhost:5432` was unreachable.
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts src/modules/engine/runtimeOrderLifetime.service.test.ts --run --sequence.concurrent=false`
    -> PASS (`3` files, `23/23` tests) after verifying ports and using the
    reachable local DB stack.
  - `pnpm --filter api run test -- src/modules/engine/runtimeSignalMerge.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimeOrderLifetime.service.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts --run --sequence.concurrent=false`
    -> PASS (`10` files, `157/157` tests).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/livePositionReconciliation.diagnostics.test.ts src/modules/positions/positions.exchangeSnapshotNormalization.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts --run --sequence.concurrent=false`
    -> PASS (`8` files, `76/76` tests).
  - `pnpm --filter api run test -- src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders.service.test.ts src/modules/orders/orders.positionScope.test.ts src/modules/engine/runtime-flow.e2e.test.ts src/modules/engine/runtime-orchestration-smoke.e2e.test.ts src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts src/modules/bots/bots.mode-switch-active-position.e2e.test.ts src/modules/bots/bots.orchestration.e2e.test.ts --run --sequence.concurrent=false`
    -> PASS (`9` files, `75/75` tests).
  - `pnpm --filter api run test -- src/modules/positions/importedPositionHistoryHydrator.service.test.ts src/modules/engine/paperLifecycle.service.test.ts src/modules/engine/orderTypes.service.test.ts src/modules/engine/positionManagement.service.test.ts src/modules/engine/paperRuntime.service.test.ts src/modules/engine/runtimeBacktestParserParity.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/engine/runtimeExchangeOrderGuard.service.test.ts src/modules/engine/runtimeExecutionDedupe.service.test.ts src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts src/modules/engine/runtimePositionLifetime.service.test.ts src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/runtimeSignalDecisionEngine.test.ts src/modules/engine/runtimeSignalLoop.repository.test.ts src/modules/engine/runtimeSignalLoopSupervisor.test.ts src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/engine/runtimeTelemetry.service.test.ts src/modules/engine/runtimeTickerStore.test.ts --run --sequence.concurrent=false`
    -> PASS (`19` files, `115/115` tests).
  - `pnpm --filter api run test -- src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/ccxtFuturesConnector.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts src/modules/exchange/binancePublicRest.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeConnectorFactory.service.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/exchange/exchangeMetadataContract.service.test.ts src/modules/exchange/exchangePublicRead.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/liveFeeReconciliation.service.test.ts src/modules/exchange/exchangeSymbolRules.service.test.ts src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.quantityRules.test.ts --run --sequence.concurrent=false`
    -> PASS (`17` files, `86/86` tests).
  - `pnpm --filter api run test -- src/modules/bots/botContextValidation.service.test.ts src/modules/bots/botCanonicalUpdateScope.service.test.ts src/modules/bots/botOwnership.service.test.ts src/modules/bots/botStrategyProjectionDrift.service.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts src/modules/bots/runtimeStrategyConfigParser.service.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts src/modules/positions/positions.service.test.ts src/modules/positions/positions.list.e2e.test.ts src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts src/modules/positions/positions-live-status.e2e.test.ts --run --sequence.concurrent=false`
    -> PASS (`16` files, `72/72` tests).
  - `pnpm --filter api run test -- src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts src/modules/bots/bots.multi-strategy-write.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/bots.market-universe-contract.e2e.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.runtime-history-parity.e2e.test.ts src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/bots/bots.portfolio-history.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts src/modules/bots/bots.wallet-contract.e2e.test.ts src/modules/backtests/backtestRuntimeKernelParity.test.ts --run --sequence.concurrent=false`
    -> PASS (`12` files, `84/84` tests).
  - `$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'; $env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'; pnpm --filter api run test -- --run --sequence.concurrent=false`
    -> PASS (full local API suite; Vitest exited `0`).
  - `pnpm --filter api run typecheck` -> PASS.
  - `pnpm --filter api run build` -> PASS.
  - `pnpm run build` -> PASS.
  - `pnpm run quality:guardrails` -> PASS.
  - `pnpm run docs:parity:check` -> PASS.
- Manual checks:
  - `desktop-linux` Docker context returned pipe `500` errors.
  - `docker --context default info --format '{{.ServerVersion}}'` returned
    `28.3.2`.
  - `Test-NetConnection` confirmed `localhost:5432` and `localhost:6379`
    were reachable.
- Screenshots/logs: not applicable
- High-risk checks: fail-closed LIVE waiting-fill behavior covered by focused
  test.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no architecture mismatch; implementation leak found.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not applicable
- Rollback note: revert the gateway extraction patch.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: focused parity tests failed because close settlement directly called
  `prisma.trade.aggregate()` and required `localhost:5432`.
- Gaps: runtime trade gateway did not expose entry-fee aggregation.
- Inconsistencies: injected adapter gateways were not fully authoritative for
  orchestration close tests.
- Architecture constraints: PAPER/LIVE must share lifecycle logic with adapter
  differences isolated.

### 2. Select One Priority Task
- Selected task: adapter-pure backend paper/live runtime parity.
- Priority rationale: this is directly in the runtime path required before Web
  can faithfully visualize bot behavior.
- Why other candidates were deferred: production auth evidence remains blocked
  externally; this local backend runtime contract can be improved now.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
  - focused parity tests if the gateway contract requires explicit test setup
- Logic: move entry-fee aggregation into `RuntimeTradeGateway`.
- Edge cases: injected gateways should default to deterministic zero fees;
  default runtime gateway still reads durable trade fee truth.

### 4. Execute Implementation
- Implementation notes: moved entry-fee aggregation behind
  `RuntimeTradeGateway.sumEntryFees`. The default runtime gateway remains
  Prisma-backed, while injected test/runtime gateways can provide deterministic
  adapter-local fee truth without touching the database.

### 5. Verify and Test
- Validation performed: focused parity/crash-retry tests, DB-backed runtime
  and order/exchange/import/readback packs, full local API suite, API
  typecheck, API build, workspace build, repository guardrails, docs parity,
  lint, and diff check.
- Result: focused parity fix passed. Initial broad DB-backed e2e attempt was
  blocked by an unhealthy Docker context, then passed once the reachable local
  DB stack was verified and the suites were rerun sequentially. The full local
  API suite also passed with test-only API-key encryption env.

### 6. Self-Review
- Simpler option considered: mocking Prisma in the test only.
- Technical debt introduced: no
- Scalability assessment: improves boundary clarity.
- Refinements made: updated all engine test gateway implementations so the
  trade gateway contract is explicit across parity and crash-retry coverage.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact, task board, project state, agent state,
  learning journal.
- Context updated: yes
- Learning journal updated: yes.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report

- Task summary: `executionOrchestrator` no longer bypasses injected adapter
  gateways for close-settlement entry-fee truth.
- Candidate commit: current task commit.
- Files changed:
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
  - `apps/api/src/modules/engine/executionAdapterParity.test.ts`
  - `apps/api/src/modules/engine/paperLiveDecisionEquivalence.test.ts`
  - `apps/api/src/modules/engine/runtimeCrashRetry.regression.test.ts`
  - `docs/planning/v1-paper-live-backend-runtime-parity-task-2026-05-08.md`
- How tested: focused API parity/crash tests, API typecheck, guardrails, and
  broad backend runtime/order/exchange/import/readback packs plus full local
  API suite.
- What is incomplete: production authenticated readback remains separate; no
  local backend runtime assertion failure remains in this slice.
- Next steps: continue the V1 line at production evidence boundaries:
  Coolify/manual deploy freshness if needed, authenticated read-only
  `LIVEIMPORT-03` runtime readback, rollback proof, restore drill, and final
  non-dry-run release gate.
