# Task

## Header
- ID: FUNCTION-JOURNEY-EVIDENCE-INDEX-2026-05-25
- Title: Generate function, web journey, and API evidence indexes
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Coordinator
- Depends on: `ARCH-EVIDENCE-GRAPH-SYSTEM-2026-05-24`
- Priority: P0
- Module Confidence Rows: Architecture Evidence Graph; Operations/Release
- Requirement Rows: REQ-DOC-029
- Quality Scenario Rows: Traceability and real-journey proof
- Risk Rows: index drift; false readiness claims
- Iteration: 2026-05-25
- Operation Mode: BUILDER
- Mission ID: FUNCTION-JOURNEY-EVIDENCE-INDEX-2026-05-25
- Mission Status: VERIFIED

## Context
The project already had an architecture evidence graph with nodes, relations,
chains, and strict drift coverage. The missing layer was a practical index that
lets agents start from a user-visible route or function, follow the connected
API/service/data path, and see the current evidence boundary before claiming a
feature works.

## Goal
Create generated indexes and a validation command that show what works, what is
only locally proven, and what still needs browser, protected production, or
approval-gated LIVE proof.

## Scope
- `scripts/generateFunctionJourneyIndexes.mjs`
- `package.json`
- `docs/architecture/indices/*.csv`
- `docs/status/function-journey-index.md`
- `docs/graphs/function-journey-index.json`
- `history/artifacts/function-journey-index-2026-05-25.json`
- source-of-truth state and architecture documentation references

## Implementation Plan
1. Reuse existing architecture graph CSV files instead of creating a parallel
   source of truth.
2. Generate function-chain, web-journey, and API-surface indexes.
3. Mark critical structural gaps separately from high proof gaps.
4. Add package scripts for normal and strict validation.
5. Regenerate indexes and record evidence.

## Acceptance Criteria
- Generated indexes exist for function chains, web journeys, and API surfaces.
- The command reports structural and proof gaps without treating local proof as
  production proof.
- Strict mode fails only if critical structural gaps exist.
- The output is machine-readable and human-readable.

## Definition of Done
- Existing graph source of truth is reused.
- New generated files are reproducible from a package script.
- Current gap summary is recorded in source-of-truth files.
- Validation evidence is captured.

## Validation Evidence
- Tests: `node --check scripts/generateFunctionJourneyIndexes.mjs`
- Manual checks: generated CSV/JSON/Markdown readback
- Commands:
  - `pnpm run architecture:journey:index`
  - `pnpm run architecture:journey:index:strict`
  - JSON parse check for `docs/graphs/function-journey-index.json`
  - JSON parse check for `history/artifacts/function-journey-index-2026-05-25.json`
- Result: generated `27` function-chain rows, `36` web-journey rows, `96` API
  surface rows, `0` critical structural gaps, and `28` high proof gaps.
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-evidence-graph-system.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: journey index commands and generated
  file contract added.

## Result Report
- Task summary: added a generated function-to-web-to-API evidence index layer.
- Files changed: generator script, package scripts, generated indexes, graph
  JSON, status summary, task record, and source-of-truth state references.
- How tested: syntax, normal generation, strict generation, JSON parse checks.
- What is incomplete: high proof gaps remain by design and identify missing
  browser/protected production/LIVE evidence boundaries.
- Next steps: use the new indexes before fixing reported UI/runtime failures,
  and add journey rows or graph relations in the same task when new features
  or routes are changed.
