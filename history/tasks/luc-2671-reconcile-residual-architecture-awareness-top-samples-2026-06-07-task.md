# LUC-2671 Reconcile Residual Architecture-Awareness Top Samples

## Header
- ID: LUC-2671
- Title: [Soar][Architecture QA][LUC-2668] Reconcile residual architecture-awareness top samples
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2668](/LUC/issues/LUC-2668)
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph relation confidence
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: architecture traceability / scanner hygiene
- Risk Rows: no new product/runtime risk
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2671-RECONCILE-RESIDUAL-ARCHITECTURE-AWARENESS-TOP-SAMPLES-2026-06-07
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps were represented.
- [x] Exactly one priority task was selected.
- [x] Operation mode is TESTER for this Test Automation verification lane.
- [x] The task is aligned with repository source-of-truth documents and the active Paperclip issue.
- [x] Affected module confidence row was identified.
- [x] Requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release evidence traceability without broadening into product runtime work.

## Mission Block
- Mission objective: classify the current residual top actionable missing-test samples from `docs/status/architecture-awareness-report.md` and repair only non-duplicate scanner-readable relation gaps.
- Release objective advanced: Soar V1 audit-to-completion evidence graph confidence.
- Included slices: report readback, relation CSV readback, focused test proof readback, relation-row repair, graph/guardrail verification, state evidence.
- Explicit exclusions: deploy, push, restart, rollback, production smoke, credentials, accounts, exchange state, database state, live-trading mutation, and new duplicate behavioral tests for already completed proof lanes.
- Stop conditions: focused proof, graph generation, and guardrails pass; false-positive fixture functions are routed as scanner refinement rather than covered by duplicate tests.
- Handoff expectation: [LUC-2672](/LUC/issues/LUC-2672) owns architecture-awareness scanner refinement for test-file fixture false positives after this local relation repair.

## Context
[LUC-2668](/LUC/issues/LUC-2668) found that the architecture-awareness report generated `2026-06-07T04:12:30.440Z` still listed top actionable missing-test samples for families recently covered by completed proof lanes [LUC-2650](/LUC/issues/LUC-2650), [LUC-2656](/LUC/issues/LUC-2656), and [LUC-2664](/LUC/issues/LUC-2664).

## Goal
Reconcile those residual top samples without reopening duplicate proof lanes.

## Classification

| Sample family | Classification | Evidence |
| --- | --- | --- |
| `scripts/auditRouteReachableI18n.mjs#collectPatternMatches`, `#isAuditExcludedFile`, `#isSharedFoundationFile`, `#resolveAliasImport`, `#safeRelativeLine`, `#visit` | relation row missing / already covered by completed lane | `scripts/auditRouteReachableI18n.test.mjs` imports and exercises the helpers directly or through `readImports`; added `LUC-2671` relation rows pointing to the existing [LUC-2650](/LUC/issues/LUC-2650) proof file. |
| `scripts/buildObsidianVaultLayer.mjs#buildObsidianVaultLayer`, `#splitRefs`, `#statusOrder`, `#table`, `#walkFiles`, `#wiki`, `#write`, `#writeCanvas` | relation row missing / already covered by completed lane | `scripts/buildObsidianVaultLayer.test.mjs` covers formatter, walk, canvas, and generator import-safety paths; added `LUC-2671` relation rows pointing to the existing [LUC-2656](/LUC/issues/LUC-2656) proof file. |
| `scripts/buildProjectIndex.mjs#buildIndex`, `#buildV1WorkMap`, collection helpers, filesystem helpers, `#main`, `#nextRouteFromPage`, `#parseArgs` | already covered by completed lane | Existing [LUC-2664](/LUC/issues/LUC-2664) rows already map these anchors to `scripts/buildProjectIndex.test.mjs`; focused proof passed again. |
| `scripts/buildProjectIndex.mjs#matrixPath` | relation row missing / already covered by completed lane | `scripts/buildProjectIndex.test.mjs` covers V1 matrix/default path behavior through `parseArgs`, `buildV1WorkMap`, and render paths; added a `LUC-2671` row. |
| `scripts/auditArchitectureGraphDrift.test.mjs#Page` and route fixture functions in `scripts/auditRouteReachableI18n.test.mjs` (`BotPanel`, `Card`, `Layout`, `Page`, `Root`, `Shared`) | scanner inference stale / needs refinement | These are functions inside `.test.mjs` fixture strings or test files, not production implementation anchors requiring additional tests. No duplicate tests were added. |

## Implementation Plan
1. Read the current architecture-awareness report and relation CSV.
2. Compare visible top samples with existing completed lane artifacts and focused tests.
3. Add missing scanner-readable relation rows only where existing proof already covers the anchor.
4. Verify focused tests, graph generation, and guardrails.
5. Record state and route scanner false-positive refinement separately.

## Acceptance Criteria
- Residual top samples are classified as already covered, stale scanner inference, missing relation row, or true remaining proof gap.
- Missing relation rows for already covered anchors are repaired in `docs/architecture/relations/priority-test-links.csv`.
- No duplicate behavioral tests are added for [LUC-2650](/LUC/issues/LUC-2650), [LUC-2656](/LUC/issues/LUC-2656), or [LUC-2664](/LUC/issues/LUC-2664).
- Focused local proof and architecture guardrails pass.

## Definition of Done
- [x] Classification recorded.
- [x] Missing relation rows added for existing proof anchors.
- [x] Focused tests pass.
- [x] Architecture graph generation passes.
- [x] Repository guardrails pass.
- [x] Scanner fixture-function false positives are not treated as true product proof gaps.

## Validation Evidence
- Tests: `node --test scripts/auditRouteReachableI18n.test.mjs scripts/buildObsidianVaultLayer.test.mjs scripts/buildProjectIndex.test.mjs` PASS (`18/18`).
- Manual checks: `rg -n "LUC-2671" docs/architecture/relations/priority-test-links.csv` read back `15` added rows.
- Architecture graph: `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
- Guardrails: `pnpm run quality:guardrails` PASS.
- High-risk checks: no high-risk runtime path touched.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable for behavior; relation confidence evidence updated.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/architecture/relations/priority-test-links.csv`
  - [LUC-2650](/LUC/issues/LUC-2650), [LUC-2656](/LUC/issues/LUC-2656), and [LUC-2664](/LUC/issues/LUC-2664) task artifacts
- Fits approved architecture: yes.
- Mismatch discovered: yes, limited to scanner inference treating test-file fixture functions as actionable implementation.
- Decision required from user: no.
- Follow-up architecture doc updates: relation CSV updated; scanner refinement should exclude `.test.*` fixture functions from actionable implementation samples.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the `LUC-2671` relation rows if needed.
- Observability or alerting impact: none.

## Result Report
Implemented and verified a local relation-only reconciliation for residual top samples.

Changed:
- Added `15` `LUC-2671` scanner-readable rows to `docs/architecture/relations/priority-test-links.csv`.

Verified:
- Focused script tests passed (`18/18`).
- Architecture graph generation passed.
- Repository guardrails passed.

Residual risk:
- Exact external architecture-awareness top-sample removal is not claimed because the external architecture-awareness builder is not exposed in this checkout. The local graph accepted the relation rows.
- Test-file fixture functions still require scanner refinement; they are not true product proof gaps. Follow-up [LUC-2672](/LUC/issues/LUC-2672) was created for the Technical Solution Architect.

Forbidden:
- No deploy, push, restart, rollback, production smoke, production browser, credential/account mutation, secret printing, exchange mutation, database mutation, or live-trading action occurred.
