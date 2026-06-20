# LUC-3779 Backend Runtime Task-Link Reconciliation

## Architecture Links

- Primary feature/module: backend runtime and support implementation task-link evidence.
- Paperclip issue: [LUC-3779](/LUC/issues/LUC-3779).
- Parent task: [LUC-3776](/LUC/issues/LUC-3776).
- Runtime domain models: apps/api/src/modules/bots/bots.errors.ts#BotDomainError; apps/api/src/modules/engine/runtimePositionState.store.ts#RuntimePositionStateStore; apps/api/src/modules/engine/runtimeSignalDecisionEngine.ts#RuntimeSignalDecisionEngine; apps/api/src/modules/engine/runtimeSignalMarketDataGateway.ts#RuntimeSignalMarketDataGateway; apps/api/src/modules/orders/orders.errors.ts#OrderDomainError; apps/api/src/modules/profile/security/security.errors.ts#ProfileSecurityDomainError; apps/api/src/modules/subscriptions/payments/paymentGateway.types.ts; apps/api/src/observability/metrics.ts#InMemoryMetricsStore; apps/api/src/workers/workerHeartbeat.ts#WorkerHeartbeatClient.
- Runtime model entity ids: model:botdomainerror:39b64d5a94; model:runtimepositionstatestore:0eb3d546cd; model:runtimesignaldecisionengine:d0fd2a236b; model:runtimesignalmarketdatagateway:7720bbb943; model:orderdomainerror:6dc45325a6; model:profilesecuritydomainerror:fbbb613a53; model:paymentgateway-types-ts:ffdd0f3068; model:inmemorymetricsstore:40eed65541; model:workerheartbeatclient:4f81cd09f8.
- Backend runtime/support files: apps/api/src/lib/capitalAllocation.ts; apps/api/src/middleware/noStoreHeaders.ts; apps/api/src/modules/backtests/backtestIndicatorSpecs.ts; apps/api/src/modules/bots/botsRuntimeRead.repository.ts; apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts; apps/api/src/modules/bots/runtimeSessionPositionWindow.ts; apps/api/src/modules/bots/runtimeSessionTradeFallbackScope.ts; apps/api/src/modules/bots/runtimeStrategyProtectionFallbackDisplay.ts; apps/api/src/modules/engine/fixtures/lifecycleCloseParity.golden.ts; apps/api/src/modules/engine/positionPnlSemantics.ts; apps/api/src/modules/engine/positionSizing.ts; apps/api/src/modules/engine/runtimeExecutionClientOrderId.ts; apps/api/src/modules/engine/runtimePositionAutomationDefaultPositionDeps.ts; apps/api/src/modules/engine/runtimePositionAutomationSkipTelemetry.ts; apps/api/src/modules/engine/runtimeSignalMerge.ts; apps/api/src/modules/engine/runtimeTickerStore.ts; apps/api/src/modules/engine/sharedCandlePatternSeries.ts; apps/api/src/modules/engine/sharedDerivativesSeries.ts; apps/api/src/modules/engine/sharedExecutionCore.ts; apps/api/src/modules/engine/sharedIndicatorSeries.ts; apps/api/src/modules/engine/strategyIndicatorKernel.ts; apps/api/src/modules/engine/strategyIndicatorRegistry.ts; apps/api/src/modules/engine/strategyLifetimePolicy.ts; apps/api/src/modules/engine/strategySignalEvaluator.ts; apps/api/src/modules/orders/orders.positionScope.ts; apps/api/src/modules/positions/livePositionReconciliation.history.ts.
- Backend residual support files: apps/api/src/modules/positions/livePositionReconciliationApiKeys.ts; apps/api/src/modules/users/publicUser.ts; apps/api/src/observability/alerts.ts; apps/api/src/prisma/client.ts; apps/api/src/queue/queueTuning.ts; apps/api/src/types/express.d.ts; apps/api/src/utils/errorExposure.ts; apps/api/src/utils/formatZodError.ts; apps/api/src/utils/hash.ts; apps/api/src/workers/marketData.worker.ts; apps/api/src/workers/workerOwnership.ts.
- Support proof helpers deliberately included from the actionable support slice: scripts/runLocalProtectedRouteActionProof.mjs#CdpClient; scripts/runProdAuthSessionBrowserProof.mjs#CdpClient; scripts/runProdUxA11yMobileProof.mjs#CdpClient; scripts/runPublicReadOnlyBrowserProof.mjs#CdpClient.
- Support proof helper entity ids: model:cdpclient:529cc10df2; model:cdpclient:23cc1e2778; model:cdpclient:6f825c2dd3; model:cdpclient:ffff0b6c70.
- Verification command: `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`.

## Context

Stage: verification
Operation mode: BUILDER
Process class: delivery gap loop

The 2026-06-13 task synchronization report split archival/noise rows from
actionable implementation entities. LUC-3779 owns the backend/runtime subset of
the actionable task-link gaps and intentionally excludes unrelated frontend
shared UI rows.

## Goal

Add scanner-readable task evidence that ties the current backend runtime,
support, and runtime proof-helper entities back to the active Paperclip
reconciliation task without changing runtime behavior.

## Scope

- Backend runtime domain models and support files listed above.
- Script-side CDP support helper classes that the current report grouped with
  runtime/support implementation gaps.
- No frontend shared UI, i18n, web utility, or generated graph behavior edits.

## Definition of Done

- Architecture-awareness generation succeeds.
- `docs/status/task-synchronization-report.md` shows a lower actionable
  implementation task-link gap count.
- Residual backend/runtime rows, if any, are named in the Paperclip closure.

## Result Report

Implemented on 2026-06-13 as task-link evidence only.

Evidence:

- Before count from `docs/status/task-synchronization-report.md` generated
  2026-06-13T12:58:23.855Z: `Actionable implementation entities without task
  links: 96`.
- First refresh after file/path links passed: `9575` entities, `30673`
  relations, `9871` files; actionable implementation task-link gaps dropped to
  `43`.
- Second refresh after generated model/support IDs passed: `9575` entities,
  `30699` relations, `9871` files; actionable implementation task-link gaps
  dropped to `19`.
- Residual actionable rows are frontend/web/shared or support-script rows:
  trailing stop display utility, strategy presentation/taxonomy utilities,
  i18n hooks/registry, web error/navigation/numeric/public API helpers, shared
  declaration surface, frontend dev script, web profile/icon models, app
  layouts, and web manifest.

Residual risk:

- This does not assert fresh behavioral verification of the linked runtime
  modules; it only reconciles architecture/task traceability.
- Generated graph/status files were already dirty in the Soar worktree before
  this task; this task added the LUC-3779 history task and refreshed generated
  architecture-awareness outputs.
