# Task

## Header
- ID: V1AUTO-03
- Title: Restore imported LIVE DCA operator truth in runtime positions payload
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1AUTO-02
- Priority: P0

## Context
Fresh operator feedback after the latest imported-automation hardening suggests
that `DCA` may now execute on the active imported `LIVE` flow, while the
dashboard positions table still shows no executed `DCA`. The current runtime
positions read-model derives `dcaCount` mainly from `entryLegs.length - 1`,
which assumes the lifecycle already has a canonical `OPEN` trade in local
history. Imported managed positions can violate that assumption temporarily:
they may already have a real `DCA` trade while still lacking the original
imported `OPEN` trade in canonical history.

## Goal
Make runtime positions payload show truthful executed `DCA` count and ladder
state for imported managed positions even when historical `OPEN` trade truth is
not yet fully hydrated.

## Success Signal
- User or operator problem: dashboard open-positions table reflects executed
  `DCA` on imported managed positions instead of showing `0`.
- Expected product or reliability outcome: operator `DCA` truth is derived from
  canonical `DCA` trade history and runtime state, not from a brittle implicit
  `OPEN + adds` assumption.
- How success will be observed: focused API proof for an imported managed
  position with a `DCA` trade but no historical `OPEN` trade returns
  `dcaCount=1` and the expected executed ladder level.
- Post-launch learning needed: no

## Deliverable For This Stage
Implemented backend read-model fix, focused e2e regression, and synchronized
canonical queue/context docs.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Extend runtime position trade-row read-model with canonical
   `lifecycleAction`.
2. Derive `dcaCount` from the strongest available canonical signals in this
   order class: explicit `DCA` trades, runtime state `currentAdds`, and only
   then the old entry-leg inference.
3. Add focused e2e proof for an imported managed position with `DCA` but no
   local `OPEN` trade.
4. Sync canonical queue/context.

## Acceptance Criteria
- Imported managed positions show executed `DCA` count even if local historical
  `OPEN` trade is absent.
- `dcaExecutedLevels` remain aligned with the planned ladder.
- Focused e2e, API typecheck, and repository guardrails are green.

## Definition of Done
- [x] Runtime positions payload derives imported `DCA` truth from canonical `DCA` trades and runtime state.
- [x] Focused regression proves imported managed `DCA` visibility without historical `OPEN`.
- [x] Planning/context docs are synchronized.

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
- Tests: `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- Manual checks: none in this stage
- Screenshots/logs: focused e2e pass
- High-risk checks: imported managed position with `DCA` trade but missing historical `OPEN`

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the runtime positions read-model slice
- Observability or alerting impact: improves operator runtime truth
- Staged rollout or feature flag: no

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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: yes
- Refresh/restart behavior verified: yes
- Regression check performed: yes

## Result Report
- Task summary: runtime positions payload now restores truthful imported `DCA`
  visibility by using canonical `DCA` trades and runtime `currentAdds` before
  relying on the old entry-leg-count inference.
- Files changed: runtime positions repository/service, focused e2e proof,
  planning/context docs.
- How tested: focused imported-DCA visibility e2e, API typecheck, repository
  guardrails.
- What is incomplete: protected post-deploy verification on the real
  `DOGEUSDT` flow.
- Next steps: deploy and confirm that the dashboard open-positions table now
  shows executed `DCA` for the active imported `LIVE` lifecycle.
- Decisions made: no architecture change; keep one runtime positions payload and
  strengthen its `DCA` derivation to respect imported lifecycle reality.
