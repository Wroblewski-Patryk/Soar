# LUC-2678 RC Signoff And SLO Window Missing-Test Links - 2026-06-07

## Header
- ID: LUC-2678
- Title: [Soar][Architecture QA][LUC-2675] Cover RC signoff and SLO window missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Test Automation Engineer
- Depends on: [LUC-2675](/LUC/issues/LUC-2675)
- Priority: P1
- Operation Mode: TESTER
- Mission ID: LUC-2678-RC-SIGNOFF-SLO-WINDOW-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
The architecture-awareness report generated `2026-06-07T04:42:13.421Z`
still listed release/operations script helper anchors after
[LUC-2674](/LUC/issues/LUC-2674) covered
`scripts/buildRcExternalGateStatus.mjs`. The remaining focused families for
this lane were `scripts/buildRcSignoffRecord.mjs` and
`scripts/buildSloWindowReport.mjs`.

## Goal
Add focused local proof and scanner-readable test relations for RC signoff and
SLO window report helper contracts without running protected release,
production, deploy, credential, account, exchange, database, or live-trading
actions.

## Constraints
- Reuse existing Node test style and release tooling contracts.
- Keep CLI behavior intact while making helpers import-safe.
- Test fixture data only; do not run protected release, production, or SLO
  collection actions.
- Preserve unrelated dirty worktree changes from adjacent active lanes.

## Definition of Done
- `scripts/buildRcSignoffRecord.mjs` is import-safe for direct local tests.
- `scripts/buildSloWindowReport.mjs` is import-safe for direct local tests.
- Focused Node tests cover current helper contracts and inert CLI write paths.
- `docs/architecture/relations/priority-test-links.csv` has direct
  `LUC-2678` rows for exact current anchors in this lane.
- Focused proof, architecture graph generation, and repository guardrails pass.

## Forbidden
- No deploy, push, restart, rollback, production smoke, protected account,
  secret, exchange, database, or live-trading mutation.
- No workaround or parallel release gate implementation.
- No broad workspace typecheck/build unless required by the touched scope.

## Implementation
- Made `scripts/buildRcSignoffRecord.mjs` import-safe with a direct-run guard
  and exported existing helper functions for test-only access.
- Added `scripts/buildRcSignoffRecord.test.mjs` covering:
  - CLI parsing and timestamp override handling;
  - external gate status line parsing and loading;
  - required/recommended approver-field classification;
  - fail-closed signoff evaluation;
  - approver/owner block rendering and full signoff record rendering;
  - inert `main` write behavior against temporary fixture files.
- Made `scripts/buildSloWindowReport.mjs` import-safe with a direct-run guard
  and exported existing helper functions for test-only access.
- Added `scripts/buildSloWindowReport.test.mjs` covering:
  - CLI parsing and numeric/date/percentage formatting helpers;
  - SLO artifact discovery/loading from the expected artifact name family;
  - window summarization, environment rollup, objective counts, and queue
    breach detection;
  - markdown rendering;
  - inert `main` JSON/markdown write behavior against temporary fixture files.
- Added scanner-readable `LUC-2678` relation rows for the exact
  `buildRcSignoffRecord` and `buildSloWindowReport` anchors named by the issue.

## Validation Evidence
- `node --check scripts/buildRcSignoffRecord.mjs` PASS.
- `node --check scripts/buildRcSignoffRecord.test.mjs` PASS.
- `node --check scripts/buildSloWindowReport.mjs` PASS.
- `node --check scripts/buildSloWindowReport.test.mjs` PASS.
- `node --test scripts/buildRcSignoffRecord.test.mjs scripts/buildSloWindowReport.test.mjs scripts/releaseOpsScriptContracts.test.mjs`
  PASS (`12/12`).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- `pnpm run quality:guardrails` PASS.

## Result Report
- Reality status: verified.
- Files changed:
  - `scripts/buildRcSignoffRecord.mjs`
  - `scripts/buildRcSignoffRecord.test.mjs`
  - `scripts/buildSloWindowReport.mjs`
  - `scripts/buildSloWindowReport.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture graph outputs from `pnpm run architecture:graph:generate`
  - project state/task evidence files
- Commit: not committed; worktree contains substantial pre-existing dirty
  changes from adjacent active architecture/test lanes, so this heartbeat kept
  source-control closure to scoped evidence and issue disposition.
- Push status: not needed.
- Deploy impact: none.
- Residual risk: exact architecture-awareness top-sample removal is not
  claimed here because this lane ran local graph generation and relation proof,
  not a fresh external architecture-awareness scanner refresh.
