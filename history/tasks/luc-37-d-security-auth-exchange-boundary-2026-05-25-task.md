# Task

## Header
- ID: LUC-37-D
- Title: [Soar][Delivery] Security boundary verification for auth/session and exchange flow
- Task Type: security
- Current Stage: planning
- Status: IN_PROGRESS
- Owner: Security Auditor
- Depends on: LUC-37-B
- Priority: P1
- Module Confidence Rows: auth/session, exchange auth-read contract, live-risk control
- Requirement Rows: AI_TESTING_PROTOCOL, anti-abuse / fail-closed contract set
- Risk Rows: privileged action leakage, protected production readback ambiguity
- Iteration: 1
- Operation Mode: TESTER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: PLANNED

## Context
Security posture is required before any readiness claim involving protected browser or exchange-boundary operations. Current project state has meaningful protected evidence gaps.

## Goal
Produce a security-readiness packet focused on read-only auth/session and exchange boundary behavior and explicit fail-closed conditions.

## Scope
- Auth/session middleware paths and login/read-me flows.
- Exchange auth-read/fee/reconciliation call boundaries.
- Fail-closed handling of unauthorized or ambiguous exchange payloads.

## Success Signal
- Clear pass/fail security packet with any remaining protected gaps explicitly linked to blockers.

## Lane Plan
1. Review current auth/session and exchange boundary contracts against deployment candidate.
2. Run read-only security checks required by protocol.
3. Confirm no policy widening or privileged bypass in modified runtime/API paths.
4. Report residual risks and mitigation for protected proof.

## Dependencies
- Candidate deploy and smoke evidence from `LUC-37-B` and backend behavior from `LUC-37-A`.
- QA blockers from `LUC-37-C` if user-flow proof requires auth context.

## Required Output
- Security lane report with evidence links.
- Explicit blocker matrix for what remains unproven (without approved operator inputs).

## Validation
- Security checklist evidence and fail-closed behavior checks.
- Exchange/auth boundary proof outputs matching `AI_TESTING_PROTOCOL.md`.

## Acceptance Criteria
- [ ] Auth/session read paths are proven to fail closed and not expose sensitive state.
- [ ] Exchange boundary behavior documented as safe for read-only path.
- [ ] Security risks are not hidden in "verified" status; unresolved risks are blocked with explicit ownership and next step.
