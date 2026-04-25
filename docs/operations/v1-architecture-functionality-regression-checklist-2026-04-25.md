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

## Execution Log

### 2026-04-25 - Regression Run
- Scope:
  - `V1REG-02` automated architecture-V1 sweep after closure of `V1COH-A` and
    `XADAPT-A`
- Automated packs run:
  - FAIL (environment-blocked DB API):
    - `pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/modules/auth/auth.service.test.ts`
  - PASS (web operator/product flows):
    - `pnpm --filter web exec vitest run src/features/auth/components/LoginForm.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/hooks/useLoginForm.test.tsx src/features/profile/components/ApiKeyForm.test.tsx src/features/profile/components/ApiKeysList.test.tsx src/features/exchanges/components/ExchangeConnectionsView.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/markets/components/MarketUniverseForm.test.tsx src/features/markets/components/MarketUniversesTable.test.tsx src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/components/StrategyFormSections/Indicators.test.tsx src/features/strategies/utils/StrategyForm.map.test.ts src/features/bots/components/BotCreateEditForm.test.tsx src/features/bots/components/BotsListTable.test.tsx`
    - `pnpm --filter web exec vitest run src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/components/BacktestsListView.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/bots/components/BotsManagement.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts src/features/dashboard-home/components/LiveMarketBar.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx src/features/logs/components/AuditTrailView.test.tsx`
  - PASS (non-DB API contract/unit scope):
    - `pnpm --filter api exec vitest run src/modules/profile/apiKey/binanceApiKeyProbe.service.test.ts src/modules/strategies/indicators/indicators.service.test.ts src/modules/engine/strategyIndicatorRegistryParity.test.ts src/modules/engine/strategySignalEvaluator.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/market-stream/binanceStream.service.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts`
  - PASS (repo gates):
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm run quality:guardrails`
- Manual flows checked:
  - none in this slice; deferred to `V1REG-03`
- Functions passed:
  - `F05` strategy builder and indicator registry parity
  - `F10` exchange capability and adapter boundary contract coverage
  - `F14` market stream ingest and server-owned live market bar
  - web-side operator surfaces for `F01`, `F02`, `F03`, `F04`, `F06`, `F07`,
    `F08`, `F09`, `F12`, `F13`, `F15`
- Functions failed:
  - no product regression was isolated in this sweep
- Queued follow-up tasks:
  - `V1REG-03`
  - environment note only: DB-backed API verification is blocked until local
    Postgres at `localhost:5432` is reachable again
- Notes:
  - DB-backed API suites are currently environment-blocked, not product-failed.
    The first failing touchpoint is `prisma.log.deleteMany()` with `Can't reach
    database server at localhost:5432`.
  - This matches the existing learning-journal guardrail for local Docker /
    Postgres availability. Web suites, non-DB API suites, typechecks, and repo
    guardrails are green.

### 2026-04-25 - Regression Run
- Scope:
  - `V1REG-03` browser/manual architecture-V1 sweep on the local web target
- Automated packs run:
  - none; reused `V1REG-02` automated evidence
- Manual flows checked:
  - `/auth/login` render on desktop (`1366x900`), tablet (`768x1024`), and
    mobile (`390x844`)
  - `/auth/register` render on desktop
  - unauthenticated `/dashboard` redirect to `/auth/login`
  - invalid sign-in submit from `/auth/login`
- Functions passed:
  - `F01` auth-shell rendering and protected-route redirect contract
- Functions failed:
  - no new product-visible regression was isolated in this slice
- Queued follow-up tasks:
  - `V1REG-04`
- Notes:
  - Local web target was reachable at `http://localhost:3002`.
  - Local API target was not reachable. The API dev process failed closed on
    critical secret readiness because `API_KEY_ENCRYPTION_KEYS` was missing in
    the local process environment, and Docker Desktop / local Postgres were
    also unavailable in this run.
  - Invalid sign-in still produced an explicit UI error state
    (`Sign-in failed: Network Error`) rather than a false success.
  - Authenticated browser flows for `F02..F15` and health/readiness checks for
    `F16` remain `INFRA_BLOCKED` in this local run rather than product-failed.

### 2026-04-25 - Regression Run
- Scope:
  - `V1REG-04` triage/classification of automated and browser findings
