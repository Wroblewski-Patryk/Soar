# Task

## Header
- ID: XVENUE-01
- Title: Freeze exact exchange-context and adapter-family architecture
- Status: DONE
- Owner: Planning Agent
- Depends on:
- Priority: P1

## Context
The repository has completed the Binance-first hardening wave, but the user
clarified a broader target architecture:

- exchange support must follow the exact exchange chosen by the user
- `SPOT` and `FUTURES` are separate market domains
- prices, candles, indicators, signals, and execution must not mix across
  different `(exchange, marketType)` pairs
- the scalable implementation model should use narrow adapter families under
  one registry rather than letting feature modules import exchange SDKs
  directly
- worker health/readiness should reflect the full deployed topology where it
  matters

Before code refactors or audits continue, those rules needed to be frozen in
canonical architecture docs so later execution slices can be judged against one
approved model.

## Goal
Publish the approved exact `(exchange, marketType)` architecture contract and
the narrow adapter-family model in canonical architecture docs, then sync the
execution queue onto the next smallest slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the source of truth

## Definition of Done
- [x] Canonical architecture docs describe exact `(exchange, marketType)`
      context as the required exchange-owned input.
- [x] Canonical architecture docs freeze the narrow adapter-family model.
- [x] Canonical architecture docs freeze the no-mixing rule across exchanges
      and market types.
- [x] Queue/context artifacts point to `XVENUE-02` as the next slice.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed updated architecture docs for alignment with approved direction
- Screenshots/logs:
  - none
- High-risk checks:
  - architecture wording now explicitly forbids `SPOT`/`FUTURES` mixing and
    cross-exchange market-data reuse

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - user-approved direction in current thread on 2026-04-25
- Follow-up architecture doc updates:
  - none in this slice beyond the contract freeze itself

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
- This slice is documentation-only and intentionally precedes the code audit in
  `XVENUE-02`.
