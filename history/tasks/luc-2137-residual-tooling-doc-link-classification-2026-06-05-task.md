# Task

## Header
- ID: LUC-2137
- Title: Classify residual tooling doc-link backlog from architecture awareness report
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Depends on: LUC-2135
- Priority: P1
- Module Confidence Rows: documentation / architecture awareness tooling
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation traceability
- Risk Rows: protected production proof boundaries unchanged
- Iteration: Paperclip heartbeat 2026-06-05
- Operation Mode: BUILDER
- Mission ID: LUC-2137
- Mission Status: VERIFIED

## Context
`docs/status/architecture-awareness-report.md` generated at
2026-06-05T09:10:34.335Z reported a residual top actionable missing doc-link
family for release, ops, protected proof, RC, local dev, backup/restore, and
journey-index scripts.

## Goal
Classify the residual script doc-link backlog and add the smallest durable
traceability update without changing runtime behavior, running protected smoke,
deploying, reading secrets, or modifying production state.

## Scope
- `docs/architecture/relations/documentation-links.csv`
- `docs/automation/guardrail-commands.md`
- `docs/status/architecture-awareness-report.md`
- graph validation commands only

## Implementation Plan
1. Read the active architecture-awareness report and existing release/tooling
   docs.
2. Classify sampled script families by canonical owner doc and proof boundary.
3. Add direct `entity_path,doc_path` rows for residual script paths.
4. Record the classification in the guardrail command documentation.
5. Run architecture graph generation and strict drift validation.

## Acceptance Criteria
- Residual sampled script family is classified into owner buckets.
- Every top residual script path sampled from the report has a canonical doc
  link row.
- Verification avoids protected production proof and deploy operations.
- Graph generation and strict drift pass after the docs relation update.

## Definition of Done
- [x] Classification recorded in a source-of-truth doc.
- [x] Documentation link rows added for sampled residual scripts.
- [x] Validation evidence recorded.
- [x] Protected production proof remains explicitly out of scope.

## Validation Evidence
- Tests:
  - `pnpm run architecture:graph:generate` -> PASS; generated `651` nodes,
    `842` relations, `27` chains.
  - `pnpm run architecture:graph:drift:strict` -> PASS; generated `822/822`
    covered, `0` missing.
- Manual checks:
  - 38 sampled top residual script paths checked against
    `docs/architecture/relations/documentation-links.csv`: `targets=38`,
    `linked=38`, `missing=0`.
  - Duplicate exact `entity_path,doc_path` rows: `0`.
  - Direct architecture-awareness count refresh was not run because
    `scripts/build-architecture-awareness-index.mjs` is not present in this
    checkout or its parent path.
- High-risk checks:
  - No deploy, no restart, no secret readback, no protected smoke, no runtime
    behavior change.
- Reality status: verified for docs-link classification; runtime behavior not
  verified and not claimed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/architecture/architecture-evidence-graph-system.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/automation/guardrail-commands.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none required for this lane.

## Result Report
- Task summary: Classified the residual tooling doc-link backlog and linked 38
  sampled release/ops/protected-proof/local-dev/backup-restore/journey-index
  scripts to canonical owner docs.
- Files changed:
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/automation/guardrail-commands.md`
  - `history/tasks/luc-2137-residual-tooling-doc-link-classification-2026-06-05-task.md`
- How tested:
  - `pnpm run architecture:graph:generate`
  - `pnpm run architecture:graph:drift:strict`
  - CSV sampled-link count and duplicate-row checks
- What is incomplete:
  - Fresh before/after `architecture-awareness-report.md` counts could not be
    produced because the referenced awareness scanner command is not available
    in this checkout.
- Next steps:
  - If the Paperclip architecture-awareness scanner is restored to this repo,
    rerun it to refresh the actionable missing doc-link count.
- Decisions made:
  - Protected/prod proof runners are treated as protected-gate artifacts with
    documentation ownership only; this docs lane does not execute them or claim
    new production proof.
