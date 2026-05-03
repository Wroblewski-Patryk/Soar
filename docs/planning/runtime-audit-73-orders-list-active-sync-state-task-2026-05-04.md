# Task

## Header
- ID: RUNTIME-AUDIT-73
- Title: Align orders list active statuses with sync state
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-70, RUNTIME-AUDIT-71, RUNTIME-AUDIT-72
- Priority: P1
- Iteration: 73
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Recent runtime audit slices made stale open-status `ORPHAN_LOCAL` orders non-active for runtime session reads, paper wallet reset blockers, and order lifetime cancellation. The remaining orders list path still filters by `status` only, so an operator-facing active-order list can show stale local rows as active.

## Goal
Make the orders list active-status filter match the runtime active-order contract: open-status lists should include only `syncState=IN_SYNC` orders, while terminal/history filters remain available.

## Scope
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- This task file and canonical queue/context docs.

## Success Signal
- User or operator problem: dashboard/order surfaces can disagree about stale open orders.
- Expected product or reliability outcome: active order lists reflect the same active truth as runtime, wallet, and lifetime policies.
- How success will be observed: focused regression proves `OPEN + ORPHAN_LOCAL` is excluded from active list results while normal history remains available.
- Post-launch learning needed: no.

## Deliverable For This Stage
A small implementation and regression test for active order list sync-state filtering.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep terminal order history visible

## Definition of Done
- [x] `listOrders` filters active statuses by `syncState=IN_SYNC`.
- [x] Regression test covers stale open-status row exclusion.
- [x] Relevant API validation, guardrails, lint, and diff review pass.
- [x] Canonical planning/context docs are synchronized.

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
- Tests: `pnpm --filter api run test -- src/modules/orders/orders.service.test.ts --run` => PASS (`29/29`); `pnpm --filter api run typecheck` => PASS; `pnpm run quality:guardrails` => PASS; `pnpm run lint` => PASS.
- Manual checks: `git diff --check` => PASS with line-ending warnings only; code diff reviewed.
- Screenshots/logs: not applicable
- High-risk checks: active open-status list now fails closed to `syncState=IN_SYNC`; terminal/history list behavior remains available.

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
- Parity evidence: API contract regression

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous status-only list behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: orders list active-status filtering uses `status` only.
- Gaps: stale `ORPHAN_LOCAL` open-status rows can still appear in active order lists.
- Inconsistencies: runtime, wallet reset, and lifetime policies already require `syncState=IN_SYNC` for active open orders.
- Architecture constraints: keep existing Prisma order model and controller contract; do not hide terminal history rows.

### 2. Select One Priority Task
- Selected task: align orders list active statuses with sync-state active truth.
- Priority rationale: this is an operator-visible dashboard/API drift in position/order management.
- Why other candidates were deferred: broader production smoke and unrelated runtime paths are larger than one tiny reversible slice.

### 3. Plan Implementation
- Files or surfaces to modify: `orders.service.ts`, `orders.service.test.ts`, canonical docs.
- Logic: add an active order status set and add `syncState=IN_SYNC` only when the requested status is `PENDING`, `OPEN`, or `PARTIALLY_FILLED`.
- Edge cases: terminal status filters should still return stale/historical rows; unfiltered list remains history-capable.

### 4. Execute Implementation
- Implementation notes: added a small active-status set in `orders.service.ts` and applies `syncState=IN_SYNC` only when a requested status is `PENDING`, `OPEN`, or `PARTIALLY_FILLED`.

### 5. Verify and Test
- Validation performed: focused orders service suite, API typecheck, repository guardrails, lint, diff check, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filtering every list response by `IN_SYNC`, rejected because it would hide terminal/history rows.
- Technical debt introduced: no
- Scalability assessment: small Prisma filter extension on indexed owner/status path.
- Refinements made: kept the filter status-scoped instead of global to preserve historical order access.

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
Risk is limited to active-status order listing. Terminal order history remains intentionally unchanged.

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
- Add active-status helper in `orders.service.ts`.
- Apply `syncState=IN_SYNC` only to active status filters.
- Add focused service regression for stale open order exclusion.
- Run focused API test, API typecheck, guardrails, lint, and diff review.
- Sync canonical docs and commit if green.

## Acceptance Criteria
- `listOrders(user, { status: OPEN })` excludes `ORPHAN_LOCAL` orders.
- `listOrders(user, { status: OPEN })` still returns `IN_SYNC` open orders.
- Unfiltered order history remains unaffected.
- Validation evidence is recorded.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: persistence query regression
- Regression check performed: `orders.service.test.ts` locks stale open-status exclusion and history preservation.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Soar dashboard/live-paper bot operator
- Existing workaround or pain: stale active order rows can require manual interpretation.
- Smallest useful slice: active-status list query filter.
- Success metric or signal: focused regression and green validation pack.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: inspect active bot/order management state.
- SLI: not applicable for this query-only fix.
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
- Trust boundaries: authenticated user-owned DB query
- Permission or ownership checks: existing `userId` filter preserved
- Abuse cases: no cross-user expansion; no secret exposure
- Secret handling: none
- Security tests or scans: ownership tests in existing suite remain available
- Fail-closed behavior: stale open-status orders excluded from active views
- Residual risk: none expected

## Result Report

- Task summary: active order list filtering now excludes stale local rows by requiring `syncState=IN_SYNC` for active statuses.
- Files changed: `apps/api/src/modules/orders/orders.service.ts`, `apps/api/src/modules/orders/orders.service.test.ts`, canonical planning/context docs.
- How tested: `orders.service.test.ts` (`29/29`), API typecheck, guardrails, lint, diff check.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue runtime/dashboard drift audit with the next smallest query or lifecycle surface.
- Decisions made: do not globally hide stale rows from unfiltered order history; only active status filters get the sync-state constraint.
