# Task

## Header
- ID: XADAPT-A
- Title: Exchange adapter execution hardening and staged post-Binance rollout readiness
- Status: BACKLOG
- Owner: Planning Agent
- Depends on: V1COH-A
- Priority: P1

## Context
Fresh repository review after the `V1COH-A` audit confirms that Soar is in a
better place than earlier in the V1 hardening wave, but exchange support truth
is still split across three layers:

1. product and architecture truth are explicitly Binance-first for production
   authenticated reads and runtime closure
2. exchange capability truth in shared metadata allows only Binance
   `LIVE_EXECUTION`
3. some implementation seams still look more generic than the product actually
   supports, especially around the live order adapter and CCXT connector
   boundary

That split is not yet a production bug by itself, but it is an anti-drift
risk. It makes future execution work harder because the repository can look
"multi-exchange ready" before the actual fail-closed contract, regression
coverage, and staged rollout rules are frozen.

This wave exists to make the exchange adapter boundary explicit and boring
before any attempt to expand support beyond Binance. The intent is not to add a
second exchange now. The intent is to make future task-by-task execution safe:

- close residual Binance-specific ambiguity
- freeze one truthful adapter contract
- prove Binance against that contract
- prepare a staged readiness packet for the next exchange instead of jumping
  straight into implementation

## Goal
Create one execution-ready, low-drift delivery wave that:

- freezes truthful exchange execution and authenticated-read capability
  boundaries
- reduces hidden Binance-specific assumptions behind generic-looking APIs
- locks Binance as the canonical reference adapter with focused regression
  coverage
- prepares a staged second-exchange rollout plan without shipping unsupported
  behavior early

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- do not broaden exchange support implicitly through generic naming alone
- keep unsupported exchange behavior explicit and fail-closed
- do not mix adapter-boundary cleanup with a real second-exchange implementation
  in the same wave

## Definition of Done
- [ ] One canonical architecture/task packet defines exchange capability truth
      for write and authenticated-read families.
- [ ] Feature modules depend on one explicit exchange adapter boundary instead
      of scattered CCXT/bootstrap assumptions.
- [ ] Binance behavior is covered by a focused contract pack for order submit,
      reconciliation-facing reads, and fail-closed unsupported cases.
- [ ] The repository has one staged readiness packet for the next exchange that
      can be executed task by task later without rediscovering scope.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- introducing a second exchange behind compatibility fallbacks without an
  explicit support matrix and closure tests
- claiming generic exchange support while keeping Binance-only behavior hidden
  in implementation

## Validation Evidence
- Tests:
  - focused adapter/exchange/orders/positions regression suites
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - verify unsupported exchange paths fail closed with explicit errors
  - verify Binance remains the only supported production execution path after
    boundary hardening
- Screenshots/logs:
  - n/a unless a later exchange-readiness audit needs artifact capture
- High-risk checks:
  - manual `LIVE` open must not regress while adapter boundaries are tightened
  - reconciliation must keep canonical `EXCHANGE_SYNC` ownership semantics
  - no route may silently narrow non-Binance requests into Binance execution

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
  - `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - add one explicit exchange execution capability contract if current docs are
    still read-heavy and do not yet cover write-side support truth narrowly

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: operator runtime/dashboard surfaces already approved;
  this wave is backend/architecture-first with only possible explicit state-copy
  follow-up if `V1COH-05` leaves residual exchange-state ambiguity
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: only if operator state copy/badges change in a later
  slice
- Parity evidence:
  - dashboard and monitoring surfaces must continue to reflect one truthful
    Binance-first execution state after backend boundary hardening

## Review Checklist (mandatory)
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This wave is intentionally sequenced after `V1COH-A`. We should not harden the
adapter boundary while manual `LIVE` submitted->reconciled truth is still
actively moving.

The end-state should make future execution easy:
- take next unchecked task
- implement one narrow slice
- validate against one frozen contract
- avoid rediscovering Binance scope truth every time

## Execution Plan

### Slice 1 - Contract freeze
- [ ] `XADAPT-01 docs(contract): freeze exchange execution capability matrix for authenticated reads and write-side execution`
  - publish one canonical matrix covering:
    - `BALANCE_PREVIEW`
    - `POSITIONS_SNAPSHOT`
    - `OPEN_ORDERS_SNAPSHOT`
    - `LIVE_ORDER_SUBMIT`
    - `LIVE_ORDER_CANCEL`
  - make unsupported exchange behavior explicit and fail-closed
  - keep Binance-only production scope honest in docs and queue/context

### Slice 2 - Current-state audit
- [ ] `XADAPT-02 audit(api-exchange): classify Binance-specific assumptions across orders, exchange, and reconciliation paths`
  - inventory where implementation is:
    - intentionally Binance-scoped
    - compatibility-only
    - too generic-looking for the current product truth
  - produce a concrete follow-up map for refactor-safe ownership cleanup

### Slice 3 - Adapter boundary hardening
- [ ] `XADAPT-03 refactor(api-exchange): expose one canonical exchange adapter boundary for write and authenticated-read consumers`
  - converge feature usage on one narrow adapter contract
  - keep CCXT/bootstrap details behind canonical owner services
  - ensure unsupported capability families stop at the boundary with explicit
    domain errors

### Slice 4 - Binance contract lock
- [ ] `XADAPT-04 test(api-binance): add focused Binance adapter contract coverage for live submit and reconciliation-facing reads`
  - lock contract tests for:
    - live manual submit path
    - authenticated position snapshot
    - authenticated open-order snapshot
    - unsupported exchange fail-closed behavior
    - `SPOT` vs `FUTURES` capability-sensitive cases where applicable

### Slice 5 - Closure
- [ ] `XADAPT-05 qa(closure): run focused exchange-adapter closure pack and sync canonical docs/context`
  - rerun focused API validation
  - confirm no residual hidden-Binance generic behavior remains in touched
    scopes
  - sync queue, board, and project state

### Slice 6 - Next exchange readiness
- [ ] `XADAPT-06 planning(readiness): publish staged next-exchange rollout packet after Binance boundary closure`
  - choose the next target exchange explicitly
  - define staged rollout order:
    - `API_KEY_PROBE`
    - `BALANCE_PREVIEW`
    - `POSITIONS_SNAPSHOT`
    - `OPEN_ORDERS_SNAPSHOT`
    - `LIVE_EXECUTION`
  - list blockers, non-goals, and validation requirements before any real
    second-exchange implementation starts

