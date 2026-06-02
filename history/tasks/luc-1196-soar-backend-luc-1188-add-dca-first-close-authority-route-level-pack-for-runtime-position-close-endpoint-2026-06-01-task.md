# Task Contract - LUC-1196

## Context
- Issue: `LUC-1196` - `[Soar][Backend][LUC-1188] Add DCA-first close authority route-level pack for runtime position close endpoint`.
- Wake reason: `issue_continuation_needed`.
- Scope: backend API route-level verification for runtime manual close authority.

## Goal
- Add a focused route-level e2e pack that proves fail-closed close authority behavior for runtime position close endpoint, including DCA-first pending-order boundary.

## Constraints
- No deploy/push/runtime mutation.
- Backend lane only.
- Keep proof classification strict and fail closed on missing environment dependencies.

## Stage
- `implementation` -> `verification`

## Scope
- `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Definition of Done
- Route-level pack exists for:
  - `riskAck` fail-closed contract,
  - pending DCA order close-authority behavior.
- Focused verification command is executed and result captured with blocker details if red.

## Forbidden
- No workaround around DCA-first or close-authority contracts.
- No unrelated file reverts.
- No broad test-suite expansion beyond this lane.

## Result
- Added route-level pack:
  - `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts`
- Added two endpoint-level scenarios:
  1. fail closed when `riskAck` is missing (`400`),
  2. keep close authority fill-based when pending DCA order is still open (`200 submitted`, position remains `OPEN`).
- Verification run:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts`
  - Result: `FAIL` due to environment blocker:
    - `PrismaClientInitializationError: Can't reach database server at localhost:5432`
- Source-control closure:
  - `not committed` (shared dirty worktree across multiple active lanes).
- Disposition:
  - `blocked` pending local DB availability and rerun.
