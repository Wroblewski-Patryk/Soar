# Task

## Header
- ID: XVENUE-04
- Title: Introduce registry-driven adapter-family entrypoints
- Status: DONE
- Owner: Backend Builder
- Depends on: XVENUE-03
- Priority: P1

## Context
`XVENUE-03` froze the capability migration contract and made it explicit that
exact support must converge toward `(exchange, marketType, operation)` truth.

The next smallest code step was not yet removing direct exchange access from
`markets` or `engine`; it was introducing one canonical registry entrypoint for
the approved adapter families so future refactors can depend on exact context
resolution rather than on scattered connector/bootstrap wiring.

## Goal
Add one registry-driven entrypoint in `modules/exchange` that resolves adapter
families by exact `(exchange, marketType)` context, then route the existing
exchange public/account/execution entrypoints through that registry.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the source of truth

## Definition of Done
- [x] A canonical exchange adapter registry exists for exact context
      resolution.
- [x] Public/account/execution exchange entrypoints consume the registry
      instead of locally rebuilding connector wiring.
- [x] Focused regression coverage locks the new registry entrypoints.
- [x] Queue/context artifacts point to `XVENUE-05` as the next slice.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeConnectorFactory.service.test.ts src/modules/exchange/exchangePublicRead.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed that `exchangeConnectorFactory.service.ts`,
    `exchangePublicRead.service.ts`, `exchangeAuthenticatedRead.service.ts`,
    and `exchangeAdapterBoundary.service.ts` now resolve connector bootstrap
    through the new registry
- Screenshots/logs:
  - none
- High-risk checks:
  - registry fails closed for invalid exchange/market-type pairs such as
    `KRAKEN + FUTURES`

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
  - none in this slice; direct feature-module leak removal remains in
    `XVENUE-05`

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
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- This slice intentionally stops at registry entrypoints. Direct exchange SDK
  removal from `markets` and `engine` remains the scope of `XVENUE-05`.
