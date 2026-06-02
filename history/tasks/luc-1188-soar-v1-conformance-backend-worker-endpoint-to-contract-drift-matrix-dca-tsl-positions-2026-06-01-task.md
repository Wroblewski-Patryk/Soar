# Task Contract - LUC-1188

## Context
- Issue: `LUC-1188` - `[Soar][V1 Conformance][Backend Worker] Build endpoint-to-contract drift matrix for DCA/TSL and positions flow`.
- Wake payload requested concrete progress in this heartbeat and durable disposition evidence.
- Scope stays in backend/API documentation + verification mapping lane.

## Goal
- Produce an explicit endpoint-to-contract drift matrix for positions flow and DCA/TSL runtime contract paths, including worker readiness contract status.

## Constraints
- No push/deploy/restart/production mutation.
- Do not expand into frontend or DB migration work.
- Keep evidence classification strict: `verified`, `implemented but not verified`, `present in code, behavior unknown`, `blocked by error`.

## Stage
- `analysis`

## Scope
- `docs/modules/api-positions.md`
- `apps/api/src/modules/positions/positions.routes.ts`
- `apps/api/src/modules/bots/bots.routes.ts`
- `apps/api/src/router/index.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimePositionSerialization.service.ts`
- route/service/e2e test references for positions and DCA/TSL flow
- `history/evidence/luc-1188-endpoint-to-contract-drift-matrix-dca-tsl-positions-2026-06-01.md`

## Definition of Done
- Endpoint matrix exists with route, expected contract, implementation, proof source, and drift status.
- DCA/TSL + positions flow includes both read path and close-authority path.
- Worker readiness contract path status is explicitly classified.
- Source-of-truth task board updated with lane summary and disposition.

## Forbidden
- Silent status inflation from service-level coverage to route-level closure without proof note.
- Any workaround narrative that bypasses failing readiness/bootstrap evidence.
- Reverting unrelated local changes.

## Result
- Built and stored the matrix artifact:
  - `history/evidence/luc-1188-endpoint-to-contract-drift-matrix-dca-tsl-positions-2026-06-01.md`.
- Matrix covered:
  - all documented `/dashboard/positions` routes,
  - runtime positions read route and runtime close route for DCA/TSL authority,
  - `/workers/ready` backend-worker contract route.
- Drift verdict:
  - no route-definition drift in positions module,
  - proof drift remains for:
    - `POST /dashboard/positions/orphan-repair` (missing dedicated endpoint-level proof),
    - consolidated route-level DCA/TSL conformance pack,
    - blocked `/workers/ready` full-suite proof due to auth/bootstrap + local runtime dependency instability.
- Verification method in this heartbeat:
  - code/doc trace via `rg` and direct route/doc reads (no new runtime mutation).
- Source-control closure decision:
  - `not committed` (documentation/evidence lane only in a dirty multi-lane tree).
