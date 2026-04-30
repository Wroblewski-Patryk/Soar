# Task

## Header
- ID: V1AUTO-01
- Title: Rebase stale imported runtime state to canonical exchange-synced basis
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1ROE-04
- Priority: P0

## Context
Protected production verification after the latest `V1ROE` deploy showed that
operator-visible price truth is now much closer to exchange truth, but the
active imported `LIVE` `DOGEUSDT` position still does not behave like a fully
managed runtime position. The strongest remaining hypothesis is stale
`runtimePositionStateStore` continuity surviving a canonical exchange-sync basis
change on the same imported row.

## Goal
Ensure `EXCHANGE_SYNC BOT_MANAGED` runtime automation rebases stale persisted
state to the canonical exchange-synced `quantity + entryPrice` basis before it
evaluates `DCA/TTP/TSL`.

## Deliverable For This Stage
A small backend runtime fix plus focused regression coverage and synchronized
queue/context docs.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `docs/planning/v1auto-runtime-state-rebase-plan-2026-04-30.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Detect material basis drift between persisted runtime state and canonical
   `EXCHANGE_SYNC` position truth.
2. Rebase runtime automation to canonical position state before management
   evaluation.
3. Add a regression proving stale `currentAdds` cannot suppress valid DCA after
   imported basis drift.
4. Run focused runtime validation and sync canonical docs/context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Acceptance Criteria
- Imported `EXCHANGE_SYNC` positions do not inherit stale persisted
  `currentAdds`, `quantity`, or `averageEntryPrice` after canonical basis drift.
- Focused runtime automation coverage proves DCA can still execute from the new
  canonical basis.
- Queue/context truth reflects the new active slice.

## Definition of Done
- [ ] Runtime automation rebases stale imported state to canonical basis.
- [ ] Focused regression coverage proves the fix.
- [ ] Relevant planning/context files are synchronized.

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
- Tests: `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts`
- Manual checks: protected production verification from the parent packet identified the seam this task closes
- Screenshots/logs:
- High-risk checks: imported `EXCHANGE_SYNC` same-row basis drift can no longer preserve stale `currentAdds`

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this slice to restore previous runtime-state reuse behavior

## Review Checklist (mandatory)
- [ ] Current stage is declared and respected.
- [ ] Deliverable for the current stage is complete.
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed:

## Result Report

- Task summary: imported `EXCHANGE_SYNC` runtime automation now rebases stale persisted state to canonical exchange-synced `quantity + entryPrice` truth before `DCA/TTP/TSL` evaluation when the basis drift is material.
- Files changed: `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`, `apps/api/src/modules/engine/runtimePositionAutomationStateRebase.ts`, `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`, canonical planning/context docs, closure evidence.
- How tested: focused runtime automation Vitest pack, API typecheck, repository guardrails.
- What is incomplete: protected post-deploy verification on the real `DOGEUSDT` flow is still needed as part of the broader `V1EXCEL-03` manual matrix.
- Next steps: verify the deployed fix against the live imported `DOGEUSDT` position and continue the remaining authenticated `LIVE` manual-matrix scenarios.
- Decisions made: keep one shared runtime engine and solve the issue by rebasing imported runtime continuity to canonical exchange-sync truth instead of adding a separate imported-position automation path.
