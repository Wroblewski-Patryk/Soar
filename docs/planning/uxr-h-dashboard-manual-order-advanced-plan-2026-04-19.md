# UXR-H Dashboard Manual Order Advanced UX Plan (2026-04-19)

Status: queued (awaiting active ARC wave completion)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: execution agent

## Start Gate
- Do not start this wave while `ARC-C` or `ARC-E` is in active execution.
- Keep active `NOW` queue unchanged until ARC closure.
- Execute `UXR-H-01..UXR-H-10` in order.

## Source Request (condensed)
- Extend dashboard `Manual order` with editable `price` input and one-click market-price fill.
- Place `price` between `side` and `qty`.
- Make `qty` aware of minimum executable amount (notional/precision/leverage constraints).
- Add `qty` slider in a separate row (Binance-like ergonomics, but aligned with current Soar visual style).
- Remove nested/double panel feeling around manual-order section.
- Show execution context clearly, but do not add TP/SL, reduce-only, fee tier, or TIF controls.
- Use bot context as source for `order type`, `margin mode`, and `leverage`.
- Merge `Cost/Max` summary into one side-aware summary line/card.
- Preserve current working behavior and backend command path.

## Confirmed Baseline (code audit)
- Manual order is currently submitted from dashboard via `POST /dashboard/orders/open` with `type: "MARKET"` and quantity-only input.
- API `OpenOrderSchema` already supports optional `price` and order types beyond market.
- Live pretrade guards already enforce `minAmount`, `amountPrecision`, and `minNotional`.
- Runtime graph payload currently does not expose enough strategy runtime fields for manual-order context (`marginMode`, leverage-rich projection, order-type preference).

## Locked Implementation Decisions
1. Keep existing open-order path and risk-ack behavior unchanged.
2. Add a dedicated manual-order context read contract for UI constraints/preview instead of duplicating formula logic in web.
3. `orderType` must come from selected bot context:
   - primary source: selected active strategy/bot runtime config,
   - fallback: `MARKET` (explicit and visible in UI).
4. `price` field behavior:
   - always visible between `side` and `qty`,
   - quick action fills current market price,
   - submit includes `price` only when valid and required by resolved order type.
5. `qty` guidance:
   - prefill to minimum executable quantity resolved from rules (`minAmount`, `minNotional`, precision step) and current price/leverage context,
   - slider controls percentage bands and writes computed quantity into input (input remains editable).
6. Keep current section visual language; remove only redundant nested framing.

## Execution Groups (commit batches)
1. `UXR-H-A (commits UXR-H-01..UXR-H-03): contract freeze + API context endpoint + backend regression locks`
2. `UXR-H-B (commits UXR-H-04..UXR-H-07): web state/data integration + manual-order UI expansion + container cleanup`
3. `UXR-H-C (commits UXR-H-08..UXR-H-10): i18n polish + focused regression pack + closure sync`

## Tiny-Commit Queue

### UXR-H-01
`docs(contract): freeze dashboard manual-order advanced input/context contract`
- Scope:
  - lock target behavior in canonical docs (`price input`, `current price fill`, `qty min+slider`, side-aware summary, no TP/SL/TIF/reduce-only additions).
  - freeze fallback policy for unresolved bot order type (`MARKET`).
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/modules/api-orders.md`
- Done when:
  - implementation has one unambiguous contract for data source and UX behavior.

### UXR-H-02
`feat(api-orders): add manual-order context read endpoint for price/rules/min-qty preview`
- Scope:
  - add endpoint for selected `botId + symbol` context, returning:
    - resolved `orderType`,
    - resolved `marginMode`,
    - resolved `leverage`,
    - current market reference price,
    - quantity constraints (`minAmount`, `amountPrecision/step`, `minNotional`, computed `minExecutableQty`),
    - optional side-aware max/cost preview primitives.
  - reuse existing exchange/rules services where possible.
- Likely files:
  - `apps/api/src/modules/orders/orders.types.ts`
  - `apps/api/src/modules/orders/orders.controller.ts`
  - `apps/api/src/modules/orders/orders.routes.ts`
  - `apps/api/src/modules/orders/orders.service.ts`
- Done when:
  - dashboard can fetch one canonical context payload without duplicating constraints logic in web.

### UXR-H-03
`test(api-orders): lock manual-order context constraints and fallback behavior`
- Scope:
  - add focused tests for:
    - resolved order-type fallback contract,
    - min executable quantity derivation from rules and price,
    - precision normalization behavior,
    - stable response when exchange price/rules fetch is degraded.
- Likely files:
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- Done when:
  - context endpoint behavior is regression-locked.

### UXR-H-04
`refactor(web-bots-service): add manual-order context client and typed contract`
- Scope:
  - add typed web service for manual-order context endpoint.
  - keep existing `openDashboardManualOrder` path intact.
- Likely files:
  - `apps/web/src/features/bots/services/bots.service.ts`
  - `apps/web/src/features/bots/types/bot.type.ts`
- Done when:
  - dashboard can load typed context data for selected bot/symbol.

### UXR-H-05
`refactor(web-dashboard-controller): wire price/order-context state into manual-order model`
- Scope:
  - add local state for `manualOrderPrice`, slider percentage, and resolved context payload.
  - compute prefilled quantity from context `minExecutableQty`.
  - keep submit safety validation (symbol, qty, price by order type).
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts` (only if needed)
- Done when:
  - manual-order state machine supports symbol/side/price/qty/slider/context without breaking existing submit flow.

