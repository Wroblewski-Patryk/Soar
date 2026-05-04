# Task

## Header
- ID: RUNTIME-AUDIT-141
- Title: Scope fallback TTP sticky state by runtime identity
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-140
- Priority: P1
- Iteration: 141
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Fallback TTP display keeps sticky favorable-move state in the selected runtime
view model. That state must be isolated to the active runtime identity so a
previous bot/session cannot influence another selected runtime view if position
ids overlap or are reused by test/import paths.

## Goal
Prevent fallback TTP sticky state from leaking across bot/session boundaries.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Build a runtime sticky key from bot id, runtime session id, and position id.
2. Use that key for fallback TTP favorable-move storage and pruning.
3. Add a regression that switches selected runtime identity with the same
   position id and verifies sticky protection does not leak.

## Acceptance Criteria
- Sticky fallback TTP state is scoped by bot/session/position identity.
- Pruning uses the same scoped keys as fallback calculation.
- A second runtime identity with the same position id must not inherit fallback
  protected percent.

## Definition of Done
- [x] Sticky state scope is explicit.
- [x] Regression coverage locks cross-runtime isolation.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts` => PASS (`8/8`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`, `DEFINITION_OF_DONE.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, sticky fallback state was keyed only by position id
  inside a selected runtime view-model ref.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: sticky fallback TTP state used only `position.id` as its storage key.
- Gap: dashboard coverage did not prove isolation across selected bot/session
  identity.
- Architecture constraint: money-impacting runtime display must be scoped to
  the active runtime truth boundary.

### 2. Select One Priority Task
- Selected task: scope fallback TTP sticky state by runtime identity.
- Priority rationale: R141 is ARCHITECT mode and the state ownership boundary
  needed to be explicit after R139/R140.
- Deferred candidates: backend dynamic stop lifecycle audit remains out of
  scope.

### 3. Plan Implementation
- Compute a scoped sticky key in the selected runtime view model.
- Use scoped keys for prune and fallback calculation.
- Add a cross-runtime rerender regression.

### 4. Execute Implementation
- Added bot/session/position scoped sticky key.
- Updated sticky fallback pruning to use scoped keys.
- Added regression for same position id across two runtime identities.

### 5. Verify and Test
- Focused runtime view-model suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: assume position ids are globally unique. Rejected
  because imports/tests/recovery paths make explicit runtime scoping safer and
  clearer for money-impacting UI state.
- Technical debt introduced: no.
- Scalability assessment: the scoped key makes state ownership explicit.

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
- Task summary: fallback TTP sticky state is now scoped by bot, runtime session,
  and position identity.
- Files changed: selected runtime view model, focused test, and canonical
  planning/context docs.
- How tested: focused runtime view-model test, web typecheck, guardrails, lint,
  diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER money-impacting position-management
  display and control contracts.
