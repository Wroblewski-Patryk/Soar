# V1PARITY-A - LIVE Runtime Lifecycle Parity Hardening Plan

Status: Closed
Date: 2026-04-29
Owner: Codex Planning Agent

Closure evidence:
- `docs/operations/v1parity-live-runtime-lifecycle-parity-closure-2026-04-29.md`

## Why This Wave Exists

Fresh repository analysis after the restart-continuity wave shows that the
project is materially stronger than before, but still carries several
architecture drifts in the highest-risk path: `LIVE position management after
fill confirmation`.

The user's reported symptom is concrete and money-impacting:

- `PAPER` bot DCA executes
- `LIVE` bot DCA does not behave equivalently

That symptom is not isolated to one UI surface. It points to a broader parity
problem between:

- runtime automation
- live order/fill lifecycle application
- exchange event application
- account-update scoping
- operator read-model truth

This wave is therefore not a narrow "make DCA fire" hotfix. It is a canonical
`LIVE lifecycle parity` hardening wave aligned with the approved architecture:

- one lifecycle authority for `PAPER` and `LIVE`
- `order -> fill -> position update` as the canonical progression
- fail-closed behavior when canonical ownership or strategy context is missing
- no UI fallback that masks missing runtime truth

## Confirmed Findings

### 1. Existing-position LIVE fills do not apply canonical add-update lifecycle

Confirmed in:

- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`

Current behavior:

- when an exchange order update confirms a fill for an order that already has
  `positionId`
- and that fill is not a closing fill
- the event path persists a trade-like record
- but does not apply the canonical `computePositionAddUpdate()` logic to the
  linked open position

Architecture mismatch:

- canonical architecture requires `fill confirmed -> position updated`
- current `LIVE` event path can rely on later `ACCOUNT_UPDATE` side effects
  instead of updating the position from the confirmed fill path itself

Observed impact:

- `LIVE` DCA can be submitted and even exchange-filled while canonical
  `position.quantity` / `position.entryPrice` remain stale until another event
  path repairs them
- runtime DCA state and operator position truth can diverge from exchange truth

### 2. LIVE add-leg fills are persisted as generic `OPEN` instead of `DCA`

Confirmed in:

- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`

Current behavior:

- confirmed non-closing fills on an existing open position are recorded with
  `lifecycleAction: 'OPEN'`

Architecture mismatch:

- initial entry and add-leg lifecycle are distinct actions
- DCA is already modeled explicitly in runtime and in the shared position
  management core

Observed impact:

- loss of canonical trade attribution
- weaker history/reporting semantics
- harder operator debugging of whether a live position was opened once or added
  into through DCA

### 3. `ACCOUNT_UPDATE` applies too broadly and can mutate the wrong positions

Confirmed in:

- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`

Current behavior:

- account-update quantity/entry refresh and zero-quantity close operate by:
  `userId + symbol + side + status='OPEN'`

Architecture mismatch:

- the canonical position scope after the single-context bot migration is not
  global `userId + symbol + side`
- runtime truth must stay aligned to canonical ownership context

Observed impact:

- one account update can update or close multiple local rows that merely share
  the same symbol/side under one user
- wallet/bot/origin boundaries are not respected strongly enough
- restart/recovery and imported-position hardening can be undercut by a later
  broad account update

### 4. Operator read models can mask missing canonical strategy context

Confirmed in:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`

Current behavior:

- runtime automation loads strategy only from `position.strategyId`
- runtime session read model can still display DCA/TSL plans by symbol-level
  fallback when `position.strategyId` is missing

Architecture mismatch:

- UI and runtime should not disagree about whether a position is strategy-aware
- one surface must not imply safe automation when canonical runtime context is
  absent

Observed impact:

- operator can see DCA/TSL-looking plan data
- while runtime automation has insufficient canonical context to execute it
- this can visually hide the real cause of skipped `LIVE` management

### 5. Fail-closed runtime skips are not elevated to canonical operator telemetry

