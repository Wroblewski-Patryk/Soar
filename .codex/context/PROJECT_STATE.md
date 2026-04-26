# PROJECT_STATE

Last updated: 2026-04-26

## Product Snapshot
- Name: CryptoSparrow / Soar
- Goal: deliver a crypto-trading operations platform with backtest, paper, and
  live execution support, operator dashboards, and a path toward assistant or
  agent-driven workflows
- Commercial model: SaaS-style subscription product with staged entitlements
- Current phase: V1 is approved from the current repository evidence set, with
  engineering scope complete and activation artifacts canonically reconciled
  after the closed `V1READY-2026-04-25-A/B` refresh. Active focus has shifted
  from broad V1 feature delivery to post-V1 hardening, reusable regression
  verification, and scalable exchange/runtime architecture work after the
  closed `V1CONF-A`, `V1SIG-A`, `V1CAP-A`, `V1ALIGN-A`, and fully closed
  `V1BOT-A` migration wave. The current repository truth is that the
  deployed worker contract is frozen to `split`, runtime symbol scope and
  signal interval truth now fail closed and persist honestly, runtime
  freshness authority is scoped to active sessions, operator diagnostics are
  more explicit about degraded routing/runtime-input outcomes, and the
  approved singular bot architecture is now implemented as canonical
  production truth: `1 bot = 1 wallet + 1 symbol-group market scope + 1
  strategy`. Runtime and operator surfaces now consume inherited context from
  wallet, symbol-group market scope, and strategy modules instead of
  reconstructing canonical truth from legacy topology. The newest production
  hardening slices (`V1BOT-07B`, `V1BOT-09`, `V1DASH-A`, `V1BOTSURF-A`,
  `V1SURF-A`) additionally proved and fixed a critical PAPER capital-authority
  drift where wallet-scoped historical paper lifecycle rows could inflate the
  selected bot runtime capital and sizing; `LIVE` remains wallet-authoritative
  from authenticated exchange balance, while `PAPER` runtime/dashboard capital
  is now bot-scoped under the linked wallet. Manual-order execution is
  singular-context-aware for both backend context resolution and dashboard
  symbol sourcing, `PAPER` market orders can fill immediately without an
  explicit request price, selected-bot dashboard KPIs prefer authoritative
  runtime capital summary fields, and bot monitoring/list/detail surfaces
  expose the same runtime capital/state truth instead of mixing config
  baseline with active runtime semantics. `V1IND-A` is now also closed:
  architecture freezes one canonical indicator registry scope,
  strategy-builder metadata is served from that registry, runtime and operator
  signal surfaces reuse the shared indicator analysis kernel, and configured
  market snapshots no longer depend on the old subset formatter that emitted
  opaque `X` placeholders. Full web validation, build, and focused API parity
  packs are green for the indicator wave. `V1POSTBOT-A` is now also closed:
  the remaining red full-API cases were resolved by aligning stale
  `backtests/orders` e2e fixtures to the canonical singular bot contract,
  which restored full `api` suite parity for pre-trade expectations,
  deterministic selected-bot order ownership, carryover open orders, and
  `EXCHANGE_SYNC BOT_MANAGED` LIVE runtime position visibility/close flows.
  Fresh analysis on 2026-04-26, however, proved that the repository still has
  residual live-execution drift beyond the already closed `V1TAKE-A` packet:
  ownership truth still differs between reconciliation and runtime,
  imported-position entry truth can still degrade to `markPrice`, runtime close
  parity for owned imported `LIVE` positions is not yet stable in focused
  DB-backed tests, and Binance Futures lifecycle truth still relies mainly on
  REST snapshots instead of exchange-boundary event handling. The next active
  user-approved scope is therefore `V1LIVE-A`, a Binance Futures hardening wave
  that keeps `PAPER` exchange-free, keeps all `LIVE` work inside the approved
  exchange boundary, and closes the full path `signal -> order -> exchange
  update -> position -> takeover/runtime visibility` under one canonical
  contract. The newest post-V1 production hotfix slice
  (`V1FIX-2026-04-26-A`) additionally recovers manual order open lifecycle
  truth when a same-symbol open position already exists: manual same-direction
  fills now update and link the existing open position instead of crashing on
  the historical partial unique open-position index, while reverse-direction
  opens fail closed with an explicit domain error instead of a raw `500`.

## Product Decisions (Confirmed)
- 2026-04-26: queued `V1LIVE-A` as the next canonical post-V1 hardening wave after a fresh audit of the user-reported live-position and signal-open issues. The frozen repository truth is now explicit: `PAPER` must remain exchange-free, `LIVE` must stay inside the approved exchange boundary, imported-position ownership must be decided by one canonical classifier reused across reconciliation/runtime/takeover flows, imported live entry truth must not fall back to `markPrice`, and reliable Binance Futures lifecycle handling now requires user-data-stream support (`ACCOUNT_UPDATE`, `ORDER_TRADE_UPDATE`) instead of depending mainly on REST snapshots plus polling reconciliation. Canonical artifacts: `docs/planning/v1live-binance-execution-and-takeover-hardening-plan-2026-04-26.md` and `docs/planning/v1live-00-planning-task-2026-04-26.md`.
- 2026-04-26: closed `V1FIX-2026-04-26-A` after reproducing the production manual-order `500` directly in `soar-api`. The root cause was a real lifecycle gap, not a web issue: `applyOrderFillLifecycle()` still tried to create a second `OPEN` position for the same user and symbol even though the canonical lifecycle contract and production DB index still enforce one open position per symbol. Same-direction manual fills now reuse/update the existing position with weighted entry repricing, and reverse-direction opens fail closed with explicit `OPEN_POSITION_SIDE_CONFLICT` API semantics. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: queued and implemented the first closure slice of `V1FIX-2026-04-26-B` after browser-level production repro on the real user account exposed a deeper source of truth problem: authenticated Binance Futures snapshot still returns the real external position, but legacy local `OPEN` rows with `botId=null` were surviving from older topology waves and silently blocking both manual-order reuse and exchange takeover/runtime projection. The repository now has an explicit authenticated repair endpoint `POST /dashboard/positions/orphan-repair` that rebinds local open rows only when canonical bot proof exists, closes only fully detached local open orphans, then forces exchange reconciliation + takeover rebind so current exchange truth can re-enter the canonical runtime path. Validation PASS: `pnpm --filter api test -- --run src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`. Remaining work is operational: deploy to prod, run repair on the affected account, and re-check dashboard/manual-order/takeover behavior live.
- 2026-04-25: closed `V1COH-07` as the final manual-LIVE action-state semantics cleanup on dashboard-home. The runtime sidebar no longer mislabels a valid pre-submit manual `LIVE` context as `blocked`; it now exposes one explicit `ready` state, while `blocked` remains reserved for missing selected bot, unavailable exchange capability, unresolved symbol, or empty symbol scope. Validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`.
- 2026-04-25: closed `V1UX-01`, `V1UX-02`, and `V1UX-03` together as the selected-bot manual-order UX polish slice after fresh production feedback. The dashboard sidebar now auto-fills `Price` from the canonical market reference on first symbol hydrate, re-applies that reference when symbol context changes, adds a quote-budget input under the qty slider with wallet free-funds fail-closed behavior, and removes the summary/lifecycle/action-state helper noise so only `order type`, `margin mode`, and `leverage` remain in the static context block. Validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm --filter web run build`.
- 2026-04-25: closed `V1DEPLOY-2026-04-25-B` as the final deployed-commit proof hardening slice for `soar-web`. `GET /api/build-info` now falls back to runtime env commit/branch hints when file metadata is absent, `scripts/writeWebBuildMetadata.mjs` still prefers `SOURCE_COMMIT` / `SOURCE_BRANCH` during build, and the Coolify web-service runbook now freezes the required production wiring: declare `SOURCE_COMMIT=$SOURCE_COMMIT`, declare `SOURCE_BRANCH=$COOLIFY_BRANCH`, and enable `Include Source Commit in Build` for the web app. Validation PASS: `pnpm --filter web run build`, `docker build -f apps/web/Dockerfile -t soar-web-gitsha-fix .`.
- 2026-04-25: closed `V1DEPLOY-2026-04-25-A` as the production web-image parity fix after the deploy-truth hardening slice. The production `apps/web/Dockerfile` now copies the repository `scripts/` directory into the build stage, preserving the approved web build contract `node ../../scripts/writeWebBuildMetadata.mjs && next build` inside Coolify. Validation PASS: `pnpm --filter web run build`, `docker build -f apps/web/Dockerfile -t soar-web-localfix .`.
- 2026-04-25: closed `V1TAKE-09` as the wallet-single-switch UI cleanup
  slice. The web UI now exposes exactly one editable takeover-management
  switch on the wallet form, while the API key form no longer renders the
  legacy import/manage toggles or the derived bot-takeover helper list. To
  keep backend compatibility stable, API-key form submit remains explicit
  about `syncExternalPositions=true` and
  `manageExternalPositions=false`, but takeover-management editing is now
  wallet-only in the operator UI. Validation PASS:
  `pnpm --filter web exec vitest run src/features/profile/components/ApiKeyForm.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletsListTable.test.tsx`,
  `pnpm --filter web run typecheck`,
  `pnpm run quality:guardrails`.
- 2026-04-25: closed `V1READY-2026-04-25-C` as the residual deploy-truth and artifact-sync slice after final V1 approval. The web build now writes deploy-verifiable git metadata into `.next/BUILD_META.json`, `GET /api/build-info` can expose `gitSha`/`gitRef` for the deployed web target, `ops:rc:gates:summary` now makes stale evidence timing explicit instead of silently presenting old evidence as current, and the reusable architecture-V1 checklist no longer labels already-closed `V1COH-A`, `XADAPT-A`, or `V1READY-2026-04-25-A` work as active `PARTIAL` closures. Validation PASS: `pnpm run quality:guardrails`, `pnpm run typecheck`, `pnpm run build`, `pnpm run ops:rc:gates:summary`.
- 2026-04-25: closed `V1TAKE-08` and with it the full `V1TAKE-A` wave. Final
  closure evidence is green across takeover-status, reconciliation, runtime
  ownership/visibility, and manual-order API + dashboard truth. One local
  execution guardrail was confirmed during closure: DB-backed Vitest packs
  must run sequentially against the shared local Postgres instance to avoid
  cross-test interference. Validation PASS: the focused `V1TAKE-A` closure
  pack plus `api/web` typechecks and repository guardrails.
- 2026-04-25: closed `V1TAKE-06` and `V1TAKE-07` by hardening manual-order
  fill truth across both API and dashboard UI. `PAPER MARKET` opens now fail
  closed when canonical fill price cannot be proven, the API surfaces an
  explicit `PAPER_MARKET_PRICE_UNAVAILABLE` error, and the dashboard manual
  order controller blocks the same degraded submit path before calling the
  shared order endpoint. Validation PASS: `orders.service.test.ts`,
  `orders.manual-paper-market.e2e.test.ts`,
  `HomeLiveWidgets.manual-order.test.tsx`,
  `pnpm --filter api run typecheck`,
  `pnpm --filter web run typecheck`,
  `pnpm run quality:guardrails`.
- 2026-04-25: closed `V1TAKE-04` and `V1TAKE-05` by carrying the user-approved
  wallet-first takeover contract into runtime ownership resolution. Canonical
  bot runtime visibility for imported LIVE positions now excludes competing
  bots whose linked wallets disable external-position management, which
  prevents false ambiguity when symbol scope overlaps. Validation PASS:
  `runtimeExternalPositionOwner.service.test.ts`,
  `bots.runtime-takeover.e2e.test.ts`,
  `pnpm --filter api run typecheck`,
  `pnpm run quality:guardrails`.
- 2026-04-25: closed `V1TAKE-02` and `V1TAKE-03` under one user-approved
  wallet-first ownership decision for exchange takeover. Canonical management
  truth is now explicit: `wallet.manageExternalPositions` is the only
  management source of truth for takeover-related API behavior, while
  `apiKey.syncExternalPositions` remains the import toggle and API-key-level
  `manageExternalPositions` is compatibility-only metadata. The backend now
  ignores API-key management during reconciliation and fails closed in
  takeover-status reads when a stale `BOT_MANAGED` row is linked to a wallet
  that no longer allows external-position management. Validation PASS:
  `positions.takeover-status.e2e.test.ts`,
  `livePositionReconciliation.service.test.ts`,
  `pnpm --filter api run typecheck`,
  `pnpm run quality:guardrails`.
- 2026-04-25: closed `V1TAKE-01` by publishing the concrete investigation
  packet `docs/planning/v1take-01-investigation-audit-2026-04-25.md` plus the
  task packet `docs/planning/v1take-01-investigation-audit-task-2026-04-25.md`.
  The repository now has one explicit handoff for the next red-test slice:
  takeover authority is confirmed to drift between API-key and wallet flags,
  the supported import boundary remains intentionally `BINANCE + FUTURES`,
  imported position visibility still depends on deterministic `BOT_MANAGED`
  ownership proof, and the remaining manual-order issue is now narrowed to a
  watch item around UI estimation versus backend lifecycle truth. Focused
  takeover/manual-order DB-backed verification is green in the current local
  workspace.
- 2026-04-25: queued `V1TAKE-A` as the next post-V1 hardening wave after a
  fresh live-position/manual-order investigation driven by user-reported
  runtime symptoms. The confirmed findings are now explicit: takeover
  authority still drifts between API-key and wallet flags, supported import
  scope remains intentionally narrow (`BINANCE + FUTURES`), bot runtime
  visibility still depends on deterministic `BOT_MANAGED` ownership proof, and
  manual `PAPER/LIVE` open truth still needs one tighter API + web closure
  pack. Canonical artifacts:
  `docs/planning/v1take-exchange-takeover-manual-order-closure-plan-2026-04-25.md`
  and `docs/planning/v1take-00-planning-task-2026-04-25.md`.
- 2026-04-25: local Docker validation for DB-backed API work is no longer
  engine-blocked in the current workspace. `docker info` now reports a healthy
  Docker Desktop server, compose start failed only because `localhost:5432`
  was already allocated by an existing local Postgres container, and focused
  DB-backed verification now passes again for
  `src/modules/positions/positions.takeover-status.e2e.test.ts`. The Docker
  recovery guardrail and port-collision handling were synced into
  `.codex/context/LEARNING_JOURNAL.md` and
  `docs/engineering/local-development.md`.
- 2026-04-25: published a reusable V1 architecture functionality checklist and
  verification loop. Canonical artifact:
  `docs/operations/v1-architecture-functionality-regression-checklist-2026-04-25.md`.
  It maps architecture-defined V1 functions to current implementation status,
  automated test files, manual browser flows, and follow-up task families, so
  future weekly or post-deploy regression work can execute function-by-function
  without re-auditing the architecture set from scratch.
- 2026-04-25: queued `XADAPT-A` as the next post-`V1COH-A` engineering wave for exchange-boundary hardening. The approved direction is not to add a second exchange immediately, but to first freeze one truthful capability matrix for authenticated reads and write-side execution, classify residual Binance-specific assumptions behind generic-looking APIs, lock Binance against a focused adapter contract pack, and only then publish a staged next-exchange rollout packet.
- 2026-04-25: queued `V1COH-A` after a fresh residual execution audit driven by
  reported doubt around manual `LIVE` opens. The current highest-priority gap
  is now execution cohesion rather than a missing feature wave: manual `LIVE`
  write authorization still needs a stricter fail-closed contract for
  canonical symbol scope, inherited venue context, and submitted->reconciled
  operator truth across orders, exchange-synced open orders, and positions.
- 2026-04-25: closed `V1COH-01` and `V1COH-02` as the first residual execution
  cohesion hardening slice. Manual `LIVE` open now reuses inherited
  wallet+market-universe execution truth on the write path and rejects
  unresolved symbol scope with explicit domain errors instead of relying on
  duplicated bot snapshot venue fields. Focused `orders.service` and
  route-level regressions now lock both the fail-closed cases and valid scoped
  `LIVE` fixtures under the canonical singular bot contract.
