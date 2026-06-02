# LUC-1367 Owner-Login Verification Security Gate

Date: 2026-06-02
Owner: Security Review Lead
Status: approved verification path, proof not yet executed

## Decision

Paperclip may verify the Soar owner-login path only through a supervised,
read-only browser proof with Patryk present, or through an owner-provided
redacted evidence artifact. No agent may receive, paste, export, store, or
inspect passwords, cookies, session tokens, exchange API keys, payment data, or
subscription secrets.

## Approved Primary Path

1. Patryk opens the production Soar login page in a supervised browser context
   and enters credentials privately. Agent visibility must begin after
   authentication succeeds.
2. The verifier records only redacted evidence that the authenticated owner can
   reach the required workflows:
   - `/dashboard`
   - `/dashboard/bots`
   - `/dashboard/strategies`
   - `/dashboard/markets`
   - `/dashboard/backtests`
   - `/dashboard/reports`
   - `/dashboard/logs`
   - `/dashboard/profile`
3. The verifier must not open API-key secret values, exchange credential
   detail views, subscription mutation flows, billing mutations, live order
   actions, bot activation mutations, or external exchange settings.
4. Evidence may include redacted screenshots or a redacted browser proof note.
   It must show route reachability, authenticated context, timestamp, and build
   or environment identity when available, while masking private balances,
   account identifiers, email details beyond the owner identity needed for
   proof, exchange/API data, and any token-like value.
5. After the proof, Patryk either logs out of the supervised browser session or
   explicitly confirms the session can remain on the owner-controlled machine.
   No agent may export local storage, cookies, HAR files, browser profiles, or
   session material.

## Approved Fallback Path

Patryk may provide an already-redacted evidence artifact to Paperclip. The
artifact is acceptable only if it contains:

- production URL or environment identity;
- timestamp or date of capture;
- successful authenticated owner context;
- route evidence for the required workflows above;
- no visible secrets, tokens, API keys, exchange balances/positions beyond
  what is explicitly needed and redacted, payment data, or mutable action
  confirmation dialogs.

## Temporary Session Path

A temporary least-privilege proof session is acceptable only if it is created
through Paperclip secrets or an approved encrypted local secret store and has
no exchange keys, no payment mutation authority, and no live-trading mutation
authority. If Soar cannot issue such a constrained session today, use the
supervised-browser path instead.

## Required Evidence Statement

The acceptance ledger must record:

- `owner-login`: verified or blocked;
- route list checked;
- evidence artifact path or issue attachment reference;
- redaction check result;
- forbidden actions not performed;
- cleanup or session disposition;
- residual risk.

## Stop Conditions

Stop immediately and mark the proof blocked if any of these occur:

- credential, cookie, token, API-key, payment, or exchange-secret value becomes
  visible to an agent or capture artifact;
- a live trading, bot activation, subscription, API-key, exchange, or billing
  mutation would be required;
- route proof would require exporting browser storage, HAR captures, or raw
  authenticated API responses containing private data;
- Patryk cannot be present and no pre-redacted artifact or approved temporary
  proof session exists.

## Handoff

Next owner: QA/Test or Ops Release Lead.

Next action: run the supervised read-only proof or attach an owner-provided
redacted artifact, then update the Soar acceptance ledger. Security approval is
limited to this proof path and does not approve live trading, exchange
credential inspection, billing mutation, subscription mutation, deployment, or
release signoff.
