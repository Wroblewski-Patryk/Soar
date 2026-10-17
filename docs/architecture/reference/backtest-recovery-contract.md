# Backtest Recovery Contract

Status: required current-version behavior with **local same-version worker proof**
from BT-001/001b. Production and user-visible acceptance remain open.
Product owner decision: 2026-10-17. See the
[Current Version Product Contract](../../product/current-version-contract.md).

## User-Visible Outcome

After a backtest worker failure, an unfinished run resumes automatically and
reaches one truthful terminal result. Recovery must preserve the identity of
the original run and must not create a second run, duplicate processing
effects, trades, or reports. A run that cannot be safely recovered must show
an explicit failure/degraded state rather than fictitious progress.

## System Invariants

- Persisted run state and queue state must be reconciled in both directions:
  a run without a job and a job without a run must not be silently treated as
  healthy work.
- Overlapping workers running the token-aware version must not both commit
  the same recovery or produce duplicate durable results. An older worker
  does not honor the token; a mixed-version rollout requires stop-before-start
  until every worker uses the fenced implementation.
- Retry/restart must preserve one coherent run lifecycle and report identity.
- Status shown to users must distinguish waiting, active work, delayed work,
  completed work, and failure from evidence rather than elapsed-time guesses.

## Acceptance Boundary

BT-001/001b locally verified token-fenced claims and progress, atomic terminal
status plus replacement trades and report, and a two-process same-version
worker scenario with real Redis and an isolated `_test` database. The local
proof covers crash takeover, interrupted acknowledgement, and a single durable
result; see [API backtests](../../modules/api-backtests.md) and
[`backtestTwoProcess.runtime.test.ts`](../../../apps/api/src/modules/backtests/backtestTwoProcess.runtime.test.ts).

That proof does not cover mixed old/new worker code: old workers do not check
execution tokens, so deployment must stop them before starting new workers.
Production migration and worker restart, database/queue readback, and the
user-visible recovery/status journey still need target-environment evidence.
Do not requeue historical runs blindly or treat local tests as deployed proof.