- 2026-04-25: closed `V1COH-03` as the red runtime-truth lock for manual
  `LIVE MARKET` submitted->reconciled behavior. The repository now has one
  focused service regression proving a manual `LIVE` market open can remain
  `OPEN/submitted` with `waitingForFill=true` and no position when exchange
  placement returns no fill truth, and one route-level runtime regression that
  currently fails exactly on the next missing step: `EXCHANGE_SYNC` open-order
  visibility is not yet adopted into runtime reads before later
  `EXCHANGE_SYNC` position visibility. This makes `V1COH-04` the next smallest
  honest fix slice.
- 2026-04-25: closed `V1COH-04` by tightening runtime adoption for manual
  `LIVE` opens at the read-model boundary. Runtime session positions now apply
  the same symbol-ownership adoption rule to eligible `EXCHANGE_SYNC`
  open-order rows that was already used for external positions, and open-order
  presentation deduplicates manual-vs-synced rows by `exchangeOrderId` with
  preference for the exchange-synced record. The resulting runtime truth is
  now explicit and non-duplicative across the backend stages
  `submitted -> imported_open_order -> position_opened`, making the remaining
  gap primarily an operator-surface/web-state problem in `V1COH-05`.
- 2026-04-25: closed `V1COH-05` by exposing explicit manual `LIVE` action
  states on dashboard-home runtime surfaces. The manual-order sidebar now
  renders localized `submitted`, `waiting_for_fill`, `imported_open_order`,
  `position_opened`, and `blocked` states derived from the already-hardened
  runtime order and position truth, so operators no longer need to infer
  progress from generic fallback wording.
- 2026-04-25: closed `V1COH-06` with a focused closure pack across the touched
  backend and web surfaces. Manual `LIVE` execution cohesion is now backed by
  passing API regressions for submitted->imported order->position truth,
  passing dashboard/manual-order regressions for the explicit operator states,
  passing API and web typechecks, and a green repository guardrail pass after
  splitting oversized manual-order UI coverage into its own test file.
- 2026-04-25: queued `V1READY-2026-04-25-A` after a fresh V1 audit showed that
  the remaining gap to a clean V1 claim is no longer an engineering feature
  slice. The repository now needs one canonical reconciliation pass across
  `PROJECT_STATE.md`, the activation pack, the activation closure, the RC
  sign-off record, and the RC checklist/status artifacts so it can state
  honestly whether V1 is already achieved or still blocked only by explicit
  operator-owned sign-off steps.
- 2026-04-25: closed `V1READY-2026-04-25-A` as the final activation-truth
  reconciliation pass. The canonical answer is now fail-closed and explicit:
  V1 engineering scope is complete, but formal activation remains blocked by
  one inconsistent RC sign-off artifact rather than by missing product or
  runtime work. The next honest slice is `V1READY-2026-04-25-B`, an
  operator-owned rebuild of the RC sign-off artifact plus checklist/status
  resync before any final `READY` claim.
- 2026-04-25: closed `V1READY-2026-04-25-B` by rebuilding the RC sign-off
  artifact, refreshing RC external gate status, rebuilding sign-off once more
  so its own snapshot captured `G4=PASS`, and resyncing the RC checklist.
  Canonical V1 activation truth is now internally consistent again: activation
  pack, activation closure, RC gates status, RC checklist, RC sign-off record,
  and planning/context docs all agree that V1 is approved from the current
  repository evidence set.
- 2026-04-25: closed `XADAPT-01` as the contract-freeze slice for post-V1
  exchange hardening. Architecture docs now expose one explicit capability
  matrix across authenticated reads and write-side execution, so the repository
  no longer needs to infer write support from generic adapter naming or from
  broad `LIVE_EXECUTION` flags alone. Frozen V1 truth is Binance-only support
  for authenticated reads plus `LIVE_ORDER_SUBMIT`, while `LIVE_ORDER_CANCEL`
  remains explicitly unsupported until a canonical exchange-side cancel
  boundary exists.
- 2026-04-25: closed `XADAPT-02` as the assumption-classification slice for the
  adapter hardening wave. The repository now has one explicit audit packet that
  separates intentional Binance-only runtime scope from compatibility seams and
  from generic-looking drift risks. This gives `XADAPT-03` a concrete owner map
  for narrowing adapter boundaries without rediscovering support truth.
- 2026-04-25: closed `XADAPT-03` as the boundary-hardening slice for post-V1
  exchange work. The codebase now has one shared execution capability matrix
  covering authenticated reads, `LIVE_ORDER_SUBMIT`, and explicitly unsupported
  `LIVE_ORDER_CANCEL`, plus one feature-facing exchange adapter boundary for
  orders, positions, and wallets. Lower-level connector and CCXT seams remain
  internal infrastructure, while feature modules now consume the narrowed
  boundary instead of composing connector factory, authenticated-read support,
  and live-submit primitives directly.
- 2026-04-25: closed `XADAPT-04` as the focused Binance contract-lock slice.
  The exchange hardening wave now has dedicated tests for the shared execution
  capability matrix and the new feature-facing adapter boundary, proving
  Binance-only read/submit support, explicit `LIVE_ORDER_CANCEL` non-support,
  unsupported-exchange fail-closed behavior, and live-submit result
  normalization without relying on broad DB-backed e2e packs.
- 2026-04-25: closed `XADAPT-05` as the closure-validation slice for the
  exchange-hardening wave. Focused adapter-boundary, capability-matrix, and
  authenticated-read contract suites are green together with API typecheck and
  repository guardrails, and canonical queue/context state now points to
  `XADAPT-06` as the planning-only next step after Binance boundary closure.
- 2026-04-25: closed `XADAPT-06` as the final planning slice of the exchange
  hardening wave. The repository now has one explicit next-exchange readiness
  packet choosing `BYBIT` as the next target and freezing staged rollout order
  across `API_KEY_PROBE`, `BALANCE_PREVIEW`, `POSITIONS_SNAPSHOT`,
  `OPEN_ORDERS_SNAPSHOT`, and `LIVE_ORDER_SUBMIT`, while keeping reconciliation
  broadening and `LIVE_ORDER_CANCEL` explicitly out of scope.
- 2026-04-25: closed `V1REG-02` as the first automated architecture-V1 sweep.
  The reusable checklist now contains one dated execution log and per-function
  automated verdicts. Web suites and non-DB API suites are green across the
  touched V1 surface, while DB-backed API verification is currently blocked by
  unreachable local Postgres at `localhost:5432`; no new product regression was
  isolated in this automated slice.
- 2026-04-25: closed `V1REG-03` as the matching browser/manual sweep for the
  reusable V1 checklist. Local browser verification confirmed that the auth
  shell still renders correctly on desktop/tablet/mobile, unauthenticated
  protected-route navigation still redirects `/dashboard` back to
  `/auth/login`, and invalid sign-in remains explicit rather than silently
  succeeding. No new product-visible regression was isolated, but the broader
  authenticated browser pass remains infra-blocked locally because the API dev
  target fails closed on missing `API_KEY_ENCRYPTION_KEYS` and local
  Docker/Postgres were unavailable in this run.
- 2026-04-25: closed `V1REG-04` as the triage/classification slice for the
  reusable V1 verification loop. The current evidence set does not justify any
  new `V1REG-Fxx` product bugfix task: `F09`, `F10`, and `F12` remain covered
  by already-closed cohesion/adapter/surface waves with no new post-closure
  regression isolated, while the remaining non-green function verdicts are
  attributable to documented local infra blockers (`Docker Desktop` /
  `localhost:5432`) and local API critical-secret startup prerequisites.
- 2026-04-25: closed `V1REG-05` and with it the full `V1REG-A` wave. Closure
  rerun kept the web checklist pack green, kept the non-DB API checklist pack
  green, and reconfirmed that the remaining auth/API failures still stop at the
  same infra boundary (`prisma.log.deleteMany()` cannot reach
  `localhost:5432`). The repository now has a reusable architecture-based V1
  verification protocol with no active follow-up task until either local infra
  is restored for a fuller rerun or a real new product regression is observed.
- 2026-04-25: approved the next exchange/runtime architecture direction after a
  fresh audit. The target model is now explicit: all exchange-owned behavior
  must resolve from the exact `(exchange, marketType)` pair; `SPOT` and
  `FUTURES` must never mix prices, candles, indicators, or signal inputs; the
  scalable implementation model is a family of narrow adapters under one
  registry; and worker health/readiness should be aligned with the full
  deployed topology where needed. Published
  `docs/planning/exchange-context-and-worker-topology-hardening-plan-2026-04-25.md`
  and queued `XVENUE-01..08`.
- 2026-04-25: closed `XVENUE-02` as the concrete code-audit slice for the new
  exchange-context wave. The repository now has one leak inventory in
  `docs/planning/xvenue-02-exchange-boundary-leak-audit-2026-04-25.md`
  confirming that direct exchange-specific behavior still exists outside
  `modules/exchange` across `markets`, `engine`, `bots`, `backtests`, and
  profile API-key probing, while worker health/readiness still models only part
  of the approved topology. No implementation claim changed in this slice; it
  simply freezes the migration map so `XVENUE-03` can define the exact
  capability-matrix evolution without guesswork.
- 2026-04-25: closed `XVENUE-03` as the capability-contract follow-up to the
  boundary leak audit. Canonical docs now distinguish compatibility-stage
  exchange-level flags from the target exact-stage
  `(exchange, marketType, operation)` matrix, and they explicitly forbid
  inferring support across operation families, market types, or exchanges. This
  means the upcoming registry refactor can move code toward exact venue truth
  without changing the honest support claims the repository makes today.
- 2026-04-25: closed `XVENUE-04` as the first code refactor under the new
  exact-context contract. The repository now has one canonical exchange adapter
  registry in `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.ts`
  keyed by exact `(exchange, marketType)` context, and the existing exchange
  public/account/execution entrypoints now resolve connector bootstrap through
  that registry instead of rebuilding it locally. This does not yet remove the
  direct Binance-shaped feature leaks in `markets` and `engine`; it prepares
  the safe seam for `XVENUE-05`.
- 2026-04-25: closed `XVENUE-05` as the first feature-module leak-removal
  slice. Market catalog bootstrap now lives in
  `apps/api/src/modules/exchange/exchangeMarketCatalog.service.ts`, and runtime
  live-balance reads in `runtimeCapitalContext.service.ts` now go through the
  canonical exchange balance boundary instead of building a local Binance CCXT
  client. The remaining next exchange-context hardening step is now explicit
  no-mixing parity coverage in `XVENUE-06`.
- 2026-04-25: closed `XVENUE-06` as the parity-lock follow-up for the new
  exact-context seams. The repository now has focused regression coverage
  proving that `BINANCE + SPOT` and `BINANCE + FUTURES` remain isolated in the
  registry and market-catalog paths, and that unsupported venue/context pairs
  stay fail-closed. The remaining active wave slice is now worker-topology
  truth alignment in `XVENUE-07`.
- 2026-04-25: closed `XVENUE-07` as the worker-topology truth slice of
  `XVENUE-A`. The repository now models `market-data`, `market-stream`,
  `backtest`, and `execution` through one shared worker-topology contract,
  `/workers/health` and `/workers/ready` distinguish explicit local/test inline
  support from deployed degraded inline or partial-split topology, and passive
  runtime-freshness skips are now limited to that explicit local/test inline
  mode. The remaining active wave slice is now `XVENUE-08`.
- 2026-04-25: closed `XVENUE-08` and with it the full `XVENUE-A` wave. A
  focused closure rerun confirmed that exact-context exchange seams,
  worker-topology truth, API typecheck, and repository guardrails all remain
  green together after the final worker-alignment slice, so there is no longer
  an active `XVENUE` item in the canonical queue.
- 2026-04-25: closed `DEPLOY-2026-04-25-B` as the validation-only follow-up to
  the same-day Coolify hotfix. Local `pnpm --filter web run build` now passes
  cleanly again, confirming the previously reported web deploy gate is no
  longer reproducible in the repository, and `quality:guardrails` remained
  green after closure sync.
- 2026-04-25: closed `PAPERPNL-02` as a test-only follow-up to
  `PAPERPNL-01`. The canonical `PAPER` `EXIT` lifecycle is now explicitly
  regression-locked for both profitable `LONG` and profitable `SHORT` closes,
  proving the same positive `realizedPnl` sign is persisted through both the
  closed-position payload and the close-trade payload in
  `executionOrchestrator`.
- 2026-04-25: Coolify deployment for web commit
  `0dd951d1696bd45ac11983c67e72213134a632d3` failed strictly at the web
  build gate, not at Docker or runtime startup. The blocking issues were one
  `no-explicit-any` violation in `HomeLiveWidgets.test-helpers.ts` and one
  redundant `useMemo` dependency warning in `WalletsListTable.tsx`; the
  follow-up hotfix restores the required `pnpm --filter web run build`
  contract for automatic redeploy.
- 2026-04-24: closed `PAPERPNL-01` after replacing the manual dashboard close
  fallback to `position.entryPrice` with one canonical runtime lifecycle
  mark-price resolver shared with automated runtime close logic. Manual close
  now fails closed with `POSITION_CLOSE_PRICE_UNAVAILABLE` when no ticker or
  recent runtime close can prove market truth, and focused regressions confirm
  profitable `PAPER` manual close now persists positive realized PnL through
  position, trade, runtime history, and capital summary reads.
- 2026-04-21: `docs/architecture/` is the canonical source of truth for how
  Soar works; resolved architecture decisions no longer live in
  `docs/planning/open-decisions.md`, and module deep-dives are implementation
  companions rather than primary behavior specs.
- 2026-04-22: future remediation tasks must be self-sufficient task packets
  with explicit scope, files, validation, non-goals, and docs-sync outputs;
  this is now frozen in
  `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`.
- 2026-04-22: `XLIFE-A` is closed; `PAPER` and `LIVE` now share one canonical
  execution lifecycle in the touched runtime scope, `LIVE` close is
  fail-closed until canonical fill truth exists, and runtime accounting uses
  fill truth over signal `markPrice`.
- 2026-04-22: `REVIEW-B` is closed; runtime DCA/add-leg execution now obeys
  canonical fill truth, submitted dedupe stays non-terminal until linked order
  outcome is known, generic exchange snapshots fail closed when ownership is
  ambiguous unless `apiKeyId` is explicit, and watchdog symbol scope is
  limited to explicit Binance-futures contexts.
- 2026-04-22: `REVIEW-C` is closed; runtime replay now restores completed DCA
  state from canonical persisted position truth, authenticated exchange
  snapshot failures normalize through one explicit operator error contract, and
  live reconciliation no longer synthesizes `CANCELED` when an order simply
  disappears from the exchange open-orders view.
- 2026-04-22: `RELEASE-HARDEN-A` is closed; V1 release execution now has one
  canonical operator-facing gate entrypoint (`ops:release:v1:gate`) over the
  existing quality, smoke, runtime-freshness, and rollback-guard checks.
- 2026-04-22: `SAFEV1-A` is closed; reconciliation entry truth, live capital
  truth, external ownership resolution, and rate-limit degraded-mode behavior
  are now covered by explicit fail-closed contracts and focused regression
  locks.
- 2026-04-22: `REVIEW-D` is queued; the next production-readiness closure wave
  is explicitly scoped to runtime `liveOptIn` admission truth, fail-closed
  handling for orphan bot-origin positions, canonical takeover-rebind
  ownership, and release-readiness truth for API-key encryption material.
- 2026-04-22: `REVIEW-D1` is closed; runtime signal topology now excludes
  `LIVE` bots unless `liveOptIn=true`, and runtime automation skips live
  positions whose owning bot is not opted in, keeping admission truth aligned
  across topology and execution-side candidate selection.
- 2026-04-22: `REVIEW-D2` is closed; orphan `origin='BOT'` positions without
  canonical bot ownership are now skipped before any manual runtime fallback
  context can apply, so bot-origin orphan state remains explicit and fail
  closed.
- 2026-04-22: `REVIEW-D3` is closed; takeover rebind no longer guesses owner
  for orphan `origin='BOT'` positions from the currently eligible LIVE bot set
  and instead keeps them unresolved unless explicit canonical ownership proof
  exists.
