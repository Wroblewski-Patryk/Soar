# Task

## Header
- ID: LUC-4959
- Title: [Soar] Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: LUC-4767, LUC-4806, LUC-4811 for full Coolify/VPS server-health bindings
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: not changed
- Quality Scenario Rows: production availability and operational readiness
- Risk Rows: production observability/readiness, deploy provenance
- Iteration: 2026-06-20 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-4959-PRODUCTION-PERFORMANCE-HEALTH-WATCH-2026-06-20
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through active project state excerpts already loaded for this heartbeat.
- [x] `.agents/core/mission-control.md` was reviewed through active mission state already loaded for this heartbeat.
- [x] Missing or template-like state tables were not introduced.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: refresh read-only production performance and server-health evidence for LUC-4959.
- Release objective advanced: production app health and protected auth/session evidence.
- Included slices: public smoke, public timing, build-info readback, protected auth/session proof, Coolify env-check contract.
- Explicit exclusions: deploy, push, restart, rollback, env edit, secret/account readback, raw logs, screenshots, database/Redis mutation, exchange/live-trading actions.
- Checkpoint cadence: one bounded DRE heartbeat.
- Stop conditions: public smoke failure, protected auth failure, missing approved bindings for server readback, or any mutation requirement.
- Handoff expectation: block full server-health readback to binding owner if approved inputs are absent.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active DRE chat | Wake payload, active mission, system health | Task/evidence/state updates | LUC-4959 packet | Final disposition | DONE |
| Ops/Release | DRE | release/deploy safety contract | Production public health checks | Public smoke and timing | `ops:deploy:smoke`, timing probe | DONE |
| Security/Ops | DRE using approved audit bindings | credential contract | Protected auth/session proof | Redacted proof artifact | `ops:prod-auth:proof` | DONE |
| Server Health | DRE + binding owner | Coolify stack env contract | Coolify/VPS/DB/worker readback | Blocker classification | env-check failed closed | BLOCKED |
| Documentation/Memory | DRE | source-of-truth state files | Evidence and state entries | Updated task/evidence/state | diff check | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed.
- [x] Responsibility lanes were limited to DRE-owned verification and evidence.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing ownership did not require responsibility-learning updates.
- [x] Process eval not required; this is a repeated bounded DRE checkpoint.

## Context
LUC-4959 is a critical DRE production health watch for Soar. Prior June 20
health checks showed app health green, Web build-info still `env-runtime`, and
full Coolify/VPS readback blocked by missing approved read-only bindings.

## Goal
Produce a fresh read-only production health checkpoint and leave a clear issue
disposition.

## Success Signal
- User or operator problem: know whether production remains publicly healthy and whether server-health proof is unblocked.
- Expected product or reliability outcome: public app health verified, protected auth/session proof verified, binding blocker classified.
- How success will be observed: evidence file, state updates, Paperclip issue comment/status.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verification evidence and state update for LUC-4959.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within verification unless explicit approval changes it

## Definition of Done
- [x] Public production smoke was run.
- [x] Public timing/build-info was captured.
- [x] Protected auth/session proof was run with approved audit bindings and redacted artifacts.
- [x] Coolify env-check blocker was confirmed without value disclosure.
- [x] Evidence and source-of-truth state were updated.
- [x] Final issue disposition names residual owner/action.

