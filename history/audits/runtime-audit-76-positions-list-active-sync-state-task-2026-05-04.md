# Task

## Header
- ID: RUNTIME-AUDIT-76
- Title: Align positions list active status with sync state
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-75
- Priority: P1
- Iteration: 76
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime manual close now ignores stale open-position rows unless `syncState=IN_SYNC`, but the generic positions list still filters by `status` only. This can make `GET /dashboard/positions?status=OPEN` show stale `ORPHAN_LOCAL` rows as open even though runtime action paths treat them as inactive.

## Goal
Make active position list filtering match runtime active-position truth while preserving unfiltered history access.

## Scope
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/positions/positions.list.e2e.test.ts`
- This task file and canonical queue/context docs.

## Success Signal
- User or operator problem: dashboard positions list can show stale rows as active.
- Expected product or reliability outcome: active position list truth matches runtime close/action truth.
- How success will be observed: e2e regression proves `OPEN + ORPHAN_LOCAL` is excluded from `status=OPEN` list while unfiltered history remains visible.
- Post-launch learning needed: no.

## Deliverable For This Stage
A small positions-list filter fix plus a focused API regression.

## Constraints
- use existing positions service and route contract
- do not add new query parameters
- do not hide unfiltered historical records
- do not introduce temporary compatibility paths

## Definition of Done
- [x] `listPositions` filters active `OPEN` status by `syncState=IN_SYNC`.
- [x] Regression covers stale open-position exclusion.
- [x] Unfiltered positions history remains visible.
- [x] Relevant validations pass and docs are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated list implementations
- temporary bypasses
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: `pnpm --filter api run test -- src/modules/positions/positions.list.e2e.test.ts --run` => PASS (`2/2`); `pnpm --filter api run typecheck` => PASS; `pnpm run quality:guardrails` => PASS; `pnpm run lint` => PASS.
- Manual checks: `git diff --check` => PASS with line-ending warnings only; code diff reviewed.
- Screenshots/logs: not applicable
- High-risk checks: stale open-position rows are excluded only from active status list, not hidden from unfiltered history.

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
- Parity evidence: API e2e regression

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous status-only positions list behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `listPositions` filters active status by `status=OPEN` only.
- Gaps: stale `ORPHAN_LOCAL` open-position rows can appear in active dashboard/API list truth.
- Inconsistencies: runtime close action requires `syncState=IN_SYNC`.
- Architecture constraints: preserve existing positions list route and unfiltered history behavior.

### 2. Select One Priority Task
- Selected task: align positions list active status with sync state.
- Priority rationale: it is operator-visible and directly connected to runtime action truth.
- Why other candidates were deferred: takeover/repair surfaces require separate semantics; this list fix is the smallest reversible slice.

### 3. Plan Implementation
- Files or surfaces to modify: positions service, positions list e2e, canonical docs.
- Logic: add `syncState=IN_SYNC` only when `query.status` is `OPEN`.
- Edge cases: `CLOSED` filters and unfiltered history must remain available.

### 4. Execute Implementation
- Implementation notes: added `syncState=IN_SYNC` to `listPositions` only when `query.status === 'OPEN'`.

### 5. Verify and Test
- Validation performed: focused positions list e2e, API typecheck, repository guardrails, lint, diff check, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: globally filtering all position lists by `IN_SYNC`; rejected because it would hide audit/history rows.
- Technical debt introduced: no
- Scalability assessment: small enum predicate on existing user/status query.
- Refinements made: preserved unfiltered history and terminal status behavior.

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
This task intentionally updates the generic positions list only. Runtime read-model lists already have richer ownership and display rules.

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
- Add `syncState=IN_SYNC` to `listPositions` only for `status=OPEN`.
- Add focused e2e regression for active status filtering and unfiltered history preservation.
- Run focused e2e, API typecheck, guardrails, lint, and diff review.
- Sync canonical docs and commit if green.

## Acceptance Criteria
- `GET /dashboard/positions?status=OPEN` excludes `ORPHAN_LOCAL` rows.
- The same endpoint still returns `IN_SYNC` open rows.
- `GET /dashboard/positions` remains history-capable and can include stale rows.
- Validation evidence is recorded.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: DB-backed e2e regression
- Regression check performed: `positions.list.e2e.test.ts` covers stale open-position exclusion and history preservation.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Soar dashboard/live-paper bot operator
- Existing workaround or pain: stale active positions can require manual interpretation.
- Smallest useful slice: active-status list query filter.
- Success metric or signal: focused regression and green validation pack.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: inspect active positions.
- SLI: not applicable for this query fix.
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not impacted
- Logs, dashboard, or alert route: not impacted
- Smoke command or manual smoke: focused API e2e
- Rollback or disable path: revert commit

## AI Testing Evidence (required for AI features)
- Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user trading position records
- Trust boundaries: authenticated user-owned DB query
- Permission or ownership checks: existing `userId` filter preserved
- Abuse cases: no cross-user expansion; stale rows excluded only from active filter
- Secret handling: none
- Security tests or scans: focused e2e plus existing owner tests
- Fail-closed behavior: stale open-status positions excluded from active list
- Residual risk: none expected

## Result Report

- Task summary: positions list active `OPEN` filter now requires `syncState=IN_SYNC`.
- Files changed: `apps/api/src/modules/positions/positions.service.ts`, `apps/api/src/modules/positions/positions.list.e2e.test.ts`, canonical planning/context docs.
- How tested: positions list e2e (`2/2`), API typecheck, guardrails, lint, diff check.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue runtime/dashboard drift audit with takeover/repair or position action surfaces.
- Decisions made: do not globally hide stale position rows from unfiltered history.
