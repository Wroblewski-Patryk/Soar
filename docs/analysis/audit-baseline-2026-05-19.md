# Audit Baseline - 2026-05-19

Purpose: reusable audit baseline after the 2026-05-18 broad local audit run.
This baseline closes the largest open Web/UX route-state gap from `AUD-04` and
`AUD-05`, then extends the reusable audit matrix across architecture, API,
security, exchange, bots, runtime, workers, data, operations, mobile scope,
i18n/copy, and documentation traceability.

## Relationship To Previous Baseline

The 2026-05-18 baseline remains the broad local audit baseline for backend,
Web tests, API tests, i18n, go-live smoke, generated project index/static scan,
and architecture-code discrepancy tracking:

- `docs/analysis/audit-baseline-2026-05-18.md`
- `docs/planning/full-layered-audit-run-2026-05-18-task.md`

This 2026-05-19 baseline adds fresh authenticated route-state proof,
endpoint-level API docs parity evidence, assistant runtime truth evidence,
exchange capability truth evidence, architecture exchange-scope wording
evidence, security/privacy evidence, bots/runtime truth evidence, engine
trading decision-flow evidence, orders/manual trading evidence,
positions/reconciliation evidence, wallets/capital-ledger evidence,
markets/strategies configuration evidence, backtests/reports evidence,
logs/audit-trail evidence, admin/subscriptions entitlement evidence, and
workers/runtime-operations evidence, data-model/migrations evidence, local
operations/release evidence, mobile scope evidence, and i18n/copy evidence on
top of that baseline. It also refreshes `AUD-00` generated index/static-scan
evidence and adds a dedicated `AUD-02` requirements/delivery-map audit. It does
not replace production release evidence and does not authorize LIVE trading or
exchange-side mutation.

## Today Actually Run

