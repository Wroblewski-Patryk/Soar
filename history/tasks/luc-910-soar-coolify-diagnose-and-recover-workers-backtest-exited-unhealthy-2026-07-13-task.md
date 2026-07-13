# Task

## Header
- ID: LUC-910
- Title: [Soar][Coolify] Diagnose and recover workers-backtest exited:unhealthy
- Task Type: fix
- Current Stage: release
- Status: COMPLETE
- Owner: Ops/Release
- Depends on: none; Coolify recovery verified by repeated readback
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: production worker readiness; deploy recovery
- Risk Rows: production runtime health; deploy observability gap
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-910-WORKERS-BACKTEST-RECOVERY-2026-07-13
- Mission Status: COMPLETE

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective:
  Diagnose the live Coolify state of `workers-backtest`, attempt the smallest governed recovery, and leave a precise blocker if the resource does not return.
- Release objective advanced:
  production worker-failure state is bounded with concrete Coolify evidence and a verified recovery.
- Included slices:
  read-only Coolify inventory, env-key inspection, public smoke readback, code-path inspection, one targeted Coolify `start` action, post-action verification, and source-of-truth updates.
- Explicit exclusions:
  no broad redeploy of Soar, no unrelated resource mutations, no secret-value disclosure, no production account/trading mutation, no repo code change.
- Checkpoint cadence:
  pre-mutation readback, immediate post-start check, deployment-queue recheck, final blocker packet.
- Stop conditions:
  resource returns healthy; or recovery stalls without new read access/log evidence; or permission boundary blocks further safe action.
- Handoff expectation:
  ordinary monitoring only; reopen a bounded reliability lane if a later readback proves recurrence.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, Coolify deployment contract, heartbeat-context | issue framing, state sync, final blocker packet | integrated diagnosis and blocker path | parent validation | COMPLETE |
| Product/Requirements | coordinator | issue body | bounded DoD interpretation | scoped recovery contract | issue/body parity | COMPLETE |
| Architecture | coordinator | `docker-compose.coolify.yml`, worker ownership code | runtime topology readback | split-worker config findings | code inspection + env key presence | COMPLETE |
| Implementation | coordinator | Coolify app control path | targeted `start` on `workers-backtest` only | smallest governed recovery attempt | before/after Coolify readback | COMPLETE |
| QA/Test | coordinator | public domains, Coolify API | smoke verification | public health unchanged evidence | `curl` HTTP 200/401 checks | COMPLETE |
| Security/Ops/UX | coordinator | shared contracts | secret-safe reporting only | no-secret blocker packet | env keys only, no values | COMPLETE |
| Documentation/Memory | coordinator | task board, project state, system health, next steps | durable repo truth | task/evidence packet | file updates | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-910` is a critical production reliability lane under [LUC-25](/LUC/issues/LUC-25). The live Soar Coolify environment reports `workers-backtest` as `exited:unhealthy` while public API and Web routes remain reachable.

## Goal
Restore `workers-backtest` if a single bounded Coolify action succeeds; otherwise leave a precise blocker with concrete runtime/config evidence.

## Success Signal
- User or operator problem:
  the production backtest worker is down in Coolify.
- Expected product or reliability outcome:
  the worker is running again, or the exact blocker to safe recovery is explicit.
- How success will be observed:
  Coolify app status changes away from `exited:unhealthy`, deployment/readiness evidence updates, and public Soar routes stay healthy.
- Post-launch learning needed: yes

## Deliverable For This Stage
A release/ops blocker packet with live Coolify evidence, one minimal recovery attempt, post-action verification, and updated repo truth.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `workers-backtest` live state was read directly from Coolify.
- [x] one smallest governed recovery action was attempted after evidence capture.
- [x] repo truth now records whether the lane is recovered or blocked.

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
  not applicable; no code change.
- Manual checks:
  read-only Coolify inventory and env-key inspection; one targeted `start`; post-start deployment and status rechecks; public API/Web `curl` probes.
- Screenshots/logs:
  Coolify API JSON responses only; no screenshots; logs endpoint returned `Application is not running`.
- High-risk checks:
  no secret values recorded; public API `/health` and `/ready` plus Web `/` remained `200`; unauthenticated `/workers/ready` remained fail-closed `401`.
- Module confidence ledger updated: not applicable
- Module confidence rows closed or changed:
  not applicable
- Requirements matrix updated: not applicable
- Requirement rows closed or changed:
  not applicable
- Quality scenarios updated: no
- Quality scenario rows closed or changed:
  not applicable
- Risk register updated: no
- Risk rows closed or changed:
  not applicable
- Reality status: recovered

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docker-compose.coolify.yml`, `apps/api/Dockerfile.worker.backtest`, `apps/api/src/workers/backtest.worker.ts`, `apps/api/src/workers/workerOwnership.ts`, `apps/api/src/router/workers-health-readiness.test.ts`.
- Fits approved architecture: no
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  not applicable
- Follow-up architecture doc updates:
  none in this recovery lane; retain the env-key difference as a monitored configuration observation.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes:
  none applied; env inspection was key-presence only.
