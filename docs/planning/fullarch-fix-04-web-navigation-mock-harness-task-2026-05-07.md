# FULLARCH-FIX-04 Web Navigation Mock Harness

## Header
- ID: FULLARCH-FIX-04
- Title: Repair Web next/navigation test mock harness drift
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: FULLARCH-FIX-03
- Priority: P1
- Iteration: 2026-05-07-continuation-04
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the continuation sequence.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The full architecture conformance audit classified a broad Web test failure
group caused by local `next/navigation` mocks that omitted `usePathname` while
`I18nProvider` imports it. This made route, dashboard, form, and parity tests
untrustworthy until the test harness was repaired.

## Goal
Restore the Web test harness so local `next/navigation` mocks expose the
navigation contract used by `I18nProvider`, without changing production Web
runtime behavior.

## Scope
- `apps/web/src/**/*.test.tsx` files that locally mock `next/navigation`.
- Source-of-truth task/context documentation for the completed harness repair.

## Success Signal
- User or operator problem: Web test failures no longer mask real UI/runtime
  regressions.
- Expected product or reliability outcome: full Web test suite can be used as
  trustworthy regression evidence again.
- How success will be observed: `pnpm --filter web run test -- --run` passes.
- Post-launch learning needed: no.

## Deliverable For This Stage
Completed implementation, validation evidence, self-review, and source-of-truth
sync for the harness repair.

## Constraints
- Use existing Vitest/Next mock patterns.
- Do not change production navigation or i18n runtime code for a test harness
  failure.
- Do not introduce a new parallel harness system.
- Keep the change limited to the missing mock contract and documentation.

## Implementation Plan
1. Locate all local Web tests that mock `next/navigation`.
2. Add `usePathname` to local mocks that override the global setup mock.
3. Verify no local `next/navigation` mock remains without `usePathname`.
4. Run focused previously failing Web route/form packs.
5. Run full Web tests and Web typecheck.
6. Update task/context/source-of-truth documents.

## Acceptance Criteria
- Every local `next/navigation` test mock exposes `usePathname`.
- Focused route/form harness regression pack passes.
- Full Web test suite passes.
- Web typecheck passes.
- No production runtime behavior changes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` quality intent satisfied for this test-harness
  slice.
- [x] Focused Web regression evidence captured.
- [x] Full Web regression evidence captured.
- [x] Source-of-truth docs updated.
- [x] No workaround or duplicate production path introduced.

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run "src/app/dashboard/backtests/create/page.test.tsx" "src/app/dashboard/backtests/list/page.test.tsx" "src/app/dashboard/backtests/[id]/page.test.tsx" "src/app/dashboard/markets/create/page.test.tsx" "src/app/dashboard/markets/list/page.test.tsx" "src/app/dashboard/markets/[id]/edit/page.test.tsx" "src/app/dashboard/strategies/create/page.test.tsx" "src/app/dashboard/strategies/list/page.test.tsx" "src/app/dashboard/strategies/[id]/edit/page.test.tsx" "src/app/dashboard/wallets/list/page.test.tsx" "src/app/dashboard/wallets/[id]/preview/page.test.tsx" "src/features/wallets/components/WalletCreateEditForm.test.tsx" "src/ui/layout/dashboard/SafetyBar.test.tsx"` => `13 passed`, `22 passed`.
  - `pnpm --filter web run test -- --run` => `145 passed`, `482 passed`.
  - `pnpm --filter web run typecheck` => PASS.
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm run docs:parity:check` => PASS.
  - `git diff --check` => PASS with LF/CRLF warnings only.
  - `pnpm run test -- --run` => FAIL after Web PASS because API e2e tests
    still fail around bot market-group creation (`500` instead of `201`),
    `botMarketGroup.botId` unique constraints in multi-group tests, one manual
    LIVE exchange-synced open-order visibility assertion, and stale DB cleanup
    FK residue in `orders.manual-paper-market.e2e.test.ts`. This is outside the
    Web harness slice and is recorded as the next local blocker.
- Manual checks:
  - PowerShell scan confirmed no local `next/navigation` test mock remains
    without `usePathname`.
- Screenshots/logs: not applicable.
- High-risk checks: no live-money, API, database, exchange, or deployment path
  changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/README.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/engineering/testing.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert only the affected test mock additions if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: full Web tests failed because local mocks shadowed the global
  `next/navigation` setup without exporting `usePathname`.
- Gaps: route and form tests could not be trusted while the harness failed
  before assertions.
- Inconsistencies: global setup had `usePathname`; many local mocks did not.
- Architecture constraints: test harness must verify production behavior
  without changing production code to satisfy tests.

### 2. Select One Priority Task
- Selected task: repair Web `next/navigation.usePathname` mock drift.
- Priority rationale: this was the remaining local test blocker after the live
  import API slices.
- Why other candidates were deferred: authenticated production readback needs
  credentials that are not available in the current shell.

### 3. Plan Implementation
- Files or surfaces to modify: local Web `.test.tsx` mocks only, plus
  source-of-truth docs.
- Logic: expose the same pathname fallback contract already used in global
  Vitest setup.
- Edge cases: redirect-only mocks and route-param mocks also need the export
  because full test order can still load `I18nProvider`.

### 4. Execute Implementation
- Implementation notes: added `usePathname` to all local `next/navigation`
  mocks that override the global module mock.

### 5. Verify and Test
- Validation performed: focused Web pack, full Web test suite, Web typecheck,
  and local mock scan.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: changing `I18nProvider` to tolerate missing mocks.
  Rejected because the failure was a test-harness contract drift, not
  production behavior.
- Technical debt introduced: no.
- Scalability assessment: the local mocks now match the global baseline; a
  future shared helper can reduce duplication, but is outside this tiny slice.
- Refinements made: full-suite run revealed additional redirect/component mocks
  beyond the first focused set, and those were repaired too.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/known-issues.md`
  - `.agents/state/next-steps.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to continuation sequence.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced beyond existing local mock structure.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: developers/operators relying on full Web
  regression evidence.
- Existing workaround or pain: broad false failures masked real regressions.
- Smallest useful slice: add missing `usePathname` exports to local mocks.
- Success metric or signal: full Web tests pass.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: local regression validation.
- SLI: full Web test pass.
- SLO: all Web tests pass before treating Web regressions as closed.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: not applicable.
- Smoke command or manual smoke: full Web test suite.
- Rollback or disable path: revert this test-only patch.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable.
- Real API/service path used: not applicable.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: yes, full Web suite.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: test-only code.
- Trust boundaries: no runtime trust boundary changed.
- Permission or ownership checks: not applicable.
- Abuse cases: not applicable.
- Secret handling: no secrets used.
- Security tests or scans: not applicable.
- Fail-closed behavior: not applicable.
- Residual risk: low; duplication remains in local test mocks but matches
  existing repository pattern.

## Result Report
- Task summary: repaired local Web `next/navigation` mocks so `I18nProvider`
  can call `usePathname` in full-suite test runs.
- Files changed: Web test files that locally mock `next/navigation`, plus
  source-of-truth docs.
- How tested: focused Web pack, full Web suite, Web typecheck, and local mock
  scan.
- What is incomplete: root workspace tests still fail in API e2e suites around
  bot market-group and order cleanup/readback contracts; authenticated
  production readback also remains blocked without credentials.
- Next steps: repair/classify the API e2e contract failures, then execute
  `LIVEIMPORT-03` read-only production readback when credentials are available.
- Decisions made: fix the test harness instead of changing production
  `I18nProvider` behavior.
