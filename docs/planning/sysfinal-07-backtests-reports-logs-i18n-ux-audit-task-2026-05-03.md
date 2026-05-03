# Task

## Header
- ID: SYSFINAL-07
- Title: Audit backtests reports logs i18n and UX states
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: SYSFINAL-06
- Priority: P1
- Iteration: 2026-05-03 final system-function confidence pass
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`SYSFINAL-07` is the product QA slice after auth, runtime, trading, and
configuration workflows were verified. It covers non-runtime product surfaces:
backtest creation/list/detail, reports/parity diagnostics, logs/audit trail,
route-reachable localization, and key dashboard responsive/accessibility
regression coverage.

## Goal
Prove that backtests, reports, logs, route-reachable i18n, and key dashboard
UX state coverage remain coherent with the current V1 architecture and product
contracts, or convert confirmed discrepancies into scoped `SYSFIX-*` tasks.

## Success Signal
- User or operator problem: non-runtime product workflows must remain reliable
  while runtime/trading hardening continues.
- Expected product or reliability outcome: backtest/report/log and i18n/UX
  checks are green with no unclassified product defects.
- How success will be observed: focused API, e2e, web, i18n, and guardrail
  validations pass.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verification evidence and source-of-truth synchronization for `SYSFINAL-07`.

## Scope
- `apps/api/src/modules/backtests/*`
- `apps/api/src/modules/engine/runtimeBacktestParserParity.test.ts`
- `apps/api/src/modules/reports/reports.service.test.ts`
- `apps/api/src/modules/logs/logs.e2e.test.ts`
- `apps/web/src/features/backtest/*`
- `apps/web/src/features/logs/components/AuditTrailView.test.tsx`
- `apps/web/src/features/reports/components/PerformanceReportsView.test.tsx`
- `apps/web/src/i18n/routeLocaleSmoke.test.ts`
- `apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx`
- `apps/web/src/ui/layout/dashboard/Header.responsive.test.tsx`
- `apps/web/src/ui/layout/dashboard/PageTitle.a11y.test.tsx`
- `docs/modules/api-backtests.md`
- `docs/modules/web-backtest.md`
- `docs/ux/screen-quality-checklist.md`

## Implementation Plan
1. Review canonical module and UX state contracts for the audited surfaces.
2. Run focused API backtest/report unit and parity tests.
3. Run DB-backed backtest and logs e2e tests sequentially.
4. Run focused web product/UX/i18n/a11y/responsive tests.
5. Run route-reachable i18n audit and repository guardrails.
6. Update planning/context source-of-truth files with the result.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within verification unless a confirmed failure creates a later fix task

## Acceptance Criteria
- Focused backtest/report API tests pass.
- Backtest and logs e2e tests pass.
- Focused web backtest/report/log/i18n/a11y/responsive tests pass.
- Route-reachable i18n audit reports zero findings.
- Any confirmed product defect becomes a scoped `SYSFIX-*` task.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented through validation
  evidence.
