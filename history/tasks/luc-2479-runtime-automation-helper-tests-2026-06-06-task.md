# LUC-2479 Runtime Automation Helper Tests

## Context

Follow-up from [LUC-2469](/LUC/issues/LUC-2469) architecture missing-test-link triage.

## Goal

Add direct Vitest coverage for runtime position automation helper telemetry and state normalization behavior.

## Constraints

- Scope limited to API helper tests.
- No production, deploy, push, or architecture graph rewrite.
- Preserve unrelated dirty worktree changes.

## Implementation Plan

1. Add direct skip telemetry tests for live/paper mode selection and payload shape.
2. Add canonical basis drift boundary tests.
3. Add direct DCA funds exhausted and protection close telemetry tests.
4. Exercise persisted runtime state non-negative integer normalization through public store helpers.

## Acceptance Criteria

- Live/paper mode selection is covered.
- Telemetry payload content and event shape are covered.
- Canonical basis drift tolerance boundaries are covered.
- Runtime state integer normalization is covered through store read/write helpers.
- Smallest verification command is recorded.

## Result Report

Status: implemented and verified.

Files changed:

- `apps/api/src/modules/engine/runtimePositionAutomationSkipTelemetry.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomationStateRebase.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomationTelemetry.test.ts`
- `history/tasks/luc-2479-runtime-automation-helper-tests-2026-06-06-task.md`

Verification:

- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomationSkipTelemetry.test.ts src/modules/engine/runtimePositionAutomationStateRebase.test.ts src/modules/engine/runtimePositionAutomationTelemetry.test.ts --reporter=dot` - passed, 3 files / 13 tests.
- `pnpm --filter api run typecheck` - passed.

Manual checks:

- Not applicable; this is direct helper unit coverage with no UI/API behavior change.

Deploy impact:

- None.

Residual risk:

- Existing broader Soar worktree has unrelated dirty docs/state/script changes owned by other lanes; this task did not modify or verify those changes.
