# Task

## Header
- ID: RUNTIME-AUDIT-126
- Title: Align web empty aggregate trade meta fallback
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-125
- Priority: P1
- Iteration: 126
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-125` aligned the API empty aggregate trade metadata with the
aggregate endpoint contract by reporting the caller's `perSessionLimit` even
when `total=0`. The web aggregate service still had a no-session fallback that
returned `trades.meta.pageSize=1`, which kept an older empty-state assumption
inside the dashboard client path.

## Goal
Keep the web dashboard's no-session aggregate fallback aligned with the API
aggregate trade metadata contract.

## Scope
- `apps/web/src/features/bots/services/botsMonitoringAggregate.service.ts`
- `apps/web/src/features/bots/services/botsMonitoringAggregate.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Update the web empty aggregate fallback to use `perSessionLimit` for
   `trades.meta.pageSize`.
2. Add a focused regression proving empty aggregate metadata keeps the requested
   page size while preserving zero totals and `hasNext=false`.
3. Run focused web test, web typecheck, repository guardrails, lint, and diff
   review.
4. Sync planning and context documents.

## Acceptance Criteria
- Empty web aggregate fallback reports `trades.meta.pageSize` from
  `perSessionLimit`.
- Empty web aggregate fallback still reports `total=0`, `totalPages=0`, and
  `hasNext=false`.
- Existing API-first aggregate request behavior is unchanged.

## Definition of Done
- [x] Implementation is scoped to the existing web aggregate service.
- [x] Regression coverage locks the empty fallback contract.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/bots/services/botsMonitoringAggregate.service.test.ts` => PASS (`3/3`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, client fallback metadata drifted from API contract.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: API empty aggregate metadata used `perSessionLimit`, while web
  no-session fallback returned `pageSize=1`.
- Gap: focused web service test did not cover the empty fallback metadata.
- Architecture constraint: dashboard client fallbacks must mirror the API
  contract and fail closed without alternate semantics.

### 2. Select One Priority Task
- Selected task: align web empty aggregate trade metadata fallback.
- Priority rationale: it removes a source-of-truth drift visible to dashboard
  consumers without changing trading execution.
- Deferred candidates: manually mocked component fixtures with `pageSize=1`
  remain test-local response data and are lower risk than the real fallback
  contract.

### 3. Plan Implementation
- Change only the fallback metadata assignment and add a focused service test.
- Edge cases: no sessions, custom `perSessionLimit`, zero trades.

### 4. Execute Implementation
- Replaced hardcoded `pageSize: 1` with `pageSize: perSessionLimit`.
- Added regression for empty aggregate metadata.

### 5. Verify and Test
- Focused web aggregate service suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: only changing the fallback without a regression.
  Rejected because this exact drift came from untested fallback semantics.
- Technical debt introduced: no.
- Scalability assessment: keeps client and API aggregate contracts aligned for
  current dashboard usage and future exchange adapters.

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
- Task summary: aligned the web no-session aggregate trade metadata fallback
  with the API aggregate contract.
- Files changed: web aggregate service, focused web aggregate service test, and
  canonical planning/context docs.
- How tested: focused web service test, web typecheck, guardrails, lint, diff
  check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing dashboard/runtime parity for LIVE and PAPER
  position lifecycle surfaces.
