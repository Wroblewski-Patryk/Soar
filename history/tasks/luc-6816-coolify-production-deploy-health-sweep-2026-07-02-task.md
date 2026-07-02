# Task

## Header
- ID: LUC-6816
- Title: Coolify Production Deploy Health Sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production web, API health, protected worker readiness, runtime freshness
- Requirement Rows: release smoke, production readiness, rollback guard
- Quality Scenario Rows: reliability, availability, performance
- Risk Rows: production Web unavailable, worker readiness unavailable, rollback action required
- Iteration: 2026-07-02 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6816-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-07-02
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the scoped routine heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Missing or template-like state tables were not encountered for this narrow verification.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence with fresh production evidence.

## Mission Block
- Mission objective: rerun read-only Soar Coolify production deploy health sweep for [LUC-6816](/LUC/issues/LUC-6816).
- Release objective advanced: preserve current production readiness truth and route the active blocker to the correct Ops mutation owner.
- Included slices: deploy smoke, protected worker readiness, runtime freshness, rollback guard, representative timing, sanitized Coolify projection.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, DB/Redis mutation, secret value readback, account mutation, exchange/payment action, order, position, subscription mutation, live-trading action.
- Checkpoint cadence: single heartbeat packet.
- Stop conditions: healthy watch completed or production regression/blocker confirmed.
- Handoff expectation: if blocked, update [LUC-6816](/LUC/issues/LUC-6816) with [LUC-6331](/LUC/issues/LUC-6331) as unblock path.

## Context
This is a recurring Soar production deploy health sweep. Earlier July 2 DRE
watches found API and runtime freshness healthy while Web and protected worker
readiness failed with `503`.

## Goal
Collect fresh read-only production evidence for [LUC-6816](/LUC/issues/LUC-6816)
and route the issue to a clear Paperclip disposition.

## Scope
- Public production API/Web smoke:
  `https://api.soar.luckysparrow.ch`, `https://soar.luckysparrow.ch`
- Protected worker readiness through existing smoke auth bindings.
- Runtime freshness and rollback guard through env-only auth binding mapping.
- Sanitized Coolify production projection through read-only API.
- Source-of-truth updates in history and state files.

## Implementation Plan
1. Read scoped wake payload and deployment safety contracts.
2. Run production deploy smoke.
3. Run runtime freshness.
4. Run rollback guard.
5. Capture representative HTTP timings.
6. Capture sanitized Coolify production projection.
7. Write evidence and state updates.
8. Patch [LUC-6816](/LUC/issues/LUC-6816) to blocked with [LUC-6331](/LUC/issues/LUC-6331) as unblock path.

## Acceptance Criteria
- API `/health` and `/ready` status recorded.
- Web `/`, `/auth/login`, and `/api/build-info` status recorded.
- Protected `/workers/ready` status recorded.
- Runtime freshness result recorded.
- Rollback guard decision recorded.
- Coolify application projection recorded without secret values.
- Source control and deployment impact recorded.
- Paperclip issue disposition updated.

## Definition of Done
- [x] Fresh production deploy health evidence captured.
- [x] No prohibited production mutation occurred.
- [x] Existing blocker owner/action named.
- [x] Relevant source-of-truth files updated.
- [x] Issue receives clear final disposition.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Deploy, restart, rollback, env edit, DB/Redis mutation, account mutation,
  exchange/payment action, order, position, subscription mutation, or
  live-trading action.

## Validation Evidence
- Tests:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> FAIL on Web `503` and workers `503`.
  - `pnpm run -s ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` -> PASS.
  - `pnpm run -s ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` -> FAIL with `shouldRollback=true`.
- Manual checks:
  - representative `curl.exe` timing sample.
  - sanitized Coolify read-only projection.