| Command / Proof | Result | Evidence |
| --- | --- | --- |
| Local API dev start with seeded admin data | PASS | API reachable at `http://localhost:3001/health`; backend dev reset and seeded local DB. Runtime used process-local test keyring `API_KEY_ENCRYPTION_KEYS=v1:test-key-material` and `API_KEY_ENCRYPTION_ACTIVE_VERSION=v1`; no `.env` change. |
| Local Web dev start | PASS | Web reachable at `http://localhost:3002`. |
| Browser login with seeded admin user | PASS | Browser landed on `/dashboard` after login; dashboard DOM rendered with no console warnings/errors. |
| Authenticated route-state audit | PASS | `docs/operations/route-state-audit-2026-05-19/route-state-audit-2026-05-19.md` and `.json`; `53` route checks, `53` PASS, `0` CHECK, `0` routes with console warnings/errors, `6` screenshots. |
| Project index refresh | PASS | `docs/operations/project-index-2026-05-19.md` and `.json`; V1 statuses `PASS:21`, tests indexed `335`. |
| Static issue scan refresh | PASS | `docs/operations/v1-static-issue-scan-2026-05-19.md` and `.json`; findings `0`. |
| Requirements/delivery-map audit | PASS AFTER FOLLOW-UP | `docs/operations/requirements-delivery-map-audit-2026-05-19.md` and `.json`; initial findings for stale delivery map, duplicate `RISK-031`, and continuation-state sync gap were closed by follow-up synchronization. |
| Endpoint-level API docs parity audit | PASS AFTER DOC GAP CLOSURE | `docs/operations/api-endpoint-docs-parity-2026-05-19/api-endpoint-docs-parity-2026-05-19.md` and `.json`; `109` endpoints, `109` documented, `0` gaps after adding root/ops endpoint docs and missing route mentions to module docs. Existing module-level `pnpm run docs:parity:check` remains PASS. |
| Assistant orchestrator focused API tests | PASS | `pnpm --filter api exec vitest run src/modules/engine/assistantOrchestrator.service.test.ts src/modules/engine/assistantOrchestrator.parity.test.ts`; `2` files, `6` tests. |
| Assistant focused Web route tests | PASS | `pnpm --filter web exec vitest run 'src/app/dashboard/bots/[id]/assistant/page.test.tsx' src/app/dashboard/bots/assistant/page.test.tsx`; `2` files, `3` tests. |
| Bot assistant config/dry-run API e2e | PASS after local infra startup | First run was blocked by missing local Postgres at `localhost:5432`; after `pnpm run go-live:infra:up`, `pnpm --filter api exec vitest run src/modules/bots/bots.orchestration.e2e.test.ts` passed with `1` file, `3` tests. Infra was stopped with `pnpm run go-live:infra:down`. |
| Assistant runtime truth audit | PASS FOR CURRENT FOUNDATION SCOPE | `docs/operations/ai-assistant-runtime-truth-audit-2026-05-19.md` and `.json`; `DEC-AUD-002` narrowed current truth to deterministic config/dry-run/orchestrator foundation. BACKTEST/PAPER/LIVE hot-path runtime AI remains future/gated and requires implementation plus AI red-team proof before any runtime AI trading claim. |
| Exchange focused API capability tests | PASS | `pnpm --filter api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`; `4` files, `21` tests. |
| Exchange focused Web capability tests | PASS | `pnpm --filter web exec vitest run src/features/exchanges/exchangeCapabilities.test.ts src/features/exchanges/components/ExchangeConnectionsView.test.tsx`; `2` files, `3` tests. |
| Exchange capability truth audit | PASS AFTER EXACT MATRIX REPAIR | `docs/operations/exchange-capability-truth-audit-2026-05-19.md` and `.json`; exact `(exchange, marketType, operation)` capability support is implemented in API execution/authenticated-read contracts and consumers. Focused exchange tests and API typecheck pass. |
| Architecture exchange-scope wording audit | PASS AFTER DECISION | `docs/operations/architecture-exchange-scope-wording-audit-2026-05-19.md` and `.json`; `DEC-AUD-001` accepted Binance + Gate.io as current implementation scope, not Binance-only, with production/live claims evidence-bound by exact exchange, market type, and operation. |
| Audit decision packet | RESOLVED | `docs/operations/audit-decision-packet-2026-05-19.md` and `.json`; records accepted `DEC-AUD-001` for exchange-scope wording and accepted/deferred-scope `DEC-AUD-002` for assistant runtime truth. |
| Audit decision repair playbooks | PLANNING ONLY | `docs/operations/audit-decision-repair-playbooks-2026-05-19.md` and `.json`; lists option-specific files, implementation steps, validation gates, and stop conditions for `DEC-AUD-001` and `DEC-AUD-002` after an explicit decision is accepted. |
| Security/privacy focused API auth/middleware/header pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/auth/auth.service.test.ts src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.jwt.test.ts src/modules/auth/auth.errors.test.ts src/middleware/requireAuth.test.ts src/middleware/requireTrustedOrigin.test.ts src/middleware/rateLimit.test.ts src/router/security-headers.test.ts src/router/cacheHeaders.test.ts`; first DB-backed attempt was blocked by missing local Postgres, then passed after `go-live:infra:up`: `9` files, `32` tests. |
| Security/privacy DB-backed API pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/modules/profile/basic/basic.e2e.test.ts src/modules/profile/security/security.e2e.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts src/modules/profile/stage-abuse-throttling.e2e.test.ts src/modules/isolation/data-isolation.e2e.test.ts`; `7` files, `47` tests. |
| Security/privacy focused Web pack | PASS | `corepack pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/lib/api.test.ts src/features/auth/hooks/useLoginForm.test.tsx src/features/auth/hooks/useRegisterForm.test.tsx src/features/profile/components/ApiKeyForm.test.tsx src/features/profile/components/ApiKeysList.test.tsx src/features/profile/components/Security.test.tsx`; `7` files, `28` tests. `node .\node_modules\vitest\vitest.mjs run 'src/app/(public)/auth/authPageCacheContract.test.ts'` from `apps/web` also passed: `1` file, `2` tests. |
| Security/privacy audit | PASS | `docs/operations/security-privacy-audit-2026-05-19.md` and `.json`; local auth/session, trusted-origin, headers, rate limits, profile security, API-key secrecy/ownership/probes, abuse throttling, cross-module isolation, and Web auth/profile/API-key behavior are current. External independent security review remains a governance follow-up. |
| Bots/runtime focused Web pack | PASS | `corepack pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts src/features/bots/utils/runtimeSurfaceTruth.test.ts src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx`; `8` files, `61` tests. |
| Bots/runtime focused API pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts src/modules/bots/bots.wallet-contract.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/bots.runtime-history-parity.e2e.test.ts src/modules/bots/bots.delete-cleanup.e2e.test.ts src/modules/bots/bots.live-paper-concurrent.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`; `10` files, `88` tests. |
| Bots/runtime truth audit | PASS | `docs/operations/bots-runtime-truth-audit-2026-05-19.md` and `.json`; local bot CRUD/ownership, wallet-first write contract, duplicate and entitlement gates, runtime scope, monitoring aggregate, runtime history parity, takeover visibility, LIVE/PAPER isolation, delete cleanup, and Web bot/dashboard runtime surfaces are current. |
| Engine focused service/unit pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/engine/runtimeSignalMerge.test.ts src/modules/engine/runtimeSignalDecisionEngine.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimeExecutionDedupe.service.test.ts src/modules/engine/runtimeExchangeOrderGuard.service.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTradeRisk.service.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/runtimeSignalLoopSupervisor.test.ts src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts`; `15` files, `173` tests. Expected stderr appeared in tests that intentionally simulate failover/fail-closed paths. |
| Engine DB-backed e2e/smoke pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/engine/runtime-flow.e2e.test.ts src/modules/engine/runtime-orchestration-smoke.e2e.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts`; `4` files, `13` tests. |
| Engine trading decision-flow audit | PASS | `docs/operations/engine-trading-decision-flow-audit-2026-05-19.md` and `.json`; local deterministic merge, final-candle flow, signal loop, pre-trade/risk, orchestration, dedupe, exchange guard, PAPER/LIVE parity, market-data gateway, position automation, and DB-backed PAPER runtime flow are current. |
| Orders/manual focused Web pack | PASS | `corepack pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`; `8` files, `46` tests. |
| Orders/manual focused API pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.liveCancelBoundary.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/orders/orders.quantityRules.test.ts src/modules/orders/orders.positionScope.test.ts`; `10` files, `121` tests. |
| Orders/manual trading audit | PASS | `docs/operations/orders-manual-trading-audit-2026-05-19.md` and `.json`; local manual-order context/scope, PAPER lifecycle, order ownership, active-only filtering, fills, fees, exchange events, fail-closed exchange-backed cancel boundary, LIVE risk guards, and Web manual/open-order action states are current. |
| Positions/reconciliation focused Web pack | PASS | `corepack pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-origin.test.tsx src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/bots/components/bots-management/BotsMonitoringProtectionCell.tsx`; `6` test files, `46` tests. The component-only TSX path did not add a separate Vitest file. |
| Positions/reconciliation focused API pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/positions/positions.service.test.ts src/modules/positions/positions.list.e2e.test.ts src/modules/positions/positions-live-status.e2e.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/livePositionReconciliation.diagnostics.test.ts src/modules/positions/positions.authenticatedSnapshots.service.test.ts src/modules/positions/positions.exchangeSnapshotNormalization.test.ts src/modules/positions/importedPositionHistoryHydrator.service.test.ts`; `11` files, `68` tests. Expected stderr appeared only in tests that intentionally simulate ambiguous/unowned/missing-entry and snapshot-failure diagnostics. |
| Positions/reconciliation audit | PASS | `docs/operations/positions-reconciliation-audit-2026-05-19.md` and `.json`; local list/read ownership, live-status, exchange snapshot selection/normalization/fail-closed behavior, takeover/rebind, orphan repair, imported history hydration, reconciliation diagnostics, runtime position derivations, and close-state UI are current. |
| Wallets/capital focused Web pack | PASS | `corepack pnpm --filter web exec vitest run src/app/dashboard/wallets/page.test.tsx src/app/dashboard/wallets/list/page.test.tsx src/app/dashboard/wallets/create/page.test.tsx src/app/dashboard/wallets/[id]/page.test.tsx src/app/dashboard/wallets/[id]/edit/page.test.tsx src/app/dashboard/wallets/[id]/preview/page.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletPreviewPanel.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx`; `10` files, `23` tests. |
| Wallets/capital focused API pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/wallets/wallets.service.test.ts src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts src/modules/wallets/walletCashflowClassifier.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/bots.wallet-contract.e2e.test.ts`; `7` files, `84` tests. |
| Wallets/capital-ledger audit | PASS | `docs/operations/wallets-capital-ledger-audit-2026-05-19.md` and `.json`; local wallet CRUD, wallet-first capital context, PAPER/LIVE validation, API-key binding, balance preview, PAPER reset guards, runtime capital source truth, and ledger UI/API states are current. |
| Markets/strategies focused Web pack | PASS | `corepack pnpm --filter web exec vitest run src/app/dashboard/markets/list/page.test.tsx src/app/dashboard/markets/create/page.test.tsx src/app/dashboard/markets/[id]/edit/page.test.tsx src/features/markets/components/MarketUniversesTable.test.tsx src/features/markets/components/MarketUniverseForm.test.tsx src/app/dashboard/strategies/list/page.test.tsx src/app/dashboard/strategies/create/page.test.tsx src/app/dashboard/strategies/[id]/page.test.tsx src/app/dashboard/strategies/[id]/edit/page.test.tsx src/features/strategies/components/StrategiesList.test.tsx src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/components/StrategyPresetPicker.test.tsx src/features/strategies/components/StrategyFormSections/Indicators.test.tsx src/features/strategies/presets/strategyPresets.test.ts src/features/strategies/utils/StrategyForm.map.test.ts src/features/strategies/utils/strategyNumericInput.test.ts src/features/strategies/utils/strategyCloseValidation.test.ts src/features/strategies/utils/indicatorPresentation.test.ts src/features/strategies/utils/indicatorTaxonomy.test.ts`; `19` files, `60` tests. |
| Markets/strategies focused API pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts src/modules/strategies/strategies.e2e.test.ts src/modules/strategies/strategyConfigValidation.test.ts src/modules/strategies/indicators/indicators.service.test.ts`; `4` files, `35` tests. |
| Markets/strategies configuration audit | PASS | `docs/operations/markets-strategies-configuration-audit-2026-05-19.md` and `.json`; local market-universe composition, catalog behavior, market and strategy CRUD, active-bot guards, strategy import/export/config validation, indicator registry parity, and Web market/strategy route/form/table states are current. |
| Backtests/reports focused Web pack | PASS | `corepack pnpm --filter web exec vitest run src/app/dashboard/backtests/list/page.test.tsx src/app/dashboard/backtests/create/page.test.tsx src/app/dashboard/backtests/[id]/page.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/components/BacktestsList.test.tsx src/features/backtest/components/BacktestsListView.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/utils/timelineIndicatorOverlays.test.ts src/features/backtest/utils/pairStatsMetricDisplay.test.ts src/features/backtest/utils/nonOverlappingTradeSegments.test.ts src/features/backtest/utils/backtestRunDetailsViewModel.test.ts src/app/dashboard/reports/page.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx`; `15` files, `37` tests. |
| Backtests/reports focused API pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestRuntimeKernelParity.test.ts src/modules/backtests/backtestRunQueue.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestRange.service.test.ts src/modules/backtests/backtestPatternParityFixtures.test.ts src/modules/backtests/backtestParity3Symbols.test.ts src/modules/backtests/backtestIndicatorTimelineSeries.test.ts src/modules/backtests/backtestFillModel.test.ts src/modules/backtests/backtestDataGateway.test.ts src/modules/reports/reports.service.test.ts`; `13` files, `114` tests. |
| Backtests/reports audit | PASS | `docs/operations/backtests-reports-audit-2026-05-19.md` and `.json`; local backtest run lifecycle, explicit range validation, replay/queue/job behavior, immutable snapshot behavior, report lifecycle, timeline/trades/report reads, cross-mode reporting aggregation, and Web backtest/report states are current. |
| Logs/audit focused Web pack | PASS | `corepack pnpm --filter web exec vitest run src/app/dashboard/logs/page.test.tsx src/features/logs/components/AuditTrailView.test.tsx`; `2` files, `3` tests. |
| Logs/audit focused API pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/logs/logs.e2e.test.ts src/modules/pagination/pagination-query.test.ts`; `2` files, `5` tests. |
| Logs/audit-trail audit | PASS | `docs/operations/logs-audit-trail-audit-2026-05-19.md` and `.json`; local authenticated log reads, user scoping, filters, pagination bounds, metadata trace rendering, and Web logs route states are current. |
| Admin/subscriptions focused Web pack | PASS | `corepack pnpm --filter web exec vitest run src/features/admin/users/pages/AdminUsersPage.test.tsx src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx src/features/profile/components/Subscription.test.tsx src/app/dashboard/profile/page.test.tsx`; `4` files, `9` tests. |
| Admin/subscriptions focused API pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/admin/users/users.e2e.test.ts src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts src/modules/subscriptions/subscriptionEntitlements.service.test.ts src/modules/profile/subscription/subscription.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts`; `5` files, `25` tests. |
| Admin/subscriptions entitlements audit | PASS | `docs/operations/admin-subscriptions-entitlements-audit-2026-05-19.md` and `.json`; local admin-only access, role/subscription plan management, self-demotion prevention, entitlement validation, profile subscription readback, bot limit/LIVE gates, and Web admin/profile subscription states are current. |
| Workers/runtime focused API pack | PASS | `corepack pnpm --filter api exec vitest run src/workers/workerOwnership.test.ts src/workers/marketStreamWorkerConfig.test.ts src/workers/marketStreamSubscriptions.service.test.ts src/router/workers-health-readiness.test.ts src/router/workers-runtime-freshness.test.ts src/router/health-readiness.test.ts src/queue/queueTuning.test.ts src/modules/market-stream/marketStreamFanout.test.ts src/modules/market-stream/marketStream.routes.e2e.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts src/modules/market-stream/exchangePollingStream.service.test.ts src/modules/market-stream/exchangePollingStream.fanout.test.ts src/modules/market-stream/binanceStream.service.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestRunQueue.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtime-flow.e2e.test.ts`; `17` files, `85` tests. Expected stderr appeared only in the intentional Redis-startup retry test. |
| Workers/runtime operations audit | PASS | `docs/operations/workers-runtime-operations-audit-2026-05-19.md` and `.json`; local worker topology, protected health/readiness, runtime freshness, market-stream fanout/subscriptions/routes, queue tuning, backtest job persistence, execution orchestration, and PAPER runtime-flow telemetry are current. |
| Data-model/migrations local schema and migration checks | PASS | `corepack pnpm --filter api exec prisma validate`; `corepack pnpm --filter api exec prisma migrate status` (`54` migrations, schema up to date); `corepack pnpm --filter api exec prisma migrate reset --force --skip-seed` (all `54` migrations applied); `corepack pnpm --filter api exec prisma migrate diff --from-empty --to-schema-datamodel prisma\schema.prisma --script`. |
| Data-model/migrations representative isolated DB tests | PASS | `corepack pnpm run audit:data:db-isolated` validates schema, migration status, and sequential reset-and-run representative DB packs: wallets (`1` file / `24` tests), backtests (`1` file / `15` tests), and runtime repository (`1` file / `2` tests). A combined shared-DB run failed earlier and remains recorded as a P1 test-isolation finding; the canonical runner mitigates it. |
| Data-model/migrations audit | PASS WITH MITIGATED FINDING | `docs/operations/data-model-migrations-audit-2026-05-19.md` and `.json`; local schema validity, migration replay, manual partial-index invariants, exchange/source-scoped candle cache, representative data contracts, and canonical DB-backed isolation runner are current. |
| Operations/release local gates | PASS | `corepack pnpm run typecheck`, `corepack pnpm run lint`, and `corepack pnpm run build` all passed. Build includes mobile scaffold echo, API `tsc`, and Web Next production build with `30` static pages generated. |
| Operations local go-live smoke | PASS | `corepack pnpm run test:go-live:smoke`; API smoke passed (`4` files / `45` tests), Web smoke passed (`3` files / `18` tests), and local Postgres/Redis were started/stopped by the script. |
| Operations local DB backup/restore check | PASS WITH PRECONDITION | Initial `corepack pnpm run ops:db:backup-restore:check-local` failed without a running Postgres container. After `corepack pnpm run go-live:infra:up`, the same check passed and produced `docs/operations/v1-db-restore-check-2026-05-19T01-30-47-200Z.md` plus `_artifacts-db-restore-check-2026-05-19T01-30-47-200Z.txt`; infra was then stopped. |
| Operations/release/deployment audit | PASS | `docs/operations/operations-release-deployment-audit-2026-05-19.md` and `.json`; local release-safety evidence is current. Production release readiness remains historical for deployed `457bce05` and must be refreshed for any new target. |
| Mobile scaffold build/test scripts | PASS_SCAFFOLD | `corepack pnpm --filter @cryptosparrow/mobile run build` and `corepack pnpm --filter @cryptosparrow/mobile run test` both print scaffold-only deferred messages. |
| Mobile/cross-platform scope audit | PASS | `docs/operations/mobile-cross-platform-scope-audit-2026-05-19.md` and `.json`; `apps/mobile` remains bootstrap-only with no production native runtime or independent backend contracts. Responsive Web mobile evidence remains under `AUD-05`, not native parity. |
| Route-reachable i18n audit | PASS | `corepack pnpm i18n:audit:route-reachable:web`; findings `0`, localCopy `0`, fallbackPl `0`, hardcoded `0`; artifact `docs/operations/_artifacts-l10nq-d-coverage-audit-latest.json`. |
| Focused Web i18n pack | PASS | `corepack pnpm --filter web exec vitest run src/i18n/translations.test.ts src/i18n/guardrails.test.ts src/i18n/namespaceRegistry.test.ts src/i18n/routeLocaleSmoke.test.ts src/i18n/I18nProvider.test.tsx src/i18n/I18nProvider.route-loading.test.tsx src/i18n/useLocaleFormatting.test.tsx src/i18n/useOptionalI18n.test.tsx`; `8` files / `26` tests. |
| I18n/copy reachability audit | PASS | `docs/operations/i18n-copy-reachability-audit-2026-05-19.md` and `.json`; current route-reachable copy has no findings. |

