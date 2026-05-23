# Unified Order Lifecycle and Exchange Sync Plan (2026-04-20)

Status: closed (UOLF-01..UOLF-15 completed on 2026-04-20)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: execution agent

## Source Analysis Summary
- Current manual dashboard order contract was intentionally locked as `order-only` in `SOPR-C`, which is now misaligned with the clarified product expectation for real-money operation.
- Product expectation is exchange-native lifecycle parity:
  - submit order,
  - wait for fill / exchange confirmation,
  - only then surface/open position,
  - manage lifecycle from one canonical downstream position path.
- `LIVE` and `PAPER` should share one business lifecycle:
  - `LIVE`: exchange is fill authority,
  - `PAPER`: internal paper adapter is fill authority.
- Runtime bot signal entries and dashboard manual-order entries must use the same order-open path and the same downstream fill-to-position path.
- Manual orders must stay strictly selected-bot scoped:
  - creating an order in selected `PAPER` bot must not leak into selected `LIVE` bot scope,
  - creating an order in selected `LIVE` bot must not leak into `PAPER` bot scope.
- External exchange positions/orders opened outside the app must appear in runtime only when takeover/sync is enabled for the wallet-bound bot context.
- Current implementation gaps confirmed by code analysis:
  - manual order write path persists order intent but is still documented as explicit `order-only`,
  - runtime live open path still couples open-order command and direct position creation too tightly for exchange-native semantics,
  - runtime exchange pre-guards do not yet fully match Binance step-size / precision enforcement,
  - manual-order UI does not enforce exchange quantity step deterministically,
  - imported external positions/orders depend on reconciliation loop ownership resolution and need stricter regression locks.

## Canonical Target Contract
1. One canonical lifecycle for bot and manual entries:
   - `entry intent -> order created -> order status evolves -> fill confirmed -> position opened/updated`.
2. `LIVE` mode:
   - `POST /dashboard/orders/open` creates/submits a live exchange order under strict selected-bot context.
   - No direct position creation is allowed from the command itself.
   - Position opens only after exchange fill confirmation or synchronized exchange position evidence.
3. `PAPER` mode:
   - the same command creates a paper order first,
   - paper fill engine/adapter can mark order as filled according to paper rules,
   - position is opened only through the same downstream fill-handling path.
4. Runtime signal path and manual-order path must call the same lifecycle authority for order creation.
5. Selected-bot scoping is strict on both write and read sides:
   - bot, wallet, strategy, mode, orders, positions, and imported exchange rows must be attributed to the canonical selected bot context.
6. Imported exchange state contract:
   - wallet-scoped takeover toggle remains canonical ownership switch,
   - if enabled, external open positions and open orders from the connected exchange are imported into runtime scope,
   - imported rows are visible only for the owning compatible bot/wallet context,
   - imported rows remain fail-closed when ownership is ambiguous.
7. Binance adapter parity is mandatory for this wave:
   - min quantity,
   - quantity step / precision,
   - min notional,
   - order placement / fill status semantics.
8. Operator UX must reflect lifecycle truth:
   - no `order-only` hint after this wave,
   - success/error copy must distinguish `order submitted`, `waiting for fill`, `filled`, `position opened`, `imported from exchange`, and blocked reasons.

## Binance Alignment Notes
- For Binance Futures, validation must be driven by exchange filters and order semantics rather than UI heuristics:
  - `LOT_SIZE`,
  - `MARKET_LOT_SIZE`,
  - `MIN_NOTIONAL` / `NOTIONAL`,
  - exchange order status / fill evidence.
- Upstream runtime/manual validation must match final live pretrade behavior to avoid pass-then-fail drift.
- Adapter contract must remain exchange-extensible:
  - Binance is first production adapter,
  - future exchanges must plug into the same lifecycle authority and fill/reconciliation contracts.

## Scope
- Manual-order lifecycle contract and API/web/runtime alignment.
- Shared order-open and fill-to-position authority for `PAPER` and `LIVE`.
- Strict selected-bot context enforcement.
- Exchange reconciliation for imported open positions/open orders.
- Dashboard visibility, status copy, and diagnostics for the unified lifecycle.
- Focused live-safety test pack and operational smoke coverage.

## Scope Lock
1. No unrelated dashboard visual redesign outside manual-order/order/position/runtime clarity.
2. No exchange expansion beyond Binance adapter parity in this wave.
3. No loosening of fail-closed ownership behavior for imported exchange state.
4. No destructive migration of historical order/position data without explicit backward-compatibility handling.

## Execution Groups
1. `UOLF-A (commits UOLF-01..UOLF-04): contract freeze + failing lifecycle/scope regressions`
2. `UOLF-B (commits UOLF-05..UOLF-09): backend unified lifecycle authority + paper/live parity`
3. `UOLF-C (commits UOLF-10..UOLF-13): exchange import/reconciliation + dashboard operator parity`
4. `UOLF-D (commits UOLF-14..UOLF-15): docs sync + live-safety closure validation`

