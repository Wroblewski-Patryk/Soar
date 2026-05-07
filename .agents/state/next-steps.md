# Next Steps

Last updated: 2026-05-07

## Next Tiny Task

Run `LIVEIMPORT-03` with authenticated read-only production access and capture
redacted ETH/DOGE runtime positions evidence on current production `main`
(`21bb52f1e4b8865aab0dbb83ecffe698061fd7a3` or later). Evidence must cover
ownership, `strategyId` or single-strategy provenance recovery, TTP visibility,
actionable state, and import completeness across assigned bot markets. Do not
run live-money or destructive production actions.
The collector is hardened to fail closed when no RUNNING session produces a
runtime positions payload, so no-session output must not be accepted as
release evidence.

Canonical command once auth is available:

```powershell
pnpm run ops:liveimport:readback -- --expected-sha 1f816362c93e117e47cfe52a35e0fec93bd0b37d --output docs/operations/liveimport-03-prod-readback-2026-05-07.json
```

## Candidate Backlog

1. If production credentials or ops auth are available, execute
   `ops:liveimport:readback` and record redacted `LIVEIMPORT-03` evidence. The latest
   names-only prerequisite sweep after `FULLARCH-FIX-11` found no production
   auth variable names in this shell. The evidence run must include actual
   protected runtime positions payloads for the requested symbols.
2. If authenticated readback remains unavailable, keep `LIVEIMPORT-03` open and
   do not downgrade it to public health/build-info evidence.
3. After `LIVEIMPORT-03`, continue `BOTMULTI-09` protected runtime readback and
   broader V1 release gate evidence.
4. Refresh production V1 release evidence with real non-dry-run execution:
   backup/restore drill evidence and rollback proof pack are stale in the
   latest dry-run report. Activation audit, activation plan, RC status,
   RC sign-off, and RC checklist are fresh blocked/NO-GO artifacts for
   2026-05-07.
5. If the active queue is empty, run a planning-status sweep before saying
   nothing is planned.

## Continuation Command Handling

On "rob dalej", "rób dalej", "kontynuuj", "continue", or "next":

1. Read `.agents/core/operating-system.md`.
2. Read this file.
3. Cross-check canonical planning.
4. Pick one task.
5. Execute through `.agents/core/execution-loop.md`.
