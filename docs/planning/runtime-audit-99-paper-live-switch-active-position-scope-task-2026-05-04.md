# Task

## Header
- ID: RUNTIME-AUDIT-99
- Title: Align PAPER to LIVE switch guard with active position truth
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-98
- Priority: P1
- Iteration: 99
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The runtime active-truth contract now consistently treats an active position as
`status=OPEN` and `syncState=IN_SYNC`. The PAPER to LIVE mode switch guard in
bot update still counted every `status=OPEN` paper bot position, including
stale local `ORPHAN_LOCAL` rows that dashboard/runtime no longer treat as
active.

## Goal
Make the PAPER to LIVE mode switch guard block only canonical active paper
positions, not stale local repair rows.

## Scope
- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- This task document

## Success Signal
- User or operator problem: stale local paper rows should not prevent a bot
  from being reconfigured to LIVE after the real active paper position state is
  clear.
- Expected product or reliability outcome: bot mode management follows the
  same active-position truth as dashboard/runtime.
- How success will be observed: e2e regression proves `ORPHAN_LOCAL` open rows
  do not block PAPER to LIVE, while existing active open-position guard remains
  covered.
- Post-launch learning needed: no

## Deliverable For This Stage
Apply the smallest guard predicate change, add the regression, validate, update
context, and commit.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `syncState=IN_SYNC` to the bot PAPER to LIVE open-position count.
2. Add an e2e test proving stale `ORPHAN_LOCAL` open rows do not block the
   switch.
3. Re-run focused bot e2e tests plus standard API/repository gates.
4. Update task board, project state, and planning docs.
5. Create one tiny commit.

## Acceptance Criteria
- PAPER to LIVE switch remains blocked by active `OPEN` + `IN_SYNC`
  `BOT_MANAGED` paper positions.
- PAPER to LIVE switch is not blocked by `OPEN` + `ORPHAN_LOCAL` stale local
  rows.
- No unrelated bot write behavior changes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this slice.
- [x] Focused bot e2e tests pass.
- [x] API typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Documentation/context files are updated.
- [x] A tiny single-purpose commit is created.

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
  - `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.mode-switch-active-position.e2e.test.ts --run` PASS (`27/27`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks: diff review confirmed the guard predicate changed only by
  adding `syncState=IN_SYNC`, and the new regression was kept outside the
  oversized bot e2e file to satisfy repository guardrails.
- Screenshots/logs: not applicable
- High-risk checks: active synced paper positions remain covered by the
  existing blocked-path e2e; stale local positions are covered by the new
  allowed-path e2e.

## Architecture Evidence
- Architecture source reviewed: AGENTS.md, autonomous engineering loop, active
  runtime audit queue, existing active position sync-state contract.
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
- Rollback note: revert this commit to restore previous guard predicate
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: PAPER to LIVE switch guard counted stale local open rows as active.
- Gaps: guard did not include `syncState=IN_SYNC`.
- Inconsistencies: dashboard/runtime active position truth and bot mode guard
  disagreed.
- Architecture constraints: active open position means `OPEN` + `IN_SYNC` for
  runtime/dashboard truth.

### 2. Select One Priority Task
- Selected task: align PAPER to LIVE switch guard with active position truth.
- Priority rationale: bot management configuration should not be blocked by
  stale repair rows after the runtime active-truth cleanup.
- Why other candidates were deferred: broader dashboard wallet checks remain
  queued; this is a confirmed one-line guard drift with test coverage.

### 3. Plan Implementation
- Files or surfaces to modify: bot command service, bot e2e test, planning and
  context docs.
- Logic: add `syncState=IN_SYNC` to the count used for the mode switch block.
- Edge cases: active synced rows must still block; stale local rows must not.

### 4. Execute Implementation
- Implementation notes: added `syncState=IN_SYNC` to the PAPER to LIVE
  open-position count and added a focused e2e regression file for stale local
  rows.

### 5. Verify and Test
- Validation performed: focused bot e2e pack, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: keeping the new regression inside
  `bots.e2e.test.ts` was rejected after guardrails flagged the file-size
  budget.
- Technical debt introduced: no
- Scalability assessment: predicate remains indexed by existing bot/user scope
  and adds a narrow enum equality.
- Refinements made: moved the new regression into a dedicated small e2e file.

### 7. Update Documentation and Knowledge
- Docs updated: task, MVP next commits, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
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
This preserves fail-closed behavior for real active paper positions and only
excludes rows already outside canonical active truth.

## Production-Grade Required Contract
- Goal: align PAPER to LIVE switch guard with active position truth.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: listed above.
- Result Report: pending.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: existing blocked-path e2e remains
- Refresh/restart behavior verified: persistent DB state covered by e2e
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading and bot configuration data
- Trust boundaries: authenticated API and database
- Permission or ownership checks: scoped by `userId` and `botId`
- Abuse cases: one bot/user's stale row must not influence another
- Secret handling: no secret changes
- Security tests or scans: existing e2e auth path plus typecheck/lint
- Fail-closed behavior: synced active paper positions continue to block
- Residual risk: low

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: PAPER to LIVE mode switch guard now follows the canonical
  active-position contract by counting only synced open paper positions.
- Files changed:
  - `apps/api/src/modules/bots/botsCommand.service.ts`
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/runtime-audit-99-paper-live-switch-active-position-scope-task-2026-05-04.md`
- How tested: focused bot e2e pack (`27/27`), API typecheck, repository
  guardrails, lint, and diff check all passed.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue the next tiny runtime/dashboard active-truth audit
  slice.
- Decisions made: new regression belongs in a dedicated small e2e file because
  the main bot e2e file is already near the repository guardrail budget.
