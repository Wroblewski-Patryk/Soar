# LUC-1397 Owner-Login Verification Path

Date: 2026-06-02
Owner: Security Review Lead
Status: path provided, waiting for operator-selected proof method

## Scope

- Issue: [LUC-1397](/LUC/issues/LUC-1397)
- Target: Soar production owner-login acceptance proof
- Purpose: let Paperclip prove Patryk can log in and reach required Soar workflows without exposing private exchange/API data.
- Safety boundary: no secret values, passwords, cookies, tokens, browser storage, payment data, exchange credentials, balances, positions, or API-key material may be written to chat, issues, docs, screenshots, commits, logs, or artifacts.

## Approved Verification Path

Use the already approved Security gate:

- `history/releases/luc-1367-owner-login-verification-security-gate-2026-06-02.md`

Accepted proof methods:

1. Supervised read-only browser proof with Patryk present. Patryk enters credentials privately; agent visibility begins only after authentication succeeds.
2. Owner-provided already-redacted evidence artifact. It must show production/environment identity, timestamp/date, authenticated owner context, required route evidence, and no visible secret or mutation-sensitive data.
3. Temporary least-privilege proof session. It must be stored only in Paperclip secrets or an approved encrypted local secret store and must have no exchange-key, payment-mutation, subscription-mutation, or live-trading mutation authority.

Required route evidence:

- `/dashboard`
- `/dashboard/bots`
- `/dashboard/strategies`
- `/dashboard/markets`
- `/dashboard/backtests`
- `/dashboard/reports`
- `/dashboard/logs`
- `/dashboard/profile`

## Current Readiness Check

Command:

```text
pnpm run -s ops:protected-inputs:check -- --json
```

Result:

```text
status=PARTIAL
releaseStatus=NO-GO
matchingProtectedInputNamesPresent=5
presentFamilies=PROD_UI_AUDIT_*, PROD_UI_*
secretHandling=no secret values printed, copied, or stored
```

Interpretation:

- Protected UI input names are present in this runner.
- Names-only presence is not proof that the owner-login path is approved for this issue.
- Security does not authorize autonomous owner-account browsing from names-only readiness.
- A formal operator choice or redacted artifact is still required before QA/Ops executes the owner-login acceptance ledger.

## Stop Conditions

Stop immediately and mark the proof blocked if:

- any credential, cookie, token, API key, payment value, or exchange secret becomes visible;
- the proof requires API-key detail views, exchange credential views, billing/subscription mutation, live order actions, bot activation, or external exchange settings;
- the proof requires HAR export, browser storage export, raw authenticated response capture, or browser profile export;
- Patryk is not present and no owner-provided redacted artifact or approved temporary least-privilege proof session exists.

## Next Action

Security has provided the approved path. The issue should wait for the operator to choose one method:

1. approve supervised owner-present browser proof;
2. attach or point to an already-redacted artifact;
3. approve a temporary least-privilege proof session stored through approved secret storage.

After that, QA/Test or Ops Release Lead can run the acceptance ledger and record redacted evidence.
