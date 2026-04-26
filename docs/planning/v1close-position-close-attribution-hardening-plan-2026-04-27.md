# V1CLOSE Position Close Attribution and External-Close Hardening Plan (2026-04-27)

## Status

Queued

## Why This Wave Exists

Production behavior is now materially healthier after the `V1LIVE-A` and
`V1FIX` closure work, but the close lifecycle still has one important operator
truth gap:

- the system can often close a position correctly,
- but it still cannot always say cleanly who or what caused that close.

This matters most for:

- positions closed automatically by bot lifecycle,
- positions closed by the user from the dashboard,
- positions closed manually outside the app on the exchange,
- exchange-forced closes such as liquidation,
- system-only orphan/repair closures.

Without one canonical close-attribution model, the app can keep working
technically while still confusing operators, history views, audit trails, and
future automation safety checks.

## Approved Architecture Decision

User-approved option on 2026-04-27:

- keep `closeReason` as a separate lifecycle dimension
- add a distinct canonical `closeInitiator` dimension
- persist and expose both through the same lifecycle contract

This decision is now frozen in:

- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/position-close-attribution-contract.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`

## Frozen Invariants

### 1. Close reason and close initiator are separate truths

The domain must distinguish:

- why a position closed
- who or what initiated the close

No surface may reconstruct one by guessing from the other.

### 2. One canonical model must cover every close path

The same close-attribution model must be applied by:

- runtime lifecycle close automation
- dashboard/manual app close commands
- exchange event application
- live reconciliation when the position disappears externally
- repair or orphan cleanup flows

### 3. External exchange-only close is not the same as local orphan cleanup

If a position disappears from the exchange without app-side close authority,
the system must not reduce that to generic stale-row cleanup semantics.

Canonical V1 behavior:

- `closeInitiator = USER_EXCHANGE`
- `closeReason = EXTERNAL_SYNC_MISSING`

unless exchange event truth proves a stronger cause such as liquidation.

### 4. Exchange confirmation finalizes lifecycle state, not authorship by default

If the user closes the position from the app and exchange fill later confirms
it, the exchange confirmation finalizes the close but must not overwrite:

- `closeInitiator = USER_APP`

with a weaker generic exchange-origin label.

### 5. UI labels must come from persisted truth

Dashboard history and related read models may present localized labels such as:

- `Closed by bot`
- `Closed by user in app`
- `Closed on exchange`
- `Liquidated on exchange`
- `Closed during repair`

but they must derive those labels from canonical persisted attribution, not
from ad-hoc inference using `origin`, `syncState`, or logs.

## Confirmed Findings

### 1. Architecture defined close authority but not close initiator

Before this wave, architecture docs defined close reasons and lifecycle
authority, but not a first-class attribution model for who initiated closure.

### 2. Current schema cannot persist canonical close attribution

Current domain records expose:

- `origin`
- `managementMode`
- `syncState`
- `lifecycleAction`

but there is no dedicated `closeInitiator` field on `Position`, and no durable
close-attribution contract exposed to operator-facing read models.

### 3. Dashboard close intent already exists, but only as transient intent truth

The dashboard close path already carries a recognizable manual-app close intent,
but that intent is not yet persisted as canonical close attribution on the
final closed `Position`.

### 4. Exchange-event close updates can finalize closure, but do not yet preserve clear initiator truth

The event-driven exchange lifecycle can close a linked position, but current
write paths still focus on final state and realized PnL, not durable close
initiator semantics.

### 5. Reconcile-driven close currently overuses repair-like semantics

When a position disappears from exchange truth, reconciliation can close the
local row, but the current model reads closer to `ORPHAN_LOCAL` cleanup than to
canonical external manual close detection.

## Execution Plan

### Wave: `V1CLOSE-A`

1. `V1CLOSE-01 docs(contract): freeze canonical close-attribution model`
   - Normalize the approved contract into architecture source of truth.
   - Primary files:
     - `docs/architecture/06_execution-lifecycle.md`
     - `docs/architecture/reference/position-close-attribution-contract.md`
     - `docs/architecture/reference/position-lifecycle-parity-matrix.md`

2. `V1CLOSE-02 test(api-red): lock missing close-attribution gaps on current write paths`
   - Add failing regression coverage proving current close paths do not yet
     persist or preserve initiator truth.
   - Required scenarios:
     - dashboard close -> missing `USER_APP`
     - bot lifecycle close -> missing `BOT_APP`
     - reconcile disappearance -> missing `USER_EXCHANGE`
     - repair/orphan close -> missing `SYSTEM_REPAIR`
   - Primary files:
     - `apps/api/src/modules/orders/orders.service.test.ts`
     - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
     - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
     - `apps/api/src/modules/positions/positions.orphan-repair.e2e.test.ts`
     - `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`

3. `V1CLOSE-03 db(schema): add canonical close-attribution fields`
   - Extend persistence with at least:
     - `Position.closeReason`
     - `Position.closeInitiator`
   - Preferred extension:
     - close attribution on close-side `Trade` rows as well
   - Must remain backward-safe for existing history rows through nullable or
     explicit migration handling.
   - Primary files:
     - `apps/api/prisma/schema.prisma`
     - new Prisma migration

4. `V1CLOSE-04 fix(api-runtime): persist `USER_APP` and `BOT_APP` on canonical app-driven closes`
   - Ensure app-side close intent survives through final lifecycle writes.
   - Dashboard/user app close:
     - `closeInitiator = USER_APP`
     - `closeReason = MANUAL`
   - Bot runtime close:
     - `closeInitiator = BOT_APP`
     - lifecycle reason preserved from close engine
   - Primary files:
     - `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
     - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
     - `apps/api/src/modules/orders/orders.service.ts`
     - any shared lifecycle apply helper already used by open/close flows

