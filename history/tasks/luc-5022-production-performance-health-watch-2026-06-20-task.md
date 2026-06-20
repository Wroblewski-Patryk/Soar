# Task

## Header
- ID: LUC-5022
- Title: [Soar] Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-4811](/LUC/issues/LUC-4811)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production performance and server-health readiness
- Requirement Rows: release health/readiness evidence
- Quality Scenario Rows: production availability, latency, protected auth/session, operational observability
- Risk Rows: Coolify/VPS binding availability; release provenance
- Iteration: 2026-06-20 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5022-PRODUCTION-PERFORMANCE-HEALTH-WATCH-2026-06-20
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the verification-heavy heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for mission closure.
- [x] Missing or template-like state tables were not relevant to this narrow DRE heartbeat.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence through production health evidence.

## Mission Block
- Mission objective: refresh read-only production performance and server-health posture for [LUC-5022](/LUC/issues/LUC-5022).
- Release objective advanced: Soar V1 production health evidence.
- Included slices: public smoke, build-info readback, public timing, protected auth/session proof, Coolify binding preflight, cleanup verification, state/evidence updates.
- Explicit exclusions: deploy, push, restart, rollback, env edits, secret/account readback, database/Redis mutation, raw logs, screenshots, exchange/live trading actions.
- Checkpoint cadence: one heartbeat.
- Stop conditions: public smoke failure, protected proof failure, leaked validation process, or missing read-only server-health bindings.
- Handoff expectation: blocked disposition naming the binding owner/action if server-health readback cannot run.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md; Paperclip wake payload | Integration and issue closure | Task/evidence packet | Final disposition | DONE |
| Ops/DRE | Active chat | docs/operations/service-reliability-and-observability.md | Production smoke, timing, build-info, env-check | Health checkpoint | Smoke/timing/env checks | BLOCKED |
| Security/Auth | Active chat within approved audit env names | shared/30-credentials-and-accounts.md | Protected auth/session proof | Redacted auth proof | `ops:prod-auth:proof` | DONE |
| Documentation/Memory | Active chat | project state files | State and evidence rows | Durable task/evidence updates | `git diff --check` scoped | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed by adding the LUC-5022 heartbeat.
- [x] Responsibility lanes were selected from the DRE role and Soar coordinator contract.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing ownership remains the existing [LUC-4811](/LUC/issues/LUC-4811) blocker chain, not a new lane.

## Context

[LUC-5022](/LUC/issues/LUC-5022) is a recurring DRE production health watch.
Prior related watches on 2026-06-20 verified app-level production health but
left full Coolify/VPS/DB/worker server-health readback blocked because approved
read-only bindings were absent from the DRE runner.

## Goal

Produce current read-only production health evidence and close the heartbeat
with a clear disposition.

## Scope

- Public production API/Web smoke:
  `https://api.soar.luckysparrow.ch`, `https://soar.luckysparrow.ch`
- Web build-info:
  `https://soar.luckysparrow.ch/api/build-info`
- Protected auth/session browser proof through existing redacted runner
- Coolify stack env checker and checker tests
- Evidence/state files:
  - `history/evidence/luc-5022-production-performance-health-watch-2026-06-20.md`
  - `history/evidence/luc-5022-prod-auth-session-browser-proof-2026-06-20.md`
  - `history/evidence/_artifacts-luc-5022-prod-auth-session-browser-proof-2026-06-20.json`
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`

## Implementation Plan

1. Read active DRE/Paperclip/Soar state and identify whether this is single-lane or multi-lane work.
2. Run public production smoke with workers skipped.
3. Read public build-info and collect three timing samples per public target.
4. Run protected auth/session proof using approved audit env names and redacted artifacts.
5. Run Coolify env checker tests and current-runner binding preflight.
6. Verify cleanup for browser/process artifacts and remove only the task-created profile directory.
7. Update evidence and source-of-truth state files.
8. Update Paperclip issue to a final blocked disposition with first-class blocker owner/action.

## Acceptance Criteria

- Public API/Web smoke result is recorded.
- Build-info SHA, ref, build id, and metadata source are recorded.
- Public timing maxes are recorded.
- Protected auth/session proof result is recorded or explicitly blocked.
- Coolify/VPS readback status is recorded without secret values.
- Cleanup status is recorded.
- Issue disposition is not left as idle `in_progress`.

## Definition of Done

- [x] Production public smoke evidence recorded.
- [x] Production build-info and timing evidence recorded.
- [x] Protected auth/session proof passed with redacted artifacts.
- [x] Coolify checker tests passed and current-runner binding check failed closed.
- [x] Server-health blocker owner/action named.
- [x] State files updated with LUC-5022 status.
- [x] Paperclip issue status updated to `blocked`.

## Validation Evidence

- Tests:
  - `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`)
- Manual checks:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS
  - `pnpm run -s ops:coolify-stack:env-check` -> FAIL closed with required present `0/16`
  - `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-5022-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-5022-prod-auth-session-browser-proof-2026-06-20.md` -> PASS
- Screenshots/logs: no screenshots; redacted Markdown/JSON proof only.
- High-risk checks: no mutation; no secret/cookie/token/body artifacts.
- Module confidence ledger updated: yes
- Requirements matrix updated: not applicable for this narrow evidence heartbeat
- Quality scenarios updated: not applicable
- Risk register updated: not applicable; existing blocker chain remains authoritative
- Reality status: partially verified / blocked

## Architecture Evidence

- Architecture source reviewed: `.agents/core/project-memory-index.md`; `docs/operations/service-reliability-and-observability.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence

