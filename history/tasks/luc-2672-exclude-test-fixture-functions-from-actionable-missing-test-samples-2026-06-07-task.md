# LUC-2672 Exclude Test Fixture Functions From Actionable Missing-Test Samples

## Header
- ID: LUC-2672
- Title: [Soar][Architecture Awareness][LUC-2671] Exclude test fixture functions from actionable missing-test samples
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Technical Solution Architect
- Depends on: [LUC-2671](/LUC/issues/LUC-2671)
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph scanner hygiene
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: architecture traceability / scanner hygiene
- Risk Rows: no product/runtime risk
- Iteration: 2026-06-07
- Operation Mode: ARCHITECT
- Mission ID: LUC-2672-EXCLUDE-TEST-FIXTURE-FUNCTIONS-FROM-ACTIONABLE-MISSING-TEST-SAMPLES-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2671](/LUC/issues/LUC-2671) reconciled residual top architecture-awareness samples and found that functions inferred from `.test.*` files and fixture/support paths were still listed as actionable missing-test gaps. Those functions are test scaffolding, not implementation anchors needing duplicate tests.

## Goal
Classify test fixture/support functions as inferred-link noise so architecture-awareness reports keep raw visibility while excluding those functions from actionable missing-test samples.

## Scope
- External Softwarehouse scanner: `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs`
- Soar generated exports refreshed by the scanner:
  - `docs/graphs/architecture-awareness.json`
  - `docs/graphs/architecture-awareness.csv`
  - `docs/graphs/architecture-health.json`
  - `docs/graphs/architecture-proof-register.csv`
  - `docs/graphs/architecture-graph.md`
  - `docs/graphs/architecture-graph.mmd`
  - `docs/status/architecture-awareness-report.md`
  - `docs/status/architecture-dependency-report.md`
  - `docs/status/architecture-ownership-report.md`
  - `docs/status/task-synchronization-report.md`
- Project state/evidence updates only.

## Implementation Plan
1. Add a scanner path classifier for test and fixture/support files.
2. Treat function entities from those paths as `test_fixture_function` inferred-link noise.
3. Refresh Soar architecture-awareness exports.
4. Verify the prior fixture samples no longer appear in actionable missing-test output.
5. Run repository guardrails and record evidence.

## Acceptance Criteria
- `.test.*`, `__fixtures__`, fixture, mock, stub, test-support, and e2e/integration fixture functions are excluded from actionable missing-test samples.
- Raw missing-link visibility remains preserved through classified noise.
- Soar architecture-awareness report includes a `test_fixture_function` bucket.
- The specific [LUC-2671](/LUC/issues/LUC-2671) fixture samples are not actionable after refresh.

## Definition of Done
- [x] Scanner classifier updated.
- [x] Soar awareness exports refreshed.
- [x] Prior fixture samples verified absent from actionable missing-test rows.
- [x] Guardrails passed.
- [x] No production/runtime mutation occurred.

## Validation Evidence
- Syntax: `node --check scripts/build-architecture-awareness-index.mjs` PASS from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse`.
- Refresh: `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` PASS (`14807` entities / `23756` relations / `9616` files).
- Report readback: `docs/status/architecture-awareness-report.md` generated `2026-06-07T04:42:13.421Z`, actionable missing-test count `510`, classified inferred-link noise `7418`, `test_fixture_function: 62`.
- Fixture-sample check: inline Node readback confirmed these paths are not actionable: `scripts/auditArchitectureGraphDrift.test.mjs#Page`, `scripts/auditRouteReachableI18n.test.mjs#BotPanel`, `#Card`, `#Layout`, `#Page`, `#Root`, and `#Shared`.
- Guardrails: `pnpm run quality:guardrails` PASS.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/graphs/architecture-health.json`
  - `history/tasks/luc-2671-reconcile-residual-architecture-awareness-top-samples-2026-06-07-task.md`
- Fits approved architecture: yes.
- Mismatch discovered: yes, scanner classification treated test fixture functions as actionable implementation gaps.
- Decision required from user: no.
- Follow-up architecture doc updates: refreshed generated awareness exports and project state.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the scanner classifier change and rerun the awareness refresh if this classification is too broad.
- Observability or alerting impact: none.

## Result Report
Implemented and verified scanner hygiene for [LUC-2672](/LUC/issues/LUC-2672).

Changed:
- `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs` now classifies test fixture/support functions as `test_fixture_function` inferred-link noise.
- Soar architecture-awareness generated exports were refreshed.

Verified:
- Scanner syntax check passed.
- Soar awareness refresh passed.
- Fixture samples from [LUC-2671](/LUC/issues/LUC-2671) no longer appear as actionable missing-test rows.
- Repository guardrails passed.

Residual risk:
- The change is path-pattern based. It intentionally preserves raw missing-link counts and only affects the actionable/noise split.

Forbidden:
- No deploy, push, restart, rollback, production smoke, production browser, credential/account mutation, secret printing, exchange mutation, database mutation, or live-trading action occurred.
