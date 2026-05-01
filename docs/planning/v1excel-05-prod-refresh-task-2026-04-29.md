# Task

## Header
- ID: V1EXCEL-05
- Title: Refresh fresh production release-gate evidence on the current candidate
- Task Type: ops
- Current Stage: verification
- Status: BLOCKED
- Owner: Codex Execution Agent
- Depends on: `V1EXCEL-04`
- Priority: P0

## Context
The repository still requires current-day production activation evidence on the
latest candidate SHA before `V1` can be called fully excellent for real money.

## Goal
Refresh production confidence and classify the exact remaining blockers if the
required authenticated execution cannot be performed from this session.

## Deliverable For This Stage
Fresh production-status evidence separating:
- public smoke truth,
- release-gate dry-run evidence classification,
- and the missing private-route auth plus stale-evidence blockers.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Public production smoke is refreshed or fails with exact evidence
- [x] Production release gate is exercised at least in dry-run form
- [x] Stale production evidence families are listed explicitly
- [x] Protected-route auth blocker is listed explicitly
- [ ] Fresh authenticated production evidence families are regenerated

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
  - 2026-05-01 production public smoke PASS on current deployed runtime
    candidate:
    - API `/health`: `200`
    - API `/ready`: `200`
    - Web `/`: `200`
  - 2026-05-01 protected production runtime freshness PASS:
    - `workerHeartbeat`: PASS
    - `marketData`: PASS
    - `runtimeSignalLag`: PASS
    - `runtimeSessions`: PASS, `runningCount=4`, `staleSessionIds=[]`
  - 2026-05-01 protected production rollback guard PASS:
    - `shouldRollback=false`
    - `reasons=[]`
    - `alerts=[]`
  - prod public smoke PASS
  - prod release gate dry-run executed
  - unauthenticated runtime freshness probe returned `401`
  - unauthenticated rollback guard returned `shouldRollback=true`
- Manual checks:
  - confirmed production OPS/private-route credentials are not available in this session
- Screenshots/logs: not applicable
- High-risk checks:
  - did not treat public `/health` and `/ready` as a substitute for protected production evidence

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
- Rollback note: fresh rollback proof remains pending authenticated OPS access

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
This task moves production confidence from vague to exact: the current blocker
is not generic uncertainty, but stale prod artifacts plus missing private-route
auth for the protected proofs.

2026-05-01 refresh: production protected auth is now available for the core
runtime gates. Public production smoke, runtime freshness, and rollback guard
are green on the current deployed runtime candidate. The task remains open for
broader release evidence families: restore drill, rollback-proof artifact, RC
status/sign-off/checklist rebuild, and remaining manual matrix scenarios.
Evidence: `docs/operations/v1excel-05-prod-refresh-2026-05-01.md`.

## Production-Grade Required Contract

### Goal
Produce an honest current-day production evidence state for the latest
candidate.

### Scope
- prod public smoke
- prod release-gate dry-run
- blocker classification
- canonical queue/context sync

### Implementation Plan
1. Run public production smoke.
2. Run production release-gate dry-run.
3. Probe protected runtime gates without auth to classify the failure boundary.
4. Publish the remaining stale-evidence and auth blockers.

### Acceptance Criteria
- public production reachability is freshly recorded
- stale production evidence families are listed exactly
- the protected-route auth blocker is explicit

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: partial, public production smoke only
- Endpoint and client contract match: partial
- DB schema and migrations verified: not from production in this session
- Loading state verified: not applicable
- Error state verified: yes, `401` on protected OPS routes
- Refresh/restart behavior verified: no
- Regression check performed: canonical prod release-gate dry-run

## Result Report

- Task summary: refreshed public production smoke and proved that the remaining
  production blocker is stale evidence plus missing OPS/private-route auth
- Files changed: prod evidence docs plus canonical queue/context sync
- How tested:
  - prod public smoke PASS
  - prod release-gate dry-run
  - runtime freshness `401`
  - rollback guard `401`-driven failure
- What is incomplete:
  - fresh authenticated prod evidence families beyond public smoke, runtime
    freshness, and rollback guard
  - production restore-drill evidence
  - production rollback-proof artifact with secret-safe command recording
  - RC external gate status/sign-off/checklist rebuild
  - remaining manual operator matrix items
- Next steps:
  - restore stage first, because `V1EXCEL-05` depends on `V1EXCEL-04`
  - rerun prod restore-drill, rollback-proof, RC, and remaining diagnostics
    with secret-safe artifact handling
