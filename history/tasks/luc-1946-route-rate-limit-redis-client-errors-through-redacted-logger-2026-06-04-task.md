# LUC-1946 Route Rate-Limit Redis Client Errors Through Redacted Logger

## Header
- ID: LUC-1946
- Title: [Soar][Backend] Route rate-limit Redis client errors through redacted logger
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend API Engineer
- Priority: P1
- Module Confidence Rows: SOAR-SECURITY-PRIVACY-001
- Requirement Rows: REQ-FUNC-018
- Quality Scenario Rows: QA-018
- Risk Rows: RISK-018
- Operation Mode: BUILDER
- Mission ID: LUC-1946-RATE-LIMIT-REDIS-LOGGER-2026-06-04
- Mission Status: PARTIALLY_VERIFIED

## Context
Security review LUC-1935 identified that `apps/api/src/middleware/rateLimit.ts`
still wrote Redis client `error` events with raw `console.error`, bypassing the
project module logger redaction path.

## Goal
Route rate-limit Redis client errors through the existing redacted module logger
without changing rate-limit production fail-closed behavior.

## Constraints
- Preserve existing Redis-backed rate-limit behavior and production fail-closed
  response when Redis is unavailable.
- Do not print or persist Redis URLs, credentials, tokens, cookies, API keys, or
  protected account data.
- Do not deploy, restart services, mutate environment variables, access
  protected smoke accounts, or touch live trading.
- Keep scope to the backend middleware lane.

## Definition of Done
- [x] Raw `console.error('Redis rate-limit client error:', error)` is removed
  from the rate-limit middleware.
- [x] Redis client error events are routed through `createModuleLogger`.
- [x] Focused test proves credential-bearing Redis error details are redacted.
- [x] Existing rate-limit degradation/fail-closed tests still pass.

## Forbidden
- New logging subsystem or duplicate redaction logic.
- Temporary bypasses around rate limiting.
- Production mutation, deploy, restart, protected account access, or live-trading
  mutation.

## Implementation
- Added `logRedisClientError(error)` in `apps/api/src/middleware/rateLimit.ts`.
- Registered the Redis client's `error` event with that handler.
- Exposed the handler through test internals to prove the same logger path.
- Added a focused test in `apps/api/src/middleware/rateLimit.test.ts` verifying
  the log payload is structured as `rate-limit` / `redis_client_error` and does
  not contain a credential-bearing Redis error message.

## Validation Evidence
- `pnpm --filter api exec vitest run src/middleware/rateLimit.test.ts` -> PASS
  (`1` file, `7` tests).
- `rg -n 'Redis rate-limit client error|console\.error\(' apps/api/src/middleware/rateLimit.ts apps/api/src/middleware/rateLimit.test.ts`
  -> PASS by no matches.
- `pnpm --filter api run typecheck` -> BLOCKED by unrelated existing errors:
  `src/modules/positions/positions.orphan-repair.contract.e2e.test.ts(77,26)`
  missing `ExternalTakeoverRebindResponse` fields and
  `src/router/workers-health-readiness.test.ts(37,58)` Prisma mock typing
  mismatch.

## Architecture Evidence
- Affected entity: `SOAR-MIDDLEWARE-RATE-LIMIT`.
- Affected feature: `SOAR-FEATURE-API-PLATFORM-SAFETY`.
- Fits approved architecture: yes; this reuses `SOAR-LIB-LOGGER` redaction.
- Architecture docs changed: no; behavior remains within documented API
  platform safety boundary.

## Deployment / Ops Evidence
- Deploy impact: none in this heartbeat.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert `apps/api/src/middleware/rateLimit.ts` and
  `apps/api/src/middleware/rateLimit.test.ts` changes if needed.

## Result Report
- Reality status: implemented and focused-test verified; full API typecheck is
  blocked by unrelated pre-existing test typing errors.
- Files changed:
  - `apps/api/src/middleware/rateLimit.ts`
  - `apps/api/src/middleware/rateLimit.test.ts`
  - `history/tasks/luc-1946-route-rate-limit-redis-client-errors-through-redacted-logger-2026-06-04-task.md`
- Commit: not committed in this heartbeat because the workspace already has
  unrelated dirty docs/state artifacts and full API typecheck is blocked by
  unrelated test typing errors.
- Push: not needed.
- Deployment impact: none.
- Residual risk: repository-wide API typecheck remains red until the unrelated
  positions orphan-repair and workers readiness test typing issues are fixed.