- Screenshots/logs: not applicable; raw logs intentionally not captured.
- High-risk checks: secret values not printed; no deploy/restart/rollback/env/DB mutation.
- Module confidence ledger updated: no, watch-only evidence did not change module classification beyond existing blocker.
- Requirements matrix updated: no, existing release blocker remains.
- Quality scenarios updated: no, system-health state updated instead.
- Risk register updated: no, existing release risk remains routed through [LUC-6331](/LUC/issues/LUC-6331).
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: Soar deploy/runtime architecture and current state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: production API healthy; Web and worker readiness unavailable.
- Smoke steps updated: no.
- Rollback note: rollback guard recommends action but no rollback was executed.
- Observability or alerting impact: alerts endpoint returned no critical alerts inside rollback guard.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: [LUC-6816](/LUC/issues/LUC-6816) critical DRE deploy health sweep.
- Gaps: Web and protected worker readiness still unavailable.
- Inconsistencies: none; Coolify projection aligns with smoke failure.
- Architecture constraints: read-only watch; mutation belongs to Ops Release Lead.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: DRE role, Paperclip wake payload, local active mission/task board/system health.
- Rows created or corrected: none.
- Assumptions recorded: existing [LUC-6331](/LUC/issues/LUC-6331) remains the unblock path.
- Blocking unknowns: exact Coolify runtime cause requires approved mutation/log owner.
- Why it was safe to continue: read-only checks only.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6816](/LUC/issues/LUC-6816).
- Priority rationale: scoped wake payload and critical production health routine.
- Why other candidates were deferred: wake contract forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state docs only.
- Logic: run existing production health scripts and record results.
- Edge cases: prevent secret output and avoid production mutation.

### 4. Execute Implementation
- Implementation notes: no app code changed; reused existing ops scripts.

### 5. Verify and Test
- Validation performed: smoke, freshness, rollback guard, timing, Coolify projection.
- Result: blocked by Web/worker `503`; runtime freshness passes.

### 6. Self-Review
- Simpler option considered: reusing prior [LUC-6799](/LUC/issues/LUC-6799) evidence only.
- Technical debt introduced: no.
- Scalability assessment: routine remains repeatable through existing scripts.
- Refinements made: captured fresh timing and Coolify projection.

### 7. Update Documentation and Knowledge
- Docs updated: evidence/task/state notes.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to scoped routine heartbeat.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal update not required.
- [x] Required responsibility lanes were integrated or tracked as follow-up.
- [x] Parent validation ran after evidence integration.

## Reliability / Observability Evidence
- Critical user journey: public Web and authenticated dashboard entry.
- SLI: HTTP availability/readiness.
- SLO: public Web/API responsive and worker readiness healthy.
- Error budget posture: exhausted for Web availability.
- Health/readiness check: API pass, Web fail, worker readiness fail.
- Logs, dashboard, or alert route: Coolify read-only projection and rollback guard alerts.
- Smoke command or manual smoke: existing ops smoke scripts and `curl.exe`.
- Rollback or disable path: Ops Release Lead through [LUC-6331](/LUC/issues/LUC-6331).

## Security / Privacy Evidence
- Data classification: operational health metadata.
- Trust boundaries: production API/Web, Coolify read-only API, Paperclip.
- Permission or ownership checks: DRE read-only scope; mutation remains Ops owner.
- Abuse cases: secret leakage prevented by env-only credential use and sanitized evidence.
- Secret handling: values not printed or stored.
- Security tests or scans: not applicable.
- Fail-closed behavior: worker readiness and rollback guard fail closed.
- Residual risk: production Web remains unavailable.

## Result Report

- Task summary: production remains blocked; API health/ready and runtime freshness pass, Web and protected workers fail with `503`, Coolify shows `soar-web` and `workers-backtest` unhealthy.
- Files changed:
  - `history/evidence/luc-6816-coolify-production-deploy-health-sweep-2026-07-02.md`
  - `history/tasks/luc-6816-coolify-production-deploy-health-sweep-2026-07-02-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: existing ops smoke/freshness/rollback scripts, timing sample, Coolify read-only projection.
- What is incomplete: production restoration.
- Next steps: [LUC-6331](/LUC/issues/LUC-6331) Ops mutation owner restores or rolls back; DRE/QVE rerun production acceptance.
- Decisions made: no new duplicate repair issue; existing [LUC-6331](/LUC/issues/LUC-6331) remains authoritative.
