# Task

## Header
- ID: V1EXCEL-06
- Title: Verify active LIVE worker and runtime diagnostics under current truth
- Task Type: ops
- Current Stage: verification
- Status: BLOCKED
- Owner: Codex Execution Agent
- Depends on: `V1EXCEL-05`
- Priority: P0

## Context
The activation contract requires more than public reachability. It requires
fresh proof that protected runtime diagnostics are healthy for the current
candidate.

## Goal
Prove what runtime observability can be verified from this session and classify
exactly what remains blocked.

## Deliverable For This Stage
Fresh runtime-observability evidence showing the current boundary between
existing protected endpoints and missing authorization to inspect them.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Runtime observability probes are executed against current stage and prod targets
- [x] The auth-gated boundary is classified precisely
- [ ] Protected worker/runtime diagnostics are verified successfully with auth

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
  - stage runtime freshness probe -> `401`
  - prod runtime freshness probe -> `401`
  - stage rollback guard probe -> auth-blocked
  - prod rollback guard probe -> auth-blocked
- Manual checks:
  - confirmed OPS/private-route credentials are absent from the environment
- Screenshots/logs: not applicable
- High-risk checks:
  - refused to infer runtime health from public probes alone

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
- Rollback note: protected runtime diagnostics remain pending authenticated access

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
This task proves the presence of protected runtime diagnostics, not their
current healthy state. Health remains unverifiable here without OPS auth.

## Production-Grade Required Contract

### Goal
Classify runtime observability truthfully for the current candidate.

### Scope
- stage and prod runtime observability probes
- blocker classification
- canonical queue/context sync

### Implementation Plan
1. Probe runtime freshness on stage and prod.
2. Probe rollback guard on stage and prod.
3. Classify the exact failure mode.

### Acceptance Criteria
- the auth boundary is explicit
- no public-only signal is mislabeled as full runtime confidence

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, protected OPS routes were probed directly
- Endpoint and client contract match: yes for the observed auth boundary
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: yes, explicit `401` boundary on protected routes
- Refresh/restart behavior verified: no
- Regression check performed: current target probes only

## Result Report

- Task summary: proved that runtime observability remains blocked by missing OPS auth
- Files changed: runtime observability doc plus canonical queue/context sync
- How tested:
  - stage and prod runtime freshness probes
  - stage and prod rollback-guard probes
- What is incomplete:
  - authenticated worker/runtime diagnostics
- Next steps:
  - rerun probes with real OPS/private-route credentials

