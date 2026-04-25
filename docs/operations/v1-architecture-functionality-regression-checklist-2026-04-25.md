# V1 Architecture Functionality Regression Checklist

Status: Active  
Updated: 2026-04-25

## Purpose

Provide one reusable, architecture-based V1 checklist that can be executed:

- before release or deploy
- after a risky runtime change
- as a weekly regression sweep
- after bug-fix waves such as `V1COH-A` or `XADAPT-A`

The checklist maps architecture-defined V1 functions to:

- current implementation status
- automated verification from repository test files
- manual browser verification steps
- follow-up action if the behavior is missing or regressed

## How To Use

1. Run the automated pack for the touched functions first.
2. Execute the matching browser/manual checks.
3. Compare observed behavior with the architecture contract.
4. If behavior is missing or wrong:
   - use the existing queued wave when one already covers the gap
   - otherwise queue a new task under the `V1REG` family
5. After fixes, rerun both the automated and manual checks for the affected
   function.

## Status Legend

- `IMPLEMENTED`: architecture function exists and is covered by at least one
  automated and one manual verification path
- `PARTIAL`: function exists, but there is an active known gap, queued closure
  work, or missing operator truth
- `OPS_PARTIAL`: code behavior is present, but the remaining truth gap is in
  deployment, evidence, or operator activation artifacts

## Execution Log Template

```markdown
### YYYY-MM-DD - Regression Run
- Scope:
- Automated packs run:
- Manual flows checked:
- Functions passed:
- Functions failed:
- Queued follow-up tasks:
- Notes:
```

## Function Checklist

### F01 - Authentication and protected operator access
- Architecture source:
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/auth/auth.e2e.test.ts`
    - `apps/api/src/modules/auth/auth.service.test.ts`
  - Web:
    - `apps/web/src/features/auth/components/LoginForm.test.tsx`
    - `apps/web/src/features/auth/components/RegisterForm.test.tsx`
    - `apps/web/src/features/auth/hooks/useLoginForm.test.tsx`
- Manual browser verification:
  - open `/auth/login`
  - submit invalid credentials and verify explicit error without false success
  - submit valid credentials and verify redirect into dashboard
  - open a protected dashboard route in a fresh unauthenticated session and
    verify redirect back to login
- If failed:
  - queue bugfix under `V1REG-F01 auth/protected-route regression`

### F02 - Exchange credentials and API-key onboarding
- Architecture source:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Status: `IMPLEMENTED` for Binance-first V1 scope
- Automated verification:
  - API:
    - `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`
    - `apps/api/src/modules/profile/apiKey/binanceApiKeyProbe.service.test.ts`
  - Web:
    - `apps/web/src/features/profile/components/ApiKeyForm.test.tsx`
    - `apps/web/src/features/profile/components/ApiKeysList.test.tsx`
    - `apps/web/src/features/exchanges/components/ExchangeConnectionsView.test.tsx`
- Manual browser verification:
  - open profile/API-key area
  - attempt to test invalid Binance credentials and verify explicit error
  - if safe test credentials are available, verify successful connection test
    and save flow
  - verify LIVE-ready save cannot bypass the connection-test contract
- If failed:
  - Binance credential or permission regression -> queue `V1REG-F02`
  - exchange-scope truth drift -> use `XADAPT-A`

### F03 - Wallet execution context and capital baseline
- Architecture source:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
    - `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
    - `apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts`
  - Web:
    - `apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx`
    - `apps/web/src/features/wallets/components/WalletsListTable.test.tsx`
- Manual browser verification:
  - create a `PAPER` wallet and verify baseline/currency rendering
  - create or edit a `LIVE` wallet with compatible venue context
  - verify wallet appears before bot creation and is required by the flow
  - if open orders exist, verify destructive wallet actions remain blocked or
    explicit
- If failed:
  - queue `V1REG-F03 wallet execution/capital regression`

### F04 - Market universes and symbol groups
- Architecture source:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/markets/markets.e2e.test.ts`
    - `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`
  - Web:
    - `apps/web/src/features/markets/components/MarketUniverseForm.test.tsx`
    - `apps/web/src/features/markets/components/MarketUniversesTable.test.tsx`
- Manual browser verification:
  - create a market universe with filters and/or whitelist/blacklist
  - verify resulting symbol scope is explainable
  - create or edit a symbol group from that universe
  - verify venue context shown in UI matches the parent market universe
- If failed:
  - queue `V1REG-F04 market-universe or symbol-group regression`

### F05 - Strategy builder and indicator registry parity
- Architecture source:
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/07_modes-parity-and-data.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/strategies/strategies.e2e.test.ts`
    - `apps/api/src/modules/strategies/indicators/indicators.service.test.ts`
    - `apps/api/src/modules/engine/strategyIndicatorRegistryParity.test.ts`
    - `apps/api/src/modules/engine/strategySignalEvaluator.test.ts`
  - Web:
    - `apps/web/src/features/strategies/components/StrategyForm.test.tsx`
    - `apps/web/src/features/strategies/components/StrategyFormSections/Indicators.test.tsx`
    - `apps/web/src/features/strategies/utils/StrategyForm.map.test.ts`
