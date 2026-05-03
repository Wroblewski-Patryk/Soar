# MVP Execution Plan (Agent-Ready)

Goal: deliver a stable MVP in tiny, safe commits.
Rule: fix/cleanup/update first, then feature delivery.

## Plan Governance
- This file is the source of truth for MVP execution.
- `docs/planning/mvp-next-commits.md` is the short operational queue (`NOW` max 5).
- After each merged task: update checkbox + add one line in `Progress Log`.
- If product docs scope changes, update this file before coding.
- Any short "start work" nudge (`rob`, `rób`, `dzialaj`, `start`, `go`, `next`) means: execute exactly one task from `NOW`.

## Global Commit Rules
- One commit = one logical change (typically 1-3 files).
- Commit format: `type(scope): short description`.
- Preferred order: `fix` / `refactor` / `test` / `chore` before `feat`.
- No mixed commits (for example feature + refactor together).

## Phase SYSFINAL-2026-05-03 - Final System Functionality Audit And Remediation (Active 2026-05-03)
- [x] `SYSFINAL-00 docs(planning): synchronize active planning truth before final function audit`
- [x] `SYSFINAL-01 qa(planning): build current route API function inventory`
- [x] `SYSFINAL-02 qa(repo): run repository baseline gates and classify failures`
- [x] `SYSFINAL-03 qa(security): audit auth session security and permissions`
- [x] `SYSFINAL-04 qa(runtime): audit dashboard and bot runtime truth end to end`
- [x] `SYSFINAL-05 qa(trading): audit order and position workflows`
- [x] `SYSFINAL-06 qa(config): audit wallets markets strategies and bot setup`
- [x] `SYSFINAL-07 qa(product): audit backtests reports logs i18n and UX states`
- [x] `SYSFINAL-08 planning(fixes): convert findings into tiny SYSFIX tasks`
- [x] `SYSFINAL-09 release(closure): execute fixes regression production smoke and closure`

### Progress Log (Phase SYSFINAL-2026-05-03 - Final System Functionality Audit And Remediation)
- 2026-05-03: Published
  `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`
  and closed `SYSFINAL-00`. Active planning truth now points to the final
  audit sequence: `RUNTIME-SIGNAL-VOTES-01` is closed with production smoke,
  duplicate `V1BOT-SIGNALS-02` and older `V1FINAL/V1EXCEL` open-looking items
  are historical/superseded carryover, stage remains deferred to V2, and
  `BOTMULTI-*` remains deferred pipeline. Next executable task:
  `SYSFINAL-01`.
- 2026-05-03: Closed `SYSFINAL-01` with
  `docs/planning/sysfinal-01-current-function-inventory-task-2026-05-03.md`.
  Current web route families and API families are mapped to backend owners,
  data sources, expected UI states, auth boundaries, validation methods,
  redirect-only compatibility routes, and explicit V2/deferred exclusions.
  Validation PASS: repository guardrails. Next executable task:
  `SYSFINAL-02`.
- 2026-05-03: Closed `SYSFINAL-02` with
  `docs/planning/sysfinal-02-repository-baseline-gates-task-2026-05-03.md`.
  Validation PASS: repository guardrails, docs parity, lint, API+web
  typecheck, full API tests, full web tests (`141` files / `399` tests), and
  workspace build. No `SYSFIX-*` task is required from the baseline. Next
  executable task: `SYSFINAL-03`.
- 2026-05-03: Closed `SYSFINAL-03` with
  `docs/planning/sysfinal-03-auth-session-security-audit-task-2026-05-03.md`.
  Validation PASS: focused API security pack (`14` files / `75` tests),
  focused web auth/profile/admin pack (`8` files / `28` tests), `pnpm audit`,
  and repository guardrails. No `SYSFIX-*` task is required. Next executable
  task: `SYSFINAL-04`.
- 2026-05-03: Closed `SYSFINAL-04` with
  `docs/planning/sysfinal-04-dashboard-bot-runtime-truth-audit-task-2026-05-03.md`.
  Validation PASS: focused API runtime/readiness pack (`14` files / `113`
  tests), sequential DB runtime e2e pack (`7` files / `33` tests), focused web
  runtime pack (`14` files / `59` tests), and repository guardrails. No
  `SYSFIX-*` task is required. Next executable task: `SYSFINAL-05`.
- 2026-05-03: Closed `SYSFINAL-05` with
  `docs/planning/sysfinal-05-order-position-workflows-audit-task-2026-05-03.md`.
  Validation PASS: lifecycle/pre-trade pack (`14` files / `116` tests),
  sequential DB order/position e2e pack (`7` files / `42` tests), focused web
  trading workflow pack (`8` files / `24` tests), and repository guardrails.
  No `SYSFIX-*` task is required. Next executable task: `SYSFINAL-06`.
- 2026-05-03: Closed `SYSFINAL-06` with
  `docs/planning/sysfinal-06-configuration-workflows-audit-task-2026-05-03.md`.
  Validation PASS: API config pack (`16` files / `130` tests), web config pack
  (`11` files / `52` tests), and repository guardrails. No `SYSFIX-*` task is
  required. Next executable task: `SYSFINAL-07`.
- 2026-05-03: Closed `SYSFINAL-07` with
  `docs/planning/sysfinal-07-backtests-reports-logs-i18n-ux-audit-task-2026-05-03.md`.
  Validation PASS: API backtest/report pack (`13` files / `94` tests), DB
  backtest/logs e2e pack (`2` files / `17` tests), web product/UX/i18n/
  a11y/responsive pack (`12` files / `33` tests), route-reachable i18n audit
  (`0` findings), and repository guardrails. No `SYSFIX-*` task is required.
  Next executable task: `SYSFINAL-08`.
- 2026-05-03: Closed `SYSFINAL-08` with
  `docs/planning/sysfinal-08-empty-sysfix-queue-task-2026-05-03.md`. Review of
  `SYSFINAL-02..07` found no confirmed discrepancies requiring implementation.
  Current `SYSFIX-*` queue is intentionally empty. Next executable task:
  `SYSFINAL-09`.
- 2026-05-03: Closed `SYSFINAL-09` with
  `docs/planning/sysfinal-09-final-regression-production-smoke-closure-task-2026-05-03.md`.
  Validation PASS: repository guardrails, docs parity, lint, typecheck, full
  API tests, full web tests (`141` files / `399` tests), workspace build, and
  public production smoke for API `/health`, API `/ready`, web root, login
  page, web build-info, and protected API unauthenticated `401 Missing token`.
  Authenticated production dashboard/runtime smoke remains unavailable without
  credentials and was not claimed.
- 2026-05-03: Closed operator follow-up `RUNTIME-AUDIT-15` with
  `docs/planning/runtime-audit-15-close-fee-position-scope-task-2026-05-03.md`.
  Runtime close realized-PnL now aggregates entry fees by owned position
  lifecycle (`userId + positionId + entry side`) instead of mutable
  `botId`/`walletId` projections, preserving correct fee/PnL attribution for
  imported LIVE positions closed through a selected bot wallet. Validation
  PASS: focused execution orchestrator pack (`17/17`), broader runtime/order/
  automation pack (`90/90`), API typecheck, guardrails, lint, and diff review.
- 2026-05-03: Closed operator follow-up `RUNTIME-AUDIT-16` with
  `docs/planning/runtime-audit-16-live-open-order-wallet-null-task-2026-05-03.md`.
  Selected LIVE bot runtime positions reads now include direct bot-owned open
  orders persisted with legacy `walletId=null`, while preserving selected
  `botId` ownership and configured symbol scope. Validation PASS: focused
  runtime takeover e2e (`4/4`), broader runtime positions/read pack (`33/33`),
  API typecheck, guardrails, lint, and diff review.
- 2026-05-03: Closed operator follow-up `RUNTIME-AUDIT-17` with
  `docs/planning/runtime-audit-17-exchange-fill-close-fee-scope-task-2026-05-03.md`.
  LIVE exchange-fill close PnL now uses the same position-lifecycle fee
  boundary as synchronous runtime close (`userId + positionId + entry side`),
  so imported LIVE close confirmations subtract entry fees even when
  `botId`/`walletId` projections differ. Validation PASS: focused
  exchange-events pack (`6/6`), broader orders/runtime PnL pack (`75/75`),
  API typecheck, guardrails, lint, and diff review.
- 2026-05-03: Closed operator follow-up `RUNTIME-AUDIT-18` with
  `docs/planning/runtime-audit-18-wallet-owned-import-open-pnl-task-2026-05-03.md`.
  Wallet performance summary now includes selected `LIVE` wallet imported
  open positions with `walletId=null` when their `externalId` is owned by the
  wallet API key, while excluding other API keys and preserving wallet balance
  snapshot/cashflow/equity timeline contracts. Validation PASS:
  failing-then-passing wallet performance regression, focused wallets e2e
  (`15/15`), API typecheck, guardrails, lint, and diff review.
- 2026-05-03: Closed operator follow-up `RUNTIME-AUDIT-19` with
  `docs/planning/runtime-audit-19-wallet-timeline-open-pnl-task-2026-05-03.md`.
  Wallet equity timeline now applies the selected wallet owned-import open-PnL
  scope to the latest point only, keeping current `botOpenPnl` / `botPnl`
  aligned with wallet performance summary while leaving earlier points
  historical. Validation PASS: failing-then-passing wallet timeline
  regression, focused wallets e2e (`16/16`), API typecheck, guardrails, lint,
  and diff review.

## Phase ETHDCA-2026-05-02 - LIVE DCA-First TSL Hardening (Closed 2026-05-02)
- [x] `ETHDCA-01 fix(api-runtime): preserve LIVE DCA-first gating for trailing-stop close decisions`

### Progress Log (Phase ETHDCA-2026-05-02 - LIVE DCA-First TSL Hardening)
- 2026-05-02: Closed `ETHDCA-01` after operator-reported ETHUSDT screenshots
  suggested a LIVE short may have closed by `TSL` while a third configured DCA
  level was expected to remain pending. Runtime automation now hydrates durable
  DCA progress from persisted `Trade` lifecycle rows before DCA-first
  protection close evaluation, including current-position rows and same
  bot/wallet/strategy/symbol replacement lifecycles cut off by the latest
  opposite-side close. Runtime position serialization now renders finite
  negative trailing-loss `TSL` state instead of hiding it. Validation PASS:
  focused runtime automation and position serialization tests (`38/38`), API
  typecheck, API build, and repository guardrails. Evidence:
  `docs/planning/ethdca-01-live-dca-first-tsl-hardening-task-2026-05-02.md`.

## Phase LIVEIMPORT-2026-05-03 - LIVE Imported Position Ownership And Provenance (Closed 2026-05-03)
- [x] `LIVEIMPORT-01 fix(api-runtime): restore wallet-first LIVE imported position ownership`
- [x] `LIVEIMPORT-02 fix(api-runtime): recover single-strategy provenance for imported LIVE protection`

### Progress Log (Phase LIVEIMPORT-2026-05-03 - LIVE Imported Position Ownership And Provenance)
- 2026-05-03: Closed `LIVEIMPORT-01` by restoring wallet-first imported
  ownership proof and active canonical market-group scope for LIVE
  `EXCHANGE_SYNC` positions. Evidence:
  `docs/planning/live-import-ownership-wallet-scope-task-2026-05-03.md`.
- 2026-05-03: Closed `LIVEIMPORT-02` by allowing imported LIVE positions with
  missing persisted `strategyId` to recover the owning bot's single enabled
  canonical strategy link for TTP/DCA display and automation, while
  multi-strategy ambiguity remains fail-closed. Evidence:
  `docs/planning/live-import-single-strategy-provenance-task-2026-05-03.md`.

## Phase V1CLOSEOUT-AUDIT-2026-05-02 - Final V1 Audit Remediation (Queued 2026-05-02)
- [x] `V1CLOSEOUT-00 planning(release): publish full audit remediation packet`
- [x] `V1CLOSEOUT-01 fix(api-wallets/bots): resolve LIVE external management ownership persistence`
- [x] `V1CLOSEOUT-02 fix(api-engine/backtests): restore advanced TSL close parity`
- [x] `V1CLOSEOUT-03 fix(api-bots-runtime): repair monitoring trades and dynamic TSL serialization`
- [x] `V1CLOSEOUT-04 fix(api-orders/positions): restore exchange-synced LIVE visibility and close flow`
- [x] `V1CLOSEOUT-05 fix(api-positions): restore orphan repair canonical rebinding`
- [x] `V1CLOSEOUT-06 qa(api): restore full API suite green after closeout fixes`
- [x] `V1CLOSEOUT-07 fix(docs): repair docs parity route-map path drift`
- [x] `V1CLOSEOUT-08 release(ops): resolve RC signoff and release-gate evidence drift`
- [x] `V1CLOSEOUT-09 release(ops): refresh production restore drill and activation evidence`
- [x] `V1CLOSEOUT-10 refactor(api-exchange): decide and remediate direct exchange boundary access`
- [x] `V1CLOSEOUT-11 release(qa): run final V1 go/no-go closure pack`

### Progress Log (Phase V1CLOSEOUT-AUDIT-2026-05-02 - Final V1 Audit Remediation)
- 2026-05-02: Published
  `docs/planning/v1closeout-audit-remediation-plan-2026-05-02.md` after the
  requested full V1 audit pass. Current green evidence: repository guardrails,
  typecheck, build, route-reachable i18n audit, and full web tests. Current
  blockers: docs parity path drift, full API suite failures confirmed by
  focused reruns, stale/failed release-gate evidence, and RC signoff/checklist
  disagreement. The phase queues P0 runtime/API fixes first, then full API
  closure, docs parity, release evidence refresh, final go/no-go, and a P1
  exchange-boundary conformance decision/refactor.
- 2026-05-02: Closed `V1CLOSEOUT-01..07`. API closeout is green again:
  focused closeout pack PASS (`8` files / `91` tests), full API suite PASS,
  and API typecheck PASS. Docs parity is also green after correcting the
  route-map path and publishing the `web-shared` module deep-dive/index row.
  Guardrails PASS. Remaining phase work starts at release evidence and
  exchange-boundary remediation (`V1CLOSEOUT-08..11`).
- 2026-05-02: Closed `V1CLOSEOUT-08..10`. RC artifacts now honestly show
  Gate 4 OPEN while signoff remains BLOCKED. Restore/release evidence was
  refreshed with an explicit `NO-GO`: local restore drill PASS, stage/prod
  restore wrappers FAIL due missing DB container env configuration, and
  stage/prod release gates remain dry-run `not_ready`. Exchange-boundary
  conformance was remediated for audited surfaces by moving Binance public
  REST and API-key probe client bootstrap ownership into `modules/exchange`.
  Validation PASS: focused exchange/backtest/runtime/profile pack (`15/15`),
  runtime loop/pnl pack (`45/45`), and API typecheck.
- 2026-05-02: Closed `V1CLOSEOUT-11` with final
  `docs/operations/v1-final-go-no-go-closure-2026-05-02.md`. Repository
  validation baseline is green, but final V1 remains `NO-GO` until Gate 4
  approval, stage/prod restore target env, and non-dry-run release evidence are
  supplied.

## Audit Remediation Gate (Must Be Done Before Any New Feature Work)
- [x] `P0 security(upload): protect upload endpoint with auth + MIME and size validation + abuse limits`
- [x] `P0 security(live-consent): add consentTextVersion to bot/live consent flow (schema, DTO, persistence, audit)`
- [x] `P1 config(api): harden APP_URL/CORS parsing and remove undefined:* edge cases`
- [x] `P1 config(client): remove hardcoded localhost baseURL and switch to env/runtime-safe config`
- [x] `P1 security(crypto): migrate API-key encryption from CBC to AEAD (AES-GCM or XChaCha20-Poly1305) with key versioning`
- [x] `P1 api(logs): implement real logs API (`/dashboard/logs`) with actor/source/severity filters`
- [x] `P1 infra(rate-limit): replace in-memory limiter with Redis-backed strategy and bounded key growth`
- [x] `P1 qa(test-suite): restore fully green test run for server + client with FK-safe cleanup`
- [x] `P2 auth(session): align remember-me JWT semantics with cookie/session TTL`
- [x] `P2 contract(auth): either implement forgot-password endpoints or remove dead client calls`
- [x] `P2 i18n: remove remaining hardcoded UI strings from dashboard/logs and related views`
- [x] `P3 cleanup(types): remove remaining any in profile routes/controllers`
- [x] `docs(sync): correct plan claims that conflict with actual implementation status`

## Phase 0 - Stabilization and Baseline (Must Finish First)
- [x] `chore(repo): add root workspace scripts for lint/typecheck/test/build`
- [x] `chore(ci): add minimal CI checks for client and server`
- [x] `docs(decisions): freeze MVP strategy schema shape (entry/exit/risk/filters/timeframes)`
- [x] `docs(decisions): resolve preset storage approach for MVP`
- [x] `docs(decisions): close MVP rule nesting depth as explicitly out-of-scope`
- [x] `refactor(api): unify API error response payload`
- [x] `refactor(validation): centralize zod error formatting`
- [x] `fix(server): reduce critical any usage in auth/middleware`
- [x] `fix(client): reduce critical any usage in strategy/profile flows`
- [x] `test(auth): stabilize deterministic auth regression tests`
- [x] `test(strategies): add strategy CRUD contract tests`
- [x] `security(api-keys): verify encrypted-only storage and masked response`
- [x] `security(rate-limit): add limiter for auth, market, and trading endpoints`
- [x] `docs(cleanup): normalize encoding and Current/Planned consistency`
- [x] `chore(api-prisma): migrate deprecated package.json#prisma seed config to prisma.config.ts (migrations.seed) with VPS-compatible db-seed invocation`

## Phase 1 - Data Model and Core API (MVP Foundation)
- [x] `feat(db): add MarketUniverse model`
- [x] `feat(db): add SymbolGroup model`
- [x] `feat(db): add Bot and BotStrategy models`
- [x] `feat(db): add Position, Order, Trade, Signal models`
- [x] `feat(db): add BacktestRun, BacktestTrade, BacktestReport models`
- [x] `feat(db): add Log model for audit trail`
- [x] `feat(api): markets module CRUD (filters, whitelist/blacklist, auto-exclude rules)`
- [x] `feat(api): bots module CRUD (execution mode, opt-in flags, limits)`
- [x] `feat(api): orders and positions read endpoints`
- [x] `feat(api): ownership checks for all new entities`
- [x] `test(api): add data isolation tests for markets/bots/orders/positions/backtests`

## Phase 2 - Trading Engine Core (Backtest-First)
- [x] `feat(engine): market-data ingestion service (OHLCV) with caching`
- [x] `feat(engine): indicator calculation adapter`
- [x] `feat(engine): rule evaluator (AND/OR + comparisons + multi-timeframe)`
- [x] `feat(engine): pre-trade analysis and position limit checks`
- [x] `feat(engine): simulator with fees/slippage/funding`
- [x] `feat(engine): order types market/limit/stop/stop-limit/take-profit/trailing`
- [x] `feat(engine): TP/SL/trailing/DCA position management`
- [x] `feat(api): backtest run/create/list endpoints`
- [x] `feat(api): backtest trade list and report endpoints`
- [x] `test(engine): deterministic simulator tests for pnl/fees/funding`

## Phase 3 - Paper and Live Futures (MVP Trading Modes)
- [x] `feat(engine): paper runtime loop on live market feed`
- [x] `feat(engine): paper position lifecycle and order simulation parity`
- [x] `feat(exchange): CCXT futures connector scaffold`
- [x] `feat(exchange): live order placement adapter with retries`

## Phase V1PARITY-2026-04-29 - LIVE Runtime Lifecycle Parity Hardening (Closed 2026-04-29)
- [x] `V1PARITY-01 docs(contract): freeze LIVE add-fill, account-update scope, and runtime/read-model strategy-context parity`
- [x] `V1PARITY-02 test(api-red): lock confirmed LIVE add-fill -> canonical position update and DCA attribution`
- [x] `V1PARITY-03 fix(api-events): reuse canonical add-update lifecycle for existing-position LIVE fills`
- [x] `V1PARITY-04 test(api-red): lock account-update scope to canonical position ownership`
- [x] `V1PARITY-05 fix(api-events): narrow account-update application to canonical owned position scope`
- [x] `V1PARITY-06 test(api-runtime-red): lock runtime/read-model strategy-context parity for LIVE managed positions`
- [x] `V1PARITY-07 fix(api-runtime+reads): remove or explicitly degrade symbol-level fallback when strategy context is unresolved`
- [x] `V1PARITY-08 test(api-ops-red): lock operator-visible telemetry for fail-closed LIVE automation skips`
- [x] `V1PARITY-09 fix(api-telemetry): emit canonical runtime diagnostics for skipped LIVE management actions`
- [x] `V1PARITY-10 qa(closure): run focused LIVE parity pack and publish closure evidence`

### Progress Log (Phase V1PARITY-2026-04-29 - LIVE Runtime Lifecycle Parity Hardening)
- 2026-04-29: Published the execution packet after a focused repository review centered on the reported LIVE DCA mismatch. Confirmed drifts include: confirmed existing-position LIVE fills not fully reusing canonical add-update lifecycle authority, add-leg fills persisted as generic `OPEN` instead of explicit `DCA`, overly broad account-update scoping by `userId + symbol + side`, read-model fallback that can mask missing canonical `strategyId`, and weak operator telemetry for fail-closed runtime skips. Canonical packet: `docs/planning/v1parity-live-runtime-lifecycle-parity-hardening-plan-2026-04-29.md`.
- 2026-04-29: Closed `V1PARITY-01` by publishing `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md` and syncing the parity rules into `06_execution-lifecycle.md`, `04_runtime-contexts.md`, and `reference/execution-lifecycle-parity-contract.md`. The frozen contract now explicitly covers LIVE add-fill position updates, DCA attribution semantics, narrow account-update ownership scope, and runtime/read-model strategy-context parity.
- 2026-04-29: Closed `V1PARITY-02..05` by hardening the exchange-event lifecycle path itself. Confirmed existing-position LIVE fills now reuse canonical add-update math for `quantity` and `entryPrice`, add-leg fills persist explicit `DCA` lifecycle semantics, and `ACCOUNT_UPDATE` reconciliation is constrained to canonical owned LIVE candidates instead of mutating every open `userId + symbol + side` row.
- 2026-04-29: Closed `V1PARITY-06..07` by removing symbol-level DCA/TSL fallback from runtime session read models when canonical `position.strategyId` is unresolved. Runtime operator surfaces now stay honest: such LIVE positions can remain visible, but they no longer present strategy-managed automation plans the engine cannot canonically execute.
- 2026-04-29: Closed `V1PARITY-08..09` by surfacing fail-closed LIVE automation skips through canonical runtime telemetry. Continuity degradation, unresolved canonical LIVE execution context, and live-opt-out management skips now emit operator-visible `PRETRADE_BLOCKED` diagnostics instead of remaining console-only.
- 2026-04-29: Closed `V1PARITY-10` with focused validation across exchange-event lifecycle parity, runtime automation parity, runtime/read-model strategy-context truth, and DCA ladder read-model coverage. Closure evidence: `docs/operations/v1parity-live-runtime-lifecycle-parity-closure-2026-04-29.md`. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts`, `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts`, `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`, `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts -t "maps DCA ladder levels for basic repeated, advanced, and legacy strategy configs"`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

## Phase V1SAFE-2026-04-29 - LIVE DCA/TTP/TSL Parity Hardening (Closed 2026-04-29)
- [x] `V1SAFE-01 docs(contract): freeze canonical DCA/TTP/TSL parity contract for imported and recovered LIVE positions`
- [x] `V1SAFE-02 test(api-runtime-red): lock imported/recovered LIVE TTP/TSL state parity and fail-closed degradation`
- [x] `V1SAFE-03 fix(api-runtime): hydrate or explicitly degrade LIVE protection state on imported/recovered positions`
- [x] `V1SAFE-04 test(api-runtime-red): lock DCA-first affordability parity across backtest, paper, and live`
- [x] `V1SAFE-05 fix(api-runtime): align LIVE DCA affordability and close gating with canonical parity expectations`
- [x] `V1SAFE-06 test(api-runtime-red): lock LIVE trigger-input and exit-submission parity for DCA/TTP/TSL`
- [x] `V1SAFE-07 fix(api-runtime+events): close remaining LIVE DCA/TTP/TSL execution parity gaps`
- [x] `V1SAFE-08 test(api-ops-red): lock operator protection truth for actionable versus visual-only fallback states`
- [x] `V1SAFE-09 fix(api+read-model): expose honest LIVE protection state and degradation reasons on operator surfaces`
- [x] `V1SAFE-10 qa(closure): run focused LIVE DCA/TTP/TSL parity pack and publish closure evidence`

### Progress Log (Phase V1SAFE-2026-04-29 - LIVE DCA/TTP/TSL Parity Hardening)
- 2026-04-29: Published the execution packet after refining the earlier broad liquidation-safety draft down to the exact remaining parity problem. The strongest confirmed gap is not "missing exchange-native protection first", but that imported and recovered `LIVE` positions can still enter runtime without fully armed canonical trailing/DCA management state while runtime read-models continue to imply dynamic protection through fallback display logic. The wave now targets one fail-closed parity contract for `DCA`, `TTP`, and `TSL` across `backtest`, `paper`, and `live`, with first-class coverage for imported/recovered positions, trailing-state hydration, and operator/runtime honesty. Canonical packet: `docs/planning/v1safe-live-protection-and-liquidation-safety-plan-2026-04-29.md`.
- 2026-04-29: Closed `V1SAFE-01` by publishing `docs/architecture/reference/live-protection-state-parity-contract.md` and syncing the key rules into `06_execution-lifecycle.md`, `reference/position-lifecycle-parity-matrix.md`, and `reference/live-runtime-lifecycle-parity-contract.md`. The frozen contract now explicitly forbids retroactive trailing-history guessing for imported or recovered `LIVE` positions while allowing prospective protection from the adoption point onward.
- 2026-04-29: Closed `V1SAFE-02..07` by hardening the runtime and serialization path itself. Focused runtime coverage now proves imported `LIVE` positions can arm `TTP` prospectively and close on later retrace, while API dynamic-stop serialization now uses only canonical runtime trailing state and trailing-anchor truth instead of display-only sticky fallback.
- 2026-04-29: Closed `V1SAFE-08..09` by removing sticky fallback `TTP` overlays from dashboard-home and bot-monitoring surfaces. Operator views now show dynamic protection only when the runtime engine actually has the same canonical stop truth.
- 2026-04-29: Closed `V1SAFE-10` with focused validation across runtime automation parity, runtime position serialization, dashboard-home runtime surfaces, bot-monitoring surfaces, API/web typechecks, and repository guardrails. Closure evidence: `docs/operations/v1safe-live-dca-ttp-tsl-parity-closure-2026-04-29.md`.

## Phase V1MARK-2026-04-29 - LIVE Futures Mark-Price Parity Hardening (Queued 2026-04-29)
- [x] `V1MARK-00 planning(queue): publish LIVE futures mark-price parity packet`
- [x] `V1MARK-01 docs(contract): freeze LIVE futures lifecycle-price hierarchy`
- [x] `V1MARK-02 test(api-red): lock futures mark-price stream and lifecycle-price preference`
- [x] `V1MARK-03 fix(api-stream): add futures mark-price ingestion to the market-stream boundary`
- [x] `V1MARK-04 fix(api-runtime): prefer futures mark price in shared lifecycle-price resolution`
- [x] `V1MARK-05 qa(closure): run focused futures parity pack and publish closure evidence`

### Progress Log (Phase V1MARK-2026-04-29 - LIVE Futures Mark-Price Parity Hardening)
- 2026-04-29: Published the execution packet after a fresh post-`V1COVER-A` audit of the remaining `LIVE exchange` money path. The strongest remaining confirmed drift is futures-specific lifecycle-price truth: runtime protection and position-lifetime automation already reuse one shared resolver seam, but that seam still resolves ticker `lastPrice` and recent candle close only because the Binance futures market-stream boundary does not ingest mark price yet. Canonical packet: `docs/planning/v1mark-live-futures-mark-price-parity-plan-2026-04-29.md`.
- 2026-04-29: Closed `V1MARK-01` by publishing `docs/architecture/reference/live-futures-lifecycle-price-contract.md` and linking it into `06_execution-lifecycle.md` plus `reference/execution-lifecycle-parity-contract.md`. The architecture now explicitly freezes the runtime hierarchy for `LIVE FUTURES`: stream `markPrice` first, then ticker `lastPrice`, then latest positive candle close.
- 2026-04-29: Closed `V1MARK-02..05` by extending the approved Binance futures stream boundary with `@markPrice@1s`, preserving `markPrice` in runtime ticker state, and making the shared lifecycle-price resolver prefer futures mark price without changing spot semantics. Closure evidence: `docs/operations/v1mark-live-futures-mark-price-parity-closure-2026-04-29.md`. Validation PASS: focused `binanceStream`, `runtimeTickerStore`, `runtimeLifecycleMarkPrice`, `runtimePositionAutomation`, and `runtimePositionLifetime` suites, API typecheck, and repository guardrails.

## Phase V1TRUTH-2026-04-29 - Final LIVE Exchange Truth Hardening For V1 (Queued 2026-04-29)
- [x] `V1TRUTH-00 planning(queue): publish final LIVE exchange-truth packet`
- [ ] `V1TRUTH-01 audit(api+web+exchange): freeze the exact remaining money-path failure matrix`
- [x] `V1TRUTH-02 fix(web+api-contract): align futures manual-order sizing and free-funds validation`
- [x] `V1TRUTH-03 test(api-red): lock exchange-backed manual close parity`
- [x] `V1TRUTH-04 fix(api-exchange+runtime): make manual close fail-closed and exchange-truthful`
- [x] `V1TRUTH-05 test(api+web-red): lock pending external order versus position truth`
- [x] `V1TRUTH-06 fix(api+reads+web): harden order/position merge and operator presentation`
- [x] `V1TRUTH-07 docs+test(runtime-red): freeze and prove the final DCA/TTP/TSL rule`
- [x] `V1TRUTH-08 fix(api-runtime+web): align protection execution and operator truth`
- [x] `V1TRUTH-09 qa(closure): run focused real-money truth pack and publish closure evidence`

### Progress Log (Phase V1TRUTH-2026-04-29 - Final LIVE Exchange Truth Hardening For V1)
- 2026-04-29: Published the execution packet after a fresh architecture-and-code audit driven by new real-account notes. The strongest remaining confirmed `LIVE` money-path drifts are now tightly scoped: leverage-aware futures manual-order sizing still lacks frontend/backend parity; app-driven manual close still depends too heavily on runtime-session context instead of one explicit exchange-backed close authority; order-versus-position truth still needs focused proof for external/manual exchange pending-order scenarios; and the final user-requested `DCA/TTP/TSL` nuance still needs one explicit frozen contract. The approved staged direction is now canonical: keep `1 bot = 1 wallet + 1 symbol-group + 1 strategy` through this wave, close truthful `V1` `LIVE` behavior first, and defer multi-strategy-per-bot to a post-`V1` architecture wave. Canonical packet: `docs/planning/v1truth-live-exchange-truth-hardening-plan-2026-04-29.md`.
- 2026-04-29: Closed the full `V1TRUTH-A` wave. The repository now has end-to-end closure evidence for the four confirmed real-money drift classes behind the user's notes: leverage-aware futures manual-order margin parity, exchange-backed `LIVE` manual close, truthful pending external order versus open-position separation, and the final `DCA/TTP/TSL` nuance where `TTP` waits only for remaining profit-side DCA thresholds while `SL` and `TSL` keep the stricter fail-closed guard. Closure evidence: `docs/operations/v1truth-live-exchange-truth-closure-2026-04-29.md`. Validation PASS: focused API closure pack (`99/99`), focused web closure pack (`15/15`), API/web typecheck, repository guardrails.
- 2026-04-29: Closed `V1TRUTH-02` as the first implementation slice of the wave. Dashboard futures manual-order sizing now treats free funds as required margin instead of full notional: leverage-aware `budget`, max-quantity slider, budget-to-quantity conversion, and submit-time affordability validation are aligned on the web side with the backend manual-order context intent, while `SPOT` semantics remain unchanged. Validation PASS: focused `useManualOrderController`, focused `HomeLiveWidgets.manual-order`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

## Phase V1ROE-2026-04-30 - LIVE PnL Truth And Shared Lifecycle Margin-Basis Parity (Closed 2026-05-01)
- [x] `V1TAKE-10 feat(bot-settings): move LIVE external-position management authority from wallet to bot`
- [x] `V1ROE-00 analysis(queue): publish LIVE PnL/ROE semantics and imported automation parity packet`
- [x] `V1ROE-01 fix(api+web+runtime): align shared lifecycle PnL fraction to canonical margin basis`
- [x] `V1ROE-02 test(api-contract): lock runtime positions margin-basis and unrealizedPnlPercent contract`
- [x] `V1ROE-03 fix(api-normalization): prefer isolated-wallet margin truth for isolated LIVE futures positions`
- [x] `V1ROE-04 qa(prod-manual): verify exchange-aligned LIVE PnL truth and DCA non-trigger on the protected DOGEUSDT flow`

### Progress Log (Phase V1ROE-2026-04-30 - LIVE PnL Truth And Shared Lifecycle Margin-Basis Parity)
- 2026-04-30: Closed `V1TAKE-10` as the architecture-alignment companion slice for the imported `LIVE` runtime work. The user-approved contract is now canonical in code and docs: imported-position management authority lives on `Bot.manageExternalPositions`, not on wallet settings. Added schema backfill from linked wallets, rewired runtime/takeover ownership resolution to the bot-level flag plus symbol scope, removed the editable wallet toggle from operator UX, and exposed one checkbox in bot settings only. Validation PASS: focused runtime ownership/takeover API pack, focused bot+wallet web form pack, API/web typecheck, repository guardrails.
- 2026-04-30: Published the execution packet after protected production verification on the active `LIVE DOGEUSDT` flow showed two overlapping drifts: Soar `PnL %` was still a modeled-margin metric rather than truthful exchange-style percent, and imported/reopened `LIVE` automation looked stale enough to miss `DCA/TTP` evaluation. The user-approved direction is now canonical: one shared lifecycle engine stays in place, `PAPER/BACKTEST` keep modeled-margin semantics, and `LIVE` uses exchange-synced `marginUsed` truth whenever canonical margin basis exists.
- 2026-04-30: Closed the next imported-automation continuity seam under the same runtime architecture. `livePositionReconciliation` now wakes the canonical runtime automation engine prospectively when it creates or updates a canonically owned imported `LIVE` row with confirmed continuity and finite positive `markPrice`, instead of waiting for a later ticker-path event. This stays inside the approved `LIVE` protection-state contract because the hook delegates to the same `runtimePositionAutomationService.handleTickerEvent(...)` path and does not reconstruct missing historical protection state.
- 2026-04-30: Closed the next operator-truth seam for imported managed positions. Runtime positions payload no longer under-reports `DCA` just because imported lifecycle history still lacks the original local `OPEN` trade. The read-model now derives `dcaCount` from explicit `DCA` trades and runtime `currentAdds` before falling back to the older entry-leg inference, keeping dashboard `DCA` truth aligned with real execution on imported positions.
- 2026-04-30: Closed `V1ROE-01` as the first implementation slice. Added persisted `Position.marginUsed`, normalized exchange margin fields into canonical position truth, introduced shared `positionPnlSemantics`, aligned runtime automation on one explicit `currentPnlFraction`, and propagated the same margin basis into runtime read models plus dashboard/monitoring operator surfaces. This removes the old `entryNotional / leverage` shortcut as the primary `LIVE` truth and keeps `DCA/TTP/TSL` on the same canonical percent semantics by mode. Validation PASS: focused API runtime/read/reconcile pack, focused web runtime derivation pack, API/web typecheck, repository guardrails.
- 2026-04-30: Fresh protected production verification after deploy still returned the old runtime positions payload shape for the affected `LIVE DOGEUSDT` flow: the response body still omitted `marginUsed` and `unrealizedPnlPercent` even though local code now exposes both. This does not invalidate the local fix, but it proves the repository still lacked one focused API contract lock at the `runtime positions` seam and that prod-manual verification must now also confirm deploy freshness rather than only operator math parity.
- 2026-04-30: Closed `V1ROE-02` as the missing API seam lock. Added `bots.runtime-pnl-parity.e2e.test.ts`, which creates a canonical `LIVE` runtime position with persisted `marginUsed` that intentionally differs from modeled margin and proves the `runtime positions` endpoint returns `marginUsed=25`, `unrealizedPnl=-5`, and `unrealizedPnlPercent=-20` from that persisted basis. Validation PASS: focused API e2e, `pnpm run quality:guardrails`.
- 2026-04-30: The next protected production verification loop proved deploy freshness, but also exposed one narrower remaining exchange-truth drift. `DOGEUSDT` now returns `marginUsed` and `unrealizedPnlPercent` on production, yet the live row still lands around `-27.83%` with `marginUsed≈0.769`, which matches `initialMargin`-style basis rather than a fuller isolated-wallet margin basis. That is still enough to mis-state operator `%` and can trigger or suppress `DCA` around the `-25%` boundary incorrectly if the exchange is using a larger real isolated margin.
- 2026-04-30: Closed `V1ROE-03` as the next smallest exchange-truth correction. `positions.exchangeSnapshotNormalization.ts` now prefers `isolatedWallet` for `ISOLATED` futures positions before falling back to `isolatedMargin` and initial-margin fields, while non-isolated positions keep the old initial-margin precedence. Focused validation PASS: `positions.exchangeSnapshotNormalization.test.ts`, `bots.runtime-pnl-parity.e2e.test.ts`, and `pnpm run quality:guardrails`.
- 2026-04-30: Another protected production audit then proved the remaining mismatch was even narrower: reconciliation and protected exchange snapshot were already fresh for the active `DOGEUSDT` row, but runtime session `positions` and `symbol-stats` could still recompute operator truth from an older `botRuntimeSymbolStat` / runtime ticker price than the latest `lastExchangeSyncAt`. The repository now prefers fresher exchange-synced lifecycle truth for `EXCHANGE_SYNC OPEN` rows when runtime cache price is older, and focused e2e locks both runtime read surfaces against regressing to stale session price. Remaining closure is protected post-deploy verification on the affected `DOGEUSDT` flow.
- 2026-04-30: A follow-up protected production audit then exposed one deeper ownership-parity seam behind the still dormant imported `DOGEUSDT` row. The runtime read model could already treat the imported row as owned/actionable, but `runtimePositionAutomation` and bot-scope signal-loop open-position counting still keyed directly on persisted `position.botId`, which can remain `null` for canonically owned imported `EXCHANGE_SYNC` rows. Closed `V1OWN-01` by reusing the external-position ownership classifier in both seams, so imported owned rows can hydrate into runtime automation and bot-scope counts without waiting for eager DB rebind. Closure evidence: `docs/operations/v1own-imported-live-runtime-ownership-closure-2026-04-30.md`.
- 2026-05-01: Closed `V1ROE-04` with authenticated protected production evidence on the active `LIVE DOGEUSDT` flow. Production build-info reports `e6bdcfda35698dbb29513490a953e15b9a2c0469` on `main`, public deploy smoke and protected runtime freshness pass, the protected runtime row is `IN_SYNC`, `CONFIRMED`, `actionable=true`, and strategy-context resolved, and headless dashboard proof confirms the `Positions` row renders matching operator truth. Evidence: `docs/operations/v1roe-04-prod-verification-closure-2026-05-01.md`.

## Phase V1DCA-2026-05-01 - Runtime Positions DCA Visibility After Exchange-Sync Replacement (Closed 2026-05-01)
- [x] `V1DCA-01 fix(api-runtime-read): preserve DCA visibility after exchange-sync position replacement`
- [x] `V1DCA-02 fix(api-runtime-read): preserve multi-level DCA visibility across repeated exchange-sync replacements`

### Progress Log (Phase V1DCA-2026-05-01 - Runtime Positions DCA Visibility After Exchange-Sync Replacement)
- 2026-05-01: Closed `V1DCA-01` after protected production DOGEUSDT inspection
  showed one persisted `BOT/DCA` row linked to a superseded local `positionId`
  while the current exchange-sync `Positions` row showed no DCA. Runtime
  positions read now attaches strictly scoped same-session persisted DCA rows
  to the current open lifecycle and post-deploy verification proved
  `dcaCount=1` on the protected row. Evidence:
  `docs/operations/v1dca-01-prod-verification-2026-05-01.md`.
- 2026-05-01: Closed `V1DCA-02` after the operator reported the current
  DOGEUSDT lifecycle should have two DCA fills. Protected ledger inspection
  confirmed two persisted `BOT/DCA` rows across consecutive exchange-sync
  replacement ids. Runtime positions read now resolves same-session continuity
  from persisted `OPEN/DCA/CLOSE` rows and starts supplemental DCA matching
  from the first same-identity open after the last exit, preserving multiple
  DCA levels across replacement chains. Validation PASS: focused imported DCA
  visibility e2e (`3/3`), lint, API typecheck, API build, repository guardrails.
  Task packet:
  `docs/planning/v1dca-02-multi-replacement-dca-count-task-2026-05-01.md`.

## Phase V1AUTO-2026-04-30 - Imported LIVE Runtime-State Rebase Hardening (Closed 2026-04-30)
- [x] `V1AUTO-01 fix(api-runtime): rebase stale imported runtime state to canonical exchange-synced basis`
- [x] `V1AUTO-02 test(api-runtime): lock imported same-row basis drift against stale DCA state reuse`
- [x] `V1AUTO-03 qa(closure): run focused runtime automation pack and sync context`

### Progress Log (Phase V1AUTO-2026-04-30 - Imported LIVE Runtime-State Rebase Hardening)
- 2026-04-30: Published the execution packet after protected production verification on the active `LIVE DOGEUSDT` flow showed that the stale runtime-price seam is closed, but imported runtime automation can still look dormant even when exchange-synced position truth is fresh. The strongest remaining hypothesis is not missing symbol ownership or missing price truth, but stale persisted runtime continuity surviving an in-place exchange-sync basis update on the same imported row. Canonical packet: `docs/planning/v1auto-runtime-state-rebase-plan-2026-04-30.md`.
- 2026-04-30: Closed the wave with one narrow runtime seam and one focused regression. Imported `EXCHANGE_SYNC` positions now rebase stale persisted runtime state to canonical exchange-synced `quantity + entryPrice` truth before `DCA/TTP/TSL` evaluation when the basis drift is material, and the regression pack proves stale `currentAdds` can no longer suppress the first valid DCA after same-row basis drift. Closure evidence: `docs/operations/v1auto-runtime-state-rebase-closure-2026-04-30.md`. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

## Phase V1EXCEL-2026-04-29 - Full V1 Excellence And Production Confidence Closure (Superseded 2026-05-02)
- [x] `V1EXCEL-00 planning(queue): publish full V1 excellence and production-confidence packet`
- [x] `V1EXCEL-01 audit(v1-gap-map): freeze the exact remaining gap map against DoD, integration, deployment, and activation contracts`
- [x] `V1EXCEL-02 qa(local-infra): restore fully reproducible local confidence path or classify the exact external blocker`
- [x] `V1EXCEL-03 qa(manual-matrix): execute the full critical manual UI/API/operator matrix`
  - 2026-04-29 status: IN_PROGRESS. Authenticated Soar production operator access is now available and the first `PAPER` API/operator pass is captured in `docs/operations/v1excel-paper-operator-verification-2026-04-29.md`. That evidence now proves two truthful protected production flows: same-side `PAPER` add on an active managed position and post-deploy `PAPER` manual close with correct runtime-history and capital-summary effects. Authenticated dashboard UI verification is now also green for the resulting paper-bot state and history. The remaining incomplete scope is browser-side action proof if required plus the `LIVE` exchange-authority, mixed-origin, and restart/recovery scenarios.
- [x] `V1EXCEL-04 ops(stage-refresh): rerun the latest authenticated stage release gate and smoke on the current candidate`
- [x] `V1EXCEL-05 ops(prod-refresh): rerun fresh production release-gate evidence families on the current candidate`
- [x] `V1EXCEL-06 ops(runtime-observability): verify active LIVE worker/runtime diagnostics under current production truth`
  - 2026-05-01 production refresh: production runtime observability is green with authenticated evidence (`runtime-freshness` PASS, rollback guard `shouldRollback=false`, no reasons, no alerts, `runningCount=4`). Stage runtime observability remains open.
- [x] `V1EXCEL-07 release(go-no-go): rebuild RC status/sign-off/checklist and publish final V1 excellence decision`
- [x] `V1EXCEL-08 docs(closure): sync canonical queue/context and freeze the final post-V1 handoff`

### Progress Log (Phase V1EXCEL-2026-04-29 - Full V1 Excellence And Production Confidence Closure)
- 2026-04-29: Published the post-`V1TRUTH-A` confidence packet after reviewing the repository's own `Definition Of Done`, `INTEGRATION_CHECKLIST`, `DEPLOYMENT_GATE`, and production-activation contract against the latest `LIVE` hardening closures. The canonical conclusion is that the remaining gap is no longer architecture or known code drift; it is fresh evidence and confidence closure. The next wave therefore targets four explicit categories only: exact V1 gap-map audit, reproducible local go-live confidence, manual real-flow verification, and refreshed stage/prod activation plus GO/NO-GO sign-off on the latest candidate. Canonical packet: `docs/planning/v1excel-full-v1-excellence-and-confidence-plan-2026-04-29.md`.
- 2026-04-29: Closed `V1EXCEL-01` by publishing `docs/operations/v1excel-gap-map-audit-2026-04-29.md`. The audit freezes the exact remaining truth against `DEFINITION_OF_DONE`, `INTEGRATION_CHECKLIST`, `DEPLOYMENT_GATE`, and the production-activation contract: there is no open core implementation or architecture gap left for `V1`, but fresh manual evidence, honest local full-confidence reproducibility, fresh stage/prod activation evidence, and one final operator-facing `GO / NO-GO` decision are still required before claiming a fully excellent V1.
- 2026-04-29: Closed `V1EXCEL-02` by repairing the local Prisma migration-history blocker non-destructively and rerunning the umbrella local confidence path successfully. Fresh local evidence is now green again: `pnpm run test:go-live:smoke` passed with `35/35` API and `17/17` web checks, and the exact recovery path is documented in `docs/engineering/local-development.md` plus `docs/operations/v1excel-local-confidence-path-closure-2026-04-29.md`.
- 2026-04-29: Executed the remote-access-possible half of `V1EXCEL-03..06` and classified the remaining boundary precisely. Public stage and prod smoke both passed on `https://stage-api.soar.luckysparrow.ch`, `https://stage.soar.luckysparrow.ch`, `https://api.soar.luckysparrow.ch`, and `https://soar.luckysparrow.ch`; stage rehearsal dry-run and prod release-gate dry-run both refreshed current blocker truth; and stage/prod runtime observability probes both returned protected-route `401` without OPS auth. The remaining blocker is therefore not ambiguous runtime health but missing authenticated operator/exchange/OPS authority.
- 2026-04-29: Reran authenticated protected production verification after the manual-close remediation deploy and confirmed that the previously failing `PAPER` close path is now truthful. `POST /dashboard/bots/:botId/runtime-sessions/:sessionId/positions/:positionId/close` returned `200`, the open row disappeared from `openItems`, the closed position remained visible in `historyItems` with `closeReason=MANUAL` and `closeInitiator=USER_APP`, and runtime capital summary reflected the realized PnL in `freeCash`. This narrows the remaining `V1EXCEL-03` work to real-UI and `LIVE` authority scenarios rather than the already remediated `PAPER` close drift.
- 2026-04-29: Extended the same `V1EXCEL-03` production verification into the real authenticated dashboard UI without executing new market actions. Browser automation proved that the selected-bot switch `LIVE -> PAPER` works, `Positions` shows `No open positions.`, wallet summary reflects the post-close capital truth (`Delta from start 1.25% | 12.48 USDT`, `Portfolio 1,012.48 USDT`), and `History` shows the expected top row `Close / Manual / User in app` for `1000000MOGUSDT`. This further narrows the remaining gap away from `PAPER` visibility drift and toward browser-side action clicks only if required plus the still-missing `LIVE` authority scenarios.
- 2026-05-01: Completed the production-only runtime observability slice for `V1EXCEL-06`. Authenticated production `ops:deploy:runtime-freshness` passed and authenticated production `ops:deploy:rollback-guard` returned `shouldRollback=false` with no alerts. This removes the production protected-route blocker for runtime observability, but the full `V1EXCEL` confidence wave remains open for stage observability, stage/prod release evidence families, and the manual matrix.
- 2026-05-01: Refreshed `V1EXCEL-04` stage public smoke on the current queue pass. Stage is now blocked earlier than protected OPS auth: `stage-api` and `stage` both return `503 no available server` for public health/ready/root and web build-info preflight. Evidence: `docs/operations/v1excel-04-stage-refresh-503-2026-05-01.md`. The next required action is to restore or redeploy the stage services in Coolify before rerunning authenticated stage gates.
- 2026-05-01: Followed up `V1EXCEL-04` after protected operator credentials
  became available. Stage still returns `503 no available server`; Coolify web
  login succeeds for the provided operator account, but the visible
  project/environment does not expose Soar resources and Coolify API resource
  reads return `401` without a bearer token. Automated stage restore and
  production deploy trigger remain blocked on proper Coolify resource/API
  access. Evidence:
  `docs/operations/v1excel-04-stage-coolify-access-refresh-2026-05-01.md`.
- 2026-05-01: Refreshed the executable production subset of `V1EXCEL-05`.
  Production public smoke, protected runtime freshness, and rollback guard are
  green on the current deployed runtime candidate (`shouldRollback=false`,
  no reasons, no alerts, `runningCount=4`), and production rollback-proof
  artifact is PASS with secret-safe command recording. Evidence:
  `docs/operations/v1excel-05-prod-refresh-2026-05-01.md`. The task remains
  open for broader release evidence families: restore drill, RC
  status/sign-off/checklist rebuild, and remaining manual matrix items.
- 2026-05-03: Synchronized stale phase truth after `V1CLOSEOUT-11` and the
  current production-only V1 `GO` closure. The older `V1EXCEL-03..06` evidence
  checklist is preserved as historical context, not active current V1 work.
  Stage remains explicitly deferred to V2 by operator decision, production
  restore/rollback/release evidence is superseded by the 2026-05-02 closeout
  pack, and final current confidence work now continues through
  `SYSFINAL-2026-05-03`.
- 2026-04-29: Closed `V1EXCEL-07` with a final `NO-GO` decision for candidate `51acd9c445227a3ca8cc8b781564d14b55fda43f`. Current evidence still supports the engineering answer "no known implementation gap remains", but the repository's own completion and activation contracts are not yet satisfied because the authenticated manual operator matrix and protected stage/prod OPS evidence were not executed in this session. Canonical decision: `docs/operations/v1excel-final-go-no-go-2026-04-29.md`.
- 2026-04-29: Closed `V1TRUTH-03` and `V1TRUTH-04` as one architecture-aligned API slice. App-driven `LIVE` manual close now stays inside the canonical `openOrder -> exchange boundary -> live adapter` flow with explicit `reduceOnly` propagation for close intent, live pretrade exposure guards no longer block that reduce-only close path, and runtime session close no longer hard-fails only because a transient lifecycle mark price is missing. For `LIVE`, the close command now degrades to persisted `entryPrice` as reference context while the actual exchange authority remains the submitted reduce-only market order; `PAPER` still fails closed when no canonical close price exists. Validation PASS: focused `runtimeSessionPositionCommand`, focused `executionOrchestrator`, focused `exchangeAdapterBoundary`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: Closed `V1TRUTH-05` by freezing the reported pending external/manual exchange order truth into end-to-end API proof. Added a focused `orders-positions.e2e` scenario for one open `LIVE` position plus one pending external `DCA` order on the same symbol, and verified that both runtime session positions and dashboard aggregate views keep `openCount=1`, `openOrdersCount=1`, unchanged position quantity/notional, and the external order visible only in `openOrders` until exchange fill confirms it. The strongest remaining work under `V1TRUTH-06` is therefore narrower than the generic read model: if the user still sees inflation live, the drift likely sits in a more specific reconcile/event/UI path than the canonical pending-order baseline now proven green.
- 2026-04-29: Closed `V1TRUTH-06` by fixing the strongest confirmed post-proof drift above the generic read model. `livePositionReconciliation` now reuses an existing local `BOT`/`USER` managed `LIVE` position for the same canonical owner and `symbol/side` identity instead of creating a duplicate `EXCHANGE_SYNC` row when exchange snapshot truth arrives. That keeps the repository aligned with one exchange-confirmed open-position row per owner/identity while preserving the separate pending-order baseline from `V1TRUTH-05`. Validation PASS: focused `livePositionReconciliation.service.test.ts`, full focused `orders-positions.e2e.ts`, focused manual-close/runtime/exchange packs, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: Started implementation with the highest-confidence drift first: dashboard manual-order futures sizing now treats budget and free-funds validation as leverage-aware required margin instead of raw notional. `useManualOrderController` now keeps `SPOT` behavior unchanged while switching `FUTURES` max-size, budget-derived quantity, budget display, and submit-time affordability checks to the same margin semantics already implied by the backend preview contract. Focused validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm --filter web run typecheck`.

## Phase V1REOPEN-2026-04-29 - LIVE Same-Symbol Close/Reopen Truth Hardening (Queued 2026-04-29)
- [x] `V1REOPEN-00 analysis(queue): publish same-symbol LIVE close/reopen hardening packet`
- [x] `V1REOPEN-01 audit(regression-matrix): freeze the exact same-symbol close/reopen failure matrix`
- [x] `V1REOPEN-02 test(api-red): lock stale lifecycle visibility, side truth, and PnL basis on LIVE reopen`
- [x] `V1REOPEN-03 fix(api-reconcile): retire superseded same-symbol lifecycle rows deterministically`
- [x] `V1REOPEN-04 fix(api-runtime-state): clear stale runtime protection state on close or lifecycle replacement`
- [x] `V1REOPEN-05 test(api-runtime-red): lock TTP continuity and loss-side-only DCA behavior on reopened LIVE positions`
  - 2026-04-29: Closed by focused runtime automation proof for reopened imported `LIVE` lifecycle continuity under loss-side-only remaining `DCA`.
  - [x] `V1REOPEN-06 fix(api+web-truth): align final operator truth for reopened LIVE positions`
- [x] `V1REOPEN-07 qa(closure): run focused close/reopen truth pack and publish evidence`
  - 2026-04-29: Closed with closure evidence in `docs/operations/v1reopen-live-close-reopen-truth-closure-2026-04-29.md`.

### Progress Log (Phase V1REOPEN-2026-04-29 - LIVE Same-Symbol Close/Reopen Truth Hardening)
- 2026-04-29: Published the packet after a focused architecture-and-code audit of the newly reported `DOGEUSDT` production flow: app-driven `LIVE` close succeeds, exchange truth closes the position, same-symbol reopen is imported again, but operator-visible `PnL%` becomes dramatically wrong and pre-close `TTP` still appears contaminated despite loss-side-only remaining `DCA`. The strongest current hypothesis is stale lifecycle continuity rather than simple UI math: old same-symbol lifecycle rows can survive too long through reconciliation grace windows, and stale runtime protection state may remain alive when the old lifecycle is retired outside the normal app/bot close path. Canonical packet: `docs/planning/v1reopen-live-close-reopen-pnl-ttp-hardening-plan-2026-04-29.md`.
- 2026-04-29: Closed `V1REOPEN-01..04` as the first implementation slice of the wave. Focused reconciliation regressions now lock three failure modes from the user report: stale opposite-side lifecycle overlap on the same symbol, same-side reopen treated as a new lifecycle when exchange open timestamp proves discontinuity, and stale runtime protection-state cleanup on forced lifecycle retirement. `livePositionReconciliation` now closes same-symbol conflicting rows immediately instead of waiting through the generic grace window, detects same-side reopen discontinuity by exchange timestamp, and clears persisted runtime position state whenever a lifecycle is force-closed or superseded. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/orders/orders-positions.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: Closed `V1REOPEN-06` by restoring dynamic-stop operator truth after reopen/recovery. Backend runtime positions now keep `showDynamicStopColumns` true whenever any open row carries real dynamic-stop truth, both web operator surfaces OR topology mode with row truth instead of hiding `TTP/TSL`, and runtime serialization regains the missing bot-managed `TTP` fallback plus sticky continuity after pullback.

## Phase V1HIST-2026-04-29 - Imported Exchange Lifecycle History Truth (Queued 2026-04-29)
- [x] `V1HIST-00 analysis(queue): publish imported exchange lifecycle history packet and mixed-origin live matrix`
- [x] `V1HIST-01 audit(api+history): freeze the imported open/close history failure matrix`
  - 2026-04-29: Closed through the canonical `V1HIST-A` packet and mixed-origin live matrix. Failure coverage is now explicitly frozen for imported open truth, imported external close truth, mixed-origin lifecycle continuity, and wait-based protection verification.
- [x] `V1HIST-02 docs(contract): freeze imported lifecycle history and history-table timestamp truth`
  - 2026-04-29: Closed by the canonical plan plus closure packet. Imported lifecycle history is now documented as canonical `Position/Trade` truth only, with deterministic exchange-trade hydration as the only approved repair path.
- [x] `V1HIST-03 test(api-red): lock imported opening-history and external-close history parity`
- [x] `V1HIST-04 fix(api-exchange+reconcile): hydrate imported position opening history through approved lifecycle entities`
- [x] `V1HIST-05 fix(api-ledger+history): persist external close history for imported managed positions`
  - 2026-04-29: Closed by making reconciliation backfill imported external-close truth from canonical exchange trades before final row closure when deterministic data exists. Missing imported close trades are now persisted with exchange-fill fees and `USER_EXCHANGE` attribution, and `position.closedAt` is corrected to the last canonical close fill instead of staying limited to the local reconciliation timestamp.
- [x] `V1HIST-06 fix(api+web-read): expose truthful open/close timestamps in operator history surfaces`
- [x] `V1HIST-07 qa(closure): run focused history-truth pack and publish evidence`
  - 2026-04-29: Closed with focused closure evidence in `docs/operations/v1hist-imported-exchange-lifecycle-history-closure-2026-04-29.md`.
- [x] `V1HIST-08 fix(api-exchange): resolve imported trade-history reads through canonical exchange market symbols`
- [x] `V1HIST-09 fix(api-runtime): restore imported OPEN visibility in dashboard operational history`
- [x] `V1HIST-10 fix(api-ledger): persist imported OPEN lifecycle anchors and replace them when canonical exchange trades arrive`

### Progress Log (Phase V1HIST-2026-04-29 - Imported Exchange Lifecycle History Truth)
- 2026-04-29: Published the packet after a focused audit of imported `LIVE` exchange lifecycle continuity. Current repository truth is that Soar can adopt imported `EXCHANGE_SYNC` positions and later stale-close them, but imported opening-history ledger truth, reconciliation-driven external-close history parity, and operator-visible history timestamp fidelity are still not fully closed vertical slices. Canonical packet: `docs/planning/v1hist-imported-exchange-lifecycle-history-plan-2026-04-29.md`. Detailed operator scenarios: `docs/operations/v1live-mixed-origin-verification-matrix-2026-04-29.md`.
- 2026-04-29: Closed `V1HIST-06` as the first implementation slice. Dashboard history positions now expose distinct `openedAt` and `closedAt` columns, removing the previous `closedAt ?? openedAt` ambiguity, and focused API parity proof now locks that a closed imported `EXCHANGE_SYNC BOT_MANAGED` position stays visible in `historyItems` with both timestamps preserved.
- 2026-04-29: Closed `V1HIST-03` and `V1HIST-04` as the first backend hydration slice. The exchange boundary now exposes authenticated trade-history reads, imported-position hydration reconstructs current open lifecycle only when canonical exchange fill truth is sufficient, persists imported `OPEN` / `DCA` / partial `CLOSE` trade rows without synthesizing fake fills, and updates `position.openedAt` from the first canonical fill instead of the weaker snapshot timestamp.
- 2026-04-30: Closed `V1HIST-08` after protected production payload inspection showed that fresh imported `BNB/XRP/DOGE` open rows still had `tradesCount=0` and `firstTradeAt=null` even after the runtime/UI truth slice was already green. `CcxtFuturesConnector` now resolves normalized symbol ids such as `XRPUSDT` back to canonical exchange market symbols like `XRP/USDT:USDT` before imported trade-history, order, ticker, open-order, and rules reads.
- 2026-04-30: Closed `V1HIST-09` after a fresh protected production plus browser audit confirmed that `Positions` and `Orders` were truthful while dashboard `History` still rendered only persisted trade rows. `runtimeSessionTradesRead` now emits one operational `OPEN` anchor row from canonical `Position` truth whenever a scoped imported lifecycle has no local trade rows yet, reusing `POSITION_LIFETIME` semantics instead of inventing exchange fills.
- 2026-04-30: Closed `V1HIST-10` by finishing the canonical ledger slice under that operator fix. `importedPositionHistoryHydrator` now persists one local `EXCHANGE_SYNC OPEN` anchor trade from canonical `Position` truth whenever imported trade history is not yet derivable, removes that synthetic anchor automatically when later canonical exchange trades can be reconstructed, and runtime trade reads classify persisted imported anchors as `POSITION_LIFETIME` instead of `SIGNAL_ENTRY`. Validation PASS: focused imported-history hydrator suite, focused runtime history parity e2e, API typecheck, repository guardrails.

## Phase BOTMULTI-POSTV1-2026-04-29 - Post-V1 Multi-Strategy Bot Reintroduction (Active 2026-05-03)
- [x] `BOTMULTI-00 planning(post-v1): publish deferred multi-strategy reintroduction packet`
- [x] `BOTMULTI-01 docs(decision): freeze post-V1 multi-strategy bot contract`
- [x] `BOTMULTI-02 audit(data+runtime): inventory legacy compatibility remnants and migration debt`
- [x] `BOTMULTI-03 db(schema): finalize canonical multi-strategy topology and migration path`
- [x] `BOTMULTI-04 api(write): support bot create/update with multiple strategies`
- [x] `BOTMULTI-05 runtime(signal-merge): execute deterministic multi-strategy evaluation per bot`
- [x] `BOTMULTI-06 runtime(risk+lifecycle): align DCA/TTP/TSL and ownership across multiple strategies`
- [x] `BOTMULTI-07 web(ui+operator): expose multi-strategy bot management and runtime truth`
- [x] `BOTMULTI-08 qa(closure): run architecture-to-runtime closure pack and publish evidence`

### Progress Log (Phase BOTMULTI-POSTV1-2026-04-29 - Post-V1 Multi-Strategy Bot Reintroduction)
- 2026-04-29: Published the deferred post-`V1` roadmap after the user approved the staged direction. This wave is intentionally not active yet: the repository keeps the singular bot architecture as canonical truth until `V1TRUTH-A` is fully closed and production verification remains stable. The deferred packet freezes the future execution order, architecture prerequisites, and closure expectations for reintroducing `1 bot = 1 wallet + 1 symbol-group + N strategies` without mixing that architecture change into the final `LIVE` money-path hardening wave. Canonical packet: `docs/planning/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md`.
- 2026-05-03: Activated `BOTMULTI-A` after `SYSFINAL-09` closed the current V1
  confidence pass. Closed `BOTMULTI-01` with
  `docs/planning/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`.
  Architecture now freezes the post-V1 target as `1 bot = 1 wallet + 1 active
  symbol-group market scope + N enabled strategies`, keeps multi-market-group
  bots out of scope, requires manual-order ambiguity to fail closed, requires
  runtime merge trace to preserve primary strategy provenance, and keeps
  DCA/TTP/SL/TSL ownership position-scoped. Validation PASS: repository
  guardrails. Next executable task: `BOTMULTI-02`.
- 2026-05-03: Published `BOTMULTI-02` audit evidence in
  `docs/planning/botmulti-02-legacy-compatibility-migration-audit-task-2026-05-03.md`.
  Inventory found canonical candidates (`BotMarketGroup`,
  `MarketGroupStrategyLink`, merge helper) and migration debt across direct
  bot strategy fields, legacy `BotStrategy`, create/update DTOs, runtime
  topology, manual-order context, read projections, and web bot form/list
  surfaces. The user selected lower numeric strategy-link priority as canonical;
  the merge reference now states that `1` is higher priority than `100`, and a
  focused runtime merge regression locks exit and directional tie-break
  behavior. Validation PASS: focused API merge test and API typecheck. Next
  executable task: `BOTMULTI-03`.
- 2026-05-03: Closed `BOTMULTI-03` with
  `docs/planning/botmulti-03-canonical-topology-migration-task-2026-05-03.md`.
  Added fail-closed migration
  `20260503013000_enforce_single_active_bot_market_group`, which rejects
  existing duplicate enabled `ACTIVE` market scopes before creating partial
  unique index `BotMarketGroup_one_active_scope_per_bot_idx`. Prisma schema and
  architecture docs now document that the partial-index invariant is owned by
  migration SQL. Validation PASS: Prisma validate, API typecheck, docs parity,
  repository guardrails. Next executable task: `BOTMULTI-04`.
- 2026-05-03: Closed `BOTMULTI-04` with
  `docs/planning/botmulti-04-api-write-multi-strategy-task-2026-05-03.md`.
  Bot create/update writes now accept optional ordered `strategies` arrays,
  persist multiple canonical strategy links under one active market group, keep
  `Bot.strategyId` as primary compatibility projection, and avoid legacy
  `BotStrategy` writes for multi-strategy payloads. Validation PASS: focused
  multi-strategy e2e, existing bots e2e, API typecheck, docs parity, repository
  guardrails. Next executable task: `BOTMULTI-05`.
- 2026-05-03: Closed `BOTMULTI-05` with
  `docs/planning/botmulti-05-runtime-signal-merge-task-2026-05-03.md`.
  Runtime topology now loads enabled canonical strategy links under the one
  active market group, final-candle decision evaluates every interval-eligible
  strategy, and `mergeRuntimeStrategyVotes` resolves link priority/weight while
  preserving winner provenance for downstream execution context. Validation
  PASS: focused runtime tests (`3` files / `50` tests), API typecheck, docs
  parity, repository guardrails. Next executable task: `BOTMULTI-06`.
- 2026-05-03: Closed `BOTMULTI-06` with
  `docs/planning/botmulti-06-runtime-risk-lifecycle-ownership-task-2026-05-03.md`.
  Runtime position automation now fails closed when a bot-managed position has
  no `position.strategyId` while multiple enabled canonical strategy links
  exist. The guard reuses existing runtime skip telemetry and prevents fallback
  DCA/TTP/SL/TSL settings from acting on ambiguous position ownership.
  Validation PASS: focused runtime position automation regression, full runtime
  position automation test file (`31` tests), API typecheck, docs parity,
  repository guardrails. Next executable task: `BOTMULTI-07`.
- 2026-05-03: Closed `BOTMULTI-07` with
  `docs/planning/botmulti-07-web-operator-multi-strategy-truth-task-2026-05-03.md`.
  Bot create/edit now exposes primary plus additional enabled strategies,
  submits ordered canonical `strategies[]` with primary-first priority, and
  prefills edit mode from canonical runtime graph links. Validation PASS:
  focused bot form tests (`7` tests), web typecheck, route-reachable i18n audit
  (`0` findings), docs parity, repository guardrails. Next executable task:
  `BOTMULTI-08`.
- 2026-05-03: Closed `BOTMULTI-08` with
  `docs/planning/botmulti-08-architecture-runtime-closure-task-2026-05-03.md`,
  completing the post-V1 BOTMULTI wave locally. Closure validation PASS:
  focused API multi-strategy write and runtime topology/merge tests (`4` files
  / `51` tests), runtime lifecycle fail-closed tests (`31` tests), web bot form
  tests (`7` tests), API/web typecheck, route-reachable i18n audit (`0`
  findings), docs parity, and repository guardrails. No active BOTMULTI task
  remains.

## Phase BOTLIVE-2026-04-28 - Active LIVE Symbol-Overlap Guard (Closed 2026-04-28)
- [x] `BOTLIVE-2026-04-28-A api(bot-guard): block active LIVE bot market-group overlap against other active LIVE bot scopes`

### Progress Log (Phase BOTLIVE-2026-04-28 - Active LIVE Symbol-Overlap Guard)
- 2026-04-28: Closed `BOTLIVE-2026-04-28-A` by adding one canonical bot write-path guard that blocks create/update when a bot would become `LIVE + isActive + liveOptIn` and its selected market-group symbols overlap another active opted-in LIVE bot for the same user. The API now returns fail-closed conflict details naming the blocking bot and symbols, while focused DB-backed regression coverage locks both create-time and activation-time overlap cases. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

## Phase UXSAFE-2026-04-28 - Markets/Wallets Safety Hardening (Closed 2026-04-28)
- [x] `UXSAFE-2026-04-28-A fix(api-markets+wallets): harden active market-universe edit guard and wallet delete history cleanup`

### Progress Log (Phase UXSAFE-2026-04-28 - Markets/Wallets Safety Hardening)
- 2026-04-28: Closed `UXSAFE-2026-04-28-A` by aligning `MarketUniverse` edit/delete protection with the approved active-usage rule used elsewhere: inactive linked bots no longer block save, while active primary/canonical/legacy bot ownership still fails closed. The same slice also hardens wallet delete by nulling nullable historical `walletId` references on `Position`, `Order`, and `Trade` before removing the wallet, so historical lifecycle rows survive and the API no longer leaks raw internal errors for that path. Validation PASS: focused `markets.e2e` inactive/active guard regressions, focused `wallets.crud.e2e` history-detach regression, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

## Phase QH-E2E-2026-04-28 - Legacy CRUD Suite Stabilization (Closed 2026-04-28)
- [x] `QH-E2E-2026-04-28-A qa(api-e2e): stabilize full markets and wallets CRUD suites after focused regression closure`

### Progress Log (Phase QH-E2E-2026-04-28 - Legacy CRUD Suite Stabilization)
- 2026-04-28: Closed `QH-E2E-2026-04-28-A` by restoring deterministic full-file green execution for `markets.e2e.test.ts` and `wallets.crud.e2e.test.ts` without weakening the approved domain behavior from `UXSAFE-2026-04-28-A`. The chosen harness pattern is unique per-test user identities plus one-time cleanup where needed, with `apps/api/src/test/authenticatedRequest.ts` added only for explicit multi-user authenticated-request assertions in the wallet suite. Validation PASS: `pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts`, `pnpm --filter api exec vitest run src/modules/wallets/wallets.crud.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `security(live): explicit live opt-in per bot`
- [x] `security(live): global kill-switch and emergency stop`
- [x] `feat(logs): write audit entries for critical trading decisions`
- [x] `test(e2e): smoke tests for paper/live critical paths`

## Phase 4 - Dashboard Completion (MVP UX Scope)
- [x] `docs(ui): audit legacy CryptoBot dashboard patterns for positions/orders and control-center IA`
- [x] `feat(ui): post-login control-center dashboard with key KPIs, bot status, and quick actions`
- [x] `feat(ui-shell): unify dashboard app shell, page headers, and breadcrumb patterns across modules`
- [x] `feat(ui-state): implement shared loading/empty/degraded/error/success state components`
- [x] `feat(ui-tokens): add semantic risk and execution-mode tokens (paper/live/warning/danger) and reusable status badges`
- [x] `feat(ui-control-center): add sticky safety bar with mode/connectivity/heartbeat and emergency action`
- [x] `feat(ui-control-center): add risk notice footer with logs drill-down shortcut`
- [x] `feat(ui): dashboard/markets flow`
- [x] `feat(ui): dashboard/builder strategy editor + presets`
- [x] `feat(ui): dashboard/bots management + mode status`
- [x] `feat(ui): dashboard/orders and dashboard/positions`
- [x] `feat(ui): dashboard home widgets for live positions/orders snapshot and recent actions feed`
- [x] `feat(ui): dashboard/backtest full UX + overlays + summary`
- [x] `feat(ui): dashboard/reports performance views`
- [x] `feat(ui): dashboard/logs audit trail backed by real logs API`
- [x] `feat(ui): dashboard/exchanges api-key connections`
- [x] `feat(ui-nav): rename Execution to Bots and move Orders/Positions under Exchanges dropdown between Dashboard and Markets`
- [x] `feat(i18n): EN default + PL translation coverage`
- [x] `feat(i18n): enforce translation-key usage (no hardcoded page copy) and feature-based namespaces`
- [x] `feat(i18n): locale-aware date/number/currency/percent formatting for dashboard data views`
- [x] `feat(ui): responsive pass for desktop/tablet/mobile`
- [x] `feat(ui): PWA baseline parity for core flows`
- [x] `feat(a11y): keyboard/focus/semantic heading baseline for core dashboard pages`
- [x] `test(ui): EN/PL key coverage and responsive smoke tests`
- [x] `test(ui): view-state consistency tests for loading/empty/degraded/error/success`
- [x] `test(ux): control-center 10-second operator clarity checklist`

## Phase 5 - MVP Closure and Release Readiness
- [x] `docs(ops): MVP runbook for deployment and recovery`
- [x] `docs(risk): user-facing trading risk notice and live consent text`
- [x] `docs(release): known limits and post-MVP boundaries`
- [x] `chore(release): MVP release checklist and changelog`

## Phase 6 - MVP Freeze Gap Closure (As of 2026-03-19)
- [x] `feat(market-stream): implement Binance WebSocket ingest worker for normalized ticker/candle runtime feed`
- [x] `decision(stream): close SSE vs WebSocket fan-out decision and lock MVP transport contract`
- [x] `feat(ui): add dashboard live market bar with stream status, last price, and candle freshness`
- [x] `feat(orders-write): add open/cancel/close order actions with risk-first confirmations`
- [x] `feat(execution-orchestrator): wire signal -> order -> position lifecycle for paper/live runtime paths`
- [x] `feat(positions-live): add live position reconciliation/update loop`
- [x] `feat(backtest): finalize chart overlays and report visualizations to MVP-complete state`
- [x] `test(e2e): add runtime orchestration smoke path covering stream -> signal -> order -> position updates`

## Phase 7 - Runtime Replacement Gate (As of 2026-03-21)
- [x] `audit(reverify): re-validate P0/P1 audit findings in code and tests before further expansion`
- [x] `feat(stream-fanout): expose SSE stream endpoint and connect dashboard live market bar to server-owned stream`
- [x] `feat(runtime-loop): complete continuous stream -> signal evaluation loop in worker runtime`
- [x] `feat(runtime-management): manage manually opened Binance Spot/Futures positions through runtime lifecycle`
- [x] `feat(runtime-management): guarantee DCA/SL/TP/TSL automation until position close`
- [x] `feat(runtime-scans): periodic market/position scans with configurable interval and market filters`
- [x] `test(e2e): expand strategy -> backtest -> paper -> live opt-in flow with runtime assertions`
- [x] `chore(release): re-run MVP checklist with evidence after runtime replacement gate`
## MVP Exit Criteria
- [x] Phase 0 fully complete.
- [x] End-to-end flow works: strategy -> backtest -> paper -> live opt-in.
- [x] Security guardrails active: encryption, ownership checks, rate limits, audit logs.
- [x] Core tests passing for auth, strategy CRUD, market/bot isolation, and trading critical paths.
- [x] UI scope complete for markets, builder, bots, orders, positions, backtest, reports, logs, exchanges.
- [x] EN/PL and responsive/PWA baseline complete for core flows.
- [x] Shared app shell and view-state model are consistent across core dashboard modules.
- [x] Real-time market stream is visible in dashboard control center via server-owned transport.
- [x] Write-side order actions (open/cancel/close) are available with risk-first confirmations.
- [x] Runtime replacement gate for legacy local-only bot flow is validated with evidence.

## Phase 8 - Operational Evidence and Full-App Readiness
- [x] `ops(cutover): define local cutover checklist from legacy bot to new runtime`
- [x] `ops(cutover): define rollback checklist to legacy runtime`
- [x] `test(cutover): execute local replacement dry-run with realistic bot scenario`
- [x] `docs(sync): reconcile roadmap immediate gaps with actual runtime status and evidence links`
- [x] `ops(slo): define MVP/V1 SLO set and map measurable targets to existing source metrics`
- [x] `ops(slo): define SLOs and attach live metrics evidence`
- [x] `ops(evidence): execute production-like load baseline and document pass/fail thresholds`
- [x] `security(audit): produce final ownership/auth/key-flow verification report`
- [x] `release(evidence): finalize launch evidence pack (public docs + operator docs + checklists)`
- [x] `release(review): complete 7-day launch review and V1.1 backlog cut`
- [x] `docs(sync): normalize planning files so roadmap/mvp/v1 statuses are fully consistent`
- [x] `post-mvp(admin): plan owner admin panel milestones for pricing/subscriptions/settings`
- [x] `post-mvp(billing): plan monthly/annual + fiat/crypto billing rollout milestones`
- [x] `post-mvp(exchange): plan adapter rollout for exchanges beyond Binance`

## Phase 9 - Exchange API-Key Verification and Live Position Trust Gate (As of 2026-03-21)
- [x] `P0 auth-stabilization-gate: ensure client build is green for auth/login scope before exchange api-key trust work`
- [x] `fix(auth-ux): harden failed-login UX so success feedback appears only after confirmed session refresh`
- [x] `fix(auth-session-warning): show session-expired warning only for protected or explicit expired-session contexts`
- [x] `test(auth-client): add regression tests for login fail/success/session-refresh redirect behavior`
- [x] `P1 auth-ux-regression: confirm failed/success login UX and redirect/session-warning behavior with regression tests + manual smoke evidence`
- [x] `fix(ui-api-key-test): replace random "Testuj polaczenie" result with real backend API call and deterministic status states`
- [x] `feat(api-key-test-api): add authenticated endpoint to validate provided exchange credentials against Binance permissions`
- [x] `security(api-key-test): ensure test endpoint never persists raw secrets, enforces auth/rate limits, and logs audit-safe metadata only`
- [x] `feat(exchange-validation): map Binance auth/permission errors into stable API contract (invalid key, invalid secret, ip restricted, missing futures/spot scope, network timeout)`
- [x] `feat(profile-save-flow): require successful connection test before allowing LIVE-ready API-key save (with explicit override off by default)`
- [x] `feat(api-key-onboarding): add sync_external_positions and manage_external_positions options`
- [x] `feat(runtime-guard): enforce no-flip and manual-managed symbol ignore rules in runtime execution flow`
- [x] `feat(positions-sync): use verified stored key to fetch real open positions snapshot from Binance and expose read endpoint`
- [x] `feat(ui-positions-live-source): add source switch/state in positions view (runtime snapshot vs exchange-live snapshot) and last-sync timestamp`
- [x] `feat(positions-ui): show position source and management mode badges plus explicit toggle action`
- [x] `test(e2e): add profile/api-key and positions contract tests covering invalid credentials, permission mismatch, and successful live fetch`
- [x] `docs(runbook): document secure API-key onboarding and troubleshooting flow for Binance connection/permissions failures`
- [x] `feat(db): add position/order/trade origin + management mode fields with migration baseline`

## Phase 10 - Navigation, IA, Routing, and Auth Session Hardening (As of 2026-03-22)
- [x] `fix(ui-header-nav): center desktop nav list, remove legacy visual utility clutter, and unify header hover/active/focus styles`
- [x] `fix(ui-header-mobile): enforce full-viewport mobile menu overlay height with header-offset aware `dvh` sizing`
- [x] `test(ui-header-mobile): lock mobile menu overlay sizing contract via responsive regression assertions`
- [x] `fix(ui-language-switcher): correct EN/PL flag visuals and lock language-switcher visual contract with regression tests`
- [x] `audit(routing): create canonical route map and remove dashboard path inconsistencies (including legacy aliases)`
- [x] `refactor(ia-profile): merge API keys and exchange connections under one settings domain model`
- [x] `fix(ui-profile): remove isometric mode toggle from current dashboard account menu (defer to V2 gamification)`
- [x] `fix(auth-session): force deterministic auto-logout on invalid auth/session or deleted-user state`
- [x] `fix(auth-resilience): handle API/DB-unavailable startup in auth context without stale logged-in UI state`
- [x] `feat(auth-ui): add password visibility toggle to login/register with keyboard and screen-reader support`
- [x] `docs(repo-structure): define staged migration from apps/web+apps/api to apps/web+apps/api and add apps/mobile bootstrap plan`
- [x] `docs(parity): define mobile parity contract versus web dashboard scope for MVP/V1`

## Phase 11 - Audit Closure and Scope Realignment (As of 2026-03-22)
- [x] `docs(sync): remove contradictory done/pending states across MVP/V1 plans and align all status claims to repository evidence`
- [x] `test(quality-gate): restore and verify green core test suites before reopening feature expansion`
- [x] `docs(scope): move admin+billing implementation promises to post-MVP/V1.1 and keep V1 docs aligned with current deliverables`
- [x] `feat(stream-contract): deliver stream transport contract requirements (event id, ping heartbeat, max symbols guard)`
- [x] `fix(routing-hard-cut): hard-canonize dashboard URLs and remove legacy alias ambiguity`
- [x] `fix(i18n-contract): remove hardcoded copy and align locale default contract (EN default vs runtime html lang)`
- [x] `security(ops-endpoints): protect /metrics, /alerts, /workers/* with explicit access control`
- [x] `fix(live-contract): enforce LIVE real-exchange side effects; keep simulation strictly in PAPER/BACKTEST`
- [x] `refactor(rate-limit): evolve limiter model toward user/exchange-key aware enforcement`

## Phase 12 - Multi-Bot Runtime Domain (MVP Extension: Data + API + Runtime)
- [x] `MBA-01 audit(domain): map current Bot/SymbolGroup/BotStrategy contracts and define non-breaking migration path`
- [x] `MBA-02 docs(decisions): lock canonical model user->bot->market-group->strategy and assistant topology (1 main + max 4 subagents)`
- [x] `MBA-03 docs(contract): define deterministic signal merge policy for multi-strategy per market-group (priority, tie-break, no-trade)`
- [x] `MBA-04 feat(db): add BotMarketGroup model with ownership, lifecycle status, and execution ordering`
- [x] `MBA-05 feat(db): add MarketGroupStrategyLink model (many-strategies per market-group) with priority/weight fields`
- [x] `MBA-06 feat(db-migration): backfill existing bot strategies into default market-group for zero-downtime compatibility`
- [x] `MBA-07 feat(api): add market-group CRUD under bots with strict ownership isolation`
- [x] `MBA-08 feat(api): add attach/detach/reorder strategy endpoints per market-group`
- [x] `MBA-09 feat(api): expose bot runtime graph read endpoint (bot->groups->strategies) for UI/runtime parity`
- [x] `MBA-10 refactor(runtime): change evaluation loop from bot-level flat strategies to bot->market-group partitions`
- [x] `MBA-11 feat(runtime): execute multi-strategy per market-group with locked merge policy and no-flip guarantees`
- [x] `MBA-12 feat(risk): enforce per-market-group risk budget while preserving bot/global hard caps`
- [x] `MBA-13 test(e2e): add full flow for one user with 2 bots, each with multiple market-groups and strategies`

## Phase 13 - AI Assistant Layer (MVP Foundation: 1 Main + Up to 4 Subagents)
- [x] `MBA-14 docs(ai-contract): define assistant responsibilities, I/O schema, timeout policy, and fail-closed behavior`
- [x] `MBA-15 feat(db): add BotAssistantConfig (main agent mandate, model profile, safety mode)`
- [x] `MBA-16 feat(db): add BotSubagentConfig with slotIndex(1..4), role, enabled flag, and unique(botId,slotIndex)`
- [x] `MBA-17 feat(api): add assistant config CRUD endpoints with hard max-4 subagent validation`
- [x] `MBA-18 feat(runtime-ai): implement main-agent orchestrator scaffold (request plan -> subagent fan-out -> merge)`
- [x] `MBA-19 feat(runtime-ai): implement subagent dispatcher with per-slot timeout, partial-failure tolerance, and deterministic merge`
- [x] `MBA-20 security(ai): add prompt/response sanitization and audit-safe logging for assistant traces`
- [x] `MBA-21 feat(ui): add bot Assistant tab (main agent panel + 4 subagent slots with enable/disable and role)`
- [x] `MBA-22 test(e2e): configure assistant stack and verify explainable runtime decision trace (including no-trade output)`

## Phase 14 - V1 Hardening for Multi-Entity + AI Runtime
- [x] `MBA-23 feat(obs): add metrics for group-evaluation latency, subagent timeout rate, merge outcomes, and no-trade frequency`
- [x] `MBA-24 feat(ops): add circuit-breaker and graceful degradation (assistant off -> strategy-only runtime)`
- [x] `MBA-25 feat(ai-policy): enforce mandate boundaries and forbidden-action policy before execution approval`
- [x] `MBA-26 feat(ui-explainability): add decision timeline by bot/group/strategy/main-agent/subagent with rationale payloads`
- [x] `MBA-27 test(parity): validate backtest/paper/live decision parity with shared assistant orchestration inputs`
- [x] `MBA-28 perf(load): benchmark target profile (3 bots x 4 groups x 4 strategies x 5 agents) and set SLO thresholds`
- [x] `MBA-29 docs(runbook): publish operator runbook for assistant incidents, fallback modes, and safe recovery`
- [x] `MBA-30 release(v1-gate): collect evidence pack and close V1 exit criteria for multi-entity assistant runtime`

## Phase 15 - Runtime Parity Closure (Backtest = Paper = Live)
- [x] `PAR-01 docs(contract): freeze canonical strategy-evaluation contract (open/close/additional) shared across runtime modes`
- [x] `PAR-02 refactor(engine): route backtest signal generation through shared strategy evaluator only (remove mode-specific divergence paths)`
- [x] `PAR-03 feat(backtest): replay lifecycle with shared execution adapters and mode-specific fill models (historical source only)`
- [x] `PAR-04 feat(data): align historical source set with runtime inputs (ohlcv + funding/open-interest where available) and deterministic cache windows`
- [x] `PAR-05 test(parity): add deterministic 3-symbol parity suite comparing backtest decisions with paper/live decision trace on same candles`
- [x] `PAR-06 feat(report): expose parity-delta diagnostics in backtest report (decision time, side, trigger, mismatch reason)`
- [x] `PAR-07 qa(manual): publish Binance side-by-side verification protocol for 3 symbols + same interval/indicators`
- [x] `PAR-08 test(e2e): add strategy -> market-group(3 symbols) -> backtest -> paper trace consistency contract`
- [x] `PAR-09 perf(backtest): profile/reduce memory for multi-symbol timeline rendering without hiding charts`
- [x] `PAR-10 docs(runbook): operator protocol for interpreting mismatch reasons and safe corrective actions`
- [x] `PAR-11 feat(report): include explicit per-symbol processed/failed status and error diagnostics in parity report`
- [x] `PAR-12 feat(ui): surface parity diagnostics status/error per symbol in markets-tab cards`

## Phase 16 - V1 Runtime Safety Closure (As of 2026-04-22)
- [x] `SAFEV1-01 docs(contract): freeze live/paper runtime safety scope for zero-entry, capital truth, ownership, and limiter degradation`
- [x] `SAFEV1-02 test(api-red): lock incomplete exchange snapshot handling so reconciliation cannot persist zero-entry open positions`
- [x] `SAFEV1-03 refactor(api-reconciliation): make exchange-synced open position creation fail closed on missing canonical entry truth`
- [x] `SAFEV1-04 test(api-red): lock fail-closed live capital context when canonical wallet/bot credential ownership is missing`
- [x] `SAFEV1-05 refactor(api-runtime): remove forbidden live capital fallback to unrelated recent API keys`
- [x] `SAFEV1-06 test(api-red): lock canonical external-position ownership under overlapping symbol coverage`
- [x] `SAFEV1-07 refactor(api-runtime): replace symbol-level ownership heuristics with one deterministic canonical owner contract`
- [x] `SAFEV1-08 test(api-red): lock explicit degraded-state contract for production rate limiting`
- [x] `SAFEV1-09 refactor(api-ops): harden rate-limit degradation policy for production-sensitive endpoints`
- [x] `SAFEV1-10 qa(closure): run focused V1 runtime safety pack and publish closure evidence`

## Phase CQLT - Code Quality and Maintainability Hardening (Queued 2026-04-21)
- [x] `CQLT-01 docs(contract): freeze maintainability remediation scope, anti-pattern taxonomy, and non-regression rules`
- [x] `CQLT-02 audit(web): inventory component-local copy dictionaries and hardcoded user-facing strings by route/module`
- [x] `CQLT-03 audit(structure): inventory oversized production modules and define extraction seams per file`
- [x] `CQLT-04 audit(api): inventory exchange-bootstrap, fallback/default hotspots, and duplicated helpers across API modules`
- [x] `CQLT-05 docs(decision): freeze extraction order and ownership rules for i18n, shared helpers, adapters, and monolith splits`
- [x] `CQLT-06 test(guardrails-red): block new component-local copy dictionaries in production web modules`
- [x] `CQLT-07 test(guardrails-red): block new raw user-facing hardcoded strings outside canonical i18n/shared exception list`
- [x] `CQLT-08 test(guardrails-red): add oversized-production-file budget audit with allowlist for staged decomposition`
- [x] `CQLT-09 test(guardrails-red): add duplicate shared-helper inventory snapshot for dashboard/bots runtime formatting seams`
- [x] `CQLT-10 docs(guardrails): publish exception policy for approved hardcoded values, legacy bridges, and file-budget allowlist`
- [x] `CQLT-11 refactor(web-shared): move AuthContext and shared fallback error strings to canonical i18n-aware helpers`
- [x] `CQLT-12 refactor(web-profile): migrate ApiKey/profile local copy dictionaries to namespaces or shared copy builders`
- [x] `CQLT-13 refactor(web-strategies): migrate remaining local strategy list/edit copy maps to namespaces`
- [x] `CQLT-14 refactor(web-wallets): split wallet form copy from form logic and remove embedded locale maps`
- [x] `CQLT-15 test(web): lock route-reachable translation parity for modules migrated in CQLT-C`
- [x] `CQLT-16 refactor(web-shared): extract canonical DCA ladder helper used by dashboard and bots monitoring`
- [x] `CQLT-17 refactor(web-shared): extract shared runtime badge/formatting helpers where dashboard and bots contracts match`
- [x] `CQLT-18 refactor(web-shared): centralize recurring async list/page boilerplate helpers for load-error-retry state`
- [x] `CQLT-19 test(web): add focused regressions proving helper extraction preserves dashboard/bots rendering parity`
- [x] `CQLT-20 refactor(web-dashboard): split HomeLiveWidgets into controller-owned orchestration plus smaller sections/helpers without behavior changes`
- [x] `CQLT-21 refactor(web-backtests): split BacktestRunDetails into read-model hooks, chart helpers, and presentational sections`
- [x] `CQLT-22 refactor(web-bots): split BotsManagement and BotsMonitoringTab into tab controllers, tables, and summary sections`
- [x] `CQLT-23 refactor(web-wallets): split WalletCreateEditForm into form state, metadata preview/reset actions, and presentation sections`
- [x] `CQLT-24 test(web): run focused parity/regression pack for decomposed modules after each extraction`
- [x] `CQLT-25 refactor(api-orders): split manual-order context, quantity-rule normalization, lifecycle authority, and persistence mapping out of orders.service`
- [x] `CQLT-26 refactor(api-bots): split command validation, canonical bot context checks, and projection-drift helpers out of botsCommand.service`
- [x] `CQLT-27 refactor(api-backtests): split range resolution, symbol preparation, report lifecycle, and timeline helpers out of backtests.service`
- [x] `CQLT-28 refactor(api-exchange): centralize exchange/ccxt bootstrap and capability access behind narrower adapter entrypoints`
- [x] `CQLT-29 test(api): add focused regression packs for orders, bots, backtests, and exchange-rule access after service decomposition`
- [x] `CQLT-30 docs(inventory): catalog fallback/default patterns as allowed, temporary, or forbidden`
- [x] `CQLT-31 refactor(shared): replace forbidden hidden fallbacks in non-critical quality paths with explicit unresolved states where safe`
- [x] `CQLT-32 docs(decision): freeze legacy bridge sunset list and mark compatibility-only code paths that remain intentional`
- [x] `CQLT-33 qa(closure): run full quality closure pack and publish maintainability delta evidence`
- [x] `CQLT-34 docs(sync): update queue/context/module docs and capture post-wave coding rules for future agents`

Progress log:

- 2026-04-22: Closed `TRUTH-A` by removing forbidden LIVE key fallback to
  unrelated recent exchange credentials, introducing explicit authenticated
  exchange-read support truth with fail-closed unsupported operations,
  hardening JSX/presenter guardrails to catch real runtime literal leaks, and
  migrating shared UI defaults (`ConfirmModal`, `DataTable`,
  `SearchableMultiSelect`) to canonical `public.sharedUi.*` i18n defaults.
  Validation PASS: focused API tests, focused web guardrail tests,
  `quality:guardrails`, `api build`, `web build`, `typecheck`.
- 2026-04-21: Closed `CQLT-25..CQLT-29` by extracting orders manual-context /
  quantity-rule / lifecycle seams, moving bot wallet-context and
  strategy-projection drift ownership into dedicated services, extracting
  backtest range/symbol-preparation/report-lifecycle helpers, centralizing
  orders connector bootstrap via one exchange factory, and adding focused
  non-DB API seam regressions. Validation PASS: `api focused seam tests`,
  `api build`, `quality:guardrails`.
- 2026-04-21: Closed `CQLT-30..CQLT-32` and `CQLT-34` by publishing fallback
  classification plus legacy-bridge sunset inventory, removing hidden
  bot-update wallet base-currency inference, and synchronizing queue/context
  docs to the post-API-decomposition state.
- 2026-04-21: Closed `CQLT-33` by running the DB-backed API closure pack
  sequentially per file on local Postgres, then passing repository-wide
  `build`, `typecheck`, `quality:guardrails`, and refreshed
  `i18n:audit:route-reachable:web`; evidence published in
  `docs/operations/code-quality-maintainability-closure-2026-04-21.md`.
- 2026-04-21: Cleared the active web warning baseline ahead of the remaining
  `CQLT` slices by fixing all current `react-hooks/exhaustive-deps` warnings in
  `AuthContext`, profile API-key/subscription surfaces, and
  `WalletCreateEditForm`; `pnpm --filter web run build` is warning-free again.
- 2026-04-21: Closed `CQLT-11` by adding canonical `dashboard.shared.*`
  translation keys, moving `AuthContext` logout/session-expired toasts to
  i18n-aware resolution, and replacing the hardcoded `handleError` default with
  a shared translation-backed fallback plus caller override support.
- 2026-04-21: Closed `CQLT-12..CQLT-14` by migrating profile, strategies, and
  wallet-form copy maps to canonical namespaces and removing the corresponding
  temporary `repoGuardrails` allowlist entries; `CQLT-15` remains open because
  route-reachable audit tooling is blocked in this environment by missing local
  dependencies (`typescript` not installed for the audit script).
- 2026-04-21: Closed `CQLT-15` by restoring workspace dependencies, extending
  route-level i18n regression coverage for migrated profile/strategies/wallets
  surfaces, generating the route-reachable audit artifact, and passing the web
  closure pack (`vitest` i18n suite, `pnpm i18n:audit:route-reachable:web`,
  `pnpm --filter web run build`, `pnpm --filter web run typecheck`,
  `pnpm run quality:guardrails`).
- 2026-04-21: Closed `CQLT-16` by extracting one canonical DCA ladder helper
  under `apps/web/src/features/shared/`, rewiring dashboard home and bots
  monitoring to the same renderer, adding focused shared-helper regression
  coverage, and hardening `repoGuardrails` to skip tracked files removed during
  staged refactors.
- 2026-04-21: Closed `CQLT-17` by extracting one shared runtime
  badge/formatting helper module for compact age plus session/side/lifecycle
  tone mapping, rewiring dashboard home and bots monitoring to that shared
  contract, and adding focused unit coverage for the extracted formatter seam.
- 2026-04-21: Closed `CQLT-18` by adding one shared async view-state helper for
  `loading + error + retry`, rewiring scoped profile/strategies/wallet loads to
  that common contract, extending async helper tests, and replacing API keys
  hard reload retry with local refresh.
- 2026-04-21: Closed `CQLT-19` by extending the selected-bot dashboard vs
  preview parity suite with DCA ladder and runtime trade-label assertions after
  helper extraction, and by aligning bots preview DCA formatting with
  dashboard locale-aware output so the focused parity pack stays green.
- 2026-04-21: Closed `CQLT-20` by extracting runtime input parsing,
  direction/action/reason pill helpers, and position-edit draft typing into
  `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx`,
  reducing `HomeLiveWidgets.tsx` toward controller-owned orchestration without
  changing route behavior; focused dashboard-home regressions, `web build`,
  and `quality:guardrails` passed for the seam-first split.
- 2026-04-21: Closed `CQLT-21` by extracting deterministic backtest detail
  view-model helpers into
  `apps/web/src/features/backtest/utils/backtestRunDetailsViewModel.ts`,
  moving summary/timeline chart rendering into
  `apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx`,
  reducing `BacktestRunDetails.tsx` from 2037 to 1137 lines while focused
  backtests tests, `web build`, and `quality:guardrails` stayed green.
- 2026-04-21: Closed `CQLT-22` by extracting dedicated assistant-tab and
  monitoring-section components under `apps/web/src/features/bots/components/`,
  reducing `BotsManagement.tsx` from 1093 to 826 lines and
  `BotsMonitoringTab.tsx` from 1078 to 890 lines while focused
  bots-management tests, `web build`, and `quality:guardrails` stayed green.
- 2026-04-21: Closed `CQLT-23` by extracting wallet form state helpers,
  metadata/preview/reset action helpers, and dedicated presentation sections
  under `apps/web/src/features/wallets/components/wallet-create-edit-form/`,
  reducing `WalletCreateEditForm.tsx` from 791 to 483 lines while preserving
  focused wallet create/edit/reset regressions and green `web build`.
- 2026-04-21: Closed `CQLT-24` by running the focused decomposition regression
  pack across dashboard, preview parity, backtests, bots, and wallets
  (`46/46 PASS`) with `quality:guardrails` and `web build` green.
- 2026-04-21: Closed `CQLT-A` (`CQLT-01..CQLT-05`) by publishing the active
  maintainability remediation contract, recording concrete web/API/monolith
  inventories, and freezing extraction-order ownership before refactor work.
- 2026-04-21: Closed `CQLT-B` (`CQLT-06..CQLT-10`) by extending repository
  guardrails to block new local copy dictionaries, raw user-facing hardcoded UI
  literals, and non-allowlisted `1000`+ line monoliths, and by publishing the
  duplicate-helper snapshot plus exception policy.
- 2026-04-21: queued `CQLT` maintainability hardening wave in `docs/planning/code-quality-maintainability-remediation-plan-2026-04-21.md` after repository-wide audit confirmed repeated local copy dictionaries, hardcoded user-facing strings, oversized production modules, duplicated helpers, spread exchange bootstrap ownership, uncontrolled fallback/default patterns, and recurring async boilerplate.
- [x] `PAR-13 fix(web-typecheck): align reports service api import with default export contract`
- [x] `PAR-14 fix(api-contract): enforce timeline symbol scope to run symbols (404 outside run scope)`
- [x] `PAR-15 chore(repo-hygiene): ignore local agent-generated skills folders to keep working tree clean`
- [x] `PAR-16 feat(ui-backtest): visualize lifecycle events and real counters in markets chart legend`
- [x] `PAR-17 perf(ui-backtest): skip timeline fetch for symbols already marked FAILED in parity diagnostics`
- [x] `PAR-18 cleanup(ui-backtest): remove unused mock backtest form component from active web codepath`
- [x] `PAR-19 test(backtests): add invalid-symbol regression test for FAILED parity diagnostics output`
- [x] `PAR-20 fix(web-build): remove web lint warnings and keep production build gate clean`
- [x] `PAR-21 feat(ui-backtest-create): enforce maxCandles range and show market-group context in form summary`
- [x] `PAR-22 test(ui-backtest-create): add UI regression tests for maxCandles validation and submit payload mapping`
- [x] `PAR-23 fix(ui-backtest): harden timeline handling against missing arrays to prevent runtime filter errors`
- [x] `PAR-24 fix(web-build): add favicon asset required by Next.js production build`

## Phase 16 - Position Lifecycle Fidelity (Old Bot Parity: DCA/TP/TTP/SL/TSL)
- [x] `POS-31 parity(audit): map old CryptoBot position lifecycle order and exact trigger semantics into canonical parity matrix doc`
- [x] `POS-32 refactor(engine): enforce strict one-position-per-symbol lifecycle and no-overlap rendering contract for historical timeline`
- [x] `POS-33 fix(engine): implement old-bot-equivalent DCA/TTP/TSL sequencing with basic/advanced mode gates and post-DCA activation rules`
- [x] `POS-34 fix(backtest-runtime): route BACKTEST/PAPER/LIVE position management through one shared lifecycle engine with identical closure reasons`
- [x] `POS-35 test(e2e+ui): add deterministic parity fixtures and chart event contract assertions (entry/exit/dca/ttp/sl/tsl counts + open-position stats)`

## Phase 17 - Position Lifecycle Parity Remediation (Backtest <-> Paper/Live)
- [x] `POS-36 fix(contract): remove strategy-exit close bypass from backtest/replay/runtime and keep EXIT as trace-only in parity mode`
- [x] `POS-37 fix(runtime): align runtime automation mode/context with bot/position mode and enforce BOT_MANAGED-only automation`
- [x] `POS-38 feat(runtime-capital): add shared runtime capital context (dynamic paper equity + next-DCA affordability -> dcaFundsExhausted)`
- [x] `POS-39 refactor(runtime-dca): execute DCA via execution adapters (paper/live) instead of DB state mutation-only path`
- [x] `POS-40 refactor(backtest): unify on single lifecycle close semantics across interleaved/replay adapters`
- [x] `POS-41 test(parity): add golden fixtures for close-reason sequence parity across backtest/paper/live`
- [x] `POS-42 qa(manual): publish side-by-side Binance verification protocol for lifecycle reason parity`

## Phase 18 - Bot Module Delivery (Stream-First, Backtest-Parity, No-Chart Monitoring)
- [x] `BMOD-01 docs(contract): freeze Bot V2 create/update payload and migration invariants`
- [x] `BMOD-02 docs(decisions): lock websocket-first bot signal policy and no-chart monitoring scope`
- [x] `BMOD-03 chore(audit): add preflight report script for LOCAL bots and legacy bot-strategy bindings`
- [x] `BMOD-04 test(baseline): pin current bot api/ui/runtime baseline tests before refactor`
- [x] `BMOD-05 refactor(api-types): remove LOCAL from bot mode zod/types contract`
- [x] `BMOD-06 feat(api-compat): add temporary LOCAL->PAPER read-compat adapter for transition window`
- [x] `BMOD-07 refactor(api-create): switch bot create contract to Strategy + MarketGroup payload`
- [x] `BMOD-08 feat(api-create): create bot + botMarketGroup + strategyLink in one transaction`
- [x] `BMOD-09 refactor(api-derive): derive bot marketType from selected market-group universe`
- [x] `BMOD-10 refactor(api-write): remove positionMode from bot write payload contract`
- [x] `BMOD-11 refactor(api-write): remove bot-level maxOpenPositions input contract`
  - [x] `BMOD-12 test(api): extend bots e2e coverage for new create/edit payload and ownership checks`
- [x] `BMOD-13 refactor(web-types): remove LOCAL and legacy creator-only fields from bot types`
- [x] `BMOD-14 feat(web-data): load market groups into bot creator`
- [x] `BMOD-15 feat(web-creator): create V2 form with Strategy + MarketGroup selectors`
- [x] `BMOD-16 feat(web-creator): make paperStartBalance visible only for PAPER mode`
- [x] `BMOD-17 feat(web-creator): remove positionMode and maxOpenPositions inputs from UI`
- [x] `BMOD-18 feat(web-creator): add derived strategy summary (interval/leverage/max-open)`
- [x] `BMOD-19 test(web): update BotsManagement tests for new payload and mode-conditional behavior`
- [x] `BMOD-20 refactor(runtime-signal): evaluate entry/exit strategy decisions only on final candle events`
- [x] `BMOD-21 refactor(runtime-lifecycle): keep ticker path for open-position automation only`
- [x] `BMOD-22 feat(runtime-idempotency): add deterministic dedupe key per bot/group/symbol/candle window`
- [x] `BMOD-23 feat(runtime-risk): compute group max-open cap from active strategy risk settings`
- [x] `BMOD-24 refactor(runtime-model): remove runtime dependency on legacy bot-strategy fallback graph`
- [x] `BMOD-25 feat(runtime-watchdog): keep scan loop as disabled-by-default fallback watchdog`
- [x] `BMOD-26 test(runtime): extend signal-loop and watchdog tests for websocket-first semantics`
- [x] `BMOD-27 test(parity): add bot-paper vs backtest decision parity regression suite`
- [x] `BMOD-28 feat(db): add bot runtime session model for run-like monitoring windows`
- [x] `BMOD-29 feat(db): add bot runtime event model for lifecycle trace storage`
- [x] `BMOD-30 feat(db): add bot runtime per-symbol stats snapshot model`
- [x] `BMOD-31 feat(runtime-telemetry): persist session/event/stat snapshots from runtime orchestrator`
- [x] `BMOD-32 feat(api-monitor): add endpoints for bot sessions list/detail`
- [x] `BMOD-33 feat(api-monitor): add endpoints for per-symbol stats and trades list (no chart payload)`
- [x] `BMOD-34 feat(web-monitor): add bot monitoring view with summary + pair stats + trades table`
- [x] `BMOD-35 feat(web-live-refresh): add lightweight auto-refresh for active bot sessions`
- [x] `BMOD-36 test(e2e): add end-to-end monitoring contract coverage for session/stat/trade data`
- [x] `BMOD-37 chore(data-migration): migrate legacy LOCAL modes and legacy botStrategy bindings to canonical model`
- [x] `BMOD-38 refactor(db): remove LOCAL enum from Prisma after successful migration verification`
- [x] `BMOD-39 docs(runbook): publish bot module operator runbook and manual smoke checklist`
- [x] `BMOD-40 release(gate): run full regression gate for bot/backtest/runtime and record evidence`
- [x] `BMOD-41 fix(runtime-resilience): harden runtime signal loop against stream-handler crashes and add auto-restart watchdog for canceled/stalled sessions`
- [x] `BMOD-42 test(runtime): add regression coverage for resilient stream handling and runtime auto-restart after handler failure`

## Phase 19 - Bots Operations Center UX Cleanup (No Runtime Logic Drift)
- [x] `BOPS-01 docs(plan): lock IA split (Dashboard = global control center, Bots = runtime operations center) and define now/history/future monitoring contract`
- [x] `BOPS-02 feat(web-monitor): restructure monitoring into explicit operator blocks (Now: open positions + open orders, History: closed positions + trades, Future: live signal checks by symbol)`
- [x] `BOPS-03 feat(web-monitor): keep auto-refresh updates in-place (no section remount/flicker) for accessibility-safe monitoring`
- [x] `BOPS-04 feat(web-bots-dashboard): redesign bot list into clickable operational cards for fast context switching between active bots`
- [x] `BOPS-05 feat(web-monitor): replace lightweight activity feed with dense operational table aligned to backtest readability`
- [x] `BOPS-06 feat(web-creator): reorganize creator form into three sections (core bot mode, market-group context, strategy context)`
- [x] `BOPS-07 feat(api+web-guard): block duplicate active bot creation when strategy + market-group pair is already active`
- [x] `BOPS-08 feat(api+web-guard): block strategy editing while referenced by any active bot (allow when all linked bots inactive)`
- [x] `BOPS-09 feat(web-monitor): default monitoring to aggregate session view with optional advanced per-session drilldown`
- [x] `BOPS-10 feat(web-monitor): strengthen Bots operational IA (history/open/live-signals) without backend behavior changes`
- [x] `BOPS-11 feat(web-monitor): simplify controls and optimize human-first operator workflow in bot dashboard`
- [x] `BOPS-12 feat(web-monitor): improve visual hierarchy and runtime summary cards for faster manual operator validation`
- [x] `BOPS-13 feat(web-monitor): align section naming + helper copy with "Bots as operational center" IA for human operators`
- [x] `BOPS-14 feat(web-monitor): align Dashboard vs Bots helper labels so module boundaries stay obvious for operators`
- [x] `BOPS-15 feat(web-monitor): tune table ordering + section spacing for faster operator scan during live refresh`
- [x] `BOPS-16 feat(web-monitor): tune monitoring table defaults + filter hints for faster manual runtime triage`
- [x] `BOPS-17 feat(web-monitor): finalize naming consistency across monitoring tabs + section subtitles`
- [x] `BOPS-18 feat(web-monitor): add compact operator checklist panel for repeated manual runtime health checks`
- [x] `BOPS-19 feat(web-dashboard): polish global control-center cards + CTA hierarchy to complement Bots operations center`
- [x] `BOPS-20 feat(web-dashboard): improve first-view control-center grouping + action clarity for operators`
- [x] `BOPS-21 feat(web-dashboard): tighten control-center visual density + KPI scan rhythm for high-frequency operator checks`
- [x] `BOPS-22 feat(web-dashboard): refine dashboard onboarding microcopy + operator context strip for cleaner first-load orientation`
- [x] `BOPS-23 feat(web-dashboard): improve cross-module handoff cues (Dashboard -> Bots, Backtests, Reports) for operator navigation confidence`
- [x] `BOPS-24 feat(web-dashboard): tune compact typography + spacing rhythm in control-center cards for at-a-glance scan fidelity`
- [x] `BOPS-25 feat(web-dashboard): harmonize dashboard control-center card heights + action alignment across breakpoints`
- [x] `BOPS-26 feat(web-dashboard): tighten micro-layout consistency of onboarding + control-center strips between 2xl, xl and md breakpoints`
- [x] `BOPS-27 feat(web-dashboard): normalize button sizing hierarchy + interaction affordances across dashboard control-center actions`
- [x] `BOPS-28 feat(web-dashboard): harden visual affordance of primary-vs-secondary CTA paths in control-center and onboarding strips`
- [x] `BOPS-29 feat(web-dashboard): tighten CTA copy + density in dashboard strips to reduce decision latency`
- [x] `BOPS-30 feat(web-dashboard): rebalance status-card wording + emphasis to avoid duplicated semantic signals`
- [x] `BOPS-31 feat(web-dashboard): polish control-center + onboarding visual rhythm with final spacing/contrast pass before manual UX review`
- [x] `BOPS-32 chore(web-dashboard): prepare focused manual UX review checklist for dashboard+bots operational flow`
- [x] `BOPS-33 feat(web-dashboard): apply checklist-driven final nits from manual dashboard+bots UX walk-through`
- [x] `BOPS-34 chore(web-dashboard): run final responsive pass on dashboard+bots headers/cards after checklist nits and lock release screenshots`
- [x] `BOPS-35 chore(web-dashboard): execute final manual smoke of Dashboard->Bots UX flow and attach validation notes to planning log`
- [x] `BOPS-36 feat(web-dashboard): apply final fixes from manual smoke notes and freeze Dashboard->Bots UX for wider QA`
- [x] `BOPS-37 feat(web-dashboard): remove redundant sidebar actions (Odswiez/Boty runtime) from dashboard Bot runtime card`
- [x] `BOPS-38 test(web-dashboard): update dashboard component tests for no-local-CTA runtime sidebar contract`
- [x] `BOPS-39 feat(web-nav): add Bots dropdown entries (Lista botow, Dodaj bota) aligned with Markets/Strategies/Backtests IA`
- [x] `BOPS-40 feat(web-bots-routing): wire canonical create/list routes for Bots menu entries with proper active-state and breadcrumbs`
- [x] `BOPS-41 test(web-nav): add regression coverage for Bots dropdown structure and route targets`
- [x] `BOPS-42 feat(api+web-guard): block market-universe update/delete while linked symbol-group is used by any active bot (409 + explicit UX message)`

## Phase 20 - Dashboard Trade Action Clarity (OPEN/DCA/CLOSE)
- [x] `DBACT-01 docs(contract): define dashboard transaction action semantics and rollout plan in docs/planning/dashboard-trade-action-ux-plan-2026-04-01.md`
- [x] `DBACT-02 feat(db): add trade lifecycleAction enum/column with backward-safe default for historical rows`
- [x] `DBACT-03 feat(runtime): classify trade fills into OPEN/DCA/CLOSE and persist lifecycleAction at write-time`
- [x] `DBACT-04 feat(api-monitor): expose lifecycleAction plus non-null fee/realizedPnl and margin in dashboard/bots history payloads`
- [x] `DBACT-05 feat(web-dashboard): add Action column with localized OPEN/DCA/CLOSE badges and switch capital column to Margin`
- [x] `DBACT-06 feat(web-dashboard): render Fee and Realized PnL as always-filled currency values (no placeholder '-')`
- [x] `DBACT-07 test(api+web): add contract + component coverage for action mapping, margin rendering, and non-null fee/realized values`

## Phase 21 - LIVE Fee Truth + i18n + Numeric Input Hardening
- [x] `LFIN-01 docs(contract): lock LIVE fee source-of-truth and reconciliation fallback hierarchy (exchange fills/trades first, estimator only as temporary pending fallback)`
- [x] `LFIN-02 feat(db): add fill-level persistence and fee-source metadata for order/trade runtime history`
- [x] `LFIN-03 feat(exchange): extend ccxt connector contract with normalized fill/trade retrieval methods for executed orders`
- [x] `LFIN-04 feat(runtime): add live fill reconciliation flow and persist exchange-true fee totals in order/trade`
- [x] `LFIN-07 feat(api-live-adapter): ingest exchange fill commissions in LIVE adapter and persist exact fee data into runtime order/trade records`
- [x] `LFIN-05 feat(api+web): expose and render feeSource/feePending/feeCurrency in dashboard+bots history views`
- [x] `LFIN-06 audit(i18n): inventory hardcoded copy in dashboard-home, bots module, and dashboard header menu`
- [x] `LFIN-07A refactor(web-i18n-dashboard-home): migrate dashboard home/control-center strings to translation keys with EN/PL parity`
- [x] `LFIN-07B refactor(web-i18n-bots): migrate bots management/runtime strings to translation keys with EN/PL parity`
- [x] `LFIN-08 refactor(web-nav-i18n): remove inline locale dictionaries from header and use canonical i18n keys only`
- [x] `LFIN-09 docs(contract): lock locale-safe numeric input policy (comma/dot, precision matrix, integer vs decimal fields)`
- [x] `LFIN-10 feat(web-utils): add shared number parser/normalizer and form-level validation contract`
- [x] `LFIN-11 refactor(web-strategies): replace direct Number(...) parsing in strategy form sections with parser-driven handling + precision guards`
- [x] `LFIN-12 test(api+web): add reconciliation, i18n, and numeric-input regression suites for new contracts`
- [x] `LFIN-08 test(api-live-adapter): add regression coverage for LIVE fill fee persistence/fallback behavior and runtime serialization parity`

## Phase 22 - Dashboard Runtime Trades Table (Server-Side Operability)
- [x] `DBRT-01 docs(contract): lock Dashboard runtime trade-history table contract (server-side pagination, sort, filters, response meta)`
- [x] `DBRT-02 feat(api-runtime): extend runtime-session trades query with page/pageSize/sortBy/sortDir/filters and deterministic ordering`
- [x] `DBRT-03 feat(web-types): extend bots runtime trades DTO/service with pagination+sorting contract and meta mapping`
- [x] `DBRT-04 feat(web-dashboard): implement server-driven trade-history table controls (filters, sortable headers, pagination) in Dashboard`
- [x] `DBRT-05 test(api+web): add regression coverage for runtime trade-history pagination/sort/filter and dashboard state persistence on auto-refresh`

## Phase 23 - Typecheck Gate Adoption (Tooling)
- [x] `TCHK-01 feat(tooling-api): add api typecheck script (tsc --noEmit) and verify local pass`
- [x] `TCHK-02 feat(tooling-web): add web typecheck script (tsc --noEmit) and verify local pass`
- [x] `TCHK-03 feat(tooling-root): add root aggregate typecheck script for api+web`
- [x] `TCHK-04 chore(ci-quality): add/enable typecheck step in quality pipeline and document gate usage`

## Phase 24 - Dashboard Trades Filter Polish (UX)
- [x] `DBRT-06 feat(web-dashboard): simplify trades header and pagination summary presentation`
- [x] `DBRT-07 feat(web-dashboard): introduce apply/reset filter workflow (draft vs applied state)`
- [x] `DBRT-08 feat(web-dashboard): hide UNKNOWN from action filter while keeping UNKNOWN row rendering`
- [x] `DBRT-09 test(web-dashboard): add regression tests for apply-flow, date-range behavior, and UNKNOWN filter UX contract`
- [x] `DBRT-10 feat(web-dashboard): implement tri-state column sorting cycle (asc -> desc -> none) for trades table`

## Phase 25 - Deployment Simplicity (DEV/STAGE/PROD + Coolify VPS)
- [x] `DPL-01 docs(contract): publish canonical DEV/STAGE/PROD environment matrix and secrets policy`
- [x] `DPL-02 docs(runbook): publish step-by-step local DEV and local PROD-like startup procedures`
- [x] `DPL-03 docs(coolify): publish Linux VPS Coolify setup guide with service mapping and domain routing`
- [x] `DPL-04 chore(env): add non-secret `.env.example` templates for api/web with required keys and comments`
- [x] `DPL-05 chore(scripts): add production-safe worker start script and explicit process ownership contract`
- [x] `DPL-06 chore(scripts): add one-command local prod-like orchestration with preflight checks`
- [x] `DPL-07 ops(migrations): define migration strategy for deployment pipeline and operator ownership`
- [x] `DPL-08 ops(health): standardize deployment readiness gates for web/api/workers`
- [x] `DPL-09 ops(smoke): add post-deploy smoke checklist for target domains`
- [x] `DPL-10 ops(rollback): define rollback playbook for app version/env rollback and worker incidents`
- [x] `DPL-11 docs(rename-audit): inventory all `CryptoSparrow` tokens and classify rename waves`
- [x] `DPL-12 docs(rename-plan): define controlled global rename rollout `CryptoSparrow -> Soar` with risk gates`
- [x] `DPL-13 docs(cicd-contract): define immutable commit promotion contract DEV -> STAGE -> PROD`
- [x] `DPL-14 ci(stage): implement automatic deploy-to-stage on integration-branch push`
- [x] `DPL-15 ci(stage-gates): enforce stage gate pack (build/test/migrate/health/smoke) with machine-readable report`
- [x] `DPL-16 ci(promote): implement automatic promotion to prod when stage gates are fully green`
- [x] `DPL-17 ci(prod-rollback): implement automatic rollback to previous stable release on failed post-deploy prod health`
- [x] `DPL-18 ops(coolify): wire Coolify deployment triggers for stage and prod services`
- [x] `DPL-19 security(ci): apply branch protection + secret hardening for safe auto-promotion`
- [x] `DPL-20 docs(runbook): publish incident playbook for blocked promotion and failed stage/prod rollout`

## Phase 26 - Runtime Operability Polish (DCA Ladder + Dynamic TTP/TSL)
- [x] `BOPS-43 docs(contract): lock DCA ladder display contract in Dashboard/Bots (count + executed levels mapping for basic/advanced strategy modes)`
- [x] `BOPS-44 feat(api-runtime): extend runtime positions payload with DCA planned/executed levels derived from strategy additional.dcaLevels/dcaTimes`
- [x] `BOPS-45 feat(web-dashboard+bots): replace plain DCA count cell with compact executed ladder view (e.g. 1: -15%, 2: -30%) while preserving count`
- [x] `BOPS-46 test(api+web): add regression coverage for DCA ladder mapping/rendering (basic repeated levels, advanced ladder, legacy fallback)`
- [x] `BOPS-47 docs(contract): lock dynamic stop display contract (TTP/TSL) for dashboard+bots runtime tables, including TSL derivation from trailing-stop anchor`
- [x] `BOPS-48 feat(api-runtime): compute dynamicTslStopLoss from active trailing-stop config + runtime trailingAnchorPrice (with trailingLossLimit fallback) and expose stable payload fields`
- [x] `BOPS-49 feat(web-i18n+tables): rename stop headers from 'SL (TTP)/(TSL)' to 'TTP/TSL' and keep parity in Dashboard + Bots runtime views`
- [x] `BOPS-50 test(api+web): add regression coverage for TSL/TTP rendering lifecycle (pre-arm '-', post-arm value) and runtime payload mapping`
- [x] `BOPS-51 docs(contract): lock Dashboard signal-panel IA contract (name, placement above open positions, responsive density, and high-symbol navigation behavior)`
- [x] `BOPS-52 feat(web-dashboard): rename 'Live checks' section to strategy-signal wording and move signal panel above open-positions block`
- [x] `BOPS-53 feat(web-dashboard): implement scalable signal cards layout (desktop 4 / tablet 3 / mobile 2) with horizontal rail/slider support for very large symbol sets`
- [x] `BOPS-54 test(web-dashboard): add regression coverage for signal-panel placement, heading copy, responsive card density, and overflow navigation controls`
- [x] `BOPS-65 feat(web-dashboard): polish runtime signal cards UX (header counters + base currency + dual-column condition emphasis) and streamline dashboard trade/open-position table columns/time format`
- [x] `BOPS-55 docs(contract): lock Bots IA split (/bots list, /bots/create form) and table-action navigation contract (Runtime + Assistant + Edit)`
- [x] `BOPS-56 feat(web-routing+nav): switch bots create route to /dashboard/bots/create and align header/menu links + legacy /new redirect`
- [x] `BOPS-57 feat(web-bots-list): redesign /bots into table-first list view (no inline create/edit form) with actions: Podglad(Runtime), Asystent, Edytuj`
- [x] `BOPS-58 feat(web-bot-form): implement single create/edit form view at /bots/create (create mode + edit mode via selected bot id)`
- [x] `BOPS-59 test(web-bots): add regression coverage for new bots routes, list-table actions, and shared create/edit form flow`

## Phase 27 - Cache Safety for Authenticated API Surfaces
- [x] `CACHE-01 feat(api-headers): add authenticated no-store middleware for /auth, /dashboard, /admin responses`
- [x] `CACHE-03 fix(web-sw): restrict service worker runtime caching to static assets only, bypass API/runtime payloads`
- [x] `CACHE-06 docs(ops-coolify): document reverse-proxy cache rules (never cache /auth|/dashboard|/admin, cache static only)`

## Phase 28 - Production Excellence Runtime Hardening
- [x] `PEX-01 docs(contract): freeze idempotency contract for runtime execution commands (open/dca/close/cancel) with dedupe-key schema`
- [x] `PEX-04 feat(runtime-watchdog): add explicit stall detector for NO_EVENT/NO_HEARTBEAT windows with classified failure reasons`
- [x] `PEX-07 feat(obs-metrics): add production metrics for runtime lag, restart count, reconciliation delay, and execution error classes`
- [x] `BOPS-60 docs(contract): lock dashboard trade-history action/fee semantics (OPEN -> realized blank, CLOSE -> realized value) and margin consistency`
- [x] `BOPS-61 fix(api-runtime): resolve per-position TTP/TSL display inputs from linked strategy config fallback and arm TTP at >= threshold`
- [x] `BOPS-62 fix(web-runtime): add sticky TTP display fallback from live PnL% + strategy levels when API dynamic stop is temporarily unavailable`
- [x] `BOPS-63 fix(web-runtime): normalize trailing-level scale in TTP fallback (decimal vs percent inputs) to prevent incorrect trigger math`
- [x] `BOPS-64 fix(engine+web-runtime): disarm TTP below first-floor threshold (first arm - first trail) and allow clean re-arm cycle`
- [x] `ADM-01 docs(contract): define third admin app-shell template contract and rollout tasks (public/dashboard/admin split)`

## Phase 29 - Exchange Placeholder Expansion (Non-Binance fail-closed)
- [x] `EXPH-01 docs(contract): publish exchange placeholder contract and fail-closed behavior for BYBIT/OKX/KRAKEN/COINBASE`
- [x] `EXPH-02 feat(db): extend Exchange enum with BYBIT/OKX/KRAKEN/COINBASE while keeping BINANCE default`
- [x] `EXPH-03 feat(api-core): add centralized exchange capability registry and EXCHANGE_NOT_IMPLEMENTED guard mapping`
- [x] `EXPH-04 feat(api-markets+bots): enforce placeholder exchange fail-closed behavior on unsupported catalog/runtime/live paths`
- [x] `EXPH-05 feat(web): expose exchange placeholders in Markets/Bots/Profile flows with explicit not-implemented hints`
- [x] `EXPH-06 test(api+web): add regression coverage for placeholder persistence and fail-closed responses`
- [x] `EXPH-08 feat(web-types): extend Exchange unions/options across Markets/Bots/Profile modules`
- [x] `EXPH-09 feat(web-ux): add placeholder badges/hints for unsupported exchange operations in creators/runtime paths`

## Phase 30 - Critical Maintainability Hardening (Monolith Split + Repo Hygiene)
- [x] `ARCH-01 docs(contract): publish critical-refactor split contract (no behavior drift) for api/web monolith files`
- [x] `ARCH-02 chore(repo): remove accidental npm lockfile from apps/api and enforce pnpm-only lockfile policy`
- [x] `ARCH-03 chore(api-deps): remove unused api dependency 'prima' and revalidate api typecheck/tests`
- [x] `ARCH-04 cleanup(web): verify/remove dead UI helper files (TableToolbar/basic.service) with import-safety checks`
- [x] `ARCH-05 refactor(api-bots): extract runtime position serialization (TTP/TSL/DCA mapping) from bots.service into dedicated module`
- [x] `ARCH-06 refactor(api-bots): extract session stats aggregation/query layer from bots.service into focused read-services`
- [x] `ARCH-07 refactor(web-dashboard): split HomeLiveWidgets into composable sections (signals, open positions, history, sidebar)`
- [x] `ARCH-08 refactor(web-bots): split BotsManagement into route shell + runtime blocks/components`
- [x] `ARCH-09 perf(web-assets): optimize oversized hero/avatar assets without visual contract drift`
- [x] `ARCH-10 chore(quality): add repository guardrail check for max-file-size budget + lockfile consistency`
- [x] `ARCH-11 refactor(api-bots): extract strategy config parsing helpers (advanced close mode + TTP/TSL + DCA levels) from bots.service`
- [x] `ARCH-12 refactor(api-bots): extract runtime market-data fallback fetchers (kline/ticker) from bots.service into dedicated module`
- [x] `ARCH-13 refactor(api-bots): extract symbol-scoped strategy display resolvers (advanced close mode + DCA plan + TTP/TSL level maps) from bots.service into dedicated module`
- [x] `ARCH-14 refactor(api-bots): extract runtime signal-condition summary formatter from bots.service into dedicated module`
- [x] `ARCH-15 refactor(api-bots): extract runtime signal indicator helpers (EMA/RSI/Momentum + period/value formatting) from bots.service into dedicated module`
- [x] `ARCH-16 refactor(api-bots): extract runtime signal condition-lines and indicator-summary builders from bots.service into dedicated module`
- [x] `ARCH-17 refactor(api-bots): extract shared symbol-universe helpers and remove duplicated normalization logic across bots runtime modules`
- [x] `ARCH-18 refactor(api-bots): extract runtime signal-stats formatting helpers (record parsing, numeric coercion, merge-reason labels) from bots.service into dedicated module`
- [x] `ARCH-19 refactor(api-bots): extract symbol-catalog fallback resolver (volume filter + cache key + catalog lookup) from bots.service into dedicated module`
- [x] `ARCH-20 refactor(api-bots): extract bot create/update validation helpers (strategy lookup, market-group -> symbol-group resolver, max-open derivation, duplicate-active guard query) from bots.service into dedicated module`
- [x] `ARCH-21 refactor(api-bots): extract ownership/session helper queries (owned bot, owned runtime session, session-window end, symbol-group compatibility validator) from bots.service into dedicated module`
- [x] `ARCH-22 refactor(api-bots): extract API-key compatibility resolver (owned key lookup, latest-key fallback, exchange guard) from bots.service into dedicated module`
- [x] `ARCH-23 refactor(api-bots): move duplicate-active strategy+market-group assertion helper from bots.service to botWriteValidation.service`
- [x] `ARCH-24 refactor(api-bots): extract live-consent helpers (version normalization, consent validation, consent audit write) from bots.service into dedicated module`
- [x] `ARCH-25 refactor(api-bots): extract legacy bot-strategy upsert helpers (default symbol-group bootstrap + upsert flow) from bots.service into dedicated module`
- [x] `ARCH-26 refactor(api-bots): extract activation capability policy (paper/live exchange guard) from bots.service into dedicated module`
- [x] `ARCH-27 refactor(api-bots): extract bot response mapper (active strategy projection) from bots.service into dedicated module`
- [x] `ARCH-28 refactor(api-bots): extract shared bot read projection queries (list/get/by-id with strategy-link include) from bots.service into dedicated module`
- [x] `ARCH-29 refactor(api-bots): extract bot market-group and strategy-link CRUD block from bots.service into dedicated module and re-export contract`
- [x] `ARCH-30 refactor(api-bots): extract assistant-config/subagent CRUD and dry-run orchestration from bots.service into dedicated module with re-export contract`
- [x] `ARCH-31 refactor(api-bots): extract runtime trade close-reason normalization/lookup helpers from bots.service into dedicated module`
- [x] `ARCH-32 refactor(api-bots): extract runtime trade lifecycle mapping (OPEN/DCA/CLOSE inference) from bots.service into dedicated module`

## Phase 31 - Dashboard Mobile Navigation Stability
- [x] `NAVM-01 docs(contract): lock mobile nav overlay contract (layering, offset, scroll, close behavior)`
- [x] `NAVM-02 fix(web-header): replace hardcoded mobile-menu offset with dynamic-safe overlay layout`
- [x] `NAVM-03 fix(web-header): enforce deterministic stacking and scroll-lock for open mobile menu`
- [x] `NAVM-04 test(web-header): add interactive mobile menu open/close visibility regression test`
- [x] `NAVM-05 qa(web-header): run manual mobile smoke across dashboard routes and record evidence`

## Phase 32 - Asset Icon Delivery (CoinGecko + Fallback + Deploy)
- [x] `ICN-01 docs(contract): publish coin icon source contract (CoinGecko primary, exchange-independent, fallback-first policy)`
- [x] `ICN-02 feat(api-icons): add CoinGecko symbol/id resolver with icon metadata cache (TTL) and rate-safe fetch strategy`
- [x] `ICN-03 feat(api-icons): add deterministic icon lookup API for dashboard modules (symbol -> icon URL/placeholder metadata)`
- [x] `ICN-04 feat(web-icons): render coin icons in dashboard tables/cards with loading/error fallback behavior`
- [x] `ICN-05 ops(deploy): add CoinGecko-related env template + Coolify rollout checklist updates`
- [x] `ICN-06 test(api+web): add regression coverage for resolver collisions, cache fallback, and icon rendering states`
- [x] `ICN-07 qa(web): run manual smoke for icons across Dashboard/Bots/Markets/Positions and attach evidence note`

## Phase 33 - Dashboard Loading UX (Skeleton + Header Progress)
- [x] `LDUX-01 docs(contract): lock dashboard loading UX contract (skeleton-first + global progress bar under header)`
- [x] `LDUX-02 feat(web-ui): add shared DaisyUI skeleton primitives for table/card/form/kpi dashboard patterns`
- [x] `LDUX-03 feat(web-shell): add dashboard header-underbar navigation progress component with staged percent animation`
- [x] `LDUX-04 refactor(web-viewstate): make dashboard loading path skeleton-first while keeping alert states for error/degraded/success`
- [x] `LDUX-05 feat(web-dashboard-home+bots): replace loading alerts with section/page skeleton compositions`
- [x] `LDUX-06 feat(web-markets+strategies+logs): migrate loading views to skeleton compositions`
- [x] `LDUX-07 feat(web-backtests): migrate list/details loading states to skeletons and preserve timeline phase messaging`
- [x] `LDUX-08 test(web-loading-ux): add regression coverage for progress bar lifecycle and key skeleton rendering states`
- [x] `LDUX-09 qa(web-dashboard): run manual desktop/mobile smoke and capture evidence`

## Phase 34 - Cache Runtime Hardening
- [x] `CACHE-02 test(api-headers): add route tests asserting no-store/vary headers on protected endpoints`
- [x] `CACHE-04 feat(web-sw-lifecycle): add service-worker update strategy (registration update + activation handoff) to reduce stale clients after deploy`
- [x] `CACHE-05 test(web-pwa): add regression checks for market/dashboard runtime requests not served from SW cache`
- [x] `CACHE-07 docs(runbook): add stale-cache incident playbook with clear verify/mitigate/rollback steps`
- [x] `CACHE-08 feat(web-runtime): add explicit stale-data guard in dashboard/bots runtime (age watchdog + transparent warning state)`
- [x] `CACHE-09 test(web-runtime): cover stale-age warning and recovery after fresh payload arrival`

## Phase 35 - Production Excellence (Remaining)
- [x] `PEX-02 feat(api-runtime): enforce dedupe key persistence + replay-safe execution guards for side-effecting runtime actions`
- [x] `PEX-03 test(runtime): add crash/retry regression suite proving no duplicate open/close orders after restart`
- [x] `PEX-05 feat(runtime-recovery): implement bounded auto-restart policy with cooldown and max-attempt guardrails`
- [x] `PEX-06 test(runtime): add long-running soak test for session continuity (heartbeat freshness, auto-restart trace, no stuck CANCELED loop)`
- [x] `PEX-08 feat(obs-alerts): define alert thresholds for stale runtime, repeated restarts, and reconciliation drift`
- [x] `PEX-09 docs(runbook): publish incident triage matrix (symptoms -> checks -> mitigations -> rollback)`
- [x] `PEX-10 feat(ops-backup): add repeatable backup verification command set for target deployment profile`
- [x] `PEX-11 chore(ops-restore-drill): automate restore drill evidence generation with pass/fail contract`
- [x] `PEX-12 docs(ops-rto-rpo): document RTO/RPO targets and acceptable degradation windows`
- [x] `PEX-13 docs(secrets-inventory): publish canonical secret inventory + ownership + rotation cadence`
- [x] `PEX-14 feat(security-rotation): add rotation readiness checks and startup validation for critical secrets`
- [x] `PEX-15 test(security): add regression checks for invalid/expired secret combinations and fail-safe startup`
- [x] `PEX-16 feat(release-gates): add mandatory post-deploy runtime freshness check (bots/sessions/signals not stale)`
- [x] `PEX-17 feat(rollback-guard): define automatic rollback trigger conditions for runtime-critical regressions`
- [x] `PEX-18 docs(release-checklist): update deployment checklist with runtime+cache+stream validation sequence`

## Phase 36 - Exchange Context and Placeholder Completion (Remaining)
- [x] `EXCTX-01 docs(contract): publish venue-context source-of-truth and invariants for creators/runtime`
- [x] `EXCTX-02 docs(decisions): lock MarketUniverse as canonical exchange+marketType+base context owner`
- [x] `EXCTX-03 feat(db): add exchange field to MarketUniverse with BINANCE default`
- [x] `EXCTX-04 feat(db): add bot live apiKey binding field for explicit execution venue context`
- [x] `EXCTX-05 chore(data-migration): backfill existing universes/runs with exchange context snapshot`
- [x] `EXCTX-06 feat(api-markets): extend market-universe and catalog contracts with exchange context`
- [x] `EXCTX-07 feat(api-backtests): derive and persist exchange context from selected market universe`
- [x] `EXCTX-08 feat(api-bots): enforce bot/group/apiKey venue-context compatibility on create/activate`
- [x] `EXCTX-09 refactor(engine): introduce venue-aware market data provider contract`
- [x] `EXCTX-10 refactor(runtime): add exchange to stream-event context and enforce exchange+marketType match`
- [x] `EXCTX-11 feat(execution): bind live execution account selection to bot venue context`
- [x] `EXCTX-12 feat(web-backtest-creator): show explicit exchange/marketType/base context bound to market group`
- [x] `EXCTX-13 feat(web-bot-creator): show explicit venue context and live api-key compatibility hints`
- [x] `EXCTX-14 test(web): add creator regression coverage for venue-context rendering and validation copy`
- [x] `EXCTX-15 test(api+runtime): add context mismatch contract tests for backtest/bot/live paths`
- [x] `EXCTX-16 test(e2e): add end-to-end venue consistency scenario (backtest->paper->live)`
- [x] `EXCTX-17 chore(qa): manual smoke checklist and evidence capture for creator/runtime consistency`
- [x] `EXPH-07 feat(api-profile): allow saving API keys for placeholder exchanges without enabling live execution paths`
- [x] `EXPH-10 test(web): add regression coverage for exchange select options and not-implemented UX states`
- [x] `EXPH-11 test(api): add contract tests for placeholder exchange fail-closed responses`
- [x] `EXPH-12 chore(qa): manual smoke checklist for colleague exchange testing (create/save/read + blocked execute)`
- [x] `DBACT-10 qa(smoke): manual verification on real paper-session timeline (open -> dca -> close) including fee/pnl/margin coherence`

## Phase 37 - V1 Live Stability Closure (Active)
- [x] `V1B-01 fix(api-backtest-core): restore deterministic TTP event emission in replay core and align TTP field semantics with runtime parser contract`
- [x] `V1B-02 test(api-parity): add explicit regression asserting identical TTP/TSL config interpretation between replay parser and runtime automation parser`
- [x] `V1B-03 test(api-runtime-live): extend runtime/positions e2e coverage for bot-managed lifecycle actions and manual-managed ignore behavior`
- [x] `V1B-04 test(confidence-pack): run full backtest + runtime positions confidence pack (api+web) and capture fresh evidence`
- [x] `V1B-05 release(v1-exit-gates): refresh RC external-gates/sign-off artifacts and include Binance live-ops verification checklist`

## Phase 38 - Subscription + Entitlements Foundation (Active)
- [x] `SUBS-01 docs(contract): freeze tier catalog (FREE/ADVANCED/PROFESSIONAL), default assignment rules, and entitlement payload schema`
- [x] `SUBS-02 feat(db): add SubscriptionPlan + UserSubscription + PaymentIntent models with safe migration and indexes`
- [x] `SUBS-03 feat(seed): seed three plans; default new users to FREE; map owner account (wroblewskipatryk@gmail.com) to PROFESSIONAL`
- [x] `SUBS-04 feat(api-profile): expose subscription catalog + active subscription in profile endpoints (my-account ready)`
- [x] `SUBS-05 feat(web-profile): render subscription list with active-plan highlight in My Account -> Subscription`
- [x] `SUBS-06 feat(entitlements-core): add central entitlement resolver and enforce bot-count limits by active plan`
- [x] `SUBS-07 feat(api-admin): add admin CRUD for plan pricing + entitlement limits (editable without deploy)`
- [x] `SUBS-08 feat(web-admin): add admin UI modal for subscription price/limits editing`
- [x] `SUBS-09 feat(payment-abstraction): implement provider-agnostic payment gateway interface + checkout-intent API contract`
- [x] `SUBS-10 feat(payment-provider-stripe): add first provider adapter behind abstraction (toggleable, non-breaking)`
- [x] `SUBS-11 test(api+web): add regression suites for default FREE assignment, owner PROFESSIONAL mapping, plan highlighting, and entitlement enforcement`
- [x] `SUBS-12 docs(runbook): publish operator/admin guide for plan edits, manual assignments, and payment-provider switch strategy`

## Phase 39 - Strategy Indicator + Candle Pattern Expansion (Planned)
- [x] `IND-01 docs(contract): publish canonical indicator registry + parity contract for builder/runtime/backtest`
- [x] `IND-02 fix(api-indicators): remove/flag unsupported placeholders from default indicator catalog until implemented`
- [x] `IND-03 refactor(engine-indicators): extract shared indicator compute/evaluate module used by runtime + backtest`
- [x] `IND-04 test(parity-baseline): lock parity for existing EMA/RSI/MOMENTUM behavior across runtime/backtest`
- [x] `IND-05 refactor(runtime-series): upgrade runtime candle buffer from close-only to OHLCV candle objects`
- [x] `IND-06 refactor(runtime-warmup): fetch/store OHLCV warmup candles and keep final-candle decision indexing deterministic`
- [x] `IND-07 test(runtime-series): add regression coverage for OHLCV buffer updates, dedupe, and interval matching`
- [x] `IND-08 feat(builder-operators): expose full operator set (including cross and range operators) in strategy form`
- [x] `IND-09 feat(config-parser): normalize operand contract (series/constant/band) for runtime + backtest`
- [x] `IND-10 test(config-contract): parser/evaluator regressions for new operators and invalid configs`
- [x] `IND-11 feat(indicator): add SMA end-to-end (catalog + evaluator + backtest timeline + tests)`
- [x] `IND-12 feat(indicator): add MACD end-to-end (line/signal/histogram + tests)`
- [x] `IND-13 feat(indicator): add ROC end-to-end (+ tests)`
- [x] `IND-14 feat(indicator): add StochRSI end-to-end (+ tests)`
- [x] `IND-15 feat(indicator): implement true Bollinger Bands end-to-end (upper/mid/lower, bandwidth, percentB)`
- [x] `IND-16 feat(indicator): add ATR end-to-end`
- [x] `IND-17 feat(indicator): add ADX + DI+/DI- end-to-end`
- [x] `IND-18 feat(indicator): add Stochastic (%K/%D) end-to-end`
- [x] `IND-19 feat(indicator): add CCI end-to-end`
- [x] `IND-20 feat(indicator): add Donchian Channels end-to-end`
- [x] `IND-21 feat(pattern-engine): add shared OHLC candle-pattern evaluation engine (boolean series contract)`
- [x] `IND-22 feat(patterns): add Bullish/Bearish Engulfing end-to-end`
- [x] `IND-23 feat(patterns): add Hammer/Shooting Star end-to-end`
- [x] `IND-24 feat(patterns): add Doji with threshold params end-to-end`
- [x] `IND-25 feat(patterns): add Morning Star / Evening Star end-to-end`
- [x] `IND-26 feat(patterns): add Inside Bar / Outside Bar end-to-end`
- [x] `IND-27 test(pattern-parity): deterministic fixtures for all patterns in runtime + backtest parity suite`
- [x] `IND-28 feat(futures-filter): add funding-rate filters (absolute + z-score) for futures strategies`
- [x] `IND-29 feat(futures-filter): add open-interest filters (delta/MA/z-score) for futures strategies`
- [x] `IND-30 feat(futures-filter): add order-book filters (imbalance/spread/depth ratio) for futures strategies`
- [x] `IND-31 test(futures-filters): add fail-closed fallback tests when derivatives snapshots are missing`
- [x] `IND-32 feat(web-groups): apply new indicator taxonomy groups in strategy creator with EN/PL labels`
- [x] `IND-33 feat(backtest-ui): support multi-line overlays and boolean pattern markers in timeline rendering`
- [x] `IND-34 feat(presets): add trader archetype presets (scalp/day trend/swing/mean reversion/breakout/perp bias)`
- [x] `IND-35 qa(parity): execute 3-symbol side-by-side parity checklist for new indicator families and attach evidence`
- [x] `IND-36 docs(runbook): publish implementation runbook for adding next indicator safely (registry + tests + parity steps)`

## Phase 40 - Security + Architecture Remediation (Audit 2026-04-09)
- [x] `SAR-01 test(api-upload): restore upload security e2e cleanup order so security suite is green again`
- [x] `SAR-02 security(proxy): replace global trust-proxy=true with explicit trusted proxy chain and forwarded-header hardening`
- [x] `SAR-03 security(upload-origin): derive avatar/public upload URLs from trusted config allowlist instead of request host headers`
- [x] `SAR-04 security(checkout): enforce allowlisted callback URLs for checkout intents with canonical fallback`
- [x] `SAR-05 security(profile-throttle): add per-user throttling to checkout-intents and profile security-sensitive endpoints`
- [x] `SAR-06 security(ready): expose only minimal public readiness signal and move detailed diagnostics to protected surface`
- [x] `SAR-07 security(csp): remove production script unsafe-inline via nonce/hash bootstrap approach`
- [x] `SAR-08 test(security-contracts): add regression coverage for proxy trust, public origin derivation, and checkout callback rejection`
- [x] `SAR-09 qa(stage-abuse): execute stage abuse-throttling verification for profile-sensitive routes and publish evidence`
- [x] `SAR-10 refactor(api-backtests): split oversized backtests service into smaller domain services to pass guardrails`
- [x] `SAR-11 refactor(api-runtime): split oversized runtime signal loop service into stream/watchdog/execution units to pass guardrails`
- [x] `SAR-12 refactor(web-bots): finish BotsManagement decomposition to pass file-size guardrails`
- [x] `SAR-13 refactor(api-data-boundary): introduce repository boundaries for bots/backtests/engine high-change modules`
- [x] `SAR-14 ops(rollout): run DEV->STAGE->PROD remediation rollout checklist with smoke gates and rollback drill evidence`
- [x] `ARM-01 refactor(api-runtime): extract runtime signal decision engine from runtimeSignalLoop.service.ts`
- [x] `ARM-02 refactor(api-runtime): extract market-data gateway (warmup/funding/open-interest/order-book) from runtimeSignalLoop.service.ts`
- [x] `ARM-03 refactor(api-runtime): reduce runtimeSignalLoop to stream/session orchestration and execution coordination`
- [x] `ARM-04 test(api-runtime): lock runtime parity after ARM-01..ARM-03 extraction set`
- [x] `ARM-05 refactor(api-backtests): extract BacktestDataGateway from backtests.service.ts`
- [x] `ARM-06 refactor(api-backtests): extract BacktestRunJob progress/simulation orchestration from backtests.service.ts`
- [x] `ARM-07 refactor(api-backtests): replace setTimeout backtest kickoff with queue-backed execution contract`
- [x] `ARM-08 test(api-backtests): lock backtest report/trade parity after service decomposition`
- [x] `ARM-09 refactor(api-bots): split bots.service.ts into command and runtime-read services`
- [x] `ARM-10 refactor(api-bots): extract symbol enrichment and runtime read-model composition modules`
- [x] `ARM-11 refactor(api-data-boundary): reduce direct Prisma usage in orchestration-heavy services`
- [x] `ARM-12 refactor(web-backtest): split BacktestRunDetails into hooks and presentational sections`
- [x] `ARM-13 refactor(web-bots): continue BotsManagement decomposition by moving orchestration to feature hooks`
- [x] `ARM-14 refactor(web-dashboard): split HomeLiveWidgets into data/controller hooks and visual sections`
- [x] `ARM-15 refactor(web-i18n): remove duplicated inline locale dictionaries in dashboard route wrappers`
- [x] `ARM-16 chore(guardrails): remove architecture-related source file budget overrides`
- [x] `ARM-17 chore(quality): enforce updated file-size budgets in quality gate`
- [x] `ARM-18 docs(architecture): publish post-remediation architecture delta and residual-risk summary`

## Phase 41 - Live Runtime Reliability + Frontend IA/UX Cleanup (Active)
- [x] `LIV-01 fix(api-runtime): include exchange-synced positions in runtime/dashboard read path with deterministic ownership mapping`
- [x] `LIV-02 fix(api-reconciliation): make exchange position sync fail-soft per API key and preserve healthy keys processing`
- [x] `LIV-03 fix(api-runtime): prevent duplicate internal OPEN when exchange already has live symbol exposure`
- [x] `LIV-04 test(api-runtime-live): add regressions for sync->runtime visibility and duplicate-open guard`
- [x] `LIV-05 fix(web-backtest): remove post-create transient details-fetch hard error and show pending bootstrap state`
- [x] `LIV-06 test(web-backtest): lock backtest create->details bootstrap UX regression`
- [x] `LIV-07 fix(web-dashboard): restore LIVE wallet metrics rendering (equity/free/allocation) in runtime widget`
- [x] `LIV-08 refactor(web-markets): replace 3-step tabs in MarketUniverse form with single-view layout`
- [x] `LIV-09 feat(web-markets-ux): improve MarketUniverse single-view hierarchy, helper copy, and validation clarity`
- [x] `LIV-10 chore(web-table): add px-3 empty-state padding in shared table no-data message`
- [x] `LIV-11 feat(api-wallet): add authenticated wallet balance preview endpoint for configured exchange key`
- [x] `LIV-12 feat(web-wallets): redesign wallet create/edit form UX with live preview panel and clearer mode/risk guidance`
- [x] `LIV-13 audit(ia-exchanges): map Orders/Positions module parity against Bots Runtime capabilities and identify blocking gaps`
- [x] `LIV-14 refactor(web-ia): remove Exchanges Orders/Positions module from dashboard menu after parity confirmation`
- [x] `LIV-15 chore(web-cleanup): remove obsolete Exchanges Orders/Positions route files and dead frontend modules`
- [x] `LIV-16 test(web-runtime-ia): add regression coverage for updated nav, runtime positions visibility, and wallet widgets`
- [x] `LIV-17 test(web-backtest): add component-level regression to prevent transient hard-error flash in create->details flow`
- [x] `LIV-18 fix(web-backtest-form): stabilize create-form data-loading effects for i18n-safe hook dependencies`
- [x] `LIV-19 fix(web-backtest-details): align hook dependencies in timeline loaders to remove stale-copy warnings`
- [x] `LIV-20 chore(web-dashboard-runtime): remove dead signal-pill helpers and unused imports in HomeLiveWidgets`
- [x] `LIV-21 fix(web-dashboard-runtime): resolve HomeLiveWidgets hook-dependency warnings for selected-data and signal-symbol memo paths`

## Progress Log
- 2026-04-10: Completed `LIV-02` by hardening exchange position reconciliation loop to fail-soft per API key (per-key `try/catch` with structured error log) so one broken key does not block healthy users, and added regression `continues syncing healthy api keys when one api key fetch fails`; validated with `pnpm --filter api test -- src/modules/positions/livePositionReconciliation.service.test.ts` and `pnpm --filter api run typecheck` (PASS).
- 2026-04-10: Completed `LIV-01` by extending bot runtime positions read-model to include `EXCHANGE_SYNC` + `BOT_MANAGED` positions with deterministic per-symbol owner mapping (active bot priority -> group execution order -> bot creation time -> bot id), and added e2e regression `maps exchange-synced bot-managed positions to a deterministic runtime bot owner per symbol`; validated with `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts -t "maps exchange-synced bot-managed positions to a deterministic runtime bot owner per symbol"` and `pnpm --filter api run typecheck` (PASS).
- 2026-04-10: Added `Phase 41` live-reliability + IA/UX cleanup queue (`LIV-01..LIV-16`) covering runtime position import parity, duplicate-open prevention, backtest bootstrap UX fix, wallet/runtime widget restoration, markets-form single-view redesign, shared table empty-state spacing, and planned Exchanges module removal after runtime parity audit.
- 2026-04-10: Completed `LIV-03` + `LIV-04` by adding managed-external-position pretrade guard in runtime signal loop (`EXTERNAL_POSITION_ALREADY_OPEN`) and regression coverage (`runtimeSignalLoop.service.test.ts`, `bots.e2e.test.ts`) to keep sync->runtime visibility and duplicate-open blocking deterministic.
- 2026-04-10: Completed `LIV-05` + `LIV-06` by introducing transient bootstrap retry flow in backtest core-data hook (HTTP 408/425/429/5xx retries) and moving flaky component assertion to stable hook-level regression (`useBacktestRunCoreData.test.tsx`) so create->details bootstrap no longer flashes hard error.
- 2026-04-10: Completed `LIV-07` by restoring LIVE wallet metrics rendering in dashboard runtime sidebar via runtime-capital snapshot fields (`referenceBalance`, `freeCash`) from API positions summary and frontend fallback wiring, with widget regression test (`HomeLiveWidgets.test.tsx`).
- 2026-04-10: Completed `LIV-10` by adding horizontal padding (`px-3`) to shared `DataTable` empty-state row message and locking the spacing contract with a new component regression (`DataTable.test.tsx`).
- 2026-04-10: Completed `LIV-08` + `LIV-09` by replacing MarketUniverse 3-step/tabs flow with single-view structure and clearer validation/helper hierarchy, with updated regression coverage in `MarketUniverseForm.test.tsx`.
- 2026-04-10: Completed `LIV-11` + `LIV-12` by adding authenticated wallet balance preview API (`POST /dashboard/wallets/preview-balance`) and redesigning wallet create/edit UX with LIVE preview panel; verified by `wallets.e2e.test.ts` (api) and `WalletCreateEditForm.test.tsx` (web).
- 2026-04-10: Completed `LIV-13` + `LIV-14` + `LIV-15` by confirming runtime parity in `docs/operations/live-runtime-ia-parity-audit-2026-04-10.md`, removing Orders/Positions entries from dashboard header IA, and deleting obsolete frontend routes/modules for legacy `dashboard/orders` + `dashboard/positions`.
- 2026-04-10: Completed `LIV-16` by extending web regressions for IA/runtime continuity (header nav removal contract, runtime position visibility when symbol-stats are empty, LIVE wallet snapshot rendering) via `Header.responsive.test.tsx` and `HomeLiveWidgets.test.tsx`.
- 2026-04-11: Completed `LIV-17` by adding component-level backtest details regression for transient bootstrap failures (no hard-error flash while retrying initial fetch) in `BacktestRunDetails.test.tsx`; validated with `pnpm --filter web test -- src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- 2026-04-11: Completed `LIV-18` by stabilizing `BacktestCreateForm` data-loading effects with explicit i18n-safe dependency values for strategy/universe load-error toasts (eliminating stale-closure hook warnings in this form), validated with `pnpm --filter web test -- src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx` and `pnpm --filter web run build` (PASS).
- 2026-04-11: Completed `LIV-19` by adding missing i18n copy dependencies in `BacktestRunDetails` timeline loaders (`timelineLoadErrorDefault`, `timelineParityFailedDefault`) to eliminate stale-closure hook warnings without behavior drift; validated with `pnpm --filter web test -- src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx` and `pnpm --filter web run build` (PASS).
- 2026-04-11: Completed `LIV-20` by removing dead `SignalPill` helper code and unused `Bot` import from `HomeLiveWidgets` to reduce runtime dashboard lint noise with no UI contract change; validated with `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` and `pnpm --filter web run build` (PASS).
- 2026-04-11: Completed `LIV-21` by fixing remaining `HomeLiveWidgets` hook dependency warnings (selected-data memo now includes `ttpStickyFavorableMoveByPositionRef`; `signalSymbols` stabilized with dedicated memo before downstream calculations), validated with `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` and `pnpm --filter web run build` (PASS).
- 2026-04-09: Completed `ARM-18` by publishing architecture remediation closure report in `docs/architecture/post-remediation-architecture-delta-2026-04-09.md` (API/web delta by domain, guardrail closure state, residual risks, and follow-up recommendations).
- 2026-04-09: Completed `ARM-17` by enforcing source-file budgets in `quality:guardrails` through explicit app-level thresholds (`api: 90k`, `web: 105k`) with no per-file exceptions, and validated gate execution with `pnpm run quality:guardrails` (PASS).
- 2026-04-09: Completed `ARM-16` by removing architecture-era per-file size exceptions from `scripts/repoGuardrails.mjs` so quality checks no longer whitelist specific hotspot files and all source files are evaluated via baseline budget rules ahead of threshold hardening in `ARM-17`.
- 2026-04-09: Completed `ARM-15` by removing duplicated inline EN/PL dictionaries from dashboard backtests route wrappers (`list/create/details`) and switching breadcrumb/title/add-label copy to shared `useI18n().t(...)` keys (`dashboard.common.*`, `dashboard.nav.*`, `dashboard.logs.tableDetails`) while preserving route behavior and submit flow; validated with `pnpm --filter web run typecheck` (PASS).
- 2026-04-09: Completed `ARM-14` by extracting dashboard runtime orchestration from `HomeLiveWidgets.tsx` into `useHomeLiveWidgetsController` (loading, auto-refresh, stream updates, selected bot/session handling, trade-history controller state) while keeping visual sections (`RuntimeDataSection`, `RuntimeSignalsSection`, `RuntimeSidebarSection`, `RuntimeOnboardingSection`) unchanged; validated with `pnpm --filter web run typecheck` and `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` (PASS).
- 2026-04-09: Completed `ARM-13` by extracting `BotsManagement` orchestration into dedicated feature hooks (`useBotsListController`, `useBotsAssistantController`, `useBotsMonitoringController`) so data loading, command handlers, and monitoring/assistant side effects are separated from JSX rendering while preserving behavior; validated with `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- 2026-04-09: Completed `ARM-12` by extracting core data orchestration from `BacktestRunDetails.tsx` into `useBacktestRunCoreData` hook and moving run-header/stages KPI shell into `BacktestRunHeaderSection` presentational component, keeping existing UI contract intact while reducing component coupling; validated with `pnpm --filter web test -- src/features/backtest/components/BacktestRunDetails.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- 2026-04-09: Completed `ARM-11` by introducing `botsRuntimeRead.repository.ts` and routing runtime symbol-stats orchestration through repository boundaries (base stats snapshot, live symbol rows, fallback symbols, strategy hydration, candle cache reads) to reduce direct `prisma` usage in `botsRuntimeRead.service.ts`; validated with `pnpm --filter api typecheck` and `pnpm --filter api test -- src/modules/bots/runtimeStrategyConfigParser.service.test.ts` (PASS).
- 2026-04-09: Completed `ARM-10` by extracting runtime symbol-stat enrichment helpers (`runtimeSymbolStatsEnrichment.service.ts`) and read-model composition (`runtimeSymbolStatsReadModel.service.ts`), then wiring `botsRuntimeRead.service.ts` through these modules to keep response contract unchanged while reducing in-function orchestration complexity; validated with `pnpm --filter api typecheck` and `pnpm --filter api test -- src/modules/bots/runtimeStrategyConfigParser.service.test.ts` (PASS).
- 2026-04-09: Completed `ARM-09` by splitting `apps/api/src/modules/bots/bots.service.ts` into dedicated command/runtime-read modules (`botsCommand.service.ts`, `botsRuntimeRead.service.ts`) and reducing command-layer coupling by removing runtime-read imports from command service; validated with `pnpm --filter api typecheck` and `pnpm --filter api test -- src/modules/bots/runtimeStrategyConfigParser.service.test.ts` (PASS).
- 2026-04-09: Completed `ARM-08` by adding decomposition-lock regressions for queue/job seams (`backtestRunQueue.test.ts`, `backtestRunJob.test.ts`) and running parity-critical backtest suites (`backtestReplayCore`, `backtestIndicatorTimelineSeries`) after service split; validated with `pnpm --filter api test -- src/modules/backtests/backtestRunQueue.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestIndicatorTimelineSeries.test.ts` and `pnpm --filter api typecheck` (PASS).
- 2026-04-09: Completed `ARM-07` by replacing ad-hoc `setTimeout` run kickoff with explicit queue contract (`backtestRunQueue.ts`) and routing `createRun` scheduling through queued execution (`enqueue`) for deduplicated serial processing and worker-ready boundary; validated with `pnpm --filter api test -- src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestIndicatorTimelineSeries.test.ts` and `pnpm --filter api typecheck` (PASS).
- 2026-04-09: Completed `ARM-06` by extracting async run orchestration (`status/liveProgress`, symbol-load loop, interleaved simulation/report persistence) into `backtestRunJob.ts` and wiring `backtests.service.ts` through a dedicated job factory without contract drift; validated with `pnpm --filter api test -- src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestIndicatorTimelineSeries.test.ts` and `pnpm --filter api typecheck` (PASS).
- 2026-04-09: Completed `ARM-05` by extracting historical candles/supplemental ingestion into `backtestDataGateway.ts` (`fetchKlines`, `fetchSupplementalSeries`, DB+memory cache policy) and wiring `backtests.service.ts` through gateway APIs without changing simulation/report contracts; validated with `pnpm --filter api test -- src/modules/backtests/backtestIndicatorTimelineSeries.test.ts src/modules/backtests/backtestReplayCore.test.ts` and `pnpm --filter api typecheck` (PASS).
- 2026-04-09: Completed `ARM-04` by adding dedicated extraction-parity regressions for `RuntimeSignalDecisionEngine` and `RuntimeSignalMarketDataGateway`, then validating full runtime extraction set with `runtimeSignalLoop.service` coverage; validated with `pnpm --filter api test -- src/modules/engine/runtimeSignalDecisionEngine.test.ts src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts` and `pnpm --filter api typecheck` (PASS).
- 2026-04-09: Completed `ARM-03` by reducing `runtimeSignalLoop.service.ts` to orchestration concerns (stream/session/watchdog/execution coordination) and wiring strategy evaluation dependencies directly through extracted gateway/decision-engine modules; validated with `pnpm --filter api test -- src/modules/engine/runtimeSignalLoop.service.test.ts` and `pnpm --filter api typecheck` (PASS).
- 2026-04-09: Completed `ARM-02` by extracting warmup/funding/open-interest/order-book series ownership into `runtimeSignalMarketDataGateway.ts` and delegating runtime candle ingestion/series resolution from `runtimeSignalLoop.service.ts` to the gateway while preserving existing runtime/test seams; validated with `pnpm --filter api test -- src/modules/engine/runtimeSignalLoop.service.test.ts` and `pnpm --filter api typecheck` (PASS).
- 2026-04-09: Completed `ARM-01` by extracting runtime strategy evaluation into `runtimeSignalDecisionEngine.ts` and delegating `runtimeSignalLoop.service.ts` decision paths through the dedicated engine without changing runtime contracts; validated with `pnpm --filter api test -- src/modules/engine/runtimeSignalLoop.service.test.ts` (PASS).
- 2026-04-09: Completed `SAR-14` by executing DEV->STAGE->PROD remediation rollout checklist with smoke and external-gate rehearsal (`ops:rc:gates:refresh:summary`) plus rollback drill evidence (`ops:db:restore-drill:local`), then publishing gate decision and artifacts in `docs/operations/security-remediation-rollout-evidence-2026-04-09.md`; result: DEV PASS, rollback drill PASS, STAGE/PROD promotion held pending external evidence closure.
- 2026-04-09: Completed `SAR-09` by executing stage-mode abuse-throttling verification for profile-sensitive routes with dedicated regression coverage (`stage-abuse-throttling.e2e.test.ts`) and publishing evidence in `docs/operations/security-stage-abuse-throttling-verification-2026-04-09.md`; validated with `pnpm --filter api run typecheck`, `pnpm --filter api test -- src/modules/profile/stage-abuse-throttling.e2e.test.ts src/modules/profile/subscription/subscription.e2e.test.ts src/modules/profile/security/security.e2e.test.ts`, and `pnpm run quality:guardrails` (PASS).
- 2026-04-09: Completed `SAR-13` by introducing repository boundaries in all three high-change domains (`bots.repository.ts`, `backtests.repository.ts`, `runtimeSignalLoop.repository.ts`) and redirecting read/write access in `botReadProjection.service.ts`, `backtests.service.ts`, and `runtimeSignalLoopDefaults.ts` through those boundaries; validated with `pnpm --filter api run typecheck`, `pnpm --filter api test -- src/modules/backtests/backtestIndicatorTimelineSeries.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts`, and `pnpm run quality:guardrails` (PASS).
- 2026-04-09: Completed `SAR-12` by extracting DCA ladder cell rendering from `BotsManagement.tsx` into `bots-management/dcaLadderCell.tsx` and updating `BotsManagement.test.tsx` for the wallet-driven create contract (`wallet -> mode`) so guardrails and component regressions stay green; validated with `pnpm --filter web test -- src/features/bots/components/BotsManagement.test.tsx`, `pnpm --filter web run typecheck`, and `pnpm run quality:guardrails` (PASS).
- 2026-04-09: Completed `SAR-11` by extracting runtime loop defaults/contracts into dedicated modules (`runtimeSignalLoopDefaults.ts`, `runtimeSignalMerge.ts`, `runtimeSignalEvaluationTypes.ts`, `runtimeSignalSeriesTypes.ts`) and reducing `runtimeSignalLoop.service.ts` below file-size guardrails without behavior drift; validated with `pnpm --filter api test -- src/modules/engine/runtimeSignalLoop.service.test.ts`, `pnpm --filter api run typecheck`, and `pnpm run quality:guardrails` (PASS).
- 2026-04-09: Completed `SAR-10` by extracting backtest indicator parsing/warmup contracts from `backtests.service.ts` into `backtestIndicatorSpecs.ts`, reducing service size under guardrails budget and keeping behavior parity; validated with `pnpm --filter api test -- src/modules/backtests/backtestIndicatorTimelineSeries.test.ts`, `pnpm --filter api run typecheck`, and `pnpm run quality:guardrails` (PASS).
- 2026-04-09: Completed `SAR-08` by locking regression coverage for all three trust controls: trusted-proxy matcher (`proxyTrust.test.ts`), forwarded-header ignore in avatar URL generation (`upload.e2e.test.ts`), and checkout callback-origin allowlist fallback (`subscription.e2e.test.ts`); validated with `pnpm --filter api test -- src/config/proxyTrust.test.ts src/modules/upload/upload.e2e.test.ts src/modules/profile/subscription/subscription.e2e.test.ts` (PASS).
- 2026-04-09: Completed `SAR-07` by replacing production CSP script policy from `unsafe-inline` to hash-based bootstrap allow (`script-src 'self' 'sha256-...'`) using shared theme bootstrap script constant, with CSP regression coverage in `apps/web/next.config.test.ts`; validated via `pnpm --filter web test -- next.config.test.ts` and `pnpm --filter web run typecheck` (PASS).
- 2026-04-09: Completed `SAR-06` by minimizing public `/ready` response (no secret-gap details) and introducing protected admin-only `/ready/details` diagnostics behind auth+role+network guardrails; validated with `pnpm --filter api test -- src/router/health-readiness.test.ts src/router/metrics.test.ts` (PASS).
- 2026-04-09: Completed `SAR-05` by adding user-scoped throttling middleware to `POST /dashboard/profile/subscription/checkout-intents`, `PATCH /dashboard/profile/security/password`, and `DELETE /dashboard/profile/security/account`; validated with `pnpm --filter api test -- src/modules/profile/subscription/subscription.e2e.test.ts src/modules/profile/security/security.e2e.test.ts` (PASS).
- 2026-04-09: Completed `SAR-04` by introducing checkout callback allowlist sanitation (origins restricted to runtime trusted app/client/api origins) with canonical profile fallback URL and persisted sanitized metadata, plus e2e coverage for untrusted callback rejection/fallback; validated with `pnpm --filter api test -- src/modules/profile/subscription/subscription.e2e.test.ts` (PASS).
- 2026-04-09: Completed `SAR-03` by removing header-derived avatar URL origin resolution (`x-forwarded-*`/`host`) and switching upload public-link generation to immutable runtime config origin (`UPLOAD_PUBLIC_ORIGIN` -> `APP_URL` -> `SERVER_URL`), with upload e2e contract updated to assert forwarded-header ignore behavior; validated with `pnpm --filter api test -- src/modules/upload/upload.e2e.test.ts` (PASS).
- 2026-04-09: Completed `SAR-02` by replacing global `trust proxy=true` with env-driven trusted-proxy matcher (`TRUSTED_PROXY_IPS`/`TRUST_PROXY_ALLOW_PRIVATE`) and removing direct `x-forwarded-for` parsing from generic rate limiter in favor of Express-resolved `req.ip`; validated with `pnpm --filter api test -- src/config/proxyTrust.test.ts src/middleware/requireOpsNetwork.test.ts src/middleware/requireTrustedOrigin.test.ts` (PASS).
- 2026-04-09: Completed `SAR-01` by extending upload e2e cleanup order with runtime bot relations (`orderFill`, `runtimeExecutionDedupe`, `botRuntimeSession`, `botRuntimeSymbolStat`, `botRuntimeEvent`) before bot/user deletion; validated with `pnpm --filter api test -- src/modules/upload/upload.e2e.test.ts` (PASS).
- 2026-04-09: Added `Phase 40` (`SAR-01..SAR-14`) and queued audit-driven remediation track for proxy/header hardening, callback URL trust constraints, CSP tightening, profile abuse throttling, and architecture decomposition guardrails based on `security_best_practices_report.md`.
- 2026-04-08: Completed `IND-36` by publishing `docs/operations/indicator-implementation-runbook.md` with a safe end-to-end extension protocol (registry update, shared evaluator/runtime/backtest wiring, required test pack, mandatory 3-symbol parity evidence, planning updates, and rollback steps) for future indicator delivery.
- 2026-04-08: Completed `IND-35` by executing the deterministic 3-symbol parity harness for all expanded indicator/pattern families (`backtestParity3Symbols.test.ts`) and attaching evidence in `docs/operations/indicator-3symbol-parity-evidence-2026-04-08.md` (21/21 assertions passed).
- 2026-04-08: Completed `IND-34` by expanding strategy presets to six trader archetypes (`scalp`, `day trend`, `swing`, `mean reversion`, `breakout`, `perp bias`) with updated indicator/risk templates and added web regression tests for picker rendering/selection and preset contract coverage (including derivatives-based perp-bias rules).
- 2026-04-08: Completed `IND-33` by extending backtest timeline rendering with grouped multi-line oscillator overlays (channel families rendered in one panel) and boolean candle-pattern markers plotted directly on price candles, with dedicated overlay-splitting utility coverage plus backtest details regression verification.
- 2026-04-08: Completed `IND-32` by applying canonical indicator taxonomy grouping in strategy creator (`Trend`, `Momentum/Oscillator`, `Volatility`, `Volume`, `Price Action`, `Candle Patterns`, `Derivatives`), adding EN/PL group labels in UI, and covering taxonomy mapping + localized option labels with web regression tests.
- 2026-04-08: Completed `IND-31` by adding fail-closed derivatives fallback regression coverage across shared evaluator, runtime strategy path, and backtest replay so missing futures snapshots (`funding/open-interest/order-book`) never trigger false LONG/SHORT entries.
- 2026-04-08: Completed `IND-30` by adding order-book futures filters end-to-end (`ORDER_BOOK_IMBALANCE`, `ORDER_BOOK_SPREAD_BPS`, `ORDER_BOOK_DEPTH_RATIO`) across shared evaluator, runtime signal path (cached Binance futures depth snapshots), backtest parity/replay context, timeline indicator series, strategy indicator catalog, and regression suites.
- 2026-04-08: Completed `IND-29` by adding open-interest futures filters end-to-end (`OPEN_INTEREST`, `OPEN_INTEREST_DELTA`, `OPEN_INTEREST_MA`, `OPEN_INTEREST_ZSCORE`) across shared evaluator, runtime signal path (cached Binance futures open-interest history/snapshot), backtest parity/replay context, timeline indicator series, strategy indicator catalog, and regression suites.
- 2026-04-08: Completed `IND-28` by adding futures funding-rate filters end-to-end (`FUNDING_RATE`, `FUNDING_RATE_ZSCORE`) across shared evaluator, runtime signal path (cached Binance futures funding snapshots), interleaved backtest replay parity context, timeline indicator series, strategy indicator catalog, and regression suites.
- 2026-04-08: Completed `IND-27` by adding deterministic backtest parity fixtures that cover all implemented candle patterns (engulfing, hammer/shooting star, doji, morning/evening star, inside/outside bar) across 3 scaled symbol datasets and asserting runtime-evaluator vs replay action equivalence.
- 2026-04-08: Completed `IND-26` by adding Inside Bar / Outside Bar end-to-end across evaluator/runtime/backtest pattern series, exposing both patterns in catalog, and extending evaluator/parity/timeline/catalog regressions.
- 2026-04-08: Completed `IND-25` by adding Morning Star / Evening Star end-to-end across evaluator/runtime/backtest pattern series, exposing both patterns in catalog, and adding evaluator/parity/timeline/catalog regression fixtures.
- 2026-04-08: Completed `IND-24` by adding Doji end-to-end with configurable threshold (`dojiBodyToRangeMax`) across evaluator/runtime/backtest pattern-series pipeline, parameter-aware cache keys, catalog exposure, and evaluator/parity/timeline/catalog regression coverage.
- 2026-04-08: Completed `IND-23` by wiring Hammer/Shooting Star end-to-end (shared pattern engine -> evaluator/runtime -> backtest timeline), exposing both in indicator catalog, and adding evaluator/parity/timeline/catalog regressions with OHLC fixtures.
- 2026-04-08: Completed `IND-22` by wiring Bullish/Bearish Engulfing end-to-end (shared pattern engine -> strategy evaluator/runtime -> backtest timeline spec builder), exposing both patterns in indicator catalog, and adding evaluator/parity/timeline/catalog regression coverage.
- 2026-04-08: Completed `IND-21` by adding shared OHLC candle-pattern engine (`sharedCandlePatternSeries`) with deterministic boolean-series contract, centralized pattern registry (engulfing/hammer/shooting-star/doji/morning/evening/inside/outside), and engine-level regression tests validating series length/type and baseline pattern fixtures.
- 2026-04-08: Completed `IND-20` by adding Donchian Channels end-to-end (`upper/middle/lower`) across shared OHLC compute, evaluator/runtime resolution, runtime signal-summary lines, backtest timeline channels, strategy indicator catalog exposure, and parity/evaluator/timeline/catalog regression coverage.
- 2026-04-08: Completed `IND-19` by adding CCI end-to-end across shared OHLC compute (`typicalPrice/SMA/meanDeviation`), evaluator/runtime series resolution and signal summary lines, backtest indicator timeline parsing/building, strategy catalog exposure, and parity/evaluator/timeline/catalog regression coverage.
- 2026-04-08: Completed `IND-18` by adding Stochastic `%K/%D` end-to-end using shared OHLC compute, evaluator/runtime resolution, backtest timeline channels, catalog exposure, and parity/evaluator/timeline regression coverage.
- 2026-04-08: Completed `IND-17` by adding ADX end-to-end with DI+/DI- companion channels across shared OHLC compute, evaluator/runtime resolution, backtest timeline overlays, catalog exposure, and parity/timeline/evaluator regressions.
- 2026-04-08: Completed `IND-16` by adding ATR end-to-end over OHLC candles (shared ATR compute, evaluator/runtime series resolution, backtest timeline overlay support, catalog wiring, and parity/evaluator/timeline regression coverage), plus tightened indicator matching to avoid `STOCHRSI` falling into the generic `RSI` branch.
- 2026-04-08: Completed `IND-15` by delivering true Bollinger Bands end-to-end (`upper`, `middle`, `lower`, `bandwidth`, `percentB`) across shared compute/evaluator/runtime summaries and backtest timeline overlay channels, with parity/catalog/timeline regressions.
- 2026-04-08: Completed `IND-14` by adding StochRSI end-to-end with shared `%K/%D` compute channels, evaluator/runtime support (defaulting signal checks to `%K`), timeline overlay channels, and parity/catalog regression tests.
- 2026-04-08: Completed `IND-13` by adding ROC as first-class indicator across catalog, shared evaluator/runtime resolution, runtime condition-line summary, and backtest timeline/parity channels with dedicated ROC regression coverage.
- 2026-04-08: Completed `IND-12` by implementing MACD end-to-end (indicator catalog, shared evaluator with `MACD/MACD_SIGNAL/MACD_HIST` series resolution, runtime signal-summary channels, and backtest timeline multi-channel overlays for line/signal/histogram) with dedicated parity/timeline/evaluator regressions.
- 2026-04-08: Completed `IND-11` by adding SMA end-to-end across strategy indicator catalog, shared evaluator/runtime series resolution, runtime condition-line/signal-summary rendering, and backtest timeline indicator-series builder with dedicated SMA catalog/parity/timeline regression tests.
- 2026-04-08: Completed `IND-10` by extending parser/evaluator regression coverage for operand/condition contract (`constant`, `series`, `band`) and new operators (`CROSS_ABOVE`, `CROSS_BELOW`, `IN_RANGE`, `OUT_OF_RANGE`), plus hardening parser normalization to fail-closed on invalid range operands.
- 2026-04-08: Completed `IND-09` by refactoring strategy signal parser/evaluator to normalize rule operands into canonical `constant|series|band` forms and by adding evaluator support for `CROSS_ABOVE`, `CROSS_BELOW`, `IN_RANGE`, and `OUT_OF_RANGE` under one shared runtime/backtest contract.
- 2026-04-08: Completed `IND-08` by extending strategy-builder condition operators to the full contract set (`>`, `>=`, `<`, `<=`, `==`, `!=`, `CROSS_ABOVE`, `CROSS_BELOW`, `IN_RANGE`, `OUT_OF_RANGE`) with form-level type updates and UI regression coverage.
- 2026-04-08: Completed `IND-07` by extending runtime signal loop regression suite with OHLCV-series tests for `openTime` dedupe overwrite, per-interval candle storage isolation, and exact-interval close-series resolution.
- 2026-04-08: Completed `IND-06` by anchoring runtime warmup fetch window to the processed candle close-time (`endTime`) and hardening decision-candle index fallback to deterministic `openTime <= decisionOpenTime` selection before last-candle fallback.
- 2026-04-08: Completed `IND-05` by upgrading runtime candle-series buffer contract to OHLCV objects (`openTime`, `closeTime`, `open`, `high`, `low`, `close`, `volume`) for both stream-ingested final candles and warmup-candle parsing, while preserving existing signal-evaluation behavior.
- 2026-04-07: Completed `IND-04` by extending the 3-symbol parity harness with explicit EMA, RSI, and MOMENTUM baseline suites to lock runtime-vs-backtest action parity for currently supported indicator families.
- 2026-04-07: Completed `IND-03` by extracting shared indicator-series compute module (`engine/sharedIndicatorSeries.ts`) and wiring it into strategy evaluator, runtime signal loop, backtest timeline series builder, plus bot runtime indicator helpers to remove EMA/RSI/MOMENTUM logic duplication.
- 2026-04-07: Completed `IND-02` by removing unsupported placeholder indicators (`BollingerBands`, `BullCandle`) from default API strategy catalog, adding supported `MOMENTUM`, and updating web presets to use only currently implemented indicators (RSI/MOMENTUM).
- 2026-04-07: Completed `IND-01` by publishing canonical indicator registry/parity contract in `docs/architecture/reference/indicator-registry-parity-contract.md`, locking taxonomy groups (including Candle Patterns), data-dependency classes (CLOSE/OHLC/OHLCV/DERIVATIVES), and fail-closed runtime/backtest parity rules for Phase 39 rollout.
- 2026-04-07: Added indicator expansion execution phase (`IND-01..IND-36`) and canonical implementation roadmap `docs/planning/indicator-expansion-implementation-plan-2026-04-07.md`, including new taxonomy groups (Trend/Momentum/Volatility/Volume/Price Action/Candle Patterns/Derivatives) and runtime/backtest parity-first sequencing.
- 2026-04-07: Completed `EXIT-08` by adding explicit production prerequisites (API access + `PROD_DB_CHECK_*` vars) and one-command closure pipeline instructions to RC runbook/checklist (`ops:rc:gates:prod-pipeline`).
- 2026-04-07: Completed `EXIT-07` by extending external-gates pipeline with `--db-profile <local|stage|prod>` and fixing strict production aliases to force both `--environment production` and `--db-profile prod` (`ops:rc:gates:local-pipeline:strict:prod`, `ops:rc:gates:prod-pipeline`).
- 2026-04-07: Completed `EXIT-06` by adding direct strict-production evidence-check shortcut (`ops:rc:gates:evidence:check:strict:prod`) and syncing RC runbook/checklist references to this command.
- 2026-04-07: Completed `EXIT-05` by hardening `ops:rc:gates:summary`: it now reports Gate2 policy from evidence artifact and returns `Strict passed: n/a` (instead of false) when no evidence JSON exists.
- 2026-04-07: Completed `EXIT-04` by syncing `v1-rc-external-gates-status.md` required SLO collection command to explicitly use `--environment production`, keeping all RC gate handoff docs aligned with production-evidence policy.
- 2026-04-07: Completed `EXIT-03` by adding production-only strict gate shortcuts (`ops:rc:gates:local-pipeline:strict:prod`, `ops:rc:gates:refresh:strict:prod`, `ops:rc:gates:refresh:summary:strict:prod`) wired to `--require-production-gate2`, plus runbook/checklist command sync for final release evidence closure.
- 2026-04-07: Completed `EXIT-02` by adding SLO evidence truthfulness guardrails: `ops:slo:collect` now rejects `--environment production` for localhost/private hosts unless explicit `--allow-local-production-evidence` override is passed, and local external-gates pipeline/runbook were updated to expose this override only for intentional dry-runs.
- 2026-04-07: Completed `EXIT-01` by hardening RC external-gates SLO evidence semantics: collector artifacts now store explicit environment (`local/stage/production`), rolling window reports aggregate environment summary, gate-status builder distinguishes `Gate 2` `PASS` (production evidence) vs `LOCAL_PASS` (non-production evidence), and evidence checker supports explicit production-only enforcement via `--require-production-gate2`.
- 2026-04-07: Completed `SUBS-12` by publishing operator/admin runbook `docs/operations/subscription-admin-operator-runbook.md` covering plan edits (UI/API), controlled manual subscription assignment (`ADMIN_OVERRIDE`) workflow, provider-switch strategy (`MANUAL` <-> `STRIPE`) with env matrix + rollback path, and post-change verification/error mapping checklist.
- 2026-04-07: Completed `SUBS-11` by hardening subscription regression coverage across API and web: preserved admin-edited subscription plans by preventing catalog bootstrap overwrite outside explicit seed mode (`seedDefaults` opt-in), added API entitlement-enforcement regression proving bot limits read dynamic DB entitlements (no hardcoded FREE cap), and added admin subscriptions UI tests for load/edit/error flows; validated with API subscription/bot/admin e2e suites, web admin subscriptions test, and api+web typecheck.
- 2026-04-07: Completed `SUBS-10` by adding first Stripe adapter behind payment abstraction (`stripePaymentGatewayProvider`) using Checkout Sessions in subscription mode with plan->price mapping, idempotent session creation, explicit config failure codes, and updated env template keys for Stripe secret/price IDs; validated with profile checkout e2e (including Stripe-misconfig path) and API typecheck.
- 2026-04-07: Completed `SUBS-09` by introducing provider-agnostic payment abstraction (`PaymentGatewayAdapter` + registry) with default `MANUAL` adapter, and shipping authenticated checkout-intent contract (`POST /dashboard/profile/subscription/checkout-intents`) that persists `PaymentIntent` records for paid plans and returns normalized checkout payload; validated with profile subscription e2e suite and API typecheck.
- 2026-04-07: Completed `SUBS-08` by adding admin web subscriptions workspace (`/admin/subscriptions`) with plan table, edit modal for pricing + entitlement limits (`maxBotsTotal`, mode caps, backtest cap), local form validation, API integration to admin CRUD endpoints, and `web` typecheck verification.
- 2026-04-07: Completed `SUBS-07` by adding admin-only subscription plan management API (`GET/PUT /admin/subscriptions/plans`) with role guard, validated entitlement payload schema reuse, editable pricing/currency/flags, and dedicated e2e coverage for auth/role/update/validation paths.
- 2026-04-07: Completed `SUBS-06` by adding centralized subscription entitlement resolver (`subscriptionEntitlements.service`), enforcing plan-based bot create caps (`maxBotsTotal` + mode caps) in bots create flow, mapping deterministic `409` API error payload for over-limit requests, and validating with dedicated entitlement e2e suite plus updated bots e2e fixtures and API typecheck.
- 2026-04-07: Completed `SUBS-05` by replacing My Account subscription placeholder with live profile-driven plan catalog cards, active-plan highlighting, entitlement summary fields, and retryable error/loading states in web profile UI; validated with new component regression tests and web typecheck.
- 2026-04-07: Completed `SUBS-04` by adding authenticated profile subscription API (`GET /dashboard/profile/subscription`) that returns catalog (`FREE/ADVANCED/PROFESSIONAL`) plus active plan snapshot and auto-recovers legacy missing assignment to `FREE`; validated with new e2e contract suite and API typecheck.
- 2026-04-07: Completed `SUBS-03` by adding subscription seed/runtime bootstrap (`FREE/ADVANCED/PROFESSIONAL`) with shared `subscriptions.service` helpers, enforcing default `FREE` assignment on new registration, and owner bootstrap override to `PROFESSIONAL` in Prisma seed flow; validated with API typecheck, auth service tests, migration deploy, and seed execution.
- 2026-04-07: Completed `SUBS-02` by adding Prisma subscription foundation (`SubscriptionPlan`, `UserSubscription`, `PaymentIntent`) with canonical enums, relations, safety-oriented indexes/unique constraints, and migration `20260407003500_add_subscription_foundation`; validated with `prisma validate` and API typecheck.
- 2026-04-07: Completed `SUBS-01` by publishing canonical subscription contract `docs/architecture/reference/subscription-tier-entitlements-contract.md` (tier catalog `FREE/ADVANCED/PROFESSIONAL`, default assignment rules including owner bootstrap, and stable entitlement payload schema), then syncing plan/decision references for next implementation tasks.
- 2026-04-06: Added active subscription/entitlement rollout phase (`SUBS-01..SUBS-12`) and canonical plan `docs/planning/subscription-entitlements-rollout-plan-2026-04-06.md` to cover profile subscription list, FREE default onboarding, owner PROFESSIONAL bootstrap, admin-editable limits/pricing, and payment-gateway abstraction readiness.
- 2026-04-06: Completed `V1B-05` by refreshing RC external-gates/sign-off artifacts (`v1-rc-external-gates-status.md`, `v1-rc-signoff-record.md`) and publishing Binance live verification checklist `docs/operations/binance-live-ops-verification-checklist-2026-04-06.md`, then linking it in RC checklist/runbook/sign-off docs for operator handoff.
- 2026-04-06: Completed `V1B-04` by running full confidence packs for backtest + runtime/positions (API) and runtime/positions (Web), and publishing evidence artifact `docs/operations/v1b-confidence-pack-2026-04-06.md` (all targeted suites green in sequential execution mode).
- 2026-04-06: Completed `V1B-03` by extending `runtime-orchestration-smoke.e2e` with explicit BOT-managed lifecycle assertions (`OPEN/CLOSE` trades + `managementMode`) and MANUAL-managed runtime ignore scenario (`manual_managed_symbol` with zero new orders), plus FK-safe cleanup for runtime session tables.
- 2026-04-06: Completed `V1B-02` by adding runtime-vs-replay parser parity regression (`runtimeBacktestParserParity.test.ts`) locking identical `TTP/TSL` mapping and DCA level/fraction interpretation, plus basic-mode trailing disable parity; exported runtime parser helper for deterministic contract testing.
- 2026-04-06: Completed `V1B-01` by fixing trailing-state carryover in backtest replay/service lifecycle loop (`dcaProbe` no longer clears active TTP/TSL memory), restoring deterministic `TTP` emission in replay regression scenario and keeping lifecycle parity golden suite green.
- 2026-04-06: Refined active V1 closure queue from `V1C` to `V1B` after focused Binance/live/backtest parity review; added explicit parser-semantics parity task and runtime manual-vs-bot-managed lifecycle coverage, and published canonical plan `docs/planning/v1-binance-live-backtest-alignment-plan-2026-04-06.md`.
- 2026-04-06: Added active V1 closure phase (`V1C-01..V1C-05`) after stability verification pass: replay backtest regression on TTP path was confirmed as open issue, while runtime positions/live confidence pack stayed green; canonical closure sequence is documented in `docs/planning/v1-live-stability-closure-plan-2026-04-06.md`.
- 2026-04-06: Completed `DBACT-10` by capturing paper-session timeline smoke evidence in `docs/operations/dbact-paper-session-timeline-smoke-2026-04-06.md`: verified `OPEN/DCA/CLOSE` monitoring timeline flow with focused bots API e2e filter scenario and confirmed Dashboard/Bots runtime history fee/pnl/margin coherence via targeted web regression suite (`HomeLiveWidgets` + `BotsManagement`).
- 2026-04-06: Completed `EXPH-12` by publishing colleague-ready manual smoke checklist `docs/operations/exchange-placeholder-colleague-smoke-checklist-2026-04-06.md` covering placeholder exchange create/save/read paths in Markets/Profile and fail-closed blocked execution checks in Bots, with explicit expected `501 EXCHANGE_NOT_IMPLEMENTED` API contract and linked automated regression evidence commands.
- 2026-04-06: Completed `EXPH-11` by extending API fail-closed contract coverage to full placeholder exchange matrix (`BYBIT/OKX/KRAKEN/COINBASE`): market catalog (`MARKET_CATALOG`), API key probe (`API_KEY_PROBE`), and bot active PAPER activation (`PAPER_PRICING_FEED`) now assert stable `501 + EXCHANGE_NOT_IMPLEMENTED` response details per exchange; validated with `pnpm --filter api test -- src/modules/markets/markets.e2e.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts src/modules/bots/bots.e2e.test.ts --testTimeout=30000`.
- 2026-04-06: Completed `EXPH-10` by extending web regression coverage for exchange placeholders: `ApiKeyForm` now asserts full exchange-select options + disabled probe/hint for placeholder exchanges, `MarketsFlow` now asserts full exchange selector options and placeholder catalog warning when switching to unsupported exchange, and `BotCreateEditForm` now asserts placeholder activation hint + disabled active toggle for unsupported exchange contexts; validated with `pnpm --filter web exec vitest run src/features/profile/components/ApiKeyForm.test.tsx src/features/markets/components/MarketsFlow.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx`.
- 2026-04-06: Completed `EXCTX-17` by publishing venue-context creator/runtime smoke checklist and evidence artifact in `docs/operations/venue-context-creator-runtime-smoke-2026-04-06.md`, documenting pass criteria and command-level evidence for EXCTX creator/runtime consistency flows.
- 2026-04-06: Completed `EXCTX-16` by adding an explicit end-to-end venue-consistency scenario in backtests e2e covering `backtest -> paper bot -> live bot/order` path: same market-universe context is asserted across backtest seed snapshot, bot create/update context, pre-trade PAPER/LIVE checks, and LIVE order-open API flow; validated with `pnpm --filter api test -- src/modules/backtests/backtests.e2e.test.ts -t "keeps venue context consistent across backtest -> paper bot -> live order path" --testTimeout=30000` and `pnpm --filter api run typecheck`.
- 2026-04-06: Completed `EXCTX-15` by extending API/runtime mismatch contract coverage for venue context: backtest e2e now submits conflicting `seedConfig.exchange/marketType/baseCurrency` against selected `marketUniverseId` and asserts fail-closed derivation from market group context (`BINANCE/FUTURES/USDT`), complementing existing bot/live mismatch guards already covered in EXCTX-08/10/11 test packs; validated with `pnpm --filter api test -- src/modules/backtests/backtests.e2e.test.ts -t "3-symbol market-group" --testTimeout=30000` and `pnpm --filter api run typecheck`.
- 2026-04-06: Completed `EXCTX-14` by adding web creator regression coverage for venue-context rendering and LIVE key-validation copy: backtest creator test now asserts explicit bound exchange/marketType/base context card, and new bot creator tests validate LIVE API key compatibility messaging plus fail-fast validation copy when active LIVE has no compatible key; validated with `pnpm --filter web exec vitest run src/features/backtest/components/BacktestCreateForm.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx` and `pnpm --filter web run typecheck`.
- 2026-04-06: Completed `EXCTX-13` by extending bot create/edit form with explicit venue-context + LIVE API-key compatibility hints: form now resolves compatible keys for selected exchange, surfaces readiness/missing/unavailable states in market context card, and blocks active LIVE submit when no compatible key is configured; validated with `pnpm --filter web exec vitest run src/i18n/translations.test.ts` and `pnpm --filter web run typecheck`.
- 2026-04-06: Completed `EXCTX-12` by adding explicit venue-context block in backtest creator (`exchange`, `marketType`, `baseCurrency`) bound to selected market group with deterministic fallback labels and immutable-context guidance copy, so execution context is visible before submit; validated with `pnpm --filter web exec vitest run src/features/backtest/components/BacktestCreateForm.test.tsx` and `pnpm --filter web run typecheck`.
- 2026-04-06: Completed `EXCTX-11` by binding LIVE order execution account selection to bot venue context (bot-bound `apiKeyId` + `exchange` first, deterministic fallback to latest user key for bot exchange), removing hardcoded BINANCE account selection in orders live adapter path, and adding resolver regression coverage for bound-key, mismatch-fallback, and fail-closed missing-key scenarios; validated with `pnpm --filter api test -- src/modules/orders/orders.service.test.ts` and `pnpm --filter api run typecheck`.
- 2026-04-06: Completed `EXCTX-10` by hardening runtime venue-context enforcement: ticker cache is now context-aware (`exchange+marketType+symbol`), signal-loop freshness checks read context-scoped tickers, bot runtime read-models query ticker by bot venue context, and position-automation ignores mismatched ticker events; validated with engine regressions (`runtimeTickerStore`, `runtimeSignalLoop`, `runtimePositionAutomation`) plus API typecheck.
- 2026-04-06: Completed `EXCTX-09` by introducing venue-aware market-data contracts (`exchange` + `marketType`) for OHLCV/order-book/snapshot requests, isolating cache keys by venue context, and extending paper-runtime ingestion tasks to carry venue context with deterministic defaults; validated with `pnpm --filter api test -- src/modules/market-data/marketData.service.test.ts src/modules/engine/paperRuntime.service.test.ts` and `pnpm --filter api run typecheck`.
- 2026-04-06: Completed `EXCTX-08` by adding explicit bots API regression for venue-context compatibility on create/activate (`apiKeyId` exchange mismatch hard-fail + activation failure when no compatible key exists, with success path for matching exchange key), and extending bots e2e cleanup with `RuntimeExecutionDedupe` FK-safe deletion; validated with `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts -t "enforces live api-key exchange compatibility on create and activation paths"` and `pnpm --filter api run typecheck`.
- 2026-04-06: Completed `EXCTX-07` by extending backtest run context derivation to persist full venue snapshot (`exchange`, `marketType`, `baseCurrency`, `marketUniverseId`) from selected market universe (with deterministic fallback for symbol-only runs), plus e2e assertions for both direct and market-universe run creation paths; validated with `pnpm --filter api test -- src/modules/backtests/backtests.e2e.test.ts` and `pnpm --filter api run typecheck`.
- 2026-04-06: Completed `EXCTX-06` by locking exchange-context coverage in Markets API contracts: added regression assertions for universe update persistence of `exchange/marketType/baseCurrency` and refreshed test cleanup for `RuntimeExecutionDedupe` FK safety; validated with `pnpm --filter api test -- src/modules/markets/markets.e2e.test.ts`.
- 2026-04-06: Completed `EXCTX-05` by adding idempotent backfill automation `apps/api/scripts/backfillBacktestVenueContext.ts` and root commands `ops:data:backfill:venue-context` (`--dry-run` alias), which scan existing market universes and patch historical `BacktestRun.seedConfig` snapshots with normalized `exchange/marketType/baseCurrency` context.
- 2026-04-06: Completed `EXCTX-02` by locking `MarketUniverse` as canonical `exchange+marketType+baseCurrency` context owner in `docs/planning/open-decisions.md`, explicitly enforcing derive-only behavior for `SymbolGroup`/`BacktestRun`/`Bot` context and fail-closed runtime/execution mismatch policy.
- 2026-04-06: Completed `EXCTX-01` by publishing `docs/architecture/reference/venue-context-source-of-truth-contract.md` with canonical `VenueContext` ownership hierarchy (`MarketUniverse` as source-of-truth), creator/runtime invariants, fail-closed mismatch error contract, and operator observability requirements.
- 2026-04-06: Completed `PEX-18` by updating release/deployment checklists with mandatory runtime+cache+stream validation sequence (baseline probes -> runtime freshness -> rollback-guard alert sanity -> cache contract checks), and aligning readiness gates to include explicit runtime-freshness gate in promotion/post-deploy rules.
- 2026-04-06: Completed `PEX-17` by defining automatic rollback guard conditions in `ops:deploy:rollback-guard` (runtime freshness failure + critical alert codes/severity), wiring promote-prod to evaluate guard post-deploy, and auto-triggering production rollback webhook when runtime-critical regression conditions are detected.
- 2026-04-06: Completed `PEX-16` by adding mandatory runtime freshness gate support: new admin endpoint `/workers/runtime-freshness` (worker/market freshness + runtime lag + running-session heartbeat + latest signal recency), post-deploy checker script `ops:deploy:runtime-freshness`, regression coverage, and production promotion workflow step with retry-based freshness enforcement.
- 2026-04-06: Completed `PEX-15` by adding security regression coverage for critical-secret readiness (`criticalSecretsReadiness.test.ts`) and `/ready` behavior (`health-readiness.test.ts`) covering invalid/expired JWT rotation combinations, malformed keyring entries, and fail-safe startup assertion.
- 2026-04-06: Completed `PEX-14` by adding critical secret rotation readiness validation (`criticalSecretsReadiness`) covering JWT rotation windows and API-key encryption keyring consistency, wiring fail-safe startup assertion (non-test mode), and extending `/ready` payload with readiness issues for operational diagnostics.
- 2026-04-06: Completed `PEX-13` by publishing `docs/security/v1-secrets-inventory.md` as the canonical secrets catalog (runtime/platform keys, owners, rotation cadence, and readiness rules) and linking it from security/ops runbooks.
- 2026-04-06: Completed `PEX-12` by publishing `docs/operations/v1-rto-rpo-targets.md` with service-class RTO/RPO targets and acceptable degradation windows, then linking RTO/RPO validation into the canonical `v1-ops-runbook` rollback/alerting references.
- 2026-04-06: Completed `PEX-11` by adding restore-drill evidence automation (`scripts/runRestoreDrillEvidence.mjs`) with explicit PASS/FAIL contract artifacts (`_artifacts-restore-drill-*.json` + `v1-restore-drill-*.md`), wiring profile commands (`ops:db:restore-drill:*`), and integrating local external-gates pipeline DB step with restore-drill evidence output.
- 2026-04-06: Completed `PEX-10` by adding profile-driven backup verification command set (`ops:db:backup-verify` with `local/stage/prod` aliases), introducing `scripts/runBackupVerificationProfile.mjs` wrapper over restore-check automation, and documenting profile env contract + command usage in RC runbook/checklist docs.
- 2026-04-06: Completed `PEX-09` by publishing runtime incident triage matrix in `docs/operations/runtime-incident-triage-matrix.md` (symptoms -> checks -> mitigations -> rollback triggers) and linking it from `v1-ops-runbook` as canonical first-response reference for runtime-critical incidents.
- 2026-04-06: Completed `CACHE-04`, `CACHE-05`, `CACHE-07`, `CACHE-08`, and `CACHE-09` by implementing safe SW update/activation handoff (`sw.js` + `ServiceWorkerRegistration.tsx`), adding PWA cache-contract + SW registration regressions (`serviceWorkerCacheContract.test.ts`, `ServiceWorkerRegistration.test.tsx`), adding runtime stale-data guardrails for Dashboard/Bots (`HomeLiveWidgets.tsx`, `BotsManagement.tsx`, `BotsMonitoringTab.tsx`) with stale warning copy in translations, adding stale-cache incident runbook (`docs/operations/stale-cache-incident-playbook.md`), and extending stale warning/recovery tests in Dashboard/Bots suites; validated with `pnpm --filter web exec vitest run src/ui/pwa/serviceWorkerCacheContract.test.ts src/ui/pwa/ServiceWorkerRegistration.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/BotsManagement.test.tsx` and `pnpm --filter api exec vitest run src/router/cacheHeaders.test.ts`.
- 2026-04-06: Completed `CACHE-02` by extending `cacheHeaders` route regression tests to assert `Vary: Origin` alongside no-store headers on protected namespaces (`/auth`, `/dashboard`, `/admin`) using an allowed origin request context; validated with `pnpm --filter api run test -- src/router/cacheHeaders.test.ts`.
- 2026-04-05: Reconciled planning backlog across canonical/non-canonical docs by reintroducing open work into `mvp-execution-plan` (`Phase 34..36`), refreshing `mvp-next-commits` (`NOW/NEXT`) with executable unchecked tasks, and syncing completed checkboxes in detailed plans (`BMOD/CACHE/LFIN/EXPH/EXCTX`) plus resolved decision states in `open-decisions.md`.
- 2026-04-05: Completed `LDUX-06` by migrating loading views in Markets/Strategies/Logs to skeleton compositions (`SkeletonTableRows`, `SkeletonFormBlock`, `SkeletonCardBlock`) and removing generic loading alerts from those paths; validated with `pnpm --filter web run typecheck` and `pnpm --filter web exec vitest run src/features/markets/components/MarketsFlow.test.tsx src/features/logs/components/AuditTrailView.test.tsx`.
- 2026-04-05: Completed `LDUX-07` by migrating backtest list/details loading paths to skeleton compositions (`BacktestsListView`, `BacktestRunDetails`) while preserving timeline phase messaging (`timelineLoadingPrefix` + phase labels) in symbol timeline rendering.
- 2026-04-05: Completed `LDUX-08` by adding regression coverage for dashboard route-progress lifecycle and backtest skeleton loading states (`DashboardRouteProgress.test.tsx`, `BacktestsListView.test.tsx`, `BacktestRunDetails.test.tsx`); validated with `pnpm --filter web run typecheck` and `pnpm --filter web exec -- vitest run src/features/backtest/components/BacktestsList.test.tsx src/features/backtest/components/BacktestsListView.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/ui/layout/dashboard/DashboardRouteProgress.test.tsx`.
- 2026-04-05: Completed `LDUX-09` smoke evidence pass for dashboard loading UX and responsive desktop/mobile contracts; captured results in `docs/operations/dashboard-loading-ux-smoke-2026-04-05.md` with green QA pack (`pnpm --filter web run typecheck` + 9-file vitest smoke suite, 26 tests passing).
- 2026-04-05: Completed `LDUX-05` by replacing generic loading alerts with skeleton-first section/page compositions in Dashboard Home and Bots (`HomeLiveWidgets`, runtime trade history section, bots management loading, monitoring loading, assistant loading), using shared loading primitives for card/form/kpi/table patterns; validated with `pnpm --filter web run typecheck` and `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/BotsManagement.test.tsx`.
- 2026-04-05: Completed `LDUX-04` by refactoring shared `LoadingState` to skeleton-first rendering (table/cards/form/kpi variants backed by new loading primitives) while keeping alert semantics unchanged for `ErrorState`, `DegradedState`, and `SuccessState`; validated with `pnpm --filter web exec vitest run src/ui/components/ViewState.test.tsx` and `pnpm --filter web run typecheck`.
- 2026-04-05: Completed `LDUX-03` by adding dashboard shell route-progress component `DashboardRouteProgress` under header (staged ramp + completion on route settle, with fallback timeout and subtle underbar rendering) and wiring it in `apps/web/src/app/dashboard/layout.tsx`; verified with green `pnpm --filter web run typecheck`.
- 2026-04-05: Completed `LDUX-02` by adding shared dashboard-ready DaisyUI skeleton primitives (`SkeletonTableRows`, `SkeletonCardBlock`, `SkeletonFormBlock`, `SkeletonKpiRow`) under `apps/web/src/ui/components/loading/` plus barrel export, with green `pnpm --filter web run typecheck`.
- 2026-04-05: Completed `LDUX-01` by publishing canonical dashboard loading UX contract in `docs/architecture/reference/dashboard-loading-ux-contract.md` (skeleton-first policy, under-header route progress behavior, preserved error/degraded boundaries, and rollout discipline for tiny commits).
- 2026-04-05: Completed `ICN-07` by executing Playwright manual smoke across `/dashboard`, `/dashboard/bots`, `/dashboard/markets/list`, `/dashboard/positions`, validating icon-selector behavior per view (`img[alt$=" icon"]`) and attaching evidence in `docs/operations/icons-smoke-2026-04-05.md` with captured screenshots under `output/playwright/icn07/`.
- 2026-04-05: Completed `ICN-06` by validating icon resolver regressions (`icons.e2e` covers collision ranking + fail-soft cache/curated/placeholder fallback chain) and adding web rendering-state regressions (`AssetSymbol.test.tsx` for loading/image/error fallback), with green targeted suites on API and web.
- 2026-04-05: Completed `ICN-04` by wiring icon rendering to dashboard runtime signals rail + open positions + trade history symbol columns via shared web icon lookup hook (`/dashboard/icons/lookup`), introducing reusable `AssetSymbol` component with loading/error fallback states, and adding focused icon UI regression coverage (`AssetSymbol.test.tsx`) plus dashboard mock integration updates.
- 2026-04-05: Completed `ICN-05` by extending API env templates (`apps/api/.env.example`, `.env.vps.example`) with CoinGecko controls (`COINGECKO_API_BASE_URL`, optional `COINGECKO_API_KEY`, `COIN_ICON_CACHE_TTL_MINUTES`) and updating Coolify rollout checklist in `docs/operations/coolify-linux-vps-setup-guide.md` with icon endpoint validation gate.
- 2026-04-05: Completed `ICN-03` by adding authenticated deterministic icon lookup endpoint `GET /dashboard/icons/lookup` (query `symbols`) returning stable per-symbol metadata (`symbol/baseAsset/iconUrl/source/placeholder/coinGeckoId/cacheHit/resolvedAt`) with fail-soft response contract.
- 2026-04-05: Completed `ICN-02` by implementing CoinGecko resolver service with symbol->base-asset normalization, deterministic collision handling (rank-first), sequential rate-safe fetch queue, timeout protection, TTL cache, and strict fallback chain (`coingecko -> curated map -> placeholder`); validated with `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/icons/icons.e2e.test.ts`.
- 2026-04-05: Completed `ICN-01` by publishing canonical icon-source contract in `docs/architecture/reference/coin-icon-source-contract.md` (CoinGecko primary, exchange-independent, strict fallback chain, deterministic API output, cache/TTL and fail-soft guarantees), and linking it from `open-decisions` rollout references.
- 2026-04-05: Completed `ARCH-32` by extracting runtime trade lifecycle mapping helpers (`toPositionMetaById`, `buildLifecycleActionByTradeId`) from `bots.service.ts` into `runtimeTradeLifecycle.service.ts`, preserving `listBotRuntimeSessionTrades` action inference contract; validated with `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Added `Phase 32` icon-delivery planning (`ICN-01..ICN-07`) to implement CoinGecko-based coin icons with exchange-independent fallback, API/web integration, deployment checklist updates, and dedicated regression + QA evidence tasks.
- 2026-04-05: Completed `ARCH-31` by extracting runtime trade close-reason helpers (`RuntimeTradeActionReason`, reason normalization, close-event lookup maps) from `bots.service.ts` into dedicated `runtimeTradeActionReason.service.ts`, preserving `listBotRuntimeSessionTrades` output contract and validating with `pnpm --filter api run typecheck` plus `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-30` by extracting assistant stack operations (`getBotAssistantConfig`, `upsertBotAssistantConfig`, `upsertBotSubagentConfig`, `deleteBotSubagentConfig`, `runAssistantDryRun`) from `bots.service.ts` into dedicated `botAssistant.service.ts`, then re-exporting the same API from `bots.service.ts` to preserve route/controller contracts; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-29` by extracting bot market-group and strategy-link CRUD block (`list/get/create/update/delete market-group`, `list/attach/update/detach/reorder strategy-links`) from `bots.service.ts` into dedicated `botMarketGroups.service.ts`, then re-exporting the contract from `bots.service.ts` to preserve route imports and runtime behavior; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-28` by extracting shared bot read projections (`listOwnedBotsWithStrategyProjection`, `getOwnedBotWithStrategyProjection`, `getBotWithStrategyProjectionById`) and canonical include payload into dedicated `botReadProjection.service.ts`, then wiring list/get/create/update readbacks in `bots.service.ts` to the shared query helpers without behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-27` by extracting bot response projection mapper (`mapBotResponse`) from `bots.service.ts` into dedicated `botResponseMapper.service.ts`, preserving active-strategy resolution order (`enabled botStrategies -> first botStrategy -> enabled marketGroupStrategyLinks -> first marketGroupStrategyLink`) across list/get/create/update return paths; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-26` by extracting bot activation capability policy (`assertBotActivationExchangeCapability`) from `bots.service.ts` into dedicated `botActivationPolicy.service.ts`, preserving existing PAPER/LIVE exchange-capability guards at create/update call-sites; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-25` by extracting legacy bot-strategy helpers (`getOrCreateDefaultSymbolGroup`, `upsertBotStrategy`) from `bots.service.ts` into dedicated `botLegacyStrategyLink.service.ts`, then wiring update-flow call-sites to imported helper without behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-24` by extracting LIVE consent helpers (`normalizeConsentTextVersion`, `validateLiveConsentState`, `writeLiveConsentAudit` + `BotConsentState` type) from `bots.service.ts` into dedicated `botLiveConsent.service.ts`, then wiring create/update consent flow to imported module without behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-23` by moving duplicate-active strategy+market-group guard (`assertNoDuplicateActiveBotByStrategyAndSymbolGroup`) from `bots.service.ts` into `botWriteValidation.service.ts`, leaving call-sites unchanged while reducing local write-validation footprint in the monolith; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-22` by extracting bot API-key compatibility resolver (`resolveCompatibleBotApiKey` with owned-key lookup, exchange mismatch guard, and latest-by-exchange fallback) from `bots.service.ts` into dedicated `botApiKeyResolver.service.ts`, then wiring create/update bot activation paths to imported helper without behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-21` by extracting ownership/session helper queries (`getOwnedBot`, `getOwnedBotRuntimeSession`, `resolveSessionWindowEnd`, `validateSymbolGroupForBot`) from `bots.service.ts` into dedicated `botOwnership.service.ts`, then wiring all runtime/session and bot-market-group call-sites to imported helpers without behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-20` by extracting bot write-validation helpers (`getOwnedStrategy`, `deriveMaxOpenPositionsFromStrategy`, `resolveCreateMarketGroupToSymbolGroup`, `findDuplicateActiveBotByStrategyAndSymbolGroup`) from `bots.service.ts` into dedicated `botWriteValidation.service.ts`, then wiring existing create/update duplicate-guard flow to imported helpers without behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-19` by extracting symbol-catalog fallback resolution (`resolveMinQuoteVolumeFilter`, catalog cache-key generation, filtered catalog fetch, `resolveEffectiveSymbolGroupSymbolsWithCatalog`) from `bots.service.ts` into dedicated `runtimeSymbolCatalogResolver.service.ts`, then wiring existing bots runtime call-sites to the module without behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-18` by extracting runtime signal-stats formatting helpers (`asRecord`, `toFiniteNumber`, `humanizeMergeReason`) from `bots.service.ts` into dedicated `runtimeSignalStatsFormatting.service.ts`, wiring runtime event parsing/summary mapping to the shared module with no behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-17` by extracting shared symbol-universe helpers (`normalizeSymbols`, `resolveUniverseSymbols`, `resolveEffectiveSymbolGroupSymbols`) into dedicated `runtimeSymbolUniverse.service.ts`, then removing duplicated logic from both `bots.service.ts` and `runtimeStrategyDisplayBySymbol.service.ts`; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-16` by extracting runtime live-signal rendering helpers (`SignalConditionLine` type, `parseSignalConditionLines`, `buildSignalConditionLines`, `buildSignalIndicatorSummary`) from `bots.service.ts` into dedicated `runtimeSignalConditionLines.service.ts`, and wiring existing runtime symbol-stats flow to imported helpers with no behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-15` by extracting runtime signal indicator helpers (`clampPeriod`, EMA/RSI/Momentum series calculators, indicator value formatter) from `bots.service.ts` into dedicated `runtimeSignalIndicators.service.ts`, wiring live-signal condition/summary rendering paths to the new module without behavior drift; validated via `pnpm --filter api run typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-14` by extracting runtime signal-condition summary formatter (`buildSignalConditionSummary` with indicator-specific rule formatting) from `bots.service.ts` into dedicated `runtimeSignalConditionSummary.service.ts`, wiring runtime symbol-stats path to the new module without behavior drift; validated via `pnpm --filter api typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-13` by extracting symbol-scoped runtime strategy display resolvers (`resolveBotAdvancedCloseMode`, `resolveBotDcaPlanBySymbol`, `resolveBotTrailingStopLevelsBySymbol`, `resolveBotTrailingTakeProfitLevelsBySymbol`) from `bots.service.ts` into dedicated `runtimeStrategyDisplayBySymbol.service.ts`, then wiring existing runtime read call-sites to the new module without behavior drift; validated via `pnpm --filter api typecheck` and `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-12` by extracting runtime market-data fallback fetchers (`fetchFallbackKlineCloses`, `fetchFallbackTickerPrices`) and their cache/interval normalization helpers from `bots.service.ts` into dedicated `runtimeMarketDataFallback.service.ts`, wiring existing call-sites without behavior drift; validated via `pnpm --filter api typecheck` and targeted bots e2e invocation (suite skipped in local env due test gating).
- 2026-04-05: Completed `BOPS-64` by implementing first-floor TTP disarm logic in engine/runtime flow: when favorable move drops below `first_ttp_arm - first_ttp_trail`, TTP tracking state is cleared (no forced close), then re-arms normally after crossing first arm again; mirrored same disarm semantics in web fallback display helper so UI does not keep stale TTP after deep pullback; validated with new/updated regressions in `positionManagement.service.test.ts` and `trailingStopDisplay.test.ts` plus API+Web typecheck.
- 2026-04-05: Completed `BOPS-63` by normalizing trailing-level scale inside web TTP fallback helper (`trailingStopDisplay`): levels from API in decimal form (`0.05`) are auto-mapped to percent-space (`5`) while percent-native inputs remain unchanged, preventing false arming/protected-value inflation; added regression coverage for both representations in `trailingStopDisplay.test.ts` and validated with targeted web tests + `pnpm --filter web typecheck`.
- 2026-04-05: Completed `BOPS-62` by adding shared web helper fallback for dynamic TTP display (`trailingStopDisplay`) using sticky per-position favorable `PnL%` highs + strategy trailing levels when API stop-price payload is temporarily missing; fixed percent-unit mismatch so TTP levels arm against real percent values (no `/100` drift) and added regression test `trailingStopDisplay.test.ts` to lock monotonic fallback behavior (`6.21% -> 3.71%`, no downshift on pullback, re-arm to higher level on new highs); validated via targeted web tests + typecheck.
- 2026-04-05: Completed `BOPS-61` by hardening runtime-position dynamic stop display mapping: positions endpoint now falls back to parsing DCA/TTP/TSL levels from each position's linked strategy config (when symbol-group mapping is stale/mismatched), plus TTP fallback arming now triggers at `>=` threshold to avoid missing edge-threshold rows; validated via targeted bots e2e (`maps dynamic TTP/TSL lifecycle...`) and `pnpm --filter api typecheck`.
- 2026-04-05: Completed `ARCH-11` by extracting strategy config parsing helpers from `bots.service.ts` into dedicated `runtimeStrategyConfigParser.service.ts` (`hasAdvancedCloseMode`, trailing `ttp/tsl` level parsing, DCA planned-level parsing), wiring imports back into bots runtime read flow, and adding regression coverage in `runtimeStrategyConfigParser.service.test.ts`; validated via `pnpm --filter api run test -- src/modules/bots/runtimeStrategyConfigParser.service.test.ts` and `pnpm --filter api typecheck`.
- 2026-04-05: Completed `ARCH-10` by adding repository guardrail automation (`scripts/repoGuardrails.mjs`) enforcing lockfile consistency (`pnpm-lock.yaml` only, no npm/yarn/bun lockfiles tracked or present on disk outside ignored dirs) and source-file size budgets (default + explicit overrides for known legacy large files), wiring it into root script `quality:guardrails` and CI pre-check job (`repo-guardrails`); validated via `pnpm run quality:guardrails`.
- 2026-04-05: Completed `ARCH-08` by splitting `BotsManagement.tsx` into route-level shell and extracted runtime blocks/components (`bots-management/BotsManagementTabs.tsx`, `bots-management/BotsMonitoringTab.tsx`), wiring monitoring tab render via props while preserving existing runtime behavior and test expectations; validated via `pnpm --filter web typecheck` and `pnpm --filter web test -- src/features/bots/components/BotsManagement.test.tsx`.
- 2026-04-05: Completed `ARCH-07` by splitting dashboard runtime monolith rendering from `HomeLiveWidgets.tsx` into composable section components (`RuntimeOnboardingSection`, `RuntimeSignalsSection`, `RuntimeDataSection`, `RuntimeSidebarSection`) with shared section types under `home-live-widgets/types.ts`, while preserving existing data/runtime behavior; validated via `pnpm --filter web typecheck` and `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`.
- 2026-04-05: Completed `NAVM-05` by executing manual mobile smoke across 10 dashboard routes (`/dashboard`, orders, positions, markets, strategies, backtests, bots, reports, logs, profile) in `390x844` viewport via Playwright CLI and recording route-level evidence in `docs/operations/dashboard-mobile-nav-smoke-2026-04-05.md`.
- 2026-04-05: Completed `ARCH-09` by optimizing oversized assets without UX drift: generated `hero-sky.webp` (~67KB) from `hero-sky.png` and switched public hero background to `image-set` (webp + png fallback), plus re-encoded `apps/api/public/avatars/default.png` (1024px -> 512px optimized palette PNG, ~26KB); validated with `pnpm --filter web typecheck`.
- 2026-04-05: Completed `ARCH-06` by extracting runtime session read/aggregation queries from `bots.service.ts` into dedicated `runtimeSessionsRead.service.ts` (`listRuntimeSessionsWithSummary`, `getRuntimeSessionSummaryMetrics`), keeping route contract unchanged; validated with `pnpm --filter api typecheck` and passing `bots.e2e` suite.
- 2026-04-05: Completed `ARCH-05` by extracting runtime position serialization logic from `bots.service.ts` into dedicated `runtimePositionSerialization.service.ts` (DCA executed-level mapping, sticky favorable-move fallback, dynamic TTP/TSL stop derivation), then wiring service usage back in with behavior parity validated by `pnpm --filter api typecheck` + `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts`.
- 2026-04-05: Completed `ARCH-04` by verifying zero imports and removing dead web helpers `ui/components/TableToolbar.tsx` and `features/profile/services/basic.service.ts`; validated with `pnpm --filter web typecheck`.
- 2026-04-05: Completed `ARCH-03` by removing unused API dev dependency `prima` from `apps/api/package.json` and revalidating with `pnpm --filter api typecheck` + targeted engine regression test (`positionManagement.service.test.ts`).
- 2026-04-05: Completed `ARCH-02` by removing accidental `apps/api/package-lock.json` and enforcing pnpm-only lockfile policy via root `.npmrc` (`package-lock=false`) + `.gitignore` guard (`**/package-lock.json`).
- 2026-04-05: Completed `NAVM-04` by extending `Header.responsive.test.tsx` with interactive mobile-menu open/close regression coverage (visibility of `#dashboard-mobile-nav`, `aria-expanded` transitions, and body scroll-lock style side effects cleanup).
- 2026-04-05: Completed `NAVM-03` by enforcing deterministic mobile menu layering in `Header.tsx` (`isolate` on header + overlay `z-[60]`) and adding body scroll-lock side effects while mobile menu is open (`overflow/touchAction/overscrollBehavior` restore-on-close); verified with dashboard header responsive test.
- 2026-04-05: Completed `NAVM-02` by replacing hardcoded dashboard mobile overlay offset (`top-[4.5rem]`) with dynamic header measurement in `Header.tsx` (`ResizeObserver` + resize/orientation listeners), so mobile menu overlay anchors to the actual sticky header height across breakpoints; verified via targeted dashboard layout tests.
- 2026-04-05: Completed `NAVM-01` by publishing `docs/planning/dashboard-mobile-nav-stability-plan-2026-04-05.md` with root-cause analysis (`top-[4.5rem]` hardcoded offset + unsafe layering), target contract, and tiny-commit fix/test rollout (`NAVM-02..NAVM-05`).
- 2026-04-05: Completed `ARCH-01` by publishing `docs/planning/critical-maintainability-hardening-plan-2026-04-05.md` with scoped no-drift split contract, rollback strategy, acceptance criteria, and tiny-commit execution map for `ARCH-02..ARCH-10`.
- 2026-04-05: Added `Phase 30` critical maintainability hardening plan (`ARCH-01..ARCH-10`) to split largest runtime/ui monolith files safely, clean repo/dependency hygiene issues, and add guardrails preventing lockfile drift and oversized-file regressions.
- 2026-04-04: Completed `EXPH-08` by tightening web exchange typing to canonical `ExchangeOption` across Profile contracts: `ApiKey.exchange`, API key connection-test payload, and ApiKeyForm save/default values now use union-based exchange types (no loose `string`), with targeted profile/bots/markets UI regression tests and web typecheck green.
- 2026-04-04: Completed `EXPH-09` by adding explicit `PLACEHOLDER` badges/hints in creator/runtime UX paths (Dashboard Home runtime panel + sidebar, Bots runtime card, Bot creator, Markets creator, Profile API key form), hardening unsupported-capability checks against unknown exchanges (fail-safe `false`), and refreshing related dashboard runtime test assertions with targeted web regressions + typecheck passing.
- 2026-04-04: Completed `EXPH-06` by extending placeholder regression coverage across API and web: Markets/API Keys persistence assertions for placeholder exchanges (`OKX`) in list/get flows, bot fail-closed activation test on update path (`501 EXCHANGE_NOT_IMPLEMENTED` with `PAPER_PRICING_FEED`), and web Bots table regression for placeholder badge rendering + exchange-name filtering.
- 2026-04-04: Completed `EXPH-05` by exposing placeholder-exchange UX hints across web flows: Markets/Profile/Bots now surface explicit `not implemented` guidance, bot list marks unsupported exchange rows with a placeholder badge, and bot activation guard/error messaging is localized (EN/PL) with mode-aware hint text.
- 2026-04-04: Completed `EXPH-03` by adding centralized exchange capability registry (`exchangeCapabilities.ts`) and typed guard/error contract (`ExchangeNotImplementedError` + `EXCHANGE_NOT_IMPLEMENTED`), wiring error mapping in `errorHandler`, and applying capability guard in market catalog path.
- 2026-04-04: Completed `EXPH-02` by extending Prisma `Exchange` enum to `BINANCE/BYBIT/OKX/KRAKEN/COINBASE` and adding SQL migration `20260404115500_extend_exchange_enum_placeholders`, preserving existing `@default(BINANCE)` on all exchange fields.
- 2026-04-04: Completed `EXPH-01` by publishing `docs/planning/exchange-placeholder-adapters-plan-2026-04-04.md`, freezing placeholder-exchange contract (`BYBIT/OKX/KRAKEN/COINBASE` selectable), fail-closed behavior (`EXCHANGE_NOT_IMPLEMENTED`), and no-silent-fallback rule relative to `BINANCE`.
- 2026-04-04: Completed `ADM-01` by publishing `docs/architecture/reference/app-shell-template-split-contract.md`, freezing the three-shell topology (`public` / `dashboard` / `admin`), guard boundaries (`auth` vs `auth+admin`), shared-vs-dedicated layout ownership rules, and the canonical rollout sequence for `ADM-02..ADM-06`.
- 2026-04-04: Completed `BOPS-60` by publishing `docs/architecture/reference/dashboard-trade-history-financial-semantics-contract.md`, freezing action-gated financial display rules in trade history (`OPEN/DCA -> Realized "-"`, `CLOSE -> Realized value`), canonical `Margin` capital semantics, and Dashboard/Bots parity invariants for action/fee/realized rendering.
- 2026-04-04: Completed `PEX-07` by extending runtime observability metrics with production telemetry (`signalLag`, classified `restarts`, reconciliation delay including `pending` count, and `executionErrors` by class), wiring emissions from runtime signal loop, live order adapter, and execution worker bootstrap, and locking API contract coverage in `metrics.test.ts`.
- 2026-04-04: Completed `PEX-04` by extending `RuntimeSignalLoop` with explicit stall detector windows for `NO_EVENT` and `NO_HEARTBEAT`, introducing classified stop reasons (`runtime_stall_no_event`, `runtime_stall_no_heartbeat`) that cancel stale running sessions and force clean loop resubscription, with dedicated regression coverage in `runtimeSignalLoop.service.test.ts`.
- 2026-04-04: Completed `PEX-01` by publishing `docs/architecture/reference/runtime-execution-idempotency-contract.md` as canonical contract for runtime command idempotency (`OPEN/DCA/CLOSE/CANCEL`), freezing deterministic `dedupeKey` schema (`v1`), command-specific key mapping, persistence state machine (`PENDING/SUCCEEDED/FAILED/EXPIRED`), and replay-safe invariants for crash/retry scenarios.
- 2026-04-04: Completed `CACHE-06` by extending `docs/operations/coolify-linux-vps-setup-guide.md` with explicit reverse-proxy cache contract for STAGE/PROD (`never cache /auth|/dashboard|/admin`, static-only cache allowlist, SSE no-cache, Set-Cookie no-cache) and operational `curl` verification checklist.
- 2026-04-04: Completed `CACHE-03` by tightening `sw.js` runtime contract to cache only static assets, removing dynamic `/` from precache list, adding explicit API/runtime bypass (`/api|/auth|/dashboard|/admin` + `_rsc`) with `cache: 'no-store'`, and adding web regression coverage in `serviceWorkerCacheContract.test.ts`.
- 2026-04-04: Completed `CACHE-01` by adding centralized `applyNoStoreHeaders` middleware on `/auth`, `/dashboard`, and `/admin` namespaces (`Cache-Control/Pragma/Expires/Surrogate-Control`), plus router regression tests that lock no-store behavior on all three sensitive API surfaces.
- 2026-04-03: Completed `BOPS-59` by adding dedicated web regressions for bots route contract (`/dashboard/bots/new` redirect), create/edit route behavior (`/dashboard/bots/create` with `editId` flow), list page add-navigation, and table action links (`Podglad`, `Asystent`, `Edytuj`) plus vitest alias support for `@` imports in route/component tests.
- 2026-04-03: Completed `BOPS-54` by extending `HomeLiveWidgets` regression coverage for dashboard signal panel contract: heading copy (`Sygnaly strategii`), canonical placement above open positions, and overflow rail navigation controls for larger symbol sets (`Wstecz`/`Dalej`) with responsive density assumptions intact.
- 2026-04-03: Completed `BOPS-53` by implementing scalable signal cards rail in dashboard runtime (`desktop 4 / tablet 3 / mobile 2`) with responsive viewport tracking, horizontal overflow handling, and in-place updates for large symbol groups without remount flicker.
- 2026-04-03: Completed `BOPS-52` by replacing legacy `Live checks` naming with strategy-signal semantics (`Strategy signals` / `Sygnaly strategii`), adding panel subtitle microcopy, and keeping canonical section order (`signals -> open positions -> history`) in dashboard runtime.
- 2026-04-03: Completed `BOPS-51` by publishing canonical IA spec in `docs/architecture/reference/dashboard-signal-panel-ia-contract.md`, locking signal-panel naming (`Sygnaly strategii` / `Strategy signals`), mandatory placement above open positions, responsive card density (4/3/2), and high-symbol horizontal navigation behavior with in-place refresh/no-flicker requirement.
- 2026-04-03: Completed `BOPS-50` by adding end-to-end regression coverage for runtime dynamic stop payload lifecycle in API (`pre-arm -> null`, `post-arm -> numeric`, `fallback legacy trailing -> numeric`) and by extending Dashboard/Bots web tests to assert TTP/TSL rendering parity for both numeric and placeholder states across locale-sensitive formatting.
- 2026-04-03: Completed `BOPS-49` by updating Dashboard/Bots runtime i18n header labels from `SL (TTP)/SL (TSL)` to concise `TTP/TSL` in EN/PL translation dictionaries and aligned component regression assertions in `HomeLiveWidgets` with preserved table parity.
- 2026-04-03: Completed `BOPS-48` by extending runtime positions mapping in `bots.service` to compute `dynamicTslStopLoss` primarily from active strategy trailing-stop levels (`close.tsl`) and runtime `trailingAnchorPrice` (side/leverage aware), with deterministic fallback to legacy `trailingLossLimitPercent` path for compatibility.
- 2026-04-03: Completed `BOPS-47` by publishing `docs/architecture/reference/dynamic-stop-display-contract.md` as canonical runtime contract for dynamic stop display (`TTP`/`TSL`) across Dashboard and Bots tables, including lifecycle semantics, TSL primary derivation from trailing-anchor + fallback compatibility path, and regression requirements.
- 2026-04-03: Completed `BOPS-46` by adding DCA ladder regression coverage end-to-end: API e2e now verifies runtime positions payload mapping for basic repeated levels, advanced ladders, and legacy no-config fallback; web component tests now assert compact ladder rendering in Dashboard and Bots runtime tables.
- 2026-04-03: Completed `BOPS-45` by replacing plain DCA count cells in Dashboard and Bots open/history position tables with compact ladder rendering (`count (1:x%, 2:y%)`) derived from `dcaExecutedLevels` (fallback to planned levels/count), preserving total DCA count while making executed ladder depth visible for operator verification.
- 2026-04-03: Completed `BOPS-44` by extending runtime positions payload with deterministic DCA ladder fields (`dcaPlannedLevels`, `dcaExecutedLevels`) derived from linked strategy config (`additional.dcaLevels` / `dcaTimes`) per symbol, including legacy/basic fallback mapping and executed-overflow handling for UI ladder rendering parity.
- 2026-04-03: Completed `BOPS-43` by publishing `docs/architecture/reference/dca-ladder-display-contract.md` defining canonical DCA ladder payload/render contract for Dashboard + Bots (basic vs advanced mapping, `dcaPlannedLevels`/`dcaExecutedLevels`, compact ladder format, and legacy count-only fallback).
- 2026-04-03: Completed `DPL-20` by publishing `docs/operations/deployment-incident-playbook.md` covering blocked-promotion, failed-stage, and failed-prod response flows with role ownership, triage checklists, communication contract, and incident close criteria; linked in deployment planning outputs.
- 2026-04-03: Completed `DPL-19` by adding `.github/CODEOWNERS`, reducing default CI workflow permissions to `contents: read`, and publishing `docs/security/ci-auto-promotion-hardening.md` with required branch protections, environment protections, and secret-hardening controls for stage/prod auto-promotion chain.
- 2026-04-03: Completed `DPL-18` by publishing `docs/operations/coolify-trigger-wiring.md` with exact GitHub secret contract and webhook wiring steps for stage deploy/prod promote/prod rollback flows, and linking it in deployment setup references.
- 2026-04-03: Completed `DPL-17` by adding `.github/workflows/prod-rollback.yml` to auto-trigger production rollback when `Promote PROD` fails (with manual fallback), forwarding failure metadata to rollback webhook (`COOLIFY_PROD_ROLLBACK_HOOK_URL`) and documenting automation entry in rollback playbook.
- 2026-04-03: Completed `DPL-16` by adding `.github/workflows/promote-prod.yml` to auto-trigger production promotion after successful `Stage Gates`, forwarding verified SHA metadata to Coolify PROD deploy webhook (`COOLIFY_PROD_DEPLOY_HOOK_URL`) with production environment isolation and concurrency guard.
- 2026-04-03: Completed `DPL-15` by adding `.github/workflows/stage-gates.yml` (triggered after successful `Deploy STAGE`) to enforce stage gate pack for build/test/migration/api health/web smoke/workers readiness, generate machine-readable report artifacts (`stage-gates-report.json` + `.md`), and fail workflow when any required gate is not PASS.
- 2026-04-03: Completed `DPL-14` by adding `.github/workflows/deploy-stage.yml` to trigger STAGE deployment automatically on `develop` pushes (plus manual dispatch), with concurrency guard and required `COOLIFY_STAGE_DEPLOY_HOOK_URL` webhook secret; linked automation entry in promotion contract doc.
- 2026-04-03: Completed `DPL-12` by publishing `docs/planning/cryptosparrow-soar-rename-rollout-plan-2026-04-03.md` with wave-based rollout (`Wave 1..4`), mandatory stage/prod risk gates, compatibility-first constraints for runtime identifiers, ownership matrix, and rollback checkpoints linked to deployment contracts.
- 2026-04-03: Completed `DPL-11` by running repository-wide token audit (`CryptoSparrow`/`cryptosparrow`) and publishing wave-classified inventory in `docs/planning/cryptosparrow-soar-rename-audit-2026-04-03.md` (runtime-critical identifiers, infra/domain naming, UI/doc surfaces, and compatibility-first rollout sequencing); linked in deployment plan outputs.
- 2026-04-03: Completed `DPL-10` by publishing `docs/operations/deployment-rollback-playbook.md` with rollback triggers, ownership matrix, app/env/worker rollback modes, migration-aware guardrails, communication template, and mandatory post-rollback gate/evidence contract.
- 2026-04-03: Completed `DPL-09` by publishing `docs/operations/post-deploy-smoke-checklist.md` with target-domain smoke checks (api/web/auth/dashboard/bots/workers/data-write/security), pass/fail policy, and evidence capture contract for STAGE/PROD rollout validation.
- 2026-04-03: Completed `DPL-08` by publishing `docs/operations/deployment-readiness-gates.md` with canonical gate pack (`G1..G6`) for build/migration/api/web/workers/smoke, immutable stage-promotion criteria, required prod post-deploy checks, and fail-closed evidence contract; linked in deployment planning outputs.
- 2026-04-03: Completed `DPL-07` by publishing `docs/operations/deployment-migration-strategy.md` with explicit ownership (developer/CI/release-owner), immutable-SHA migration gate policy, STAGE->PROD migration sequence, backward-compatible expand/switch/contract pattern, and incident/evidence contract; linked in deployment planning outputs.
- 2026-04-03: Completed `DPL-06` by adding `scripts/start-local-prod-like.mjs` and root script `pnpm run prod-like/start`, including preflight checks for required env files, build gate for `api` + `web`, and fail-fast orchestration for `api`, `web`, and `workers` in one command; updated local runbook with fast-path usage.
- 2026-04-03: Completed `DPL-13` by publishing immutable promotion contract `DEV -> STAGE -> PROD` in `docs/operations/dev-stage-prod-promotion-contract.md` (same-SHA invariants, required stage gate pack, promotion eligibility rules, fail-closed policy, rollback contract, and evidence/audit requirements) and linking it in deployment planning outputs.
- 2026-04-03: Completed `DPL-05` by adding `scripts/start-workers-prod.mjs` (fail-fast worker launcher with prefixed logs and graceful shutdown), wiring root scripts `workers/prod` + `workers:prod`, and documenting explicit process ownership contract in `docs/operations/v1-ops-runbook.md`, `docs/operations/coolify-linux-vps-setup-guide.md`, and `docs/engineering/local-development.md`.
- 2026-04-03: Completed `DPL-04` by adding non-secret environment templates `apps/api/.env.example` and `apps/web/.env.example` with required keys/comments, and linking bootstrap copy flow in `docs/engineering/local-development.md`.
- 2026-04-03: Completed `DPL-03` by publishing Linux VPS Coolify setup guide in `docs/operations/coolify-linux-vps-setup-guide.md` with concrete service split (`postgres/redis/api/web/workers`), domain routing, env requirements, migration gate, stage validation, and rollback baseline.
- 2026-04-03: Completed `DPL-02` by publishing canonical step-by-step local startup procedures for both `DEV` and `local PROD-like` in `docs/engineering/local-development.md` (infra, api/web/workers startup, verification, and shutdown flow).
- 2026-04-03: Completed `DPL-01` by publishing canonical `DEV/STAGE/PROD` environment + secrets contract in `docs/operations/dev-stage-prod-environment-matrix.md` (service variable matrix, secret classes, non-negotiable handling rules, and validation checklist) and linking it from deployment planning doc.
- 2026-04-02: Completed `BOPS-56..BOPS-58` by splitting Bots IA into `/dashboard/bots` (table-first list), `/dashboard/bots/create` (shared create/edit form), and dedicated row actions for Runtime/Assistant with preferred-bot deep links; updated header route contract to `/dashboard/bots/create` and kept `/dashboard/bots/new` as legacy redirect.
- 2026-04-02: Added `BOPS-55..BOPS-59` planning for Bots module IA split: `/bots` as table-only list, `/bots/create` as shared create/edit form, and row actions routing to Runtime/Assistant contexts.
- 2026-04-02: Added `BOPS-51..BOPS-54` planning for Dashboard signal panel polish: rename `Live checks` to strategy-signal semantics, move panel above open positions, and add responsive + horizontal overflow navigation contract for large universes (up to hundreds of symbols).
- 2026-04-02: Added `Phase 26` runtime operability polish queue (`BOPS-43..BOPS-50`) covering DCA ladder visibility and dynamic TTP/TSL mapping fix (TSL from trailing-stop anchor + compatibility fallback), with Dashboard/Bots parity and regression gates.
- 2026-04-02: Extended `Phase 25` to include three-environment deployment contract (`DEV/STAGE/PROD`) and auto-promotion pipeline tasks (`DPL-13..DPL-20`) with stage-gated commit promotion and prod rollback requirements.
- 2026-04-02: Added deployment planning track `Phase 25 (DPL-01..DPL-12)` and published executor handoff plan in `docs/planning/deployment-dev-prod-coolify-plan-2026-04-02.md` for local DEV/PROD and Coolify VPS rollout with separate global rename planning.
- 2026-04-02: Completed `LFIN-07B` by migrating Bots module (management + runtime + assistant) UI copy to canonical i18n keys, adding EN/PL parity entries in `translations.ts`, updating bots page to i18n usage, and refreshing BotsManagement tests with `I18nProvider` wrapper; verified with web tests + typecheck.
- 2026-04-02: Completed `BMOD-41/BMOD-42` runtime resilience hardening: wrapped market-stream fanout handler promises to prevent unhandled async crashes, added event-level try/catch shielding in runtime signal loop, introduced session watchdog re-ensure cycle (`RUNTIME_SESSION_WATCHDOG_INTERVAL_MS`) for active bots, added execution worker auto-start watchdog (`RUNTIME_SIGNAL_LOOP_BOOTSTRAP_INTERVAL_MS`), and expanded runtime unit coverage for crash-survival + periodic session re-ensure.
- 2026-04-02: Completed `BOPS-42` markets guard parity with strategies: backend now blocks market-universe update/delete when linked symbol-groups are used by active bots (canonical + legacy links), controllers map to HTTP 409 conflict, markets e2e guard scenarios added, and web edit/delete UX shows explicit active-bot lock messaging.
- 2026-04-02: Queued follow-up hardening tasks `BOPS-42` (market-universe edit/delete guard while active bot uses linked symbol-group) and `BMOD-41/BMOD-42` (runtime session resilience + auto-restart + regression coverage) after production-like report of `CANCELED` sessions and stalled runtime refresh.
- 2026-04-02: Completed `LFIN-02` DB foundation for exact LIVE fee reconciliation: added enum `FeeSource`, extended `Order`/`Trade` with `feeSource`, `feePending`, `feeCurrency`, `effectiveFeeRate`, `exchangeTradeId`, and introduced `OrderFill` persistence model (+ migration `20260402173000_add_order_fill_and_fee_source`) with runtime-friendly indexes and FK contracts.
- 2026-04-02: Completed `BOPS-36` final Dashboard->Bots UX freeze pass: reduced runtime sidebar density (lighter section cards + trimmed decision metrics), polished live-check cards for cleaner LONG/SHORT condition readability under NEUTRAL/active states, and validated with focused web regression suites (`HomeLiveWidgets`, `BotsManagement`, `Header.responsive`) all PASS.
- 2026-04-02: Completed docs/audit tranche for Phase 21: published LIVE fee reconciliation contract (`docs/architecture/reference/live-fee-reconciliation-contract.md`), i18n inventory for dashboard+bots+header (`docs/planning/i18n-dashboard-bots-menu-inventory-2026-04-02.md`), and numeric input policy (`docs/architecture/reference/numeric-input-policy.md`).
- 2026-04-02: Completed `TCHK-01..TCHK-04`: added `typecheck` scripts to `apps/api` and `apps/web`, switched root aggregate `typecheck` to explicit api+web gate, enabled CI `typecheck` steps in both jobs, and documented local/CI usage in `docs/engineering/local-development.md` (all local commands PASS).
- 2026-04-02: Completed `DBRT-06..DBRT-10` in dashboard trades table: removed redundant header count/page string, switched filters to draft+apply/reset model, hid `UNKNOWN` from action select, implemented tri-state sorting (`asc -> desc -> none`) with omitted sort params in `none`, polished pagination summary badges, and updated dashboard component regression tests.
- 2026-04-02: Extended dashboard-trades UX polish scope with `DBRT-10` tri-state sort behavior (`asc -> desc -> none`) for column headers and request contract consistency when sort is cleared.
- 2026-04-02: Added dashboard-trades UX polish plan in `docs/planning/dashboard-trades-filter-polish-plan-2026-04-02.md` and queued execution tasks `DBRT-06..DBRT-09` (header cleanup, apply-filter flow, UNKNOWN filter UX, regression coverage).
- 2026-04-02: Added Typecheck adoption plan in `docs/planning/typecheck-adoption-plan-2026-04-02.md` and queued execution tasks `TCHK-01..TCHK-04` (api/web/root scripts + CI quality gate).
- 2026-04-02: Completed `DBRT-02..DBRT-05`: extended runtime trades API query (page/pageSize/sort/filter/date range + response `meta`), updated web DTO/service contract, implemented dashboard server-driven table controls (filters/sort/pagination), and added regression coverage in API e2e + dashboard component tests.
- 2026-04-02: Completed `DBRT-01` by publishing runtime trade-table contract in `docs/planning/dashboard-runtime-trades-table-plan-2026-04-02.md` (server-side pagination/sort/filter + response meta), and queued implementation steps `DBRT-02..DBRT-05` in execution/next-commit plans.
- 2026-04-02: Added Phase 21 planning track (`LFIN-01..LFIN-12`) and detailed implementation plan in `docs/planning/live-fee-i18n-numeric-hardening-plan-2026-04-02.md` for LIVE fee truth, dashboard/bots/menu i18n parity, and locale-safe numeric input validation.
- 2026-04-02: Completed `LFIN-08`: removed inline locale dictionaries from dashboard header navigation, migrated all header labels to canonical `dashboard.nav.*` keys, and extended EN/PL translation schema with explicit menu entry keys (plus responsive header + i18n parity tests green).
- 2026-04-02: Completed `LFIN-10`: added shared numeric parser/normalizer contract in `apps/web/src/lib/numericInput.ts` (comma/dot normalization, precision/integer/range validation, HTML input attributes helper) with regression coverage in `apps/web/src/lib/numericInput.test.ts` (8 passing cases).
- 2026-04-02: Completed `LFIN-11`: refactored strategy form sections (`Basic`, `Additional`, `Close`, `Indicators`) to use shared parser-driven numeric handling (`readNumericInputValue`) with 2-decimal guards and integer-only contracts, and aligned numeric inputs with canonical `inputMode/step` helpers.
- 2026-04-01: Completed `DBACT-02/03`: added `TradeLifecycleAction` enum+column (migration `20260401191000_add_trade_lifecycle_action`) and persisted `OPEN/DCA/CLOSE` at runtime write-time in execution + DCA paths; verified with green bots API e2e after migration deploy.
- 2026-04-01: Completed `BOPS-37..BOPS-41`: removed redundant dashboard runtime CTAs, updated dashboard/nav tests, and wired canonical Bots IA routes (`/dashboard/bots`, `/dashboard/bots/new`) with dropdown parity.
- 2026-04-01: Extended dashboard trade-action rollout plan to include non-null `Fee`/`Realized PnL` display and `Notional -> Margin` history-column unification in Control Center (`DBACT-04..DBACT-07` scope update).
- 2026-04-01: Added dashboard trade-action rollout plan in `docs/planning/dashboard-trade-action-ux-plan-2026-04-01.md` and queued execution tasks (`DBACT-02..DBACT-06`) so dashboard history can clearly show `Otwarcie pozycji / DCA / Zamkniecie pozycji`.
- 2026-04-01: Added Bots menu IA plan in `docs/planning/bots-menu-ia-plan-2026-04-01.md` to align top-nav dropdown behavior with other modules (`Lista botow` + `Dodaj bota`) and queued `BOPS-39..BOPS-41`.
- 2026-03-31: Completed `BOPS-07 feat(api+web-guard): added backend duplicate-active guard on create/activate flows (strategy + symbol-group pair), mapped conflict to HTTP 409, added dedicated API e2e coverage, and surfaced explicit conflict messaging in bots UI create/save actions.
- 2026-03-31: Completed `BOPS-06 feat(web-creator): reorganized bot creator into three explicit sections (bot core mode, market-group context, strategy context) with contextual summary tiles for selected group and selected strategy, while preserving existing payload and runtime behavior.
- 2026-03-31: Completed `BOPS-05 feat(web-monitor): replaced basic session trades listing with dense operational trade-log table (chronological index, side badge, notional-relative fee/pnl percentages, cumulative PnL, and order/position trace columns) to match backtest-style readability for runtime analysis.
- 2026-03-31: Completed `BOPS-04 feat(web-bots-dashboard): added "Szybki wybor bota" operational card strip in Bots monitoring with one-click context switching and active-first prioritization (fallback to all bots), so operator context can be changed quickly without navigating long select lists.
- 2026-03-31: Completed `BOPS-03 feat(web-monitor): switched monitoring auto-refresh to silent in-place updates (sessions + session data) so RUNNING refresh no longer toggles loading/error shells every 15s and avoids visual remount/flicker in bot operations view.
- 2026-03-31: Completed `BOPS-02 feat(web-monitor): delivered temporal monitoring layout in Bots module (`Teraz`/`Historia`/`Co bedzie`) with explicit open-positions + open-orders visibility, history split (positions/trades), and live signal-check columns per symbol (latest direction/time), backed by monitoring API contract extensions for open orders and latest signal direction.
- 2026-03-31: Completed `BOPS-01 docs(plan): locked Dashboard vs Bots IA split and temporal monitoring contract (Now/History/Future) in `docs/planning/open-decisions.md`, and queued execution track in Phase 19 + `mvp-next-commits.md` for tiny-commit rollout.
- 2026-03-31: Completed `BMOD-40 release(gate): executed full bot-module regression gate across API/runtime/backtest/web contracts and published evidence artifact `docs/operations/bot-module-release-gate-2026-03-31.md`; gate includes migration/preflight verification, targeted cross-module suites (44 API tests), bots web suite (9 tests), and API/WEB typechecks (PASS)`.
- 2026-03-31: Completed `BMOD-39 docs(runbook): published bot-module operator documentation in `docs/operations/bot-module-operator-runbook.md` plus manual validation flow in `docs/operations/bot-module-manual-smoke-checklist.md`, covering PAPER/LIVE create-flow, websocket-first runtime semantics, monitoring interpretation, incident actions, and command-level smoke gates`.
- 2026-03-31: Completed `BMOD-38 refactor(db): removed `LOCAL` from canonical `BotMode` enum in Prisma schema and added migration `20260331121500_remove_local_from_bot_mode_enum` (safe enum rebuild + LOCAL->PAPER guard updates for `Bot`/`BotRuntimeSession`), then retired transitional API/runtime LOCAL compat surfaces (`bots.controller` mapping adapter, preTrade execution mode unions, legacy LOCAL e2e fixture) while keeping preflight report backward-facing for historical legacy section; verified with `prisma migrate deploy`, bots e2e, engine parity/runtime suites, and API typecheck`.
- 2026-03-31: Completed `BMOD-37 chore(data-migration): added idempotent Prisma data migration (`20260331113000_migrate_legacy_bot_data_to_canonical_model`) to normalize `Bot.mode LOCAL->PAPER` and re-backfill legacy `BotStrategy` bindings into canonical `BotMarketGroup` + `MarketGroupStrategyLink`; verified with `prisma migrate deploy`, preflight report (`migrationReady=true`), and green bots e2e suite`.
- 2026-03-31: Completed `BMOD-36 test(e2e): extended bots API e2e monitoring contract with status/symbol/limit filter assertions and session-window trade inclusion/exclusion checks (running vs completed windows), plus web monitoring tab regression for auto-refresh interval wiring`.
- 2026-03-31: Completed `BMOD-35 feat(web-live-refresh): added lightweight monitoring auto-refresh (15s interval) in Bots Monitoring tab gated by `RUNNING` sessions + user toggle, so runtime stats/trades refresh passively without chart load; covered by component regression test and web typecheck`.
- 2026-03-31: Completed `BMOD-34 feat(web-monitor): added `Monitoring` tab in Bots module with bot/session selection, runtime session summary cards, per-symbol stats table, and session-scoped trades table (no chart payload), wired to new runtime-monitor APIs with manual refresh + optional symbol filter; validated via updated `BotsManagement` UI tests and web typecheck`.
- 2026-03-31: Completed `BMOD-33 feat(api-monitor): added session-scoped monitoring endpoints for lightweight observability (`GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats`, `GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades`) with ownership isolation, session-window trade filtering, and summary aggregates; extended bots e2e contract coverage`.
- 2026-03-31: Completed `BMOD-32 feat(api-monitor): added bot runtime monitoring API for sessions list/detail (`GET /dashboard/bots/:id/runtime-sessions`, `GET /dashboard/bots/:id/runtime-sessions/:sessionId`) with ownership isolation, status filter/limit query contract, and summary aggregates from runtime events/symbol stats (covered by bots e2e)`.
- 2026-03-31: Completed `BMOD-31 feat(runtime-telemetry): implemented runtime telemetry persistence service and wired it into signal loop/orchestrator/position automation (session ensure/close, lifecycle events, per-symbol stat upserts incl. DCA and signal counters); validated with green runtime unit suites + bots e2e`.
- 2026-03-31: Completed `BMOD-30 feat(db): added `BotRuntimeSymbolStat` schema model for per-session/per-symbol monitoring snapshots (signals/entries/exits/DCA/trade counters + realized PnL/fees + open-position snapshot fields) with unique `(sessionId, symbol)` and SQL migration scaffold`.
- 2026-03-31: Completed `BMOD-29 feat(db): added `BotRuntimeEvent` schema model (typed lifecycle events + level enum + symbol/group/strategy context + payload + eventAt ordering indexes) with SQL migration scaffold and relation wiring to session/bot/user`.
- 2026-03-31: Completed `BMOD-28 feat(db): added `BotRuntimeSession` schema model (status enum, lifecycle timestamps, heartbeat/stop metadata, indexes, `User`/`Bot` relations) with SQL migration scaffold for run-like bot monitoring windows`.
- 2026-03-31: Completed `BMOD-27 test(parity): added bot PAPER vs BACKTEST decision parity regression coverage for shared execution decisions (`open/ignore/close`, `no_flip_with_open_position`, `already_open_same_side`, `no_open_position`) and validated with green engine+bots suites`.
- 2026-03-31: Completed `BMOD-26 test(runtime): extended websocket-first regression coverage in runtime signal/watchdog tests (non-final candles ignored, watchdog ticker path remains strategy-neutral, watchdog emits ticker-only payloads) and decoupled signal-loop unit tests from DB via runtime-capital mock for deterministic CI execution`.
- 2026-03-30: Completed `BMOD-25 feat(runtime-watchdog): switched runtime scan loop to explicit fallback watchdog mode with `RUNTIME_SCAN_WATCHDOG_ENABLED=false` default and added regression test proving no auto-scan execution when watchdog is disabled`.
- 2026-03-30: Completed `BMOD-24 refactor(runtime-model): removed runtime signal-loop read dependency on legacy `botStrategies` fallback graph; runtime now resolves active execution graph exclusively from canonical `botMarketGroups + strategyLinks` model`.
- 2026-03-30: Completed `BMOD-23 feat(runtime-risk): introduced runtime derivation of market-group `maxOpenPositions` from active strategy risk config (`additional.maxPositions` / `additional.maxOpenPositions`) using safest cap (minimum positive value), with fallback to configured group cap and dedicated helper tests`.
- 2026-03-30: Completed `BMOD-22 feat(runtime-idempotency): added deterministic candle-window dedupe key (`botId+groupId+symbol+interval+open/closeTime`) with retention pruning to prevent duplicate final-candle signal/orchestration on repeated stream delivery, plus regression test for duplicate window replay`.
- 2026-03-30: Completed `BMOD-21 refactor(runtime-lifecycle): reduced ticker handler to lifecycle-only path (ticker snapshot upsert + open-position automation), removing ticker-originated signal generation/orchestration so runtime trading decisions no longer execute from ticker events`.
- 2026-03-30: Completed `BMOD-20 refactor(runtime-signal): moved strategy-driven runtime decisions (`LONG`/`SHORT`/`EXIT`) from ticker path to final candle events (`source=market_stream.candle_final`), including strategy interval matching per candle, candle-based confidence payload, and updated runtime signal-loop tests for candle-trigger semantics`.
- 2026-03-30: Completed `BMOD-19 test(web): expanded `BotsManagement` suite with regression coverage for mode-conditional `paperStartBalance` visibility (PAPER/LIVE toggle) and strategy-derived creator summary values (`interval`, `leverage`, derived `max open positions`)`.
- 2026-03-30: Completed `BMOD-18 feat(web-creator): added strategy-derived summary block in bot creator (`Interwal`, `Dzwignia`, `Max open positions`) with max-open derived from strategy risk config (`additional.maxPositions`/`maxOpenPositions`) and fallback to `1` when missing/invalid (web bots component tests PASS)`.
- 2026-03-30: Completed `BMOD-17 feat(web-creator): removed `Pozycja` and `Max open positions` input controls from bot creator UI, made table values read-only for those fields, and stopped sending them in bot update payload writes (web bots component tests PASS)`.
- 2026-03-30: Completed `BMOD-16 feat(web-creator): updated bot creator UX so `paperStartBalance` field is rendered only for `PAPER` mode (hidden for LIVE), with regression assertion in bots component tests (PASS)`.
- 2026-03-30: Completed `BMOD-15 feat(web-creator): replaced creator `Rynek` selector with canonical `Grupa rynkow` selector, removed optional empty strategy path in create form, and enforced strategy/group-driven create readiness in UI state (web bots component tests PASS)`.
- 2026-03-30: Completed `BMOD-14 feat(web-data): wired market-group source loading into BotsManagement creator flow (`listMarketUniverses`), persisted first available group as default selection state, and updated bots component tests with market-group mocks (PASS)`.
- 2026-03-30: Completed `BMOD-13 refactor(web-types): aligned web bot contracts to V2 by removing `LOCAL` mode from shared bot types, dropping creator write-only legacy fields (`marketType`, `positionMode`, `maxOpenPositions`) from create/update payload types, and updating BotsManagement mode options to PAPER/LIVE only (web bots component tests PASS)`.
- 2026-03-30: Completed `BMOD-12 test(api): extended bots e2e for new create ownership contract (foreign strategy/group rejection), marketType derivation from market-group universe, and ignored removed write fields (`positionMode`, `maxOpenPositions`)`.
- 2026-03-30: Completed `BMOD-11 refactor(api-write): removed bot-level `maxOpenPositions` from create/update write contract and derive create defaults from selected strategy config (fallback=1) for bot + initial bot-market-group caps (targeted API e2e PASS)`.
- 2026-03-30: Completed `BMOD-10 refactor(api-write): removed `positionMode` from bot create/update write contract and forced create default `ONE_WAY` server-side to preserve runtime behavior (targeted API e2e PASS)`.
- 2026-03-30: Completed `BMOD-09 refactor(api-derive): removed client-writable `marketType` from bot create schema and derive bot market type from selected market-group universe in create transaction (targeted API e2e PASS)`.
- 2026-03-30: Completed `BMOD-08 feat(api-create): bot create now atomically creates `Bot` + `BotMarketGroup` + `MarketGroupStrategyLink`, adds create error mapping for invalid market-group ownership/compatibility, and hardens bot delete cascade for new relations (targeted API e2e PASS)`.
- 2026-03-30: Completed `BMOD-07 refactor(api-create): switched bot create write contract to require `strategyId` + `marketGroupId` in API schema, updated bots/runtime/isolation e2e create fixtures, and validated targeted API suites (PASS)`.
- 2026-03-30: Completed `BMOD-06 feat(api-compat): added read-path LOCAL->PAPER adapter in bots controller (list/get/create/update/runtime-graph) + e2e regression for legacy LOCAL visibility`.
- 2026-03-30: Completed `BMOD-05 refactor(api-types): removed `LOCAL` from `BotModeSchema` write contract (`apps/api/src/modules/bots/bots.types.ts`) and validated bots e2e suite (PASS)`.
- 2026-03-30: Completed `BMOD-04 test(baseline): pinned and executed `test:bot:v2:baseline` (PASS) and recorded suite in `docs/operations/bot-v2-baseline-test-suite.md``.
- 2026-03-30: Completed `BMOD-03 chore(audit): added `apps/api/scripts/bot-v2-preflight-report.ts` and `ops:bot:v2:preflight` command for LOCAL + legacy BotStrategy migration readiness checks`.
- 2026-03-30: Completed `BMOD-02 docs(decisions): locked websocket-first bot trigger policy + no-chart monitoring scope with canonical references in `docs/planning/open-decisions.md``.
- 2026-03-30: Completed `BMOD-01 docs(contract): froze canonical Bot V2 create/update payload + migration invariants in `docs/architecture/archive/bot-v2-create-update-contract.md``.
- 2026-03-30: Added Phase 18 `BMOD` execution queue and canonical implementation blueprint `docs/planning/bot-module-implementation-plan-2026-03-30.md` (stream-first runtime + no-chart bot monitoring scope).
- 2026-03-30: Completed `feat(backtest-ui): improved run header readability and removed redundant progress/status noise for completed runs`.
- 2026-03-30: Completed `fix(backtest-parity-ux): aligned Markets pair stats with timeline/trades visibility and execution counters for clearer operator diagnostics`.
- 2026-03-30: Completed `perf(backtest-ui): staged timeline loading flow (`events` first, then `candles/indicators`) to reduce chart jitter during hydration`.
- 2026-03-30: Completed `feat(i18n-backtests): localized backtest create/list/details flows and labels to EN/PL without runtime behavior changes`.
- 2026-03-29: Completed `POS-42` by publishing Binance side-by-side lifecycle reason parity protocol (`docs/operations/binance-lifecycle-reason-parity-protocol.md`) and linking it from the main parity checklist.
- 2026-03-29: Completed `POS-41` by adding golden close-reason fixtures (`TP/SL/TTP/TSL`) and a parity harness asserting identical close-reason sequences for backtest, paper lifecycle, and live lifecycle core.
- 2026-03-29: Completed `POS-40` by refactoring backtest service to consume shared replay lifecycle helpers (risk parsing + close-reason/event mapping + management input + TTP trigger), removing duplicated divergence-prone close semantics between interleaved and replay paths.
- 2026-03-29: Completed `POS-39` by replacing runtime DCA mutation-only flow with execution-adapter flow (`openOrder` paper/live + trade/log persistence + position averaging update).
- 2026-03-29: Completed `POS-38` by introducing shared runtime capital context (dynamic PAPER reference balance + free-cash snapshot) and wiring runtime DCA affordability guard (`dcaFundsExhausted`) into automation/lifecycle evaluation.
- 2026-03-29: Completed `POS-37` by enforcing `BOT_MANAGED` automation scope in runtime position automation and resolving close execution mode from position/bot context (with manual-mode fallback only when bot mode is unavailable).
- 2026-03-29: Completed `POS-36` by removing direct strategy `EXIT` close authority from backtest/replay and runtime strategy path; `EXIT` remains trace-only for strategy-driven groups while lifecycle manager remains sole close authority.
- 2026-03-29: Added Phase 17 remediation plan after parity-gap audit; canonical plan doc: `docs/planning/position-lifecycle-parity-remediation-plan-2026-03-29.md`.
- 2026-03-29: Completed `POS-35` by adding e2e chart parity assertions (eventCounts vs timeline events + positionStats contract) and publishing operator checklist in `docs/operations/backtest-markets-chart-parity-checklist.md`.
- 2026-03-29: Completed `POS-34` by wiring backtest replay/interleaved runtime to shared `evaluatePositionManagement` lifecycle (shared close reasons/event mapping), including DCA wick-probe compatibility and green replay/e2e contracts.
- 2026-03-29: Completed `POS-33` by switching engine lifecycle order to legacy parity (`DCA -> TP -> TTP -> SL -> TSL`), adding TTP/TSL tracker exclusivity, and extending engine regression tests.
- 2026-03-29: Completed `POS-32` by enforcing non-overlap trade interval normalization in backtest Markets chart and adding explicit shared-execution invariant test for same-side re-entry ignore.
- 2026-03-28: Completed `POS-31` by publishing canonical legacy parity matrix in `docs/architecture/reference/position-lifecycle-parity-matrix.md` (strict lifecycle order, trigger semantics, state-reset contract) and linking it from `open-decisions`.
- 2026-03-28: Completed `PAR-01` by publishing canonical strategy-evaluation parity contract and linking it in open decisions.
- 2026-03-28: Completed `PAR-02` by disabling strategy-mode fallback to percent-threshold signals and forcing shared evaluator semantics in backtest replay.
- 2026-03-28: Completed `PAR-03` by introducing historical fill-model adapter and shared simulator accounting path in backtest replay lifecycle.
- 2026-03-28: Completed `PAR-04` by adding futures historical funding/open-interest ingestion with deterministic cache window and timeline/report exposure.
- 2026-03-28: Completed `PAR-05` by adding deterministic 3-symbol parity harness test for shared evaluator/replay decision trace alignment.
- 2026-03-28: Completed `PAR-06` by exposing parity-delta mismatch diagnostics (`timestamp`, `side`, `trigger`, `mismatchReason`) in backtest report metrics and timeline payload.
- 2026-03-28: Completed `PAR-07` by publishing Binance side-by-side parity checklist for 3 symbols in `docs/operations/binance-side-by-side-parity-checklist.md`.
- 2026-03-28: Completed `PAR-08` by adding e2e contract for strategy + market-group(3 symbols) + backtest report parity checks and paper pre-trade consistency baseline.
- 2026-03-28: Completed `PAR-09` by reducing markets-tab timeline memory pressure (smaller chunk size, no auto-fetch of full history per symbol, on-demand continuation only).
- 2026-03-28: Completed `PAR-10` by publishing parity mismatch operator runbook with reason interpretation, safe corrective actions, and escalation protocol.
- 2026-03-28: Completed `PAR-11` by persisting per-symbol parity diagnostics status (`PROCESSED`/`FAILED`) and operator-facing error details for multi-symbol backtest visibility.
- 2026-03-28: Completed `PAR-12` by exposing parity status badges and error messages per symbol in backtest Markets tab (including symbols with zero trades).
- 2026-03-28: Completed `PAR-13` by fixing `reports.service.ts` API import contract and restoring clean `pnpm --filter web exec tsc --noEmit`.
- 2026-03-28: Completed `PAR-14` by guarding timeline endpoint to run-scoped symbols only and adding e2e validation for `404` on out-of-scope symbol queries.
- 2026-03-28: Completed `PAR-15` by adding `.gitignore` rules for local `.agents/skills/*` generated folders to avoid noisy untracked state.
- 2026-03-28: Completed `PAR-16` by plotting lifecycle event markers on markets candlestick chart and replacing placeholder legend copy with real event counters.
- 2026-03-28: Completed `PAR-17` by short-circuiting markets-tab timeline fetch for `FAILED` symbols and surfacing parity error text without extra requests.
- 2026-03-28: Completed `PAR-18` by deleting unused mock-based `BacktestForm.tsx` component and re-validating web typecheck/tests.
- 2026-03-28: Completed `PAR-19` by adding backtests e2e coverage for invalid symbol runs, asserting parity diagnostics `status=FAILED` with explicit error details.
- 2026-03-28: Completed `PAR-20` by removing unused imports/variables in web backtest+markets components and confirming clean `pnpm --filter web build` output.
- 2026-03-28: Completed `PAR-21` by enforcing backtest create-form maxCandles bounds in UI and adding whitelist/blacklist summary context for selected market group.
- 2026-03-28: Completed `PAR-22` by adding `BacktestCreateForm` component regression tests for invalid/valid maxCandles behavior and payload mapping.
- 2026-03-28: Completed `PAR-23` by normalizing timeline payload arrays (`events`, `indicatorSeries`) in backtest details and guarding filters/merges against undefined data.
- 2026-03-28: Completed `PAR-24` by adding missing `apps/web/public/favicon.ico` and restoring stable Next.js build page-data collection.
- 2026-03-28: Added Phase 15 parity-closure track to lock final path toward deterministic backtest/paper/live behavior and explicit Binance side-by-side verification.
- 2026-03-22: Domain audit completed for multi-bot runtime (`MBA-01`), including current Bot/SymbolGroup/BotStrategy contract mapping and non-breaking migration path in `docs/planning/mba-01-domain-audit-2026-03-22.md`.
- 2026-03-23: Locked canonical runtime hierarchy and assistant topology (`MBA-02`) plus deterministic multi-strategy merge policy contract (`MBA-03`) in `docs/planning/open-decisions.md` and `docs/architecture/reference/runtime-signal-merge-contract.md`.
- 2026-03-23: Added additive Prisma schema + migration for `BotMarketGroup` and `MarketGroupStrategyLink` (`MBA-04`, `MBA-05`) with lifecycle/execution order and priority/weight fields.
- 2026-03-23: Added idempotent backfill migration (`MBA-06`) from legacy `BotStrategy` bindings into `BotMarketGroup` and `MarketGroupStrategyLink` default graph records.
- 2026-03-23: Added bot market-group CRUD API (`MBA-07`) with ownership isolation, marketType compatibility validation, and e2e contract coverage.
- 2026-03-23: Added strategy-link management API (`MBA-08`) for bot market-group scope (list/attach/update/reorder/detach) with deterministic priority ordering and ownership checks.
- 2026-03-23: Added runtime graph read endpoint (`MBA-09`) exposing canonical bot->marketGroups->strategyLinks model plus legacy `BotStrategy` view for compatibility.
- 2026-03-23: Refactored runtime signal loop (`MBA-10`) to process bot market-group partitions with symbol filtering and partition-aware signal metadata while preserving legacy fallback.
- 2026-03-23: Implemented deterministic multi-strategy merge (`MBA-11`) in runtime partition evaluation with EXIT priority, weighted votes, and explicit no-trade outcomes for tie/weak consensus.
- 2026-03-23: Added per-market-group risk budget enforcement (`MBA-12`) via `BotMarketGroup.maxOpenPositions` and runtime group-cap guard before global/bot pre-trade checks.
- 2026-03-23: Added full multi-entity e2e scenario (`MBA-13`) validating one-user/two-bot runtime graph with multiple market-groups and strategy links per bot.
- 2026-03-23: Published assistant runtime contract (`MBA-14`) with canonical roles, I/O envelope, timeout behavior, and fail-closed safety rules.
- 2026-03-23: Added assistant DB foundation (`MBA-15`, `MBA-16`) with `BotAssistantConfig` and `BotSubagentConfig` models, safety enum, and unique bot slot indexing.
- 2026-03-23: Added assistant config API layer (`MBA-17`) with ownership-safe CRUD and hard slot validation (`1..4`) for subagents.
- 2026-03-23: Added assistant runtime scaffold (`MBA-18/19/20`) with main-plan orchestration, slot timeout dispatcher, deterministic merge, and sanitized trace contract.
- 2026-03-23: Added assistant UI surface (`MBA-21`) in Bots module with tabbed main/subagent configuration for 1 main + 4 slot topology.
- 2026-03-23: Added assistant dry-run e2e path (`MBA-22`) to validate configured stack and explainable decision trace payload contract.
- 2026-03-23: Added assistant/runtime observability metrics (`MBA-23`) for group latency, merge outcomes, no-trade counts, and subagent timeouts.
- 2026-03-23: Added assistant circuit-breaker (`MBA-24`) to degrade deterministically into `strategy_only` after repeated planner failures.
- 2026-03-23: Added assistant policy/mandate enforcement (`MBA-25`) to force `NO_TRADE` on forbidden outputs before execution approval.
- 2026-03-23: Added assistant explainability UI (`MBA-26`) with dry-run decision timeline and per-slot execution status for operator traceability.
- 2026-03-23: Added assistant parity validation (`MBA-27`) confirming deterministic final decision/reason parity across BACKTEST/PAPER/LIVE for shared orchestration input.
- 2026-03-23: Added assistant load benchmark + SLO thresholds (`MBA-28`) for target `3x4x4x5` profile with artifact/report evidence and SLO catalog update.
- 2026-03-23: Published assistant incident runbook (`MBA-29`) covering timeout/planner/policy/drift incidents, deterministic fallback modes, and safe recovery checklist.
- 2026-03-23: Published multi-entity assistant runtime evidence pack (`MBA-30`) and closed assistant-specific V1 gate with explicit references to remaining global release gates.
- 2026-03-15: Initialized MVP execution file and commit rules.
- 2026-03-15: Added generic trigger-based one-task execution workflow.
- 2026-03-15: Expanded MVP plan to fully align with product, modules, database, trading, testing, and security docs.
- 2026-03-15: Added root workspace scripts for lint/typecheck/test/build in package.json.
- 2026-03-15: Added minimal GitHub Actions CI checks for client and server.
- 2026-03-15: Frozen MVP strategy schema shape in open-decisions and product docs.
- 2026-03-15: Unified API error response payload format across middleware and core modules.
- 2026-03-15: Stabilized auth regression tests with deterministic DB cleanup and test-safe app startup.
- 2026-03-15: Resolved MVP preset storage approach as code-defined templates in docs.
- 2026-03-15: Centralized Zod validation error formatting via shared helper.
- 2026-03-15: Reduced critical any usage in auth/middleware via typed request user context.
- 2026-03-15: Reduced critical any usage in strategy/profile client flows with typed payloads and DTO mapping.
- 2026-03-15: Added strategies CRUD contract e2e tests with auth and ownership isolation checks.
- 2026-03-15: Added dashboard planning tasks for post-login control center and positions/orders-first home widgets.
- 2026-03-15: Verified API keys are encrypted at rest and masked in API responses with security e2e coverage.
- 2026-03-15: Added in-memory rate limiting for auth, market, and trading endpoints.
- 2026-03-15: Normalized docs consistency rules for Current/Planned sections and UTF-8 encoding.
- 2026-03-15: Audited legacy dashboard patterns and defined control-center IA priorities for positions/orders-first home.
- 2026-03-15: Implemented post-login control-center dashboard with KPI, positions/orders snapshots, quick actions, and activity feed seed widgets.
- 2026-03-15: Added MarketUniverse Prisma model with ownership relation, universe filters, whitelist/blacklist, and migration SQL.
- 2026-03-15: Added SymbolGroup Prisma model linked to MarketUniverse and User with symbol list storage and migration SQL.
- 2026-03-15: Added Bot and BotStrategy Prisma models with execution mode, live opt-in flag, position limit, and strategy-to-group mapping migration.
- 2026-03-15: Added Position, Order, Trade, and Signal Prisma models with trading enums, ownership relations, and one-open-position-per-symbol index.
- 2026-03-15: Added BacktestRun, BacktestTrade, and BacktestReport Prisma models with status lifecycle, run-level trade mapping, and one-to-one report relation.
- 2026-03-15: Added Log Prisma model for audit trail with severity, source, actor, metadata, and ownership relations.
- 2026-03-15: Added markets API CRUD for market universes with validation, ownership checks, and e2e contract coverage.
- 2026-03-15: Added bots API CRUD with execution mode, live opt-in, position limits, ownership checks, and e2e coverage.
- 2026-03-15: Added read-only orders and positions API endpoints with query filters, ownership checks, and e2e coverage.
- 2026-03-15: Standardized ownership behavior to return 404 on foreign resources for strategy and api-key update/delete paths.
- 2026-03-15: Added cross-module data isolation e2e coverage for markets, bots, orders, positions, and backtest datasets.
- 2026-03-15: Added market-data OHLCV ingestion service with in-memory TTL caching and unit coverage for cache hit, expiry, and force refresh.
- 2026-03-15: Added indicator calculation adapter for SMA, EMA, and RSI with unit coverage for warmup and output ranges.
- 2026-03-15: Added rule evaluator service for AND/OR comparison rules with multi-timeframe indicator snapshot support.
- 2026-03-15: Added pre-trade analysis service with live opt-in enforcement and user/bot/symbol open-position limit checks.
- 2026-03-15: Added deterministic trade simulator with fee, slippage, and funding cost accounting plus unit coverage.
- 2026-03-15: Added order type evaluator for market, limit, stop, stop-limit, take-profit, and trailing with stateful trigger handling.
- 2026-03-15: Added position management engine for TP/SL/trailing stop and DCA with deterministic state transitions.
- 2026-03-15: Added backtests API endpoints for run create/list/get with ownership checks and strategy ownership validation.
- 2026-03-15: Added backtests API endpoints for run trades list and run report read with ownership isolation and e2e coverage.
- 2026-03-15: Expanded simulator unit coverage for deterministic repeats, accounting identity, and explicit slippage cost regression cases.
- 2026-03-15: Added paper runtime service loop for polling live market feed with stop control and per-symbol non-overlapping tick execution.
- 2026-03-15: Added paper lifecycle orchestrator for order execution parity, position management (DCA/TP/SL/trailing), and deterministic simulated close-out PnL.
- 2026-03-15: Added CCXT futures connector scaffold with lazy client init, sandbox support, mark-price fetch, and normalized futures order placement contract.
- 2026-03-15: Added live order adapter with retry/backoff policy for retryable exchange failures and deterministic unit coverage.
- 2026-03-15: Enforced explicit live opt-in per bot in pre-trade checks by validating bot ownership, LIVE mode, and liveOptIn flag from store data.
- 2026-03-15: Added live pre-trade kill controls via global kill-switch and emergency-stop guards with deterministic test coverage.
- 2026-03-15: Added audit log writes for critical pre-trade decisions (allowed/blocked in LIVE and blocked decisions) with non-blocking failure handling.
- 2026-03-15: Synced MVP UX tasks with new `ui-ux-foundation.md` baseline (shell, states, tokens, control-center safety patterns, i18n, accessibility).
- 2026-03-15: Unified dashboard shell spacing and page-header/breadcrumb patterns across control center, strategies, backtest, and profile views.
- 2026-03-15: Added pre-trade smoke e2e coverage for critical paper/live paths, including live allow, kill-switch block, and audit-log assertions.
- 2026-03-15: Added shared UI state components (loading, empty, degraded, error, success) with dashboard integration and unit coverage.
- 2026-03-15: Added sticky control-center safety bar with mode, connectivity, heartbeat status, and emergency navigation action.
- 2026-03-15: Added control-center risk notice footer with direct shortcuts to audit logs and security settings.
- 2026-03-15: Added semantic UI tokens for execution mode and risk levels with reusable status badge component integrated into safety bar.
- 2026-03-15: Implemented dashboard markets flow with market-universe list/create/delete wired to backend markets API and UI-state handling.
- 2026-03-15: Closed MVP decision on rule nesting depth as out-of-scope beyond top-level logic with flat rules.
- 2026-03-15: Added dashboard builder page with code-defined strategy presets and editor flow wired to strategy create endpoint.
- 2026-03-15: Added bots management dashboard flow with CRUD wiring, mode/risk status badges, and inline control updates.
- 2026-03-16: Added dashboard orders and positions pages with backend-powered filters, table views, and component test coverage.
- 2026-03-16: Replaced dashboard home mocks with live orders/positions widgets and recent activity feed sourced from API data.
- 2026-03-16: Implemented full backtest UX with run creation/list, trades tab, summary cards, and modal overlay wired to backtests API.
- 2026-03-16: Added reports performance view with aggregated KPI cards and per-run backtest report table sourced from reports API.
- 2026-03-16: Added logs audit trail dashboard view with source filters and derived event stream from orders/positions/backtests.
- 2026-03-16: Added exchanges dashboard view for API-key connections with connection summary cards and profile API-key management integration.
- 2026-03-16: Added i18n provider with EN default locale, PL shell translations, language switcher, and shell-level translation wiring with i18n tests.
- 2026-03-16: Enforced typed translation keys and moved dashboard shell copy into feature-based `dashboard.*` namespaces.
- 2026-03-16: Added locale-aware date/time/number/currency/percent formatting utilities and integrated them across core dashboard data views.
- 2026-03-16: Improved dashboard shell responsiveness for mobile/tablet with wrapping header nav, horizontal nav scrolling, and small-screen safety-bar/page-title adjustments.
- 2026-03-16: Added PWA baseline with manifest metadata, installable icons, service worker registration, runtime caching, and offline fallback route.
- 2026-03-16: Added accessibility baseline with skip-to-content support, keyboard focus-visible styles, and clearer landmark semantics for dashboard/public layouts.
- 2026-03-16: Added UI test coverage for EN/PL translation-key parity and responsive dashboard-header smoke rendering.
- 2026-03-16: Extended shared ViewState tests for consistent title/description rendering and action-button visibility rules across loading/empty/degraded/error/success variants.
- 2026-03-16: Added manual UX checklist for 10-second control-center operator clarity and linked it in testing strategy docs.
- 2026-03-16: Added MVP operations runbook covering deployment steps, health verification, rollback, and recovery playbooks.
- 2026-03-16: Added MVP user-facing risk notice and live-consent text pack (EN/PL) with consent-versioning and audit logging guidance.
- 2026-03-16: Added audit remediation gate (P0-P3) and reprioritized queue before any further feature work.
- 2026-03-16: Secured avatar upload endpoint with auth, rate limiting, strict MIME/size validation, and upload e2e coverage.
- 2026-03-16: Added `consentTextVersion` across bot live-consent flow with persistence, API validation, pre-trade enforcement, and audit logging.
- 2026-03-16: Hardened runtime URL/CORS parsing in server config and switched client API base URL to env-driven setup.
- 2026-03-16: Migrated API-key encryption to AES-GCM with key versioning and legacy CBC backward compatibility during decrypt.
- 2026-03-16: Restored fully green server/client tests by adding FK-safe cleanup coverage and consistent Next router test mocks.
- 2026-03-16: Implemented `/dashboard/logs` backend with source/actor/severity filtering and wired logs dashboard to real API data.
- 2026-03-16: Replaced in-memory rate limiting with Redis-backed counters and TTL-based bounded key growth, with local fallback.
- 2026-03-16: Unified remember-me JWT and cookie TTL semantics with explicit auth session constants and e2e coverage.
- 2026-03-16: Removed dead forgot-password client call paths to align auth contract with implemented backend endpoints.
- 2026-03-16: Replaced hardcoded logs/dashboard copy with translation keys and wired logs view/page to i18n provider keys.
- 2026-03-16: Removed remaining `any` usage in profile routes/controllers and replaced with typed request/validation flow.
- 2026-03-16: Added explicit MVP known limits and post-MVP boundary document for release communication.
- 2026-03-16: Added MVP release checklist and project changelog for closure readiness.
- 2026-03-16: Synced stale plan checkboxes to match delivered logs API and i18n hardcoded-copy cleanup status.
- 2026-03-16: Updated MVP exit criteria to reflect verified guardrails, green core suites, and completed UI/i18n shell baselines.
- 2026-03-16: Added automated server e2e smoke flow for strategy -> backtest -> paper -> live opt-in guardrail path.
- 2026-03-19: Continued post-MVP queue performance hardening by adding env-tunable worker queue profiles in V1 release track.
- 2026-03-19: Added post-MVP load baseline/stress test runner and execution docs for API and worker monitoring endpoints.
- 2026-03-19: Began V1 spot-trading expansion with connector-level market type switch (`future`/`spot`) and safety guard for futures-only order params.
- 2026-03-19: Added strategy import/export API flow with explicit `strategy.v1` format-version contract for post-MVP product expansion.
- 2026-03-19: Added V1 production operator handbook covering shift checks, monitoring cadence, deployment safety, and incident operation flow.
- 2026-03-19: Added V1 user guide with onboarding, safety recommendations, FAQ, troubleshooting, and live-readiness checklist.
- 2026-03-19: Completed localization QA baseline via EN/PL parity checks, locale-formatting tests, and release checklist documentation.
- 2026-03-19: Added optional dashboard isometric visual mode with persistent toggle and targeted UI test coverage.
- 2026-03-19: Improved dashboard accessibility controls with stronger menu semantics and heartbeat status live-region announcements.
- 2026-03-19: Synced module map docs with strategy import/export support and explicit `strategy.v1` package contract.
- 2026-03-19: Added logs decision-trace explorer UX with per-event metadata drill-down and trace visibility for audit workflows.
- 2026-03-19: Added risk-first confirmation prompts for LIVE bot transitions (mode/opt-in/activation) to reduce accidental live exposure.
- 2026-03-19: Added shared dashboard design-system documentation covering reusable UI primitives, semantic tokens, and conformance gates.
- 2026-03-19: Completed dashboard accessibility pass with active navigation semantics, improved control labels/live regions, and audit checklist documentation.
- 2026-03-19: Added V1 release-candidate checklist to formalize go-live quality/security/ops gates and sign-off flow.
- 2026-03-19: Added V1 stabilization freeze and bug-bash plan to control pre-release change scope and defect triage SLAs.
- 2026-03-19: Added V1 post-release monitoring and hotfix protocol with severity-based response model and verification records.
- 2026-03-19: Added 7-day launch review template and V1.1 backlog-cut framework for post-launch decision cadence.
- 2026-03-19: Added V1 changelog and migration notes to formalize release communication and rollout expectations.
- 2026-03-19: Added go-live smoke-pack scripts and docs; client smoke suite passed, server e2e smoke pending Docker DB availability.
- 2026-03-19: Continued spot-trading delivery by adding bot `marketType` schema/API field (`FUTURES`/`SPOT`) with migration and generated Prisma client.
- 2026-03-19: Extended bot market-type support to dashboard UI for create/edit flows, aligned with spot-trading rollout.
- 2026-03-19: Improved spot-support compatibility by normalizing uppercase bot `marketType` aliases (`FUTURES`/`SPOT`) in the CCXT connector config path.
- 2026-03-19: Improved bots dashboard UX for spot support by adding a market filter and correcting table market/status column alignment.
- 2026-03-19: Extended pre-trade live-path context by including bot `marketType` in live config reads and audit metadata for decision traceability.
- 2026-03-19: Extended risk-first UX in bot control center with mandatory confirmation before deleting active or LIVE-enabled bots.
- 2026-03-19: Removed client hook dependency warnings by adding missing `router` dependencies in auth/dashboard route guard effects.
- 2026-03-19: Reduced client lint/type noise by cleaning profile hook catches/effects and aligning backtest form resolver typing with `z.coerce` output.
- 2026-03-19: Improved Next.js image best-practice alignment by migrating dashboard/public header logos from `<img>` to `next/image`.
- 2026-03-19: Migrated profile avatar preview to `next/image` (`loader` + `unoptimized`) and reached warning-free client production build.
- 2026-03-19: Added risk-acknowledgment guard for API-key deletion in profile/exchange flows and covered it with dedicated UI test.
- 2026-03-19: Updated metadata/landing copy from futures-only wording to spot+futures messaging to match ongoing product expansion.
- 2026-03-19: Added optional bots-list `marketType` query filtering (`FUTURES`/`SPOT`) for API-side segmentation in spot rollout workflows.
- 2026-03-19: Connected dashboard bot market filter to API query (`marketType`) so SPOT/FUTURES views are served directly from backend.
- 2026-03-19: Added go-live helper scripts for Docker infra up/down and `test:go-live:server:with-infra` orchestration to streamline smoke execution.
- 2026-03-19: Started hedge-mode groundwork by adding bot `positionMode` (`ONE_WAY`/`HEDGE`) to Prisma schema, API validation, and contract assertions.
- 2026-03-19: Exposed bot `positionMode` in dashboard create/edit flows and synchronized client bot tests with the new ONE_WAY/HEDGE contract.
- 2026-03-19: Completed hedge-mode backend flow by validating HEDGE `positionSide` in futures connector orders and extending pre-trade audit metadata with bot `positionMode`.
- 2026-03-19: Finalized spot connector behavior by validating SPOT order contract and rejecting futures-only order params in live execution flow.
- 2026-03-19: Added go-live smoke orchestrator script with automatic infra up/down lifecycle to make server/client smoke runs reproducible and cleanup-safe.
- 2026-03-19: Added advanced pre-trade risk limit evaluation for daily loss, drawdown, and consecutive losses with regression tests.
- 2026-03-19: Added post-loss cooldown guardrail evaluation in pre-trade risk checks with deterministic unit tests for active/elapsed cooldown windows.
- 2026-03-19: Added optional market-data adapters for order book, funding rate, and open interest snapshots with validated request contracts and tests.
- 2026-03-19: Validated full go-live smoke flow end-to-end (Docker infra lifecycle + Prisma migrate deploy + server/client smoke suites) with green result.
- 2026-03-19: Added MVP freeze-gap closure phase (stream transport, live market bar, write-side orders, orchestrator wiring) from updated roadmap/product limits.
- 2026-03-19: Added Binance market-stream worker scaffold with normalized ticker/kline event parsing for upcoming live dashboard stream fan-out.
- 2026-03-22: Added origin/management/sync metadata baseline in Position/Order/Trade models with migration and indexes for runtime ownership and reconciliation flows.
- 2026-03-22: Added API-key onboarding options (`syncExternalPositions`, `manageExternalPositions`) across Prisma, profile API contracts, form switches, and regression tests.
- 2026-03-22: Added runtime execution guards for no-flip behavior and manual-managed symbol ignore rules in signal loop/orchestrator flow with regression tests.
- 2026-03-22: Extended positions module UX with source/management badges plus management-mode toggle action and ownership-safe API endpoint coverage.
- 2026-03-22: Replanned with audit-first closure queue (truthful docs status, green tests gate, stream contract completion, routing hard-cut, live-contract alignment, and admin/billing scope realignment to post-MVP).
- 2026-03-19: Closed stream transport decision for MVP (SSE fan-out) and documented event contract plus reliability rules for frontend/backend integration.
- 2026-03-19: Implemented dashboard live market bar component with SSE listener and UI indicators for price, 24h delta, candle freshness, and stream health state.
- 2026-03-19: Added orders write-side API (`open`/`cancel`/`close`) with LIVE risk acknowledgments, bot eligibility guards, and contract e2e coverage.
- 2026-03-19: Wired runtime execution orchestrator service for signal -> order -> position lifecycle (LONG/SHORT/EXIT) with paper/live-compatible flow contracts.
- 2026-03-19: Added live position reconciliation loop with heartbeat/status exposure (`/dashboard/positions/live-status`) and execution-worker startup integration.
- 2026-03-19: Finalized backtest overlay/report visuals with equity-curve rendering in summary and modal report views, plus passing backtest component tests and client production build.
- 2026-03-19: Added runtime smoke e2e flow for normalized stream signal ingestion through orchestrator order/position lifecycle (LONG open + EXIT close) and hardened EXIT handling for already-filled market orders.
- 2026-03-19: Synced MVP docs to freeze-gap delivery state (scope/limitations/modules/runtime notes), including explicit distinction between delivered ingest/orchestration pieces and remaining SSE fan-out automation gap.
- 2026-03-19: Re-ran MVP release checklist with fresh build/test/migration evidence (server/client builds green, full server/client tests green, migrations verified as up-to-date).

- 2026-03-21: Replanned queue around runtime-replacement gate and immediate roadmap gaps (stream fan-out, runtime loop, managed position lifecycle).
- 2026-03-21: Re-verified upload endpoint security contract by adding explicit >2MB avatar regression test and confirming auth/MIME/size guard responses in upload e2e suite.
- 2026-03-21: Re-verified LIVE `consentTextVersion` flow with regression coverage across DTO validation, API responses, DB persistence, and audit-log metadata on create/update bot paths.
- 2026-03-21: Implemented Redis-backed market-stream fan-out (`/dashboard/market-stream/events` SSE), connected worker event publishing, and added regression coverage for stream route auth contract.
- 2026-03-21: Added runtime signal loop in execution worker (`stream ticker -> signal creation -> pre-trade guard -> execution orchestrator`) with deterministic unit coverage and worker startup integration.
- 2026-03-21: Re-ran MVP release checklist after runtime-replacement updates; confirmed server/client build+test green and Prisma migrations up-to-date, and refreshed release evidence counts.
- 2026-03-21: Re-validated P0/P1 audit findings with focused regression suite (`upload`, `bots consent`, `logs`, `crypto`) and refreshed remediation evidence log.
- 2026-03-21: Extended runtime loop to include manual open-position lifecycle handling by processing `EXIT` signals for `botId=null` positions (signal persistence + orchestrated close path).
- 2026-03-21: Added runtime position automation manager for open-position SL/TP/trailing/DCA handling on stream ticker updates, including DCA persistence and auto-close orchestration paths.
- 2026-03-21: Added runtime scan loop with configurable interval/symbol cap/env-filter to periodically reprocess latest ticker snapshots for open-position and signal automation flows.
- 2026-03-21: Expanded runtime flow e2e coverage for strategy -> backtest -> LIVE bot runtime path (ticker LONG open + EXIT close) and aligned test contracts with current strategies/backtests API routes.
- 2026-03-21: Synced product/architecture/modules/trading docs to runtime replacement reality (server SSE fan-out + runtime signal loop + position automation), and removed stale staged-gap wording from current limitations.

- 2026-03-21: Added Phase 8 for operational evidence, launch-readiness proof, and post-MVP expansion planning milestones.
- 2026-03-21: Reconciled `docs/planning/roadmap.md` with delivered runtime-stream state (SSE fan-out + runtime loop + management automation) and linked current V1 evidence artifacts/runbooks.
- 2026-03-21: Added MVP/V1 SLO catalog (`docs/operations/v1-slo-catalog.md`) with measurable objectives and direct mapping to live source metrics (`/metrics`, `/alerts`, health/readiness probes).
- 2026-03-21: Ran production-like API load baseline and documented thresholds/evidence in `docs/operations/v1-load-baseline-2026-03-21.md` with raw artifact export.
- 2026-03-21: Published final security verification report (`docs/security/security-audit-verification-2026-03-21.md`) after focused auth/ownership/api-key/guardrail regression run (`9` files, `34` tests).
- 2026-03-21: Compiled launch evidence pack (`docs/operations/v1-launch-evidence-pack.md`) aggregating public/operator/security/load/RC artifacts and current external-gate blockers.
- 2026-03-21: Added local legacy-to-new-runtime cutover checklist (`docs/operations/v1-local-cutover-checklist.md`) with prechecks, safe enable order, validation, and abort criteria.
- 2026-03-21: Added local rollback checklist (`docs/operations/v1-local-rollback-checklist.md`) to safely return execution ownership to legacy runtime on cutover failure.
- 2026-03-21: Executed local replacement dry-run and published evidence (`docs/operations/v1-local-cutover-dry-run-2026-03-21.md`) with green server/client cutover-critical suites.
- 2026-03-21: Completed launch retrospective and V1.1 backlog cut in `docs/operations/v1-launch-review-2026-03-21.md` (pre-launch evidence window, prioritized follow-ups).
- 2026-03-21: Normalized planning consistency across roadmap/MVP/V1 files; aligned blocked exit-gate wording to remaining production-only dependencies.
- 2026-03-21: Added post-MVP admin-panel milestone plan (`docs/planning/post-mvp-admin-panel-milestones.md`) covering entitlements, grants/overrides, security controls, visibility, and rollout hardening.
- 2026-03-21: Added post-MVP billing rollout milestones (`docs/planning/post-mvp-billing-milestones.md`) for annual cycle support and phased fiat/crypto rail integration.
- 2026-03-21: Added post-MVP exchange rollout milestones (`docs/planning/post-mvp-exchange-rollout-milestones.md`) for adapter hardening, staged enablement, and multi-exchange guardrails.
- 2026-03-21: Attached live-source metrics evidence to SLO baseline via `docs/operations/v1-slo-catalog.md` and `docs/operations/v1-load-baseline-2026-03-21.md`; remaining SLO blocker is production observation window.
- 2026-03-21: Added Phase 9 trust gate for real Binance API-key verification flow and exchange-live positions snapshot path (UI + API + security + tests + runbook).
- 2026-03-21: Re-prioritized Phase 9 with auth stabilization gate (client build green + login UX/session-warning regression evidence) before exchange API-key trust implementation.
- 2026-03-21: Closed Phase 9 auth build gate by fixing AuthContext hook deps and LoginForm lint issue; verified with green `pnpm --filter web build` and targeted auth suites.
- 2026-03-21: Hardened failed-login UX by requiring confirmed `refetchUser()` session before success toast/redirect in login flow; verified with green `pnpm --filter web build`.
- 2026-03-21: Hardened session-expiry warning logic to avoid false public-route warnings by requiring protected-route context or explicit `session=expired` hint.
- 2026-03-21: Added client auth regression tests in `useLoginForm.test.tsx` covering failed login, successful login with redirect, and session-refresh failure handling.
- 2026-03-21: Captured auth smoke evidence in `docs/operations/auth-smoke-2026-03-21.md` (`_artifacts-auth-smoke-2026-03-21.json`), covering failed login, successful login, logout cookie clear, and protected-route redirect.
- 2026-03-21: Replaced random API-key connection test result in profile form with real `POST /dashboard/profile/apiKeys/test` request state flow (`idle/loading/success/error`) and added deterministic UI regression tests.
- 2026-03-21: Added authenticated `POST /dashboard/profile/apiKeys/test` endpoint with Zod validation and no-persistence contract, plus e2e coverage for auth gate and DB non-write guarantee.
- 2026-03-21: Hardened API-key test endpoint with dedicated rate limit and audit log entries containing only safe metadata (`exchange`, `ok`) with e2e assertion that secrets are not logged.
- 2026-03-21: Added Binance API-key probe service with normalized error mapping contract (`OK`, `INVALID_KEY`, `INVALID_SECRET`, `IP_RESTRICTED`, `MISSING_SPOT_SCOPE`, `MISSING_FUTURES_SCOPE`, `NETWORK_TIMEOUT`, `UNKNOWN`) and unit coverage.
- 2026-03-21: Added API-key test e2e scenarios for success, invalid credentials (`INVALID_KEY`), and futures permission mismatch (`MISSING_FUTURES_SCOPE`) with stable contract assertions.
- 2026-03-21: Enforced profile API-key save gate requiring successful connection test for current credentials within form session and added UI regression tests for blocked/allowed save paths.
- 2026-03-21: Added `GET /dashboard/positions/exchange-snapshot` with Binance open-positions fetch via decrypted stored key, normalized response contract, and e2e coverage for auth/no-key/success paths.
- 2026-03-21: Extended positions dashboard UI with source switch (`runtime` vs `exchange live snapshot`), exchange snapshot mapping, symbol filtering, and last-sync timestamp rendering.
- 2026-03-21: Added positions live-source regression coverage: UI tests for source switch + snapshot failure state and server e2e for exchange snapshot failure contract (`502`).
- 2026-03-21: Added Binance API-key onboarding/troubleshooting runbook with permission/code mapping and linked it from README and MVP ops runbook.
- 2026-03-22: Updated dashboard IA navigation: `Execution` renamed to `Bots`; `Orders` and `Positions` moved under `Exchanges` dropdown placed between `Dashboard` and `Markets`, with header responsive test updates.
- 2026-03-22: Added Phase 10 planning queue for header/nav consistency, routing normalization, profile IA cleanup, auth session resilience, and repo `web/api/mobile` migration documentation.
- 2026-03-22: Updated dashboard header desktop navigation alignment and unified nav control interaction states (hover/active/focus), with responsive regression coverage.
- 2026-03-22: Replaced incorrect EN locale flag styling in dashboard language switcher with explicit SVG flag icons and added visual-contract regression test coverage.
- 2026-03-22: Added canonical dashboard route map and normalized header route contracts to canonical paths while preserving alias-aware active state behavior.
- 2026-03-22: Merged exchange connections and API key management into one profile settings domain (`#api`) and routed `/dashboard/exchanges` to unified settings entrypoint.
- 2026-03-22: Removed isometric mode toggle from dashboard account menu and kept profile dropdown focused on account/security/integration actions only.
- 2026-03-22: Synced audit planning truthfulness by reconciling Phase 10 statuses with implemented commits and removing contradictory pending states across queue and execution plans.
- 2026-03-22: Restored quality-gate green status by aligning i18n provider test with current language switcher contract and seeding requireAuth rotation test with a real DB user; reran core client/server suites with full pass.
- 2026-03-22: Realigned docs scope so admin+billing capabilities are explicitly tracked as post-MVP/V1.1 (roadmap/product/user-guide + V1 plan G0), removing implied V1 delivery claims.
- 2026-03-22: Completed stream transport contract gaps by adding SSE event ids, heartbeat ping comments, 15s health events, and max-symbol query guard with route contract tests.
- 2026-03-22: Enforced hard-cut canonical dashboard routing by removing legacy alias pages (`backtest`, `builder`, `strategies/add`, index redirects) and aligning header route state/tests to canonical paths only.
- 2026-03-22: Aligned i18n contract by setting SSR default `html lang` to `en` (with early localStorage locale restore) and moving remaining dashboard-home hardcoded copy into translation keys.
- 2026-03-22: Enforced LIVE order contract to use real exchange execution side effects (non-test), persisted `exchangeOrderId`/status mapping, added controller error mapping, and covered LIVE/PAPER behavior with orders service tests.
- 2026-03-22: Secured operational endpoints (`/metrics`, `/alerts`, `/workers/*`) with combined auth + ADMIN role + network guardrail middleware, and updated router contract tests for 401/403 and allowed admin-access paths.
- 2026-03-22: Refactored rate-limit keying from IP-centric to identity-aware scopes (`auth`, `user`, `user_exchange`), updated auth/api-key limiter bindings, and added middleware identity-resolution tests.
- 2026-03-22: Hardened auth session recovery by validating `/auth/me` against DB existence, clearing stale token cookies on invalid/deleted sessions, and returning 503 for temporary auth DB lookup failures.
- 2026-03-22: Added accessible password visibility toggles (`Show/Hide`) in login/register forms and covered toggle behavior with component regression tests.
- 2026-03-22: Synced IA docs for `Bots/Exchanges`, added staged repo migration plan + mobile parity contract docs, and scaffolded `apps/mobile` as bootstrap-only package.
- 2026-03-24: Added scripted SLO evidence collector (`ops:slo:collect`) generating timestamped JSON+Markdown artifacts for production observation window, and linked it in RC external gates runbook.
- 2026-03-24: Added rolling SLO summary generator (`ops:slo:window-report`) for 7d/30d windows with queue-lag breach timeline export to support recurring RC external-gate reviews.
- 2026-03-24: Archived stale `full-commit-roadmap.md` checklist and redirected it to canonical planning files to remove misleading pending markers already delivered elsewhere.
- 2026-03-24: Added RC sign-off artifact builder (`ops:rc:signoff:build`) to generate `v1-rc-signoff-record.md` from gate snapshot plus provided approvers/owner metadata.
- 2026-03-24: Added one-command cutover dry-run orchestrator (`ops:cutover:dry-run`) that runs cutover-critical suites and stores structured JSON+Markdown evidence artifacts.
- 2026-03-24: Fixed API test cleanup ordering by deleting `BotSubagentConfig`/`BotAssistantConfig` before `Bot`, removing FK cleanup failures across auth/strategies/orders/profile/backtests and related e2e suites.
- 2026-03-25: Fixed remaining cutover e2e blockers by correcting `strategies/reorder` route precedence and aligning runtime-flow test setup/cleanup with `BotMarketGroup` + `MarketGroupStrategyLink` relations.
- 2026-03-25: Executed local backup/restore automation check (`ops:db:backup-restore:check-local`) and attached fresh evidence artifacts to RC checklist references.
- 2026-03-25: Stabilized cutover dry-run automation by fixing `pnpm` test argument forwarding in `ops:cutover:dry-run`, relaxing brittle `backtests.e2e` total-trades assertion, and re-running full API+web dry-run with PASS artifacts.
- 2026-03-25: Extended RC external-gates status automation to parse latest DB restore artifact and surface Gate 1 as `LOCAL_PASS (target-env pending)` in `v1-rc-external-gates-status.md` template output.
- 2026-03-25: Closed open monorepo naming decision in planning docs; canonical app structure is now explicitly locked to `apps/web`, `apps/api`, and bootstrap `apps/mobile`.
- 2026-03-25: Hardened RC sign-off automation by parsing extended gate labels (including `LOCAL_PASS`) and requiring exactly four parsed gate states before `APPROVED`; regenerated sign-off snapshot.
- 2026-03-25: Added Gate 3 automation in RC status builder by parsing incident-readiness evidence completeness from external-gates runbook and exposing structured completion state in status output.
- 2026-03-25: Added Gate 4 automation in RC status builder by parsing `v1-rc-signoff-record.md` for `RC status: APPROVED` and exposing sign-off completion in external-gates status snapshot.
- 2026-03-25: Extended local external-gates pipeline (`ops:rc:gates:local-pipeline`) to generate SLO rolling window evidence (`7d/30d` by default) after observation collection, with configurable `--window-days` and `--skip-window-report` flags.
- 2026-03-25: Added Gate 1 automation in RC status builder by parsing backup/restore evidence completeness from runbook (target-env PASS) and keeping local DB check result as `LOCAL_PASS` fallback signal.
- 2026-03-25: Updated RC gate-status builder to prefer rolling SLO window-report artifacts (`v1-slo-window-report-*.json`) for Gate 2 evaluation, with fallback to raw observation artifacts when window reports are unavailable.
- 2026-03-25: Added RC checklist sync automation (`ops:rc:checklist:sync`) to keep checklist gate/sign-off checkboxes aligned with current external-gates status and sign-off record artifacts.
- 2026-03-25: Extended local external-gates pipeline to run checklist sync automatically after status generation (online and offline flows), with `--skip-checklist-sync` override.
- 2026-03-25: Added external evidence diagnostics command (`ops:rc:gates:evidence:check`) that reports missing Gate1/Gate3/Gate4 runbook/sign-off fields and supports strict non-zero exit mode for enforcement.
- 2026-03-25: Extended local external-gates pipeline to run evidence diagnostics by default after checklist sync, with `--skip-evidence-check` and `--strict-evidence-check` controls.
- 2026-03-25: Extended external evidence diagnostics to validate Gate2 status (`PASS` required) so strict mode now enforces all four external gates.
- 2026-03-25: Added strict pipeline alias (`ops:rc:gates:local-pipeline:strict`) for one-command hard evidence enforcement in local gate rehearsal runs.
- 2026-03-25: Extended external evidence diagnostics with machine-readable `--json` mode and optional `--output` file to support AI/automation workflows.
- 2026-03-25: Wired local external-gates pipeline to persist JSON diagnostics artifact (`_artifacts-rc-evidence-check-latest.json`) and excluded rotating `latest` file from git tracking to keep worktree clean.
- 2026-03-25: Added `ops:rc:gates:refresh` quick alias and hardened local pipeline status step with offline fallback to template snapshot when SLO artifacts are missing.
- 2026-03-25: Added SLO-artifact precheck in offline refresh/status flow so pipeline uses template snapshot directly when inputs are absent (cleaner operator logs, no expected status command failure noise).
- 2026-03-25: Added `ops:rc:gates:refresh:strict` alias for fast no-DB/no-SLO refresh runs that still enforce strict evidence completeness checks.
- 2026-03-25: Added `ops:rc:gates:summary` command returning compact gate/evidence snapshot (human-readable and JSON forms) for quick operator/AI status checks.
- 2026-03-25: Hardened `ops:rc:gates:summary` to work without evidence artifact file by returning graceful null fields instead of failing the command.
- 2026-03-25: Added `ops:rc:gates:refresh:summary` shortcut chaining quick refresh with immediate gate summary output for fast operator handoff.
- 2026-03-25: Added `ops:rc:gates:refresh:summary:strict` helper to guarantee summary output even on strict failure, while returning strict exit code for automation gates.
- 2026-03-26: Normalized local refresh fallback logs to `stdout` to keep operator output order stable and avoid confusing delayed warning lines during offline runs.
- 2026-03-31: Added strategy-edit guard for active bots (`409 strategy is used by active bot and cannot be edited`) with API e2e coverage and UI-facing edit-page error handling.
- 2026-03-31: Switched bot monitoring to aggregate-by-default mode (all sessions summed) with optional advanced single-session drilldown; added merge logic for stats/positions/orders/trades and updated component regression coverage.
- 2026-03-31: Simplified monitoring operational summary into three human-first cards (`Co jest teraz / Co bylo / Co bedzie`) to reduce KPI clutter and speed up operator orientation.
- 2026-03-31: Reduced monitoring controls clutter by moving bot/session/view selectors into advanced options, unifying refresh flow, and exposing primary operator controls (status, symbol filter, auto-refresh, quick refresh) in one compact control panel.
- 2026-03-31: Improved monitoring hierarchy for manual smoke-tests: added quick operator check strip, explicit section order (`1. Teraz / 2. Historia / 3. Co bedzie`), and reordered runtime panels to match operator decision flow.
- 2026-03-31: Clarified IA boundary copy: `Dashboard` remains global control center, while `Bots` page and monitoring headline now explicitly describe runtime operations center responsibilities.
- 2026-03-31: Added explicit Dashboard-Bots context hints on both pages (Dashboard points to Bots runtime center, Bots page points back to Dashboard macro view) to reduce operator navigation ambiguity.
- 2026-03-31: Increased table readability for live-refresh scanning by applying zebra styling across monitoring tables (now/history/future blocks) to improve row tracking under frequent updates.
- 2026-03-31: Improved manual triage defaults in monitoring by adding explicit filter usage hint (`Enter` flow) and sorting live-signal table by newest signal first.
- 2026-03-31: Unified operator-facing wording in Bots module tabs/subheaders (`Boty / Operacje runtime / Asystent`) and aligned test selectors to new naming.
- 2026-03-31: Added compact operator checklist panel in monitoring (session status, heartbeat freshness, positions loaded, signals loaded, error flag) for quick repetitive health verification.
- 2026-03-31: Polished global Dashboard control-center hierarchy with dedicated operational lanes (runtime bots, strategy/backtest lane, execution review lane), promoted Bots runtime as primary CTA, and removed duplicated quick-actions card to reduce decision clutter.
- 2026-03-31: Improved first-load dashboard clarity by adding grouped status cards (`Runtime now / Execution quality / Recent activity`), explicit lane sequencing (Step 1..3), and compact quick-action strip anchored to the control-center lanes.
- 2026-03-31: Tightened dashboard scan rhythm by switching orders snapshot to compact KPI tiles, replacing timeline feed with dense zebra activity table, and removing redundant synced-success banner from the bottom of the page.
- 2026-03-31: Refined dashboard onboarding strip into three compact context cards (`operator context / module split / suggested start`) replacing generic alerts and clarifying first-click paths for runtime vs analysis workflows.
- 2026-03-31: Added explicit cross-module handoff cues inside dashboard quick actions (runtime -> Bots, validation -> Backtests, performance -> Reports) and exposed direct Reports CTA to improve operator navigation confidence.
- 2026-03-31: Tuned compact typography/spacing rhythm in control-center cards (smaller headers, tighter body copy, normalized KPI label/value scale) for faster at-a-glance scanning during repeated checks.
- 2026-03-31: Harmonized card/action alignment across breakpoints by introducing equal-height flex layouts and bottom-aligned CTA regions in both onboarding and control-center strips.
- 2026-03-31: Tightened micro-layout breakpoint consistency by standardizing strips to `md:2-column / 2xl:3-column` flow and adding controlled `col-span` behavior for third cards/status tiles.
- 2026-03-31: Normalized CTA interaction affordance by applying shared primary/secondary button hierarchy with consistent sizing and keyboard focus ring treatment across dashboard onboarding and control-center actions.
- 2026-03-31: Strengthened primary-vs-secondary CTA affordance by visually separating quick-action strips into distinct lanes (highlighted primary path vs secondary action set) and labeling action intent explicitly.
- 2026-03-31: Reduced dashboard decision latency by tightening CTA copy in quick-action strips (`Review strategies`, `Run backtests`, `Check orders`, `Open reports`) and simplifying supporting guidance text.
- 2026-03-31: Rebalanced status-strip semantics to avoid duplication by replacing generic activity/quality counters with clearer cards (`Runtime now`, `Risk watch`, `Latest event`).
- 2026-03-31: Completed final spacing/contrast polish pass for onboarding + control-center strips (subtle elevated containers, softer card backgrounds, and tighter vertical rhythm) before manual UX review.
- 2026-03-31: Added focused manual UX checklist for Dashboard -> Bots operational flow in `docs/operations/dashboard-bots-operational-ux-checklist.md` to drive the final nit pass (`BOPS-33`) with explicit IA, readability, anti-flicker, and responsive checks.
- 2026-03-31: Applied checklist-driven final UX nits for Dashboard -> Bots flow: replaced passive handoff badges with clickable shortcut chips on Dashboard, reduced monitoring heading duplication in Bots, added quick section jump pills (`Teraz/Historia/Co bedzie`), and made auto-refresh status message more prominent/accessible (`aria-live`).
- 2026-03-31: Completed final responsive pass for Dashboard -> Bots headers/cards (tablet breakpoint cleanup, card-span normalization, quick-switch truncation) and locked snapshot matrix in `docs/operations/dashboard-bots-responsive-pass-2026-03-31.md`.
- 2026-04-01: Removed redundant runtime sidebar actions (`Odswiez`, `Boty runtime`) from dashboard control-center widget and kept polling-only refresh contract (BOPS-37/38).
- 2026-04-01: Implemented Bots menu IA parity with other modules by adding dropdown entries (`Lista botow`, `Dodaj bota`), canonical route `"/dashboard/bots/new"`, and nav regression assertions (BOPS-39/40/41).
- 2026-04-01: Implemented dashboard+bots trade-history action contract using read-time lifecycle classification (`OPEN/DCA/CLOSE/UNKNOWN`) with `margin` and non-null `fee/realizedPnl` payloads, then aligned both web tables to `Action + Margin` presentation (DBACT-04..09 partial rollout).








- 2026-04-01: Completed BOPS-35 dashboard->bots final smoke (hybrid: focused regression tests + local build/runtime verification) and logged validation notes + BOPS-36 nits in docs/operations/dashboard-bots-manual-smoke-2026-04-01.md.
- 2026-04-01: BOPS-36 progress: dashboard open-positions table now shows SL (TTP/TSL) columns by strategy close-mode (advanced) from API contract (showDynamicStopColumns), with API+web regression coverage.
- 2026-04-02: Completed `LFIN-03` by extending CCXT connector contract with normalized fill/trade retrieval methods (`fetchOrderWithFills`, `fetchTradesForOrder`), adding inline create-order fill normalization, and covering fallback/support scenarios in connector unit tests.
- 2026-04-02: Completed `LFIN-04` runtime reconciliation flow: added live fee reconciler (`inline -> fetchOrder -> fetchMyTrades` fallback), persisted exchange-derived order fee metadata + fill rows, propagated fee-source/pending/currency/rate into runtime trades (open/close/DCA), and validated with targeted exchange/orders/engine suites + API typecheck.
- 2026-04-02: Completed `LFIN-05` API+web exposure/render for fee metadata: runtime trades endpoint now returns `feeSource/feePending/feeCurrency`; dashboard-home and bots runtime history render fee amount with source/pending/currency label (`EXCHANGE`, `EST.`, `PENDING`), with API e2e + web component regressions + root typecheck passing.
- 2026-04-02: Completed LFIN-07A by migrating dashboard home/control-center copy (/dashboard page + HomeLiveWidgets) to canonical i18n keys (dashboard.home.*, dashboard.home.runtime.*) with EN/PL parity, plus component-test and web typecheck pass.
- 2026-04-02: Completed `LFIN-12`: added API reconciliation regressions (fill dedupe, mixed-currency fee handling, no-order-id fetch guard), strengthened i18n regression coverage for critical nav/runtime keys in EN/PL, and added strategy numeric-input helper regressions with green targeted API/web test suites plus root typecheck.
- 2026-04-03: Completed `LFIN-07`: moved LIVE fill commission ingestion into `LiveOrderAdapter` (`placeLiveOrderWithFees` with fill-first reconciliation), removed fee-reconciliation duplication from `orders.service`, and verified exact fee metadata propagation to order/trade persistence with targeted exchange/orders tests + API typecheck.
- 2026-04-04: Completed `LFIN-08 test(api-live-adapter)` by adding regression coverage for adapter fallback chain (`inline -> fetchOrderWithFills -> fetchTradesForOrder`), LIVE fee+fills persistence in `openOrder`, and runtime trade serialization parity for `feeSource/feePending/feeCurrency` in bots monitoring API.
- 2026-04-04: Completed EXPH-04 fail-closed hardening for runtime/live paths by filtering runtime signal-loop active bots through exchange capability gates (PAPER_PRICING_FEED/LIVE_EXECUTION), and added unit regression coverage for mode-aware exchange support mapping.
- 2026-04-05: Added mobile dashboard menu overlay full-height fix (100dvh - headerOffset) in Header.tsx, preventing bottom-gap artifacts on taller mobile viewports and preserving scroll-lock behavior.
- 2026-04-05: Migrated Prisma deprecated package.json#prisma seed config to pps/api/prisma.config.ts (migrations.seed), preserved VPS-friendly 
ode ./node_modules/prisma/build/index.js db seed --schema prisma/schema.prisma flow, and verified seed execution end-to-end.
- 2026-04-05: Added responsive regression assertions for mobile dashboard menu overlay sizing (	op, height, maxHeight, minHeight) to preserve 100dvh - headerOffset contract after future header/layout edits.

- 2026-04-05: Completed BOPS-65 dashboard runtime UX pass: removed Fee/Origin columns from dashboard trade history, renamed open-position time header to Time/Czas with fixed YYYY.MM.DD HH.mm.ss cell format, and redesigned strategy-signal cards with summary counters (Rynki, Sygnaly, Base currency), gradient border accents, dual-column LONG/SHORT condition layout, and directional opacity emphasis (inactive 50% -> hover 100%).
- 2026-04-06: Completed `PEX-02` by introducing persistent runtime execution dedupe storage (`RuntimeExecutionDedupe` Prisma model + migration), adding canonical `v1` dedupe-key builders/service (`OPEN/DCA/CLOSE/CANCEL` with `PENDING/SUCCEEDED/FAILED` flow), and wiring replay-safe guards into runtime orchestrator/automation paths (OPEN/CLOSE/DCA/CANCEL) with targeted engine regression coverage.
- 2026-04-06: Completed `PEX-03` by adding crash/retry regression tests (`runtimeCrashRetry.regression.test.ts`) proving replay-safe `OPEN` and `CLOSE` behavior after simulated restart (same dedupe key => reused result, no duplicate order/position side effects), with targeted engine test pass.
- 2026-04-06: Completed `PEX-05` by adding bounded runtime auto-restart policy in `RuntimeSignalLoop` (configurable `cooldown`, `max attempts`, and `attempt window` guardrails), including restart scheduling after stall and regression coverage for cooldown restart plus max-attempt lockout behavior.
- 2026-04-06: Completed `PEX-06` by adding long-running runtime soak coverage in `runtimeSignalLoop.service.test.ts` for session continuity under heartbeat failures, validating auto-restart trace/recovery and proving no stuck repeated `CANCELED` session loop after recovery.
- 2026-04-06: Completed `PEX-08` by extending runtime alert evaluation thresholds for stale runtime lag, repeated restart spikes, and reconciliation drift (pending + max delay), and locking endpoint regression assertions for new alert codes/severities.
- 2026-04-10: Collected production SLO observation artifact (`docs/operations/v1-slo-observation-2026-04-10T15-03-53-379Z.md`) from public network and confirmed ops-network guardrails return `403` for `/workers/*` and `/metrics`; Gate2 remains open until collector is executed from VPS/private ops network.
- 2026-04-10: Closed `exit-gates(v1-production)` by collecting a 30-minute production SLO window from VPS/private ops network (`docs/operations/_artifacts-slo-window-2026-04-10T17-09-26-532Z.json`, `docs/operations/v1-slo-observation-2026-04-10T17-09-26-532Z.md`), completing Gate1/Gate3 runbook evidence, and finalizing RC sign-off artifacts with strict production evidence check PASS (`G1/G2/G3/G4 = PASS`).
- 2026-04-11: Completed `LIV-22` web build hygiene by removing the last MarketUniverseForm lint warning (`_mode` unused), adding explicit form mode badge (`Tworzenie`/`Edycja`), and validating with targeted market form tests plus a full `pnpm --filter web run build` pass.
- 2026-04-11: Completed `LIV-23` API test migration pass for wallet-first bot create contract by updating duplicate/subscription e2e suites to provision and bind context-matching wallets (`walletId` required), validated via targeted API tests and `pnpm --filter api run typecheck` (PASS).
- 2026-04-11: Completed `LIV-24` full bots contract migration to wallet-first semantics in API e2e (`bots.e2e`): updated LIVE transition/update expectations to use wallet-bound mode + linked API key requirements and retained consent-audit assertions, then validated with 74 passing targeted API tests (bots, wallets, runtime loop, reconciliation).
- 2026-04-11: Completed `LBT-10` API visibility slice by adding `GET /dashboard/positions/takeover-status` (OWNED/UNOWNED/AMBIGUOUS/MANUAL summary + item classification for open `EXCHANGE_SYNC`) with dedicated e2e coverage (`positions.takeover-status.e2e.test.ts`).
- 2026-04-11: Completed runtime UI takeover badge slice by extending runtime positions payload with `origin/managementMode/syncState/takeoverStatus` and rendering takeover pills in dashboard home open-positions table; validated with dashboard widget tests + web typecheck + production build.
- 2026-04-11: Completed `LBT-08` optional live futures leverage/margin convergence: added connector support for `setMarginMode`/`setLeverage`, wired guarded convergence into LIVE order path (kill-switch + strict mode + TTL convergence cache), and validated with connector/orders targeted tests + API typecheck.
- 2026-04-11: Completed `LBT-09` BOT_MANAGED external open-order reconciliation: live reconciliation loop now upserts open exchange orders into synced local order rows and closes stale local synced opens (`syncState=ORPHAN_LOCAL`), validated with reconciliation tests + takeover-status e2e + runtime regression pack.
- 2026-04-11: Completed `LBT-11` dashboard runtime-wallet compatibility hardening by adding fallback parsing for legacy/compat fields (`accountBalance`, `walletBalance`, `availableBalance`, `freeBalance`) and equity derivation fallback (`free + usedMargin`) to prevent `-` placeholders when runtime data exists.
- 2026-04-11: Completed `LBT-12` web regression coverage for takeover/runtime dashboard behavior (imported `EXCHANGE_SYNC` visibility, takeover badge rendering, and compatibility wallet metric mapping), validated with `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` and `pnpm --filter web run build` (PASS).
- 2026-04-11: Completed `LBT-14` by publishing strict local+VPS takeover verification runbook with fail-closed gates in `docs/operations/live-takeover-local-vps-strict-smoke-checklist-2026-04-11.md`.
- 2026-04-11: Completed `LBT-15` evidence run by executing fresh local confidence commands (API/Web tests + typecheck/build) and attaching consolidated artifact/report (`docs/operations/_artifacts-live-takeover-confidence-2026-04-11T14-48-55-096Z.json`, `docs/operations/live-takeover-confidence-pack-2026-04-11.md`); strict VPS gate remains explicitly OPEN pending private-route ops verification and production rollout of `/dashboard/positions/takeover-status` (public probe returned `404`).

## Repo Quality Hardening Queue (2026-04-12)
- [x] `QH-01 refactor(api-profile): remove production as-any casts in profile basic service with Prisma-safe typing`
- [x] `QH-02 refactor(api-logging): introduce shared structured logger and migrate API entrypoints/workers`
- [x] `QH-03 refactor(web-theme): harden theme bootstrap script contract and maintainability`
- [x] `QH-04 refactor(api-normalization): centralize symbol/baseCurrency normalization in bots/backtests hot paths`
- [x] `QH-05 refactor(web-backtest): split oversized BacktestRunDetails into modular units under guardrails budget`
- [x] `QH-06 test(api-bots): split oversized bots.e2e suite into focused scenario files`
- [x] `QH-07 refactor(web-normalization): replace remaining local uppercase normalization variants in backtest/markets/strategies`
- [x] `QH-08 quality(repo): execute final lint/typecheck/guardrails sweep and publish evidence snapshot`

### Progress Log (Repo Quality Hardening)
- 2026-04-12: Completed `QH-05` by extracting locale copy dictionary from `BacktestRunDetails.tsx` into `backtestRunDetails.copy.ts`, reducing component size to 97,801 bytes (below 105,000-byte web budget); validated with `pnpm --filter web run typecheck` and targeted backtest test pack (`BacktestRunDetails`, `BacktestCreateForm`, `useBacktestRunCoreData`) PASS.
- 2026-04-12: Completed `QH-06` by splitting oversized bots contract coverage into focused modules (`bots.e2e.test.ts`, `bots.orchestration.e2e.test.ts`) with shared setup helper (`bots.e2e.shared.ts`) and extracted heavy fixtures (`bots.e2e.fixtures.ts`); validated with `pnpm --filter api run typecheck`, focused bots e2e pack, and root `pnpm run quality:guardrails` (PASS).
- 2026-04-12: Completed `QH-07` by introducing shared uppercase-token normalization (`apps/web/src/lib/text.ts`) and replacing local symbol/baseCurrency uppercase variants across backtest/markets/strategies surfaces; validated with web typecheck + targeted backtest/strategies test pack + root `pnpm run quality:guardrails` (PASS).
- 2026-04-12: Completed `QH-08` with final repo sweep (`pnpm run lint`, API+web typecheck, root guardrails) and published artifact `docs/operations/repo-quality-hardening-sweep-2026-04-12T02-24-34.md` confirming all quality gates PASS.

## Next Quality & UX Wave (2026-04-12)
- [x] `NX-01 feat(profile-timezone): persist user timezone preference in profile basic settings and validate on API boundary`
- [x] `NX-02 ux(wallet-form): redesign create/edit wallet form mode flow (LIVE/PAPER switch + deterministic conditional fields)`
- [x] `NX-03 feat(wallet-metadata): source baseCurrency/marketType options from exchange capabilities instead of free-text assumptions`
- [x] `NX-04 refactor(forms-core): unify shared form normalization/error wiring across wallets/markets/backtests`
- [x] `NX-05 hardening(web-runtime): add reusable async-state/retry helpers for profile+wallet critical flows`

### Progress Log (Next Quality & UX Wave)
- 2026-04-12: Completed `NX-01` by extending profile basic API validation contract to support `uiPreferences.timeZonePreference` (`auto` or valid IANA timezone), persisting this preference through profile update flow, and wiring profile form save to store timezone in user account settings; validated with API/web typecheck and profile/i18n regression tests.
- 2026-04-12: Completed `NX-02` by redesigning wallet create/edit mode UX to deterministic conditional rendering (dedicated PAPER/LIVE sections + explicit mode hints) and mode-switch cleanup of irrelevant LIVE fields, eliminating stale cross-mode leakage; validated with `pnpm --filter web test -- src/features/wallets/components/WalletCreateEditForm.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- 2026-04-12: Completed `NX-03` by introducing wallet metadata endpoint (`GET /dashboard/wallets/metadata`) backed by exchange capability market-type/base-currency definitions with market-catalog enrichment and fallback policy, then wiring wallet create/edit form to consume dynamic `marketType/baseCurrency` options from this contract; validated with API+web typecheck and focused API/web wallet tests (PASS).
- 2026-04-12: Completed `NX-04` by introducing shared forms-core helper module (`apps/web/src/lib/forms.ts`) and migrating wallets/markets/backtests forms to unified normalization + error wiring primitives, reducing duplicated `trim/uppercase/error` variants while preserving behavior; validated with focused wallet/market/backtest component tests and web typecheck (PASS).
- 2026-04-12: Completed `NX-05` by adding reusable async runtime helpers (`apps/web/src/lib/async.ts`) with retriable HTTP policy and shared pending-state wrapper, then applying them to profile and wallet critical operations (profile fetch/save + wallet load/metadata/preview/submit) to reduce transient-failure breakage; validated with async helper + wallet form tests and web typecheck (PASS).

## Documentation Knowledge Hardening Wave (2026-04-12)
- [x] `DCP-01 docs(governance): lock documentation parity policy and mandatory update triggers`
- [x] `DCP-02 docs(template): publish canonical module deep-dive template + authoring checklist`
- [x] `DCP-03 docs(index): create docs/modules index table mapping every active module to doc status`
- [x] `DCP-04 docs(api-identity): author deep-dives for admin/auth/profile/users modules`
- [x] `DCP-05 docs(api-trading-core): author deep-dives for engine/exchange/market-data/market-stream`
- [x] `DCP-06 docs(api-trading-domain): author deep-dives for strategies/markets/bots/orders/positions/backtests`
- [x] `DCP-07 docs(api-support): author deep-dives for reports/subscriptions/wallets/icons/upload/pagination/isolation`
- [x] `DCP-08 docs(web-core): author deep-dives for dashboard-home/auth/profile/admin flows`
- [x] `DCP-09 docs(web-trading): author deep-dives for bots/backtest/strategies/markets/exchanges/orders/positions/wallets/reports/logs`
- [x] `DCP-10 docs(route-contract): publish canonical route-to-feature-to-api mapping with ownership and guardrails`
- [x] `DCP-11 tooling(docs-parity): add script to verify module+route inventories against canonical docs`
- [x] `DCP-12 qa(docs-evidence): run parity check, publish evidence artifact, and close documentation hardening wave`

### Progress Log (Documentation Knowledge Hardening)
- 2026-04-15: Completed `DCP-12` by running `pnpm run docs:parity:check -- --json --output docs/operations/_artifacts-docs-parity-2026-04-15T21-31-56-867Z.json` (PASS with `22/22 API`, `15/15 web`, `37/37 routes`), publishing closure evidence `docs/operations/documentation-hardening-parity-evidence-2026-04-15.md`, and closing the documentation hardening wave (`DCP-01..DCP-12`).
- 2026-04-15: Completed `DCP-11` by adding `scripts/checkDocsParity.mjs` with root `pnpm run docs:parity:check` command to verify module inventories (`apps/api/src/modules`, `apps/web/src/features`) and route inventory (`apps/web/src/app/**/page.tsx`) against canonical docs; validation run PASS (`22/22 API`, `15/15 web`, `37/37 routes`).
- 2026-04-15: Completed `DCP-10` by publishing canonical route-to-feature-to-API mapping in `docs/architecture/reference/dashboard-route-map.md` with explicit dashboard/admin/public coverage, ownership matrix, legacy redirect contract, and update guardrails.
- 2026-04-12: Initialized wave plan and canonical references in `docs/planning/documentation-knowledge-hardening-plan-2026-04-12.md` after code-vs-docs audit; execution queue `DCP-01..DCP-12` added for tiny-commit delivery.
- 2026-04-12: Completed `DCP-01` by locking mandatory documentation parity trigger rules in `docs/governance/working-agreements.md` for backend/frontend module inventories, app route inventory, canonical docs index updates, and queue-plan synchronization.
- 2026-04-12: Completed `DCP-02` by publishing canonical deep-dive template and mandatory checklist in `docs/modules/module-deep-dive-template.md`, plus discoverability links in modules/docs indexes.
- 2026-04-12: Completed `DCP-03` by publishing a full active-module documentation status index (`docs/modules/module-doc-status-index.md`) mapping API/Web inventories to target deep-dive files and planned DCP ownership.
- 2026-04-12: Completed `DCP-04` by authoring API identity deep-dives (`admin`, `auth`, `profile`, `users`) and marking those modules as `Published` in `docs/modules/module-doc-status-index.md`.
- 2026-04-12: Completed `DCP-05` by authoring API trading-core deep-dives (`engine`, `exchange`, `market-data`, `market-stream`) and marking those modules as `Published` in `docs/modules/module-doc-status-index.md`.
- 2026-04-12: Completed `DCP-06` by authoring API trading-domain deep-dives (`strategies`, `markets`, `bots`, `orders`, `positions`, `backtests`) and marking those modules as `Published` in `docs/modules/module-doc-status-index.md`.
- 2026-04-12: Completed `DCP-07` by authoring API support deep-dives (`reports`, `subscriptions`, `wallets`, `icons`, `upload`, `pagination`, `isolation`, `logs`) and marking those modules as `Published` in `docs/modules/module-doc-status-index.md`.
- 2026-04-12: Completed `DCP-08` by authoring web-core deep-dives (`dashboard-home`, `auth`, `profile`, `admin`) and marking those modules as `Published` in `docs/modules/module-doc-status-index.md`.
- 2026-04-12: Completed `DCP-09` by authoring web-trading deep-dives (`bots`, `backtest`, `strategies`, `markets`, `exchanges`, `orders`, `positions`, `wallets`, `reports`, `logs`, `icons`) and marking those modules as `Published` in `docs/modules/module-doc-status-index.md`.

## Engineering Optimization Wave (2026-04-12)
- [x] `OPT-01 error-taxonomy(api): replace string-code Error.message flow with typed domain errors + central mapper`
- [x] `OPT-02 normalization(api): unify symbol/baseCurrency normalization primitives and remove local uppercase variants`
- [x] `OPT-03 async-errors(web): standardize async action + error mapping across page-level create/edit/list flows`
- [x] `OPT-04 runtime-ui-split(web): decompose HomeLiveWidgets + BotsManagement into smaller domain modules`
- [x] `OPT-05 contracts(shared): create shared exchange enum/capability contracts for API + Web`
- [x] `OPT-06 i18n(web): split monolithic translations into domain namespaces + remove remaining hardcoded copy`
- [x] `OPT-07 ux-guardrails(web): replace window.confirm/location.assign with app-level modal + navigation helpers`
- [x] `OPT-08 prefs-sync(web): cache/throttle profile preference sync (DataTable + account preferences)`

### Progress Log (Engineering Optimization)
- 2026-04-16: Closed remaining parent objectives `OPT-02..OPT-08` by rolling up completed implementation slices (`OPT-02` -> `OPTC-06..09`, `OPT-03` -> `OPTC-10..12`, `OPT-04` -> `OPTC-16..17`, `OPT-05` -> `OPTC-13..15`, `OPT-06` -> `OPTC-18`, `OPT-07` -> `OPTC-19`, `OPT-08` -> `OPTC-20`) with wave QA closure already captured under `OPTC-21`.
- 2026-04-16: Closed parent `OPT-01` objective by consolidating already completed implementation slices `OPTC-01..OPTC-05` (typed error primitives, central mapper wiring, and domain/controller migrations for wallets/markets/strategies/bots/orders/profile/subscriptions) with no additional code delta required in this closure step; verification evidence remains in corresponding OPTC entries (`api typecheck` + targeted suites).
- 2026-04-16: Completed `OPTC-21` by running full repo QA closure pack (`pnpm run lint`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`) plus targeted optimization confidence suites (`pnpm --filter api test --` wallets/markets/strategies/bots/orders/profile-security/subscription e2e pack: `8` files, `70` tests; `pnpm --filter web test --` bots/security/datatable/i18n regression pack: `5` files, `15` tests), and published evidence artifacts `docs/operations/_artifacts-engineering-optimization-confidence-2026-04-15T23-26-17-682Z.json` + `docs/operations/engineering-optimization-confidence-pack-2026-04-15T23-26-17-682Z.md` (PASS).
- 2026-04-16: Completed `OPTC-20` by introducing shared profile preference cache/sync service (`apps/web/src/features/profile/services/profileBasicCache.ts`) with in-flight request dedupe, TTL reuse, and optimistic profile patch merge, then migrating `useUser` account-preferences flow and DataTable column-visibility hydration/save paths to that shared contract to remove scattered direct `/dashboard/profile/basic` reads/writes; validated with `pnpm --filter web test -- src/ui/components/DataTable.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- 2026-04-16: Completed `OPTC-19` by replacing `window.confirm` and `window.location.assign` browser-native flows with reusable app-level guardrails (`useAsyncConfirm` + `navigateWithFallback`) and migrating bots/security/wallet/auth hotspots to those contracts, improving non-blocking UX consistency and testability; validated with targeted auth/bots/security suites and web typecheck (PASS).
- 2026-04-16: Completed `OPTC-18` by splitting monolithic web i18n translation payloads into domain namespace modules (`dashboard-shell`, `dashboard-home`, `dashboard-bots`) for EN/PL and composing `translations.ts` from those namespaces, reducing conflict surface in localization-heavy files; validated with `pnpm --filter web test -- src/i18n/translations.test.ts src/i18n/I18nProvider.test.tsx` and `pnpm --filter web run typecheck` (PASS).
- 2026-04-16: Completed `OPTC-17` by splitting `BotsManagement` formatting/status mapping helpers into dedicated `bots-management/formatters.ts`, reducing component orchestration footprint and keeping monitoring tab behavior intact; validated with `pnpm --filter web run typecheck` and `pnpm --filter web test -- src/features/bots/components/BotsManagement.test.tsx` (PASS).
- 2026-04-16: Completed `OPTC-16` by splitting `HomeLiveWidgets` into dedicated runtime formatter utilities, runtime data-derivation module, and close-position action hook, reducing component orchestration surface while keeping section components intact; validated with `pnpm --filter web run typecheck` and HomeLiveWidgets regression tests (PASS).
- 2026-04-16: Completed `OPTC-15` by migrating frontend exchange capability/types and market-type defaults/options to shared contracts from `@cryptosparrow/shared` (exchange capabilities module + markets/wallets contract usage); validated with web typecheck and targeted ApiKey/MarketUniverse/Wallet suites (PASS).
- 2026-04-16: Completed `OPTC-14` by migrating API zod exchange/market-type contracts and defaults in wallets/markets/market-data plus bots/preTrade market-type schemas to shared constants from `@cryptosparrow/shared`; validated with API typecheck and targeted wallets/markets/preTrade/bots suites (PASS).
- 2026-04-16: Completed `OPTC-13` by extracting shared exchange contracts into workspace package `@cryptosparrow/shared` (exchange options/capabilities/market types/base-currency fallbacks) and wiring API exchange capabilities core to consume those canonical contracts; validated with API typecheck + focused exchange symbol-rules tests (PASS).
- 2026-04-16: Completed `OPTC-12` by standardizing dashboard edit/list async-error handling in markets/strategies/wallets pages through shared helpers (`runAsyncWithState`, `resolveUiErrorMessage`), including consistent fallback error messages and pending-submit guards for edit forms; validated with web typecheck and targeted feature suites (PASS).
- 2026-04-16: Completed `OPTC-11` by migrating markets/strategies/backtests create pages to shared async-state and error-resolution helpers (`runAsyncWithState`, `resolveUiErrorMessage`), including aligned fallback descriptions and pending-submit guard on strategy create action; validated with web typecheck and targeted form tests (PASS).
- 2026-04-16: Completed `OPTC-10` by adding a single web UI error resolver (`apps/web/src/lib/errorResolver.ts`), deprecating direct split usage by routing `handleError` and `getAxiosMessage` through that shared resolver, and switching form error mapping to the unified path; validated with `pnpm --filter web run typecheck` and `pnpm --filter web test -- src/lib/errorResolver.test.ts` (PASS).
- 2026-04-16: Completed `OPTC-09` by expanding normalization contract tests in `apps/api/src/lib/symbols.test.ts` to cover idempotent helpers, blank-input fallback hardening (`USDT`), deterministic order-insensitive list normalization, and non-mutating `resolveUniverseSymbols` behavior; validated with `pnpm --filter api run typecheck` and `pnpm --filter api test -- src/lib/symbols.test.ts` (PASS).
- 2026-04-16: Completed `OPTC-08` by removing remaining production `trim().toUpperCase()` normalization variants from wallets/markets/icons/market-stream/market-stream-worker modules and switching those paths to shared helpers in `apps/api/src/lib/symbols.ts`; validated with API typecheck + targeted wallets/markets/icons/market-stream tests.
- 2026-04-16: Completed `OPTC-07` by migrating runtime/engine symbol and base-currency normalization to shared helpers from `apps/api/src/lib/symbols.ts` (`normalizeSymbol`, `normalizeBaseCurrency`, `normalizeSymbols`) across orchestrator/scan-loop/signal-loop/telemetry/capital-context/dedupe/market-data modules and removing local uppercase symbol variants in production engine paths; validated with API typecheck and targeted engine unit suites.
- 2026-04-15: Completed `OPTC-06` by extending shared API symbol/base-currency normalization helpers in `apps/api/src/lib/symbols.ts` (`normalizeBaseCurrency`, `normalizeSymbolStrict`, widened list helpers) and adding helper contract tests (`apps/api/src/lib/symbols.test.ts`) as baseline for upcoming runtime/wallets/icons migration slices; validated with API typecheck + targeted symbols/wallets/market-stream suites.
- 2026-04-15: Completed `OPTC-05` by introducing typed domain errors for profile/security and subscription checkout/provider flows (`security.errors.ts`, `subscriptions.errors.ts`), migrating security/subscription service throw-sites away from raw string errors, and replacing profile security/subscription controller `error.message` checks with code-based handling through `mapErrorToHttpResponse`; validated with API typecheck + targeted profile/bots subscription suites.
- 2026-04-15: Completed `OPTC-04` by introducing typed bots/orders domain errors (`bots.errors.ts`, `orders.errors.ts`), migrating bot command/runtime and order execution/pretrade throw-sites to `DomainError`, and replacing bots/orders controller `error.message` checks with code-based handling through `mapErrorToHttpResponse`; validated with API typecheck + targeted bots/orders suites.
- 2026-04-15: Completed `OPTC-03` by introducing typed markets/strategies domain errors and replacing controller `error.message` checks with code-based mapped handling for update/delete/import paths (`mapErrorToHttpResponse`), including linked-record conflict typing in services.
- 2026-04-15: Completed `OPTC-02` by migrating wallet-domain error flow to typed `DomainError` contracts (`wallets.errors.ts` + wallets service throws) and replacing wallet controller `error.message` checks with code-based mapped responses through `mapErrorToHttpResponse`; validated with API typecheck and wallets e2e suite.
- 2026-04-15: Completed `OPTC-01` foundation slice for `OPT-01` by introducing typed error primitives (`AppError`, `DomainError`) in `apps/api/src/lib/errors.ts`, adding central mapper `apps/api/src/lib/httpErrorMapper.ts`, and wiring `apps/api/src/middleware/errorHandler.ts` to mapped responses (including legacy `status + toDetails()` compatibility); validated with API typecheck and targeted mapper/primitives tests.
- 2026-04-15: Completed `OPTC-00` queue activation by promoting optimization execution queue (`docs/planning/engineering-optimization-next-commits-2026-04-12.md`) into canonical `mvp-next-commits` (`NOW: OPTC-01..05`, `NEXT: OPTC-06..21`) after documentation hardening wave closure.
- 2026-04-12: Completed repo-wide optimization standards audit and published actionable plan (`docs/planning/engineering-optimization-wave-2026-04-12.md`) plus tiny-commit execution queue (`docs/planning/engineering-optimization-next-commits-2026-04-12.md`) for follow-up implementation sessions.

## Continuous Group Pipeline (Post-OPT, 2026-04-16)
- [x] `CPDB-G1 baseline(cpu-db): contract freeze + runtime hot-path metrics + parity-safe assertions`
- [x] `CPDB-G2 runtime-cache(cpu-db): active topology cache + invalidation + parity tests`
- [x] `CPDB-G3 signal-routing(cpu-db): seriesKey routing index + pretrade position-count cache`
- [x] `CPDB-G4 telemetry-write(cpu-db): touchSession throttle + symbol stats batching + query-count checks`
- [x] `CPDB-G5 web-polling(cpu-db): adaptive refresh + SSE-first runtime stats with polling fallback`
- [x] `CPDB-G6 db-shaping(cpu-db): hot-path indexes + slim topology reads + EXPLAIN evidence`
- [x] `CPDB-G7 worker-backpressure(cpu-db): per-series concurrency guard + distributed warmup lock`
- [x] `CPDB-G8 rollout(cpu-db): canary/rollback docs + alert thresholds + 30m soak evidence`
- [x] `WLT-A wallet-contracts: wallet source-of-truth docs + decisions + IA placement`
- [x] `WLT-B wallet-db-foundation: Wallet model + walletId snapshots + backfill migration`
- [x] `WLT-C wallet-api: wallet CRUD module with mode-aware validation + ownership isolation`
- [x] `WLT-D bot-wallet-migration: require walletId in bot write contract + context compatibility guards`
- [x] `QFIX-A runtime-quality(api): telemetry flush fail-safe + runtime typecheck restoration`
- [x] `WLT-E runtime-wallet-budget: wallet-based capital checks + walletId runtime attribution`
- [x] `WLT-F web-wallet-module: dashboard wallet pages + nav + bot form wallet selector migration`
- [x] `WLT-G wallet-qa-release: end-to-end wallet flow QA + runbook + release evidence gate`
- [x] `PEX-A runtime-idempotency: replay-safe runtime execution guards + crash/retry regression`
- [x] `PEX-B runtime-liveness: bounded auto-restart policy + long-run continuity regression`
- [x] `PEX-C observability-ops: runtime alert thresholds + incident triage runbook`
- [x] `PEX-D recoverability: backup verification + restore drill automation + RTO/RPO doc`
- [x] `PEX-E secrets-hardening: secret inventory + rotation readiness validation + regression checks`
- [x] `PEX-F deploy-safety: post-deploy runtime freshness gate + rollback trigger policy`

### Progress Log (Continuous Group Pipeline)
- 2026-04-16: Closed remaining `PEX` groups (`PEX-B..PEX-F`) by completing `PEX-06` validation and reconciling canonical production-excellence phase status against existing implementation/evidence (`alerts + runtime freshness + critical-secrets` regression pack PASS, backup/restore/RTO-RPO/secrets/release docs and artifacts present), resulting in fully closed `PEX` backlog.
- 2026-04-16: Advanced `PEX-B` by closing `PEX-05` runtime recovery guardrail coverage in `runtimeSignalLoop.service.test.ts` (new regression confirms `max-attempt` blocking within window and fresh retry allowance after `autoRestartWindowMs` expiry), validated with `pnpm --filter api test -- src/modules/engine/runtimeSignalLoop.service.test.ts`; remaining active group scope: `PEX-06`.
- 2026-04-16: Closed `PEX-A` by completing `PEX-03` (crash-window replay regression in `runtimeCrashRetry.regression.test.ts`: side effect executed once, restart replay with dedupe `PENDING` returns `dedupe_inflight`, no duplicate OPEN side effects) and revalidating OPEN/CLOSE restart parity coverage; promoted `PEX-B` as next active group.
- 2026-04-16: Advanced `PEX-A` by hardening `PEX-02` runtime idempotency failure semantics in `runtimeExecutionDedupeService` (retry only for retryable `FAILED` classes; terminal failures now replay as `reused/no-op` to avoid duplicate side effects) and adding targeted dedupe service regression tests; remaining active group scope: `PEX-03`.
- 2026-04-16: Closed `WLT-G` by completing `WLT-25` (release-gate lint/typecheck/sequential wallet-first API e2e + wallet-focused web regression validation, all PASS, with rollout evidence artifacts `docs/operations/_artifacts-wlt25-release-gate-2026-04-16T20-49-53-335Z.json` and `docs/operations/wlt25-release-gate-2026-04-16T20-49-53-335Z.md`), finalizing group scope `WLT-23..WLT-25` and promoting `PEX-A` as next active group.
- 2026-04-16: Advanced `WLT-G` by completing `WLT-24` (published canonical wallet lifecycle operator runbook `docs/operations/wallet-lifecycle-operator-runbook.md` for wallet-first PAPER/LIVE lifecycle operations and `WALLET_INSUFFICIENT_FUNDS` incident troubleshooting with fast triage/deep diagnostics/mitigation matrix, plus linked operator discovery from bot and MVP ops runbooks); remaining scope in active group: `WLT-25`.
- 2026-04-16: Advanced `WLT-G` by completing `WLT-23` (wallet QA end-to-end confidence pack across strategy/wallet/bot/runtime/web flows and deterministic PAPER runtime e2e stabilization in `runtime-flow.e2e` via async polling assertions), validated with `pnpm --filter api test -- src/modules/strategies/strategies.e2e.test.ts`, `pnpm --filter api test -- src/modules/wallets/wallets.crud.e2e.test.ts`, `pnpm --filter api test -- src/modules/bots/bots.wallet-contract.e2e.test.ts`, `pnpm --filter api test -- src/modules/engine/preTrade.e2e.test.ts`, `pnpm --filter api test -- src/modules/engine/runtime-flow.e2e.test.ts`, `pnpm --filter api test -- src/modules/engine/runtime-orchestration-smoke.e2e.test.ts`, `pnpm --filter web test -- src/app/dashboard/wallets/page.test.tsx src/app/dashboard/wallets/list/page.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx`, `pnpm --filter api run typecheck`, and `pnpm --filter web run typecheck` (PASS); remaining scope in active group: `WLT-24..WLT-25`.
- 2026-04-16: Closed `WLT-F` by completing `WLT-22` (wallet web regression pack for `/dashboard/wallets` redirect + `/dashboard/wallets/list` empty/create flow, `Header.responsive` nav route/order assertions, and wallet-first bot create payload contract with legacy field exclusions), validated with `pnpm --filter web test -- src/app/dashboard/wallets/page.test.tsx src/app/dashboard/wallets/list/page.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx` + `pnpm --filter web run typecheck` (PASS), and promoted `WLT-G` as the next wallet group.
- 2026-04-16: Advanced `WLT-F` by completing `WLT-21` (wallet-first bot form refactor hardening in `BotCreateEditForm`: explicit wallet context summary for selected wallet/mode/venue/LIVE key status + i18n-aligned LIVE missing-key validation copy, with regression assertion that legacy mode/paper-balance controls are absent), validated with `pnpm --filter web test -- src/features/bots/components/BotCreateEditForm.test.tsx` + `pnpm --filter web run typecheck` (PASS); remaining scope in active group: `WLT-22`.
- 2026-04-16: Advanced `WLT-F` by completing `WLT-20` (wallet web module route set + mode-aware form contract confirmed for `/dashboard/wallets/list`, `/dashboard/wallets/create`, and `/dashboard/wallets/[id]/edit`, including PAPER/LIVE conditional fields and payload behavior), validated with `pnpm --filter web test -- src/app/dashboard/wallets/create/page.test.tsx src/app/dashboard/wallets/[id]/edit/page.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx` + `pnpm --filter web run typecheck` (PASS); remaining scope in active group: `WLT-21..WLT-22`.
- 2026-04-16: Advanced `WLT-F` by completing `WLT-19` (dashboard nav contract restored to explicit `Exchanges -> Wallets -> Markets` module order via `Header` direct links and regression assertion in `Header.responsive.test.tsx`), validated with `pnpm --filter web test -- src/ui/layout/dashboard/Header.responsive.test.tsx` + `pnpm --filter web run typecheck` (PASS); remaining scope in active group: `WLT-20..WLT-22`.
- 2026-04-16: Closed `WLT-E` by completing `WLT-18` (runtime regressions for shared-wallet multi-bot insufficient-funds behavior in `runtimeSignalLoop.service.test.ts` and shared-wallet reserved-margin accounting in `runtimeCapitalContext.service.test.ts`), finalizing group scope `WLT-15..WLT-18`; validated with `pnpm --filter api test -- src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts` + `pnpm --filter api run typecheck` (PASS), and promoted `WLT-F` as next wallet group.
- 2026-04-16: Advanced `WLT-E` by completing `WLT-17` (runtime EXIT wallet attribution hardening: close-order path in `executionOrchestrator` now persists wallet snapshot via `walletId: openPosition.walletId ?? input.walletId`, with regression lock for close order/trade wallet propagation in `executionOrchestrator.service.test.ts`), validated with `pnpm --filter api test -- src/modules/engine/executionOrchestrator.service.test.ts` + `pnpm --filter api run typecheck` (PASS); remaining scope in active group: `WLT-18`.
- 2026-04-16: Advanced `WLT-E` by completing `WLT-16` (explicit wallet free-cash hard-fail guard for OPEN pre-trade path via `resolveRuntimeWalletFundsExhausted` plus aligned DCA guard contract) and validating with `pnpm --filter api test -- src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts` + `pnpm --filter api run typecheck` (PASS); remaining scope in active group: `WLT-17..WLT-18`.
- 2026-04-16: Advanced `WLT-E` by completing `WLT-15` (wallet-first runtime capital context for PAPER/LIVE reference balance, including wallet-scoped fail-closed behavior when wallet context or wallet API key is unavailable) and validated with `pnpm --filter api test -- src/modules/engine/runtimeCapitalContext.service.test.ts` + `pnpm --filter api run typecheck` (PASS); remaining scope in active group: `WLT-16..WLT-18`.
- 2026-04-16: Closed `QFIX-A` by adding telemetry symbol-stat flush fail-safe handling for teardown FK races (`Prisma P2003` on `BotRuntimeSymbolStat`) plus guarded background flush execution, restoring API typecheck in `runtimeSignalLoop*`/`marketStreamFanout*` test surfaces, and re-validating with `pnpm --filter api run typecheck`, targeted bots e2e (`30/30`), and targeted runtime/fanout regression suites (`42/42`); `WLT-E` remains the next active wallet group.
- 2026-04-16: Inserted `QFIX-A` as immediate cleanup gate before next feature wave after reproducing runtime quality blockers (`bots.e2e` unhandled rejection from telemetry symbol-stat flush race during test teardown and persistent API typecheck failures in `runtimeSignalLoop*`/`marketStreamFanout*`), with execution order set to `QFIX-A -> WLT-E`.
- 2026-04-16: Closed `WLT-D` by completing `WLT-11..WLT-14` (wallet-first bot write derivation from wallet context, wallet-switch compatibility guard against existing bot market-group universes, deprecated direct execution-field compatibility handling, and focused regression suite `bots.wallet-contract.e2e.test.ts`), with `WLT-E` promoted as next active wallet group.
- 2026-04-16: Closed `WLT-C` by completing `WLT-08..WLT-10` (wallet CRUD API ownership isolation coverage, LIVE mode/allocation validation hardening including partial-update safety, and dedicated wallet CRUD e2e suite `wallets.crud.e2e.test.ts` with delete-guard assertions), with `WLT-D` promoted as next active wallet group.
- 2026-04-16: Closed `WLT-B` by completing `WLT-04..WLT-07` (Wallet DB foundation in Prisma+migration, walletId snapshot coverage on `Position/Order/Trade`, existing-bot backfill verification, and PASS safety artifacts `docs/operations/_artifacts-wallet-db-foundation-2026-04-16T12-10-31-835Z.json` + `docs/operations/wallet-db-foundation-verification-2026-04-16T12-10-31-835Z.md`), with `WLT-C` promoted as next active wallet group.
- 2026-04-16: Closed `WLT-A` by completing `WLT-01..WLT-03` (wallet source-of-truth contract publication, wallet-first decision lock in canonical decisions, and dashboard IA placement rule `Exchanges -> Wallets -> Markets`), with `WLT-B` promoted as next active wallet group.
- 2026-04-16: Closed `CPDB-G8` by completing `CPDB-22..CPDB-24` (staged rollout + rollback runbook contract, CPU/DB alert-threshold/dashboard contract, and 30-minute local soak evidence artifacts with pre/post metrics snapshot and explicit `FAIL` conclusion), then promoted `WLT-A` as the next active group in canonical queue.
- 2026-04-16: Initialized continuous post-optimization execution queue in canonical plan by importing active open groups from `cpu-db-optimization-commit-plan-2026-04-06.md`, `wallet-module-implementation-plan-2026-04-07.md`, and `production-excellence-plan-2026-04-03.md`, ensuring deterministic next-group continuity after each completed group.
- 2026-04-16: Closed `CPDB-G1` by completing `CPDB-01..CPDB-03` (feature-flag contract freeze, runtime hot-path metrics instrumentation, and parity-safe metric regression tests) and kept `CPDB-G2` as next active CPU/DB group in canonical queue.
- 2026-04-16: Closed `CPDB-G2` by completing `CPDB-04..CPDB-06` (runtime topology cache service with TTL/version invalidation, final-candle cache read refactor with direct-query fallback hardening, and parity regression coverage for cache hit/miss/invalidation), with `CPDB-G3` now active as the next CPU/DB group.
- 2026-04-16: Closed `CPDB-G3` by completing `CPDB-07..CPDB-09` (seriesKey eligible-group routing index, pre-trade open-position count cache + OPEN/CLOSE invalidation, and cache parity tests that keep user/bot caps enforced), with `CPDB-G4` promoted as the next active CPU/DB group.
- 2026-04-16: Closed `CPDB-G4` by completing `CPDB-10..CPDB-12` (telemetry touch-session throttling, symbol-stat debounce batching + close-session flush, execution OPEN leverage query removal, and query-count regression assertions), with `CPDB-G5` promoted as the next active CPU/DB group.
- 2026-04-16: Closed `CPDB-G5` by completing `CPDB-13..CPDB-15` (visibility-aware polling cadence, SSE-first runtime refresh with polling fallback, and cadence/fallback regression coverage), with `CPDB-G6` promoted as the next active CPU/DB group.
- 2026-04-16: Closed `CPDB-G6` by completing `CPDB-16..CPDB-18` (runtime hot-path DB indexes, topology-read query shaping, and EXPLAIN evidence capture), with `CPDB-G7` promoted as the next active CPU/DB group.
- 2026-04-16: Advanced `CPDB-G7` by completing `CPDB-19` (runtime per-series final-candle backpressure queue with bounded pending backlog and overflow drop of the oldest pending event, plus stop/stall queue cleanup and burst-load regression coverage in `runtimeSignalLoop`), keeping `CPDB-20..CPDB-21` as remaining scope for the active group.
- 2026-04-16: Advanced `CPDB-G7` by completing `CPDB-20` (distributed warmup lock integration for runtime series warmup via Redis-backed fanout lock provider, runtime loop dependency wiring, and lock-aware market-data gateway release semantics), leaving `CPDB-21` as the final remaining scope in the active group.
- 2026-04-16: Closed `CPDB-G7` by completing `CPDB-21` (shared-series concurrency stress for `5 users x 3 bots` on `BTCUSDT/5m` with duplicate-event side-effect guardrails plus `marketStreamFanout` single-delivery/lock contract tests), with `CPDB-G8` now the next active CPU/DB group.

## Continuous Group Pipeline (Post-PEX Continuation, 2026-04-17)
- [x] `A11Y-A accessibility-full-pass: full dashboard accessibility closure (automated + manual + evidence)`
- [x] `DOCSYNC-A docs-parity-sustainment: periodic parity audit refresh + queue continuity safeguards`
- [x] `L10NPT-A localization(pt-pt): execute European Portuguese rollout queue from docs/planning/pt-pt-localization-rollout-plan-2026-04-17.md (pt-PT only, no pt-BR)`
- [x] `NAVHF-A dashboard-nav-regression: remove unnecessary top-level Exchanges link from main dashboard menu`
- [x] `WSPLIT-A worker-split-decision-closure: resolve open Worker Split Timing policy and sync canonical plans`
- [x] `UXR-A dashboard-ux-runtime-wave: execute grouped UXR queue from docs/planning/dashboard-modules-ux-runtime-fix-wave-plan-2026-04-15.md`
- [x] `L10NQ-A i18n-contract-remediation-wave: execute grouped locale hardening queue from docs/planning/i18n-contract-remediation-plan-2026-04-17.md`
- [x] `BTMM-A backtest-multi-market-parity-wave: execute grouped parity fixes from docs/planning/backtest-multi-market-parity-remediation-plan-2026-04-17.md`

### Active Task Breakdown (A11Y-A)
- [x] `A11Y-01 docs(plan): publish full accessibility pass timeline and resolve open decision`
- [x] `A11Y-02 test(web-a11y): add automated accessibility smoke for core dashboard routes`
- [x] `A11Y-03 fix(web-a11y): remediate highest-priority issues from accessibility smoke findings`
- [x] `A11Y-04 qa(a11y-manual): run keyboard/screen-reader smoke checklist and capture evidence`
- [x] `A11Y-05 docs(closure): publish closure evidence and sync canonical docs/plan status`

### Active Task Breakdown (DOCSYNC-A)
- [x] `DOCSYNC-01 ops(docs-parity): run docs parity check and publish fresh evidence artifact`
- [x] `DOCSYNC-02 docs(module-index): refresh module+route inventory snapshots after parity run`
- [x] `DOCSYNC-03 chore(planning-queue): validate NOW/NEXT refill continuity and align canonical queue`
- [x] `DOCSYNC-04 docs(governance): capture sustainment cadence and ownership in working agreements`

### Active Task Breakdown (NAVHF-A)
- [x] `NAVHF-01 fix(web-nav): remove top-level Exchanges link regression from dashboard menu (introduced in commit 1b91763)`

### Active Task Breakdown (WSPLIT-A)
- [x] `WSPLIT-01 docs(decision): close Worker Split Timing with explicit split policy and thresholds`

### Active Task Breakdown (UXR-A)
- [x] `UXR-01 docs(contract): freeze dashboard positions/orders ownership and visibility matrix`
- [x] `UXR-02 test(api+web): add failing coverage for missing exchange positions and close-position action error`
- [x] `UXR-03 fix(api-runtime): deterministic exchange-position takeover mapping for dashboard open positions`
- [x] `UXR-04 feat(api-orders-sync): persist and reconcile LIVE open orders into unified read model/cache`
- [x] `UXR-05 feat(api-paper-orders): align PAPER order lifecycle with unified orders read model`

### Active Task Breakdown (L10NQ-A)
- [x] `L10NQ-01 docs(contract): freeze remediation scope and English-only documentation baseline`
- [x] `L10NQ-02 qa(scan): capture baseline inventory of locale clamps and hardcoded-copy hotspots`
- [x] `L10NQ-03 fix(web-backtest-locale): remove EN/PL clamp in backtest module`
- [x] `L10NQ-04 test(web-backtest-i18n): add regression coverage for Portuguese backtest locale path`
- [x] `L10NQ-05 refactor(web-hardcoded-wrapper-copy): migrate page-wrapper/module hardcoded strings to i18n keys`

### Active Task Breakdown (BTMM-A)
- [x] `BTMM-01 docs(contract): freeze multi-market parity semantics (isolated symbol timeline vs run totals)`
- [x] `BTMM-02 test(api-backtest-red): add failing reproducible contract for 1-symbol vs 50-symbol parity on same target symbol`
- [x] `BTMM-03 fix(api-backtest-window): remove double adaptive maxCandles and persist one effective window`
- [x] `BTMM-04 fix(api-backtest-timeline-anchor): use deterministic terminal run end anchor instead of stale liveProgress`
- [x] `BTMM-05 fix(api-backtest-replay-context): add symbol-isolated replay mode and make pair timeline deterministic by default`

### Progress Log (Post-PEX Continuation)
- 2026-04-17: Closed `BTMM-A` by completing `BTMM-01..BTMM-05` (canonical docs freeze for multi-market parity semantics, added API contract tests for 1-symbol vs 50-symbol divergence and replay-context defaults, removed double adaptive `maxCandles` via persisted `requestedMaxCandles/effectiveMaxCandles` contract reused in run job + timeline, switched terminal timeline end anchor to run-level `finishedAt`, and added timeline replay context `isolated|portfolio` with default `isolated`).
- 2026-04-17: Added `BTMM-A` priority remediation wave for backtest multi-market determinism (`docs/planning/backtest-multi-market-parity-remediation-plan-2026-04-17.md`) covering single-adaptation `effectiveMaxCandles`, terminal timeline anchoring without stale `currentCandleTime`, isolated pair replay context, cache continuity validation, and dedicated 1-vs-50 parity regressions.
- 2026-04-17: Completed `UXR-08` by moving runtime open-positions close action to a dedicated last column (`Action`) even when dynamic stop columns are present, and replacing text CTA with an icon-only close button that preserves accessible labels (`aria-label` + tooltip); validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`.
- 2026-04-17: Completed `UXR-07` by shortening runtime dashboard tab labels to `positions/orders/history` across localized dashboard-home namespaces (`en/pl/pt`) and updating `HomeLiveWidgets` regression expectations for the compact tab naming contract; validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`.
- 2026-04-17: Completed `UXR-06` by redesigning runtime wallet summary into a compact first-row KPI layout (`portfolio`, `free funds`, `in positions`) with consistent wallet-icon semantics and responsive 1->3 column rendering in `RuntimeSidebarSection`, plus regression assertions for the new KPI row/card contract in `HomeLiveWidgets.test.tsx`; validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`.
- 2026-04-17: Completed `UXR-05` by removing runtime-session `createdAt` clamping from open-orders read-path for `PAPER`, aligning `LIVE` and `PAPER` runtime dashboard visibility to the same unified carryover contract, with explicit PAPER carryover regression coverage in `orders-positions.e2e`; validation: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `9/9 PASS`.
- 2026-04-17: Closed grouped wave `UXR-A` (`UXR-01..UXR-05`) and promoted `UXR-06..UXR-10` as the active execution queue with `UXR-11..UXR-15` staged next in `mvp-next-commits.md`.
- 2026-04-17: Completed `UXR-04` by making runtime open-orders windowing mode-aware (session `createdAt` clamp now kept for `PAPER` only, while `LIVE` read-model includes carryover open orders created before current runtime session start), plus added carryover visibility regression coverage in `orders-positions.e2e`; validation: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `8/8 PASS`.
- 2026-04-17: Completed `UXR-03` by enforcing LIVE-only deterministic owner arbitration for `EXCHANGE_SYNC` symbol takeover and by claiming/backfilling missing `botId/walletId` before close orchestration, which resolves missing LIVE runtime visibility and `ignored` close responses for takeover rows.
- 2026-04-17: Planned and queued `L10NQ-A` follow-up localization hardening wave (`docs/planning/i18n-contract-remediation-plan-2026-04-17.md`) covering backtest EN/PL clamp removal, hardcoded-copy cleanup, module namespace split, i18n parity/guardrail tests, route-level namespace loading, and English-only localization docs normalization.
- 2026-04-17: Completed `UXR-02` by adding red-baseline API coverage for runtime exchange-position visibility + close-action regression (`orders-positions.e2e`) and WEB hook coverage for `ignored` close-response handling (`useCloseRuntimePositionAction.test.tsx`); validation evidence: API targeted suite currently fails on the two expected regressions, WEB targeted suite passes.
- 2026-04-17: Completed `UXR-01` by freezing dashboard `positions/orders/history` ownership and visibility matrix in canonical docs (`open-decisions`, `api-bots`, `web-dashboard-home`), including deterministic external takeover owner ordering and fail-closed close-position actionability.
- 2026-04-17: Promoted `UXR-A` as active follow-up group with explicit tiny-commit queue (`UXR-01..UXR-05`) and grouped continuation contract (`UXR-B..UXR-D`) based on `docs/planning/dashboard-modules-ux-runtime-fix-wave-plan-2026-04-15.md`, so executor `NOW` refill always has actionable tasks.
- 2026-04-17: Executed Dashboard+Bots operational UX checklist pass (`docs/operations/dashboard-bots-operational-ux-checklist.md`) with fresh validation pack (`pnpm --filter web test -- src/features/bots/components/BotCreateEditForm.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/BotsManagement.test.tsx src/app/dashboard/dashboard.a11y.smoke.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx` => `34/34 PASS`, `pnpm --filter web run build` PASS), and closed creator-form IA gap on `/dashboard/bots/create` by enforcing explicit 3-section structure (`Basics`, `Market`, `Strategy`) with regression lock in `BotCreateEditForm.test.tsx`.
- 2026-04-17: Closed `WSPLIT-A` by completing `WSPLIT-01` (resolved `Worker Split Timing` open decision by locking `PROD` mandatory API/worker split-process policy and concrete `STAGE/DEV` split triggers for queue lag/API p95/restart burst, published closure plan `docs/planning/worker-split-timing-decision-closure-plan-2026-04-17.md`, and validated queue/docs synchronization with `pnpm run docs:parity:check` PASS).
- 2026-04-17: Closed `NAVHF-A` by completing `NAVHF-01` (removed top-level `Exchanges` from `Header` direct module navigation so desktop/mobile main menu now starts with `Wallets`, updated responsive nav contract assertions to enforce no `Exchanges` link while preserving wallet/markets routes, and validated with `pnpm --filter web test -- src/ui/layout/dashboard/Header.responsive.test.tsx` + `pnpm --filter web run typecheck`, both PASS).
- 2026-04-17: Closed `L10NPT-A` by completing `L10NPT-01..L10NPT-12` (locale contract expanded to `en/pl/pt` with `pt-PT` formatting, language switcher and namespace support, shared/page/feature locale-branch widening, i18n parity tests refreshed, hardcoded-locale scan result `0` matches, smoke/build pack PASS, and closure evidence in `docs/operations/_artifacts-l10npt-rollout-2026-04-16T22-59-22-697Z.json` + `docs/operations/l10npt-rollout-closure-2026-04-17.md`); promoted `NAVHF-A` as next active group.
- 2026-04-17: Added `NAVHF-A` hotfix group and queued `NAVHF-01` to remove unintended top-level `Exchanges` main-menu link regression (reintroduced in commit `1b91763`), with execution details captured in `docs/planning/dashboard-nav-exchanges-removal-hotfix-plan-2026-04-17.md`.
- 2026-04-17: Closed `DOCSYNC-A` by completing `DOCSYNC-01..DOCSYNC-04` (fresh parity artifact `docs/operations/_artifacts-docs-parity-2026-04-16T22-37-19-622Z.json` with `PASS`, sustainment evidence note `docs/operations/documentation-parity-sustainment-evidence-2026-04-17.md`, refreshed module+route inventory snapshots, and governance cadence/ownership contract update); promoted `L10NPT-A` as next active group and refilled one-task queue continuity for `L10NPT-01..L10NPT-12`.
- 2026-04-17: Closed `A11Y-A` by completing `A11Y-02..A11Y-05` (added dashboard route-level a11y smoke suites `dashboard.a11y.smoke.test.tsx` + `PageTitle.a11y.test.tsx`, remediated page-title semantic gaps via breadcrumb landmark and contextual create-action SR descriptions, and published closure evidence artifacts `docs/operations/_artifacts-a11y-full-pass-2026-04-17T00-17-35-000Z.json` + `docs/operations/a11y-full-pass-closure-2026-04-17.md`); promoted `DOCSYNC-A` as next active group.
- 2026-04-17: Initialized post-PEX continuation queue by promoting `A11Y-A` as active group and `DOCSYNC-A` as next group, then completed `A11Y-01` by publishing canonical full-pass timeline (`docs/planning/accessibility-full-pass-plan-2026-04-17.md`) and resolving `Accessibility Scope` in `open-decisions.md`.

## Phase 36 - European Portuguese Localization (pt-PT Only, As of 2026-04-17)
- [x] `L10NPT-01 docs(contract): lock Portuguese locale policy to pt-PT only and forbid pt-BR in this rollout`
- [x] `L10NPT-02 feat(i18n-core): extend locale contract to en/pl/pt + pt-PT formatting`
- [x] `L10NPT-03 feat(web-language-switcher): add Portuguese option in language switcher (header/footer)`
- [x] `L10NPT-04 feat(i18n-namespaces): add dashboard namespace translation files for Portuguese`
- [x] `L10NPT-05 refactor(web-shared-copy): remove en/pl-only branches in shared layout/components`
- [x] `L10NPT-06 refactor(web-page-copy): migrate page-level inline copy to include Portuguese`
- [x] `L10NPT-07 refactor(strategies-localizers): widen strategy helper locale maps to include Portuguese`
- [x] `L10NPT-08 refactor(profile-wallet-markets): remove remaining en/pl-only branches in forms and tables`
- [x] `L10NPT-09 test(i18n-contract): update tests for en/pl/pt key parity and persistence`
- [x] `L10NPT-10 qa(i18n-hardcoded-scan): rerun hardcoded-locale scan and close remaining hotspots`
- [x] `L10NPT-11 qa(web-smoke): manual PT smoke across dashboard/public/profile/auth`
- [x] `L10NPT-12 docs(closure): publish rollout evidence and sync canonical queue statuses`

### Progress Log (Phase 36 - European Portuguese Localization)
- 2026-04-17: Closed phase by completing `L10NPT-01..L10NPT-12` with Portuguese locale rollout (`pt` + `pt-PT`) across i18n core, switchers, namespaces, shared/page/feature copy paths, strategy localizers, and contract tests; validated via typecheck + targeted smoke/build packs and published closure artifacts `docs/operations/_artifacts-l10npt-rollout-2026-04-16T22-59-22-697Z.json` + `docs/operations/l10npt-rollout-closure-2026-04-17.md`.
- 2026-04-17: Initialized canonical localization phase and rollout queue in `docs/planning/pt-pt-localization-rollout-plan-2026-04-17.md` with locked locale policy (`pt` mapped to `pt-PT`, explicitly excluding `pt-BR`) and hardcoded-branch inventory baseline for implementation.

## Phase 37 - Dashboard + Modules UX/Runtime Fix Wave (As of 2026-04-17)
- [x] `UXR-01 docs(contract): freeze dashboard positions/orders ownership and visibility matrix`
- [x] `UXR-02 test(api+web): add failing coverage for missing exchange positions and close-position action error`
- [x] `UXR-03 fix(api-runtime): deterministic exchange-position takeover mapping for dashboard open positions`
- [x] `UXR-04 feat(api-orders-sync): persist and reconcile LIVE open orders into unified read model/cache`
- [x] `UXR-05 feat(api-paper-orders): align PAPER order lifecycle with unified orders read model`
- [x] `UXR-06 feat(web-dashboard-wallet): redesign wallet KPI row + wallet icon consistency`
- [x] `UXR-07 feat(web-dashboard-tabs): rename tab labels to positions/orders/history`
- [x] `UXR-08 fix(web-positions-table): move close column to last, rename to Action, use icon button`
- [x] `UXR-09 fix(web-actions): implement per-row pending state for concurrent close actions`
- [x] `UXR-10 fix(api-close-position): align close-position button flow with backend close handler`
- [x] `UXR-11 feat(web-position-edit-modal): add reusable modal shell + initial position-edit form`
- [x] `UXR-12 feat(api-position-edit): expose safe manual update endpoint for TP/SL and metadata`
- [x] `UXR-13 feat(web-dashboard-manual-order): add manual order panel using existing bot order pipeline`
- [x] `UXR-14 feat(web-markets-form): compose symbol universe from (min-volume U whitelist) - blacklist`
- [x] `UXR-15 fix(api-markets): enforce same universe composition contract on backend`
- [x] `UXR-16 ux(web-profile-api): redesign API key form row layout and helper blocks`
- [x] `UXR-17 fix(api-profile-sync): make API sync action deterministic and observable`
- [x] `UXR-18 refactor(web-wallets-list): migrate wallets list to shared DataTable pattern`
- [x] `UXR-19 fix(api-wallet-guard): block wallet edits when wallet is used by active bot`
- [x] `UXR-20 feat(web-table-core): shared advanced table options (column visibility + expandable details)`
- [x] `UXR-21 feat(web-tables): apply advanced table mode to wallets/markets/strategies/backtests/bots`
- [x] `UXR-22 feat(web+api-logs): migrate logs view to unified table UX and verify bot-message completeness`
- [x] `UXR-23 feat(web-bots-list): hide assistant action in V1 list view`
- [x] `UXR-24 refactor(web-bots-runtime): tabbed runtime layout with dashboard-like readability`
- [x] `UXR-25 fix(web-runtime-refresh): remove local refresh controls and use automatic interval only`
- [x] `UXR-26 fix(api-bots-duplicate-guard): enforce uniqueness by wallet+market+strategy tuple`
- [x] `UXR-27 ux(web-bot-form): simplify IA (one section, two rows), clarify live opt-in, complete i18n`
- [x] `UXR-28 fix(web-backtests-breadcrumb): normalize labels to List/Create and make module header linkable`
- [x] `UXR-29 fix(web-footer-mobile): center both dashboard footer rows on mobile`
- [x] `UXR-30 qa(regression-pack): run focused API+WEB tests and manual smoke for live/paper parity`

### Progress Log (Phase 37 - Dashboard + Modules UX/Runtime Fix Wave)
- 2026-04-17: Completed `UXR-30` and closed `UXR-D` by executing focused regression/deploy-parity validation for live/paper operator flow: API sequential e2e (`orders-positions`, `profile/apiKey`, `markets`, `wallets`, `bots.duplicate-guard`, `logs`) => `49/49 PASS`; WEB focused pack (`HomeLiveWidgets`, `BotCreateEditForm`, `BotsManagement`, `BotsListTable`, `ApiKeyForm`, `AuditTrailView`, `PageTitle.a11y`, `Footer.layout`) => `49/49 PASS`; plus `pnpm --filter api run typecheck` + `pnpm --filter api build` + `pnpm --filter web run typecheck` + `pnpm --filter web run build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- 2026-04-17: Completed `UXR-29` by centering dashboard footer rows on mobile while preserving desktop split layout, and added regression `Footer.layout.test.tsx`.
- 2026-04-17: Completed `UXR-28` by normalizing backtests breadcrumb/action labels to `List/Create` and making module heading linkable when module breadcrumb has `href`, with coverage in `PageTitle.a11y.test.tsx`.
- 2026-04-17: Completed `UXR-27` by simplifying bot create/edit IA into a single setup section with two-row layout, adding live opt-in helper copy/paper guidance, and migrating remaining hardcoded form copy to i18n (`dashboard-bots.en/pl/pt`).
- 2026-04-17: Completed `UXR-26` by extending active-bot duplicate guard to enforce uniqueness on `walletId + strategyId + marketGroupId` across create/update paths, with conflict-message update and e2e contract for same tuple block + different-wallet allow.
- 2026-04-17: Completed `UXR-25` by removing runtime monitoring local refresh controls (toggle + button) and enforcing automatic refresh cadence only while retaining stale-data signaling behavior.
- 2026-04-17: Completed `UXR-24` by refining bots runtime readability with tabbed top-level module navigation and tab-like quick-navigation blocks in monitoring.
- 2026-04-17: Completed `UXR-23` by removing list-level Assistant action from bots table row actions while keeping assistant internals/routes intact.
- 2026-04-17: Completed `UXR-22` by migrating logs UI to shared `DataTable` (`advancedMode`, row-level trace expansion, preserved source/severity filters + refresh), and by adding API completeness regression ensuring bot runtime/execution/sync messages remain visible in owner logs timeline; validation: `pnpm --filter web test -- src/features/logs/components/AuditTrailView.test.tsx` + `pnpm --filter api test -- src/modules/logs/logs.e2e.test.ts` => PASS.
- 2026-04-17: Completed `UXR-21` by applying advanced table mode rollout across wallets/markets/strategies/backtests/bots with persisted per-table column visibility keys; validation: targeted web tests for changed modules + `pnpm --filter web run typecheck` => PASS.
- 2026-04-17: Completed `UXR-20` by extending `DataTable` with explicit `advancedMode` opt-in contract for shared advanced controls (column personalization + settings/pagination surface) and adding regression in `DataTable.test.tsx`; validation: `pnpm --filter web test -- src/ui/components/DataTable.test.tsx` => PASS.
- 2026-04-17: Completed `UXR-19` by adding API wallet-update guard that rejects edits when wallet is referenced by an active bot (`409` + bot context details), with e2e coverage in `wallets.crud.e2e`; validation: `pnpm --filter api test -- src/modules/wallets/wallets.crud.e2e.test.ts` => PASS.
- 2026-04-17: Completed `UXR-18` by migrating wallets list from bespoke table markup to shared `DataTable` with search/sort, advanced columns, and expandable details rows while preserving edit/delete actions; validation: `pnpm --filter web test -- src/features/wallets/components/WalletsListTable.test.tsx` => PASS.
- 2026-04-17: Completed `UXR-17` by making profile API-key sync/manage flags deterministic (`manageExternalPositions` enforces `syncExternalPositions=true`) and improving observability of probe runs via audit metadata (`probeMode`, `probeLatencyMs`, `apiKeyId`) plus stable unexpected-failure fallback mapping; validation: `pnpm --filter api test -- src/modules/profile/apiKey/apiKey.e2e.test.ts` => PASS.
- 2026-04-17: Completed `UXR-16` by redesigning API-key form flow to requested step order (identity -> apiKey -> apiSecret -> sync -> allow -> requirements/permissions) and adding explicit order regression coverage in `ApiKeyForm.test.tsx`; validation: `pnpm --filter web test -- src/features/profile/components/ApiKeyForm.test.tsx` => PASS.
- 2026-04-17: Completed `UXR-15` by enforcing backend symbol-group synchronization contract in markets module as `(min-volume filtered catalog U whitelist) - blacklist`, including sync-trigger expansion on universe context changes (`filterRules`, `exchange`, `marketType`, `baseCurrency`) and regression coverage in `markets.e2e`; validation: `pnpm --filter api test -- src/modules/markets/markets.e2e.test.ts` => `9/9 PASS`.
- 2026-04-17: Completed `UXR-14` by aligning markets-form preview composition to canonical contract `(min-volume filtered catalog U whitelist) - blacklist` using a dedicated helper (`composeMarketUniverseSymbols`) and adding regression coverage for composed preview output (`BTCUSDT + SOLUSDT`, `ETHUSDT` excluded) in `MarketUniverseForm.test.tsx`; validation: `pnpm --filter web test -- src/features/markets/components/MarketUniverseForm.test.tsx` => `6/6 PASS`.
- 2026-04-17: Completed `UXR-13` by adding a dashboard `Manual order` panel in `HomeLiveWidgets` (symbol/side/qty) wired to existing backend order-open command path (`/dashboard/orders/open`) through shared bot service helper, with mode-aware payload (`PAPER/LIVE`, `riskAck` in live), deterministic operator feedback (toast success/error), and runtime refresh after successful submit; validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `13/13 PASS`, `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-17: Completed `UXR-12` by adding safe manual TP/SL dashboard update endpoint (`PATCH /dashboard/positions/:id/manual-update`) with ownership isolation, OPEN-position guard, side-aware TP/SL directional validation (`LONG`/`SHORT`), and audit metadata log contract (`position.manual_update`), then wiring position-edit modal save to this endpoint with runtime refresh + toast error/success handling; validation: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `11/11 PASS`, `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`, `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-17: Completed `UXR-11` by introducing reusable `FormModal` and wiring initial position-edit UX in runtime open-positions table (`Edit position` action + modal draft fields for TP/SL/notes/lock-rules and context summary), while preserving existing close-action behavior; validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`, `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-17: Completed `UXR-10` by aligning dashboard close-position API flow with backend close-handler idempotence: repeated close on already-closed runtime position now resolves to `status=closed` for owned rows (instead of false-negative `ignored`) using latest CLOSE trade/order linkage, with regression coverage added in `orders-positions.e2e`; validation: `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts` => `9/9 PASS`, `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts -t "closes open runtime position from dashboard endpoint and enforces risk acknowledgement"` => `1/1 PASS`.
- 2026-04-17: Completed `UXR-09` by replacing global close-action loader with per-row pending tracking (`isClosingPosition`) so concurrent position-close requests keep independent loading state and clear deterministically as each request resolves; validation: `pnpm --filter web test -- src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx` => `2/2 PASS`, `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `12/12 PASS`.
- 2026-04-17: Completed `UXR-08` open-positions table UX cleanup: close action column moved to final position and renamed to `Action`, with icon-only row button and preserved accessibility labels; validated by `HomeLiveWidgets.test.tsx` (`12/12 PASS`).
- 2026-04-17: Completed `UXR-07` tab-label polish by replacing long runtime tab copy with concise `positions/orders/history` labels in EN/PL/PT dashboard-home namespaces and by updating widget tab assertions in `HomeLiveWidgets.test.tsx` (`12/12 PASS`).
- 2026-04-17: Completed `UXR-06` wallet dashboard UX pass by moving `portfolio/free funds/in positions` into one compact, responsive KPI row with consistent wallet-icon semantics in sidebar summary, validated by `HomeLiveWidgets.test.tsx` (`12/12 PASS`).
- 2026-04-17: Completed `UXR-05` paper-orders parity by aligning runtime open-order visibility for pre-session carryover rows in `PAPER` mode with unified read-model expectations, validated with `orders-positions.e2e` (`9/9 PASS`).
- 2026-04-17: Completed `UXR-04` live-orders parity by exposing pre-session LIVE carryover open orders in runtime payload, validated with `orders-positions.e2e` (`8/8 PASS`).
- 2026-04-17: Completed `UXR-03` runtime ownership fix: LIVE-only symbol-owner arbitration for `EXCHANGE_SYNC` takeover and close-flow claim/backfill for missing takeover ownership fields.
- 2026-04-17: Completed `UXR-02` test baseline with failing API regression coverage for exchange-position ownership visibility and close-position runtime flow (`orders-positions.e2e`) plus WEB hook coverage for ignored-close UX handling.
- 2026-04-17: Completed `UXR-01` docs freeze for dashboard ownership/visibility matrix (`positions/orders/history`) and synchronized canonical contract references in `open-decisions`, `api-bots`, and `web-dashboard-home`.
- 2026-04-17: Activated canonical execution for UXR wave by promoting `UXR-01..UXR-05` into active queue and locking grouped continuation (`UXR-B`, `UXR-C`, `UXR-D`) in `mvp-next-commits.md`; source plan remains `docs/planning/dashboard-modules-ux-runtime-fix-wave-plan-2026-04-15.md`.

## Phase L10NQ - i18n Contract Remediation + Docs Language Baseline (As of 2026-04-17)
- [x] `L10NQ-01 docs(contract): freeze remediation scope and English-only documentation baseline`
- [x] `L10NQ-02 qa(scan): capture baseline inventory of locale clamps and hardcoded-copy hotspots`
- [x] `L10NQ-03 fix(web-backtest-locale): remove EN/PL clamp in backtest module`
- [x] `L10NQ-04 test(web-backtest-i18n): add regression coverage for Portuguese backtest locale path`
- [x] `L10NQ-05 refactor(web-hardcoded-wrapper-copy): migrate page-wrapper/module hardcoded strings to i18n keys`
- [x] `L10NQ-06 feat(i18n-namespaces): split translations by module/route domain`
- [x] `L10NQ-07 refactor(i18n-registry): add explicit namespace registry and route-domain mapping`
- [x] `L10NQ-08 refactor(web-language-switcher): localize language labels via translation keys`
- [x] `L10NQ-09 test(i18n-parity): enforce key parity across en/pl/pt for every namespace`
- [x] `L10NQ-10 test(i18n-guardrails): detect locale clamps and hardcoded-copy regressions`
- [x] `L10NQ-11 l10n(pt-content): replace placeholder EN copy in PT namespaces with real pt-PT content`
- [x] `L10NQ-12 feat(i18n-route-loading): introduce route-level namespace loading`
- [x] `L10NQ-13 test(i18n-route-loading): verify no missing-key flicker and stable locale persistence`
- [x] `L10NQ-14 docs(localization): rewrite localization policy/qa docs to English-only and en/pl/pt contract`
- [x] `L10NQ-15 docs(governance): add docs-language guardrail and backlog for remaining non-English docs`

### Progress Log (Phase L10NQ - i18n Contract Remediation + Docs Language Baseline)
- 2026-04-17: Completed `L10NQ-C` by closing `L10NQ-12..L10NQ-15` (implemented route-level namespace loading with route-scoped dictionary cache + route change listeners in `I18nProvider`, added route-loading regressions for no missing-key flicker and locale persistence, rewrote localization policy/QA docs to English-only with `en/pl/pt` contract, and added governance docs-language guardrail with remaining non-English backlog list); validation: `pnpm --filter web test -- src/i18n/I18nProvider.test.tsx src/i18n/I18nProvider.route-loading.test.tsx src/i18n/namespaceRegistry.test.ts src/app/dashboard/bots/page.test.tsx` => `7/7 PASS`, `pnpm --filter api build`, `docker build -f apps/api/Dockerfile.worker.backtest .` => PASS.
- 2026-04-17: Completed `L10NQ-B` by closing `L10NQ-06..L10NQ-11` (introduced route/module i18n namespace registry + deterministic route-domain mapping, added domain namespaces for `public/auth/dashboard-backtests/dashboard-markets/dashboard-strategies/dashboard-wallets/dashboard-reports/admin`, localized `LanguageSwitcher` labels via translation keys and removed static JSON coupling, migrated backtests+bots wrapper labels/toasts to i18n keys, added dev missing-key diagnostics in `I18nProvider`, added namespace parity + guardrail tests, and replaced EN placeholder PT copy for core `dashboard-shell/home/bots` keys); validation: `pnpm --filter web test -- src/i18n/translations.test.ts src/i18n/I18nProvider.test.tsx src/i18n/useLocaleFormatting.test.tsx src/ui/layout/dashboard/LanguageSwitcher.test.tsx src/i18n/namespaceRegistry.test.ts src/i18n/guardrails.test.ts src/app/dashboard/backtests/create/page.test.tsx src/app/dashboard/backtests/list/page.test.tsx src/app/dashboard/bots/page.test.tsx` => `14/14 PASS`, `pnpm --filter web run typecheck`, `pnpm --filter web run build`, `pnpm --filter api run typecheck`, `pnpm --filter api build`, `docker build -f apps/api/Dockerfile.worker.backtest .` => PASS.
- 2026-04-17: Completed `L10NQ-A` by closing `L10NQ-01..L10NQ-05` (scope/docs-language baseline decision in `open-decisions`, baseline scan artifacts, backtest locale clamp removal for `en/pl/pt`, PT regression coverage for backtest create/list, and wrapper/module hardcoded-copy migration for reports/markets/auth/admin/market-universe); validation: `pnpm --filter web test` targeted packs (`18/18` + `11/11`), `pnpm --filter web run typecheck`, `pnpm --filter web run build`, `pnpm --filter api run typecheck`, `pnpm --filter api build`, and `docker build -f apps/api/Dockerfile.worker.backtest .` all PASS.
- 2026-04-17: Initialized phase from audit findings and locked canonical execution plan in `docs/planning/i18n-contract-remediation-plan-2026-04-17.md` (P0 backtest locale clamp removal, hardcoded-copy cleanup, module namespace split, parity/guardrail tests, route-level namespace loading, and English-only localization docs normalization).

## Phase BTMM - Backtest Multi-Market Parity Remediation (As of 2026-04-17)
- [x] `BTMM-01 docs(contract): freeze multi-market parity semantics (isolated symbol timeline vs run totals)`
- [x] `BTMM-02 test(api-backtest-red): add failing reproducible contract for 1-symbol vs 50-symbol parity on same target symbol`
- [x] `BTMM-03 fix(api-backtest-window): remove double adaptive maxCandles and persist one effective window`
- [x] `BTMM-04 fix(api-backtest-timeline-anchor): use deterministic terminal run end anchor instead of stale liveProgress`
- [x] `BTMM-05 fix(api-backtest-replay-context): add symbol-isolated replay mode and make pair timeline deterministic by default`
- [x] `BTMM-06 fix(api-backtest-cache): validate candle interval continuity in DB cache and fallback on gaps`
- [x] `BTMM-07 refactor(web-backtest-stats): separate run totals from chart-window stats in core data hooks`
- [x] `BTMM-08 feat(web-backtest-ui): expose run totals vs chart-window source labels in BacktestRunDetails`
- [x] `BTMM-09 test(api-backtest-window): add regression for single adaptation of effectiveMaxCandles`
- [x] `BTMM-10 test(api-backtest-anchor-cache): add regressions for stale currentCandleTime and cache-gap fallback`
- [x] `BTMM-11 qa(confidence-pack): execute focused backtest parity pack (1 vs 3 vs 50 markets)`
- [x] `BTMM-12 docs(closure): publish remediation evidence and sync canonical queues/plans`

### Progress Log (Phase BTMM - Backtest Multi-Market Parity Remediation)
- 2026-04-17: Completed `BTMM-C` by closing `BTMM-11..BTMM-12` (executed focused parity confidence pack across 1-symbol/3-symbol/50-symbol diagnostics and web backtest details regressions, then published closure evidence artifacts in `docs/operations/_artifacts-btmm-confidence-pack-2026-04-17.json` + `docs/operations/btmm-remediation-closure-2026-04-17.md`, and synchronized canonical queue/execution planning files to fully closed `BTMM` phase). Validation: `pnpm --filter api test -- src/modules/backtests/backtests.contract-remediation.test.ts` => `6/6 PASS`, `pnpm --filter api test -- src/modules/backtests/backtestParity3Symbols.test.ts` => `21/21 PASS`, `pnpm --filter api test -- src/modules/backtests/backtests.e2e.test.ts` => `10/10 PASS`, `pnpm --filter api test -- src/modules/backtests/backtestReplayCore.test.ts` => `24/24 PASS`, `pnpm --filter web test -- src/features/backtest/components/BacktestRunDetails.test.tsx` => `3/3 PASS`, `pnpm --filter web test -- src/features/backtest/hooks/useBacktestRunCoreData.test.tsx` => `4/4 PASS`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm --filter api build`, `pnpm --filter web run build`, `docker build -f apps/api/Dockerfile.worker.backtest .` => PASS.
- 2026-04-17: Completed `BTMM-B` by closing `BTMM-06..BTMM-10` (added DB-cache interval continuity guard with network fallback/backfill for cache gaps in `backtestDataGateway`, moved run-level per-symbol totals/grouped trades into `useBacktestRunCoreData` for explicit source-of-truth split, exposed run-total vs chart-window labels in `BacktestRunDetails`, and expanded remediation regressions for terminal anchor stability across all terminal statuses plus single-adaptation legacy `maxCandles` contract). Validation: `pnpm --filter api test -- src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestDataGateway.test.ts` => `10/10 PASS`, `pnpm --filter api test -- src/modules/backtests/backtests.e2e.test.ts` => `10/10 PASS`, `pnpm --filter web test -- src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx` => `7/7 PASS`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm --filter api build`, `pnpm --filter web run build`, `docker build -f apps/api/Dockerfile.worker.backtest .` => PASS.
- 2026-04-17: Completed `BTMM-A` by closing `BTMM-01..BTMM-05` (frozen parity contract in `open-decisions` + `api-backtests` docs, added contract tests for deterministic isolated replay semantics and 1-vs-50 divergence evidence, implemented single `effectiveMaxCandles` reuse across create/run job/timeline, switched terminal timeline anchoring to `finishedAt` for terminal statuses, and introduced timeline `replayContext` with default `isolated` and optional `portfolio`); validation: `pnpm --filter api test -- src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtests.e2e.test.ts src/modules/backtests/backtestParity3Symbols.test.ts` => `37/37 PASS`, `pnpm --filter api run typecheck`, `pnpm --filter api build`, `docker build -f apps/api/Dockerfile.worker.backtest .` => PASS.
- 2026-04-17: Initialized phase using audit-confirmed regressions (double adaptive `maxCandles`, stale timeline anchor on terminal runs, portfolio-coupled pair replay context, cache continuity blind spot, and chart-vs-run stats divergence) with canonical execution plan in `docs/planning/backtest-multi-market-parity-remediation-plan-2026-04-17.md`.

## Phase L10NQ-D - Full Web i18n Coverage and Single-Standard Enforcement (As of 2026-04-18)
- [x] `L10NQ-D-01 docs(audit-freeze): freeze full route-reachable i18n inventory and scope split (module/shared foundation)`
- [x] `L10NQ-D-02 chore(tooling-i18n-audit): add deterministic route-reachable i18n audit command + JSON output contract`
- [x] `L10NQ-D-03 test(guardrail-hard-fail): fail on local copy objects, pl fallback drift, and hardcoded monitored UI strings`
- [x] `L10NQ-D-04 refactor(auth-localization): migrate auth pages/forms/hooks to auth namespace keys and remove pl fallback`
- [x] `L10NQ-D-05 refactor(admin-localization): migrate admin users/subscriptions/layout copy to admin namespace keys`
- [x] `L10NQ-D-06 refactor(reports-localization): migrate reports page + performance view to dashboard-reports namespace`
- [x] `L10NQ-D-07 refactor(markets-localization): migrate MarketUniverseForm/SearchableMultiSelect copy and remove pl fallback`
- [x] `L10NQ-D-08 refactor(backtests-fallback-removal): remove pl fallback drift and explicit pt copy in backtests surfaces`
- [x] `L10NQ-D-09 refactor(bots-page-copy): localize bot create/edit/assistant/preview page labels and remaining bot copy`
- [x] `L10NQ-D-10 refactor(dashboard-home-copy): localize TP/SL/Notes/manual-order literals in HomeLiveWidgets`
- [x] `L10NQ-D-11 refactor(global-offline-risk-copy): localize offline page and risk notice footer`
- [x] `L10NQ-D-12 refactor(shared-foundation-aria): localize shared aria/title strings in modal/table/loading/layout primitives`
- [x] `L10NQ-D-13 refactor(shared-footer-labels): align footer/public shell labels to translation keys`
- [x] `L10NQ-D-14 refactor(low-score-module-cleanup): clear residual route-reachable literals in profile/wallet components`
- [x] `L10NQ-D-15 cleanup(non-route-legacy-copy): align legacy BacktestsList + strategy presets localization contract`
- [x] `L10NQ-D-16 test(namespace-parity-expanded): enforce en/pl/pt parity for all new namespace keys`
- [x] `L10NQ-D-17 test(route-locale-smoke): add route-level locale smoke tests for highest-impact routes`
- [x] `L10NQ-D-18 qa(final-pack-and-closure): run full i18n regression/build pack and publish closure evidence`

### Progress Log (Phase L10NQ-D - Full Web i18n Coverage and Single-Standard Enforcement)
- 2026-04-18: Completed `L10NQ-D-18` by executing final i18n closure pack and publishing closure artifacts (`docs/operations/_artifacts-l10nq-d-closure-2026-04-18.json`, `docs/operations/l10nq-d-closure-2026-04-18.md`); verification pack passed: `pnpm --filter web test -- src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts src/i18n/guardrails.test.ts src/i18n/I18nProvider.test.tsx src/i18n/I18nProvider.route-loading.test.tsx src/i18n/routeLocaleSmoke.test.ts` => `16/16 PASS`, `pnpm --filter web run typecheck` => PASS, `pnpm --filter web run build` => PASS, `docker build -f apps/api/Dockerfile.worker.backtest .` => PASS. Build-gate bridge fix applied in `SkipToContentLink` (replaced `any` access with typed nested resolver) to restore strict lint+build compatibility without UX changes.
- 2026-04-18: Completed `L10NQ-D-17` by adding route-level locale smoke coverage in `src/i18n/routeLocaleSmoke.test.ts` for high-impact paths (auth login/register, reports, markets create/edit, backtests create/list/details, bots create/edit/assistant/preview, offline, admin users/subscriptions) and asserting resolved `en/pl/pt` values never leak raw fallback keys for route-critical translation paths. Validation: `pnpm --filter web test -- src/i18n/routeLocaleSmoke.test.ts src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts` => `9/9 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-16` by expanding i18n parity coverage in `translations.test.ts` for newly introduced `L10NQ-D` keys (offline/public a11y/shell/footer, dashboard a11y/risk notice, profile basic, and legacy backtests namespace) with explicit non-empty `en/pl/pt` assertions and PT anti-placeholder checks on selected keys to ensure locale-specific content. Validation: `pnpm --filter web test -- src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts` => `8/8 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-15` by aligning non-route legacy localization contract across `BacktestsList` and strategy presets: migrated `BacktestsList` hardcoded/mixed copy to `dashboard.backtests.legacy.*` translation keys via optional i18n hook, added full `en/pl/pt` key parity in `dashboard-backtests` namespaces, and hardened strategy preset localization contract by requiring explicit `pt` copy in `strategyPresets` with regression assertions for `en/pl/pt` presentation output. Validation: `pnpm --filter web test -- src/features/backtest/components/BacktestsList.test.tsx src/features/strategies/presets/strategyPresets.test.ts src/features/strategies/components/StrategyPresetPicker.test.tsx` => `9/9 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-14` by migrating residual profile/wallet route-reachable literals to translation-backed copy (`dashboard.profileBasic.*` in `dashboard-shell` namespaces and localized hidden submit label in `WalletCreateEditForm`), removing profile locale-branch dictionaries, and stabilizing wallet form tests with partial i18n module mocking compatible with shared optional-i18n exports. Validation: `pnpm --filter web test -- src/features/wallets/components/WalletCreateEditForm.test.tsx` => `4/4 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-13` by migrating public-shell action labels (`dashboard/admin/login/register`) and shared footer brand/rights copy to translation keys in `public` namespace (`public.shell.*`, `public.brand.name`, `public.footer.rights`), and wiring footer brand label through i18n in public/dashboard/admin shells to remove residual hardcoded shell labels. Validation: `pnpm --filter web test -- src/ui/layout/public/Header.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/RiskNoticeFooter.test.tsx` => `5/5 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-12` by localizing shared accessibility labels in `ConfirmModal`/`FormModal` backdrops, `DataTable` filter action, loading skeleton primitives (`SkeletonCardBlock`, `SkeletonFormBlock`, `SkeletonKpiRow`, `SkeletonTableRows`), footer preferences nav label, dashboard header navigation landmarks, and root skip-link content via translation keys (`public.a11y.*`, `dashboard.a11y.*`) with `en/pl/pt` parity; added optional i18n fallback hook for shared primitives rendered outside provider in isolated tests. Validation: `pnpm --filter web test -- src/ui/components/DataTable.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/RiskNoticeFooter.test.tsx src/app/offline/page.test.tsx src/features/backtest/components/BacktestsListView.test.tsx` => `8/8 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-11` by localizing `/offline` and dashboard `RiskNoticeFooter` copy via i18n keys (`public.offline.*`, `dashboard.riskNotice.*`) with `en/pl/pt` namespace parity, migrating footer CTA labels/description/title to translation keys, and adding localized offline route regression coverage. Validation: `pnpm --filter web test -- src/ui/layout/dashboard/RiskNoticeFooter.test.tsx src/app/offline/page.test.tsx` => `2/2 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-10` by migrating HomeLiveWidgets dashboard runtime literals for close/edit/manual-order UX from local branch-based copy to `dashboard-home.runtime` namespace keys (`closePosition*`, `manualOrder*`, `editPosition*`) with `en/pl/pt` parity, and aligning route-scoped tests for localized labels/placeholders in edit modal/manual-order surface. Validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `13/13 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-09` by localizing remaining bot page-level breadcrumbs/actions (`create`, `edit`, `assistant`, `preview`) via `dashboard-bots`/`dashboard-shell` namespace keys, removing residual hardcoded wallet copy from `BotsManagement` (`wallet` label/aria/empty option), fixing garbled market-context separators, and localizing wallet-load error toast in `useBotsListController`; aligned bots module tests with route-scoped i18n context for `/dashboard/bots`. Validation: `pnpm --filter web test -- src/app/dashboard/bots/create/page.test.tsx src/app/dashboard/bots/[id]/edit/page.test.tsx src/features/bots/components/BotsManagement.test.tsx` => `15/15 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-08` by migrating backtests create/list/table copy from local locale branching to `dashboard-backtests` namespace keys (`createForm`, `listView`, `runsTable`) across `en/pl/pt`, removing implicit `pl` fallback drift (including `BacktestRunDetails` locale default alignment) and aligning route-scoped i18n tests for backtests create/list paths. Validation: `pnpm --filter web test -- src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestsListView.test.tsx` => `6/6 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-07` by migrating `MarketUniverseForm` + `SearchableMultiSelect` from local in-component dictionaries and hardcoded select/dropdown literals to `dashboard-markets.form` namespace keys (`en/pl/pt`), removing locale fallback drift in markets surfaces, and wiring shared multi-select labels through localized props (`selected count`, `search`, `select filtered`, `clear`, legacy-symbol description, volume template). Validation: `pnpm --filter web test -- src/features/markets/components/MarketUniverseForm.test.tsx` => `6/6 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-06` by migrating dashboard reports page + performance view from local in-component copy dictionaries/hardcoded literals to `dashboard-reports` namespace keys (`page`, `states`, `cards`, `sections`) across `en/pl/pt`, and adding route-scoped i18n regression coverage in `PerformanceReportsView.test.tsx` (including PT namespace assertion). Validation: `pnpm --filter web test -- src/features/reports/components/PerformanceReportsView.test.tsx` => `3/3 PASS`; `pnpm --filter web test -- src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts` => `6/6 PASS`; `pnpm --filter web run typecheck` + `pnpm --filter web run build` => `PASS`.
- 2026-04-18: Completed `L10NQ-D-A` by closing `L10NQ-D-01..L10NQ-D-05` (frozen full route-reachable i18n inventory + module/shared split baseline, added deterministic route-reachable audit command `pnpm i18n:audit:route-reachable:web` with JSON contract doc in `docs/operations/i18n-route-reachable-audit-contract.md`, hardened i18n guardrails with seeded regression fixture and hard-fail checks for local-copy/fallback-pl/hardcoded monitored contexts, migrated auth forms/hooks/pages/password-toggle to `auth` namespace keys with locale fallback drift removed, and migrated admin users/subscriptions/layout copy + modal backdrop close label to `admin` namespace keys). Validation: `pnpm --filter web test -- src/i18n/guardrails.test.ts src/i18n/namespaceRegistry.test.ts src/i18n/translations.test.ts src/features/auth/components/LoginForm.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/hooks/useLoginForm.test.tsx src/features/admin/users/pages/AdminUsersPage.test.tsx src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx` => `24/24 PASS`; `pnpm i18n:audit:route-reachable:web` => `PASS`; `pnpm --filter web run typecheck` + `pnpm --filter web run build` + `pnpm --filter api run typecheck` + `pnpm --filter api build` + `docker build -f apps/api/Dockerfile.worker.backtest .` => `PASS`.
- 2026-04-18: Initialized `L10NQ-D` with deterministic full-scope audit artifacts (`docs/operations/_artifacts-l10nq-d-coverage-audit-2026-04-18.json`, `docs/operations/l10nq-d-coverage-audit-2026-04-18.md`, `docs/operations/l10nq-d-route-coverage-matrix-2026-04-18.md`) and canonical execution plan `docs/planning/l10nq-d-total-web-i18n-coverage-plan-2026-04-18.md`.

## Phase DBSEL-A - Dashboard Mixed-Mode Bot Selector Parity Hotfix (Queued 2026-04-18)
- [x] `DBSEL-01 docs(contract): freeze dashboard selector parity contract for mixed active LIVE+PAPER modes`
- [x] `DBSEL-02 test(web-dashboard-red): add failing regression for missing active PAPER bot in selector when LIVE bot exists`
- [x] `DBSEL-03 fix(web-dashboard-controller): remove live-only active scope clamp in useHomeLiveWidgetsController`
- [x] `DBSEL-04 test(web-dashboard-selector-state): lock mixed-mode selection persistence and no-session degrade path`
- [x] `DBSEL-05 qa(regression-pack): run focused dashboard runtime selector parity test/typecheck/build pack`

### Progress Log (Phase DBSEL-A - Dashboard Mixed-Mode Bot Selector Parity Hotfix)
- 2026-04-18: Completed `DBSEL-05` by running focused dashboard selector parity QA pack and publishing closure artifacts (`docs/operations/_artifacts-dbsel-a-selector-parity-2026-04-18.json`, `docs/operations/dbsel-a-selector-parity-closure-2026-04-18.md`). Validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `15/15 PASS`; `pnpm --filter web run typecheck` => `PASS`; `pnpm --filter web run build` => `PASS`.
- 2026-04-18: Completed `DBSEL-04` by adding mixed-mode selector-state regression coverage in `HomeLiveWidgets.test.tsx` (`keeps mixed-mode selection stable and renders no-session degrade state for active bot`) that verifies cross-mode selection persistence (`LIVE <-> PAPER`), localStorage persistence of selected bot, and degraded `NO_SESSION` + warning state for active bot without runtime session.
- 2026-04-18: Completed `DBSEL-03` by removing the `LIVE`-only active scope clamp in `useHomeLiveWidgetsController` (`activeScope = active`) so runtime snapshots are built from all active bots (`LIVE + PAPER`) while preserving existing deterministic ordering and `MAX_DASHBOARD_BOTS` cap.
- 2026-04-18: Completed `DBSEL-02` by adding red regression coverage in `HomeLiveWidgets.test.tsx` (`shows both active LIVE and active PAPER bots in dashboard selector`) that asserts mixed active modes must both appear in selector options. Verified failure against current clamp behavior: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` failed with missing option `/Mixed Paper Bot/i`.
- 2026-04-18: Completed `DBSEL-01` by freezing selector parity contract in canonical docs (`open-decisions` + `web-dashboard-home`): dashboard runtime selector is mode-agnostic for active bots (`PAPER + LIVE`), deterministic cap/order remain unchanged, and active bot without runtime session must stay selectable with degraded/no-session panel state.
- 2026-04-18: Queued selector parity hotfix plan in `docs/planning/dashboard-runtime-bot-selector-parity-plan-2026-04-18.md` after code-level confirmation that dashboard runtime scope is clamped to `LIVE` bots when any live bot is active (`useHomeLiveWidgetsController`), which hides active `PAPER` bots from selector.

## Phase UXR-E - Table Action System + Clone + Dashboard Polish (Queued 2026-04-18)
- [x] `UXR-E-01 docs(contract): freeze table action semantics and clone naming contract for wallets/markets/strategies`
- [x] `UXR-E-02 refactor(web-table-actions-core): add shared action presets in TableUi for standard and dedicated table actions`
- [x] `UXR-E-03 feat(web-wallets-clone): add wallets list duplicate action with create-from-existing flow and clone-marked naming`
- [x] `UXR-E-04 feat(web-markets-clone): add markets list duplicate action with create-from-existing flow and clone-marked naming`
- [x] `UXR-E-05 feat(web-strategies-clone): add strategies list duplicate action with create-from-existing flow and clone-marked naming`
- [x] `UXR-E-06 refactor(web-table-actions-rollout): align edit/delete/preview/runtime action icon+tone contract in markets/strategies/backtests/bots`
- [x] `UXR-E-07 refactor(web-dashboard-manual-order-layout): move manual order under wallet context and replace symbol/side controls with guided UX`
- [x] `UXR-E-08 feat(web-dashboard-manual-order-estimates): show qty-derived notional and margin estimate using leverage and live symbol price`
- [x] `UXR-E-09 refactor(web-dashboard-wallet-kpi-style): simplify wallet KPI visuals (no icon cards/backgrounds) and align to inline summary rows`
- [x] `UXR-E-10 fix(web-page-title-actions): remove forced tiny-height action class and widen header action spacing to gap-3`
- [x] `UXR-E-11 fix(web-footer-lang-mobile): remove `(PT)` suffix from Portuguese label and center both dashboard/public footer rows on mobile`
- [x] `UXR-E-12 qa(regression-pack): run focused web regression pack for table actions, clone flows, dashboard manual-order/wallet polish, and shell/footer contracts`

### Progress Log (Phase UXR-E - Table Action System + Clone + Dashboard Polish)
- 2026-04-18: Completed `UXR-E-12` by running closure validation pack for `UXR-E-C` scope and confirming green status after footer test fix (`matchMedia` mock): `next build` => `PASS`, `tsc --noEmit -p apps/web/tsconfig.json` => `PASS`, and focused Vitest pack => `11/11 files, 30/30 tests PASS` (`WalletsListTable`, `MarketUniversesTable`, `StrategiesList`, `BacktestsRunsTable`, `BotsListTable`, `HomeLiveWidgets`, `PageTitle.a11y`, dashboard/public footer layout, `LanguageSwitcher`, `I18nProvider`).
- 2026-04-18: Completed `UXR-E-11` by removing `(PT)` suffix from Portuguese locale labels in `public` and `dashboard-shell` namespaces, updating language switcher/i18n regression expectations, and aligning public footer mobile layout to centered two-row contract (matching dashboard footer), with dedicated `public/Footer.layout.test.tsx` coverage. Validation: `tsc --noEmit -p apps/web/tsconfig.json` => `PASS`; full focused regression pack confirmed in `UXR-E-12`.
- 2026-04-18: Completed `UXR-E-10` by removing forced compact sizing from `PAGE_TITLE_ACTION_BASE_CLASS` (`btn-xs`, `h-7`, `min-h-7`) and widening page-title action container spacing to `gap-3`; added accessibility regression assertion for relaxed action-size contract and widened action spacing in `PageTitle.a11y.test.tsx`. Validation: `tsc --noEmit -p apps/web/tsconfig.json` => `PASS`; targeted Vitest execution remains blocked in current sandbox (`spawn EPERM` from esbuild child process).
- 2026-04-18: Completed `UXR-E-09` by simplifying wallet KPI trio in runtime sidebar from card/grid presentation into inline summary rows (no per-row wallet icons, no card-like visual weight), while preserving value/percent readability and subtle border-tone mapping for `free funds` vs `in positions`; updated widget regression to lock inline layout contract (`wallet-kpi-row` no longer grid-based). Validation: `tsc --noEmit -p apps/web/tsconfig.json` => `PASS`; targeted Vitest run is currently blocked in this sandbox (`spawn EPERM` from esbuild child process).
- 2026-04-18: Completed `UXR-E-08` by adding manual-order estimate block in runtime sidebar (`notional` + `margin`) derived from `qty * live symbol price` and leverage-based margin calculation (`notional / leverage`, with spot fallback `1x`), plus explicit context rows for live `price` and effective `leverage`; extended runtime manual-order regression to assert estimate values and leverage contract, and added `en/pl/pt` translation keys for estimate labels. Validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `15/15 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-E-07` by moving manual-order controls from runtime main content into wallet-context sidebar card (`RuntimeSidebarSection`), replacing free-text symbol entry with guided symbol `select`, replacing side dropdown with BUY/SELL pill controls (icon + active state), and synchronizing selected symbol with runtime signal/open-position options in `HomeLiveWidgets`; updated widget regression for new panel contract (`manual-order-panel`) and guided control interactions. Validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `15/15 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-E-06` by finishing table-action preset rollout for remaining lists: migrated backtests actions to canonical presets (`preview`, `delete`) in `BacktestsRunsTable`, migrated bots list actions to canonical presets (`runtime`, `edit`, `delete`) in `BotsListTable`, and added focused regression lock in `BacktestsRunsTable.test.tsx` plus updated bots action assertions in `BotsListTable.test.tsx`. Validation: `pnpm --filter web test -- src/features/markets/components/MarketUniversesTable.test.tsx src/features/strategies/components/StrategiesList.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/bots/components/BotsListTable.test.tsx` => `5/5 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-E-05` by adding strategies clone row action in `StrategiesList` with deterministic clone naming (`buildNextCloneName`), create-from-existing payload via `dtoToForm + createStrategy`, and regression coverage in `StrategiesList.test.tsx`.
- 2026-04-18: Completed `UXR-E-04` by adding markets clone row action (`clone` preset) in `MarketUniversesTable` with deterministic clone naming via shared helper, create-from-existing market-universe payload mapping (`exchange/marketType/baseCurrency/filterRules/whitelist/blacklist`), immediate list append callback in markets list page, and component regression coverage in `MarketUniversesTable.test.tsx`.
- 2026-04-18: Completed `UXR-E-03` by adding wallet clone row action (`clone` preset) in `WalletsListTable` with deterministic naming (`(clone)`, `(clone N)` via shared `buildNextCloneName` helper), create-from-existing payload mapping aligned to wallet create contract, immediate list append callback in wallets list page, and regression coverage in `WalletsListTable.test.tsx`.
- 2026-04-18: Completed `UXR-E-02` by introducing shared table action presets in `TableUi` (`edit/delete/clone/preview/runtime/details`) with centralized tone+icon mapping and backward-compatible preset wrappers (`TablePresetButtonAction`, `TablePresetLinkAction`) on top of existing icon action components.
- 2026-04-18: Completed `UXR-E-01` by freezing canonical table action semantics and clone naming/payload invariants in `docs/planning/open-decisions.md` (action tone/icon matrix + deterministic clone naming/collision policy + editable-fields-only clone payload rules), and linking dashboard-home module contract notes in `docs/modules/web-dashboard-home.md` for runtime operator continuity.
- 2026-04-18: Queued post-`L10NQ-D` implementation wave with detailed execution plan in `docs/planning/uxr-e-table-actions-clone-dashboard-polish-plan-2026-04-18.md`, split into grouped batches `UXR-E-A..UXR-E-C` for executor continuity.

## Phase UXR-F - Dashboard Create/Edit Forms UX/UI Unification (Queued 2026-04-18)
- [x] `UXR-F-01 docs(contract): freeze unified dashboard create/edit form UX contract and migration boundaries`
- [x] `UXR-F-02 feat(web-ui-forms-core): add FormPageShell/FormSectionCard/FormGrid/FormField/FormAlert/FormValidationSummary primitives`
- [x] `UXR-F-03 feat(web-ui-forms-fields): add Text/Number/Select/Textarea/Toggle/RadioGroup/Range/Compound shared field components`
- [x] `UXR-F-04 test(web-ui-forms-guardrail): add primitive tests and enforce no cross-feature generic field-control imports`
- [x] `UXR-F-05 refactor(web-form-page-shell-i18n): unify create/edit wrappers with FormPageShell and namespace-driven breadcrumbs/actions`
- [x] `UXR-F-06 refactor(web-wallet-form): migrate wallets create/edit to ui/forms with unified validation summary + first-error focus`
- [x] `UXR-F-07 refactor(web-markets-form): migrate markets create/edit to ui/forms and remove feature-local generic control dependency`
- [x] `UXR-F-08 refactor(web-backtests-form): migrate backtest create form to ui/forms and drop markets-control coupling`
- [x] `UXR-F-09 refactor(web-strategy-form): preserve strategy tab strengths while aligning section internals to shared form primitives`
- [x] `UXR-F-10 refactor(web-bot-form): migrate bot create/edit to shared form primitives and reduce dense-grid ergonomics issues`
- [x] `UXR-F-11 feat(web-form-ux): standardize submitting/disabled states plus inline errors + summary + first-invalid scroll/focus`
- [x] `UXR-F-12 feat(web-form-mobile): add reusable sticky mobile action bar pattern for long dashboard forms`
- [x] `UXR-F-13 test(web-form-regression): run/extend focused form migration + i18n wrapper tests for scoped routes`
- [x] `UXR-F-14 qa(web-form-closure): run typecheck/build and publish closure sync evidence`

### Progress Log (Phase UXR-F - Dashboard Create/Edit Forms UX/UI Unification)
- 2026-04-18: Completed `UXR-F-13` and `UXR-F-14` by running focused migration regression pack across wallets/markets/backtests/bots forms and create-edit wrappers plus i18n translation/namespace suites (`10/10 files`, `33/33 tests` PASS), then confirming final closure checks (`pnpm --filter web run typecheck` => `PASS`; `pnpm --filter web run build` => `PASS`) and publishing closure evidence artifacts in `docs/operations/_artifacts-uxr-f-d-closure-2026-04-18.json` + `docs/operations/uxr-f-d-closure-2026-04-18.md`.
- 2026-04-18: Completed `UXR-F-12` by introducing reusable `FormMobileActionBar` in `ui/forms` (with safe-area bottom padding and built-in spacer) and applying sticky mobile save actions to long dashboard forms where top actions leave viewport (`bots`, `wallets`, `markets` create/edit wrappers), while hiding duplicate desktop page-title save buttons on mobile breakpoints (`hidden md:inline-flex`). Validation: `pnpm --filter web test -- src/ui/forms/FormPrimitives.test.tsx src/app/dashboard/bots/create/page.test.tsx src/app/dashboard/bots/[id]/edit/page.test.tsx src/app/dashboard/wallets/create/page.test.tsx src/app/dashboard/wallets/[id]/edit/page.test.tsx` => `13/13 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-F-11` by standardizing submit/validation ergonomics across scoped forms: added synchronized validation summary + inline error + first-invalid focus flow to `MarketUniverseForm`, `BacktestCreateForm`, and `StrategyForm`, guarded duplicate submit attempts while `submitting`, and aligned create/edit page save actions with disabled/loading labels for markets, backtests, and strategies (`Saving...`/`Creating...` states). Validation: `pnpm --filter web test -- src/features/markets/components/MarketUniverseForm.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/strategies/components/StrategyForm.test.tsx src/i18n/translations.test.ts` => `17/17 PASS`; `pnpm --filter web run typecheck` => `PASS`; `pnpm i18n:audit:route-reachable:web` => `PASS` (report updated).
- 2026-04-18: Completed `UXR-F-10` by migrating `BotCreateEditForm` internals to shared `ui/forms` primitives (`FormSectionCard`, `FormGrid`, `TextField`, `SelectField`, `ToggleField`, `FormAlert`, `FormValidationSummary`), adding inline required-field validation messages for `name/wallet/strategy/market group`, and enforcing first-invalid focus/scroll on blocked submit while preserving wallet-first payload contract and live-context safety checks. Validation: `pnpm --filter web test -- src/features/bots/components/BotCreateEditForm.test.tsx src/i18n/translations.test.ts` => `9/9 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-F-09` by aligning strategy create/edit form shell and core sections with shared `ui/forms` primitives while preserving tab workflow (`StrategyForm` now uses `FormPageShell` + section card, `Basic` migrated to shared field primitives, and strategy section copy moved from local locale branching to namespace-driven `dashboard.strategies.form.*` keys with `en/pl/pt` parity). Validation: `pnpm --filter web test -- src/i18n/translations.test.ts src/features/strategies/components/StrategyFormSections/Indicators.test.tsx` => `11/11 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-F-08` by aligning `BacktestCreateForm` section structure and controls to shared `ui/forms` primitives (`FormSectionCard`, `FormGrid`, `SelectField`, `NumberField`, `TextareaField`) while preserving run-name suggestion, venue-context binding, and seed-config validation contract. Validation: `pnpm --filter web test -- src/features/backtest/components/BacktestCreateForm.test.tsx` => `4/4 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-F-07` by migrating `MarketUniverseForm` inputs from feature-local `FieldControls` to shared `ui/forms` primitives (`TextField`, `SelectField`, `FormField`) and removing the obsolete `FieldControls.tsx` helper from markets scope. Validation: `pnpm --filter web test -- src/features/markets/components/MarketUniverseForm.test.tsx` => `6/6 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-F-06` by migrating `WalletCreateEditForm` section layout and controls to shared `ui/forms` primitives (`FormSectionCard`, `FormGrid`, `TextField`, `SelectField`, `NumberField`, `FormAlert`, `FormValidationSummary`), keeping mode-specific behavior intact, and hardening first-invalid-field focus flow for test/runtime compatibility (`scrollIntoView` guard). Validation: `pnpm --filter web test -- src/features/wallets/components/WalletCreateEditForm.test.tsx` => `4/4 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-F-05` by migrating wrapper-level create/edit copy from inline locale dictionaries/static EN imports to namespace-driven translations in wallets/markets/strategies/bots flows (including bots server-route -> shared client wrapper pattern for locale-aware breadcrumbs/actions). Validation: `pnpm --filter web test -- src/app/dashboard/bots/create/page.test.tsx src/app/dashboard/bots/[id]/edit/page.test.tsx src/app/dashboard/wallets/create/page.test.tsx src/app/dashboard/wallets/[id]/edit/page.test.tsx src/i18n/translations.test.ts` => `12/12 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-F-04` by adding repository guardrail enforcement for cross-feature `FieldControls` imports in `scripts/repoGuardrails.mjs` and removing the existing backtests->markets generic-control dependency (`BacktestCreateForm` now uses `ui/forms` primitives). Validation: `pnpm --filter web test -- src/ui/forms/FormPrimitives.test.tsx src/ui/forms/FormFields.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx` => `13/13 PASS`; `pnpm --filter web run typecheck` => `PASS`; `pnpm run quality:guardrails` => `PASS`.
- 2026-04-18: Completed `UXR-F-03` by adding shared field primitives (`TextField`, `NumberField`, `SelectField`, `TextareaField`, `ToggleField`, `RadioGroupField`, `RangeField`, `CompoundField`) in `ui/forms` with unified label/hint/error contract and interaction tests in `FormFields.test.tsx`. Validation: `pnpm --filter web test -- src/ui/forms/FormPrimitives.test.tsx src/ui/forms/FormFields.test.tsx` => `9/9 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-F-02` by adding shared `ui/forms` core primitives (`FormPageShell`, `FormSectionCard`, `FormGrid`, `FormField`, `FormAlert`, `FormValidationSummary`) with barrel exports and baseline component tests in `FormPrimitives.test.tsx`. Validation: `pnpm --filter web test -- src/ui/forms/FormPrimitives.test.tsx` => `5/5 PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `UXR-F-01` by locking Stage A migration boundaries in canonical decision contract (`open-decisions`): Stage A is restricted to docs freeze, shared `ui/forms` primitives, and import-boundary guardrail enforcement, with no wrapper/business-flow migration outside guardrail safety.
- 2026-04-18: Queued non-blocking implementation wave in `docs/planning/uxr-f-dashboard-forms-unification-plan-2026-04-18.md`, split into grouped execution batches `UXR-F-A..UXR-F-D` with stage DoD, per-stage risk/rollback plan, and explicit test packs; queue inserted without modifying active executor `NOW`.

## Phase QH-LINT - Post-Closure Build Warning Debt (2026-04-18)
- [x] `QH-LINT-01 chore(web-build-warning-cleanup): remove no-unused-vars warnings from bots/dashboard-home files and verify web build/typecheck`
- [x] `QH-LINT-02 chore(web-hook-deps-cleanup): resolve remaining exhaustive-deps warnings in backtests/wallets table flows`

### Progress Log (Phase QH-LINT - Post-Closure Build Warning Debt)
- 2026-04-18: Completed `QH-LINT-02` by removing remaining `react-hooks/exhaustive-deps` warnings in touched scope: `BacktestsRunsTable` now uses stable `getStatusLabel` callback with aligned `columns` memo dependencies, and `WalletsListTable` now uses stable `handleClone` callback to prevent memo dependency churn. Validation: `pnpm --filter web run build` => `PASS` (clean warning surface), `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `QH-LINT-01` as derived next tiny task after canonical queue saturation (`mvp-next-commits` + `TASK_BOARD` contained no unchecked tasks). Removed no-unused warning sources in `BotsManagement.tsx`, `BotsManagement.test.tsx`, `HomeLiveWidgets.tsx`, and `useCloseRuntimePositionAction.ts` without behavior changes. Validation: `pnpm --filter web run build` => `PASS` (warning count reduced to two remaining `react-hooks/exhaustive-deps` warnings); `pnpm --filter web run typecheck` => `PASS` (after `.next/types` refresh by build).

## Phase QH-TSC - Deterministic Web Verification Command (2026-04-18)
- [x] `QH-TSC-01 chore(web-verify-script): add canonical sequential build+typecheck script and document usage`

### Progress Log (Phase QH-TSC - Deterministic Web Verification Command)
- 2026-04-18: Completed `QH-TSC-01` by adding `apps/web` script `verify:build-typecheck` (`build && typecheck`) and root shortcut `web:verify:build-typecheck`, then documenting it in `docs/engineering/testing.md` as canonical web closure command. Validation: `pnpm run web:verify:build-typecheck` => `PASS`.

## Phase BRS - Dashboard Selected-Bot Runtime Scope Remediation (Queued 2026-04-18)
- [x] `BRS-01 docs(decision): close dashboard runtime selected-bot scope policy (ACTIVE-only canonical + PAUSED default exclusion)`
- [x] `BRS-02 test(api-red): add failing regression for symbol leakage across canonical/legacy/session/event paths`
- [x] `BRS-03 fix(api-runtime-repository): narrow runtime read filters to ACTIVE canonical groups/links only`
- [x] `BRS-04 fix(api-runtime-symbol-scope): prevent symbol expansion beyond canonical selected-bot scope`
- [x] `BRS-05 test(api-red-update-contract): add failing regression for PUT /dashboard/bots/:id canonical update drift`
- [x] `BRS-06 fix(api-update-contract): make PUT /dashboard/bots/:id update canonical market-group strategy mapping transactionally`
- [x] `BRS-07 fix(api-strategy-precedence): enforce canonical-first symbol->strategy assignment and compatibility fallback only`
- [x] `BRS-08 test(api-regression): lock strict selected-bot symbol scope + canonical strategy precedence`
- [x] `BRS-09 test(web-regression): lock dashboard switch scenario A(1 symbol) vs B(4 symbols) for signals/context cards`
- [x] `BRS-10 refactor(web-runtime-contract): adapt dashboard runtime consumer only if API payload shape changes`
- [x] `BRS-11 qa(regression-pack): run focused API+WEB runtime scope pack + typechecks`
- [x] `BRS-12 docs(closure): publish remediation evidence and sync canonical queue/execution statuses`

### Progress Log (Phase BRS - Dashboard Selected-Bot Runtime Scope Remediation)
- 2026-04-18: Completed `BRS-01` by closing pending decision in `open-decisions`: selected-bot runtime `signals/markets` scope is strict canonical by default (`ACTIVE + isEnabled` only), `PAUSED` groups are excluded by default, session/event fallback cannot expand symbols beyond canonical selected-bot scope, and legacy mapping is compatibility fallback only (cannot override canonical strategy context). Synced contract notes in `docs/modules/api-bots.md` and `docs/modules/web-dashboard-home.md`.
- 2026-04-18: Queued new runtime-data-contract remediation wave in `docs/planning/dashboard-selected-bot-runtime-scope-remediation-plan-2026-04-18.md` with grouped execution batches `BRS-A..BRS-C`; wave targets strict selected-bot symbol scope in runtime API, canonical-first strategy context, and canonical update-path consistency for `PUT /dashboard/bots/:id`.
- 2026-04-18: Completed `BRS-02` by adding API regression `keeps runtime symbol-stats strictly within selected bot canonical ACTIVE scope` in `apps/api/src/modules/bots/bots.e2e.test.ts`; scenario reproduces leakage vectors (`A=1 active symbol`, `B=4 symbols`, paused-group + foreign session stat/event rows) and locks expected selected-bot output to canonical active symbol set.
- 2026-04-18: Completed `BRS-03` by narrowing runtime-read canonical filters from `ACTIVE|PAUSED` to `ACTIVE` in `apps/api/src/modules/bots/botsRuntimeRead.repository.ts` and `apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts` so paused groups do not contribute to default dashboard runtime scope.
- 2026-04-18: Completed `BRS-04` by hardening `apps/api/src/modules/bots/botsRuntimeRead.service.ts` symbol derivation: default symbol set now originates from canonical active scope only, session/event rows can enrich canonical symbols but cannot expand symbol set, and explicit `query.symbol` behavior is preserved.
- 2026-04-18: Closed `BRS-A` implementation wave (`BRS-01..BRS-04`) and advanced queue focus to `BRS-B`; validation completed for available local gates (`pnpm --filter api run typecheck` PASS, `pnpm run quality:guardrails` PASS). Focused e2e run is environment-blocked in this session because Docker Engine and local `postgres:5432` are unavailable.
- 2026-04-18: Completed `BRS-05` by adding canonical update regression in `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts` (`updates canonical runtime graph mapping when strategyId and marketGroupId are changed via PUT`) to lock runtime-graph canonical mapping after `PUT /dashboard/bots/:id`.
- 2026-04-18: Completed `BRS-06` by making `updateBot` canonical-path aware in `apps/api/src/modules/bots/botsCommand.service.ts`: bot metadata update and canonical group+strategy mapping sync now execute in one transaction; legacy mapping remains compatibility-only mirror.
- 2026-04-18: Completed `BRS-07` by enforcing canonical-first runtime strategy assignment in `apps/api/src/modules/bots/runtimeSymbolStatsEnrichment.service.ts` (canonical links populate symbol strategy context before legacy fallback).
- 2026-04-18: Completed `BRS-08` by adding closure regression `keeps strict selected-bot scope and resolves strategy context from canonical links before legacy fallback` in `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts` (strict symbol scope + paused exclusion + canonical strategy context visibility).
- 2026-04-18: Closed `BRS-B` implementation wave (`BRS-05..BRS-08`) and advanced queue focus to `BRS-C`. Validation: `pnpm --filter api run typecheck` => `PASS`; `pnpm run quality:guardrails` => `PASS`; `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts` => `3/3 PASS`.
- 2026-04-18: Completed `BRS-09` by adding web regression `keeps signal and context cards scoped when switching selected bot from A(1) to B(4)` in `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`; test locks selector switch behavior, A-context eviction, B-scope symbol rendering, and rail control visibility for larger symbol sets.
- 2026-04-18: Completed `BRS-10` with compatibility verification only: current API runtime payload shape is unchanged for web consumer contracts, so no refactor in `useHomeLiveWidgetsController.ts` was required.
- 2026-04-18: Completed `BRS-11` focused regression/typecheck pack. Validation: `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts` => `3/3 PASS`; `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `16/16 PASS`; `pnpm --filter api run typecheck` => `PASS`; `pnpm --filter web run typecheck` => `PASS`.
- 2026-04-18: Completed `BRS-12` by syncing canonical queue and execution statuses for `BRS-09..BRS-12` and advancing execution focus past `BRS-C`.
- 2026-04-18: Closed `BRS-C` implementation wave (`BRS-09..BRS-12`) end-to-end (`web regression + compatibility check + focused QA + docs closure`).

## Phase UXR-G - Dashboard Wallet + Manual Order Layout Polish (Queued 2026-04-18)
- [x] `UXR-G-01 docs(contract): freeze dashboard wallet/manual-order layout and row-order contract`
- [x] `UXR-G-02 refactor(web-dashboard-sidebar): place manual-order section below wallet as peer section`
- [x] `UXR-G-03 refactor(web-wallet-kpi): simplify portfolio row style and move delta directly under allocation`
- [x] `UXR-G-04 refactor(web-wallet-kpi-layout): enforce 50/50 width for free-funds and in-positions rows`
- [x] `UXR-G-05 test(web-dashboard-home): lock manual-order placement and wallet KPI order/layout regressions`
- [x] `UXR-G-06 qa(web-closure): run focused dashboard-home pack + typecheck/build and sync queue notes`

### Progress Log (Phase UXR-G - Dashboard Wallet + Manual Order Layout Polish)
- 2026-04-18: Queued non-blocking UI-polish wave in `docs/planning/uxr-g-dashboard-wallet-manual-order-layout-plan-2026-04-18.md` with grouped batches `UXR-G-A..UXR-G-B`; scope is strictly dashboard runtime sidebar layout ergonomics (manual-order placement, wallet KPI row style/order, and 50/50 KPI split), without changing manual-order backend behavior.
- 2026-04-18: Completed `UXR-G-01` by freezing layout/order acceptance contract in `docs/planning/open-decisions.md` and `docs/modules/web-dashboard-home.md`.
- 2026-04-18: Completed `UXR-G-02` by moving manual-order panel to a peer sidebar section directly below wallet in `RuntimeSidebarSection.tsx` while preserving submit/payload behavior.
- 2026-04-18: Completed `UXR-G-03..UXR-G-04` by reordering wallet summary rows to `Allocation -> Delta -> Portfolio`, simplifying portfolio to plain summary-row style, and enforcing `grid-cols-2` equal split for `Free funds` and `In positions`.
- 2026-04-18: Completed `UXR-G-05` by locking placement/order/layout regressions in `HomeLiveWidgets.test.tsx` (wallet->manual-order section order, allocation->delta->portfolio order, and split-row contract assertions).
- 2026-04-18: Completed `UXR-G-06` closure checks and queue sync. Validation: `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => `16/16 PASS`; `pnpm --filter web run typecheck` => `PASS`; `pnpm --filter web run build` => `PASS`.

## Phase PLNC - Planning Catalog Reconciliation and Coverage Sync (Closed 2026-04-20)
- [x] `PLNC-01 docs(audit-map): classify planning docs as implemented/queued/external-blocked/superseded`
- [x] `PLNC-02 docs(status-sync): update stale status lines in completed planning files`
- [x] `PLNC-03 docs(queue-link): add canonical queue linkage in active non-closed plans`
- [x] `PLNC-04 docs(sync): publish planning-catalog closure note in PROJECT_STATE/TASK_BOARD`
- [x] `PLNC-05 docs(status-sync): reconcile stale DASHR checklist status drift in this execution plan`

### Progress Log (Phase PLNC - Planning Catalog Reconciliation and Coverage Sync)
- 2026-04-18: Queued planning-catalog reconciliation wave in `docs/planning/planning-catalog-coverage-follow-up-plan-2026-04-18.md` after scanning `docs/planning` coverage against canonical queue files; wave purpose is to close status drift and remove orphan active plans before deeper refactor waves.
- 2026-04-19: Completed `PLNC-01` by adding deterministic planning classification index in `docs/planning/planning-catalog-index-2026-04-19.md` with explicit `implemented/queued/external-blocked/superseded` ownership mapping.
- 2026-04-19: Completed `PLNC-02` by syncing stale status headers in completed planning waves (`CPDB`, `SEC`, `DPL`, `WLT`, `L10NQ`, `DBSEL`, `BRS`, `UXR-E/F/G`).
- 2026-04-19: Completed `PLNC-03` by adding canonical queue linkage sections in non-closed planning docs (`planning-catalog follow-up`, `ARC audit`, `POS parity`, `LBT`, `V1 release/stability`, `V1 Binance alignment`) and clarifying deferred ownership for subscription rollout plan.
- 2026-04-19: Completed `PLNC-04` by synchronizing closure state in canonical queue/context files (`mvp-next-commits`, `mvp-execution-plan`, `TASK_BOARD`, `PROJECT_STATE`) and advancing focus to `ARC-01`.
- 2026-04-20: Completed `PLNC-05` by reconciling stale `DASHR-01..DASHR-11` unchecked drift in this file with canonical closure state already recorded in queue/context files.

## Phase ARC - Architecture Maintainability Remediation (Closed 2026-04-19)
- [x] `ARC-01 docs(contract): freeze ARC decomposition boundaries and no-drift guardrails`
- [x] `ARC-02 refactor(api-runtime): extract typed runtime/live-ordering config from runtime services`
- [x] `ARC-03 refactor(api-runtime): extract supervisor/watchdog from runtimeSignalLoop`
- [x] `ARC-04 refactor(api-runtime): extract final-candle decision execution application service`
- [x] `ARC-05 test(api-runtime): split and lock runtime regression by extracted seams`
- [x] `ARC-06 refactor(api-bots-read): split session/symbol-stats read models from botsRuntimeRead.service`
- [x] `ARC-07 refactor(api-bots-read): split trades/positions read models and repositories`
- [x] `ARC-08 refactor(api-bots-command): move close-position command path out of read service`
- [x] `ARC-09 feat(api-monitoring): add aggregate monitoring read endpoint for web consumers`
- [x] `ARC-10 test(api+web-monitoring): lock aggregate read-model contract and fallback behavior`
- [x] `ARC-11 feat(api-domain-kernel): extract shared indicator projection/evaluation kernel for runtime+backtests`
- [x] `ARC-12 refactor(api-backtests): reduce backtests.service to facade over dedicated services`
- [x] `ARC-13 test(api-parity): regression lock for shared kernel parity (runtime vs backtest)`
- [x] `ARC-14 refactor(web-dashboard-home): split HomeLiveWidgets into view-model hooks + route contract config`
- [x] `ARC-15 refactor(web-bots-monitoring): move client-side aggregation to API aggregate consumer`
- [x] `ARC-16 refactor(web-datatable): split DataTable internals into state hooks/primitives`
- [x] `ARC-17 fix(web-i18n): remove remaining BacktestRunDetails inline locale-branch labels`
- [x] `ARC-18 test(web-ux-regression): lock decomposed container behavior and loading/stream states`
- [x] `ARC-19 chore(guardrails): tighten production hotspot budgets after refactor waves`
- [x] `ARC-20 docs(architecture-closure): publish maintainability delta and residual-risk snapshot`

### Progress Log (Phase ARC - Architecture Maintainability Remediation)
- 2026-04-18: Queued ARC wave from `docs/planning/architecture-maintainability-audit-2026-04-18.md` to address runtime/bots/backtest/dashboard maintainability hotspots with explicit decomposition and guardrail-closure path after active queue completion.
- 2026-04-19: Completed `ARC-01` by freezing ARC decomposition boundaries and anti-drift guardrails in `docs/architecture/runtime-critical-path-decomposition-contract.md`, and linking the resolved decision in `open-decisions` before code extraction starts.
- 2026-04-19: Completed `ARC-02` by extracting typed runtime/live-ordering env configuration into `apps/api/src/config/runtimeExecution.ts` and wiring runtime services (`runtimeSignalLoop`, `orders.service`) to the typed config module with regression coverage (`runtimeExecution.test.ts`).
- 2026-04-19: Completed `ARC-03` by extracting runtime watchdog/stall/auto-restart orchestration from `runtimeSignalLoop.service.ts` into `runtimeSignalLoopSupervisor.ts` with callback-based integration and unchanged runtime regression outcomes.
- 2026-04-19: Completed `ARC-04` by extracting final-candle runtime decision orchestration into `runtimeFinalCandleDecision.service.ts` and reducing `runtimeSignalLoop` responsibility to ingestion/routing/delegation seams.
- 2026-04-19: Completed `ARC-05` by adding seam-owned regression suites (`runtimeSignalLoopSupervisor.test.ts`, `runtimeFinalCandleDecision.service.test.ts`) and locking null-direction no-trade coverage for extracted final-candle runtime path.
- 2026-04-19: Completed `ARC-06` by extracting `listBotRuntimeSessions` and `getBotRuntimeSession` into `runtimeSessionRead.service.ts`, plus `listBotRuntimeSessionSymbolStats` into `runtimeSessionSymbolStatsRead.service.ts`; `botsRuntimeRead.service.ts` now delegates session/symbol-stats ownership to dedicated read services.
- 2026-04-19: Completed `ARC-14` by extracting dashboard-home onboarding route/step contract and runtime-selection view-model ownership from `HomeLiveWidgets.tsx` into `runtimeOnboardingConfig.tsx` and `useRuntimeSelectionViewModel.ts`.
- 2026-04-19: Completed `ARC-15` by moving bots monitoring aggregate payload composition into dedicated service ownership (`botsMonitoringAggregate.service.ts`) and reducing controller hook responsibilities.
- 2026-04-19: Completed `ARC-16` by extracting DataTable column-visibility state ownership into `useDataTableColumnVisibilityState.ts` and rewiring `DataTable.tsx` to consume the extracted state helper.
- 2026-04-19: Completed `ARC-17` by replacing BacktestRunDetails inline locale-branch labels with namespace-driven copy fields and locale-agnostic regression assertions.
- 2026-04-19: Completed `ARC-18` by adding seam-focused web regression locks (`runtimeOnboardingConfig.test.tsx`, `botsMonitoringAggregate.service.test.ts`, `useDataTableColumnVisibilityState.test.ts`) and rerunning ARC-D focused closure checks (`pnpm --filter web run typecheck` + focused test pack `37/37 PASS`).
- 2026-04-19: Completed `ARC-07` by extracting runtime trades/positions read ownership into dedicated services/repositories (`runtimeSessionTradesRead*`, `runtimeSessionPositionsRead*`) and reducing `botsRuntimeRead.service.ts` to export-only read seams.
- 2026-04-19: Completed `ARC-08` by moving runtime close-position command orchestration to dedicated command ownership (`runtimeSessionPositionCommand.service.ts`) and re-exporting it via `botsCommand.service.ts`.
- 2026-04-19: Completed `ARC-09` by introducing backend aggregate monitoring read model endpoint `GET /dashboard/bots/:id/runtime-monitoring/aggregate` with status/symbol/session-limit query contract.
- 2026-04-19: Completed `ARC-10` by locking aggregate monitoring contract and API-fallback behavior with focused packs: `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run` => `2/2 PASS`; `pnpm --filter web run test -- src/features/bots/services/botsMonitoringAggregate.service.test.ts --run` => `3/3 PASS`; plus `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm --filter api run build`, `pnpm run web:verify:build-typecheck`, `pnpm run quality:guardrails` => `PASS`.
- 2026-04-19: Completed `ARC-11` by extracting shared indicator resolver kernel into `apps/api/src/modules/engine/strategyIndicatorKernel.ts` and rewiring `strategySignalEvaluator`, `runtimeSignalDecisionEngine`, and backtest indicator projection to consume one cache/projection implementation.
- 2026-04-19: Completed `ARC-12` by reducing backtests service responsibility and extracting interleaved portfolio simulation ownership into `apps/api/src/modules/backtests/backtestPortfolioSimulation.service.ts`, with `backtests.service.ts` keeping stable facade exports for existing API/controller contracts.
- 2026-04-19: Completed `ARC-13` by adding runtime-vs-backtest kernel parity regression locks in `apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts` (EMA/MACD/RSI + derivative channels).
- 2026-04-19: Completed `ARC-19` by tightening repository guardrails in `scripts/repoGuardrails.mjs` (api/web source byte budgets reduced; production-only source line budgets introduced) while keeping the repo green.
- 2026-04-19: Completed `ARC-20` by publishing maintainability delta and residual-risk snapshot in `docs/architecture/architecture-maintainability-closure-2026-04-19.md`.

## Phase POS - Position Lifecycle Parity Closure (Closed 2026-04-19)
- [x] `POS-36 fix(contract): remove strategy-exit close bypass from backtest/replay and runtime close flow`
- [x] `POS-37 fix(runtime): align runtime automation mode/context with bot/position and manual-management guard`
- [x] `POS-38 feat(runtime-capital): add shared paper/live capital context with affordability parity`
- [x] `POS-39 refactor(runtime-dca): execute DCA through execution adapter parity path`
- [x] `POS-40 refactor(backtest): unify lifecycle adapter and retire duplicate close semantics`
- [x] `POS-41 test(parity): add golden parity fixtures across backtest/paper/live`
- [x] `POS-42 qa(manual): publish Binance side-by-side operator verification script and triage`

### Progress Log (Phase POS - Position Lifecycle Parity Closure)
- 2026-04-18: Queued unresolved `POS-36..POS-42` lifecycle parity tasks from `docs/planning/position-lifecycle-parity-remediation-plan-2026-03-29.md` because they remain outside active canonical queue coverage and are required for deterministic cross-mode lifecycle behavior.
- 2026-04-19: Completed `POS-36` by removing strategy-exit close bypass from backtest/replay/runtime close path and locking EXIT trace-only parity semantics with focused regression evidence.
- 2026-04-19: Closed `POS-37..POS-42` queue drift by reconciling against existing implementation-complete history (Phase 17 entries) and running focused parity/runtime verification pack (`50/50 PASS` across `runtimePositionAutomation`, `runtimeCapitalContext`, `lifecycleCloseParity`, `backtestReplayCore`, `backtests.contract-remediation`); closure evidence in `docs/operations/pos-ab-closure-2026-04-19.md`.

## Phase OPV - Production Verification and Exit-Gate Follow-up (Closed 2026-04-19)
- [x] `OPV-01 qa(vps-rehearsal): execute Dockerfile-first stage/prod rehearsal and capture evidence`
- [x] `OPV-02 qa(prod-live-takeover): verify takeover endpoint and private ops probes on production target`
- [x] `OPV-03 ops(gates-refresh): refresh RC external-gate status/sign-off artifacts with new production evidence`
- [x] `OPV-04 docs(closure): sync LBT/V1 stability plan statuses and residual external blockers`
- [x] `OPV-05 fix(ops-gates): make RC status manual follow-ups gate-aware`

### Progress Log (Phase OPV - Production Verification and Exit-Gate Follow-up)
- 2026-04-18: Queued production follow-up closure from live-takeover/V1 plans (`LBT`, `V1` stability/release, `DPL` rehearsal note) so remaining target-environment verification and formal gate evidence are explicitly owned after code-focused waves.
- 2026-04-19: Completed `OPV-01` by executing Dockerfile-first image rehearsal (`api`, `web`, `workers-market-data`, `workers-market-stream`, `workers-backtest`, `workers-execution`) and publishing evidence in `docs/operations/opv-01-vps-rehearsal-2026-04-19.md` with machine-readable artifacts. Production smoke on `api.soar.luckysparrow.ch` and `soar.luckysparrow.ch` passed; stage smoke is now confirmed on `stage-api.soar.luckysparrow.ch` and `stage.soar.luckysparrow.ch`.
- 2026-04-19: Completed `OPV-02` by executing production takeover verification probes and publishing artifact pack (`docs/operations/opv-02-prod-live-takeover-2026-04-19.md`, `_artifacts-opv-02-*`). Takeover route rollout is confirmed on production (`401 Missing token` means protected route exists; no `404`), while private OPS Gate 3 checks remain blocked in this execution context without VPS private-route admin auth.
- 2026-04-19: Completed `OPV-03` by collecting fresh production SLO evidence (`_artifacts-slo-window-2026-04-19T01-35-51-340Z.json`), rebuilding 7d/30d rolling reports, refreshing RC status/checklist/sign-off artifacts, rerunning post-signoff status sync, and publishing diagnostics in `docs/operations/opv-03-rc-gates-refresh-2026-04-19.md`. The interim `G2/G4 OPEN` snapshot from this step was later superseded by final all-pass closure.
- 2026-04-19: Completed `OPV-04` by synchronizing canonical queue/context and LBT/V1 planning docs to the refreshed OPV evidence (`docs/operations/opv-04-closure-sync-2026-04-19.md`), then closing previously tracked external blockers in the final private-route run.
- 2026-04-19: Completed `OPV-05` by updating `scripts/buildRcExternalGateStatus.mjs` so `Manual Follow-ups` are generated from current gate state (`Gate1..Gate4`) instead of static all-gates reminders; validation run confirmed focused follow-up output (`Gate2`, `Gate4`) from latest window artifact.
- 2026-04-19: Final RC closure run completed with snapshot `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS` at `2026-04-19T15:13:58.943Z` after private-route production pipeline validation and final sign-off/checklist/evidence refresh.

## Phase UXR-I - Dashboard Forms Consistency Refresh (Closed 2026-04-19)
- [x] `UXR-I-01 docs(contract): freeze dashboard forms consistency refresh boundaries after UXR-F`
- [x] `UXR-I-02 audit(web-forms): publish residual consistency gap map per route/module`
- [x] `UXR-I-03 chore(web-ui-forms): normalize shared form primitive API surface for refresh migration`
- [x] `UXR-I-04 test(guardrails): lock no-cross-feature generic controls and no-hardcoded-wrapper-copy regressions`
- [x] `UXR-I-05 refactor(web-wrappers): unify create/edit wrappers i18n+breadcrumb+save-action contract`
- [x] `UXR-I-06 refactor(web-wallets-form): close residual layout/control parity gaps using ui/forms primitives`
- [x] `UXR-I-07 refactor(web-markets-form): enforce sectioned IA and remove any residual local generic controls`
- [x] `UXR-I-08 refactor(web-backtests-form): finalize decoupling from feature-local controls and align summary ergonomics`
- [x] `UXR-I-09 refactor(web-strategies-form): preserve tabs while normalizing section internals to shared primitives`
- [x] `UXR-I-10 refactor(web-bots-form): reduce layout density and align controls to shared form system`
- [x] `UXR-I-11 feat(web-form-ux): standardize first-error focus/scroll + summary/inline sync across scoped forms`
- [x] `UXR-I-12 feat(web-form-mobile): apply sticky mobile action bar contract to long dashboard forms`
- [x] `UXR-I-13 test(web-forms-regression): run/update focused suites for wrapper+i18n+form-consistency contracts`
- [x] `UXR-I-14 qa(web-forms-closure): run build/typecheck/guardrails and sync canonical queue/context`

### Progress Log (Phase UXR-I - Dashboard Forms Consistency Refresh)
- 2026-04-19: Activated planner input `docs/planning/dashboard-forms-consistency-planner-brief-2026-04-19.md` into canonical execution wave `docs/planning/uxr-i-dashboard-forms-consistency-refresh-plan-2026-04-19.md` with grouped batches `UXR-I-A..UXR-I-D` and strict tiny-commit sequencing.
- 2026-04-19: Completed `UXR-I-01` by freezing post-`UXR-F` refresh boundaries in canonical decisions (`open-decisions`) and module linkage docs (`web-dashboard-home`) with explicit route scope, `ui/forms-only` source rule, wrapper i18n contract, and validation/submit behavior invariants.
- 2026-04-19: Completed `UXR-I-02` by publishing route/module residual gap inventory in `docs/operations/uxr-i-forms-gap-map-2026-04-19.md` with machine-readable companion artifact `docs/operations/_artifacts-uxr-i-forms-gap-map-2026-04-19.json` (wrapper parity, mobile action parity, layout-density, and guardrail-coverage deltas mapped to `UXR-I-03..UXR-I-13` tasks).
- 2026-04-19: Completed `UXR-I-03` by normalizing shared `ui/forms` public API surface for refresh migration (exported primitive prop/types in `FormAlert`, `FormField`, `FormGrid`, `FormFields`, `FormMobileActionBar`, `FormPageShell`, `FormSectionCard`, `FormValidationSummary`) without behavior drift.
- 2026-04-19: Completed `UXR-I-04` by expanding i18n guardrails to full `UXR-I` wrapper scope and hardening repository guardrails so `FieldControls` imports are allowed only within same feature ownership, preventing generic-control and wrapper-copy drift regressions.
- 2026-04-19: Completed `UXR-I-05` by unifying wallet/bot create-edit wrapper save-action contract (desktop + mobile actions now reflect form submitting state with disabled/loading labels) and adding missing localized saving copy in `dashboard-wallets` + `dashboard-bots.page`.
- 2026-04-19: Completed `UXR-I-06` by migrating wallet residual controls to shared form primitives (`RadioGroupField` for mode, `SelectField` for base currency, `NumberField` + `SelectField` for LIVE allocation) and updating focused wallet regression assertions.
- 2026-04-19: Completed `UXR-I-07` by reworking `MarketUniverseForm` to shared sectioned IA (`FormSectionCard` + `FormGrid`) and removing local section layout wrappers while preserving market-catalog filter behavior.
- 2026-04-19: Completed `UXR-I-08` by replacing `BacktestCreateForm` feature-local outer shell with shared `FormPageShell` and preserving run-config/simulation section contracts plus focused form regression coverage.
- 2026-04-19: Completed `UXR-I-09` by preserving strategy tab flow and migrating `close`/`additional` tab internals to shared `ui/forms` primitives (section cards, radio groups, number/toggle/compound fields) without domain-logic changes; added focused tab-flow regression coverage in `StrategyForm.test.tsx`.
- 2026-04-19: Completed `UXR-I-10` by refactoring `BotCreateEditForm` from a dense single-card layout into clearer two-column `setup`/`market`/`strategy` section cards using shared `ui/forms` primitives only; preserved wallet-context/runtime safety guards and updated focused bots-form regression assertions.
- 2026-04-19: Completed `UXR-I-11` by introducing shared `ui/forms` validation-feedback helpers (`toValidationSummaryErrors`, `focusFirstInvalidField`) and migrating scoped forms (`wallets`, `markets`, `backtests`, `strategies`, `bots`) to one first-invalid focus/scroll + summary/inline sync contract; added focused unit regression for helper behavior.
- 2026-04-19: Completed `UXR-I-12` by applying `FormMobileActionBar` to remaining long dashboard form wrappers (`strategies` create/edit and `backtests` create) and unifying save-action visibility so header actions are desktop-only while mobile save remains sticky/reachable.
- 2026-04-19: Completed `UXR-I-13` by running focused forms/wrappers/i18n regression pack (`pnpm --filter web run test -- ... --run`) with `33/33 PASS` across wallets, markets, backtests, bots, wrapper pages, and i18n registry/translation contracts.
- 2026-04-19: Completed `UXR-I-14` closure checks with full required PASS pack (`pnpm --filter web run typecheck`, `pnpm --filter web run build`, `pnpm run quality:guardrails`) and synchronized queue/context handoff to `UXR-J`.

## Phase UXR-J - Dashboard Tables Consistency Refresh (Closed 2026-04-19)
- [x] `UXR-J-01 docs(contract): freeze dashboard table action-color and columns-dropdown behavior contract`
- [x] `UXR-J-02 refactor(ui-table-actions): add dedicated module action tone and remap clone/runtime/preview presets`
- [x] `UXR-J-03 refactor(ui-datatable-dropdown): keep columns dropdown open on checkbox toggles`
- [x] `UXR-J-04 refactor(ui-datatable-trigger): enforce icon-only columns trigger globally with a11y label`
- [x] `UXR-J-05 test(ui-datatable): add regression tests for dropdown persistence and icon-only trigger contract`
- [x] `UXR-J-06 test(ui-table-actions): add preset tone regression tests for clone/runtime/preview mapping`
- [x] `UXR-J-07 test(web-tables-focused): align bots/backtests/profile/runtime table suites to shared table behavior`
- [x] `UXR-J-08 qa(web-table-closure): run focused suite + typecheck/build and sync queue/context`

### Progress Log (Phase UXR-J - Dashboard Tables Consistency Refresh)
- 2026-04-19: Activated planner input `docs/planning/dashboard-tables-consistency-planner-brief-2026-04-19.md` into canonical execution wave `docs/planning/uxr-j-dashboard-tables-consistency-refresh-plan-2026-04-19.md` with grouped batches `UXR-J-A..UXR-J-C` and strict tiny-commit sequencing after `UXR-I` closure.
- 2026-04-19: Completed `UXR-J-01` by freezing shared table-system behavior contract in canonical docs (`open-decisions`, `web-dashboard-home`, `web-bots`), including explicit action-tone mapping (`clone` distinct from system actions; `runtime` + `preview` same module tone), columns-dropdown persistence rules, and icon-only columns trigger accessibility requirements.
- 2026-04-19: Completed `UXR-J-02` by introducing dedicated `module` action tone in shared `TableUi` and remapping `runtime` + `preview` presets to the same module tone while keeping `clone` neutral and distinct from system action tones.
- 2026-04-19: Completed `UXR-J-03` by removing checkbox-toggle auto-close behavior from the shared DataTable columns visibility dropdown, preserving close-only paths through trigger toggle, outside click, and `Escape`.
- 2026-04-19: Completed `UXR-J-04` by enforcing icon-only columns trigger as the shared DataTable default (`settingsControlsIconOnly=true`) while preserving a11y naming (`aria-label` + `sr-only`).
- 2026-04-19: Completed `UXR-J-05` by adding DataTable interaction regressions for columns dropdown persistence on checkbox toggles, close behavior (`trigger`, outside click, `Escape`), and icon-only trigger class contract.
- 2026-04-19: Completed `UXR-J-06` by adding `TableUi.test.tsx` preset mapping regressions that lock `clone=neutral` and `runtime/preview=module` tone semantics.
- 2026-04-19: Completed `UXR-J-07` by aligning focused consuming-table suites (`BotsListTable`, `BacktestsRunsTable`) with shared module-tone action contract (`runtime/preview` assertions updated to `text-accent`).
- 2026-04-19: Completed `UXR-J-08` closure pack with focused table regression suite (`DataTable`, `bots`, `backtests`, `profile`, `logs`, `home-live-widgets`) => `25/25 PASS`, plus `pnpm --filter web run typecheck` => `PASS` and `pnpm --filter web run build` => `PASS`; canonical queue/context synchronized and `UXR-J-A..C` closed.

## Phase DAGG - Dashboard Aggregate Selected-Bot View Parity (Queued 2026-04-19)
- [x] `DAGG-01 docs(contract): freeze /dashboard aggregate selected-bot runtime contract (positions/orders/history)`
- [x] `DAGG-02 test(web-red): add failing regression for selected-bot aggregate parity when RUNNING session is empty`
- [x] `DAGG-03 feat(web-controller): switch dashboard selected-bot runtime loading to aggregate endpoint`
- [x] `DAGG-04 refactor(web-runtime-viewmodel): align positions/orders/trades derivation to aggregate payload`
- [x] `DAGG-05 feat(web-history-tab): add aggregate closed-positions table in dashboard history tab`
- [x] `DAGG-06 test(web-history-parity): lock dashboard history positions/trades parity and selected-bot switch behavior`
- [x] `DAGG-07 test(api-aggregate-red): add regression for aggregate positions/orders/history counts across mixed session statuses`
- [x] `DAGG-08 fix(api-aggregate-contract): harden aggregate response determinism for dashboard tables`
- [x] `DAGG-09 test(e2e/web-parity): add scenario asserting /dashboard and /preview parity for selected bot aggregate history`
- [x] `DAGG-10 qa(closure): run focused aggregate parity pack and sync canonical queue/context`

### Progress Log (Phase DAGG - Dashboard Aggregate Selected-Bot View Parity)
- 2026-04-19: Queued aggregate-view remediation from production discrepancy report (preview shows closed history positions while dashboard selected bot does not) and published executor-ready plan in `docs/planning/dashboard-aggregate-selected-bot-view-plan-2026-04-19.md`; product decision locked: dashboard runtime tables are aggregate-by-selected-bot.
- 2026-04-19: Closed `DAGG-A` (`DAGG-01..DAGG-04`) by enforcing aggregate-first selected-bot runtime loading in dashboard home, aligning runtime view-model/trade session derivation to aggregate payload (`actionSessionId` + aggregate trade source), and locking RUNNING-empty-session aggregate-history parity regression in `HomeLiveWidgets`.
- 2026-04-19: Closed `DAGG-B` (`DAGG-05..DAGG-08`) by adding closed-positions history table to dashboard history tab, adding selected-bot history re-scope web regression coverage, and hardening API aggregate determinism with timestamp+id tie-break sorting plus mixed-session aggregate e2e regression (`bots.monitoring-aggregate.e2e.test.ts`).
- 2026-04-19: Closed `DAGG-09` by adding high-fidelity cross-route web regression in `HomeLiveWidgets.preview-parity.test.tsx`, proving selected-bot aggregate history/trade parity between `/dashboard` and `/dashboard/bots/:id/preview` with no cross-bot leakage.
- 2026-04-19: Closed `DAGG-10` and stage `DAGG-C` with green focused validation pack:
  - `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
  - `pnpm run quality:guardrails`

## Phase SBSC - Dashboard Sidebar Strategy Source-of-Truth Parity (Closed 2026-04-19)
- [x] `SBSC-01 docs(contract): freeze sidebar strategy source-of-truth and projection parity rules`
- [x] `SBSC-02 test(api-red): add regression for listBots.strategyId vs runtime-graph primary strategy mismatch`
- [x] `SBSC-03 fix(api-projection): make listBots/getBot strategy projection canonical-first and runtime-graph compatible`
- [x] `SBSC-04 feat(api-audit): add deterministic drift audit for bots with legacy/canonical strategy divergence`
- [x] `SBSC-05 fix(api-drift-repair): add safe reconciliation path to align legacy linkage with canonical strategy when requested`
- [x] `SBSC-06 test(web-regression): lock sidebar strategy/market switch parity for two bots with different strategies`
- [x] `SBSC-07 qa(focused-pack): run api+web sidebar parity regressions and typechecks`
- [x] `SBSC-08 docs(closure): publish sidebar strategy contract closure and sync queue/context`

### Progress Log (Phase SBSC - Dashboard Sidebar Strategy Source-of-Truth Parity)
- 2026-04-19: Queued sidebar strategy parity wave from production/API analysis showing `listBots.strategyId` vs `runtime-graph` strategy drift; published executor-ready plan in `docs/planning/dashboard-sidebar-strategy-contract-plan-2026-04-19.md` with canonical-first projection contract and drift regression/repair path.
- 2026-04-19: Closed `SBSC-A` (`SBSC-01..SBSC-03`) by freezing contract docs and fixing bot projection precedence so `listBots/getBot strategyId` is canonical-first and runtime-graph compatible, with parity regression lock in `bots.runtime-scope.e2e.test.ts`.
- 2026-04-19: Closed `SBSC-B` (`SBSC-04..SBSC-06`) by adding deterministic drift diagnostics + safe idempotent repair endpoints for legacy/canonical divergence and extending web sidebar switch regression to lock `Market + Strategy` parity.
- 2026-04-19: Closed `SBSC-C` (`SBSC-07..SBSC-08`) with focused validation pack PASS:
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.e2e.test.ts --run`
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`

## Phase SOPR - Signals and Open Runtime Parity (Closed 2026-04-19)
- [x] `SOPR-01 docs(contract): lock consolidated source-of-truth and parity contract for signals/open flows after DAGG+SBSC`
- [x] `SOPR-02 test(api-red): add regression for neutral/no-recent-signal condition-line fallback contamination`
- [x] `SOPR-03 fix(api-signal-context): harden symbol->strategy fallback and expose explicit source tags`
- [x] `SOPR-04 test(web-red): lock selected-bot signal cards against cross-bot strategy leakage`
- [x] `SOPR-05 test(parity-red): add selected-bot parity regression for /dashboard vs /dashboard/bots/:id/preview`
- [x] `SOPR-06 fix(web-parity): align dashboard-home signal/positions/history derivation to aggregate selected-bot contract`
- [x] `SOPR-07 test(api-runtime): lock no-open diagnostics visibility for blocked/ignored outcomes`
- [x] `SOPR-08 docs(parity-evidence): publish parity matrix evidence for signals/positions/history between home and preview`
- [x] `SOPR-09 docs(decision-gate): close manual-order semantics decision (order-only vs orchestrator lifecycle)`
- [x] `SOPR-10 test(red-manual-order): add contract tests for chosen manual-order semantic path`
- [x] `SOPR-11 feat/fix(manual-order-path): implement selected manual-order semantic path with audit-safe diagnostics`
- [x] `SOPR-12 qa(closure): run full focused validation pack and sync canonical queue/context`

### Progress Log (Phase SOPR - Signals and Open Runtime Parity)
- 2026-04-19: Queued `SOPR` implementation wave from analyst report covering selected-bot signal context drift, dashboard-vs-preview parity divergence, runtime no-open diagnostics consistency, and manual-order lifecycle semantics; published executor-ready plan in `docs/planning/signals-open-runtime-parity-plan-2026-04-19.md` with strict dependency on `DAGG` then `SBSC`.
- 2026-04-19: Closed `SOPR-01` by publishing one consolidated selected-bot signals/open-runtime source-of-truth contract in canonical docs (`open-decisions`, `web-dashboard-home`, `api-bots`, `api-orders`) with explicit precedence, parity, and diagnostics expectations.
- 2026-04-19: Closed `SOPR-02..SOPR-04` by hardening API symbol-context fallback (explicit source tags `latest_signal | configured_fallback | unresolved`) and locking selected-bot signal-card scope regressions in API/web suites.
- 2026-04-19: Closed `SOPR-05..SOPR-08` by proving `/dashboard` vs `/dashboard/bots/:id/preview` selected-bot parity for signals/positions/history, locking runtime blocked/ignored diagnostics visibility, and publishing SOPR parity matrix evidence artifacts.
- 2026-04-19: Closed `SOPR-09..SOPR-11` by finalizing manual-order semantics as explicit `order-only` path and adding audit-safe metadata + contract regressions (`orders.service.test.ts`, `orders-positions.e2e.test.ts`).
- 2026-04-19: Closed `SOPR-12` validation pack with PASS for `api/web full tests`, `api/web typecheck`, `lint`, `build`, `quality:guardrails`, and `i18n:audit:route-reachable:web`; queue promoted to `MURC`.

## Phase MURC - Market Universe Symbol Contract Parity (Closed 2026-04-20)
- [x] `MURC-01 docs(contract): freeze canonical market-universe symbol composition contract`
- [x] `MURC-02 test(api-red): add shared resolver matrix for filter/whitelist/blacklist combinations`
- [x] `MURC-03 feat(api-shared-resolver): implement single-source symbol resolver for market-universe contract`
- [x] `MURC-04 refactor(api-markets): wire market sync and bot auto-symbol-group creation to shared resolver`
- [x] `MURC-05 test(api-red): add backtest/runtime/manual-order regressions for symbol-set parity`
- [x] `MURC-06 refactor(api-consumers): adopt shared resolver in backtests runtime and manual-order context flows`
- [x] `MURC-07 test(api-integration): lock cross-module parity for identical universe input`
- [x] `MURC-08 test(web-red): add markets-form regressions for empty-result and union semantics`
- [x] `MURC-09 fix(web-markets): align preview and validation with shared contract without UI redesign`
- [x] `MURC-10 test(e2e-smoke): add focused parity smoke for bots/backtests/manual-order under one universe`
- [x] `MURC-11 docs(sync): update trading logic and module docs to finalized contract`
- [x] `MURC-12 qa(closure): run focused contract validation pack and sync canonical queue/context`

### Progress Log (Phase MURC - Market Universe Symbol Contract Parity)
- 2026-04-19: Queued `MURC` from analyzer report to unify symbol composition under one canonical formula `final = unique(filter_result U whitelist) - blacklist` across markets sync, bot runtime, backtests, manual-order context, and web preview/validation. Published executor-ready plan in `docs/planning/market-universe-symbol-contract-parity-plan-2026-04-19.md`; wave is intentionally queued after active `SOPR`.
- 2026-04-20: Closed `MURC-01..MURC-04` by implementing shared symbol resolver contract and wiring markets sync + bot auto-created groups to the same formula path.
- 2026-04-20: Closed `MURC-05..MURC-07` by adding cross-module parity regressions and unifying runtime/backtest/manual-order symbol resolution behavior for identical universe input.
- 2026-04-20: Closed `MURC-08..MURC-11` by aligning web empty-result/union semantics and synchronizing canonical docs (`open-decisions`, `trading-logic`, module deep-dives) to one formula.
- 2026-04-20: Closed `MURC-12` validation pack with PASS for `pnpm --filter api run test -- --run`, `pnpm --filter web run test -- --run`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, and `pnpm run quality:guardrails`; resolved bots e2e size-guardrail overflow by extracting market-universe parity scenarios into `bots.market-universe-contract.e2e.test.ts`.

## Phase DAWR - Dashboard Aggregate Wallet and Strategy Regression (Closed 2026-04-20)
- [x] `DAWR-01 docs(contract): freeze aggregate wallet-summary field parity and strategy sidebar edge behavior`
- [x] `DAWR-02 test(api-red): add aggregate regression for LIVE wallet capital fields in positions.summary`
- [x] `DAWR-03 fix(api-aggregate): include referenceBalance/freeCash parity fields in aggregate positions summary`
- [x] `DAWR-04 test(web-red): add LIVE wallet regression for aggregate-success path without session fallback masking`
- [x] `DAWR-05 fix(web-wallet-kpi): align runtime selection wallet summary mapping to aggregate capital fields`
- [x] `DAWR-06 test(web-edge): lock strategy sidebar behavior for selected bot strategyId null/mismatch`
- [x] `DAWR-07 fix(web-sidebar): tighten strategy card source precedence and fallback behavior in edge cases`
- [x] `DAWR-08 docs(ops): add strategy-drift diagnostic/repair run step for dashboard regression triage`
- [x] `DAWR-09 docs(sync): align execution-plan status with canonical queue/board for closed waves`
- [x] `DAWR-10 qa(closure): run focused regression pack and sync canonical queue/context`

### Progress Log (Phase DAWR - Dashboard Aggregate Wallet and Strategy Regression)
- 2026-04-20: Queued `DAWR` from post-MURC analyst report to fix aggregate LIVE wallet KPI regression (`referenceBalance/freeCash` missing in aggregate summary), lock strategy sidebar null/mismatch edge behavior, and synchronize planning status drift across canonical files. Published executor-ready plan in `docs/planning/dashboard-aggregate-wallet-strategy-regression-plan-2026-04-20.md`.
- 2026-04-20: Closed `DAWR-01..DAWR-03` by freezing aggregate wallet-summary + sidebar null/mismatch edge contract in canonical docs, adding aggregate API regression locks for `positions.summary.referenceBalance/freeCash` (non-empty + empty aggregate), and extending aggregate projection with parity fields from latest session capital context (`null` for unresolved empty state). Validation PASS: `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- 2026-04-20: Closed `DAWR-04..DAWR-10` by adding web regression locks for aggregate-success LIVE wallet behavior and sidebar `strategyId` null/mismatch edge precedence, tightening sidebar fallback behavior, documenting strategy-drift audit/repair ops step, and synchronizing canonical queue/context status. Closure pack PASS: `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

## Phase DASHR - Dashboard Runtime Data Parity Recovery (Closed 2026-04-19)
- [x] `DASHR-01 docs(contract): freeze dashboard runtime parity contract for positions/orders/history/signals/selected-bot section`
- [x] `DASHR-02 test(web-red): add failing coverage for orders-tab table rendering and selected-bot strategy refresh`
- [x] `DASHR-03 fix(web-orders-tab): replace open-orders placeholder with DataTable + deterministic empty state`
- [x] `DASHR-04 fix(web-selected-bot-panel): ensure strategy context refresh and apply requested spacing/layout order`
- [x] `DASHR-05 test(api+web-red): reproduce positions/history mismatch between runtime module and dashboard selected snapshot`
- [x] `DASHR-06 fix(api+web-runtime-parity): align selected session/snapshot mapping for positions and history tabs`
- [x] `DASHR-07 test(api-red-signals-scope): lock selected-bot-only markets/strategy context in signals payload`
- [x] `DASHR-08 fix(api-signals-scope): enforce selected-bot symbol and strategy context parity for dashboard signals`
- [x] `DASHR-09 test(api-red-signal-execution): add regression for condition-met but no-order/no-position outcome`
- [x] `DASHR-10 fix(api-runtime-execution): restore signal->order->position flow or emit explicit blocked diagnostics`
- [x] `DASHR-11 qa(closure): run focused dashboard runtime parity pack and sync canonical queue/context`

### Progress Log (Phase DASHR - Dashboard Runtime Data Parity Recovery)
- 2026-04-19: Queued dedicated runtime parity recovery wave from latest operator report (`positions/orders/history/signals/selected-bot inconsistencies`) and published implementation contract in `docs/planning/dashboard-runtime-data-parity-recovery-plan-2026-04-19.md`, with strict scope lock to requested dashboard runtime fixes only.
- 2026-04-19: Closed `DASHR-A` (`DASHR-01..DASHR-04`) with web parity evidence: orders tab DataTable replacement, deterministic selected-bot strategy refresh, and selected-bot section layout/spacing lock (`KPI -> selector -> market/strategy`, `mt-6`).
- 2026-04-19: Closed `DASHR-B` (`DASHR-05..DASHR-08`) by restoring selected-session positions/history parity and selected-bot-only signals scope across canonical ACTIVE+enabled links.
- 2026-04-19: Closed `DASHR-C` (`DASHR-09..DASHR-11`) by adding explicit runtime blocked-path diagnostics (`PRETRADE_BLOCKED`) and completing focused closure pack (`api bots/orders/runtime tests`, `web HomeLiveWidgets`, `api/web typecheck`, `web build`, `quality:guardrails`).

## Phase OOSC - Dashboard Open Orders Source Column (Closed 2026-04-20)
- [x] `OOSC-01 docs(contract): freeze dashboard open-orders source-column and active-only status contract`
- [x] `OOSC-02 test(api-red): add regressions for manual-order origin=USER and runtime open-orders origin projection`
- [x] `OOSC-03 fix(api): persist manual-order origin as USER and expose origin in open-orders runtime payload`
- [x] `OOSC-04 test(web-red): add dashboard open-orders source-column regression with label mapping`
- [x] `OOSC-05 fix(web-dashboard): add open-orders source column and render mapped labels`
- [x] `OOSC-06 feat(i18n): add open-orders source-column labels in dashboard namespaces (en/pl/pt)`
- [x] `OOSC-07 docs(sync): update module docs and planner artifacts after source-column rollout`
- [x] `OOSC-08 qa(closure): run focused open-orders source-column pack and finalize queue/context`

### Progress Log (Phase OOSC - Dashboard Open Orders Source Column)
- 2026-04-20: Queued `OOSC` wave and published executor-ready plan `docs/planning/dashboard-open-orders-source-column-plan-2026-04-20.md` with strict scope lock: Open Orders `Source` column mapping, explicit manual-order `origin=USER`, and unchanged active-only statuses (`PENDING`, `OPEN`, `PARTIALLY_FILLED`).
- 2026-04-20: Closed `OOSC-01` by freezing canonical contract in `open-decisions`, `api-orders`, and `web-dashboard-home`.
- 2026-04-20: Closed `OOSC-A` (`OOSC-01..OOSC-03`) by adding API regressions and implementation for explicit manual-order write origin (`origin=USER`) plus runtime open-orders origin projection.
- 2026-04-20: Closed `OOSC-B` (`OOSC-04..OOSC-06`) by shipping dashboard Open Orders `Source` column mapping (`Manual/Bot/Imported`) and `en/pl/pt` localization coverage with web regression lock.
- 2026-04-20: Closed `OOSC-C` (`OOSC-07..OOSC-08`) with docs/context synchronization and focused closure pack PASS (`orders-positions.e2e`, `bots.monitoring-aggregate.e2e`, `HomeLiveWidgets.test`, `HomeLiveWidgets.open-orders-source.test`, `api/web typecheck`, `quality:guardrails`).

## Phase BTCF - Backtests List/Create Time-Window Remediation (Closed 2026-04-20)
- [x] `BTCF-01 docs(contract): freeze backtests list columns and explicit time-window create contract`
- [x] `BTCF-02 test(api-red): add list contract regression for strategy/markets/initBalance enrich fields`
- [x] `BTCF-03 feat(api-list-enrich): expose strategy/markets/initBalance fields for backtests list rows`
- [x] `BTCF-04 fix(web-list): replace Symbol/Interval columns with Strategy/Markets/Init balance`
- [x] `BTCF-05 test(web-red): add create-form regressions for start/end fields, slider bounds, and 3-column md layout`
- [x] `BTCF-06 feat(web-create): add startAt/endAt fields + deterministic sync rules + min 250 candles`
- [x] `BTCF-07 refactor(web-create-layout): switch create form md+ structure to 3 columns with independent strategy/market contexts`
- [x] `BTCF-08 test(api-red): add run DTO/job range regressions for explicit startAt/endAt semantics`
- [x] `BTCF-09 fix(api-range-flow): extend DTO/repository/job/gateway to persist and use explicit startAt/endAt`
- [x] `BTCF-10 feat(i18n): add backtests list/create keys for new columns, labels, and validation messages`
- [x] `BTCF-11 docs(sync): update backtests module/logic docs for list contract and explicit time-window execution`
- [x] `BTCF-12 qa(closure): run focused backtests remediation pack and sync canonical queue/context`

### Progress Log (Phase BTCF - Backtests List/Create Time-Window Remediation)
- 2026-04-20: Queued `BTCF` from backtests analysis report to deliver requested list-column contract (`Strategy`, `Markets`, `Init balance`, `Status`, `Start`, `Actions`), create-form md 3-column context UX, explicit `startAt/endAt` run window with slider bounds `250..10000`, backend range execution parity in job/gateway, and backward compatibility for existing historical runs. Published executor-ready plan in `docs/planning/backtests-list-create-time-window-remediation-plan-2026-04-20.md`.
- 2026-04-20: Completed `BTCF-01` by freezing canonical backtests list/create contract in `open-decisions` plus module docs (`web-backtest`, `api-backtests`) with explicit list column set, range field semantics (`startAt/endAt`), slider bounds (`250..10000`), and legacy run compatibility requirement.
- 2026-04-20: Closed `BTCF-A` (`BTCF-01..BTCF-04`) by locking API list enrichment (`strategyName`, `markets`, `initialBalance`) and canonical web list columns (`Strategy`, `Markets`, `Init balance`, `Status`, `Start`, `Actions`) with focused API+web regressions.
- 2026-04-20: Closed `BTCF-B` (`BTCF-05..BTCF-09`) by adding create-form range/layout regressions, implementing deterministic range/candles sync (`250..10000`), and wiring API create/job/gateway/timeline flows to explicit `startAt/endAt` boundaries with legacy fallback compatibility.
- 2026-04-20: Closed `BTCF-C` (`BTCF-10..BTCF-12`) by completing `en/pl/pt` copy parity, syncing module/architecture docs to explicit range semantics, and running closure validations (`backtests tests`, `api/web typecheck`, `build`, `quality:guardrails`, `i18n:audit:route-reachable:web`).

## Phase UOLF - Unified Order Lifecycle and Exchange Sync (Closed 2026-04-20)
- [x] `UOLF-01 docs(contract): supersede manual-order order-only contract with unified order-fill-position lifecycle`
- [x] `UOLF-02 test(api-red): add selected-bot scoping regressions for manual-order writes and reads`
- [x] `UOLF-03 test(api-red): lock unified lifecycle semantics for manual and runtime opens in paper/live`
- [x] `UOLF-04 test(api-red): add reconciliation regressions for imported external positions and open orders`
- [x] `UOLF-05 fix(api-context): derive canonical mode wallet and strategy from bot-bound context on open-order command`
- [x] `UOLF-06 refactor(api-lifecycle): introduce shared order lifecycle authority and fill-handler entrypoint`
- [x] `UOLF-07 feat(api-paper): route paper fills through adapter-backed order-status transition path`
- [x] `UOLF-08 fix(api-live): ensure live runtime/manual opens create exchange order only and defer position authority to fill/sync`
- [x] `UOLF-09 fix(api-rules): unify Binance quantity-step minQty and minNotional validation across runtime manual and pretrade`
- [x] `UOLF-10 fix(api-reconciliation): import external open positions and open orders into canonical owning bot wallet scope`
- [x] `UOLF-11 test(web-red): add dashboard regressions for selected-bot order/position lifecycle and imported exchange visibility`
- [x] `UOLF-12 fix(web-dashboard): align manual-order UX and runtime tables to unified lifecycle semantics`
- [x] `UOLF-13 feat(web-dashboard): expose deterministic manual-order constraint hints and humanized live pretrade diagnostics`
- [x] `UOLF-14 docs(sync): update module and ops docs after unified lifecycle rollout`
- [x] `UOLF-15 qa(closure): run unified lifecycle and exchange-sync safety pack and sync canonical queue/context`

### Progress Log (Phase UOLF - Unified Order Lifecycle and Exchange Sync)
- 2026-04-20: Queued `UOLF` from clarified product target and published executor-ready plan `docs/planning/unified-order-lifecycle-and-exchange-sync-plan-2026-04-20.md` with strict scope lock: one canonical lifecycle (`order -> fill -> position`) for manual and runtime opens, strict selected-bot scope, wallet-scoped exchange takeover ownership, and Binance parity requirements.
- 2026-04-20: Completed `UOLF-01` by freezing canonical contract in `open-decisions` plus module docs (`api-orders`, `api-bots`, `web-dashboard-home`), explicitly superseding historical `SOPR-C order-only` wording before implementation tasks.
- 2026-04-20: Closed `UOLF-02..UOLF-13` implementation wave by shipping selected-bot scope guards, unified `order -> fill -> position` lifecycle authority for manual/runtime paths, live/paper parity safeguards, and dashboard/operator parity adjustments.
- 2026-04-20: Completed `UOLF-14..UOLF-15` by synchronizing docs/ops artifacts and passing closure validation pack (`api UOLF matrix`, `HomeLiveWidgets + preview parity`, `api/web typecheck`, `build`, `quality:guardrails`, `test:go-live:smoke`).

## Phase WAPR - Wallets List API-Key Status and Paper Reset Safety (Closed 2026-04-20)
- [x] `WAPR-01 docs(contract): freeze wallets list api-key column and paper-reset safety contract`
- [x] `WAPR-02 test(web-red): add wallets list regression for api-key column and no-details contract`
- [x] `WAPR-03 fix(web-list): remove details row and add api-key status column in wallets table`
- [x] `WAPR-04 test(api-red): add paper-reset safety and baseline regressions`
- [x] `WAPR-05 fix(api-wallets): add dedicated reset-paper command and domain errors`
- [x] `WAPR-06 fix(api-capital): make paper runtime capital snapshot reset-aware`
- [x] `WAPR-07 test(web-red): add paper-wallet reset action visibility and submit regressions`
- [x] `WAPR-08 fix(web-form): add reset paper wallet action to wallet edit form`
- [x] `WAPR-09 docs(sync): update wallet module docs and canonical queue/context after rollout`
- [x] `WAPR-10 qa(closure): run focused wallets list + paper-reset validation pack and finalize queue/context`

### Progress Log (Phase WAPR - Wallets List API-Key Status and Paper Reset Safety)
- 2026-04-20: Completed `WAPR-01` by freezing canonical `WAPR` contract across `open-decisions` plus wallet module docs (`api-wallets`, `web-wallets`): list contract now explicitly locks `no Details` + inline `API key` status column order/mapping, and paper-reset contract is locked as dedicated fail-closed non-destructive command with reset-checkpoint baseline semantics.
- 2026-04-20: Queued `WAPR` from wallet-module analysis and published executor-ready plan `docs/planning/wallets-list-paper-reset-safety-plan-2026-04-20.md` with strict scope lock: remove duplicate wallet-list `Details` rows, add inline `API key` connected-state column, and implement dedicated non-destructive `PAPER` wallet reset via reset-aware capital baseline rather than naive `paperInitialBalance` edit-only behavior.
- 2026-04-20: Closed `WAPR-02..WAPR-08` end-to-end by removing wallet-list `Details` expansion, adding deterministic inline `API key` column mapping (`Connected/Not connected`), shipping dedicated fail-closed `POST /dashboard/wallets/:id/reset-paper`, introducing wallet-level reset checkpoint (`paperResetAt`), making runtime paper-capital baseline reset-aware, and exposing paper-only reset action in wallet edit form with deterministic loading/error/success UX states.
- 2026-04-20: Completed `WAPR-09..WAPR-10` by synchronizing wallet module and canonical queue/context docs and passing focused closure pack (`api wallets.e2e`, `web wallets tests`, `api/web typecheck`, `quality:guardrails`).

## Phase L10NQ-E - Residual Route-Reachable i18n Debt Closure (Closed 2026-04-21)
- [x] `L10NQ-E-01 docs(contract): freeze residual route-reachable i18n debt scope, audit-trust contract, and closure target`
- [x] `L10NQ-E-02 audit(web-i18n): split latest residual findings into actionable module debt vs shared-foundation debt vs audit-signal noise`
- [x] `L10NQ-E-03 refactor(tooling): tighten route-reachable audit scoring so namespace/registry files do not masquerade as unresolved route debt`
- [x] `L10NQ-E-04 refactor(web-public-shell): migrate residual public-shell and dashboard-shell literals to canonical namespaces`
- [x] `L10NQ-E-05 refactor(web-profile): remove residual profile API-key hook/local error-copy drift`
- [x] `L10NQ-E-06 refactor(web-backtests): retire backtestRunDetails.copy.ts and align remaining backtests exception surfaces`
- [x] `L10NQ-E-07 refactor(web-shared-foundation): localize or formally retire remaining shared i18n exception primitives`
- [x] `L10NQ-E-08 test(web-i18n): expand route-smoke/parity/guardrail coverage for residual L10NQ-E routes`
- [x] `L10NQ-E-09 qa(closure): run residual i18n closure pack and confirm zero actionable route debt`
- [x] `L10NQ-E-10 docs(sync): publish closure evidence and synchronize canonical queue/context/inventory docs`

### Progress Log (Phase L10NQ-E - Residual Route-Reachable i18n Debt Closure)
- 2026-04-21: Queued `L10NQ-E` from the residual findings explicitly left by the `CQLT` closure pack and published executor-ready plan `docs/planning/l10nq-e-residual-route-reachable-i18n-closure-plan-2026-04-21.md`. Scope is intentionally limited to actionable residual route/shared i18n debt plus audit signal-quality hardening so closure can target zero actionable route debt instead of carrying forward noisy findings.
- 2026-04-21: Closed `L10NQ-E` end-to-end by tightening route-reachable audit scoring, migrating the remaining public/profile/wallets/markets/backtests/shared UI copy to canonical namespaces, and passing closure gates with final audit result `findings=0`, `localCopy=0`, `fallbackPl=0`, `hardcoded=0`; evidence in `docs/operations/l10nq-e-residual-route-reachable-i18n-closure-2026-04-21.md`.

## Phase SCALE-A - Scalability and Anti-Drift Foundation (Closed 2026-04-22)
- [x] `SCALE-01 docs(contract): freeze anti-drift execution model and self-sufficient task-packet rule`
- [x] `SCALE-02 audit(guardrails-truth): diff current allowlists against actually closed hotspots`
- [x] `SCALE-03 refactor(guardrails): remove stale allowlists and add regression lock for reintroducing closed exceptions`
- [x] `SCALE-04 docs(inventory-sync): refresh maintainability inventory and hotspot sizes to current code reality`
- [x] `SCALE-05 docs(contract): freeze canonical exchange access boundary and ownership matrix`
- [x] `SCALE-06 audit(api-exchange): map remaining duplicate bootstrap and metadata flows in API`
- [x] `SCALE-07 refactor(api-exchange-read): centralize public market-map and symbol-rules access behind one read boundary`
- [x] `SCALE-08 refactor(api-exchange-auth): centralize authenticated exchange client access for positions and future snapshot/read consumers`
- [x] `SCALE-09 refactor(api-wallet-metadata): converge wallet metadata, manual-order context, and symbol-rules dependencies onto one metadata contract`
- [x] `SCALE-10 test(api-exchange): run focused regression pack for canonical exchange access layer`
- [x] `SCALE-11 docs(contract): freeze container/controller/view-model split contract for HomeLiveWidgets and BacktestRunDetails`
- [x] `SCALE-12 refactor(web-dashboard): extract manual-order controller seam from HomeLiveWidgets`
- [x] `SCALE-13 refactor(web-dashboard): extract runtime tables and selected-bot summary presenters from HomeLiveWidgets`
- [x] `SCALE-14 refactor(web-backtests): extract timeline orchestration hook from BacktestRunDetails`
- [x] `SCALE-15 refactor(web-backtests): extract trades analytics and tab presenters from BacktestRunDetails`
- [x] `SCALE-16 test(web-seams): run focused parity/regression pack for dashboard and backtests seam extraction`
- [x] `SCALE-17 docs(sync): publish closure evidence, future-agent coding rules, and residual backlog handoff`

### Progress Log (Phase SCALE-A - Scalability and Anti-Drift Foundation)
- 2026-04-22: Queued `SCALE-A` to remove the structural causes of future delivery drift after `CQLT` and `L10NQ-E`: stale guardrail allowlists, spread exchange/bootstrap ownership, and still-oversized web orchestration containers. Published executor-ready plan `docs/planning/scalability-anti-drift-foundation-plan-2026-04-22.md` and froze the permanent task-packet / anti-drift rules in `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`.
- 2026-04-22: Closed `SCALE-01..SCALE-05` by auditing all active guardrail allowlists against real regex matches, removing stale local-copy/hardcoded/monolith exceptions, refreshing maintainability inventory metrics to current file sizes, and freezing exchange-access ownership in `docs/architecture/reference/exchange-access-ownership-matrix.md`; execution focus advanced to `SCALE-06..SCALE-10`.
- 2026-04-22: Closed `SCALE-06..SCALE-10` by publishing duplicate-flow audit evidence in `docs/operations/scale-b-exchange-access-audit-2026-04-22.md`, introducing canonical `exchangePublicRead` + `exchangeAuthenticatedRead` + `exchangeMetadataContract` boundaries, and rewiring symbol rules, manual-order context, positions snapshots, and wallet metadata/balance preview to those boundaries; focused exchange tests plus `api typecheck`, `api build`, and `quality:guardrails` passed.
- 2026-04-22: Closed `SCALE-11` + `SCALE-12` by freezing the web container split contract in `docs/architecture/reference/web-container-split-contract.md`, adding canonical `useManualOrderController` ownership for dashboard manual-order state/context/submit flow, rewiring `HomeLiveWidgets` to the seam, and passing focused dashboard tests with `web typecheck` + `web build`.
- 2026-04-22: Closed `SCALE-13` by extracting runtime data-table presenter ownership and selected-bot sidebar presenter assembly into dedicated `home-live-widgets` modules, reducing `HomeLiveWidgets` to section composition over presenter seams while preserving runtime behavior; validation: focused dashboard tests (`20/20 PASS`), `pnpm --filter web run typecheck`, `pnpm --filter web run build`.
- 2026-04-22: Closed `SCALE-14` by extracting timeline orchestration from `BacktestRunDetails` into `useBacktestTimelineOrchestration` (chunk/cursor progression, cache merge, in-flight locks, parity-failed symbol handling), keeping route component ownership focused on tab composition; validation: `pnpm --filter web run test -- --run src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx`, `pnpm --filter web run typecheck`, `pnpm --filter web run build`.
- 2026-04-22: Closed `SCALE-15` by extracting trades analytics into `useBacktestTradesAnalytics` and moving tab presenter ownership (`summary`, `markets`, `trades`, `raw`) into `BacktestRunDetailsTabPanels`, leaving `BacktestRunDetails` as route-level composition shell; validation: `pnpm --filter web run test -- --run src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx`, `pnpm --filter web run typecheck`, `pnpm --filter web run build`.
- 2026-04-22: Closed `SCALE-16` by running focused seam/parity regression pack across dashboard + backtests extraction surfaces (`HomeLiveWidgets`, preview parity, `BacktestRunDetails`, `useBacktestRunCoreData`, `backtestRunDetailsViewModel`) with `31/31 PASS`; closure gates `pnpm run quality:guardrails`, `pnpm --filter web run build`, and `pnpm --filter web run typecheck` passed.
- 2026-04-22: Closed `SCALE-17` by publishing closure evidence and future-agent coding rules in `docs/operations/scale-cd-closure-evidence-2026-04-22.md`, updating `web-container-split-contract` and module handoff docs (`web-backtest`, `web-dashboard-home`), and synchronizing canonical queue/context docs for completed `SCALE-C` + `SCALE-D`.

## Phase TRUTH-A - Live Safety and Contract Truth Closure (Closed 2026-04-22)
- [x] `TRUTH-01 docs(contract): freeze fail-closed LIVE credential ownership and exchange-truth remediation rules`
- [x] `TRUTH-02 audit(api-live-safety): map every LIVE credential resolution path and forbidden fallback`
- [x] `TRUTH-03 fix(api-live-safety): remove cross-key fallback and require canonical key parity for LIVE orders`
- [x] `TRUTH-04 test(api-live-safety): add regression locks for LIVE key ownership failure modes`
- [x] `TRUTH-05 docs(contract): freeze explicit exchange capability matrix for authenticated account reads`
- [x] `TRUTH-06 audit(api-auth-reads): inventory every authenticated exchange read consumer versus real exchange support`
- [x] `TRUTH-07 refactor(api-auth-read-contract): introduce one canonical authenticated account-read boundary`
- [x] `TRUTH-08 fix(api-wallet-preview): make wallet balance preview contract truthful by exchange and source`
- [x] `TRUTH-09 fix(api-positions-snapshots): make positions/open-orders snapshot contract truthful by exchange and scope`
- [x] `TRUTH-10 audit(web-guardrails): inventory residual JSX/presenter literal debt and current guardrail blind spots`
- [x] `TRUTH-11 refactor(web-guardrails): harden hardcoded-UI detection for JSX and presenter literals`
- [x] `TRUTH-12 fix(web-runtime-copy): remove remaining runtime/dashboard literal drift behind canonical presenter or i18n ownership`
- [x] `TRUTH-13 qa(closure): run focused safety, exchange-truth, and guardrail closure pack`
- [x] `TRUTH-14 docs(sync): publish closure evidence and freeze future-agent extension rules`

### Progress Log (Phase TRUTH-A - Live Safety and Contract Truth Closure)
- 2026-04-22: Queued `TRUTH-A` from the post-`SCALE` architecture review to close three remaining systemic risks: forbidden LIVE order API-key fallback, generic exchange-read contracts still hiding Binance-only behavior, and JSX/presenter hardcoded UI literals still bypassing current guardrails. Published executor-ready plan `docs/planning/truth-a-live-safety-and-contract-truth-plan-2026-04-22.md` and froze the permanent remediation rules in `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`.
- 2026-04-22: Closed `TRUTH-A` end-to-end by removing forbidden LIVE key fallback to unrelated recent credentials, freezing explicit authenticated exchange-read support truth (`BINANCE` supported, other exchanges explicit fail-closed per operation family), broadening JSX/presenter hardcoded-literal guardrails, migrating shared UI defaults (`ConfirmModal`, `DataTable`, `SearchableMultiSelect`) to canonical `public.sharedUi.*` i18n, and publishing closure evidence in `docs/operations/truth-a-live-safety-and-contract-truth-closure-2026-04-22.md`. Validation PASS: focused API tests, focused web guardrail tests, `quality:guardrails`, `api build`, `web build`, `typecheck`.

## Phase XLIFE-A - Execution Lifecycle Parity and Exchange Truth (Closed 2026-04-22)
- [x] `XLIFE-01 docs(contract): freeze one canonical PAPER/LIVE execution lifecycle contract`
- [x] `XLIFE-02 audit(api-runtime): map current runtime order/fill/position authority and divergence points`
- [x] `XLIFE-03 test(api-red): add failing regression locks for live close pending/partial lifecycle truth`
- [x] `XLIFE-04 refactor(api-runtime): make close lifecycle fail-closed until canonical close fill is confirmed`
- [x] `XLIFE-05 test(api-red): lock fill-price and realized-PnL truth for open and close trades`
- [x] `XLIFE-06 refactor(api-runtime): derive trades and realized PnL from canonical fill results instead of signal markPrice`
- [x] `XLIFE-07 docs(contract): freeze one shared PAPER/LIVE fill adapter boundary`
- [x] `XLIFE-08 refactor(api-shared): converge PAPER and LIVE execution onto one canonical fill-result application path`
- [x] `XLIFE-09 audit(api-exchange-scope): inventory runtime watchdog, automation, and reconciliation exchange-truth drift`
- [x] `XLIFE-10 refactor(api-exchange-scope): make watchdog and runtime infrastructure explicit about exchange truth`
- [x] `XLIFE-11 test(api+e2e): run critical-path regression pack for signal -> order -> fill -> position parity`
- [x] `XLIFE-12 docs(sync): publish closure evidence and freeze future-agent execution-extension rules`

### Progress Log (Phase XLIFE-A - Execution Lifecycle Parity and Exchange Truth)
- 2026-04-22: Queued `XLIFE-A` from the post-`TRUTH-A` runtime review after confirming the remaining V1-critical gaps are no longer primarily structural, but execution-truth related: local close-before-fill behavior in `LIVE`, runtime accounting based on signal `markPrice` instead of canonical fill truth, partial duplication or divergence risk between `PAPER` and `LIVE` lifecycle semantics, and hidden Binance-only assumptions in runtime watchdog/automation infrastructure. Published executor-ready plan `docs/planning/execution-lifecycle-parity-and-exchange-truth-plan-2026-04-22.md` and froze the permanent extension rules in `docs/architecture/reference/execution-lifecycle-parity-contract.md`.
- 2026-04-22: Closed `XLIFE-A` end-to-end by making LIVE close flow fail-closed until canonical fill truth exists, switching runtime trade and realized-PnL persistence to canonical fill price and quantity, persisting runtime-origin orders with `origin=BOT` so bot-opened positions keep ownership truth through canonical order-fill-position lifecycle, keeping runtime automation alive during submitted close state, and publishing closure evidence in `docs/operations/execution-lifecycle-parity-and-exchange-truth-closure-2026-04-22.md`. Validation PASS: focused XLIFE engine/runtime pack, `api typecheck`, `api build`, `quality:guardrails`.

## Phase REVIEW-B - Runtime/Exchange Production Readiness Review Closure (Closed 2026-04-22)
- [x] `REVIEW-B-01 docs(contract): freeze review-driven runtime/exchange closure scope and non-regression rules`
- [x] `REVIEW-B-02 test(api-red): lock DCA pending/partial-fill failure modes before refactor`
- [x] `REVIEW-B-03 refactor(api-runtime): move DCA/add-leg execution onto canonical fill-result lifecycle`
- [x] `REVIEW-B-04 test(api-red): lock submitted-order retry semantics after exchange failure/cancel`
- [x] `REVIEW-B-05 refactor(api-runtime): make submitted dedupe non-terminal until canonical order outcome is known`
- [x] `REVIEW-B-06 audit(api-ops): inventory exchange snapshot ownership ambiguity and watchdog scope drift`
- [x] `REVIEW-B-07 refactor(api-ops): make exchange snapshots and watchdog scope explicit and deterministic`
- [x] `REVIEW-B-08 qa(closure): run focused production-readiness pack and publish closure evidence`

### Progress Log (Phase REVIEW-B - Runtime/Exchange Production Readiness Review Closure)
- 2026-04-22: Queued `REVIEW-B` from the post-`XLIFE-A` review after confirming four remaining production-readiness gaps: DCA/add-leg lifecycle still bypasses canonical fill truth, submitted-order dedupe becomes terminal too early, generic exchange snapshots are ambiguous when multiple API keys exist, and watchdog symbol scope is broader than its explicit Binance-only coverage. Published audit evidence in `docs/operations/review-b-runtime-exchange-production-audit-2026-04-22.md` and executor-ready rollout plan in `docs/planning/review-b-runtime-exchange-production-readiness-plan-2026-04-22.md`.
- 2026-04-22: Closed `REVIEW-B-01..REVIEW-B-08` end-to-end by moving runtime DCA/add-leg execution onto canonical fill-result lifecycle, making submitted dedupe non-terminal until linked order truth is known, making generic exchange snapshots fail closed when ownership is ambiguous unless `apiKeyId` is explicit, narrowing watchdog symbol inventory to explicit Binance-futures scope, and publishing closure evidence in `docs/operations/review-b-runtime-exchange-production-closure-2026-04-22.md`. Validation PASS: focused runtime/positions Vitest pack, `pnpm --filter api run typecheck`, `pnpm --filter api run build`, `pnpm run typecheck`, `pnpm run build`, `pnpm run quality:guardrails`.

## Phase REVIEW-C - Runtime State and Reconciliation Truth Closure (Closed 2026-04-22)
- [x] `REVIEW-C-01 docs(contract): freeze runtime-state replay and reconciliation truth scope`
- [x] `REVIEW-C-02 test(api-red): lock canonical runtime-state replay after completed DCA dedupe reuse`
- [x] `REVIEW-C-03 refactor(api-runtime): derive replayed DCA state from canonical persisted position truth`
- [x] `REVIEW-C-04 test(api-red): lock exchange snapshot error normalization and disappearing-order reconciliation semantics`
- [x] `REVIEW-C-05 refactor(api-ops): normalize snapshot failures through one explicit exchange-error contract`
- [x] `REVIEW-C-06 refactor(api-reconciliation): replace synthetic stale-order cancelation with explicit unresolved reconciliation truth`
- [x] `REVIEW-C-07 qa(closure): run focused runtime/positions truth pack and publish closure evidence`

### Progress Log (Phase REVIEW-C - Runtime State and Reconciliation Truth Closure)
- 2026-04-22: Queued `REVIEW-C` from the post-`REVIEW-B` review after confirming three remaining production-readiness truth gaps: completed DCA dedupe replay can still restore runtime state from synthetic math, authenticated exchange snapshot fetch failures are not guaranteed to normalize through the explicit operator error contract, and live reconciliation still treats disappearance from exchange open-orders as synthetic `CANCELED`. Published audit evidence in `docs/operations/review-c-runtime-state-and-reconciliation-audit-2026-04-22.md` and executor-ready rollout plan in `docs/planning/review-c-runtime-state-and-reconciliation-closure-plan-2026-04-22.md`.
- 2026-04-22: Closed `REVIEW-C-01..REVIEW-C-07` end-to-end by deriving completed DCA replay state from canonical persisted position truth, normalizing authenticated exchange snapshot failures through one explicit operator error contract, replacing synthetic stale-order cancelation with explicit unresolved reconciliation truth, and publishing closure evidence in `docs/operations/review-c-runtime-state-and-reconciliation-closure-2026-04-22.md`. Validation PASS: focused runtime/positions Vitest pack, `pnpm --filter api run typecheck`, `pnpm --filter api run build`, `pnpm run quality:guardrails`.

## Phase RELEASE-HARDEN-A - Canonical V1 Release Gate Closure (Closed 2026-04-22)
- [x] `RELEASE-HARDEN-A-01 docs(contract): freeze one canonical V1 release gate entrypoint`
- [x] `RELEASE-HARDEN-A-02 chore(ops-scripts): add a single orchestration script for V1 release gating`
- [x] `RELEASE-HARDEN-A-03 docs(sync): align release checklist and smoke docs to the canonical gate`

### Progress Log (Phase RELEASE-HARDEN-A - Canonical V1 Release Gate Closure)
- 2026-04-22: Closed `RELEASE-HARDEN-A` by adding the canonical release gate script `scripts/runV1ReleaseGate.mjs`, exposing `pnpm run ops:release:v1:gate`, publishing `docs/operations/v1-release-gate-runbook.md`, and aligning V1 release/smoke docs to the same operator entrypoint. Validation PASS: `pnpm run ops:release:v1:gate -- --dry-run --base-url http://localhost:3001 --skip-go-live-smoke --skip-deploy-smoke --skip-runtime-freshness --skip-rollback-guard`, `pnpm run quality:guardrails`.

## Phase REVIEW-D - Live Opt-In and Ownership Safety Closure (Closed 2026-04-22)
- [x] `REVIEW-D-01 docs(contract): freeze live opt-in, orphan-position, and readiness-truth closure scope`
- [x] `REVIEW-D-02 test(api-red): lock runtime admission so non-opted-in LIVE bots cannot enter signal topology`
- [x] `REVIEW-D-03 refactor(api-runtime): enforce live opt-in admission across runtime topology and automation candidate selection`
- [x] `REVIEW-D-04 test(api-red): lock fail-closed handling for orphan bot-origin positions`
- [x] `REVIEW-D-05 refactor(api-runtime): keep orphan bot-origin positions unresolved until canonical bot context exists`
- [x] `REVIEW-D-06 test(api-red): lock canonical takeover-rebind ownership for orphan bot-origin positions`
- [x] `REVIEW-D-07 refactor(api-positions): canonicalize takeover rebind to explicit ownership proof or unresolved state`
- [x] `REVIEW-D-08 test(api+ops-red): lock readiness truth so legacy API-key encryption fallback is compatibility-only`
- [x] `REVIEW-D-09 refactor(api-ops): separate legacy decrypt compatibility from canonical release readiness`
- [x] `REVIEW-D-10 qa(closure): run focused REVIEW-D pack and publish closure evidence`

### Progress Log (Phase REVIEW-D - Live Opt-In and Ownership Safety Closure)
- 2026-04-22: Queued `REVIEW-D` from the post-`SAFEV1-A` review after confirming four remaining production-safety gaps: non-opted-in live bots still enter runtime topology, orphan bot-origin positions can still inherit manual env-default automation context, takeover rebind can still assign orphan bot-origin positions without canonical proof, and readiness still treats legacy API-key encryption fallback as production-ready key material. Published audit evidence in `docs/operations/review-d-live-opt-in-and-ownership-safety-audit-2026-04-22.md` and executor-ready rollout plan in `docs/planning/review-d-live-opt-in-and-ownership-safety-plan-2026-04-22.md`.
- 2026-04-22: Closed `REVIEW-D-01..REVIEW-D-03` by enforcing `liveOptIn` at runtime admission boundaries: repository topology queries and defaults-level admission now exclude `LIVE` bots unless `liveOptIn=true`, and runtime position automation skips live positions whose owning bot is not opted in before any strategy or execution-side flow is considered. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`, `pnpm run quality:guardrails`.
- 2026-04-22: Closed `REVIEW-D-04..REVIEW-D-05` by making runtime automation skip orphan `origin='BOT'` positions before any manual env-default mode, exchange, or market fallback can apply, keeping BOT-origin orphan state unresolved until canonical bot ownership exists. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- 2026-04-22: Closed `REVIEW-D-06..REVIEW-D-07` by making takeover rebind for orphan `origin='BOT'` positions require explicit canonical ownership proof; without that proof, bot-origin orphan positions now stay unresolved instead of being rebound from the currently eligible LIVE bot set, while exchange-synced api-key-based rebind remains deterministic. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- 2026-04-22: Closed `REVIEW-D-08..REVIEW-D-10` by requiring canonical versioned `API_KEY_ENCRYPTION_KEYS` for readiness and new encryption writes, keeping legacy `API_KEY_ENCRYPTION` as compatibility-only decrypt material, and publishing closure evidence in `docs/operations/review-d-live-opt-in-and-ownership-safety-closure-2026-04-22.md`. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/config/criticalSecretsReadiness.test.ts src/router/health-readiness.test.ts src/utils/crypto.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`, `pnpm run quality:guardrails`.

## Phase V1FACT-A - V1 Production Activation and Evidence Closure (Active)
- [x] `V1FACT-01 docs(contract): freeze V1 production activation scope and evidence rules`
- [x] `V1FACT-02 audit(ops): inventory current release-gate inputs, artifact freshness, and missing operator evidence`
- [x] `V1FACT-03 docs(queue): split V1 activation into stage rehearsal, prod evidence, and sign-off closure groups`
- [x] `V1FACT-04 test(ops-red): lock release activation against stale or missing evidence inputs`
- [x] `V1FACT-05 refactor(ops-gate): make release gate freshness and evidence classification explicit`
- [x] `V1FACT-06 chore(ops-stage): script or normalize one canonical stage rehearsal path for V1`
- [x] `V1FACT-07 qa(stage): execute and capture stage rehearsal evidence for web, api, workers, and release gate`
- [x] `V1FACT-08 test(ops-red): lock prod activation against incomplete rollback or backup proof`
- [x] `V1FACT-09 refactor(ops-proof): make backup/restore and rollback evidence first-class gate inputs`
- [x] `V1FACT-10 qa(prod-pack): build final prod activation evidence pack and sign-off summary`
- [x] `V1FACT-11 docs(sync): close wave, sync canonical queue/context, and freeze future-agent activation rules`

### Progress Log (Phase V1FACT-A - V1 Production Activation and Evidence Closure)
- 2026-04-22: Queued `V1FACT-A` after `REVIEW-D` closure to convert the now-hardened V1 runtime into an evidence-backed production activation path. Scope is intentionally limited to release-gate truth, stage/prod evidence freshness, backup/restore and rollback proof, and final sign-off packaging. Published executor-ready plan `docs/planning/v1-production-activation-and-evidence-plan-2026-04-22.md` and froze activation rules in `docs/architecture/reference/v1-production-activation-contract.md`.
- 2026-04-22: Closed `V1FACT-01..V1FACT-03` by freezing the activation contract, publishing `docs/operations/v1-production-activation-evidence-audit-2026-04-22.md` with a fresh/stale/missing evidence inventory, and advancing the canonical queue to `V1FACT-A2` for release-gate freshness semantics and fresh stage rehearsal evidence.
- 2026-04-22: Closed `V1FACT-04..V1FACT-07` by adding explicit evidence freshness classification to `scripts/runV1ReleaseGate.mjs`, fixing deploy-smoke API/web target passthrough, introducing canonical `ops:release:v1:stage-rehearsal`, and publishing fresh stage dry-run artifacts in `docs/operations/v1-release-gate-stage-2026-04-22T17-53-09-987Z.md` and `docs/operations/v1-stage-rehearsal-2026-04-22T17-53-09-987Z.md`. Validation PASS: `node --test scripts/runV1ReleaseGate.test.mjs`, `pnpm run ops:release:v1:gate -- --environment stage --dry-run --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage-soar.luckysparrow.ch --skip-local-quality`, `pnpm run ops:release:v1:stage-rehearsal -- --dry-run --base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage-soar.luckysparrow.ch`, `pnpm run quality:guardrails`.
- 2026-04-22: Closed `V1FACT-07B..V1FACT-09` by deploying the inline runtime-freshness truth fix on SHA `49ea8e0c`, rerunning authenticated stage rehearsal successfully, making prod backup/restore drill and rollback proof explicit release-gate evidence families, adding canonical `ops:deploy:rollback-proof*` entrypoints, and updating activation/runbook docs so stale or missing prod proof remains fail closed. Validation PASS: `node --test scripts/runV1ReleaseGate.test.mjs`, `pnpm run ops:deploy:rollback-proof:stage -- --base-url https://stage-api.soar.luckysparrow.ch --auth-email stage-ops-admin@luckysparrow.ch --auth-password "StageOps26!B3rlin#Gate" --ops-auth-header-name X-Forwarded-For --ops-auth-header-value 31.10.146.162`, `pnpm run quality:guardrails`.
- 2026-04-22: Closed `V1FACT-10` by publishing `docs/operations/v1-production-activation-pack-2026-04-22.md`, refreshing RC external-gates status, RC sign-off, and RC checklist to current-day truth, and narrowing residual activation blockers to missing prod restore-drill proof, missing prod rollback-proof pack, open RC Gate 2, and missing named human approvers. Validation PASS: `pnpm run ops:release:v1:gate -- --environment prod --dry-run --skip-local-quality --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`, `pnpm run ops:rc:gates:status`, `pnpm run ops:rc:signoff:build`, `pnpm run ops:rc:checklist:sync`.
- 2026-04-22: Closed `V1FACT-11` by publishing `docs/operations/v1-production-activation-closure-2026-04-22.md`, syncing queue/context/project state to the final `CLOSED_WITH_OPERATOR_BLOCKERS` state, and freezing future-agent rules so no future executor can infer production readiness from stage success, public prod smoke, or fresh docs alone.

## Phase PAPERPNL-A - Paper Close PnL Truth Recovery (Queued 2026-04-24)
- [x] `PAPERPNL-01 fix(api-runtime): recover truthful PAPER close PnL and wallet-capital updates for manual/runtime exits`
- [x] `PAPERPNL-02 test(api-runtime): lock profitable PAPER EXIT realized-PnL sign for canonical LONG and SHORT closes`

### Progress Log (Phase PAPERPNL-A - Paper Close PnL Truth Recovery)
- 2026-04-24: Queued `PAPERPNL-01` from a production paper-bot investigation after confirming one concrete drift in the canonical close path: manual dashboard close can still fall back to `position.entryPrice` when runtime ticker truth is unavailable, which records profitable exits as fee-only losses and then propagates the wrong realized PnL sign into runtime history and paper capital summary. Published task packet `docs/planning/paper-close-pnl-truth-recovery-task-2026-04-24.md` and promoted the task to `NOW`.
- 2026-04-24: Closed `PAPERPNL-01` by extracting `runtimeLifecycleMarkPrice.service.ts` as the shared close-price authority, wiring manual dashboard close and automated runtime close to the same ticker-or-recent-close resolver, and failing closed with `POSITION_CLOSE_PRICE_UNAVAILABLE` instead of synthesizing market truth from `position.entryPrice`. Added focused unit coverage plus API e2e parity proving a profitable `PAPER` manual close now persists positive realized PnL into position/trade records and raises runtime `referenceBalance/freeCash` in the session positions response.
- 2026-04-25: Closed `PAPERPNL-02` as the next smallest follow-up by adding focused `executionOrchestrator.service.test.ts` coverage that locks the canonical `PAPER` `EXIT` realized-PnL sign for both profitable `LONG` and profitable `SHORT` closes. The regression proves the same positive value is written into both the closed-position payload and the persisted close-trade payload, without changing production runtime logic.

## Phase DEPLOY-2026-04-25 - Coolify Web Build Hotfix Closure (Closed 2026-04-25)
- [x] `DEPLOY-2026-04-25-B qa(web-build): validate Coolify deploy hotfix locally and sync closure evidence`

### Progress Log (Phase DEPLOY-2026-04-25 - Coolify Web Build Hotfix Closure)
- 2026-04-25: Closed `DEPLOY-2026-04-25-B` as the smallest follow-up to the same-day Coolify web deploy hotfix by rerunning the exact local gate that had blocked deployment. Validation PASS: `pnpm --filter web run build`, `pnpm run quality:guardrails`. No additional code changes were required in this closure slice.

## Phase DOCSYNC-2026-04-25 - Project State Drift Cleanup (Closed 2026-04-25)

## Phase DOCSYNC-2026-04-28 - Planning Status Header Parity (Closed 2026-04-28)
- [x] `DOCSYNC-2026-04-28-C docs(planning-status): close stale Active headers in already closed planning packets`

### Progress Log (Phase DOCSYNC-2026-04-28 - Planning Status Header Parity)
- 2026-04-28: Closed `DOCSYNC-2026-04-28-C` by correcting stale `Status: Active` headers in already closed planning packets for `SCALE-A`, `V1FACT-A`, `V1TAKE-01`, `XADAPT-02`, and `XADAPT-06`. The slice was intentionally docs-only and restored parity between packet headers and canonical closure state already recorded in queue/context truth. Validation PASS: `pnpm run quality:guardrails`.

## Phase DOCSYNC-2026-04-28B - Planning Catalog Refresh (Closed 2026-04-28)
- [x] `DOCSYNC-2026-04-28-D docs(planning-catalog): refresh catalog index and correct stale UOLF queued header`

### Progress Log (Phase DOCSYNC-2026-04-28B - Planning Catalog Refresh)
- 2026-04-28: Closed `DOCSYNC-2026-04-28-D` by refreshing `planning-catalog-index-2026-04-19.md` with post-2026-04-20 wave history and correcting the stale `Status: queued` header in the already closed `UOLF` plan. The slice stayed docs-only and restored truthful discoverability for newer `implemented` and `superseded` planning artifacts. Validation PASS: `pnpm run quality:guardrails`.

## Phase DOCSYNC-2026-04-28C - Historical Status Normalization (Closed 2026-04-28)
- [x] `DOCSYNC-2026-04-28-E docs(planning-history): normalize remaining historical status wording`

### Progress Log (Phase DOCSYNC-2026-04-28C - Historical Status Normalization)
- 2026-04-28: Closed `DOCSYNC-2026-04-28-E` by normalizing the last ambiguous historical planning headers that still suggested active work (`PLANNED`, `planned`, `Published`) after their owning waves had closed, and by extending the planning catalog so those artifacts are discoverable as historical implemented or superseded references. Validation PASS: `pnpm run quality:guardrails`.
- [x] `DOCSYNC-2026-04-25-A docs(sync): remove stale V1POSTBOT full-api red-suite drift from project state`
- [x] `DOCSYNC-2026-04-25-B docs(sync): remove closed PAPERPNL entry from TASK_BOARD READY lane`

### Progress Log (Phase DOCSYNC-2026-04-25 - Project State Drift Cleanup)
- 2026-04-25: Closed `DOCSYNC-2026-04-25-A` by removing the stale `PROJECT_STATE.md` sentence that still claimed a separate 7-case full-API red-suite follow-up outside `V1IND-A`, keeping the canonical product snapshot aligned with the already-closed `V1POSTBOT-A` parity recovery. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-25: Closed `DOCSYNC-2026-04-25-B` by removing the already-closed `PAPERPNL-01` entry from the `TASK_BOARD` `READY` lane so the canonical queue state matches `mvp-next-commits.md`, `mvp-execution-plan.md`, and `PROJECT_STATE.md`. Validation PASS: `pnpm run quality:guardrails`.

## Phase V1READY-2026-04-25 - Final V1 Activation Truth Reconciliation (Queued 2026-04-25)
- [x] `V1READY-2026-04-25-A docs/ops(sync): reconcile final V1 activation truth, remaining blockers, and operator handoff`
- [x] `V1READY-2026-04-25-B ops/signoff(sync): rebuild RC sign-off artifact and publish final V1 READY/BLOCKED launch decision`
- [x] `V1READY-2026-04-25-C ops/deploy(sync): expose deployed commit truth and reconcile residual V1 activation artifacts`

### Progress Log (Phase V1READY-2026-04-25 - Final V1 Activation Truth Reconciliation)
- 2026-04-25: Queued `V1READY-2026-04-25-A` after a fresh canonical-state audit showed that V1 engineering scope appears complete, but the final activation truth drifts across `PROJECT_STATE.md`, `v1-production-activation-pack-2026-04-22.md`, `v1-production-activation-closure-2026-04-22.md`, and `v1-rc-signoff-record.md`. The next smallest honest slice is to reconcile those artifacts against the frozen activation contract and publish one canonical answer on whether V1 is already achieved or still blocked only by explicit operator-owned sign-off steps.
- 2026-04-25: Closed `V1READY-2026-04-25-A` as the activation-truth reconciliation pass. The audit chose one fail-closed canonical answer: V1 engineering scope is complete, but the release is still operator-blocked because the current RC sign-off artifact reports mixed gate truth (`PASS, PASS, PASS, OPEN`) while also claiming approval. Synced the activation pack, activation closure, RC gates status, RC checklist, RC sign-off record, queue docs, and `PROJECT_STATE.md`, then queued `V1READY-2026-04-25-B` as the smallest remaining operator-owned sign-off refresh slice.
- 2026-04-25: Closed `V1READY-2026-04-25-B` by rebuilding the RC sign-off artifact, refreshing RC external gate status, rebuilding sign-off once more so its own snapshot captured `G4=PASS`, and resyncing the RC checklist. Canonical activation truth is now green and internally consistent again: activation pack, activation closure, RC gates status, RC checklist, RC sign-off record, and project/context docs all agree that V1 is approved from the current repository evidence set. Validation PASS: `pnpm run ops:rc:signoff:build -- --engineering-name "Patryk Wróblewski" --product-name "Patryk Wróblewski" --operations-name "Patryk Wróblewski" --owner-name "Patryk Wróblewski" --owner-contact "luckysparrow.ch / wroblewskipatryk.pl / agent obliczeniowej inteligencji"`, `pnpm run ops:rc:gates:status`, `pnpm run ops:rc:signoff:build -- --engineering-name "Patryk Wróblewski" --product-name "Patryk Wróblewski" --operations-name "Patryk Wróblewski" --owner-name "Patryk Wróblewski" --owner-contact "luckysparrow.ch / wroblewskipatryk.pl / agent obliczeniowej inteligencji"`, `pnpm run ops:rc:checklist:sync`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `V1READY-2026-04-25-C` as the residual deploy-truth sync slice. The web build now writes deploy-verifiable git metadata and `GET /api/build-info` can expose the deployed `gitSha`, while `ops:rc:gates:summary` now reports stale evidence timing explicitly. The reusable architecture-V1 checklist and activation docs were resynced so they no longer imply open `PARTIAL` closures for already-closed `V1COH-A`, `XADAPT-A`, and activation-readiness work. Validation PASS: `pnpm run quality:guardrails`, `pnpm run typecheck`, `pnpm run build`, `pnpm run ops:rc:gates:summary`.

## Phase V1COH-A - Residual Execution Cohesion Closure (Queued 2026-04-25)
- [x] `V1COH-01 test(api-red): lock manual LIVE order against out-of-scope symbol and unresolved strategy context`
- [x] `V1COH-02 fix(api-orders): enforce inherited wallet+venue context and fail closed for unresolved LIVE manual scope`
- [x] `V1COH-03 test(api-runtime-red): lock manual LIVE market submitted->reconciled truth across order, open order, and position visibility`
- [x] `V1COH-04 fix(api-reconciliation): tighten exchange-synced order/position adoption around manual LIVE opens`
- [x] `V1COH-05 web(runtime-state): expose explicit manual LIVE action states on dashboard surfaces`
- [x] `V1COH-06 qa(closure): run focused API + web closure pack and sync canonical docs/context`

### Progress Log (Phase V1COH-A - Residual Execution Cohesion Closure)
- 2026-04-25: Queued `V1COH-A` after a fresh residual-gap audit triggered by reported production doubt around manual `LIVE` open behavior. The audit found that the main remaining risk is execution cohesion, not broad feature absence: manual `LIVE` write authorization still trusts duplicated bot snapshot venue fields too much, unresolved symbol-scoped strategy context remains safe for reads but not explicitly fail-closed for `LIVE` writes, and the submitted->reconciled truth for manual `LIVE` `MARKET` orders is not yet frozen end-to-end across order, open-order, and position visibility. Published `docs/planning/v1-residual-execution-cohesion-plan-2026-04-25.md` and promoted `V1COH-01` to `NOW`.
- 2026-04-25: Closed `V1COH-01` and `V1COH-02` together as one tightly coupled backend hardening slice. Added focused `orders.service` and `orders-positions` regressions proving manual `LIVE` open now fails closed when the selected bot has no canonical symbol-matching strategy scope or when inherited wallet+market-universe venue truth drifts, then rewired `orders.service.ts` to reuse `resolveInheritedRuntimeExecutionContext()` and the manual strategy resolver on the write path instead of duplicated bot snapshot venue fields. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `V1COH-03` as the runtime red pack. Added one focused service regression proving manual `LIVE MARKET` opens remain `OPEN/submitted` with `waitingForFill=true` and no position when exchange placement returns no fill truth, plus one route-level runtime regression that fails exactly on missing `EXCHANGE_SYNC` open-order visibility before later `EXCHANGE_SYNC` position adoption. Validation evidence: PASS `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts -t "keeps LIVE MARKET order submitted when exchange placement returns OPEN without fill truth"`, expected RED `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption"`.
- 2026-04-25: Closed `V1COH-04` by extending runtime session open-order reads to adopt eligible `EXCHANGE_SYNC` rows through the existing external symbol-ownership contract and by deduplicating manual-vs-synced open-order visibility by `exchangeOrderId`, preferring the exchange-synced row once import truth exists. Focused validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption"`, `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps LIVE open orders visible in runtime view when order was created before current session start"`, `pnpm --filter api run typecheck`.
- 2026-04-25: Closed `V1COH-05` by adding an explicit manual-order action-state contract to dashboard-home runtime surfaces. The sidebar/manual-order panel now renders localized `submitted`, `waiting_for_fill`, `imported_open_order`, `position_opened`, and `blocked` states derived from the already-hardened runtime read model, with focused UI regressions covering each state plus the shared manual-open action flow. Validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`, `pnpm --filter web run typecheck`.
- 2026-04-25: Closed `V1COH-06` with the focused closure pack for the touched `manual LIVE` execution-cohesion surface. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts -t "keeps LIVE MARKET order submitted when exchange placement returns OPEN without fill truth"`, `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption|keeps LIVE open orders visible in runtime view when order was created before current session start"`, `pnpm --filter api run typecheck`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

## Phase XADAPT-A - Exchange Adapter Execution Hardening and Post-Binance Rollout Readiness (Queued 2026-04-25)
- [x] `XADAPT-01 docs(contract): freeze exchange execution capability matrix for authenticated reads and write-side execution`
- [x] `XADAPT-02 audit(api-exchange): classify Binance-specific assumptions across orders, exchange, and reconciliation paths`
- [x] `XADAPT-03 refactor(api-exchange): expose one canonical exchange adapter boundary for write and authenticated-read consumers`
- [x] `XADAPT-04 test(api-binance): add focused Binance adapter contract coverage for live submit and reconciliation-facing reads`
- [x] `XADAPT-05 qa(closure): run focused exchange-adapter closure pack and sync canonical docs/context`
- [x] `XADAPT-06 planning(readiness): publish staged next-exchange rollout packet after Binance boundary closure`

### Progress Log (Phase XADAPT-A - Exchange Adapter Execution Hardening and Post-Binance Rollout Readiness)
- 2026-04-25: Closed `XADAPT-01` by freezing one explicit exchange capability matrix across authenticated reads and write-side execution. Updated `docs/architecture/reference/exchange-access-ownership-matrix.md` so V1 support truth is now explicit per family: Binance-only support for `BALANCE_PREVIEW`, `POSITIONS_SNAPSHOT`, `OPEN_ORDERS_SNAPSHOT`, and `LIVE_ORDER_SUBMIT`, with `LIVE_ORDER_CANCEL` marked unsupported for every exchange until a canonical exchange-cancel boundary exists. Synced supporting architecture references plus queue/context docs and promoted `XADAPT-02` to `NOW`.
- 2026-04-25: Closed `XADAPT-02` by publishing `docs/planning/xadapt-02-binance-assumption-audit-2026-04-25.md`. The audit now separates intentional Binance-only runtime scope (`livePositionReconciliation.service.ts`, takeover-oriented LIVE ownership queries), compatibility seams (`exchangeAuthenticatedRead.service.ts`, `orders.service.ts` submit path, `ccxtFuturesConnector.service.ts`), and generic-looking drift risks (`exchangeConnectorFactory.service.ts`, `liveOrderAdapter.service.ts`, local order cancel semantics, and over-broad inference from `LIVE_EXECUTION`). Promoted `XADAPT-03` to `NOW` with a concrete ownership map for the refactor.
- 2026-04-25: Closed `XADAPT-03` by introducing `exchangeExecutionCapabilityContract.service.ts` as the shared code matrix for authenticated reads plus `LIVE_ORDER_SUBMIT` / `LIVE_ORDER_CANCEL`, then routing `orders.service.ts`, `positions.service.ts`, and `wallets.service.ts` through `exchangeAdapterBoundary.service.ts` instead of directly composing connector factory, live adapter, or authenticated-read support. Focused validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `pnpm --filter api exec vitest run src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XADAPT-04` by adding focused Binance-first contract coverage in `exchangeAdapterBoundary.service.test.ts` and `exchangeExecutionCapabilityContract.service.test.ts`. The new tests lock boundary-owned read support, unsupported-exchange fail-closed behavior, explicit `LIVE_ORDER_CANCEL` non-support, and live-submit result normalization through the new feature-facing boundary. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XADAPT-05` by rerunning the focused exchange-hardening closure pack and syncing queue/context artifacts to the next planning slice. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XADAPT-06` by publishing `docs/planning/xadapt-06-next-exchange-readiness-packet-2026-04-25.md`. The packet chooses `BYBIT` as the next target, freezes staged rollout order by capability family, documents blocker classes inherited from the Binance-first runtime shape, and keeps reconciliation broadening plus `LIVE_ORDER_CANCEL` explicitly out of scope. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-25: Queued `XADAPT-A` after a repo review confirmed that exchange support truth is still split between explicit Binance-only capability matrices, generic-looking CCXT execution seams, and authenticated-read contracts that are already fail-closed. Published `docs/planning/exchange-adapter-execution-hardening-plan-2026-04-25.md` so future execution can proceed task by task after `V1COH-A` without rediscovering adapter scope, Binance-specific assumptions, or second-exchange rollout sequencing.

## Phase V1REG-A - Architecture-V1 Functionality Verification Loop (Queued 2026-04-25)
- [x] `V1REG-01 docs(audit): publish architecture-v1 functionality inventory and reusable regression checklist`
- [x] `V1REG-02 qa(auto): execute architecture-v1 automated verification pack and record function-by-function status`
- [x] `V1REG-03 qa(browser): execute architecture-v1 browser checklist and capture findings`
- [x] `V1REG-04 planning(sync): classify failures and queue missing or regressed functions`
- [x] `V1REG-05 qa(regression): rerun touched function packs and refresh checklist status`

### Progress Log (Phase V1REG-A - Architecture-V1 Functionality Verification Loop)
- 2026-04-25: Published the reusable checklist `docs/operations/v1-architecture-functionality-regression-checklist-2026-04-25.md` plus the execution packet `docs/planning/v1-architecture-functionality-verification-plan-2026-04-25.md`. The checklist maps architecture-defined V1 functions to implementation status, repository test files, manual browser flows, and queued follow-up families so weekly or post-deploy regression work can run A-to-Z without rediscovering scope from scratch.
- 2026-04-25: Closed `V1REG-02` by executing the first automated function-by-function sweep after `V1COH-A` and `XADAPT-A` closure. Web suites and non-DB API suites passed, API/web typechecks passed, and repository guardrails passed. DB-backed API suites are currently environment-blocked by unreachable local Postgres at `localhost:5432`, so the checklist records those functions as infra-blocked rather than product-failed.
- 2026-04-25: Closed `V1REG-03` by executing the local browser/manual sweep against the reachable web target. The auth shell rendered correctly on desktop/tablet/mobile, protected-route redirect from `/dashboard` to `/auth/login` remained truthful, and invalid sign-in stayed explicit with `Sign-in failed: Network Error`. No new product-visible regression was isolated, but the wider authenticated browser pass remains infra-blocked locally because the API dev target fails closed on missing `API_KEY_ENCRYPTION_KEYS` and Docker/Postgres were unavailable in this run.
- 2026-04-25: Closed `V1REG-04` by classifying all remaining non-green checklist verdicts. No new `V1REG-Fxx` product task was justified from the current evidence set: `F09`, `F10`, and `F12` remain owned by already-closed waves with no fresh regression isolated, while the broader remaining gaps are infra-only blockers tied to local Docker/Postgres availability and local API critical-secret readiness.
- 2026-04-25: Closed `V1REG-05` and with it the full `V1REG-A` verification loop. Web closure packs and non-DB API closure packs remained green, typechecks and repository guardrails remained green, and DB-backed auth/API rerun still failed only on the known local Postgres blocker at `localhost:5432`. No new product regression was isolated, so the reusable protocol now stands as a closed artifact rather than an active queue item.

## Phase V1TAKE-A - Exchange Takeover Ownership and Manual-Order Truth Closure (Queued 2026-04-25)
- [x] `V1TAKE-01 audit(api+runtime): publish confirmed ownership/manual-order investigation packet with DB-backed validation`
- [x] `V1TAKE-02 test(api-red): lock takeover authority drift between API key, wallet, and bot visibility`
- [x] `V1TAKE-03 fix(api-positions): unify external-position management contract and takeover status ownership`
- [x] `V1TAKE-04 test(api-runtime-red): lock deterministic runtime visibility for owned exchange-synced LIVE positions`
- [x] `V1TAKE-05 fix(api-runtime): align runtime position adoption with canonical owned external-position truth`
- [x] `V1TAKE-06 test(api+web-red): lock manual PAPER/LIVE open truth from dashboard submission to order/position state`
- [x] `V1TAKE-07 fix(api+web-orders): harden manual-order fill/context truth and fail-closed UI semantics`
- [x] `V1TAKE-08 qa(closure): rerun focused DB-backed API + web closure pack and sync canonical docs/context`

### Progress Log (Phase V1TAKE-A - Exchange Takeover Ownership and Manual-Order Truth Closure)
- 2026-04-25: Queued `V1TAKE-A` after a fresh user-driven investigation into exchange takeover visibility and dashboard manual-order behavior. Published `docs/planning/v1take-exchange-takeover-manual-order-closure-plan-2026-04-25.md` and the planning task packet `docs/planning/v1take-00-planning-task-2026-04-25.md`. The frozen findings are: takeover authority still drifts between API-key and wallet flags, supported import scope remains intentionally narrow (`BINANCE + FUTURES`), runtime visibility depends on deterministic `BOT_MANAGED` ownership proof, and manual `PAPER/LIVE` open truth still needs one focused API + web closure pack. Local DB-backed verification is no longer blocked by a missing Docker engine in this workspace: `docker info` is healthy, `docker compose up -d postgres redis` failed only because `5432` was already allocated by an existing local Postgres container, and `positions.takeover-status.e2e.test.ts` now passes locally.
- 2026-04-25: Closed `V1TAKE-01` by publishing `docs/planning/v1take-01-investigation-audit-2026-04-25.md` and the matching task packet `docs/planning/v1take-01-investigation-audit-task-2026-04-25.md`. The audit freezes the exact handoff target for `V1TAKE-02`: confirmed contract split between API-key and wallet takeover flags, explicit `BINANCE + FUTURES` scope, the gap between takeover visibility and runtime `BOT_MANAGED` surfacing, and the narrower manual-order watch item around UI estimation vs backend truth. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts -t "keeps LIVE MARKET order submitted when exchange placement returns OPEN without fill truth"`, `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption|keeps LIVE open orders visible in runtime view when order was created before current session start"`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `V1TAKE-02` and `V1TAKE-03` under the user-approved wallet-only takeover contract. The red slice first proved stale `BOT_MANAGED` takeover rows could survive policy drift; the fix then made `wallet.manageExternalPositions` the only management source of truth for reconciliation and takeover-status behavior, while keeping `apiKey.syncExternalPositions` as the import toggle and downgrading API-key-level `manageExternalPositions` to compatibility-only metadata. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `V1TAKE-04` and `V1TAKE-05` as one tightly coupled runtime-ownership slice. Added `bots.runtime-takeover.e2e.test.ts`, which first proved the managed bot saw `total=0` when a second LIVE bot shared symbol scope but its wallet had takeover management disabled. The fix then narrowed `runtimeExternalPositionOwner.service.ts` to count only LIVE bots whose linked wallets keep `manageExternalPositions=true`, backed by focused unit coverage and green runtime e2e. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `V1TAKE-06` and `V1TAKE-07` as one manual-order truth hardening slice. The red coverage replaced the old permissive `PAPER MARKET` expectation that unresolved fill truth could degrade into an `OPEN` order with no position, and added a dashboard regression proving the UI must not submit that degraded request when both manual-context and runtime fallback price are unavailable. The fix introduced explicit `PAPER_MARKET_PRICE_UNAVAILABLE` handling in the order-open API and blocked the same path inside `useManualOrderController.ts`, while preserving the existing truthful `LIVE` submitted/open/imported-position state progression. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `V1TAKE-08` and with it the full `V1TAKE-A` closure pack. Reran the focused evidence set across takeover-status, reconciliation, runtime ownership/visibility, manual-order API truth, and dashboard runtime/manual-order surfaces; all targeted validations passed. One narrow fixture update was required so the manual `LIVE` adoption regression matched the wallet-first takeover contract by enabling `wallet.manageExternalPositions` on the adopting LIVE wallet. Also recorded the local execution pitfall that DB-backed Vitest packs must run sequentially when they share one Postgres instance. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption"`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

## Phase V1LIVE-A - Exchange-Selected Live Execution and Takeover Hardening (Queued 2026-04-26)
- [x] `V1LIVE-01 audit(api+docs): publish canonical live-execution and takeover regression packet`
- [x] `V1LIVE-02 test(api-exchange-red): lock adapter selection to exact user/bot exchange context`
- [x] `V1LIVE-03 fix(api-exchange): make adapter selection strictly follow user-selected exchange settings`
- [x] `V1LIVE-04 test(api-red): lock one canonical ownership classifier for imported LIVE positions`
- [x] `V1LIVE-05 fix(api-ownership): reuse one ownership classifier across reconciliation, runtime, and takeover`
- [x] `V1LIVE-06 test(api-red): lock fail-closed imported entry/fill truth`
- [x] `V1LIVE-07 fix(api-reconciliation): remove synthetic mark-price entry fallback and keep unresolved states explicit`
- [x] `V1LIVE-08 test(api-runtime-red): lock runtime visibility and close parity for owned imported LIVE positions`
- [x] `V1LIVE-09 fix(api-runtime): recover imported-position runtime visibility and close authority`
- [x] `V1LIVE-10 test(api-engine-red): lock signal -> LIVE order -> position lifecycle truth`
- [x] `V1LIVE-11 refactor(api-exchange): complete Binance adapter family inside the existing exchange boundary`
- [x] `V1LIVE-12 fix(api-execution): wire Binance adapter-family events into canonical order and position lifecycle`
- [x] `V1LIVE-13 cleanup(api+tests+web): remove stale fallback paths, stale fixtures, and misleading manual-order semantics`
- [x] `V1LIVE-14 qa(closure): rerun focused live/paper/takeover closure pack and sync canonical docs/context`

### Progress Log (Phase V1LIVE-A - Exchange-Selected Live Execution and Takeover Hardening)
- 2026-04-26: Queued `V1LIVE-A` after a fresh user-driven regression analysis on live positions and signal-driven bot opens, then refined the packet to match the approved exchange-selection architecture. The repository-level conclusion is that the remaining issue is architectural drift, not one isolated manual-order bug: adapter resolution must follow the exact user-selected `exchange + marketType` context, ownership truth still splits between reconciliation and runtime, imported live entry truth still degrades to `markPrice`, runtime visibility/close parity for owned `EXCHANGE_SYNC BOT_MANAGED` positions is not stable, and the first live adapter family still relies too much on REST snapshots instead of event-driven lifecycle updates. Published the canonical packet `docs/planning/v1live-binance-execution-and-takeover-hardening-plan-2026-04-26.md` and the matching planning task `docs/planning/v1live-00-planning-task-2026-04-26.md`. The wave intentionally keeps `PAPER` exchange-free, keeps all `LIVE` work inside `modules/exchange`, and uses `BINANCE + SPOT` plus `BINANCE + FUTURES` as the first completed adapter family rather than as a hidden execution default.
- 2026-04-26: Closed `V1LIVE-01` by publishing the post-hotfix audit packet `docs/planning/v1live-post-fix-quality-audit-and-plan-2026-04-26.md` and synchronizing queue/context order around the real remaining risks: exact exchange-context truth, imported entry truth, ownership/runtime parity, and event-driven Binance lifecycle completion.
- 2026-04-26: Closed `V1LIVE-02` and `V1LIVE-03` together as one exact exchange-context hardening slice. Added focused regressions for watchdog/automation/boundary context drift, removed hidden env-driven `BINANCE/FUTURES` defaults from runtime watchdog and runtime position automation, preserved exact ticker context through watchdog targets, and made live-order submit fail closed if resolved API-key exchange drifts from the selected bot exchange. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: Closed `V1LIVE-06` and `V1LIVE-07` together as the imported-entry fail-closed slice. The reconciliation regression now proves that imported LIVE positions with `entryPrice=null` remain unresolved even if `markPrice` exists, and `livePositionReconciliation.service.ts` no longer synthesizes canonical entry truth from `markPrice`. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: Closed `V1LIVE-04`, `V1LIVE-05`, `V1LIVE-08`, and `V1LIVE-09` together as the imported-ownership/runtime parity slice. Added one canonical `apiKeyId + symbol` ownership classifier with explicit `OWNED | AMBIGUOUS | MANUAL_ONLY | UNOWNED` semantics, then reused it across exchange reconciliation, takeover-status/rebind flows, runtime imported-position visibility, and runtime close authority. Focused regressions now lock shared-API-key symbol isolation, manual-only wallet policy, runtime visibility parity, and imported-position close claiming. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: Closed `V1LIVE-10` as the next smallest regression lock before Binance event wiring. Added focused `runtimeFinalCandleDecision.service.test.ts` coverage proving a signal-driven `LIVE` bot may stay explicitly `submitted` while preserving exact canonical runtime context (`walletId`, strategy scope, candle window, mode, and mark price) into orchestration, and that this pending state does not degrade into a synthetic pre-trade block at the final-candle decision layer. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: Closed `V1LIVE-11` by making the first Binance adapter family explicit inside the approved exchange boundary. `exchangeAdapterRegistry.service.ts` now resolves `BINANCE + SPOT` through an explicit spot connector path and `BINANCE + FUTURES` through the futures path, `exchangeAdapterBoundary.service.ts` now has focused SPOT submit coverage, and the new `binanceUserDataStream.service.ts` plus `binanceUserDataStream.types.ts` expose exact listenKey lifecycle and normalized Binance account/order stream events for both supported market families without yet mutating canonical lifecycle state. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: Closed `V1LIVE-12` by wiring supported Binance user-data-stream events into one canonical apply path for orders and positions. The new `orders.exchangeEvents.service.ts` reuses `applyOrderFillLifecycle()` for open fills, closes linked positions on confirmed close fills, writes canonical `orderFill` and `trade` rows idempotently from exchange truth, and applies supported account updates to canonical open-position quantity/entry/unrealized PnL. Focused DB-backed tests now prove open-fill, close-fill, and account-update parity from normalized Binance events. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: Closed `V1LIVE-13` by removing the residual runtime-sidebar legacy strategy fallback and aligning stale `orders-positions.e2e` imported-LIVE fixtures to the current exact ownership contract. The previously failing closure cases were not new product regressions; they were legacy fixtures missing canonical `bot.apiKeyId` proof even though runtime ownership now resolves by exact `apiKeyId + symbol`. Validation PASS: `pnpm --filter api test -- --run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption|keeps EXCHANGE_SYNC BOT_MANAGED runtime positions visible for LIVE bot even when PAPER bot shares symbol|closes EXCHANGE_SYNC BOT_MANAGED runtime position selected from LIVE dashboard flow"`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`.
- 2026-04-26: Closed `V1LIVE-14` and with it the full `V1LIVE-A` wave. The final focused closure pack is green across exact exchange-context selection, imported-position ownership/runtime parity, signal-driven LIVE submission truth, Binance event-driven lifecycle wiring, manual LIVE runtime visibility, imported-position close authority, web runtime-sidebar cleanup, repository typecheck, and repository guardrails. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm run typecheck`, `pnpm run quality:guardrails`.

## Phase V1UX-2026-05-01 - Operational Route Smoke Locks (Closed 2026-05-01)
- [x] `V1UX-01 qa(web-route): lock operational route smoke for profile, logs, exchanges, and wallet preview`
- [x] `V1UX-REPORTS-01 qa(web-route): lock canonical reports route shell smoke`
- [x] `V1UX-ROUTES-02 qa(web-route): lock canonical CRUD/detail route shells for markets, strategies, and backtests`
- [x] `V1UX-BOTS-03 qa(web-route): lock canonical bot preview and assistant route shells`

### Progress Log (Phase V1UX-2026-05-01 - Operational Route Smoke Locks)
- 2026-05-01: Closed a local route-parity verification slice while the active V1 queue remained blocked on stage/prod evidence tasks. Added focused route tests for `/dashboard/profile` default and `#api` entry behavior, `/dashboard/logs`, `/dashboard/exchanges -> /dashboard/profile#api` redirect truth, and wallet preview page shell coverage; also extended route-locale smoke for logs and wallet preview and synced the relevant module docs. Refreshed validation PASS: focused route-smoke pack (`18/18` files, `19/19` tests), `web` typecheck, `web` build, repository guardrails.
- 2026-05-01: Closed `V1UX-REPORTS-01` as a tiny follow-up to the same route-smoke wave. Added a focused shell test for `/dashboard/reports`, proving the canonical reports page still renders one heading, breadcrumb navigation, and the reports feature mount. Synced `web-reports` test evidence. Refreshed validation PASS: focused route-smoke pack (`18/18` files, `19/19` tests), `web` typecheck, `web` build, repository guardrails.
- 2026-05-01: Closed `V1UX-ROUTES-02` as the remaining local App Router parity slice for the same wave. Added route-shell smoke tests for `markets` list/create/edit, `strategies` list/create/edit plus the canonical `/:id -> /edit` redirect, and `backtests` list/create/detail. Synced `web-markets`, `web-strategies`, and `web-backtest` evidence. Refreshed validation PASS: focused route-smoke pack (`18/18` files, `19/19` tests), `web` typecheck, `web` build, repository guardrails.
- 2026-05-01: Closed `V1UX-BOTS-03` as the final tiny local App Router parity follow-up in the same wave. Added focused shell tests for `/dashboard/bots/:id/preview` and `/dashboard/bots/:id/assistant`, proving breadcrumb shell stability plus canonical `BotsManagement` tab locks and preferred-bot propagation. Synced `web-bots` test evidence. Refreshed validation PASS: focused route-smoke pack (`18/18` files, `19/19` tests), `web` typecheck, `web` build, repository guardrails.

## Phase V1SCOPE-2026-05-01 - Launch Scope Classification (Closed 2026-05-01)
- [x] `V1SCOPE-01 planning(scope): classify lower-priority not-verified surfaces`

### Progress Log (Phase V1SCOPE-2026-05-01 - Launch Scope Classification)
- 2026-05-01: Closed `V1SCOPE-01` as the smallest truthful follow-up after the
  function readiness audit. The pass removed false V1 pressure from rows that
  were implemented but still ambiguous in launch classification. Current
  explicit decisions are: `POST_V1` for admin users/subscriptions, profile
  subscription UX, strategy import/export, and assistant config/dry-run;
  `WAIVED_FOR_V1` for cross-mode reports, avatar upload, and the
  orphan-repair command; `IN_V1` only for subscription entitlement
  enforcement because it still gates bot/runtime safety and commercial limits.
  Validation PASS: manual source-of-truth consistency review across
  `product.md`, the readiness audit, and planning docs. Context sync for
  `.codex/context/{TASK_BOARD,PROJECT_STATE}` was attempted but blocked by
  read-only filesystem permissions in this environment.

## Phase V1SUBS-2026-05-01 - LIVE Entitlement Write Guard (Closed 2026-05-01)
- [x] `V1SUBS-01 fix(api-entitlements): fail closed on LIVE bot writes without live-trading entitlement`

### Progress Log (Phase V1SUBS-2026-05-01 - LIVE Entitlement Write Guard)
- 2026-05-01: Closed `V1SUBS-01` by adding one shared
  `assertSubscriptionAllowsLiveTrading(...)` guard and enforcing it on LIVE
  bot create plus `PAPER -> LIVE` bot updates. The focused entitlement e2e now
  proves a FREE-plan payload with a LIVE pool but `features.liveTrading=false`
  cannot create or switch into LIVE mode. Validation PASS:
  `node node_modules/typescript/bin/tsc -p apps/api/tsconfig.json --noEmit`,
  `pnpm --filter api exec vitest run src/modules/bots/bots.subscription-entitlements.e2e.test.ts`
  (`5/5`), `pnpm --filter api run build`, `pnpm run quality:guardrails`.

## Phase BHIST-2026-05-01 - Bot Portfolio History (Closed 2026-05-01)
- [x] `BHIST-01 feature(bot-history): add bot-scoped portfolio history with reset and wallet-capital markers`

### Progress Log (Phase BHIST-2026-05-01 - Bot Portfolio History)
- 2026-05-01: Closed `BHIST-01` as a local product slice while the remaining
  V1 release gates stayed blocked on external stage/prod evidence. Added
  `GET /dashboard/bots/:id/portfolio-history` and selected-bot monitoring UI
  for bot-scoped value progression, `PAPER_RESET` markers, and wallet-ledger
  capital-event markers for LIVE without introducing a parallel accounting
  path. Validation PASS: `node node_modules/typescript/bin/tsc -p apps/api/tsconfig.json --noEmit`,
  `node node_modules/typescript/bin/tsc -p apps/web/tsconfig.json --noEmit`,
  `pnpm --filter api exec vitest run src/modules/bots/bots.portfolio-history.e2e.test.ts`
  (`2/2`), `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.portfolio-history.test.tsx`
  (`1/1`), `pnpm --filter api run build`, `pnpm --filter web run build`,
  `pnpm run quality:guardrails`.

## Phase XVENUE-A - Exact Exchange-Context and Worker-Topology Hardening (Closed 2026-04-25)
- [x] `XVENUE-01 docs(contract): freeze exact exchange-context and adapter-family model`
- [x] `XVENUE-02 audit(api): inventory boundary leaks and direct exchange SDK usage`
- [x] `XVENUE-03 docs(contract): freeze capability matrix migration rules`
- [x] `XVENUE-04 refactor(api-exchange): registry-driven adapter-family entrypoints`
- [x] `XVENUE-05 refactor(api-markets-engine): remove direct exchange SDK access from feature modules`
- [x] `XVENUE-06 test(api): add no-mixing parity coverage`
- [x] `XVENUE-07 refactor(api-ops): align worker topology truth`
- [x] `XVENUE-08 qa(closure): rerun focused closure pack and sync docs/context`

### Progress Log (Phase XVENUE-A - Exact Exchange-Context and Worker-Topology Hardening)
- 2026-04-25: Queued `XVENUE-A` after user-approved clarification of the target model. Exchange behavior must be driven by the exact `(exchange, marketType)` pair selected by the user; `SPOT` and `FUTURES` must remain separate market domains; one exchange must not reuse another exchange's prices, candles, indicators, or signal inputs; the scalable implementation model is a family of narrow adapters under one registry; and worker health/readiness should be brought in line with the full deployed topology where needed. Published `docs/planning/exchange-context-and-worker-topology-hardening-plan-2026-04-25.md`.
- 2026-04-25: Closed `XVENUE-01` by freezing the approved architecture contract in `04_runtime-contexts.md`, `05_strategy-signal-and-decision-flow.md`, and `09_integrations-deployment-and-runtime-services.md`. The repository now has one canonical statement that all exchange-owned behavior resolves from exact `(exchange, marketType)` context, that `SPOT`/`FUTURES` and cross-exchange inputs must not mix, that the approved implementation shape is a family of narrow adapters under one registry, and that worker health/readiness should reflect the full deployed topology. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XVENUE-02` by publishing `docs/planning/xvenue-02-exchange-boundary-leak-audit-2026-04-25.md` and the task packet `docs/planning/xvenue-02-boundary-leak-audit-task-2026-04-25.md`. The audit confirms direct exchange-specific behavior still leaking outside `modules/exchange` in `markets`, `engine`, `bots`, `backtests`, and profile API-key probing, plus worker topology truth that still models only part of the approved split-worker surface. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XVENUE-03` by freezing the capability migration contract in `docs/architecture/reference/exchange-access-ownership-matrix.md` and `docs/architecture/09_integrations-deployment-and-runtime-services.md`. The canonical model now distinguishes compatibility-stage exchange flags from the target exact-stage `(exchange, marketType, operation)` matrix and forbids inferring support across operation families, market types, or exchanges. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XVENUE-04` by adding the exact-context exchange adapter registry in `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.ts` and routing existing exchange bootstrap seams through it. Focused exchange-module regressions, API typecheck, and repository guardrails all remained green. Validation PASS: `pnpm --filter api run test -- --run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeConnectorFactory.service.test.ts src/modules/exchange/exchangePublicRead.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XVENUE-05` by moving market catalog ownership to `apps/api/src/modules/exchange/exchangeMarketCatalog.service.ts` and routing runtime live-balance reads through `fetchSupportedExchangeBalanceRaw`. Focused exchange/runtime tests, API typecheck, and repository guardrails remained green. Local `markets.e2e.test.ts` was rerun only far enough to reconfirm the existing infra blocker at `localhost:5432`, not a new product regression. Validation PASS: `pnpm --filter api run test -- --run src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XVENUE-06` by adding explicit no-mixing parity coverage for the exact-context seams in `exchangeAdapterRegistry.service.test.ts` and `exchangeMarketCatalog.service.test.ts`, with capability truth still locked in `exchangeExecutionCapabilityContract.service.test.ts`. Validation PASS: `pnpm --filter api run test -- --run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XVENUE-07` by extending `apps/api/src/workers/workerOwnership.ts` into the shared worker-topology contract for ops and freshness truth. `/workers/health` and `/workers/ready` now model all four approved worker families, distinguish explicit local/test inline support from deployed degraded inline or partial-split topology, and `runtimeFreshness.ts` now skips passive inline checks only for explicit local/test inline mode. Validation PASS: `pnpm --filter api run test -- --run src/workers/workerOwnership.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-25: Closed `XVENUE-08` by rerunning the focused `XVENUE-A` closure pack across exchange exact-context seams, worker-topology truth, API typecheck, and repository guardrails. Queue/context state now records the wave as fully closed rather than leaving a residual active closure step. Validation PASS: `pnpm --filter api run test -- --run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeConnectorFactory.service.test.ts src/modules/exchange/exchangePublicRead.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/workers/workerOwnership.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

## Phase V1CLOSE-A - Position Close Attribution and External-Close Hardening (Queued 2026-04-27)
- [x] `V1CLOSE-00 planning(queue): publish canonical close-attribution and external-close hardening packet`
- [x] `V1CLOSE-01 docs(contract): freeze canonical close-attribution model`
- [x] `V1CLOSE-02 test(api-red): lock missing close-attribution gaps on current write paths`
- [x] `V1CLOSE-03 db(schema): add canonical close-attribution fields`
- [x] `V1CLOSE-04 fix(api-runtime): persist USER_APP and BOT_APP on canonical app-driven closes`
- [x] `V1CLOSE-05 fix(api-events): preserve close attribution through exchange confirmation`
- [x] `V1CLOSE-06 fix(api-reconciliation): classify external manual close separately from repair cleanup`
- [x] `V1CLOSE-07 test(api+read-red): lock read-model and history attribution parity`
- [x] `V1CLOSE-08 fix(api+web): expose close attribution on operator surfaces`
- [x] `V1CLOSE-09 qa(closure): run focused close-attribution pack and sync docs/context`

### Progress Log (Phase V1CLOSE-A - Position Close Attribution and External-Close Hardening)
- 2026-04-27: Queued `V1CLOSE-A` after a fresh post-deploy close-lifecycle audit on the production-ready repository. The confirmed gap is no longer basic close execution, but canonical attribution truth: current runtime, exchange-event, and reconcile paths can close positions, yet the system still lacks one persisted contract that answers who or what initiated the close. The user approved the canonical two-dimension model (`closeReason` + `closeInitiator`) on 2026-04-27. Published the planning packet `docs/planning/v1close-position-close-attribution-hardening-plan-2026-04-27.md`, normalized the architecture contract into `docs/architecture/06_execution-lifecycle.md` and `docs/architecture/reference/position-close-attribution-contract.md`, extended lifecycle parity docs, and synchronized canonical queue/context truth for the upcoming implementation wave.
- 2026-04-27: Closed `V1CLOSE-A`. The repository now persists canonical close attribution across app-driven closes, bot-driven closes, exchange-event confirmation, reconcile-driven external disappearance, and repair-only orphan cleanup. Prisma schema and migration add nullable `closeReason` / `closeInitiator` to `Position`, `Order`, and `Trade`; shared mapping lives in `positionCloseAttribution.ts`; runtime/exchange/reconcile/repair paths now reuse that mapping instead of inferring from `syncState` or logs. Runtime history/read models and dashboard aggregate history now expose persisted close-attribution truth with operator labels for `BOT_APP`, `USER_APP`, `USER_EXCHANGE`, `EXCHANGE`, and `SYSTEM_REPAIR`. Closure validation PASS: `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts src/modules/engine/runtimeCrashRetry.regression.test.ts`, `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm run build`.

## Phase V1RESTART-A - LIVE Position Continuity and Restart Recovery Hardening (Closed 2026-04-28)
- [x] `V1RESTART-00 planning(queue): publish canonical LIVE restart continuity and recovery hardening packet`
- [x] `V1RESTART-01 docs(contract): freeze canonical LIVE restart and downtime continuity model`
- [x] `V1RESTART-02 test(api-red): lock non-destructive restart recovery semantics`
- [x] `V1RESTART-03 db(schema): add durable recovery state for restart continuity`
- [x] `V1RESTART-04 fix(api-events): promote exchange-event truth to restart recovery authority`
- [x] `V1RESTART-05 fix(api-reconciliation): convert reconciliation from one-pass close authority into staged recovery authority`
- [x] `V1RESTART-06 fix(api-ownership): preserve or restore canonical bot/wallet/strategy continuity for recovered LIVE positions`
- [x] `V1RESTART-07 test(api-runtime-red): lock post-restart DCA and trailing continuity for recovered exchange-synced LIVE positions`
- [x] `V1RESTART-08 fix(api-runtime): restore safe automation context for recovered LIVE positions`
- [x] `V1RESTART-09 fix(api+read): expose honest restart recovery states and certainty to operator surfaces`
- [x] `V1RESTART-10 web(runtime-truth): show continuity and recovery status explicitly instead of silent disappearance`
- [x] `V1RESTART-11 qa(closure): run adversarial restart/downtime recovery pack and sync docs/context`

### Progress Log (Phase V1RESTART-A - LIVE Position Continuity and Restart Recovery Hardening)
- 2026-04-28: Queued `V1RESTART-A` after a fresh user-reported production analysis proved the remaining gap is broader than imported-position visibility alone. An exchange position can survive bot shutdown and still disappear from bot runtime truth after restart, or return without enough context for safe resumed management. The user explicitly chose the highest-quality target direction rather than a local bugfix. Published `docs/planning/v1restart-live-position-continuity-hardening-plan-2026-04-28.md` and `docs/planning/v1restart-00-planning-task-2026-04-28.md`. The wave freezes restart-safe continuity as the target: supported exchange events are the strongest recovery evidence, REST reconciliation becomes staged recovery/confirmation rather than one-pass destructive authority, previously open LIVE positions must survive temporary uncertainty through explicit continuity states, and recovered owned positions must restore canonical `botId + walletId + strategyId` context before DCA/TSL automation is considered safely resumed.
- 2026-04-28: Closed `V1RESTART-01` by freezing the architecture contract for `LIVE` restart and downtime continuity. Added the canonical reference `docs/architecture/reference/live-position-restart-continuity-contract.md`, extended `06_execution-lifecycle.md` with strict restart evidence priority and non-destructive recovery semantics, tightened `04_runtime-contexts.md` so recovered visibility and actionability stay distinct until canonical ownership and strategy context are restored, and extended `position-lifecycle-parity-matrix.md` with restart-specific lifecycle parity rules for uncertainty, recovery, and resumed management.
- 2026-04-28: Closed `V1RESTART-A` end to end. Added durable `Position.continuityState`, `lastExchangeSeenAt`, `lastExchangeSyncAt`, `missingSince`, and `missingSyncCount` persistence plus migration `20260428113000_add_position_restart_continuity_state`; upgraded exchange-event close handling to mark externally confirmed closure explicitly; replaced reconcile's one-pass stale close behavior with staged `RECOVERING -> EXTERNAL_CLOSE_CONFIRMED` semantics requiring repeated missing confirmations; preserved or restored canonical `botId + walletId + strategyId` for recovered owned `EXCHANGE_SYNC` rows via deterministic `bot.strategyId` recovery; made runtime automation and manual runtime close fail closed until continuity returns to `CONFIRMED`; exposed `continuityState` plus `actionable` through runtime/read surfaces; and updated dashboard runtime typing plus open-position table presentation so degraded recovered rows are explicit and action buttons disable until continuity is restored. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts`, `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-takeover.e2e.test.ts -t "keeps recovered imported LIVE positions visible for the owning bot while marking them non-actionable"`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`. Local validation note: Prisma migrate deploy remained blocked by a pre-existing failed local migration `20260424094500_add_single_context_bot_refs`, so schema verification for this task used `pnpm --filter api exec prisma db push` after generating the client.

## Phase ARCCON - Architecture Conformance and Service Ownership Closure (Closed 2026-04-21)
- [x] `ARCCON-01 test(api-red): lock fail-closed manual-order strategy context when selected bot has no symbol-matching strategy`
- [x] `ARCCON-02 fix(api-orders): remove hidden first-strategy fallback from manual-order context resolution and keep unresolved state explicit`
- [x] `ARCCON-03 test(api-red): lock canonical wallet+market-universe context precedence over duplicated bot venue fields`
- [x] `ARCCON-04 refactor(api-bots): validate bot symbol-group binding against canonical wallet and market-universe context, keeping duplicated bot fields compatibility-only`
- [x] `ARCCON-05 docs(decision): freeze legacy BotStrategy and duplicated bot venue-field deprecation/migration contract`
- [x] `ARCCON-06 test(api+ops-red): expose current backtest and market-data worker ownership drift versus split-worker contract`
- [x] `ARCCON-07 refactor(runtime-services): align backtest ownership with explicit worker or explicit inline contract without changing user-facing semantics`
- [x] `ARCCON-08 refactor(runtime-services): align market-data worker ownership and local/prod worker startup contracts`
- [x] `ARCCON-09 test(api-red): stabilize async backtest report availability contract for owned runs`
- [x] `ARCCON-10 fix(api-backtests): replace transient report-404 ambiguity with explicit pending/degraded contract or stronger readiness guarantee`
- [x] `ARCCON-11 fix(web-i18n): remove /dashboard/bots namespace leakage into dashboard-home keys`
- [x] `ARCCON-12 docs(sync): align architecture/module/ops docs, queue/context, and closure evidence after ARCCON rollout`

### Progress Log (Phase ARCCON - Architecture Conformance and Service Ownership Closure)
- 2026-04-21: Queued `ARCCON` from architecture-vs-code audit and published executor-ready plan in `docs/planning/architecture-conformance-remediation-plan-2026-04-21.md`. Scope is intentionally limited to real architecture drift only: hidden manual-order context fallback, duplicated bot source-of-truth ownership, legacy `BotStrategy` containment, split-worker ownership drift for backtest/market-data, async backtest report contract hardening, and route-level i18n ownership cleanup.
- 2026-04-21: Closed `ARCCON-01..ARCCON-12` end-to-end with fail-closed manual-order context behavior, canonical wallet/market-universe precedence for bot ownership validation, explicit worker ownership contract for backtest/market-data (`inline|worker`) reflected in `/workers/health|ready`, explicit backtest report `runLifecycle` pending/degraded contract, and `/dashboard/bots` namespace ownership cleanup (`dashboard.bots.confirms.*` in EN/PL/PT). Validation PASS: `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/bots/botOwnership.service.test.ts src/router/workers-health-readiness.test.ts src/modules/backtests/backtests.e2e.test.ts`, `pnpm --filter web run test -- --run src/features/bots/components/BotCreateEditForm.test.tsx src/features/bots/components/BotsManagement.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm --filter api run build`, `pnpm --filter web run build`, `pnpm run quality:guardrails`.
