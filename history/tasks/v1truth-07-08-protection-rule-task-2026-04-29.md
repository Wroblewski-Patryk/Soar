# Task

## Header
- ID: V1TRUTH-07-08
- Title: Freeze and implement the final DCA/TTP/TSL protection rule
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: `V1TRUTH-00..06`
- Priority: P0

## Context
The final open `V1TRUTH-A` protection nuance from the user's real-account
notes was narrower than the already closed broad `DCA-first` hardening wave.
The repository still treated all pending DCA levels as a blanket block for
`TTP`, while the approved business rule is more specific: `TTP` should wait
for pending DCA only when some remaining DCA threshold is on the profit side.
Loss-side-only DCA must not suppress a valid trailing take-profit close.

## Goal
Freeze the exact protection rule in canonical docs and align the shared
runtime/backtest/paper kernel so `TTP` distinguishes profit-side pending DCA
from loss-side-only DCA, while `SL` and `TSL` keep the stricter fail-closed
guard.

## Deliverable For This Stage
Verified architecture and implementation closure for the final protection
nuance, including:
- canonical docs update,
- focused shared-kernel and runtime regressions,
- queue/context sync for `V1TRUTH-07` and `V1TRUTH-08`.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Canonical docs state when `TTP` must and must not wait for DCA.
- [x] Shared lifecycle kernel enforces the same rule for all modes.
- [x] Focused runtime tests prove the rule through `RuntimePositionAutomationService`.
- [x] Queue/context docs record `V1TRUTH-07` and `V1TRUTH-08` closure.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`
- Manual checks:
  - compared the new kernel rule against the user-approved semantics:
    `TTP` waits only for remaining profit-side DCA thresholds
- Screenshots/logs: not applicable
- High-risk checks:
  - preserved the stricter fail-closed `SL` / `TSL` guard
  - kept one shared kernel for `BACKTEST`, `PAPER`, and `LIVE`

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates:
  - `docs/architecture/reference/live-protection-state-parity-contract.md`
  - `docs/architecture/reference/position-lifecycle-parity-matrix.md`

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert shared kernel change in `positionManagement.service.ts`
  plus the focused regressions if the new rule proves incorrect in later
  evidence

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
Implementation intentionally changed only the `TTP` gate. `SL` and `TSL`
retain the stronger protection block while DCA remains pending and affordable.

## Production-Grade Required Contract

### Goal
Make the final `V1TRUTH-A` protection nuance explicit and reproducible for
real-money runtime behavior.

### Scope
- `apps/api/src/modules/engine/positionManagement.service.ts`
- `apps/api/src/modules/engine/positionManagement.service.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- protection architecture references
- canonical queue/context sync

### Implementation Plan
1. Add red tests for loss-side-only versus profit-side remaining DCA.
2. Refine the shared `TTP` gate in the lifecycle kernel.
3. Prove runtime behavior through `RuntimePositionAutomationService`.
4. Freeze the contract in architecture docs.
5. Sync queue/context.

### Acceptance Criteria
- Remaining loss-side-only DCA does not block `TTP`.
- Remaining profit-side DCA still blocks `TTP` until completion or DCA funds
  exhaustion.
- `SL` and `TSL` continue to follow the stricter DCA-first block.
- Runtime tests prove the same result through the automation path.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed:
  - shared kernel and runtime automation focused pack

## Result Report

- Task summary:
  - froze and implemented the last protection nuance for `V1TRUTH-A`
- Files changed:
  - shared lifecycle kernel
  - focused engine/runtime tests
  - protection architecture refs
  - queue/context sync
- How tested:
  - focused `positionManagement` and `runtimePositionAutomation` regressions
- What is incomplete:
  - final wave closure pack is tracked separately under `V1TRUTH-09`
- Next steps:
  - run the final `V1TRUTH-A` closure pack and publish closure evidence
- Decisions made:
  - only profit-side remaining DCA blocks `TTP`
  - loss-side-only remaining DCA does not block `TTP`
  - `SL` and `TSL` keep stricter DCA-first fail-closed behavior