## Current Baseline By Affected Audit

| ID | Current Status | Current Evidence | Open Gap / Next Action |
| --- | --- | --- | --- |
| AUD-04 | current local | Authenticated desktop route-state proof passed for canonical public/auth/dashboard/admin/legacy route set, including seed-backed dynamic wallet, market, strategy, and bot routes. Mobile representative route-state proof passed for public/auth/dashboard/bots/wallets/markets/strategies/backtests/profile/admin routes. | Add a screenshot-capable automated all-route regression runner if this needs to become CI-grade instead of Browser-plugin proof. |
| AUD-05 | current local / current historical production | 2026-05-19 local authenticated proof includes screenshots for Dashboard, Bots, Profile, Admin Users, Dashboard mobile, and Bots mobile; all audited route DOM snapshots had main content and no console warnings/errors. 2026-05-14 production UX/A11y/Mobile proof remains historical production evidence. | Full external accessibility review remains separate; keyboard/focus depth beyond representative route proof remains a future UX audit extension. |
| AUD-03 | current local | Endpoint-level audit now passes: `109` endpoints, `109` documented, `0` gaps. Module-level docs parity still passes at API `22/22`. | Rerun endpoint docs parity after API route changes. |
| AUD-01 | current after accepted Binance + Gate.io architecture decision | `DEC-AUD-001` accepted Binance + Gate.io as current implementation scope, not Binance-only. `01_overview-and-principles.md` and `03_domain-model.md` now keep production/live readiness evidence-bound by exact exchange, market type, and operation. | Keep Gate.io production/live proof separate by exact operation before any production readiness claim. |
| AUD-06 | current local / current historical production-safe | 2026-05-19 focused local security packs passed: auth/middleware/header API (`9` files / `32` tests), DB-backed auth/profile/API-key/isolation/abuse API (`7` files / `47` tests), focused Web auth/profile/API-key (`7` files / `28` tests), and public auth cache contract (`1` file / `2` tests). 2026-05-14 production-safe protected/fail-closed proof remains historical production evidence. | Refresh production-safe proof after future deployments; schedule external independent security review before broader public launch. |
| AUD-00 | current local | 2026-05-19 generated project index and static scan passed: V1 statuses `PASS:21`, tests indexed `335`, static findings `0`. | Rerun index before static scan sequentially on future broad audits. |
| AUD-02 | current for source-of-truth alignment after follow-up | 2026-05-19 dedicated source-of-truth audit found stale delivery-map rows, duplicate `RISK-031`, and continuation-state sync gaps; follow-up refreshed delivery map, renumbered the audit-process risk row to `RISK-036`, and synchronized continuation state. | Recheck on the next broad audit; keep production-boundary requirements partial unless fresh production proof exists. |
| AUD-07 | current local with mitigated test-isolation finding | 2026-05-19 local schema/migration checks passed: `prisma validate`, `prisma migrate status` (`54` migrations, up to date), full local `prisma migrate reset --force --skip-seed` (`54` migrations applied), and schema diff generation. `corepack pnpm run audit:data:db-isolated` passed with reset before each representative pack: wallets (`24`), backtests (`15`), and runtime repository (`2`). | Use `audit:data:db-isolated` for future representative DB audits; refresh production migration/backup/restore proof under `AUD-19` before future deploys. |
| AUD-08 | current local / current historical production-safe protected runtime proof | 2026-05-19 focused local workers/runtime pack passed: API worker/runtime operations (`17` files / `85` tests). Coverage includes worker ownership/topology, protected health/readiness, runtime freshness pass/fail/skip behavior, global `/ready` diagnostics, market-stream source config/subscriptions/fanout/routes, exchange polling, Binance stream parsing, queue tuning, backtest job persistence, execution orchestration, and PAPER runtime-flow telemetry. | Refresh production-safe protected worker/process proof after future deployments or worker topology changes; keep Gate.io/second-LIVE production runtime shape outside current claims until explicitly planned. |
| AUD-09 | current local exact capability matrix | Exchange capability/registry/boundary tests passed (`4` files, `21` tests); API typecheck passed after exact `(exchange, marketType, operation)` support was implemented in execution/authenticated-read contracts and consumers. Web capability tests passed (`2` files, `3` tests); orders/wallet classifier tests passed after non-exchange modules moved to neutral exchange-owned type aliases (`2` files, `41` tests). | Keep future exchange additions on exact capability contracts and neutral exchange-owned type aliases. |
| AUD-10 | current local / current historical production-safe | 2026-05-19 focused local bots/runtime packs passed: Web bot/dashboard runtime (`8` files / `61` tests) and DB-backed API bot/runtime (`10` files / `88` tests). Coverage includes CRUD/ownership, wallet-first writes, duplicate/entitlement gates, runtime scope, monitoring aggregate, runtime history parity, takeover, LIVE/PAPER isolation, and delete cleanup. | Refresh production-safe bot/runtime proof after future deployments; keep assistant hot-path truth under `AUD-20`; Gate.io/second-LIVE production shape remains separate. |
| AUD-11 | current local / production mutation not exercised | 2026-05-19 focused local engine packs passed: service/unit (`15` files / `173` tests) and DB-backed e2e/smoke (`4` files / `13` tests). Coverage includes deterministic merge, decision engine, final-candle flow, runtime loop/supervisor, pre-trade/risk, execution orchestration, dedupe, exchange order guard, PAPER/LIVE parity, market-data gateway, position automation, PAPER runtime lifecycle, and owned imported-position execution. | Keep LIVE/exchange-side mutation excluded until an explicit safe plan; keep assistant hot-path truth under `AUD-20`. |
| AUD-12 | current local / current historical production-safe PAPER | 2026-05-19 focused local orders/manual packs passed: Web manual/open-order (`8` files / `46` tests) and API orders/manual trading (`10` files / `121` tests). Coverage includes manual context/scope, PAPER lifecycle, ownership, active-only filtering, fills, fees, exchange events, fail-closed exchange-backed cancel boundary, LIVE risk guards, and UI action states. | Refresh production-safe PAPER order proof after future deployments; keep LIVE order/cancel/close mutation excluded until an explicit safe plan. |
| AUD-13 | current local / current historical production-safe PAPER | 2026-05-19 focused local positions packs passed: Web runtime positions (`6` files / `46` tests) and API positions/reconciliation (`11` files / `68` tests). Coverage includes list/read ownership, live-status, exchange snapshot selection/normalization/fail-closed behavior, takeover/rebind, orphan repair, imported history hydration, reconciliation diagnostics, runtime position derivations, and close-state UI. | Refresh production-safe PAPER positions proof after future deployments; keep LIVE position mutation excluded until an explicit safe plan. |
| AUD-14 | current local / current historical production-safe wallet CRUD | 2026-05-19 focused local wallets/capital packs passed: Web wallet/ledger UI (`10` files / `23` tests) and API wallets/capital contracts (`7` files / `84` tests). Coverage includes wallet CRUD, ownership, PAPER/LIVE validation, API-key binding, balance preview, active-bot edit/delete/reset guards, paper reset checkpoint, wallet-first bot contract, runtime capital source truth, cashflow/equity ledger states, and partial/unavailable ledger UI. | Refresh production-safe disposable wallet proof after future deployments; keep LIVE exchange mutation excluded until an explicit safe plan; track wallet command audit-log events under `AUD-17`. |
| AUD-15 | current local / current historical production-safe fixture | 2026-05-19 focused local markets/strategies packs passed: Web market/strategy UI (`19` files / `60` tests) and API markets/strategies contracts (`4` files / `35` tests). Coverage includes market-universe composition, catalog behavior, CRUD, ownership, active-bot guards, historical-reference delete guards by existing proof, strategy import/export/config validation, inactive-bot edit allowance, active-bot lock UI, and indicator registry/presentation parity. | Refresh production-safe disposable market/strategy fixture proof after future deployments; track catalog freshness telemetry, typed strategy domain errors, and Web strategy i18n/dirty-state follow-ups. |
| AUD-16 | current local / current historical production-safe fixture | 2026-05-19 focused local backtests/reports packs passed: Web backtest/report UI (`15` files / `37` tests) and API backtests/reports contracts (`13` files / `114` tests). Coverage includes run lifecycle, ownership, explicit range validation, queue/job/replay, fill model, data gateway, runtime-kernel parity, immutable snapshot behavior, pending/degraded report lifecycle, trades/report/timeline reads, cross-mode aggregation, and Web route/detail/report states. | Refresh production-safe disposable backtest/report fixture proof after future deployments; keep non-Binance historical order-book parity and richer report filters/snapshots/i18n as future scope. |
| AUD-17 | current local / current historical production-safe action readback | 2026-05-19 focused local logs packs passed: Web logs/audit UI (`2` files / `3` tests) and API logs/pagination (`2` files / `5` tests). Coverage includes authenticated reads, owner scoping, source/actor/severity filters, pagination defaults/bounds, action-produced event visibility, metadata trace text rendering, and Web route states. | Refresh production-safe action-produced audit readback after future deployments; track total-count envelope, pagination controls, saved filters, index tuning, and wallet command audit-event write coverage. |
| AUD-18 | current local / current historical production-safe protected route proof | 2026-05-19 focused local admin/subscriptions packs passed: Web admin/profile subscription (`4` files / `9` tests) and API admin/subscriptions/entitlements (`5` files / `25` tests). Coverage includes admin-only access, user listing with subscription metadata, role/plan updates, self-demotion prevention, plan/entitlement validation, profile subscription readback, bot limit and LIVE trading gates, and Web admin/profile subscription states. | Refresh production-safe protected admin route proof after future deployments; keep production entitlement mutation excluded until explicit safe admin-ops plan; track checkout provider e2e/webhook lifecycle and admin UX follow-ups. |
| AUD-19 | current local / historical production release gate | 2026-05-19 local typecheck, lint, build, go-live smoke, and local DB backup/restore check passed. Go-live smoke covered API (`45` tests) and Web (`18` tests). Backup/restore check requires a running local Postgres container and produced a dated local restore report after infra startup. | Production release gate remains historical for deployed `457bce05`; rerun build-info, deploy smoke, protected runtime, rollback, backup/restore, and sign-off evidence before any new production release claim. |
| AUD-20 | current foundation / hot-path assistant scope deferred | Assistant config, subagent slot CRUD, dry-run, deterministic orchestrator fail-closed behavior, policy gates, circuit breaker, and Web assistant route tests are locally proven. `DEC-AUD-002` narrowed current architecture truth to foundation/dry-run and deferred hot-path assistant orchestration. | Plan hot-path BACKTEST/PAPER/LIVE assistant orchestration only as a separate future AI/security slice with persisted trace, fail-closed runtime integration, and full AI red-team evidence. |
| AUD-21 | deferred / scaffold-only scope verified | 2026-05-19 audit confirms `apps/mobile` contains only `package.json`, `README.md`, and `src/.gitkeep`; build/test scripts are scaffold echoes; `apps/mobile/README.md` and `docs/planning/mobile-parity-contract.md` state no production mobile runtime or independent mobile backend contracts. | Before mobile activation, replace scaffold script echoes with real Expo/native build/test contracts and create module docs; keep responsive Web mobile evidence under `AUD-05`. |
| AUD-22 | current local | 2026-05-19 route-reachable i18n audit passed with `0` findings, `0` local copy, `0` fallback Polish, and `0` hardcoded. Focused Web i18n pack passed (`8` files / `26` tests). | Rerun route-reachable i18n audit after route/copy changes; keep repository artifacts in English per language policy. |
| AUD-23 | current local traceability | This baseline, the route-state operation artifact, and endpoint-level API docs parity artifact update audit traceability. Endpoint docs parity now passes with `0` gaps. | Rerun docs parity and endpoint docs parity after route/module documentation changes. |

