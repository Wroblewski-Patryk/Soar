# LUC-2601 Web API And Form Utility Missing-Test Links

## Header
- ID: LUC-2601
- Title: [Soar][Frontend][LUC-2598] Cover Web API and form utility missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Depends on: LUC-2598
- Priority: P1
- Module Confidence Rows: Web API client utilities, Web form utilities, Web numeric input utilities, Web market stream utilities, Architecture Evidence Graph
- Requirement Rows: REQ-DOC-031
- Mission ID: LUC-2601-WEB-API-FORM-UTILITY-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED_LOCAL

## Context
[LUC-2598](/LUC/issues/LUC-2598) created [LUC-2601](/LUC/issues/LUC-2601) for the next top Web shared/lib missing-test family after [LUC-2597](/LUC/issues/LUC-2597). The current `docs/status/architecture-awareness-report.md` top samples named `apps/web/src/lib/api.ts`, `apps/web/src/lib/forms.ts`, `getAxiosMessage.ts`, `marketStream.ts`, and `numericInput.ts` anchors.

## Goal
Add or map focused local Web tests and scanner-readable `priority-test-links.csv` rows for Web API/form utility anchors without changing runtime behavior or touching production, deploy, accounts, exchange, database, or live-trading state.

## Scope
- Extended existing tests:
  - `apps/web/src/lib/api.test.ts`
  - `apps/web/src/lib/sharedWebUtilities.test.ts`
  - `apps/web/src/lib/numericInput.test.ts`
- Added focused test:
  - `apps/web/src/lib/marketStream.test.ts`
- Added relation rows:
  - `docs/architecture/relations/priority-test-links.csv`

## Implementation Plan
1. Cover `api.ts#isProtectedRoute` and `api.ts#hardRedirect` through existing interceptor/internals behavior.
2. Cover `forms.ts` normalization and fallback helpers through the shared Web utilities test pack.
3. Cover `marketStream.ts` URL/EventSource behavior with isolated mocks.
4. Cover `numericInput.ts` whitespace sanitization and decimal-step derivation.
5. Add direct `LUC-2601` priority test-link rows and run focused proof plus repository guardrails.

## Acceptance Criteria
- Web tests covering the assigned helpers pass.
- `priority-test-links.csv` records direct `LUC-2601` rows for the assigned anchors.
- Architecture graph generation and guardrails pass.
- No deploy, push, restart, rollback, production smoke, account, secret, exchange, database, or live-trading mutation occurs.

## Validation Evidence
- Initial Web test run failed once because the new `isProtectedRoute` test expected `/dashboarding` to be unprotected while the current implementation uses prefix matching. The test was corrected to document existing behavior; runtime code was not changed.
- `corepack pnpm --filter web run test -- --run src/lib/api.test.ts src/lib/sharedWebUtilities.test.ts src/lib/errorResolver.test.ts src/lib/marketStream.test.ts src/lib/numericInput.test.ts` passed. The Web Vitest wrapper still collected the full Web suite in this checkout: `157` files / `575` tests passed.
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root .` could not run in this checkout because `scripts/build-architecture-awareness-index.mjs` is absent. Local available architecture tooling was used instead.
- `corepack pnpm run architecture:graph:generate` passed: `653` nodes / `842` relations / `27` chains.
- `corepack pnpm run quality:guardrails` passed, including strict architecture graph drift with `0` missing representative paths.

## Result Report
- Task summary: implemented local Web proof and direct scanner-readable test links for Web API, form, market-stream, and numeric utility missing-test anchors.
- Files changed: Web lib tests, `apps/web/src/lib/marketStream.test.ts`, `docs/architecture/relations/priority-test-links.csv`, and this task artifact.
- How tested: Web Vitest proof, architecture graph generation, and repository guardrails.
- What is incomplete: architecture-awareness refresh could not be rerun from this checkout because the named script is absent; `docs/status/architecture-awareness-report.md` therefore still reflects the pre-LUC-2601 generated sample until a coordinator with the external awareness builder refreshes it.
- Deploy impact: none.
- Push status: not pushed.
- Residual risk: local proof/traceability only; protected production/browser/release readiness remains governed by existing protected gate issues.
