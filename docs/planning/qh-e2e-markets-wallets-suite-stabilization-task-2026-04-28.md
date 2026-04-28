# Task

## Header
- ID: QH-E2E-2026-04-28-A
- Title: Stabilize full markets and wallets CRUD e2e suites after focused regression closure
- Task Type: fix
- Current Stage: verification
- Status: CLOSED
- Owner: QA/Test
- Depends on: UXSAFE-2026-04-28-A
- Priority: P1

## Context
The focused regressions added during `UXSAFE-2026-04-28-A` passed, but the full
legacy `markets.e2e.test.ts` and `wallets.crud.e2e.test.ts` files still showed
older unrelated noise in local execution. V1 quality should not rely on
focused `-t` coverage forever when the broader CRUD suites represent the same
operator surfaces.

## Goal
Recover deterministic full-file green execution for the `markets` and `wallets`
CRUD e2e suites without changing the approved domain behavior.

## Deliverable For This Stage
Verified full-suite stabilization for the legacy `markets` and `wallets` CRUD
e2e files, plus synchronized queue/context closure evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new runtime/domain structures without approval
- do not implement workarounds that weaken auth, ownership, or CRUD contracts
- do not duplicate logic
- keep the fix in test/harness scope unless a real product regression is proven

## Scope
- `apps/api/src/modules/markets/markets.e2e.test.ts`
- `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
- auth/session helpers only if the issue is proven to be a shared harness drift
- queue/context sync for closure

## Implementation Summary
1. Reproduced both full suites without `-t` and confirmed the residual failures
   were suite-harness drift rather than fresh runtime/domain regressions.
2. Stabilized `markets.e2e.test.ts` by switching from aggressive per-test
   cleanup to one-time cleanup plus unique per-test user identities so the
   full suite no longer reuses auth/subscription state implicitly.
3. Stabilized `wallets.crud.e2e.test.ts` with the same unique-identity pattern,
   while keeping one narrow shared bearer helper for explicit multi-user
   ownership/list assertions where `request.agent` session coupling was adding
   noise.
4. Added `apps/api/src/test/authenticatedRequest.ts` as the shared helper for
   those multi-user authenticated-request scenarios and removed the abandoned
   reset-helper path instead of normalizing destructive cleanup.
5. Re-ran both full files, API typecheck, and repository guardrails.

## Acceptance Criteria
- `pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts`
  passes green without test-name filtering.
- `pnpm --filter api exec vitest run src/modules/wallets/wallets.crud.e2e.test.ts`
  passes green without test-name filtering.
- No domain behavior is loosened to make tests pass.
- Any shared harness fix is proven by at least one additional unaffected suite
  or by direct contract inspection.

## Definition of Done
- [ ] Full `markets` CRUD e2e suite is green.
- [ ] Full `wallets` CRUD e2e suite is green.
- [ ] Fix stays in test/harness scope unless a real runtime bug is proven.
- [ ] Relevant validations are attached.
- [ ] Queue/context docs are synchronized on closure.
- [x] Full `markets` CRUD e2e suite is green.
- [x] Full `wallets` CRUD e2e suite is green.
- [x] Fix stays in test/harness scope unless a real runtime bug is proven.
- [x] Relevant validations are attached.
- [x] Queue/context docs are synchronized on closure.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/markets/markets.e2e.test.ts`
  - `pnpm --filter api exec vitest run src/modules/wallets/wallets.crud.e2e.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - confirmed the fix stayed in test/harness scope and did not loosen market or
    wallet domain protections
- Screenshots/logs:
  - none
- High-risk checks:
  - preserved V1 auth/session and CRUD contracts while stabilizing the suites

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the test/harness-only commit if future suite evolution
  chooses a different canonical fixture pattern

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- This task closes the follow-up gap recorded during `UXSAFE`: the repository no
  longer relies on `-t`-only validation for these two legacy CRUD files.

## Result Report
- Task summary: stabilized the full legacy CRUD e2e suites for `markets` and
  `wallets` without relaxing runtime/domain behavior.
- Files changed:
  - `apps/api/src/modules/markets/markets.e2e.test.ts`
  - `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
  - `apps/api/src/test/authenticatedRequest.ts`
  - queue/context sync files
- How tested: full `markets` suite, full `wallets` suite, API typecheck,
  repository guardrails
- What is incomplete: nothing within the scoped quality slice
- Next steps: pick the next canonical READY/NOW task from queue truth
- Decisions made:
  - stabilize legacy CRUD suites with unique per-test identities rather than
    destructive per-test cleanup
  - keep shared bearer auth helper usage narrow and explicit instead of
    rewriting all suite auth flows