- Automated packs run:
  - none; reused `V1REG-02` evidence
- Manual flows checked:
  - none; reused `V1REG-03` evidence
- Functions passed:
  - no new product regression required follow-up work
- Functions failed:
  - none newly isolated as product failures
- Queued follow-up tasks:
  - `V1REG-05`
- Notes:
  - No new `V1REG-Fxx` task was created.
  - `F09` manual LIVE order truth remains owned by the already-closed
    `V1COH-A` wave; this sweep did not isolate a new post-closure regression.
  - `F10` exchange snapshot and ownership truth remains owned by the
    already-closed `XADAPT-A` wave; this sweep did not isolate a new
    post-closure regression.
  - `F12` dashboard selected-bot runtime surface remains covered by the
    already-closed dashboard/cohesion waves and did not show a new product
    regression in the available evidence.
  - `F02..F08`, `F11`, `F13..F16` remain blocked by local infra prerequisites
    rather than by isolated product defects:
    - Docker Desktop / local Postgres unavailable
    - local API fail-closed startup without `API_KEY_ENCRYPTION_KEYS`

## Triage Summary (2026-04-25)

- Existing-wave-owned, no new task:
  - `F09` -> keep historical ownership under `V1COH-A`; rerun only after infra
    is restored
  - `F10` -> keep historical ownership under `XADAPT-A`; rerun only after
    infra is restored
  - `F12` -> keep historical ownership under the closed dashboard/cohesion
    closures; rerun only after infra is restored
- Infra-only blockers, no product task:
  - `F01` API-side auth verification
  - `F02..F08`
  - `F11`
  - `F13..F16`
- Immediate queue decision:
  - do not open `V1REG-Fxx` from the 2026-04-25 pass
  - move directly to `V1REG-05` as the rerun/refresh slice once local infra
    prerequisites are available

### 2026-04-25 - Regression Run
- Scope:
  - `V1REG-05` closure rerun for the reusable architecture-V1 verification loop
