# Execution Lifecycle Parity and Exchange Truth Plan (2026-04-22)

Status: Closed 2026-04-22
Wave: `XLIFE-A`

## Objective

Make bot execution truly production-safe for V1 by enforcing one canonical
order/fill/position lifecycle for both `PAPER` and `LIVE`.

This wave must remove the remaining runtime drift where:

- live close can finalize local position state before exchange closure truth is
  confirmed,
- runtime trade/PnL history uses signal `markPrice` instead of canonical fill
  truth,
- `PAPER` and `LIVE` still diverge in lifecycle semantics instead of differing
  only at the execution boundary,
- exchange scope remains implicit or misleading in runtime watchdog and
  automation flows.

## Product Intent

- `LIVE` must operate correctly against the exchange without silent local-state
  lies.
- `PAPER` must share the same lifecycle and position-management behavior as
  `LIVE`, except exchange checks are replaced by synthetic fill confirmation.
- future V2 work must extend this single lifecycle, not create a second one.

## Why This Wave Exists

The latest review found that the repo is much cleaner structurally, but the
runtime critical path still has three dangerous truth gaps:

1. close execution can move local position state to `CLOSED` before the live
   close order is actually filled,
2. runtime trade ledger and PnL still derive from signal `markPrice` instead of
   canonical fill price,
3. watchdog and some automation/read paths still carry hidden Binance-only
   assumptions behind broader semantics.

These are V1 reliability issues, not optional polish.

## Governing Contract

This wave is governed by:

- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`

## Frozen Workstreams

### XLIFE-A1 Contract and Before-State Audit

Purpose:

- freeze the exact lifecycle authority and capture every remaining truth gap
  before code changes begin

### XLIFE-A2 Shared Execution and Position Lifecycle Authority

Purpose:

- make `PAPER` and `LIVE` share one execution and position state machine, with
  only the fill source changing at the boundary

### XLIFE-A3 Fill Truth, PnL Truth, and Trade Ledger Truth

Purpose:

- ensure persisted trade price, realized PnL, and telemetry use canonical fill
  data rather than signal reference price

### XLIFE-A4 Exchange Scope Truth for Runtime Watchdog and Automation

Purpose:

- remove misleading generic exchange semantics where runtime infrastructure is
  still Binance-only or otherwise constrained

### XLIFE-A5 Closure Evidence and Future-Agent Extension Rules

Purpose:

- leave one regression-locked, evidence-backed standard for future execution
  work

## Task Packets

### [x] XLIFE-01 docs(contract): freeze one canonical PAPER/LIVE execution lifecycle contract

Reason:

- execution work is too risky to continue without one explicit source of truth

Primary files:

- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- canonical queue/context activation files

Predecessors:

- none

Non-goals:

- no production code changes

Acceptance:

- one active contract defines shared lifecycle authority for `PAPER` and
  `LIVE`
- contract explicitly distinguishes signal price from execution fill truth
- contract explicitly forbids local close-before-fill behavior
- wave is activated in canonical planning/context as the next execution family

Validation:

- docs-only sanity review

Required sync outputs:

- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

### [x] XLIFE-02 audit(api-runtime): map current runtime order/fill/position authority and divergence points

Reason:

- we need one complete before-state map for the bot critical path

Primary scope:

- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/exchange/liveOrderAdapter.service.ts`

Must capture explicitly:

- where open and close use signal `markPrice`
- where fill truth already exists but is ignored
- where position mutation happens before canonical fill confirmation
- what current `PAPER` path does versus `LIVE`
- which exact regression tests are missing for pending and partial close flows

Predecessors:

- `XLIFE-01`

Non-goals:

- no behavior change yet

Acceptance:

- every open and close mutation point is classified as:
  - canonical and safe
  - temporary bridge
  - forbidden and must be removed
- plan is updated if audit reveals the need for extra split tasks

Validation:

- docs-only sanity review

Required sync outputs:

- refresh this wave plan if the audit narrows or expands implementation scope

### [x] XLIFE-03 test(api-red): add failing regression locks for live close pending/partial lifecycle truth

Reason:

- the highest-risk bug must be locked before refactor begins

Primary files:

