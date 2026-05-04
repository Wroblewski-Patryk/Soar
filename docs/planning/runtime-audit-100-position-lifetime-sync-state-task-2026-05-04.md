# Task

## Header
- ID: RUNTIME-AUDIT-100
- Title: Scope runtime position lifetime to synced open positions
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-99
- Priority: P1
- Iteration: 100
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position lifetime closes stale bot positions through canonical runtime
close orchestration. After the active-truth cleanup, only `OPEN` +
`IN_SYNC` positions should be eligible for automated management. The default
lifetime scanner still queried by `status=OPEN` alone.

## Goal
Prevent runtime position lifetime enforcement from selecting stale local
`ORPHAN_LOCAL` open rows for automated close orchestration.

## Scope
- `apps/api/src/modules/engine/runtimePositionLifetime.service.ts`
- `apps/api/src/modules/engine/runtimePositionLifetime.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- This task document

## Success Signal
- User or operator problem: stale local positions should not generate runtime
  close attempts or dashboard history noise.
- Expected product or reliability outcome: lifetime management follows the
  same active-position truth as pre-trade, dashboard, and order lifecycle.
- How success will be observed: regression proves default lifetime deps close
  only stale synced positions and ignore stale `ORPHAN_LOCAL` rows.
- Post-launch learning needed: no

## Deliverable For This Stage
Apply the smallest query predicate fix, add a default-deps regression, validate,
sync docs/context, and commit.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `syncState=IN_SYNC` to the default stale-position lifetime scan.
2. Add a regression using the real default Prisma scanner, with one stale
   `ORPHAN_LOCAL` row and one stale `IN_SYNC` row.
3. Run focused lifetime tests plus API typecheck, guardrails, lint, and diff
   check.
4. Update task board, project state, and planning docs.
5. Create one small commit.

## Acceptance Criteria
- Runtime position lifetime closes eligible stale `OPEN` + `IN_SYNC`
  positions.
- Runtime position lifetime ignores stale `OPEN` + `ORPHAN_LOCAL` rows.
- Existing mark-price fail-closed behavior remains unchanged.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this slice.
- [x] Focused lifetime tests pass.
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
  - `pnpm --filter api run test -- src/modules/engine/runtimePositionLifetime.service.test.ts --run` PASS (`4/4`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks: diff review confirmed only the default stale-position scanner
  predicate changed, adding `syncState=IN_SYNC`.
- Screenshots/logs: not applicable
- High-risk checks: regression used the real default Prisma scanner and proved
  stale `ORPHAN_LOCAL` rows do not trigger close orchestration.

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
- Rollback note: revert this commit to restore previous lifetime scan predicate
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: default position lifetime scanner selected `OPEN` positions without
  checking `syncState`.
- Gaps: stale local rows could reach runtime close orchestration.
- Inconsistencies: lifetime automation disagreed with dashboard/runtime
  active-position truth.
- Architecture constraints: automated runtime management should target only
  canonical `IN_SYNC` active positions.

### 2. Select One Priority Task
- Selected task: scope runtime position lifetime scanner to synced open
  positions.
- Priority rationale: this is a money-impacting automated close path and
  therefore a high-value TESTER slice.
- Why other candidates were deferred: scan loop target discovery and
  automation list reads remain candidates, but lifetime close is a clearer
  write-side risk.

### 3. Plan Implementation
- Files or surfaces to modify: lifetime service, focused lifetime test, and
  planning/context docs.
- Logic: add `syncState=IN_SYNC` to the real default query.
- Edge cases: `ORPHAN_LOCAL` stale rows ignored; synced stale rows still close;
  mark-price unavailable still blocks close.

### 4. Execute Implementation
- Implementation notes: added `syncState=IN_SYNC` to the default lifetime
  scanner and covered it with a DB-backed regression.

### 5. Verify and Test
- Validation performed: focused lifetime suite, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: mock-only coverage was rejected because the risk
  was in the default Prisma query.
- Technical debt introduced: no
- Scalability assessment: enum equality narrows the existing user/bot/status
  scan.
- Refinements made: avoided global DB cleanup in the unit test to prevent FK
  collisions with other persisted fixtures.

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
This is a predicate alignment, not a behavior expansion.

## Production-Grade Required Contract
- Goal: scope runtime position lifetime to synced open positions.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: listed above.
- Result Report: pending.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: mark-price fail-closed test remains
- Refresh/restart behavior verified: default Prisma scanner regression
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading and bot runtime data
- Trust boundaries: runtime worker and database
- Permission or ownership checks: scanner remains scoped by `userId` and
  `botId`
- Abuse cases: stale local rows must not trigger automated close actions
- Secret handling: no secret changes
- Security tests or scans: focused tests plus typecheck/lint
- Fail-closed behavior: mark-price unavailable still prevents close
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
- Task summary: runtime position lifetime scanning now targets only synced
  open positions.
- Files changed:
  - `apps/api/src/modules/engine/runtimePositionLifetime.service.ts`
  - `apps/api/src/modules/engine/runtimePositionLifetime.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/runtime-audit-100-position-lifetime-sync-state-task-2026-05-04.md`
- How tested: focused lifetime suite (`4/4`), API typecheck, repository
  guardrails, lint, and diff check all passed.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue the next tiny runtime/dashboard active-truth audit
  slice.
- Decisions made: DB-backed default scanner regression is required because the
  bug was in the real Prisma predicate.
