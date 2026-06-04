# Task

## Header
- ID: LUC-1939
- Title: Resolve residual page chain semantics for medium graph gaps
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Depends on: [LUC-1938](/LUC/issues/LUC-1938)
- Priority: P2
- Module Confidence Rows: Architecture Evidence Graph / journey index
- Requirement Rows: REQ-DOC-005 through REQ-DOC-029
- Quality Scenario Rows: documentation traceability
- Risk Rows: RISK-DOC-005
- Operation Mode: BUILDER
- Mission ID: LUC-1939-RESIDUAL-PAGE-CHAIN-SEMANTICS-MEDIUM-GRAPH-GAPS-2026-06-04
- Mission Status: VERIFIED

## Context
[LUC-1939](/LUC/issues/LUC-1939) was assigned to Docs Memory Lead as a child of [LUC-1938](/LUC/issues/LUC-1938). The cleanup queue asked for `ARCH-MED-001..003` to stop reporting ambiguous `not_in_function_chain` medium gaps for:

- `SOAR-PAGE-BOT-NEW-ALIAS`
- `SOAR-PAGE-BOT-DETAIL-ALIAS`
- `SOAR-PAGE-OFFLINE`

The issue explicitly forbade runtime/product changes, deploys, restarts, rollbacks, secrets, account actions, database mutation, and live-trading mutation.

## Goal
Replace ambiguous page-chain semantics with explicit chain membership or accepted residual/N/A semantics in the architecture graph source of truth and regenerated reports.

## Constraints
- Use existing architecture graph CSV/chains/index generation.
- Do not change runtime or product behavior.
- Do not hand-edit generated reports without updating source truth.
- Keep neighboring dirty workspace changes intact.

## Definition of Done
- [x] Bot alias page records carry explicit generated chain membership.
- [x] Offline page no longer appears as an ambiguous function-chain gap.
- [x] Affected architecture graph and journey artifacts regenerate successfully.
- [x] Project state and evidence are updated.

## Implementation
- Added `SOAR-PAGE-BOT-NEW-ALIAS` and `SOAR-PAGE-BOT-DETAIL-ALIAS` to `CHAIN-BOT-SETUP` in `docs/architecture/chains/chains.csv`.
- Refreshed `docs/architecture/chains/CHAIN-BOT-SETUP.md` to show both alias pages in the execution chain.
- Added node notes to document alias-chain membership and offline accepted fallback semantics.
- Updated `scripts/generateFunctionJourneyIndexes.mjs` so offline pages do not receive `not_in_function_chain`.
- Regenerated architecture graph and journey index artifacts.

## Validation Evidence
- `pnpm run architecture:graph:generate` -> PASS, `647` nodes / `810` relations / `27` chains.
- `pnpm run architecture:journey:index` -> PASS, `27` chains / `36` web journeys / `96` API surfaces / `0` critical function gaps; user-action medium gaps `0`.
- `pnpm run architecture:graph:drift:strict` -> PASS, `816/816` covered and `0` missing.
- `pnpm run quality:guardrails` -> PASS.
- Generated row check:
  - `SOAR-PAGE-BOT-NEW-ALIAS`: `chains=CHAIN-BOT-SETUP`, empty `gaps`, `gap_severity=none`.
  - `SOAR-PAGE-BOT-DETAIL-ALIAS`: `chains=CHAIN-BOT-SETUP`, empty `gaps`, `gap_severity=none`.
  - `SOAR-PAGE-OFFLINE`: empty `gaps`, `gap_severity=none`.
- `docs/status/function-journey-index.md` no longer lists the three scoped page rows as medium gaps.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/chains/chains.csv`, `docs/architecture/chains/CHAIN-BOT-SETUP.md`, page node records, journey generators, generated journey indexes.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none for this issue; remaining API medium gaps are separate cleanup scope.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: revert graph/source docs and regenerate artifacts if this semantic mapping is later superseded.

## Result Report
- Status: DONE.
- Files changed in this issue scope: architecture chain source, scoped page node notes, journey generator semantics, generated graph/journey artifacts, and source-of-truth state/evidence files.
- Existing unrelated dirty worktree changes were observed for [LUC-1933](/LUC/issues/LUC-1933) Ops evidence/state and neighboring [LUC-1940](/LUC/issues/LUC-1940) API data-source semantics; they were not reverted.
- Residual risk: this is graph/journey semantics proof only. It does not provide fresh authenticated browser proof or production behavior proof for protected bot routes.
