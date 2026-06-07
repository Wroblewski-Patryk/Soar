# LUC-2646 Architecture Graph Drift Script Missing-Test Links - 2026-06-07

## Header
- ID: LUC-2646
- Title: [Soar][Architecture QA][LUC-2644] Cover architecture graph drift script missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2644](/LUC/issues/LUC-2644)
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph relation confidence
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: local architecture traceability/tooling confidence
- Risk Rows: no new production risk; existing protected production blockers unchanged
- Operation Mode: TESTER
- Mission ID: LUC-2646-ARCHITECTURE-GRAPH-DRIFT-SCRIPT-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2644](/LUC/issues/LUC-2644) delegated this Test Automation child to repair
or justify missing-test links for `scripts/auditArchitectureGraphDrift.mjs`
helper anchors. The previous graph drift relation only mapped the script to an
aggregate guardrail test, so function-level scanner samples could remain
unlinked.

## Goal
Provide focused local proof for the architecture graph drift audit helpers and
add scanner-readable relation rows that connect the helper anchors to that
proof.

## Scope
- `scripts/auditArchitectureGraphDrift.mjs`
- `scripts/auditArchitectureGraphDrift.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated graph/drift artifacts produced by existing project commands
- Soar state/context files updated for this issue

## Implementation Plan
1. Make the drift audit script import-safe and export existing helper logic.
2. Add a focused `node:test` file using temporary mini-repo fixtures.
3. Add direct `LUC-2646` rows to `priority-test-links.csv`.
4. Run focused proof, strict drift audit, graph generation, and guardrails.
5. Record durable evidence and update source-of-truth state.

## Acceptance Criteria
- `node --test scripts/auditArchitectureGraphDrift.test.mjs` passes.
- `pnpm run architecture:graph:drift:strict` reports `0` missing paths.
- `pnpm run architecture:graph:generate` passes.
- `pnpm run quality:guardrails` passes.
- No deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation occurs.

## Definition of Done
- Focused helper proof exists and passes.
- Architecture relation rows map current helper anchors to focused proof.
- Existing architecture graph and guardrail contracts remain passing.
- Task evidence and project state are updated.

## Result Report
Implemented and verified local Test Automation proof for
`scripts/auditArchitectureGraphDrift.mjs`.

Changed:
- Made `scripts/auditArchitectureGraphDrift.mjs` import-safe with a direct-run
  guard and exported `toRepoPath`, `walk`, `parseCsv`, `collectCoveredPaths`,
  `inventory`, `summarizeDrift`, `buildDriftAudit`, `formatDriftMarkdown`,
  `writeDriftAudit`, and `main`.
- Added `scripts/auditArchitectureGraphDrift.test.mjs` covering CSV parsing,
  path normalization, dependency-directory skipping, covered-path collection,
  representative inventory rollup, markdown/json artifact writing, and
  strict-mode exit behavior.
- Added direct `LUC-2646` rows to
  `docs/architecture/relations/priority-test-links.csv`.

Verification:
- `node --test scripts/auditArchitectureGraphDrift.test.mjs` PASS (`5/5`).
- `pnpm run architecture:graph:drift:strict` PASS (`846/846` covered, `0`
  missing).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- `pnpm run quality:guardrails` PASS.

Boundary:
- Local tooling proof and scanner-readable traceability only.
- No deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation occurred.

Residual risk:
- Exact external architecture-awareness top-sample removal is not claimed from
  this checkout; this lane proves focused local helper tests, graph drift
  strict coverage, graph generation, and repository guardrails.

Next owner:
- No follow-up owner is required for [LUC-2646](/LUC/issues/LUC-2646).
- Future refreshed architecture-awareness regressions should route through the
  architecture tooling/coordinator lane.
