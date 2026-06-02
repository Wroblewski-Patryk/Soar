# LUC-1176 V1 Acceptance Matrix And Regression Evidence Map (2026-06-01)

## Scope
- Build one PM-level acceptance map for the V1 conformance slice already implemented in `LUC-1188`, `LUC-1189`, `LUC-1194`, `LUC-1195`, `LUC-1196`, and `LUC-1197`.
- Keep this lane documentation/evidence-only (no runtime/deploy mutation).

## Acceptance Matrix (Current Truth)

| Matrix Class | Status | Proof | Gap / Owner |
| --- | --- | --- | --- |
| Exchange-sync ingestion and ownership reconciliation | verified | `pnpm --filter api run test:conformance:acceptance-matrix` -> PASS (`livePositionReconciliation.service.test.ts` segment: `5 passed`) | none |
| Auth fail-closed gates (`401/403`) | verified | `pnpm --filter api run test:conformance:acceptance-matrix` -> PASS (`requireRole` + `requireOpsNetwork`: `8 passed`) | none |
| Runtime positions DCA/TSL display semantics | verified | `pnpm --filter api run test:conformance:acceptance-matrix` -> PASS (`runtimeSessionPositionsRead.service.test.ts` segment: `2 passed`) | none |
| `POST /dashboard/positions/orphan-repair` endpoint contract | verified | `history/tasks/luc-1194-soar-backend-luc-1188-add-endpoint-contract-test-post-dashboard-positions-orphan-repair-2026-06-01-task.md` (`2/2` PASS) | none |
| Route-level DCA/TSL conformance pack (`runtime positions read/close`) | blocked by error | `history/evidence/luc-1195-runtime-positions-read-dca-tsl-route-conformance-pack-2026-06-01.md` | local DB dependency unavailable (`localhost:5432`), owner: Backend/Ops + Backend/QA |
| Route-level DCA-first close authority pack | blocked by error | `history/evidence/luc-1196-runtime-close-dca-first-route-pack-2026-06-01.md` | local DB dependency unavailable (`localhost:5432`), owner: Backend/Ops + Backend/QA |
| `/workers/ready` readiness contract suite | verified (local) | `history/evidence/luc-1197-workers-ready-contract-suite-unblock-and-proof-closure-2026-06-01.md` (`8/8` PASS) | protected production smoke remains separate Ops/Security gate |

## Regression Evidence Map

1. Matrix baseline and route-contract inventory: `history/evidence/luc-1188-endpoint-to-contract-drift-matrix-dca-tsl-positions-2026-06-01.md`.
2. DB-independent executable matrix command: `test:conformance:acceptance-matrix` from `LUC-1189`.
3. Gap closure done: `LUC-1194` added endpoint contract proof for orphan-repair.
4. Gap still blocked by local infra: `LUC-1195`, `LUC-1196`.
5. Worker readiness local closure achieved: `LUC-1197`; protected production evidence still external-gated.

## Command Verification In This Heartbeat

- `pnpm --filter api run test:conformance:acceptance-matrix` -> PASS.

## Disposition

- `LUC-1176` lane output: acceptance matrix and regression-evidence map built from current canonical artifacts.
- Commit: not committed (workspace contains broad unrelated dirty runtime set outside this lane).
- Push: not needed.
- Deploy impact: none.
