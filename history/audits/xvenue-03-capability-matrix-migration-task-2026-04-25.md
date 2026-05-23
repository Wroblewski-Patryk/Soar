# Task

## Header
- ID: XVENUE-03
- Title: Freeze capability matrix migration rules
- Status: DONE
- Owner: Planning Agent
- Depends on: XVENUE-02
- Priority: P1

## Context
`XVENUE-02` closed the concrete leak audit and confirmed the repository still
mixes two capability layers:

- older exchange-level flags such as `MARKET_CATALOG`, `PAPER_PRICING_FEED`,
  `LIVE_EXECUTION`, and `API_KEY_PROBE`
- newer operation-family contracts such as
  `BALANCE_PREVIEW`, `POSITIONS_SNAPSHOT`, `OPEN_ORDERS_SNAPSHOT`,
  `LIVE_ORDER_SUBMIT`, and `LIVE_ORDER_CANCEL`

The approved architecture now requires the target support model to resolve by
exact `(exchange, marketType, operation)` context. Before registry refactors
begin, the repository needs one canonical migration contract describing:

- what the compatibility-stage matrix still means
- what the exact-stage matrix must mean
- what support may and may not be inferred during the transition

## Goal
Freeze the staged migration rules for exchange capability truth so refactor
tasks can evolve the codebase toward exact `(exchange, marketType, operation)`
semantics without broadening support claims or reintroducing exchange/market
mixing.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the source of truth

## Definition of Done
- [x] Canonical docs define the compatibility-stage capability matrix.
- [x] Canonical docs define the target exact-stage capability matrix.
- [x] Canonical docs freeze inference rules and forbidden support shortcuts.
- [x] Queue/context artifacts point to `XVENUE-04` as the next slice.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed capability ownership and support docs in:
    - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
    - `docs/architecture/reference/exchange-access-ownership-matrix.md`
    - `apps/api/src/modules/exchange/exchangeCapabilities.ts`
    - `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.ts`
    - `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`
- Screenshots/logs:
  - none
- High-risk checks:
  - migration rules explicitly forbid inferring exact support from broad
    exchange-level flags such as `LIVE_EXECUTION`

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - user-approved direction in current thread on 2026-04-25
- Follow-up architecture doc updates:
  - capability migration rules frozen in canonical reference docs

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
- This slice freezes migration rules only; code-level registry refactor starts
  in `XVENUE-04`.
