# Task

## Header
- ID: RUNTIME-AUDIT-143
- Title: Lock dynamic stop display precedence
- Task Type: test
- Current Stage: DONE
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-142
- Priority: P1
- Iteration: 143
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The dashboard open-position table can display TTP and TSL protection. Those
values are money-management signals, so the display resolver must keep their
precedence unambiguous: active TTP display hides TSL, and backend TTP display
wins over fallback TTP.

## Goal
Lock the dynamic stop display resolver contract with focused unit coverage.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add resolver-level coverage showing TSL display when no TTP is active.
2. Add coverage hiding TSL when backend TTP exists.
3. Add coverage hiding TSL when fallback TTP exists.
4. Add coverage proving backend TTP wins over fallback TTP.

## Acceptance Criteria
- TSL displays only when TTP display is inactive.
- Backend TTP suppresses TSL.
- Fallback TTP suppresses TSL.
- Backend TTP has precedence over fallback TTP.

## Definition of Done
- [x] Resolver-level regression coverage exists.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.
- [x] No runtime behavior was changed unnecessarily.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts` => PASS (`5/5`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`, `DEFINITION_OF_DONE.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no implementation mismatch; money-safety coverage gap
  found.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: TTP/TSL display precedence was encoded in pure resolvers.
- Gap: direct resolver tests did not lock the TSL-vs-TTP mutual exclusion
  contract or backend-over-fallback TTP precedence.
- Architecture constraint: money-management display must be unambiguous and
  deterministic.

### 2. Select One Priority Task
- Selected task: lock dynamic stop display precedence.
- Priority rationale: this is a narrow money-impacting display contract in the
  open-position management surface.
- Deferred candidates: backend dynamic stop lifecycle audit remains out of
  scope.

### 3. Plan Implementation
- Add resolver-level tests only.
- Run focused and standard web validation gates.

### 4. Execute Implementation
- Added dynamic stop fixture and tests for TSL display, TSL suppression by TTP,
  fallback TTP suppression, and backend TTP precedence.

### 5. Verify and Test
- Focused runtime derivations suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: rely on component-level tests. Rejected because
  resolver-level tests isolate the money-management precedence contract.
- Technical debt introduced: no.
- Scalability assessment: protects future refactors of dynamic stop display.

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
- Task summary: added resolver-level tests for dynamic stop display precedence.
- Files changed: runtime derivations test and canonical planning/context docs.
- How tested: focused runtime derivations test, web typecheck, guardrails,
  lint, diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER money-impacting position-management
  display and control contracts.
