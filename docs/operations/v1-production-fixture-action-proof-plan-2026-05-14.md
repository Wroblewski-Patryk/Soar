# V1 Production Fixture Action Proof Plan

Date: 2026-05-14
Status: `APPROVED_LIMITED_BOUNDARY_IN_PROGRESS`
Target build: `457bce05338310c198c03a973395a9176f298dc1`

## Purpose

The current V1 release and operations gate is ready for deployed `457bce05`,
but the V1 product action matrix still has remaining `PASS_LOCAL` rows. Those
rows cannot honestly become `PASS` only from route reachability, local tests,
or production read-only runtime evidence. They need production-safe action
clickthroughs on approved disposable fixture data, or an explicit owner
acceptance that local proof plus the release gate is the accepted boundary for
this version.

This plan defines the safe fixture boundary for the remaining action proofs.
It is intentionally scoped: it approves only disposable production fixture
actions that satisfy this boundary. LIVE exchange mutation and existing-data
mutation still require a separate explicit decision.

## Blocking Decision

Owner approval was accepted on 2026-05-14 for the limited disposable fixture
boundary below before the first production fixture proof ran.

Accepted approval wording should explicitly allow:

- creating disposable production fixtures named with
  `Codex V1 Proof <yyyyMMdd-HHmmss>`;
- editing only those disposable fixtures;
- deleting only those disposable fixtures during cleanup;
- using PAPER-only trading mode for order, position, bot, wallet, market,
  strategy, backtest, report, and audit-log proofs;
- recording redacted evidence with no raw credentials, cookies, tokens,
  private headers, or API-key secret values.

Outside that boundary, remaining rows must stay `PASS_LOCAL` or be accepted as
a version-boundary decision.

## Safety Boundary

Allowed after approval:

- Authenticated production UI/API actions against disposable fixture rows.
- Create -> read back -> update where needed -> delete -> cleanup verification.
- PAPER manual-order and PAPER runtime action checks only when the selected bot,
  wallet, strategy, and market universe are disposable proof resources or are
  explicitly approved existing PAPER resources.
- Read-only exchange capability and market-data checks.
- Audit-log checks that inspect only the current operator's proof events.

Forbidden without separate explicit approval:

- LIVE order submit, LIVE cancel, LIVE close, or any exchange-side mutation.
- Mutating preserved strategies, especially the RSI 20/80 representative path.
- Deleting or altering existing production user data that was not created by
  this proof pack.
- Persisting raw credentials, tokens, cookies, private headers, API keys, or
  screenshots containing secrets in the repository.
- Treating failed cleanup as acceptable release evidence.

## Proof Order

1. Read-only baseline
   - Confirm build-info, auth/session, protected routes, current bot/runtime
     shape, and existing audit-log visibility.
   - Expected result: no production mutations.

2. Low-risk CRUD fixtures
   - Profile basic settings safe round-trip, Wallets, Markets, Strategies,
     Backtests, Reports, Logs/Audit Trail, Bots non-destructive actions.
   - Expected result: all disposable fixtures removed or left inactive only if
     the owner explicitly asks to keep them.

3. P0 money-adjacent PAPER proof
   - Manual Orders, Orders, Positions, and Bot Runtime using PAPER-only
     disposable context or approved existing PAPER context.
   - Expected result: DB readback proves lifecycle state; no exchange mutation
     and no LIVE action.

4. Security and privacy production proof
   - Unauthenticated fail-closed checks, protected route enforcement, ownership
     negative probes where a second approved disposable account exists, rate
     limit/header/redaction probes, and secret artifact scan.
   - Expected result: fail-closed behavior is proven without disclosing
     protected payloads.

5. Regenerate V1 reports
   - Update product action matrix, project index, static scan, master ledger,
     completion scorecard, module confidence ledger, requirements matrix,
     risks, system health, project state, task board, and planning queue.

## Module Coverage Target

| Module | Proof Mode | Mutation Allowed After Approval | Cleanup Required |
| --- | --- | --- | --- |
| Profile API Keys | disposable key metadata + unsupported/placeholder probe | yes, no raw real secret persistence | delete key and verify audit redaction |
| Bots | disposable PAPER bot or approved inactive PAPER bot | yes, PAPER only | delete/deactivate disposable bot |
| Profile | reversible settings round-trip | yes | restore original values |
| Wallets | disposable PAPER wallet | yes | delete wallet after dependency cleanup |
| Markets | disposable universe | yes | delete universe after dependent proofs |
| Strategies | disposable cloned strategy | yes | delete clone; preserve RSI 20/80 |
| Manual Orders | PAPER-only order path | yes, PAPER only | cancel/close/verify terminal state |
| Positions | PAPER-only position path | yes, PAPER only | close/verify terminal state |
| Orders | PAPER-only order lifecycle | yes, PAPER only | cancel/close/verify terminal state |
| Backtests | disposable run | yes | delete run when supported |
| Reports | readback from proof data | no direct mutation | none beyond source cleanup |
| Logs/Audit Trail | proof event readback | no direct mutation | none |
| Exchange Adapter | read-only capability/market data/probe boundary | only approved safe probes | delete disposable key metadata if created |
| Security/Privacy | protected negative probes | no destructive mutation | artifact scan and token cleanup |
| UX/A11y/Mobile | production browser responsive clickthrough | no data mutation unless tied to fixture steps | close browser contexts and clean screenshots if sensitive |

## Acceptance Criteria

- Every production action proof starts by checking deployed build-info for
  `457bce05`.
- Every created fixture has a unique proof prefix and ownership trace.
- Every mutating proof has cleanup verification.
- Every artifact is redacted and passes the changed-file secret scan.
- LIVE/money-impacting actions remain blocked unless a separate approval says
  exactly which live action is allowed and why the no-order guard is active.
- If any cleanup fails, V1 remains `NO-GO` and the fixture ID is recorded as a
  P1 operational follow-up.

## Current Result

`APPROVED_LIMITED_BOUNDARY_IN_PROGRESS`. The latest proof run passed against
deployed `457bce05` and is recorded in
`docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md`. It covered
Profile, Profile API Keys, Wallets, Markets, Strategies, Bots, Manual Orders,
Orders, Backtests, Reports, Logs/Audit Trail, and Exchange Adapter probe
fail-closed behavior. The Manual Orders/Orders slice used a disposable PAPER
limit order, proved readback, proved cancel fail-closed without `riskAck`,
canceled it with `riskAck`, and left the terminal canceled order only as
audit/history. The Backtests/Reports slice created a disposable run, proved
run/report/trades/timeline readback, and deleted the run in cleanup. All
created disposable fixtures were cleaned up. No LIVE orders, LIVE cancels, LIVE
closes, position mutation, or exchange-side mutations were performed.

Latest generated V1 state after the subsequent Security/Exchange production
proof is still `NO-GO`: `PASS:19`, `PASS_LOCAL:2`, implementation estimate
`99.1%`, evidence coverage `96.8%`, and release readiness `94.9%`.
