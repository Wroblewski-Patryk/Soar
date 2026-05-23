# Task

## Header
- ID: V1LIVE-02-03
- Title: Lock and fix exact exchange-context truth for runtime watchdog and position automation
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1LIVE-01
- Priority: P0

## Context
The fresh `V1LIVE` audit confirmed that live execution context is still allowed
to drift behind hidden `BINANCE` / `FUTURES` defaults in runtime-facing engine
services. That violates the approved exchange-selected execution contract and
keeps older manual/orphan runtime behavior alive even when no canonical bot or
wallet venue context exists.

The current drift is visible in:

- `apps/api/src/modules/engine/runtimeScanLoop.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`

Both services must follow exact inherited execution context and fail closed
when that context is unresolved.

## Goal
Freeze and implement one exact exchange-context contract for runtime watchdog
and runtime position automation so they never silently synthesize Binance truth
from environment defaults.

## Deliverable For This Stage
- red/green regression coverage for exact exchange-context truth
- implementation removing hidden runtime/manual exchange fallbacks
- synced planning/context truth for the closed `V1LIVE-02/03` slice

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Runtime watchdog derives scan targets only from canonical ownership context.
- [x] Runtime position automation skips unresolved position contexts instead of using env exchange defaults.
- [x] Focused tests, typecheck, and guardrails pass.

## Stage Exit Criteria
- [ ] The output matches the declared `Current Stage`.
- [ ] Work from later stages was not mixed in without explicit approval.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`
- Manual checks: n/a
- Screenshots/logs: n/a
- High-risk checks: unresolved runtime/manual contexts now fail closed; imported live positions with `markPrice` but no `entryPrice` remain unresolved

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: context/planning sync only if behavior truth changes

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none intended; hidden env exchange defaults should become non-authoritative
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this slice if runtime automation unexpectedly stops seeing canonically owned live positions

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This slice closed together with the immediately adjacent imported-entry fix
packet because both changes remove hidden synthetic exchange truth from the
same live-execution wave. Ownership classifier reuse and event-driven Binance
lifecycle remain in `V1LIVE-04..14`.