- Manual browser verification:
  - open strategy create/edit
  - add supported indicators and save strategy
  - verify unsupported or invalid configuration cannot masquerade as valid
  - verify strategy lifetime and risk fields remain explicit in the form
- If failed:
  - queue `V1REG-F05 strategy-builder or indicator-parity regression`

### F06 - Bot creation, singular runtime context, and entitlements
- Architecture source:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/bots/bots.e2e.test.ts`
    - `apps/api/src/modules/bots/bots.wallet-contract.e2e.test.ts`
    - `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts`
    - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - Web:
    - `apps/web/src/features/bots/components/BotCreateEditForm.test.tsx`
    - `apps/web/src/features/bots/components/BotsListTable.test.tsx`
- Manual browser verification:
  - create a bot with one wallet, one symbol group, and one strategy
  - verify incompatible venue or wallet context is rejected
  - verify bot cannot be activated into LIVE without required consent/context
  - verify bot list and detail show inherited context rather than fake local
    overrides
- If failed:
  - queue `V1REG-F06 bot-context or entitlement regression`

### F07 - Backtest run, report, timeline, and replay diagnostics
- Architecture source:
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/07_modes-parity-and-data.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
    - `apps/api/src/modules/backtests/backtestReplayCore.test.ts`
    - `apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts`
    - `apps/api/src/modules/backtests/backtestParity3Symbols.test.ts`
  - Web:
    - `apps/web/src/features/backtest/components/BacktestCreateForm.test.tsx`
    - `apps/web/src/features/backtest/components/BacktestRunDetails.test.tsx`
    - `apps/web/src/features/backtest/components/BacktestsListView.test.tsx`
    - `apps/web/src/features/backtest/components/BacktestsRunsTable.test.tsx`
- Manual browser verification:
  - create a backtest run from an existing strategy and market group
  - verify run progresses and details page renders summary/markets/trades/raw
  - verify failed or degraded states are explicit
  - verify timeline overlays and parity diagnostics are readable
- If failed:
  - queue `V1REG-F07 backtest/replay/report regression`

### F08 - Paper runtime and execution lifecycle parity
- Architecture source:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/engine/paperRuntime.service.test.ts`
    - `apps/api/src/modules/engine/paperLifecycle.service.test.ts`
    - `apps/api/src/modules/engine/paperLiveDecisionEquivalence.test.ts`
    - `apps/api/src/modules/engine/executionAdapterParity.test.ts`
  - Web:
    - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
    - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx`
- Manual browser verification:
  - activate a paper bot
  - wait for runtime rows or use manual PAPER order if needed
  - verify order -> fill -> position visibility follows one coherent lifecycle
  - verify paper capital and runtime history move consistently after open/close
- If failed:
  - queue `V1REG-F08 paper-runtime parity regression`

### F09 - Manual LIVE order path and submitted->reconciled truth
- Architecture source:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Status: `PARTIAL`
- Known queued closure:
  - `V1COH-03`
  - `V1COH-04`
  - `V1COH-05`
  - `V1COH-06`
- Automated verification:
  - API:
    - `apps/api/src/modules/orders/orders.service.test.ts`
    - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
    - `apps/api/src/modules/engine/runtime-flow.e2e.test.ts`
  - Web:
    - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx`
    - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx`
- Manual browser verification:
  - precondition: verified Binance test credentials and a LIVE-capable bot
  - open selected-bot dashboard manual order
  - submit manual LIVE market order with risk acknowledgment
  - verify the UI distinguishes `submitted` from `position_opened` until
    reconciliation truth exists
  - verify no fake position-open state appears before exchange truth confirms it
- If failed:
  - use `V1COH-A`; do not queue a parallel workaround path

### F10 - Exchange snapshots, open orders, and external position sync
- Architecture source:
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Status: `PARTIAL`
- Known queued closure:
  - `XADAPT-01..06`
- Automated verification:
  - API:
    - `apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts`
    - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
    - `apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts`
    - `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`
    - `apps/api/src/modules/exchange/liveOrderAdapter.service.test.ts`
  - Web:
    - `apps/web/src/features/profile/components/ApiKeysList.test.tsx`
    - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx`
- Manual browser verification:
  - fetch exchange snapshot for a Binance-linked account
  - verify unsupported exchange scope is not presented as supported behavior
  - if external positions/orders exist, verify source and management state are
    explicit
  - verify imported `EXCHANGE_SYNC` state does not silently claim bot ownership
    without proof
