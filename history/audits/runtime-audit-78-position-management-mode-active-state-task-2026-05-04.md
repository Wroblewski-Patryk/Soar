# Task

## Header
- ID: RUNTIME-AUDIT-78
- Title: Require active synced state for position management-mode updates
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-77
- Priority: P1
- Iteration: 78
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator-reported LIVE/PAPER dashboard drift has been narrowed across active
orders and positions to a consistent rule: records can be treated as active
only when lifecycle status and reconciliation state agree. Position list reads
and manual TP/SL updates already require `status=OPEN` plus
`syncState=IN_SYNC`; the management-mode toggle still updates by owner and id
only.

## Goal
Prevent stale or closed position rows from being switched between
`BOT_MANAGED` and `MANUAL_MANAGED`.

## Scope
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/positions/positions.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- this task file

## Success Signal
- User or operator problem: dashboard controls must not mutate rows that runtime
  and active lists no longer consider live.
- Expected product or reliability outcome: management-mode changes follow the
  same active-position contract as manual TP/SL updates.
- How success will be observed: stale `ORPHAN_LOCAL` open positions return no
  update and keep their previous management mode.
- Post-launch learning needed: no.

## Deliverable For This Stage
Implement the guarded mutation, add focused regression coverage, run relevant
API/repository validations, and sync source-of-truth docs.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `status=OPEN` and `syncState=IN_SYNC` to the
   `updatePositionManagementMode` guarded `updateMany` predicate.
2. Add a service regression test proving stale `ORPHAN_LOCAL` open positions
   are rejected and left unchanged.
3. Run focused API service test, API typecheck, guardrails, lint, and diff
   review.
4. Update canonical task, project-state, and MVP planning files.

## Acceptance Criteria
- `updatePositionManagementMode` returns `null` for user-owned stale open rows.
- The stale row's `managementMode` remains unchanged.
- Existing owner happy path remains covered by existing e2e behavior.
- Validation evidence is recorded before the task is marked `DONE`.

## Definition of Done
- [ ] Active position management-mode mutation requires `OPEN + IN_SYNC`.
- [ ] Regression coverage proves stale open rows are not mutated.
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
  - `pnpm --filter api run test -- src/modules/positions/positions.service.test.ts --run` PASS (`3/3`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: `git diff --check` PASS with line-ending warnings only
- Screenshots/logs: not applicable
- High-risk checks: stale `ORPHAN_LOCAL` open-position regression proves the
  row returns `null` and keeps `managementMode=BOT_MANAGED`.

## Architecture Evidence
- Architecture source reviewed: `docs/governance/autonomous-engineering-loop.md`,
  `.codex/context/TASK_BOARD.md`, prior `RUNTIME-AUDIT-73..77` active-state
  slices.
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
- Issues: management-mode toggle can update stale or closed rows by id/owner.
- Gaps: active-state contract is not identical to manual TP/SL updates.
- Inconsistencies: dashboard active reads ignore stale rows, but this mutation
  can still alter them.
- Architecture constraints: reuse existing service/controller behavior and
  keep stale rows audit-visible but not active-mutable.

### 2. Select One Priority Task
- Selected task: require active synced state for position management-mode
  updates.
- Priority rationale: position ownership/management state is a live-trading
  control and must fail closed.
- Why other candidates were deferred: this is the smallest confirmed API drift
  adjacent to already-closed position active-state work.

### 3. Plan Implementation
- Files or surfaces to modify: positions service, focused service test, and
  canonical docs/context.
- Logic: guarded `updateMany` requires `id`, `userId`, `status=OPEN`, and
  `syncState=IN_SYNC`.
- Edge cases: stale open rows return `null`; closed rows also return `null`.

### 4. Execute Implementation
- Implementation notes: `updatePositionManagementMode` now uses the same
  `OPEN + IN_SYNC` active-position predicate as adjacent dashboard mutation
  paths.

### 5. Verify and Test
- Validation performed: focused positions service suite, API typecheck,
  repository guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: keep controller unchanged and fail closed through
  existing service `null` behavior.
- Technical debt introduced: no
- Scalability assessment: predicate-level guard matches existing manual update
  and runtime-close slices.
- Refinements made: kept controller response semantics unchanged by returning
  service `null` for non-active-mutable rows.

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
The public API behavior can remain `404 Not found` for rows that are not
active-mutable, because the controller already maps service `null` to `404`.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for this narrow service
  guard.
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: existing `404` path preserved
- Refresh/restart behavior verified: not applicable
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for
  this narrow owner-scoped guard.
- Data classification: user-owned trading position state
- Trust boundaries: authenticated user to owned position row
- Permission or ownership checks: existing `userId` ownership retained
- Abuse cases: stale local row cannot be toggled into bot-managed state
- Secret handling: none
- Security tests or scans: pending relevant validation
- Fail-closed behavior: stale rows return `null` and controller returns `404`
- Residual risk: authenticated production dashboard smoke still requires real
  operator credentials and is not claimed in this task

## Result Report
- Task summary: position management-mode updates now fail closed unless the row
  is owned, open, and `IN_SYNC`.
- Files changed:
  - `apps/api/src/modules/positions/positions.service.ts`
  - `apps/api/src/modules/positions/positions.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-78-position-management-mode-active-state-task-2026-05-04.md`
- How tested: focused service regression (`3/3`), API typecheck, guardrails,
  lint, and diff review all passed.
- What is incomplete: authenticated production dashboard smoke is not claimed
  in this local slice.
- Next steps: continue scanning adjacent position lifecycle mutations.
- Decisions made: preserve existing controller response semantics.
