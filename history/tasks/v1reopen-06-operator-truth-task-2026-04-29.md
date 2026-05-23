# Task

## Header
- ID: V1REOPEN-06
- Title: Align operator truth for dynamic-stop visibility after LIVE close/reopen and strategy-topology drift
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: V1REOPEN-00, de981fb8 lifecycle retirement hardening
- Priority: P0

## Context

Post-fix audit plus fresh operator notes show one more `V1` regression class:
runtime rows can carry valid `dynamicTtpStopLoss` / `dynamicTslStopLoss`, but
operator surfaces still hide `TTP/TSL` when `showDynamicStopColumns` remains
false because bot-level strategy topology drifted after the position lifecycle
was already opened or recovered.

## Goal

Make `TTP/TSL` visibility fail-safe to real runtime row truth across API and the
two operator-facing web surfaces.

## Deliverable For This Stage

One vertical slice that:

- keeps backend `showDynamicStopColumns` true when any open row carries real
  dynamic-stop truth,
- keeps web tables visible when row truth exists even if the strategy-mode flag
  is false,
- and freezes the contract with targeted regressions.

## Constraints

- use existing runtime position serialization and monitoring systems
- do not introduce a parallel stop-visibility model
- do not bypass bot/session ownership or lifecycle truth
- stay within the approved `V1REOPEN` architecture packet

## Scope

- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- `apps/web/src/features/bots/utils/runtimeSurfaceTruth.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
- `apps/web/src/features/bots/components/BotsManagement.tsx`
- targeted web regressions
- canonical queue/context sync

## Implementation Plan

1. Change API session positions payload to OR bot-level advanced-close topology
   with actual open-row dynamic-stop truth.
2. Reuse one shared web truth helper so both dashboard runtime view-models treat
   row truth as authoritative visibility evidence.
3. Freeze one API regression for downgraded strategy-topology vs legacy row
   truth.
4. Freeze both operator-surface regressions by keeping existing TTP/TSL
   expectations green even when the backend flag is false.
5. Run focused API/web tests, typechecks, and repository guardrails.
6. Mark the task done only after queue/context truth is updated with evidence.

## Acceptance Criteria

- Runtime positions API returns `showDynamicStopColumns: true` when an open row
  still has dynamic-stop truth even though the active bot strategy no longer
  resolves advanced close.
- Dashboard runtime positions table still renders `TTP` and `TSL` when a row
  has dynamic-stop values and the payload flag is false.
- Bots monitoring view still renders `TTP` and `TSL` under the same condition.
- No new visibility-only workaround path is introduced.

## Definition of Done

- [x] API operator-truth drift is fixed and regression-locked
- [x] Dashboard-home operator truth is fixed and regression-locked
- [x] Bots monitoring operator truth is fixed and regression-locked
- [x] Relevant validations pass with evidence attached
- [x] Canonical planning/context docs are synchronized

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
  - `pnpm --filter api exec vitest run src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/bots/bots.e2e.test.ts -t "dynamic"`
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/BotsManagement.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks: not applicable for this slice
- Screenshots/logs: not applicable
- High-risk checks:
  - keep runtime row truth authoritative over topology drift

## Architecture Evidence (required for architecture-impacting tasks)

- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence (required for runtime or infra tasks)

- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: standard revert of this slice if regressions appear

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

This slice does not claim final `LIVE` confidence by itself. It closes the
remaining strongest code-level candidate for "TTP is not visible / not really
there" after the lifecycle hardening wave.

## Production-Grade Required Contract

### Goal

Restore operator-visible truth for dynamic-stop protections after lifecycle
changes and strategy-topology drift.

### Scope

- runtime positions API payload
- dashboard runtime positions visibility
- bots monitoring visibility
- focused regression coverage

### Implementation Plan

1. Fix API visibility contract.
2. Fix web visibility contract through shared helper reuse.
3. Freeze regressions.
4. Run focused validation.
5. Sync canonical docs/context.

### Acceptance Criteria

- Operator-visible `TTP/TSL` matches real runtime row truth across both
  surfaces.
- API and web remain aligned under downgraded strategy topology.
- Focused regression pack stays green.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed:
  - API dynamic-stop serialization unit pack
  - API runtime positions dynamic-stop e2e pack
  - web dashboard runtime table pack
  - web monitoring runtime table pack

## Result Report

- Task summary: closed the operator-truth drift where runtime rows already had
  real `TTP/TSL`, but backend/web could still hide them after strategy-topology
  drift; also repaired the missing bot-managed `TTP` fallback/sticky continuity
  path in runtime serialization.
- Files changed:
  - `apps/api/src/modules/bots/runtimePositionSerialization.service.ts`
  - `apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`
  - `apps/web/src/features/bots/utils/runtimeSurfaceTruth.ts`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
  - `apps/web/src/features/bots/components/BotsManagement.tsx`
  - targeted web regression tests
- How tested:
  - focused API dynamic-stop unit + e2e pack
  - focused web runtime table pack
  - API/web typecheck
  - repository guardrails
- What is incomplete: `V1REOPEN-05` still needs the narrower reopened-`LIVE`
  plus loss-side-only-`DCA` proof packet.
- Next steps: close `V1REOPEN-05`, then publish `V1REOPEN-07` closure evidence.
- Decisions made:
  - treat row-level dynamic-stop truth as the final visibility authority
  - keep the fix inside existing runtime monitoring contracts
  - reuse persisted `trailingLossLimitPercent` as sticky evidence that the
    dynamic `TTP` trail was already armed, instead of reintroducing a
    display-only sticky store