- If failed:
  - authenticated read/write boundary drift -> use `XADAPT-A`
  - ownership/reconciliation bug -> queue `V1REG-F10`

### F11 - Runtime execution loop, pre-trade, DCA, and lifetime enforcement
- Architecture source:
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/engine/preTrade.e2e.test.ts`
    - `apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts`
    - `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
    - `apps/api/src/modules/engine/runtimeOrderLifetime.service.test.ts`
    - `apps/api/src/modules/engine/runtimePositionLifetime.service.test.ts`
  - Web:
    - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx`
- Manual browser verification:
  - verify a running bot shows evaluated runtime state
  - verify stale order or position behavior is explicit where applicable
  - verify cancel/close actions do not bypass confirmations or guardrails
  - verify no-flip and insufficient-funds outcomes remain visible, not silent
- If failed:
  - queue `V1REG-F11 runtime loop or lifecycle regression`

### F12 - Dashboard selected-bot runtime surface
- Architecture source:
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- Status: `PARTIAL`
- Known queued closure:
  - `V1COH-05`
  - `V1COH-06`
- Automated verification:
  - Web:
    - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
    - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`
    - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx`
    - `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
  - API support:
    - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Manual browser verification:
  - select a bot on dashboard
  - verify `loading`, `empty`, `degraded`, `error`, and `success` states are
    explicit rather than hidden
  - verify configured-only rows look like snapshots, not accepted runtime
    signals
  - verify manual LIVE action states remain truthful before and after
    reconciliation
- If failed:
  - manual LIVE state truth -> use `V1COH-A`
  - general dashboard regression -> queue `V1REG-F12`

### F13 - Bots runtime monitoring and assistant surface
- Architecture source:
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/reference/assistant-runtime-contract.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
    - `apps/api/src/modules/bots/bots.orchestration.e2e.test.ts`
    - `apps/api/src/modules/engine/assistantOrchestrator.parity.test.ts`
  - Web:
    - `apps/web/src/features/bots/components/BotsManagement.test.tsx`
    - `apps/web/src/features/bots/services/botsMonitoringAggregate.service.test.ts`
- Manual browser verification:
  - open bot detail/management
  - verify monitoring states match dashboard truth for the same bot
  - open Assistant tab and verify main/subagent configuration is visible
  - if assistant dry-run is available in the flow, verify explainability output
    is explicit rather than silent
- If failed:
  - queue `V1REG-F13 bot-monitoring or assistant regression`

### F14 - Market stream ingest and server-owned live market bar
- Architecture source:
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/market-stream/binanceStream.service.test.ts`
    - `apps/api/src/modules/market-stream/marketStream.routes.contract.test.ts`
    - `apps/api/src/modules/market-stream/marketStream.routes.e2e.test.ts`
  - Web:
    - `apps/web/src/features/dashboard-home/components/LiveMarketBar.test.tsx`
- Manual browser verification:
  - open dashboard home
  - verify live market bar loads through server-owned stream
  - verify stale or disconnected state is explicit
  - verify browser does not require direct exchange transport knowledge
- If failed:
  - queue `V1REG-F14 market-stream or SSE regression`

### F15 - Reports and audit logs
- Architecture source:
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
- Status: `IMPLEMENTED`
- Automated verification:
  - API:
    - `apps/api/src/modules/reports/reports.service.test.ts`
    - `apps/api/src/modules/logs/logs.e2e.test.ts`
  - Web:
    - `apps/web/src/features/reports/components/PerformanceReportsView.test.tsx`
    - `apps/web/src/features/logs/components/AuditTrailView.test.tsx`
- Manual browser verification:
  - open reports page and verify performance data renders with explicit empty or
    degraded states where needed
  - open logs page and filter audit entries
  - verify critical actions such as manual trading or auth-sensitive changes
    leave readable traces
- If failed:
  - queue `V1REG-F15 reports/logs regression`

### F16 - Deployment topology, health, readiness, and operator activation truth
- Architecture source:
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- Status: `OPS_PARTIAL`
- Known queued closure:
  - `V1READY-2026-04-25-A`
- Automated verification:
  - repository-level:
    - `pnpm run build`
    - `pnpm run quality:guardrails`
    - `pnpm run test:go-live:smoke` when local infra is available
- Manual verification:
  - verify `/health`, `/ready`, and `/workers/health`
  - verify deployed worker ownership is treated as `split` healthy baseline
  - verify any `inline` exception mode is explicit and operator-visible
  - verify activation/sign-off artifacts still match the real repository and
    deployment state
- If failed:
  - ops artifact drift or final activation truth mismatch -> use
    `V1READY-2026-04-25-A`
  - code/runtime issue discovered during smoke -> queue a new fix task under
    the relevant function family

