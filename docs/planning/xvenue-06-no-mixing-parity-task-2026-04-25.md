# Task

## Header
- ID: XVENUE-06
- Title: Add no-mixing parity coverage
- Status: DONE
- Owner: QA/Test
- Depends on: XVENUE-05
- Priority: P1

## Context
`XVENUE-05` removed the highest-value direct exchange leaks from `markets` and
`engine`, but that alone does not protect the repository from future drift.

The approved architecture requires exact `(exchange, marketType)` truth. The
next smallest slice is therefore explicit no-mixing regression coverage proving
that:

- `SPOT` does not silently reuse `FUTURES`
- unsupported venue pairs stay fail-closed
- exact-context registry and catalog seams remain isolated across market types

## Goal
Lock explicit no-mixing parity coverage around the exact-context registry and
market catalog paths so future refactors cannot quietly reintroduce
spot/futures or cross-venue drift.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the source of truth

## Definition of Done
- [x] Registry tests prove exact-context connector resolution differs between
      `SPOT` and `FUTURES`.
- [x] Market catalog tests prove `SPOT` and `FUTURES` stay isolated for the
      same exchange.
- [x] Unsupported venue/context remains fail-closed in focused coverage.
- [x] Queue/context artifacts point to `XVENUE-07` as the next slice.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed focused coverage for exact-context isolation and fail-closed
    unsupported venue pairs
- Screenshots/logs:
  - none
- High-risk checks:
  - no-mixing assertions now exist at the exact-context registry and public
    market-catalog seams, not only in planning docs

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - user-approved direction in current thread on 2026-04-25
- Follow-up architecture doc updates:
  - none in this slice; worker topology truth remains `XVENUE-07`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference:
  - n/a
- Required states: loading | empty | error | success
- Responsive checks:
  - n/a
- Accessibility checks:
  - n/a
- Parity evidence:
  - n/a

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
- This slice is coverage-only and intentionally precedes worker-topology
  alignment in `XVENUE-07`.
