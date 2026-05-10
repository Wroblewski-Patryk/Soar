# V1 Final Blocker Execution Pack (2026-05-07)

## Status
- Current result: **NO-GO**
- Production code/tooling freshness source of truth:
  verify the intended code/tooling candidate SHA with the build-info wait
  command in step 1 before collecting protected evidence. If local `HEAD`
  contains evidence-only documentation commits that are not deployed, do not
  use local `HEAD` as the protected evidence candidate until that SHA is
  actually exposed by production build-info.
- Latest verified Coolify deploy:
  production `/api/build-info` is the current deployment source of truth.
- Latest no-secret final preflight:
  `docs/operations/v1-final-preflight-fd8da90b-2026-05-10.md`
- Current operator unblock checklist:
  `docs/operations/v1-operator-unblock-checklist-2026-05-10.md`
- Note: docs/evidence commits may deploy after runtime code. Always read
  production build-info immediately before the protected evidence run. Use that
  SHA as `$expectedSha` unless an operator is intentionally promoting one exact
  runtime candidate. Build-info freshness is never a substitute for protected
  runtime proof.

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
  - latest Coolify context check confirms the production Postgres container
    name is `x11cfnz1dd9x0yzccftqzcoe`; this still must be executed from a
    shell or Docker context that can reach the VPS Docker daemon, not from a
    local workstation Docker daemon that does not contain the production
    container. Current 2026-05-10 restore evidence is PASS/FRESH at
    `docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`.
- Approver identity for RC sign-off:
  - Engineering name
  - Product name
  - Operations name
  - RC owner name and contact

## Execution Order

Set one release evidence date at the start of the operator run and reuse it
for all date-stamped artifacts below. This prevents local-time and UTC
midnight drift from producing stale evidence during a late release session.

```powershell
$releaseDate = Get-Date -Format yyyy-MM-dd
$buildInfo = Invoke-RestMethod "https://soar.luckysparrow.ch/api/build-info"
$expectedSha = $buildInfo.gitSha
$expectedSha
```

If an operator is promoting one exact intended runtime candidate, set
`$intendedSha` first and compare it with production build-info before
continuing:

```powershell
$intendedSha = "<full-intended-sha>"
if (-not $expectedSha.StartsWith($intendedSha)) {
  throw "Production build-info $expectedSha does not match intended $intendedSha"
}
```

### 0. Run Final V1 Preflight

Run the read-only preflight first. It checks deployed build-info for
`$expectedSha`, runs public API/Web smoke without worker checks, reports missing
prerequisite environment variable names, and classifies current release
evidence without creating protected production artifacts.

```powershell
pnpm run ops:release:v1:preflight -- --expected-sha $expectedSha --today $releaseDate
```

For a machine-readable, no-secret status report that can be consumed by later
Web/operator visualization, pass an explicit JSON output path. The JSON keeps
the raw blocker keys and also includes structured `blockerDetails` metadata
for category, severity, protected-input requirements, final-evidence
requirements, and remediation availability:

```powershell
pnpm run ops:release:v1:preflight -- --expected-sha $expectedSha --today $releaseDate --json-output "docs/operations/_artifacts-v1-final-preflight-$releaseDate.json"
```

For a human-readable no-secret operator report from the same preflight data,
also pass a Markdown output path:

```powershell
pnpm run ops:release:v1:preflight -- --expected-sha $expectedSha --today $releaseDate --json-output "docs/operations/_artifacts-v1-final-preflight-$releaseDate.json" --markdown-output "docs/operations/v1-final-preflight-$releaseDate.md"
```

Expected current result before protected operator access is available:
`BLOCKED` with missing `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, RC
approval, live-import readback, and rollback proof blockers, but build-info,
public API/Web smoke, and production DB restore context should pass or be
satisfied by fresh evidence. Do not treat preflight as final release evidence;
it is the safe readiness check before the commands below. The JSON report is
also not final release evidence; it is a no-secret status snapshot. Preflight
blocker output includes `next actions` that point to the approved commands
below; those hints do not replace the commands or acceptance criteria in this
pack. `blockerDetails` metadata is only display/status metadata and also does
not replace the commands or acceptance criteria in this pack. The Markdown
report is likewise operator-readable status only, not final release evidence.

### 1. Verify Production Build Info

If the pushed commit has not appeared in build-info yet, wait for the accepted
Coolify deployment path before running protected readback. To accelerate a
multi-application deploy, an operator may force deploy the relevant Coolify
resources from the dashboard. If deploy webhooks are configured, the equivalent
automation requires a Coolify deploy webhook URL and API token; those secrets
must stay outside repository artifacts.

```powershell
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 30
```

Expected result: `PASS`.

### 2. Capture LIVEIMPORT-03 Runtime Readback

```powershell
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$releaseDate.json"
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

