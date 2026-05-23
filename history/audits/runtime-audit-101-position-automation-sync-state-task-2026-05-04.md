# Task

## Header
- ID: RUNTIME-AUDIT-101
- Title: Scope runtime position automation to synced open positions
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-100
- Priority: P1
- Iteration: 101
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position automation reacts to ticker events and can execute DCA or
close actions for TP, TTP, SL, and TSL. Its default open-position query still
selected `status=OPEN` rows without requiring `syncState=IN_SYNC`, while the
current active-position contract treats stale local rows as non-active.

## Goal
Prevent runtime position automation from hydrating or acting on stale local
`ORPHAN_LOCAL` open rows.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomationDefaultPositionDeps.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- This task document

## Success Signal
- User or operator problem: stale local positions should not receive DCA,
  trailing stop, trailing take profit, take profit, or stop loss actions.
- Expected product or reliability outcome: ticker-driven position automation
  follows the same active-position truth as dashboard and runtime close paths.
- How success will be observed: focused default-deps test proves the Prisma
  query includes `syncState=IN_SYNC`.
- Post-launch learning needed: no

## Deliverable For This Stage
Apply the query predicate fix, add focused regression evidence, validate,
update source-of-truth docs, and commit.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `syncState=IN_SYNC` to runtime position automation default open-position
   query.
2. Add a focused default-deps regression asserting the query predicate.
3. Run focused runtime automation default deps tests plus API typecheck,
   guardrails, lint, and diff check.
4. Update task board, project state, and planning docs.
5. Create one small commit.

## Acceptance Criteria
- Runtime position automation default deps query only hydrates `OPEN` +
  `IN_SYNC` bot-managed positions.
- Existing imported ownership hydration behavior remains covered.
- No runtime automation service behavior changes beyond narrowing the input
  set to canonical active positions.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this slice.
- [x] Focused automation default-deps tests pass.
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
  - `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts --run` PASS (`1/1`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks: diff review confirmed only the default automation
  open-position query was narrowed with `syncState=IN_SYNC`.
- Screenshots/logs: not applicable
- High-risk checks: stale local rows are excluded before DCA/TP/TTP/SL/TSL
  action evaluation.

## Architecture Evidence
- Architecture source reviewed: AGENTS.md, autonomous engineering loop, active
  runtime audit queue, active position sync-state contract.
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
- Rollback note: revert this commit to restore previous automation query
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: ticker-driven runtime automation could hydrate stale local open
  positions.
- Gaps: default open-position query did not require `syncState=IN_SYNC`.
- Inconsistencies: automation input set disagreed with dashboard and lifetime
  active-position truth.
- Architecture constraints: automated runtime position management should act
  only on canonical synced active positions.

### 2. Select One Priority Task
- Selected task: scope runtime position automation default query to synced open
  positions.
- Priority rationale: this path can produce money-impacting DCA/close actions.
- Why other candidates were deferred: runtime scan target discovery remains a
  candidate, but it only feeds tickers; this slice narrows the action-capable
  automation input.

### 3. Plan Implementation
- Files or surfaces to modify: automation default deps, default deps test, and
  planning/context docs.
- Logic: add `syncState=IN_SYNC` to the Prisma where clause.
- Edge cases: imported `EXCHANGE_SYNC` rows remain eligible only when synced;
  stale local rows are excluded before ownership hydration.

### 4. Execute Implementation
- Implementation notes: added `syncState=IN_SYNC` to the runtime automation
  default Prisma query and asserted it in the existing default-deps regression.

### 5. Verify and Test
- Validation performed: focused automation default-deps test, API typecheck,
  repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: service-level filtering after hydration was
  rejected because stale rows should not enter automation processing.
- Technical debt introduced: no
- Scalability assessment: enum equality narrows the existing symbol/status
  scan.
- Refinements made: reused the existing default-deps regression instead of
  adding a broad service test.

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
This is a predicate alignment on an existing default dependency.

## Production-Grade Required Contract
- Goal: scope runtime position automation to synced open positions.
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
- Error state verified: not applicable
- Refresh/restart behavior verified: default dependency query covered
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading and bot runtime data
- Trust boundaries: runtime worker and database
- Permission or ownership checks: existing query scopes by position ownership
  and active bot ownership hydration
- Abuse cases: stale local rows must not trigger automated trading actions
- Secret handling: no secret changes
- Security tests or scans: focused tests plus typecheck/lint
- Fail-closed behavior: stale rows are excluded before action evaluation
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
- Task summary: runtime position automation default deps now hydrate only
  synced open bot-managed positions.
- Files changed:
  - `apps/api/src/modules/engine/runtimePositionAutomationDefaultPositionDeps.ts`
  - `apps/api/src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-101-position-automation-sync-state-task-2026-05-04.md`
- How tested: focused automation default-deps suite (`1/1`), API typecheck,
  repository guardrails, lint, and diff check all passed.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue the next tiny runtime/dashboard active-truth audit
  slice.
- Decisions made: query-level filtering is preferable because stale rows should
  not enter automation hydration or ownership resolution.
