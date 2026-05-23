# Task

## Header
- ID: RUNTIME-AUDIT-142
- Title: Lock backend TTP precedence over fallback display
- Task Type: test
- Current Stage: DONE
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-141
- Priority: P1
- Iteration: 142
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The dashboard now computes fallback TTP protection before backend dynamic stop
price arrives. Once backend/runtime returns dynamic TTP stop protection, that
runtime-derived value must be the display source of truth.

## Goal
Lock the display precedence contract so backend dynamic TTP protection wins
over fallback TTP protection.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a selected runtime row regression where backend dynamic TTP and fallback
   TTP compute different protected percentages.
2. Verify row-level backend `ttpProtectedPercent` exists.
3. Verify fallback still computes.
4. Verify `resolveDynamicTtpDisplay` returns the backend value.

## Acceptance Criteria
- Backend dynamic TTP protection has display precedence.
- Fallback TTP may compute but cannot override backend/runtime truth.
- The focused runtime view-model suite covers the precedence path.

## Definition of Done
- [x] Regression coverage locks backend-over-fallback precedence.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.
- [x] No runtime behavior was changed unnecessarily.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts` => PASS (`9/9`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`, `DEFINITION_OF_DONE.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no implementation mismatch; coverage gap found.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: fallback TTP display was newly added, while backend/runtime stop
  values remain the authoritative source once present.
- Gap: dashboard integration coverage did not explicitly prove backend TTP
  precedence over fallback TTP.
- Architecture constraint: runtime-derived money-management values must take
  precedence over UI fallback estimates.

### 2. Select One Priority Task
- Selected task: lock backend TTP precedence over fallback display.
- Priority rationale: protects money-impacting display truth after fallback TTP
  wiring.
- Deferred candidates: backend dynamic stop lifecycle audit remains out of
  scope.

### 3. Plan Implementation
- Add one focused regression with different backend and fallback TTP values.
- Run focused runtime view-model and web validation gates.

### 4. Execute Implementation
- Added a regression where backend dynamic TTP protection is 5% while fallback
  protection is 7%, and display returns 5%.

### 5. Verify and Test
- Focused runtime view-model suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: rely on nullish coalescing order in the resolver.
  Rejected because this is a money-impacting precedence contract.
- Technical debt introduced: no.
- Scalability assessment: test protects future refactors around TTP display.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, task board, project state, MVP queue, MVP
  execution plan.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs and context were updated.

## Result Report
- Task summary: added dashboard integration coverage proving backend dynamic
  TTP protection displays before fallback protection.
- Files changed: focused runtime view-model test and canonical planning/context
  docs.
- How tested: focused runtime view-model test, web typecheck, guardrails, lint,
  diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER money-impacting position-management
  display and control contracts.
