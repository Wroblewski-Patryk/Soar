# LUC-93 Account Access ClearSession Proof

## Header
- ID: LUC-93
- Title: Account access clearSession implemented behavior proof
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: Test Automation Engineer
- Priority: P1
- Module Confidence Rows: Account access / API auth middleware
- Requirement Rows: Account access stale/invalid/expired/deleted-user auth candidates fail closed
- Mission ID: LUC-93-ACCOUNT-ACCESS-CLEARSESSION-PROOF-2026-07-04
- Mission Status: VERIFIED

## Context
Parent [LUC-86](/LUC/issues/LUC-86) resolved the documentation link for
`apps/api/src/middleware/requireAuth.ts#clearSession`. The remaining app-completion
row required behavioral proof for stale, invalid, expired, or deleted-user auth
candidates.

## Goal
Prove the existing `requireAuth` clear-session path clears the session cookie and
returns fail-closed auth errors for rejected session candidates.

## Scope
- `apps/api/src/middleware/requireAuth.test.ts`
- `apps/api/src/middleware/requireAuth.ts#clearSession`
- Local API middleware regression proof only

## Implementation Plan
1. Read the issue context and existing auth middleware tests.
2. Add focused regression assertions for session-cookie clearing on rejected auth candidates.
3. Run the smallest targeted API test pack.
4. Refresh row-level proof metadata for the app-completion source-of-truth files.

## Acceptance Criteria
- Missing-token request clears `token` cookie and returns `401 Missing token`.
- Invalid issuer/audience candidate clears `token` cookie and returns `401 Invalid token`.
- Expired JWT candidate clears `token` cookie and returns `401 Invalid token`.
- Deleted-user candidate clears `token` cookie and returns `401 Invalid token`.
- Stale `sessionVersion` candidate clears `token` cookie and returns `401 Invalid token`.

## Definition of Done
- Focused middleware tests pass.
- No production, secret, deploy, live-trading, account, exchange, payment, or provider state mutation occurs.
- App-completion proof row has a direct test relation and local evidence.

## Validation Evidence
- Command:
  `corepack pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
- Result:
  PASS, `1` file / `9` tests.
- Reality status:
  verified locally.

## Result Report
- Task summary:
  Added focused clear-session regression proof for stale, invalid, expired, missing-token, and deleted-user auth candidates.
- Files changed:
  `apps/api/src/middleware/requireAuth.test.ts`,
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/graphs/architecture-proof-register.csv`,
  `docs/graphs/architecture-awareness.csv`,
  `docs/graphs/architecture-awareness.json`,
  `docs/status/app-completion-index.md`,
  `docs/status/app-completion-index.json`,
  `docs/status/project-truth-index.md`,
  `docs/status/project-truth-index.json`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`,
  `.agents/state/module-confidence-ledger.md`.
- What is incomplete:
  No production/authenticated browser proof was in scope. DB-backed `auth.e2e.test.ts`
  was not required for this DB-free middleware row.
- Next steps:
  Continue remaining Account access app-completion rows separately.
