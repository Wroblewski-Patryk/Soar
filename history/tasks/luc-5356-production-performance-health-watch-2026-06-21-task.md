# Task

## Header
- ID: LUC-5356
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none for public read-only watch
- Priority: P0
- Module Confidence Rows: operations / production runtime health
- Requirement Rows: production performance smoke and server-health watch
- Quality Scenario Rows: reliability, responsiveness, observability
- Risk Rows: production latency tails, incomplete server-health visibility
- Iteration: 2026-06-21 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-5356-PRODUCTION-PERFORMANCE-HEALTH-WATCH-2026-06-21
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the heartbeat role requirement.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was not fully reloaded because this was a scoped DRE routine heartbeat with direct issue context and established operations state.
- [x] `.agents/core/mission-control.md` was not fully reloaded because this was a bounded recurring watch, not a broad mission.
- [x] Missing or template-like state tables were not relevant to this checkpoint.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified at the operations-health level.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: run read-only Soar production performance and server-health watch.
- Release objective advanced: production availability and responsiveness confidence.
- Included slices: public smoke, public timing, build-info readback, Coolify read-only status projection, evidence routing.
- Explicit exclusions: deploy, push, restart, rollback, env edit, secret/account readback, DB/Redis mutation, raw logs, protected account mutation, exchange/payment/live-trading actions.
- Checkpoint cadence: one heartbeat.
- Stop conditions: public route failure, repeated low-second/tens-second latency tails, missing authorization, or mutation requirement.
- Handoff expectation: create exactly one narrow follow-up if regression or unknown bottleneck exists.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | DRE active chat | LUC-5356, operations docs | Issue disposition and evidence | Task packet and issue update | Paperclip issue update | DONE |
| Ops / Reliability | DRE | `docs/operations/service-topology.md` | Public production routes, Coolify read-only status | Health evidence | curl, deploy smoke, Coolify GETs | DONE |
| Documentation/Memory | DRE | `.agents/state/system-health.md`, `.codex/context/TASK_BOARD.md` | Evidence and state files | Updated state | Git diff review | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` update was not required for this bounded recurring routine.
- [x] `.agents/workflows/responsibility-lanes.md` was not fully reloaded; lane ownership is direct DRE/Ops.
- [x] Every important responsibility has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not found.
- [x] Process eval is not required for this bounded single-role routine.

## Context
LUC-5356 is the recurring Soar production performance and server-health watch. Previous DRE checks had found public app health generally reachable, intermittent low-second public latency, and limited Coolify application status fidelity.

## Goal
Produce a read-only production health checkpoint and route any active performance regression or unknown bottleneck to exactly one narrow follow-up issue.

## Success Signal
- User or operator problem: Soar must not be technically up but commercially slow.
- Expected product or reliability outcome: public route health and current latency posture are evidence-backed.
- How success will be observed: public smoke/timing and Coolify read-only projection are recorded.
- Post-launch learning needed: yes.

## Deliverable For This Stage
Evidence packet, task packet, state updates, Paperclip child incident if required, and final issue disposition.

## Constraints
- use existing production smoke and Coolify read-only status mechanisms
- do not introduce new runtime systems
- do not deploy, restart, rollback, mutate env, read back secrets, mutate DB/Redis, or mutate external accounts
- create one narrow follow-up if the watch finds an active unresolved bottleneck

## Definition of Done
- [x] Public production smoke result recorded.
- [x] Route timing and build-info evidence recorded.
- [x] Coolify read-only projection attempted and recorded without secret disclosure.
- [x] Follow-up routed if active regression exists.
- [x] Paperclip issue receives final disposition.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: `pnpm run -s ops:coolify-stack:env-check:test` PASS (`11/11`).
- Manual checks: public smoke PASS; curl timing recorded; Coolify GET projection PASS.
- Screenshots/logs: no screenshots or raw logs captured.
- High-risk checks: production mutation avoided; secret values not printed or stored.
- Module confidence ledger updated: not applicable for this evidence-only DRE watch.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable; operational health state updated instead.
- Reality status: partially verified.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/service-topology.md` indirectly through prior state and current command selection.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: public `/health` latency tails reproduced.
- Smoke steps updated: no.
- Rollback note: rollback not applicable; no deployment mutation occurred.
- Observability or alerting impact: [LUC-5360](/LUC/issues/LUC-5360) created for DRE/Ops correlation.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: recurring production latency-tail watch.
- Gaps: Coolify application status remains `running:unknown`; stack env preflight remains fail-closed for service env family.
- Inconsistencies: public smoke green while timing shows API `/health` tails.
- Architecture constraints: read-only operations only.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: Paperclip heartbeat context, prior evidence, operations scripts, system health.
- Rows created or corrected: none.
- Assumptions recorded: dependency-light `/health` tails require DRE/Ops correlation before backend handoff.
- Blocking unknowns: exact edge/proxy/container pressure source.
- Why it was safe to continue: all checks were read-only public or authenticated Coolify GETs.

