# LUC-1116 Task - Account access `sumRuntimeManagedPositionRealizedPnl` proof

## Context

The project truth index identified
`apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionRealizedPnl`
as the next Account access `missing_test_link` gap.

## Goal

Add the smallest focused verification that proves the helper wiring and refresh
the generated truth so the gap is no longer the front row.

## Constraints

- stay within the Account access proof lane;
- avoid runtime mutation, deploy, or protected production work;
- keep the proof DB-free and focused on repository wiring.

## Definition of Done

- the helper has direct repository test coverage;
- `priority-test-links.csv` and `scanner-overrides.json` carry the proof link;
- generated app-completion and project-truth indexes refresh cleanly;
- evidence is recorded in a durable repo artifact.

## Forbidden

- broad refactors;
- unrelated cleanup;
- production-side changes;
- adding work outside the minimal proof slice.
