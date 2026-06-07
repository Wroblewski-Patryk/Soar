# LUC-2734 Security And Account-Access Gate Sweep

## Header

- ID: LUC-2734
- Title: Security and account-access gate sweep
- Task Type: release/security
- Current Stage: verification
- Status: BLOCKED
- Owner: Security & Privacy Auditor
- Priority: critical
- Mission ID: LUC-2734-SECURITY-ACCOUNT-ACCESS-GATE-SWEEP-2026-06-07
- Mission Status: BLOCKED
- Operation Mode: BUILDER

## Context

Paperclip assigned [LUC-2734](/LUC/issues/LUC-2734) to refresh the Soar
security/account-access gate for production accounts, test-account classes,
API keys, cookies, subscription/payment tests, exchange/live-risk boundaries,
and redaction rules. The wake payload had no pending comments and
`fallbackFetchNeeded=false`; checkout was already claimed by the harness and
was not repeated.

The previous same-scope sweep [LUC-2461](/LUC/issues/LUC-2461) found the gate
`PARTIAL/NO-GO`: only production UI audit input families were present, while
runtime readback, rollback, production DB, RC, and gate approver families were
missing.

## Goal

Refresh the security/account-access gate for the current production
build-info target and verify that no protected proof, account mutation,
subscription/payment mutation, API-key mutation, exchange setting change, or
live-trading action is safe to run without approved protected inputs.

## Scope

- Paperclip issue: [LUC-2734](/LUC/issues/LUC-2734)
- Production public build-info endpoint:
  `https://soar.luckysparrow.ch/api/build-info`
- Existing no-secret runner: `pnpm run ops:protected-inputs:check`
- Local code-evidence surfaces reviewed:
  - `scripts/checkProtectedInputReadiness.mjs`
  - `docs/security/api-key-lifecycle-policy.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/architecture/reference/subscription-tier-entitlements-contract.md`
  - `apps/api/src/utils/securityUtilities.test.ts`
  - `apps/api/src/utils/crypto.test.ts`
  - `apps/api/src/config/criticalSecretsReadiness.test.ts`
  - `apps/api/src/modules/subscriptions/subscriptionEntitlements.service.test.ts`
  - `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`
  - `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`

## Implementation Plan

1. Read the Paperclip Security & Privacy Auditor role, credential rules, and
   Soar source-of-truth state.
2. Read heartbeat context for [LUC-2734](/LUC/issues/LUC-2734).
3. Read public production build-info without authentication.
4. Reuse the no-secret protected-input readiness checker.
5. Run focused local tests for redaction, encryption readiness, entitlements,
   and exchange boundary fail-closed behavior.
6. Record evidence and source-of-truth updates.
7. Patch the Paperclip issue to a terminal blocked disposition with owner/action.

## Acceptance Criteria

- Production target SHA and checked-at time are recorded.
- Secret values, cookies, tokens, payment data, exchange credentials, and
  session values are not printed or stored.
- Protected input families are classified by presence count only.
- Account/API-key/subscription/payment/exchange/live paths are not mutated.
- The issue disposition is not passive `in_progress`; it names the unblock
  owner and action.

## Definition of Done

- [x] Existing no-secret checker reused.
- [x] Evidence is dated and target-SHA bound.
- [x] Missing critical protected input families are listed without values.
- [x] Focused local security tests passed.
- [x] Source-of-truth files updated.
- [x] Paperclip issue receives a clear blocked disposition.

## Forbidden

- Reading, printing, storing, or commenting secret values.
- Exporting cookies, tokens, passwords, or session values.
- Mutating production accounts, subscriptions, payment state, API keys,
  exchange settings, live runtime, live orders, or live positions.
- Deploy, restart, rollback, DB mutation, protected smoke mutation, or repo
  push.
- Treating public build-info or UI-auth input presence as runtime, SLO,
  rollback, DB, RC, or release-gate proof.

## Validation Evidence

- Public build-info:
  - command: `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info`
  - result: `gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493`,
    `gitRef=main`, `checkedAt=2026-06-07T09:02:00.961Z`.
