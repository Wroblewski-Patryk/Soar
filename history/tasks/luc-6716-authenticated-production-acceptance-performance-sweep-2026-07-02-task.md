# Task

## Header
- ID: LUC-6716
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
- Risk Rows: production Web unavailable, workers readiness unavailable
- Iteration: 2026-07-02 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6716-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-07-02
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches QVE verification ownership.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the loaded project startup contract and current state ledgers.
- [x] `.agents/core/mission-control.md` was reviewed through the loaded active mission/current state.
- [x] Missing or template-like state tables were not bootstrapped because this is a narrow QVE proof lane.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by proving the current production acceptance blocker.

## Mission Block
- Mission objective: prove whether Soar production can pass authenticated acceptance and performance gates now.
- Release objective advanced: V1 production acceptance evidence.
- Included slices: deploy smoke, runtime freshness, rollback guard, UI route clickthrough, auth-session proof attempt, representative public timing.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment mutation, order, position, subscription mutation, live-trading action.
- Checkpoint cadence: one heartbeat evidence packet.
- Stop conditions: Web `503`, worker readiness `503`, or any mutation requirement.
- Handoff expectation: blocked disposition with named unblock owner/action.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| QA/Test | 09 QVE | `docs/operations/post-deploy-smoke-checklist.md`; current production evidence | Read-only production proof artifacts | Acceptance blocker packet | Smoke/freshness/rollback/clickthrough/auth/timing | BLOCKED |
| Ops/Release | Ops Release Lead / board-approved Coolify mutation owner | [LUC-6331](/LUC/issues/LUC-6331) | Production Web/backtest-worker restoration | Restore or rollback `soar-web` and `workers-backtest` | Rerun DRE/QVE smoke after restoration | PENDING_OWNER |

## Context
Recurring QVE production acceptance must verify Soar as a production product:
public Web, authenticated routes, protected worker/runtime readiness, rollback
posture, and performance timing. Same-day state already showed Web `503` and
`soar-web` / `workers-backtest` restoration under [LUC-6331](/LUC/issues/LUC-6331).

## Goal
Run the smallest read-only production acceptance sweep that proves whether
authenticated acceptance can be accepted now.

## Success Signal
- User or operator problem: Soar V1 cannot be called production-accepted without fresh authenticated production proof.
- Expected product or reliability outcome: either verified production acceptance or first-class blocked state with owner/action.
- How success will be observed: acceptance commands pass, or blocker evidence names the exact failed gate.
- Post-launch learning needed: no.

## Deliverable For This Stage
Read-only verification packet and Paperclip blocked disposition.

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
- [x] The output matches the declared `verification` stage.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment mutation, order, position, subscription mutation, or live-trading action
- accepting Web `503` as production-ready

## Validation Evidence
- Tests:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` with audit auth mapped -> FAIL; API health/ready PASS; Web `/` and build-info `503`; `/workers/ready` `503`.
  - `pnpm run -s ops:deploy:runtime-freshness` with audit auth mapped -> PASS; worker/market heartbeat age `3586 ms`, runtime signal lag `0 ms`, `5` running sessions.
  - `pnpm run -s ops:deploy:rollback-guard` with audit auth mapped -> FAIL; `shouldRollback=true` with `workers_ready_endpoint_http_503`.
  - `pnpm run -s ops:ui:prod-clickthrough -- ...luc-6716...` -> FAIL and wrote artifact.
  - `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof ...luc-6716...` -> FAIL before artifact write; `build-info does not match expected SHA`.
- Manual checks:
  - `curl.exe` timing sample: API health/ready `200`; Web root/build-info `503`.
- Screenshots/logs:
  - no screenshots captured; clickthrough generated redacted markdown/JSON only.
- High-risk checks:
  - no secret values printed; no mutation commands executed; no rollback executed.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: production auth/session, dashboard/admin shell, Web build metadata, worker readiness, production timing.
- Requirements matrix updated: no, existing blocked requirement state unchanged.
- Requirement rows closed or changed: production authenticated acceptance remains blocked.
- Quality scenarios updated: no, existing production availability block unchanged.
- Risk register updated: no, existing production Web/worker readiness risk unchanged.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/post-deploy-smoke-checklist.md`; current state ledgers.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: API health/ready pass; Web root/build-info and `/workers/ready` fail `503`.
- Smoke steps updated: no.
- Rollback note: rollback guard requests action, but QVE did not execute rollback.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: active production acceptance issue LUC-6716; prior same-class evidence blocked by Web/worker `503`.
- Gaps: accepted auth browser proof cannot run while Web build-info is unavailable.
- Inconsistencies: none newly discovered.
- Architecture constraints: acceptance requires public Web, protected worker readiness, runtime freshness, rollback guard, and auth/session proof.

