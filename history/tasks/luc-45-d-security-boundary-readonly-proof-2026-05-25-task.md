# Task

## Header
- ID: LUC-45-D
- Title: [Soar][LUC-45] Security boundary read-only proof
- Task Type: verification
- Current Stage: planning
- Status: IN_PROGRESS
- Owner: Security Review Lead
- Depends on: LUC-45-A, LUC-45-B
- Priority: P0

## Context
Readiness cannot be claimed without refreshed fail-closed security proof on the active candidate.

## Goal
Verify auth/session/exchange boundary behavior in protected read-only mode.

## Scope
- Protected auth/session proof steps
- Exchange/read-only boundary checks
- Secret-handling and artifact redaction checks

## Architecture Links

- Primary feature/module: security boundary read-only proof for auth/session, exchange readback, and redaction.
- Architecture nodes:
  - `docs/architecture/nodes/SOAR-FEATURE-AUTH-SESSION.md`
  - `docs/architecture/nodes/SOAR-FEATURE-API-PLATFORM-SAFETY.md`
  - `docs/architecture/nodes/SOAR-FEATURE-EXCHANGE-ADAPTER.md`
  - `docs/architecture/nodes/SOAR-TEST-AUTH-SESSION.md`
  - `docs/architecture/nodes/SOAR-TEST-API-PLATFORM-SAFETY.md`
  - `docs/architecture/nodes/SOAR-TEST-EXCHANGE-AUTH-READ.md`
- Function chains:
  - `docs/architecture/chains/CHAIN-AUTH-SESSION-DEEP.md`
  - `docs/architecture/chains/CHAIN-API-PLATFORM-SAFETY.md`
  - `docs/architecture/chains/CHAIN-EXCHANGE-ADAPTER-DEEP.md`
- Affected files:
  - `docs/security/secure-development-lifecycle.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `scripts/runProdSecurityExchangeProof.mjs`
- Tests/proof:
  - `apps/api/src/modules/auth/auth.session.deep.test.ts`
  - `apps/api/src/middleware/securityHeaders.test.ts`
  - `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`
- Docs updated:
  - `docs/status/task-entity-link-backfill-classification-2026-06-08.md`

## Required Output
- Security packet with explicit PASS/FAIL per boundary.
- Residual risk list with unblock owner/action.

## Validation
- Protected read-only checks only.
- No LIVE order/cancel/close mutation.

## Acceptance Criteria
- [ ] Protected boundary checks executed and documented.
- [ ] Secret handling and redaction posture verified.
- [ ] Residual security blockers are explicit and assigned.
