# Web Deep-Dive: Dashboard Home Module

## Metadata
- Module name: `dashboard-home`
- Layer: `web`
- Source path: `apps/web/src/features/dashboard-home`
- Owner: frontend/runtime-observability
- Last updated: 2026-05-07
- Related planning task: `DASHDRIFT-02`

## Canonical Architecture Linkage
Canonical surface and routing rules live in:
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/08_operator-surfaces-and-routing.md`
- `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- `docs/architecture/reference/web-container-split-contract.md`

## 1. Purpose and Scope
- Implements dashboard control-center home view (`/dashboard`) for runtime monitoring.
- Provides:
  - runtime onboarding (no bots / no active bots)
  - active bot runtime snapshot (positions, trades, signals)
  - market stream driven mark-price enrichment
  - risk and session summary side panel

Out of scope:
- Bot create/edit workflows (web-bots module).
- Backtest and reports detailed pages.

## 2. Boundaries and Dependencies
- Entry route:
  - `apps/web/src/app/dashboard/page.tsx`
- Main UI:
  - `HomeLiveWidgets.tsx`
  - split runtime sections under `components/home-live-widgets/*`
  - manual-order controller seam under
    `hooks/useManualOrderController.ts`
  - runtime table presenters under
    `components/home-live-widgets/runtimeDataTablePresenters.tsx`
  - selected-bot sidebar presenter assembly under
    `components/home-live-widgets/runtimeSidebarPresenters.ts`
- Depends on:
  - bot runtime APIs from `features/bots/services/bots.service.ts`
  - market stream SSE helper (`lib/marketStream.ts`)
  - icon lookup hook (`features/icons/hooks/useCoinIconLookup`)
  - i18n and locale formatting providers

## 3. Data and Contract Surface
- Runtime read APIs consumed:
  - `GET /dashboard/bots`
  - `GET /dashboard/bots/:id/runtime-graph`
  - `GET /dashboard/bots/:id/runtime-sessions`
  - `GET /dashboard/bots/:id/runtime-monitoring/aggregate`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/positions`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades`
  - `POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close`
- Stream contract:
  - `GET /dashboard/market-stream/events` via `EventSource`

## 4. Runtime Flows
- Initial load flow:
  1. List bots and build active scope mode-agnostically (`PAPER` + `LIVE`) with deterministic ordering and dashboard cap.
  2. For selected bots load sessions + runtime graph and aggregate selected-bot runtime payload (`symbolStats`, `positions`, `orders`, `history`, `trades`).
  3. Keep fallback path to per-session reads only when aggregate endpoint is unavailable.
  3. Build unified runtime snapshot and summary metrics.
- Live refresh flow:
  1. Poll runtime snapshots every 5 seconds (silent refresh).
  2. Subscribe to ticker stream for visible symbols.
  3. Merge stream prices into open-position pnl calculations.
  4. Carry the selected mark-price source through the shared open-position
     derivation so `/dashboard` and `/dashboard/bots` expose the same source
     truth beside the mark value.
- Onboarding flow:
  - No bots: ordered steps start from wallet setup (`/dashboard/wallets/list`) before market/strategy/backtest/bot steps.
  - No active bots: same chain + activation step (`/dashboard/bots`).

## 5. UI Integration
- Route:
  - `/dashboard`
- Key states:
  - loading skeleton
  - hard error with retry
  - no bots onboarding
  - no active bots onboarding
  - live runtime workspace

## 6. Security and Risk Guardrails
- Dashboard page checks session and redirects unauthenticated user to `/auth/login`.
- Close-position action is explicit and routed through protected API.
- Runtime stale data warning is surfaced when refresh age threshold is exceeded.
- Open-position status cells expose continuity, actionability, and unresolved
  strategy-context truth from backend runtime payloads so fail-closed rows are
  text-visible on the primary operator surface. Continuity label semantics are
  shared with bot monitoring through the Web runtime formatter.
- Open-position status cells also expose imported/adopted exchange provenance
  from backend `origin`, `syncState`, and `takeoverStatus` fields through the
  shared Web runtime formatter, so
  `EXCHANGE_SYNC` rows and sync drift/orphan states do not look like ordinary
  bot-managed runtime rows.
- The dashboard position edit modal repeats noteworthy imported/adopted
  provenance from the same backend fields, preserving source truth at the
  action/edit decision point without changing command authority.
