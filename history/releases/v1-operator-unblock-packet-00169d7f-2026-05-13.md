# V1 Operator Unblock Packet (00169d7f / 2026-05-13)

## Status
- Result: **NO-GO**
- Production Web build-info SHA: `00169d7fdc3aff8317759137b05594b20e773c8e`
- Current final preflight:
  `history/releases/v1-final-preflight-00169d7f-2026-05-13.md`
- Latest protected input readiness:
  `history/evidence/v1-protected-input-readiness-00169d7f-2026-05-13.md`
- Latest production UI audit:
  `history/plans/prod-ui-module-clickthrough-00169d7f-2026-05-13.md`
- Public build-info and public API/Web smoke: `PASS`
- Current production UI clickthrough: `BLOCKED_AUTH`
- Activation audit and plan: fresh `NO-GO` for 2026-05-13
- RC external gates, sign-off, and checklist: fresh but failed/blocked for
  2026-05-13
- V1 generated state: `NO-GO`

## Current Blockers
- Missing `LIVEIMPORT_READBACK_*` auth for protected LIVEIMPORT-03 production
  runtime readback.
- Missing `ROLLBACK_GUARD_*` auth for protected rollback/runtime freshness
  proof.
- Missing `PROD_UI_AUDIT_*` dashboard auth and
  `PROD_UI_AUDIT_ADMIN_*` admin auth for production-safe UI clickthrough.
- Missing production DB restore context for current-day restore evidence.
- Missing `LIVEIMPORT-03` runtime readback artifact.
- Production UI clickthrough is fresh for 2026-05-13 but `BLOCKED_AUTH`; it is
  not accepted V1 evidence.
- RC artifacts are fresh for 2026-05-13 but failed/blocked because Gate 4
  approver fields are missing.
- Backup/restore and rollback artifacts are stale for 2026-05-13 and must be
  refreshed after protected/operator inputs are available.
- Activation audit and plan are fresh `NO-GO` artifacts for 2026-05-13; they
  do not approve V1.
- Final production release gate must return `ready`; the latest non-dry-run
  attempt stopped `not_ready` on protected `/workers/health` `401`.

## Required Protected Inputs
- `LIVEIMPORT_READBACK_AUTH_TOKEN`, or
  `LIVEIMPORT_READBACK_AUTH_EMAIL` plus `LIVEIMPORT_READBACK_AUTH_PASSWORD`
- `ROLLBACK_GUARD_AUTH_TOKEN`, or
  `ROLLBACK_GUARD_AUTH_EMAIL` plus `ROLLBACK_GUARD_AUTH_PASSWORD`
- `PROD_UI_AUDIT_AUTH_TOKEN`, or
  `PROD_UI_AUDIT_AUTH_EMAIL` plus `PROD_UI_AUDIT_AUTH_PASSWORD`
- `PROD_UI_AUDIT_ADMIN_TOKEN`, or
  `PROD_UI_AUDIT_ADMIN_EMAIL` plus `PROD_UI_AUDIT_ADMIN_PASSWORD`
- `PROD_DB_CHECK_CONTAINER` plus `PROD_DB_CHECK_USER` plus
  `PROD_DB_CHECK_NAME`, or the `PRODUCTION_DB_CHECK_*` equivalents
- Optional UI audit route override:
  - `PROD_UI_AUDIT_EXTRA_ROUTES` for approved non-destructive dashboard,
    bot runtime, or admin routes that must be included in the clickthrough
- Optional private OPS layer, if enabled:
  - `LIVEIMPORT_READBACK_OPS_BASIC_USER` plus
    `LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD`, or
    `LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME` plus
    `LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE`
  - `ROLLBACK_GUARD_OPS_BASIC_USER` plus
    `ROLLBACK_GUARD_OPS_BASIC_PASSWORD`, or
    `ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME` plus
    `ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE`
- Gate 4 approver fields:
  - Engineering name
  - Product name
  - Operations name
  - RC owner name
  - RC owner contact

## Execution Order

```powershell
$releaseDate = Get-Date -Format yyyy-MM-dd
$buildInfo = Invoke-RestMethod "https://soar.luckysparrow.ch/api/build-info"
$expectedSha = $buildInfo.gitSha
$expectedShaShort = $expectedSha.Substring(0, 8)
$expectedSha
```

