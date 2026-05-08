# V1 Final Blocker Execution Pack (2026-05-07)

## Status
- Current result: **NO-GO**
- Production code/tooling freshness source of truth:
  run `git rev-parse HEAD`, then verify that SHA with the build-info wait
  command in step 1 before collecting protected evidence.
- Last verified RC approval gate hardening deploy:
  `1100b7fb232ce6195b24522a6a11559fe9fb8634`
- Latest release-gate dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-08Trc-approval-required-dry-run.md`

## Purpose
This pack lists the exact remaining commands needed to turn the current
`NO-GO` state into final V1 evidence. It must be executed only by an operator
with approved production auth and database/Coolify access.

## Required Access
- Application read-only/operator auth for protected dashboard and OPS routes:
  - `LIVEIMPORT_READBACK_AUTH_TOKEN` or
    `LIVEIMPORT_READBACK_AUTH_EMAIL` + `LIVEIMPORT_READBACK_AUTH_PASSWORD`
  - `ROLLBACK_GUARD_AUTH_TOKEN` or
    `ROLLBACK_GUARD_AUTH_EMAIL` + `ROLLBACK_GUARD_AUTH_PASSWORD`
  - optional private OPS layer:
    `*_OPS_BASIC_USER`, `*_OPS_BASIC_PASSWORD`, or
    `*_OPS_AUTH_HEADER_NAME`, `*_OPS_AUTH_HEADER_VALUE`
- Production database/Coolify access for restore drill:
  - `PROD_DB_CHECK_CONTAINER`
  - `PROD_DB_CHECK_USER`
  - `PROD_DB_CHECK_NAME`
- Approver identity for RC sign-off:
  - Engineering name
  - Product name
  - Operations name
  - RC owner name and contact

## Execution Order

### 0. Run Final V1 Preflight

Run the read-only preflight first. It checks deployed build-info for current
`HEAD`, reports missing prerequisite environment variable names, and classifies
current release evidence without creating protected production artifacts.

```powershell
pnpm run ops:release:v1:preflight
```

For a machine-readable, no-secret status report that can be consumed by later
Web/operator visualization, pass an explicit JSON output path:

```powershell
pnpm run ops:release:v1:preflight -- --json-output docs/operations/_artifacts-v1-final-preflight-2026-05-08.json
```

Expected current result before protected operator access is available:
`BLOCKED` with missing `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, production
DB restore context, RC approval, live-import readback, restore, and rollback
evidence blockers. Do not treat preflight as final release evidence; it is the
safe readiness check before the commands below. The JSON report is also not
final release evidence; it is a no-secret status snapshot.

### 1. Verify Production Build Info

If the pushed commit has not appeared in build-info yet, wait for the accepted
Coolify deployment path before running protected readback. To accelerate a
multi-application deploy, an operator may force deploy the relevant Coolify
resources from the dashboard. If deploy webhooks are configured, the equivalent
automation requires a Coolify deploy webhook URL and API token; those secrets
must stay outside repository artifacts.

```powershell
$expectedSha = git rev-parse HEAD
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 30
```

Expected result: `PASS`.

### 2. Capture LIVEIMPORT-03 Runtime Readback

```powershell
$expectedSha = git rev-parse HEAD
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output docs/operations/liveimport-03-prod-readback-2026-05-08.json
```

Required result:
- actual protected runtime positions payloads are read
- requested symbols are visible
- ownership, strategy provenance, TTP/DCA context, and actionable state are
  present in redacted form
- no token/password or raw protected secret data is written

Do not accept:
- public health/build-info as substitute evidence
- no-session output
- local tests as production readback proof

If the command fails before protected readback with missing auth, provide
either `LIVEIMPORT_READBACK_AUTH_TOKEN`, or
`LIVEIMPORT_READBACK_AUTH_EMAIL` plus `LIVEIMPORT_READBACK_AUTH_PASSWORD`.
If the production OPS route is additionally protected, also provide
`LIVEIMPORT_READBACK_OPS_BASIC_USER` plus
`LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD`, or
`LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME` plus
`LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE`. The collector must not create the
readback artifact until a protected runtime positions payload is actually
collected.

### 3. Run Production Restore Drill

```powershell
pnpm run ops:db:restore-drill:prod
```

Required result:
- fresh `docs/operations/v1-restore-drill-prod-<timestamp>.md`
- status `PASS`
- temporary restore target is isolated and cleaned up