- Deploy impact: none
- Env or secret changes: none
- Health-check impact: public `/health`, `/ready`, Web `/`, and build-info passed.
- Smoke steps updated: no
- Rollback note: no rollback performed or authorized.
- Observability or alerting impact: true Coolify/VPS/DB/worker readback remains blocked.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: recurring production health watch; app health previously green; full server-health blocked by missing bindings.
- Gaps: no approved read-only Coolify/VPS/DB/worker binding families in this runner.
- Inconsistencies: Web build-info still reports `metadataSource=env-runtime`.
- Architecture constraints: no deploy/restart/env mutation without approval.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Sources scanned: Paperclip DRE role, Soar state files, project memory, mission control, operations observability doc.
- Blocking unknowns: actual VPS/Coolify resource health cannot be read without approved bindings.
- Why it was safe to continue: public and protected read-only checks do not mutate production.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-5022](/LUC/issues/LUC-5022) production performance and server health watch.
- Priority rationale: critical assigned Paperclip issue.
- Why other candidates were deferred: scoped wake requires staying on LUC-5022.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state files only.
- Logic: no runtime code.
- Edge cases: secret-safe handling, cleanup of proof browser profile, blocked disposition if bindings are absent.

### 4. Execute Implementation
- Implementation notes: no code implementation; executed read-only production checks.

### 5. Verify and Test
- Validation performed: public smoke, build-info, timing samples, auth/session proof, env checker tests/preflight, cleanup recheck.
- Result: app health verified; server-health readback blocked by missing bindings.

### 6. Self-Review
- Simpler option considered: public smoke only.
- Technical debt introduced: no
- Scalability assessment: current blocker should be solved once via [LUC-4811](/LUC/issues/LUC-4811), not duplicated per watch.
- Refinements made: recorded explicit blocker chain and cleanup evidence.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence/state files.
- Context updated: yes
- Learning journal updated: not applicable; blocker is already known and tracked.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode selected according to verification scope.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs/context were updated.
- [x] Required responsibility lanes were integrated.

## Production-Grade Required Contract

- Goal: refresh production health posture for [LUC-5022](/LUC/issues/LUC-5022).
- Scope: read-only public/protected health checks and evidence/state updates.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: see above.
- Result Report: see below.

## Reliability / Observability Evidence

- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: production app public availability and authenticated dashboard session.
- SLI: availability and response latency for public API/Web; protected auth/session correctness.
- SLO: no formal SLO changed in this task; observed public endpoints all returned `200`.
- Error budget posture: healthy for app-level public/auth checks; incomplete for server-health.
- Health/readiness check: API `/health`, API `/ready`, Web `/`, Web `/api/build-info`.
- Logs, dashboard, or alert route: blocked by missing Coolify/VPS read-only bindings.
- Smoke command or manual smoke: recorded above.
- Rollback or disable path: not exercised; no mutation occurred.

## Security / Privacy Evidence

- Data classification: production public status plus redacted auth/session summaries.
- Trust boundaries: production Web/API; protected auth session; local runner env names.
- Permission or ownership checks: protected auth proof used existing audit env names only.
- Abuse cases: invalid token and post-logout fail-closed behavior passed in auth proof.
- Secret handling: no secret values, cookies, tokens, private headers, or response bodies written.
- Security tests or scans: auth proof includes invalid-token/logout fail-closed steps.
- Fail-closed behavior: Coolify env preflight failed closed with missing required names.
- Residual risk: true server resource/log/worker health remains unverified.

## Result Report

- Task summary: public production app health and protected auth/session remain green on SHA `42177530f2a2ddc22832133b545bccab6ab404eb`; full server-health remains blocked by missing read-only bindings.
- Files changed:
  - `history/evidence/luc-5022-production-performance-health-watch-2026-06-20.md`
  - `history/evidence/luc-5022-prod-auth-session-browser-proof-2026-06-20.md`
  - `history/evidence/_artifacts-luc-5022-prod-auth-session-browser-proof-2026-06-20.json`
  - `history/tasks/luc-5022-production-performance-health-watch-2026-06-20-task.md`
  - state/context files listed in scope
- How tested: public smoke, timing samples, protected auth proof, Coolify env checker tests, binding preflight, cleanup checks.
- What is incomplete: Coolify/VPS/DB/worker server-health readback.
- Next steps: [LUC-4811](/LUC/issues/LUC-4811) owner injects approved read-only bindings, then DRE reruns server-health projection.
- Decisions made: no duplicate incident created; existing blocker chain remains authoritative.