### 1. Confirm Preflight

```powershell
pnpm run ops:release:v1:preflight -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --today $releaseDate --json-output "docs/operations/_artifacts-v1-final-preflight-$expectedShaShort-$releaseDate.json" --markdown-output "docs/operations/v1-final-preflight-$expectedShaShort-$releaseDate.md"
```

Expected before protected inputs are set: `BLOCKED`. Do not treat this as
release approval.

### 2. Refresh Production DB Restore Evidence

Run the existing production restore drill only after approved production DB
context is available. Required result: fresh current-day `PASS` with cleanup
evidence and no leftover restore database or dump.

### 3. Collect LIVEIMPORT-03

```powershell
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$expectedShaShort-$releaseDate.json"
```

Required result: protected production runtime positions payload is collected in
redacted form for the expected symbols. Do not accept public health,
build-info, no-session output, or local tests as `LIVEIMPORT-03`.

### 4. Run Rollback Proof To PASS

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch --today $releaseDate
```

Required result: fresh rollback proof with `Status: **PASS**`,
`shouldRollback=false`, runtime freshness `PASS`, no critical reasons, and
alerts clear.

### 5. Refresh Activation Audit And Plan

Refresh the production activation evidence audit and activation execution plan
for the current release date. Required result: current-day artifacts that
truthfully report whether the release is `GO` or `NO-GO`.

### 6. Refresh RC Gates And Sign-Off

```powershell
pnpm run ops:rc:gates:prod-pipeline -- --base-url https://api.soar.luckysparrow.ch --duration-minutes 30 --interval-seconds 30
pnpm run ops:rc:gates:status -- --today $releaseDate
pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<email-or-contact>" --today $releaseDate
pnpm run ops:rc:gates:status -- --today $releaseDate
pnpm run ops:rc:checklist:sync -- --today $releaseDate
```

Required result:
- RC external gates show all gates `PASS`
- RC sign-off record reports `RC status: APPROVED`
- release-candidate checklist shows the current gate snapshot with `G4=PASS`

### 7. Run Production UI Clickthrough To PASS

```powershell
pnpm run ops:ui:prod-clickthrough -- --expected-sha $expectedSha --today $releaseDate --output-json "docs/operations/_artifacts-prod-ui-module-clickthrough-$expectedShaShort-$releaseDate.json" --output-md "docs/operations/prod-ui-module-clickthrough-$expectedShaShort-$releaseDate.md"
```

Required result: status `PASS` for the deployed build-info SHA, including
authenticated production-safe coverage for `/dashboard/bots` and
`/dashboard/bots/create`. The runner is non-destructive and must not persist
tokens, cookies, private headers, screenshots, or protected payloads. Public
route reachability or unauthenticated redirects do not satisfy this step.

### 8. Rerun Final Release Gate

```powershell
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --today $releaseDate
```

Required result: readiness `ready`. If the command returns `not_ready`, keep V1
at `NO-GO` and fix the listed blocker instead of overriding the gate.

### 9. Refresh Generated V1 State

Run these sequentially after final release evidence changes:

```powershell
pnpm run ops:project:index -- --today $releaseDate
pnpm run ops:project:scan -- --today $releaseDate
pnpm run ops:project:ledger -- --today $releaseDate
pnpm run ops:project:scorecard -- --today $releaseDate
```

Required result: generated state must agree with the final release gate result.

## Stop Conditions
- Any protected route returns `401` or `403`.
- The production UI clickthrough returns `BLOCKED_AUTH`, `FAIL`, or a
  build-info mismatch.
- `LIVEIMPORT-03` has no running session or no protected runtime positions
  payload.
- Rollback proof reports `FAIL` or `shouldRollback=true`.
- RC sign-off remains `BLOCKED`.
- Production DB restore drill cannot prove cleanup.
- Final release gate runs in `--dry-run` mode or returns `not_ready`.

## Acceptance Rule
V1 is achieved only when the final release gate returns `ready` and all
referenced protected artifacts are present, fresh for the same evidence date,
and free of secret values. The required artifact set includes production-safe
Bots/UI clickthrough evidence from `ops:ui:prod-clickthrough`; local browser
proof, public route reachability, or unauthenticated redirect evidence is not
enough for V1.
