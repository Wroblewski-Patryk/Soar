# PROJECT_STATE

Last updated: 2026-05-03

## 2026-05-03 V1 Prod-Only Release Scope Update
- 2026-05-03 runtime open-order dedupe limit slice `RUNTIME-AUDIT-29` is
  closed locally. Runtime session `openOrders` now read a bounded candidate set
  before exchange/local dedupe and apply the dashboard `limit` after dedupe, so
  duplicate rows sharing an `exchangeOrderId` cannot hide distinct open orders
  from the dashboard. Validation PASS: failing-then-passing `limit=2`
  duplicate-order regression, focused runtime-scope e2e (`12/12`), broader
  bots e2e (`26/26`), API typecheck, repository guardrails, lint, and diff
  review. Evidence:
  `docs/planning/runtime-audit-29-runtime-open-orders-dedupe-limit-task-2026-05-03.md`.
- 2026-05-03 runtime positions open/history limit slice `RUNTIME-AUDIT-28`
  is closed locally. Runtime session positions now read open and closed
  bot-managed rows as separate scoped collections before serialization, so a
  newer history row cannot hide an older open position from the dashboard when
  the request uses a small `limit`. Validation PASS: failing-then-passing
  `limit=1` open/history regression, focused runtime-scope e2e (`11/11`),
  broader bots e2e (`26/26`), API typecheck, repository guardrails, lint, and
  diff review. Evidence:
  `docs/planning/runtime-audit-28-runtime-positions-open-history-limit-task-2026-05-03.md`.
- 2026-05-03 runtime symbol-stats configured-limit slice `RUNTIME-AUDIT-27`
  is closed locally. Unfiltered selected-bot symbol-stats now select display
  rows from configured symbol order and then hydrate persisted stats for that
  exact symbol set, preventing top-PnL DB ordering from rendering a configured
  dashboard signal row with zero totals when its stat row exists. Explicit
  symbol filters and off-scope empty behavior remain unchanged. Validation
  PASS: failing-then-passing configured-order `limit=1` regression, focused
  bots e2e (`26/26`), broader runtime/read pack (`42/42`), API typecheck,
  repository guardrails, lint, and diff review. Evidence:
  `docs/planning/runtime-audit-27-symbol-stats-configured-limit-task-2026-05-03.md`.
