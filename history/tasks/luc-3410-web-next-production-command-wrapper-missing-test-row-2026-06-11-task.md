# LUC-3410 Web Next Production Command Wrapper Missing-Test Row

## Header
- ID: LUC-3410
- Title: [Soar][QA] Resolve Web Next production command wrapper function missing-test row
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Mission ID: LUC-3410-WEB-NEXT-PRODUCTION-COMMAND-WRAPPER-2026-06-11
- Mission Status: VERIFIED

## Context
The architecture-awareness report listed `scripts/runWebNextProductionCommand.mjs#run` as an actionable missing-test row. Existing evidence only had a script-level wrapper relation from [LUC-2420](/LUC/issues/LUC-2420), not direct function-level proof for the production command runner.

## Goal
Make the Web Next production command wrapper import-safe and add focused local tests plus scanner-readable relations for the missing function row without running a real Next build/start service.

## Scope
- `scripts/runWebNextProductionCommand.mjs`
- `scripts/runWebNextProductionCommand.test.mjs`
- `scripts/releaseOpsScriptContracts.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- source-of-truth task/state notes for [LUC-3410](/LUC/issues/LUC-3410)

## Implementation Plan
1. Refactor the wrapper behind a direct CLI guard while preserving package-script behavior.
2. Export injectable `parseArgs`, `run`, and `main` helpers.
3. Add focused `node:test` proof for parsing, spawn contract, metadata-before-build ordering, start host/port defaults, explicit arg preservation, and fail-closed error handling.
4. Add direct scanner-readable priority-test links for [LUC-3410](/LUC/issues/LUC-3410).
5. Run the smallest relevant checks and record evidence.

## Acceptance Criteria
- Importing the wrapper in tests does not execute, spawn Next, or call `process.exit`.
- Direct CLI behavior still accepts only `build` and `start`.
- `build` still writes Web build metadata before invoking Next.
- `start` still defaults to `PORT || 3002` and `0.0.0.0` unless explicit port/host args are supplied.
- Direct relation rows exist for the function-level missing-test family.

## Definition of Done
- Focused syntax and unit proof pass.
- Release Ops script contract aggregate remains green.
- Direct relation readback for [LUC-3410](/LUC/issues/LUC-3410) passes.
- No real production build/start, deploy, push, restart, protected proof, secret, database, exchange, account/payment, order, position, or live-trading mutation occurs.

## Validation Evidence
- `node --check scripts/runWebNextProductionCommand.mjs` -> PASS.
- `node --check scripts/runWebNextProductionCommand.test.mjs` -> PASS.
- `node --test scripts/runWebNextProductionCommand.test.mjs` -> PASS (`7/7`).
- `node --test scripts/releaseOpsScriptContracts.test.mjs scripts/runWebNextProductionCommand.test.mjs` -> PASS.
- Direct relation readback for [LUC-3410](/LUC/issues/LUC-3410) -> PASS (`3` rows).
- No leftover `chrome-headless-shell` process found.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: direct priority test link rows added.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert `scripts/runWebNextProductionCommand.mjs`, `scripts/runWebNextProductionCommand.test.mjs`, and the [LUC-3410](/LUC/issues/LUC-3410) relation rows if needed.

## Result Report
- Task summary: resolved the Web Next production command wrapper function missing-test row with import-safe injected helper proof.
- Files changed: `scripts/runWebNextProductionCommand.mjs`, `scripts/runWebNextProductionCommand.test.mjs`, `scripts/releaseOpsScriptContracts.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, and state/evidence notes.
- How tested: focused Node syntax/tests, release Ops aggregate contract, direct relation readback, leftover browser-process check.
- What is incomplete: architecture-awareness top-list disappearance was not re-observed because this checkout does not provide the canonical awareness refresh script.
- Next steps: PM/Architecture memory can refresh architecture-awareness in the environment that provides the generator before routing the next non-duplicate row.
