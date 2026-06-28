# Task

## Header
- ID: LUC-6121
- Title: Production logout/session invalidation repair
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Core Backend Engineer
- Depends on: [LUC-6109](/LUC/issues/LUC-6109), [LUC-6119](/LUC/issues/LUC-6119)
- Priority: P0
- Module Confidence Rows: Auth session
- Requirement Rows: Auth logout invalidates active session token
- Quality Scenario Rows: Auth-sensitive fail-closed session handling
- Risk Rows: Production logout/session invalidation blocker
- Iteration: 2026-06-29
- Operation Mode: BUILDER
- Mission ID: LUC-6121-PRODUCTION-LOGOUT-SESSION-INVALIDATION-REPAIR-2026-06-29
- Mission Status: VERIFIED

## Context
[LUC-6109](/LUC/issues/LUC-6109) production acceptance reproduced a blocker:
`POST /auth/logout -> 502`, followed by `/auth/me -> 200` with the same token.
[LUC-6119](/LUC/issues/LUC-6119) routed the repair to Backend/Auth.

Local source inspection showed deployed SHA `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
and current local source share the same auth controller logout/session-version
invalidation logic. Once local Postgres/Redis were restored, DB-backed auth
tests passed, proving the controller invalidates stale cookie sessions.

## Goal
Repair the production auth-session proof path and pin backend coverage so logout
uses an explicit trusted-origin API request shape and stale session reuse is
rejected for both cookie and bearer token paths.

## Scope
- `scripts/runProdAuthSessionBrowserProof.mjs`
- `scripts/runProdAuthSessionBrowserProof.test.mjs`
- `apps/api/src/modules/auth/auth.e2e.test.ts`

## Implementation Plan
1. Reproduce local focused auth verification baseline.
2. Compare deployed auth controller source with local source.
3. Harden the production proof logout call with trusted Origin, explicit JSON
   POST body, and cookie plus bearer token headers.
4. Split stale-token readback into cookie-token and bearer-token assertions.
5. Add local backend e2e coverage for stale bearer rejection after logout.
6. Run focused verification.

## Acceptance Criteria
- Focused backend auth/session tests pass.
- Production auth proof helper tests pass.
- Logout proof path uses trusted-origin request shape.
- Stale cookie and bearer token reuse after logout are verified fail-closed.
- No secret values, production account mutation, exchange/payment mutation,
  order, position, or live-trading action.

## Definition of Done
- [x] Existing auth session invalidation path inspected.
- [x] Focused backend proof passed.
- [x] Production proof helper contract passed.
- [x] Evidence file created.
- [x] QVE rerun path named.

## Validation Evidence
- Tests:
  - `pnpm exec node --test scripts/runProdAuthSessionBrowserProof.test.mjs`
    PASS (`5/5`).
  - `pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/middleware/requireTrustedOrigin.test.ts src/middleware/rateLimit.test.ts --reporter=verbose`
    PASS (`3` files / `23` tests).
- Manual checks:
  - Initial same command failed before assertions while Postgres was down at
    `localhost:5432`.
  - `pnpm run go-live:infra:up` restored local `postgres` and `redis`.
  - Deployed SHA auth controller and local auth controller were compared; no
    controller delta was found.
- Reality status: verified locally; production rerun required by QVE.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/traceability-matrix.md`,
  `docs/architecture/registry/tests.csv`, `docs/modules/api-auth.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: not required for this scoped proof-helper
  and test repair.

## Deployment / Ops Evidence
- Deploy impact: medium. Source changes affect the production auth proof helper
  and API test coverage, not production runtime until committed/pushed/deployed.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: production auth-session proof now sends trusted Origin
  and verifies cookie plus bearer stale-token rejection.
- Rollback note: revert the scoped script/test changes.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence
- Data classification: auth session token handling; no token values recorded.
- Trust boundaries: browser/web origin to API, server-side production proof
  runner to API, cookie and bearer token auth paths.
- Permission or ownership checks: existing session-version check preserved.
- Abuse cases: stale token reuse after logout now covered for cookie and bearer
  paths.
- Secret handling: no secret values, cookies, passwords, or tokens written to
  artifacts.
- Fail-closed behavior: stale cookie and bearer readback expected `401`.
- Residual risk: production proof was not rerun in this CBE heartbeat because
  that would mutate the production smoke account session and belongs to QVE
  after source-control/release handling.

## Result Report
- Task summary: hardened the production auth proof request shape and expanded
  stale-token verification after logout.
- Files changed:
  - `apps/api/src/modules/auth/auth.e2e.test.ts`
  - `scripts/runProdAuthSessionBrowserProof.mjs`
  - `scripts/runProdAuthSessionBrowserProof.test.mjs`
  - `history/tasks/luc-6121-production-logout-session-invalidation-repair-2026-06-29-task.md`
  - `history/evidence/luc-6121-production-logout-session-invalidation-repair-2026-06-29.md`
- How tested: focused Node script test and DB-backed API auth/session tests.
- What is incomplete: production auth-session browser proof rerun is still
  required after commit/deploy path is accepted.
- Next steps: QVE reruns
  `pnpm run ops:prod-auth:proof -- --i-understand-production-auth-proof` with
  the [LUC-6109](/LUC/issues/LUC-6109) production acceptance sweep after the
  repaired source is on the production path.
- Decisions made: no controller behavior change was made because local and
  deployed controller logic already implements session-version invalidation;
  the repaired blocker was the production proof request shape and missing bearer
  stale-token assertion.
