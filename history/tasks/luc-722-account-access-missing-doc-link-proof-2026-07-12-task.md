# Task

## Header

- ID: LUC-722
- Title: Prove Account Access Missing-Doc-Link
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: none
- Priority: P1
- Module Confidence Rows: Account access / Backtests auth bootstrap helper documentation
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 2026-07-12
- Operation Mode: BUILDER
- Mission ID: LUC-722-ACCOUNT-ACCESS-MISSING-DOC-LINK-PROOF-2026-07-12
- Mission Status: VERIFIED

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for mission rules.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or
      marked not applicable.
- [x] The task improves release confidence by turning an app-completion claim
      into inspectable proof.

## Context

[LUC-637](/LUC/issues/LUC-637) advanced the first Account access project-truth
gap to
`apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin` as
`missing_doc_link`. The current workspace already contains doc-link edits for
that path in canonical Backtests docs and source-truth registries, so
[LUC-722](/LUC/issues/LUC-722) needed proof of whether the row was actually
resolved or whether the classifier still considered it missing.

## Goal

Prove the current truth for the scoped `registerAndLogin` row: whether the
missing-doc-link is resolved in generated outputs or whether a tooling/classifier
mismatch remains after the canonical doc-link inputs were added.

## Scope

- `docs/modules/api-backtests.md`
- `docs/architecture/relations/documentation-links.csv`
- `docs/architecture/scanner-overrides.json`
- `docs/graphs/architecture-awareness.json`
- `docs/status/app-completion-index.md`
- `docs/status/app-completion-index.json`
- `docs/status/project-truth-index.md`
- `docs/status/project-truth-index.json`
- evidence and project state files

## Implementation Plan

1. Read the canonical Backtests module doc and source-truth registries for the
   scoped path.
2. Compare those inputs with the generated architecture-awareness and
   app-completion outputs.
3. Prove whether `hasDoc` is true or false in the generated row.
4. Record the exact mismatch and route the next owner/action without claiming a
   repaired classifier.

## Acceptance Criteria

- Evidence shows whether the scoped path is present in canonical doc-link
  inputs.
- Evidence shows the generated app-completion/project-truth state for the same
  path.
- The result names the next owner/action if the generated risk remains.

## Definition of Done

- [x] Canonical doc/source-truth inputs were read back.
- [x] Generated app-completion/project-truth outputs were read back.
- [x] The exact mismatch was recorded with affected files/entities.
- [x] A next owner/action was named for the unresolved classifier/tooling lane.

## Validation Evidence

- Direct diff/readback: PASS for the scoped path in
  `docs/modules/api-backtests.md`,
  `docs/architecture/relations/documentation-links.csv`, and
  `docs/architecture/scanner-overrides.json`.
- Generated app-completion readback: PASS for proof purposes; the scoped
  `priorityReviewItems` row still reports `evidence.hasDoc=false` and
  `risk=missing_doc_link`.
- Generated architecture-awareness readback: PASS for proof purposes; the
  scoped entity still shows only test-file evidence and no `documents`
  relation.
- Generated project-truth readback: PASS for proof purposes; the first gap
  remains `registerAndLogin` `missing_doc_link`.
- Reality status: verified for mismatch proof.

## Architecture Evidence

- Architecture source reviewed: `docs/modules/api-backtests.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  `docs/graphs/architecture-awareness.json`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, generated awareness/app-completion outputs do not
  reflect the current doc-link inputs for the scoped entity.
- Decision required from user: no.

## Security / Privacy Evidence

- Data classification: documentation and generated index metadata only.
- Secret handling: no secret, cookie, token, credential, account, or protected
  runtime value was read or written.
- Fail-closed behavior: not applicable to this proof-only lane.
- Residual risk: the scoped app-completion gap is still unresolved in generated
  outputs.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Project truth routes the first Account access docs lane to
  `backtests.e2e.test.ts#registerAndLogin`.
- The current workspace already contains doc-link edits for that entity.

### 2. Select One Priority Mission Objective

- Selected task: prove the real state of the LUC-722 missing-doc-link row.
- Deferred: classifier/tooling repair, because that is outside Documentation
  Steward ownership.

### 3. Plan Implementation

- Files inspected: canonical Backtests doc, documentation-link registry,
  scanner overrides, architecture-awareness export, app-completion export, and
  project-truth export.
- Logic: compare source-truth inputs against generated outputs.

### 4. Execute Implementation

- Read the existing dirty source-truth edits and the current generated indexes.
- Extracted the scoped app-completion priority row and the
  architecture-awareness entity payload for the target path.

### 5. Verify and Test

- Verified the source-truth inputs exist.
- Verified the generated row still reports `hasDoc=false`.

### 6. Self-Review

- Existing systems were reused: canonical module docs, doc-link CSV, scanner
  overrides, generated status exports.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge

- Docs updated: yes, through task/evidence/project-truth state.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.

## Result Report

- Task summary: proved that the scoped Account access row still remains
  `missing_doc_link` in generated outputs even though the current workspace
  contains canonical doc-link inputs for that path.
- Files changed: evidence/task packet plus project truth/context notes.
- How tested: direct source diff/readback plus generated
  architecture-awareness, app-completion, and project-truth readback.
- What is incomplete: the awareness/app-completion ingestion or classifier lane
  that should convert the scoped row to `hasDoc=true`.
- Next steps: route the classifier/tooling repair through Delivery/Docs
  ownership; do not claim the missing-doc-link closed until the generated row
  changes.
- Decisions made: treated this as proof of mismatch, not as doc-link closure.
