# Task

## Header
- ID: RUNTIME-AUDIT-80
- Title: Ignore local-orphan rows in legacy open-position repair
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-79
- Priority: P1
- Iteration: 80
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Legacy open-position repair is intended to rebind still-active legacy local
rows or close detached blockers. Rows already marked `ORPHAN_LOCAL` represent
local state that should remain inactive/audit-only and must not be rebound back
to active bot ownership by a repair endpoint.

## Goal
Prevent legacy open-position repair from scanning or updating
`syncState=ORPHAN_LOCAL` rows.

## Scope
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/positions/positions.orphan-repair.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- this task file

## Success Signal
- User or operator problem: repair endpoints must not revive local positions
  that runtime/reconciliation already marked stale.
- Expected product or reliability outcome: legacy repair remains useful for
  `IN_SYNC` legacy rows while local-orphan rows stay inactive.
- How success will be observed: repair scan counts ignore a matching
  `ORPHAN_LOCAL` row and leave it unchanged.
- Post-launch learning needed: no.

## Deliverable For This Stage
Implement the stale-local guard in legacy repair, add an e2e regression, run
relevant API/repository validations, and sync canonical planning/context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve current `IN_SYNC` legacy rebind and detached-blocker close behavior

## Implementation Plan
1. Exclude `syncState=ORPHAN_LOCAL` from the `repairLegacyOpenPositions`
   candidate query.
2. Add the same stale-local exclusion to both repair update predicates for
   race-safe fail-closed behavior.
3. Extend orphan-repair e2e coverage with a scope-matching local-orphan row
   that must not count as scanned or become rebound.
4. Run focused orphan-repair e2e, API typecheck, guardrails, lint, and diff
   review.

## Acceptance Criteria
- Local repair `scanned` count excludes `ORPHAN_LOCAL` open rows.
- Scope-matching `ORPHAN_LOCAL` rows keep `botId=null` and
  `syncState=ORPHAN_LOCAL`.
- Existing canonical rebind, detached close, and exchange re-import behavior
  remains passing.
- Validation evidence is recorded before the task is marked `DONE`.

## Definition of Done
- [ ] Legacy repair excludes local-orphan candidate rows.
- [ ] Legacy repair update predicates are stale-local guarded.
- [ ] Regression coverage proves local-orphan rows stay unchanged.
- [ ] Relevant validation commands pass.
- [ ] Canonical docs/context are updated.

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
  - `pnpm --filter api run test -- src/modules/positions/positions.orphan-repair.e2e.test.ts --run` PASS (`1/1`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS after keeping `positions.service.ts`
    within the 1000-line production monolith budget
  - `pnpm run lint` PASS
- Manual checks: `git diff --check` PASS with line-ending warnings only
- Screenshots/logs: not applicable
- High-risk checks: e2e proves a scope-matching `ORPHAN_LOCAL` row is not
  scanned by local repair and remains unbound with `syncState=ORPHAN_LOCAL`.

## Architecture Evidence
- Architecture source reviewed: `docs/governance/autonomous-engineering-loop.md`,
  `docs/planning/mvp-next-commits.md`, and prior active-state audit slices.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this small service/test/docs commit.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: legacy repair scans open botless BOT/USER rows without excluding
  `ORPHAN_LOCAL`.
- Gaps: a local-orphan row that still matches wallet/strategy scope can be
  rebound to a canonical bot.
- Inconsistencies: active list, manual mutation, takeover, and runtime paths
  now treat local-orphan rows as inactive.
- Architecture constraints: repair must still handle valid legacy `IN_SYNC`
  rows and detached blockers.

### 2. Select One Priority Task
- Selected task: ignore local-orphan rows in legacy open-position repair.
- Priority rationale: repair endpoint mutates live-trading position ownership
  and must fail closed for stale local rows.
- Why other candidates were deferred: this is the closest confirmed repair
  mutation drift after takeover rebind.

### 3. Plan Implementation
- Files or surfaces to modify: positions service, orphan-repair e2e test, and
  canonical docs/context.
- Logic: use `syncState != ORPHAN_LOCAL` in candidate and update predicates.
- Edge cases: `IN_SYNC` legacy row still rebounds; detached `IN_SYNC` blocker
  still closes; already-local-orphan row remains audit-only.

### 4. Execute Implementation
- Implementation notes: `repairLegacyOpenPositions` now excludes
  `syncState=ORPHAN_LOCAL` from candidate scans and from both guarded repair
  update predicates.

### 5. Verify and Test
- Validation performed: focused orphan-repair e2e, API typecheck, repository
  guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only filter candidate query; rejected because
  update predicates should be race-safe.
- Technical debt introduced: no
- Scalability assessment: predicate-level guard matches adjacent active-state
  slices.
- Refinements made: aligned the orphan-repair e2e expectation with canonical
  market-scoped imported external IDs.

### 7. Update Documentation and Knowledge
- Docs updated: task file and MVP planning files.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
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
The existing endpoint also runs exchange reconciliation after local repair; this
task changes only the local legacy repair candidate/update boundaries.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for this narrow service
  guard.
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for
  this narrow owner-scoped guard.
- Data classification: user-owned trading position state
- Trust boundaries: authenticated user to owned repair endpoint
- Permission or ownership checks: existing `userId` ownership retained
- Abuse cases: stale local row cannot be reanimated by legacy repair
- Secret handling: none
- Security tests or scans: pending relevant validation
- Fail-closed behavior: local-orphan rows are not scanned or updated
- Residual risk: authenticated production dashboard smoke is not claimed in
  this local slice

## Result Report
- Task summary: legacy open-position repair now ignores local-orphan rows while
  preserving valid `IN_SYNC` legacy rebind and detached-blocker close behavior.
- Files changed:
  - `apps/api/src/modules/positions/positions.service.ts`
  - `apps/api/src/modules/positions/positions.orphan-repair.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/runtime-audit-80-orphan-repair-ignore-local-orphans-task-2026-05-04.md`
- How tested: focused orphan-repair e2e (`1/1`), API typecheck, guardrails,
  lint, and diff review all passed.
- What is incomplete: authenticated production dashboard smoke is not claimed
  in this local slice.
- Next steps: continue scanning wallet/runtime projections.
- Decisions made: preserve `IN_SYNC` repair behavior while excluding
  `ORPHAN_LOCAL`.