- Open-position dynamic TTP cells label config-derived fallback protection as
  prospective, including API `strategy_fallback` source metadata and
  web-computed display fallback, preserving the distinction between backend
  runtime stop truth and read-model assistance from trailing configuration.

## 7. Observability and Operations
- Stores selected bot and table preferences in local storage for operator continuity.
- Surfaces session heartbeat freshness, runtime status badges, and stale-data warnings.

## 8. Test Coverage and Evidence
- Primary tests:
  - `HomeLiveWidgets.test.tsx`
  - `LiveMarketBar.test.tsx`
- Suggested validation command:
```powershell
pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/LiveMarketBar.test.tsx
```

## 9. Open Issues and Follow-Ups
- Consider virtualized tables for larger runtime payloads.
- `SCALE-12..SCALE-16` container-ownership closure is complete; keep future
  HomeLiveWidgets growth in hook/presenter seams per
  `docs/architecture/reference/web-container-split-contract.md`.

## 10. Dashboard Tabs Ownership and Visibility Matrix (`UXR-01`)
| Tab | Visibility contract | Actionability contract |
| --- | --- | --- |
| `positions` | Always rendered for active bot context. Rows include bot-scoped `BOT_MANAGED` positions and deterministic `EXCHANGE_SYNC` takeover rows mapped to selected bot. | Close action only for rows accepted by backend ownership contract (`OPEN + BOT_MANAGED + wallet-compatible + owned`). Non-owned/non-eligible rows are fail-closed by API (`ignored/no_open_position`). |
| `orders` | Always rendered in both `LIVE` and `PAPER` mode. Empty list is valid state. | Read-only list in this wave. No tab hiding fallback when list is empty. |
| `history` | Always rendered as runtime history surface in active bot context. | Read-only by default (no ownership mutation actions). |

- Operator note:
  - unresolved external takeover states (`UNOWNED`, `AMBIGUOUS`, `MANUAL_ONLY`) are not actionable from dashboard close flow.
  - onboarding sequence remains wallet-first when runtime context is missing (`/dashboard/wallets/list` as first step).

## 11. Runtime Selector Parity (`DBSEL-A`)
- Selector contract:
  - dashboard runtime selector includes all active bots regardless of mode (`PAPER` and `LIVE` together).
  - active bot mode must not filter out another active mode from selector options.
  - deterministic ordering and cap (`MAX_DASHBOARD_BOTS`) stay unchanged.
- Degraded contract:
  - if selected active bot has no runtime session, it remains selectable and runtime panel shows degraded/no-session copy instead of dropping that bot from selector.

## 12. Table Action and Clone Contract Linkage (`UXR-E`)
- Shared table action semantics:
  - dashboard-home adjacent list modules (`wallets`, `markets`, `strategies`, `backtests`, `bots`) must reuse one action tone/icon matrix (`edit`, `delete`, `clone`, `preview`, `runtime`, `details`) from shared `TableUi` presets.
- Clone invariants (cross-module dependency for dashboard operators):
  - cloned entities are named deterministically as `<name> (clone)`, then numbered on collisions.
  - clone flow copies only editable create-contract fields; runtime/history/system identifiers are never cloned.
- Operator continuity note:
  - cloned wallets/markets/strategies are expected to appear immediately in list context so they can be attached to bot/runtime workflows without manual page reload.

## 13. Selected-Bot Runtime Symbol Scope Contract (`BRS-01`)
- Dashboard runtime `signals/markets` scope for selected bot is strict and canonical by default:
  - only `ACTIVE + isEnabled` canonical group/link scope contributes symbols and strategy context.
  - `PAUSED` bot market-groups are excluded from default dashboard runtime scope.
- Session stats and runtime-event fallback paths may enrich canonical selected-bot symbols only:
  - they cannot expand symbol set beyond canonical selected-bot active scope.
- Legacy symbol->strategy context is compatibility fallback only when canonical mapping is unavailable:
  - legacy fallback cannot override canonical strategy context when canonical mapping exists.

## 14. Runtime Sidebar Wallet/Manual-Order Layout Contract (`UXR-G`)
- Section hierarchy:
  - wallet section and manual-order section are separate peer sections.
  - manual-order section is rendered directly below wallet.
  - manual-order behavior is unchanged (same command path and payload semantics).
- Wallet summary order:
  - `allocation` first when wallet is `LIVE`,
  - `delta from start` directly below `allocation`,
  - then remaining summary entries.
