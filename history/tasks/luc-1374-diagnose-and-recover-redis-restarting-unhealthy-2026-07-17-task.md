# Task

## Header
- ID: LUC-1374
- Title: [Soar][Coolify][Critical Runtime] Diagnose and recover redis restarting:unhealthy
- Task Type: release
- Current Stage: release
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: deploy-capable Coolify Redis mutation path or equivalent Ops executor
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: production Redis dependency health; production API readiness
- Risk Rows: production runtime health
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1374-REDIS-RESTARTING-UNHEALTHY-2026-07-17
- Mission Status: BLOCKED

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
  recover production Redis or leave a first-class blocker with fresh live proof.
- Release objective advanced:
  the current blocker is freshly reproved as a Redis-health incident plus a
  missing deploy permission, not stale project state.
- Included slices:
  public smoke, Coolify resource readback, Redis/PostgreSQL direct readback,
  and permission-safe Redis mutation-path probes.
- Explicit exclusions:
  no repo code change, no push, no deploy, no rollback, no env edit, no
  database mutation, no Redis mutation, no production account mutation, and no
  secret-value disclosure.
- Checkpoint cadence:
  public baseline, Coolify baseline, database detail check, mutation-path
  probe, closeout.
- Stop conditions:
  Redis is recovered and API `/ready` returns `200`; or the remaining action
  requires permissions unavailable in this runner.
- Handoff expectation:
  Ops or Security executes the Redis recovery step or injects a
  deploy-capable Coolify credential path, then DRE reruns bounded smoke.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, issue wake payload, deploy contracts | issue framing, evidence, final blocker packet | integrated diagnosis and unblock path | parent validation | COMPLETE |
| Product/Requirements | coordinator | issue body | bounded release-scope outcome | scoped blocker contract | issue/body parity | COMPLETE |
| Architecture | coordinator | service-topology and readiness state | dependency-level runtime boundary | runtime fault isolation | live probes + topology docs | COMPLETE |
| Implementation | coordinator | Coolify API surfaces | smallest recovery attempt | permission-safe mutation-path proof | restart/start/stop probes | BLOCKED |
| QA/Test | coordinator | production public routes | fresh smoke packet | current live status | HTTP probes | COMPLETE |
| Security/Ops/UX | coordinator | Coolify secret-bound env names only | redacted operational reporting | no-secret blocker packet | env-name presence + API results | COMPLETE |
| Documentation/Memory | coordinator | task board, project state, active mission, system health | durable repo truth | task/evidence/state updates | file updates | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [ ] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [ ] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-1374` is the current critical DRE heartbeat for the Soar production Redis
incident on Friday, July 17, 2026. Earlier issue `LUC-1359` already narrowed
the runtime fault to Redis plus a missing deploy permission. This heartbeat
retests the live state rather than assuming the old blocker is still current.

## Goal
Recover production Redis if the runner now has the required rights; otherwise
leave the exact remaining blocker with fresh timestamps and resource proof.

## Success Signal
- User or operator problem:
  production Redis is `restarting:unhealthy` and API `/ready` is `503`.
- Expected product or reliability outcome:
  Redis returns to `running:healthy` and API readiness returns `200`.
- How success will be observed:
  Coolify `redis` is healthy, API `/ready` is `200`, and follow-up protected
  readiness smoke can proceed.
- Post-launch learning needed: yes

## Deliverable For This Stage
A release blocker packet with fresh live status, fresh mutation-path proof, and
the exact named unblock owner/action.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] fresh public and Coolify production state was reproved on Friday, July 17, 2026
- [x] fresh Redis mutation-path capability was tested safely
- [x] the remaining unblock owner/action was recorded with evidence

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
  public production route probes; Coolify version/team/resources reads;
  Redis/PostgreSQL direct database reads; Redis restart/start/stop permission
  probes.
- Screenshots/logs:
  no screenshots; redacted API results only.
- High-risk checks:
  no secret values printed or stored; no deploy; no production data mutation;
  no Redis mutation; no exchange or user-account mutation.
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
- Reality status: blocked

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/operations/service-topology.md`,
  `docs/operations/redis-aof-recovery-runbook.md`,
  `history/evidence/luc-1359-restore-production-api-ready-503-runtime-2026-07-17.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  not applicable
- Follow-up architecture doc updates:
  none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: high
- Env or secret changes:
  none applied
- Health-check impact:
  API `/health` remains `200`; API `/ready` remains `503`; Web `/` and Web
  `/api/build-info` remain `200`
- Smoke steps updated:
  none
- Rollback note:
  no deploy or rollback executed in this heartbeat
- Observability or alerting impact:
  incident remains directly correlated to the Coolify Redis resource health
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  API `/ready` still fails and Redis still restarts unhealthy.
- Gaps:
  current bearer token still lacks deploy permission for the Redis resource.
- Inconsistencies:
  earlier blocked evidence might have gone stale, so live recheck was required.
- Architecture constraints:
  Redis recovery is an infrastructure mutation owned by Ops/Security.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none required for this lane
- Sources scanned:
  prior `LUC-1359` task/evidence packet, deployment contracts, Redis runbook
- Rows created or corrected:
  task/evidence/state records only
- Assumptions recorded:
  safe assumption that the previous blocker might still apply, but it had to be
  re-proved
- Blocking unknowns:
  no deploy-capable credential path is available in this runner
- Why it was safe to continue:
  all runtime actions were read-only except permission-safe mutation probes

### 2. Select One Priority Mission Objective
- Selected task:
  diagnose and recover production Redis `restarting:unhealthy`
- Priority rationale:
  current production runtime blocker
- Why other candidates were deferred:
  unrelated Soar work would not reduce the live outage

### 3. Plan Implementation
- Files or surfaces to modify:
  evidence/task/state files only
- Logic:
  recheck public health, recheck Coolify resource state, test mutation
  capability, then record the exact blocker
- Edge cases:
  stale incident packet, changed permissions, or a shifted root cause

### 4. Execute Implementation
- Implementation notes:
  no repo code changes; only live probes and documentation/state updates

### 5. Verify and Test
- Validation performed:
  public route probes and Coolify API reads plus permission-safe mutation-path
  probes
- Result:
  blocked; Redis is still unhealthy and mutation permission is still missing

### 6. Self-Review
- Simpler option considered:
  inherit the old blocker without rechecking
- Technical debt introduced: no
- Scalability assessment:
  fresh packet is immediately reusable by Ops or Security
- Refinements made:
  live timestamps and direct Redis/PostgreSQL readback were refreshed

### 7. Update Documentation and Knowledge
- Docs updated:
  task/evidence/artifact packet and state files
- Context updated:
  yes
- Learning journal updated: no

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
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
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
