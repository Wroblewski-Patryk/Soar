# Task

## Header
- ID: V1-LIVE-IMPORT-STATUS-ISOLATION-2026-05-07
- Title: Isolate live import diagnostics status by user
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: none
- Priority: P0
- Iteration: 2026-05-07 live import diagnostics slice
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The backend reconciliation loop stores per-symbol live import diagnostics.
`/dashboard/positions/live-status` is an authenticated dashboard route, so it
must not expose diagnostics for other users and must not let another user's
import attempt pollute the operator's own troubleshooting view.

## Goal
Return user-scoped live import diagnostics from the dashboard live-status
endpoint.

## Scope
- `apps/api/src/modules/positions/positions.controller.ts`
- `apps/api/src/modules/positions/positions-live-status.e2e.test.ts`
- Canonical queue/context files required by repository workflow.

## Implementation Plan
1. Add a failing e2e regression that stubs mixed-user loop diagnostics and
   reads the endpoint as one user.
2. Filter `lastPositionDiagnostics` by authenticated `req.user.id`.
3. Recompute `lastDiagnosticSummary` and `openPositionsSeen` from the filtered
   diagnostics.
4. Run focused API tests, API typecheck, guardrails, docs parity, and diff
   check.

## Acceptance Criteria
- [x] Authenticated user sees only their own live import diagnostics.
- [x] Diagnostic summary and open-position count are scoped to the same user.
- [x] No unauthenticated access behavior changes.

## Definition of Done
- [x] Focused API regression covers cross-user diagnostic isolation.
- [x] Existing live-status contract remains authenticated and stable.
- [x] Relevant validation commands pass.
- [x] Canonical task/context docs are updated.

## Forbidden
- exposing global user diagnostics through dashboard routes
- adding a parallel diagnostics endpoint
- hiding diagnostics entirely instead of scoping them correctly
- changing live-money or exchange write behavior

## Validation Evidence
- Tests:
  - Pre-fix regression: `pnpm --filter api exec vitest run src/modules/positions/positions-live-status.e2e.test.ts --run --sequence.concurrent=false` failed because `openPositionsSeen` stayed global (`2`) instead of user-scoped (`1`).
  - Post-fix focused e2e: `pnpm --filter api exec vitest run src/modules/positions/positions-live-status.e2e.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` PASS, `3/3`.
  - Post-fix import diagnostics pack: `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.diagnostics.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions-live-status.e2e.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` PASS, `35/35`.
- Manual checks: reviewed controller route and reconciliation status contract.
- High-risk checks: auth and user-data isolation route

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`,
  `docs/architecture/08_operator-surfaces-and-routing.md`,
  `docs/security/secure-development-lifecycle.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, dashboard live-status returned global diagnostics
- Decision required from user: no, this is a direct user-data isolation fix

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: live-status spreads the global reconciliation loop status directly.
- Gaps: no regression proves per-user diagnostic isolation.
- Inconsistencies: authenticated dashboard routes must be user-scoped.
- Architecture constraints: fail closed for auth-sensitive/user-data flows.

### 2. Select One Priority Task
- Selected task: isolate live import diagnostics by user.
- Priority rationale: auth-sensitive data leak and operator-truth pollution.
- Why other candidates were deferred: production readback still needs
  protected auth; this local backend contract can be fixed now.

### 3. Plan Implementation
- Files or surfaces to modify: controller and e2e test.
- Logic: filter diagnostics by `req.user.id`, recompute summary/count.
- Edge cases: legacy status without diagnostics returns an empty user-scoped
  diagnostic view.

### 4. Execute Implementation
- Implementation notes: `getLiveReconciliationStatus` now filters
  `lastPositionDiagnostics` by authenticated user id and recomputes
  `lastDiagnosticSummary` plus `openPositionsSeen` from the filtered payload.

### 5. Verify and Test
- Validation performed: focused pre-fix failure, focused post-fix e2e, import
  diagnostics/service pack, API typecheck, lint/guardrails/docs parity/diff
  check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: dropping diagnostics from the route entirely, but
  that would remove the operator troubleshooting signal.
- Technical debt introduced: no
- Scalability assessment: filtering is linear over the small last-run
  diagnostic payload.
- Refinements made: kept worker heartbeat and loop health fields global, but
  scoped user-data diagnostics and counts to the authenticated user.

### 7. Update Documentation and Knowledge
- Docs updated: this task, `TASK_BOARD`, `PROJECT_STATE`,
  `mvp-next-commits`, `known-issues`, and `system-health`.
- Context updated: yes
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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

## Result Report
- Task summary: fixed live import status diagnostics so authenticated users
  only see their own reconciliation diagnostics, summary, and counted open
  positions.
- Files changed: `apps/api/src/modules/positions/positions.controller.ts`,
  `apps/api/src/modules/positions/positions-live-status.e2e.test.ts`,
  `.agents/state/known-issues.md`, `.agents/state/system-health.md`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`, and this task file.
- How tested: pre-fix regression failed; post-fix focused e2e and import
  diagnostics pack passed; API typecheck and repository quality gates passed.
- What is incomplete: production authenticated readback remains blocked until
  operator auth/access is available.
- Next steps: deploy through Coolify/manual path and continue `LIVEIMPORT-03`
  authenticated readback or the next locally reproducible runtime defect.
- Decisions made: preserve the existing endpoint and loop status shape while
  scoping user-owned diagnostics.