- Wallet KPI style and split:
  - `portfolio` is rendered as simple inline summary row (no card-like treatment),
  - `free funds` and `in positions` are rendered as equal `50/50` columns in one row.

## 15. Manual-Order Advanced Contract (`UXR-H-01`)
- Scope lock:
  - this contract freezes manual-order behavior before API/web implementation (`UXR-H-02+`).
  - no change to command authority (`POST /dashboard/orders/open` remains canonical write path).
- UI behavior:
  - render `price` input between `side` and `qty`,
  - provide one action to fill current market reference price,
  - keep `qty` input editable, with dedicated slider row writing computed values into the same input,
  - render one side-aware summary row/card instead of split cost/max rows.
  - manual `MARKET` submit should send positive `price` value from explicit input or from current reference-price fallback when input is empty.
- Context display:
  - show `orderType`, `marginMode`, and `leverage` from selected bot context payload,
  - when `orderType` cannot be resolved from bot context, show explicit fallback `MARKET`.
- Guardrails:
  - do not add TP/SL, reduce-only, fee-tier, or TIF controls in this wave,
  - keep sidebar visual language; remove only redundant nested manual-order framing.

## 16. Dashboard Forms Consistency Refresh Linkage (`UXR-I`)
- Cross-module linkage contract:
  - dashboard create/edit forms in adjacent modules (`wallets`, `markets`, `strategies`, `backtests`, `bots`) are refreshed under `UXR-I` as one consistency wave after `UXR-F`.
  - this module remains the dashboard control-center reference for wrapper parity expectations (title/breadcrumb/save-action consistency).
- Scope lock:
  - `UXR-I` is residual-gap refresh only; it must not re-open already compliant form areas without explicit gap-map evidence.
  - no runtime command/path behavior changes are allowed in this linkage track.
- Canonical references:
  - `docs/planning/uxr-i-dashboard-forms-consistency-refresh-plan-2026-04-19.md`
  - `docs/planning/open-decisions.md` (`Dashboard Forms Consistency Refresh (Post-UXR-F)`)

## 17. Dashboard Tables Consistency Refresh Linkage (`UXR-J`)
- Cross-module linkage contract:
  - dashboard list/table surfaces in adjacent modules (`wallets`, `markets`, `strategies`, `backtests`, `bots`, `profile`, `logs`) are aligned under one shared table-system refresh wave after `UXR-I`.
  - this module anchors operator-facing expectations for runtime-adjacent table behavior consistency.
- Shared table behavior contract:
  - action tone semantics are global-first:
    - `edit` (`info`) and `delete` (`danger`) remain stable system actions,
    - `clone` stays neutral and visually distinct from system actions,
    - `runtime` and `preview` share one dedicated module tone.
  - columns dropdown persistence:
    - checkbox toggles do not dismiss dropdown,
    - close path is limited to trigger toggle, outside click, and `Escape`.
  - columns trigger default:
    - icon-only trigger across DataTable contexts with preserved accessible naming.
- Scope lock:
  - updates must start in shared `TableUi`/`DataTable` contracts before any module-level adjustment.
  - no runtime command/path behavior changes are allowed in this linkage track.
- Canonical references:
  - `docs/planning/uxr-j-dashboard-tables-consistency-refresh-plan-2026-04-19.md`
  - `docs/planning/open-decisions.md` (`Dashboard Tables Consistency Refresh (Post-UXR-I)`)

## 18. Dashboard Runtime Parity Recovery Contract (`DASHR`)
- Runtime tabs contract:
  - `positions`: selected-bot runtime positions (including takeover rows) remain deterministic and bot-scoped.
  - `orders`: always render DataTable container in `LIVE` and `PAPER`; empty rows use deterministic table empty-state copy.
  - `history`: selected-bot history contract is aggregate scoped (selected bot, multi-session), not current-session only.
- Signals/context contract:
  - `signals` symbols and strategy context are selected-bot scoped only.
  - strategy context in selected-bot panel must refresh immediately after bot switch.
  - position-management modal labels resolve strategy context from selected
    bot `runtime-graph` market groups and strategy links before direct
    `Bot.strategy` projection.
  - direct bot strategy display is compatibility fallback only when runtime
    graph strategy context is unavailable.
- Selected-bot panel layout contract:
  - KPI/status row remains first.
  - selected-bot selector row is placed between KPI row and market/strategy context row.
  - section spacing for selector/context rows uses `mt-6` (not `mt-3`).
- Execution diagnostics contract:
  - when signal condition is met, runtime must either open order/position through canonical path or expose explicit blocked reason for operator diagnostics.

