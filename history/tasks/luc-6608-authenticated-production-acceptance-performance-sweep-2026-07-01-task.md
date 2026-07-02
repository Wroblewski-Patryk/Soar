# Task

## Header
- ID: LUC-6608
- Title: Authenticated production acceptance and performance sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production auth/session, dashboard shell, admin shell, Web build metadata, worker readiness, production timing
- Requirement Rows: production authenticated acceptance, protected worker readiness, rollback guard
- Quality Scenario Rows: production availability, performance, release rollback readiness
- Risk Rows: production Web unavailable, protected runtime auth bindings unavailable in runner
- Iteration: 2026-07-01 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6608-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-07-01
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches QVE verification ownership.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the active AGENTS/state contract.
- [x] `.agents/core/mission-control.md` was represented through active mission state.
- [x] Missing or template-like state tables were not bootstrapped because this was a bounded verification heartbeat.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by proving the current production acceptance blocker.

## Mission Block
- Mission objective: prove whether Soar production can pass authenticated acceptance and performance gates now.
- Release objective advanced: V1 production acceptance evidence.
- Included slices: deploy smoke, runtime freshness, rollback guard, UI route clickthrough, auth-session proof attempt, representative public timing, browser cleanup check.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment mutation, order, position, subscription mutation, live-trading action.
- Checkpoint cadence: one heartbeat evidence packet.
- Stop conditions: Web `503`, protected runtime auth blocker, or any mutation requirement.
- Handoff expectation: blocked disposition with named unblock owner/action.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md, Paperclip wake payload | Integration, task closure, source-of-truth updates | Mission packet and final disposition | Parent validation gate | DONE |
| QA/Test | 09 QVE | role file, ops scripts | Production smoke and acceptance evidence | Evidence packet | Existing production harnesses | BLOCKED |
| Ops/Release | Ops Release Lead | release safety contract, LUC-6331 | Coolify production Web/backtest-worker restoration | Follow-up owner path | Post-restoration rerun | PENDING |
| Security/Ops | Security/Ops owner | protected input/account binding state | Approved protected runtime auth bindings | Follow-up owner path | Names-only binding readiness | PENDING |
| Documentation/Memory | Active chat | evidence/state contract | history evidence/task and state summaries | Durable project memory | File updates | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed.
- [x] Responsibility boundaries were respected.
- [x] No two write lanes own the same product file.
- [x] Each lane has expected output and validation/proof.
- [x] Missing ownership is not new; LUC-6331 and Security/Ops protected bindings remain the named owner paths.

## Context
Recurring QVE production acceptance must verify Soar as a production product:
public Web, authenticated routes, protected worker/runtime readiness, rollback
posture, and performance timing. Same-day state already showed Web `503` and
`soar-web` / `workers-backtest` restoration under [LUC-6331](/LUC/issues/LUC-6331).

## Goal
Run the smallest read-only production acceptance sweep that proves whether
authenticated acceptance can be accepted now.

## Success Signal
- User or operator problem: release acceptance must not pass on stale or unavailable production.
- Expected product or reliability outcome: either verified production acceptance or a clear blocker with owner/action.
- How success will be observed: accepted harness evidence and Paperclip disposition.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verification evidence packet and blocked/done disposition for LUC-6608.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within read-only verification

## Definition of Done
- [x] Production API health/readiness result recorded.
- [x] Web root/build-info result recorded.
- [x] Protected runtime/rollback result recorded.
- [x] UI route clickthrough artifact recorded.
- [x] Auth-session proof attempt result recorded.
- [x] Secret values are not printed or stored.
- [x] Issue disposition names the unblock owner/action.

## Stage Exit Criteria
- [x] The output matches verification stage.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment mutation, order, position, subscription mutation, or live-trading action
- accepting Web `503` as production-ready

## Validation Evidence
- Tests:
  - `pnpm run -s ops:deploy:smoke` -> FAIL; API health/ready PASS; Web `/` and build-info `503`; `/workers/ready` `401`.
  - `pnpm run -s ops:deploy:runtime-freshness` -> FAIL; runtime freshness endpoint `401` because current `DEPLOY_FRESHNESS_*` auth bindings are absent by name.
  - `pnpm run -s ops:deploy:rollback-guard` -> FAIL; `shouldRollback=true` with protected endpoint `401` reasons.
  - `pnpm run -s ops:ui:prod-clickthrough -- ...` -> FAIL and wrote artifact.
  - `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof ...` -> FAIL before artifact write; `build-info does not match expected SHA`.
