# LUC-1197 Evidence - Workers/Ready Contract Suite Unblock

Date: 2026-06-01
Issue: `LUC-1197`
Lane: Engineering Delivery Lead (coordination, no feature-code implementation)

## Trigger And Scope
- Wake class: `source_scoped_recovery_action`.
- Inline payload consumed first (`fallbackFetchNeeded=false`, no pending comments).
- Purpose: refresh blocker truth for `/workers/ready` contract suite and produce exact unblock ownership split.

## Verification Command
- `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`

## Result
- `FAIL`
- Test file summary: `1 failed`
- Test summary: `7 failed`, `1 passed`
- Duration: `~161s`

## Failure Classification
1. `blocked by error` - auth/bootstrap helper setup:
   - repeated assertion path: expected registration response `201`, received `500` in helper bootstrap flow used by admin-agent setup.
2. `blocked by error` - timeout class:
   - `returns workers health status` timed out at `5000ms`;
   - `rejects authenticated non-admin principal for workers readiness` timed out at `5000ms`.
3. `implemented but not verified` - route-level readiness proof:
   - full suite does not complete; `/workers/ready` cannot be promoted to verified readiness-contract proof state.

## Unblock Ownership Split
1. Backend API Engineer:
   - stabilize helper bootstrap path used by `workers-health-readiness.test.ts` so setup no longer fails with `500`.
2. Ops/Runtime Engineer:
   - provide deterministic local runtime dependency preconditions for this suite path (auth/bootstrap timing + runtime dependency stability).
3. Backend QA Engineer:
   - rerun full suite after fixes and publish closure packet with exact pass/fail counts and residual risk.

## Disposition
- Current issue state remains fail-closed: `blocked`.
- Unblock owner/action is explicit and first-class; no passive `in_progress` claim is valid until a fresh full-suite rerun is attached.