## 19. Selected-Bot Aggregate Runtime Contract (`DAGG`)
- Dashboard selected-bot runtime data source is aggregate by default:
  - `positions` tab uses aggregate open positions,
  - `orders` tab uses aggregate open orders,
  - `history` tab uses aggregate history scope with two deterministic tables:
    closed positions and trade history.
- Parity rule:
  - selected bot shown on `/dashboard` must not hide aggregate history that is visible for the same bot in `/dashboard/bots/:id/preview`.
- Switch behavior rule:
  - changing selected bot must immediately re-scope both history tables
    (`closed positions` + `trades`) to the new selected-bot aggregate payload.
- Scope lock:
  - strict selected-bot scope only (no cross-bot blending),
  - preview behavior unchanged.
- Open-position display parity note (2026-05-07):
  - Dashboard home Open Positions rows render backend `quantity` and
    `entryPrice` beside margin, PnL, mark price, DCA, and protection state,
    matching the detailed bot monitoring table for primary position sizing and
    entry-truth visibility.
  - Dashboard home Open Positions rows also render backend `feesPaid`, matching
    bot monitoring so open-position fee truth is visible on the primary
    runtime surface before the position is closed.
- Trade-history fee parity note (2026-05-07):
  - Dashboard home trade-history rows render backend `fee` amount plus
    `feeSource`, `feePending`, and `feeCurrency` metadata through the shared
    Web runtime formatter, matching bot monitoring so estimated,
    exchange-final, and pending fee truth stays visible on the primary
    runtime surface.
- Closed-position close-reason parity note (2026-05-07):
  - Dashboard home closed-position history renders backend `closeReason`
    beside the existing close initiator. Close-reason label suffix and pill
    semantics are derived from the shared Web runtime formatter while route
    namespaces remain owned by each surface.
- Closed-position history table parity note (2026-05-07):
  - Dashboard home history renders aggregate `positions.historyItems` as a
    dedicated closed-position table above trade history, preserving selected-bot
    scope and exposing backend duration, DCA, fee, close reason, close
    initiator, and realized PnL truth on the primary runtime surface.

## 20. Sidebar Strategy Source-of-Truth Contract (`SBSC`)
- Sidebar `Market` and `Strategy` cards use runtime topology (`runtime-graph`) as canonical context source.
- Strategy context for selected bot is resolved from canonical active+enabled market-group strategy links first.
- Compatibility fallback (`legacyBotStrategies`) is allowed only when canonical mapping for selected bot is unavailable.
- Cross-projection parity requirement:
  - `GET /dashboard/bots` `strategyId` must stay compatible with runtime-graph primary strategy for the same bot.
  - selected-bot switch must not show `Market` from canonical context and `Strategy` from a conflicting legacy projection.

## 21. Aggregate Wallet KPI and Sidebar Edge Contract (`DAWR`)
- Aggregate-success source-of-truth:
  - when `GET /dashboard/bots/:id/runtime-monitoring/aggregate` succeeds, LIVE wallet KPI capital values are derived from aggregate `positions.summary`.
  - required aggregate parity fields:
    - `referenceBalance`,
    - `freeCash`.
- Capital fallback contract:
  - aggregate payload must keep `referenceBalance/freeCash` keys in `positions.summary`;
    unresolved values stay explicit `null`.
  - session-level fallback is allowed only for true aggregate failure path, not for aggregate-success masking.
  - Web aggregate-success wallet presentation must not use compatibility capital fields
    (`allocatedBalance`, `accountBalance`, `walletBalance`, `availableBalance`, `freeBalance`)
    to replace missing aggregate `referenceBalance/freeCash`.
- Sidebar edge behavior:
  - selected-bot strategy card remains runtime-topology-first for `strategyId` `null`/mismatch cases.
  - compatibility fallback cannot replace canonical resolved strategy context when canonical mapping exists.
- Aggregate wallet parity note (2026-05-07):
  - Dashboard Home uses strict aggregate capital helpers for selected `AGGREGATE`
    snapshots, preserving compatibility capital fallback only for non-aggregate
    fallback reads.

## 22. Signals + Open Runtime Parity Contract (`SOPR`)
- Consolidated baseline:
  - `DAGG` aggregate selected-bot runtime-table contract, `SBSC` sidebar strategy contract, and `DAWR` aggregate wallet/edge contract are prerequisites.