- `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
- DB-backed runtime/e2e tests if needed

Must validate:

- `LIVE` close with `OPEN` result does not close local position
- `LIVE` close with `PARTIALLY_FILLED` result does not finalize local position
- unresolved close state remains explicit and deterministic
- no duplicate close side effects are emitted while still pending

Predecessors:

- `XLIFE-02`

Non-goals:

- no broad refactor yet

Acceptance:

- tests fail on current unsafe behavior and describe target semantics clearly

Validation:

- `pnpm --filter api run test -- --run <focused orchestrator/runtime pack>`

Required sync outputs:

- none beyond standard wave tracking

### [x] XLIFE-04 refactor(api-runtime): make close lifecycle fail-closed until canonical close fill is confirmed

Reason:

- local position truth must not outrun exchange execution truth

Primary files:

- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- adjacent lifecycle helper modules if extraction is needed

Implementation target:

- submitted or partially-filled close orders keep position state unresolved
- final `closePosition(...)` happens only after canonical fill authority
  confirms closure
- dedupe and cancel/finalize paths remain deterministic
- telemetry and event semantics reflect `submitted/pending/closed` truthfully

Predecessors:

- `XLIFE-03`

Non-goals:

- no redesign of unrelated runtime strategy logic

Acceptance:

- no local close transition occurs before canonical fill confirmation
- pending close path is explicit and testable
- runtime close flow still remains idempotent under retry/dedupe conditions

Validation:

- focused orchestrator/runtime tests
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

Required sync outputs:

- runtime module docs if lifecycle states become more explicit

### [x] XLIFE-05 test(api-red): lock fill-price and realized-PnL truth for open and close trades

Reason:

- the second highest-risk bug is accounting truth, not just position status

Primary files:

- `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
- relevant orders/runtime integration tests

Must validate:

- trade ledger uses canonical fill price when available
- open trade does not persist signal `markPrice` when fill price differs
- close trade and realized PnL derive from canonical fill truth
- fee and quantity handling stay aligned with fill truth

Predecessors:

- `XLIFE-02`

Non-goals:

- no reporting/UI refactor yet

Acceptance:

- tests fail on current mark-price-based behavior and clearly lock desired
  execution truth

Validation:

- `pnpm --filter api run test -- --run <focused orchestrator/orders pack>`

Required sync outputs:

- none beyond standard wave tracking

### [x] XLIFE-06 refactor(api-runtime): derive trades and realized PnL from canonical fill results instead of signal markPrice

Reason:

- execution accounting must reflect what happened, not what the signal saw

Primary files:

- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- supporting lifecycle helper modules if needed

Implementation target:

- runtime open path reads canonical fill price and quantity from order
  lifecycle truth
- runtime close path reads canonical exit fill truth before computing realized
  PnL
- signal `markPrice` is kept only as reference or fallback diagnostics
- persisted trade rows use canonical execution price and quantity

Predecessors:

- `XLIFE-05`

Non-goals:

- no unrelated report-model redesign

Acceptance:

- trade ledger and realized PnL no longer rely on signal `markPrice` when
  canonical fill truth exists
- entry and exit accounting stay deterministic for both `PAPER` and `LIVE`

Validation:

- focused orchestrator/orders tests
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

Required sync outputs:

- execution or reporting docs if persisted accounting contract changes

### [x] XLIFE-07 docs(contract): freeze one shared PAPER/LIVE fill adapter boundary

Reason:

- future agents need one explicit rule for where `PAPER` and `LIVE` may differ

Primary files:

- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- module docs if needed

Must define explicitly:

- shared execution request shape
- shared canonical fill result shape
- what `PAPER` is allowed to synthesize
- what only `LIVE` may source from exchange
- what lifecycle stages must remain identical

Predecessors:

- `XLIFE-02`

Non-goals:

- no code change in this task

Acceptance:

- contract clearly states that `PAPER` bypasses exchange I/O, not lifecycle
  semantics
- future work can extend execution adapters without forking position logic

Validation:

- docs-only sanity review

Required sync outputs:

- module docs linkage where lifecycle ownership is user-facing

### [x] XLIFE-08 refactor(api-shared): converge PAPER and LIVE execution onto one canonical fill-result application path

Reason:

- shared lifecycle semantics should be enforced by structure, not by hope

Primary scope:

- runtime execution orchestration
- shared order lifecycle application
- any adapter/helper that currently forks `PAPER` and `LIVE` behavior

Implementation target:

- `PAPER` and `LIVE` both hand canonical fill results into the same lifecycle
  application path
- only the execution adapter and fill source differ
- shared open/add/close application order is preserved

Predecessors:

- `XLIFE-04`
- `XLIFE-06`
- `XLIFE-07`

Non-goals:

- no new exchange support
- no operator UI redesign

Acceptance:

- no duplicated position-flow semantics remain between `PAPER` and `LIVE` in
  the touched scope
- lifecycle code reads like one domain path with two fill sources

Validation:

- focused orchestrator/runtime pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

Required sync outputs:

- maintainability notes if shared-boundary ownership changed materially

### [x] XLIFE-09 audit(api-exchange-scope): inventory runtime watchdog, automation, and reconciliation exchange-truth drift

Reason:

- the exchange contract around runtime infrastructure must be explicit before
  we harden it

Primary scope:

