# Task

## Header
- ID: LUC-2787-WORKERS-READINESS-AUTH-BOOTSTRAP-TEST-PATH-2026-06-07
- Title: Stabilize workers readiness auth bootstrap test path
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Core Backend Engineer
- Depends on: [LUC-1174](/LUC/issues/LUC-1174)
- Priority: P1
- Module Confidence Rows: SOAR-WORKERS-001, SOAR-FEATURE-AUTH-SESSION
- Requirement Rows: REQ-FUNC-021
- Operation Mode: BUILDER
- Mission ID: LUC-2787
- Mission Status: VERIFIED

## Context

[LUC-2787](/LUC/issues/LUC-2787) was created from [LUC-1174](/LUC/issues/LUC-1174) recovery because the full local workers readiness suite previously failed before readiness assertions: test helper bootstrap used `/auth/register`, which returned `500` instead of `201`.

The current checkout already contains the backend test-path stabilization in `apps/api/src/router/workers-health-readiness.test.ts`: the suite no longer bootstraps auth through `/auth/register`; it creates signed test JWTs and mocks `prisma.user.findUnique` for scoped admin/user principals. This preserves production fail-closed behavior because the real `/workers/health` and `/workers/ready` route stack still exercises auth middleware and role gating.

## Goal

Prove the workers readiness contract suite now reaches and verifies readiness assertions, including unauthenticated and non-admin fail-closed paths.

## Scope

- `apps/api/src/router/workers-health-readiness.test.ts`
- Local API test execution only
- Source-of-truth evidence updates only

## Acceptance Criteria

- Full focused command passes: `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`.
- Unauthenticated access contract is included and passes.
- Non-admin authenticated principal fail-closed contract is included and passes.
- No production, deploy, secret, protected smoke, account, exchange, database, or live-trading mutation occurs.

## Validation Evidence

- Tests: `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose` PASS (`1` file / `8` tests).
- Passing assertions include unauthenticated `401`, admin health, non-admin readiness `403`, inline ready, split inline ownership ready, missing queues `not_ready`, split queue ready, and stale heartbeat `not_ready`.
- Manual checks: `git diff -- apps/api/src/router/workers-health-readiness.test.ts` returned no diff in this heartbeat, confirming the stabilization was already present in the claimed checkout.
- Reality status: verified.

## Result Report

- Task summary: verified that the local workers readiness suite no longer depends on `/auth/register` bootstrap and now passes end to end.
- Files changed: evidence/state files only in this heartbeat; `apps/api/src/router/workers-health-readiness.test.ts` had no diff at closure.
- How tested: `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose` PASS (`8/8`).
- What is incomplete: protected production workers readiness evidence remains separately auth-gated and is not claimed by this local suite.
- Next steps: [LUC-1174](/LUC/issues/LUC-1174) Backend/QA owner should rerun the parent conformance closure path now that the local readiness bootstrap blocker is removed.
- Decisions made: no commit, push, or deploy from this heartbeat because no code changes were made and the broader worktree contains unrelated dirty state.
