# Task

## Header

- ID: LUC-636
- Title: Account Access Session-Token Doc-Link Closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: [LUC-635](/LUC/issues/LUC-635)
- Priority: P1
- Module Confidence Rows: Account access / API auth session-token documentation
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 2026-07-12
- Operation Mode: BUILDER
- Mission ID: LUC-636-ACCOUNT-ACCESS-SESSION-TOKEN-DOC-LINK-2026-07-12
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
- [x] The task improves release confidence by reducing Account access
      app-completion source-truth risk.

## Context

[LUC-636](/LUC/issues/LUC-636) was assigned to close the Account access
session-token documentation-link batch that blocked [LUC-637](/LUC/issues/LUC-637).
The generated project truth before this task still showed session-token helper
rows as `missing_doc_link`.

## Goal

Link the scoped session-token helper and proof-helper entities to the canonical
auth module documentation and refresh generated indexes so follow-up proof work
can start from `implemented_needs_proof` instead of documentation-link gaps.

## Scope

- `docs/modules/api-auth.md`
- `docs/architecture/relations/documentation-links.csv`
- `docs/architecture/scanner-overrides.json`
- generated architecture/app-completion/project-truth status outputs
- evidence and project state files

## Implementation Plan

1. Classify the remaining `sessionToken` helper/test rows in
   `docs/modules/api-auth.md`.
2. Add documentation-link rows and scanner `documents` overrides.
3. Regenerate architecture-awareness and app-completion indexes.
4. Apply project-truth index refresh.
5. Record residual proof ownership under [LUC-637](/LUC/issues/LUC-637).

## Acceptance Criteria

- The six scoped rows no longer appear as `missing_doc_link` in generated
  app-completion/project-truth readbacks.
- Evidence names the regeneration and readback commands.
- No runtime or protected environment mutation occurs.

## Definition of Done

- [x] Source-truth doc links are present.
- [x] Generated indexes were refreshed.
- [x] Evidence file records commands and counts.
- [x] Residual QA proof owner is named.

## Validation Evidence

- Prettier write for markdown and scanner override JSON: PASS.
- Direct source readback for the six scoped paths: PASS.
- Architecture awareness refresh: PASS, `10764` entities, `35145` relations,
  `relationOverridesApplied=12`.
- App-completion refresh: PASS, `missingDocLink=1985`,
  `implementedNeedsProof=114`, `riskItems=3524`.
- Project-truth `--apply`: PASS; first Account access gap is now
  `tokenIssuedAt` `implemented_needs_proof`.
- Strict graph drift: PASS, `853/853 covered`, `0 missing`.
- Reality status: verified for DSM doc-link scope.

## Architecture Evidence

- Architecture source reviewed: `docs/modules/api-auth.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Security / Privacy Evidence

- Data classification: documentation metadata only.
- Secret handling: no secret, cookie, token, credential, account, or protected
  runtime value was read or written.
- Fail-closed behavior: not applicable to this docs-only change.
- Residual risk: focused proof still required for `implemented_needs_proof`.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Project truth and app-completion showed session-token Account access rows as
  documentation-link risks.

### 2. Select One Priority Mission Objective

- Selected task: resolve the LUC-636 session-token documentation-link batch.
- Deferred: runtime proof, because [LUC-637](/LUC/issues/LUC-637) owns that
  Test Automation lane.

### 3. Plan Implementation

- Files modified: canonical auth module doc, doc-link registry, scanner
  override, generated indexes, task/evidence/state files.
- Logic: source-truth relation only, no runtime behavior change.

### 4. Execute Implementation

- Added module classifications, CSV rows, and scanner relation overrides.

### 5. Verify and Test

- Generator sequence passed and changed the first remaining scoped row to
  `implemented_needs_proof`.

### 6. Self-Review

- Existing systems were reused: canonical auth docs, documentation-link CSV,
  scanner overrides, generated app-completion/project-truth indexes.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge

- Docs updated: yes.
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

- Task summary: resolved the Account access session-token missing-doc-link
  batch.
- Files changed: auth docs, doc-link registry, scanner overrides, generated
  status/graph indexes, evidence/state files.
- How tested: formatter-supported docs/JSON formatting, direct source
  readback, architecture-awareness generation, app-completion generation,
  project-truth apply, and strict graph drift.
- What is incomplete: focused proof for `tokenIssuedAt` remains a QA lane.
- Next steps: [LUC-637](/LUC/issues/LUC-637) is assigned to Test Automation
  Engineer for focused proof.
- Decisions made: no architecture or runtime behavior change.
