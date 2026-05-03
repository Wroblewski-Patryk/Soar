# Task

## Header
- ID: RUNTIME-AUDIT-74
- Title: Require active sync state for manual order actions
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-70, RUNTIME-AUDIT-73
- Priority: P1
- Iteration: 74
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime, order lifetime, wallet reset, and order-list active views now treat open-status orders as active only when `syncState=IN_SYNC`. Manual order actions still check only status, so an `ORPHAN_LOCAL` open-status row could be canceled or closed even though it is no longer active operational truth.

## Goal
Make manual order cancel/close actions fail closed unless the order is still active and `syncState=IN_SYNC`.

## Scope
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- This task file and canonical queue/context docs.

## Success Signal
- User or operator problem: stale order rows can still accept lifecycle actions after they are hidden from active runtime truth.
- Expected product or reliability outcome: manual order actions match dashboard/runtime active truth.
- How success will be observed: regression tests prove stale open-status rows are not cancelable or closable.
- Post-launch learning needed: no.

## Deliverable For This Stage
A focused fail-closed guard and tests for stale open-status order actions.

## Constraints
- use existing order lifecycle service and errors
- do not add new API contracts
- do not hide historical rows
- preserve existing risk-ack behavior

## Definition of Done
- [x] `cancelOrder` rejects `OPEN + ORPHAN_LOCAL` rows.
- [x] `closeOrder` rejects `OPEN + ORPHAN_LOCAL` rows.
- [x] Existing `IN_SYNC` cancel/close behavior remains intact.
- [x] Relevant validations pass and docs are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated lifecycle paths
- temporary bypasses
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: `pnpm --filter api run test -- src/modules/orders/orders.service.test.ts --run` => PASS (`31/31`); `pnpm --filter api run typecheck` => PASS; `pnpm run quality:guardrails` => PASS; `pnpm run lint` => PASS.
- Manual checks: `git diff --check` => PASS with line-ending warnings only; code diff reviewed.
- Screenshots/logs: not applicable
- High-risk checks: stale open-status order cancel/close now fails closed before mutation.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`, `docs/governance/autonomous-engineering-loop.md`, `DEFINITION_OF_DONE.md`, `INTEGRATION_CHECKLIST.md`, `NO_TEMPORARY_SOLUTIONS.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence (required for UX tasks)
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: not applicable
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: not applicable
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: API service regression

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous status-only manual action behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual cancel/close actions check order status but not active sync state.
- Gaps: stale `ORPHAN_LOCAL` open-status rows can still accept lifecycle mutations.
- Inconsistencies: runtime/order-list active truth already requires `syncState=IN_SYNC`.
- Architecture constraints: keep existing order service ownership and existing errors.

### 2. Select One Priority Task
- Selected task: require active sync state for manual order actions.
- Priority rationale: action paths are money-impacting and should not mutate stale local records as if they were active.
- Why other candidates were deferred: broader dashboard/API audits are larger than this single reversible slice.

### 3. Plan Implementation
- Files or surfaces to modify: `orders.service.ts`, `orders.service.test.ts`, canonical docs.
- Logic: reject manual cancel/close when the row is not `syncState=IN_SYNC`.
- Edge cases: risk-ack validation remains unchanged; terminal status behavior remains unchanged.

### 4. Execute Implementation
- Implementation notes: `cancelOrder` and `closeOrder` now reject non-`IN_SYNC` rows with existing order action domain errors.

### 5. Verify and Test
- Validation performed: focused orders service suite, API typecheck, repository guardrails, lint, diff check, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only hiding stale orders from the UI; rejected because direct API actions would remain possible.
- Technical debt introduced: no
- Scalability assessment: constant-time row guard after existing owner fetch.
- Refinements made: reused existing `orderNotCancelable` / `orderNotClosable` errors to avoid a new parallel error contract.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, `docs/planning/mvp-next-commits.md`, `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

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
This is intentionally limited to manual order action guards; runtime lifecycle candidates were handled in earlier slices.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY` or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB -> validation -> error handling -> test. Partial implementations, mock-only paths, placeholders, fake data, and temporary fixes are forbidden.

## Implementation Plan
- Add `syncState=IN_SYNC` guard to cancel and close action eligibility.
- Add focused service regressions for stale open-status cancel and close rejection.
- Run focused orders test, API typecheck, guardrails, lint, and diff review.
- Sync canonical docs and commit if green.

## Acceptance Criteria
- `cancelOrder` rejects stale open-status rows.
- `closeOrder` rejects stale open-status rows.
- Existing synced open order cancel/close tests still pass.
- Validation evidence is recorded.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: existing order domain errors
- Refresh/restart behavior verified: DB-backed service regression
- Regression check performed: `orders.service.test.ts` covers stale cancel and stale close rejection.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Soar dashboard/live-paper bot operator
- Existing workaround or pain: stale action rows can require manual interpretation and can be mutated accidentally.
- Smallest useful slice: fail-closed service guard.
- Success metric or signal: focused regression and green validation pack.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: manual order management.
- SLI: not applicable for this query/action guard.
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not impacted
- Logs, dashboard, or alert route: not impacted
- Smoke command or manual smoke: focused API regression
- Rollback or disable path: revert commit

## AI Testing Evidence (required for AI features)
- Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user trading records
- Trust boundaries: authenticated user-owned DB action
- Permission or ownership checks: existing `userId` fetch preserved
- Abuse cases: direct API mutation of stale local row
- Secret handling: none
- Security tests or scans: focused service regression plus existing ownership tests
- Fail-closed behavior: stale open-status orders reject manual actions
- Residual risk: none expected

## Result Report

- Task summary: manual order cancel/close now require active `syncState=IN_SYNC` truth.
- Files changed: `apps/api/src/modules/orders/orders.service.ts`, `apps/api/src/modules/orders/orders.service.test.ts`, canonical planning/context docs.
- How tested: `orders.service.test.ts` (`31/31`), API typecheck, guardrails, lint, diff check.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue runtime/dashboard drift audit with the next smallest lifecycle/query surface.
- Decisions made: reuse existing action rejection errors instead of adding a new public API error code for stale local rows.
