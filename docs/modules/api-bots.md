# API Deep-Dive: Bots Module

## Metadata
- Module name: `bots`
- Layer: `api`
- Source path: `apps/api/src/modules/bots`
- Owner: backend/trading-domain
- Last updated: 2026-05-21
- Related planning task: `REST-IMPLEMENTATION-SWEEP-2026-05-21`

## Canonical Architecture Linkage
Canonical runtime topology and ownership rules live in:
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/08_operator-surfaces-and-routing.md`

## 1. Purpose and Scope
- Owns bot command + runtime read APIs:
  - bot lifecycle CRUD
  - runtime graph and session observability
  - market-group and strategy-link orchestration
  - assistant config + dry-run contract
- Bridges bot writes to wallet/strategy/market-group constraints and subscription/consent checks.

Out of scope:
- Core signal loop internals (engine module).
- Raw exchange execution transport (exchange module).

## 2. Boundaries and Dependencies
- Mounted under `/dashboard/bots`.
- Depends on:
  - `prisma` bot/runtime persistence.
  - `engine` services (`runtimeSignalLoop`, execution orchestration, telemetry stores).
  - `wallets`, `subscriptions`, and consent/activation policy helpers.
  - symbol/risk/read-model enrichment helpers in module-local services/repositories.

## 3. Data and Contract Surface
- Command contracts:
  - `CreateBotDto`, `UpdateBotDto`, market-group/strategy link DTOs.
- Runtime read contracts:
  - sessions, symbol stats, positions, trades, runtime graph.
  - aggregate monitoring payload (`sessionDetail + symbolStats + positions + trades`).
  - bot portfolio history payload (`window + summary + points + markers`).
- Assistant contracts:
  - get/upsert config, subagent slot operations, dry-run decision trace.
- Key invariants:
  - wallet-market context compatibility.
  - LIVE consent + opt-in requirements.
  - LIVE create and `PAPER -> LIVE` mode switch require
    `entitlements.features.liveTrading=true`.
  - activation capability checks and duplicate active-bot protections.

## 4. Runtime Flows
- Create/update bot:
  1. Validate ownership of strategy/market-group/wallet.
  2. Derive mode/exchange/marketType/apiKey from wallet context.
  3. Validate consent + activation policy.
  4. Persist bot + canonical market-group/strategy-link state.
  5. For market-universe-backed auto-groups, resolve symbols using shared contract.
- Runtime read:
  - aggregate session telemetry, symbol stats, position/trade enrichment, fallback market data.
  - dynamic TTP stop rows include source metadata so clients can distinguish
    canonical runtime-state protection from strategy-derived prospective
    display fallback.
  - bot-scoped portfolio history with PAPER reset and LIVE wallet-capital markers.
- Assistant dry-run:
  - load bot assistant config/subagents and execute deterministic orchestration trace.

## 5. API and UI Integration
- Representative routes:
  - `GET/POST/PUT/DELETE /dashboard/bots`
  - `GET /dashboard/bots/:id/runtime-graph`
  - `GET /dashboard/bots/:id/runtime-monitoring/aggregate`
  - `GET /dashboard/bots/:id/portfolio-history`
  - `GET /dashboard/bots/:id/runtime-sessions`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/positions`
  - `POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades`
  - `GET /dashboard/bots/strategy-drift`
  - `POST /dashboard/bots/strategy-drift/repair`
  - `GET/POST /dashboard/bots/:id/market-groups`
  - `GET/PUT/DELETE /dashboard/bots/:id/market-groups/:groupId`
  - `GET/POST /dashboard/bots/:id/market-groups/:groupId/strategies`
  - `PUT /dashboard/bots/:id/market-groups/:groupId/strategies/reorder`
  - `PUT/DELETE /dashboard/bots/:id/market-groups/:groupId/strategies/:linkId`
  - `GET/PUT /dashboard/bots/:id/assistant-config`
  - `PUT/DELETE /dashboard/bots/:id/assistant-config/subagents/:slotIndex`
  - `POST /dashboard/bots/:id/assistant-config/dry-run`

## 6. Security and Risk Guardrails
- Dashboard auth + ownership checks on all bot/runtime/assistant paths.
- LIVE activation requires explicit consent and capability validation.
- LIVE capability also requires active-plan `liveTrading` entitlement on bot
  create and `PAPER -> LIVE` transition paths.
- Mode-switch guard prevents unsafe PAPER->LIVE transitions with open managed positions.