## Route-State Summary

- Route checks: `53`
- Pass: `53`
- Check/fail: `0`
- Console warning/error routes: `0`
- Screenshots: `6`
- Endpoint docs parity: `109` endpoints, `109` documented, `0` gaps
- Assistant runtime truth: deterministic foundation PASS, hot-path integration
  not proven, full AI red-team protocol not passed
- Exchange capability truth: exact `(exchange, marketType, operation)`
  capability matrix PASS locally after repair
- Architecture exchange-scope wording: overview/domain stale or ambiguous
  against newer exchange contracts and current code
- Security/privacy truth: local focused proof PASS for auth/session,
  trusted-origin, headers, rate limits, profile security, API-key secrecy and
  ownership, abuse throttling, cross-module isolation, and Web auth/profile
  behavior
- Workers/runtime operations: local focused proof PASS for worker topology,
  protected health/readiness, runtime freshness, market-stream fanout and
  routes, queue tuning, backtest job persistence, execution orchestration, and
  PAPER runtime-flow telemetry
- Data model/migrations: local schema validation, migration status, full
  migration replay, schema diff generation, and isolated wallet/backtest/runtime
  DB-contract tests PASS; shared-DB parallel e2e execution remains a known
  pitfall mitigated by `audit:data:db-isolated`
