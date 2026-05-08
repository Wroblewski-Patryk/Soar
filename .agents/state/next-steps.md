# Next Steps

Last updated: 2026-05-08

## Next Tiny Task

The local V1 backend paper/live runtime line is closed for this slice: focused
parity/crash coverage, DB-backed runtime/order/exchange/import/readback packs,
and the full local API suite pass. Continue at the remaining production
evidence boundary, not by reopening local backend packs unless code changes or
new failures appear.

Local DB-backed runtime evidence is available if the `default` Docker context
or existing local ports are used; avoid treating the unhealthy `desktop-linux`
context as the only Docker signal.

```powershell
docker --context default info --format '{{.ServerVersion}}'
Test-NetConnection -ComputerName localhost -Port 5432
pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --run --sequence.concurrent=false
```

Next production release evidence line:

Deploy the pushed `main` through the accepted Coolify operator path, not
GitHub Actions. GitHub Actions production promote/rollback entrypoints have
been removed because the project does not use paid GitHub Actions and workflow
attempts create unwanted email noise.

```powershell
$expectedSha = git rev-parse HEAD
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 15
```

After Coolify deploy exposes the promoted SHA, continue with
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md` once
production auth and DB/Coolify access are available. Start with
`LIVEIMPORT-03` authenticated read-only production runtime readback on the
current pushed `main` V1 backend parity candidate or later.
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

Post-backend-parity check: production web build-info advanced through
`5cf5a4ce983e313060f78270f47ba026f33b676f`, which includes the adapter-pure
PAPER/LIVE runtime fix, blocker evidence alignment, deploy-wait coordination
docs, and release-gate build-info freshness hardening. Public deploy smoke
without workers passed. Continue with
authenticated read-only `LIVEIMPORT-03` production runtime readback once
credentials are available. Do not use GitHub Actions for production
deployment.

Canonical command once auth is available:

```powershell
$expectedSha = git rev-parse HEAD
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output docs/operations/liveimport-03-prod-readback-2026-05-08.json
```

If production build-info reports a deployed commit older than latest `main`
while latest `main` only contains docs/state evidence on top, use the deployed
SHA for readback evidence until a newer Coolify/manual deploy is confirmed.
Latest observed production SHA is
`5cf5a4ce983e313060f78270f47ba026f33b676f`.

## Candidate Backlog

0. Follow the final blocker execution pack:
   `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
0a. Production build-info already exposes the backend parity runtime fix,
   blocker evidence alignment, deploy-wait coordination, operator preflight
   hardening docs, live-import release-gate evidence enforcement, and
   build-info freshness enforcement at
   `5cf5a4ce983e313060f78270f47ba026f33b676f`. Do not use GitHub Actions. If a
   future step depends on a pushed commit being deployed, wait for build-info
   before continuing; an operator can speed this up with Coolify dashboard
   force deploy, or with deploy webhook/API token if those secrets are
   available outside the repository.
1. If production credentials or ops auth are available, execute
   `ops:liveimport:readback` for the currently checked-out `HEAD` after
   build-info confirms that `HEAD` is deployed, and record redacted
   `LIVEIMPORT-03` evidence. The latest names-only prerequisite sweep found
   only `FIGMA_OAUTH_TOKEN` in this shell. The collector now names the exact
   accepted auth variable choices on the fail-closed missing-auth path. The
   evidence run must include actual protected runtime positions payloads for
   the requested symbols. The final V1 release gate now requires this artifact
   as `LIVEIMPORT-03 runtime readback` and blocks with
   `evidence:liveImportReadback:missing` until it exists.
2. If authenticated readback remains unavailable, keep `LIVEIMPORT-03` open and
   do not downgrade it to public health/build-info evidence.
3. After `LIVEIMPORT-03`, continue `BOTMULTI-09` protected runtime readback and
   broader V1 release gate evidence.
4. Refresh production V1 release evidence with real non-dry-run execution:
   backup/restore drill evidence and rollback proof pack are fresh but failed
   in the latest dry-run report. Activation audit, activation plan, RC status,
   RC sign-off, and RC checklist are fresh blocked/NO-GO artifacts for
   2026-05-08.
   - Restore drill needs approved production DB/Coolify access. Required env
     choices are now explicit in the tool/help path:
     `PROD_DB_CHECK_CONTAINER` or `PRODUCTION_DB_CHECK_CONTAINER`, plus the
     matching DB user/name envs.
   - Rollback proof and runtime freshness need protected OPS auth. Required
     auth env choices are now explicit in the tool/help path:
     `ROLLBACK_GUARD_AUTH_TOKEN`, or `ROLLBACK_GUARD_AUTH_EMAIL` plus
     `ROLLBACK_GUARD_AUTH_PASSWORD`, with optional OPS basic/header envs.
   - Gate 4 sign-off needs real Engineering, Product, Operations, and RC owner
     names. The sign-off builder now prints missing required Gate 4 fields on
     the blocked path; owner contact is recommended for rollback authority
     handoff. The final V1 release gate now also fails fresh RC artifacts until
     the external-gates status shows Gate 4 `PASS`, the sign-off record reports
     `RC status: APPROVED`, and the checklist shows `G4=PASS`.
   - Final release gate must run without `--dry-run` and with
     `--expected-sha $(git rev-parse HEAD)` plus the deployed web base URL so
     build-info freshness is enforced inside the gate.
5. If the active queue is empty, run a planning-status sweep before saying
   nothing is planned.

## Continuation Command Handling

On "rob dalej", "rób dalej", "kontynuuj", "continue", or "next":

1. Read `.agents/core/operating-system.md`.
2. Read this file.
3. Cross-check canonical planning.
4. Pick one task.
5. Execute through `.agents/core/execution-loop.md`.
