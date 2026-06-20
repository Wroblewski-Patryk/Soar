# Task

## Header
- ID: `LUC-5143`
- Title: `[Soar] Production performance and server health watch`
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: production runtime health, protected auth/session smoke
- Requirement Rows: production health/readiness, protected route fail-closed behavior
- Quality Scenario Rows: reliability, performance, security
- Risk Rows: production latency, auth/session redirect contract, observability
- Iteration: 2026-06-20 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: `LUC-5143-PRODUCTION-PERFORMANCE-HEALTH-WATCH-2026-06-20`
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented by the loaded repo instructions and health state.
- [x] `.agents/core/mission-control.md` was represented by the active mission state.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence.

## Context

[LUC-5143](/LUC/issues/LUC-5143) is the recurring DRE production performance
and server-health watch. It runs read-only public smoke, protected auth proof
when approved credentials are available, and Coolify/VPS readback when safe
bindings exist.

## Goal

Produce a current production health signal and create exactly one narrow
repair issue if a regression is found.

## Success Signal
- User or operator problem: production must not be technically up but commercially unusable.
- Expected product or reliability outcome: current public health, timing, auth, and Coolify status are known.
- How success will be observed: evidence file, task packet, source-of-truth health update, and Paperclip disposition.
- Post-launch learning needed: yes.

## Deliverable For This Stage

Verification evidence and delegated repair for the protected auth proof failure.

## Constraints
- Read-only by default.
- No deploy, restart, env edit, database mutation, production account mutation, trading action, or secret readback.
- Use existing smoke/proof scripts and Coolify read-only API only.
- Do not implement frontend/security repairs in the DRE lane.

## Definition of Done
- [x] Public production smoke run.
- [x] Public timing samples captured.
- [x] Protected auth proof attempted with safe credential bindings.
- [x] Coolify read-only projection captured without secret exposure.
- [x] Regression routed to exactly one repair issue.
- [x] Cleanup verified for validation-created browser processes.
- [x] Soar source-of-truth health state updated.

## Forbidden
- Production mutation.
- Secret value disclosure.
- Raw log capture with possible secrets.
- Opportunistic frontend/security fixes outside DRE ownership.

## Validation Evidence
- Tests:
  - `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`).
- Manual checks:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS.
  - Five-sample public timing recheck -> PASS; no current public latency spike.
  - Coolify read-only projection -> PASS.
- High-risk checks:
  - `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20` -> FAIL without `PROD_AUTH_*` token inputs.
  - Same proof with process-local `PROD_UI_AUDIT_*` to `PROD_AUTH_*` mapping -> FAIL/TIMEOUT after artifact generation; invalid-token expired-session redirect failed.
- Module confidence ledger updated: no, existing health ledgers were updated through active mission/system health.
- Requirements matrix updated: no.
- Quality scenarios updated: no.
- Risk register updated: no.
- Reality status: partially verified.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/post-deploy-smoke-checklist.md`, `DEPLOYMENT_GATE.md`, `.agents/state/system-health.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no DRE-owned architecture mismatch.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: public API/Web checks healthy; protected auth query-contract failed.
- Smoke steps updated: no.
- Rollback note: not applicable; no production mutation occurred.
- Observability or alerting impact: [LUC-5146](/LUC/issues/LUC-5146) created for the auth proof regression.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production public app healthy; protected auth proof invalid-token query contract failed.
- Gaps: app rows in Coolify remain `running:unknown`; release-grade build provenance remains `env-runtime`.
- Inconsistencies: protected route fails closed but does not include expected `session=expired` query.
- Architecture constraints: DRE can verify and route; Frontend/Security own behavior changes.

### 2. Select One Priority Mission Objective
- Selected task: current production performance and server-health watch.
- Priority rationale: critical routine execution and sellability gate.
- Why other candidates were deferred: repair belongs to [LUC-5146](/LUC/issues/LUC-5146).

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task docs and health state only.
- Logic: run read-only smoke/probes; delegate any regression.
- Edge cases: timeout cleanup and secret redaction.

### 4. Execute Implementation
- Implementation notes: no code changes; created one child repair issue.

### 5. Verify and Test
- Validation performed: public smoke, timing, protected auth proof attempt, Coolify projection, env checker test.
- Result: partially verified with delegated protected-auth repair.

### 6. Self-Review
- Simpler option considered: mark the watch blocked on auth proof timeout.
- Technical debt introduced: no.
- Scalability assessment: recurring watch remains script-backed.
- Refinements made: child issue created instead of mixing DRE with frontend/security work.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `history/evidence/luc-5143-production-performance-health-watch-2026-06-20.md`
  - `history/tasks/luc-5143-production-performance-health-watch-2026-06-20-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
  - `.codex/context/LEARNING_JOURNAL.md`
- Context updated: yes.
- Learning journal updated: yes.

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
- [x] Required responsibility lanes were tracked as follow-up.

## Security / Privacy Evidence
- Data classification: production auth proof metadata, no secret values.
- Trust boundaries: public Web/API, authenticated dashboard route, invalid token cookie, Coolify read-only API.
- Permission or ownership checks: protected route still redirects to login.
- Abuse cases: invalid token cookie expected to mark expired session.
- Secret handling: credentials mapped process-locally only; values not printed or written.
- Security tests or scans: protected auth proof generated redacted fail artifact.
- Fail-closed behavior: yes, redirect to `/auth/login`; missing `session=expired` query.
- Residual risk: [LUC-5146](/LUC/issues/LUC-5146) must determine whether proof expectation or Web behavior needs repair.

## Result Report

- Task summary: production public health is currently healthy; protected auth proof found an invalid-token expired-session redirect failure; Coolify read-only status is available and shows expected resources with DB/Redis healthy.
- Files changed: evidence/task/health/learning docs only.
- How tested: public smoke, timing samples, protected auth proof attempt, Coolify projection, env checker tests, cleanup check.
- What is incomplete: protected auth proof is not green; app rows remain `running:unknown`; release-grade build provenance remains diagnostic-only `env-runtime`.
- Next steps: [LUC-5146](/LUC/issues/LUC-5146) owns Web/Security repair or expectation reconciliation.
- Decisions made: no production mutation; no duplicate repair issue; exactly one child issue created.