- Bots/runtime truth: local focused proof PASS for bot CRUD/ownership,
  wallet-first writes, duplicate/entitlement gates, selected-bot runtime scope,
  aggregate monitoring truth, history parity, takeover visibility, LIVE/PAPER
  isolation, delete cleanup, and Web bot/dashboard runtime surfaces
- Engine/trading decision flow: local focused proof PASS for deterministic
  merge, final-candle flow, runtime loop/supervisor, pre-trade/risk,
  execution orchestration, dedupe, exchange guard, PAPER/LIVE parity,
  market-data gateway, position automation, and DB-backed PAPER runtime flow
- Orders/manual trading: local focused proof PASS for manual context/scope,
  PAPER lifecycle, order ownership, active-only filtering, fills, fees,
  exchange events, fail-closed exchange-backed cancel boundary, LIVE risk
  guards, and Web manual/open-order action states
- Positions/reconciliation: local focused proof PASS for list/read ownership,
  live-status, exchange snapshot selection/normalization/fail-closed behavior,
  takeover/rebind, orphan repair, imported history hydration, reconciliation
  diagnostics, runtime position derivations, and close-state UI
- Wallets/capital ledger: local focused proof PASS for wallet CRUD, ownership,
  PAPER/LIVE validation, API-key binding, balance preview, active-bot
  edit/delete/reset guards, paper reset checkpoint, wallet-first bot contract,
  runtime capital source truth, cashflow/equity ledger states, and
  partial/unavailable ledger UI