- Selected-bot signal context contract:
  - signal cards are selected-bot scoped only and must not reuse cross-bot fallback context.
  - condition-line strategy context prefers latest signal strategy when available; configured strategy fallback is allowed only for missing latest-signal strategy context.
  - signal rows/cards must expose deterministic source tagging from API read model (`latest_signal`, `configured_fallback`, `unresolved`) for operator clarity.
  - Web market-state fallback classification treats both `latest_signal` and
    legacy `latest_decision` as evaluated runtime signal context when no
    explicit `runtimeMarketState` is provided.
  - Dashboard Home signal cards render a compact localized source badge for
    latest-signal, legacy latest-decision, configured-fallback, and unresolved
    contexts.
- Cross-route parity contract:
  - for the same selected bot, `/dashboard` and `/dashboard/bots/:id/preview` must stay parity-aligned for `signals`, `positions`, and `history`.
- Runtime diagnostics contract:
  - no-open blocked/ignored outcomes must remain explicitly visible in operational flows (no ambiguous silent no-op behavior).
- Unified manual-order lifecycle note (`UOLF` supersession):
  - `SOPR-09` `order-only` wording is superseded by unified lifecycle contract.
  - dashboard manual order stays on `POST /dashboard/orders/open`, but operator-facing states must reflect lifecycle truth:
    - `order submitted`,
    - `waiting for fill`,
    - `filled`,
    - `position opened`,
    - `imported from exchange`,
    - `blocked reason`.
  - unresolved fill price must remain fail-closed in waiting state (`waiting for fill`), not as opened position with synthetic zero-entry metrics.
  - 2026-05-07 implementation note:
    - Dashboard Home renders `order submitted` in the manual-order panel while
      the `POST /dashboard/orders/open` request is in flight, without showing
      a synthetic order id before backend persistence is confirmed.
    - Dashboard Home keeps the `POST /dashboard/orders/open` response in the
      manual-order panel and renders the returned lifecycle state:
      `OPEN`/`PARTIALLY_FILLED` as waiting or fill progress, `FILLED` as
      filled, and `FILLED` with `positionId` as position opened.
    - When the `POST /dashboard/orders/open` response carries
      `exchangeOrderId`, Dashboard Home shows that exchange-side order
      identity in the manual-order lifecycle panel and treats `OPEN` with an
      exchange id as exchange-backed imported-open-order truth.
    - The state is cleared when the operator edits the next manual-order
      inputs so stale response truth cannot be confused with a new order
      draft.

## 23. Open Orders Source Column and Active-Only Contract (`OOSC`)
- Open Orders table includes `Source` column with deterministic mapping:
  - `USER -> Manual`,
  - `BOT -> Bot`,
  - `EXCHANGE_SYNC -> Imported`,
  - `BACKTEST -> Imported` (defensive fallback).
- Data dependency:
  - dashboard Open Orders rows require API `origin` field in runtime open-orders payload.
- UI implementation note (2026-04-20):
  - Open Orders table renders localized `Source` column labels from dashboard namespace keys:
    - `source`,
    - `sourceManual`,
    - `sourceBot`,
    - `sourceImported`.
- Shared semantics note (2026-05-07):
  - Dashboard home and bot monitoring derive order-source label suffixes from
    the shared Web runtime formatter while preserving route-owned namespaces.
  - Dashboard home and bot monitoring also derive active open-order lifecycle
    status suffixes from the shared Web runtime formatter, keeping
    waiting-for-fill, partially-filled, and filled labels aligned while unknown
    statuses remain visible as raw backend values.
  - Dashboard home Open Orders rows render backend `filledQuantity` beside
    total `quantity`, matching the detailed bot monitoring order table and
    keeping partial-fill progress visible in the primary runtime surface.
  - Dashboard home Open Orders rows render backend `type` and `stopPrice`
    beside limit `price`, matching the detailed bot monitoring order table and
    keeping conditional execution terms visible in the primary runtime surface.
  - Dashboard home and bot monitoring Open Orders rows render backend
    `exchangeOrderId` when available, keeping exchange-side order identity
    visible for LIVE reconciliation and imported-order review.
- Active-only visibility remains unchanged:
  - `PENDING`,
  - `OPEN`,
  - `PARTIALLY_FILLED`.
- Scope lock:
  - no new orders-history table in `/dashboard` for this wave.
  - manual-order command path stays `POST /dashboard/orders/open` with explicit `origin=USER`; lifecycle semantics follow unified `UOLF` contract.
