# LUC-6466 Backtest Strategy Reports Public Shell Journey Proof Task

## Context

[LUC-6466](/LUC/issues/LUC-6466) is the QVE execution child for
[LUC-6463](/LUC/issues/LUC-6463) packet `LUC-6463-USER-JOURNEY-01`.

## Goal

Run the smallest useful journey proof for Backtest, Strategy, Reports/Logs,
and Public shell rows, then publish the reality status and route follow-up work
only where evidence requires it.

## Constraints

- Do not push, deploy, restart, run protected smoke, mutate production, or
  disclose secrets.
- Do not mutate exchange, payment, order, position, subscription, or
  live-trading state.
- Preserve the dirty shared worktree; do not revert unrelated changes.
- Do not duplicate Account access, Subscription, Exchange, Admin, production
  restoration, protected-input, source/build, host-level, broad Trading, or
  Dashboard proof lanes.

## Definition Of Done

- Focused Web journey checks are run or their blocker is recorded.
- Focused paired API checks are run where they are DB-independent and small.
- Route i18n evidence is recorded.
- Any reproduced defect or deterministic-proof gap has a named owner/action.
- Paperclip receives final disposition with evidence links and residual owner.

## Forbidden

- Commit, push, deploy, restart, rollback, or production smoke.
- Secret/account value readback.
- Production DB/Redis mutation.
- Exchange/payment/order/position/subscription/live-trading mutation.
- Worktree cleanup or reverting unrelated agent/user changes.

## Result Report

- Result: `DONE / VERIFIED_LOCAL_USER_JOURNEY_PACKET / NO_FEW_ESCALATION`.
- Evidence:
  `history/evidence/luc-6466-backtest-strategy-reports-public-shell-journey-proof-2026-06-30.md`.
- Web proof:
  - Combined suggested command timed out after `120s`.
  - Strategy split passed `14` files / `48` tests.
  - Reports/logs split passed `4` files / `8` tests.
  - Public shell split passed `4` files / `9` tests.
  - Backtest split failed once on `BacktestsList.test.tsx` missing `Net PnL`;
    focused rerun passed `1` file / `2` tests; serialized group timed out
    after `180s`.
  - 2026-07-01 closure rerun after [LUC-6479](/LUC/issues/LUC-6479): Backtest
    grouped Web packet passed `13` files / `33` tests in `54.55s` with
    `pnpm --filter web exec vitest run src/features/backtest src/app/dashboard/backtests --reporter=verbose --testTimeout=15000`.
- API proof:
  - Backtest focused API pack passed `4` files / `41` tests.
  - Strategy/reports focused API pack passed `3` files / `8` tests.
- Route i18n:
  `pnpm i18n:audit:route-reachable:web` passed with `0` findings.
- Cleanup:
  no leftover `chrome-headless-shell` processes were present.
- Follow-up:
  none for this issue. [LUC-6479](/LUC/issues/LUC-6479) closed the prior
  deterministic-proof gap; it did not reproduce a product UI defect, so no FEW
  repair lane is justified. Keep future proof split into bounded packets
  because the oversized combined Web command can timeout at the runner guard.
- Paperclip disposition:
  mark [LUC-6466](/LUC/issues/LUC-6466) `done` with this evidence packet. The
  prior Paperclip control-plane timeout caveat is superseded by the completed
  [LUC-6479](/LUC/issues/LUC-6479) child and the QVE closure rerun above.
- Commit:
  not committed because this shared checkout is already dirty/divergent with
  unrelated active-lane changes and this QVE heartbeat produced evidence only.
- Push/deploy impact:
  none.
