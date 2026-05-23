# REVIEW-C Runtime State and Reconciliation Closure Plan (2026-04-22)

Status: Closed 2026-04-22  
Wave: `REVIEW-C`

## Objective

Close the remaining production-critical truth gaps found by the post-`REVIEW-B`
review so V1 bot runtime can recover, reconcile, and diagnose exchange state
without silently synthesizing local truth.

## Why This Wave Exists

The latest review confirmed that execution lifecycle parity is materially
better, but three high-risk truth gaps remain:

1. completed DCA dedupe replay can still rebuild runtime state from synthetic
   math instead of canonical persisted position truth,
2. exchange snapshot failures are not guaranteed to flow through one normalized
   operator-facing error contract,
3. live reconciliation still treats "not open anymore" as `CANCELED` even when
   the exchange may have filled the order.

## Governing Sources

- `history/audits/review-c-runtime-state-and-reconciliation-audit-2026-04-22.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`

## Task Packets

### REVIEW-C-01 docs(contract): freeze runtime-state replay and reconciliation truth scope

Reason:

- the next executor needs one explicit task family instead of reconstructing
  intent from audit findings

Primary files:

- this plan
- canonical queue/context files

Acceptance:

- runtime replay, snapshot-error normalization, and reconciliation-truth are
  named as the only in-scope workstreams
- non-goals are explicit: no new exchange rollout, no dashboard redesign, no
  new runtime features

Validation:

- docs sanity review

### REVIEW-C-02 test(api-red): lock canonical runtime-state replay after completed DCA dedupe reuse

Reason:

- the highest remaining runtime truth gap now sits in replay and recovery, not
  in the primary open/close path

Primary files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- adjacent engine/runtime regression tests if needed

Must validate:

- completed DCA dedupe reuse restores runtime state from canonical persisted
  position truth
- replay does not rehydrate quantity or entry price from synthetic local
  `nextState`
- pending or partial DCA reuse still remains explicit unresolved state

Validation:

- `pnpm --filter api run test -- --run <focused runtime replay pack>`

### REVIEW-C-03 refactor(api-runtime): derive replayed DCA state from canonical persisted position truth

Reason:

- replayed runtime state must trust the database-backed post-fill position, not
  evaluation-time math

Primary files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- adjacent runtime helpers if extraction is needed

Acceptance:

- completed DCA reuse loads canonical quantity and entry price from persisted
  position truth
- runtime state handoff distinguishes `completed`, `pending`, and `partial`
  replay cases explicitly
- no touched path reintroduces local pre-confirmation state mutation

Validation:

- focused runtime replay pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-C-04 test(api-red): lock exchange snapshot error normalization and disappearing-order reconciliation semantics

Reason:

- operator diagnostics and recovery flows need stable failure semantics

Primary files:

- `apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- adjacent focused tests if needed

Must validate:

- authenticated exchange snapshot fetch failures normalize to the explicit
  exchange-snapshot error family
- disappearing from open-orders snapshot does not auto-become `CANCELED`
- reconciliation keeps unresolved terminal-state truth explicit until confirmed

Validation:

- `pnpm --filter api run test -- --run <focused positions/reconciliation pack>`

### REVIEW-C-05 refactor(api-ops): normalize snapshot failures through one explicit exchange-error contract

Reason:

- raw adapter/network failures must not leak as generic 500s on the operator
  diagnostics path

Primary files:

- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/positions/positions.controller.ts`
- any touched shared error helper in scope

Acceptance:

- all authenticated snapshot fetch failures flow through one explicit normalized
  contract
- controller behavior remains deterministic for exchange transport and adapter
  failures
- no touched path falls back to ambiguous generic server error when explicit
  exchange context exists

Validation:

- focused snapshot-error pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-C-06 refactor(api-reconciliation): replace synthetic stale-order cancelation with explicit unresolved reconciliation truth

Reason:

- disappearance from exchange open-orders proves only "not currently open", not
  "canceled"

Primary files:

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- touched order lifecycle/reconciliation helpers

Acceptance:

- reconciliation no longer synthesizes `CANCELED` from open-orders absence alone
- unresolved terminal truth is modeled explicitly until a cancel/fill/failure
  outcome is confirmed
- touched recovery flows remain fail-closed and operator-readable

Validation:

- focused reconciliation pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-C-07 qa(closure): run focused runtime/positions truth pack and publish closure evidence

Reason:

- this wave must end with executable evidence, not only reasoning

Acceptance:

- focused review-c validation pack passes
- closure evidence is published under `docs/operations/`
- canonical queue/context/docs are synchronized

Validation:

- `pnpm run quality:guardrails`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- focused `vitest` pack for touched runtime and positions modules

## Execution Order

1. `REVIEW-C-01`
2. `REVIEW-C-02`
3. `REVIEW-C-03`
4. `REVIEW-C-04`
5. `REVIEW-C-05`
6. `REVIEW-C-06`
7. `REVIEW-C-07`

## Non-Goals

- no new exchange support rollout,
- no speculative refactor outside touched runtime and positions seams,
- no dashboard feature work,
- no release-process expansion beyond closure evidence required by this wave.

## Progress Log

- 2026-04-22: Queued `REVIEW-C` from the post-`REVIEW-B` review after
  confirming three remaining production-readiness truth gaps: replayed DCA
  dedupe can still restore runtime state from synthetic math, exchange snapshot
  failures are not guaranteed to normalize through the explicit operator error
  contract, and live reconciliation still treats disappearance from exchange
  open-orders as synthetic `CANCELED`. Published audit evidence in
  `history/audits/review-c-runtime-state-and-reconciliation-audit-2026-04-22.md`
  and this executor-ready rollout plan.
- 2026-04-22: Closed `REVIEW-C` end-to-end by deriving completed DCA replay
  state from canonical persisted position truth, normalizing authenticated
  exchange snapshot failures through one explicit operator error contract, and
  replacing synthetic stale-order cancelation with explicit unresolved
  reconciliation truth. Published closure evidence in
  `history/plans/review-c-runtime-state-and-reconciliation-closure-2026-04-22.md`.
