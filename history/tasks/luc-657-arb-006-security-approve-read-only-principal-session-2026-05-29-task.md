# Task

## Header
- ID: LUC-657
- Title: [Soar][ARB-006][Security] Approve read-only principal/session for protected readiness endpoint
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Security
- Priority: P0

## Context
ARB-006 protected evidence window required Security sign-off for the principal/session class used to access protected `GET /workers/ready`.

## Goal
Approve or block the read-only principal/session class with explicit security constraints and unblock contract.

## Constraints
- Read-only lane only.
- No secret value exposure.
- No deploy/runtime mutation.

## Definition of Done
- [x] Security decision recorded (`approved` or `blocked`) with scope and constraints.
- [x] Guard-chain evidence captured from code/tests for protected readiness endpoint.
- [x] Sign-off sheet updated with security permit state.

## Forbidden
- secret value disclosure
- permission scope expansion beyond protected read-only readiness checks
- non-evidence-based approval

## Validation Evidence
- Manual checks:
  - inspected route guard chain for `/workers/ready` in `apps/api/src/router/index.ts`,
  - inspected readiness auth tests in `apps/api/src/router/workers-health-readiness.test.ts`.
- Tests:
  - attempted: `corepack pnpm --filter api run test -- --run src/router/workers-health-readiness.test.ts src/router/health-readiness.test.ts` (timeout),
  - attempted: `corepack pnpm --filter api run test -- --run src/router/workers-health-readiness.test.ts` (timeout).
- Reality status: partially verified

## Result Report
- Task summary: Security approved the principal/session **class** for protected readiness access with strict constraints and rejection criteria; artifact validity remains an operational blocker until a fresh approved credential/session is provided and proven.
- Files changed:
  - `history/releases/luc-657-arb-006-security-approval-read-only-principal-session-2026-05-29.md`
  - `history/releases/luc-405-arb-006-window-input-readiness-signoff-2026-05-28.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- What is incomplete:
  - production runtime proof of a fresh valid artifact passing `GET /workers/ready`.
- Next steps:
  1. Auth credential owner provides fresh approved artifact matching this class.
  2. Ops runs one canonical-host protected recheck and publishes evidence.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-29)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat:
  - revalidated local lane scope (`git status --short`) and confirmed only the expected LUC-657 evidence/state files are present in the current worktree,
  - confirmed no new comment-driven delta requiring policy changes to the approval.
- Disposition for this continuation heartbeat: `done`.
- Next owner/action unchanged:
  1. Auth credential owner delivers a fresh valid approved artifact matching the Security-approved class.
  2. Ops Release Lead executes exactly one canonical-host protected recheck for `GET /workers/ready` and publishes redaction-safe proof.

## Continuation Checkpoint (source_scoped_recovery_action, 2026-05-29)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat:
  - revalidated Security lane ownership boundaries against current role contract (approval policy only, no runtime mutation/deploy scope),
  - reconfirmed approval evidence remains sufficient and unchanged for Ops trigger (`GET /workers/ready`, read-only class, no secret disclosure),
  - synchronized fail-closed handoff text for parent `LUC-405` in canonical state files.
- Disposition for this continuation heartbeat: `done`.
- Unchanged unblock owner/action for parent `LUC-405`:
  1. Auth credential owner provides a fresh valid artifact matching the approved read-only class.
  2. Ops Release Lead runs one canonical-host protected recheck for `GET /workers/ready` and publishes redaction-safe proof.