## Stage Exit Criteria
- [x] The output matches `verification`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`)
- Manual checks:
  - public timing probe across Web/API endpoints -> PASS, max `150 ms`
  - names-only env family scan -> no Coolify/VPS/DB/RC/Gate families present
- Screenshots/logs: none; screenshots and raw logs were intentionally not captured
- High-risk checks:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS
  - process-local audit credential mapping into `ops:prod-auth:proof` -> PASS, redacted
  - `pnpm run -s ops:coolify-stack:env-check` -> FAIL_CLOSED (`0/16` required present)
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-OPERATIONS-001
- Requirements matrix updated: not applicable
- Quality scenarios updated: not applicable
- Risk register updated: not applicable
- Reality status: partially verified

## Architecture Evidence
- Architecture source reviewed: active mission/system health plus deployment safety contract.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none; process-local env-name mapping only
- Health-check impact: public checks remain green
- Smoke steps updated: no
- Rollback note: no rollback path exercised; no mutation occurred
- Observability or alerting impact: server-health readback still blocked by missing approved bindings
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: prior app health green; server-health readback blocked; Web provenance still `env-runtime`.
- Gaps: no approved Coolify/VPS/DB/worker binding names in this runner.
- Inconsistencies: `ops:prod-auth:proof` expects `PROD_AUTH_*`; approved runner names are `PROD_UI_AUDIT_AUTH_*`.
- Architecture constraints: no deploy/push/restart/env mutation.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Sources scanned: wake payload, DRE role, deployment safety, evidence contract, active mission, system health, task board, package scripts, env names.
- Rows created or corrected: LUC-4959 state rows only.
- Assumptions recorded: process-local audit-name mapping is allowed because prior DRE/QVE lanes used the same approved audit credentials without printing values.
- Blocking unknowns: missing approved server-health binding names.
- Why it was safe to continue: all actions were read-only and used existing scripts.

### 2. Select One Priority Mission Objective
- Selected task: LUC-4959 production performance and server health watch.
- Priority rationale: assigned critical issue in wake payload.
- Why other candidates were deferred: issue-scoped heartbeat prohibits switching.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state markdown only.
- Logic: run public smoke/timing/auth/env-check and record exact results.
- Edge cases: auth proof variable-name mismatch; handled with process-local mapping without value disclosure.

### 4. Execute Implementation
- Implementation notes: no runtime implementation; verification-only heartbeat.

### 5. Verify and Test
- Validation performed: public smoke, timing probe, protected auth/session proof, env-check tests, env-check blocker confirmation, cleanup check.
- Result: app health verified; full server-health blocked.

### 6. Self-Review
- Simpler option considered: public-only smoke. Rejected because approved auth names were present and prior health-watch evidence included protected auth proof.
- Technical debt introduced: no
- Scalability assessment: existing scripts remain reusable.
- Refinements made: recorded script env-name expectation and process-local mapping.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence/state files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
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
- [x] Docs or context were updated.
- [x] Learning journal was not required.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran after lane integration.

## Notes
Full Coolify/VPS server-health remains blocked on [LUC-4811](/LUC/issues/LUC-4811).

## Production-Grade Required Contract

### Goal
Refresh read-only production health evidence for LUC-4959.

### Scope
Production public Web/API routes, Web build-info, protected auth/session proof,
and current-runner Coolify env-check readiness.

### Implementation Plan
1. Run public deploy smoke with workers skipped.
2. Collect three-sample public timing and build-info.
3. Run protected auth/session proof with approved audit bindings.
4. Run Coolify env-check test and current-runner env-check.
5. Record evidence, cleanup, and state.

### Acceptance Criteria
- Public Web/API smoke passes.
- Protected auth/session proof passes or fails with first-class blocker.
- Coolify/VPS binding readiness is classified without secret value disclosure.
- State/evidence files describe residual risk and next owner.

### Definition of Done
Satisfied for a partially verified blocked DRE checkpoint.

## Integration Evidence

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: current state reviewed through system health and DRE contract
- Critical user journey: production app availability and auth/session access
- SLI: Web/API public availability, auth/session proof, response timing
- SLO: not redefined in this task
- Error budget posture: healthy for public app checks; incomplete for server-health observability
- Health/readiness check: API `/health`, API `/ready`, Web `/`, Web `/api/build-info`
- Logs, dashboard, or alert route: blocked by missing bindings
- Smoke command or manual smoke: `ops:deploy:smoke --no-workers`
- Rollback or disable path: not exercised; no mutation occurred

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for code changes
- Real API/service path used: yes
- Endpoint and client contract match: yes for checked endpoints
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: auth fail-closed redirects verified by proof script
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused ops checks

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for code changes
- Data classification: production auth/session proof; secret values redacted
- Trust boundaries: production Web/API, auth cookie/session boundaries
- Permission or ownership checks: approved audit env names only
- Abuse cases: invalid-token and logout fail-closed behavior verified
- Secret handling: no values printed or stored; process-local mapping only
- Security tests or scans: protected auth/session proof
- Fail-closed behavior: invalid token and post-logout checks passed
- Residual risk: server-health bindings absent

## Result Report

- Task summary: Production public app health remains green and protected auth/session proof passed; full Coolify/VPS/DB/worker server-health readback remains blocked by absent approved binding families.
- Files changed:
  - `history/evidence/luc-4959-production-performance-health-watch-2026-06-20.md`
  - `history/evidence/luc-4959-prod-auth-session-browser-proof-2026-06-20.md`
  - `history/evidence/_artifacts-luc-4959-prod-auth-session-browser-proof-2026-06-20.json`
  - `history/tasks/luc-4959-production-performance-health-watch-2026-06-20-task.md`
  - state/context files listed in the final report
- How tested: public smoke, timing probe, protected auth proof, env-check tests, fail-closed env-check.
- What is incomplete: read-only Coolify/VPS/DB/worker health readback.
- Next steps: LUC-4811 owner must inject approved read-only bindings, then DRE can run full server-health proof.
- Decisions made: keep LUC-4959 blocked/partially verified rather than claiming full server health.
