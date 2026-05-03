# Task

## Header
- ID: RUNTIME-AUDIT-81
- Title: Align paper wallet reset open-position blocker with sync state
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-80
- Priority: P1
- Iteration: 81
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Paper wallet reset already ignores stale local open orders by requiring
`syncState=IN_SYNC`, but the open-position blocker still counts every
`status=OPEN` row in the wallet. That can make a stale `ORPHAN_LOCAL` position
block reset even though active position lists and runtime paths no longer treat
it as live.

## Goal
Make paper wallet reset block only on active synced open positions.

## Scope
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- this task file

## Success Signal
- User or operator problem: paper wallet reset must not be blocked by stale
  local open-position rows.
- Expected product or reliability outcome: reset blocker semantics match
  dashboard active-position truth.
- How success will be observed: reset succeeds when only an `ORPHAN_LOCAL`
  open position exists and the stale row remains unchanged.
- Post-launch learning needed: no.

## Deliverable For This Stage
Implement the active-sync guard, add focused e2e coverage, run relevant
API/repository validations, and sync canonical planning/context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve blocking behavior for real `OPEN + IN_SYNC` positions

## Implementation Plan
1. Add `syncState=IN_SYNC` to the paper reset open-position blocker count.
2. Add e2e coverage proving stale `ORPHAN_LOCAL` open positions do not block
   paper reset and remain unchanged.
3. Run focused wallets e2e, API typecheck, guardrails, lint, and diff review.
4. Update canonical task, project-state, and MVP planning files.

## Acceptance Criteria
- Paper reset still rejects real `OPEN + IN_SYNC` positions.
- Paper reset succeeds when only stale `OPEN + ORPHAN_LOCAL` positions exist.
- Stale rows remain persisted as stale rows after reset.
- Validation evidence is recorded before the task is marked `DONE`.

## Definition of Done
- [ ] Paper reset position blocker requires `OPEN + IN_SYNC`.
- [ ] Regression coverage proves stale local positions do not block reset.
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
  - `pnpm --filter api run test -- src/modules/wallets/wallets.e2e.test.ts --run` PASS (`20/20`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: `git diff --check` PASS with line-ending warnings only
- Screenshots/logs: not applicable
- High-risk checks: e2e proves `OPEN + ORPHAN_LOCAL` positions do not block
  paper reset and remain unchanged.

## Architecture Evidence
- Architecture source reviewed: `docs/governance/autonomous-engineering-loop.md`,
  prior active-state runtime audit slices, and existing wallet reset order
  blocker behavior.
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
- Issues: paper reset open-position blocker counts every `OPEN` row regardless
  of sync state.
- Gaps: open-order blocker already requires `IN_SYNC`, position blocker does
  not.
- Inconsistencies: stale local open positions can block reset while active
  position lists/runtime ignore them.
- Architecture constraints: keep reset fail-closed for confirmed active rows.

### 2. Select One Priority Task
- Selected task: align paper wallet reset open-position blocker with sync
  state.
- Priority rationale: wallet reset is a lifecycle operation visible on the
  dashboard and must reflect active runtime truth.
- Why other candidates were deferred: this is a confirmed single-surface drift
  with existing adjacent test coverage.

### 3. Plan Implementation
- Files or surfaces to modify: wallets service, wallets e2e, and canonical
  docs/context.
- Logic: add `syncState=IN_SYNC` to the reset open-position count.
- Edge cases: `ORPHAN_LOCAL` remains persisted; `IN_SYNC` still blocks.

### 4. Execute Implementation
- Implementation notes: paper reset open-position blocker now requires
  `syncState=IN_SYNC`, matching the existing open-order blocker and active
  position-list semantics.

### 5. Verify and Test
- Validation performed: focused wallets e2e, API typecheck, repository
  guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: reuse existing order blocker pattern directly.
- Technical debt introduced: no
- Scalability assessment: predicate-level guard matches active-state slices.
- Refinements made: added stale-position coverage next to the existing
  stale-order reset regression.

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
This task complements `RUNTIME-AUDIT-71`, which aligned the paper reset
open-order blocker with sync state.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for this narrow service
  guard.
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: existing reset error behavior preserved for active rows
- Refresh/restart behavior verified: persisted stale row remains unchanged
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for
  this narrow owner-scoped guard.
- Data classification: user-owned wallet and trading position state
- Trust boundaries: authenticated user to owned paper wallet reset endpoint
- Permission or ownership checks: existing `userId` and wallet ownership
  retained
- Abuse cases: stale local row cannot deny reset
- Secret handling: none
- Security tests or scans: pending relevant validation
- Fail-closed behavior: confirmed active `IN_SYNC` rows still block reset
- Residual risk: authenticated production dashboard smoke is not claimed in
  this local slice

## Result Report
- Task summary: paper wallet reset now blocks only on active synced open
  positions, so stale local open-position rows no longer deny reset.
- Files changed:
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/runtime-audit-81-wallet-reset-active-position-sync-state-task-2026-05-04.md`
- How tested: focused wallets e2e (`20/20`), API typecheck, guardrails, lint,
  and diff review all passed.
- What is incomplete: authenticated production dashboard smoke is not claimed
  in this local slice.
- Next steps: continue scanning wallet/runtime projections.
- Decisions made: mirror existing open-order reset blocker semantics for
  positions.
