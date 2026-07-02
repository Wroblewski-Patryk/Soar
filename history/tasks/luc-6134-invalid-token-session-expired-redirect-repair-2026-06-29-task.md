# Task

## Header
- ID: LUC-6134
- Title: Repair invalid-token session-expired redirect proof failure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: CTO / Frontend Web
- Depends on: [LUC-6123](/LUC/issues/LUC-6123)
- Priority: P0
- Module Confidence Rows: Auth session; production protected app acceptance
- Requirement Rows: invalid protected-session token redirects to expired-session login
- Quality Scenario Rows: auth fail-closed UX; production auth proof reliability
- Risk Rows: production auth proof blocked by invalid-token redirect parity
- Iteration: 2026-06-29
- Operation Mode: BUILDER
- Mission ID: `LUC-6134-INVALID-TOKEN-SESSION-EXPIRED-REDIRECT-REPAIR-2026-06-29`
- Mission Status: VERIFIED_LOCAL

## Context

[LUC-6123](/LUC/issues/LUC-6123) verified the production logout/session
repair but left the full production auth proof blocked because the invalid
browser token step reached `/auth/login` without `?session=expired`.

## Goal

Preserve the existing Auth/Web contract: a protected route that fails `/auth/me`
with `401` must route to `/auth/login?session=expired`, not plain
`/auth/login`.

## Scope

- `apps/web/src/context/AuthContext.tsx`
- `apps/web/src/app/dashboard/page.tsx`
- `apps/web/src/features/admin/layout/AdminLayoutShell.tsx`
- Focused Web tests for those surfaces.

## Implementation Plan

1. Carry explicit `sessionExpired` state from `AuthContext` when `/auth/me`
   fails with `401` on a protected route or existing expired-session login URL.
2. Preserve that state in Dashboard and Admin protected-route redirects.
3. Add focused tests for the invalid-session redirect query preservation.
4. Run focused Web tests and Web typecheck.

## Acceptance Criteria

- Protected-route auth bootstrap failure with `401` keeps
  `/auth/login?session=expired`.
- Normal unauthenticated protected redirect remains `/auth/login`.
- No API, DB, secret, deployment, or production mutation is required.

## Definition of Done

- [x] Existing Web auth systems reused.
- [x] Focused Auth/Dashboard/Admin tests pass.
- [x] Web typecheck passes.
- [x] Source-of-truth task and state updates are recorded.
- [x] Production rerun remains explicitly delegated to QVE/release path.

## Forbidden

- No JWT validation in Web middleware.
- No proof-contract downgrade to plain `/auth/login`.
- No deploy, push, restart, rollback, env mutation, secret readback, account
  mutation, exchange/payment/order/position/live-trading action.

## Validation Evidence

- `pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/app/dashboard/dashboard.a11y.smoke.test.tsx src/features/admin/layout/AdminLayoutShell.test.tsx --reporter=verbose`
  - PASS: `3` files / `13` tests.
- `pnpm --filter web run typecheck`
  - PASS: `tsc --noEmit`.

## Architecture Evidence

- Architecture source reviewed: `apps/web/src/middleware.ts`,
  `apps/web/src/lib/api.ts`, AuthContext, Dashboard/Admin protected layout.
- Fits approved architecture: yes. Web middleware remains transport-level only;
  `/auth/me` stays the authoritative token validation boundary.
- Mismatch discovered: no.
- Decision required from user: no.

## Security / Privacy Evidence

- Data classification: auth session metadata only; no token values captured.
- Trust boundaries: API `/auth/me` remains authoritative for invalid-token
  detection; Web only preserves the fail-closed redirect reason.
- Secret handling: no secret values read, printed, or stored.
- Fail-closed behavior: invalid protected auth state still redirects out of
  protected routes with expired-session reason preserved.
- Residual risk: production acceptance is not proven until the fixed source is
  on the production path and QVE reruns the protected auth proof.

## Result Report

- Task summary: repaired the Web/Auth race where page-level protected-route
  redirects could overwrite the API interceptor's `session=expired` contract.
- Files changed:
  - `apps/web/src/context/AuthContext.tsx`
  - `apps/web/src/context/AuthContext.test.tsx`
  - `apps/web/src/app/dashboard/page.tsx`
  - `apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx`
  - `apps/web/src/features/admin/layout/AdminLayoutShell.tsx`
  - `apps/web/src/features/admin/layout/AdminLayoutShell.test.tsx`
- How tested: focused Web Vitest packet and Web typecheck passed.
- What is incomplete: no production deploy or production auth proof rerun was
  performed from this CTO heartbeat.
- Next steps: source-control/release owner commits or batches the fix on an
  approved source path; QVE reruns `ops:prod-auth:proof` for [LUC-6123](/LUC/issues/LUC-6123).
- Decisions made: preserve the existing `session=expired` product/proof
  contract rather than weakening the proof expectation.
