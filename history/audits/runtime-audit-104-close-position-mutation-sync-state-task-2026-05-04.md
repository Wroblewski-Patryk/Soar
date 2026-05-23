# Task

## Header
- ID: RUNTIME-AUDIT-104
- Title: Fail closed stale linked position close mutations
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-103
- Priority: P1
- Iteration: 104
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime and manual order close paths must only mutate active-truth positions.
The approved active position contract is `status=OPEN` plus
`syncState=IN_SYNC`. Earlier slices aligned reads, automation, lifetime scans,
dedupe, and reconciliation with this contract. Two close mutations still used
only `id + userId + status=OPEN`, leaving a narrow stale-row mutation risk.

## Goal
Ensure manual order close and runtime execution close mutations never close a
linked `ORPHAN_LOCAL` position.

## Scope
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: stale local position rows must not affect dashboard
  or bot lifecycle truth.
- Expected product or reliability outcome: close actions mutate only synced
  active positions.
- How success will be observed: regression test proves an `IN_SYNC` order
  linked to an `ORPHAN_LOCAL` position does not close the stale position.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement the fail-closed mutation guard, add focused regression coverage, run
relevant validations, and update source-of-truth planning/context files.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `syncState: IN_SYNC` to manual linked-position close mutation.
2. Add `syncState: IN_SYNC` to runtime default position gateway close mutation.
3. Add focused order service regression coverage for an active order linked to
   an `ORPHAN_LOCAL` position.
4. Run focused tests, API typecheck, guardrails, lint, and diff check.
5. Update task board, project state, and MVP planning queue.

## Acceptance Criteria
- Manual close can still close synced linked positions.
- Manual close does not close linked `ORPHAN_LOCAL` positions.
- Runtime default close gateway cannot close stale local positions.
- No architecture mismatch or workaround is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed for applicable expectations.
- [x] Focused regression test passes.
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
  - PASS `pnpm --filter api run test -- src/modules/orders/orders.service.test.ts --run` (`35/35`)
  - PASS `pnpm --filter api run test -- src/modules/engine/executionOrchestrator.service.test.ts --run` (`17/17`)
  - PASS `pnpm --filter api run typecheck`
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run lint`
  - PASS `git diff --check`
- Manual checks: reviewed close mutation predicates and focused regression diff
- Screenshots/logs: not applicable
- High-risk checks: fail-closed stale linked position mutation regression PASS

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
- Rollback note: revert this commit to restore previous close mutation scope
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: close mutations used `status=OPEN` without `syncState=IN_SYNC`.
- Gaps: one mutation guard was missing after read paths had been aligned.
- Inconsistencies: active-truth reads and automation excluded `ORPHAN_LOCAL`,
  but close updates could still touch a linked stale row by id.
- Architecture constraints: active runtime truth is `OPEN + IN_SYNC`.

### 2. Select One Priority Task
- Selected task: RUNTIME-AUDIT-104 close mutation sync-state guard.
- Priority rationale: money-impacting lifecycle mutation must fail closed.
- Why other candidates were deferred: repair/rebind `DRIFT` handling is
  intentional recovery scope and needs a separate evidence-backed slice.

### 3. Plan Implementation
- Files or surfaces to modify: order close service, runtime default close
  gateway, focused test, planning/context docs.
- Logic: add `syncState=IN_SYNC` to updateMany close predicates.
- Edge cases: preserve successful synced close; ignore stale linked rows.

### 4. Execute Implementation
- Implementation notes: added `syncState: IN_SYNC` to manual order close
  linked-position mutation and runtime execution default close mutation. Added
  regression coverage for an `IN_SYNC` order linked to an `ORPHAN_LOCAL`
  position.

### 5. Verify and Test
- Validation performed: focused order service and execution orchestrator suites,
  API typecheck, guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: only patch manual close; rejected because runtime
  default gateway had the same mutation contract gap.
- Technical debt introduced: no
- Scalability assessment: keeps mutation truth aligned with existing query
  contract.
- Refinements made: kept scope to mutation predicates and one focused
  regression test.

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
Assumption: `ORPHAN_LOCAL` rows are non-actionable active-truth rows even when a
valid order still links to them; reconciliation/repair is the only path that may
recover or clean them.

## Production-Grade Required Contract

Runtime tasks must be delivered as a vertical slice across service logic, DB
mutation predicates, error handling/fail-closed behavior, and tests.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard and bot lifecycle operators
- Existing workaround or pain: stale local rows can create dashboard/runtime
  discrepancies
- Smallest useful slice: close mutation fail-closed guard
- Success metric or signal: stale linked position remains open/orphaned after
  close request
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot/manual position lifecycle close
- SLI: close mutation affects only active synced positions
- SLO: all stale linked close attempts fail closed
- Error budget posture: healthy
- Health/readiness check: not impacted
- Logs, dashboard, or alert route: existing order audit remains
- Smoke command or manual smoke: focused API tests
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: yes
- Refresh/restart behavior verified: not applicable
- Regression check performed: PASS

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading lifecycle data
- Trust boundaries: user-owned order/position rows
- Permission or ownership checks: existing `userId` predicates preserved
- Abuse cases: stale local row linked by id should not be closable
- Secret handling: no secret changes
- Security tests or scans: focused regression and lint/typecheck
- Fail-closed behavior: mutation predicate requires `IN_SYNC`
- Residual risk: low

## Result Report

- Task summary: Manual order close and runtime execution default close
  mutations now require linked positions to be `OPEN + IN_SYNC`.
- Files changed:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-104-close-position-mutation-sync-state-task-2026-05-04.md`
- How tested: focused service suites, API typecheck, guardrails, lint, and
  diff check all passed.
- What is incomplete: nothing for this slice.
- Next steps: continue auditing remaining position repair/rebind and dashboard
  read paths for evidence-backed active-truth drift.
- Decisions made: preserve recoverable `DRIFT` handling elsewhere; only close
  mutations are narrowed to actionable `IN_SYNC` positions.
