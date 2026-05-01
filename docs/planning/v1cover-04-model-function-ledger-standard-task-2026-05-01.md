# Task

## Header
- ID: V1COVER-04
- Title: Promote function coverage ledger into reusable project standard
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1COVER-03
- Priority: P1

## Context
The Soar V1 function ledger proved useful for converting a large feature set
into actionable release readiness buckets. The operator asked to make the table
model-quality so it can guide other projects too.

## Goal
Extract the reusable parts of the Soar ledger into a project-portable standard
and template without weakening the Soar-specific V1 audit artifacts.

## Scope
- `docs/governance/function-coverage-ledger-standard.md`
- `docs/governance/function-coverage-ledger-template.csv`
- `docs/operations/v1-function-coverage-audit-2026-05-01.md`
- `docs/README.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Review the current Soar ledger column contract and readiness audit.
2. Define a reusable column contract, status vocabulary, readiness buckets,
   priority rules, row granularity rules, task derivation rules, and release
   gate rules.
3. Add a small CSV template with example rows that other projects can copy.
4. Link the standard from the Soar V1 audit and documentation index.
5. Sync context and planning docs.
6. Run repository guardrails.

## Acceptance Criteria
- The standard is project-portable and does not require crypto/trading context.
- The standard still maps cleanly to Soar's existing V1 matrix.
- The template includes the canonical columns and example rows.
- The docs explain how to convert row states into tasks.
- Repository guardrails pass.

## Definition of Done
- [x] Standard document created.
- [x] CSV template created.
- [x] Soar audit linked to the standard.
- [x] Docs index updated.
- [x] Context and queue docs updated.
- [x] Repository guardrails passed.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Changing Soar's existing V1 function statuses without new evidence.
- Introducing project-specific secrets or environment details.
- Replacing tests or release gates with the spreadsheet model.
- Making the template depend on Soar-specific modules.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` -> PASS
- Manual checks:
  - Standard includes column contract, status vocabulary, readiness buckets,
    task derivation rules, evidence quality, release gate rule, and maintenance
    rule.
  - Template CSV imports as a valid three-row example with the expected
    columns.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - The standard explicitly says the ledger is an index to evidence, not a
    replacement for tests, architecture docs, or release gates.

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
- Task summary: turned the Soar V1 function ledger into a reusable governance
  standard and template for other projects.
- Files changed: governance standard/template, operations audit link,
  docs index, context, MVP queue.
- How tested: guardrails plus template import check.
- What is incomplete: future projects still need to tailor module names,
  target environments, and release priority rules.
- Next steps: use the standard to derive future V1 tasks by row ID, starting
  with the remaining `P0` blocker/evidence rows.
- Decisions made: the CSV remains the canonical source; generated workbooks are
  operator-friendly views.
