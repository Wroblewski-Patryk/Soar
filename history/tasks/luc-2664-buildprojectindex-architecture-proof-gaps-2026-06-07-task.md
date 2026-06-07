# LUC-2664 buildProjectIndex Architecture Proof Gaps

## Header
- ID: LUC-2664
- Title: [Soar] Cover buildProjectIndex architecture proof gaps
- Task Type: test
- Current Stage: verification
- Status: VERIFIED
- Owner: QA/Test
- Priority: P1
- Operation Mode: TESTER
- Mission ID: LUC-2664-BUILDPROJECTINDEX-ARCHITECTURE-PROOF-GAPS-2026-06-07
- Mission Status: VERIFIED

## Context
The architecture-awareness report names `scripts/buildProjectIndex.mjs` helper
anchors as implemented but needing direct proof links beyond the older
aggregate reusable-audit tooling relation.

Baseline dirty-state before this lane was broad and pre-existing, including
state/context files, generated architecture outputs, API/Web tests, runtime
code, script tests, and `docs/architecture/relations/priority-test-links.csv`.
This lane preserved unrelated changes and only added the buildProjectIndex
proof slice.

## Goal
Add focused local `node:test` proof and scanner-readable relation rows for the
current `scripts/buildProjectIndex.mjs` helper/CLI anchors without changing the
project-index output contract.

## Constraints
- No deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation.
- Keep the script behavior-compatible for direct CLI use.
- Use temporary output paths during CLI proof so no project-index artifacts are
  written under `history/audits`.
- Do not revert or stage unrelated dirty work.

## Definition of Done
- `scripts/buildProjectIndex.mjs` is import-safe for focused tests while still
  running as a CLI when invoked directly.
- Focused tests cover CLI args/help, route mapping, filesystem helpers, V1
  work-map linking, markdown rendering, and the real CLI write path.
- `docs/architecture/relations/priority-test-links.csv` contains direct
  `LUC-2664` rows from the script anchors to the new test file.
- Focused proof, architecture graph generation, and guardrails pass.

## Implementation Notes
- Added import-safety to `scripts/buildProjectIndex.mjs` by guarding `main()`
  behind direct execution detection.
- Exported the existing helper functions for direct `node:test` coverage.
- Added `scripts/buildProjectIndex.test.mjs` with eight focused tests:
  - argument parsing and default output paths;
  - help output;
  - Next app route mapping;
  - filesystem helper behavior and ignored-directory walking;
  - token/list/path rendering helpers;
  - V1 work-map linking from matrix rows to API/Web/routes/workers/scripts/tests;
  - markdown rendering output;
  - direct CLI execution writing markdown and JSON to temporary absolute paths.
- Added direct `LUC-2664` priority test-link rows for current script anchors.

## Validation Evidence
- Syntax: `node --check scripts/buildProjectIndex.mjs` PASS.
- Focused tests: `node --test scripts/buildProjectIndex.test.mjs` PASS
  (`8/8`).
- Architecture graph: `pnpm run architecture:graph:generate` PASS
  (`653` nodes / `842` relations / `27` chains).
- Guardrails: `pnpm run quality:guardrails` PASS.
- Reality status: implemented and verified locally.

## Result Report
- Files changed by this lane:
  - `scripts/buildProjectIndex.mjs`
  - `scripts/buildProjectIndex.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture graph/status artifacts refreshed by
    `pnpm run architecture:graph:generate`
  - this task packet
- Architecture entities affected:
  - `feature:buildprojectindex-mjs:2c3679d7c0`
  - `function:buildindex:7d933d70c9`
  - `function:buildv1workmap:627a914588`
  - helper function anchors under `scripts/buildProjectIndex.mjs`
- Architecture alignment: fits the existing Architecture Evidence Graph
  relation model; no ownership, runtime, API, database, or deployment topology
  change.
- Exact architecture-awareness top-sample removal: not claimed; this lane ran
  graph generation and direct relation proof, not a full external
  architecture-awareness refresh.
- Commit status: not committed because the worktree contains broad pre-existing
  unrelated dirty state from adjacent Soar lanes.
- Push status: not needed.
- Deploy impact: none.
- Residual risk: unrelated dirty files remain outside this lane and were not
  validated or modified by this task.

## Forbidden
- Production probes, protected smoke, secret handling, deployment/restart,
  temporary bypasses, or broad architecture rewrites.
