# Next Steps

Last updated: 2026-05-07

## Next Tiny Task

Resolve the GitHub Actions account billing lock, then rerun the official
production promote workflow on `main`:

```powershell
pnpm run ops:prod:promote -- --dispatch --ref main --wait-seconds 60
```

Latest dispatch evidence: `promote-prod.yml` run `25514674413` for current
`main` at `2b0056c0c08af9ed3c05803c05f18df1b30c0103` failed before any steps
executed because GitHub reported: `The job was not started because your account
is locked due to a billing issue.`

After billing/Actions is restored, wait for production build-info to expose the
promoted SHA and let the workflow runtime freshness and rollback guard decide
whether the deploy stands. If promote is already complete, use
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md` once
production auth and DB/Coolify access are available. Start with
`LIVEIMPORT-03` authenticated read-only production runtime readback on current
production `main` (`21bb52f1e4b8865aab0dbb83ecffe698061fd7a3` or later).
Evidence must cover ownership, `strategyId` or single-strategy provenance
recovery, TTP visibility, actionable state, and import completeness across
assigned bot markets. Do not run live-money or destructive production actions.
The collector is hardened to fail closed when no RUNNING session produces a
runtime positions payload, so no-session output must not be accepted as
release evidence.

Latest prerequisite recheck after the final blocker pack confirmed production
build-info is current, but the current shell still lacks the required Soar
production auth/access. A no-auth collector attempt failed closed before
runtime readback, which is the expected safe result.

Post-push check: local `main` is pushed to `origin/main` at
`2b0056c0c08af9ed3c05803c05f18df1b30c0103`; production still reports
`21bb52f1...` until `Promote PROD` completes successfully. This shell did
dispatch and retry the workflow through GitHub API, but GitHub Actions could
not start the job due to account billing lock.

Canonical command once auth is available:

```powershell
pnpm run ops:liveimport:readback -- --expected-sha 21bb52f1e4b8865aab0dbb83ecffe698061fd7a3 --output docs/operations/liveimport-03-prod-readback-2026-05-07.json
```

## Candidate Backlog

0. Follow the final blocker execution pack:
   `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
0a. Unblock GitHub Actions billing/account status, then rerun the manual
   `Promote PROD` workflow on `main` with
   `pnpm run ops:prod:promote -- --dispatch --ref main --wait-seconds 60`.
   Wait for build-info, runtime freshness, and rollback guard to pass.
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
   backup/restore drill evidence and rollback proof pack are fresh but failed
   in the latest dry-run report. Activation audit, activation plan, RC status,
   RC sign-off, and RC checklist are fresh blocked/NO-GO artifacts for
   2026-05-07.
   - Restore drill needs approved production DB/Coolify access.
   - Rollback proof and runtime freshness need protected OPS auth.
   - Final release gate must run without `--dry-run`.
5. If the active queue is empty, run a planning-status sweep before saying
   nothing is planned.

## Continuation Command Handling

On "rob dalej", "rób dalej", "kontynuuj", "continue", or "next":

1. Read `.agents/core/operating-system.md`.
2. Read this file.
3. Cross-check canonical planning.
4. Pick one task.
5. Execute through `.agents/core/execution-loop.md`.