If production restore drill fails before verification because the target
container is missing, provide `PROD_DB_CHECK_CONTAINER` or
`PRODUCTION_DB_CHECK_CONTAINER`. Also verify `PROD_DB_CHECK_USER` or
`PRODUCTION_DB_CHECK_USER`, and `PROD_DB_CHECK_NAME` or
`PRODUCTION_DB_CHECK_NAME`. Do not mark restore evidence `PASS` until the
generated restore drill artifact itself reports `Status: **PASS**`.

### 4. Run Production Rollback Proof

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch
```

Required result:
- fresh `docs/operations/v1-rollback-proof-prod-<timestamp>.md`
- status `PASS`
- `shouldRollback=false`
- no critical reasons
- runtime freshness `PASS`
- alerts clear

If rollback proof fails on protected endpoint auth, provide
`ROLLBACK_GUARD_AUTH_TOKEN`, or `ROLLBACK_GUARD_AUTH_EMAIL` plus
`ROLLBACK_GUARD_AUTH_PASSWORD`. If a private OPS layer is enabled, also provide
`ROLLBACK_GUARD_OPS_BASIC_USER` plus `ROLLBACK_GUARD_OPS_BASIC_PASSWORD`, or
`ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME` plus
`ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE`. Do not accept public `401`/`403`
responses as rollback-proof PASS evidence.

### 5. Refresh RC Gates From Production Evidence

```powershell
pnpm run ops:rc:gates:prod-pipeline -- --base-url https://api.soar.luckysparrow.ch --duration-minutes 30 --interval-seconds 30
```

If using explicit auth, pass the token or login options supported by the
script. Required result:
- Gate 1 `PASS`
- Gate 2 `PASS`
- Gate 3 `PASS`
- Gate 4 remains open until sign-off is rebuilt with approver names

### 6. Build Final RC Sign-Off

```powershell
pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<email-or-contact>"
pnpm run ops:rc:gates:status
pnpm run ops:rc:checklist:sync
```

Required result:
- `docs/operations/v1-rc-signoff-record.md` reports `RC status: APPROVED`
- `docs/operations/v1-rc-external-gates-status.md` reports Gate 4 `PASS` and
  `Gate 4 approved status found: yes`
- `docs/operations/v1-release-candidate-checklist.md` reflects current gate
  states with `G4=PASS`

If sign-off remains blocked, `ops:rc:signoff:build` prints the missing Gate 4
fields. Required fields are Engineering, Product, Operations, and RC owner
names. `--owner-contact` is strongly recommended for rollback authority
handoff, but does not replace the required RC owner name.

### 7. Run Final Production V1 Release Gate

```powershell
$expectedSha = git rev-parse HEAD
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --skip-local-quality
```

Required result:
- readiness `ready`
- no `--dry-run`
- deployed web build-info matches `$expectedSha`
- protected deploy smoke, runtime freshness, and rollback guard gates pass
- final report path is recorded in release state

## Current Known Blockers
- `LIVEIMPORT-03` authenticated runtime readback is missing.
- Production restore drill is current for 2026-05-08 but failed because
  DB/Coolify access is unavailable in this shell (`PROD_DB_CHECK_CONTAINER` or
  equivalent is missing).
- Production rollback proof is current for 2026-05-08 but failed because
  protected OPS routes returned `401` without auth.
- The latest 2026-05-08 dry-run marks activation, RC external gates, RC
  sign-off, and RC checklist as fresh; `LIVEIMPORT-03` is missing;
  backup/restore and rollback are fresh but failed.
- A no-auth 2026-05-08 runtime freshness probe failed closed with HTTP `401`;
  rollback guard returned `shouldRollback=true` only because runtime freshness
  and alerts endpoints were protected by `401`.
- RC Gate 4 is open until real approver identities are provided.
- Strict RC evidence check currently reports only Gate 4 sign-off blockers:
  missing Engineering name, Product name, Operations name, RC owner name, and
  final status still `BLOCKED` instead of `APPROVED`.
- Final V1 release gate has only been run in dry-run mode after the blocker
  refresh. The latest dry-run includes the web build-info freshness gate, so
  final non-dry-run approval must prove the currently checked-out `HEAD` is
  deployed before protected runtime and rollback checks run.

## Completion Rule
V1 can be marked ready only after every required artifact above is fresh and
the final non-dry-run production release gate reports `ready`.
