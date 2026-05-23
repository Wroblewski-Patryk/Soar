# Task

## Header
- ID: XVENUE-02
- Title: Inventory boundary leaks and direct exchange SDK usage
- Status: DONE
- Owner: Planning Agent
- Depends on: XVENUE-01
- Priority: P1

## Context
`XVENUE-01` froze the approved architecture: exchange-owned behavior must
resolve from exact `(exchange, marketType)` context, `SPOT` and `FUTURES` must
not mix, feature modules should use narrow adapter families under one registry,
and worker health/readiness should align to the full topology.

Before any new capability-matrix or refactor slice, the repository needed one
concrete audit describing where direct exchange-specific behavior still leaks
outside `modules/exchange`, where generic-looking contracts are still backed by
Binance-only implementations, and where worker topology truth is narrower than
architecture allows.

## Goal
Publish a concrete code-audit packet mapping every confirmed exchange-boundary
leak to its future adapter-family target and sync the queue onto the next
smallest contract slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the source of truth

## Definition of Done
- [x] Confirmed direct exchange SDK usage outside `modules/exchange` is
      inventoried.
- [x] Confirmed generic-contract versus Binance-only implementation drift is
      captured.
- [x] Confirmed worker topology truth drift is captured for the later worker
      slice.
- [x] Queue/context artifacts point to `XVENUE-03` as the next slice.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed direct exchange access and worker topology paths in:
    - `apps/api/src/modules/markets/markets.service.ts`
    - `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
    - `apps/api/src/modules/engine/runtimeSignalMarketDataGateway.ts`
    - `apps/api/src/modules/bots/runtimeMarketDataFallback.service.ts`
    - `apps/api/src/modules/backtests/backtestDataGateway.ts`
    - `apps/api/src/modules/profile/apiKey/binanceApiKeyProbe.service.ts`
    - `apps/api/src/router/index.ts`
    - `apps/api/src/workers/workerOwnership.ts`
- Screenshots/logs:
  - none
- High-risk checks:
  - audit packet explicitly preserves fail-closed scope so future refactors do
    not accidentally over-claim support for exchanges or market types

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  - user-approved direction in current thread on 2026-04-25
- Follow-up architecture doc updates:
  - none in this slice; follow-up contract freeze moves to `XVENUE-03`

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
- Canonical audit packet:
  `history/audits/xvenue-02-exchange-boundary-leak-audit-2026-04-25.md`
- This slice is documentation-only and intentionally precedes capability-matrix
  migration in `XVENUE-03`.
