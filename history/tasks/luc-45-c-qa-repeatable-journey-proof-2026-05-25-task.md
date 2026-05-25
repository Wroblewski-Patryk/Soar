# Task

## Header
- ID: LUC-45-C
- Title: [Soar][LUC-45] QA repeatable journey proof matrix
- Task Type: verification
- Current Stage: planning
- Status: IN_PROGRESS
- Owner: QA/Test Automation Engineer
- Depends on: LUC-45-A, LUC-45-B
- Priority: P0

## Context
The repeatable smoke harness exists, but full web/api/backtests evidence is not yet current for the candidate.

## Goal
Publish deterministic pass/fail proof for repeatable V1 smoke/e2e checks.

## Scope
- `scripts/runQaRepeatableSmokeE2e.mjs`
- Artifacts in `history/artifacts` and `history/evidence`

## Required Output
- Full repeatable run report for `web,api,backtests`.
- Failures routed with owning lane and blocker classification.

## Validation
- `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`

## Acceptance Criteria
- [ ] Full repeatable suite executed on current candidate.
- [ ] PASS/FAIL artifacts published and linked.
- [ ] Any failure has clear owner and next action.
