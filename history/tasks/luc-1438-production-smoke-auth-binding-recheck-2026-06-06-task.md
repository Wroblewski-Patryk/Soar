# Task

## Header
- ID: LUC-1438
- Title: [QA][Soar] Refresh production smoke auth binding for protected workers/ready - blocker-resolved recheck
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: [LUC-1439](/LUC/issues/LUC-1439)
- Priority: P1
- Module Confidence Rows: protected production worker readiness
- Requirement Rows: production smoke protected auth binding
- Quality Scenario Rows: deployment readiness, auth-sensitive smoke
- Risk Rows: protected evidence missing, credential/session rejected
- Iteration: 2026-06-06 Paperclip heartbeat
- Operation Mode: TESTER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: BLOCKED

## Context
[LUC-1438](/LUC/issues/LUC-1438) resumed after `issue_blockers_resolved`; [LUC-1439](/LUC/issues/LUC-1439) marked the security blocker done and approved exactly one read-only QA/Ops recheck.

## Goal
Execute the approved protected `/workers/ready` recheck without exposing secrets and determine whether the production smoke auth binding is now accepted by API auth.

## Scope
- Production API: `https://api.soar.luckysparrow.ch`
- Production web: `https://soar.luckysparrow.ch`
- Smoke script: `scripts/deploySmokeCheck.mjs`
- Runtime binding names only: `SMOKE_AUTH_*`, optional private ops auth names, and `PROD_UI_AUDIT_*`
- Evidence file: `history/evidence/luc-1438-production-smoke-auth-binding-recheck-2026-06-06.md`

## Implementation Plan
1. Confirm [LUC-1439](/LUC/issues/LUC-1439) is done and read its latest redaction-safe disposition.
2. Inspect current binding names without values.
3. Run worker-included production smoke as-is.
4. Run one process-local `PROD_UI_AUDIT_AUTH_TOKEN` to `SMOKE_AUTH_TOKEN` mapping because that is the fresh token name visible in the runner and the smoke script consumes `SMOKE_AUTH_TOKEN`.
5. Record redaction-safe evidence and update Paperclip disposition.

## Acceptance Criteria
- The approved recheck is executed once.
- No secret values are printed or persisted.
- If the endpoint still returns an auth failure, the issue is blocked with a concrete credential owner/action.

## Definition of Done
- [x] Existing smoke runner was reused.
- [x] No workaround or auth bypass was introduced.
- [x] No secret values were printed or persisted.
- [x] Recheck result is captured.
- [x] Final disposition is explicit.

## Forbidden
- No live trading, exchange, subscription, deployment, database, payment, user-account, or credential mutation.
- No repo storage of secret values.
- No auth bypass or fabricated principal.

## Validation Evidence
- Tests: not applicable; this is production smoke binding verification.
- Manual checks: names-only env probe; worker-included production smoke as-is; worker-included production smoke with process-local token mapping.
- Screenshots/logs: command output captured in evidence file.
- High-risk checks: no secret values printed; only binding names and HTTP statuses recorded.
- Module confidence ledger updated: no; no module behavior changed.
- Requirements matrix updated: no; requirement remains blocked by rejected credential/session.
- Quality scenarios updated: no; evidence file records the current blocked state.
- Risk register updated: no; existing protected auth/input risk remains active.
- Reality status: blocked.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: no persistent changes; process-local `SMOKE_AUTH_TOKEN` was removed after the recheck.
- Health-check impact: none.
- Smoke steps updated: no script changes.
- Rollback note: not applicable.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- [LUC-1439](/LUC/issues/LUC-1439) is done and approved exactly one read-only recheck.
- Current runner lacks `SMOKE_AUTH_*` names but exposes `PROD_UI_AUDIT_AUTH_TOKEN`.

### 2. Select One Priority Mission Objective
- Selected task: execute the approved protected worker readiness smoke recheck.

### 3. Plan Implementation
- Use existing smoke script.
- Avoid secret output.
- Fail closed if the endpoint returns an auth failure.

### 4. Execute Implementation
- Ran smoke as-is.
- Ran smoke with process-local token mapping.

### 5. Verify and Test
- Public checks passed.
- Protected `GET /workers/ready` returned `401` in both paths.

### 6. Self-Review
- Simpler option considered: block immediately because `SMOKE_AUTH_*` is absent.
- Mapping the visible approved token name was necessary to make the one allowed recheck meaningful.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: no canonical docs changed because no behavior changed.
- Context updated: evidence/task artifacts added.
- Learning journal updated: not applicable.

## Result Report
- Task summary: executed the one approved recheck after [LUC-1439](/LUC/issues/LUC-1439); protected `/workers/ready` still fails at `401`.
- Files changed:
  - `history/evidence/luc-1438-production-smoke-auth-binding-recheck-2026-06-06.md`
  - `history/tasks/luc-1438-production-smoke-auth-binding-recheck-2026-06-06-task.md`
- How tested:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  - process-local `PROD_UI_AUDIT_AUTH_TOKEN` mapped to `SMOKE_AUTH_TOKEN` for the same command
- What is incomplete: no API-auth-accepted supported smoke binding is available.
- Next steps: Security/Test credential owner rotates or provisions a production-smoke appropriate ADMIN principal/session and exposes it as `SMOKE_AUTH_TOKEN` or `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD`.
- Decisions made: fail closed and block [LUC-1438](/LUC/issues/LUC-1438) again because the approved recheck returned `401`.
