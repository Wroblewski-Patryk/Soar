# Task

## Header
- ID: LUC-45-D
- Title: [Soar][LUC-45] Security boundary read-only proof
- Task Type: verification
- Current Stage: planning
- Status: IN_PROGRESS
- Owner: Security Review Lead
- Depends on: LUC-45-A, LUC-45-B
- Priority: P0

## Context
Readiness cannot be claimed without refreshed fail-closed security proof on the active candidate.

## Goal
Verify auth/session/exchange boundary behavior in protected read-only mode.

## Scope
- Protected auth/session proof steps
- Exchange/read-only boundary checks
- Secret-handling and artifact redaction checks

## Required Output
- Security packet with explicit PASS/FAIL per boundary.
- Residual risk list with unblock owner/action.

## Validation
- Protected read-only checks only.
- No LIVE order/cancel/close mutation.

## Acceptance Criteria
- [ ] Protected boundary checks executed and documented.
- [ ] Secret handling and redaction posture verified.
- [ ] Residual security blockers are explicit and assigned.