- Markets/strategies configuration: local focused proof PASS for
  market-universe composition, catalog behavior, market and strategy CRUD,
  active-bot guards, strategy import/export/config validation, inactive-bot
  edit allowance, active-bot lock UI, and indicator registry/presentation
  parity
- Backtests/reports: local focused proof PASS for run lifecycle, ownership,
  explicit range validation, queue/job/replay, fill model, data gateway,
  runtime-kernel parity, immutable snapshots, pending/degraded report
  lifecycle, trades/report/timeline reads, cross-mode aggregation, and Web
  route/detail/report states
- Logs/audit trail: local focused proof PASS for authenticated reads, owner
  scoping, source/actor/severity filters, pagination defaults/bounds,
  action-produced event visibility, metadata trace text rendering, and Web
  route states
- Admin/subscriptions/entitlements: local focused proof PASS for admin-only
  access, user listing with subscription metadata, role/plan updates,
  self-demotion prevention, plan/entitlement validation, profile subscription
  readback, bot limit and LIVE trading gates, and Web admin/profile states
- Production mutation: none
- LIVE order/cancel/close: none
- Exchange-side mutation: none
- Existing production data mutation: none

## Known Execution Notes

- The backend dev process requires the versioned API-key encryption keyring in
  the process environment. The local `.env` still contains the older
  `API_KEY_ENCRYPTION` style, so the audit used process-local test env values
  rather than editing `.env`.