### 2. Select One Priority Mission Objective
- Selected task: LUC-6716 authenticated production acceptance sweep.
- Priority rationale: critical release gate and assigned QVE issue.
- Why other candidates were deferred: QVE WIP is one active issue; unrelated blocked lanes already have owners.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state files only.
- Logic: run existing read-only ops proof scripts and record result.
- Edge cases: fail closed on build-info mismatch/unavailable; do not expose secrets.

### 4. Execute Implementation
- Implementation notes: no product code implementation; generated UI clickthrough artifact and wrote evidence packet.

### 5. Verify and Test
- Validation performed: deploy smoke, runtime freshness, rollback guard, UI clickthrough, auth proof attempt, HTTP timing sample, browser-process cleanup check.
- Result: blocked by production Web `503` and worker readiness `503`.

### 6. Self-Review
- Simpler option considered: stop after deploy smoke failure. Rejected because the issue specifically asks for authenticated acceptance/performance sweep; route clickthrough and auth fail-closed proof add useful release evidence.
- Technical debt introduced: no.
- Scalability assessment: uses existing scripts and evidence shape.
- Refinements made: generated July 2 clickthrough artifact to match heartbeat date.

### 7. Update Documentation and Knowledge
- Docs updated: LUC-6716 task/evidence and minimal source-of-truth state entries.
- Context updated: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`, `.agents/state/active-mission.md`, `.agents/state/next-steps.md`, `.agents/state/system-health.md`, `.agents/state/module-confidence-ledger.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to QVE verification ownership.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was not needed.
- [x] Required responsibility lanes were integrated or tracked as follow-up.
- [x] Parent validation ran through production read-only proof scripts.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable to code changes; credential boundary from project/Paperclip contracts applied.
- Data classification: production availability and route status only; no private account data recorded.
- Trust boundaries: production Web/API, protected worker readiness, audit-login secret binding.
- Permission or ownership checks: QVE stayed read-only; Ops owns restoration.
- Abuse cases: secret exposure avoided; protected proof failed closed on unavailable build-info.
- Secret handling: values never printed or stored.
- Security tests or scans: not applicable.
- Fail-closed behavior: auth proof failed closed before artifact write.
- Residual risk: production Web and workers readiness unavailable until Ops restoration.

## Result Report

- Task summary: production acceptance is blocked; API health/ready passes and runtime freshness passes through approved audit-login mapping, but Web frontend returns `503`, workers readiness returns `503`, rollback guard requests action, and auth proof fails closed before browser session evidence.
- Files changed:
  - `history/evidence/luc-6716-authenticated-production-acceptance-performance-sweep-2026-07-02.md`
  - `history/evidence/luc-6716-prod-ui-module-clickthrough-2026-07-02.md`
  - `history/artifacts/luc-6716-prod-ui-module-clickthrough-2026-07-02.json`
  - `history/tasks/luc-6716-authenticated-production-acceptance-performance-sweep-2026-07-02-task.md`
  - state/context ledgers updated.
- How tested: production read-only smoke/freshness/rollback/clickthrough/auth/timing commands above.
- What is incomplete: accepted authenticated browser proof and production Web performance cannot run until production Web and worker readiness recover.
- Next steps: Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then QVE reruns LUC-6716 or its successor acceptance issue.
- Decisions made: mark LUC-6716 blocked; do not create duplicate product-code or Backend/Auth repair.
- Paperclip result: `PATCH` returned `identifier=LUC-6716`,
  `status=blocked`, `blockedBy=[LUC-6331]`, `updatedAt=2026-07-01T22:42:07.091Z`.