- Manual checks:
  - env binding names only; no values printed.
  - `curl.exe` timing sample: API health/ready `200`; Web root/build-info `503`.
  - `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` returned no rows.
- Screenshots/logs: no screenshots captured; no secret/cookie output.
- High-risk checks: production non-mutation boundary preserved.
- Module confidence ledger updated: yes, via state summary.
- Requirements matrix updated: yes, via state summary.
- Quality scenarios updated: yes, via state summary.
- Risk register updated: yes, via state summary.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: production acceptance follows existing ops scripts and release gates.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: production Web and protected runtime gates fail.
- Smoke steps updated: no.
- Rollback note: guard reports `shouldRollback=true`; rollback was not executed.
- Observability or alerting impact: alerts endpoint not accepted in this runner due `401`.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: current production acceptance has same-day blockers from Web `503` and worker/runtime readiness.
- Gaps: protected runtime auth bindings absent by name for this runner.
- Inconsistencies: none requiring code action.
- Architecture constraints: use existing production ops harnesses.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: active mission, next steps, task board, Paperclip QVE role, release/evidence contracts, existing LUC-6551 packet.
- Rows created or corrected: scoped LUC-6608 evidence/task/state rows only.
- Assumptions recorded: Web `503` blocks accepted auth browser proof.
- Blocking unknowns: exact Coolify restoration state remains with LUC-6331.
- Why it was safe to continue: all checks were read-only.

### 2. Select One Priority Mission Objective
- Selected task: LUC-6608 production acceptance sweep.
- Priority rationale: critical recurring release gate.
- Why other candidates were deferred: wake payload scoped heartbeat to LUC-6608.

### 3. Plan Implementation
- Files or surfaces to modify: history evidence/task/state files only.
- Logic: reuse ops scripts; no product implementation.
- Edge cases: auth proof may fail before artifact write when build-info is unavailable.

### 4. Execute Implementation
- Implementation notes: ran read-only production checks and wrote LUC-6608 packet.

### 5. Verify and Test
- Validation performed: smoke, freshness, rollback guard, UI clickthrough, auth proof attempt, timing sample, process cleanup.
- Result: blocked.

### 6. Self-Review
- Simpler option considered: only deploy smoke; rejected because issue explicitly asks authenticated acceptance/performance sweep, so UI/auth/timing proof was needed.
- Technical debt introduced: no.
- Scalability assessment: existing harness reuse remains the scalable path.
- Refinements made: used a bounded auth-proof attempt after clickthrough confirmed Web `503`.

### 7. Update Documentation and Knowledge
- Docs updated: evidence, task packet, active mission, next steps, task board, project state, module/requirement/risk/system summaries.
- Context updated: yes.
- Learning journal updated: not applicable; no new pitfall beyond known production availability/auth-binding blocker.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Required responsibility lanes were integrated or tracked as follow-up.
- [x] Parent validation ran after lane integration.

## Result Report
- Task summary: production acceptance is blocked; API health/ready passes, but Web frontend returns `503`, protected runtime checks are not accepted from this runner, and auth proof fails closed before browser session evidence.
- Files changed:
  - `history/evidence/luc-6608-authenticated-production-acceptance-performance-sweep-2026-07-01.md`
  - `history/evidence/luc-6608-prod-ui-module-clickthrough-2026-07-01.md`
  - `history/artifacts/luc-6608-prod-ui-module-clickthrough-2026-07-01.json`
  - `history/tasks/luc-6608-authenticated-production-acceptance-performance-sweep-2026-07-01-task.md`
  - state/context ledgers updated.
- How tested: production read-only smoke/freshness/rollback/clickthrough/auth/timing commands above.
- What is incomplete: accepted authenticated browser proof and protected runtime proof cannot run until production Web and approved protected auth bindings recover.
- Next steps: Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), Security/Ops ensures approved protected runtime auth bindings, then QVE reruns LUC-6608.
- Decisions made: mark LUC-6608 blocked; do not create duplicate product-code or Backend/Auth repair.
- Paperclip result: comment id `17fb20c1-ba5a-4717-966e-3923b3cc1121` created; `PATCH` returned `identifier=LUC-6608`, `status=blocked`.
