# Task

## Header
- ID: LUC-1359
- Title: [Soar][Project Truth][Critical Runtime] Restore production runtime for api-ready-https-api-soar-luckysparrow-ch-ready-returned-503-state
- Task Type: release
- Current Stage: release
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: deploy-capable Coolify Redis mutation path or equivalent Ops executor
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: production API readiness; production Redis dependency health
- Risk Rows: production runtime health
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1359-API-READY-503-RUNTIME-2026-07-17
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
  restore production API readiness or leave a precise first-class blocker for the narrowest recovery action.
- Release objective advanced:
  the outage is now bounded to the production Redis dependency path with exact Coolify and public-smoke evidence.
- Included slices:
  public smoke, readiness code-path inspection, protected auth attempt, Coolify read-only status readback, deploy-path probe, session-auth Coolify probe, and source-of-truth updates.
- Explicit exclusions:
  no repo code change, no push, no broad redeploy, no unrelated resource mutation, no secret-value disclosure, no production data or trading mutation.
- Checkpoint cadence:
  public baseline, protected baseline, Coolify resource readback, mutation-path attempt, post-attempt recheck.
- Stop conditions:
  API `/ready` returns `200`; or the remaining recovery step requires permissions unavailable in this runner.
- Handoff expectation:
  Ops or Security injects a deploy-capable Coolify credential path or directly restarts the Redis resource, then reruns the bounded smoke.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, deploy contracts, heartbeat payload | issue framing, evidence, final blocker packet | integrated diagnosis and unblock path | parent validation | COMPLETE |
| Product/Requirements | coordinator | issue body | bounded DoD interpretation | scoped recovery contract | issue/body parity | COMPLETE |
| Architecture | coordinator | readiness code, deployment topology docs | runtime dependency diagnosis | dependency-level fault boundary | code inspection + live probes | COMPLETE |
| Implementation | coordinator | Coolify auth surfaces | smallest allowed recovery attempts | governed mutation-path proof | API/session restart-path attempts | BLOCKED |
| QA/Test | coordinator | production public routes | smoke verification | current live status packet | HTTP probes | COMPLETE |
| Security/Ops/UX | coordinator | Coolify auth and permission boundary | secret-safe reporting | no-secret blocker packet | env names only, redacted outputs | COMPLETE |
| Documentation/Memory | coordinator | task board, project state, system health | durable repo truth | task/evidence/state updates | file updates | COMPLETE |

### Lane Checks
- [ ] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [ ] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [ ] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-1359` is a critical Soar production runtime incident on Friday, July 17, 2026. Public Web is up, but public API readiness is failing with `503`, blocking release confidence and matching a live degraded Redis dependency state in Coolify.

## Goal
Restore production API readiness or prove the exact remaining blocker with enough precision for the next mutation-capable responder to act immediately.

## Success Signal
- User or operator problem:
  `https://api.soar.luckysparrow.ch/ready` returns `503`.
- Expected product or reliability outcome:
  API readiness returns `200` again and dependent protected auth/runtime checks recover.
- How success will be observed:
  API `/health` `200`, API `/ready` `200`, Coolify `redis` no longer `restarting:unhealthy`, and admin-auth path stops timing out.
- Post-launch learning needed: yes

## Deliverable For This Stage
A release blocker packet with exact live state, attempted recovery paths, and the named permission/action needed to finish restoration.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] current public production status was re-proved
- [x] the exact dependency failure was narrowed with live Coolify evidence
- [x] the blocking permission/action to finish the fix was made explicit

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
  public production route probes; admin login timeout probe; Coolify resource, database, applications, and deployment readbacks; Coolify bearer-token restart verb probes; Coolify session-login probe.
- Screenshots/logs:
  no screenshots; sanitized Coolify API previews only; sanitized API log preview for `soar-api`.
- High-risk checks:
  no secret values printed or stored; no production data mutation; no exchange or user-account mutation.
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
  `apps/api/src/router/index.ts`,
  `apps/api/src/config/runtimeDependencyReadiness.ts`,
  `apps/api/src/config/criticalSecretsReadiness.ts`,
  `docs/operations/post-deploy-smoke-checklist.md`,
  `docs/operations/deployment-rollback-playbook.md`,
  `docs/operations/coolify-vps-deployment-contract.md`,
  `docs/operations/service-topology.md`.
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
  API `/ready` remains `503`; Web `/` and Web `/api/build-info` remain `200`
- Smoke steps updated:
  none
- Rollback note:
  issue is isolated to current Redis health; no rollback or redeploy executed from this runner
- Observability or alerting impact:
  incident now has a direct Coolify Redis-health correlation
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  API `/ready` is `503`; admin login times out; Coolify reports Redis `restarting:unhealthy`.
- Gaps:
  current bound Coolify API token lacks deploy permission.
- Inconsistencies:
  public API `/health` is healthy while readiness fails, indicating dependency or secret readiness rather than full process outage.
- Architecture constraints:
  production readiness explicitly fails closed on Redis/database/critical-secret issues.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none required for this lane
- Sources scanned:
  deploy contracts, prior LUC-6898 evidence, system health, readiness code
- Rows created or corrected:
  task/evidence/state records only
- Assumptions recorded:
  safe assumption that Redis was the dominant fault because readiness and auth both degraded while Web stayed up
- Blocking unknowns:
  exact Redis container-level repair action remains unexecuted because deploy permission is absent
- Why it was safe to continue:
  all probes were read-only except permission-safe restart-path attempts against authenticated Coolify surfaces

### 2. Select One Priority Mission Objective
- Selected task:
  restore or bound the API readiness `503`
- Priority rationale:
  active production runtime degradation
- Why other candidates were deferred:
  unrelated Soar work would not reduce the live outage

### 3. Plan Implementation
- Files or surfaces to modify:
  evidence/task/state files only
- Logic:
  prove public failure, inspect readiness code, confirm dependency status in Coolify, attempt minimal recovery path, record blocker
- Edge cases:
  stale public signal, auth-only degradation, read-only Coolify token, CSRF/session mismatch

### 4. Execute Implementation
- Implementation notes:
  no repo code changes; executed live probes and bounded Coolify auth/mutation-path checks only

### 5. Verify and Test
- Validation performed:
  live HTTP route probes and Coolify API reads
- Result:
  blocked; root cause narrowed to unhealthy Redis plus unavailable deploy-capable mutation path

### 6. Self-Review
- Simpler option considered:
  stop after public smoke only
- Technical debt introduced: no
- Scalability assessment:
  evidence is reusable for the next DRE/Ops responder
- Refinements made:
  proved both read-only and session-auth mutation boundaries instead of assuming the token was the only blocker

### 7. Update Documentation and Knowledge
- Docs updated:
  evidence/task packet and state files
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