- [x] Focused automated coverage for touched surfaces passed.
- [x] Repository context and planning queue were synchronized.
- [x] No temporary workaround, mock-only behavior, or duplicated logic was
  introduced.

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
- speculative UI fixes without confirmed regression evidence

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/backtests/backtestDataGateway.test.ts src/modules/backtests/backtestFillModel.test.ts src/modules/backtests/backtestIndicatorTimelineSeries.test.ts src/modules/backtests/backtestParity3Symbols.test.ts src/modules/backtests/backtestPatternParityFixtures.test.ts src/modules/backtests/backtestRange.service.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestRunQueue.test.ts src/modules/backtests/backtestRuntimeKernelParity.test.ts src/modules/backtests/backtests.contract-remediation.test.ts src/modules/engine/runtimeBacktestParserParity.test.ts src/modules/reports/reports.service.test.ts` => PASS (`13` files / `94` tests).
  - `pnpm --filter api run test -- --run src/modules/backtests/backtests.e2e.test.ts` => PASS (`1` file / `14` tests).
  - `pnpm --filter api run test -- --run src/modules/logs/logs.e2e.test.ts` => PASS (`1` file / `3` tests).
  - `pnpm --filter web run test -- --run src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/components/BacktestsList.test.tsx src/features/backtest/components/BacktestsListView.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/logs/components/AuditTrailView.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx src/i18n/routeLocaleSmoke.test.ts src/app/dashboard/dashboard.a11y.smoke.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx src/ui/layout/dashboard/PageTitle.a11y.test.tsx` => PASS (`12` files / `33` tests).
  - `pnpm i18n:audit:route-reachable:web` => PASS (`findings=0`, `localCopy=0`, `fallbackPl=0`, `hardcoded=0`).
  - `pnpm run quality:guardrails` => PASS.
- Manual checks:
  - Reviewed `docs/modules/api-backtests.md`.
  - Reviewed `docs/modules/web-backtest.md`.
  - Reviewed `docs/ux/screen-quality-checklist.md`.
- Screenshots/logs: not required; this was automated verification against
  existing UX/a11y/responsive regression coverage.
- High-risk checks: no LIVE mutation, exchange write, schema change, or
  deployment-impacting behavior was introduced.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-backtests.md`
  - `docs/modules/web-backtest.md`
  - `docs/ux/screen-quality-checklist.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: current dashboard design system and screen quality
  checklist.
- Canonical visual target: current dashboard operational surfaces.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: yes.
- Visual-direction brief reviewed: not applicable; no broad UI change.
- Existing shared pattern reused: existing backtest, report, logs, dashboard
  layout, i18n, a11y, and responsive regression coverage.
- New shared pattern introduced: no.
- Design-memory entry reused: not applicable.
- Design-memory update required: no.
- Visual gap audit completed: automated regression coverage only; no new visual
  gap was confirmed.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: not required for this non-visual-change
  verification slice.
- Remaining mismatches: none found.
- Required states: loading, empty, error, success.
- Responsive checks: desktop, tablet, mobile via focused responsive regression.
- Input-mode checks: keyboard and pointer contracts through component/a11y
  regression coverage.
- Accessibility checks: dashboard a11y smoke and page-title accessible-name
  regression coverage passed.
- Parity evidence: route-reachable i18n audit and focused backtest/report/log
  product tests passed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: docs-only verification artifact; no runtime rollback needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: product QA coverage for backtests/reports/logs/i18n/UX needed closure
  after runtime/trading/config verification.
- Gaps: no confirmed gap before validation.
- Inconsistencies: none discovered.
- Architecture constraints: backtests/report/log surfaces must reuse current
  module contracts and existing route-localized UI patterns.

### 2. Select One Priority Task
- Selected task: `SYSFINAL-07`.
- Priority rationale: it is the next unchecked task in the active SYSFINAL
  sequence.
- Why other candidates were deferred: `SYSFINAL-08` depends on actual findings
  from this audit.

### 3. Plan Implementation
- Files or surfaces to modify: planning/context docs only.
- Logic: verification-only audit; convert failures into `SYSFIX-*` tasks
  instead of opportunistic fixes.
- Edge cases: DB-backed e2e tests run sequentially; route-reachable i18n audit
  run separately.

### 4. Execute Implementation
- Implementation notes: no product code changed. Created this task artifact and
  synchronized queue/context truth after validation.

### 5. Verify and Test
- Validation performed: focused API, DB e2e, web, i18n, and guardrail checks.
- Result: PASS; no `SYSFIX-*` task required.

### 6. Self-Review
- Simpler option considered: rely only on the full baseline from `SYSFINAL-02`.
- Technical debt introduced: no.
- Scalability assessment: focused coverage complements full baseline without
  adding new systems.
- Refinements made: DB-backed tests were kept sequential to avoid test data
  contention.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task artifact
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal update is not applicable.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: operator using dashboard, backtests, reports, and
  logs.
- Existing workaround or pain: none confirmed.
- Smallest useful slice: verification-only audit with focused coverage.
- Success metric or signal: all focused checks green and no findings.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: not required.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: create/list/read backtest, inspect report/parity
  diagnostics, inspect audit logs, navigate localized dashboard surfaces.
- SLI: focused test and i18n audit pass rate.
- SLO: all selected checks pass.
- Error budget posture: not applicable.
- Health/readiness check: not impacted.
- Logs, dashboard, or alert route: logs UI/API e2e coverage passed.
- Smoke command or manual smoke: automated focused checks listed above.
- Rollback or disable path: no runtime change.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: represented through API/web/e2e
  contract tests.
- Real API/service path used: yes, in API e2e and web client tests.
- Endpoint and client contract match: yes, validated by focused tests.
- DB schema and migrations verified: not changed.
- Loading state verified: yes, via existing component regression coverage.
- Error state verified: yes, via existing component regression coverage.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: yes.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for
  this verification-only product slice.
- Data classification: user account, backtest data, reports, logs.
- Trust boundaries: browser, API, DB.
- Permission or ownership checks: covered by backtest/log e2e scope.
- Abuse cases: not expanded; no new access path.
- Secret handling: not touched.
- Security tests or scans: not required beyond previously completed
  `SYSFINAL-03`.
- Fail-closed behavior: validated indirectly through backtest/log contract
  tests.
- Residual risk: production browser smoke remains part of `SYSFINAL-09`.

## Result Report
- Task summary: verified backtests, reports, logs, route-reachable i18n, and
  selected UX/a11y/responsive state coverage. No product discrepancies were
  found.
- Files changed: planning/context documentation only.
- How tested: focused API, e2e, web, i18n audit, and repository guardrails.
- What is incomplete: production closure smoke remains in `SYSFINAL-09`.
- Next steps: run `SYSFINAL-08` to convert findings into tiny `SYSFIX-*` tasks;
  because `SYSFINAL-02..07` found no defects, the expected output is an empty
  fix queue with explicit closure evidence.
- Decisions made: no `SYSFIX-*` tasks are required from `SYSFINAL-07`.
