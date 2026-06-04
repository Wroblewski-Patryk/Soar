# LUC-1945 - Adversarial API Platform And Assistant Regression Proof

## Header
- ID: LUC-1945
- Title: [Soar][QA] Add adversarial regression proof for API platform and assistant review gaps
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-1944](/LUC/issues/LUC-1944)
- Priority: P1
- Module Confidence Rows: `SOAR-SECURITY-PRIVACY-001`, `SOAR-FEATURE-API-PLATFORM-SAFETY`, `SOAR-FEATURE-AUTH-SESSION`, `SOAR-FEATURE-AI-ASSISTANT-FOUNDATION`
- Requirement Rows: `REQ-DOC-024`
- Mission ID: LUC-1945-ADVERSARIAL-API-ASSISTANT-REGRESSION-PROOF-2026-06-04
- Mission Status: VERIFIED

## Context
[LUC-1935](/LUC/issues/LUC-1935) requested adversarial security review closure
for API platform safety and AI assistant foundation gaps. [LUC-1944](/LUC/issues/LUC-1944)
closed the assistant dry-run boundary/schema drift prerequisite, so this QA
checkpoint could add repeatable regression proof instead of remaining blocked.

## Goal
Provide one small, repeatable no-protected-smoke command that proves the
current API platform and assistant review gaps stay covered by automated tests.

## Scope
- `package.json`
- `apps/api/package.json`
- `apps/api/src/middleware/requireTrustedOrigin.unit.test.ts`
- `apps/api/src/modules/auth/sessionToken.test.ts`
- existing focused API tests referenced by `test:adversarial:api-assistant`
- source-of-truth state/docs entries for this proof

## Implementation Plan
1. Add a package-relative API Vitest script for the focused adversarial pack.
2. Add no-DB unit coverage for trusted-origin cookie write guard behavior.
3. Add no-DB unit coverage for auth session-token extraction/rejection/order.
4. Run the new root command and record exact pass/fail evidence.
5. Update project state, testing memory, requirement/module confidence, and
   task board evidence.

## Acceptance Criteria
- One repeatable command completes without hanging.
- Results include pass/fail evidence and exact residual boundaries.
- Tests cover rate-limit fail-closed behavior, logger redaction, trusted-origin
  cookie write guard, auth token/session rejection, assistant protocol
  scenarios, disabled/fail-closed main assistant path, invalid dry-run `LIVE`,
  and default LIVE dry-run/hot-path rejection.
- Deferred LIVE hot-path behavior is not reported as BACKTEST/PAPER parity.
- No protected smoke, secrets, production account access, or live trading paths.

## Definition of Done
- [x] Repeatable command exists: `pnpm run test:adversarial:api-assistant`.
- [x] Focused command passes locally.
- [x] Residual boundaries are documented.
- [x] Source-of-truth state is updated.

## Validation Evidence
- Tests:
  - `pnpm run test:adversarial:api-assistant` -> PASS (`8` files / `29` tests).
- Covered package-relative API paths:
  - `src/middleware/rateLimit.test.ts`
  - `src/middleware/requireTrustedOrigin.unit.test.ts`
  - `src/modules/auth/auth.jwt.test.ts`
  - `src/modules/auth/sessionToken.test.ts`
  - `src/modules/bots/bots.types.test.ts`
  - `src/modules/engine/assistantOrchestrator.protocol.test.ts`
  - `src/modules/engine/assistantOrchestrator.service.test.ts`
  - `src/modules/engine/assistantOrchestrator.parity.test.ts`
- High-risk checks:
  - no protected smoke;
  - no secret readback;
  - no production account access;
  - no exchange mutation;
  - no live-trading action.
- Reality status: verified.

## Security / Privacy Evidence
- Data classification: local unit/service test fixtures only.
- Trust boundaries: API middleware/session token parsing and assistant dry-run
  orchestration boundaries.
- Abuse cases:
  - Redis rate-limit unavailable in production fails closed.
  - Redis client error logging is redacted.
  - Cookie-backed state changes reject missing/untrusted origins where required.
  - Invalid JWT/session candidates are rejected.
  - Assistant protocol adversarial scenarios stay within foundation dry-run.
  - LIVE assistant hot-path stays fail-closed by default.
- Secret handling: no secret values printed or written.
- Fail-closed behavior: verified for rate limit and assistant LIVE default.
- Residual risk: DB-backed auth route e2e and protected production auth remain
  separate proof lanes; LIVE assistant hot-path parity remains deferred unless
  architecture explicitly enables it.

## Result Report
- Task summary: Added `test:adversarial:api-assistant` and two no-DB unit test
  files so API platform and assistant security-review gaps have a repeatable
  local regression pack.
- Files changed:
  - `package.json`
  - `apps/api/package.json`
  - `apps/api/src/middleware/requireTrustedOrigin.unit.test.ts`
  - `apps/api/src/modules/auth/sessionToken.test.ts`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.agents/state/requirements-verification-matrix.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/testing/testing-memory.md`
  - `history/tasks/luc-1945-adversarial-api-assistant-regression-proof-2026-06-04-task.md`
- How tested: `pnpm run test:adversarial:api-assistant` passed (`8` files /
  `29` tests).
- What is incomplete: protected production auth, DB-backed auth route e2e, and
  LIVE assistant hot-path parity are intentionally outside this checkpoint.
- Deployment impact: none.
