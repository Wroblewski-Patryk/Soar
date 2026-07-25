# Task

## Header
- ID: LUC-1868
- Title: [Soar][Coolify] Diagnose and recover workers-market-data exited:unhealthy
- Task Type: fix
- Current Stage: release
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: external Coolify deploy/start permission or an operator-run equivalent action
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: production worker readiness; Coolify runtime recovery
- Risk Rows: production runtime health; deploy permission boundary
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1868-WORKERS-MARKET-DATA-RECOVERY-2026-07-25
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
  diagnose the live Coolify state of `workers-market-data`, attempt the
  smallest governed recovery, and leave a precise blocker if the runtime token
  cannot legally mutate the resource.
- Release objective advanced:
  the acceptance blocker is narrowed to one worker plus one explicit
  permission boundary.
- Included slices:
  read-only Coolify inventory, direct app readback, env-key presence check,
  one targeted `start` attempt, post-attempt polling, reconciler refresh,
  acceptance-ledger refresh, and durable blocker evidence.
- Explicit exclusions:
  no repo code change, no env mutation, no broad redeploy, no secret-value
  disclosure, no production account/trading mutation.
- Checkpoint cadence:
  pre-mutation readback, direct mutation response, repeated post-attempt
  polling, reconciler refresh, acceptance-ledger refresh.
- Stop conditions:
  worker recovers to `running:unknown`; or Coolify denies the targeted action;
  or another first-class permission blocker appears.
- Handoff expectation:
  Coolify credential owner or approved operator must run the exact targeted
  start/restart path or grant the missing deploy capability, then rerun the
  same readback.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, issue body, Coolify contracts | issue framing, final disposition | integrated blocker packet | final readback | COMPLETE |
| Product/Requirements | coordinator | issue body | bounded DoD interpretation | resource-scoped release contract | issue/body parity | COMPLETE |
| Architecture | coordinator | worker topology docs, compose, worker ownership code | runtime topology interpretation | config-vs-runtime diagnosis | code inspection + Coolify readback | COMPLETE |
| Implementation | coordinator | Coolify app control path | `workers-market-data` only | targeted `start` attempt | direct API response | COMPLETE |
| QA/Test | coordinator | public Soar routes, reconciler, ledger | smoke verification | public health unchanged proof | HTTP status checks + refreshed reports | COMPLETE |
| Security/Ops/UX | coordinator | shared safety contracts | secret-safe evidence | no-secret blocker notes | presence-only env inspection | COMPLETE |
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
`LUC-1868` is a critical DRE lane under [LUC-25](/LUC/issues/LUC-25) for the
Soar production Coolify stack. After `LUC-1867` recovered
`workers-backtest`, the acceptance ledger still reported
`workers-market-data` as `exited:unhealthy`.

## Goal
Recover `workers-market-data` with the smallest governed Coolify mutation, or
leave a first-class blocker when the runtime binding lacks deploy permission.

## Success Signal
- User or operator problem:
  the production market-data worker is unhealthy in Coolify.
- Expected product or reliability outcome:
  `workers-market-data` returns to `running:unknown`, or the exact permission
  boundary preventing recovery is explicit.
- How success will be observed:
  direct Coolify app readback plus refreshed reconciler output and acceptance
  ledger status.
- Post-launch learning needed: yes

## Deliverable For This Stage
A release-lane diagnosis packet with live Coolify evidence, one minimal
mutation attempt, post-attempt verification, and an explicit unblock owner.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `workers-market-data` was read directly from Coolify.
- [x] one smallest governed recovery action was attempted.
- [x] repo truth now records the precise external blocker preventing
      completion.

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
  direct Coolify app readback, env-key presence inspection, logs-route probe,
  targeted `POST /api/v1/applications/{uuid}/start`, repeated polling, public
  route probes, sequential reconciler and acceptance-ledger refresh.
