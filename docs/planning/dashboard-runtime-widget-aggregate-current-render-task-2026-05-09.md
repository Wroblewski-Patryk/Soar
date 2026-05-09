# Dashboard Runtime Widget Aggregate Current Render Task 2026-05-09

## Header
- ID: DASH-RUNTIME-WIDGET-AGGREGATE-CURRENT-RENDER-2026-05-09
- Title: Lock HomeLiveWidgets rendering of aggregate current runtime rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: `DASH-RUNTIME-CURRENT-AGGREGATE-2026-05-09`
- Priority: P1
- Iteration: 2026-05-09-dashboard-runtime-current-render
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is set explicitly for this derived dashboard rendering iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The API aggregate current-state selector now prefers running rows. The dashboard
must continue to render aggregate `positions.openItems` as current open
positions and aggregate `positions.historyItems` as historical closed
positions through the existing `HomeLiveWidgets` data path.

## Goal
Add focused Web coverage proving `HomeLiveWidgets` renders aggregate current
open-position rows for a running bot while completed-session history remains
visible in the history tab.

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.agents/state/next-steps.md`

## Implementation Plan
1. Add a focused aggregate-render regression to `HomeLiveWidgets`.
2. Mock a running bot with both running and completed sessions.
3. Return an aggregate payload with one current open position and one
   historical closed position.
4. Assert the open position renders on the default positions tab and the
   history row renders after switching to history.
5. Run the focused Web test and relevant Web typecheck if practical.

## Acceptance Criteria
- The Web test proves aggregate current rows render on dashboard positions.
- The same test proves aggregate historical rows remain visible.
- Focused Web validation passes.
- Source-of-truth files record the change.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this scoped Web regression.
- [x] Focused Web regression added.
- [x] Relevant Web validation passes.
- [x] No new data source, mock-only product path, or UI workaround introduced.

## Forbidden
- New dashboard service paths.
- Replacing API aggregate behavior with frontend-only reconstruction.
- Cosmetic dashboard changes outside the regression scope.
- Claiming production clickthrough completion without authenticated access.

## Validation Evidence
- Tests:
  - `apps/web/node_modules/.bin/vitest.CMD run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx` => PASS, 3/3.
  - `apps/web/node_modules/.bin/vitest.CMD run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts` => PASS, 41/41.
  - `apps/web/node_modules/.bin/tsc.CMD --noEmit` => PASS.
  - `node scripts/repoGuardrails.mjs` => PASS.
- Manual checks: verified the test exercises the existing aggregate service mock
  and dashboard tab rendering, not a new data path.
- Screenshots/logs: not applicable unless a rendered debug failure appears.
- High-risk checks: no live trading or money-impacting command path touched.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing dashboard `HomeLiveWidgets` behavior and
  table contracts.
- Canonical visual target: existing runtime tabs/table rendering.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable for regression-only task
- Existing shared pattern reused: `HomeLiveWidgets` runtime tabs/tables.
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: no, regression-only
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no, regression-only
- Remaining mismatches: none known
- Required states: success
- Responsive checks: not applicable, no layout change
- Input-mode checks: pointer via tab click
- Accessibility checks: role-based tab lookup
- Parity evidence: focused test asserts tab and table content.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this single regression commit if it blocks Web suite.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: API current-state fix needed a Web regression proving dashboard
  consumes aggregate current rows as rendered current positions.
- Gaps: existing aggregate history tests covered history visibility but not
  combined current-open plus history rendering.
- Inconsistencies: none discovered in component ownership.
- Architecture constraints: use existing aggregate API consumer path only.

### 2. Select One Priority Task
- Selected task: add focused dashboard aggregate current render regression.
- Priority rationale: confirms the user-visible dashboard path after the API
  read-model fix.
- Why other candidates were deferred: production UI clickthrough remains
  blocked on authenticated/admin production access.

### 3. Plan Implementation
- Files or surfaces to modify: one dashboard test plus context docs.
- Logic: mock aggregate payload and assert rendered open/history rows.
- Edge cases: running plus completed sessions present simultaneously.

### 4. Execute Implementation
- Implementation notes: added a focused aggregate current render regression
  with running and completed sessions, an aggregate current open row, and a
  completed-session history row.

### 5. Verify and Test
- Validation performed: focused Web test, broader dashboard-home focused pack,
  Web typecheck, repository guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: relying only on API helper tests; rejected because
  the user concern is dashboard data visibility.
- Technical debt introduced: no
- Scalability assessment: focused regression extends existing aggregate
  history test surface without new harnesses.
- Refinements made: adjusted the open-symbol assertion to accept multiple
  legitimate UI appearances of the same current symbol.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/planning/dashboard-runtime-widget-aggregate-current-render-task-2026-05-09.md`
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/next-steps.md`
- Learning journal updated: not applicable unless a recurring pitfall is
  confirmed.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
- [x] Operation mode declared.
- [x] Current stage is declared.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed after implementation.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Result Report
- Task summary: `HomeLiveWidgets` now has focused coverage proving aggregate
  current open positions render on the dashboard while completed-session
  history remains visible in the history tab.
- Files changed:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx`
  - `docs/planning/dashboard-runtime-widget-aggregate-current-render-task-2026-05-09.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/next-steps.md`
- How tested:
  - `apps/web/node_modules/.bin/vitest.CMD run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx`
  - `apps/web/node_modules/.bin/vitest.CMD run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts`
  - `apps/web/node_modules/.bin/tsc.CMD --noEmit`
  - `node scripts/repoGuardrails.mjs`
- What is incomplete: rendered browser/production clickthrough remains blocked
  on authenticated/admin production app access.
- Next steps: production clickthrough when authenticated/admin app access is
  available, or push this local dashboard-runtime batch with the rest of the
  accumulated commits when the user wants a deploy batch.
- Decisions made: no new UI or API route; test locks the existing aggregate
  consumer path.
