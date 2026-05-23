# Task

## Header
- ID: RUNTIME-AUDIT-79
- Title: Ignore local-orphan positions in takeover status and rebind
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-78
- Priority: P1
- Iteration: 79
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Takeover status and rebind are repair-oriented surfaces for LIVE
exchange-synced positions. They must keep `DRIFT` candidates visible and
repairable, but stale `ORPHAN_LOCAL` rows represent local records no longer
confirmed by exchange/runtime active truth and must not be reanimated.

## Goal
Prevent `ORPHAN_LOCAL` open-position rows from appearing in takeover status or
being rebound to active bot ownership.

## Scope
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- this task file

## Success Signal
- User or operator problem: takeover dashboard must not show or revive stale
  local rows as if they were live exchange positions.
- Expected product or reliability outcome: repair scans preserve `DRIFT`
  behavior while fail-closing `ORPHAN_LOCAL` rows.
- How success will be observed: rebind scan counts ignore local-orphan rows and
  those rows remain unchanged.
- Post-launch learning needed: no.

## Deliverable For This Stage
Implement the takeover/rebind stale-local filter, add focused e2e coverage, run
relevant API/repository validations, and sync canonical planning/context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve `DRIFT` repair behavior

## Implementation Plan
1. Exclude `syncState=ORPHAN_LOCAL` from takeover rebind candidate reads.
2. Add the same stale-local guard to the rebind update predicate for race
   safety.
3. Exclude `syncState=ORPHAN_LOCAL` from takeover status reads.
4. Extend existing takeover rebind e2e coverage with a local-orphan row that
   matches ownership scope but must remain ignored and unchanged.
5. Run focused takeover e2e test, API typecheck, guardrails, lint, and diff
   review.

## Acceptance Criteria
- Rebind `scanned` count excludes `ORPHAN_LOCAL` open-position rows.
- Matching `ORPHAN_LOCAL` rows are not rebound to a bot and keep
  `syncState=ORPHAN_LOCAL`.
- Takeover status items do not include the ignored stale local row.
- Existing `DRIFT` rebind behavior remains covered and passing.

## Definition of Done
- [ ] Takeover status excludes local-orphan rows.
- [ ] Takeover rebind excludes and does not update local-orphan rows.
- [ ] Regression coverage proves stale local rows stay unchanged.
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
  - `pnpm --filter api run test -- src/modules/positions/positions.takeover-status.e2e.test.ts --run` PASS (`6/6`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS after keeping `positions.service.ts`
    within the 1000-line production monolith budget
  - `pnpm run lint` PASS
- Manual checks: `git diff --check` PASS with line-ending warnings only
- Screenshots/logs: not applicable
- High-risk checks: e2e proves a scope-matching `ORPHAN_LOCAL` row is not
  scanned, not shown in takeover status, and not rebound to a bot.

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
- Issues: takeover status/rebind scan `OPEN` exchange-synced rows without
  excluding stale `ORPHAN_LOCAL` rows.
- Gaps: a stale local row can appear in takeover status and may be rebound to
  `IN_SYNC` if ownership lookup matches.
- Inconsistencies: active dashboard lists already hide local-orphan rows.
- Architecture constraints: preserve repair behavior for `DRIFT` candidates.

### 2. Select One Priority Task
- Selected task: ignore local-orphan positions in takeover status and rebind.
- Priority rationale: rebind is a money-impacting LIVE repair action and must
  fail closed for stale local rows.
- Why other candidates were deferred: this is the smallest confirmed repair
  path drift adjacent to the position active-state work.

### 3. Plan Implementation
- Files or surfaces to modify: positions service, takeover e2e test, and
  canonical docs/context.
- Logic: filter candidate reads and guarded update predicates with
  `syncState != ORPHAN_LOCAL`.
- Edge cases: `DRIFT` remains eligible; `ORPHAN_LOCAL` remains audit-visible
  through history but not takeover-active.

### 4. Execute Implementation
- Implementation notes: takeover status and rebind candidate reads now exclude
  `syncState=ORPHAN_LOCAL`, and the rebind update predicate repeats the same
  stale-local guard.

### 5. Verify and Test
- Validation performed: focused takeover e2e, API typecheck, repository
  guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filter only read path; rejected because rebind
  update also needs race-safe fail-closed protection.
- Technical debt introduced: no
- Scalability assessment: predicate-level stale-state exclusion matches the
  current service style.
- Refinements made: preserved `DRIFT` rebind behavior and kept the touched
  service inside the production monolith line budget without adding an
  allowlist.

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
This task intentionally does not exclude `DRIFT` because existing takeover
rebind tests and repair semantics rely on `DRIFT` being eligible for recovery.

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
- Data classification: user-owned LIVE trading position state
- Trust boundaries: authenticated user to owned position repair endpoint
- Permission or ownership checks: existing `userId` ownership retained
- Abuse cases: stale local row cannot be reanimated by takeover rebind
- Secret handling: none
- Security tests or scans: pending relevant validation
- Fail-closed behavior: local-orphan rows are not scanned or updated
- Residual risk: authenticated production dashboard smoke is not claimed in
  this local slice

## Result Report
- Task summary: takeover status and rebind now ignore stale local-orphan open
  positions while preserving `DRIFT` repair semantics.
- Files changed:
  - `apps/api/src/modules/positions/positions.service.ts`
  - `apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-79-takeover-ignore-local-orphans-task-2026-05-04.md`
- How tested: focused takeover e2e (`6/6`), API typecheck, guardrails, lint,
  and diff review all passed.
- What is incomplete: authenticated production dashboard smoke is not claimed
  in this local slice.
- Next steps: continue scanning adjacent runtime/wallet position projections.
- Decisions made: preserve `DRIFT` rebind semantics while excluding
  `ORPHAN_LOCAL`.
