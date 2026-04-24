# V1 Residual Execution Cohesion Plan (2026-04-25)

## Status

Queued

## Why This Wave Exists

Fresh repository and runtime-path audit shows that the remaining work toward a
trustworthy V1 is not primarily a new feature wave and not only a docs/sign-off
problem.

The biggest residual risk is execution cohesion around manual `LIVE` actions
and the way exchange truth is folded back into dashboard/runtime state.

The current repository truth is:

1. manual `LIVE` open still depends on a write path that is stricter than
   legacy code, but not yet fully fail-closed against bot-scope drift,
   unresolved strategy scope, or inherited-context mismatch,
2. manual `LIVE` `MARKET` orders can legitimately persist as `OPEN` until
   exchange fills are reconciled, but that deferred path is not yet frozen as
   one explicit operator-facing truth contract across API + runtime surfaces,
3. selected-bot dashboard/manual-order UX still derives some actionable
   optimism from best-effort context or price hints, while the backend write
   path does not yet prove the same context with the same strictness.

This wave narrows the residual gap between:

- canonical bot execution context,
- manual-order context resolution,
- live exchange submission,
- exchange-synced open-order / position adoption,
- dashboard operator-visible action state.

## Audit Findings

### 1. Manual `LIVE` write path is too trusting about bot scope

In [orders.service.ts](/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/modules/orders/orders.service.ts:119),
`resolveCanonicalBotContext()` canonicalizes `mode`, `walletId`, and
`strategyId`, but it still reads venue/execution fields directly from the bot
snapshot (`exchange`, `marketType`, `positionMode`) and does not prove that the
requested symbol belongs to the canonical bot scope for manual execution.

Later, [openOrder()](/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/modules/orders/orders.service.ts:479)
submits the `LIVE` order once `ensureLiveOrderAllowed()` passes, but there is
no final write-side check that the manual order symbol has a canonical
symbol-matching strategy context for that bot.

Risk:

- manual `LIVE` order can drift from the approved inherited wallet + symbol-group
  market-universe contract,
- UI restrictions become advisory rather than authoritative,
- runtime/bot/operator surfaces can disagree on whether that symbol should have
  been tradable for the selected bot at all.

### 2. Manual-order context remains safely degraded for reads, but too permissive for `LIVE` writes

In [orders.manualContext.service.ts](/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/modules/orders/orders.manualContext.service.ts:184),
missing symbol-matching strategy context falls back to safe read defaults
(`MARKET`, `CROSSED`, `1x`), which is acceptable for operator visibility.

But the same unresolved state is not explicitly rejected by `LIVE` manual
submission in [orders.service.ts](/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/modules/orders/orders.service.ts:479).

Risk:

- `PAPER` can remain permissive for experimentation,
- `LIVE` should likely fail closed when symbol-scoped strategy context is
  unresolved, but today the write path does not freeze that distinction.

### 3. Manual `LIVE` market-open truth is deferred but not fully locked end-to-end

In [orders.service.ts](/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/modules/orders/orders.service.ts:533),
position-open lifecycle applies immediately only when a positive fill price is
already resolved. Otherwise the order is intentionally kept `OPEN`.

That is compatible with the architecture, but the repository does not yet
freeze one explicit end-to-end contract for:

- order submitted,
- waiting for fill,
- exchange-synced open order imported,
- exchange-synced position adopted,
- blocked / unresolved states.

The downstream truth today relies on later exchange reconciliation in
[livePositionReconciliation.service.ts](/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/modules/positions/livePositionReconciliation.service.ts:404),
which upserts `EXCHANGE_SYNC` open orders and positions.

Risk:

- operators can experience "manual live order did not open" when the actual
  state is "submitted but not yet reconciled into runtime truth",
- the system remains technically consistent but operationally unclear.

### 4. Orders module still reads duplicated bot venue fields instead of inherited execution context

The architecture says wallet and linked symbol-group market universe are the
source of execution/venue truth. That contract is already codified in
[runtimeBotExecutionContext.ts](/C:/Personal/Projekty/Aplikacje/Soar/apps/api/src/modules/engine/runtimeBotExecutionContext.ts:1)
for runtime automation, but the manual order write path still uses snapshot bot
fields directly.

Risk:

- manual actions and runtime automation can diverge on venue truth,
- same bot can pass one path and fail another if duplicated bot fields drift.

### 5. Web manual-order UX still contains optimistic fallback behavior

In [useManualOrderController.ts](/C:/Personal/Projekty/Aplikacje/Soar/apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts:118),
reference price can fall back from manual-context mark price to signal/open-row
data and finally open-position entry price.

That is useful for estimation, but without a stricter operator state contract
it can make the live action feel more executable than the backend can honestly
guarantee.

Risk:

- user sees a tradable-looking ticket even when backend truth is degraded,
- dashboard action semantics remain less explicit than runtime/monitoring truth.

## Execution Plan

### Wave: `V1COH-A`

1. `V1COH-01 test(api-red): lock manual LIVE order against out-of-scope symbol and unresolved strategy context`
   - Add failing unit/e2e coverage proving `LIVE` manual open is rejected when
     the selected bot has no canonical symbol-matching strategy scope.
   - Lock inherited-context parity so duplicated bot snapshot venue fields
     cannot authorize a `LIVE` order alone.

2. `V1COH-02 fix(api-orders): enforce inherited wallet+venue context and fail closed for unresolved LIVE manual scope`
   - Move manual `LIVE` write-path context resolution onto inherited execution
     context, not duplicated bot snapshot fields.
   - Reject `LIVE` manual orders when canonical symbol scope or strategy context
     is unresolved.

3. `V1COH-03 test(api-runtime-red): lock manual LIVE market submitted->reconciled truth across order, open order, and position visibility`
   - Add end-to-end coverage for:
     - submitted-but-not-filled order,
     - exchange-synced open-order visibility,
     - exchange-synced position adoption,
     - no false immediate position-open claim when fill truth is absent.

4. `V1COH-04 fix(api-reconciliation): tighten exchange-synced order/position adoption around manual LIVE opens`
   - Ensure reconciliation path keeps one deterministic owner/state contract for
     manual `LIVE` orders that were submitted through canonical bot context.
   - Remove any ambiguous or duplicate adoption behavior between native manual
     order rows and `EXCHANGE_SYNC` rows where architecture allows.

5. `V1COH-05 web(runtime-state): expose explicit manual LIVE action states on dashboard surfaces`
   - Keep dashboard-home manual-order UI aligned with API truth:
     - `submitted`,
     - `waiting_for_fill`,
     - `imported_open_order`,
     - `position_opened`,
     - `blocked`.
   - Reduce optimistic fallback semantics where they currently look like
     execution guarantees.

6. `V1COH-06 qa(closure): run focused API + web closure pack and sync canonical docs/context`
   - Focused validation only for touched scope plus guardrails/context sync.

## Priority Order

1. `V1COH-01`
2. `V1COH-02`
3. `V1COH-03`
4. `V1COH-04`
5. `V1COH-05`
6. `V1COH-06`
7. `V1READY-2026-04-25-A` only after execution cohesion is closed

## Non-Goals

- no new trading features,
- no architecture rewrite,
- no separate orders module resurrection,
- no speculative UI redesign outside action-state clarity,
- no V2 assistant/runtime expansion.

## Validation Target

At minimum for closure:

- focused `orders`, `positions`, and reconciliation API suites,
- focused dashboard-home manual-order/runtime view suites,
- touched-scope typecheck,
- `pnpm run quality:guardrails`.
