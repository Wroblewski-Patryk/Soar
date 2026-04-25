# Task

## Header
- ID: XVENUE-08
- Title: Close exchange-context and worker-topology hardening wave
- Status: DONE
- Owner: QA/Test
- Depends on: XVENUE-07
- Priority: P1

## Context
`XVENUE-01..07` have already frozen the exact `(exchange, marketType)` model,
introduced registry-driven adapter seams, removed the highest-value direct
feature-module exchange leaks, locked no-mixing parity coverage, and aligned
worker topology truth with the canonical deployed contract.

The remaining work is a focused closure rerun that proves the full wave still
holds together after the final worker-topology slice and then syncs the
canonical queue/context artifacts to a fully closed `XVENUE-A`.

## Goal
Run the focused `XVENUE-A` closure pack, record validation evidence, and sync
planning/context so the wave is closed cleanly with `git status` returning to a
clean state.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep architecture docs as the source of truth

## Definition of Done
- [x] Focused exact-context exchange tests are rerun and green.
- [x] Focused worker-topology tests are rerun and green.
- [x] API typecheck and repository guardrails are rerun and green.
- [x] `XVENUE-A` source-of-truth docs show the wave as closed and no longer
      leave `XVENUE-08` as active `NOW`.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeConnectorFactory.service.test.ts src/modules/exchange/exchangePublicRead.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/workers/workerOwnership.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed canonical queue/context artifacts after validation so the wave
    closes without leaving a stale active `NOW`
- Screenshots/logs:
  - none
- High-risk checks:
  - exchange exact-context seams and worker-topology truth now pass together in
    one focused rerun after `XVENUE-07`

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/planning/exchange-context-and-worker-topology-hardening-plan-2026-04-25.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - user-approved direction in current thread on 2026-04-25
- Follow-up architecture doc updates:
  - none expected; this is a closure/evidence slice

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
- The closure pack should stay focused on `XVENUE-A` seams rather than rerunning
  unrelated broad DB-backed suites.