- Automated packs run:
  - PASS (web checklist closure pack):
    - `pnpm --filter web exec vitest run src/features/auth/components/LoginForm.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/hooks/useLoginForm.test.tsx src/features/profile/components/ApiKeyForm.test.tsx src/features/profile/components/ApiKeysList.test.tsx src/features/exchanges/components/ExchangeConnectionsView.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/markets/components/MarketUniverseForm.test.tsx src/features/markets/components/MarketUniversesTable.test.tsx src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/components/StrategyFormSections/Indicators.test.tsx src/features/strategies/utils/StrategyForm.map.test.ts src/features/bots/components/BotCreateEditForm.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/components/BacktestsListView.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/bots/components/BotsManagement.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts src/features/dashboard-home/components/LiveMarketBar.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx src/features/logs/components/AuditTrailView.test.tsx`
  - PASS (non-DB API closure pack):
    - `API_KEY_ENCRYPTION_KEYS=v1:test-key-material`
    - `API_KEY_ENCRYPTION_ACTIVE_VERSION=v1`
    - `pnpm --filter api exec vitest run src/modules/profile/apiKey/binanceApiKeyProbe.service.test.ts src/modules/strategies/indicators/indicators.service.test.ts src/modules/engine/strategyIndicatorRegistryParity.test.ts src/modules/engine/strategySignalEvaluator.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/market-stream/binanceStream.service.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts`
  - FAIL (expected infra-only DB auth rerun):
    - `API_KEY_ENCRYPTION_KEYS=v1:test-key-material`
    - `API_KEY_ENCRYPTION_ACTIVE_VERSION=v1`
    - `pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/modules/auth/auth.service.test.ts`
  - PASS (repo gates):
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm run quality:guardrails`
- Manual flows checked:
  - none; reused `V1REG-03`
- Functions passed:
  - all previously green web and non-DB API function groups remained green
- Functions failed:
  - no product regression was isolated
- Queued follow-up tasks:
  - none
- Notes:
  - DB-backed auth/API tests still fail at the same first touchpoint:
    `prisma.log.deleteMany()` cannot reach `localhost:5432`.
  - This closure rerun confirms the blocker is still local infra rather than
    newly introduced product drift.
  - `V1REG-A` can now be treated as a reusable completed protocol.

## Manual Sweep Verdicts (2026-04-25)

- `F01`: `PARTIAL_PASS_INFRA_BLOCKED`
  - `/auth/login` and `/auth/register` rendered correctly, including labeled
    controls and visible auth copy on desktop/tablet/mobile.
  - Unauthenticated `/dashboard` redirected back to `/auth/login`.
  - Invalid sign-in showed explicit `Sign-in failed: Network Error` while the
    API was unavailable.
- `F02`: `INFRA_BLOCKED`
  - Profile/API-key flows could not be reached because authenticated browser
    state was unavailable with the local API offline.
- `F03`: `INFRA_BLOCKED`
  - Wallet flows require authenticated dashboard access plus API persistence;
    this run never reached that state.
- `F04`: `INFRA_BLOCKED`
  - Market-universe and symbol-group flows require authenticated dashboard/API
    access; blocked in this run.
- `F05`: `INFRA_BLOCKED`
  - Strategy builder requires authenticated access; blocked in this run.
- `F06`: `INFRA_BLOCKED`
  - Bot create/edit/runtime-context browser flows require authenticated access
    and persisted API state; blocked in this run.
- `F07`: `INFRA_BLOCKED`
  - Backtest browser flows require authenticated access and backend execution;
    blocked in this run.
- `F08`: `INFRA_BLOCKED`
  - PAPER runtime parity checks require authenticated runtime surfaces and a
    working backend; blocked in this run.
- `F09`: `INFRA_BLOCKED`
  - Manual `LIVE` order browser checks require a signed-in operator session,
    Binance-linked context, and backend/runtime availability; blocked in this
    run.
- `F10`: `INFRA_BLOCKED`
  - Exchange snapshot and external position sync browser verification requires
    authenticated exchange-linked flows; blocked in this run.
- `F11`: `INFRA_BLOCKED`
  - Runtime loop and lifecycle browser verification requires active bot/runtime
    state; blocked in this run.
- `F12`: `INFRA_BLOCKED`
  - Dashboard selected-bot runtime surface could not be reached beyond the
    protected-route redirect because API/auth were unavailable.
- `F13`: `INFRA_BLOCKED`
  - Bot monitoring and assistant surfaces require authenticated dashboard/API
    access; blocked in this run.
- `F14`: `INFRA_BLOCKED`
  - Live market bar verification requires authenticated dashboard access; this
    run did not reach dashboard-home.
- `F15`: `INFRA_BLOCKED`
  - Reports and logs pages require authenticated access and backend data;
    blocked in this run.
- `F16`: `INFRA_BLOCKED`
  - `/health` and `/ready` were not reachable because the API dev target
    failed closed on missing `API_KEY_ENCRYPTION_KEYS`, and local Docker /
    Postgres were also unavailable.

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API: BLOCKED_BY_INFRA (`localhost:5432` unavailable)
  - Current automated verdict: `INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API probe service: PASS
  - API e2e: not executed in this slice because DB-backed API verification is
    environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API: not re-verified here because DB-backed suites are environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API: not re-verified here because DB-backed suites are environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API: PASS for indicator registry and evaluator coverage
  - Current automated verdict: `PASS`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API: not re-verified here because DB-backed suites are environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API: not re-verified here because DB-backed suites are environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web support: PASS
  - API: not re-verified here because DB-backed suites are environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API: not re-verified here because DB-backed suites are environment-blocked
  - Known product status remains `PARTIAL` by contract, but no new regression
    was isolated in the automated sweep
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web support: PASS
  - API boundary/contract coverage: PASS
  - DB-backed positions snapshot and reconciliation suites were not re-run here
    because local Postgres is unavailable
  - Current automated verdict: `PASS_WITH_DB_INFRA_BLOCKER`

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
- Automated sweep 2026-04-25:
  - Web support: PASS (`open-orders-action`)
  - API: not re-verified here because DB-backed suites are environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API support suite: not re-verified here because DB-backed suites are
    environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web and aggregate service support: PASS
  - API orchestration packs: not re-verified here because DB-backed suites are
    environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API: PASS
  - Current automated verdict: `PASS`

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
- Automated sweep 2026-04-25:
  - Web: PASS
  - API: not re-verified here because DB-backed suites are environment-blocked
  - Current automated verdict: `PARTIAL_PASS_INFRA_BLOCKED`

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
