# Task

## Header
- ID: XADAPT-01
- Title: Freeze exchange execution capability matrix for authenticated reads and write-side execution
- Status: DONE
- Owner: Planning Agent
- Depends on: V1READY-2026-04-25-B
- Priority: P1

## Context
`V1COH-A` and the final V1 activation reconciliation closed the immediate
runtime and release truth gaps, but exchange support still looked broader than
the product actually supports. The repository already had one explicit
authenticated-read matrix for `BALANCE_PREVIEW`, `POSITIONS_SNAPSHOT`, and
`OPEN_ORDERS_SNAPSHOT`, while write-side execution truth still had to be
inferred from generic-looking adapter seams and the shared `LIVE_EXECUTION`
capability. Before `XADAPT-02` can audit Binance-specific assumptions safely,
the architecture needs one canonical matrix that freezes both read-side and
write-side exchange capability truth.

## Goal
Publish one explicit, fail-closed capability contract covering:

- `BALANCE_PREVIEW`
- `POSITIONS_SNAPSHOT`
- `OPEN_ORDERS_SNAPSHOT`
- `LIVE_ORDER_SUBMIT`
- `LIVE_ORDER_CANCEL`

so future execution does not infer support from generic naming or partial
implementation seams.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep Binance-first V1 truth explicit
- keep unsupported capability families explicit and fail-closed

## Definition of Done
- [x] Architecture docs state one canonical exchange capability matrix covering authenticated reads and write-side execution.
- [x] The matrix makes Binance-first V1 scope explicit and marks unsupported capability families fail-closed instead of generic-looking.
- [x] Queue/context/planning truth moves from `XADAPT-01` to `XADAPT-02` after the contract is frozen.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- claiming multi-exchange write support from adapter naming alone

## Validation Evidence
- Tests: `pnpm run quality:guardrails`
- Manual checks:
  - compare `docs/architecture/reference/exchange-access-ownership-matrix.md`
    with `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`
    and `libs/shared/index.js`
  - verify the matrix does not imply exchange-side cancel support that runtime
    code does not actually implement
- Screenshots/logs: n/a
- High-risk checks:
  - authenticated reads remain modeled separately from broad
    `LIVE_EXECUTION`
  - write-side cancel remains explicitly unsupported until a real exchange
    boundary exists

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
  - `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates:
  - `XADAPT-02` can now audit runtime code against the frozen matrix instead of
    rediscovering support truth

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: n/a
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: n/a

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Frozen V1 truth after this task:

- `BINANCE` is the only supported exchange for authenticated reads and live
  order submit.
- `LIVE_ORDER_CANCEL` is not yet implemented as an exchange-side capability for
  any exchange and must not be implied from the local `orders/:id/cancel`
  route.
