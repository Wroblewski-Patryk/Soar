# Task

## Header
- ID: LUC-175
- Title: Fix requireAuth test typing API build blocker
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: none
- Priority: P1
- Module Confidence Rows: Account access / API auth middleware
- Requirement Rows: not applicable; test typing/build blocker only
- Quality Scenario Rows: maintainability / typed API test suite
- Risk Rows: local API build/typecheck regression
- Iteration: 2026-07-05
- Operation Mode: BUILDER
- Mission ID: LUC-175-REQUIREAUTH-TEST-TYPING-API-BUILD-BLOCKER-2026-07-05
- Mission Status: VERIFIED

## Context
`apps/api/src/middleware/requireAuth.test.ts` had behavior coverage from prior
Account access work, but API typecheck failed because the test helper expected
only `string[]` `set-cookie` headers while Supertest exposes `string |
string[]`, and one Prisma `findUnique` mock returned a partial user shape that
did not satisfy the typed client method.

## Goal
Remove the API build/typecheck blocker without changing `requireAuth` runtime
behavior.

## Scope
- `apps/api/src/middleware/requireAuth.test.ts`
- `.agents/state/module-confidence-ledger.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.agents/state/active-mission.md`
- `.agents/state/next-steps.md`

## Implementation Plan
1. Reproduce the API typecheck failure.
2. Update the test helper to accept `string | string[] | undefined`.
3. Return a Prisma-compatible mock user shape for the stale-session test.
4. Rerun focused middleware test and API typecheck.
5. Record the result in project state.

## Acceptance Criteria
- `requireAuth.test.ts` remains behaviorally equivalent.
- Focused `requireAuth` middleware tests pass.
- `api` typecheck passes.
- No production, deploy, secret, account, exchange, payment, subscription,
  order, position, or live-trading mutation occurs.

## Definition of Done
- [x] Type blocker reproduced.
- [x] Minimal test-only fix applied.
- [x] Focused test passed.
- [x] API typecheck passed.
- [x] State/evidence updated.

## Forbidden
- Runtime auth behavior changes.
- Temporary bypasses or skipped tests.
- New architecture or auth patterns.
- Production or protected-account access.

## Validation Evidence
- Tests:
  `corepack pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
  passed (`1` file / `9` tests).
- Typecheck:
  `corepack pnpm --filter api run typecheck` passed.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: existing Account access/auth middleware state.
- Fits approved architecture: yes; test typing only.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the test-only changes if needed.

## Autonomous Loop Evidence

### 1. Analyze Current State
- API typecheck failed on `requireAuth.test.ts` with `set-cookie` and Prisma
  mock typing errors.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-175](/LUC/issues/LUC-175) build blocker.
- Priority rationale: high-priority assigned backend issue with direct API build
  impact.

### 3. Plan Implementation
- Modify only test typing and mock data shape.

### 4. Execute Implementation
- `expectSessionCookieCleared` now normalizes `string | string[]`.
- Stale-session `findUnique` mock now returns all fields required by the typed
  Prisma user return.

### 5. Verify and Test
- Focused middleware test passed.
- API typecheck passed.

### 6. Self-Review
- No runtime auth behavior changed.
- Existing test intent preserved.
- No workaround path or logic duplication introduced.

### 7. Update Documentation and Knowledge
- Project state and task board updated.
- Module confidence ledger updated.
- Learning journal update: not applicable; this was a one-off typing cleanup.

## Result Report
- Task summary: fixed the `requireAuth.test.ts` TypeScript errors blocking API
  typecheck/build.
- Files changed: `apps/api/src/middleware/requireAuth.test.ts` plus scoped
  task/state records.
- How tested: focused Vitest middleware test and API typecheck.
- What is incomplete: no remaining action on [LUC-175](/LUC/issues/LUC-175).
- Next steps: source-control/release owner may batch this test-only fix with
  the existing dirty/diverged checkout when appropriate.