- 2026-04-22: `REVIEW-D4` is closed; release readiness now requires versioned
  `API_KEY_ENCRYPTION_KEYS`, while legacy `API_KEY_ENCRYPTION` remains
  compatibility-only for decrypting older payloads and is no longer sufficient
  for readiness or new encryption writes.
- 2026-04-22: `V1FACT-A` is queued; the next wave is explicitly scoped to V1
  production activation truth: release-gate freshness, stage/prod evidence
  separation, backup/restore and rollback proof, and final sign-off packaging.
- 2026-04-22: `V1FACT-A1` is closed; V1 activation now has one explicit
  freshness audit over release-gate, smoke, rollback, backup, and sign-off
  evidence, and the next active slice is stage-rehearsal and release-gate
  freshness hardening.
- 2026-04-22: `V1FACT-A2` is closed; V1 release gate now classifies evidence
  freshness explicitly by environment, stage rehearsal has one canonical
  entrypoint with reproducible artifacts, and stage dry-run evidence remains
  fail-closed and explicitly non-production until remote execution proof
  exists.
- 2026-04-22: the first authenticated stage rehearsal through Coolify
  `Root Team` access plus a dedicated stage OPS admin exposed a real blocker:
  `/workers/runtime-freshness` reported `FAIL` in `WORKER_MODE=inline`
  without active runtime demand even while `/workers/health`, `/workers/ready`,
  and `/alerts` were green.
- 2026-04-22: `V1FACT-07B` is closed; the inline runtime-freshness contract
  was aligned with real worker demand, SHA `49ea8e0c` was deployed, and the
  authenticated stage rehearsal now passes with fresh stage artifacts instead
  of remaining blocked on a false negative.
- 2026-04-22: `V1FACT-A3` is closed; prod release readiness now treats
  backup/restore drill and rollback proof as explicit evidence families in the
  V1 release gate, with canonical rollback-proof commands and fail-closed
  classification when either proof is stale or missing.
- 2026-04-22: `V1FACT-10` is closed; the final prod activation packet now
  exists in `docs/operations/v1-production-activation-pack-2026-04-22.md`,
  and the residual blockers are narrowed to four explicit items: missing prod
  restore-drill proof, missing prod rollback-proof pack, open RC Gate 2, and
  missing named human approvers / rollback owner in the sign-off record.
- 2026-04-22: `V1FACT-11` is closed; `V1FACT-A` no longer has active executor
  tasks. The production-activation architecture is frozen, and the remaining
  state is `CLOSED_WITH_OPERATOR_BLOCKERS` rather than an open engineering
  wave.
- 2026-04-22: `V1FACT-A` is closed as a delivery wave. Further progress toward
  final V1 activation now depends on operator-owned prod evidence generation
  and named sign-off capture, not on additional planned engineering tasks.
- 2026-04-22: production web login regression was traced to missing
  `NEXT_PUBLIC_API_BASE_URL` behavior in the browser. A shared public API base
  resolver now infers canonical API hosts from Soar domain patterns so
  production/stage auth and dashboard API calls do not fall back to same-origin
  `405` requests when the public env is absent.
- 2026-04-22: prod activation follow-up closed `RC Gate 2` with fresh
  production SLO evidence and a real prod rollback-proof artifact, but the
  prod restore-drill proof still fails because the prod DB profile env triplet
  (`PROD_DB_CHECK_CONTAINER`, `PROD_DB_CHECK_USER`, `PROD_DB_CHECK_NAME`) is
  not configured for the scripted check.
- 2026-04-22: `scripts/runV1ReleaseGate.mjs` now validates PASS-state inside
  prod restore/rollback proof artifacts instead of accepting same-day files on
  freshness alone, preventing false-green release readiness when a proof file
  exists but reports `FAIL`.
- 2026-04-23: selected-bot dashboard runtime markets are now rendered against
  one explicit truth state contract. Runtime symbol stats distinguish
  `CONFIGURED_ONLY`, `EVALUATED_NO_TRADE`, `SIGNAL_ACTIVE`, `POSITION_OPEN`,
  and `UNRESOLVED`, so configured strategy fallback context remains visible as
  operator context without pretending accepted runtime signal truth.
- 2026-04-23: production runtime investigation uncovered a second concrete
  drift: `marketStream.worker` was deriving symbol subscriptions from
  whitelist-only universe logic instead of the canonical symbol-group resolver
  already used by runtime topology. The worker now reuses the canonical
  resolver, so catalog-backed and filter-backed market universes subscribe the
  same symbols that runtime and operator surfaces consider in-scope.
- 2026-04-23: post-deploy production verification exposed a third concrete
  runtime-stream drift for `BINANCE/FUTURES`: the market-stream worker still
  defaulted to Binance's spot websocket URL when no explicit
  `BINANCE_STREAM_URL` override was configured. This caused futures-only
  symbols to remain at `configured_fallback` while symbols listed on both spot
  and futures received real runtime decisions. The canonical default now
  follows runtime market type (`FUTURES` -> `wss://fstream.binance.com/ws`,
  `SPOT` -> `wss://stream.binance.com:9443/ws`).
- 2026-04-24: the approved target bot architecture is now a full singular
  runtime-context model rather than a compatibility cleanup. Canonical target:
  one bot links exactly one wallet, one symbol-group-derived market scope, and
  one strategy. The bot keeps activation/runtime identity only, while wallet
  owns execution/capital context, symbol group + market universe own venue and
  symbol scope, and strategy owns logic/risk settings. The execution queue for
  this migration is published as `V1BOT-01..11`.
- 2026-04-24: the first implementation slice of the single-context bot rewrite
  is now landed. `Bot` persists direct `strategyId` and `symbolGroupId`
  references, migration SQL backfills those refs from one unambiguous active
  canonical topology row (or one unambiguous legacy `BotStrategy` row when no
  canonical row exists), create/update commands write the direct refs, and
  bot list/get/runtime-graph reads expose the singular inherited bot context
  without relying on legacy graph reconstruction as the only truth.
- 2026-04-24: `V1BOT-06` is closed. Canonical runtime topology now resolves one
  direct bot runtime context (`symbolGroupId + strategyId`) instead of
  iterating over legacy `botMarketGroups/strategyLinks`, final-candle routing
  and execution run against that singular context, dynamic market-stream
  subscriptions read direct bot refs first, and the selected-bot runtime
  surfaces that show market/strategy context now prefer direct inherited bot
  data over legacy runtime-graph reconstruction.
- 2026-04-24: `V1BOT-07` is closed. Canonical runtime execution now derives
  mode, paper baseline, and LIVE credential ownership from wallet context and
  venue truth from the linked symbol-group market universe. Active runtime
  topology fails closed on wallet-vs-market-scope drift, pre-trade now reads
  inherited execution config instead of bot snapshot mode/marketType, runtime
  position automation uses inherited wallet/venue context for DCA/close
  actions, and canonical runtime capital no longer falls back to bot-owned
  paper/api-key execution truth.
- 2026-04-24: authenticated production verification for the new paper bot
  `dec24168-7bba-4c44-aac9-97b3c6c60ce1` confirmed the next V1 gap is now the
  manual-order path rather than general bot runtime health. `manual-context`
  can resolve singular strategy truth (for example `25x` leverage on
  `1000000BOBUSDT`), but `POST /dashboard/orders/open` for a paper `MARKET`
  order without an explicit request price still persisted `Order.status=OPEN`
  with `positionId=null`, leaving the selected-bot aggregate unchanged. The
  next queued recovery slice is `V1BOT-09`, covering singular manual-context
  resolution, immediate paper fill authority, and truthful dashboard manual
  action states for both `PAPER` and `LIVE`.
- 2026-04-24: `V1BOT-09`, `V1DASH-A`, `V1BOTSURF-A`, and `V1SURF-A` are now
  closed. Manual-order singular-context recovery, dashboard capital KPI
  hardening, bot-surface truth alignment, and shared operator-state alignment
  all passed focused validation, and the web now reuses one shared runtime
  capital/runtime-state presentation helper across selected-bot dashboard and
  bot monitoring/list surfaces.
- 2026-04-24: `V1BOT-A` is now fully closed. Bot create/edit flows use direct
  singular refs instead of runtime-graph fallback, canonical API/runtime paths
  no longer infer primary context from legacy multi-group/multi-strategy
  topology, and the migration closure pack passed across API e2e/runtime,
  focused web suites, typecheck, build, and repository guardrails. Legacy
  topology remains compatibility-only and is no longer part of canonical
  execution truth.
- 2026-04-24: published `V1IND-A` after a fresh end-to-end indicator and
  signal-surface audit. Builder-exposed indicators in
  `strategies/indicators.data.ts` largely match shared evaluator support in
  `strategyIndicatorKernel.ts`, but canonical repo truth is still split across
  architecture docs, builder metadata ownership, and operator signal-surface
  fallback analysis.
- 2026-04-24: `V1IND-A` is closed. One canonical indicator registry now drives
  builder metadata, runtime/backtest evaluator parity, and operator
  signal-surface analysis; configured market snapshots use the same shared
  indicator kernel as runtime/backtest decisions, and signal surfaces no longer
  emit the old subset-evaluator placeholder `X` when canonical market data
  exists.
- 2026-04-24: published `V1POSTBOT-A` after re-running full API validation for
  the post-`V1BOT` repository state. The remaining 7 red cases are clustered in
  `backtests/orders` suites and look like one singular-bot contract recovery
  wave rather than an indicator regression: older fixtures still create
  partially configured LIVE bots, one manual-order path still loses inherited
  `strategyId`, and runtime session positions still drift for carryover open
  orders plus `EXCHANGE_SYNC BOT_MANAGED` LIVE ownership.
- 2026-04-24: `V1POSTBOT-A` is closed. The remaining red full-API cases after
  `V1BOT-A` were resolved by aligning stale `backtests/orders` e2e fixtures to
  the canonical singular bot contract instead of keeping half-legacy bot
  setup. Full `pnpm --filter api run test -- --run` is green again with the
  required API-key encryption env.
- 2026-04-24: signal-surface semantic hardening is now also closed as a small
  post-`V1IND-A` follow-up. Dashboard-home and bot-monitoring surfaces now
  label `CONFIGURED_ONLY` / `configured_fallback` rows as closed-candle market
  snapshots instead of reading like accepted or evaluated runtime decisions,
  while still showing the same canonical condition lines for operator
  comparison.
- 2026-04-24: `V1SURF-05` is now closed. `dashboard-home` no longer rebuilds
  selected-bot runtime aggregate payloads in the browser when the aggregate
  endpoint fails; the controller keeps real session truth from
  `listBotRuntimeSessions`, clears aggregate data fail-closed, and exposes an
  explicit degraded selected-bot state instead of reconstructing symbol stats,
  positions, and trades from session endpoints.
- 2026-04-24: `V1SURF-06` is now closed. Dashboard runtime sidebar and
  manual-order estimate semantics now reuse inherited venue truth from the
  linked symbol-group market universe instead of duplicated bot snapshot
  `exchange/marketType` fields. Capability checks, placeholder venue labels,
  sidebar market context, and SPOT-vs-FUTURES fallback margin/leverage
  behavior now align on one shared `resolveBotVenueContext()` helper.
- 2026-04-24: `V1SURF-B` is now fully closed. Bot-monitoring quick-context
  cards and placeholder capability warnings now also resolve venue semantics
  from inherited bot context instead of duplicated bot snapshot fields, and
  the focused residual operator-surface closure pack passed across selected-bot
  dashboard aggregate fail-closed behavior, inherited dashboard venue truth,
  bot-monitoring inherited venue truth, and dashboard/preview parity views.
- 2026-04-24: a small UX/UI refinement slice is also closed for operator-facing
  density polish. Strategy tabs now render inside one cleaner content
  container instead of nested framed boxes, dashboard `Historia` keeps only the
  operational trade log, runtime market cards no longer surface the removed
  helper labels/counters (`Status`, `Source`, `Strategy`, `Decision`,
  `Pozycja otwarta`, `Oceniono/brak wejścia`), dashboard warning text is more
  readable, and wallet create/edit form now groups fields into denser rows
  with a button-style mode switcher.
- 2026-04-24: the next post-`V1IND-A` operator-truth follow-up is now active
  as `V1MON-A`. The first slice is already closed: bot monitoring no longer
  reconstructs aggregate runtime truth client-side when the backend aggregate
  endpoint fails, and instead relies on one canonical backend aggregate plus
  explicit degraded/error state in web.
- 2026-04-24: `V1MON-02` is now also closed. Bot list and bot management
  surfaces prefer inherited venue truth from `symbolGroup.marketUniverse` and
  derive displayed strategy position-limit context from linked strategy
  configuration, keeping legacy bot snapshot fields as compatibility-only
  fallback instead of the primary operator narrative.
- 2026-04-24: `V1MON-03` is now also closed. Bot monitoring future-signal
  rows expose the same semantics as dashboard-home: runtime state, context
  source, strategy context, decision detail, and canonical condition lines are
  operator-visible, while configured-only rows remain visibly degraded market
  snapshots rather than looking like accepted runtime signals.
- 2026-04-24: `V1MON-A` is now closed. Bot monitoring no longer reconstructs
  aggregate truth client-side, bot list/management prefer inherited venue and
  strategy context over duplicated bot snapshot fields, and bot-monitoring
  future-signal rows now match dashboard-home semantics under one focused
  closure pack.
- 2026-04-24: fresh repository-wide closure verification now passes again:
  full `api` suite (with required API-key encryption env), full `web` suite,
  `api` typecheck, `build`, and `quality:guardrails` are green. A fresh
  production API audit confirmed that runtime signal/operator truth is now
  materially healthy on both paper and live bots with numeric indicator values
  and wallet/strategy-sized paper positions. The final narrow backend/runtime
  follow-up is published as `V1FINAL-A`: aggregate session detail must not
  expose stale `finishedAt` while still `RUNNING`, and at least one legacy
  pre-fix paper manual `MARKET` order on production still requires explicit
  orphan-order recovery.
- 2026-04-24: `V1FINAL-01` is closed. Synthetic aggregate runtime session
  detail now keeps `finishedAt=null` whenever any aggregated session is still
  `RUNNING`, instead of mixing active state with stale completion metadata from
  older sessions.
- 2026-04-24: `V1LIFE-03` is closed. Runtime session watchdog now reuses one
  canonical stale-order service plus the existing `cancelOrder` command path to
  expire strategy-governed `PENDING` / `OPEN` / `PARTIALLY_FILLED` orders,
  guarded by runtime `CANCEL` dedupe under `reasonCode=stale_open` and
  fail-closed when strategy lifetime is disabled (`0` or invalid config).
- 2026-04-24: `V1LIFE-04` is closed. Runtime session watchdog now also enforces
  strategy-configured position lifetime through one canonical stale-position
  service, reusing the existing runtime EXIT lifecycle instead of a separate
  cleanup path. Close attempts prefer current ticker truth, fall back to the
  latest recent close for the bot strategy interval, and fail closed when no
  valid mark price can be proven.
- 2026-04-24: `V1LIFE-05` is closed. Dashboard `Orders` tab now exposes a
  final action column backed by the existing cancel-order endpoint, with
  explicit pending state and fail-closed visibility rules: only active
  open-order statuses render cancel affordance, while terminal rows stay
  read-only and table truth refreshes from the canonical selected-bot runtime
  snapshot after successful cancellation.
- 2026-04-24: `V1LIFE-A` is now closed. Strategy lifetime semantics are fully
  aligned end-to-end: `0` is an explicit `no time limit` contract in the
  strategy form and payload mapping, runtime now enforces stale-order and
  stale-position expiry through the existing canonical cancel/close lifecycles,
  and the dashboard `Orders` tab exposes a real cancel action over the same
  backend endpoint. Focused closure validation for the lifetime/order-control
  wave is green across web tests, API tests, typecheck, and repository
  guardrails.
- 2026-04-24: a fresh post-`V1LIFE-A` audit narrowed the remaining V1 risk to
  residual operator-surface truth drift rather than backend execution logic.
  The main concrete findings are: `dashboard-home` still reconstructs selected
  bot aggregate state in the browser when aggregate API fetch fails, and a few
  dashboard/bot-monitoring surfaces still read venue semantics from duplicated
  bot snapshot fields instead of inherited symbol-group market-universe truth.
  This follow-up is now tracked as `V1SURF-B`.