## 7. Observability and Operations
- Runtime session/event/symbol stat telemetry integrated with engine services.
- Read models include stale/fallback handling for runtime market context.
- Extensive e2e coverage across create/update/runtime/entitlement scenarios.
- Drift triage/repair operation path for dashboard parity incidents:
  - audit: `GET /dashboard/bots/strategy-drift`
  - repair: `POST /dashboard/bots/strategy-drift/repair` (idempotent, ownership-scoped)

## 8. Test Coverage and Evidence
- Primary local audit evidence:
  - `docs/operations/bots-runtime-truth-audit-2026-05-19.md`
  - Web bot/runtime pack: `8` files / `61` tests.
  - API bot/runtime pack: `10` files / `88` tests.
- Representative API tests:
  - `bots.e2e.test.ts`
  - `bots.duplicate-guard.e2e.test.ts`
  - `bots.subscription-entitlements.e2e.test.ts`
  - `bots.wallet-contract.e2e.test.ts`
  - `bots.runtime-scope.e2e.test.ts`
  - `bots.monitoring-aggregate.e2e.test.ts`
  - `bots.runtime-history-parity.e2e.test.ts`
  - `bots.delete-cleanup.e2e.test.ts`
  - `bots.live-paper-concurrent.e2e.test.ts`
  - `bots.runtime-takeover.e2e.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts src/modules/bots/bots.wallet-contract.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/bots.runtime-history-parity.e2e.test.ts src/modules/bots/bots.delete-cleanup.e2e.test.ts src/modules/bots/bots.live-paper-concurrent.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --testTimeout=30000
```

## 9. Open Issues and Follow-Ups
- Continue splitting oversized read/command surfaces where maintainability pressure is high.
- Complete error taxonomy migration for deterministic controller mapping.

## 10. Dashboard Ownership and Actionability Contract (`UXR-01`)
- Runtime positions read model (`listBotRuntimeSessionPositions`) is scoped to `managementMode=BOT_MANAGED` only.
- Dashboard `positions` rows for selected bot are allowed from:
  - direct ownership (`position.botId === selectedBotId`),
  - external takeover (`origin=EXCHANGE_SYNC`, `botId=null`) only if deterministic symbol ownership resolves to selected bot.
- Deterministic owner resolution for external symbol takeover is frozen as:
  - active bot first,
  - lower market-group `executionOrder`,
  - earlier bot `createdAt`,
  - lexical bot id tie-break.
- External-position ownership proof (`resolveExternalPositionOwnershipIndex`)
  must resolve active canonical bot market groups through the shared
  catalog-aware configured symbol resolver before building API-key+symbol
  ownership keys. Market-universe-backed groups with empty direct `symbols`
  but whitelist/filter catalog scope are valid ownership scope.
- Close action (`closeBotRuntimeSessionPosition`) is fail-closed:
  - allowed only for `OPEN + BOT_MANAGED + wallet-compatible` rows owned directly or through external deterministic mapping,
  - allowed only when the target symbol belongs to the selected bot's active
    configured symbol scope when a symbol group is available,
  - LIVE manual close requires a trusted close reference price from lifecycle
    mark price, fallback ticker, or public connector mark price; it must not
    use position `entryPrice` as a close-price fallback,
  - all other paths return `status=ignored`, `reason=no_open_position`.
- External takeover audit statuses from positions module are non-actionable in dashboard close flow:
  - `UNOWNED`, `AMBIGUOUS`, `MANUAL_ONLY`.
- Dashboard `orders` contract for this module:
  - tab is always visible in LIVE and PAPER contexts,
  - rows are bot/wallet-scoped `BOT_MANAGED` open-order states (`PENDING`, `OPEN`, `PARTIALLY_FILLED`),
  - selected LIVE bot direct open orders include legacy rows with
    `walletId=null` when `botId` matches the selected bot; wallet-only rows
    without selected bot ownership remain excluded unless the existing
    external-owned path proves ownership,
  - empty list is valid runtime state (tab must stay visible).

## 11. Selected-Bot Runtime Symbol Scope Contract (`BRS-01`)
- Runtime symbol scope for dashboard selected bot is strict and canonical by default:
  - only `ACTIVE + isEnabled` canonical `botMarketGroup + marketGroupStrategyLink` scope contributes symbols and strategy context.
  - `PAUSED` market-groups are excluded from default runtime read symbol scope used by dashboard `signals/markets`.
