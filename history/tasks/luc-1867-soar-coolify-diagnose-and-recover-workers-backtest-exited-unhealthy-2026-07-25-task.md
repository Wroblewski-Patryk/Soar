# Task

## Header
- ID: LUC-1867
- Title: [Soar][Coolify] Diagnose and recover workers-backtest exited:unhealthy
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: none; follow-up unhealthy worker lane delegated separately
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: production worker readiness; Coolify runtime recovery
- Risk Rows: production runtime health; stale acceptance-gate readback
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1867-WORKERS-BACKTEST-RECOVERY-2026-07-25
- Mission Status: VERIFIED

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
  recover `workers-backtest` with the smallest governed Coolify action and leave
  the acceptance gate with an accountable next owner if another resource still
  blocks the ledger.
- Release objective advanced:
  production Coolify inventory no longer reports `workers-backtest` unhealthy.
- Included slices:
  read-only Coolify inventory, deployment/app readback, env-key presence check,
  one targeted `start`, post-action polling, acceptance-ledger refresh, and
  follow-up issue creation for the remaining unhealthy resource.
- Explicit exclusions:
  no repo code change, no env mutation, no broad redeploy, no secret-value
  disclosure, no production account/trading mutation.
- Checkpoint cadence:
  before mutation, immediate post-start readback, repeated app polling,
  reconciler refresh, sequential acceptance-ledger refresh.
- Stop conditions:
  `workers-backtest` returns to `running:unknown`; or the targeted start fails;
  or a first-class permission blocker appears.
- Handoff expectation:
  `LUC-1868` now owns `workers-market-data`; this issue closes on the recovered
  `workers-backtest` slice.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, issue body, Coolify contracts | issue framing, final disposition | integrated recovery packet | final readback | COMPLETE |
| Product/Requirements | coordinator | issue body | bounded DoD interpretation | resource-scoped release contract | issue/body parity | COMPLETE |
| Architecture | coordinator | worker topology docs, compose, worker bootstrap | runtime topology interpretation | config-vs-runtime diagnosis | code inspection + Coolify readback | COMPLETE |
| Implementation | coordinator | Coolify app control path | `workers-backtest` only | targeted `start` recovery | before/after resource state | COMPLETE |
| QA/Test | coordinator | public Soar routes, reconciler, ledger | smoke verification | public health unchanged proof | HTTP status checks + refreshed reports | COMPLETE |
| Security/Ops/UX | coordinator | shared safety contracts | secret-safe evidence | no-secret recovery notes | presence-only env inspection | COMPLETE |
| Documentation/Memory | coordinator | task/evidence/state files | durable repo truth | task packet, evidence packet, state entry | file updates | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-1867` is a critical DRE lane under [LUC-25](/LUC/issues/LUC-25) for the
Soar production Coolify stack. The acceptance ledger reported
`workers-backtest` as `exited:unhealthy`, while public Soar remained reachable.

## Goal
Recover `workers-backtest` with the smallest governed Coolify mutation and
refresh the acceptance evidence without widening scope into unrelated resources.

## Success Signal
- User or operator problem:
  the production backtest worker was unhealthy in Coolify.
- Expected product or reliability outcome:
  `workers-backtest` returns to `running:unknown` and public Soar remains
  healthy.
- How success will be observed:
  direct Coolify app readback plus refreshed reconciler output and public route
  checks.
- Post-launch learning needed: yes

## Deliverable For This Stage
A release-lane recovery packet with before/after Coolify evidence, one minimal
mutation, refreshed report outputs, and explicit follow-up ownership for the
remaining `workers-market-data` blocker.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `workers-backtest` was read directly from Coolify and recovered to
      `running:unknown`.
- [x] public Soar reachability remained healthy during the recovery.
- [x] the refreshed acceptance ledger no longer lists `workers-backtest`; the
      remaining `coolify_resources_reconciled` blocker is delegated to
      `LUC-1868` for `workers-market-data`.

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
  direct Coolify app readback, logs-route probe, env-key presence inspection,
  targeted `POST /api/v1/applications/{uuid}/start`, repeated polling, public
  route probes, sequential reconciler and acceptance-ledger refresh.
- Screenshots/logs:
  Coolify API JSON only; no screenshots; log route stayed value-free with
  `Application is not running.` before recovery.
- High-risk checks:
  no secret values recorded; only env-key presence was inspected; public Web
  and API health remained stable.
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
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docker-compose.coolify.yml`,
  `apps/api/src/workers/backtest.worker.ts`,
  `apps/api/src/workers/workerBootstrap.ts`,
  `apps/api/src/workers/workerOwnership.ts`,
  `apps/api/Dockerfile.worker.backtest`.
