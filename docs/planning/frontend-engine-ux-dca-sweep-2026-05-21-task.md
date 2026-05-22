# Task

## Header
- ID: FRONTEND-ENGINE-UX-DCA-SWEEP-2026-05-21
- Title: Verify frontend UX/runtime behavior and DCA-first backtest parity
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Coordinator
- Depends on: DASHBOARD-POST-LOGIN-PERF-2026-05-21
- Priority: P1
- Module Confidence Rows: SOAR-BACKTESTS-001, SOAR-DASHBOARD-001, SOAR-BOT-RUNTIME-001
- Requirement Rows: local UX/runtime confidence, DCA-first lifecycle parity
- Quality Scenario Rows: frontend responsiveness, runtime correctness, regression resistance
- Risk Rows: backtest/runtime parity drift, LIVE-sensitive UX action confirmation
- Iteration: 2026-05-21
- Operation Mode: BUILDER
- Mission ID: FRONTEND-ENGINE-UX-DCA-SWEEP-2026-05-21
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the selected builder/fix iteration.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence by repairing confirmed UX/runtime parity defects.

## Mission Block
- Mission objective: agent-assisted verification and repair of frontend UX/runtime issues plus DCA-first TTP/TSL ordering concerns.
- Release objective advanced: V1 local confidence for operator-facing Web flows and backtest/runtime lifecycle parity.
- Included slices: frontend UX code/test review, engine/backtest DCA ordering review, confirmed repairs, focused validation, source-of-truth updates.
- Explicit exclusions: production authenticated clickthrough, LIVE mutation, exchange-side order placement, new risk-confirmation UX design.
- Checkpoint cadence: after lane reports, after implementation, after validation, after state update.
- Stop conditions: protected production credentials, LIVE-money mutation, product decision required for risk confirmation UX, failing gate without safe local fix.
- Handoff expectation: local fixes verified; LIVE-sensitive riskAck UX follow-up remains explicit.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, state, docs | Integration, state updates | Mission closure | Parent gate | VERIFIED |
| Frontend/UX | Subagent + coordinator | Web modules/tests | Dashboard, bots monitoring, reports | Findings + fixes | Web focused tests | VERIFIED |
| Backend/Engine | Subagent + coordinator | Lifecycle architecture, engine/backtests | Backtest replay and portfolio parity | Confirmed defect + fix | API focused tests | VERIFIED |
| QA/Test | Subagent + coordinator | Existing tests | Regression gap report | New regression tests | API/Web test packs | VERIFIED |
| Documentation/Memory | Coordinator | Module docs/state | Source-of-truth updates | Updated docs/state | Guardrails/typecheck | VERIFIED |

## Context
The operator reported frontend UX concerns after login and suspected DCA order
drift where `TSL`/`TTP` could close before DCA had been used correctly.

## Goal
Find and repair confirmed local defects affecting frontend UX/runtime behavior
and DCA-first lifecycle parity without changing protected LIVE behavior.

## Scope
- `apps/api/src/modules/backtests/backtestReplayCore.ts`
- `apps/api/src/modules/backtests/backtestPortfolioSimulation.service.ts`
- `apps/api/src/modules/backtests/backtestReplayCore.test.ts`
- `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`
- `apps/web/src/features/bots/hooks/useBotsMonitoringController.ts`
- `apps/web/src/features/bots/components/BotsManagement.test.tsx`
- `apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx`
- `apps/web/src/features/reports/components/PerformanceReportsView.tsx`
- `apps/web/src/features/reports/components/PerformanceReportsView.test.tsx`
- relevant module docs and state files

## Implementation Plan
1. Delegate frontend, engine, and regression-scout lanes.
2. Confirm DCA-first architecture and code behavior.
3. Repair confirmed backtest `TTP` guard drift.
4. Repair confirmed frontend double-fetch and report partial-failure issues.
5. Add focused regression coverage.
6. Run focused tests, typechecks, and guardrails.
7. Update docs/state and residual risk.

## Acceptance Criteria
- Backtest isolated replay and interleaved portfolio do not close by `TTP`
  while affordable profit-side DCA remains pending.
- Runtime/PAPER existing DCA/TTP behavior remains green.
- Bots monitoring first aggregate open does not retrigger session loading via
  selected session state.
- Dashboard Home keeps runtime widgets rendered during auth bootstrap.
- Reports page tolerates one failed per-run report request.

## Definition of Done
- [x] Confirmed defects repaired with focused tests.
- [x] API and Web typechecks passed.
- [x] Repository guardrails passed.
- [x] Source-of-truth docs and state updated.
- [x] Residual LIVE-sensitive UX risk recorded separately.

## Forbidden
- LIVE exchange mutation.
- Production data mutation.
- Hidden riskAck behavior change without explicit UX/safety decision.
- Workaround paths or duplicated lifecycle engines.

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtests.contract-remediation.test.ts src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` -> PASS, `4` files / `99` tests.
  - `corepack pnpm --filter web exec vitest run src/app/dashboard/dashboard.a11y.smoke.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx src/features/bots/components/BotsManagement.test.tsx --run` -> PASS, `3` files / `22` tests.
- Manual checks: subagent read-only code reviews for frontend, engine, and regression gaps.
- High-risk checks: no LIVE mutation or production protected action performed.
- Module confidence ledger updated: yes, via project state/task board/system health and module docs.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/06_execution-lifecycle.md`, `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, backtest replay/portfolio `TTP` guard drift.
- Decision required from user: no for confirmed local parity repair.
- Follow-up architecture doc updates: module docs updated; architecture contract unchanged.

## UX/UI Evidence
- Design source type: not applicable.
- Required states: loading, empty, error, success.
- Responsive checks: not browser-proven in this slice.
- Accessibility checks: dashboard smoke regression.
- Parity evidence: focused Web tests and frontend subagent report.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the focused code/test changes if regression appears.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: suspected frontend UX defects and DCA close ordering drift.
- Gaps: missing post-login Dashboard page-level regression and missing backtest DCA/TTP parity tests.
- Architecture constraints: DCA-first lifecycle and no LIVE mutation without explicit approval.

### 2. Select One Priority Mission Objective
- Selected task: repair confirmed local UX/runtime and DCA-first parity defects.
- Priority rationale: affects operator trust in dashboard and trading lifecycle simulation.

### 3. Plan Implementation
- Files or surfaces to modify: scoped backend replay, web dashboard/bots/reports tests and components.
- Edge cases: pending profit-side DCA, report partial failure, auth bootstrap.

### 4. Execute Implementation
- Implementation notes: shared backtest helper guards close results; bot monitoring refresh uses selected-session ref; reports use parallel top-level fetch plus per-run `allSettled`.

### 5. Verify and Test
- Validation performed: focused API/Web tests, API/Web typecheck, guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: passing `dca` into backtest close pass. Rejected because replay already performs a dedicated DCA probe and that path risks double DCA semantics.
- Technical debt introduced: no.
- Scalability assessment: Reports still fan out up to 40 per-run requests; now partially degrades instead of page-level failure.

### 7. Update Documentation and Knowledge
- Docs updated: module docs and state files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report
- Task summary: confirmed and fixed backtest `TTP`/profit-side DCA guard drift plus frontend monitoring/reports UX defects.
- Files changed: listed in Scope.
- How tested: focused API/Web packs, typechecks, guardrails.
- What is incomplete: browser proof for the full route matrix and a product decision for explicit runtime action risk confirmations.
- Next steps: design and implement explicit confirmation UX for Dashboard Home runtime actions that currently send `riskAck: true`.
