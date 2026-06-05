# Task

## Header
- ID: LUC-2199
- Title: [Soar][Frontend QA] Audit Web support-surface missing-test rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Engineer
- Depends on: [LUC-2175](/LUC/issues/LUC-2175); [LUC-2164](/LUC/issues/LUC-2164)
- Priority: P1
- Module Confidence Rows: `web-shared`; Architecture Evidence Graph
- Mission ID: LUC-2199-WEB-SUPPORT-SURFACE-MISSING-TEST-AUDIT-2026-06-05
- Mission Status: VERIFIED
- Operation Mode: BUILDER

## Context
The scoped Paperclip wake targeted [LUC-2199](/LUC/issues/LUC-2199) with no pending comments and `fallbackFetchNeeded=false`. [LUC-2175](/LUC/issues/LUC-2175) classified the remaining actionable missing-test rows and left the Web support/type rows `apps/web/vitest.setup.ts` and `libs/shared/index.d.ts` as non-user-facing support surfaces. [LUC-2164](/LUC/issues/LUC-2164) intentionally avoided claiming component coverage for them.

## Goal
Audit the two Web support-surface missing-test rows, add focused proof where a real support contract can be tested, and add scanner-readable links without pretending either file is a user-facing UI component.

## Scope
- `apps/web/vitest.setup.ts`
- `libs/shared/index.d.ts`
- `apps/web/src/vitestSetupSupport.test.tsx`
- `apps/web/src/features/exchanges/exchangeCapabilities.test.ts`
- `docs/architecture/relations/priority-test-links.csv`
- This task artifact.

## Implementation Plan
1. Confirm the current architecture-awareness report still lists the two support rows at the top of actionable missing-test links.
2. Add a focused Web setup-support smoke that proves jest-dom matchers plus the global Next/profile mocks loaded from `vitest.setup.ts`.
3. Add type-level assertions to the existing exchange capability consumer test to prove the shared declaration surface stays aligned with Web exchange option/capability consumption.
4. Add curated priority test links for both support-surface rows.
5. Run focused Web tests and architecture-awareness refresh/readback.

## Acceptance Criteria
- `vitest.setup.ts` has a focused support-surface test.
- `libs/shared/index.d.ts` has consumer type proof through the Web exchange capability test.
- Curated direct test links exist in `priority-test-links.csv`.
- Current architecture-awareness top missing-test samples no longer include the two support rows.
- No runtime behavior, route behavior, production smoke, deploy, secret, account, exchange, or live-trading action occurs.

## Definition of Done
- [x] Support rows audited and classified.
- [x] Focused support/type proof added.
- [x] Scanner-readable priority test links added.
- [x] Focused validation passed.
- [x] Architecture-awareness readback passed.

## Forbidden
- Do not add fake UI tests for support/type files.
- Do not change runtime product behavior.
- Do not mutate production, accounts, secrets, exchange state, or LIVE trading state.
- Do not rewrite scanner inference broadly.

## Validation Evidence
- Tests:
  - `pnpm --filter web test -- src/vitestSetupSupport.test.tsx src/features/exchanges/exchangeCapabilities.test.ts`
  - Result: PASS.
- Architecture-awareness:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - Result: PASS (`14322` entities / `22433` relations), generated `2026-06-05T12:40:45.169Z`.
- Readback:
  - Actionable implementation entities without inferred tests: `859`.
  - `apps/web/vitest.setup.ts` and `libs/shared/index.d.ts` absent from current stored actionable missing-test samples after refresh.
- Architecture graph:
  - `pnpm run architecture:graph:generate` -> PASS (`651` nodes / `842` relations / `27` chains).
  - `pnpm run architecture:graph:drift:strict` -> PASS (`824/824`, `0` missing).
- Manual checks:
  - Not applicable; support-surface tests do not change rendered UI.
- High-risk checks:
  - No production/protected/account/secret/exchange/LIVE action performed.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/modules/web-shared.md`
  - `docs/engineering/testing.md`
  - `history/tasks/luc-2175-classify-remaining-actionable-missing-test-rows-after-graph-refresh-2026-06-05-task.md`
  - `history/tasks/luc-2164-reconcile-shared-web-ui-missing-test-relation-rows-2026-06-05-task.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates:
  - Direct support-surface test relations added to `docs/architecture/relations/priority-test-links.csv`.

## Result Report
- Task summary: audited the two Web support-surface missing-test rows and converted them into honest focused support/type proof plus curated graph relations.
- Files changed:
  - `apps/web/src/vitestSetupSupport.test.tsx`
  - `apps/web/src/features/exchanges/exchangeCapabilities.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `history/tasks/luc-2199-audit-web-support-surface-missing-test-rows-2026-06-05-task.md`
- How tested:
  - Focused Web tests passed (`2` files / `4` tests).
  - Architecture-awareness refresh/readback passed.
  - Architecture graph generate and strict drift passed.
- What is incomplete:
  - Report-wide missing-test rows remain mostly script/tooling, protected proof, and aggregate relation backlog. This issue closed only the assigned Web support-surface rows.
- Next steps:
  - None for this issue.
- Decisions made:
  - `vitest.setup.ts` receives focused harness-support proof.
  - `libs/shared/index.d.ts` receives consumer type proof, not a fake runtime declaration-file test.
