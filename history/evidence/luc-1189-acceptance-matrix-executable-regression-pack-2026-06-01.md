# LUC-1189 Evidence - Acceptance Matrix Executable Regression Pack

Date: 2026-06-01
Issue: LUC-1189

## Command
`pnpm --filter api run test:conformance:acceptance-matrix`

## Result
PASS.

## Coverage Mapping
- Open position ingestion path: covered by targeted `livePositionReconciliation.service.test.ts` rows.
- Upstream error/rate-limit continuity: covered by `continues syncing healthy api keys when one api key fetch fails`.
- Auth failure class (fail-closed gates): covered by `requireRole.test.ts` and `requireOpsNetwork.test.ts`.
- UI/API display semantics for imported positions: covered by targeted `runtimeSessionPositionsRead.service.test.ts` rows.

## Notes
- Pack intentionally excludes DB-backed persistence assertions so it remains runnable without local PostgreSQL.
- Persistence-class verification should be executed as a separate DB-backed lane.

## Continuation Recheck (2026-06-01, finish_successful_run_handoff)
- Re-ran canonical pack to confirm deterministic continuity:
  - `pnpm --filter api run test:conformance:acceptance-matrix`
- Result: PASS (unchanged)
  - reconciliation segment: `5 passed`
  - auth gate segment: `8 passed`
  - display semantics segment: `2 passed`
- No scope expansion, no deploy, no secret access.
