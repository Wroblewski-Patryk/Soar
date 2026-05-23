# Task

## Header
- ID: XVENUE-05
- Title: Remove direct exchange SDK access from markets and engine
- Status: DONE
- Owner: Backend Builder
- Depends on: XVENUE-04
- Priority: P1

## Context
`XVENUE-04` introduced one canonical adapter-family registry entrypoint inside
`modules/exchange`. The next leak slice from the approved audit was to remove
the highest-value direct exchange access still living in feature modules:

- market catalog bootstrap in `apps/api/src/modules/markets/markets.service.ts`
- live balance reads in
  `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`

These paths were still bypassing exchange-owned services and directly touching
`ccxt` / Binance behavior even after the registry seam existed.

## Goal
Route market catalog and runtime live-balance reads through canonical
exchange-module services so `markets` and `engine` no longer own direct
exchange SDK/bootstrap logic for those paths.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the source of truth

## Definition of Done
- [x] Market catalog bootstrap is owned by `modules/exchange`.
- [x] Runtime live-balance reads are owned by the canonical exchange balance
      boundary.
- [x] Focused regression coverage locks the new ownership path.
- [x] Queue/context artifacts point to `XVENUE-06` as the next slice.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed that `markets.service.ts` now delegates market catalog ownership to
    `exchangeMarketCatalog.service.ts`
  - reviewed that `runtimeCapitalContext.service.ts` now routes live balance
    reads through `fetchSupportedExchangeBalanceRaw`
- Screenshots/logs:
  - local `markets.e2e.test.ts` remains infra-blocked by unreachable
    `localhost:5432`, not by a newly isolated product regression
- High-risk checks:
  - runtime live-balance path now carries explicit `exchange + marketType`
    through the exchange boundary

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
  - none in this slice; no-mixing parity lock remains in `XVENUE-06`

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
- This slice intentionally stops before broader no-mixing parity coverage and
  worker-topology alignment.