- 2026-05-03 runtime position symbol-level strategy display slice
  `RUNTIME-AUDIT-26` is closed locally. Runtime position reads now surface
  canonical symbol-level DCA/TTP/TSL display plans for strategy-null positions
  when active `BotMarketGroup` / `MarketGroupStrategyLink` scope resolves the
  selected symbol, while keeping `actionable` fail-closed without an
  executable strategy identity and preserving the stale legacy fallback guard.
  Validation PASS: failing-then-passing canonical strategy-null TTP regression
  and focused runtime strategy context e2e (`5/5`), broader bot runtime/read
  pack (`37/37`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `docs/planning/runtime-audit-26-runtime-position-symbol-strategy-display-task-2026-05-03.md`.
- 2026-05-03 market universe input normalization slice `RUNTIME-AUDIT-25` is
  closed locally. Market universe create/update DTOs now normalize
  `baseCurrency`, `whitelist`, and `blacklist` at the API boundary, so
  dashboard/source-of-truth market scopes persist canonical uppercase values
  while preserving operator-provided first occurrence order for symbol lists.
  Validation PASS: failing-then-passing lowercase market universe regression,
  focused markets e2e (`16/16`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `docs/planning/runtime-audit-25-market-universe-symbol-normalization-task-2026-05-03.md`.
- 2026-05-03 order list symbol normalization slice `RUNTIME-AUDIT-24` is
  closed locally. Dashboard order list `symbol` filters now normalize to
  uppercase at the DTO boundary, so operator/API requests such as
  `symbol=ethusdt` find owned persisted `ETHUSDT` orders instead of rendering
  an empty orders table. Validation PASS: failing-then-passing lowercase
  symbol filter regression, focused orders/positions read e2e (`21/21`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `docs/planning/runtime-audit-24-order-list-symbol-normalization-task-2026-05-03.md`.
- 2026-05-03 position list symbol normalization slice `RUNTIME-AUDIT-23` is
  closed locally. Dashboard position list `symbol` filters now normalize to
  uppercase at the DTO boundary, so operator/API requests such as
  `symbol=ethusdt` find owned persisted `ETHUSDT` positions instead of
  rendering an empty positions table. Validation PASS: failing-then-passing
  lowercase symbol filter regression, focused positions list e2e, API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `docs/planning/runtime-audit-23-position-list-symbol-normalization-task-2026-05-03.md`.
- 2026-05-03 wallet analytics date-range validation slice `RUNTIME-AUDIT-22`
  is closed locally. Wallet analytics `from` / `to` filters now fail closed at
  the DTO boundary when `from` is later than `to`, preventing misleading empty
  dashboard wallet analytics responses for invalid operator-supplied ranges.
  The service no longer needs a manual cashflow source cast because the query
  schema owns analytics filter typing. Validation PASS: failing-then-passing
  inverted date-range regression, focused wallets e2e (`18/18`), API
  typecheck, repository guardrails, lint, and diff review. Evidence:
  `docs/planning/runtime-audit-22-wallet-analytics-date-range-task-2026-05-03.md`.
- 2026-05-03 wallet analytics source validation slice `RUNTIME-AUDIT-21` is
  closed locally. Wallet analytics `source` filters now validate against the
  canonical `WalletCashflowSource` enum at the DTO boundary, so invalid
  dashboard/URL filter values fail closed with `400` instead of reaching
  Prisma and returning `500`. Validation PASS: failing-then-passing invalid
  source regression, focused wallets e2e (`17/17`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `docs/planning/runtime-audit-21-wallet-analytics-source-validation-task-2026-05-03.md`.
- 2026-05-03 wallet filtered timeline open-PnL slice `RUNTIME-AUDIT-20` is
  closed locally. Wallet equity timeline now attaches current owned-import
  open PnL only to the latest overall wallet snapshot point, not to the latest
  point of a filtered historical response. This keeps current wallet preview
  parity with performance summary without overstating past filtered timeline
  windows. Validation PASS: failing-then-passing filtered timeline regression,
  focused wallets e2e (`16/16`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `docs/planning/runtime-audit-20-wallet-timeline-filtered-open-pnl-task-2026-05-03.md`.
- 2026-05-03 wallet equity timeline open-PnL slice `RUNTIME-AUDIT-19` is
  closed locally. Wallet equity timeline now reuses the selected wallet
  open-PnL scope for the latest point, so owned imported `LIVE` positions with
  `walletId=null` are reflected in current `botOpenPnl` / `botPnl` consistently
  with wallet performance summary. Earlier timeline points remain historical
  snapshot/cashflow points and do not receive current open PnL. Validation
  PASS: failing-then-passing wallet timeline regression, focused wallets e2e
  (`16/16`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `docs/planning/runtime-audit-19-wallet-timeline-open-pnl-task-2026-05-03.md`.
- 2026-05-03 wallet owned-import open-PnL slice `RUNTIME-AUDIT-18` is closed
  locally. Wallet performance summary now includes selected `LIVE` wallet
  imported open positions with `walletId=null` when their `externalId` is
  owned by the wallet API key, while excluding other API keys and leaving
  balance snapshot, cashflow, and equity timeline contracts unchanged.
  Validation PASS: failing-then-passing wallet performance regression,
  focused wallets e2e (`15/15`), API typecheck, repository guardrails, lint,
  and diff review. Evidence:
  `docs/planning/runtime-audit-18-wallet-owned-import-open-pnl-task-2026-05-03.md`.
- 2026-05-03 exchange-fill close fee attribution slice `RUNTIME-AUDIT-17` is
  closed locally. LIVE exchange order-trade close confirmation now aggregates
  entry-leg fees by the owned position lifecycle (`userId + positionId + entry
  side`) instead of mutable `botId` / `walletId` projections, matching the
  synchronous runtime orchestrator close contract. Imported or recovered LIVE
  positions with null identity projections now keep correct close PnL when the
  exchange fill confirms through a selected bot wallet. Validation PASS:
  focused exchange-events pack (`6/6`), broader orders/runtime PnL pack
  (`75/75`), API typecheck, repository guardrails, lint, and diff review.
  Evidence:
  `docs/planning/runtime-audit-17-exchange-fill-close-fee-scope-task-2026-05-03.md`.
- 2026-05-03 selected LIVE bot open-order visibility slice
  `RUNTIME-AUDIT-16` is closed locally. Runtime positions dashboard reads now
  include direct selected-bot `BOT_MANAGED` open orders with legacy
  `walletId=null` rows in LIVE mode, matching the existing selected-bot
  compatibility scope for positions/trades while keeping `botId` ownership
  mandatory. Validation PASS: focused runtime takeover e2e (`4/4`), broader
  runtime positions/read pack (`33/33`), API typecheck, repository guardrails,
  lint, and diff review. Evidence:
  `docs/planning/runtime-audit-16-live-open-order-wallet-null-task-2026-05-03.md`.
- 2026-05-03 runtime close fee attribution slice `RUNTIME-AUDIT-15` is
  closed locally. Runtime close realized-PnL now aggregates entry-leg fees by
  the owned position lifecycle (`userId + positionId + entry side`) instead of
  mutable `botId` / `walletId` projections. Imported or recovered LIVE
  positions with `botId=null` / `walletId=null` can now close through the
  selected bot wallet while still subtracting entry fees attached to the same
  position. Validation PASS: focused execution orchestrator pack (`17/17`),
  broader runtime/order/automation pack (`90/90`), API typecheck, repository
  guardrails, lint, and diff review. Evidence:
  `docs/planning/runtime-audit-15-close-fee-position-scope-task-2026-05-03.md`.
- 2026-05-03 runtime EXIT owned-import lookup slice `RUNTIME-AUDIT-14` is
  closed locally. Runtime execution default open-position lookup now keeps the
  direct scoped query first, then resolves selected-bot owned `EXCHANGE_SYNC` /
  `BOT_MANAGED` imported open positions through wallet-first API-key ownership
  proof when the direct LIVE lookup misses. Legacy `walletId=null` imports can
  now be found for the same bot/wallet/symbol instead of producing incorrect
  `no_open_position`, while unowned imports remain invisible. Validation PASS:
  focused orchestrator pack (`18/18`), broader runtime/orders pack
  (`111/111`), typecheck, guardrails, lint, and diff check. Evidence:
  `docs/planning/runtime-audit-14-exit-owned-import-lookup-task-2026-05-03.md`.
- 2026-05-03 filled LIVE order imported-position reuse slice
  `RUNTIME-AUDIT-13` is closed locally. Filled selected-bot `LIVE` orders now
  reuse same-side deterministically owned `EXCHANGE_SYNC` / `BOT_MANAGED`
  imported open positions when no direct scoped position exists, including
  legacy `botId=null/walletId=null` rows after ownership proof succeeds. The
  filled order and order fills attach to the imported position, quantity and
  weighted entry price update through existing fill math, and no duplicate
  open position is created. Validation PASS: focused orders pack (`28/28`),
  broader orders/e2e/pre-trade/final-candle/defaults pack (`90/90`),
  typecheck, guardrails, lint, and diff check. Evidence:
  `docs/planning/runtime-audit-13-fill-lifecycle-owned-import-reuse-task-2026-05-03.md`.
- 2026-05-03 manual LIVE reverse-open imported-ownership slice
  `RUNTIME-AUDIT-12` is closed locally. Manual selected-bot `LIVE` opens now
  check deterministically owned exchange-synced `EXCHANGE_SYNC` /
  `BOT_MANAGED` imported open positions before exchange submission, including
  legacy imported rows persisted as `botId=null/walletId=null` after ownership
  proof succeeds. Opposite-side owned imports now fail closed with
  `OPEN_POSITION_SIDE_CONFLICT`; unowned, ambiguous, manual-only, or
  other-wallet imports remain non-blocking. Validation PASS: focused orders
  pack (`27/27`), broader orders/pre-trade/final-candle/defaults pack
  (`69/69`), typecheck, guardrails, lint, and diff check. Evidence:
  `docs/planning/runtime-audit-12-live-manual-reverse-owned-import-task-2026-05-03.md`.
- 2026-05-03 final-candle external-position guard slice `RUNTIME-AUDIT-11`
  is closed locally. `EXTERNAL_POSITION_ALREADY_OPEN` runtime blocking now
  keys managed external positions by deterministic owner bot
  (`userId:botId:symbol`) instead of user-wide `userId:symbol`. Imported
  `botId=null` LIVE rows are owner-hydrated through the shared
  external-position ownership index, so one bot's exchange-synced position no
  longer blocks another bot's signal on the same symbol. Validation PASS:
  focused final-candle/defaults pack (`18/18`). Evidence:
  `docs/planning/runtime-audit-11-final-candle-owned-external-bot-scope-task-2026-05-03.md`.
- 2026-05-03 pre-trade bot open-position cap slice `RUNTIME-AUDIT-10` is
  closed locally. `maxOpenPositionsPerBot` now counts direct selected-bot open
  positions plus deterministically owned LIVE `EXCHANGE_SYNC` / `BOT_MANAGED`
  imports for the same bot/wallet/API key. PAPER remains direct-bot scoped,
  and ambiguous/manual-only/unowned imports are not counted as bot exposure.
  Validation PASS: focused pre-trade pack (`24/24`). Evidence:
  `docs/planning/runtime-audit-10-pretrade-bot-open-count-owned-imports-task-2026-05-03.md`.
- 2026-05-03 pre-trade bot-scoped symbol-uniqueness slice
  `RUNTIME-AUDIT-09` is closed locally. Pre-trade one-position-per-symbol
  checks now remain user-global only when no `botId` is provided; runtime bot
  decisions with `botId` check direct positions for that bot and owned LIVE
  exchange-synced imports for that bot/wallet. Another bot's open same-symbol
  position can no longer block a selected PAPER/LIVE bot from opening.
  Validation PASS: focused pre-trade pack (`23/23`), broader
  runtime/backtest decision pack (`88/88`), and API typecheck. Evidence:
  `docs/planning/runtime-audit-09-pretrade-bot-scoped-symbol-uniqueness-task-2026-05-03.md`.
- 2026-05-03 external-position ownership catalog-scope slice
  `RUNTIME-AUDIT-08` is closed locally. External-position ownership proof now
  resolves active canonical bot market groups through the shared
  catalog-aware symbol resolver before building API-key+symbol ownership keys.
  Market-universe-backed groups with empty direct `symbols` but
  whitelist/filter catalog scope can now own and import all assigned exchange
  positions consistently with dashboard/runtime reads. Validation PASS:
  focused ownership regression (`9/9`), broader reconciliation/takeover pack
  (`41/41`), and API typecheck. Evidence:
  `docs/planning/runtime-audit-08-external-position-ownership-catalog-scope-task-2026-05-03.md`.
- 2026-05-03 runtime position automation symbol-scope slice
  `RUNTIME-AUDIT-07` is closed locally. Runtime position automation now
  resolves an owned position's configured bot symbol scope from active
  canonical market assignment before strategy config loading, DCA funds
  checks, DCA execution, lifecycle price evaluation, or protection close
  orchestration. Stale directly owned positions outside the bot's active
  market scope are skipped with LIVE `PRETRADE_BLOCKED` telemetry reason
  `position_symbol_outside_configured_scope`. Validation PASS: focused
  automation/default-deps pack (`35/35`), broader close/ownership
  automation pack (`52/52`), and API typecheck. Evidence:
  `docs/planning/runtime-audit-07-position-automation-canonical-symbol-scope-task-2026-05-03.md`.
- 2026-05-03 dashboard close command symbol-scope slice
  `RUNTIME-AUDIT-06` is closed locally. Dashboard runtime position close now
  resolves selected-bot configured symbols from active canonical market scope
  before ownership claim, strategy/wallet backfill, or close orchestration.
  Stale directly owned positions outside the bot's active market scope return
  the existing ignored `no_open_position` result instead of being closed.
  Validation PASS: focused close command regression (`9/9`) and broader
  close/runtime/imported-position pack (`74/74`). Evidence:
  `docs/planning/runtime-audit-06-close-position-canonical-symbol-scope-task-2026-05-03.md`.
- 2026-05-03 selected-bot runtime row symbol-scope slice
  `RUNTIME-AUDIT-05` is closed locally. Runtime trade history and runtime
  positions now apply selected-bot active canonical configured symbols to
  filtered and unfiltered reads, reusing the shared catalog-aware resolver.
  Stale persisted `Trade.botId` and `Position.botId` rows for off-scope
  symbols can no longer appear in selected-bot dashboard history/open
  positions after market reassignment. Validation PASS: focused runtime-scope
  regression (`1/1`) and broader monitoring/positions pack (`57/57`).
  Evidence:
  `docs/planning/runtime-audit-05-runtime-rows-canonical-symbol-scope-task-2026-05-03.md`.
- 2026-05-03 runtime trade-history symbol-scope slice
  `RUNTIME-AUDIT-04` is closed locally. Runtime trade history now resolves
  selected-bot configured symbols from active canonical `BotMarketGroup`
  scope through the shared catalog-aware resolver before honoring explicit
  `symbol` filters. Stale persisted `Trade.botId` rows for off-scope symbols
  can no longer appear in runtime trades or monitoring aggregate history after
  market reassignment. Validation PASS: focused runtime-scope regression
  (`1/1`) and broader monitoring pack (`45/45`). Evidence:
  `docs/planning/runtime-audit-04-runtime-trades-canonical-symbol-scope-task-2026-05-03.md`.
- 2026-05-03 canonical update/symbol-filter scope slice
  `RUNTIME-AUDIT-03` is closed locally. Bot update defaults now treat an
  existing canonical market group with no enabled strategy links as
  non-actionable instead of falling back to disabled canonical links or direct
  legacy `Bot.strategyId`. Runtime symbol-stats now validates explicit
  `symbol` filters against the full selected-bot configured symbol scope
  before applying `limit`, preventing configured symbols later in the market
  list from disappearing in dashboard reads. Validation PASS: focused
  helper/reconciliation pack (`31/31`), focused monitoring filter e2e (`1/1`),
  and broader bot/runtime/position pack (`68/68`). Evidence:
  `docs/planning/runtime-audit-03-canonical-update-and-symbol-filter-scope-task-2026-05-03.md`.
- 2026-05-03 manual-order canonical group fallback slice `ORDDRIFT-01` is
  closed locally. Manual-order strategy context now evaluates active canonical
  groups first and blocks direct/legacy strategy fallback whenever such groups
  exist but do not resolve the requested symbol. Stale direct bot strategy
  projections can no longer alter manual-order preview leverage, margin mode,
  or order type after canonical market reassignment. Validation PASS: focused
  orders service test (`26/26`) and broader orders/manual pack (`49/49`).
  Evidence:
  `docs/planning/orddrift-01-manual-context-canonical-group-no-direct-fallback-task-2026-05-03.md`.
- 2026-05-03 empty canonical strategy-link topology slice
  `RUNTIME-AUDIT-02` is closed locally. Runtime signal-loop topology and
  symbol-stats configured context now use direct legacy `Bot.strategyId` only
  when no active canonical market group exists. If an active canonical
  `BotMarketGroup` exists with no enabled `MarketGroupStrategyLink` rows,
  runtime context is non-actionable and dashboard configured strategy context
  remains empty. Validation PASS: focused defaults/symbol-stats tests
  (`11/11`) and broader runtime/symbol-stats pack (`78/78`). Evidence:
  `docs/planning/runtime-audit-02-empty-canonical-strategy-links-task-2026-05-03.md`.
- 2026-05-03 symbol-stats filter scope slice `DASHDRIFT-05` is closed
  locally. Explicit `symbol` filters on runtime symbol-stats now intersect
  with the selected bot's active canonical configured symbols and return an
  empty zero-summary response when the requested symbol is outside scope.
  Stale persisted stats for old/off-scope markets can no longer appear through
  a direct symbol query. Validation PASS: focused runtime-scope e2e (`10/10`)
  and broader symbol-stats/market-universe/PnL pack (`25/25`). Evidence:
  `docs/planning/dashdrift-05-symbol-stats-filter-canonical-scope-task-2026-05-03.md`.
- 2026-05-03 symbol-level dynamic-stop plan slice `DASHDRIFT-04` is closed
  locally. Runtime TTP/TSL plan maps by symbol now keep active canonical
  `BotMarketGroup` / `MarketGroupStrategyLink` entries authoritative and let
  legacy `BotStrategy` rows fill only symbols without canonical entries. Stale
  legacy advanced-close rows can no longer overwrite canonical basic-close
  symbol plans. Validation PASS: focused runtime strategy-context e2e (`4/4`)
  and broader bot runtime/dynamic-stop pack (`40/40`). Evidence:
  `docs/planning/dashdrift-04-symbol-dynamic-stop-plans-canonical-task-2026-05-03.md`.
- 2026-05-03 dashboard dynamic-stop column slice `DASHDRIFT-03` is closed
  locally. Runtime position dashboard `showDynamicStopColumns` now evaluates
  active canonical `BotMarketGroup` / `MarketGroupStrategyLink` strategy
  configs when present, using legacy `BotStrategy` rows only as compatibility
  fallback when no canonical topology exists. Stale legacy advanced-close rows
  can no longer turn on TTP/TSL columns for a canonical basic-close bot view.
  Validation PASS: focused runtime strategy-context e2e (`3/3`) and broader
  bot runtime/dynamic-stop pack (`31/31`). Evidence:
  `docs/planning/dashdrift-03-dynamic-stop-columns-canonical-task-2026-05-03.md`.
- 2026-05-03 LIVE reconciliation continuity strategy slice `POSDRIFT-12` is
  closed locally. LIVE exchange reconciliation now resolves recovered/imported
  bot continuity strategy through active canonical `BotMarketGroup` and enabled
  `MarketGroupStrategyLink` rows before direct legacy `Bot.strategyId`. Stale
  direct strategy projection can no longer label imported/recovered LIVE
  exchange-synced rows when canonical topology exists. Validation PASS:
  focused reconciliation test (`23/23`) and wider
  position/reconciliation/automation pack (`29/29`). Evidence:
  `docs/planning/posdrift-12-live-continuity-canonical-strategy-task-2026-05-03.md`.
- 2026-05-03 bot update safety guard slice `BOTDRIFT-02` is closed locally.
  Bot activation/update duplicate guard and LIVE overlap guard now derive
  default target strategy/market scope from active canonical `BotMarketGroup`
  and enabled `MarketGroupStrategyLink` rows before direct legacy bot fields.
  Stale direct `Bot.strategyId` / `Bot.symbolGroupId` can no longer let update
  activation bypass canonical duplicate checks. Validation PASS: focused
  duplicate guard (`6/6`) and wider bot write/runtime pack (`43/43`).
  Evidence:
  `docs/planning/botdrift-02-bot-update-canonical-guard-task-2026-05-03.md`.
- 2026-05-03 bot read projection slice `BOTDRIFT-01` is closed locally.
  `GET /dashboard/bots` and `GET /dashboard/bots/:id` now overlay canonical
  primary `BotMarketGroup` / `MarketGroupStrategyLink` context onto response
  `strategyId`, `strategy`, `symbolGroupId`, and `symbolGroup` before direct
  legacy bot projections. Stale direct `Bot.strategyId` can no longer feed
  dashboard and bot-management read models when canonical topology exists.
  Validation PASS: bot runtime-scope e2e (`10/10`) and wider bot pack
  (`41/41`). Evidence:
  `docs/planning/botdrift-01-bot-read-projection-canonical-context-task-2026-05-03.md`.
- 2026-05-03 dashboard position-edit strategy display slice `DASHDRIFT-02`
  is closed locally. The position edit modal in `HomeLiveWidgets` now resolves
  strategy labels from selected bot `runtime-graph` market groups and strategy
  links before direct legacy `Bot.strategy`. Stale direct bot strategy
  projections can no longer override canonical runtime strategy display in
  that position-management modal. Validation PASS: focused HomeLiveWidgets
  regression (`18/18`). Evidence:
  `docs/planning/dashdrift-02-position-edit-strategy-display-task-2026-05-03.md`.
- 2026-05-03 legacy open-position repair slice `POSDRIFT-11` is closed
  locally. Local repair of open `BOT` / `USER` positions without `botId` now
  matches candidate bots through active canonical `BotMarketGroup.symbolGroup`
  symbols before direct legacy `Bot.symbolGroup`, and writes strategy
  provenance from existing position provenance or one enabled canonical
  `MarketGroupStrategyLink`. Stale direct bot market/strategy projections can
  no longer claim or mislabel repaired orphan rows when canonical groups exist.
  Validation PASS: focused position repair regression (`1/1`). Evidence:
  `docs/planning/posdrift-11-legacy-position-repair-canonical-scope-task-2026-05-03.md`.
- 2026-05-03 manual-order multi-strategy ambiguity slice `POSDRIFT-10` is
  closed locally. Manual-order strategy context now resolves a canonical
  strategy only when exactly one enabled strategy link matches the requested
  symbol. Matching canonical groups with multiple enabled strategies remain
  unresolved, so LIVE manual open fails closed with the existing
  `LIVE_MANUAL_SCOPE_UNRESOLVED` path instead of silently selecting the first
  link. Validation PASS: focused LIVE ambiguous manual-order regression.
  Evidence:
  `docs/planning/posdrift-10-manual-order-multistrategy-ambiguity-task-2026-05-03.md`.
- 2026-05-03 manual-order context venue slice `POSDRIFT-09` is closed locally.
  Manual-order context now resolves venue from active canonical
  `BotMarketGroup.symbolGroup.marketUniverse` before duplicated bot
  `exchange/marketType`, and uses that venue for connector selection, exchange
  metadata fallback, leverage, and margin-mode semantics. Stale direct bot
  projections can no longer make dashboard manual-order preview show `SPOT`
  semantics for a canonical `FUTURES` bot scope. Validation PASS: focused
  manual-order context tests (`5` tests). Evidence:
  `docs/planning/posdrift-09-manual-context-canonical-venue-task-2026-05-03.md`.
- 2026-05-03 wallet update market-scope slice `POSDRIFT-08` is closed locally.
  Existing-bot wallet update validation now checks active canonical
  `BotMarketGroup.symbolGroup.marketUniverse` scope before falling back to
  direct legacy `Bot.symbolGroup`. A stale direct bot market projection can no
  longer allow a wallet whose venue mismatches the bot's real assigned
  canonical market group. Validation PASS: focused bot context validation test
  (`2/2`). Evidence:
  `docs/planning/posdrift-08-wallet-update-canonical-market-scope-task-2026-05-03.md`.
- 2026-05-03 LIVE market-overlap guard slice `POSDRIFT-07` is closed locally.
  Active LIVE bot create/update validation now checks candidate bots through
  active canonical `BotMarketGroup.symbolGroup` symbols before falling back to
  direct legacy `Bot.symbolGroup`. Stale direct market projections can no
  longer let two active LIVE bots share a symbol in their real assigned
  canonical market scope, nor block from the wrong legacy scope. Validation
  PASS: focused duplicate guard e2e (`5/5`). Evidence:
  `docs/planning/posdrift-07-live-overlap-canonical-market-scope-task-2026-05-03.md`.
- 2026-05-03 runtime signal-loop venue drift slice `POSDRIFT-06` is closed
  locally. Runtime signal-loop inherited execution context now uses the shared
  canonical runtime venue resolver instead of a local
  `botMarketGroups[0] ?? bot.symbolGroup` expression. PAPER/LIVE open topology
  now fails closed when raw topology exposes multiple canonical venues and
  preserves direct `Bot.symbolGroup` fallback only through the shared legacy
  compatibility path. Validation PASS: focused runtime signal-loop defaults
  test (`6/6`). Evidence:
  `docs/planning/posdrift-06-runtime-signal-loop-canonical-venue-task-2026-05-03.md`.
- 2026-05-03 execution-venue drift slice `POSDRIFT-05` is closed locally.
  Pre-trade LIVE bot config, manual order open context, runtime position reads,
  and runtime position automation now resolve venue from active canonical
  `BotMarketGroup` market universe before direct legacy `Bot.symbolGroup`.
  This prevents stale direct bot market projections from blocking or routing
  TTP/DCA/close/manual-open behavior away from the bot's assigned canonical
  market scope after market changes. Validation PASS: focused
  runtime/order/position pack (`6` files / `74` tests). Evidence:
  `docs/planning/posdrift-05-canonical-execution-venue-task-2026-05-03.md`.
- 2026-05-03 runtime position read drift slice `POSDRIFT-04` is closed locally.
  Runtime position reads now resolve inherited execution venue from active
  canonical `BotMarketGroup` market universe when available, and use direct
  `Bot.symbolGroup` only as legacy fallback. Position protection/actionable
  display no longer falls back to direct `Bot.strategyId` when
  position/canonical strategy provenance is missing. This prevents stale direct
  venue from hiding dashboard positions and stale direct strategy projection
  from making protection display look actionable. Validation PASS: runtime
  strategy-context e2e (`2/2`), dynamic-stop/serialization/automation pack
  (`42/42`), runtime-scope/orders/market-universe pack (`34/34`), web
  history/manual pack (`13/13`), and API typecheck. Evidence:
  `docs/planning/posdrift-04-runtime-position-read-canonical-context-task-2026-05-03.md`.
- 2026-05-03 imported-position ownership scope slice `POSDRIFT-03` is closed
  locally. External-position ownership now builds bot symbol scope from active
  canonical `BotMarketGroup` rows when they exist, and uses direct legacy
  `Bot.symbolGroup` only as fallback for bots without active canonical groups.
  This prevents stale direct bot market projections from claiming/importing
  exchange positions outside the currently assigned markets while preserving
  canonical assigned-market imports. Validation PASS: focused ownership test
  (`8/8`), takeover and reconciliation pack (`34/34`),
  runtime-scope/market-universe/orders pack (`34/34`), and API typecheck.
  Evidence:
  `docs/planning/posdrift-03-import-ownership-canonical-market-scope-task-2026-05-03.md`.
- 2026-05-03 position-management drift slice `POSDRIFT-02` is closed locally.
  Dashboard manual close now loads active canonical bot market-group strategy
  links and recovers/persists `strategyId` for imported `EXCHANGE_SYNC`
  bot-managed positions when the selected bot has exactly one active canonical
  strategy. The recovered strategy is passed into runtime close orchestration,
  keeping close order/trade/history provenance aligned with runtime protection
  ownership. Multi-strategy missing provenance remains non-guessed. Validation
  PASS: focused command test (`8/8`), API order/position + dynamic-stop +
  automation pack (`62/62`), web manual close/history pack (`13/13`), and API
  typecheck. Evidence:
  `docs/planning/posdrift-02-manual-close-strategy-provenance-task-2026-05-03.md`.
- 2026-05-03 dashboard/manual-order runtime drift slice `POSDRIFT-01` is
  closed locally. Manual-order API context now resolves active canonical
  `BotMarketGroup` and enabled `MarketGroupStrategyLink` rows before direct
  legacy `Bot.strategy` / `Bot.symbolGroup` projections, and the dashboard
  manual-order hook uses active runtime graph groups for symbol options before
  fallback. This prevents stale direct bot projections or paused groups from
  steering PAPER/LIVE manual openings. Validation PASS: API focused
  manual-order test (`23/23`), web hook test (`3/3`), API
  positions/market-universe/runtime pack (`34/34`), and web manual-order widget
  pack (`13/13`). Evidence:
  `docs/planning/posdrift-01-manual-order-canonical-context-task-2026-05-03.md`.
- 2026-05-03 dashboard-wide runtime drift slice `DASHDRIFT-01` is closed
  locally. The dashboard sidebar now treats `runtime-graph` as the canonical
  source for selected bot market/strategy context before falling back to direct
  legacy `Bot.strategy` / `Bot.symbolGroup` projections, and the API
  `runtime-graph` payload now includes strategy `leverage` so the sidebar can
  explain the same strategy context runtime uses. Validation PASS: sidebar
  regression (`8/8`), runtime-scope API e2e (`10/10`), dashboard aggregate and
  runtime presenter tests (`11/11`), API aggregate/symbol-stats tests
  (`14/14`), API/web typechecks, repository guardrails, and docs parity.
  Evidence:
  `docs/planning/dashdrift-01-dashboard-runtime-context-parity-task-2026-05-03.md`.
- 2026-05-03 operator-reported dashboard wallet balance slice
  `WALLETBAL-01` is closed locally. Runtime LIVE balance cache now preserves
  separate semantic fields for raw exchange `accountBalance` and allocated
  `referenceBalance`, so cache hits no longer collapse FIXED/PERCENT allocation
  values into the dashboard account-balance field. `freeCash` continues to use
  allocated trading capital. Validation PASS: focused runtime capital tests
  (`15/15`), monitoring aggregate plus wallet e2e tests (`19/19`), and API
  typecheck. Evidence:
  `docs/planning/walletbal-01-live-account-balance-cache-task-2026-05-03.md`.
- 2026-05-03 operator-reported PAPER signal parity slice `PAPERSIGNAL-01` is
  closed locally. Runtime symbol-stats read models now use active canonical
  `BotMarketGroup` and enabled `MarketGroupStrategyLink` rows as their
  configured market/strategy context before falling back to legacy
  `Bot.symbolGroup` / `Bot.strategy`. This aligns dashboard signal cards with
  the topology used by PAPER/LIVE final-candle execution and avoids stale
  legacy configured-context display after strategy or market changes.
  Validation PASS: focused symbol-stats/final-candle/paper-live tests
  (`18/18`), bot runtime scope/market-universe/dynamic-stop/runtime-loop tests
  (`60/60`), and API typecheck. Evidence:
  `docs/planning/papersignal-01-canonical-symbol-stats-parity-task-2026-05-03.md`.
- 2026-05-03 operator-requested LIVE/PAPER runtime audit slice
  `RUNTIME-AUDIT-01` is closed locally. Runtime signal-loop open-position
  counting now follows the wallet-first imported-position ownership contract by
  resolving the effective LIVE API key from `wallet.apiKeyId` before legacy
  `Bot.apiKeyId`. This prevents wallet-first bots from undercounting imported
  `EXCHANGE_SYNC` LIVE positions in max-open/external-position guards when the
  legacy bot API-key projection is null. Validation PASS: focused
  runtime/defaults and ownership tests (`13/13`), runtime
  final-candle/live-reconciliation/dynamic-stop tests (`75/75`), paper-live
  equivalence (`2/2`), API typecheck, repository guardrails, and docs parity.
  Evidence:
  `docs/planning/live-paper-runtime-prod-audit-wallet-first-count-task-2026-05-03.md`.
- 2026-05-03 operator-reported LIVE imported-position protection provenance
  follow-up `LIVEIMPORT-02` is closed locally. Owned `EXCHANGE_SYNC` LIVE
  positions that lack persisted `position.strategyId` can now recover the
  owning bot's single enabled canonical strategy link for TTP/DCA read-model
  display and runtime protection automation. Multi-strategy missing provenance
  remains fail-closed through the existing
  `multi_strategy_position_provenance_missing` skip telemetry. Public
  production `/health` and `/ready` are healthy, but production web build-info
  still reports deployed SHA `26962ea1dbb0981d3885779d01e58485d7e9fd6c`, so
  this local fix requires promotion before authenticated ETH/DOGE readback.
  Validation PASS: focused runtime automation tests (`33/33`), focused
  dynamic-stop operator truth e2e (`2/2`), API typecheck, and repository
  guardrails. Evidence:
  `docs/planning/live-import-single-strategy-provenance-task-2026-05-03.md`.
- 2026-05-03 operator-reported follow-up queue is active after
  `LIVEIMPORT-02`: `LIVEIMPORT-03` for production promotion and authenticated
  ETH/DOGE readback, `PAPERSIGNAL-01` for PAPER signal display-to-execution
  parity, and `WALLETBAL-01` for intermittent dashboard wallet account-balance
  display. These are separate one-task iterations; `BOTMULTI-09` remains
  blocked at manual production workflow dispatch.
- 2026-05-03 engineering documentation system-map foundation `DOCMAP-01` is
  closed locally. Existing architecture/module docs were preserved as the
  source of truth, while new traceability docs now connect product features to
  frontend routes, API routes, services/modules, Prisma models, workers,
  pipelines, tests, deployment docs, and known documentation drift. New
  entrypoints: `docs/index.md`,
  `docs/analysis/documentation-inventory.md`,
  `docs/architecture/codebase-map.md`,
  `docs/architecture/traceability-matrix.md`, `docs/pipelines/index.md`,
  `docs/modules/index.md`, `docs/analysis/documentation-drift.md`, and
  `docs/CONTRIBUTING-DOCS.md`. No runtime behavior changed. Evidence:
  `docs/planning/docmap-01-engineering-documentation-system-map-task-2026-05-03.md`.
- 2026-05-03 final system functionality remediation planning is queued as
  `SYSFINAL-2026-05-03`. The consolidated master plan is now the execution
  path for final confidence: first synchronize stale active planning truth,
  then build the current route/API/function inventory, run repository and
  production confidence gates, audit every current user-facing workflow, convert
  evidence-backed discrepancies into tiny `SYSFIX-*` tasks, and close with
  production smoke. Stage remains deferred to V2 by operator decision, and
  `BOTMULTI-*` stays deferred until the current V1 production system is fully
  re-audited. Plan:
  `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
- 2026-05-03 `SYSFINAL-00` is closed. Active planning truth is synchronized
  before the final function audit: `RUNTIME-SIGNAL-VOTES-01` is no longer
  waiting for deploy smoke because production evidence confirmed API freshness
  on `26962ea1dbb0981d3885779d01e58485d7e9fd6c`, `/health=ok`,
  `/ready=ready`, active runtime session `RUNNING`, and concrete guardrail
  reasons instead of unexplained `matched=true` + `No votes` drift. Duplicate
  `V1BOT-SIGNALS-02` and older `V1FINAL/V1EXCEL` open-looking entries are
  historical/superseded carryover, not current V1 blockers. `SYSFINAL-01`
  is now the next executable task.
- 2026-05-03 `SYSFINAL-01` is closed locally. The current route/API/function
  inventory now maps V1 web route families and API families to backend owners,
  data sources, expected UI states, auth boundaries, validation methods,
  redirect-only compatibility routes, and explicit V2/deferred exclusions.
  Evidence:
  `docs/planning/sysfinal-01-current-function-inventory-task-2026-05-03.md`.
  `SYSFINAL-02` is now the next executable task.
- 2026-05-03 `SYSFINAL-02` is closed locally. Repository baseline gates are
  green before product/security/runtime audits: guardrails, docs parity, lint,
  API+web typecheck, full API tests, full web tests (`141` files / `399`
  tests), and workspace build all passed. No `SYSFIX-*` task is required from
  the baseline. Evidence:
  `docs/planning/sysfinal-02-repository-baseline-gates-task-2026-05-03.md`.
  `SYSFINAL-03` is now the next executable task.
- 2026-05-03 `SYSFINAL-03` is closed locally. Auth/session/security and
  permission surfaces are green across focused API and web verification:
  API security pack (`14` files / `75` tests), web auth/profile/admin pack
  (`8` files / `28` tests), `pnpm audit`, and repository guardrails all passed.
  No `SYSFIX-*` task is required. Evidence:
  `docs/planning/sysfinal-03-auth-session-security-audit-task-2026-05-03.md`.
  `SYSFINAL-04` is now the next executable task.
- 2026-05-03 `SYSFINAL-04` is closed locally. Dashboard and bot runtime truth
  are green across focused API runtime/readiness tests, sequential DB-backed
  runtime e2e tests, and focused web runtime parity tests. Validation PASS:
  API runtime/readiness pack (`14` files / `113` tests), DB runtime e2e pack
  (`7` files / `33` tests), web runtime pack (`14` files / `59` tests), and
  repository guardrails. No `SYSFIX-*` task is required. Evidence:
  `docs/planning/sysfinal-04-dashboard-bot-runtime-truth-audit-task-2026-05-03.md`.
  `SYSFINAL-05` is now the next executable task.
- 2026-05-03 `SYSFINAL-05` is closed locally. Order and position workflows are
  green across focused lifecycle/pre-trade tests, sequential DB-backed
  order/position e2e tests, and focused web manual-order/open-order/close
  tests. Validation PASS: lifecycle/pre-trade pack (`14` files / `116`
  tests), DB order/position e2e pack (`7` files / `42` tests), web trading
  workflow pack (`8` files / `24` tests), and repository guardrails. No
  `SYSFIX-*` task is required. Evidence:
  `docs/planning/sysfinal-05-order-position-workflows-audit-task-2026-05-03.md`.
  `SYSFINAL-06` is now the next executable task.
- 2026-05-03 `SYSFINAL-06` is closed locally. Configuration workflows are green
  across focused API and web validation for API keys, wallets, markets,
  strategies, and bot wallet-first setup/runtime scope. Validation PASS: API
  config pack (`16` files / `130` tests), web config pack (`11` files / `52`
  tests), and repository guardrails. No `SYSFIX-*` task is required. Evidence:
  `docs/planning/sysfinal-06-configuration-workflows-audit-task-2026-05-03.md`.
  `SYSFINAL-07` is now the next executable task.
- 2026-05-03 `SYSFINAL-07` is closed locally. Backtests, reports, logs,
  route-reachable i18n, and key UX/a11y/responsive coverage are green across
  focused API and web validation. Validation PASS: API backtest/report pack
  (`13` files / `94` tests), DB backtest/logs e2e pack (`2` files / `17`
  tests), web product/UX/i18n/a11y/responsive pack (`12` files / `33` tests),
  route-reachable i18n audit (`0` findings), and repository guardrails. No
  `SYSFIX-*` task is required. Evidence:
  `docs/planning/sysfinal-07-backtests-reports-logs-i18n-ux-audit-task-2026-05-03.md`.
  `SYSFINAL-08` is now the next executable task.
- 2026-05-03 `SYSFINAL-08` is closed locally. Review of `SYSFINAL-02..07`
  found no confirmed discrepancies requiring implementation, so the current
  `SYSFIX-*` queue is intentionally empty. Evidence:
  `docs/planning/sysfinal-08-empty-sysfix-queue-task-2026-05-03.md`.
  `SYSFINAL-09` is now the next executable task.
- 2026-05-03 `SYSFINAL-09` is closed locally, completing
  `SYSFINAL-2026-05-03`. No `SYSFIX-*` implementation tasks were required.
  Final validation PASS: repository guardrails, docs parity, lint, typecheck,
  full API tests, full web tests (`141` files / `399` tests), and workspace
  build. Public production smoke PASS: API `/health=ok`, `/ready=ready`, web
  root `200`, login page `200`, web build-info reports deployed
  `main@26962ea1dbb0981d3885779d01e58485d7e9fd6c`, and protected
  `/dashboard/bots` without token returns `401 Missing token`. Authenticated
  production dashboard/runtime smoke was unavailable without credentials and is
  not claimed. Evidence:
  `docs/planning/sysfinal-09-final-regression-production-smoke-closure-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-A` is now active after `SYSFINAL-09` satisfied the
  stable post-V1 confidence prerequisite. `BOTMULTI-01` is closed locally:
  architecture now freezes the post-V1 target as `1 bot = 1 wallet + 1 active
  symbol-group market scope + N enabled strategies`, keeps multi-market-group
  bots out of scope, requires manual-order ambiguity to fail closed, requires
  runtime merge trace to preserve primary strategy provenance, and keeps
  DCA/TTP/SL/TSL ownership position-scoped. Evidence:
  `docs/planning/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-02` audit is closed. The inventory found canonical
  candidates (`BotMarketGroup`, `MarketGroupStrategyLink`, and the merge
  helper) plus migration debt across direct `Bot.strategyId` /
  `Bot.symbolGroupId`, legacy `BotStrategy`, create/update DTOs, runtime
  topology, final-candle strategy evaluation, manual-order context, read
  projections, and web bot form/list surfaces. The user selected lower numeric
  strategy-link priority as canonical, the runtime merge reference now states
  that `1` is higher priority than `100`, and focused merge tests lock exit
  and directional tie-break behavior. `BOTMULTI-03` is now the next executable
  task. Evidence:
  `docs/planning/botmulti-02-legacy-compatibility-migration-audit-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-03` is closed. The canonical topology now has a
  database-level persistence boundary: migration
  `20260503013000_enforce_single_active_bot_market_group` fails closed if a bot
  already has multiple enabled `ACTIVE` `BotMarketGroup` rows, then creates the
  partial unique index `BotMarketGroup_one_active_scope_per_bot_idx` on
  `BotMarketGroup(botId)` for enabled `ACTIVE` rows. Prisma schema comments and
  architecture docs record that Prisma cannot express this partial index in the
  DSL, so the invariant is owned by manual migration SQL. `BOTMULTI-04` is now
  the next executable task. Evidence:
  `docs/planning/botmulti-03-canonical-topology-migration-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-04` is closed. Bot create/update API writes now accept
  optional ordered `strategies` payloads, validate duplicate/unknown/disabled
  primary strategy mixes fail-closed, persist multiple canonical
  `MarketGroupStrategyLink` rows under the single active `BotMarketGroup`, and
  keep `Bot.strategyId` as the primary compatibility projection without
  reviving legacy `BotStrategy` writes for multi-strategy payloads.
  `BOTMULTI-05` is now the next executable task. Evidence:
  `docs/planning/botmulti-04-api-write-multi-strategy-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-05` is closed. Runtime topology now loads the enabled
  canonical `MarketGroupStrategyLink` set under the one active
  `BotMarketGroup`, final-candle decision evaluates all interval-eligible
  strategies, and votes are merged through the existing deterministic runtime
  merge contract using link priority/weight. Direct `Bot.strategyId` remains a
  fallback only when no canonical enabled links exist. `BOTMULTI-06` is now the
  next executable task. Evidence:
  `docs/planning/botmulti-05-runtime-signal-merge-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-06` is closed. Runtime position automation now exposes
  the owning bot's enabled canonical strategy links and fails closed when a
  bot-managed position has no `position.strategyId` while multiple enabled
  links exist. This prevents fallback DCA/TTP/SL/TSL settings from acting on
  ambiguous multi-strategy position ownership, while reusing existing runtime
  skip telemetry. `BOTMULTI-07` is now the next executable task. Evidence:
  `docs/planning/botmulti-06-runtime-risk-lifecycle-ownership-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-07` is closed. Web bot create/edit now exposes primary
  strategy plus enabled additional strategies, submits canonical ordered
  `strategies[]` with primary-first priority, and prefills edit mode from
  runtime graph canonical strategy links when available. `BOTMULTI-08` is now
  the next executable task. Evidence:
  `docs/planning/botmulti-07-web-operator-multi-strategy-truth-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-08` is closed, completing the post-V1 BOTMULTI
  reintroduction wave locally. Closure validation PASS: API multi-strategy
  write and runtime topology/merge tests (`4` files / `51` tests), runtime
  lifecycle fail-closed tests (`31` tests), web bot form tests (`7` tests),
  API/web typecheck, route-reachable i18n audit (`0` findings), docs parity,
  and repository guardrails. No authenticated production smoke was claimed.
  Evidence:
  `docs/planning/botmulti-08-architecture-runtime-closure-task-2026-05-03.md`.
- 2026-05-03 `BOTMULTI-09` production release is in progress by operator
  request. Migration behavior is confirmed to be automatic on API redeploy
  when `API_AUTO_MIGRATE` is not `false`: `apps/api/Dockerfile` starts
  `node scripts/start-with-migrate.mjs`, which runs `prisma migrate deploy`
  before API boot and fails closed if migration execution fails. Local
  pre-release build, repository guardrails, and docs parity PASS. Candidate
  `f3aaa3dca6cf4d4b199372563886165638391a77` is committed and pushed to
  `origin/main`. Production promotion is blocked at workflow dispatch from the
  current environment: no `gh` CLI, no deploy hook secret, and the available
  GitHub connector tools do not expose `workflow_dispatch`. Production
  build-info still reports previous deployed SHA
  `26962ea1dbb0981d3885779d01e58485d7e9fd6c`; manual `Promote PROD`
  workflow dispatch is required to redeploy and run the migration startup path.
  Evidence:
  `docs/planning/botmulti-09-production-deploy-task-2026-05-03.md`.
- 2026-05-03 operator-reported LIVE imported-position ownership slice
  `LIVEIMPORT-01` is closed locally. The external takeover ownership index now
  follows the wallet-first bot contract by resolving the canonical LIVE API key
  from the assigned wallet before falling back to legacy `Bot.apiKeyId`, and it
  includes active canonical `BotMarketGroup` scopes in addition to the legacy
  primary symbol group. `EXCHANGE_SYNC` positions on old and newly attached
  markets can now rebind by exact `apiKeyId:symbol` proof without symbol-only
  guessing, while `AMBIGUOUS`, `MANUAL_ONLY`, and `UNOWNED` outcomes remain
  fail-closed. Validation PASS: focused ownership/takeover tests (`14/14`), API
  typecheck, API build, and repository guardrails. Evidence:
  `docs/planning/live-import-ownership-wallet-scope-task-2026-05-03.md`.

## 2026-05-02 V1 Prod-Only Release Scope Update
- 2026-05-02 operator-reported LIVE ETHUSDT DCA-first protection hardening
  `ETHDCA-01` is closed locally. Runtime position automation now hydrates
  durable DCA progress from persisted `Trade` lifecycle rows before evaluating
  DCA-first protection closes, including current-position rows and same
  bot/wallet/strategy/symbol replacement lifecycles cut off by the latest
  opposite-side close. Volatile runtime state loss or rebase can no longer
  undercount executed adds when a pending affordable DCA level should still
  block `TSL` / `SL`. Runtime position serialization now renders finite
  negative trailing-loss `TSL` state instead of hiding an armed loss-side stop.
  Validation PASS: focused runtime automation and position
  serialization tests (`38/38`), API typecheck, API build, and repository
  guardrails.
  Evidence:
  `docs/planning/ethdca-01-live-dca-first-tsl-hardening-task-2026-05-02.md`.
- 2026-05-02 runtime signal vote recovery slice
  `RUNTIME-SIGNAL-VOTES-01` is closed with production verification. The
  final-candle runtime decision path now asks the engine
  market-data gateway for an indicator-ready candle series before strategy
  evaluation, so short runtime buffers can be topped up from the approved
  exchange-owned Binance public kline recovery path before a strategy vote is
  merged. Runtime candles remain authoritative on fallback overlap, the
  dashboard/read-model path reuses the same merge helper, and no pre-trade,
  wallet, max-position, exchange-min-order, or orchestrator guardrail was
  bypassed. Stale no-vote decisions no longer donate their `No votes` reason
  to recovered configured snapshots. A follow-up guardrail-visibility patch now
  includes latest `PRETRADE_BLOCKED` events in symbol-stats so matched
  conditions stopped by runtime guardrails show a concrete block reason instead
  of degrading to configured fallback. Production smoke confirmed API freshness
  on `26962ea1dbb0981d3885779d01e58485d7e9fd6c`, `/health=ok`,
  `/ready=ready`, active session `RUNNING`, and concrete guardrail reasons for
  matched rows instead of unexplained `No votes`. Validation PASS: focused runtime
  market-data/runtime loop/read model tests (`4` files / `56` tests), focused
  blocked-decision read-model tests (`2` files / `8` tests), API typecheck,
  API build, and repository guardrails. Evidence:
  `docs/planning/runtime-signal-vote-recovery-audit-plan-2026-05-02.md`.
- 2026-05-02 operator-reported runtime signal vote audit queued
  `RUNTIME-SIGNAL-VOTES-01` as P0. Authenticated production read-only evidence
  showed active PAPER `Peper bot` rows with concrete matched RSI conditions but
  no accepted runtime signal: `DOGEUSDT` exposed `RSI(14) 78.6959 > 51` with
  `matched=true`, yet the same row reported `lastSignalDirection=null`,
  `lastSignalReason=No votes`, and `totalSignals=0`; session
  `122f6846-2f8c-4ee6-bfee-9d2621f29c96` had `eventsCount=213` and
  `lastSignalAt=null`. Local probing with 150 fresh Binance Futures
  `DOGEUSDT` `5m` candles and the same `RSI 45/55` strategy returned `LONG`,
  so the suspected root is parity drift between dashboard/read-model candle
  recovery and the actual final-candle runtime decision path. Plan:
  `docs/planning/runtime-signal-vote-recovery-audit-plan-2026-05-02.md`.
- 2026-05-02 runtime signal and market-stream recovery slice
  `V1BOT-SIGNALS-02` is closed. Condition lines now expose canonical
  `matched=true|false|null` truth for operator display, Redis market-stream
  publisher failures retry instead of permanently dropping events, Binance
  USD-M Futures market streams use the routed `/market/ws` endpoint, and
  production readiness fails closed when required Redis is unreachable.
  Production Redis AOF recovery completed from a backed-up volume, and
  post-recovery authenticated SSE emitted real candle/ticker events. Validation
  PASS: focused market-stream/runtime read-model tests (`50/50`), focused
  Binance stream/fanout/subscription tests (`15/15`), readiness tests (`9/9`),
  API typecheck, web typecheck, API build, and repository guardrails. Evidence:
  `docs/planning/v1bot-signals-runtime-truth-2026-05-02.md`.
- 2026-05-02 production dashboard signal recovery follow-up `DASHSIGNALS-02`
  is closed. The runtime symbol-stats read path now attempts indicator data
  recovery before emitting unavailable values: short in-memory candle histories
  are topped up from the approved fallback kline path, merged by `openTime`,
  and runtime candles remain authoritative on overlap. This means `n/a`
  remains only a final fail-closed display state when recovery still cannot
  produce a valid indicator value. No order execution, position automation, or
  trading mutation behavior changed. Validation PASS: focused backend signal
  recovery/read-model tests (`7/7`), API typecheck, repository guardrails, and
  API build. Production readback after deploy confirmed no raw `n/a`, no
  pending indicator labels, and concrete visible `RSI(14)` values for active
  dashboard signal cards. Evidence:
  `docs/planning/dashsignals-02-indicator-recovery-before-unavailable-task-2026-05-02.md`.
- 2026-05-02 production dashboard signal-card follow-up `DASHSIGNALS-01` is
  closed. Authenticated production evidence showed runtime condition cards
  rendering unavailable RSI operands as misleading expressions such as
  `n/a < 20` and `n/a > 80`. The fix keeps runtime fail-closed behavior while
  separating unavailable indicator input from normal false condition matches:
  unavailable operands are display-unknown, concrete snapshot values are
  preferred over stale latest-decision `n/a` payloads when available, and
  Dashboard Home / Bot Monitoring render localized pending-data text instead
  of raw `n/a` math. No order execution, position automation, persistence, or
  trading mutation behavior changed. Validation PASS: focused API
  signal/read-model tests (`5/5`), focused web dashboard/bot signal tests
  (`32/32`), API typecheck, web typecheck, repository guardrails, lint,
  route-reachable i18n audit, API build, and web build. Evidence:
  `docs/planning/dashsignals-01-indicator-value-pending-display-task-2026-05-02.md`.
- 2026-05-02 production dashboard display follow-up `DASHDISPLAY-01` is
  closed. Authenticated read-only review of
  `https://soar.luckysparrow.ch/dashboard` found two visible dashboard polish
  regressions plus one hidden DOM text leak: Manual Order `Min qty` and
  `Qty slider` could visually collide, long runtime History/trade pills could
  wrap into tall badges, and the hidden dashboard breadcrumb spacer exposed
  `__dashboard-spacer__` in rendered text. The fix is presentation-only and
  does not change trading/runtime/API behavior. Validation PASS: focused web
  dashboard/title pack (`29/29`), web typecheck, repository guardrails, and web
  build. Evidence:
  `docs/planning/dashdisplay-01-prod-dashboard-display-polish-task-2026-05-02.md`.
- Operator decision: V1 release evidence is production-only for now; a separate
  stage environment is deferred to V2 when a dedicated VPS is available.
- Stage absence is no longer a V1 blocker. Gate 4 signoff is approved with
  Patryk Wroblewski as Engineering, Product, Operations, and RC owner.
  Production restore evidence and non-dry-run production release/post-deploy
  smoke evidence are now fresh and passing.
- Dependency audit hardening closed in `V1SEC-01`; `pnpm audit` reports no
  known vulnerabilities after Next/Tailwind/Vitest toolchain updates and
  centralized patched transitive dependency overrides.
- 2026-05-02 final prod evidence: Coolify production DB restore drill PASS in
  Postgres container `x11cfnz1dd9x0yzccftqzcoe`; rollback proof PASS; final
  non-dry-run production release gate PASS with readiness `ready`. Evidence:
  `docs/operations/v1-restore-drill-prod-2026-05-02T17-49-41-000Z.md`,
  `docs/operations/v1-rollback-proof-prod-2026-05-02T17-54-13-498Z.md`, and
  `docs/operations/v1-release-gate-prod-2026-05-02T17-56-17-239Z.md`.
- 2026-05-02 post-V1 quality follow-up: `AWESOME-01` is queued as the master
  product-quality audit program. It will verify every user-facing workflow,
  frontend-backend contract, runtime truth surface, data invariant, security
  boundary, UX state, and production-runtime check before any further polish
  fixes are planned. Master plan:
  `docs/planning/awesome-audit-master-plan-2026-05-02.md`.
- 2026-05-02 post-V1 quality audit result: `AWESOME-01` completed with
  `docs/operations/awesome-audit-execution-report-2026-05-02.md`. No
  user-facing product/runtime/security/production public-smoke blocker was
  found. The only QA reliability follow-up, `AWESOME-FIX-01`, is now closed:
  `apps/api/src/modules/positions/importedPositionHistoryHydrator.service.test.ts`
  cleanup removes dependent rows before users, restoring a clean focused test
  signal for imported position history hydration and a green full API suite.

## Product Snapshot
- Name: CryptoSparrow / Soar
- Goal: deliver a crypto-trading operations platform with backtest, paper, and
  live execution support, operator dashboards, and a path toward assistant or
  agent-driven workflows
- Commercial model: SaaS-style subscription product with staged entitlements
- Current phase: V1 production-only release evidence is `GO` as of
  `V1CLOSEOUT-11` on 2026-05-02. Stage is intentionally deferred to V2 by
  operator decision, and the older `V1FINAL-01` / `V1EXCEL` `NO-GO` wording is
  historical pre-closeout evidence rather than current release status. The
  current repository truth is that the
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
  REST snapshots instead of exchange-boundary event handling. That approved
  `V1LIVE-A` hardening wave is now fully closed: it kept `PAPER`
  exchange-free, kept all `LIVE` work inside the approved exchange boundary,
  forced adapter selection to follow the exact user/bot `exchange +
  marketType` settings, and closed the full path `signal -> order -> exchange
  update -> position -> takeover/runtime visibility` under one canonical
  contract. The first completed adapter family in that wave is `BINANCE +
  SPOT` and `BINANCE + FUTURES`; it is not a hidden default for all future
  live execution. The newest post-V1 production hotfix slice
  (`V1FIX-2026-04-26-A`) additionally recovers manual order open lifecycle
  truth when a same-symbol open position already exists: manual same-direction
  fills now update and link the existing open position instead of crashing on
  the historical partial unique open-position index, while reverse-direction
  opens fail closed with an explicit domain error instead of a raw `500`.
  The newest repository hardening slice (`V1FIX-2026-04-26-C`) closes one
  deeper canonical-scope gap discovered only after real-account browser
  verification on production: manual-order open-position conflict and reuse
  logic is now wallet- or bot-scoped instead of globally keyed by
  `userId + symbol`, and the DB uniqueness contract is migrated to the same
  scoped truth so `LIVE` and `PAPER` bots can hold the same symbol
  independently when they belong to different canonical wallets. The newest
  web-side production hardening slice (`V1LIVE-PROD-2026-04-26-A`) then proved
  the remaining real-account blocker was a stale manual-order UI context race,
  not a backend execution failure: after bot or symbol changes, the dashboard
  could still prioritize a previous-symbol `manualOrderContext` price and send
  the wrong submit price for the current symbol. `useManualOrderController`
  now trusts context price only when it matches the current `botId + symbol`
  selection, preserving the approved canonical architecture where one current
  selected bot and one current selected symbol define manual-order truth. The
  newest approved post-V1 hardening direction is no longer basic open/close
  execution correctness, but canonical close-attribution truth. A fresh audit
  on 2026-04-27 confirmed the repository can already close positions through
  app commands, bot lifecycle, exchange events, and reconciliation, yet still
  lacks one persisted, architecture-backed model for who or what initiated the
  close. The approved next wave `V1CLOSE-A` now freezes a two-dimensional close
  contract: `closeReason` remains the lifecycle reason, while a new canonical
  `closeInitiator` distinguishes `BOT_APP`, `USER_APP`, `USER_EXCHANGE`,
  `EXCHANGE`, and `SYSTEM_REPAIR` so operator history, repair flows, and
  exchange-manual-close detection stop guessing from orphan states and logs.
  That wave is now fully closed as well: persistence now carries canonical
  close attribution on `Position`, `Order`, and `Trade`, runtime/exchange/
  reconcile/repair write paths reuse one shared attribution mapper, and
  dashboard/runtime history surfaces render persisted close authorship instead
  of reconstructing it from `syncState` or audit logs.

## Product Decisions (Confirmed)
- 2026-05-02: closed `V1CLOSEOUT-08..10` from the V1 closeout audit
  remediation queue. RC artifacts now agree with blocked signoff truth:
  Gate 1, Gate 2, and Gate 3 are PASS, while Gate 4 is OPEN until final
  approver names and approval are present. Fresh closeout evidence records an
  explicit operational `NO-GO`: local restore drill PASS, stage/prod restore
  wrappers FAIL because target DB container env vars are unavailable in the
  current execution context, and stage/prod release gates remain dry-run
  `not_ready`. Exchange-boundary conformance for the audited surfaces is
  remediated by moving Binance public REST URL/fetch ownership and Binance
  API-key probe client bootstrap into `modules/exchange`; backtest, runtime
  fallback, runtime signal market-data, and profile API-key probe consumers now
  use exchange-owned seams. Evidence:
  `docs/operations/v1-closeout-evidence-refresh-2026-05-02.md`; focused
  exchange/backtest/runtime/profile tests PASS (`15/15`), runtime loop/pnl
  pack PASS (`45/45`), and API typecheck PASS. Remaining closeout work is
  `V1CLOSEOUT-11`: publish the final V1 go/no-go closure pack, currently
  expected to remain `NO-GO` unless missing Gate 4 approvals and stage/prod
  target evidence are provided.
- 2026-05-02: closed `V1CLOSEOUT-11` with final V1 closeout status `GO`.
  Repository validation is green after remediation (`quality:guardrails`,
  `docs:parity:check`, `lint`, `typecheck`, full API tests, full web tests,
  and `build` all PASS). Follow-up production evidence cleared the remaining
  V1 blockers: Gate 4 is approved, production restore drill is PASS, rollback
  proof is PASS, and the non-dry-run production release gate is `ready`. Stage
  is deferred to V2 by operator decision. Evidence:
  `docs/operations/v1-final-go-no-go-closure-2026-05-02.md`.
- 2026-05-02: closed `V1CLOSEOUT-01..07` from the V1 closeout audit
  remediation queue. The API closeout packet is green again after aligning
  stale external-management fixtures to the canonical `Bot.manageExternalPositions`
  authority, fixing positive advanced TSL parser parity for backtests/runtime
  display, repairing runtime session trade scoping for direct bot trades and
  imported open anchors, and keeping pre-arm dynamic TSL display fail-closed.
  Docs parity now resolves the canonical dashboard route map under
  `docs/architecture/reference/dashboard-route-map.md` and includes the
  `web-shared` feature deep-dive. Evidence: `pnpm --filter api run typecheck`
  PASS; focused API closeout pack PASS (`8` files / `91` tests);
  `pnpm --filter api run test -- --run` PASS; `pnpm run docs:parity:check`
  PASS; `pnpm run quality:guardrails` PASS. Remaining closeout blockers start
  at `V1CLOSEOUT-08`: RC/release evidence, production restore drill, stage/prod
  evidence freshness, and exchange-boundary architecture remediation.
- 2026-05-02: queued `V1CLOSEOUT-AUDIT-A` after a full V1 closeout audit
  requested before implementation. The audit confirms V1 is not ready to close
  yet: full web tests, typecheck, build, guardrails, and route-reachable i18n
  are green, but docs parity fails on a stale dashboard route-map path and the
  API suite has focused-reproducible runtime/LIVE failures in wallets,
  lifecycle close parity, bots runtime monitoring, orders/positions
  exchange-sync visibility and close flow, and orphan repair rebinding. Release
  gates also remain blocked by stale activation evidence, failed production
  restore-drill wrapper configuration, stage target uncertainty, and RC
  signoff/checklist disagreement. Canonical remediation packet:
  `docs/planning/v1closeout-audit-remediation-plan-2026-05-02.md`.
- 2026-05-02: closed `V1RUNTIME-TRUST-03`, implementing the two immediate
  follow-ups from `V1BOT-AUDIT-02`. Runtime Positions now passes valid
  fallback ticker prices into the existing preferred price resolver for
  open-position `markPrice` when runtime/stat price truth is missing, while
  preserving exchange-sync freshness precedence and leaving live close command
  semantics unchanged. Dashboard Home and Bot Monitoring now reset
  symbol-keyed stream prices on selected runtime context boundaries, and Bot
  Monitoring opens market SSE only for `RUNNING` runtime contexts. Validation
  PASS: focused API runtime PnL fallback test (`2/2`), focused web runtime
  tests (`7/7`), API typecheck/build, web typecheck/build, and repository
  guardrails. Evidence:
  `docs/planning/v1runtime-operator-trust-hardening-task-2026-05-02.md`.
- 2026-05-02: completed `V1BOT-AUDIT-02`, the second runtime/dashboard
  operator-trust audit after `V1SURF-02`. The top backend finding is that
  `runtimeSessionPositionsRead.service.ts` already fetches fallback ticker
  prices for symbols without runtime/stat price truth, but the open-position
  `markPrice` resolver still receives only `runtimeStatPriceBySymbol`
  candidates. The top web finding is that stream prices are now correctly
  highest precedence but their symbol-keyed maps are not reset on every
  selected runtime/status/filter context change, and Bot Monitoring stream
  eligibility is broader than Dashboard Home. Close/cancel command paths
  remain backend guarded with `riskAck` and ownership/actionability checks.
  `V1PRICE-04` and `V1SURF-03` are now queued as the next tiny hardening
  slices. Evidence:
  `docs/planning/v1bot-runtime-operator-trust-audit-2026-05-02.md`.
- 2026-05-02: closed `V1SURF-02`, the implementation follow-up from
  `V1BOT-AUDIT-01`. Bot Monitoring and Dashboard Home now share one web
  runtime open-position derivation helper for stream-first `markPrice`, live
  PnL, margin percent, DCA, and `TTP`/`TSL` display. Dashboard summary KPIs now
  reuse the same selected-bot live unrealized value as the open-position table
  for `summary.unrealized`, `paperDelta`, `paperEquity`, and selected `net`.
  Validation PASS: focused web derivation/component tests (`9/9`), web
  typecheck, web build, and repository guardrails. Evidence:
  `docs/planning/v1surf-02-shared-runtime-position-derivation-task-2026-05-02.md`.
- 2026-05-02: completed `V1BOT-AUDIT-01`, a read-only consistency audit across
  bot runtime API truth, `Dashboard -> Bots -> Monitoring`, and
  `Dashboard Home -> Runtime`. The API runtime read-model shape is now
  internally aligned around the aggregate/session positions and symbol-stats
  contracts, including the shared exchange-sync price preference introduced by
  `V1DOGE-03`. The next code risk is frontend drift: Bot Monitoring and
  Dashboard Home still maintain separate live open-position derivations, and
  Dashboard summary KPIs can mix selected-bot stream PnL with snapshot PnL for
  paper delta/equity. `V1SURF-02` is now the next tiny READY slice to share the
  web derivation contract and lock parity with focused tests. Evidence:
  `docs/planning/v1bot-runtime-dashboard-audit-2026-05-02.md`.
- 2026-05-02: closed `V1DOGE-03`, an operator-reported `LIVE DOGEUSDT SHORT`
  protection hotfix. The dashboard could show exchange-sync PnL already below
  the visible `TTP` protected floor while runtime automation still evaluated a
  stale runtime price candidate. The runtime close path now reuses the same
  runtime-versus-exchange-sync price preference contract as the dashboard read
  model: imported `LIVE EXCHANGE_SYNC` positions prefer exchange-derived price
  from fresh `unrealizedPnl` whenever reconciliation is newer than the runtime
  tick. Focused regression coverage proves DOGE `SHORT` closes through
  `closeByExitSignal` with `trailing_take_profit` under that freshness shape,
  and also locks `TP`, `SL`, and `TSL` on the same price-truth contract.
  A follow-up dashboard-home derivation fix restores live market-stream
  precedence over API snapshots for visible open-position PnL, so percentages
  refresh when market data arrives. Validation PASS: focused runtime
  regression, related runtime/read-model pack (`40/40`), API typecheck,
  focused web derivation test (`3/3`), web typecheck, web build, and
  guardrails. Production deploy/readback remains the next
  operational evidence step. Evidence:
  `docs/planning/v1doge-ttp-exchange-sync-price-task-2026-05-02.md`.
- 2026-05-02: closed `V1MARKET-03`, the remaining operator-reported market edit
  blocker for a `LIVE` bot-linked market universe. Production smoke with user
  approval proved that disabling `live` moved its canonical `ETH` market group
  to `PAUSED`, but editing `ETH` still failed because active `Peper bot` had a
  stale legacy `BotStrategy` row pointing at `ETH Group` while its current
  canonical market scope is `Meme coins`. The market universe active-use guard
  now follows singular bot truth and blocks only active current primary or
  canonical bot market scope; stale legacy `BotStrategy` links no longer block
  edits after the real linked bot is deactivated. Validation PASS: markets e2e
  (`15/15`), bots runtime-scope e2e (`10/10`), API typecheck, and repository
  guardrails. Post-deploy verification found that web build-info had advanced
  to `8a433e07` while the `soar-api` container was still serving `6bc7840a`;
  after redeploying `soar-api` to `8a433e07`, `/health` and `/ready` returned
  `200` and the approved `LIVE` smoke passed end-to-end: disable `live`, edit
  linked `ETH` by adding `BTCUSDT`, restore the original whitelist, and
  re-enable `live`, all `200 OK`. Final production state: `live.isActive=true`
  and `ETH` whitelist restored to `BNBUSDT,DOGEUSDT,ETHUSDT,XRPUSDT`.
  Evidence:
  `docs/planning/v1market-03-ignore-stale-legacy-market-guard-task-2026-05-02.md`.
- 2026-05-02: production Redis investigation for `V1BOT-SIGNALS-02` confirmed
  the Soar Redis resource in Coolify is `restarting:unhealthy` because Redis
  repeatedly fails to load a corrupted append-only increment file. This
  explains the post-deploy authenticated smoke blocker where login timed out or
  returned rate-limit degradation while public `/health` and `/ready` still
  looked green. API readiness now includes required Redis `PING` in production,
  and operations docs now include Redis AOF recovery plus Redis-aware
  post-deploy smoke criteria. The production Redis volume was backed up and
  repaired with `redis-check-aof --fix`; Redis returned to `running:healthy`,
  authenticated login passed, and production SSE emitted real Binance FUTURES
  ticker/candle events. Readiness hardening deploy/readback remains the final
  closure gate for `V1BOT-SIGNALS-02`.
- 2026-05-02: closed `V1MARKET-02`, an operator-reported follow-up to the
  deactivated-bot market edit fix. The market universe form no longer uses the
  volume-filtered automatic result as the source for whitelist/blacklist
  dropdown options. Manual selection now uses the full Binance catalog for the
  selected exchange, market type, and base currency, while the preview/result
  contract remains `(volume-filtered catalog U whitelist) - blacklist`.
  Market option checkboxes also expose symbol labels for accessible selection.
  Validation PASS: focused market form component test (`8/8`), web typecheck,
  web build, and repository guardrails. Evidence:
  `docs/planning/v1market-02-whitelist-catalog-selection-task-2026-05-02.md`.
- 2026-05-02: closed `V1MARKET-01`, an operator-reported market-edit
  regression after the earlier inactive-bot market sync fix. Deactivating a
  bot now also moves its enabled non-archived canonical market groups to
  `PAUSED`, and reactivating restores them to `ACTIVE`, so stale canonical
  group lifecycle state can no longer behave like a second active-bot guard
  against editing linked market universes. The existing inactive-bot runtime
  graph mapping behavior is preserved for bots that were created inactive and
  did not go through a deactivation transition. Validation PASS: focused
  markets e2e (`14/14`), bots runtime-scope e2e (`10/10`), bots duplicate
  guard e2e (`4/4`), API typecheck, and repository guardrails. Evidence:
  `docs/planning/v1market-01-deactivated-bot-market-edit-task-2026-05-02.md`.
- 2026-05-02: added `V1BOT-SIGNALS-02` after an operator-reported production
  concern that `Dashboard -> Markets / Signals` appeared to show satisfied
  conditions while the PAPER bot did not open positions. Authenticated
  production read-only evidence showed the current PAPER session was `RUNNING`
  but had only `eventsCount=1` and `symbolsTracked=0`; market-stream SSE also
  connected but emitted no sampled ticker/candle events during the smoke
  window. The dashboard condition payload now carries per-rule `matched`
  truth from the canonical runtime strategy evaluator, so configured fallback
  snapshots can distinguish `PASS`/`MISS` from accepted runtime signals. The
  market-stream Redis publisher also resets failed memoized connection state
  after connect/publish failures so a transient Redis startup miss cannot
  permanently mute market events until worker restart. Follow-up websocket
  smoke found the remaining production-equivalent blocker: Binance USD-M
  Futures no longer delivers regular market streams from legacy
  `wss://fstream.binance.com/ws`; the worker now uses the routed
  `wss://fstream.binance.com/market/ws` endpoint that emitted futures kline
  data in local vendor smoke. Validation so far: focused market-stream/runtime
  read-model tests (`50/50`), focused Binance stream/fanout/subscription tests
  (`15/15`), API typecheck, web typecheck, API build, and repository
  guardrails. Production SSE event smoke remains required after deploy.
  Evidence:
  `docs/planning/v1bot-signals-runtime-truth-2026-05-02.md`.
- 2026-05-02: closed `V1BACKTEST-01`, an operator-reported production
  backtest investigation after recent PAPER/LIVE runtime changes. Safe
  production smoke reproduced a mode-specific data problem: `FUTURES` run
  `d92219d3-ae5a-480f-ae35-1293e87339bf` failed with
  `NO_CANDLES_AVAILABLE_FOR_SYMBOL` and `totalTrades=0`, while comparable
  `SPOT` run `553a5c1a-66a9-4c70-be20-6c044cb11010` completed with
  `totalTrades=2`. The backtest gateway now keeps `/fapi/v1/klines` as primary
  but retries Binance USD-M futures chunks through `/fapi/v1/continuousKlines`
  before classifying a futures symbol as candle-empty, preserving venue truth
  and avoiding hidden SPOT/FUTURES substitution. Commit review from the last
  three days found direct backtest impact in `a7c0a357` (TSL negative-start
  plus step semantics) and `fbeae8f0` (backtest e2e V1 alignment); stale replay
  test data was aligned to the new TSL contract. Validation PASS: backtest
  gateway test (`3/3`), replay core (`25/25`), backtests e2e (`14/14`), API
  typecheck, API build, and repository guardrails. Evidence:
  `docs/planning/v1backtest-01-futures-kline-fallback-task-2026-05-02.md`.
- 2026-05-02: closed `DPL-PROD-BUILDINFO-01`, a production promotion hardening
  fix after an observed Coolify push deploy lag required an empty retrigger
  commit. The canonical `Promote PROD` workflow now waits for public web
  `/api/build-info` to expose the promoted `github.sha` before runtime
  freshness gates run. Direct push-driven Coolify redeploys remain convenience
  behavior, not release evidence. Validation PASS: wait script help,
  production readback against active SHA, and repository guardrails. Evidence:
  `docs/operations/prod-web-build-info-gate-2026-05-02.md`.
- 2026-05-02: closed `V1BOT-CONDITIONS-01`, an operator-reported production
  dashboard/runtime read-model fix. After a stopped bot changes strategy and
  starts again, `Markets / Signals` no longer lets a superseded historical
  `SIGNAL_DECISION` payload dictate the displayed condition indicators; stale
  signal context now falls back to the current configured strategy until a
  fresh runtime decision exists. The related market-universe concern was
  regression-locked: inactive PAPER and LIVE bots both allow market edits and
  linked symbol-group sync. Production pre-smoke exposed an additional
  existing-older-strategy switch edge case; aggregate merge now keeps current
  configured fallback context ahead of superseded historical signal context
  when the restarted session has not emitted a fresh accepted signal yet.
  Production paper smoke also exposed the no-new-session-yet aggregate race;
  aggregate reads now prefer configured strategy display context, while
  session-specific reads preserve explicit runtime event attribution.
  Validation PASS: focused bots runtime-scope e2e (`10/10`), markets e2e
  (`13/13`), API typecheck, API build, and repository guardrails. Evidence:
  `docs/planning/v1bot-conditions-market-sync-2026-05-02.md`.
- 2026-05-02: added `V1I18N-01`, a complete Swiss German/German Switzerland
  locale rollout using the standards-compliant `de-CH` locale code for the
  operator-requested `CH_BE` language. The shared web i18n contract now
  supports `de-CH` in locale storage, provider hydration, namespace registry,
  route loading, Intl formatting, security bootstrap allow-list, all namespace
  translation files, and the shared language switcher with a CH flag option.
  Existing stronger parity checks also exposed and fixed Portuguese
  dashboard-home namespace drift. Validation PASS: focused i18n/UI tests
  (`22/22`), web typecheck, web build, repository guardrails, and
  route-reachable i18n audit with `findings=0`. Evidence:
  `docs/planning/v1i18n-01-swiss-german-locale-task-2026-05-02.md`.
- 2026-05-01: fixed `V1UI-FLAG-01`, an operator-reported footer language
  switcher flag regression. Commit review from `2026-05-01 09:00` found no
  post-09:00 commit directly touching footer or language switcher ownership, so
  the existing shared `LanguageSwitcher` contract was preserved and hardened:
  GB/PL/PT flags now render as visual CSS flag badges instead of
  regional-indicator text, and both public and dashboard footer tests assert
  the active footer flag remains visible without text content.
  Validation PASS: focused footer/language switcher tests (`5/5`), web
  typecheck, web build, repository guardrails. Evidence:
  `docs/planning/v1ui-flag-01-footer-language-flags-regression-task-2026-05-01.md`.
- 2026-05-01: fixed `V1DCA-05` after authenticated production verification on
  deployed `15cddb5a` proved the remaining `ETHUSDT DCA=0` regression was a
  restarted-session read-model gap, not a missing migration. The current
  runtime session started at `2026-05-01T17:11:21.540Z`, while the continuing
  imported ETH lifecycle had DCA rows in the prior session at
  `2026-05-01T03:20:19.592Z` and `2026-05-01T13:13:43.493Z`. Runtime
  `Positions` now reconstructs open imported lifecycle DCA from the earlier of
  bot creation and session start, bridges through same-ownership historical
  position ids for legacy DCA rows that lost both bot and wallet refs, includes
  legacy `LIVE` bot-scoped `walletId=null` trades, and preserves close/reopen
  stale-DCA boundaries. Validation PASS: focused imported DCA API e2e (`6/6`),
  API typecheck, API build, repository guardrails, diff check. Evidence:
  `docs/planning/v1dca-05-restarted-session-imported-dca-read-model-task-2026-05-01.md`.
- 2026-05-01: fixed `V1DCA-04` after the operator confirmed ETH still showed
  `DCA=0` despite two real DCA adds after the web monitoring hotfix. The
  remaining issue was the API runtime positions read model: wallet-scoped
  imported/exchange-sync DCA trade rows with missing `botId` and/or
  `strategyId` were excluded from supplemental DCA continuity. The read model
  now includes those rows for owned external symbols and keeps the existing
  close/reopen boundary that prevents stale DCA from crossing into a fresh
  lifecycle. Validation PASS: focused imported DCA API e2e (`5/5`), API
  typecheck, API build, repository guardrails. Evidence:
  `docs/planning/v1dca-04-wallet-scoped-imported-dca-read-model-task-2026-05-01.md`.
- 2026-05-01: fixed `V1DCA-03`, an operator-reported dashboard regression after
  production deployed `fbeae8f08926bc838141d53397fc142f52945356`. The commit
  scan from 09:00 identified `fbeae8f0` as the only post-09:00 commit touching
  bot runtime/web monitoring. Its new portfolio-history refresh was coupled to
  the global monitoring error state; that optional panel now fails soft so it
  cannot mask valid runtime `Positions` DCA ladder content. Validation PASS:
  focused `BotsManagement` web test (`13/13`), web build, web typecheck,
  repository guardrails, production build-info on
  `19a62b8d20f7e14d2489bbd8a842ca9c0c558efb`, and public production deploy
  smoke. Evidence:
  `docs/planning/v1dca-03-monitoring-dca-visibility-regression-task-2026-05-01.md`.
- 2026-05-01: closed `BHIST-01` as the bot-scoped product follow-up after the
  wallet-ledger preview wave. Current repository truth now covers
  wallet-level performance summary, equity timeline, cashflow markers for LIVE
  wallets, and a selected-bot portfolio history surface that shows progress
  from active bot start to now with explicit `PAPER_RESET` and wallet-capital
  event markers. The implementation reuses wallet-ledger events for LIVE
  markers, reuses `paperResetAt` for PAPER checkpoint markers, and avoids a
  parallel accounting path. Evidence:
  `docs/planning/bhist-01-bot-portfolio-history-and-capital-events-task-2026-05-01.md`.
- 2026-05-01: introduced and expanded the V1 function coverage ledger so
  module-level confidence can be tracked without repeated ad-hoc retesting.
  The matrix records module, submodule, mode, layer, parent capability, child
  scenario, expected behavior, local evidence, production evidence, confidence,
  risk, priority, owner, next verification, and notes. The initial
  money-path/runtime/release-gate ledger had 33 rows; the second code-scan pass
  expanded it to 79 rows across the primary top-level API/web module surfaces.
  Current production status split: `PASS=17`, `PARTIAL=22`,
  `NEEDS_PROD_SAMPLE=9`, `NEEDS_PROD_UI_CHECK=12`, `NOT_VERIFIED=11`,
  `NOT_APPLICABLE=5`, `BLOCKED=2`, `FAIL=1`; priorities: `P0=45`,
  `P1=24`, `P2=10`. Evidence:
  `docs/planning/v1cover-01-function-coverage-ledger-task-2026-05-01.md`,
  `docs/planning/v1cover-02-code-scan-function-ledger-expansion-task-2026-05-01.md`,
  `docs/operations/v1-function-coverage-audit-2026-05-01.md`,
  `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`.
- 2026-05-01: classified the expanded V1 function ledger by implementation
  readiness. Current split: `READY=22`,
  `IMPLEMENTED_NEEDS_EVIDENCE=43`, `IMPLEMENTED_NOT_VERIFIED=11`,
  `V1_BLOCKER=3`, `REQUIRES_IMPLEMENTATION_REVIEW=0`. The current repository
  truth is that the ledger does not expose a broad missing implementation
  area; remaining V1 closure should prioritize release-gate blockers,
  live-money production evidence, manual operator matrix execution, targeted
  UI/route smokes, and explicit launch-scope/defer decisions. Evidence:
  `docs/planning/v1cover-03-function-implementation-readiness-task-2026-05-01.md`,
  `docs/operations/v1-function-implementation-readiness-audit-2026-05-01.md`.
- 2026-05-01: closed the remaining local `SUBS-ENTITLEMENTS-001` implementation
  slice through `V1SUBS-01`. LIVE bot create and `PAPER -> LIVE` mode switch
  now fail closed against the active subscription payload's
  `features.liveTrading` flag, using one shared subscription entitlement
  guard. Validation PASS: focused entitlement e2e (`5/5`), API typecheck, API
  build, repository guardrails. Evidence:
  `docs/planning/v1subs-01-live-entitlement-bot-write-guard-task-2026-05-01.md`.
- 2026-05-01: refreshed the local `V1UX` route-smoke evidence wave after
  earlier sandbox notes claimed focused Vitest was blocked. The App Router
  shell pack for profile, logs, exchanges redirect, wallet preview, reports,
  markets, strategies, backtests, bot preview, bot assistant, and route-locale
  smoke now passes locally (`18/18` files, `19/19` tests). Web typecheck, web
  build, and repository guardrails are also green. Evidence:
  `docs/planning/v1ux-01-operational-route-smoke-task-2026-05-01.md`,
  `docs/planning/v1ux-reports-01-route-shell-smoke-task-2026-05-01.md`,
  `docs/planning/v1ux-routes-02-canonical-crud-route-shell-smoke-task-2026-05-01.md`,
  `docs/planning/v1ux-bots-03-canonical-bot-preview-assistant-route-shell-task-2026-05-01.md`.
- 2026-05-01: promoted the function coverage/readiness ledger into a reusable
  project standard. Future projects can copy the standard column contract,
  status vocabulary, readiness buckets, task derivation rules, evidence quality
  rules, and release-gate rules from
  `docs/governance/function-coverage-ledger-standard.md` and
  `docs/governance/function-coverage-ledger-template.csv`. Soar's V1 matrix is
  now documented as a project-specific instance of that model. Evidence:
  `docs/planning/v1cover-04-model-function-ledger-standard-task-2026-05-01.md`.
- 2026-05-01: executed `V1FINAL-01` after production deployed
  `6a8ded9333eabced5e8461362e9e9237a9bf4e4d` on `main`. Gate 0 is now green:
  public and authenticated production smoke passed, protected runtime freshness
  passed with `runningCount=4`, rollback guard returned
  `shouldRollback=false`, and rollback proof was regenerated. The active
  `LIVE` `DOGEUSDT` runtime row now reports `dcaCount=0`, `tradesCount=1`, and
  `strategyAutomationContextResolved=true`, confirming the stale-DCA
  close/reopen regression no longer appears on the fresh open lifecycle. Final
  V1 remains `NO-GO/BLOCKED`: release-gate classification still reports stale
  activation audit/plan from `2026-04-22`, production restore drill failed due
  missing production DB container configuration in this execution context, the
  sign-off record is blocked by empty approver fields, manual operator/live
  exchange matrix is not complete, and stage remains `503`. Evidence:
  `docs/planning/v1final-01-prod-gate-execution-task-2026-05-01.md`,
  `docs/operations/v1-release-gate-prod-2026-05-01T02-44-00-227Z.md`.
- 2026-05-01: production deploy freshness advanced to the current local V1
  candidate `fbeae8f08926bc838141d53397fc142f52945356` on `main`. Public
  production smoke passed for API `/health`, API `/ready`, and web `/`. A fresh
  release-gate classification still reports `not_ready` because the activation
  audit and activation execution plan are stale, and the production
  backup/restore drill evidence remains failed. Stage still returns `503`, so
  this is a deploy-fresh production candidate, not a formal V1 GO. Evidence:
  `docs/operations/v1-release-gate-prod-2026-05-01T18-20-00-000Z.md`.
- 2026-05-01: published `V1DOGE-01` after the operator reported a real-money
  `LIVE DOGEUSDT` loss close and stale DCA on the next same-symbol open row.
  Protected production inspection confirmed the incident close was app-side
  automation (`closeReason=TSL`, `closeInitiator=BOT_APP`, realized PnL
  `-0.3500250000000007`) and the subsequent fresh `DOGEUSDT` open row showed
  stale `dcaCount=2` / executed levels `[-20,-40]` from the previous lifecycle.
  The audit identified two P0 implementation targets before further live-money
  confidence claims: preserve strategy identity on bot-managed close
  orders/trades, and make same-symbol close/reopen DCA/protection continuity
  fail closed. Evidence:
  `docs/operations/v1doge-live-close-and-reopen-audit-2026-05-01.md`.
- 2026-05-01: closed local implementation for `V1DOGE-02` after the DOGE audit.
  Runtime automated close now passes `strategyId` into the execution
  orchestrator, same-symbol runtime `Positions` continuity cuts stale DCA at
  close boundaries even when legacy close trades lack `strategyId`, and
  supplemental DCA remains scoped to the current bot/wallet/strategy/symbol
  lifecycle. DCA-first `SL/TSL` authority is now covered for affordable pending
  DCA versus explicitly exhausted DCA, and runtime telemetry records
  operator-visible DCA exhaustion plus close-decision snapshots. Validation
  PASS: focused runtime automation, position-management, imported DCA
  visibility, and futures market-data gateway packs. Task packet:
  `docs/planning/v1doge-02-runtime-close-reopen-hardening-task-2026-05-01.md`.
  Protected production verification is still required after deploy.
- 2026-05-01: published the final V1 test structure after rechecking active
  queues and target freshness. Production public smoke passes, but production
  build-info still reports `c081f224134fedb65de2ecad716274b92593c373` while
  repository head is now `fba29a96`, including DOGE runtime hardening commit
  `577c45a8`, so the latest hardening is not yet deployed and cannot be
  verified on production. Stage public smoke still fails with `503`. GitHub
  workflow recheck shows the latest `Promote PROD` run is old (`0f122ed4`,
  2026-04-25) and failed; no current production promotion run exists for
  `577c45a8`/`fba29a96`. The final structure now freezes gate order: deploy
  freshness, DOGE close/reopen runtime regression, production V1EXCEL evidence,
  manual operator matrix, and final GO/NO-GO. Evidence:
  `docs/operations/v1-final-test-structure-2026-05-01.md`; task packet:
  `docs/planning/v1final-00-final-test-structure-task-2026-05-01.md`.
- 2026-05-01: closed `V1GATE-01` as a fresh public target preflight after
  production/stage state changed again. Production public smoke is green and
  build-info now reports
  `662ce9b48fac6a48963a62f8d3bc4ac2f645cac6`, which is an ancestor of local
  `HEAD` `ef37fca0c4a3c47605986a815b5323fd535a37fa`; production is still behind
  the newest local commits `ca430aa5`, `1e20b6df`, and `ef37fca0`. Stage public
  smoke remains blocked before auth with `503` for API `/health`, API `/ready`,
  and web `/`. Evidence:
  `docs/planning/v1gate-01-current-target-freshness-sync-task-2026-05-01.md`,
  `docs/operations/v1gate-01-current-target-freshness-2026-05-01.md`.
- 2026-05-01: closed `V1SMOKE-01` during deploy preparation. The local
  umbrella go-live smoke path is green again after verified non-destructive
  repair of local Prisma migration-history drift and fixture updates for
  current V1 contracts. `backtests.e2e` now tests external-position management
  through bot-level authority and grants a live-trading subscription when
  exercising the LIVE activation path; `BotsManagement` smoke expectations now
  include the canonical `manageExternalPositions` payload; and
  `goLiveSmoke.mjs` now names the actual failed migration in recovery guidance.
  Validation PASS: focused backtests e2e (`14/14`), focused web smoke pack
  (`17/17`), portfolio-history web test (`1/1`), and full
  `pnpm run test:go-live:smoke` (API `38/38`, web `17/17`). Evidence:
  `docs/planning/v1smoke-01-go-live-smoke-recovery-task-2026-05-01.md`.
- 2026-04-30: `V1ROE-04` was explicitly blocked on protected production evidence rather than local implementation. The local `V1ROE`, `V1OWN`, and `V1AUTO` slices closed the known repository-side margin-basis, stale read-model, imported ownership, runtime-state rebase, and prospective imported automation hydration gaps. The remaining acceptance signal was authenticated deployed-candidate verification on the real `LIVE DOGEUSDT` flow, documented in `docs/planning/v1roe-04-production-verification-task-2026-04-30.md`; local tests alone could not close it.
  - 2026-04-30 partial production check: deployed web build-info now confirms `522e1d95` on `main`, public deploy smoke passes, and the remaining blocker is strictly protected auth for runtime evidence (`401 Missing token` on runtime freshness and dashboard runtime probes). Evidence: `docs/operations/v1roe-04-prod-verification-partial-2026-04-30.md`.
- 2026-05-01: queue/context sync normalized `V1ROE-04` after the deploy freshness check. The stale duplicate `READY` wording in `.codex/context/TASK_BOARD.md` was removed, and the task stayed blocked until authenticated production evidence could be captured with a token, email/password smoke credentials, or an authenticated browser/session cookie. Canonical sync task: `docs/planning/docsync-2026-05-01-queue-auth-blocker-task.md`.
  - 2026-05-01 follow-up: the task was moved out of the `READY` section entirely and now appears only under `BLOCKED` in `.codex/context/TASK_BOARD.md`, preserving the fail-closed production-auth gate. Canonical follow-up sync task: `docs/planning/docsync-2026-05-01-ready-blocked-separation-task.md`.
  - 2026-05-01 follow-up: `docs/planning/mvp-next-commits.md` stated that no autonomous `NOW` implementation task was executable without protected production auth. This was a temporary fail-closed sync before the protected credentials became available. Canonical sync task: `docs/planning/docsync-2026-05-01-no-autonomous-now-task.md`.
  - 2026-05-01 follow-up: the legacy `BLOCKED` section in `docs/planning/mvp-next-commits.md` was synced from stale `none` to the same `V1ROE-04` protected-auth blocker. That entry is superseded by the later 2026-05-01 closure. Canonical sync task: `docs/planning/docsync-2026-05-01-mvp-blocked-section-task.md`.
- 2026-05-01: closed `V1ROE-04` with authenticated protected production evidence. Production build-info reports `e6bdcfda35698dbb29513490a953e15b9a2c0469` on `main`, public deploy smoke and protected runtime freshness pass, protected `DOGEUSDT` runtime truth is exchange-synced, confirmed, actionable, and strategy-context resolved, and headless dashboard proof confirms the `live` bot `Positions` row matches the protected API shape. Evidence: `docs/operations/v1roe-04-prod-verification-closure-2026-05-01.md`. Remaining confidence work is the separate `V1EXCEL-03..06` authenticated manual/OPS evidence wave; `BOTMULTI-*` remains deferred until those gates are green.
- 2026-05-01: completed the production slice of `V1EXCEL-06` runtime observability. Authenticated `ops:deploy:runtime-freshness` passed on production, and authenticated `ops:deploy:rollback-guard` returned `shouldRollback=false`, no reasons, no alerts, and `runningCount=4`. Evidence: `docs/operations/v1excel-runtime-observability-2026-04-29.md` and `docs/planning/v1excel-06-prod-runtime-observability-task-2026-05-01.md`. The broader `V1EXCEL` confidence wave remains open for manual matrix, stage evidence, broader prod release-gate evidence families, and stage runtime observability.
- 2026-05-01: refreshed `V1EXCEL-04` stage public smoke and found a new,
  earlier blocker than protected auth. Stage web/API currently return `503 no
  available server` for public health/ready/root and web build-info, so
  authenticated stage release gates cannot be meaningfully rerun until the
  Coolify stage services are restored or redeployed. Evidence:
  `docs/operations/v1excel-04-stage-refresh-503-2026-05-01.md`.
  - 2026-05-01 follow-up: stage still returns `503 no available server`.
    Coolify web login works for the provided operator account, but the visible
    project/environment does not expose Soar resources and Coolify API resource
    reads return `401` without a bearer token. Automated restore/deploy remains
    blocked on proper Coolify resource/API access. Evidence:
    `docs/operations/v1excel-04-stage-coolify-access-refresh-2026-05-01.md`.
  - 2026-05-02 supersession: stage refresh is deferred to V2 by operator
    decision in `V1CLOSEOUT-11` and is no longer a V1 production-only blocker.
- 2026-05-01: refreshed the executable production subset of `V1EXCEL-05`.
  Production public smoke, protected runtime freshness, and rollback guard are
  green on the current deployed runtime candidate: `shouldRollback=false`, no
  reasons, no alerts, `runningCount=4`. Production rollback-proof artifact is
  also PASS with secret-safe command recording. Evidence:
  `docs/operations/v1excel-05-prod-refresh-2026-05-01.md`. Broader production
  release evidence remains open for restore drill, RC
  status/sign-off/checklist rebuild, and remaining manual matrix items.
  - 2026-05-02 supersession: production restore drill, rollback proof, Gate 4
    approval, and non-dry-run production release gate are fresh/pass in
    `V1CLOSEOUT-11`; this older production refresh blocker is no longer active.
- 2026-05-01: closed `V1DCA-01` for runtime `Positions` DCA visibility after
  exchange-sync position replacement. Protected production inspection showed
  the `LIVE` DOGEUSDT DCA fill existed as a persisted `BOT` `DCA` trade, but it
  remained linked to a superseded local `positionId` after the current
  `EXCHANGE_SYNC` open row was replaced, so the dashboard row rendered
  `dcaCount=0`. The runtime positions read model now combines direct
  position-linked trades with strictly scoped same-session DCA candidate trades
  and attaches only real persisted DCA rows that match
  bot/wallet/strategy/symbol/side/lifecycle window. Validation PASS: focused
  imported DCA visibility e2e, API typecheck, API build, repository guardrails.
  Post-deploy protected production verification also PASS on deployed commit
  `9460317c7d9409062ff2ddd284a179a60ac89f1a`: web build-info confirms `main`,
  public API health/ready pass, and the current protected DOGEUSDT `Positions`
  row reports `dcaCount=1`, `tradesCount=2`, and `lastTradeAt` from the real
  `BOT/DCA` trade despite the DCA trade remaining linked to the superseded
  `positionId`. Evidence:
  `docs/operations/v1dca-01-prod-verification-2026-05-01.md`.
- 2026-05-01: closed `V1DCA-02` after the operator reported DOGEUSDT should
  have two DCA fills while `Positions` implied only one. Protected production
  inspection confirmed the active session summary and DOGEUSDT trade ledger
  had two real persisted `BOT/DCA` fills, both linked to superseded local
  `positionId` rows after consecutive exchange-sync replacements. Runtime
  positions read now derives supplemental DCA continuity from same-session
  persisted `OPEN/DCA/CLOSE` lifecycle rows and starts counting from the first
  same-identity open after the last exit instead of only the latest
  replacement row's `openedAt`. Focused regression now proves two replacement
  DCA fills render as `dcaCount=2` with two executed levels while unscoped DCA
  rows remain excluded. Validation PASS: focused imported DCA visibility e2e
  (`3/3`), lint, API typecheck, API build, repository guardrails. Task packet:
  `docs/planning/v1dca-02-multi-replacement-dca-count-task-2026-05-01.md`.
- 2026-04-30: closed `WLEDGER-07..09` as the wallet preview UI slice. Wallet list rows now have a shared preview table action that opens `/dashboard/wallets/:id/preview`, and that route renders ledger-backed wallet analytics: account/allocated balance, contributed capital, bot PnL, wallet delta, unclassified adjustment, equity timeline, and cashflow events. The UI keeps deposits/withdrawals separate from bot PnL, surfaces partial ledger completeness, and formats crypto amounts as number plus symbol instead of assuming ISO currency support.
- 2026-04-30: closed `WLEDGER-06` as the first wallet analytics read API. Dashboard wallet routes now expose performance summary, equity timeline, and cashflow events from persisted snapshots/events, including current balance, contributed capital, bot PnL fields, fees/funding, unclassified adjustment, wallet delta percent, timeline markers, and completeness state.
- 2026-04-30: closed `WLEDGER-05` as the first cashflow classification slice. Initial allocated LIVE wallet balance is now persisted as `INITIAL_BALANCE`, deterministic exchange-history entries can be mapped into deposit, withdrawal, transfer, fee, funding, realized-income, and unknown cashflow sources, and stable exchange event ids are upserted idempotently by `(walletId, exchangeEventId, source)`. Raw balance drift still does not become bot PnL.
- 2026-04-30: closed `WLEDGER-04` as the first ingestion slice for the future LIVE wallet ledger. LIVE wallet creation now records an initial `WalletBalanceSnapshot` from authenticated exchange balance preview, and runtime capital refresh records periodic wallet balance snapshots whenever it fetches fresh exchange balance outside the cache. This does not change runtime sizing authority; it only persists the balance evidence needed by later classification and read-model slices.
- 2026-04-30: closed `WLEDGER-03` as the exchange-boundary slice for future LIVE wallet ledger ingestion. The existing exchange execution/authenticated-read capability contract now includes `WALLET_CASHFLOW_HISTORY`, with Binance explicitly supported for V1 and unsupported exchanges failing closed. The canonical `exchangeAdapterBoundary` exposes wallet cashflow history reads, and the CCXT connector normalizes supported account-history methods (`fetchLedger`, `fetchDeposits`, `fetchWithdrawals`, `fetchTransactions`) into deterministic cashflow-history rows for later ingestion without bypassing the approved exchange boundary.
- 2026-04-30: closed `WLEDGER-02` as the DB persistence foundation for the future LIVE wallet ledger. Prisma now has `WalletBalanceSnapshot` and `WalletCashflowEvent` models with user/wallet ownership, exchange/market/base-currency context, balance and allocation snapshot fields, cashflow direction/source enums, deterministic exchange-event uniqueness, and optional links to position/order/trade lifecycle records. The equity timeline remains read-time derived until the API read model proves materialization is necessary.
- 2026-04-30: closed `WLEDGER-01` as the implementation-grade architecture contract for the future LIVE wallet ledger. The new `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md` freezes model semantics for balance snapshots, cashflow events, and equity points; event classification; completeness states (`COMPLETE`, `PARTIAL`, `UNAVAILABLE`); read-model formulas; API response requirements; dashboard behavior; and forbidden accounting shortcuts such as counting deposits as bot profit or withdrawals as bot loss. Exchange-access architecture now explicitly keeps future wallet cashflow history reads behind the canonical authenticated-read boundary.
- 2026-04-30: closed `WLEDGER-00` as the target contract for future LIVE wallet performance analytics. The accepted product/architecture direction is that wallet performance must separate user-contributed capital from bot-generated PnL: initial exchange balance and later deposits/inbound transfers increase contributed capital, withdrawals/outbound transfers decrease it, bot lifecycle results update bot PnL, and ambiguous exchange balance drift remains visible as unclassified adjustment instead of being silently counted as bot profit/loss. The implementation target is a wallet cashflow ledger plus equity timeline, documented in `docs/architecture/reference/wallet-source-of-truth-contract.md` and queued in `docs/planning/live-wallet-cashflow-ledger-and-equity-timeline-plan-2026-04-30.md`.
- 2026-04-30: closed `UXFIX-2026-04-30-B` for dashboard wallet KPI data truth. `Delta from start` no longer stays blank for `LIVE` percent-allocation bots when runtime equity and net PnL are available; the web preserves PAPER and LIVE fixed-allocation baseline behavior, and derives the LIVE percent denominator from `runtime portfolio - selected net PnL` so the operator sees a session delta instead of `-`.
- 2026-04-30: closed `UXFIX-2026-04-30-A` for dashboard table action visual consistency. The runtime `Positions` table now reuses the shared `TableIconButtonAction` contract for row-level edit and close actions, keeping position-specific icons and behavior while matching the default table action sizing, tooltip wrapper, semantic tones, and hover treatment used by wallets and other dashboard tables.
- 2026-04-30: closed `V1SAFE-19` after fresh protected production observation on the live dashboard showed one narrower remaining operator-truth gap: imported managed `LIVE` positions could already expose truthful `PnL%`, strategy-level `TTP` configuration, and `showDynamicStopColumns=true`, yet still return `dynamicTtpStopLoss=null` once `PnL%` moved above the first `TTP` arm. The root cause was twofold inside the runtime read-model contract: serializer fallback treated any finite runtime `trailingTakeProfitHigh/Step` pair as authoritative even if it did not yield a valid positive trigger anymore, and positions-read preferred stale runtime state snapshots even when their canonical basis drifted away from the current imported `EXCHANGE_SYNC` position. Runtime read-model truth now treats runtime `TTP` state as authoritative only when it resolves to a valid positive trigger and otherwise falls back to strategy-level `TTP`; imported runtime display also ignores stale drifted basis state instead of letting it suppress visible protection.
- 2026-04-30: closed `V1SAFE-18` as the next live-history operator-truth slice. After `V1SAFE-17`, the remaining dashboard gap was that imported/open lifecycle rows still left the actor column empty because only close-side `closeInitiator` was rendered, and the additional `History - operational trade log` subheading added no meaning. The dashboard now exposes one `Opened / Closed by` actor column for trade history, using canonical `closeInitiator` for close rows and existing `origin` for open/imported rows, while the redundant subheading is removed.
- 2026-04-30: closed `V1SAFE-17` after a fresh operator question exposed one last history-semantics drift on the live dashboard. The repository intentionally reuses `POSITION_LIFETIME` as the action reason for imported `OPEN` lifecycle anchors, which is valid internally but misleading when the web renders the same copy used for true timeout closes. The dashboard trade-history reason badge now distinguishes `POSITION_LIFETIME + OPEN` as lifecycle-open context and keeps `Position lifetime` only for actual close-side rows, so operator history stays truthful without changing the approved backend/runtime contract.
- 2026-04-30: closed `V1SAFE-16` for strategy-edit active-bot lock clarity after operator feedback proved the guard itself was correct but the unlock path was still too ambiguous in practice. Strategy mutation remains blocked by canonical `bot.isActive` safety, not by transient runtime stop state, but strategy lock responses now carry blocking `botId + botName` and the web edit screen explicitly explains that stopping the runtime session is not enough, surfaces the blocking bot identity, and links directly to that bot's settings so operators can switch `Active` off before saving urgent strategy fixes such as lifecycle changes.
- 2026-04-30: closed `V1SAFE-15` for dynamic `TTP` operator truth after a fresh live-dashboard observation exposed one narrower residual surface drift. Backend/runtime close behavior could already honor `TTP`, but runtime position serialization still had one fallback path that derived displayed `TTP` from current favorable move rather than the canonical trailing anchor, so the table value could fall during a pullback even though `TTP/TSL` should only ever ratchet protection upward. The repository now prefers anchor-based `PnL fraction` fallback whenever runtime anchor state exists, preserving dynamic-stop column visibility without introducing display-only sticky state and keeping operator `TTP` truth monotonic with the real protected floor.
- 2026-04-30: closed `V1SAFE-14` for advanced `TSL` semantics after direct operator verification showed the previous fail-closed guard had frozen the wrong contract. The repository now treats advanced `TSL` as loss-side `start + step` truth, not as profit-side trailing retrace capped by the activation threshold: `percent` is the negative activation/start threshold and `arm` is the positive trailing step after activation. Web form validation/sanitization, API strategy validation, runtime parser, and backtest parser are now aligned to that contract, so `TSL percent=-20 / arm=10` is valid again and remains consistent across `LIVE`, `PAPER`, and `BACKTEST`.
- 2026-04-30: closed `V1SAFE-13` for the strategy-form threshold workflow. Strategy create/edit no longer relies on three duplicated append-only list editors for `TTP`, `TSL`, and advanced `DCA`. The repository now uses one shared sortable threshold editor with drag handle plus keyboard-accessible move controls, keeps stable local row identity in form state to avoid reorder/input drift, and strips those local ids before POST/PUT payload serialization so backend strategy config remains unchanged. This preserves the existing fail-closed backend validation while removing the operator need to rewrite entire ladders after adding a new earlier threshold.
- 2026-04-30: extended `V1SAFE-12` after the first web-only sanitize pass still left one practical edit trap. Besides sanitizing legacy invalid advanced `TTP/TSL` thresholds on DTO load, the strategy form pipeline now also starts from a valid default `TSL` threshold and strips any reintroduced legacy-invalid trailing thresholds from the submit payload itself before the request is sent. This keeps strategy edit resilient even when old invalid close thresholds survive in browser state or cached form state, while API/runtime validation still fail closed on any newly submitted invalid config.
- 2026-04-30: closed `V1SAFE-11` after protected production verification on `XRPUSDT` proved one remaining operator-visible trailing-close bug was actually a configuration-safety gap rather than just a table-rendering drift. The active `LIVE` row showed a sane positive `PnL%` but an impossible `TSL -292.81%`; backend inspection traced that value to an invalid advanced trailing-stop configuration where trailing retrace exceeded the arm/trigger threshold (`TSL arm=10`, `trail=-20`). The repository now fails closed at every layer for that class: strategy create/update/import rejects invalid `TTP/TSL` thresholds, the strategy form blocks those values before submit, runtime config parsing and runtime automation filter any legacy invalid thresholds out of execution, and runtime serialization no longer exposes trailing-stop trigger percent from negative trailing state. This keeps `LIVE`, `PAPER`, and `BACKTEST` on one shared protective-close contract instead of silently allowing non-protective thresholds.
- 2026-04-30: closed `V1HIST-10` as the next smallest canonical-ledger slice after `V1HIST-09` fixed only the operator surface. The repository no longer relies solely on runtime-only history anchors for fresh imported open lifecycles. `importedPositionHistoryHydrator` now persists one local `EXCHANGE_SYNC OPEN` anchor trade from canonical `Position` truth whenever authenticated exchange trade history cannot yet be reconstructed for an imported open row, and later canonical exchange-derived trades automatically replace that synthetic anchor instead of duplicating lifecycle rows. Runtime trade reads also classify persisted imported anchors as `POSITION_LIFETIME`, keeping dashboard/operator semantics aligned with the ledger instead of showing `SIGNAL_ENTRY` for externally imported lifecycles.
- 2026-04-30: closed `V1HIST-09` after a full protected production plus browser audit finally separated one remaining operator-history gap from the already fixed `Positions` and `Orders` truth. Fresh `LIVE` imported positions such as `BNBUSDT` and `XRPUSDT` were now rendering correctly in `Positions`, and `Orders` correctly showed no open orders, but the dashboard `History` tab still rendered only persisted trade rows, which meant fresh imported lifecycles with `tradesCount=0` stayed invisible even though canonical `Position` truth already carried valid `openedAt`, `entryPrice`, `quantity`, and ownership. The repository now emits one operational `OPEN` anchor row from canonical position truth whenever a scoped imported lifecycle has no local trade rows yet, reusing existing `POSITION_LIFETIME` semantics for the dashboard history feed instead of inventing exchange fills that do not exist locally.
- 2026-04-30: closed `V1HIST-08` after a second protected production audit on the same live bot separated one deeper imported-history root cause from the already closed dashboard-surface drift. Production runtime payloads for fresh imported `BNB/XRP/DOGE` open positions were now using sane `PnL` truth, but they still carried `tradesCount=0` and `firstTradeAt=null`, which meant imported opening-history hydration was still failing before UI ever had anything truthful to render. The strongest common seam was symbol contract mismatch at the authenticated exchange boundary: Soar asked trade-history reads with app-normalized ids like `XRPUSDT`, while the CCXT connector/test family already speaks unified exchange market symbols like `XRP/USDT:USDT`. `CcxtFuturesConnector` now resolves normalized symbol ids back to canonical CCXT market symbols before trade-history, order-read, ticker, open-order, and rules lookups, and focused regression coverage locks the raw-id to market-symbol mapping for imported trade-history fetches.
- 2026-04-30: closed `V1SURF-09` as the next operator-truth slice after fresh production dashboard notes on `BNB`, `DOGE`, and `XRP`. The repository previously had three surface drifts masquerading as one bug: imported/adopted `LIVE` positions could remain visible while their trade rows were still re-filtered by older bot-scoped ownership semantics, adopted imported rows were not hydrating exchange trade history on the update/reuse path even though the create path already did, and dashboard runtime derivations could recompute `PnL%` from stale stream/session prices even when the backend had fresher canonical `markPrice`, `unrealizedPnl`, and `unrealizedPnlPercent`. The repository now reads trades for already visible runtime positions by canonical `positionId`, hydrates imported exchange history on both create and adopt/update reconciliation paths, prefers backend PnL truth on the web, and keeps periodic dashboard polling alive even when SSE is nominally connected. This narrows the remaining operator closure work back to protected manual production verification instead of another obvious local dashboard-truth gap.
- 2026-04-30: closed `V1IMPORT-01` after protected production verification on the reported `BNBUSDT` gap finally separated import truth from dashboard truth. The exchange snapshot was already showing both `DOGEUSDT` and `BNBUSDT`, but runtime positions only exposed `DOGEUSDT` because an older open wallet-owned `BOT_MANAGED` local row for `BNBUSDT` still existed without `botId`, which meant reconciliation could neither reuse it nor lifecycle-replace it before the open-position uniqueness constraint blocked fresh import. The repository now treats wallet-owned botless local rows as valid local candidates inside owned `LIVE` reconciliation, allowing the existing lifecycle-replacement rules to close stale blockers or adopt a fresh local row under the canonical owner context. Reused local rows also receive canonical `externalId`, so upgrade from local `BOT/USER` truth to `EXCHANGE_SYNC` truth is no longer half-complete on later iterations.
- 2026-04-30: closed `V1TAKE-10` after the user approved a stricter ownership contract for imported `LIVE` exchange positions. The repository no longer treats `wallet.manageExternalPositions` as canonical runtime truth. Added `Bot.manageExternalPositions` with deterministic SQL backfill from linked wallets so current production bots keep their existing behavior, moved imported-position management authority into bot create/edit settings as one checkbox, removed the editable wallet-level toggle from operator UX, and rewired runtime ownership/takeover resolution to derive management truth from the bot-level flag plus bot symbol scope. Wallet and API-key management flags now remain compatibility-only metadata, not runtime authority.
- 2026-04-30: closed `V1AUTO-03` as the next operator-truth slice on imported managed positions. Runtime positions payload no longer assumes every lifecycle already has a canonical local `OPEN` trade before `DCA` can be shown. Imported managed rows now derive `dcaCount` from explicit `DCA` trades and runtime `currentAdds` before the older entry-leg-count fallback, so dashboard `DCA` visibility can stay truthful even while imported opening-history hydration still catches up.
- 2026-04-30: closed `V1AUTO-02` as the next smallest imported-automation parity slice after ownership and stale-state rebase were already green locally. `livePositionReconciliation` now wakes the canonical runtime automation engine prospectively when it creates or updates a canonically owned imported `LIVE` row with confirmed continuity and fresh positive `markPrice`, instead of waiting passively for a later ticker-path event. This stays aligned with `docs/architecture/reference/live-protection-state-parity-contract.md` because the repository still uses one runtime automation engine and only hydrates protection from the adoption point onward.
- 2026-04-30: closed `V1OWN-01` as the next smallest ownership-parity runtime slice after the latest protected production `DOGEUSDT` verification. Imported owned `EXCHANGE_SYNC` positions no longer depend solely on persisted `position.botId` to participate in runtime automation: default runtime-position lookup now reuses the canonical external-position ownership classifier to hydrate effective bot execution context for owned imported rows, and bot-scope open-position counting in the runtime signal loop now includes those owned imported `LIVE` rows as well. Closure evidence: `docs/operations/v1own-imported-live-runtime-ownership-closure-2026-04-30.md`.
- 2026-04-30: closed `V1AUTO-A` as the next smallest runtime-continuity hardening slice after the latest protected production verification. `runtimePositionAutomation` now rebases imported `EXCHANGE_SYNC` state to canonical exchange-synced `quantity + entryPrice` truth whenever persisted runtime state drift is material, so stale `currentAdds`, quantity basis, or entry basis can no longer silently survive an in-place exchange-sync update on the same imported row. Closure evidence: `docs/operations/v1auto-runtime-state-rebase-closure-2026-04-30.md`.
- 2026-04-30: published `V1AUTO-A` after protected production verification on the active `LIVE DOGEUSDT` flow narrowed the next likely code gap further. The stale runtime-price seam appears closed on production, but the imported `LIVE` row can still look unmanaged even while exchange-synced `markPrice`, `unrealizedPnl`, and `marginUsed` are fresh. The strongest remaining hypothesis is same-row continuity drift inside runtime automation itself: `runtimePositionStateStore` may still carry stale `currentAdds`, quantity basis, or entry basis when reconciliation updates an imported `EXCHANGE_SYNC` row in place. Canonical packet: `docs/planning/v1auto-runtime-state-rebase-plan-2026-04-30.md`.
- 2026-04-30: closed the first implementation slice of `V1ROE-A` after the user approved canonical `LIVE` PnL truth alignment without splitting the lifecycle engine into a separate exchange-only semantics path. The repository now persists `Position.marginUsed` as exchange-synced margin basis, carries that truth through exchange snapshot normalization and reconciliation, and uses one shared `current position pnl fraction` contract for lifecycle decisions: `BACKTEST` and `PAPER` still derive modeled margin from entry/quantity/leverage, while `LIVE` now uses exchange-synced `marginUsed` whenever available and exposes the same basis to operator surfaces through runtime `marginUsed` and `unrealizedPnlPercent`. Fresh local validation is green; remaining closure is protected production/manual evidence on the affected `DOGEUSDT` flow plus the rest of `V1EXCEL-03`.
- 2026-04-30: a fresh protected production check after the `V1ROE-01` deploy attempt proved one narrower residual gap in the repository closure story. The authenticated `runtime-sessions/:sessionId/positions` response for the active `LIVE DOGEUSDT` session still returned the old payload shape without `marginUsed` or `unrealizedPnlPercent`, even though local code now exposes both fields. This means the fix itself is still locally green, but the repo lacked one explicit end-to-end contract lock at the runtime-positions API seam and production verification must now confirm both deploy freshness and exchange-aligned operator truth.
- 2026-04-30: closed `V1ROE-02` as the missing runtime-positions contract lock revealed by that protected prod check. The repository now has a focused e2e proof (`bots.runtime-pnl-parity.e2e.test.ts`) that a canonical `LIVE` runtime position with persisted `marginUsed` different from modeled margin still comes back from `runtime-sessions/:sessionId/positions` with the same `marginUsed`, truthful `unrealizedPnl`, and `unrealizedPnlPercent` computed from the persisted margin basis. This narrows the remaining closure risk away from local API regression and back onto deploy freshness plus real protected `DOGEUSDT` operator verification.
- 2026-04-30: the next protected production pass after `V1ROE-02` confirmed that deploy freshness is no longer the main blocker. The active `LIVE DOGEUSDT` row now exposes `marginUsed` and `unrealizedPnlPercent` on production, but the current basis still appears to follow `initialMargin`-style truth for isolated futures positions (`marginUsed≈0.769`, `unrealizedPnlPercent≈-27.83%`). That is still too weak to call exchange parity closed if the operator-visible Binance percent is lower because additional isolated margin was added. The next smallest code fix is therefore not another broad PnL rewrite, but a narrower isolated-margin normalization correction: prefer real `isolatedWallet` margin authority for `ISOLATED` `LIVE` positions while preserving the shared lifecycle engine.
- 2026-04-30: closed that isolated-margin correction as `V1ROE-03`. Exchange snapshot normalization now prefers `isolatedWallet` for `ISOLATED` futures positions before `isolatedMargin` and initial-margin fields, which should better match the real exchange operator truth when additional margin has been added to an open isolated position. Focused regression coverage now locks both sides of the rule: isolated positions use isolated-wallet truth, while non-isolated positions keep initial-margin precedence. The remaining closure risk is back on protected post-deploy verification of the real `DOGEUSDT` flow.
- 2026-04-30: another protected production audit narrowed `V1ROE-04` to one read-model freshness seam rather than a new exchange-normalization gap. Direct exchange snapshot and persisted `Position` truth for the active `LIVE DOGEUSDT` row were already fresh (`markPrice`, `unrealizedPnl`, `marginUsed`, `lastExchangeSyncAt`), but runtime session `positions` and `symbol-stats` could still recompute operator truth from an older `botRuntimeSymbolStat` / runtime ticker price. The repository now prefers fresher exchange-synced lifecycle truth for `EXCHANGE_SYNC OPEN` rows whenever runtime cache price is older than `lastExchangeSyncAt`, and focused e2e coverage locks both `runtime-sessions/:sessionId/positions` and `symbol-stats` against silently regressing to stale session price. Remaining closure is protected post-deploy verification on the affected `DOGEUSDT` flow.
- 2026-04-30: published `V1ROE-A` after a fresh protected production audit of the active `LIVE DOGEUSDT` flow. The repository now has explicit evidence that two different drifts were being conflated: current Soar `PnL %` semantics are still `unrealizedPnl / (entryNotional / leverage)` rather than exchange-style `ROE`, and imported/reopened `LIVE` automation still appears stale enough to miss `DCA/TTP` evaluation after reopen/import even under Soar's own current leveraged-move thresholds. The analysis packet intentionally stops before implementation because one explicit product/architecture decision is required first: keep lifecycle thresholds on leveraged move and align operator UI separately, or migrate lifecycle thresholds to exchange-ROE semantics. Canonical packet: `docs/planning/v1roe-live-pnl-roe-and-runtime-automation-parity-plan-2026-04-30.md`.
- 2026-04-29: closed the first backend hydration slice of `V1HIST-A`. Soar no longer has to rely only on the weaker imported position snapshot timestamp for newly adopted exchange positions: the authenticated exchange boundary now exposes trade-history reads, imported lifecycle hydration reconstructs the current open lifecycle only when canonical fill truth is sufficient, imported `OPEN` / `DCA` / partial `CLOSE` trades are persisted without inventing fake fills, and `position.openedAt` is corrected to the first canonical fill when hydration succeeds. External-close ledger parity still remains open.
- 2026-04-29: closed the external-close ledger parity slice of `V1HIST-A`. Imported managed positions that disappear from exchange truth are no longer limited to row-level closure only when deterministic exchange trade history is available: reconciliation now backfills the final lifecycle window from canonical exchange trades, persists missing imported `CLOSE` trades with `USER_EXCHANGE` attribution, and updates `position.closedAt` to the last canonical close fill instead of trusting only the local reconciliation timestamp. The implementation stays fail-closed when exchange trade history is insufficient.
- 2026-04-29: closed the full `V1HIST-A` packet. The repository now has one coherent imported lifecycle history model for `V1`: imported opening history may be hydrated only from deterministic exchange trades, imported externally closed managed positions may backfill missing `CLOSE` trades and canonical `closedAt` from deterministic exchange trade history, runtime history keeps those closed positions visible, and dashboard history surfaces expose separate `openedAt` and `closedAt`. Closure evidence: `docs/operations/v1hist-imported-exchange-lifecycle-history-closure-2026-04-29.md`.
- 2026-04-29: closed the first implementation slice of `V1HIST-A`. Operator-visible history for runtime positions now stops collapsing lifecycle time into one ambiguous field: dashboard history tables render separate `openedAt` and `closedAt` columns, and the repository now has focused API proof that a closed imported `EXCHANGE_SYNC BOT_MANAGED` position remains visible in `historyItems` with both timestamps preserved. The deeper imported opening-history hydration and external-close ledger parity remain open under the rest of `V1HIST-A`.
- 2026-04-29: published `V1HIST-A` after a focused audit of another `LIVE` completeness gap exposed by fresh operator notes. Current repository truth is that imported exchange positions can already be adopted into active bot-managed state and later stale-closed when exchange truth disappears, but imported lifecycle history is still not a fully closed vertical slice: the import path does not yet guarantee opening-history ledger parity, reconciliation-driven external close does not yet guarantee equivalent close-history truth, and dashboard history presentation still compresses lifecycle time too aggressively. Canonical packet: `docs/planning/v1hist-imported-exchange-lifecycle-history-plan-2026-04-29.md`. The detailed operator scenario companion is `docs/operations/v1live-mixed-origin-verification-matrix-2026-04-29.md`.
- 2026-04-29: closed the first implementation slice of `V1REOPEN-A` after the new `DOGEUSDT` live report. The repository now treats same-symbol reopen as a first-class lifecycle-truth problem instead of a display-only issue: `livePositionReconciliation` immediately retires stale opposite-side rows when a same-symbol replacement lifecycle appears, detects same-side lifecycle discontinuity from newer exchange open timestamps, and clears persisted runtime position state whenever reconciliation force-closes or supersedes a lifecycle. This is meant to stop two concrete regressions at once: wildly wrong operator-visible `PnL%` after close/reopen on the same market, and stale `TTP/DCA/TSL` runtime state bleeding into the new position.
- 2026-04-29: a deeper post-fix audit found one more plausible code-level `V1REOPEN` drift beyond lifecycle retirement itself. Dashboard `TTP/TSL` visibility is still gated by bot-level `showDynamicStopColumns`, which is derived from active advanced-close topology, not from actual reopened row truth. That means a reopened or recovered position may already carry real `dynamicTtpStopLoss` / `dynamicTslStopLoss`, but the operator table can still hide those columns if strategy-topology context is unresolved or temporarily degraded. This is now the strongest remaining candidate for `V1REOPEN-05/06`.
- 2026-04-29: closed `V1REOPEN-06`. Runtime operator truth now stays aligned across API and both web surfaces even when bot strategy topology drifts after a position lifecycle is already open or recovered: backend `showDynamicStopColumns` remains true whenever any open row carries real dynamic-stop truth, dashboard/runtime monitoring surfaces OR topology mode with row truth instead of treating `false` as absolute, and runtime serialization regained the missing bot-managed `TTP` fallback plus sticky post-pullback continuity from strategy levels and persisted `trailingLossLimitPercent`.
- 2026-04-29: closed the full `V1REOPEN-A` packet. Same-symbol `LIVE close -> reopen` is now treated as canonical lifecycle replacement end to end: stale old rows are retired during reconciliation, stale runtime protection state is cleared on lifecycle retirement, operator surfaces preserve row-level dynamic-stop truth after reopen, and focused runtime proof now locks that a reopened imported `LIVE` position still executes `TTP` correctly when all remaining `DCA` thresholds are loss-side only. Closure evidence: `docs/operations/v1reopen-live-close-reopen-truth-closure-2026-04-29.md`.
- 2026-04-29: published `V1REOPEN-A` as a new narrow `LIVE` hardening packet after fresh real-account notes on `DOGEUSDT`. The repository had already closed the broad `V1TRUTH-A` wave, but this newly observed flow isolates a more specific regression class: `LIVE` manual close succeeds on the exchange, same-symbol reopen is adopted again, yet operator-visible `PnL%` becomes dramatically wrong and `TTP` behavior still looks contaminated. Current strongest hypothesis is stale lifecycle continuity across `close -> reopen` on the same symbol: reconciliation grace-window overlap or stale runtime protection state may let the old lifecycle row or its state bleed into the new one. Canonical packet: `docs/planning/v1reopen-live-close-reopen-pnl-ttp-hardening-plan-2026-04-29.md`.
- 2026-04-29: published one practical final-mile unblock runbook for the remaining `V1EXCEL` external blockers. The repository still cannot clear those blockers autonomously without auth, but another operator or agent no longer needs to reconstruct the last-mile sequence from multiple docs: `docs/operations/v1excel-final-unblock-runbook-2026-04-29.md` now freezes the exact order for manual matrix execution, stage/prod authenticated evidence refresh, RC rebuild, and the final `GO` decision gate.
- 2026-04-29: the first authenticated production operator pass for `V1EXCEL-03` is now recorded in `docs/operations/v1excel-paper-operator-verification-2026-04-29.md`. Real Soar admin access became available during this session, which partially unblocked the manual matrix. Production `PAPER` same-side manual add on the active managed position behaved truthfully (`FILLED`, linked to the existing position, `openCount=1`, `openOrdersCount=0`, quantity increased correctly). The same pass exposed a new operator-visible drift: production `PAPER` manual close still returns `POSITION_CLOSE_PRICE_UNAVAILABLE` even when the runtime positions read path shows a valid `markPrice` for that open position. Remediation is now on `main`: the close command reuses both the approved `runtimeMarketDataFallback` seam and the same public exchange connector family already used by manual-order context, so command-side price resolution is no longer weaker by design than the operator-visible read path. Focused local validation is green, but fresh post-deploy production confirmation is still pending.
- 2026-04-29: reran the authenticated production `V1EXCEL-03` paper close path after deploy and confirmed that the previously failing `PAPER` manual-close drift is now resolved on the real protected API path. Closing the active managed position returned `200`, removed the row from `openItems`, preserved it in `historyItems` with `closeReason=MANUAL` and `closeInitiator=USER_APP`, and moved realized profit into runtime `freeCash`. This narrows the remaining manual-matrix gap away from `PAPER` close correctness and toward real-UI, `LIVE` exchange-authority, mixed-origin, and restart/recovery evidence.
- 2026-04-29: extended the same authenticated `V1EXCEL-03` production pass into the real dashboard UI. Browser automation against `https://soar.luckysparrow.ch/dashboard` proved that authenticated operator surfaces are aligned with the already confirmed `PAPER` API truth: switching the selected bot from `LIVE` to `PAPER` works, `Positions` shows no open positions after the close, wallet summary reflects `Delta from start 1.25% | 12.48 USDT` and `Portfolio 1,012.48 USDT`, and `History` shows the expected top row `Close / Manual / User in app` for `1000000MOGUSDT`. The remaining `V1EXCEL-03` gap is now narrower: browser-side trade-action clicks only if required, plus the still-missing `LIVE` exchange-authority, mixed-origin, and restart/recovery proofs.
- 2026-04-29: after pushing commit `4514894127ad07cbe95415043658e10b8c0cf75d` and letting production redeploy, fresh public prod smoke passed again on `https://api.soar.luckysparrow.ch` and `https://soar.luckysparrow.ch`. The blocker remained unchanged rather than mutating into a new prod regression: protected runtime freshness and rollback diagnostics are still auth-gated (`401`) without OPS/private-route credentials. Canonical post-deploy note: `docs/operations/v1excel-prod-post-deploy-check-2026-04-29.md`.
- 2026-04-29: closed `V1EXCEL-08` as the canonical sync slice after the final confidence pass. Current repo truth is now frozen explicitly: the latest candidate remains `NO-GO` for an excellence-level real-money claim, not because of a newly confirmed implementation bug, but because the remaining completion contract is external-evidence only. `V1EXCEL-02` is green locally; `V1EXCEL-03..06` remain blocked by missing authenticated operator/exchange/OPS authority.
- 2026-04-29: closed `V1EXCEL-07` with a final `NO-GO` decision for candidate `51acd9c445227a3ca8cc8b781564d14b55fda43f`. Fresh local smoke is green, and public stage/prod smoke is green, but the repository's own rules still block a `GO` because the authenticated manual `PAPER/LIVE` matrix and protected stage/prod OPS evidence were not executed today. Canonical decision: `docs/operations/v1excel-final-go-no-go-2026-04-29.md`.
- 2026-04-29: closed `V1EXCEL-02` by restoring a truthful local confidence path on this workstation. The local `P3009` blocker was not a new `V1` product bug but drifted Prisma migration history on a reused dev database; after non-destructive `migrate resolve` repair, `pnpm run test:go-live:smoke` passed end to end. Canonical closure: `docs/operations/v1excel-local-confidence-path-closure-2026-04-29.md`.
- 2026-04-29: closed `V1EXCEL-01` by freezing the exact remaining post-`V1TRUTH` gap map against the repository's own completion and activation contracts. The canonical audit answer is now explicit: there is no open core implementation gap and no open architecture mismatch left for `V1`; what remains is confidence closure only. The missing categories are fresh manual verification of the newest `LIVE` candidate, honest local full-confidence reproducibility for the umbrella go-live path, fresh stage/prod activation evidence on the latest candidate, and one final operator-facing `GO / NO-GO` decision. Canonical audit: `docs/operations/v1excel-gap-map-audit-2026-04-29.md`.
- 2026-04-29: published `V1EXCEL-A` as the next honest post-`V1TRUTH-A` packet. The repository no longer has an open architecture decision or a known code-level `LIVE` money-path drift in the canonical queue, but the project rules still require more than green tests before claiming a truly excellent `V1`: fresh manual verification, fresh stage/prod activation evidence, one honest local full-confidence path, and a final operator-facing `GO / NO-GO` decision on the current candidate. Canonical packet: `docs/planning/v1excel-full-v1-excellence-and-confidence-plan-2026-04-29.md`.
- 2026-04-29: closed the full `V1TRUTH-A` wave. The final `LIVE exchange truth` hardening packet for `V1` is now complete across the four real-money drift classes behind the user's notes: dashboard futures manual-order leverage/margin parity, exchange-backed app-driven `LIVE` manual close, truthful pending external/manual exchange order versus open-position separation, and the final `DCA/TTP/TSL` nuance. The canonical protection rule is now explicit and shared across `BACKTEST`, `PAPER`, and `LIVE`: `SL` and `TSL` stay blocked while pending DCA remains financially possible, but `TTP` waits only for remaining profit-side DCA thresholds and may still close when all remaining DCA thresholds are loss-side only. Closure evidence: `docs/operations/v1truth-live-exchange-truth-closure-2026-04-29.md`. Validation PASS: focused API closure pack (`99/99`), focused web closure pack (`15/15`), `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: started implementation of `V1TRUTH-A` with the highest-confidence user-reported drift first: dashboard manual-order futures sizing. The repository now treats `FUTURES` manual-order budget, slider max, budget-derived quantity, and submit-time affordability checks as leverage-aware required margin on the web side, matching the backend manual-order preview intent more closely while keeping `SPOT` semantics unchanged. Focused validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm --filter web run typecheck`.
- 2026-04-29: closed the next `V1TRUTH-A` API slice for app-driven `LIVE` manual close truth. The canonical runtime close path now keeps one approved exchange-backed authority: `executionOrchestrator` submits `LIVE` closes through the existing `openOrder -> exchangeAdapterBoundary -> live adapter` chain with explicit `reduceOnly` intent, live pretrade exposure guards no longer reject that reduce-only close case, and runtime session close no longer depends on an in-memory lifecycle price as hidden close authority. When runtime lifecycle price is temporarily unavailable in `LIVE`, the command degrades explicitly to persisted `entryPrice` as reference context while the actual exchange reduce-only market order remains the authority; `PAPER` continues to fail closed with `POSITION_CLOSE_PRICE_UNAVAILABLE` when no canonical close price exists. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: closed `V1TRUTH-05` by freezing the pending external order-versus-position baseline that motivated the user's live notes. The repository now has explicit e2e proof that one open `LIVE` position plus one pending external/manual exchange `DCA` order on the same symbol does not inflate the position in either runtime session positions or dashboard aggregate: `openCount` stays `1`, `openOrdersCount` stays `1`, the open position keeps its original quantity and entry notional, and the external order remains visible only in `openOrders` until exchange fill confirms it. This narrows the remaining user-visible drift under `V1TRUTH-06`: if inflation still appears in production, the bug is likely in a more specific reconcile/event/UI path than the canonical read-model baseline now proven green.
- 2026-04-29: closed `V1TRUTH-06` by fixing the strongest confirmed reconcile path that could still inflate operator-visible `LIVE` positions above the now-green pending-order baseline. `livePositionReconciliation` no longer creates a second imported `EXCHANGE_SYNC` open position when exchange snapshot truth arrives for a bot-owned `LIVE` position that already exists locally as an open `BOT`/`USER` managed row on the same canonical owner plus `symbol/side`. Instead, it reuses and upgrades the existing local row to exchange-confirmed truth, which keeps runtime positions and dashboard aggregate aligned to one open position identity while still showing pending exchange orders separately in `openOrders`. Validation PASS: focused `livePositionReconciliation.service.test.ts`, focused `orders-positions.e2e.test.ts`, focused manual-close/runtime/exchange packs, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: the user approved the staged post-analysis direction for the newly reported real-account drifts. The canonical plan is now: keep the approved singular bot architecture through one final `V1TRUTH-A` hardening wave, close truthful `LIVE` money-path behavior first (`manual order`, `manual close`, `order vs position truth`, final `DCA/TTP/TSL` semantics), and only after that stability is proven reopen architecture for multi-strategy-per-bot in the deferred `BOTMULTI-A` wave. Canonical packets: `docs/planning/v1truth-live-exchange-truth-hardening-plan-2026-04-29.md` and `docs/planning/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md`.
- 2026-04-29: published `V1TRUTH-A` as the next smallest architecture-aligned hardening wave after the fresh code-and-doc audit of the user's notes. The strongest remaining confirmed `LIVE` drifts are no longer broad exchange bring-up work but exact money-path truth gaps: leverage-aware futures manual-order sizing still lacks frontend/backend parity, app-driven manual close still depends too much on runtime-session context instead of one explicit exchange-backed authority, external/manual exchange pending orders still need one locked proof that they stay in `orders` until fill, and the exact final `DCA/TTP/TSL` rule still needs one explicit docs-plus-tests freeze.
- 2026-04-29: published `BOTMULTI-A` as a deferred post-`V1` roadmap only. It is intentionally not active while `V1TRUTH-A` is open. The deferred packet freezes prerequisites, architecture-first sequencing, and the expected execution outline for reintroducing `1 bot = 1 wallet + 1 symbol-group + N strategies` without mixing that architecture change into the final `LIVE` truth hardening wave.
- 2026-04-29: queued `V1MARK-A` as the next smallest `LIVE exchange` hardening wave after `V1COVER-A` closure. The strongest remaining confirmed money-path drift is now futures-specific lifecycle-price truth: runtime protection and position-lifetime automation already reuse one shared resolver seam, but that seam still resolves ticker `lastPrice` and recent candle close only because the Binance futures market-stream boundary does not ingest mark price yet. The next slice is intentionally narrow and architecture-aligned: extend the approved futures stream boundary to carry mark price, make the shared lifecycle-price resolver prefer it for `LIVE FUTURES`, keep explicit fallback for degraded and spot paths, and prove the behavior with focused stream/runtime regressions.
- 2026-04-29: closed `V1MARK-01` as the architecture-freeze slice of the new futures price-truth wave. `docs/architecture/reference/live-futures-lifecycle-price-contract.md` now freezes one canonical hierarchy for `LIVE FUTURES` runtime protection and lifetime automation: prefer stream `markPrice`, then ticker `lastPrice`, then latest positive recent candle close. `06_execution-lifecycle.md` and `reference/execution-lifecycle-parity-contract.md` now point to the same rule so runtime callers do not fork their own futures price authority.
- 2026-04-29: closed the full `V1MARK-A` wave. The approved Binance futures market-stream boundary now subscribes to and normalizes `markPriceUpdate` events, runtime ticker storage preserves futures `markPrice` alongside `lastPrice`, and the shared lifecycle-price resolver now prefers mark price for `LIVE FUTURES` while keeping explicit fallback to last price and recent candle close. Focused stream/runtime validations are green and closure evidence is published in `docs/operations/v1mark-live-futures-mark-price-parity-closure-2026-04-29.md`.
- 2026-04-29: closed `V1COVER-01` as the first runtime-coverage hardening slice after `V1GUARD-A`. The repository still uses module-global runtime candle/ticker stores in the engine path, so broad regression proof can drift if files emit runtime events directly and do not clear those stores between tests. `runtime-flow.e2e.test.ts` and `runtimeSignalLoop.service.test.ts` now reset that shared state explicitly in `beforeEach`, and the focused combined pack for those files passes again when run together instead of inheriting stale series from a previous runtime test.
- 2026-04-29: closed `V1COVER-02` as the shared-helper and stale-proof cleanup slice of the new `LIVE` coverage wave. `bots.e2e.shared.ts` now deletes wallet-linked topology during shared runtime takeover cleanup, removing one deterministic FK-noise source from broad suite runs. The first takeover visibility regression was also realigned to the current architecture: overlapping active `LIVE` bots on the same symbol are intentionally blocked by the newer guard, so the valid remaining proof is now `LIVE` ownership visibility versus a same-symbol `PAPER` bot rather than a stale two-`LIVE` overlap scenario.
- 2026-04-29: closed the full `V1COVER-A` runtime-regression coverage wave. After removing shared runtime market-data leakage, restoring wallet cleanup in shared takeover helpers, and hardening the remaining `orders.service` LIVE fixture setup, the sequential broad runtime/order proof is green again under the current architecture. The remaining false-reds observed during the middle of the wave were classified as invalid parallel DB-backed evidence when separate Vitest processes hit the same local Postgres concurrently; no new runtime product drift survived once the harness was stabilized. Closure evidence: `docs/operations/v1cover-live-runtime-regression-coverage-closure-2026-04-29.md`.
- 2026-04-29: published `V1COVER-A` as the next post-`V1GUARD` hardening wave. The focused `LIVE` protection fixes are now green, but broader runtime/order proof is still weakened by mixed regression noise: module-global runtime candle/ticker state is not reset consistently across runtime tests, shared e2e helpers still carry singular-bot cleanup drift around wallet-linked topology, and at least one broad `orders.service` proof still fails under Vitest even when the equivalent service path can succeed directly. The next execution wave therefore starts with regression-proof hardening first: remove shared-state leaks, repair helper cleanup truth, rerun the broad pack, and only then treat any surviving failures as real product drift for the `LIVE exchange` path.
- 2026-04-29: closed `GOLIVE-2026-04-29-A` as a tooling-only hardening slice after confirming the app-level go-live packs were already green. `scripts/goLiveSmoke.mjs` now reuses already-running reachable local Postgres/Redis when Compose cannot bind `5432/6379`, avoids tearing down infra it did not start, and reports local Prisma failed-migration state (`P3009`, currently `20260424094500_add_single_context_bot_refs`) explicitly enough that the next operator action is obvious. Validation PASS: `pnpm run test:go-live:api`, `pnpm run test:go-live:web`, `pnpm run quality:guardrails`; umbrella `pnpm run test:go-live:smoke` now reaches the real local migration blocker instead of failing earlier on port-collision noise.
- 2026-04-29: queued `GOLIVE-2026-04-29-A` as the next smallest quality slice after the final `LIVE` protection hardening wave. Canonical go-live API/web packs are green, but the umbrella wrapper `pnpm run test:go-live:smoke` still fails too early in the common local environment because it cannot reuse already-running Postgres/Redis and it surfaces local Prisma failed-migration state too opaquely. The next slice is tooling-only: harden the smoke wrapper and local-development guidance without weakening the migration or smoke contract.
- 2026-04-29: closed the full `V1GUARD-A` wave. The last confirmed repository-level `LIVE` protection drifts after `V1SAFE-A` are now closed without expanding the architecture surface: shared lifecycle logic now keeps `TTP` behind the canonical `DCA-first` guard, exchange-confirmed `LIVE DCA` fills now converge both runtime execution dedupe and persisted runtime position-state truth instead of leaving `currentAdds` stale after a submitted market add, and runtime protection evaluation now consumes one explicit lifecycle-price seam instead of hardcoding ticker `lastPrice` in the automation path. Closure evidence: `docs/operations/v1guard-live-protection-final-closure-2026-04-29.md`. Validation PASS: focused `positionManagement`, focused `runtimePositionAutomation`, focused `orders.exchangeEvents`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: queued `V1GUARD-A` as the next narrow hardening wave after a fresh audit of the remaining money-impacting `LIVE` protection behavior. The strongest confirmed gaps are now three concrete drifts rather than a broad architecture rewrite: shared lifecycle logic still lets `TTP` bypass the mandatory `DCA-first` guard, async `LIVE DCA` fills can update canonical position truth without converging runtime management state in the same lifecycle, and runtime protection evaluation still consumes ticker `lastPrice` directly instead of one explicit lifecycle-price seam. Canonical packet: `docs/planning/v1guard-live-protection-final-hardening-plan-2026-04-29.md`.
- 2026-04-28: closed `DOCSYNC-2026-04-28-E` as the final historical-status normalization slice. The remaining ambiguous planning headers using `PLANNED`, `planned`, or `Published` for already closed work were normalized, and `planning-catalog-index-2026-04-19.md` now records those source artifacts truthfully as historical implemented or superseded references. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-28: closed `DOCSYNC-2026-04-28-D` as the follow-up planning-catalog parity slice. `planning-catalog-index-2026-04-19.md` now reflects the post-2026-04-20 wave history, including newer `implemented` and `superseded` plan artifacts, and the stale `Status: queued` header in the already closed `UOLF` plan was corrected to match canonical closure truth. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-28: closed `DOCSYNC-2026-04-28-C` as a docs-only planning-parity slice. Several historical plan packets still advertised `Status: Active` even though canonical closure had already been recorded elsewhere. The sync corrected stale headers for `SCALE-A`, `V1FACT-A`, `V1TAKE-01`, `XADAPT-02`, and `XADAPT-06`, restoring trigger-intent trust without changing runtime or feature behavior. Validation PASS: `pnpm run quality:guardrails`.
- 2026-04-28: closed `QH-E2E-2026-04-28-A` as a pure quality/harness stabilization slice for the legacy `markets` and `wallets` CRUD e2e suites. The approved domain behavior from `UXSAFE-2026-04-28-A` remains unchanged; the fix was to remove local suite instability instead of weakening protections. `markets.e2e.test.ts` now runs deterministically with one-time cleanup plus unique per-test user identities, while `wallets.crud.e2e.test.ts` now uses unique per-test identities and a narrow shared bearer helper only for explicit multi-user ownership/list isolation scenarios. Validation PASS: full `pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts`, full `pnpm --filter api exec vitest run src/modules/wallets/wallets.crud.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-28: refreshed the active queue after closing the production smoke/release work. No unresolved architecture decisions remain, and the next smallest V1-quality slice is now `QH-E2E-2026-04-28-A`: recover deterministic full green execution for the legacy `markets` and `wallets` CRUD e2e suites. This is explicitly a test/harness quality task, not a runtime-behavior relaxation, because the focused regressions added in `UXSAFE-2026-04-28-A` already proved the shipped domain fixes while the broader full-file suites still contain older local noise.
- 2026-04-28: closed `UXSAFE-2026-04-28-A` as a focused dashboard-management safety slice for `markets` and `wallets`. `MarketUniverse` edit/delete now follows the approved active-usage rule: linked inactive bots no longer block save, but active bot ownership still fails closed across direct primary bot context, canonical market-group links, and legacy bot-strategy scope. The same slice also hardens wallet deletion by detaching nullable historical `walletId` references from `Position`, `Order`, and `Trade` before deleting the wallet, preserving operator history and removing the raw internal-error path previously seen from wallet list delete. Validation PASS: focused `markets.e2e` active/inactive regressions, focused `wallets.crud.e2e` history-detach regression, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-28: closed the remaining operational step of `V1FIX-2026-04-26-B` by pushing `25276b475937d9dcf4af6337abf10185ec7dcd0c` to production and running an authenticated affected-account smoke on the live dashboard. Public prod baseline passed (`/health`, `/ready`, root, protected-route redirect, protected metrics denial), `GET /api/build-info` confirmed the exact deployed SHA, and the affected account now loads `/dashboard` with live runtime truth visible for the selected live bot, including the managed `DOGEUSDT SHORT` position and authenticated exchange-balance wallet context. Evidence: `docs/operations/v1fix-2026-04-26-b-prod-smoke-2026-04-28.md`.
- 2026-04-28: closed `BOTLIVE-2026-04-28-A` as a focused runtime-scope safety guard for the singular bot contract. Bot create/update now fails closed if a bot would become `LIVE + isActive + liveOptIn` while its selected market-group symbols overlap any symbol already covered by another active opted-in LIVE bot for the same user. The rule intentionally does not block `PAPER` versus `LIVE` overlap, and inactive/non-opted-in LIVE drafts remain allowed until they would become real active LIVE runtime scope. Conflict responses now persist exact blocking symbol and bot-name details so operators can remove the offending symbol from the market group instead of guessing why activation was denied. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-28: closed `V1RESTART-01` as the first implementation step of the new restart-continuity wave. Architecture now explicitly freezes one canonical `LIVE` restart and downtime continuity model: restart is not lifecycle close authority, one missing post-restart snapshot is not sufficient to close a previously open exchange position, supported exchange events outrank one weak startup snapshot, and recovered `LIVE` positions may become visible before they become actionable again. Canonical recovery requires deterministic restoration or preservation of `botId + walletId + strategyId`; visibility alone is no longer allowed to imply safe resumed DCA/TSL automation. Canonical artifacts: `docs/architecture/reference/live-position-restart-continuity-contract.md`, `docs/architecture/06_execution-lifecycle.md`, `docs/architecture/04_runtime-contexts.md`, and `docs/architecture/reference/position-lifecycle-parity-matrix.md`.
- 2026-04-28: closed the full `V1RESTART-A` implementation wave for restart-safe LIVE position continuity. `Position` persistence now carries explicit continuity truth (`continuityState`, `lastExchangeSeenAt`, `lastExchangeSyncAt`, `missingSince`, `missingSyncCount`) via migration `20260428113000_add_position_restart_continuity_state`; exchange-confirmed close paths mark `EXTERNAL_CLOSE_CONFIRMED`; `livePositionReconciliation.service.ts` now stages missing imported rows through `RECOVERING` before any external-close classification instead of closing after one weak pass; deterministically owned recovered imported rows now restore or preserve canonical `botId + walletId + strategyId` by reusing `bot.strategyId`; runtime automation and manual runtime close both stay fail-closed until continuity returns to `CONFIRMED`; runtime/read models now surface `continuityState` plus `actionable`; and dashboard runtime typing plus open-position presentation now show degraded recovered rows explicitly while disabling row actions until continuity is restored. Validation PASS: focused restart reconciliation tests, focused runtime automation tests, focused recovered-visibility e2e, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, and `pnpm run quality:guardrails`. Local schema validation note: Prisma `migrate deploy` remained blocked by the pre-existing failed local migration `20260424094500_add_single_context_bot_refs`, so this wave validated the new schema locally with `pnpm --filter api exec prisma db push` after generating the client.
- 2026-04-28: approved the highest-quality target direction for the newly reported LIVE restart-position continuity gap. The repository must not treat bot or worker restart as authority to close or de-own open exchange positions after one weak recovery pass. The next wave `V1RESTART-A` is now queued as a canonical continuity hardening packet: supported exchange events are the strongest restart-recovery evidence, REST reconciliation is recovery/confirmation rather than one-pass destructive authority, previously open LIVE positions must survive restart uncertainty through explicit continuity states, and recovered owned positions must restore canonical `botId + walletId + strategyId` context before DCA/TSL automation is considered safely resumed. Canonical artifact: `docs/planning/v1restart-live-position-continuity-hardening-plan-2026-04-28.md`.
- 2026-04-29: published `V1PARITY-A` as the next canonical post-V1 hardening wave after a focused repository review of remaining implementation drift. The strongest confirmed issue behind the reported `PAPER DCA works / LIVE DCA does not` symptom is lifecycle parity, not one isolated UI defect: exchange-confirmed fills on existing LIVE positions do not fully reuse canonical add-update lifecycle authority, add-leg fills are still persisted as generic `OPEN` instead of explicit `DCA`, account-update reconciliation still scopes too broadly by `userId + symbol + side`, runtime read models can visually mask missing canonical `strategyId` through symbol-level fallback, and fail-closed runtime automation skips are still under-exposed to operator telemetry. Canonical packet: `docs/planning/v1parity-live-runtime-lifecycle-parity-hardening-plan-2026-04-29.md`.
- 2026-04-29: closed `V1PARITY-01` as the contract-freeze slice for the new parity wave. Architecture now explicitly requires that confirmed LIVE add-fills on an existing `positionId` update canonical quantity and entry from fill truth instead of waiting for later account snapshots, that add-leg persistence preserves explicit `DCA` semantics, that `ACCOUNT_UPDATE` is confirmation/repair rather than broad rewrite authority across all `userId + symbol + side` rows, and that operator read models must not present symbol-level fallback as if missing canonical `position.strategyId` were still actionable runtime truth. Canonical artifact: `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`.
- 2026-04-29: closed the full `V1PARITY-A` wave. Existing-position LIVE fills now reuse canonical add-update lifecycle authority directly inside `orders.exchangeEvents.service.ts`, add-leg fills persist explicit `DCA` semantics, and `ACCOUNT_UPDATE` reconciliation is constrained to canonical owned LIVE candidates instead of global `userId + symbol + side` scope. Runtime session read models no longer surface DCA/TSL strategy plans through symbol fallback when canonical `position.strategyId` is unresolved, which keeps operator truth aligned with the fail-closed runtime engine. The same wave also adds operator-visible `PRETRADE_BLOCKED` telemetry for covered LIVE automation skip classes (`continuity_state_unconfirmed`, `canonical_execution_context_unresolved`, `live_opt_in_disabled`) instead of leaving those paths as console-only diagnostics. Closure evidence: `docs/operations/v1parity-live-runtime-lifecycle-parity-closure-2026-04-29.md`. Validation PASS: focused `orders.exchangeEvents`, `runtimePositionAutomation`, `bots.runtime-strategy-context`, focused DCA ladder e2e, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-29: published `V1SAFE-A` as the next canonical hardening wave after fresh real-account reports around `LIVE` protection drift. The strongest confirmed repository gap is now narrower than the first `V1SAFE` draft implied: Soar still lacks one canonical `DCA/TTP/TSL` parity model for imported and recovered `LIVE` positions. Runtime trailing execution still depends on persisted management state, runtime read-models can still imply dynamic protection through fallback logic the engine cannot execute, and `DCA-first` close gating still lacks focused parity proof across `backtest`, `paper`, and `live` for the reported symptom class. The wave is therefore narrowed away from a broad exchange-native redesign and toward imported/recovered trailing-state hydration, operator/runtime protection-state honesty, and end-to-end `DCA/TTP/TSL` parity. Canonical packet: `docs/planning/v1safe-live-protection-and-liquidation-safety-plan-2026-04-29.md`.
- 2026-04-29: closed the full `V1SAFE-A` wave. Architecture now explicitly freezes one canonical `LIVE` protection-state parity contract for imported and recovered positions: runtime protection state is the only execution truth for dynamic `TTP` / `TSL`, the repository must not retroactively invent unseen trailing history from one exchange snapshot, and prospective protection from the adoption point onward is allowed when owner, strategy, and execution context are canonical. Focused runtime coverage now proves imported `LIVE` positions can arm `TTP` prospectively and close on later retrace, API runtime-position serialization now derives `TTP` only from canonical trailing runtime state and `TSL` from canonical trailing-anchor truth, and dashboard-home plus bot-monitoring surfaces no longer overlay sticky display fallback that could imply stronger protection than the runtime engine can really execute. Closure evidence: `docs/operations/v1safe-live-dca-ttp-tsl-parity-closure-2026-04-29.md`. Validation PASS: focused `runtimePositionAutomation`, focused `runtimePositionSerialization`, API/web typechecks, focused `HomeLiveWidgets`, focused `BotsManagement`, and repository guardrails.
- 2026-04-27: approved and normalized the canonical close-attribution model after a fresh audit of runtime close, exchange-event close, reconciliation disappearance, and repair-only cleanup semantics. The repository architecture now explicitly separates `closeReason` from `closeInitiator`; canonical V1 initiator scope is `BOT_APP`, `USER_APP`, `USER_EXCHANGE`, `EXCHANGE`, and `SYSTEM_REPAIR`. Reconcile-driven exchange disappearance without stronger exchange event proof is now planned to persist as `closeInitiator=USER_EXCHANGE` with `closeReason=EXTERNAL_SYNC_MISSING`, while repair-only orphan cleanup remains a distinct `SYSTEM_REPAIR` path. Canonical artifacts: `docs/architecture/reference/position-close-attribution-contract.md` and `docs/planning/v1close-position-close-attribution-hardening-plan-2026-04-27.md`.
- 2026-04-27: closed `V1CLOSE-A` end to end. Prisma persistence now carries nullable `closeReason` and `closeInitiator` on `Position`, `Order`, and `Trade`; shared mapping lives in `apps/api/src/modules/positions/positionCloseAttribution.ts`; app-driven manual close persists `MANUAL + USER_APP`, bot lifecycle close persists canonical `BOT_APP` attribution, exchange confirmation preserves stronger existing attribution while still allowing liquidation refinement, reconcile disappearance persists `EXTERNAL_SYNC_MISSING + USER_EXCHANGE`, and orphan repair persists `SYSTEM_REPAIR + SYSTEM_REPAIR`. Runtime read models and dashboard aggregate history now expose close-attribution truth directly to operators. Validation PASS: focused API close-attribution pack, focused dashboard aggregate-history pack, repository typechecks, repository guardrails, and full workspace build.
- 2026-04-26: refined `V1LIVE-A` so it matches the approved exact exchange-context architecture. The frozen repository truth is now explicit: `PAPER` must remain exchange-free, `LIVE` must stay inside the approved exchange boundary, adapter selection must follow the exact user/bot `exchange + marketType` settings, unsupported exchange paths must fail closed instead of falling back to Binance, imported-position ownership must be decided by one canonical classifier reused across reconciliation/runtime/takeover flows, and imported live entry truth must not fall back to `markPrice`. The first adapter family to be completed in this wave is `BINANCE + SPOT` plus `BINANCE + FUTURES`, which serves as the template for future exchange adapters. Canonical artifacts: `docs/planning/v1live-binance-execution-and-takeover-hardening-plan-2026-04-26.md` and `docs/planning/v1live-00-planning-task-2026-04-26.md`.
- 2026-04-26: closed `V1FIX-2026-04-26-A` after reproducing the production manual-order `500` directly in `soar-api`. The root cause was a real lifecycle gap, not a web issue: `applyOrderFillLifecycle()` still tried to create a second `OPEN` position for the same user and symbol even though the canonical lifecycle contract and production DB index still enforce one open position per symbol. Same-direction manual fills now reuse/update the existing position with weighted entry repricing, and reverse-direction opens fail closed with explicit `OPEN_POSITION_SIDE_CONFLICT` API semantics. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: queued and implemented the first closure slice of `V1FIX-2026-04-26-B` after browser-level production repro on the real user account exposed a deeper source of truth problem: authenticated Binance Futures snapshot still returns the real external position, but legacy local `OPEN` rows with `botId=null` were surviving from older topology waves and silently blocking both manual-order reuse and exchange takeover/runtime projection. The repository now has an explicit authenticated repair endpoint `POST /dashboard/positions/orphan-repair` that rebinds local open rows only when canonical bot proof exists, closes only fully detached local open orphans, then forces exchange reconciliation + takeover rebind so current exchange truth can re-enter the canonical runtime path. Validation PASS: `pnpm --filter api test -- --run src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`. Remaining work is operational: deploy to prod, run repair on the affected account, and re-check dashboard/manual-order/takeover behavior live.
- 2026-04-26: queued and implemented `V1FIX-2026-04-26-C` after post-repair real-account browser verification on prod exposed one more canonical-scope drift: manual open-order conflict detection and fill reuse still searched `OPEN` positions globally by `userId + symbol`, so a `LIVE` DOGE position on one wallet falsely blocked a `PAPER` DOGE manual order on another wallet. The repository now centralizes open-position scope resolution under wallet-first/bot-fallback semantics in `orders.positionScope.ts`, both manual pre-submit conflict checks and fill-lifecycle adoption reuse that same scope, and a new migration replaces the old global partial unique index with wallet-/bot-/unowned-scoped partial unique indexes. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`. Remaining work is operational: deploy to prod, rerun the dashboard manual-order flow on the affected account, and confirm the new wallet-scoped behavior live.
- 2026-04-26: the repository is now locally deploy-ready for the remaining `V1FIX-2026-04-26-B` production closure. The final backtests/release-readiness pass aligned wallet-first takeover fixtures with the live ownership contract, hardened slow 3-symbol parity report polling so the canonical diagnostics contract is awaited honestly in the go-live pack, and made backtest delete resilient to async worker/report races. Validation PASS: `pnpm --filter api exec vitest run src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtests.e2e.test.ts`, `pnpm run test:go-live:api`, `pnpm run typecheck`, `pnpm run quality:guardrails`, `pnpm run build`. The remaining work is now operational only: deploy the latest repository state plus the open scoped-uniqueness migration to production and rerun the affected real-account dashboard/takeover smoke.
- 2026-04-26: closed `V1LIVE-PROD-2026-04-26-A` after real-account production browser verification proved the last manual-order blocker on the dashboard was web-only stale symbol-context drift. `useManualOrderController.ts` now accepts manual-order context price only when it matches the current `selected.bot.id + manualOrderSymbol`, so the deployed dashboard no longer submits a current symbol with a previous-symbol price frozen from stale context.
- 2026-04-26: closed `V1LIVE-PROD-2026-04-26-B` after three real-account production verification loops on the affected live bot. The production API now normalizes/imports Binance Futures leverage truth from nested raw payload fields and derives it from notional-versus-margin when the explicit leverage field is absent, then rounds imported leverage before persistence so floating-point precision cannot degrade `15x` to `14x`. `livePositionReconciliation` also now treats open-orders snapshot failure as fail-soft for stale local managed LIVE cleanup, which allowed the historical phantom `BNBUSDT` row to be closed as `ORPHAN_LOCAL` on the real account while the active imported `DOGEUSDT` position persisted with truthful `leverage=15`. Post-deploy production evidence after authenticated repair: exchange snapshot returns `DOGEUSDT` with `leverage≈15`, runtime `openItems` contains only the real `DOGEUSDT` position at `15x`, and stale `BNBUSDT` moved to runtime history instead of remaining actionable.
- 2026-04-26: published `docs/planning/v1live-post-fix-quality-audit-and-plan-2026-04-26.md` as the next post-hotfix audit baseline. The audit confirms the product is materially healthier on the verified production account, but the highest-value remaining quality work is still architectural rather than cosmetic: exact exchange-context truth, fail-closed imported entry truth, one ownership classifier across live-position surfaces, event-driven Binance lifecycle truth, and removal of legacy/fallback operator-surface seams after those contracts are proven.
- 2026-04-26: closed the first two execution packets inside `V1LIVE-A`. Exact exchange-context truth is now enforced in runtime watchdog and runtime position automation without hidden env-driven `BINANCE/FUTURES` defaults, live-order boundary submit now fails closed if the resolved API-key exchange drifts from the selected bot exchange, and imported LIVE reconciliation no longer falls back from missing `entryPrice` to `markPrice`. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed the imported-ownership/runtime parity packet inside `V1LIVE-A` (`V1LIVE-04/05/08/09`). The repository now has one canonical imported LIVE ownership classifier keyed by exact `apiKeyId + symbol` with explicit `OWNED | AMBIGUOUS | MANUAL_ONLY | UNOWNED` semantics, and that truth is reused by exchange reconciliation, takeover-status/rebind, runtime imported-position visibility, and runtime close authority. Focused regressions now prove shared-API-key symbol isolation, wallet-managed versus manual-only takeover truth, and exact runtime visibility/close claiming for imported `EXCHANGE_SYNC` rows. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed `V1LIVE-10` as the signal-driven `LIVE` regression lock before adapter-family completion. The repository now has focused coverage proving a runtime signal for a `LIVE` bot may remain explicitly `submitted` without fabricating `POSITION_OPENED` or degrading into `PRETRADE_BLOCKED`, while still forwarding exact canonical runtime context (`walletId`, `strategyId`, `strategyLeverage`, candle window, `mode`, and current mark price) into the orchestration boundary. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed `V1LIVE-11` as the first explicit Binance adapter-family completion slice. The repository no longer treats the first live adapter family as a generic futures-only path under exact-context APIs: `BINANCE + SPOT` now resolves through an explicit spot connector path, `BINANCE + FUTURES` through the futures path, and focused boundary tests now lock SPOT live submit separately from futures submit. The exchange module also now contains a boundary-ready `binanceUserDataStream.service.ts` plus normalized event types for exact listenKey lifecycle and supported Binance account/order websocket events across both SPOT and FUTURES, which sets up `V1LIVE-12` to wire event truth into canonical order/position lifecycle without creating a parallel execution system. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed `V1LIVE-12` as the first event-driven lifecycle slice for the supported Binance family. The repository now has one canonical apply seam for normalized Binance stream events: confirmed `ORDER_TRADE_UPDATE`/`executionReport` fills can update orders, create idempotent `orderFill` rows, materialize open positions through `applyOrderFillLifecycle()`, and close linked LIVE positions with realized-PnL/trade persistence on confirmed exit fills, while supported `ACCOUNT_UPDATE` payloads can refresh canonical open-position quantity, entry, and unrealized-PnL truth. This keeps the exchange event path inside the existing order/position lifecycle instead of spawning a sidecar execution system. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- 2026-04-26: closed `V1LIVE-13` by removing the last residual compatibility debt inside the wave instead of shipping around it. `RuntimeSidebarSection.tsx` no longer reads the legacy strategy fallback for canonical manual-order sidebar context, and the stale `orders-positions.e2e` LIVE imported-position fixtures now encode the exact ownership contract required by the current runtime classifier: `bot.apiKeyId + wallet.apiKeyId + externalId(apiKeyId:symbol:side)`. Focused validation PASS: `pnpm --filter api test -- --run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption|keeps EXCHANGE_SYNC BOT_MANAGED runtime positions visible for LIVE bot even when PAPER bot shares symbol|closes EXCHANGE_SYNC BOT_MANAGED runtime position selected from LIVE dashboard flow"`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`.
- 2026-04-26: closed `V1LIVE-14` and with it the full `V1LIVE-A` wave. Final focused closure evidence is green across exact exchange-context selection, imported-position ownership/runtime parity, signal-driven LIVE submit truth, Binance Spot/Futures adapter-family parity, normalized Binance event lifecycle application, manual LIVE runtime visibility, imported-position close authority, web runtime-sidebar cleanup, repository typecheck, and repository guardrails. The remaining open repository work is no longer inside `V1LIVE-A`; it has moved back to other operational or post-V1 hardening tracks.
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

## Autonomous Iteration State
- Current iteration:
- Current operation mode: BUILDER | ARCHITECT | TESTER
- Last completed iteration:
- Last completed task:
- Next required mode:
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
  `analyze -> select one task -> plan -> implement -> verify -> self-review -> sync knowledge`.
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
