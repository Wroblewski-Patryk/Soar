# LUC-1197 Workers Ready Contract Suite Closure (2026-06-01)

## Objective
Unblock and close proof for `workers-health-readiness` contract checks.

## Change
- `apps/api/src/router/workers-health-readiness.test.ts`
  - removed dependency on `/auth/register`/`/auth/login` runtime bootstrap;
  - introduced deterministic auth token path (`signAuthToken`) for ADMIN/USER principals;
  - mocked `prisma.user.findUnique` against in-memory auth-user map for token claims resolution.

## Verification
- Command:
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`
- Result:
  - PASS `1` file, PASS `8` tests, FAIL `0`.

## Outcome
Workers readiness contract suite is unblocked in this lane and readiness proof gap is closed for `LUC-1197`.
