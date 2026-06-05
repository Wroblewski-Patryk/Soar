# LUC-2233 Refresh Journey Evidence Indexes After Current Graph State

## Header
- ID: LUC-2233
- Title: Refresh journey evidence indexes after current graph state
- Task Type: docs
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Priority: P2
- Operation Mode: BUILDER
- Mission Status: VERIFIED

## Context
Soar architecture-awareness exports had been refreshed on 2026-06-05, but the
journey evidence index summaries and dated machine artifacts still pointed at
the older 2026-05-25 generated date.

## Goal
Regenerate the function-journey and user-action evidence indexes from the
current graph source truth and ensure their generated artifact dates reflect
the current run.

## Constraints
- Stay in Docs Memory scope.
- Do not change runtime, product behavior, API behavior, deployment settings,
  secrets, accounts, protected smoke, or live-trading state.
- Use project-native generators.

## Implementation Plan
1. Inspect current graph/index timestamps and generator scripts.
2. Repair generator artifact dating so future runs do not preserve the stale
   2026-05-25 label.
3. Run strict journey-index generation.
4. Record generated files, validation, residual proof gaps, and state updates.

## Acceptance Criteria
- `docs/status/function-journey-index.md` and
  `docs/status/user-action-index.md` show the current generation date.
- Current graph JSON index files are regenerated.
- Dated 2026-06-05 machine artifacts exist under `history/artifacts/`.
- Strict generation reports zero critical gaps.

## Definition of Done
- [x] Generator date source uses current runtime date.
- [x] Function-journey and user-action indexes regenerated.
- [x] Focused validation evidence recorded.
- [x] Project state/task board updated.

## Result Report
Changed files:

- `scripts/generateFunctionJourneyIndexes.mjs`
- `scripts/generateUserActionIndex.mjs`
- `docs/graphs/function-journey-index.json`
- `docs/graphs/user-action-index.json`
- `docs/status/function-journey-index.md`
- `docs/status/user-action-index.md`
- `history/artifacts/function-journey-index-2026-06-05.json`
- `history/artifacts/user-action-index-2026-06-05.json`

Validation:

- `node --check scripts/generateFunctionJourneyIndexes.mjs` -> PASS.
- `node --check scripts/generateUserActionIndex.mjs` -> PASS.
- `pnpm run architecture:journey:index:strict` -> PASS:
  - function journey indexes: 27 chains, 36 web journeys, 96 API surfaces,
    0 critical gaps, 28 high gaps;
  - user action index: 39 actions, 0 critical gaps, 37 high gaps,
    0 medium gaps.
- `pnpm run architecture:journey:triage` -> NOT APPLICABLE as a global check;
  the script requires `--query <route|api|action|chain|file|error-fragment>`.

Residual risk:

- High gaps remain evidence gaps, not generator failures: protected,
  production, browser, and live-money proof remain owned by the matching QA,
  Security, Ops, and runtime lanes.
- No runtime or deployment behavior was verified or changed in this task.

Reality status: verified.