- 2026-04-24: published `V1LIFE-A` after a focused lifecycle audit covering
  strategy builder, runtime/order services, and dashboard open orders UI.
  Confirmed that strategy already stores `maxOrders`, `orderLifetime`,
  `orderUnit`, `maxPositions`, `positionLifetime`, and `positionUnit` inside
  `strategy.config.additional`, but canonical runtime enforcement currently
  only consumes `maxPositions`. No explicit runtime/manual-order enforcement
  path was found yet for order lifetime or position lifetime, and the dashboard
  open orders table still lacks an operator cancel action despite the existing
  backend `cancelOrder` endpoint. The queued wave closes those gaps under one
  contract, including `0 = no time limit` semantics in the strategy UI.
- 2026-04-24: `V1LIFE-01` is closed. Strategy form lifetime inputs now allow
  `0` for both order and position lifetime, helper copy explicitly documents
  `0 = no time limit`, and focused web regressions lock the submit payload to
  preserve zero values instead of coercing them away.
- 2026-04-24: `V1LIFE-02` is closed. API now exposes one canonical
  `strategyLifetimePolicy` resolver for both order and position lifecycle
  policies, sourced only from `strategy.config.additional`. The helper
  normalizes `orderLifetime/orderUnit` and `positionLifetime/positionUnit`,
  treats explicit `0`, missing, negative, non-finite, and unsupported-unit
  inputs as fail-closed disabled policies, and emits normalized `durationMs`
  output for downstream runtime/order consumers.
- 2026-04-24: `V1FINAL-02` is closed without new code. The known production
  orphan paper order was confirmed to be a historical pre-fix manual
  `PAPER MARKET` row persisted as `OPEN` with no fill/position. Recovery
  reused the canonical existing `cancelOrder` lifecycle path, and production
  paper aggregate now reports `openOrdersCount=0`.
- 2026-04-24: `V1FINAL-03` is closed. Focused backend runtime-closure
  validation passed again for aggregate monitoring truth, paper manual-order
  immediate fill, runtime flow parity, `api` typecheck, and repository
  guardrails. The only remaining blocker captured for the backend handoff is
  infra-only on this workstation: local `test:go-live:smoke` cannot bind
  `5432/6379` while another local docker stack is already occupying those
  ports.
- 2026-04-22: prod restore-drill proof now passes from a real Coolify terminal
  execution in the production postgres container
  (`x11cfnz1dd9x0yzccftqzcoe`), and the final non-dry-run prod release gate now
  passes end-to-end with fresh prod evidence.
- 2026-04-23: production auth follow-up confirmed the current API/browser login
  flow is healthy on a fresh session, and the remaining recurrence vector is
  stale cached public auth shells. Login and register pages now opt out of
  static revalidation so users fetch fresh auth clients after deploys.
- 2026-04-23: the remaining production login bounce was traced to a web-side
  `/auth/me` bootstrap loop. `AuthProvider` runs above route i18n providers, so
  `useOptionalI18n()` now memoizes its fallback translator to keep auth
  bootstrap dependencies stable and stop rate-limit-triggering session checks.
- 2026-04-23: web auth bootstrap now has a direct `AuthProvider` rerender
  regression test, so the `/auth/me` loop fix is locked both at the optional
  i18n helper level and at the provider bootstrap boundary itself.
- 2026-04-23: the shared web API interceptor now has direct regression coverage
  for protected-route `/auth/me` behavior, explicitly locking `401` redirect,
  non-redirect `429`, and repeated-backend-failure fallback semantics.
- 2026-04-23: the auth-focused web regression pack now runs under real auth
  route namespace context, removing a false-positive i18n warning and keeping
  the post-incident auth test signal clean.
- 2026-04-23: `AuthProvider` now has direct regression coverage for the
  explicit `session=expired` hint path, including one-time warning behavior and
  URL query cleanup after handling the expired-session notice.
- 2026-04-23: `AuthProvider` logout now also has direct regression coverage for
  posting `/auth/logout`, clearing local auth state, and redirecting back to
  the login screen.
- 2026-04-23: `useRegisterForm` now has the same direct regression coverage as
  `useLoginForm` for request failure, success redirect, and missing
  session-confirmation behavior after auth bootstrap.
- 2026-04-23: the shared auth navigation fallback helper now has direct
  regression coverage for one delayed retry on stuck auth routes, no retry
  after the browser already leaves the fallback prefix, and test-mode retry
  suppression so hook tests stay deterministic.
- 2026-04-23: the dashboard wallets list page test now renders under its real
  route context, removing avoidable i18n missing-namespace noise caused by
  rendering the dashboard view under `/`.
- 2026-04-23: active work has moved out of production-activation planning and
  into a new post-approval `V1CONF-A` confidence-hardening wave, focused on
  keeping repository truth aligned with the approved candidate and reducing
  false-negative noise in high-signal validation packs.
- 2026-04-23: high-signal dashboard table tests now render under their real
  dashboard route context (`/dashboard/bots`, `/dashboard/wallets`,
  `/dashboard/backtests`) so route-owned i18n namespaces are loaded
  intentionally instead of falling back through the default `/` route.
- 2026-04-23: web component tests now default-mock `profileBasicCache` in
  Vitest setup, so shared `DataTable` column-visibility hydration no longer
  issues unrelated `/dashboard/profile/basic` requests during ordinary
  rendering assertions.
- 2026-04-23: the full web confidence pack now passes with `web test`,
  `web typecheck`, and `quality:guardrails`; the remaining non-failing signal
  noise is narrowed to `I18nProvider`-driven `act(...)` warnings and a small
  set of route-namespace warning cases, which are now isolated as the next
  confidence follow-up instead of mixed into auth/dashboard table noise.
- 2026-04-23: `V1CONF-06` is closed; `I18nProvider` now lazily hydrates
  locale/timezone from storage without mount-time state churn, the route
  namespace registry explicitly maps `/dashboard/profile` to `auth`, the
  affected auth/profile/reports/backtests/dashboard suites render under their
  owned route context, and `BotsManagement` no longer depends on brittle
  fetch-order or uncontrolled rerender timing.
- 2026-04-23: `V1CONF-07` is closed; the remaining non-failing web warning
  noise was removed by aligning bots/markets/strategies route-aware tests with
  their dashboard routes and by adding settled render/teardown helpers for the
  dashboard-home widget suites, so the full web pack now runs green without
  the previous `stderr` act/i18n warning spill.
- 2026-04-23: authenticated production investigation confirmed that the active
  PAPER and LIVE bots for the primary operator account are heartbeat-healthy
  but currently produce `0` persisted runtime signals, positions, and trades.
  The operator-facing runtime monitoring surface can still show
  `configured_fallback` strategy context, which looks signal-like even when no
  canonical runtime signal row exists. This has been promoted into a dedicated
  `V1SIG-A` recovery wave focused on runtime delivery truth, operator
  diagnostics, and paper-reset capital parity.
- 2026-04-23: `V1SIG-A` is closed as a truth-and-diagnostics wave. Runtime now
  emits explicit `GROUP_MAX_OPEN_POSITIONS_REACHED` pre-trade telemetry, the
  monitoring read model separates `latest_signal`, `latest_decision`, and
  `configured_fallback`, web surfaces show fallback strategy context without
  claiming it as accepted signal truth, and paper reset capital parity remains
  locked to wallet `paperInitialBalance + post-reset realizedPnL`. The
  residual production finding is now narrower and more honest: the affected
  bots are currently reaching real `No votes` / `No trade decision after
  strategy merge` outcomes, not silently losing accepted signals on the paper
  or live adapter path.
- 2026-04-23: after local Docker-backed infra became available again, the
  remaining DB-backed runtime recovery evidence also passed: selected-bot
  symbol-stats scope, monitoring aggregate read-model truth, paper reset
  capital baseline, execution orchestrator close-path behavior, and
  `PAPER`/`LIVE` decision parity are now all covered by green focused API
  suites in addition to the earlier non-DB packs.
- 2026-04-23: wallet/runtime capital authority now has a dedicated follow-up
  planning wave `V1CAP-A`, covering two operator-critical cases that need
  explicit V1 closure: `PAPER` reset checkpoint semantics and `LIVE`
  post-loss/post-deposit exchange balance refresh behavior under wallet
  allocation modes. The intended rule is that `LIVE` capital truth remains
  exchange-authoritative and should reflect later deposits automatically,
  while `PAPER` reset must create a clean active-capital baseline without
  deleting history.
- 2026-04-23: `V1CAP-A` is closed. Wallet preview and runtime now reuse one
  shared capital-allocation helper, runtime monitoring summaries expose
  explicit capital-source/allocation/reset metadata, and wallet/runtime UI
  surfaces explain whether active capital comes from paper baseline, paper
  reset checkpoint, or authenticated live exchange balance under percent,
  fixed, or full-balance allocation.
- 2026-04-23: a fresh architecture-conformance review after `V1SIG-A` and
  `V1CAP-A` surfaced the next explicit V1 closure wave `V1ALIGN-A`. The
  repository now has one queued answer for worker ownership drift (`split` is
  the deployed target; `inline` is local/degraded-only) plus four executor
  slices for empty runtime symbol-scope fail-closed routing, truthful signal
  interval persistence, per-active-session freshness authority, and explicit
  no-route/runtime-input diagnostics.
- 2026-04-23: `V1ALIGN-01` is closed. Canonical architecture, local
  development, and Coolify deployment docs now all say the same thing: split
  workers are the healthy deployed topology for `STAGE` and `PROD`, while
  inline worker ownership is reserved for local/test use or explicit
  degraded-mode fallback and must not be presented as normal deployment parity.
- 2026-04-23: `V1ALIGN-02` is closed. Runtime routing no longer widens empty
  resolved symbol scope into wildcard `*`; empty market-group symbol sets stay
  fail closed, and the final-candle path emits explicit `SIGNAL_DECISION`
  telemetry with reason `EMPTY_SYMBOL_SCOPE` instead of silently routing all
  symbols.
- 2026-04-23: `V1ALIGN-03` is closed. Persisted runtime signals now carry the
  truthful normalized candle interval used by the decision path instead of a
  hardcoded `1m`, keeping `Signal.timeframe` aligned with the architecture's
  interval-window contract.
- 2026-04-23: `V1ALIGN-04` is closed. `/workers/runtime-freshness` now
  evaluates decision-activity truth per active runtime session, so one
  unrelated fresh signal can no longer mask starvation for the running bot the
  operator is actually watching.
- 2026-04-23: `V1ALIGN-05` is closed. Runtime diagnostics now make the empty
  symbol-scope route outcome explicit as operator-visible telemetry, reducing
  the remaining "nothing happened" ambiguity in the runtime path.
- 2026-04-23: `V1ALIGN-06` is closed. Focused runtime-alignment tests, API
  typecheck, repository guardrails, and the full API pack are green. Full API
  validation requires explicit test-only encryption env
  (`API_KEY_ENCRYPTION_KEYS`, `API_KEY_ENCRYPTION_ACTIVE_VERSION`), and local
  `test:go-live:smoke` remains workstation-blocked when Docker cannot bind
  `5432` because another Postgres container is already using that port.
- 2026-04-23: `V1ALIGN-A` is closed as a wave. Worker-ownership docs, runtime
  symbol scope, signal interval truth, freshness authority, and explicit
  degraded diagnostics are now aligned with the approved V1 architecture.
- 2026-04-22: `scripts/runV1ReleaseGate.mjs` now selects the latest same-day
  evidence artifact by full timestamp-bearing filename, preventing older
  same-day restore-drill failures from shadowing newer PASS artifacts.
- 2026-04-22: formal RC sign-off was recorded, but the later `2026-04-25`
  activation-truth reconciliation found the generated sign-off artifact to be
  internally inconsistent (`PASS, PASS, PASS, OPEN` plus `RC status:
  APPROVED`), so V1 must remain operator-blocked until the sign-off record is
  rebuilt and checklist/status are resynced from the corrected source.
- 2026-04-22: `SAFEV1-A1` is closed; exchange reconciliation now refuses to
  create or update open synced positions when canonical entry truth is missing,
  keeping incomplete exchange snapshots out of the local open-position model.
- 2026-04-22: `SAFEV1-A2` is closed; live runtime capital now resolves only
  canonical wallet-owned or bot-owned credentials, with missing live
  credential ownership staying fail closed instead of falling back to the
  latest user API key on the same exchange.
- 2026-04-22: `SAFEV1-A3` is closed; external exchange-position ownership now
  resolves through an explicit `OWNED/AMBIGUOUS` contract that prioritizes
  canonical market-group scope and keeps overlap fail closed for runtime
  management flows.
- 2026-04-22: `SAFEV1-A4` is closed; production rate limiting now uses an
  explicit degraded-state contract with fail-closed `503` behavior when Redis
  is unavailable, while local/dev fallback remains bounded and intentional.
- 2026-04-22: full `SCALE` wave (`SCALE-01..SCALE-17`) is closed, including
  exchange-access convergence, web container seam extraction, and closure
  evidence handoff for future agents.
- 2026-04-02: Coolify on VPS with explicit stage and prod split remains the
  default deployment topology.
- 2026-04-03: phased brand migration from `CryptoSparrow` to `Soar` is real,
  but deployment and domain safety are allowed to progress independently.
- 2026-04-12: docs parity is a formal delivery requirement for module, route,
  and IA changes.
- 2026-04-17: Portuguese rollout is locked to `pt-PT`; `pt-BR` is not part of
  the current localization wave.
- 2026-04-19: dashboard manual-order advanced UX wave (`UXR-H`) is closed
  end-to-end and execution focus moved to deployment-readiness follow-up.
- 2026-04-19: dashboard forms consistency refresh is reopened as `UXR-I`
  planner-approved wave (post-`UXR-F` residual parity closure).
- 2026-04-19: dashboard tables consistency refresh (`UXR-J`) is closed
  end-to-end (`UXR-J-01..UXR-J-08`) with shared table-action/dropdown contract
  parity restored.
- 2026-04-19: dashboard runtime parity recovery wave (`DASHR-A..DASHR-C`) is
  closed end-to-end (`DASHR-01..DASHR-11`) with selected-bot
  positions/history/signals parity restored and explicit signal-blocked
  diagnostics in runtime execution path.
- 2026-04-20: market-universe symbol-contract parity wave (`MURC-01..MURC-12`)
  is closed end-to-end with one canonical resolver contract across markets
  sync, runtime, backtests, manual-order context, and web preview/validation.
- 2026-04-20: wallets list api-key status and paper reset safety wave
  (`WAPR-01..WAPR-10`) is closed end-to-end with row-only wallets list
  contract (`no Details`), deterministic inline API key state, and fail-closed
  non-destructive paper reset semantics (`paperResetAt` checkpoint baseline).
- 2026-04-20: dashboard Open Orders source-column wave (`OOSC-01..OOSC-08`)
  is closed end-to-end with `Source` labels (`Manual/Bot/Imported`), explicit
  manual-order write origin (`USER`), and unchanged active-only order
  visibility in `/dashboard` Open Orders.
- 2026-04-20: product target for manual and bot entries is clarified for the
  next execution wave: exchange-native unified lifecycle
  (`order -> fill -> position`) supersedes the previously locked
  `manual-order order-only` target for future implementation, while keeping
  strict selected-bot scope and wallet-scoped exchange takeover as canonical
  safety constraints.
- 2026-04-21: fill-price integrity is mandatory for `UOLF` transition to
  `position opened`; unresolved fill price must remain in waiting lifecycle
  state (no zero-entry synthetic position fallback).

## Technical Baseline
- Backend: Node.js 20+, Express API, Prisma, TypeScript
- Frontend: Next.js 15, React 19, TypeScript
- Mobile: none in current repository scope; responsive web and PWA-first
- Database: PostgreSQL
- Infra: Docker Compose locally, Coolify-targeted VPS deployment
- Hosting target: Coolify on VPS with stage and production environments
- Deployment shape: split `web`, `api`, worker services, `postgres`, and
  `redis`
- Runtime services: API service, web app, worker services for market-data,
  market-stream, backtest, and execution
