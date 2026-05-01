# Task

## Header
- ID: V1COVER-01
- Title: Create V1 module function coverage ledger
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1 final gate evidence and module map
- Priority: P0

## Context
The operator needs one auditable view of which Soar functions are locally
covered, production-proven, partially covered, blocked, or unverified. Repeated
manual testing without a stable ledger was causing confidence loops.

## Goal
Create the first canonical function coverage matrix split by module, submodule,
mode, layer, capability, child scenario, local evidence, production evidence,
risk, owner, and next verification.

## Scope
- `docs/operations/v1-function-coverage-audit-2026-05-01.md`
- `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`
- `outputs/v1-function-coverage-audit-2026-05-01/Soar V1 Function Coverage Audit 2026-05-01.xlsx`
- Context/queue docs that reference the new audit artifact.

## Implementation Plan
1. Define a row contract that can represent parent/child functionality without
   nested spreadsheet rows.
2. Seed the matrix from the current V1 money-path, runtime, wallet, strategy,
   dashboard, exchange, market-data, backtest, auth, and ops evidence.
3. Generate an operator-friendly XLSX workbook and a repository-tracked CSV.
4. Record operating rules for future updates.
5. Validate row counts and repository guardrails.

## Acceptance Criteria
- The matrix includes module/submodule/mode/capability/scenario columns.
- Each row distinguishes local evidence from production evidence.
- Status values make blockers and partial coverage visible.
- The workbook is filterable and readable.
- The CSV source is tracked in `docs/operations/`.

## Definition of Done
- [x] Coverage column contract documented.
- [x] Initial V1 matrix created.
- [x] XLSX workbook generated.
- [x] CSV source created.
- [x] Summary counts reviewed.
- [x] Repository guardrails passed.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` -> PASS
- Manual checks:
  - CSV imports successfully through PowerShell `Import-Csv`.
  - Production status counts: `PASS=14`, `PARTIAL=5`,
    `NEEDS_PROD_SAMPLE=7`, `NEEDS_PROD_UI_CHECK=1`, `BLOCKED=2`,
    `FAIL=1`, `NOT_APPLICABLE=2`, `NOT_VERIFIED=1`.
  - Priority counts: `P0=22`, `P1=9`, `P2=2`.
- Screenshots/logs:
  - Workbook generated at
    `outputs/v1-function-coverage-audit-2026-05-01/Soar V1 Function Coverage Audit 2026-05-01.xlsx`.
- High-risk checks:
  - Matrix does not mark production confidence as `PASS` where only inferred
    or local evidence exists.

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
- Task summary: created the first V1 function coverage ledger and workbook.
- Files changed: operations audit/CSV, planning/context docs.
- How tested: guardrails plus CSV import/count checks.
- What is incomplete: broader CRUD/UI rows for markets, profile,
  subscriptions/admin, and deeper backtest/report scenarios were intentionally
  left for a follow-up pass; the top-level expansion is now tracked in
  `docs/planning/v1cover-02-code-scan-function-ledger-expansion-task-2026-05-01.md`.
- Next steps: update the matrix after every future V1/V1.1 confidence task and
  drive open P0 rows to `PASS` or an explicit release-owner waiver.
