# V1SAFE-A - LIVE DCA/TTP/TSL Parity Hardening Plan

Status: Planned
Date: 2026-04-29
Owner: Codex Planning Agent

## Why This Wave Exists

Fresh post-`V1PARITY-A` analysis and the newest real-account report show that
the remaining money-impacting gap is narrower and sharper than the first
`V1SAFE` draft implied.

The target is not a brand-new exchange-native protection system.

The target is one truthful, architecture-aligned implementation of the three
main position-protection mechanisms:

- `DCA`
- `TTP`
- `TSL`

Those three mechanisms already have canonical semantics in Soar architecture
and already behave much closer to expectation in `backtest` and `paper`.
`LIVE` is the mode still drifting.

The newest production symptom is especially valuable because it narrows the
bug class:

- an imported or exchange-carried `LIVE` position is visible on the bot
- the operator can see dynamic protection hints in runtime surfaces
- `paper` would already have reacted
- `live` does not execute the expected close

That means the remaining problem is not "strategy config missing everywhere".
It is the mismatch between:

- canonical lifecycle semantics,
- runtime protection state actually available to the `LIVE` engine,
- and what operator surfaces imply is currently armed.

## Canonical Architecture Baseline

Frozen architecture already says:

- lifecycle order is `DCA -> close logic -> LIQUIDATION`
- advanced close mode is `TTP -> TSL`
- if pending DCA is still valid and affordable, `TTP`, `TSL`, and `SL` must
  not close yet
- `TTP` closes after profit retraces from the active high watermark
- `TSL` closes after trailing-loss conditions are met
- recovered `LIVE` positions may be visible before they become actionable
- read models must not imply automation truth the runtime cannot canonically
  execute

Primary architecture sources:

- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-position-restart-continuity-contract.md`

## Confirmed Findings

### 1. `LIVE` TTP/TSL execution depends on persisted runtime trailing state

Confirmed in:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionState.store.ts`
- `apps/api/src/modules/engine/positionManagement.service.ts`

Current behavior:

- `runtimePositionAutomation` evaluates `TTP` / `TSL` from
  `PositionManagementState`
- the decisive trailing fields are:
  - `trailingTakeProfitHighPercent`
  - `trailingTakeProfitStepPercent`
  - `trailingLossLimitPercent`
- if that state does not already exist for a position, the runtime starts from
  a minimal default state built from:
  - current quantity
  - current entry
  - zero DCA count
  - anchor at entry

Observed impact:

- imported `LIVE` positions,
- recovered post-restart positions,
- or positions whose runtime state expired / was never armed

can be perfectly visible while still lacking the canonical high-watermark
history required to trigger `TTP` / `TSL` honestly.

This means `LIVE` can fail to close even when operator-facing tables already
look like a dynamic stop should exist.

### 2. Runtime read-model can display dynamic TTP/TSL fallback that the engine cannot enforce

Confirmed in:

- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimePositionSerialization.service.ts`

Current behavior:

- the runtime positions read-model computes `dynamicTtpStopLoss` and
  `dynamicTslStopLoss`
- when no canonical runtime trailing state exists, serialization can still
  derive a fallback trigger from:
  - current favorable move
  - sticky display-only high watermark
  - strategy-configured trailing levels

Observed impact:

- operator surfaces can imply that `TTP` or `TSL` is effectively armed
- the `LIVE` runtime engine may still have no canonical trailing state capable
  of producing the same close

This is a direct architecture mismatch:

- UI/read model truth is stronger than runtime execution truth
- real-money operator decisions can therefore be based on overstated
  protection readiness

### 3. Imported and recovered `LIVE` positions still lack one canonical protection-state hydration contract

Confirmed across:

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionState.store.ts`

Current behavior:

- ownership, visibility, continuity, and `strategyId` restoration are now much
  better after `V1RESTART-A` and `V1PARITY-A`
- but protection-state hydration is still separate from that recovery model
- there is no canonical rule yet for how `LIVE` runtime should initialize
  DCA/trailing state when a position becomes managed through:
  - exchange import
  - restart recovery
  - same-session delayed ownership recovery

Observed impact:

- the system can correctly say "this is the bot's position"
- while still not knowing whether DCA progression and TTP/TSL trailing state
  should be:
  - reconstructed,
  - degraded,
  - or treated as not yet actionable

### 4. `DCA-first` close gating is canonical, but `LIVE` affordability truth is still weaker than the parity bar

Confirmed in:

- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `apps/api/src/modules/engine/positionManagement.service.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`

Current behavior:

- architecture intentionally allows `DCA` to block `TTP` / `TSL` / `SL` while
  the next add is still valid and affordable
- `LIVE` affordability is currently derived from runtime capital context and
  coarse available-funds math
- this remains weaker and less explicit than the mental model a user gets from
  `paper`, where the whole strategy path is simulated under one deterministic
  engine pass

Observed impact:

- `LIVE` can keep holding because `DCA` is still considered possible
- the operator can interpret the same configuration as "TTP/TSL should now
  protect me"
- the repository still lacks a focused parity pack proving that the same
  DCA-first rule produces operationally equivalent decisions in:
  - `backtest`
  - `paper`
  - `live`

### 5. The repository still lacks one focused parity pack for imported/recovered LIVE positions

Confirmed across current tests:

- `orders.exchangeEvents.service.test.ts`
- `runtimePositionAutomation.service.test.ts`
- `bots.runtime-strategy-context.e2e.test.ts`

Current coverage is materially better than before, but the newest symptom
shows one unproven class still matters:

- imported `LIVE` position already open on the exchange
- strategy context resolved
- runtime view shows advanced trailing plan / dynamic stop hints
- `LIVE` engine must either:
  - execute the same `TTP` / `TSL` decision as canonical lifecycle semantics,
  - or explicitly degrade the row as not protection-actionable

