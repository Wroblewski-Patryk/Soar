# Task

## Header
- ID: LUC-6904
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: Production runtime health / Web availability / worker readiness / Coolify resource health / rollback guard
- Requirement Rows: production deploy smoke; protected worker readiness; rollback guard; authenticated dashboard performance
- Quality Scenario Rows: reliability, performance, observability, deployment readiness
- Risk Rows: production unavailable; performance stall; stale source/build provenance; Coolify queued deployments
- Iteration: 2026-07-02 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6904-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-02
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the production-watch verification purpose.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the active Soar state contract.
- [x] `.agents/core/mission-control.md` was reviewed through active mission state.
- [x] Missing or template-like state tables were not relevant to this heartbeat.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: verify current Soar production health and performance without mutation.
- Release objective advanced: prove whether production is commercially usable or needs one narrow incident/repair lane.
- Included slices: public smoke, protected worker readiness, rollback guard, authenticated dashboard API timing, Coolify read-only projection, evidence and state updates.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, DB/Redis mutation, account mutation, exchange/payment mutation, live trading, secret value readback, raw log capture.
- Checkpoint cadence: one heartbeat evidence packet and Paperclip disposition.
- Stop conditions: smoke failure, rollback guard action required, authentication unavailable, Coolify API unavailable, or need for mutation.
- Handoff expectation: close as done if healthy; otherwise block or create one repair issue with named owner.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | DRE active chat | LUC-6904, active mission, system health | Integration, task closure, source-of-truth updates | Final production health disposition | Evidence packet and Paperclip update | COMPLETE |
| Ops/Runtime | DRE | post-deploy smoke, rollback playbook, SRE readiness | Public/protected endpoints, rollback guard, Coolify projection | Read-only health proof | Smoke, rollback guard, timing probes | COMPLETE |
| Documentation/Memory | DRE | task template, state ledgers | `history/evidence`, `history/tasks`, state files | Durable evidence | File updates | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed.
- [x] Responsibility stayed within DRE ownership.
- [x] No two write lanes owned the same file.
- [x] Each lane has expected output and validation/proof.
- [x] No missing ownership lesson was found.

## Context

[LUC-6904](/LUC/issues/LUC-6904) is the recurring production-performance and
server-health watch for Soar. Earlier 2026-07-02 DRE/COO checks saw production
recover from Web/workers `503` to public API/Web pass, but protected runtime and
Coolify watch items still required fresh proof.

## Goal

Run the smallest read-only production watch that proves whether Soar is up,
responsive, worker-ready, and free of rollback triggers.

## Success Signal
- User or operator problem: Soar may be technically up but commercially unusable due to slow dashboard or unhealthy runtime services.
- Expected product or reliability outcome: sampled public and authenticated production paths respond quickly and rollback guard stays green.
- How success will be observed: smoke passes, rollback guard returns `shouldRollback=false`, dashboard API samples avoid persistent human-visible stalls, and Coolify projection has no hard unhealthy resource signal.
- Post-launch learning needed: yes.

## Deliverable For This Stage

Read-only production health evidence plus Paperclip disposition.

## Constraints
- Use existing smoke, auth helper, rollback guard, and Coolify read-only mechanisms.
- Do not introduce new structures.
- Do not implement workarounds.
- Do not duplicate logic.
- Stay in verification stage.

## Definition of Done
- [x] Public API/Web smoke is recorded.
- [x] Protected worker readiness and rollback guard are recorded or blocked with exact reason.
- [x] Authenticated dashboard timing is sampled when safe credentials are present.
- [x] Coolify read-only projection is recorded without raw ids/secrets/logs.
- [x] Evidence and state files are updated.
- [x] Paperclip issue receives a final disposition.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: not applicable; read-only production watch.
- Manual checks: public smoke, protected smoke, rollback guard, timing probes, Coolify projection.
- Screenshots/logs: none; no raw log capture.
- High-risk checks: protected worker readiness and rollback guard used fresh-login auth without printing secrets.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: Production runtime health / Web availability / worker readiness / Coolify resource health / rollback guard.
- Requirements matrix updated: no; no requirement status changed globally.
- Requirement rows closed or changed: none.
- Quality scenarios updated: no.
- Quality scenario rows closed or changed: none.
- Risk register updated: no.
- Risk rows closed or changed: none.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: post-deploy smoke checklist, deployment rollback playbook, service reliability and observability.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: rollback guard returned `shouldRollback=false`; no rollback action was taken.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: prior public/worker outage had recently recovered; protected proof and Coolify watch still needed fresh evidence.
- Gaps: release-grade build provenance and host-level VPS/log proof remain separate gates.
- Inconsistencies: stale `SMOKE_AUTH_TOKEN` failed with `401`, while fresh-login approved auth passed.
- Architecture constraints: read-only only; no mutation without explicit approval.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Missing or template-like files: none.
- Sources scanned: active mission, next steps, task board, system health, post-deploy smoke checklist, rollback playbook.
- Rows created or corrected: LUC-6904 state rows appended.
- Assumptions recorded: fresh-login auth family is the valid protected proof path for this heartbeat.
- Blocking unknowns: none for this watch.
- Why it was safe to continue: all actions were read-only and used existing scripts/helpers.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6904](/LUC/issues/LUC-6904) production performance and health watch.
- Priority rationale: critical assigned heartbeat.
- Why other candidates were deferred: scoped wake contract forbids switching issues before handling this one.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state files only.
- Logic: run existing read-only proof commands and record outcome.
- Edge cases: stale token path, Coolify `running:unknown`, market-catalog cold sample.

