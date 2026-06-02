# Task

## Header
- ID: LUC-1190
- Title: [Soar][Workers Ready][Security Worker] Define smoke-principal authorization gate and fail-closed checks
- Task Type: security
- Current Stage: verification
- Status: DONE
- Owner: Security Review Lead
- Depends on: LUC-657, LUC-1145, LUC-1162
- Priority: high
- Date: 2026-06-01

## Context
`GET /workers/ready` remains a protected readiness gate. Prior work approved the principal/session class, but the smoke gate needed one canonical, explicit fail-closed authorization contract for operators and QA.

## Goal
Define and publish a strict smoke-principal authorization gate with concrete fail-closed checks for protected readiness smoke.

## Scope
- `apps/api/src/router/index.ts`
- `apps/api/src/router/workers-health-readiness.test.ts`
- `history/releases/luc-1190-workers-ready-smoke-principal-authorization-gate-2026-06-01.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `history/tasks/luc-1190-workers-ready-security-smoke-principal-authorization-gate-2026-06-01-task.md`

## Implementation Plan
1. Reconfirm protected route guard chain in source.
2. Reconfirm regression intent for unauthenticated and non-admin fail-closed behavior.
3. Publish canonical security gate packet with explicit pass/fail criteria and blocker ownership.
4. Sync task board and project state with a clear disposition.

## Acceptance Criteria
- Security gate defines required principal/session class for protected smoke.
- Fail-closed checks explicitly cover 401/403 and no-scope-expansion rules.
- Unblock path names concrete owner/action.

## Constraints
- Read-only verification and documentation updates only.
- No secret values in artifacts.
- No deploy/runtime mutation.

## Definition of Done
- [x] Canonical authorization gate packet published.
- [x] Fail-closed checks and rejection criteria documented.
- [x] Source-of-truth state updated with disposition and unblock owner.

## Validation Evidence
- Commands:
  - `rg -n "requireOpsAccess|router.get\('/workers/ready'|requireRole\('ADMIN'\)|requireOpsNetwork" apps/api/src/router/index.ts -S`
  - `rg -n "rejects unauthenticated access|rejects authenticated non-admin principal for workers readiness" apps/api/src/router/workers-health-readiness.test.ts -S`
- Results:
  - Route remains guarded by `requireAuth -> requireRole('ADMIN') -> requireOpsNetwork`.
  - Test suite contains explicit fail-closed intent for unauthenticated (`401`) and non-admin (`403`) paths.
- Reality status: partially verified

## Security / Privacy Evidence
- Data classification: auth/session access to protected operational readiness endpoint.
- Trust boundaries: authenticated session, admin role, ops network boundary.
- Permission checks: defined and enforced fail-closed (`401`/`403`) before readiness payload.
- Abuse cases:
  - stale/invalid session -> deny;
  - authenticated non-admin user -> deny;
  - off-network source path -> deny.
- Secret handling: no secret values logged or persisted.
- Residual risk: full runtime proof for approved principal artifact remains blocked by env-dependent auth bootstrap instability.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: yes (contract-level)
- Rollback note: not applicable
- Observability or alerting impact: none

## Result Report
- Task summary:
  - Published canonical security contract for smoke-principal authorization gate on protected workers readiness checks.
  - Locked fail-closed acceptance and rejection criteria for protected smoke runs.
- Files changed:
  - `history/releases/luc-1190-workers-ready-smoke-principal-authorization-gate-2026-06-01.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `history/tasks/luc-1190-workers-ready-security-smoke-principal-authorization-gate-2026-06-01-task.md`
- How tested:
  - targeted source and test-intent grep evidence.
- What is incomplete:
  - runtime execution proof of a fresh approved smoke principal/session in this runner.
- Next steps:
  1. Backend auth/bootstrap owner resolves `/auth/register` precondition instability in local verification lane.
  2. Ops + Security run one approved protected smoke pass and attach redacted closure evidence.
- Decisions made:
  - Keep gate fail-closed and treat missing principal/runtime proof as blocker, not as partial pass.
