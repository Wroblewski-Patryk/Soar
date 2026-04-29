# Task

## Header
- ID: V1EXCEL-04
- Title: Refresh the latest stage release gate and smoke on the current candidate
- Task Type: ops
- Current Stage: verification
- Status: BLOCKED
- Owner: Codex Execution Agent
- Depends on: `V1EXCEL-03`
- Priority: P0

## Context
`V1EXCEL-01` identified stale stage evidence. The repository already contains a
canonical stage rehearsal flow, but it still requires real authenticated
target execution to count as fresh stage proof.

## Goal
Refresh stage confidence on the current candidate and classify the exact
external blocker if authenticated private-route execution is unavailable.

## Deliverable For This Stage
Fresh stage-status evidence separating:
- public smoke health,
- dry-run readiness evaluation,
- and the remaining private-route auth blocker.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Public stage smoke is refreshed or fails with exact evidence
- [x] Canonical stage rehearsal is exercised at least in dry-run form
- [x] The private-route blocker is classified precisely
- [ ] A fully authenticated stage release gate is executed

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - stage public smoke PASS
  - stage rehearsal dry-run executed
  - unauthenticated runtime freshness probe returned `401`
  - unauthenticated rollback guard returned `shouldRollback=true`
- Manual checks:
  - confirmed no stage OPS/private-route credentials are available in this session
- Screenshots/logs: not applicable
- High-risk checks:
  - did not misreport dry-run output as real stage proof

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: stage rollback path remains unverified today because OPS auth
  is unavailable for the protected route set

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This task proves the boundary cleanly: public stage is alive, private route
confidence remains blocked by missing credentials.

## Production-Grade Required Contract

### Goal
Refresh stage evidence honestly for the current candidate.

### Scope
- stage smoke
- stage rehearsal dry-run
- blocker classification
- canonical queue/context sync

### Implementation Plan
1. Run public stage smoke.
2. Run canonical stage rehearsal dry-run.
3. Probe authenticated stage-only gates without secrets to classify the failure.
4. Publish the exact blocker.

### Acceptance Criteria
- public stage reachability is freshly recorded
- dry-run rehearsal artifacts exist
- the missing authenticated input is explicit

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: partial, public stage smoke only
- Endpoint and client contract match: partial
- DB schema and migrations verified: not from stage in this session
- Loading state verified: not applicable
- Error state verified: yes, `401` on protected OPS routes
- Refresh/restart behavior verified: no
- Regression check performed: canonical stage release-gate dry-run

## Result Report

- Task summary: refreshed public stage smoke and classified authenticated stage
  gating as blocked by missing OPS auth
- Files changed: stage evidence docs plus canonical queue/context sync
- How tested:
  - stage public smoke PASS
  - stage rehearsal dry-run
  - runtime freshness `401`
  - rollback guard `401`-driven failure
- What is incomplete:
  - fully authenticated stage gate execution
- Next steps:
  - rerun stage rehearsal with real OPS/private-route credentials

