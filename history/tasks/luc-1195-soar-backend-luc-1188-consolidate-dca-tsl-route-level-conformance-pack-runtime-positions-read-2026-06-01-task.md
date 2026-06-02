# Task Contract - LUC-1195

## Context
- Issue: `LUC-1195` - `[Soar][Backend][LUC-1188] Consolidate DCA/TSL route-level conformance pack for runtime positions read`.
- Wake payload requested concrete execution in this heartbeat with durable disposition.
- `LUC-1188` matrix flagged missing consolidated route-level proof pack for runtime positions read authority.

## Goal
- Consolidate a deterministic backend conformance pack for route-level DCA/TSL behavior on runtime positions read path and attach fresh verification status.

## Constraints
- No push/deploy/production mutation.
- Keep scope in backend/API verification + evidence lane.
- Preserve unrelated dirty worktree changes.

## Stage
- `verification`

## Scope
- `apps/api/package.json`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `history/evidence/luc-1195-runtime-positions-read-dca-tsl-route-conformance-pack-2026-06-01.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Definition of Done
- One executable command path exists for route-level runtime positions DCA/TSL conformance.
- Command was executed in this heartbeat and result classified with explicit blocker details when failing.
- Source-of-truth status updated with unblock owner/action.

## Forbidden
- Claiming route-level closure without fresh command output.
- Hiding local dependency blockers behind partial-pass narrative.
- Reverting unrelated local changes.

## Result
- Consolidated command path present:
  - `pnpm --filter api run test:conformance:runtime-positions-dca-tsl-routes`
- Executed in this heartbeat.
- Result: `blocked`.
  - `bots.e2e` targeted route-level test starts but fails at DB bootstrap (`PrismaClientInitializationError`, `localhost:5432` unreachable) before conformance assertions complete.
  - Docker unblock attempt could not run because Docker Desktop engine is unavailable on this host (`//./pipe/dockerDesktopLinuxEngine` not found).
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action:
  1. Backend/Ops local runtime owner: start local DB/cache dependencies (or provide equivalent reachable services) for API e2e contract pack.
  2. Backend/QA lane: rerun `pnpm --filter api run test:conformance:runtime-positions-dca-tsl-routes` and publish closure evidence.
