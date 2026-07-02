# LUC-6271 Production Performance And Server Health Watch - Task Contract

## Header

- ID: [LUC-6271](/LUC/issues/LUC-6271)
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production runtime health /
  Coolify production topology
- Requirement Rows: REQ-FUNC-021
- Quality Scenario Rows: deployment readiness / runtime reliability
- Risk Rows: production runtime health, Coolify queue watch, build provenance,
  host-level proof
- Iteration: recurring DRE heartbeat
- Operation Mode: TESTER
- Mission ID:
  `LUC-6271-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-30`
- Mission Status: VERIFIED

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the issue purpose as a verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was covered by existing Soar
      state and prior DRE evidence pattern.
- [x] `.agents/core/mission-control.md` was respected for bounded mission
      scope.
- [x] Missing or template-like state tables were not encountered in the touched
      scope.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block

- Mission objective:
  complete a read-only production performance and server-health watch for
  [LUC-6271](/LUC/issues/LUC-6271).
- Release objective advanced:
  production runtime confidence and Coolify topology watch.
- Included slices:
  deploy smoke, protected workers readiness, runtime freshness, rollback guard,
  public timing, authenticated dashboard/admin timing, Coolify read-only
  projection, source/build snapshot, evidence/state closure.
- Explicit exclusions:
  deploy, push, restart, rollback execution, env edit, secret/account value
  readback, DB/Redis mutation, raw log capture, production account mutation,
  subscription/payment mutation, exchange mutation, order, position, and live
  trading.
- Checkpoint cadence:
  one heartbeat proof packet.
- Stop conditions:
  production outage, rollback recommendation, credential failure, or
  unauthorized mutation requirement.
- Handoff expectation:
  close the issue if all read-only checks pass; otherwise block or route
  first-class follow-up.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | DRE active chat | Wake payload, prior DRE evidence | Integration, task closure, source truth | Mission packet and closure | Parent validation gate | DONE |
| Ops/Runtime Verification | DRE | Deploy smoke and runtime scripts | Production API/Web, runtime endpoints | Read-only health packet | Smoke/freshness/rollback/timing | DONE |
| Coolify Projection | DRE | Deploy safety contract | Coolify read-only API | Redacted topology/deploy queue evidence | GET projection | DONE |
| Documentation/Memory | DRE | Evidence and state files | `history/`, `.agents/state/`, `.codex/context/` | Durable evidence and state sync | File review | DONE |

### Lane Checks

- [x] `.agents/state/active-mission.md` was refreshed.
- [x] Responsibility lanes were limited to DRE ownership.
- [x] Every important responsibility from source docs has an owner or explicit
      omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not introduced.

## Context

[LUC-6271](/LUC/issues/LUC-6271) asks DRE to continue the recurring Soar
production performance and server-health watch. The inline wake payload had no
pending comments and `fallbackFetchNeeded=false`, so no issue-thread refetch
was needed before concrete verification.

## Goal

Produce a read-only production health watch that distinguishes real production
failure from recurring residual watch items.

## Success Signal

- User or operator problem:
  know whether production is currently healthy without mutating runtime state.
- Expected product or reliability outcome:
  production API/Web/protected workers/runtime checks pass, or a first-class
  blocker is named.
- How success will be observed:
  smoke/freshness/rollback/timing/Coolify evidence packet.
- Post-launch learning needed: no

## Deliverable For This Stage

Verification evidence and state sync for the current production watch.

## Scope

- Check Soar production API/Web endpoints.
- Check protected workers readiness through the approved smoke login path.
- Check runtime freshness and rollback guard.
- Check representative public and authenticated API timing.
- Check Coolify project/environment/resource/deployment projection.
- Record source/build snapshot and residual risks.

## Implementation Plan

1. Review the latest DRE production-watch evidence pattern.
2. Run read-only deploy smoke against production API/Web.
3. Run authenticated runtime freshness and rollback guard checks.
4. Run representative public/authenticated timing samples.
5. Read Coolify project/resource/deployment projection without printing
   secrets.
6. Update evidence, local state, and Paperclip disposition.

## Acceptance Criteria

- Deploy smoke passes or fails with exact endpoint evidence.
- Runtime freshness and rollback guard are recorded.
- Timing sample is recorded for public and authenticated production endpoints.
- Coolify resource/deployment projection is recorded without secret values.
- Residual risk and next owner/action are explicit.

## Constraints

- Use existing systems and approved mechanisms.
- Do not introduce new structures without approval.
- Do not implement workarounds.
- Do not duplicate logic.
- Stay within verification stage.
- Do not deploy, push, restart, execute rollback, edit environment, read secret
  values, mutate DB/Redis, capture raw logs, mutate accounts, mutate
  subscriptions/payments, mutate exchange state, place orders, change
  positions, or live-trade.
- Do not commit or push from the dirty/divergent shared worktree.
- Keep credential evidence to env-name/presence only.

## Definition of Done

- [x] Production deploy smoke completed.
- [x] Runtime freshness completed.
- [x] Rollback guard completed.
- [x] Public and authenticated timing completed.
- [x] Coolify read-only projection completed.
- [x] Evidence and source-truth state updated.
- [x] Paperclip disposition completed or blocked with control-plane evidence.

## Stage Exit Criteria

- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden

- Do not expose secret values, cookies, tokens, account passwords, API keys,
  payment data, or exchange credentials.
- Do not run a deploy, restart, rollback, migration, DB/Redis write, live
  exchange action, order, or position.
- Do not create a duplicate repair child unless the watch proves an actionable
  production defect.

## Validation Evidence

