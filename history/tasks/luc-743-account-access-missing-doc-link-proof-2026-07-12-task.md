# Task

## Header

- ID: LUC-743
- Title: Prove Account access missing-doc-link
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: LUC-734
- Priority: P1
- Module Confidence Rows: Account access / Backtests auth bootstrap helper documentation
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 2026-07-12
- Operation Mode: BUILDER
- Mission ID: LUC-743-ACCOUNT-ACCESS-MISSING-DOC-LINK-PROOF-2026-07-12
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
- [x] The task improves release confidence by proving the current truth for the
      scoped Account access row after the generation-order repair.

## Context

[LUC-734](/LUC/issues/LUC-734) repaired the generated doc-link ingestion path
for `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin`.
This task proved the current truth after that repair and confirmed the row no
longer remains the first Account access `missing_doc_link` gap.

## Goal

Prove the current state of the scoped `registerAndLogin` row after the doc-link
ingestion repair so the issue can close with inspectable evidence and a clear
next owner for the now-current Account access gap.

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
2. Read back the generated architecture-awareness, app-completion, and
   project-truth outputs after the LUC-734 repair.
3. Prove whether the scoped path still appears as the first Account access
   `missing_doc_link` row.
4. Record the exact current first gap without claiming any runtime change.

## Acceptance Criteria

- Evidence shows the scoped path remains in the canonical doc-link inputs.
- Evidence shows the generated app-completion/project-truth state for the same
  path after the repair.
- The result names the current first Account access gap and next owner/action.

## Definition of Done

- [x] Canonical doc/source-truth inputs were read back.
- [x] Generated app-completion/project-truth outputs were read back.
- [x] The current truth for the scoped path was recorded with affected files and
      the new first gap.
- [x] Source-of-truth state and evidence were updated.

## Validation Evidence

- `docs/modules/api-backtests.md` contains the `registerAndLogin`
  classification row.
- `docs/architecture/relations/documentation-links.csv` contains
  `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin,docs/modules/api-backtests.md`.
- `docs/architecture/scanner-overrides.json` contains the matching `documents`
  override.
- `docs/graphs/architecture-awareness.json` contains the scoped
  `backtests.e2e.test.ts#registerAndLogin` path.
- `docs/status/app-completion-index.json` no longer matches the scoped path in
  `priorityReviewItems`.
- `docs/status/project-truth-index.md` now routes the first Account access gap
  to `apps/api/src/modules/bots/botOwnership.service.ts#getOwnedBotRuntimeSession`
  as `missing_doc_link`.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: `docs/modules/api-backtests.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  `docs/graphs/architecture-awareness.json`.
- Fits approved architecture: yes.
- Mismatch discovered: no new mismatch; the previous gap was already repaired
  by the LUC-734 generation-order refresh.
- Decision required from user: no.

## Security / Privacy Evidence

- Data classification: documentation and generated index metadata only.
- Secret handling: no secret, cookie, token, credential, account, or protected
  runtime value was read or written.
- Fail-closed behavior: not applicable to this proof-only lane.
- Residual risk: the broader Account access backlog remains open under the new
  first gap.

## Autonomous Loop Evidence

### 1. Analyze Current State

- The scoped Backtests helper remained in the canonical source-truth inputs.
- The generated outputs needed a fresh readback after the LUC-734 repair.

### 2. Select One Priority Mission Objective

- Selected task: prove the current truth of the scoped `registerAndLogin`
  row.
- Deferred: all later Account access backlog rows.

### 3. Plan Implementation

- Files inspected: canonical Backtests doc, doc-link registry, scanner
  overrides, architecture-awareness export, app-completion export, and
  project-truth export.
- Logic: compare source-truth inputs against the refreshed generated outputs.

### 4. Execute Implementation

- Read the existing canonical doc-link inputs.
- Read back the refreshed generated indexes after the repair.

### 5. Verify and Test

- Verified the scoped path still exists in the source-truth inputs.
- Verified the scoped path no longer appears as the first Account access gap
  in generated app-completion/project-truth outputs.

### 6. Self-Review

- Existing systems were reused: canonical module docs, doc-link CSV, scanner
  overrides, generated status exports, and the prior LUC-734 repair.
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

- Task summary: proved the current truth for
  `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin`
  after the LUC-734 ingestion repair.
- Files changed: evidence/task packet plus project truth/context notes.
- How tested: direct source-truth readback plus generated
  architecture-awareness, app-completion, and project-truth readback.
- What is incomplete: the broader Account access backlog remains open.
- Next steps: continue from the new first Account access gap
  `apps/api/src/modules/bots/botOwnership.service.ts#getOwnedBotRuntimeSession`
  as a separate doc-link lane if needed.
- Decisions made: treat this issue as current-truth proof after repair, not as a
  separate runtime or classifier repair.