- Scope enrichment boundaries:
  - session stats and runtime-event fallback can enrich canonical selected-bot symbols only.
  - fallback paths cannot add symbols outside canonical selected-bot active scope.
  - explicit `symbol` filters on runtime symbol-stats are intersected with
    canonical selected-bot active scope; off-scope symbols return an empty
    zero-summary read model instead of stale persisted stats.
  - explicit `symbol` filters must validate against the full configured
    selected-bot symbol scope before response pagination/`limit` is applied,
    so configured symbols later in the market list remain queryable.
  - unfiltered runtime symbol-stats `limit` selects display rows from
    configured selected-bot symbol order, then hydrates persisted stat rows for
    that exact symbol set; top-PnL database ordering cannot cause a displayed
    configured symbol to render zero totals when its stat row exists.
  - explicit `symbol` filters on runtime trade history are intersected with
    the same selected-bot active scope; off-scope symbols return an empty
    paginated trade response instead of stale persisted `Trade.botId` rows.
  - runtime trade history and runtime positions also apply selected-bot active
    scope to unfiltered/default reads; persisted `Trade.botId` or
    `Position.botId` rows for off-scope symbols are not valid selected-bot
    dashboard rows after market reassignment.
- Strategy context precedence:
  - canonical mapping is authoritative.
  - when an active canonical market group exists but has no enabled strategy
    links, configured strategy context remains empty instead of falling back to
    direct legacy `Bot.strategyId`.
  - legacy mapping is compatibility fallback only when canonical mapping is missing for selected bot/symbol, and cannot override canonical mapping.

## 12. Sidebar Strategy Projection Parity Contract (`SBSC`)
- `listBots` and `getBot` strategy projection (`strategyId`) must stay compatible with runtime graph primary strategy for the same bot.
- Strategy projection precedence for dashboard-facing read model:
  - canonical active+enabled `marketGroupStrategyLinks` first,
  - legacy `botStrategies` as compatibility fallback only.
- Bot list/get read projection precedence:
  - canonical `BotMarketGroup` primary scope overlays response
    `strategyId`, `strategy`, `symbolGroupId`, and `symbolGroup`,
  - direct `Bot.strategy` / `Bot.symbolGroup` remains compatibility fallback
    only when canonical market-group topology is unavailable.
- Bot update guard precedence:
  - when update payload does not explicitly replace strategy or market group,
    duplicate-active validation and LIVE overlap validation derive their target
    from active canonical `BotMarketGroup` and enabled
    `MarketGroupStrategyLink` rows,
  - when canonical market-group topology exists but has no enabled strategy
    links, update defaults keep strategy scope empty/non-actionable instead of
    selecting disabled links or direct legacy `Bot.strategyId`,
  - direct `Bot.strategyId` / `Bot.symbolGroupId` remains compatibility
    fallback only when canonical market-group topology is unavailable.
- Runtime position dynamic-stop visibility:
  - `showDynamicStopColumns` evaluates active canonical
    `BotMarketGroup` / `MarketGroupStrategyLink` strategy configs when
    present,
  - legacy `BotStrategy` rows are compatibility fallback only when canonical
    strategy-link topology is unavailable,
  - stale legacy advanced-close rows must not turn on TTP/TSL columns for a
    canonical basic-close selected-bot view.
- Runtime position symbol-level dynamic-stop plans:
  - TTP/TSL plan maps by symbol keep active canonical entries authoritative,
  - legacy `BotStrategy` rows can fill only symbols without canonical plan
    entries,
  - stale legacy advanced-close rows must not overwrite canonical basic-close
    TTP/TSL symbol plans.
  - strategy-null runtime positions may display canonical symbol-level
    DCA/TTP/TSL plans when active `BotMarketGroup` /
    `MarketGroupStrategyLink` scope resolves the selected symbol, but this
    display context does not make the position executable; `actionable`
    remains fail-closed until an executable strategy identity is available.
- Drift policy:
  - legacy link state may exist for backward compatibility, but it cannot override canonical runtime topology in dashboard strategy contexts.
  - module should expose deterministic diagnostics/repair path for legacy-canonical divergence to support operations closure.

## 13. Aggregate Wallet Summary and Sidebar Edge Contract (`DAWR`)
- Aggregate read contract (`GET /dashboard/bots/:id/runtime-monitoring/aggregate`) must expose wallet-capital parity fields in `positions.summary`:
  - `referenceBalance`,
  - `freeCash`.
- Capital parity rules:
  - when aggregate source can resolve capital context, `referenceBalance/freeCash` are finite non-negative values.
  - when capital context cannot be resolved, aggregate keeps explicit `null` fields instead of omitting keys.
- Sidebar edge linkage:
  - selected-bot strategy context remains runtime-topology-first even when projected `strategyId` is null/mismatched.
  - compatibility fallback cannot override canonical runtime topology when canonical mapping exists.

