# LUC-6121 Production Logout Session Invalidation Repair

## Status

`IMPLEMENTED_AND_VERIFIED_LOCAL / PRODUCTION_RERUN_REQUIRED`

## Summary

The production auth proof previously called `POST /auth/logout` with only a
cookie header and no trusted Origin/body, then checked stale cookie reuse. The
backend controller source at deployed SHA
`3bd65e21d09f294a18d3317d2f59f7a0d4e577b4` matches local logout logic and
invalidates sessions by incrementing `User.sessionVersion`.

This repair makes the production proof call logout with:

- `Origin: <webBaseUrl>`
- `Content-Type: application/json`
- `Cookie: token=<redacted>`
- `Authorization: Bearer <redacted>`
- body `{}`

The proof now verifies stale-token rejection through both cookie and bearer
paths after logout.

## Files Changed

- `apps/api/src/modules/auth/auth.e2e.test.ts`
- `scripts/runProdAuthSessionBrowserProof.mjs`
- `scripts/runProdAuthSessionBrowserProof.test.mjs`

## Verification

- `pnpm exec node --test scripts/runProdAuthSessionBrowserProof.test.mjs`
  - Result: PASS (`5/5`)
- `pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/middleware/requireTrustedOrigin.test.ts src/middleware/rateLimit.test.ts --reporter=verbose`
  - Initial result: BLOCKED by local Postgres closed at `localhost:5432`
  - Recovery: `pnpm run go-live:infra:up`
  - Final result: PASS (`3` files / `23` tests)

## Production Boundary

No production smoke rerun, deploy, push, restart, secret/account readback,
exchange/payment mutation, order, position, or live-trading action was
performed in this CBE heartbeat.

## Residual Risk And Handoff

Production acceptance remains blocked until the repaired source is committed,
released through the normal source-control/Ops path, and QVE reruns the
[LUC-6109](/LUC/issues/LUC-6109) auth-session browser proof plus acceptance
sweep.
