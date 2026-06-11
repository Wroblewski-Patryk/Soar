# Task

## Header
- ID: LUC-2997
- Title: Resolve RC refresh summary strict helper missing-test rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2996](/LUC/issues/LUC-2996)
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph / release Ops RC refresh summary helper traceability
- Requirement Rows: REQ-DOC-031
- Risk Rows: RISK-ARCH-DEV-TOOLING-TRACEABILITY-2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2997-RC-REFRESH-SUMMARY-STRICT-HELPER-MISSING-TEST-ROWS-2026-06-08
- Mission Status: VERIFIED

## Context
[LUC-2996](/LUC/issues/LUC-2996) identified `scripts/runRcRefreshSummaryStrict.mjs#main`, `#parseArgs`, and `#run` as the first non-duplicate local-safe architecture-awareness missing-test family. [LUC-2252](/LUC/issues/LUC-2252) already covered the script-level wrapper contract, but the function-level anchors still needed focused proof.

## Goal
Make `scripts/runRcRefreshSummaryStrict.mjs` import-safe, add local helper tests that do not execute real RC/prod refresh commands, and add direct scanner-readable relation rows only for covered anchors.

## Scope
- `scripts/runRcRefreshSummaryStrict.mjs`
- `scripts/runRcRefreshSummaryStrict.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- project state and task evidence files

## Implementation Plan
1. Export `main`, `parseArgs`, and `run` behind a direct-CLI guard.
2. Inject `spawnSync`, console, argv, and exit dependencies for deterministic tests.
3. Cover help, argument parsing, strict/prod command selection, summary execution, and fail-closed status propagation.
4. Add direct relation rows for the three proven anchors.
5. Run focused checks and repository guardrails.

## Acceptance Criteria
- Syntax checks pass for script and test.
- Safe `--help` passes without running real gate commands.
- Focused Node test passes.
- Direct relation readback shows `3` rows for `#main`, `#parseArgs`, and `#run`.
- `pnpm run architecture:graph:generate` and `pnpm run quality:guardrails` pass.
- Architecture-awareness refresh is attempted when available or blocked with exact evidence.

## Definition of Done
- Focused local proof exists and passes.
- Scanner-readable relations exist only for covered anchors.
- No real RC/prod gate refresh, protected proof, secret, deploy, push, restart, rollback, database, account, exchange, order, position, payment/subscription, or live-trading mutation occurred.
- Project state is updated with evidence and residual risk.

## Validation Evidence
- `node --check scripts/runRcRefreshSummaryStrict.mjs` PASS.
- `node --check scripts/runRcRefreshSummaryStrict.test.mjs` PASS.
- `node scripts/runRcRefreshSummaryStrict.mjs --help` PASS.
- `node --test scripts/runRcRefreshSummaryStrict.test.mjs` PASS (`5/5`).
- Direct relation readback PASS (`3` rows).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
- `pnpm run quality:guardrails` PASS.
- Architecture-awareness refresh BLOCKED in this checkout because `scripts/build-architecture-awareness-index.mjs` is absent (`Test-Path` returned `False`).

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`, [LUC-2997](/LUC/issues/LUC-2997) issue context.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none beyond priority relation rows and graph generation.

## Security / Privacy Evidence
- Data classification: local release tooling helper proof only.
- Secret handling: no secrets read or written; tests use injected command runners.
- Fail-closed behavior: missing strict command status exits `1`.
- Residual risk: refreshed architecture-awareness top-list removal could not be observed locally because the refresh script is absent in this checkout.

## Result Report
- Task summary: added import-safe helper exports, focused local tests, and direct function-level relation rows for the RC refresh summary strict helper.
- Files changed: `scripts/runRcRefreshSummaryStrict.mjs`, `scripts/runRcRefreshSummaryStrict.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, state/evidence files.
- How tested: focused syntax/help/unit checks, direct relation readback, architecture graph generation, repository guardrails.
- What is incomplete: architecture-awareness refresh/top-list removal could not run from this checkout due to missing script.
- Next steps: parent [LUC-2996](/LUC/issues/LUC-2996) can consume this local proof; run architecture-awareness refresh in an environment where `scripts/build-architecture-awareness-index.mjs` exists if top-list readback is required.