### 4. Execute Implementation
- Implementation notes: no product code changed; evidence records current runtime health.

### 5. Verify and Test
- Validation performed: smoke, protected smoke, rollback guard, timing probes, Coolify projection.
- Result: production health verified for sampled window.

### 6. Self-Review
- Simpler option considered: public smoke only.
- Technical debt introduced: no.
- Scalability assessment: existing smoke and rollback guard remain adequate for recurring watch; Coolify queue still deserves watch.
- Refinements made: retried protected proof through fresh-login auth after stale token failed closed.

### 7. Update Documentation and Knowledge
- Docs updated: `history/evidence/luc-6904-production-performance-server-health-watch-2026-07-02.md`, this task packet, state files.
- Context updated: active mission, next steps, task board, system health, module confidence ledger.
- Learning journal updated: not applicable; stale token is an existing credential binding watch item, not a new recurring tooling pitfall confirmed here.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to task purpose.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal update was not applicable.
- [x] Required responsibility lanes were integrated.
- [x] Parent validation ran after lane integration.

## Notes

No duplicate incident/repair issue is warranted. Continue existing release/source
provenance, Coolify queue, and host-level proof gates separately.

## Production-Grade Required Contract

- Goal: verify production performance and server health.
- Scope: public/protected production endpoints, dashboard API timing, rollback guard, Coolify read-only projection, evidence/state files.
- Implementation Plan: run smoke, protected smoke, rollback guard, timing probes, Coolify projection, write evidence, update Paperclip.
- Acceptance Criteria: public/protected smoke pass; rollback guard pass; no persistent dashboard stall; no hard unhealthy Coolify signal; evidence recorded.
- Definition of Done: satisfied for read-only watch, with residual risks recorded.
- Result Report: below.

## Integration Evidence

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes.
- Critical user journey: production home/login, dashboard APIs, worker readiness.
- SLI: HTTP availability, response timing, worker readiness, runtime freshness, rollback guard.
- SLO: no persistent human-visible stall and no rollback-triggering worker/runtime failure in sampled window.
- Error budget posture: healthy with watch items.
- Health/readiness check: API `/health`, `/ready`, `/workers/ready`.
- Logs, dashboard, or alert route: rollback guard `/alerts` returned no alerts.
- Smoke command or manual smoke: `ops:deploy:smoke`, `ops:deploy:rollback-guard`, timing probes.
- Rollback or disable path: deployment rollback playbook; no rollback needed.

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable.
- Real API/service path used: yes.
- Endpoint and client contract match: yes.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: fail-closed stale token `401` observed.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: existing production smoke and rollback guard.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: production health metadata; no secret values or protected payloads persisted.
- Trust boundaries: public vs protected ops endpoints.
- Permission or ownership checks: protected checks used approved production audit auth family by name only.
- Abuse cases: stale token failed closed with `401`.
- Secret handling: no secret value readback, no token/cookie persistence, no raw protected payload capture.
- Security tests or scans: not applicable.
- Fail-closed behavior: stale token path returned `401`.
- Residual risk: stale token aliases should be rotated/rebound if token-only proof lanes still depend on them.

## Result Report

- Task summary: production public/protected smoke, rollback guard, dashboard API timing, and Coolify read-only projection passed for the sampled window.
- Files changed: this task file; `history/evidence/luc-6904-production-performance-server-health-watch-2026-07-02.md`; state ledger append entries.
- How tested: commands and timings recorded in evidence.
- What is incomplete: host-level VPS pressure/log proof and release-grade build provenance remain separate gates.
- Next steps: keep Coolify queued deployments, `running:unknown` app statuses, and market-catalog cold sample on watch; no new repair child from this heartbeat.
- Decisions made: close [LUC-6904](/LUC/issues/LUC-6904) as `done` for this recurring watch.