- Protected input readiness:
  - command: `pnpm run -s ops:protected-inputs:check -- --today 2026-06-07 --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --git-ref main --build-info-checked-at 2026-06-07T09:02:00.961Z --json-output history/artifacts/luc-2734-security-account-access-gate-readiness-56d8d440-2026-06-07.json --markdown-output history/evidence/luc-2734-security-account-access-gate-readiness-56d8d440-2026-06-07.md --json`
  - result: `PARTIAL`, `NO-GO`, matching protected input names present `6`.
- Redaction / crypto / critical secret readiness:
  - command: `pnpm --filter api exec vitest run src/utils/securityUtilities.test.ts src/utils/crypto.test.ts src/config/criticalSecretsReadiness.test.ts`
  - result: PASS, `3` files / `18` tests.
- Subscription and exchange security boundaries:
  - command: `pnpm --filter api exec vitest run src/modules/subscriptions/subscriptionEntitlements.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`
  - result: PASS, `3` files / `17` tests.
- Tracked file-name scan for env/secret-like paths:
  - command: `git ls-files | rg '(^|/)(\\.env|.*\\.env|.*secret.*|.*credential.*|.*cookie.*|.*token.*)$'`
  - result: no tracked `.env` file listed; matches were source tests, docs,
    and historical evidence/task paths. This is a filename scan only, not a
    full secret scanner.

## Security / Privacy Evidence

- Assets: production auth context, operator approvals, cookies/session tokens,
  exchange API keys, subscription/payment state, live runtime/order state, and
  rollback/DB/RC gate proof.
- Actors: Paperclip Security Auditor, Ops/Release owner, QA/Test Automation,
  board/operator secret owner, application users.
- Trust boundaries: local Paperclip heartbeat shell, public production
  build-info endpoint, protected proof runners, encrypted runtime secret
  injection path, API server-side authorization and exchange boundaries.
- Abuse cases:
  - secret or cookie leakage through logs/artifacts;
  - UI audit input presence being mistaken for release authority;
  - unauthorized account/subscription/API-key mutation during smoke;
  - exchange live mutation before approved operator context;
  - unsupported exchange capability inferred from broad live execution flags.
- Required controls observed:
  - protected input checker reports names/counts only;
  - API-key policy requires encrypted-at-rest values and masked responses;
  - critical secret readiness rejects placeholder/legacy-only key material for
    release readiness;
  - subscription entitlement tests fail closed for FREE live trading;
  - exchange boundary tests fail closed for unsupported reads and exchange drift;
  - public build-info is treated as public freshness only.
- Residual risk:
  protected release proof remains blocked until missing protected families are
  bound by an approved secret/operator owner. No production account, payment,
  API-key, exchange, DB, rollback, RC, or live-trading proof is claimed here.

## Result Report

- Task summary: [LUC-2734](/LUC/issues/LUC-2734) refreshed the security and
  account-access gate for deployed `56d8d440`. The result remains
  `PARTIAL/NO-GO`: only `PROD_UI_AUDIT_*` and `PROD_UI_*` names are present.
- Missing protected families:
  - `LIVEIMPORT_READBACK_*`
  - `ROLLBACK_GUARD_*`
  - `SOAR_PROD_*`
  - `PROD_DB_CHECK_*`
  - `PRODUCTION_DB_CHECK_*`
  - `RC_*`
  - `GATE* / GATE_*`
- Files changed:
  - `history/tasks/luc-2734-security-account-access-gate-sweep-2026-06-07-task.md`
  - `history/evidence/luc-2734-security-account-access-gate-readiness-56d8d440-2026-06-07.md`
  - `history/artifacts/luc-2734-security-account-access-gate-readiness-56d8d440-2026-06-07.json`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Deployment impact: none.
- Source control impact: no commit or push.
- Next owner/action: board-capable Security/Ops secret owner must bind the
  missing protected input families through the approved encrypted runtime path,
  then wake the protected release proof lane. Until then, release remains
  fail-closed.