That exact contract is not yet frozen by a dedicated red test pack.

## Repository Conclusion

The strongest confirmed issue is not "Binance needs native trailing orders
first".

The strongest confirmed issue is:

`LIVE` still lacks one canonical parity model for `DCA`, `TTP`, and `TSL`
when a position is imported, recovered, or otherwise enters runtime without a
fully armed in-memory/persisted management state.

This creates three dangerous failure classes:

1. runtime cannot legally fire `TTP` / `TSL` because required trailing state
   was never hydrated
2. operator surfaces imply active protection through read-model fallback
3. `DCA-first` gating remains harder to reason about in `LIVE` than in
   `backtest` / `paper`

## Required Direction

This wave does **not** require a new product decision gate.

The approved direction is:

- preserve the existing architecture where `DCA`, `TTP`, and `TSL` remain
  canonical lifecycle semantics
- make `LIVE` match those semantics as closely as `paper`
- explicitly degrade imported/recovered positions when canonical protection
  state cannot be proven
- remove any read-model implication that a dynamic stop is armed when runtime
  cannot execute it

## Proposed Execution Slices

### V1SAFE-01

`docs(contract): freeze canonical DCA/TTP/TSL parity contract for imported and recovered LIVE positions`

Goal:

- define how `LIVE` must behave when a position is:
  - bot-opened normally
  - imported from exchange
  - recovered after restart
- define when protection state may be reconstructed
- define when the system must degrade to visible-but-not-protection-actionable

### V1SAFE-02

`test(api-runtime-red): lock imported/recovered LIVE TTP/TSL state parity and fail-closed degradation`

Goal:

- add failing coverage for:
  - imported profitable position with missing trailing runtime state
  - recovered position after restart with unresolved high-watermark truth
  - operator/runtime mismatch where read-model shows dynamic stop but engine
    cannot close

### V1SAFE-03

`fix(api-runtime): hydrate or explicitly degrade LIVE protection state on imported/recovered positions`

Goal:

- implement one canonical initialization path for DCA/trailing state
- if state cannot be proven safely, mark protection state degraded instead of
  silently pretending TTP/TSL is armed

### V1SAFE-04

`test(api-runtime-red): lock DCA-first affordability parity across backtest, paper, and live`

Goal:

- add failing coverage for the exact class:
  - pending DCA exists
  - TTP/TSL threshold is also relevant
  - `LIVE` must choose the same branch as canonical lifecycle semantics

### V1SAFE-05

`fix(api-runtime): align LIVE DCA affordability and close gating with canonical parity expectations`

Goal:

- remove remaining `LIVE` drift in how affordability feeds close gating
- make the runtime decision path auditable and deterministic

### V1SAFE-06

`test(api-runtime-red): lock LIVE trigger-input and exit-submission parity for DCA/TTP/TSL`

Goal:

- prove that once management state is canonical, `LIVE` submits the same
  lifecycle action the engine decided
- cover imported and bot-opened positions separately

### V1SAFE-07

`fix(api-runtime+events): close remaining LIVE DCA/TTP/TSL execution parity gaps`

Goal:

- connect runtime decision truth, event truth, and persisted management state
- ensure DCA repricing, trailing re-arm, and exit submission remain aligned

### V1SAFE-08

`test(api-ops-red): lock operator protection truth for actionable versus visual-only fallback states`

Goal:

- add failing read-model coverage so UI cannot overstate:
  - active TTP
  - active TSL
  - active DCA progression

when runtime cannot canonically execute them

### V1SAFE-09

`fix(api+read-model): expose honest LIVE protection state and degradation reasons on operator surfaces`

Goal:

- operator surfaces must distinguish:
  - strategy configured
  - runtime protection state hydrated
  - runtime protection state degraded
  - DCA-first gating currently blocking close

### V1SAFE-10

`qa(closure): run focused LIVE DCA/TTP/TSL parity pack and publish closure evidence`

Goal:

- rerun focused runtime, events, read-model, and imported-position parity
  packs
- publish closure notes against the exact failure class reported by the user

## Acceptance Criteria For The Full Wave

- imported `LIVE` positions do not silently pretend to have armed `TTP` / `TSL`
  when canonical runtime trailing state is missing
- recovered `LIVE` positions either:
  - regain truthful DCA/TTP/TSL runtime state,
  - or stay explicitly degraded for protection automation
- read models no longer imply active dynamic protection beyond what the runtime
  can really execute
- `DCA-first` gating decisions are provably aligned across `backtest`,
  `paper`, and `live` for the covered scenarios
- focused tests prove the `DOGEUSDT`-class symptom cannot recur through the
  same imported/recovered parity gap

## File Scope Forecast

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionState.store.ts`
- `apps/api/src/modules/engine/positionManagement.service.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimePositionSerialization.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- new or updated architecture reference dedicated to `LIVE` protection-state
  parity if required by `V1SAFE-01`

## Risks

- reconstructing trailing state too aggressively from partial live data would
  create fake certainty and violate fail-closed architecture
- keeping read-model fallback stronger than engine truth would continue to
  mislead the operator
- changing DCA-first gating without a parity contract could fix one live case
  while silently breaking canonical lifecycle semantics elsewhere

## Recommendation

Treat the current problem as the final `LIVE DCA/TTP/TSL parity` wave.

Do not start with exchange-native redesign.

Start by freezing the imported/recovered protection-state contract in
`V1SAFE-01`, then lock the exact red cases around:

- missing trailing-state hydration,
- operator/runtime protection mismatch,
- and DCA-first parity across all three modes.