- PowerShell `Start-Process -Command` needs careful quoting or `cmd /c set ...`
  for `$env:` assignments; otherwise variables can be stripped before the child
  process starts.
- Use `corepack pnpm` in this Windows Codex session. Direct `pnpm` was not on
  PATH during the security audit.
- The Web route-group test path `src/app/(public)/auth/...` should be run via
  direct Vitest from `apps/web` (`node .\node_modules\vitest\vitest.mjs run
  'src/app/(public)/auth/authPageCacheContract.test.ts'`) when the Corepack
  shell shim strips quoting around parentheses.

## Priority Repair/Audit Queue After This Baseline

1. `AUD-19`: rerun the production release gate before any new production
   readiness claim.
2. Future assistant AI: before any deployable AI trading behavior claim,
   implement hot-path orchestration separately and add full AI red-team
   evidence.
3. Future Gate.io production/live claims: prove the exact exchange, market
   type, and operation being claimed before promoting readiness.
4. `AUD-03` and `AUD-23`: keep endpoint-level API docs parity green after route changes.
5. `AUD-06`: schedule external independent security review before broader
   public launch and refresh production-safe proof after future deploys.
6. `AUD-07`: use `audit:data:db-isolated` for representative DB-backed audit
   packs or provide isolated databases/schemas; refresh production
   migration/backup/restore proof under `AUD-19` before future deploys.
