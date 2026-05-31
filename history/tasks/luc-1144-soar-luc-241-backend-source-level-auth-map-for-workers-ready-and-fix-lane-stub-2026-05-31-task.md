# Task

## Header
- ID: LUC-1144
- Title: [Soar][LUC-241][Backend] Source-level auth map for /workers/ready and fix-lane stub
- Task Type: backend
- Current Stage: implementation
- Status: DONE
- Owner: Backend API Engineer
- Priority: high
- Date: 2026-05-31

## Context
This lane required explicit source-level auth mapping for protected `GET /workers/ready` and a backend fix-lane stub that can be verified without runtime/deploy mutation.

## Concrete Action
1. Added source-level auth map to `docs/modules/api-root.md` for `GET /workers/ready`, including exact middleware chain and fail-closed behavior by source file.
2. Added deterministic middleware auth gate test coverage in `apps/api/src/middleware/requireRole.test.ts` to prove `ADMIN` role enforcement semantics used by `requireOpsAccess`.
3. Reused existing `requireOpsNetwork` test suite as the network-gate proof half of the same contract.

## Source-Level Auth Map (Final)
- Route: `apps/api/src/router/index.ts` -> `router.get('/workers/ready', ...requireOpsAccess, ...)`
- `requireOpsAccess` order:
  1. `requireAuth` -> unauthenticated requests fail `401`.
  2. `requireRole('ADMIN')` -> non-admin/missing principal fails `403`.
  3. `requireOpsNetwork` -> disallowed source network fails `403`.

## Validation Evidence
- Command:
  - `pnpm --filter api exec vitest run src/middleware/requireRole.test.ts src/middleware/requireOpsNetwork.test.ts`
- Result:
  - PASS `src/middleware/requireRole.test.ts` (3 tests)
  - PASS `src/middleware/requireOpsNetwork.test.ts` (5 tests)

## Files Changed
- `docs/modules/api-root.md`
- `apps/api/src/middleware/requireRole.test.ts`
- `history/tasks/luc-1144-soar-luc-241-backend-source-level-auth-map-for-workers-ready-and-fix-lane-stub-2026-05-31-task.md`

## Closure
- Reality status: implemented and verified (source-level auth-map + middleware gate contract).
- Deploy impact: none.
- Push impact: none in this heartbeat.