---

## Tiny-Commit Queue

### UOLF-01
`docs(contract): supersede manual-order order-only contract with unified order-fill-position lifecycle`
- Scope:
  - freeze the new canonical product contract in canonical docs.
  - explicitly mark old `SOPR-C order-only` wording as superseded for future implementation.
  - lock selected-bot scope and wallet-scoped exchange takeover expectations.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/api-orders.md`
  - `docs/modules/api-bots.md`
  - `docs/modules/web-dashboard-home.md`
- Done when:
  - canonical docs define one exchange-native lifecycle for manual and bot entries.

### UOLF-02
`test(api-red): add selected-bot scoping regressions for manual-order writes and reads`
- Scope:
  - add failing tests proving manual order uses canonical bot context only.
  - assert no cross-bot leakage between `PAPER` and `LIVE` bots with different wallets/strategies.
- Likely files:
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- Done when:
  - tests fail unless write/read scope is deterministic per selected bot.

### UOLF-03
`test(api-red): lock unified lifecycle semantics for manual and runtime opens in paper/live`
- Scope:
  - failing tests for:
    - `LIVE` manual open creates order but not direct position before fill,
    - `LIVE` runtime signal creates order but not direct position before fill,
    - `PAPER` order reaches position through paper fill path rather than direct command-side shortcut.
- Likely files:
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
  - `apps/api/src/modules/engine/preTrade.e2e.test.ts`
  - `apps/api/src/modules/engine/paperLiveDecisionEquivalence.test.ts`
- Done when:
  - lifecycle mismatch is captured before implementation starts.

### UOLF-04
`test(api-red): add reconciliation regressions for imported external positions and open orders`
- Scope:
  - failing tests for:
    - external position import when wallet takeover is enabled,
    - external open-order import for owning bot/wallet,
    - no import when ownership is disabled or ambiguous.
- Likely files:
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
  - `apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts`
  - `apps/api/src/modules/positions/positions-live-status.e2e.test.ts`
- Done when:
  - exchange import/takeover contract is regression-locked.

### UOLF-05
`fix(api-context): derive canonical mode wallet and strategy from bot-bound context on open-order command`
- Scope:
  - stop trusting client-supplied `mode`, `walletId`, and `strategyId` when `botId` is present.
  - enforce canonical selected-bot context server-side for both `PAPER` and `LIVE`.
- Likely files:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/orders/orders.types.ts`
  - `apps/api/src/modules/orders/orders.errors.ts`
- Done when:
  - manual-order command becomes fail-closed and bot-canonical.

### UOLF-06
`refactor(api-lifecycle): introduce shared order lifecycle authority and fill-handler entrypoint`
- Scope:
  - create one internal lifecycle service for:
    - order creation,
    - order status transitions,
    - fill-confirmed callbacks,
    - downstream position open/update.
  - manual and runtime paths must call this authority instead of custom divergent branches.
- Likely files:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
  - new internal lifecycle helper/module if needed
- Done when:
  - one canonical authority owns order-to-position progression.

### UOLF-07
`feat(api-paper): route paper fills through adapter-backed order-status transition path`
- Scope:
  - paper mode should create order first.
  - paper fill adapter/engine updates order status to filled according to paper rules.
  - position opens only from fill handling, not direct command path.
- Likely files:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
  - paper execution/fill helper modules under `apps/api/src/modules/engine`
- Done when:
  - `PAPER` flow mirrors exchange-native lifecycle semantics.

### UOLF-08
`fix(api-live): ensure live runtime/manual opens create exchange order only and defer position authority to fill/sync`
- Scope:
  - live command path must persist order + exchange metadata,
  - position must wait for confirmed fill or synchronized position evidence.
  - remove any remaining direct live position-open shortcut.
- Likely files:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- Done when:
  - live lifecycle mirrors exchange truth.

### UOLF-09
`fix(api-rules): unify Binance quantity-step minQty and minNotional validation across runtime manual and pretrade`
- Scope:
  - align runtime pre-guards, manual context, and final live pretrade checks to one rule interpretation.
  - include quantity step/precision parity and deterministic normalization.
- Likely files:
  - `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.ts`
  - `apps/api/src/modules/exchange/exchangeSymbolRules.service.ts`
  - `apps/api/src/modules/exchange/ccxtFuturesConnector.service.ts`
  - `apps/api/src/modules/orders/orders.service.ts`
- Done when:
  - `LIVE_PRETRADE_AMOUNT_PRECISION` cannot appear as a late surprise after upstream acceptance.