Current 2026-05-10 result: PASS/FRESH at
`docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`.

For a future evidence date, rerun:

```powershell
pnpm run ops:db:restore-drill:prod -- --today $releaseDate
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

Current 2026-05-10 result: FAIL/CURRENT at
`docs/operations/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md` because
protected rollback guard auth is missing. For PASS evidence, rerun with
approved `ROLLBACK_GUARD_*` auth:

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch --today $releaseDate
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
pnpm run ops:rc:gates:status -- --today $releaseDate
```

If using explicit auth, pass the token or login options supported by the
script. Required result:
- Gate 1 `PASS`
- Gate 2 `PASS`
- Gate 3 `PASS`
- Gate 4 remains open until sign-off is rebuilt with approver names

### 6. Build Final RC Sign-Off

```powershell
pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<email-or-contact>" --today $releaseDate
pnpm run ops:rc:gates:status -- --today $releaseDate
pnpm run ops:rc:checklist:sync -- --today $releaseDate
```

Required result:
- `docs/operations/v1-rc-signoff-record.md` reports `RC status: APPROVED`
- `docs/operations/v1-rc-external-gates-status.md` reports Gate 4 `PASS` and
  `Gate 4 approved status found: yes`
- `docs/operations/v1-release-candidate-checklist.md` reflects current gate
  states with `G4=PASS`

### 7. Run Authenticated Production UI Audit

Current 2026-05-10 no-auth result: `BLOCKED_AUTH` at
`docs/operations/prod-ui-module-clickthrough-84e7c0e0-2026-05-10.md`.

For accepted protected UI evidence, provide dashboard/admin production auth via
`PROD_UI_AUDIT_*` environment variables and rerun:

```powershell
pnpm run ops:ui:prod-clickthrough -- --expected-sha $expectedSha --today $releaseDate --output-json "docs/operations/_artifacts-prod-ui-module-clickthrough-$releaseDate.json" --output-md "docs/operations/prod-ui-module-clickthrough-$releaseDate.md"
```

Required result:
- status `PASS`
- public/dashboard/admin/legacy route rows are not `FAIL`
- protected dashboard/admin module rows are not `BLOCKED_AUTH`
- no token, password, cookie, private header, or protected row payload is
  written to the artifact

If sign-off remains blocked, `ops:rc:signoff:build` prints the missing Gate 4
fields. Required fields are Engineering, Product, Operations, and RC owner
names. `--owner-contact` is strongly recommended for rollback authority
handoff, but does not replace the required RC owner name.

### 7. Run Final Production V1 Release Gate

```powershell
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --skip-local-quality --today $releaseDate
```

Required result:
- readiness `ready`
- no `--dry-run`
- deployed web build-info matches `$expectedSha`
- protected deploy smoke, runtime freshness, and rollback guard gates pass
- final report path is recorded in release state

## Current Known Blockers
- `LIVEIMPORT-03` authenticated runtime readback is missing.
- Current verified deployed candidate is
  whatever production `/api/build-info` returns at the start of the operator
  run. The latest committed no-secret final preflight artifact is
  `docs/operations/v1-final-preflight-fd8da90b-2026-05-10.md` and is correctly
  `BLOCKED` on protected auth/operator evidence. If a newer docs-only sync
  commit is deployed, use current build-info for deploy freshness but do not
  treat it as protected runtime evidence.
- The execution pack now uses a single `$releaseDate` and passes it to
  date-aware preflight, restore drill, rollback proof, RC status/sign-off,
  checklist sync, and final gate commands. Operators should not mix evidence
  dates within one final V1 run.
- Production restore drill is now current and PASS for 2026-05-08:
  `docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`.
  It was executed through approved Coolify terminal access against production
  Postgres container `x11cfnz1dd9x0yzccftqzcoe`; cleanup verification returned
  `0` matching temporary restore databases and no `/tmp/postgres_backup_*.dump`
  files.
- Production rollback proof is current for 2026-05-08 but failed because
  protected OPS routes returned `401` without auth.
- The latest 2026-05-10 preflight marks activation evidence as fresh,
  RC external gates/sign-off/checklist as fresh but failed, `LIVEIMPORT-03`
  as missing, and 2026-05-08 restore/rollback evidence as stale for the
  2026-05-10 evidence date.
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
