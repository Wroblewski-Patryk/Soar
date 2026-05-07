# Next Steps

Last updated: 2026-05-07

## Next Tiny Task

Run `LIVEIMPORT-03` with authenticated read-only production access and capture
redacted ETH/DOGE runtime positions evidence on current production `main`
(`6a7c9889` or later). Evidence must cover ownership, `strategyId` or
single-strategy provenance recovery, TTP visibility, actionable state, and
import completeness across assigned bot markets. Do not run live-money or
destructive production actions.

## Candidate Backlog

1. If production credentials or ops auth are available, execute
   `LIVEIMPORT-03` readback and record redacted evidence. The latest
   names-only prerequisite sweep after `FULLARCH-FIX-11` found no production
   auth variable names in this shell.
2. If authenticated readback remains unavailable, keep `LIVEIMPORT-03` open and
   do not downgrade it to public health/build-info evidence.
3. After `LIVEIMPORT-03`, continue `BOTMULTI-09` protected runtime readback and
   broader V1 release gate evidence.
4. If the active queue is empty, run a planning-status sweep before saying
   nothing is planned.

## Continuation Command Handling

On "rob dalej", "rób dalej", "kontynuuj", "continue", or "next":

1. Read `.agents/core/operating-system.md`.
2. Read this file.
3. Cross-check canonical planning.
4. Pick one task.
5. Execute through `.agents/core/execution-loop.md`.
