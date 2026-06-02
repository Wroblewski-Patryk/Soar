# Task

## Header
- ID: LUC-1194
- Title: [Soar][Backend][LUC-1188] Add endpoint contract test for POST /dashboard/positions/orphan-repair
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Priority: P1

## Context
LUC-1188 drift matrix flagged `POST /dashboard/positions/orphan-repair` as present in code with behavior unknown.

## Goal
Provide a dedicated endpoint-level contract test proving fail-closed auth behavior and authenticated response/handler orchestration contract.

## Scope
- `apps/api/src/modules/positions/positions.orphan-repair.contract.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Add focused endpoint contract test for unauthenticated and authenticated calls.
2. Mock orchestration dependencies and assert call chain + response shape.
3. Run targeted vitest command and record evidence.

## Acceptance Criteria
- Dedicated contract test exists for `POST /dashboard/positions/orphan-repair`.
- Test verifies `401` for unauthenticated request.
- Test verifies authenticated payload shape and orchestration calls.
- Focused test command passes locally.

## Validation Evidence
- Command:
  - `pnpm --filter api exec vitest run src/modules/positions/positions.orphan-repair.contract.e2e.test.ts --reporter=verbose`
- Result:
  - PASS (`2` passed, `0` failed).

## Result Report
- Task summary: Added a dedicated contract test for orphan-repair endpoint and verified it with focused vitest run.
- Files changed:
  - `apps/api/src/modules/positions/positions.orphan-repair.contract.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Deploy impact: none.
- Residual risk: none in this lane; broader repository dirty state is unrelated and untouched.