## 14. Signals + Open Runtime Parity Contract (`SOPR`)
- Consolidated prerequisites:
  - `DAGG` selected-bot aggregate runtime-table contract.
  - `SBSC` selected-bot strategy projection + sidebar parity contract.
  - `DAWR` aggregate wallet-summary parity and sidebar null/mismatch edge contract.
- Selected-bot signal context contract:
  - symbol stats and signal context are selected-bot scoped only.
  - strategy context precedence:
    - latest runtime signal strategy context first when present,
    - canonical configured strategy fallback only when latest signal context is missing.
  - read model must expose explicit strategy-context source tag to avoid hidden fallback ambiguity:
    - `latest_signal`,
    - `configured_fallback`,
    - `unresolved`.
- Cross-surface parity contract:
  - API payloads consumed by `/dashboard` and `/dashboard/bots/:id/preview` for the same selected bot must remain parity-compatible for `signals`, `positions`, and `history`.
- Runtime diagnostics contract:
  - no-open blocked/ignored outcomes remain explicit and queryable in operational payload/log flows.

## 15. Market-Universe Symbol Contract Parity (`MURC`)
- Selected-bot runtime symbol scope that comes from market-universe-backed groups must use one shared formula:
  - `final = unique(filter_result U whitelist) - blacklist`.
- Edge rules:
  - `filter_result` exists only when `minQuoteVolumeEnabled=true`,
  - `filter off + empty whitelist` resolves to empty set,
  - blacklist-only input does not introduce symbols.
- Contract parity requirement:
  - runtime symbol scope, bot auto-created symbol-group snapshots, and cross-module consumers must stay parity-compatible for identical universe input.

## 16. Unified Order Lifecycle Scope and Exchange Takeover Contract (`UOLF-01`)
- Lifecycle scope invariants:
  - manual dashboard opens and runtime signal opens must resolve canonical selected-bot context (`bot`, `wallet`, `mode`, `strategy`) before order lifecycle writes.
  - lifecycle ownership target is one order->fill->position path shared by manual and runtime entries.
  - runtime signal execution must pass `markPrice` into MARKET order-open command payload so fill-price resolution does not degrade to zero-entry lifecycle artifacts.
- Selected-bot read/write strictness:
  - selected-bot runtime responses for orders/positions/history remain strictly bot-scoped.
  - cross-bot and cross-mode leakage is fail-closed.
- Imported exchange ownership contract:
  - external open positions/open orders are visible in selected-bot runtime only when wallet takeover is enabled for the owning compatible bot-wallet context.
  - ambiguous ownership remains non-actionable and fail-closed.
- Safety linkage:
  - this contract keeps `SBSC` and `DAWR` selected-bot context parity requirements unchanged while replacing old `order-only` semantics with unified lifecycle target contract.

## 17. Canonical Wallet + Market-Universe Ownership Contract (`ARCCON`)
- Canonical context precedence:
  - wallet (`exchange`, `marketType`, `baseCurrency`) and selected
    market-universe context are authoritative for bot symbol-group binding.
  - duplicated bot venue fields remain compatibility-only and cannot override
    wallet/market-universe authority.
- Drift behavior:
  - mismatched wallet vs market-universe context is fail-closed and returns
    explicit wallet-market-context mismatch contract errors.
- Legacy topology containment:
  - `BotStrategy`/duplicated fields may stay readable for historical
    compatibility.
  - new validation and runtime ownership decisions must not silently prefer
    legacy topology over canonical links.
- Active LIVE symbol-overlap validation must compare the selected target market
  group against other active LIVE bots through active canonical
  `BotMarketGroup.symbolGroup` scope first. Direct legacy `Bot.symbolGroup`
  is fallback only for bots without canonical groups.
- Existing-bot wallet update validation must compare the target wallet against
  active canonical `BotMarketGroup.symbolGroup.marketUniverse` scope first.
  Direct legacy `Bot.symbolGroup` is fallback only for bots without canonical
  groups.

## 18. Runtime Position Execution Venue Contract (`POSDRIFT-05`)
- Runtime signal-loop topology, runtime position reads, and position automation
  resolve inherited execution venue through the shared canonical runtime venue
  resolver:
  - active enabled `BotMarketGroup.symbolGroup.marketUniverse` first,
  - direct legacy `Bot.symbolGroup.marketUniverse` only when no canonical group
    exists.
- Multiple canonical venues in a runtime topology input are ambiguous and must
  fail closed instead of silently selecting one.
- TTP, TSL, DCA, close automation, and selected-bot monitoring must not use a
  stale direct bot market projection when the bot has an active canonical
  market group.
- PAPER/LIVE signal-loop open decisions must use the same venue contract as
  pre-trade, manual order open, and position-management automation.
