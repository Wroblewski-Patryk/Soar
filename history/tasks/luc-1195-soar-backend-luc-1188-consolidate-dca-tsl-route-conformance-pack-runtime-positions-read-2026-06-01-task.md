# Task Contract - LUC-1195

## Context
- Issue: `LUC-1195` - `[Soar][Backend][LUC-1188] Consolidate DCA/TSL route-level conformance pack for runtime positions read`.
- Follow-up from `LUC-1188` drift matrix: consolidate one deterministic route-level verification pack for runtime positions DCA/TSL truth.

## Goal
- Add one backend command that runs the minimal consolidated DCA/TSL route-level conformance pack for runtime positions read.

## Constraints
- No push/deploy/restart/production mutation.
- Backend lane only; no frontend or migration scope expansion.
- Keep fail-closed status when infra dependencies are unavailable.

## Stage
- `implementation`

## Scope
- `apps/api/package.json`
- `history/evidence/luc-1195-runtime-positions-read-dca-tsl-route-conformance-pack-2026-06-01.md`
- `.codex/context/TASK_BOARD.md`

## Definition of Done
- Dedicated API script exists for consolidated runtime positions read DCA/TSL route-level pack.
- Script run result (PASS or blocked/fail with exact reason) recorded as evidence.
- Task board updated with disposition and unblock owner/action when blocked.

## Forbidden
- Claiming route-level conformance closure without command evidence.
- Hiding infra blockers behind partial green results.

## Result
- Added script:
  - `pnpm --filter api run test:conformance:runtime-positions-dca-tsl-routes`
- Script composes targeted route-level runtime positions read checks:
  - dynamic `TTP`/`TSL` lifecycle route mapping (`bots.e2e.test.ts`);
  - imported runtime DCA visibility route mapping (`bots.runtime-imported-dca-visibility.e2e.test.ts`).
- Validation result in this heartbeat: `blocked` by local DB dependency (`Can't reach database server at localhost:5432`) during e2e reset.
