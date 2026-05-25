# Task

## Header
- ID: LUC-37-C
- Title: [Soar][Delivery] Cross-journey QA and proof packet for high-gap user paths
- Task Type: qa
- Current Stage: planning
- Status: IN_PROGRESS
- Owner: QA/Test Engineer
- Depends on: LUC-37-A, LUC-37-B
- Priority: P1
- Module Confidence Rows: dashboard/runtime, orders/manual, auth/session, exchanges
- Requirement Rows: proof completeness requirements from requirement matrix and release gate
- Risk Rows: high user-visible proof gap risk without authenticated browse readback
- Iteration: 1
- Operation Mode: TESTER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: PLANNED

## Context
Architecture evidence indexing shows multiple high proof gaps in dashboard runtime, manual order, and auth/protected-readback paths despite local functional test coverage.

## Goal
Generate a concrete proof packet for highest user-impact journeys and link each to explicit open blockers and evidence artifacts.

## Scope
- `docs/architecture/indices/web-journey-index.csv`
- `docs/architecture/indices/user-action-index.csv`
- `docs/architecture/indices/function-chain-evidence-index.csv`
- Runtime journey routes and action paths in priority:
  - dashboard home/runtime view
  - manual order create/cancel/close
  - auth login/session flow
  - bot runtime positions/aggregate

## Success Signal
- For each priority route/action there is a pass/fail matrix with evidence status and next step.
- Protected evidence is marked blocked or passed explicitly with dependency list.

## Lane Plan
1. Run journey triage commands for priority actions and route map.
2. Collect local API web proof where safe and reproducible.
3. Capture authenticated/protected readback blockers as explicit residuals when not executable.
4. Produce one consolidated QA packet suitable for release gating.

## Dependencies
- Candidate deploy SHA and smoke evidence from `LUC-37-B`.
- Backend behavior snapshots from `LUC-37-A` for failing flows.

## Required Output
- QA packet file with:
  - route/action list
  - test references
  - blockers with reasons
  - acceptance outcome per chain

## Validation
- `test:go-live:web` for relevant web surfaces where applicable.
- `architecture:journey:triage` outputs for priority routes/actions.
- Browser proof outputs for public routes when available.

## Acceptance Criteria
- [ ] Top three high-gap routes/actions have evidence status after triage.
- [ ] No high-gap route is treated as green without browser or production-protected proof.
- [ ] Lane report includes direct handoff notes for dependent security/ops blockers.