### UXR-H-06
`feat(web-manual-order-ui): add price input + market-price action + qty slider and side-aware summary`
- Scope:
  - render `price` input between `side` and `qty`.
  - add button/action to set live market price into price field.
  - add slider row under quantity input.
  - show order context badges/rows (`orderType`, `marginMode`, `leverage`).
  - replace split cost/max lines with one side-aware summary presentation.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- Done when:
  - layout and behavior match requested flow while preserving existing section style baseline.

### UXR-H-07
`refactor(web-dashboard-sidebar): remove redundant nested manual-order container framing`
- Scope:
  - remove duplicate nested panel wrapping in manual-order area only.
  - do not alter wallet section behavior.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- Done when:
  - manual-order section is single-layer and visually consistent with sidebar system.

### UXR-H-08
`feat(i18n-dashboard-home): add missing copy keys for price-action, slider, context labels, and validations`
- Scope:
  - add/align EN/PL/PT keys for new manual-order labels/hints/errors.
  - keep locale parity and no hardcoded strings.
- Likely files:
  - `apps/web/src/i18n/namespaces/dashboard-home.en.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pl.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pt.ts`
- Done when:
  - all new UI copy is key-driven and language-parity complete.

### UXR-H-09
`test(web-dashboard-home): lock manual-order advanced interactions and layout regressions`
- Scope:
  - add/update focused tests for:
    - price field position and market-price fill action,
    - qty prefill from minimum executable constraints,
    - slider-to-qty sync,
    - side-aware summary text/values,
    - no regression in submit payload path.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - old behavior breaks tests and new behavior passes with deterministic assertions.

### UXR-H-10
`qa(web+api-closure): run focused manual-order regression pack and sync queue/context evidence`
- Mandatory checks:
  - `pnpm --filter api run test -- src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts --run`
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
- Done when:
  - focused pack is green and canonical queue/context docs are synchronized.

## Definition of Done (Wave)
- Manual-order section includes `price` input + current-price quick fill.
- `price` is placed between `side` and `qty`.
- `qty` prefill and validation align with backend executable constraints.
- Slider is available in dedicated row and syncs with quantity input.
- `orderType`, `marginMode`, and `leverage` are displayed from selected bot context (with explicit fallback contract).
- Manual-order visual structure is cleaner (no redundant nested container).
- New copy is localized in EN/PL/PT.
- Focused API+WEB tests and closure checks pass.

## Risks and Rollback
- Risk: constraint mismatch between UI preview and backend pretrade guards.
  - Mitigation: API context endpoint is source-of-truth; web only renders and validates basic coherence.
  - Rollback: revert latest web commit and keep backend context contract plus tests.
- Risk: added context fetch increases sidebar load complexity.
  - Mitigation: fetch on symbol/bot change with debounced refresh and stale-safe fallback.
  - Rollback: disable context prefetch path behind default fallback to current behavior.
- Risk: order-type source ambiguity in older bot data.
  - Mitigation: explicit fallback to `MARKET` with visible label and test lock.
  - Rollback: keep fallback-only mode while preserving new layout.

## Request-to-Task Mapping
- `price input + current market price action`: `UXR-H-05`, `UXR-H-06`, `UXR-H-09`
- `price input between side and qty`: `UXR-H-06`, `UXR-H-09`
- `qty min executable constraints`: `UXR-H-02`, `UXR-H-03`, `UXR-H-05`
- `qty slider in new row`: `UXR-H-06`, `UXR-H-09`
- `remove double container`: `UXR-H-07`
- `show key options without TP/SL/reduce-only/fee-tier/TIF`: `UXR-H-01`, `UXR-H-06`
- `order type + margin mode + leverage from bot context`: `UXR-H-02`, `UXR-H-05`, `UXR-H-06`
- `combined side-aware cost/max summary`: `UXR-H-06`, `UXR-H-09`
- `keep existing section behavior/styling baseline`: `UXR-H-01`, `UXR-H-06`, `UXR-H-10`
