# Backtest Recovery Contract

Status: required current-version target, **not accepted as implemented**.
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
- Overlapping old and new workers must not both own the same recovery or
  produce duplicate durable results. The implementation must establish
  exclusive ownership or equivalent fencing before completion is claimed.
- Retry/restart must preserve one coherent run lifecycle and report identity.
- Status shown to users must distinguish waiting, active work, delayed work,
  completed work, and failure from evidence rather than elapsed-time guesses.

## Acceptance Boundary

The current branch contains queue and startup-recovery work, but overlapping
worker recovery remains a known duplicate-execution risk. Local unit tests
alone cannot establish deployed recovery. Acceptance requires a controlled
worker-failure and overlapping-worker scenario, database/queue readback,
single-result assertions, and user-visible status proof in the target
environment. Do not requeue historical runs blindly.
