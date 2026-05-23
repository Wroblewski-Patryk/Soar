# Task

## Header
- ID: RUNTIME-AUDIT-75
- Title: Require synced position state for runtime manual close
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-70, RUNTIME-AUDIT-74
- Priority: P1
- Iteration: 75
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime order surfaces now require `syncState=IN_SYNC` for active order truth. The runtime manual close-position command still fetches open positions by `status=OPEN` without requiring active sync state, so stale local position rows can reach close orchestration.

## Goal
Make dashboard/runtime manual position close fail closed unless the selected position is an active `IN_SYNC` open position.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
- This task file and canonical queue/context docs.

## Success Signal
- User or operator problem: stale positions may still be actionable through runtime close even when runtime truth should ignore them.
- Expected product or reliability outcome: runtime manual close action matches active position truth.
- How success will be observed: regression proves `OPEN + ORPHAN_LOCAL` positions return `no_open_position` and do not call close orchestration.
- Post-launch learning needed: no.

## Deliverable For This Stage
A fail-closed sync-state guard and focused regression for runtime manual position close.

## Constraints
- use existing runtime position command service
- do not add new close-position APIs
- preserve already-closed idempotent response behavior
- do not add temporary bypasses

## Definition of Done
- [x] Runtime manual close fetch requires `syncState=IN_SYNC`.
- [x] Ownership-claim update keeps the same active sync-state guard.
- [x] Regression covers stale open-position close rejection.
- [x] Relevant validations pass and docs are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated close-position orchestration
- temporary bypasses
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: `pnpm --filter api run test -- src/modules/bots/runtimeSessionPositionCommand.service.test.ts --run` => PASS (`10/10`); `pnpm --filter api run typecheck` => PASS; `pnpm run quality:guardrails` => PASS; `pnpm run lint` => PASS.
- Manual checks: `git diff --check` => PASS with line-ending warnings only; code diff reviewed.
- Screenshots/logs: not applicable
- High-risk checks: stale open-position rows now fail closed before close orchestration.

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
- Rollback note: revert this commit to restore previous status-only runtime close lookup.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime close-position command filters by `status=OPEN` without `syncState=IN_SYNC`.
- Gaps: stale `ORPHAN_LOCAL` open-position rows can reach manual close orchestration.
- Inconsistencies: runtime/dashboard order active truth now requires synced state, but close-position action does not.
- Architecture constraints: keep command service ownership and existing `no_open_position` fail-closed response.

### 2. Select One Priority Task
- Selected task: require synced position state for runtime manual close.
- Priority rationale: money-impacting close action should be stricter than read-only displays.
- Why other candidates were deferred: position list/read surfaces need separate review; this action guard is a small high-risk slice.

### 3. Plan Implementation
- Files or surfaces to modify: runtime position command service/test and canonical docs.
- Logic: add `syncState=IN_SYNC` to open-position lookup and ownership-claim update guard.
- Edge cases: already-closed idempotent response remains unchanged; stale rows return `ignored/no_open_position`.

### 4. Execute Implementation
- Implementation notes: added `syncState=IN_SYNC` to runtime close open-position lookup and ownership-claim update guard.

### 5. Verify and Test
- Validation performed: focused runtime command test, API typecheck, repository guardrails, lint, diff check, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: checking sync state after fetch; query-level fail-closed filtering is cleaner and avoids exposing stale rows to later logic.
- Technical debt introduced: no
- Scalability assessment: additional enum predicate on single-position owner lookup.
- Refinements made: preserved the existing `ignored/no_open_position` response instead of adding a new public error branch.

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
This task intentionally guards runtime manual close only. Broader position read/list surfacing remains a separate audit candidate.

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
- Add `syncState=IN_SYNC` to runtime close open-position lookup.
- Add the same guard to ownership-claim updateMany.
- Add focused service regression for stale open-position close rejection.
- Run focused runtime command test, API typecheck, guardrails, lint, and diff review.
- Sync canonical docs and commit if green.

## Acceptance Criteria
- Stale `OPEN + ORPHAN_LOCAL` positions cannot trigger runtime close orchestration.
- Active `IN_SYNC` owned and imported close tests remain green.
- Existing idempotent already-closed response behavior remains unchanged.
- Validation evidence is recorded.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: existing ignored/no-open-position response
- Refresh/restart behavior verified: service regression
- Regression check performed: `runtimeSessionPositionCommand.service.test.ts` covers stale open-position close rejection.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Soar dashboard/live-paper bot operator
- Existing workaround or pain: stale position rows can look actionable through direct runtime close.
- Smallest useful slice: runtime command lookup guard.
- Success metric or signal: focused regression and green validation pack.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: manual close of bot-managed runtime position.
- SLI: not applicable for this command guard.
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
- Data classification: user trading position/order records
- Trust boundaries: authenticated user-owned runtime command
- Permission or ownership checks: existing session/bot/user checks preserved
- Abuse cases: direct API close of stale local position row
- Secret handling: none
- Security tests or scans: focused service regression plus existing ownership tests
- Fail-closed behavior: stale open-position rows are ignored as no open position
- Residual risk: none expected

## Result Report

- Task summary: runtime manual close-position command now requires active `syncState=IN_SYNC` position truth.
- Files changed: `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`, `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`, canonical planning/context docs.
- How tested: runtime position command service test (`10/10`), API typecheck, guardrails, lint, diff check.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue runtime/dashboard drift audit with the next smallest position read/list or lifecycle surface.
- Decisions made: stale open-position rows return the existing `ignored/no_open_position` outcome rather than a new public error.