### UOLF-10
`fix(api-reconciliation): import external open positions and open orders into canonical owning bot wallet scope`
- Scope:
  - tighten ownership resolution for wallet-bound takeover.
  - ensure both open positions and open orders are imported when enabled.
  - keep ambiguous ownership fail-closed.
- Likely files:
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- Done when:
  - manually opened exchange state appears in the correct bot runtime scope when allowed.

### UOLF-11
`test(web-red): add dashboard regressions for selected-bot order/position lifecycle and imported exchange visibility`
- Scope:
  - add failing UI tests for:
    - selected-bot order isolation,
    - waiting-for-fill state visibility,
    - imported exchange rows visibility,
    - removal of stale `order-only` semantics.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`
- Done when:
  - dashboard lifecycle UX is locked against regressions.

### UOLF-12
`fix(web-dashboard): align manual-order UX and runtime tables to unified lifecycle semantics`
- Scope:
  - remove outdated `order-only` hint/copy.
  - render clear states for:
    - order submitted,
    - waiting for fill,
    - filled,
    - imported from exchange,
    - blocked reason.
  - keep selected-bot scope strict.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
  - dashboard i18n namespaces
- Done when:
  - operator-facing UX matches real exchange semantics.

### UOLF-13
`feat(web-dashboard): expose deterministic manual-order constraint hints and humanized live pretrade diagnostics`
- Scope:
  - show exchange step/minQty/minNotional guidance from API context.
  - map raw pretrade codes to operator-readable messages.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/lib/errorResolver.ts`
  - dashboard i18n namespaces
- Done when:
  - user gets actionable feedback before and after submit.

### UOLF-14
`docs(sync): update module and ops docs after unified lifecycle rollout`
- Scope:
  - sync final docs and remove superseded `order-only` wording from module references.
  - document execution worker and reconciliation smoke expectations.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/api-orders.md`
  - `docs/modules/api-bots.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/operations/post-deploy-smoke-checklist.md`
- Done when:
  - docs match final lifecycle semantics and ops expectations.

### UOLF-15
`qa(closure): run unified lifecycle and exchange-sync safety pack and sync canonical queue/context`
- Required commands:
  - `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts src/modules/positions/positions-live-status.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run build`
  - `pnpm run quality:guardrails`
  - `pnpm run test:go-live:smoke`
- Done when:
  - focused lifecycle pack is green and canonical queue/context are synchronized.

---

## Stage DoD

### Stage A DoD (`UOLF-A`)
- New canonical lifecycle contract is frozen.
- Red regressions exist for bot scoping, lifecycle authority, and imported exchange state.

### Stage B DoD (`UOLF-B`)
- Backend uses one lifecycle authority for manual and bot opens.
- `PAPER` and `LIVE` differ only in fill authority, not in business lifecycle shape.
- Binance rule validation is parity-aligned across runtime/manual/live pretrade.

### Stage C DoD (`UOLF-C`)
- Imported exchange open positions/open orders surface correctly for owning bot context.
- Dashboard clearly communicates waiting-for-fill and imported state.
- No stale `order-only` UX remains.

### Stage D DoD (`UOLF-D`)
- Canonical docs and ops smoke notes match implementation.
- Focused real-money safety pack passes.

## Acceptance Criteria
1. Manual order and bot signal entry both use the same canonical order lifecycle.
2. `LIVE` never creates a position directly from submit; position appears only after fill or synchronized exchange evidence.
3. `PAPER` creates order first and opens position only from paper fill handling.
4. Selected-bot scope is strict for manual orders, open orders, positions, history, and imported exchange rows.
5. Imported external exchange positions/open orders appear only when wallet takeover is enabled and ownership is deterministic.
6. Binance quantity step / minQty / minNotional rules are enforced consistently before live order placement.
7. Dashboard operator messaging reflects real lifecycle states instead of the superseded `order-only` semantics.

## Recommended Test Matrix
- Source:
  - manual dashboard order,
  - bot runtime signal,
  - imported exchange position,
  - imported exchange open order.
- Mode:
  - `PAPER`,
  - `LIVE`.
- Lifecycle state:
  - created,
  - pending/open,
  - partially filled,
  - filled,
  - rejected/blocked,
  - imported,
  - ambiguous ownership ignored.
- Scope:
  - bot A vs bot B,
  - paper vs live,
  - compatible vs incompatible wallet,
  - takeover enabled vs disabled.

## Key Risks
1. Hidden direct-position creation branches in runtime live flow could diverge from exchange truth.
2. Precision/step validation mismatch can block live orders late and ambiguously.
3. Reconciliation/import logic can leak rows across bots if ownership resolution is not strictly canonical.
4. Paper fill path can drift from live lifecycle shape if shortcut logic survives.
5. Real-money rollout risk is high; closure pack must stay fail-closed and include go-live smoke coverage.
