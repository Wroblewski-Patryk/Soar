# LUC-1197 Workers Ready Contract Suite Unblock And Proof Closure (2026-06-01)

## Scope
- Issue: `LUC-1197`
- Lane: Backend API Engineer
- Objective: unblock deterministic execution of `workers/ready` contract suite and close local readiness-proof gap for acceptance pack.

## Change Summary
- Reworked `apps/api/src/router/workers-health-readiness.test.ts` to remove `/auth/register` and `/auth/login` bootstrap dependency.
- Added deterministic auth harness:
  - signed JWT via `signAuthToken`,
  - in-memory mock user registry,
  - `vi.spyOn(prisma.user.findUnique)` to resolve principals without DB auth bootstrap.
- Preserved and validated fail-closed contract checks:
  - unauthenticated -> `401`,
  - authenticated non-admin -> `403`,
  - admin readiness for inline/split modes.

## Verification
1. `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`
- Result: PASS
- Details: `1` file, `8` tests passed.

2. `pnpm --filter api run test:conformance:acceptance-matrix`
- Result: PASS
- Details:
  - `livePositionReconciliation.service.test.ts` targeted pack: `5` passed.
  - `requireRole.test.ts` + `requireOpsNetwork.test.ts`: `8` passed.
  - `runtimeSessionPositionsRead.service.test.ts` targeted pack: `2` passed.

## Disposition
- Status: `done`
- Commit: not committed in this heartbeat
- Push: not needed
- Deploy impact: none

## Residual Risk
- Production protected smoke for `/workers/ready` remains a separate Ops/Security gate and is intentionally out of scope for this local backend verification lane.