- Health-check impact:
  `workers-backtest` recovered to `running:unknown`; public Web/API remained healthy.
- Smoke steps updated:
  none
- Rollback note:
  targeted `start` restored the isolated worker after the initial asynchronous
  readback delay; no rollback action was required.
- Observability or alerting impact:
  reconciler and acceptance-ledger readbacks now provide closure evidence;
  ordinary recurrence monitoring remains appropriate.
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  initial `workers-backtest` outage recovered after the targeted Coolify start;
  standalone worker env keys still differ from the API app.
- Gaps:
  proof scripts live in the Paperclip control-plane workspace and must be run there.
- Inconsistencies:
  API app contains `WORKER_MODE` and worker queue/ownership keys; standalone worker apps do not.
- Architecture constraints:
  split-worker production contract expects backtest worker ownership/queue wiring.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none required for this lane.
- Sources scanned:
  heartbeat-context, `docs/operations/coolify-vps-deployment-contract.md`, `docker-compose.coolify.yml`, worker source and tests.
- Rows created or corrected:
  none
- Assumptions recorded:
  safe assumption that a targeted `start` is the smallest acceptable mutation for a down isolated worker.
- Blocking unknowns:
  none for this recovery lane; exact terminal deployment-row status was not
  required once repeated live resource readback proved stable recovery.
- Why it was safe to continue:
  the action was isolated to one non-public worker resource and followed direct before/after verification.

### 2. Select One Priority Mission Objective
- Selected task:
  diagnose and recover `workers-backtest`.
- Priority rationale:
  active production worker failure in a critical release lane.
- Why other candidates were deferred:
  unrelated Soar work would not reduce this production reliability risk.

### 3. Plan Implementation
- Files or surfaces to modify:
  repo state/evidence files only.
- Logic:
  prove current live state, inspect config drift, attempt smallest recovery, capture exact blocker.
- Edge cases:
  public API/Web regression after worker start, deploy queue that never completes, unavailable log endpoint.

### 4. Execute Implementation
- Implementation notes:
  performed one targeted Coolify `start` request against `workers-backtest`; no code or env mutation was made.

### 5. Verify and Test
- Validation performed:
  read-only Coolify app/env/deployment calls; `curl` production route checks; code inspection.
- Result:
  pass; repeated reconciler reads and the acceptance resource check confirm recovery.

### 6. Self-Review
- Simpler option considered:
  stop after read-only diagnosis.
- Technical debt introduced: no
- Scalability assessment:
  reusable for future single-resource Coolify failure triage.
- Refinements made:
  captured env-key drift and deployment UUID, not only high-level app status.

### 7. Update Documentation and Knowledge
- Docs updated:
  task/evidence packet plus state files.
- Context updated:
  yes
- Learning journal updated: no.

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment assessed; residual env-key drift is recorded as a non-blocking observation.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran after accepted lane integration.

## Notes
- The queued Coolify deployment reports commit `b0b2c2ce9477a32fcda7717f447ad46aa4327589` while the live app object still reports commit `871783eadc0e6166b6712d6ada26ed175a505ce8`.
- Initial `workers-backtest` log reads were unavailable while Coolify reported
  the application down. Later resource readbacks consistently report it running.

## Result Report

- Task summary:
  diagnosed the live `workers-backtest` outage, verified standalone-worker env
  drift, applied one targeted Coolify `start`, and confirmed stable recovery in
  three later control-plane reconciler reads.
- Files changed:
  `history/tasks/luc-910-soar-coolify-diagnose-and-recover-workers-backtest-exited-unhealthy-2026-07-13-task.md`
  `history/evidence/luc-910-workers-backtest-exited-unhealthy-2026-07-13.md`
  `.codex/context/TASK_BOARD.md`
  `.codex/context/PROJECT_STATE.md`
  `.agents/state/system-health.md`
  `.agents/state/next-steps.md`
- How tested:
  Coolify read-only app/env/deployment endpoints, one targeted Coolify `start`,
  public API/Web probes, three later reconciler reads, and the Soar acceptance
  ledger resource check.
- What is incomplete:
  no active runtime blocker; the residual env-key difference remains a monitored observation.
- Next steps:
  ordinary monitoring; open a new bounded lane only if runtime evidence proves recurrence.
- Decisions made:
  treated a single isolated `start` as the smallest safe recovery action and
  waited for repeated readback before declaring success; no speculative env mutation followed.