- Fits approved architecture: no
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  not applicable
- Follow-up architecture doc updates:
  none in this lane; configuration mismatch evidence is carried forward via
  `LUC-1868`.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes:
  none applied; env inspection was presence-only.
- Health-check impact:
  `workers-backtest` recovered to `running:unknown`; public Web/API remained
  healthy.
- Smoke steps updated:
  none
- Rollback note:
  one targeted `start` was sufficient; no rollback action was required.
- Observability or alerting impact:
  refreshed `softwarehouse:coolify-reconciler` and
  `softwarehouse:soar-acceptance-ledger` now isolate the remaining blocker to
  `workers-market-data`.
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  `workers-backtest` and `workers-market-data` were unhealthy in the fresh
  inventory; public Soar was still reachable.
- Gaps:
  acceptance-ledger truth depends on a fresh reconciler report.
- Inconsistencies:
  standalone worker apps lacked split-worker ownership env keys and still
  advertised `ports_exposes=3001` plus `health_check_path=/`.
- Architecture constraints:
  recover only one resource in this lane; preserve secret-safe reporting.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none required for this recovery lane.
- Sources scanned:
  issue body, Coolify reconciler/ledger scripts, prior `LUC-910` evidence,
  worker source, compose contract, live Coolify app/deployment/env readbacks.
- Rows created or corrected:
  none
- Assumptions recorded:
  safe assumption that a single targeted `start` is the smallest acceptable
  mutation for one isolated worker.
- Blocking unknowns:
  exact root cause inside the `workers-market-data` resource remains outside the
  scope of this issue.
- Why it was safe to continue:
  the action was limited to one non-public worker and followed direct readback.

### 2. Select One Priority Mission Objective
- Selected task:
  diagnose and recover `workers-backtest`.
- Priority rationale:
  active production worker health regression in a critical release lane.
- Why other candidates were deferred:
  the remaining worker issue was split into a separate follow-up owner lane.

### 3. Plan Implementation
- Files or surfaces to modify:
  task/evidence/state files only.
- Logic:
  prove current state, compare config presence, perform one targeted recovery,
  refresh reports, delegate the remaining worker blocker.
- Edge cases:
  queued deployment with delayed visibility, stale acceptance-ledger report,
  remaining unrelated unhealthy resource.

### 4. Execute Implementation
- Implementation notes:
  executed `POST /api/v1/applications/{workers-backtest}/start`; received
  `deployment_uuid=ree11oesp4xmxlest1x0flim`; polled until the deployment
  finished and the app reported `running:unknown`.

### 5. Verify and Test
- Validation performed:
  public Soar HTTP checks, direct Coolify app/deployment/env calls, repeated app
  polling, reconciler reruns, sequential acceptance-ledger rerun.
- Result:
  pass for `workers-backtest`; residual blocker now isolated to
  `workers-market-data`.

### 6. Self-Review
- Simpler option considered:
  stop after read-only diagnosis.
- Technical debt introduced: no
- Scalability assessment:
  the same recovery pattern can be reused for future single-resource Coolify
  incidents.
- Refinements made:
  captured deployment-finished proof, presence-only env drift, and the
  acceptance-ledger race condition.

### 7. Update Documentation and Knowledge
- Docs updated:
  task packet, evidence packet, `PROJECT_STATE` entry.
- Context updated:
  yes
- Learning journal updated: not applicable.

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

## Result Report
- Task summary:
  recovered `workers-backtest` with one targeted Coolify `start`, confirmed the
  app returned to `running:unknown`, and split the remaining ledger blocker into
  `LUC-1868` for `workers-market-data`.
- Files changed:
  `history/tasks/luc-1867-soar-coolify-diagnose-and-recover-workers-backtest-exited-unhealthy-2026-07-25-task.md`,
  `history/evidence/luc-1867-soar-coolify-workers-backtest-recovery-2026-07-25.md`,
  `.codex/context/PROJECT_STATE.md`.
- Validation run:
  `pnpm run softwarehouse:coolify-reconciler`;
  `pnpm run softwarehouse:soar-acceptance-ledger`;
  direct Coolify app/deployment/env probes;
  public production health probes.
- Deployment impact:
  one isolated worker resource start only.
- Residual risk:
  `workers-market-data` remains `exited:unhealthy` and keeps the overall
  acceptance ledger blocked until `LUC-1868` resolves it.