- Background jobs / workers:
  - `market-data`
  - `market-stream`
  - `backtest`
  - `execution`
- Persistent storage: PostgreSQL and Redis
- Health / readiness checks:
  - `/health`
  - `/ready`
  - `/metrics`
  - `/workers/health`
- Environment files:
  - `apps/api/.env`
  - `apps/web/.env.local`
  - `.env.vps.example`
- Observability: runtime logs, metrics, SLO evidence artifacts, release and
  smoke packs under `docs/operations/`
- MCP / external tools: Playwright and Stitch-related UX docs available locally

## Validation Commands
- Lint: `pnpm run lint`
- Typecheck: `pnpm run typecheck`
- Unit tests: `pnpm --filter api run test -- --run` and
  `pnpm --filter web run test -- --run`
- Integration tests: targeted API or web Vitest packs by module
- E2E / smoke: `pnpm run test:go-live:smoke`
- Other high-risk checks:
  - `pnpm run quality:guardrails`
  - `pnpm i18n:audit:route-reachable:web`
  - `pnpm run build`

## Deployment Contract
- Primary deploy path: Coolify-managed VPS deployment with explicit stage and
  prod promotion flow
- Coolify app/service layout:
  - stage: `stage-web`, `stage-api`, worker services, `stage-postgres`,
    `stage-redis`
  - prod: `web`, `api`, worker services, `postgres`, `redis`
- Dockerfiles / compose paths:
  - `apps/api/Dockerfile`
  - `apps/web/Dockerfile`
  - `apps/api/Dockerfile.worker.market-data`
  - `apps/api/Dockerfile.worker.market-stream`
  - `apps/api/Dockerfile.worker.backtest`
  - `apps/api/Dockerfile.worker.execution`
  - `docker-compose.yml`
  - `docker-compose.vps.yml`
- Required secrets:
  - `DATABASE_URL`
  - `REDIS_URL`
  - `JWT_SECRET`
  - `API_KEY_ENCRYPTION_KEYS`
  - `API_KEY_ENCRYPTION_ACTIVE_VERSION`
  - exchange and optional CoinGecko credentials where in scope
- Public URLs / ports:
  - local web `http://localhost:3002`
  - local api `http://localhost:3001`
  - production web `https://soar.luckysparrow.ch`
  - production api `https://api.soar.luckysparrow.ch`
- Backup / restore expectation: follow the backup verification and restore-drill
  runbooks and evidence pack process under `docs/operations/`
- Rollback trigger and method: stage-gate or post-deploy failure triggers
  rollback according to `docs/operations/deployment-rollback-playbook.md`

## Current Focus
- Main active objective: preserve the now-clean post-approval V1 validation
  signal, keep canonical queue/context docs honest after the closed
  `V1SIG-A`, `V1CAP-A`, `V1IND-A`, `V1POSTBOT-A`, `V1SURF-B`, and `V1LIFE-A`
  waves, and derive the next engineering slice only from a fresh
  architecture-fit audit instead of stale queued follow-ups.
- Top blockers:
  - there is currently no active engineering task in the canonical short
    queue, so the next execution slice must be derived from a fresh audit of
    the remaining repo truth instead of reusing already closed `V1SIG` or
    `V1CAP` tasks.
  - local `test:go-live:smoke` remains workstation-blocked on this machine
    when Docker cannot bind `5432/6379` because another local stack is already
    occupying those ports.
  - final V1 production activation remains operator-blocked by prod evidence
    generation and named sign-off capture, not by an open engineering wave.
- Success criteria for this phase:
  - preserve green `web test`, `web typecheck`, and `quality:guardrails`
    on `main`,
  - keep canonical queue/context docs synchronized so future execution nudges
    do not revive already closed `V1SIG` / `V1CAP` slices,
  - derive any next implementation task from current architecture and planning
    truth instead of stale follow-up text,
  - keep high-signal auth/dashboard confidence suites free of false route/i18n
    noise,
  - keep the broader web pack free of avoidable `stderr` warning spill without
    loosening runtime or auth contracts,
  - keep queue/context/docs synchronized after each confidence-hardening slice.
- execution slices remain scope-locked and documentation-synchronized.
- Next queued follow-up:
  - `(none currently queued in canonical NOW/NEXT/READY states)`
  - next implementation work must be derived fresh from
    `docs/planning/mvp-execution-plan.md` plus current architecture/context
    truth.

## Recent Progress
- 2026-04-22: queued `SAFEV1-A` in
  `docs/planning/safev1-a-live-paper-runtime-safety-plan-2026-04-22.md` after
  a fresh V1 review confirmed four remaining safety gaps: reconciliation can
  still persist zero-entry open positions, live capital context can still fall
  back to unrelated recent API keys on the same exchange, external-position
  ownership is still heuristic under overlapping symbol coverage, and
  production limiter behavior can silently degrade into local-only mode.
- 2026-04-22: closed `SAFEV1-A1` by hardening
  `livePositionReconciliation.service.ts` so incomplete exchange snapshots no
  longer create or refresh open synced positions with `entryPrice <= 0`, and
  added regression coverage for the missing-entry-truth case.
- 2026-04-22: closed `SAFEV1-A2` by hardening
  `runtimeCapitalContext.service.ts` so live reference balance and DCA
  affordability no longer fall back to unrelated recent user API keys on the
  same exchange, and added regressions for bot-scoped missing-credential
  fail-closed behavior.
- 2026-04-22: closed `SAFEV1-A3` by hardening
  `runtimeExternalPositionOwner.service.ts` to return explicit
  `OWNED/AMBIGUOUS` ownership truth, prioritizing canonical market-group scope
  over legacy-only symbol bridges, and by making manual runtime close refuse
  ambiguous exchange-synced positions.
- 2026-04-22: closed `SAFEV1-A4` by hardening `middleware/rateLimit.ts` so
  production requests fail closed with explicit degraded-state signaling when
  Redis is unavailable, while local/test fallback remains intentional and
  reconnect attempts no longer depend on a full process restart.
- 2026-04-22: closed `SAFEV1-A` end-to-end by passing the focused runtime
  safety closure pack, publishing
  `docs/operations/safev1-a-live-paper-runtime-safety-closure-2026-04-22.md`,
  and synchronizing queue/context state to the closed wave.
- 2026-04-22: completed a new post-`SAFEV1-A` production review and queued
  `REVIEW-D` in
  `docs/planning/review-d-live-opt-in-and-ownership-safety-plan-2026-04-22.md`
  after confirming four remaining truth gaps: non-opted-in live bots still
  enter runtime topology, orphan bot-origin positions can still inherit manual
  env-default automation context, takeover rebind can still assign orphan
  bot-origin positions without canonical proof, and readiness still treats
  legacy API-key encryption fallback as production-ready key material. Audit
  evidence published in
  `docs/operations/review-d-live-opt-in-and-ownership-safety-audit-2026-04-22.md`.
- 2026-04-22: closed `REVIEW-D1` by hardening
  `runtimeSignalLoop.repository.ts` and `runtimeSignalLoopDefaults.ts` so
  non-opted-in `LIVE` bots never enter runtime topology, and by hardening
  `runtimePositionAutomation.service.ts` so live positions owned by
  non-opted-in bots are skipped before any strategy lookup or execution-side
  automation is attempted.
- 2026-04-22: closed `REVIEW-D2` by hardening
  `runtimePositionAutomation.service.ts` so orphan `origin='BOT'` positions
  with no canonical `botId` are skipped before any manual env-default
  mode/exchange/market fallback can apply, and added focused regression
  coverage for that fail-closed automation path.
- 2026-04-22: closed `REVIEW-D3` by hardening
  `positions.service.ts` so takeover rebind no longer assigns orphan
  `origin='BOT'` positions from the currently eligible LIVE bot set; bot-origin
  orphan positions now stay unresolved without explicit canonical ownership
  proof, while exchange-synced api-key-based rebind remains deterministic.
- 2026-04-22: closed `REVIEW-D4` by hardening
  `criticalSecretsReadiness.ts` and `crypto.ts` so readiness and new
  encryption writes require canonical versioned keyring material, while legacy
  `API_KEY_ENCRYPTION` remains decrypt-only compatibility support. Closure
  evidence published in
  `docs/operations/review-d-live-opt-in-and-ownership-safety-closure-2026-04-22.md`.
- 2026-04-22: queued `V1FACT-A` in
  `docs/planning/v1-production-activation-and-evidence-plan-2026-04-22.md`
  and froze the permanent activation rules in
  `docs/architecture/reference/v1-production-activation-contract.md` so future
  execution can convert the now-hardened V1 codebase into a fresh,
  operator-reviewable production activation packet instead of another ad hoc
  review cycle.
- 2026-04-22: closed `V1FACT-A1` by publishing
  `docs/operations/v1-production-activation-evidence-audit-2026-04-22.md`,
  classifying current activation inputs into fresh/stale/missing buckets, and
  advancing canonical execution focus to release-gate freshness semantics and
  fresh stage rehearsal evidence.
- 2026-04-22: closed `V1FACT-A2` by hardening
  `scripts/runV1ReleaseGate.mjs` with explicit freshness classification and
  environment-scoped readiness semantics, adding canonical
  `ops:release:v1:stage-rehearsal`, fixing deploy smoke to keep API/web target
  URLs explicit, and publishing fresh stage artifacts
  (`v1-release-gate-stage-2026-04-22T17-53-09-987Z.md`,
  `v1-stage-rehearsal-2026-04-22T17-53-09-987Z.md`) with dry-run blockers kept
  explicit.
- 2026-04-22: closed `RELEASE-HARDEN-A` by adding the canonical release gate
  script `scripts/runV1ReleaseGate.mjs`, exposing `pnpm run ops:release:v1:gate`,
  publishing `docs/operations/v1-release-gate-runbook.md`, and aligning V1
  release/smoke docs to the same operator entrypoint.
- 2026-04-22: closed `REVIEW-C` end-to-end by deriving completed DCA replay
  state from canonical persisted position truth, normalizing authenticated
  exchange snapshot failures through one explicit operator error contract, and
  replacing synthetic stale-order cancelation with explicit unresolved
  reconciliation truth. Closure evidence published in
  `docs/operations/review-c-runtime-state-and-reconciliation-closure-2026-04-22.md`.
- 2026-04-22: completed a new post-`REVIEW-B` runtime/exchange audit and
  queued `REVIEW-C` in
  `docs/planning/review-c-runtime-state-and-reconciliation-closure-plan-2026-04-22.md`
  after confirming three remaining production truth gaps: completed DCA dedupe
  replay can still restore runtime state from synthetic math, exchange
  snapshot fetch failures are not guaranteed to normalize through the explicit
  operator error contract, and live reconciliation still treats disappearance
  from exchange open-orders as synthetic `CANCELED`. Audit evidence published
  in
  `docs/operations/review-c-runtime-state-and-reconciliation-audit-2026-04-22.md`.
- 2026-04-22: closed `REVIEW-B` end-to-end by moving runtime DCA/add-leg
  execution onto canonical fill-result lifecycle, making submitted dedupe
  non-terminal until linked order truth is known, making generic exchange
  snapshots fail closed when multiple supported API keys exist unless
  `apiKeyId` is explicit, narrowing watchdog symbol selection to explicit
  Binance-futures scope, and publishing closure evidence in
  `docs/operations/review-b-runtime-exchange-production-closure-2026-04-22.md`.
- 2026-04-22: completed a post-`XLIFE-A` runtime/exchange audit and published
  `docs/operations/review-b-runtime-exchange-production-audit-2026-04-22.md`,
  then queued `REVIEW-B` in
  `docs/planning/review-b-runtime-exchange-production-readiness-plan-2026-04-22.md`
  to close the remaining risks around DCA canonical fill truth,
  submitted-dedupe non-terminality, ambiguous exchange snapshot ownership, and
  watchdog scope drift.
- 2026-04-22: closed `XLIFE-A` end-to-end by making LIVE close flow
  fail-closed until canonical fill truth exists, switching runtime trade and
  realized-PnL persistence to canonical fill price/quantity, persisting
  runtime-origin orders with `origin=BOT` so bot-opened positions retain bot
  ownership through the canonical order-fill-position lifecycle, keeping
  runtime automation alive during submitted close state, and publishing
  closure evidence in
  `docs/operations/execution-lifecycle-parity-and-exchange-truth-closure-2026-04-22.md`.
- 2026-04-22: queued `XLIFE-A` in
  `docs/planning/execution-lifecycle-parity-and-exchange-truth-plan-2026-04-22.md`
  and froze the permanent lifecycle rules in
  `docs/architecture/reference/execution-lifecycle-parity-contract.md` so
  future execution work is forced through one shared `order -> fill ->
  position` truth model for `PAPER` and `LIVE`, with explicit prohibition on
  local close-before-fill and on mark-price-based execution accounting.
- 2026-04-22: closed `TRUTH-A` end-to-end by removing LIVE order fallback to
  unrelated recent API keys, requiring canonical bot/wallet-bound key
  ownership for LIVE execution, adding explicit authenticated exchange-read
  support truth with fail-closed unsupported operations and truthful `source`
  derivation, fixing wallet preview double-decrypt drift, hardening
  runtime/dashboard guardrails to catch JSX prop literals and nullish fallback
  strings, migrating shared UI defaults (`ConfirmModal`, `DataTable`,
  `SearchableMultiSelect`) to canonical `public.sharedUi.*` copy, and
  publishing closure evidence in
  `docs/operations/truth-a-live-safety-and-contract-truth-closure-2026-04-22.md`.