### 2. Select One Priority Mission Objective
- Selected task: LUC-5356 production performance and server-health watch.
- Priority rationale: critical recurring production reliability gate.
- Why other candidates were deferred: scoped Paperclip wake requires this issue.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state files only.
- Logic: run public smoke, timing, Coolify projection; route one follow-up if needed.
- Edge cases: do not expose secrets or raw Coolify objects.

### 4. Execute Implementation
- Implementation notes: no runtime code was changed.

### 5. Verify and Test
- Validation performed: public smoke, route timings, build-info readback, Coolify GET projection, env-check tests.
- Result: public routes reachable; API `/health` latency tails reproduced.

### 6. Self-Review
- Simpler option considered: close as healthy from smoke only.
- Technical debt introduced: no.
- Scalability assessment: follow-up isolates correlation to one bounded incident.
- Refinements made: created [LUC-5360](/LUC/issues/LUC-5360) instead of a duplicate broad server-health issue.

### 7. Update Documentation and Knowledge
- Docs updated: `history/evidence`, `history/tasks`, `.agents/state/system-health.md`, `.codex/context/TASK_BOARD.md`.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to heartbeat role.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was not required.
- [x] Required responsibility lanes were integrated or tracked as follow-up.
- [x] Parent validation ran after accepted lane integration.

## Notes
The existing dirty worktree contains unrelated active Soar changes. This heartbeat did not modify product/runtime code and did not commit or push.

## Production-Grade Required Contract

- Goal: read-only production health watch.
- Scope: production public routes, Web build-info, Coolify read-only status, local evidence/state.
- Implementation Plan: run public smoke, timing, build-info readback, Coolify GET projection, create one follow-up if active signal exists, update evidence/state, close issue.
- Acceptance Criteria: evidence recorded, no production mutation, one child incident routed for active unresolved signal.
- Definition of Done: `DEFINITION_OF_DONE.md` release-safety principles respected; no runtime mutation performed.
- Result Report: see below.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: Soar operators and users.
- Existing workaround or pain: intermittent latency can make an up service feel commercially unusable.
- Smallest useful slice: DRE/Ops correlation for API `/health` tails.
- Success metric or signal: bounded recheck classifies root cause owner.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: yes.

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: not applicable.
- Feedback item IDs: none.
- Feedback accepted: none.
- Feedback needs clarification: none.
- Feedback conflicts: none.
- Feedback deferred or rejected: none.
- Active task changed by feedback: no.
- New task created from feedback: not applicable.
- Design memory updated: not applicable.
- Learning journal updated: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not fully reloaded; existing operations watch contract applied.
- Critical user journey: public Web/API reachability and production responsiveness.
- SLI: route availability and latency tail samples.
- SLO: public pages and health routes should stay responsive and below human-visible stall territory.
- Error budget posture: burning for API `/health` latency tail watch.
- Health/readiness check: API `/health`, API `/ready`, Web `/`, Web `/api/build-info`.
- Logs, dashboard, or alert route: Coolify read-only status projection only; no raw logs captured.
- Smoke command or manual smoke: `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`.
- Rollback or disable path: not applicable; no deploy.

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable.
- Real API/service path used: yes.
- Endpoint and client contract match: yes for public smoke.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: public smoke and timing.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: public route timing and redacted infrastructure metadata.
- Trust boundaries: production public endpoints and Coolify read-only API.
- Permission or ownership checks: DRE role owns read-only runtime health proof.
- Abuse cases: secret/log leakage avoided.
- Secret handling: only variable presence and redacted projections recorded.
- Security tests or scans: not applicable.
- Fail-closed behavior: stack env preflight failed closed without values.
- Residual risk: raw host/proxy/container metrics not captured in this heartbeat.

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable.
- Memory consistency scenarios: not applicable.
- Multi-step context scenarios: not applicable.
- Adversarial or role-break scenarios: not applicable.
- Prompt injection checks: not applicable.
- Data leakage and unauthorized access checks: secret redaction observed.
- Result: no sensitive values stored.

## Result Report

- Task summary: Read-only production watch passed public availability smoke but reproduced API `/health` low-second latency tails; created [LUC-5360](/LUC/issues/LUC-5360) for DRE/Ops correlation.
- Files changed: this task packet, evidence packet, `.agents/state/system-health.md`, `.codex/context/TASK_BOARD.md`.
- How tested: public smoke, curl timing, Web build-info readback, Coolify GET projection, Coolify stack env-check tests.
- What is incomplete: exact root cause of API `/health` latency tails.
- Next steps: [LUC-5360](/LUC/issues/LUC-5360) runs bounded DRE/Ops correlation.
- Decisions made: do not create duplicate broad server-health work; route one narrow latency-tail incident.