7. `AUD-08`: refresh production-safe protected worker/process proof after
   future deployments or worker topology changes; keep Gate.io/second-LIVE
   production runtime shape outside current claims until explicitly planned.
8. `AUD-10`: refresh production-safe bot/runtime proof after future deploys and
   keep future hot-path assistant work separate from current bot runtime claims.
9. `AUD-11`: keep LIVE/exchange-side mutation excluded until an explicit safe
   plan, and keep future hot-path assistant work separate from current engine
   claims.
10. `AUD-12`: refresh production-safe PAPER proof after future deploys and keep
   LIVE order/cancel/close mutation excluded until an explicit safe plan.
11. `AUD-13`: refresh production-safe PAPER proof after future deploys and keep
   LIVE position mutation excluded until an explicit safe plan.
12. `AUD-14`: refresh production-safe disposable wallet proof after future
    deploys, keep LIVE exchange mutation excluded until an explicit safe plan,
    and track wallet command audit-log events under `AUD-17`.
13. `AUD-15`: refresh production-safe disposable market/strategy fixture proof
    after future deploys; track catalog freshness telemetry, typed strategy
    domain errors, and Web strategy i18n/dirty-state follow-ups.
14. `AUD-16`: refresh production-safe disposable backtest/report fixture proof
    after future deploys; keep non-Binance historical order-book parity and
    richer report filters/snapshots/i18n as future scope.
15. `AUD-17`: refresh production-safe action-produced audit readback after
    future deploys; track total-count envelope, pagination controls, saved
    filters, index tuning, and wallet command audit-event write coverage.
16. `AUD-18`: refresh production-safe protected admin route proof after future
    deploys; keep production entitlement mutation excluded until explicit
    safe admin-ops plan; track checkout provider e2e/webhook lifecycle and
    admin UX follow-ups.
17. Extend `AUD-05` with deeper keyboard/focus/accessibility assertions if the
   UX audit needs CI-grade repeatability beyond Browser screenshots.

## Explicit Exclusions

- No production journey was run today.
- No LIVE order/cancel/close or exchange-side mutation was run.
- No existing production data was mutated.
- No code behavior was changed.
