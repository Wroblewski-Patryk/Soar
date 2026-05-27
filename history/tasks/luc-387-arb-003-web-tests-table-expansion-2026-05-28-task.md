# Task

## Header
- ID: LUC-387
- Title: [Soar][ARB-003] Expand module deep dives with exact `Tests` tables for web features with inferred coverage
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-384 ARB-003 backlog row
- Priority: P2
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-387-ARB-003-TEST-MAPPING
- Mission Status: VERIFIED

## Context
ARB-003 identified that web module deep dives used inferred test coverage language instead of exact file-level mappings.

## Goal
Replace inferred web-test coverage notes with exact per-file `Tests` tables in impacted web module deep dives and clear the related drift note.

## Scope
- `docs/modules/web-orders.md`
- `docs/modules/web-positions.md`
- `docs/modules/web-icons.md`
- `docs/modules/web-shared.md`
- `docs/architecture/traceability-matrix.md`
- `docs/analysis/documentation-drift.md`

## Implementation Plan
1. Identify web module deep dives with inferred or non-normalized test coverage sections.
2. Replace section 8 in impacted docs with exact-file `Tests` tables.
3. Update architecture drift language to reflect repaired status and ongoing maintenance requirement.
4. Verify every documented test path exists in repository.

## Acceptance Criteria
- Each impacted web deep dive has an explicit `Tests` table with concrete file paths.
- ARB-003 gap language is no longer phrased as unresolved inferred mapping in drift docs.
- All listed test files exist in the repository.

## Definition of Done
- [x] Web deep dives updated with exact-file `Tests` tables.
- [x] Traceability/drift docs updated to repaired-with-maintenance wording.
- [x] Path existence validation completed.

## Validation Evidence
- Tests: path existence check via PowerShell `Test-Path` for every newly documented test file.
- Manual checks: reviewed updated module deep dives and traceability entries.
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/traceability-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Result Report
- Task summary: standardized web-module test documentation with explicit file-level mappings for ARB-003 scope.
- Files changed:
  - `docs/modules/web-orders.md`
  - `docs/modules/web-positions.md`
  - `docs/modules/web-icons.md`
  - `docs/modules/web-shared.md`
  - `docs/architecture/traceability-matrix.md`
  - `docs/analysis/documentation-drift.md`
- How tested: existence check for all referenced test files; content review for table normalization.
- What is incomplete: remaining web module docs still use bullet-style tests (not part of this ARB-003 inferred-coverage repair slice).
- Next steps: normalize remaining web module deep dives to table format opportunistically during next module edits.
- Decisions made: treat ARB-003 as repaired for inferred-coverage modules while retaining a maintenance warning about refactor drift.
