# Task

## Header
- ID: LUC-1162
- Title: [Soar][LUC-241][Security] Validate /workers/ready principal permission path
- Task Type: security
- Current Stage: verification
- Status: BLOCKED
- Owner: Security Review Lead
- Depends on: LUC-1145, LUC-1163
- Priority: high
- Date: 2026-05-31

## Context
Wake payload requested continuation for security validation of the protected principal/permission path used by `GET /workers/ready`.

## Goal
Confirm whether the current protected-readiness blocker is a route permission defect or an auth/session principal-path defect, and publish a fail-closed security disposition.

## Scope
- `apps/api/src/router/index.ts`
- `apps/api/src/middleware/requireAuth.ts`
- `apps/api/src/middleware/requireRole.ts`
- `apps/api/src/middleware/requireOpsNetwork.ts`
- `apps/api/src/router/workers-health-readiness.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `history/tasks/luc-1162-soar-luc-241-security-validate-workers-ready-principal-permission-path-2026-05-31-task.md`

## Implementation Plan
1. Validate source-level guard chain for `/workers/ready` and middleware order.
2. Run minimal authz-focused verification for middleware and route tests.
3. Classify blocker location (route authz defect vs principal/session path) and record unblock owner/action.

## Acceptance Criteria
- Guard chain for `/workers/ready` is explicitly validated from source.
- Test evidence is captured with PASS/FAIL split and blocker cause.
- Security disposition is recorded with named unblock owner/action.

## Constraints
- Read-only verification only.
- No runtime/deploy mutation.
- No secret/session/token values in artifacts.

## Definition of Done
- [x] Source-level principal permission path validated.
- [x] Minimal verification executed and captured.
- [x] Security disposition with blocker ownership recorded.

## Validation Evidence
- Commands:
  - `rg -n "requireOpsAccess|workers/ready|requireRole\('ADMIN'\)|requireOpsNetwork" apps/api/src/router/index.ts apps/api/src/router/workers-health-readiness.test.ts -S`
  - `pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts src/middleware/requireRole.test.ts src/middleware/requireOpsNetwork.test.ts src/router/workers-health-readiness.test.ts`
- Results:
  - Source check confirms `GET /workers/ready` is guarded by `requireAuth -> requireRole('ADMIN') -> requireOpsNetwork`.
  - `requireRole.test.ts` PASS, `requireOpsNetwork.test.ts` PASS.
  - `requireAuth.test.ts` and `workers-health-readiness.test.ts` partially fail in this runner due to missing local DB (`Can't reach database server at localhost:5432`) before full principal/session flow can complete.
- Security interpretation:
  - No evidence of missing route guard or weakened permission policy.
  - Active failure class remains principal/session credential path (`401`) plus local DB-dependent verification gap, not a policy bypass.
- Reality status: blocked

## Follow-up Checkpoint (issue_assigned)
- Additional concrete action completed:
  - Added explicit route-level regression in `apps/api/src/router/workers-health-readiness.test.ts`:
    - `rejects authenticated non-admin principal for workers readiness` (expects `GET /workers/ready` => `403`).
- Focused rerun:
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts`
  - result in this runner: suite fails early because `POST /auth/register` returns `500` (precondition failure before permission assertion execution).
- Updated interpretation:
  - The permission-path intent is now codified in regression coverage.
  - Verification remains blocked by local auth-registration runtime precondition failure, so final assertion proof is pending.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable
- Observability or alerting impact: none

## Security / Privacy Evidence
- Data classification: auth/session and protected ops-readiness boundary.
- Trust boundaries: authenticated admin principal + allowed ops network.
- Permission checks: fail-closed chain preserved (`401`/`403`).
- Secret handling: no secret values persisted.
- Residual risk: protected readiness proof for approved read-only principal remains unverified in current runner.

## Result Report
- Task summary:
  - Validated source-level principal permission path for `/workers/ready`.
  - Confirmed guard chain remains strict and fail-closed.
  - Classified unresolved path as credential/principal execution evidence gap, not route-authz regression.
- Files changed:
  - `apps/api/src/router/workers-health-readiness.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `history/tasks/luc-1162-soar-luc-241-security-validate-workers-ready-principal-permission-path-2026-05-31-task.md`
- How tested:
  - Source guard grep + targeted vitest command.
- What is incomplete:
  - Executing the new `/workers/ready` non-admin assertion path in this runner because auth registration currently fails (`500`) before test setup completes.
- Next steps:
  1. API/runtime owner restores local auth registration path for DB-backed route tests in this runner context.
  2. Security/QA reruns focused suite and captures passing proof that authenticated `USER` principal is denied (`403`) on `GET /workers/ready`.
- Decisions made:
  - Issue disposition for this heartbeat remains `blocked` pending principal/session proof and environment-ready validation path.
