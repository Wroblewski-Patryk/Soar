# Task

## Header
- ID: V1FINAL-A
- Title: Final runtime closure for production-truth V1 handoff
- Status: IN_PROGRESS
- Owner: Planning Agent
- Depends on: V1MON-A
- Priority: P0

## Context
The repository now passes the full API suite, full web suite, build, and
repository guardrails:

- `pnpm --filter api run test -- --run` with required encryption env: `PASS`
- `pnpm --filter web run test -- --run`: `PASS`
- `pnpm --filter api run typecheck`: `PASS`
- `pnpm run build`: `PASS`
- `pnpm run quality:guardrails`: `PASS`

Fresh production verification on `2026-04-24` confirms that the main runtime
and signal surfaces are no longer in the pre-fix broken state:

- paper bot sizing now follows wallet/strategy truth (roughly `~500 USDT`
  notional on `1000 USDT`, `walletRisk=2`, `25x`)
- selected-bot signal rows now expose numeric RSI values instead of opaque
  `X`
- both paper and live runtime aggregates now expose `latest_decision` truth
  with concrete indicator values for the tracked symbols

Two final, concrete follow-ups remain before backend/runtime can be considered
fully clean for V1 handoff:

1. aggregate session truth still allows a contradictory payload where
   `sessionDetail.status='RUNNING'` and `sessionDetail.finishedAt` is copied
   from an older completed session
2. production still contains at least one legacy paper manual `MARKET` order
   persisted before the immediate-fill fix as `OPEN` without fill/position,
   which now appears in runtime aggregate `openOrders`

This wave exists to close those last backend/runtime truth gaps honestly,
without reopening broader architecture work.

## Goal
Deliver the last backend/runtime cleanup needed for a trustworthy V1 handoff:
aggregate session metadata must be semantically consistent, and legacy orphaned
paper manual orders must have one canonical recovery path.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep the approved singular bot architecture intact
- keep runtime/operator truth fail-closed and explicit

## Definition of Done
- [x] Aggregate runtime monitoring no longer exposes `finishedAt` when the
      aggregate status is `RUNNING`.
- [ ] Legacy orphaned `PAPER MARKET` manual orders have one explicit recovery
      path instead of lingering indefinitely as `OPEN` with no fill/position.
- [ ] Final closure evidence clearly separates code-truth from local infra
      blockers such as occupied Docker ports during smoke runs.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- hiding or dropping orphan paper orders from read surfaces without fixing or
  explicitly classifying them

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - verify production aggregate session payload no longer reports
    `status=RUNNING` with stale `finishedAt`
  - verify the identified legacy paper manual order recovery behavior on prod
    or with a focused replay fixture
- Screenshots/logs:
  - production aggregate excerpts for paper/live bots on `2026-04-24`
  - local `test:go-live:smoke` failure caused by occupied `5432/6379`
- High-risk checks:
  - do not regress aggregate order/history determinism
  - do not mutate live orders or positions during paper-order recovery work

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - only if orphan paper order recovery requires an explicit documented rule

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: selected-bot dashboard and bot-monitoring runtime
  surfaces already approved; this wave changes backend truth, not layout
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: not primary for this backend/runtime cleanup
- Parity evidence:
  - dashboard/bot monitoring aggregate should expose the same session semantics
    and order-state truth after recovery

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
The repository now looks materially healthier than production did earlier in
the week. This wave is intentionally narrow: it should close the last concrete
truth gaps so backend/runtime stops blocking final UI work.

## Execution Plan

### Slice 1 - Aggregate session truth
- [x] `V1FINAL-01 api(aggregate-session-truth): keep aggregate sessionDetail finishedAt null while any session is still RUNNING`
  - update aggregate read-model semantics so synthetic session detail does not
    mix active status with stale completion metadata
  - add regression coverage in the mixed-sessions aggregate e2e

### Slice 2 - Legacy paper-order recovery
- [ ] `V1FINAL-02 api/ops(paper-order-recovery): classify and recover orphaned PAPER MARKET manual orders persisted pre-fix as OPEN without fill/position`
  - audit canonical order lifecycle expectations for pre-fix paper manual
    orders
  - implement one deterministic recovery path using existing order lifecycle or
    explicit cancellation semantics
  - add focused regression or recovery validation

### Slice 3 - Closure
- [ ] `V1FINAL-03 qa(prod-closure): rerun focused runtime closure pack and capture remaining infra-only blockers`
  - rerun focused API validation
  - record that local `test:go-live:smoke` is currently blocked by already
    bound Docker ports from another stack unless ports are freed first
  - sync canonical queue/context for final UI handoff readiness