Confirmed in:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`

Current behavior:

- several high-value runtime skip reasons are emitted only through
  `console.warn(...)`
- examples: unresolved continuity, missing bot ownership, unresolved execution
  context, `LIVE` bot without `liveOptIn`

Architecture mismatch:

- money-impacting runtime degradation must be inspectable through canonical
  runtime/operator telemetry, not only local process logs

Observed impact:

- operators can observe "DCA did not happen"
- but the platform does not consistently surface why the runtime skipped the
  action

### 6. The repository lacks one end-to-end regression proving LIVE DCA parity

Confirmed by test inventory:

- `runtime-flow.e2e.test.ts` covers paper runtime flow
- focused unit coverage exists for runtime DCA logic
- no focused DB-backed end-to-end pack proves:
  `ticker/candle trigger -> runtime DCA intent -> live order submit ->
  exchange fill/order update -> canonical position repricing -> next runtime
  state`

Architecture mismatch:

- this is a critical vertical slice for real-money behavior
- current coverage proves fragments, not the end-to-end canonical path

Observed impact:

- regressions can survive while many lower-level tests still pass

## Architectural Target

The target state for this wave is:

1. Confirmed `LIVE` add fills must update canonical position state through the
   same lifecycle authority used by immediate-fill and paper paths.
2. `DCA` must remain a first-class lifecycle action in persistence, history,
   runtime telemetry, and reporting semantics.
3. Exchange account updates must reconcile only the positions that belong to
   the relevant canonical ownership scope, not every open row matching one
   symbol/side.
4. Operator read models must not mask missing runtime strategy truth with
   optimistic symbol-level fallbacks.
5. Fail-closed runtime skip reasons must surface in canonical runtime events or
   equivalent operator-observable telemetry.
6. `LIVE` DCA parity must be locked by focused red->green regression coverage.

## Proposed Execution Slices

### V1PARITY-01

`docs(contract): freeze LIVE add-fill, account-update scope, and strategy-context parity contract`

Goal:

- publish one explicit architecture/reference contract for:
  - add-to-position live fills
  - DCA attribution semantics
  - account-update scoping rules
  - runtime-vs-read-model strategy truth

### V1PARITY-02

`test(api-red): lock confirmed LIVE add-fill -> canonical position update and DCA attribution`

Goal:

- add failing tests proving that an exchange-confirmed fill on an existing
  position must update canonical quantity/entry and persist `DCA`, not generic
  `OPEN`

### V1PARITY-03

`fix(api-events): reuse canonical add-update lifecycle for existing-position LIVE fills`

Goal:

- make exchange order updates call one canonical add-update path for existing
  positions instead of relying on later repair/account-update side effects

### V1PARITY-04

`test(api-red): lock account-update scope to canonical position ownership`

Goal:

- add failing coverage proving that account updates must not broadly mutate all
  open rows under `userId + symbol + side`

### V1PARITY-05

`fix(api-events): narrow account-update application to canonical owned position scope`

Goal:

- align account-update write scope with canonical wallet/bot/ownership truth

### V1PARITY-06

`test(api-runtime-red): lock runtime/read-model strategy-context parity for LIVE managed positions`

Goal:

- prove that operator surfaces cannot show DCA/TSL automation truth that the
  runtime itself cannot execute canonically

### V1PARITY-07

`fix(api-runtime+reads): remove or explicitly degrade symbol-level fallback when strategy context is unresolved`

Goal:

- keep UI truthful when `position.strategyId` is absent or unresolved
- prefer restored canonical strategy context over symbol-level masking

### V1PARITY-08

`test(api-ops-red): lock operator-visible telemetry for fail-closed LIVE automation skips`

Goal:

- freeze the expectation that skip reasons such as unresolved continuity or
  missing runtime context become observable through canonical runtime
  telemetry/events

### V1PARITY-09

`fix(api-telemetry): emit canonical runtime diagnostics for skipped LIVE management actions`

Goal:

- replace console-only diagnosis for critical skip classes with operator-safe
  runtime events/telemetry

### V1PARITY-10

`qa(closure): run focused LIVE parity pack and publish result packet`

Goal:

- validate the end-to-end real-money slice:
  - runtime trigger
  - DCA submit
  - exchange fill truth
  - canonical position update
  - runtime state progression
  - operator surface parity

## Scope

Primary code scope:

- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- targeted exchange-boundary tests when needed

Primary test scope:

- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- new or extended focused DB-backed runtime/event lifecycle tests

Doc/context scope:

- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Risks

- money-impacting lifecycle change in `LIVE`
- event ordering differences between `ORDER_TRADE_UPDATE` and `ACCOUNT_UPDATE`
- regressions in imported/manual/exchange-synced position flows
- potential requirement to preserve idempotency across repeated exchange events

## Guardrails

- no new sidecar lifecycle system
- reuse canonical position add/update math
- keep fail-closed behavior when canonical ownership or strategy truth is
  unresolved
- do not loosen restart-continuity protections introduced by `V1RESTART-A`
- do not broaden account-update scope as a convenience shortcut

## Acceptance Criteria

- confirmed `LIVE` add fills update canonical `Position.quantity` and
  `Position.entryPrice` without waiting for a later repair-only path
- add-leg trades persist explicit `DCA` lifecycle attribution where
  semantically correct
- account updates no longer mutate unrelated open positions that merely share
  `userId + symbol + side`
- operator read models do not imply DCA/TSL manageability when canonical
  strategy context is absent
- fail-closed runtime skip reasons become visible through canonical telemetry
- focused LIVE parity tests pass green

## Release Notes Expectation

This wave should be released as a safety/correctness hardening packet, not a
feature release. Operator messaging should explicitly call out:

- improved `LIVE` DCA lifecycle truth
- narrower exchange account-update ownership scope
- better visibility into why runtime skipped a management action
