# Task

## Header
- ID: RUNTIME-AUDIT-102
- Title: Scope runtime scan watchdog targets to synced open positions
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-101
- Priority: P2
- Iteration: 102
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The runtime scan watchdog synthesizes ticker events for symbols derived from
open position ownership contexts when no explicit `RUNTIME_SCAN_SYMBOLS` list
is configured. It still selected all `status=OPEN` positions, while the rest
of the runtime active-position contract now requires `syncState=IN_SYNC`.

## Goal
Prevent stale local `ORPHAN_LOCAL` rows from becoming runtime scan watchdog
targets.

## Scope
- `apps/api/src/modules/engine/runtimeScanLoop.service.ts`
- `apps/api/src/modules/engine/runtimeScanLoop.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- This task document

## Success Signal
- User or operator problem: stale local positions should not cause needless
  runtime ticker processing or misleading runtime noise.
- Expected product or reliability outcome: watchdog target discovery follows
  the same active-position truth as runtime automation and dashboard.
- How success will be observed: regression proves default scan target listing
  includes synced open rows and excludes stale local open rows.
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
1. Extract the default DB-backed watchdog target listing into a named export.
2. Add `syncState=IN_SYNC` to the default position query.
3. Add a regression using real Prisma rows with one synced and one stale local
   open position.
4. Run focused runtime scan tests plus API typecheck, guardrails, lint, and
   diff check.
5. Update task board, project state, and planning docs.
6. Create one small commit.

## Acceptance Criteria
- Default watchdog target discovery includes supported `OPEN` + `IN_SYNC`
  positions.
- Default watchdog target discovery ignores `OPEN` + `ORPHAN_LOCAL` rows.
- Explicit `RUNTIME_SCAN_SYMBOLS` behavior remains unchanged.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this slice.
- [x] Focused runtime scan tests pass.
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
  - `pnpm --filter api run test -- src/modules/engine/runtimeScanLoop.service.test.ts --run` PASS (`6/6`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks: diff review confirmed default inferred target discovery is
  narrowed with `syncState=IN_SYNC`; explicit env symbols remain unchanged.
- Screenshots/logs: not applicable
- High-risk checks: stale local rows are excluded from inferred watchdog
  target discovery before ticker events are synthesized.

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
- Rollback note: revert this commit to restore previous watchdog target query
- Observability or alerting impact: lowers stale ticker-processing noise
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: default watchdog target listing selected stale local open rows.
- Gaps: scan target discovery did not require `syncState=IN_SYNC`.
- Inconsistencies: watchdog target discovery disagreed with runtime automation
  active-position truth.
- Architecture constraints: default runtime infrastructure should derive from
  canonical synced active positions.

### 2. Select One Priority Task
- Selected task: scope runtime scan watchdog targets to synced open positions.
- Priority rationale: this closes an upstream observability/runtime target
  drift after the action-capable automation path was fixed.
- Why other candidates were deferred: remaining candidates are broader scans;
  this is the smallest confirmed runtime target drift.

### 3. Plan Implementation
- Files or surfaces to modify: runtime scan loop, focused scan test, and
  planning/context docs.
- Logic: default DB-backed target listing filters `OPEN` + `IN_SYNC`.
- Edge cases: explicit env symbols remain operator-owned and unchanged.

### 4. Execute Implementation
- Implementation notes: extracted the default DB-backed target listing into
  `listRuntimeWatchdogScanTargets` and added `syncState=IN_SYNC` to its
  position query.

### 5. Verify and Test
- Validation performed: focused runtime scan suite, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: testing only pure derivation helpers was rejected
  because the drift was in the default DB-backed query.
- Technical debt introduced: no
- Scalability assessment: enum equality narrows the existing open-position
  scan.
- Refinements made: kept env-symbol behavior separate and unchanged.

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
This narrows default target discovery only. Operator-provided scan symbols stay
explicit and are not inferred from position state.

## Production-Grade Required Contract
- Goal: scope runtime scan watchdog targets to synced open positions.
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
- Refresh/restart behavior verified: default scanner regression
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading and runtime data
- Trust boundaries: runtime worker and database
- Permission or ownership checks: target discovery is scoped to position
  contexts, with no secret changes
- Abuse cases: stale local rows should not amplify runtime processing
- Secret handling: no secret changes
- Security tests or scans: focused tests plus typecheck/lint
- Fail-closed behavior: stale rows are excluded from inferred target discovery
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
- Task summary: runtime scan watchdog target discovery now derives inferred
  targets only from synced open supported position contexts.
- Files changed:
  - `apps/api/src/modules/engine/runtimeScanLoop.service.ts`
  - `apps/api/src/modules/engine/runtimeScanLoop.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-102-runtime-scan-watchdog-sync-state-task-2026-05-04.md`
- How tested: focused runtime scan suite (`6/6`), API typecheck, repository
  guardrails, lint, and diff check all passed.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue the next tiny runtime/dashboard active-truth audit
  slice.
- Decisions made: exported default DB-backed target listing to make the
  active-truth predicate directly testable without changing env-symbol
  behavior.