- `apps/api/src/modules/engine/runtimeScanLoop.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- any adjacent reconciliation/watchdog helpers in scope

Must classify each path as:

- truthful and explicitly Binance-only
- truthful and exchange-aware
- generic contract with hidden Binance-only behavior
- future extension surface that needs an explicit guard now

Predecessors:

- `XLIFE-01`

Non-goals:

- no behavior change yet

Acceptance:

- every reviewed runtime-infra path has explicit scope classification and
  closure action

Validation:

- docs-only sanity review

Required sync outputs:

- update wave plan if audit splits implementation into narrower tasks

### [x] XLIFE-10 refactor(api-exchange-scope): make watchdog and runtime infrastructure explicit about exchange truth

Reason:

- runtime infra must stop pretending to be generic where it is still Binance
  scoped

Primary files:

- `apps/api/src/modules/engine/runtimeScanLoop.service.ts`
- any touched runtime automation/read helper from `XLIFE-09`
- focused tests in the same module family

Implementation target:

- Binance-only paths become explicit in contract and code, or are guarded
  fail-closed
- no synthetic `exchange: 'BINANCE'` remains behind broader semantics
- runtime infra aligns with the capability truth already frozen elsewhere

Predecessors:

- `XLIFE-09`

Non-goals:

- no actual multi-exchange rollout

Acceptance:

- reviewed runtime infra paths are honest about exchange scope
- future exchange rollout can extend explicit boundaries instead of undoing
  hidden assumptions

Validation:

- focused runtime/watchdog tests
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

Required sync outputs:

- exchange/runtime docs if scope wording changes

### [x] XLIFE-11 test(api+e2e): run critical-path regression pack for signal -> order -> fill -> position parity

Reason:

- closure must prove the whole bot path, not isolated helper units only

Must validate:

- `PAPER` open/close parity through shared lifecycle stages
- `LIVE` pending close remains unresolved until fill truth
- canonical fill truth drives trade ledger and PnL
- exchange-scope watchdog/runtime paths remain contractually honest

Primary files:

- focused unit/integration/e2e tests in runtime, orders, and positions modules

Predecessors:

- `XLIFE-04`
- `XLIFE-06`
- `XLIFE-08`
- `XLIFE-10`

Non-goals:

- no new feature work

Acceptance:

- focused critical-path pack passes and covers the previously missing failure
  modes

Validation:

- `pnpm --filter api run test -- --run <focused XLIFE pack>`
- `pnpm --filter api run build`
- `pnpm --filter api run typecheck`

Required sync outputs:

- evidence references for closure doc

### [x] XLIFE-12 docs(sync): publish closure evidence and freeze future-agent execution-extension rules

Reason:

- the wave only pays off if future agents inherit one explicit extension model

Primary outputs:

- closure evidence under `docs/operations/`
- synchronized queue/context/docs
- future-agent rules covering:
  - one shared `PAPER/LIVE` lifecycle
  - fill truth over mark-price truth
  - no local close-before-fill
  - no hidden Binance scope in generic runtime infrastructure

Predecessors:

- `XLIFE-11`

Acceptance:

- canonical queue/context/docs agree on what was closed
- future agents can extend runtime execution without rediscovering hidden rules
  from code archaeology

Validation:

- closure doc sanity review
- queue/context parity review

## Recommended Execution Order

1. `XLIFE-01..XLIFE-03`
2. `XLIFE-04..XLIFE-06`
3. `XLIFE-07..XLIFE-08`
4. `XLIFE-09..XLIFE-10`
5. `XLIFE-11..XLIFE-12`

## Definition of Done

- `LIVE` local position state never closes before canonical close fill truth
- trade ledger and realized PnL use canonical fill truth rather than signal
  `markPrice`
- `PAPER` and `LIVE` share one lifecycle application path with different fill
  sources only
- runtime watchdog and touched automation/read surfaces are explicit about
  exchange scope truth
- focused regressions, docs, queue state, and closure evidence all agree on the
  final behavior

## Closure Summary

Closed: 2026-04-22

Outcome:

- fail-closed close lifecycle now keeps positions unresolved while close orders
  remain `OPEN` or `PARTIALLY_FILLED`
- runtime trade ledger and realized PnL now resolve from canonical fill price
  and quantity before persistence
- runtime-origin orders now persist with `origin=BOT`, so canonical fill
  lifecycle opens bot-owned positions instead of leaking manual ownership truth
- `PAPER` and `LIVE` now share the same touched execution path semantics, with
  fill source remaining the only intended boundary difference
- runtime watchdog remains explicitly Binance-scoped, while runtime position
  automation respects bot exchange context when available

Evidence:

- `history/audits/execution-lifecycle-parity-and-exchange-truth-closure-2026-04-22.md`

Validation closure pack:

- `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/executionAdapterParity.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts src/modules/engine/runtimeCrashRetry.regression.test.ts src/modules/engine/runtime-orchestration-smoke.e2e.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- `pnpm run quality:guardrails`
