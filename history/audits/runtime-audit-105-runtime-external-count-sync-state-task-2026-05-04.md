# Task

## Header
- ID: RUNTIME-AUDIT-105
- Title: Scope runtime owned external position count to synced rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-104
- Priority: P1
- Iteration: 105
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime signal guardrails use bot open-position counts for caps and no-flip
style decisions. Direct bot-scoped counts already follow the active truth
contract, but the LIVE owned imported fallback count still selected `OPEN`
exchange-synced rows without `syncState=IN_SYNC`.

## Goal
Ensure stale `ORPHAN_LOCAL` imported LIVE position rows cannot inflate runtime
open-position counts for a bot.

## Scope
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: bot runtime should not skip PAPER/LIVE openings
  because stale imported rows are counted as active positions.
- Expected product or reliability outcome: runtime caps reflect dashboard
  active truth for LIVE owned imported positions.
- How success will be observed: focused tests assert the fallback query includes
  `syncState=IN_SYNC`.
- Post-launch learning needed: no

## Deliverable For This Stage
Add the missing active-truth predicate, update regression expectations, run
focused and baseline validations, and update source-of-truth files.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `syncState: IN_SYNC` to the owned imported LIVE fallback count query.
2. Update existing focused tests to assert the predicate.
3. Run focused runtime defaults tests plus typecheck, guardrails, lint, and
   diff check.
4. Update task board, project state, and MVP planning queue.

## Acceptance Criteria
- Direct counts remain unchanged.
- LIVE owned imported fallback count includes `syncState=IN_SYNC`.
- Stale imported rows cannot inflate bot open-position counts.
- No architecture mismatch or workaround is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed for applicable expectations.
- [x] Focused regression tests pass.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Source-of-truth docs are updated with evidence.

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
  - PASS `pnpm --filter api run test -- src/modules/engine/runtimeSignalLoopDefaults.test.ts --run` (`10/10`)
  - PASS `pnpm --filter api run typecheck`
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run lint`
  - PASS `git diff --check`
- Manual checks: reviewed fallback imported-position count predicate and test expectations
- Screenshots/logs: not applicable
- High-risk checks: fail-closed runtime cap active-truth regression PASS

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous fallback count scope
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: owned imported LIVE fallback count selected `OPEN` rows without
  `syncState=IN_SYNC`.
- Gaps: runtime caps could diverge from dashboard/list active truth.
- Inconsistencies: direct count path is already active-sync scoped.
- Architecture constraints: runtime guardrails must still pass lifecycle and
  ownership checks after signal merge.

### 2. Select One Priority Task
- Selected task: RUNTIME-AUDIT-105 runtime fallback count sync-state guard.
- Priority rationale: stale active counts can block expected bot openings.
- Why other candidates were deferred: repair/rebind paths intentionally keep
  recoverable `DRIFT` visible and need separate evidence if changed.

### 3. Plan Implementation
- Files or surfaces to modify: runtime signal defaults, focused test, planning
  and context docs.
- Logic: add `syncState=IN_SYNC` to the fallback count query.
- Edge cases: wallet API-key and bot API-key fallback queries both retain
  existing ownership and market prefix scoping.

### 4. Execute Implementation
- Implementation notes: added `syncState: IN_SYNC` to the owned imported LIVE
  fallback count query and updated the bot-key and wallet-key test expectations
  to assert the active-truth predicate.

### 5. Verify and Test
- Validation performed: focused runtime defaults tests, API typecheck,
  guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: leave count as broad ownership truth; rejected
  because dashboard/runtime active rows already use `IN_SYNC`.
- Technical debt introduced: no
- Scalability assessment: keeps count contract aligned with existing repository
  helper path.
- Refinements made: kept scope to one fallback count query and existing tests.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP next commits queue, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable

## Review Checklist (mandatory)
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
Assumption: active runtime cap truth should match dashboard active position
truth: `OPEN + IN_SYNC`.

## Production-Grade Required Contract

Runtime tasks must be delivered through logic, DB predicate, validation, and
test evidence. Partial implementations and hidden bypasses are forbidden.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: paper/live bot runtime operator
- Existing workaround or pain: stale rows can make the bot appear blocked from
  opening despite active dashboard truth being empty
- Smallest useful slice: fallback count predicate
- Success metric or signal: fallback query excludes stale rows by predicate
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: runtime signal loop open-position cap guard
- SLI: cap count reflects active synced positions
- SLO: stale imported rows do not contribute to runtime cap count
- Error budget posture: healthy
- Health/readiness check: not impacted
- Logs, dashboard, or alert route: existing runtime events remain
- Smoke command or manual smoke: focused runtime defaults tests
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: PASS

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading lifecycle data
- Trust boundaries: user-owned bot/wallet/position rows
- Permission or ownership checks: existing `userId`, wallet, api-key, and owner
  predicates preserved
- Abuse cases: stale imported row should not block bot runtime cap
- Secret handling: no secret changes
- Security tests or scans: focused regression and lint/typecheck
- Fail-closed behavior: count predicate requires `IN_SYNC`
- Residual risk: low

## Result Report

- Task summary: LIVE owned imported fallback open-position counts now require
  `OPEN + IN_SYNC`.
- Files changed:
  - `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
  - `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-105-runtime-external-count-sync-state-task-2026-05-04.md`
- How tested: focused runtime defaults suite, API typecheck, guardrails, lint,
  and diff check all passed.
- What is incomplete: nothing for this slice.
- Next steps: continue auditing remaining dashboard/runtime read paths and
  position repair/rebind behavior for evidence-backed drift.
- Decisions made: keep ownership and market-prefix logic unchanged; only add
  the active synced-row predicate.