- Tests:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` PASS
  - `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` PASS with auth env aliases
  - `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` PASS with auth env aliases
- Manual checks:
  - public/authenticated timing sample PASS
  - Coolify read-only projection PASS
- Screenshots/logs: not applicable; no browser or raw log capture used.
- High-risk checks: no secret value readback; no production mutation.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed:
  SOAR-OPERATIONS-001 / production runtime health / Coolify production topology
- Requirements matrix updated: no, evidence-only recurring watch.
- Requirement rows closed or changed: not applicable
- Quality scenarios updated: no, evidence-only recurring watch.
- Quality scenario rows closed or changed: not applicable
- Risk register updated: yes
- Risk rows closed or changed:
  production runtime health, Coolify queue watch, build provenance,
  host-level proof
- Reality status: verified

## Architecture Evidence

- Architecture source reviewed:
  prior DRE evidence and deployment/Coolify contracts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence

- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: rollback guard returned `shouldRollback=false`
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues:
  recurring production watch; prior residuals include market-catalog cold
  samples, Coolify queued rows, `running:unknown` app status, build provenance,
  and host-level proof gap.
- Gaps:
  host-level VPS pressure/log-window proof still requires approved read-only
  host-status credentials.
- Inconsistencies:
  Coolify app inventory reports `running:unknown` while app-level smoke passes.
- Architecture constraints:
  Coolify must be treated as project -> production environment -> resources.

### 1a. Bootstrap Missing Project Knowledge

- Bootstrap needed: no
- Missing or template-like files: none in touched scope
- Sources scanned:
  prior [LUC-6252](/LUC/issues/LUC-6252) task/evidence and current state
  files.
- Rows created or corrected:
  new recurring watch rows only.
- Assumptions recorded:
  read-only watch can continue without deploy/restart permission.
- Blocking unknowns:
  none for this issue.
- Why it was safe to continue:
  checks are read-only and reuse approved smoke credential family.

### 2. Select One Priority Mission Objective

- Selected task:
  [LUC-6271](/LUC/issues/LUC-6271) production performance/server-health watch.
- Priority rationale:
  critical assigned DRE heartbeat.
- Why other candidates were deferred:
  wake contract scopes this heartbeat to [LUC-6271](/LUC/issues/LUC-6271).

### 3. Plan Implementation

- Files or surfaces to modify:
  evidence/task/state/context files only.
- Logic:
  run existing smoke/freshness/rollback scripts and small read-only timing/API
  probes.
- Edge cases:
  avoid secret value readback and avoid treating known Coolify inventory
  advisory status as app outage without app-level failure.

### 4. Execute Implementation

- Implementation notes:
  executed read-only production checks; no code/runtime mutation.

### 5. Verify and Test

- Validation performed:
  deploy smoke, runtime freshness, rollback guard, public timing,
  authenticated timing, Coolify GET projection.
- Result:
  all passed; residual watch items unchanged.

### 6. Self-Review

- Simpler option considered:
  deploy smoke only; rejected because the issue specifically covers
  performance and server-health watch.
- Technical debt introduced: no
- Scalability assessment:
  recurring watch remains script-based and low-risk.
- Refinements made:
  market-catalog cold sample was followed by focused repeated sample.

### 7. Update Documentation and Knowledge

- Docs updated:
  `history/evidence/luc-6271-production-performance-server-health-watch-2026-06-30.md`
  and this task contract.
- Context updated:
  active mission, system health, next steps, module confidence, risk register,
  project state, task board.
- Learning journal updated: not applicable.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to issue purpose.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was not needed; no recurring new pitfall confirmed.
- [x] Required responsibility lanes were integrated.
- [x] Parent validation ran after lane integration.

## Reliability / Observability Evidence

- Critical user journey:
  production API/Web reachability, protected workers readiness, dashboard/admin
  read-only APIs.
- SLI:
  endpoint availability, runtime freshness, rollback guard state, timing tail.
- SLO:
  no sustained production outage or rollback trigger in this watch window.
- Error budget posture: healthy for this window
- Health/readiness check:
  API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, API
  `/workers/ready`.
- Logs, dashboard, or alert route:
  rollback guard alerts `[]`; no raw logs captured.
- Smoke command or manual smoke:
  listed above.
- Rollback or disable path:
  rollback guard returned `shouldRollback=false`.

## Security / Privacy Evidence

- Data classification:
  production metadata and timing only.
- Trust boundaries:
  approved smoke login env family and Coolify read-only API.
- Permission or ownership checks:
  DRE read-only lane only.
- Abuse cases:
  no secret values, no production mutation, no live trading.
- Secret handling:
  env names/presence only; no token/cookie/password printed.
- Security tests or scans:
  not applicable for read-only watch.
- Fail-closed behavior:
  would block on missing credential or failed health check; not triggered.
- Residual risk:
  protected release/account input gates remain separate.

## Result Report

- Task summary:
  completed read-only production performance and server-health watch for
  [LUC-6271](/LUC/issues/LUC-6271).
- Files changed:
  evidence/task/state/context updates only.
- How tested:
  deploy smoke PASS, runtime freshness PASS, rollback guard PASS,
  public/authenticated timing PASS, Coolify read-only projection PASS.
- What is incomplete:
  host-level proof and release-grade build provenance remain separate gates;
  Coolify queued rows and market-catalog cold sample remain watch items.
- Next steps:
  no child repair issue from this heartbeat; continue existing owner paths for
  host-level proof, build provenance, protected input readiness, and app
  completion burn-down.
- Decisions made:
  no deploy/restart/repair child because no actionable production defect was
  reproduced.
