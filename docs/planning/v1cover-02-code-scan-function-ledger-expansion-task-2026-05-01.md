# Task

## Header
- ID: V1COVER-02
- Title: Expand V1 function coverage ledger from code-scan inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1COVER-01
- Priority: P0

## Context
The first V1 function ledger intentionally focused on money-path, runtime, and
release-gate confidence. The operator then asked for another project scan to
check whether all functions are listed before starting a deeper code-coverage
audit.

## Goal
Expand the V1 coverage ledger so every primary top-level API/web module surface
found in the code scan has at least one auditable row.

## Scope
- `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`
- `docs/operations/v1-function-coverage-audit-2026-05-01.md`
- `outputs/v1-function-coverage-audit-2026-05-01/Soar V1 Function Coverage Audit 2026-05-01.xlsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Scan API module directories, route files, web dashboard routes, and test
   files to identify top-level functional surfaces.
2. Compare discovered surfaces against the existing 33-row ledger.
3. Add missing rows for auth, admin, profile, markets, strategies, bots,
   orders, positions, backtests, reports, logs, icons, upload, market-stream,
   exchanges, subscriptions, isolation, pagination, and engine behavior.
4. Validate CSV structure and status counts.
5. Regenerate the operator workbook from the updated CSV.
6. Sync task board, MVP queue, project state, and the audit description.

## Acceptance Criteria
- The CSV imports cleanly with no blank `ID` or `Module` values.
- The ledger includes the main top-level route/module surfaces discovered by
  the scan.
- The audit document records second-pass counts and remaining limits.
- The workbook is regenerated from the expanded CSV.
- Repository guardrails pass.

## Definition of Done
- [x] Code/module scan completed.
- [x] Missing top-level function rows added.
- [x] CSV import/count checks passed.
- [x] XLSX workbook regenerated.
- [x] Audit/context/queue docs updated.
- [x] Repository guardrails passed.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New runtime systems.
- Code changes outside documentation/coverage artifacts.
- Marking local-only or inferred evidence as production `PASS`.
- Claiming exhaustive parameter-level coverage from a top-level route scan.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` -> PASS
- Manual checks:
  - PowerShell `Import-Csv` parsed
    `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`.
  - Row count: `79`.
  - Header count: `19`.
  - Blank IDs: `0`.
  - Blank modules: `0`.
  - Production status split: `PASS=17`, `PARTIAL=22`,
    `NEEDS_PROD_SAMPLE=9`, `NEEDS_PROD_UI_CHECK=12`, `NOT_VERIFIED=11`,
    `NOT_APPLICABLE=5`, `BLOCKED=2`, `FAIL=1`.
  - Priority split: `P0=45`, `P1=24`, `P2=10`.
- Screenshots/logs:
  - Workbook regenerated at
    `outputs/v1-function-coverage-audit-2026-05-01/Soar V1 Function Coverage Audit 2026-05-01.xlsx`.
- High-risk checks:
  - Newly added rows use `PARTIAL`, `NOT_VERIFIED`,
    `NEEDS_PROD_SAMPLE`, or `NEEDS_PROD_UI_CHECK` unless fresh production
    evidence exists.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/system-modules.md`,
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal update not required.

## Result Report
- Task summary: expanded the function coverage ledger from a V1 money-path
  matrix into a code-scan-backed top-level module inventory.
- Files changed: operations audit/CSV, planning task, project context, task
  board, MVP queue.
- How tested: CSV import/count checks, workbook regeneration, repository
  guardrails.
- What is incomplete: parameter-level and edge-state decomposition inside the
  new rows remains a follow-up audit pass.
- Next steps: drive `P0` rows with `PARTIAL`, `NOT_VERIFIED`,
  `NEEDS_PROD_SAMPLE`, or `NEEDS_PROD_UI_CHECK` into focused executable tests
  and production evidence tasks.
- Decisions made: the CSV remains the canonical source of truth; the XLSX is
  an operator-friendly generated artifact.
