# LUC-1188 - Endpoint-to-Contract Drift Matrix (DCA/TSL + Positions)

Date: 2026-06-01
Owner lane: Backend API Engineer
Scope: backend route-to-contract conformance map for positions flow, DCA/TSL display/authority, and worker readiness guard path.

## Matrix

| Endpoint | Expected contract source | Implementation entrypoint | Proof source | Drift status | Gap / next owner |
| --- | --- | --- | --- | --- | --- |
| `GET /dashboard/positions` | `docs/modules/api-positions.md` list/read contract (auth + ownership + normalized symbol filter) | `apps/api/src/modules/positions/positions.routes.ts` -> `listPositions` | `apps/api/src/modules/positions/positions.list.e2e.test.ts` | `verified` | none |
| `GET /dashboard/positions/:id` | `docs/modules/api-positions.md` read-by-id + ownership boundary | `positions.routes.ts` -> `getPosition` | `apps/api/src/modules/orders/orders-positions.e2e.test.ts` (owner/other access checks) | `verified` | none |
| `GET /dashboard/positions/live-status` | `docs/modules/api-positions.md` live reconciliation status contract | `positions.routes.ts` -> `getLiveReconciliationStatus` | `apps/api/src/modules/positions/positions-live-status.e2e.test.ts` | `verified` | none |
| `GET /dashboard/positions/exchange-snapshot` | `docs/modules/api-positions.md` snapshot flow + `ExchangeSnapshotError` taxonomy | `positions.routes.ts` -> `getExchangeSnapshot` | `apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts` | `implemented but not verified` | refresh focused run in current branch to reconfirm error-code continuity (Backend QA lane) |
| `GET /dashboard/positions/takeover-status` | `docs/modules/api-positions.md` takeover state model (`OWNED_AND_MANAGED` / `UNOWNED` / `AMBIGUOUS` / `MANUAL_ONLY`) | `positions.routes.ts` -> `getExternalTakeoverStatus` | `apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts` | `verified` | none |
| `POST /dashboard/positions/takeover-rebind` | `docs/modules/api-positions.md` deterministic rebind flow | `positions.routes.ts` -> `postExternalTakeoverRebind` | `apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts` (rebind scenarios) | `verified` | none |
| `POST /dashboard/positions/orphan-repair` | `docs/modules/api-positions.md` local orphan repair flow | `positions.routes.ts` -> `postLegacyOpenPositionRepair` | code present; no dedicated endpoint-level test reference in current matrix set | `present in code, behavior unknown` | add focused endpoint contract test (Backend) |
| `PATCH /dashboard/positions/:id/management-mode` | `docs/modules/api-positions.md` management-mode switch contract | `positions.routes.ts` -> `updatePositionManagementMode` | `apps/api/src/modules/orders/orders-positions.e2e.test.ts` | `verified` | none |
| `PATCH /dashboard/positions/:id/manual-update` | `docs/modules/api-positions.md` manual update guardrails for OPEN-only + audit continuity | `positions.routes.ts` -> `updatePositionManualParams` | `apps/api/src/modules/orders/orders-positions.e2e.test.ts` | `verified` | none |
| `GET /dashboard/bots/:id/runtime-sessions/:sessionId/positions` | runtime positions payload must preserve DCA lifecycle truth and DCA-gated `TTP`/`TSL` visibility | `apps/api/src/modules/bots/bots.routes.ts` -> `listBotRuntimeSessionPositions` -> `runtimeSessionPositionsRead.service.ts` / `runtimePositionSerialization.service.ts` | `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`, `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`, `apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts` | `partially verified` | endpoint-level suite coverage is broad but not currently consolidated into one deterministic conformance pack; add focused pack for DCA-gating + TTP/TSL map (Backend QA) |
| `POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close` | close authority must honor DCA-first guard semantics for `SL`/`TSL` | `bots.routes.ts` -> `closeBotRuntimeSessionPosition` | `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts` PASS `3/3`; `apps/api/src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts` PASS `2/2`; focused `apps/api/src/modules/bots/bots.e2e.test.ts` pending-DCA close scenario PASS `1/1`; `runtimeExecutionDedupe.service.test.ts` + `runtimeSessionPositionCommand.service.test.ts` PASS `26/26` | `verified` | Full API typecheck still has unrelated active-lane errors in orphan-repair and workers-readiness tests; no remaining `LUC-1196` file errors |
| `GET /workers/ready` | split-worker readiness contract (auth/admin/ops-network + topology + heartbeat freshness) | `apps/api/src/router/index.ts` -> `/workers/ready` | `apps/api/src/router/workers-health-readiness.test.ts` | `blocked by error` | current suite blocked by `/auth/register` 500 in helper bootstrap and local Redis/test dependency instability; owner: Backend + Ops local runtime |

## Drift Summary

- No hard route-definition drift found between documented positions endpoints and router registrations.
- Main conformance risk is not missing code paths but proof continuity:
  - one route lacks dedicated endpoint proof (`/positions/orphan-repair`);
  - DCA/TSL authority is strongly covered at service/e2e layers but not yet sealed by one minimal route-level conformance pack;
  - worker readiness route remains proof-blocked by auth/bootstrap/runtime test instability.

## Minimal Follow-up Pack

1. Add focused endpoint contract test for `POST /dashboard/positions/orphan-repair`.
2. Add focused route-level DCA/TSL authority pack for:
   - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/positions`
   - `POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close`
3. Unblock and rerun `workers-health-readiness.test.ts` full suite after auth bootstrap/runtime dependency stabilization.
