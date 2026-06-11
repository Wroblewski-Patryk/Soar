# LUC-3381 Static Issue Scan Helper Missing-Test Rows - 2026-06-11

## Header
- ID: LUC-3381
- Title: Resolve V1 static issue scan helper missing-test rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: architecture-awareness missing-test cleanup queue
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph / V1 static issue scan helper traceability
- Requirement Rows: REQ-DOC-031
- Risk Rows: RISK-ARCH-DEV-TOOLING-TRACEABILITY-2026-06-07
- Iteration: Paperclip heartbeat 2026-06-11
- Operation Mode: TESTER
- Mission ID: LUC-3381-STATIC-ISSUE-SCAN-HELPER-MISSING-TEST-ROWS-2026-06-11
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task was selected.
- [x] Operation mode selected as QA/Test verification work.
- [x] Affected source-of-truth docs/state were identified.
- [x] The task improves release confidence by closing local helper traceability rows.

## Mission Block
- Mission objective: resolve or classify the current `scripts/runV1StaticIssueScan.mjs` missing-test helper family.
- Release objective advanced: reduce repeated V1 architecture-awareness missing-test churn without claiming protected production readiness.
- Included slices: import-safe helper exports, focused local Node test, direct priority-test relation rows, validation and evidence updates.
- Explicit exclusions: no real V1 static issue scan evidence refresh, no production proof, no deploy, no push, no account/secret/API-key/exchange/database/live-trading mutation.
- Stop conditions: focused tests fail, helper CLI behavior regresses, or validation reveals an architecture mismatch.
- Handoff expectation: no follow-up remains on LUC-3381; future lanes should continue with the next non-duplicate architecture-awareness top family.

## Context
`docs/status/architecture-awareness-report.md` listed `scripts/runV1StaticIssueScan.mjs` helper anchors in top actionable missing-test links. Prior cleanup lanes resolved equivalent local helper families by making scripts import-safe, adding injected local tests, and adding direct scanner-readable rows to `docs/architecture/relations/priority-test-links.csv`.

## Goal
Add focused local proof and direct test-relation evidence for the V1 static issue scan helper anchors while preserving direct CLI behavior.

## Scope
- `scripts/runV1StaticIssueScan.mjs`
- `scripts/runV1StaticIssueScan.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- project evidence/state files for this task

## Implementation Plan
1. Make `runV1StaticIssueScan.mjs` import-safe behind a direct CLI guard.
2. Export deterministic helpers and inject argv/console/write/timestamp dependencies for tests.
3. Add a temporary-repository Node test covering parser defaults, file helpers, source classification, project-index collectors, source marker scanning, aggregate scan building, Markdown/JSON output, JSON retry, and grouping.
4. Add direct scanner-readable rows for all static issue scan helper anchors listed by architecture-awareness.
5. Run focused syntax/test checks, relation readback, guardrails, and graph generation where possible.

## Acceptance Criteria
- [x] Direct CLI entrypoint remains guarded and usable.
- [x] Focused Node test covers deterministic helper behavior without scanning or writing real release evidence.
- [x] `docs/architecture/relations/priority-test-links.csv` contains direct [LUC-3381](/LUC/issues/LUC-3381) rows for all targeted helper anchors.
- [x] Relevant validation results are recorded.

## Definition of Done
- [x] No workaround paths introduced.
- [x] Existing static scan behavior preserved.
- [x] Focused proof passes.
- [x] Repository guardrails pass.
- [x] Residual validation risk documented.

## Validation Evidence
- Tests:
  - `node --check scripts/runV1StaticIssueScan.mjs` PASS.
  - `node --test scripts/runV1StaticIssueScan.test.mjs` PASS (`8/8`).
  - `pnpm run quality:guardrails` PASS.
- Manual checks:
  - Direct relation readback PASS: `rg -n "LUC-3381" docs/architecture/relations/priority-test-links.csv` returned `22` rows.
  - No leftover `chrome-headless-shell` process found.
- Validation not completed:
  - `pnpm run architecture:graph:generate` failed twice with Windows filesystem `UNKNOWN` while opening `docs/graphs/architecture-graph.json`. This is recorded as an environment/file-lock residual, not a code/test failure. Guardrails still reported architecture graph drift `OK (0 missing representative paths)`.
- Reality status: verified local helper proof / traceability refreshed.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`, prior helper cleanup task patterns.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: direct relation rows added; generated graph refresh could not complete due filesystem write error.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the helper export/test/relation rows if needed.

## Autonomous Loop Evidence

### 1. Analyze Current State
- `scripts/runV1StaticIssueScan.mjs` existed as direct CLI code with no adjacent focused test.
- Architecture-awareness listed its helper anchors as actionable missing-test rows.

### 2. Select One Priority Mission Objective
- Selected task: close the [LUC-3381](/LUC/issues/LUC-3381) static issue scan helper family.
- Other candidates deferred: unrelated dirty worktree changes and unrelated architecture-awareness rows.

### 3. Plan Implementation
- Make the helper import-safe and test it with a controlled temporary repo fixture.
- Add direct relation rows for the scanner.

### 4. Execute Implementation
- Added exports and a direct CLI guard to `scripts/runV1StaticIssueScan.mjs`.
- Added `scripts/runV1StaticIssueScan.test.mjs`.
- Added `22` direct [LUC-3381](/LUC/issues/LUC-3381) relation rows.

### 5. Verify and Test
- Focused syntax/test checks and guardrails passed.
- Graph generation blocked by repeated Windows filesystem write error.

### 6. Self-Review
- Scope stayed local-helper-only.
- No production, protected, account, exchange, database, or live-trading behavior was executed or changed.
- The helper defaults still use current process argv, console, writeFile, and current UTC timestamp when run directly.

### 7. Update Documentation and Knowledge
- Task packet created.
- State and context files updated with verification result and residual risk.

## Result Report
- Task summary: [LUC-3381](/LUC/issues/LUC-3381) resolved the V1 static issue scan helper missing-test rows with focused local proof and direct scanner-readable relations.
- Files changed:
  - `scripts/runV1StaticIssueScan.mjs`
  - `scripts/runV1StaticIssueScan.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - evidence/state files for this task
- How tested: syntax check, focused Node test, relation readback, guardrails.
- What is incomplete: graph generation could not rewrite `docs/graphs/architecture-graph.json` because of repeated Windows filesystem `UNKNOWN` open errors.
- Next steps: continue with the next non-duplicate architecture-awareness missing-test family after a future graph/awareness refresh.
- Decisions made: local helper proof does not count as V1 runtime/protected production evidence.