- Screenshots/logs:
  Coolify API JSON only; no screenshots; logs endpoint returned `400` because
  the application is not running.
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
- Reality status: blocked

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docker-compose.coolify.yml`,
  `apps/api/Dockerfile.worker.market-data`,
  `apps/api/src/workers/marketData.worker.ts`,
  `apps/api/src/workers/workerBootstrap.ts`,
  `apps/api/src/workers/workerOwnership.ts`.
- Fits approved architecture: no
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  not applicable
- Follow-up architecture doc updates:
  none in this lane; configuration drift and permission block are captured in
  evidence and issue status.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none applied
- Env or secret changes:
  none applied; env inspection was presence-only.
- Health-check impact:
  `workers-market-data` remained `exited:unhealthy`; public Web/API remained
  healthy.
- Smoke steps updated:
  none
- Rollback note:
  no rollback action exists because the targeted `start` mutation was denied
  with HTTP `403`.
- Observability or alerting impact:
  refreshed `softwarehouse:coolify-reconciler` and
  `softwarehouse:soar-acceptance-ledger` keep the acceptance blocker isolated
  to `workers-market-data`.
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  `workers-market-data` remained the sole unhealthy Soar resource after
  `workers-backtest` recovery.
- Gaps:
  acceptance-ledger truth depends on a fresh reconciler report.
- Inconsistencies:
  standalone market-data worker app lacks split-worker ownership and queue
  env keys that are present on `soar-api`.
- Architecture constraints:
  recover only one resource in this lane; preserve secret-safe reporting.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none required for this recovery lane.
- Sources scanned:
  issue body, prior `LUC-1867` evidence, Soar Coolify contract, reconciler and
  acceptance-ledger scripts, worker source, compose contract, live Coolify app
  and env readbacks.
- Rows created or corrected:
  none
- Assumptions recorded:
  safe assumption that a single targeted `start` is the smallest acceptable
  mutation for one isolated worker.
- Blocking unknowns:
  exact missing Coolify permission name was not returned in the `403`
  response body.
- Why it was safe to continue:
  the action was isolated to one non-public worker resource and preserved
  public-route verification.

### 2. Select One Priority Mission Objective
- Selected task:
  diagnose and recover `workers-market-data`.
- Priority rationale:
  active production worker failure in the release acceptance lane.
- Why other candidates were deferred:
  unrelated Soar work would not reduce this production reliability risk.

### 3. Plan Implementation
- Files or surfaces to modify:
  repo state/evidence files only.
- Logic:
  prove current live state, inspect config drift, attempt smallest recovery,
  capture exact external blocker if denied.
- Edge cases:
  public API/Web regression after the attempt, mutation denied with no body,
  stale acceptance-ledger output.

### 4. Execute Implementation
- Implementation notes:
  executed `POST /api/v1/applications/{workers-market-data}/start`; Coolify
  returned `403 Forbidden`; no code or env mutation was made.
  After the later `issue_blockers_resolved` wake and `LUC-1871` routing
  outcome, reran the exact same `start` action; Coolify still returned
  `403 Forbidden`, proving the owner-path unblock did not actually reach the
  live runtime credential.
  After the next `issue_blockers_resolved` wake and `LUC-1877` reroute
  completion, reran both exact allowed operations: `start` and `restart`.
  Coolify still returned `403 Forbidden` for both, so the DRE-bound runtime
  credential remained unchanged in practice.

### 5. Verify and Test
- Validation performed:
  read-only Coolify app/env calls, logs-route probe, repeated post-attempt
  polling, public route probes, reconciler refresh, acceptance-ledger refresh.
- Result:
  initially blocked; worker remained `exited:unhealthy` and the acceptance
  ledger reported `coolify_resources_reconciled` blocked on
  `workers-market-data`. After the final `issue_blockers_resolved` wake,
  upstream issues `LUC-1879` and `LUC-1882` returned real owner-executed
  recovery proof and fresh live Coolify readback in this lane confirmed
  `workers-market-data -> running:unknown` with
  `last_online_at=2026-07-25 21:38:36`. A local rerun of
  `pnpm run softwarehouse:coolify-reconciler` returned `overall=ready`, and
  `pnpm run softwarehouse:soar-acceptance-ledger` flipped
  `coolify_resources_reconciled` to `pass`. The ledger `overall` field stayed
  `blocked` only because the Soar worktree is locally dirty, which is a
  separate source-control gate rather than a remaining worker-runtime failure.

### 6. Self-Review
- Simpler option considered:
  stop at the first unhealthy status report without a mutation attempt.
- Why it was rejected:
  the issue explicitly allowed the smallest governed recovery action.
- Reuse check:
  used existing Coolify API bindings, existing reconciler and acceptance-ledger
  scripts, and the established worker recovery pattern from `LUC-1867`.
- Duplication check:
  no new runtime or docs framework introduced.

### 7. Update Documentation and Knowledge
- Updated files:
  this task packet, the evidence packet, and `.codex/context/PROJECT_STATE.md`.
- Why these updates are sufficient:
  the lane made no product-code or architecture-doc mutation; durable truth is
  the blocker/evidence record.

## Result Report
- Outcome:
  diagnosis complete, resource recovery verified done after upstream
  owner-executed Coolify mutation proof.
- Evidence summary:
  this lane proved the initial runtime failure and configuration drift,
  including missing `WORKER_MODE`, `WORKER_MARKET_DATA_OWNERSHIP`, and
  `WORKER_MARKET_DATA_QUEUE` env keys on the standalone worker app, while the
  exact DRE-bound `start` and `restart` mutations repeatedly failed with
  `403 Forbidden`. The final blocker-resolution wake confirmed
  `LUC-1879 -> done`, citing child recovery proof from `LUC-1882`; fresh
  Coolify readback in this lane then showed
  `workers-market-data -> running:unknown` with
  `last_online_at=2026-07-25 21:38:36`. A local reconciler rerun returned
  `overall=ready`, public Soar stayed green on `/`, `/health`, and `/ready`,
  and the acceptance ledger now marks `coolify_resources_reconciled` as `pass`.
- Residual risk:
  the recovered worker still has previously observed configuration drift
  relative to `soar-api`, and the acceptance ledger `overall` field remains
  blocked by unrelated local source-control cleanliness outside this runtime
  lane.
- Unblock owner:
  not applicable for `LUC-1868`; the resource-recovery objective is met.
- Unblock action:
  not applicable.