- 2026-04-22: queued `TRUTH-A` as the next structural hardening wave after
  `SCALE`, publishing
  `docs/planning/truth-a-live-safety-and-contract-truth-plan-2026-04-22.md`
  and freezing permanent remediation rules in
  `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
  so future agents can execute the remaining review findings through one
  self-sufficient task packet family instead of rediscovering intent from
  scattered audit notes.
- 2026-04-22: closed `SCALE-16` + `SCALE-17`, finishing the full `SCALE`
  group. Executed focused dashboard/backtests seam regression pack
  (`31/31 PASS`) with `quality:guardrails`, `web build`, and `web typecheck`
  all green; published closure evidence in
  `docs/operations/scale-cd-closure-evidence-2026-04-22.md`; synchronized
  queue/context/planning docs and froze future-agent coding rules in
  `docs/architecture/reference/web-container-split-contract.md`.
- 2026-04-22: closed `SCALE-15` by extracting trades analytics from
  `BacktestRunDetails` into `useBacktestTradesAnalytics` (daily performance,
  timeline DCA linkage, trades rows, insights) and moving tab rendering
  ownership into `BacktestRunDetailsTabPanels` for `summary/markets/trades/raw`
  while keeping the route component as composition-only shell; focused backtest
  tests + `web typecheck` + `web build` passed.
- 2026-04-22: closed `SCALE-14` by extracting backtest timeline orchestration
  (chunk loading, cursor/cached merge, in-flight request locking, and
  parity-failed symbol handling) into `useBacktestTimelineOrchestration`,
  leaving `BacktestRunDetails` with tab composition and presenter wiring; `web
  typecheck`, focused backtest tests, and `web build` passed.
- 2026-04-22: closed `SCALE-13` by extracting runtime table presenter ownership
  (`runtimeDataTablePresenters.tsx`) and selected-bot sidebar presenter
  assembly (`runtimeSidebarPresenters.ts`) out of `HomeLiveWidgets`, keeping
  the container composition-focused; focused dashboard tests + `web typecheck`
  + `web build` passed.
- 2026-04-22: closed `SCALE-11` + `SCALE-12` by freezing one explicit web
  container split contract in
  `docs/architecture/reference/web-container-split-contract.md` and extracting
  manual-order controller ownership from `HomeLiveWidgets` into
  `useManualOrderController`; focused dashboard tests, `web typecheck`, and
  `web build` passed.
- 2026-04-22: closed `SCALE-B` (`SCALE-06..SCALE-10`) by auditing and removing
  duplicate API exchange/bootstrap paths, introducing canonical exchange
  boundaries (`exchangePublicRead.service.ts`,
  `exchangeAuthenticatedRead.service.ts`,
  `exchangeMetadataContract.service.ts`), rewiring symbol-rules/manual-context,
  positions snapshots, and wallet metadata/balance preview to those boundaries,
  and passing focused exchange regression + `api typecheck` + `api build` +
  `quality:guardrails`; evidence in
  `docs/operations/scale-b-exchange-access-audit-2026-04-22.md`.
- 2026-04-22: closed `SCALE-A` (`SCALE-01..SCALE-05`) by finishing
  guardrail-truth audit and cleanup (`scripts/repoGuardrails.mjs` now keeps
  only active exceptions), refreshing the maintainability inventory with
  current hotspot line counts and historical closure notes, and freezing one
  canonical exchange access ownership matrix in
  `docs/architecture/reference/exchange-access-ownership-matrix.md` (linked
  from architecture/module docs). Canonical queue/context is now advanced to
  `SCALE-06..SCALE-10`.
- 2026-04-22: queued `SCALE-A` in
  `docs/planning/scalability-anti-drift-foundation-plan-2026-04-22.md` and
  froze the permanent delivery rules in
  `docs/architecture/reference/scalability-anti-drift-delivery-contract.md` so
  future maintainability work is organized into self-sufficient task packets
  with explicit ownership, validations, and docs-sync outputs.
- 2026-04-21: queued `L10NQ-E` as the post-`CQLT` residual i18n cleanup wave
  in `docs/planning/l10nq-e-residual-route-reachable-i18n-closure-plan-2026-04-21.md`,
  using the latest route-reachable audit baseline (`filesWithFindings=35`,
  `localCopy=28`, `fallbackPl=4`, `hardcodedUiCandidates=6`) and explicitly
  splitting upcoming work into audit-trust hardening, residual public/profile/
  backtests/shared migrations, and closure validation.
- 2026-04-21: closed `L10NQ-E` end-to-end by hardening route-reachable audit
  scoring to exclude translation infrastructure noise, migrating residual
  public/profile/wallets/markets/backtests/shared UI copy to canonical
  namespaces, replacing local backtest detail dictionaries with
  `dashboard.backtests.details.*` ownership, and passing closure gates with a
  final zero-debt audit result (`findings=0`, `localCopy=0`, `fallbackPl=0`,
  `hardcoded=0`).
- 2026-04-21: closed `CQLT-11` by adding canonical `dashboard.shared.*`
  translation keys, moving `AuthContext` logout/session-expired toasts to
  i18n-aware resolution through `useOptionalI18n`, and switching `handleError`
  to a shared translation-backed fallback with explicit caller override
  support.
- 2026-04-21: closed `CQLT-12..CQLT-14` by migrating profile, strategies, and
  wallet-form locale dictionaries into canonical `dashboard-shell`,
  `dashboard-strategies`, and `dashboard-wallets` namespaces, then removing the
  corresponding temporary copy/hardcoded-literal allowlist entries from
  `scripts/repoGuardrails.mjs` while keeping `quality:guardrails` green.
- 2026-04-21: split the blocked `CQLT-15` umbrella into `CQLT-15A..C` so the
  canonical queue now matches the real dependency order for target
  architecture: restore route-audit runtime first, add focused migrated-route
  i18n regression locks second, and only then run the route-reachable closure
  audit plus docs/context sync.
- 2026-04-21: closed `CQLT-15A..C` by restoring local workspace dependencies,
  adding focused i18n smoke/guardrail coverage for migrated
  profile/strategies/wallets routes, generating the route-reachable audit
  artifact under `docs/operations/`, and returning `web build`,
  `web typecheck`, and `quality:guardrails` to green for the CQLT-C slice.
- 2026-04-21: closed `CQLT-B` (`CQLT-06..CQLT-10`) by extending
- 2026-04-21: closed `CQLT-25..CQLT-29` by extracting orders manual-context /
  quantity-rule / lifecycle seams, bot wallet-context and strategy-drift
  helpers, backtest range + report-lifecycle helpers, centralizing
  exchange-connector bootstrap for orders, and adding focused non-DB API seam
  regressions while keeping `api build` and `quality:guardrails` green.
- 2026-04-21: closed `CQLT-30..CQLT-32` and `CQLT-34` by publishing fallback
  classification plus legacy-bridge freeze, removing hidden bot-update wallet
  fallback, and synchronizing canonical queue/context/planning docs to the
  post-API-decomposition state.
- 2026-04-21: `CQLT-33` is the remaining blocker for full CQLT closure in this
  workspace because Docker Desktop engine is unavailable and local Postgres
  could not be started for DB-backed API e2e suites.
- 2026-04-21: closed `CQLT-33` and therefore the full `CQLT` wave by running
  sequential DB-backed API closure suites for `orders`, `backtests`, and
  `bots`, then passing repository-wide `build`, `typecheck`,
  `quality:guardrails`, and refreshed route-reachable i18n audit; closure
  evidence was published in
  `docs/operations/code-quality-maintainability-closure-2026-04-21.md`.
- 2026-04-21: closed `CQLT-B` (`CQLT-06..CQLT-10`) by extending
  `scripts/repoGuardrails.mjs` to block new production-local copy dictionaries,
  raw user-facing hardcoded UI literals, and non-allowlisted `1000`+ line
  monoliths; published the active exception policy in
  `docs/governance/code-quality-guardrails.md`; and added the
  duplicate-helper snapshot artifact
  `docs/modules/_artifacts-cqlt-duplicate-helper-snapshot-2026-04-21.json`.
  - 2026-04-21: closed `CQLT-16` by extracting a canonical shared DCA ladder
    renderer in `apps/web/src/features/shared/dcaLadderCell.tsx`, rewiring
    dashboard home and bots monitoring to the same helper, adding focused
    regression coverage, and hardening `repoGuardrails` to tolerate
    tracked-but-deleted files during staged helper moves.
  - 2026-04-21: closed `CQLT-17` by extracting shared runtime monitoring
    formatters in `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`,
    rewiring dashboard and bots views to one compact-age plus
    session/side/lifecycle tone contract, and adding focused unit coverage for
    the extracted seam.
  - 2026-04-21: closed `CQLT-18` by adding shared async view-state helper
    `runAsyncWithViewState` in `apps/web/src/lib/async.ts`, rewiring scoped
    profile/strategies/wallet loads to the same `loading + error + retry`
    contract, extending async helper tests, and replacing API keys hard reload
    retry with local refresh.
  - 2026-04-21: closed `CQLT-19` by extending selected-bot dashboard vs preview
    parity tests with DCA ladder and runtime trade-label assertions, and by
    aligning bots preview DCA formatting with dashboard locale-aware rendering
    so the shared-helper extraction wave remains behaviorally consistent.
  - 2026-04-21: closed `CQLT-20` by extracting runtime input parsing,
    direction/action/reason pill helpers, and position-edit draft typing from
    `HomeLiveWidgets.tsx` into
    `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx`,
    reducing the dashboard container toward controller-owned orchestration
    without changing rendered behavior; focused dashboard-home regression
    suites, `web build`, and `quality:guardrails` stayed green for the slice.
  - 2026-04-21: closed `CQLT-21` by extracting deterministic backtest detail
    view-model helpers into
    `apps/web/src/features/backtest/utils/backtestRunDetailsViewModel.ts`,
    moving summary/timeline chart rendering into
    `apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx`,
    reducing `BacktestRunDetails.tsx` from 2037 to 1137 lines, and keeping
    focused backtests tests, `web build`, and `quality:guardrails` green.
  - 2026-04-21: closed `CQLT-22` by extracting `BotsAssistantTab` plus
    monitoring presentational sections into dedicated components under
    `apps/web/src/features/bots/components/` and `bots-management/`,
    reducing `BotsManagement.tsx` from 1093 to 826 lines and
    `BotsMonitoringTab.tsx` from 1078 to 890 lines while keeping focused bots
    tests, `web build`, and `quality:guardrails` green.
  - 2026-04-21: cleared the active web warning baseline before the remaining
    `CQLT` slices by fixing all current `react-hooks/exhaustive-deps` warnings
    in `AuthContext`, profile API-key/subscription surfaces, and
    `WalletCreateEditForm`; `pnpm --filter web run build` is warning-free
    again.
  - 2026-04-21: closed `CQLT-23` by extracting wallet form state helpers,
    metadata/preview/reset action helpers, and dedicated presentational
    sections under
    `apps/web/src/features/wallets/components/wallet-create-edit-form/`,
    reducing `WalletCreateEditForm.tsx` from 791 to 483 lines while keeping
    focused wallet create/edit/reset regressions green.
  - 2026-04-21: closed `CQLT-24` by running the focused decomposition
    regression pack across dashboard, preview parity, backtests, bots, and
    wallets (`46/46 PASS`) while `quality:guardrails` and `web build`
    remained green.
- 2026-04-21: closed `CQLT-A` (`CQLT-01..CQLT-05`) by publishing the active
  maintainability remediation contract in
  `docs/architecture/reference/maintainability-remediation-contract.md`,
  recording concrete web/API/monolith inventories in
  `docs/modules/code-quality-maintainability-inventory-2026-04-21.md`, and
  freezing extraction-order ownership rules in the active CQLT plan before
  refactor work.
- 2026-04-21: closed `ARCCON` (`ARCCON-01..ARCCON-12`) end-to-end by removing
  hidden manual-order strategy fallback, enforcing wallet + market-universe
  precedence over duplicated bot venue fields, formalizing explicit worker
  ownership mode (`inline|worker`) for backtest/market-data in worker bootstrap
  and `/workers/health|ready`, hardening backtest report contract to explicit
  `runLifecycle` pending/degraded semantics, and removing `/dashboard/bots`
  namespace leakage into `dashboard.home.*`; closure validations PASS
  (`api focused tests`, `web focused bots tests`, `api/web typecheck`,
  `api/web build`, `quality:guardrails`).
- 2026-04-21: completed a repository-wide maintainability audit focused on
  hardcoded copy, oversized production modules, duplicated helpers, fallback
  drift, spread exchange bootstrap ownership, and recurring async boilerplate;
  queued `CQLT` (`CQLT-01..CQLT-34`) in
  `docs/planning/code-quality-maintainability-remediation-plan-2026-04-21.md`
  so future cleanup starts with inventory + guardrails and only then moves
  into i18n extraction, shared-helper consolidation, monolith decomposition,
  and fallback/legacy hardening.
- 2026-04-21: completed a full architecture-vs-code audit across docs, Prisma
  model, API, workers, and web operator surfaces; queued `ARCCON`
  (`ARCCON-01..ARCCON-12`) in
  `docs/planning/architecture-conformance-remediation-plan-2026-04-21.md` to
  close only confirmed drift: hidden manual-order strategy fallback, duplicated
  bot context ownership, live legacy `BotStrategy` compatibility paths,
  split-worker ownership mismatch for backtest/market-data, async backtest
  report contract ambiguity, and `/dashboard/bots` i18n namespace leakage.
- 2026-04-21: completed second-pass architecture cleanup by reducing
  `docs/architecture/` top-level to only the numbered canonical core plus
  `reference/` and `archive/`, moving active supporting contracts to
  `docs/architecture/reference/`, moving superseded/compatibility files to
  `docs/architecture/archive/`, updating repo-wide links and agent canonical
  doc entrypoints to the new structure, and deleting the local untracked
  `.tmp/` audit artifact folder.
- 2026-04-21: rebuilt the architecture documentation set into a numbered
  canonical reading order under `docs/architecture/`
  (`01_overview-and-principles` through
  `12_documentation-governance`), converted `system-architecture`,
  `database`, `trading-logic`, and `tech-stack` into compatibility stubs,
  normalized docs indexes to the new structure, slimmed
  `docs/planning/open-decisions.md` to unresolved-only usage, aligned product
  tier terminology to the canonical `FREE/ADVANCED/PROFESSIONAL` catalog, and
  archived non-canonical architecture closure/remediation snapshots under
  `docs/architecture/archive/`; agent-facing documentation workflow rules were
  also added under `.agents/workflows/documentation-governance.md` and wired
  into `.codex/agents/*` plus `.agents/prompts/product-docs.md`.
- 2026-04-21: closed `UOLF-HF-01` hotfix by enforcing positive fill-price
  integrity in order-fill-position lifecycle (no `entryPrice=0` position-open
  path), propagating runtime `markPrice` through MARKET open commands
  (`executionOrchestrator`, `runtimePositionAutomation`), adding dashboard
  manual-order MARKET price fallback to reference price, and validating with
  focused API/web tests + deploy gates (`api/web typecheck`, `api/web build`,
  `quality:guardrails`).
- 2026-04-20: completed `PLNC-D` parity sync by reconciling stale closed-wave
  drift in `docs/planning/mvp-execution-plan.md`; phases `DAWR`, `OOSC`,
  `BTCF`, and `UOLF` are now explicitly marked `Closed`, and
  `UOLF-02..UOLF-15` checkboxes are aligned with canonical closure state
  already present in queue/context docs.
- 2026-04-20: closed full `WAPR` wave (`WAPR-02..WAPR-10`) by implementing
  row-only wallets list UI (`no Details`) with deterministic inline `API key`
  state (`Connected`/`Not connected`), dedicated fail-closed
  `POST /dashboard/wallets/:id/reset-paper`, reset-aware paper-capital
  baseline via wallet checkpoint (`paperResetAt`), and paper-only wallet-edit
  reset action with deterministic loading/error/success UX; closure pack PASS
  (`pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts`,
  `pnpm --filter web run test -- --run src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx`,
  `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`,
  `pnpm run quality:guardrails`).
- 2026-04-20: completed `WAPR-01` by freezing canonical wallet-list + paper-reset safety contract in `open-decisions` and wallet module docs (`api-wallets`, `web-wallets`): list now has explicit `no Details` + inline `API key` column order/mapping contract, and paper reset is locked as dedicated fail-closed non-destructive command baseline (`POST /dashboard/wallets/:id/reset-paper`) with reset-checkpoint capital semantics.
- 2026-04-20: closed `UOLF` wave (`UOLF-02..UOLF-15`) end-to-end by shipping
  selected-bot manual-order scope regressions, canonical bot-context authority
  for order-open, shared order-fill-position lifecycle handling across
  runtime/manual paths, waiting-fill runtime semantics, dashboard lifecycle copy
  parity, and passing closure pack (`api UOLF matrix`, `HomeLiveWidgets +
  preview parity`, `api/web typecheck`, `build`, `quality:guardrails`,
  `test:go-live:smoke`).
- 2026-04-20: queued wallets list + paper reset safety wave (`WAPR-01..WAPR-10`)
  and published executor-ready plan
  `docs/planning/wallets-list-paper-reset-safety-plan-2026-04-20.md`; queue
  adds wallet-list simplification (`remove Details`, inline `API key`
  connected-state column) plus dedicated non-destructive `PAPER` wallet reset
  with reset-aware capital baseline, fail-closed guards, and focused API/web
  validation requirements.
- 2026-04-20: completed `UOLF-01` by freezing unified lifecycle contract in
  canonical docs (`open-decisions`, `api-orders`, `api-bots`,
  `web-dashboard-home`), superseding `SOPR-C order-only` wording with one
  target lifecycle (`order -> fill -> position`) for manual and runtime
  entries, strict selected-bot scope, and wallet-scoped exchange takeover
  ownership expectations before implementation steps.
- 2026-04-20: queued unified order lifecycle and exchange-sync parity wave
  (`UOLF-01..UOLF-15`) and published executor-ready plan
  `docs/planning/unified-order-lifecycle-and-exchange-sync-plan-2026-04-20.md`;
  queue promotes the clarified product target that manual dashboard orders and
  bot runtime signals must both follow one exchange-native lifecycle
  (`order -> fill -> position`), with `LIVE` fill authority delegated to the
  exchange and `PAPER` fill authority delegated to internal paper execution.
- 2026-04-20: closed full `BTCF` wave (`BTCF-02..BTCF-12`) end-to-end by
  delivering API list enrich contract (`strategyName`, `markets`,
  `initialBalance`), canonical web runs table columns, create-form explicit
  range controls with deterministic sync + slider bounds `250..10000`, API
  DTO + service/job/gateway explicit range flow (`startAt/endAt`) with
  backward-compatible fallback for legacy runs, docs/i18n parity sync, and
  closure validation pack (`api/web backtests tests`, `api/web typecheck`,
  `api/web build`, `quality:guardrails`, `i18n:audit:route-reachable:web`).
- 2026-04-20: completed `BTCF-01` by freezing canonical backtests
  list/create contract in `open-decisions` and module docs
  (`web-backtest`, `api-backtests`) with exact list columns
  (`Strategy`, `Markets`, `Init balance`, `Status`, `Start`, `Actions`),
  explicit `startAt/endAt` range semantics, slider bounds (`250..10000`), and
  backward compatibility requirement for historical runs.
- 2026-04-20: queued backtests list/create time-window remediation wave
  (`BTCF-01..BTCF-12`) from module analysis and published executor-ready plan
  `docs/planning/backtests-list-create-time-window-remediation-plan-2026-04-20.md`;
  queue promoted to active `NOW/NEXT/PIPELINE`.
- 2026-04-20: closed `PLNC-C` planning parity sweep (`PLNC-06..PLNC-08`) by
  synchronizing stale closed-wave statuses across planning plans (`UXR-I`,
  `DAGG`, `SBSC`, `UXR`, `POS`, `PLNC`, `V1/LBT`), aligning
  `mvp-execution-plan` phase headers to closed state, and updating
  `planning-catalog-index` classifications to current canonical closure.
- 2026-04-20: closed full `OOSC` wave (`OOSC-01..OOSC-08`) by shipping API
  origin plumbing (`origin=USER` write path + runtime open-order origin
  projection), dashboard Open Orders `Source` column with `Manual/Bot/Imported`
  mapping + `en/pl/pt` i18n coverage, and closure validation
  (`orders-positions.e2e`, `bots.monitoring-aggregate.e2e`,
  `HomeLiveWidgets.test`, `HomeLiveWidgets.open-orders-source.test`,
  `api/web typecheck`, `quality:guardrails`).
- 2026-04-20: closed `OOSC-01` by freezing canonical Open Orders `Source`
  mapping (`USER/BOT/EXCHANGE_SYNC/BACKTEST` -> `Manual/Bot/Imported`),
  explicit manual-order write-origin requirement (`origin=USER`), and unchanged
  active-only status scope (`PENDING`, `OPEN`, `PARTIALLY_FILLED`) in
  `open-decisions`, `api-orders`, and `web-dashboard-home`.
- 2026-04-20: queued executor-ready dashboard Open Orders source-column wave
  (`OOSC-01..OOSC-08`) and published plan
  `docs/planning/dashboard-open-orders-source-column-plan-2026-04-20.md`;
  canonical queue/context updated in `mvp-next-commits` and `TASK_BOARD`.
- 2026-04-20: implemented wallet-scoped external-position takeover contract for
  LIVE bots by adding `Wallet.manageExternalPositions` (with migration backfill
  from legacy `ApiKey.manageExternalPositions`), updating runtime exchange
  reconciliation to resolve takeover ownership from wallet-bound bot context
  first (legacy fallback preserved), and extending wallet web form/contracts so
  operators can enable takeover where API key + execution context actually
  lives.
- 2026-04-20: fixed production deploy blocker for web image build by removing
  explicit-`any` lint violations in dashboard regression tests
  (`HomeLiveWidgets.aggregate-wallet.test.tsx`,
  `RuntimeSidebarSection.test.tsx`); local `pnpm --filter web run build` is
  PASS after fix.
- 2026-04-20: closed planning parity sync `PLNC-05` by reconciling stale
  unchecked `DASHR-01..DASHR-11` entries in
  `docs/planning/mvp-execution-plan.md` with already-closed canonical queue
  state (`mvp-next-commits`, `TASK_BOARD`); `DASHR` phase is now explicitly
  marked closed with completion log entries.
- 2026-04-20: closed `DAWR-B` and `DAWR-C` (`DAWR-04..DAWR-10`) end-to-end by
  adding aggregate-success LIVE wallet regression lock in
  `HomeLiveWidgets.aggregate-wallet.test.tsx`, adding dedicated sidebar `strategyId`
  null/mismatch edge regressions in `RuntimeSidebarSection.test.tsx`, tightening
  sidebar canonical-first fallback behavior, documenting strategy-drift
  audit/repair triage in ops/module docs, synchronizing canonical planning
  files, and completing closure pack (`api aggregate e2e`, targeted web tests,
  `api/web typecheck`, `quality:guardrails`).
- 2026-04-20: closed `DAWR-A` (`DAWR-01..DAWR-03`) by freezing aggregate
  wallet-summary/sidebar edge contract in canonical docs, adding aggregate API
  regression coverage for `positions.summary.referenceBalance/freeCash`, and
  extending aggregate projection with parity fields from latest session capital
  context (`null` in unresolved empty aggregate path); validation PASS:
  `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`,
  `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- 2026-04-20: queued dashboard aggregate wallet/strategy regression wave
  (`DAWR-01..DAWR-10`) from post-MURC analyzer report and published
  executor-ready plan
  `docs/planning/dashboard-aggregate-wallet-strategy-regression-plan-2026-04-20.md`;
  queue promoted to active `NOW/NEXT/PIPELINE`.
- 2026-04-20: closed full `MURC` wave (`MURC-01..MURC-12`) end-to-end by
  introducing shared API symbol resolver contract
  (`final = unique(filter_result U whitelist) - blacklist`) and wiring markets
  sync, bot auto-group creation, runtime, backtests, and manual-order context
  to one parity path; aligned web markets preview/validation to accept valid
  empty sets and added regressions (API + web + cross-module parity smoke);
  completed closure pack (`pnpm --filter api run test -- --run`,
  `pnpm --filter web run test -- --run`, `pnpm --filter api run typecheck`,
  `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`).
- 2026-04-19: closed full `SOPR` wave (`SOPR-01..SOPR-12`) end-to-end by
  hardening selected-bot signal context source tags, locking
  `/dashboard` vs `/dashboard/bots/:id/preview` parity regressions for
  signals/positions/history, publishing SOPR parity evidence matrix, closing
  manual-order semantics as explicit `order-only` contract with audit-safe
  metadata, and completing closure validation pack (`api/web full tests`,
  `typecheck`, `lint`, `build`, `guardrails`, `route-reachable i18n audit`).
- 2026-04-19: hardened API e2e teardown stability for full-suite execution by
  adding deterministic cleanup order for `runtimeExecutionDedupe` and
  `botRuntime*` tables in affected suites (`auth`, `profile/basic`,
  `preTrade`, `market-stream`, `positions-live-status`) after recurring FK
  teardown collisions.
- 2026-04-19: closed `SOPR-01` by publishing consolidated selected-bot
  signals/open-runtime parity contract across canonical docs
  (`open-decisions`, `web-dashboard-home`, `api-bots`, `api-orders`), locking
  `DAGG`+`SBSC` prerequisites, latest-signal-first strategy precedence with
  explicit source-tag fallback semantics, no-open diagnostics visibility, and
  manual-order semantic baseline before `SOPR-09`.
- 2026-04-19: queued market-universe symbol-contract parity wave
  (`MURC-01..MURC-12`) from analyzer report and published executor-ready plan
  `docs/planning/market-universe-symbol-contract-parity-plan-2026-04-19.md`;
  queue is intentionally placed after active `SOPR` to avoid disrupting
  current execution.
- 2026-04-19: closed full `SBSC` wave (`SBSC-01..SBSC-08`) end-to-end by
  freezing sidebar strategy source-of-truth contract, adding list/get vs
  runtime-graph parity regressions, making bot strategy projection
  canonical-first, adding deterministic drift audit + safe idempotent repair
  endpoints, extending web switch regression for `Market + Strategy` parity,
  and completing focused closure validation pack (`api bots.e2e +
  bots.runtime-scope.e2e`, `web HomeLiveWidgets`, `api/web typecheck`) with
  canonical queue/context synchronization.
- 2026-04-19: closed `DAGG-C` (`DAGG-09..DAGG-10`) end-to-end by adding
  explicit cross-route selected-bot parity regression
  (`HomeLiveWidgets.preview-parity.test.tsx`) and completing focused closure
  validation pack (`api aggregate e2e`, `web aggregate parity tests`,
  `api/web typecheck`, `web build`, `quality:guardrails`).
- 2026-04-19: completed `DAGG-09` by adding explicit cross-route web parity
  regression (`HomeLiveWidgets.preview-parity.test.tsx`) that validates
  selected-bot aggregate history/trade consistency between `/dashboard`
  (`HomeLiveWidgets`) and `/dashboard/bots/:id/preview` (`BotsManagement`
  monitoring route), including no cross-bot leakage assertions.
- 2026-04-19: closed `DAGG-A` and `DAGG-B` (`DAGG-01..DAGG-08`) by enforcing
  aggregate-first selected-bot dashboard runtime loading, aligning runtime
  view-model derivation to aggregate payload, adding dashboard history
  closed-positions table with selected-bot re-scope regressions, and hardening
  aggregate API determinism with mixed-session e2e coverage.
- 2026-04-19: queued signals/open-runtime parity wave (`SOPR-01..SOPR-12`)
  from analyst findings and published executor-ready plan
  `docs/planning/signals-open-runtime-parity-plan-2026-04-19.md`; queue is
  dependency-locked behind `DAGG` then `SBSC`.
- 2026-04-19: queued sidebar strategy source-of-truth parity wave
  (`SBSC-01..SBSC-08`) from production/API analysis (`listBots.strategyId`
  projection drift vs `runtime-graph` primary strategy) and published executor
  plan `docs/planning/dashboard-sidebar-strategy-contract-plan-2026-04-19.md`.
- 2026-04-19: queued `DAGG` aggregate-view parity wave (`DAGG-01..DAGG-10`)
  from production discrepancy analysis and published executor-ready plan
  `docs/planning/dashboard-aggregate-selected-bot-view-plan-2026-04-19.md`;
  canonical queue/context updated to reflect aggregate-by-selected-bot product
  decision for dashboard tables.
- 2026-04-19: closed `DASHR-B` and `DASHR-C` end-to-end (`DASHR-05..DASHR-11`)
  by delivering selected-session history parity guards (api+web), strict
  selected-bot signal-scope regressions/fixes, explicit runtime
  `PRETRADE_BLOCKED` diagnostics for ignored condition-met flow, and full
  focused closure validation (`bots.e2e`, `bots.runtime-scope.e2e`,
  `runtimeSignalDecisionEngine`, `orders.service`, `runtime-history-parity`,
  `runtimeFinalCandleDecision`, `HomeLiveWidgets`, api/web typecheck, web
  build, guardrails).
- 2026-04-19: queued dashboard runtime data parity recovery wave (`DASHR-01..11`)
  from new operator report and published executor-ready plan
  `docs/planning/dashboard-runtime-data-parity-recovery-plan-2026-04-19.md`;
  synchronized `mvp-next-commits`, `mvp-execution-plan`, and `TASK_BOARD`
  with strict scope lock for `/dashboard` runtime fixes only.
- 2026-04-19: closed `UXR-J` (`UXR-J-03..UXR-J-08`) end-to-end by removing
  columns-dropdown auto-close on checkbox toggles, enforcing icon-only columns
  trigger default with preserved a11y labels, adding shared DataTable/TableUi
  regression locks, aligning consuming table assertions in bots/backtests, and
  completing closure validation pack (`25/25 PASS`, `web typecheck PASS`,
  `web build PASS`) with canonical queue/context synchronization.
- 2026-04-19: RC external-gates and release-candidate closure were finalized
  from VPS private-route production pipeline evidence: stage domains are live
  (`stage.soar.luckysparrow.ch`, `stage-api.soar.luckysparrow.ch`), all RC
  gate checks passed, and final snapshot is `G1=PASS`, `G2=PASS`, `G3=PASS`,
  `G4=PASS` (`2026-04-19T15:13:58.943Z`).
- 2026-04-19: completed `UXR-J-02` by adding dedicated `module` action tone
  in shared `TableUi` and remapping `runtime` plus `preview` presets to the
  same module tone while preserving `clone` as neutral (distinct from system
  `edit`/`delete` tones).
- 2026-04-19: completed `UXR-J-01` by freezing shared table-system consistency
  contract across canonical docs (`open-decisions`, `web-dashboard-home`,
  `web-bots`) with explicit action-tone semantics, columns dropdown persistence
  behavior, and icon-only columns-trigger accessibility rules.
- 2026-04-19: completed `UXR-I-14` closure by running required PASS pack
  (`pnpm --filter web run typecheck`, `pnpm --filter web run build`,
  `pnpm run quality:guardrails`) and synchronizing canonical queue/context;
  `UXR-I` dashboard forms consistency wave is now fully closed.
- 2026-04-19: completed `UXR-I-13` by running focused regression suite for
  dashboard forms consistency wave (`33/33 PASS`) across wallets/markets/
  backtests/bots form modules, wallet and bot create/edit wrappers, and i18n
  namespace/translation registry checks.
- 2026-04-19: completed `UXR-I-12` by applying shared
  `FormMobileActionBar` contract to remaining long dashboard form wrappers
  (`strategies` create/edit and `backtests` create), and aligning page-title
  save actions to desktop-only visibility to keep one sticky mobile save path.
- 2026-04-19: completed `UXR-I-11` by introducing shared
  `ui/forms/validationFeedback` helpers (`toValidationSummaryErrors`,
  `focusFirstInvalidField`) and migrating scoped forms (`wallets`, `markets`,
  `backtests`, `strategies`, `bots`) to one first-invalid focus/scroll and
  validation summary/inline sync contract; added focused helper unit
  regression coverage.
- 2026-04-19: completed `UXR-I-10` by refactoring `BotCreateEditForm` from a
  dense single-card layout into clearer two-column section cards (`setup`,
  `market`, `strategy`) with shared `ui/forms` primitives, preserving domain
  safeguards (`wallet context match`, exchange capability, LIVE API-key gate,
  live confirmation) and updating focused bots-form regression assertions.
- 2026-04-19: completed `UXR-I-09` by preserving strategies tab flow and
  normalizing `close`/`additional` tab internals to shared `ui/forms`
  primitives (`FormSectionCard`, `FormGrid`, `RadioGroupField`, `NumberField`,
  `ToggleField`, `CompoundField`), while keeping strategy domain logic
  unchanged and adding focused tab-flow regression coverage in
  `StrategyForm.test.tsx`.
- 2026-04-19: hardened OPS/Gate tooling for production private-route auth by
  adding layered auth support (basic auth and custom header pass-through) to
  `ops:slo:collect`, `ops:rc:gates:*` pipeline wrapper, deploy smoke, runtime
  freshness check, and rollback guard scripts; updated RC external gates
  runbook with the new command variants. Added repository-level `lockfile=true`
  in `.npmrc` to keep `pnpm install --frozen-lockfile` deterministic in
  Coolify/CI environments.
- 2026-04-19: completed `UXR-I-08` by aligning `BacktestCreateForm` to the
  shared `FormPageShell` contract and removing feature-local outer shell
  wrappers while keeping payload behavior and focused backtests-form tests
  green.
- 2026-04-19: completed `UXR-I-07` by migrating `MarketUniverseForm` from
  local ad-hoc section wrappers to shared sectioned IA (`FormSectionCard` +
  `FormGrid`), keeping catalog/filter behavior intact and validating via
  focused market-form tests.
- 2026-04-19: completed `UXR-I-06` by closing wallets-form residual control
  parity with shared primitives (`RadioGroupField`, `SelectField`,
  `NumberField`) and refreshing focused wallet regression assertions for the
  updated LIVE/PAPER control semantics.
- 2026-04-19: completed `UXR-I-05` by unifying wallet/bot create-edit wrapper
  save-action behavior: desktop and mobile save buttons now mirror form
  `submitting` state (`disabled` + loading label), backed by newly localized
  `saving` keys in `dashboard-wallets` and `dashboard-bots.page`.
- 2026-04-19: completed `UXR-I-04` by expanding `i18n/guardrails.test.ts`
  coverage to full `UXR-I` wrapper route/component scope and tightening
  `scripts/repoGuardrails.mjs` so `FieldControls` imports are blocked outside
  same-feature ownership (or any non-feature file), preserving `ui/forms` as
  the canonical generic-control layer.
- 2026-04-19: completed `UXR-I-03` by normalizing shared `ui/forms` primitive
  API surface for migration safety (exported prop/type contracts in
  `FormAlert`, `FormField`, `FormFields`, `FormGrid`, `FormMobileActionBar`,
  `FormPageShell`, `FormSectionCard`, `FormValidationSummary`) without
  changing rendering/runtime behavior.
- 2026-04-19: completed `UXR-I-02` by publishing residual route/module
  forms-consistency gap inventory with markdown + JSON artifacts
  (`uxr-i-forms-gap-map-2026-04-19.md`,
  `_artifacts-uxr-i-forms-gap-map-2026-04-19.json`) to lock deterministic
  migration scope for `UXR-I` execution.
- 2026-04-19: completed `UXR-I-01` by freezing post-`UXR-F` dashboard forms
  consistency refresh boundaries in canonical docs (`open-decisions`,
  `web-dashboard-home`) with explicit route scope, `ui/forms-only` generic
  control source, wrapper i18n-copy contract, and standardized
  validation/submit invariants.
- 2026-04-19: activated planner brief
  `dashboard-tables-consistency-planner-brief-2026-04-19.md` into canonical
  queued wave `UXR-J` via
  `docs/planning/uxr-j-dashboard-tables-consistency-refresh-plan-2026-04-19.md`,
  including grouped execution batches (`UXR-J-A..UXR-J-C`) and queue/context
  synchronization.
- 2026-04-19: activated planner brief
  `dashboard-forms-consistency-planner-brief-2026-04-19.md` into canonical
  queued wave `UXR-I` via
  `docs/planning/uxr-i-dashboard-forms-consistency-refresh-plan-2026-04-19.md`,
  including grouped execution batches (`UXR-I-A..UXR-I-D`) and queue/context
  synchronization.
- 2026-04-19: completed `OPV-05` by making RC external-gates status manual
  follow-ups gate-aware in `scripts/buildRcExternalGateStatus.mjs`; generated
  status now lists only unresolved actions (`Gate2/Gate4` in current snapshot)
  instead of static all-gates reminders.
- 2026-04-19: closed `POS-A` and `POS-B` queue drift by verifying
  implementation-complete lifecycle parity scope with focused runtime/parity
  tests (`50/50 PASS`) and publishing closure evidence in
  `docs/operations/pos-ab-closure-2026-04-19.md`.
- 2026-04-19: completed `OPV-04` by synchronizing OPV closure state across
  canonical queue/context and LBT/V1 planning docs, publishing
  `docs/operations/opv-04-closure-sync-2026-04-19.md`; residual blockers from
  that sync were later resolved in the final RC closure run
  (`2026-04-19T15:13:58.943Z`).
- 2026-04-19: completed `OPV-03` by collecting fresh production SLO evidence,
  rebuilding rolling window reports, refreshing RC gate/checklist/sign-off
  artifacts, and publishing closure evidence in
  `docs/operations/opv-03-rc-gates-refresh-2026-04-19.md`; the interim
  `G2/G4 OPEN` snapshot is superseded by final RC closure
  (`G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS`).
- 2026-04-19: completed `OPV-02` by verifying production takeover route
  availability (protected `401 Missing token` response, no `404`) and capturing
  OPS probe evidence in `docs/operations/opv-02-prod-live-takeover-2026-04-19.md`;
  private-route admin-auth validation remains required for Gate 3 closure.
- 2026-04-19: completed `OPV-01` by running Dockerfile-first rehearsal builds
  for `api`, `web`, and all worker images (`PASS`) and capturing deployment
  evidence in `docs/operations/opv-01-vps-rehearsal-2026-04-19.md` plus
  `_artifacts-opv-01-*` JSON/logs; production smoke on
  `api.soar.luckysparrow.ch` + `soar.luckysparrow.ch` passed; stage smoke is
  now also confirmed on `stage-api.soar.luckysparrow.ch` and
  `stage.soar.luckysparrow.ch`.
- 2026-04-19: closed `UXR-H` (`UXR-H-02..UXR-H-10`) end-to-end by delivering
  API manual-order context read contract + regression locks, web context/state
  integration, advanced runtime sidebar manual-order UX (`price`, market-fill,
  qty slider, side-aware summary, single-layer panel), EN/PL/PT i18n parity,
  and focused closure validation pack (`api/web tests`, `api/web typecheck`,
  `api/web build`, `quality:guardrails`).
- 2026-04-19: completed `UXR-H-01` by freezing dashboard manual-order advanced
  input/context contract across canonical decisions and module docs, including
  explicit unresolved `orderType -> MARKET` fallback and scope lock against
  TP/SL/reduce-only/TIF additions in this wave.
- 2026-04-19: completed `POS-36` by enforcing EXIT trace-only behavior in
  replay/interleaved backtest decision flow (`strategy_exit_trace_only`
  mismatch diagnostic), preserving lifecycle/final-candle close authority, and
  adding focused runtime final-candle EXIT trace-only regression lock.
- 2026-04-19: closed `ARC-E` (`ARC-19..ARC-20`) by tightening repository
  guardrails (source byte budgets + production line budgets) and publishing
  architecture maintainability closure snapshot in
  `docs/architecture/architecture-maintainability-closure-2026-04-19.md`.
- 2026-04-19: closed `ARC-C` (`ARC-11..ARC-13`) by introducing shared
  indicator kernel ownership (`strategyIndicatorKernel.ts`), rewiring runtime
  and backtest indicator projection/evaluation to the shared kernel path,
  extracting interleaved portfolio simulation ownership into
  `backtestPortfolioSimulation.service.ts`, and adding runtime-vs-backtest
  parity regression lock (`backtestRuntimeKernelParity.test.ts`).
- 2026-04-19: queued `UXR-H` manual-order advanced UX execution wave in
  `docs/planning/uxr-h-dashboard-manual-order-advanced-plan-2026-04-19.md`
  with grouped tiny-commit batches (`UXR-H-A..UXR-H-C`) covering price input
  and market-price quick fill, minimum executable quantity constraints, slider
  row ergonomics, bot-context order metadata, side-aware cost/max summary, and
  focused closure validation requirements.
- 2026-04-19: closed `ARC-B` (`ARC-06..ARC-10`) end-to-end by extracting
  runtime trades/positions read seams, moving runtime close-position command
  ownership into command service boundaries, introducing API aggregate
  monitoring endpoint (`GET /dashboard/bots/:id/runtime-monitoring/aggregate`),
  and switching web aggregate monitoring to API-first with deterministic client
  fallback.
- 2026-04-19: completed `ARC-10` API+WEB monitoring contract lock with focused
  tests (`bots.monitoring-aggregate.e2e.test.ts`, `botsMonitoringAggregate.service.test.ts`)
  and deployment-facing validation pack (`api build`, `web build+typecheck`,
  `quality:guardrails`).
- 2026-04-19: completed `ARC-09` by implementing backend aggregate monitoring
  read-model service (`runtimeMonitoringAggregateRead.service.ts`) and
  controller/route exposure for web consumers.
- 2026-04-19: completed `ARC-08` by extracting runtime close-position command
  orchestration from read service into `runtimeSessionPositionCommand.service.ts`.
- 2026-04-19: completed `ARC-07` by extracting runtime trades/positions read
  ownership into dedicated repositories/services
  (`runtimeSessionTradesRead*`, `runtimeSessionPositionsRead*`).
- 2026-04-19: Completed `ARC-06` by extracting bots runtime session list/detail
  ownership into `runtimeSessionRead.service.ts` and symbol-stats read-model
  ownership into `runtimeSessionSymbolStatsRead.service.ts`, reducing
  `botsRuntimeRead.service.ts` to trades/positions/close responsibilities for
  the next ARC-B decomposition step.
- 2026-04-19: closed `ARC-D` (`ARC-14..ARC-18`) end-to-end: extracted
  `HomeLiveWidgets` onboarding/view-model seams, moved bots monitoring
  aggregation into dedicated service ownership, split DataTable
  column-visibility helper ownership, removed `BacktestRunDetails` locale
  branch literals, and added seam-focused regression locks.
- 2026-04-19: completed `ARC-18` regression closure pack with new focused tests
  (`runtimeOnboardingConfig.test.tsx`,
  `botsMonitoringAggregate.service.test.ts`,
  `useDataTableColumnVisibilityState.test.ts`) and validation
  (`pnpm --filter web run typecheck` + focused ARC-D pack => `37/37 PASS`).
- 2026-04-19: Completed `ARC-05` by splitting runtime regression ownership into
  seam-scoped suites (`runtimeSignalLoopSupervisor.test.ts`,
  `runtimeFinalCandleDecision.service.test.ts`) and locking the final-candle
  no-trade path with corrected null-direction fixture behavior.
- 2026-04-19: closed `ARC-A` (`ARC-01..ARC-05`) end-to-end and advanced
  canonical queue/context focus to `ARC-B`.
- 2026-04-19: Completed `ARC-04` by extracting the final-candle runtime
  decision/execution flow into `runtimeFinalCandleDecision.service.ts` and
  reducing `runtimeSignalLoop` to routing/delegation ownership.
- 2026-04-19: Completed `ARC-03` by extracting runtime supervisor/watchdog
  orchestration into `runtimeSignalLoopSupervisor.ts` and rewiring
  `runtimeSignalLoop` to callback-based supervisor ownership while preserving
  runtime-loop regression behavior.
- 2026-04-19: Completed `ARC-02` by extracting typed runtime execution config
  into `apps/api/src/config/runtimeExecution.ts` and wiring
  `runtimeSignalLoop`/`orders.service` to centralized config parsing with
  dedicated config tests (`runtimeExecution.test.ts`).
- 2026-04-19: Completed `ARC-01` by freezing runtime maintainability
  decomposition boundaries and anti-drift guardrails in
  `docs/architecture/runtime-critical-path-decomposition-contract.md` and
  linking the decision in `open-decisions` before code extraction starts.
- 2026-04-19: closed `PLNC-A` (`PLNC-01..PLNC-04`) by publishing deterministic
  planning classification index (`implemented/queued/external-blocked/superseded`),
  syncing stale planning status headers, adding canonical queue linkage in
  non-closed plans, and synchronizing closure state across canonical queue and
  context docs.
- 2026-04-18: closed `UXR-G` (`UXR-G-01..UXR-G-06`) end-to-end: manual-order
  section is now a peer block below wallet, wallet summary row order is
  `Allocation -> Delta -> Portfolio`, free-funds/in-positions split is `50/50`,
  and focused closure checks passed (`web dashboard-home tests`, `web typecheck`,
  `web build`).
- 2026-04-18: completed planning-catalog coverage audit and queued post-active
  execution waves (`PLNC`, `ARC`, `POS`, `OPV`) via
  `docs/planning/planning-catalog-coverage-follow-up-plan-2026-04-18.md`,
  keeping active `BRS` queue unchanged.
- 2026-04-18: published maintainability audit report for planner handoff in `docs/planning/architecture-maintainability-audit-2026-04-18.md`, refreshing monolith/hardcode hotspots, weak guardrails, and planner-ready refactor slices without changing the active `BRS` execution queue.
- 2026-04-17: closed `BTMM-C`, `L10NQ-A`, `L10NQ-B`, `L10NQ-C`, `UXR-D`,
  `DOCSYNC-A`, and `A11Y-A` waves with evidence-backed validation.
- 2026-04-18: closed `L10NQ-D-B` (`L10NQ-D-06..10`) and published follow-up
  planning for selector parity and dashboard form-system unification.
- 2026-04-18: closed `UXR-F-A` (`UXR-F-01..UXR-F-04`) by freezing Stage A
  migration boundaries, adding shared `ui/forms` core+field primitives with
  tests, and enforcing cross-feature generic form import guardrails.
- 2026-04-18: closed `UXR-F-B` (`UXR-F-05..UXR-F-08`) by unifying create/edit
  wrapper i18n shell copy and migrating wallets/markets/backtests create-edit
  forms to shared `ui/forms` primitives with focused regression evidence.
- 2026-04-18: closed `UXR-F-D` (`UXR-F-13..UXR-F-14`) with focused form/i18n
  regression pack (`33/33` tests PASS), final web `typecheck` + `build` PASS,
  and canonical queue/context synchronization with closure artifacts.
- 2026-04-18: executed derived tiny continuation task `QH-LINT-01` by removing
  four `no-unused-vars` warnings in dashboard/bots surfaces and revalidating
  web build/typecheck; this opened final warning debt cleanup slice.
- 2026-04-18: completed `QH-LINT-02` by resolving remaining
  `react-hooks/exhaustive-deps` warnings in
  `BacktestsRunsTable`/`WalletsListTable`; `web build` and `web typecheck` are
  now green without warning debt in this tracked closure scope.
- 2026-04-18: completed `QH-TSC-01` by adding canonical sequential web
  verification command (`pnpm run web:verify:build-typecheck`) and documenting
  it for closure packs to avoid manual command-order drift.
- 2026-04-18: activated `BRS` wave from canonical planning queue (`BRS-01..12`)
  and closed `BRS-01` decision gate: selected-bot runtime symbol scope is
  strict canonical by default (`ACTIVE + isEnabled` only, `PAUSED` excluded),
  with no symbol expansion from fallback paths.
- 2026-04-18: completed `BRS-A` implementation (`BRS-02..BRS-04`) by adding a
  dedicated selected-bot scope regression in bots API e2e suite and hardening
  runtime symbol scope to canonical `ACTIVE` groups only in repository/service
  layers (`botsRuntimeRead.repository.ts`, `runtimeStrategyDisplayBySymbol.service.ts`,
  `botsRuntimeRead.service.ts`); local available validations PASS
  (`api typecheck`, `quality:guardrails`).
- 2026-04-18: completed `BRS-B` implementation (`BRS-05..BRS-08`) by adding a
  canonical update-path regression, implementing transactional canonical
  `PUT /dashboard/bots/:id` mapping sync in `botsCommand.service.ts`,
  enforcing canonical-first strategy precedence in
  `runtimeSymbolStatsEnrichment.service.ts`, and publishing dedicated
  scope-regression tests in `bots.runtime-scope.e2e.test.ts`.
  Validation: `pnpm --filter api run typecheck` PASS,
  `pnpm run quality:guardrails` PASS,
  `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts`
  => `3/3 PASS`.
- 2026-04-18: queued post-`BRS` `UXR-G` dashboard runtime sidebar layout wave
  (manual-order section below wallet as peer block, wallet summary row order
  polish, and 50/50 free-funds/in-positions split) in
  `docs/planning/uxr-g-dashboard-wallet-manual-order-layout-plan-2026-04-18.md`.
- 2026-04-18: refreshed the repo-specific agent workflow so the canonical queue,
  validation contract, deployment contract, and learning journal are aligned.

## Working Agreements
- Keep task board and project state synchronized.
- Keep planning docs synchronized with task board.
- Keep changes small and reversible.
- Validate touched areas before marking done.
- Keep repository artifacts in English.
- Communicate with users in their language.
- Delegate with explicit ownership and avoid overlapping subagent write scope.
- Use the default loop:
  `plan -> implement -> test -> architecture review -> sync context`.
- Treat deployment docs and smoke checks as part of done-state for runtime
  changes.

## Canonical Context
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `.agents/workflows/general.md`
- `.agents/workflows/subagent-orchestration.md`

## Canonical Docs
- `docs/README.md`
- `docs/product/overview.md`
- `docs/product/product.md`
- `docs/architecture/README.md`
- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `docs/modules/system-modules.md`
- `docs/engineering/local-development.md`
- `docs/engineering/testing.md`
- `docs/planning/mvp-execution-plan.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/open-decisions.md`
- `docs/governance/working-agreements.md`
- `docs/governance/language-policy.md`
- `docs/governance/repository-structure-policy.md`
- `docs/governance/subagent-delegation-policy.md`
- `docs/operations/coolify-linux-vps-setup-guide.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/ux/ux-ui-mcp-collaboration.md`
- `docs/ux/dashboard-design-system.md`

## Optional Project Docs
- Add only if the repository truly needs them.
- Record their canonical paths here once they exist.