5. `V1CLOSE-05 fix(api-events): preserve close attribution through exchange confirmation`
   - Exchange fills and account events must finalize close state without
     destroying stronger existing initiator truth.
   - Liquidation or stronger exchange-forced evidence may refine reason and
     initiator to `EXCHANGE`.
   - Primary files:
     - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
     - possibly `apps/api/src/modules/orders/orders.lifecycle.service.ts`
     - related event tests

6. `V1CLOSE-06 fix(api-reconciliation): classify external manual close separately from repair cleanup`
   - Reconcile-driven disappearance of an owned exchange-synced position must
     become canonical external close detection, not generic orphan cleanup.
   - Canonical default:
     - `closeInitiator = USER_EXCHANGE`
     - `closeReason = EXTERNAL_SYNC_MISSING`
   - Repair-only closures must remain:
     - `closeInitiator = SYSTEM_REPAIR`
     - `closeReason = SYSTEM_REPAIR`
   - Primary files:
     - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
     - `apps/api/src/modules/positions/positions.service.ts`
     - orphan-repair helpers and tests

7. `V1CLOSE-07 test(api+read-red): lock read-model and history attribution parity`
   - Add failing coverage that runtime/read models expose canonical close
     attribution consistently.
   - Primary files:
     - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
     - `apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts`
     - any positions/orders history read-model tests

8. `V1CLOSE-08 fix(api+web): expose close attribution on operator surfaces`
   - Extend API/read models and UI labels for history/runtime surfaces.
   - Use shared deterministic label mapping from persisted truth.
   - Primary files:
     - API read models for positions/trades history
     - `apps/web/src/features/dashboard-home/...`
     - `apps/web/src/features/positions/...` if applicable
     - i18n namespaces for labels/copy

9. `V1CLOSE-09 qa(closure): run focused close-attribution pack and sync docs/context`
   - Required evidence:
     - user app close
     - bot lifecycle close
     - external exchange close detection
     - liquidation path if supported by current fixtures
     - repair-only orphan close
     - API read-model parity
     - web label parity
   - Closure docs/context updates:
     - `docs/planning/mvp-next-commits.md`
     - `docs/planning/mvp-execution-plan.md`
     - `.codex/context/TASK_BOARD.md`
     - `.codex/context/PROJECT_STATE.md`

## Field Model Recommendation

Preferred V1 hardening field set:

- `Position.closeReason`
- `Position.closeInitiator`
- close-attribution fields on close-side `Trade` rows when a close trade is
  written

If implementation pressure forces a smaller first persistence step, `Position`
must still remain the canonical authoritative source for operator surfaces.

## Key Risks

### 1. Existing history rows have no attribution

Old rows will need explicit legacy/null behavior. The implementation must not
fabricate false certainty retroactively.

### 2. Exchange disappearance is sometimes ambiguous

There will be cases where the app cannot prove whether the user manually closed
on exchange or the venue closed through another mechanism. The contract already
freezes the conservative default:

- `USER_EXCHANGE + EXTERNAL_SYNC_MISSING`

unless stronger exchange event truth exists.

### 3. Event path and reconcile path must not compete

Exchange events and reconcile closure must share precedence rules so one path
does not overwrite stronger attribution from the other.

## Validation Target

At minimum for the full closure wave:

- `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts`
- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.orphan-repair.e2e.test.ts`
- `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- focused read-model/history tests for positions and trades
- focused web tests for close-attribution label rendering
- `pnpm run typecheck`
- `pnpm run quality:guardrails`

## Non-Goals

- no new sidecar close engine
- no log-only approximation of close attribution
- no UI-only inference layer pretending to know close initiator without
  persisted truth
- no retroactive reclassification of old history rows without explicit
  migration rules
