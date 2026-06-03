# Task

## Header
- ID: LUC-1438
- Title: [QA][Soar] Refresh production smoke auth binding for protected workers/ready
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: [LUC-1437](/LUC/issues/LUC-1437)
- Priority: P1
- Module Confidence Rows: protected production worker readiness
- Requirement Rows: production smoke protected auth binding
- Quality Scenario Rows: deployment readiness, auth-sensitive smoke
- Risk Rows: protected evidence missing, credential/session unavailable
- Iteration: 2026-06-02 Paperclip heartbeat
- Operation Mode: TESTER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified at lane level.
- [x] Affected requirement, quality scenario, and risk rows were identified at lane level.
- [x] The task improves release confidence by narrowing the blocker.

## Context
[LUC-1438](/LUC/issues/LUC-1438) is the QA lane for refreshing or proving the protected production smoke auth binding required before Ops can rerun worker-included smoke for [LUC-1437](/LUC/issues/LUC-1437).

## Goal
Provide or verify a valid approved read-only production smoke auth binding/session for protected `GET /workers/ready`, without exposing secret values.

## Scope
- Production API: `https://api.soar.luckysparrow.ch`
- Production web: `https://soar.luckysparrow.ch`
- Smoke script: `scripts/deploySmokeCheck.mjs`
- Auth binding names: `SMOKE_AUTH_TOKEN`, `SMOKE_AUTH_EMAIL`, `SMOKE_AUTH_PASSWORD`, optional private ops auth headers/basic auth names.
- Evidence file: `history/evidence/luc-1438-production-smoke-auth-binding-refresh-2026-06-02.md`

## Implementation Plan
1. Read issue context and QA role constraints.
2. Inspect the approved smoke runner interface without printing secret values.
3. Run names-only environment binding and shape checks.
4. Run the smallest worker-included production smoke command.
5. Record redaction-safe evidence and final disposition.

## Acceptance Criteria
- Binding availability is classified without printing values.
- Worker-included smoke result is captured.
- If a valid binding is absent, the issue names the unblock owner/action and is not left in idle `in_progress`.

## Definition of Done
- [x] Existing systems were reused (`ops:deploy:smoke`).
- [x] No workaround or auth bypass was introduced.
- [x] No secrets were printed or persisted.
- [x] Evidence records exact command and status-only output.
- [x] Final disposition is explicit.

## Forbidden
- No live trading, exchange, subscription, deployment, database, payment, user-account, or credential mutation.
- No repo storage of secret values.
- No auth bypass or fabricated principal.

## Validation Evidence
- Tests: not applicable; this is a production smoke binding verification lane.
- Manual checks: names-only env probe; worker-included production smoke command.
- Screenshots/logs: command output captured in evidence file.
- High-risk checks: no secret values printed; only binding names and HTTP statuses recorded.
- Module confidence ledger updated: no; no module behavior changed.
- Requirements matrix updated: no; requirement remains blocked by external credential binding.
- Quality scenarios updated: no; evidence file records the current blocked state.
- Risk register updated: no; existing protected auth/input risk remains active.
- Reality status: blocked.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none performed.
- Health-check impact: none.
- Smoke steps updated: no script changes; current command rerun.
- Rollback note: not applicable.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue context says prior token was not JWT-shaped and login fallback was invalid.
- Current runner has no `SMOKE_AUTH_*` binding names.
- Public production smoke remains healthy.

### 2. Select One Priority Mission Objective
- Selected task: classify and refresh/prove production smoke auth binding for `/workers/ready`.
- Other candidates deferred because this issue is the active wake scope.

### 3. Plan Implementation
- Use existing smoke script and names-only env checks.
- Stop if no approved credential source exists.

### 4. Execute Implementation
- Ran names-only env binding check.
- Ran `ops:deploy:smoke` against production with workers included.

### 5. Verify and Test
- Public checks passed.
- Protected `GET /workers/ready` returned `401`.

### 6. Self-Review
- Simpler option considered: mark blocked from env absence only.
- Actual command was still run to prove the current production smoke status.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: no canonical docs changed because no behavior changed.
- Context updated: evidence/task artifacts added.
- Learning journal updated: not applicable; this is an expected credential binding blocker, not a new tooling pitfall.

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validation was run.

## Result Report
- Task summary: verified the current heartbeat runtime lacks approved smoke auth bindings and production worker-included smoke still fails protected readiness at `401`.
- Files changed:
  - `history/evidence/luc-1438-production-smoke-auth-binding-refresh-2026-06-02.md`
  - `history/tasks/luc-1438-refresh-production-smoke-auth-binding-for-workers-ready-2026-06-02-task.md`
- How tested:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
- What is incomplete: no valid approved smoke auth binding is available to this runner.
- Next steps: Security/Test credential owner exposes a valid approved read-only production ADMIN smoke binding, then Ops reruns worker-included production smoke.
- Decisions made: block [LUC-1438](/LUC/issues/LUC-1438) rather than leave idle `in_progress`.
