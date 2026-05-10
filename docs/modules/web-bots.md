# Web Deep-Dive: Bots Module

## Metadata
- Module name: `bots`
- Layer: `web`
- Source path: `apps/web/src/features/bots`
- Owner: frontend/trading-runtime
- Last updated: 2026-05-07
- Related planning task: `ARCCON-12`

## Canonical Architecture Linkage
Canonical bot topology and operator-surface rules live in:
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/08_operator-surfaces-and-routing.md`
- `docs/architecture/11_assistant-runtime.md`

## 1. Purpose and Scope
- Owns bot UI lifecycle and runtime operator surfaces:
  - list and delete bots
  - create/edit bot form
  - runtime monitoring workspace
  - assistant configuration and dry-run timeline
- Enforces wallet-first bot creation contract in UI (`walletId` required).

Out of scope:
- Runtime engine execution internals (API engine/bots modules).
- Wallet CRUD and market/strategy authoring forms.

## 2. Boundaries and Dependencies
- Route entrypoints:
  - `/dashboard/bots`
  - `/dashboard/bots/create` (`/dashboard/bots/new` legacy redirect)
  - `/dashboard/bots/:id/edit`
  - `/dashboard/bots/:id/preview`
  - `/dashboard/bots/:id/assistant`
- Depends on:
  - bots API services (`features/bots/services/bots.service.ts`)
  - markets, strategies, wallets data sources for create/edit form
  - exchange capability map and icon lookup hooks

## 3. Data and Contract Surface
- Command contracts:
  - create/update bot payload with `walletId`, `strategyId`, `marketGroupId`, `isActive`, `liveOptIn`, consent version.
- Runtime read contracts:
  - runtime sessions, symbol stats, positions, trades, runtime graph.
  - bot portfolio history for monitoring (`summary + points + markers`).
- Assistant contracts:
  - read/update assistant main config
  - read/update/delete subagent slots
  - dry-run trace execution

## 4. Runtime Flows
- Create/edit flow:
  1. Load strategies, market groups, and wallets.
  2. Require non-empty `walletId` and context match with selected market group.
  3. Enforce capability checks for activation and LIVE prerequisites (linked API key + consent).
  4. Submit create/update and navigate to bots list/preview path.
- Monitoring flow:
  1. Select bot/session and load runtime data sections.
  2. Apply filters for symbol/status/view mode.
  3. Load bot portfolio history with reset/capital markers alongside runtime monitoring.
  4. Support operator actions (close position) with explicit confirmations.
- Assistant flow:
  1. Load current assistant config for selected bot.
  2. Save main config and subagent slots.
  3. Run dry-run and present deterministic decision timeline.

## 5. UI Integration
- Main components:
  - `BotsListTable`
  - `BotCreateEditForm`
  - `BotsManagement` with tabs (`bots`, `monitoring`, `assistant`)
- Legacy helper routes:
  - `/dashboard/bots/runtime` and `/dashboard/bots/assistant` resolve to canonical bot-specific routes.

## 6. Security and Risk Guardrails
- LIVE mode actions require explicit risk confirmation.
- Activation is blocked when exchange capability or wallet context invariants fail.
- Gate.io PAPER bot activation is allowed through the shared
  `PAPER_PRICING_FEED` capability. Gate.io LIVE activation is allowed after
  `LIVE_EXECUTION` support is enabled; exchange-side cancel remains
  unsupported.
- Runtime actions use protected API endpoints and user-scoped data.

## 7. Observability and Operations
- Monitoring views include heartbeat/session status badges and stale-data warnings.
- Monitoring also exposes bot-scoped portfolio history with explicit partial-state messaging when only the latest open PnL snapshot is authoritative.
- Monitoring open-position rows expose backend continuity/actionability truth
  (`continuityState`, `actionable`, and `strategyAutomationContextResolved`)
  so recovered, recovering, externally closed, repair-only, and unresolved
  strategy-context states do not look like normal actionable rows. Continuity
  label semantics are shared with dashboard home through the Web runtime
  formatter.
- Monitoring open-position rows also expose backend provenance/adoption truth
  (`origin`, `syncState`, and `takeoverStatus`) through the shared Web
  provenance label helper so imported, adopted, ambiguous, manual-only,
  drifted, and orphaned exchange-sync rows remain visible as non-ordinary
  runtime states.
- Monitoring open-order rows expose backend `origin` through route-owned
  source labels backed by the shared Web runtime order-source helper, keeping
  manual, bot, and imported order source truth aligned with dashboard home.
- Monitoring open-order rows also render backend order `status` through
  route-owned lifecycle labels backed by the shared Web open-order status
  helper, so `OPEN`/`PENDING` reads as waiting for fill instead of a raw code.
- Monitoring open-position TTP cells label API `strategy_fallback`
  protection as prospective, preserving the distinction between canonical
  runtime TTP state and read-model assistance from strategy configuration.
- Monitoring history tables expose backend close attribution (`closeReason` and
  `closeInitiator`) for closed positions and close trades.
- Assistant tab exposes per-slot status, latency, and message traces for operator diagnostics.

## 8. Test Coverage and Evidence
- Primary tests:
  - `app/dashboard/bots/[id]/preview/page.test.tsx`
  - `app/dashboard/bots/[id]/assistant/page.test.tsx`
  - `BotCreateEditForm.test.tsx`
  - `BotsListTable.test.tsx`
  - `BotsManagement.test.tsx`
  - `BotsManagement.portfolio-history.test.tsx`
  - `trailingStopDisplay.test.ts`
- Suggested validation command:
```powershell
pnpm --filter web test -- src/app/dashboard/bots/[id]/preview/page.test.tsx src/app/dashboard/bots/[id]/assistant/page.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/bots/components/BotsManagement.test.tsx src/features/bots/utils/trailingStopDisplay.test.ts
```

## 9. Open Issues and Follow-Ups
- Continue decomposition of large monitoring container into smaller domain units.
- Replace remaining confirm-dialog browser primitives with app-level modal pattern.

## 10. Shared Table Contract Linkage (`UXR-J`)
- Bots list and runtime-adjacent tables consume shared table-system contracts from `ui/components/TableUi.tsx` and `ui/components/DataTable.tsx`.
- For `UXR-J` wave, bots module follows global table behavior:
  - action-tone semantics:
    - `edit` remains system `info`,
    - `delete` remains system `danger`,
    - `clone` remains neutral and distinct from system actions,
    - `runtime` and `preview` use one dedicated module tone preset.
  - columns dropdown persistence:
    - column checkbox toggles must not close dropdown.
  - columns trigger contract:
    - icon-only trigger default with accessible naming.
- Scope lock:
  - no bots-only tone overrides unless explicitly required by failing shared-table regressions.

## 11. Preview vs Dashboard Aggregate Parity Linkage (`DAGG`)
- Monitoring/preview surfaces and dashboard home must stay aligned for selected-bot aggregate visibility.
- Contract linkage:
  - `/dashboard/bots/:id/preview` and `/dashboard` selected bot reference the same aggregate runtime scope for:
    - `positions`,
    - `orders`,
    - `history`.
- Guardrail:
  - if current `RUNNING` session has no rows but older sessions have runtime history, both surfaces must still expose aggregate history for that bot.

## 12. Route i18n Ownership Contract (`ARCCON`)
- `/dashboard/bots` components must use bot-owned namespace keys for local
  operator controls and confirmation dialogs.
- Forbidden leakage:
  - bot route UI must not depend on `dashboard.home.*` keys for bot-owned
    actions.
- Confirm-dialog action labels are route-owned under
  `dashboard.bots.confirms.*`:
  - `confirmLabel`,
  - `cancelLabel`,
  - with EN/PL/PT parity.
