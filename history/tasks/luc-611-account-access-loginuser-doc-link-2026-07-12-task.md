# Task

## Header
- ID: LUC-611
- Title: Account Access loginUser Doc-Link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: none
- Priority: P1
- Module Confidence Rows: Account access / API auth service documentation
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk
- Iteration: 2026-07-12
- Operation Mode: BUILDER
- Mission ID: LUC-611-ACCOUNT-ACCESS-LOGINUSER-DOC-LINK-2026-07-12
- Mission Status: VERIFIED

## Context

Project-truth dispatch identified
`apps/api/src/modules/auth/auth.service.ts#loginUser` as the first Account
access `missing_doc_link` app-completion gap.

## Goal

Link the `loginUser` auth service behavior to the canonical auth module
documentation and refresh generated indexes so future agents can route from
current source truth.

## Scope

- `docs/modules/api-auth.md`
- `docs/architecture/relations/documentation-links.csv`
- `docs/architecture/scanner-overrides.json`
- generated architecture/app-completion/project-truth status outputs
- evidence and project state files

## Implementation Plan

1. Classify `auth.service.ts#loginUser` in `docs/modules/api-auth.md`.
2. Add a documentation-link row and scanner `documents` override.
3. Regenerate architecture-awareness and app-completion indexes.
4. Apply project-truth index refresh.
5. Record residual QA proof ownership.

## Acceptance Criteria

- `loginUser` has a direct documentation relation to `docs/modules/api-auth.md`.
- app-completion no longer reports the row as `missing_doc_link`.
- project-truth advances to the next accurate state for the row.
- No runtime or production mutation occurs.

## Definition of Done

- [x] Source-truth docs link is present.
- [x] Generated indexes were refreshed.
- [x] Evidence file records commands and counts.
- [x] Residual QA proof owner is named.

## Validation Evidence

- Architecture awareness refresh: PASS, `10734` entities, `35005` relations,
  `relationOverridesApplied=5`.
- App-completion refresh: PASS after one transient Windows file-open retry,
  `missingDocLink=1989`, `implementedNeedsProof=114`.
- Project-truth `--apply`: PASS; first gap is now `loginUser`
  `implemented_needs_proof`.
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
- Residual risk: QA proof still required for `implemented_needs_proof`.

## Result Report

- Task summary: resolved the Account access `loginUser` missing-doc-link row.
- Files changed: auth docs, doc-link registry, scanner overrides, generated
  status/graph indexes, evidence/state files.
- How tested: generator and project-truth commands listed above.
- What is incomplete: runtime proof for `loginUser` remains a QA lane.
- Next steps: [LUC-613](/LUC/issues/LUC-613) should run and record focused
  proof for `apps/api/src/modules/auth/auth.service.ts#loginUser`.
- Decisions made: no architecture or runtime behavior change.
