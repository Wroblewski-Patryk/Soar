# V1 Operator Unblock Packet (dd1a1faf / 2026-05-19)

## Status

- Result: **NO-GO**
- Production Web build-info SHA:
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`
- Production git ref: `main`
- Build-info readback time: `2026-05-19T04:06:12.580Z`
- Current no-secret final preflight:
  `docs/operations/v1-final-preflight-dd1a1faf-2026-05-19-noauth.md`
- Current dated RC blocked packet:
  `docs/operations/v1-rc-external-gates-status-dd1a1faf-2026-05-19-blocked.md`
- Public build-info and public API/Web smoke: `PASS`
- Current RC state: Gate 1 `PASS`, Gate 2 `OPEN`, Gate 3 `PASS`, Gate 4
  `OPEN`
- Final release readiness: blocked until protected production inputs and real
  approval evidence exist

## Current Blockers

- Missing `LIVEIMPORT_READBACK_*` auth for protected `LIVEIMPORT-03`
  production runtime readback.
- Missing `ROLLBACK_GUARD_*` auth for rollback/runtime freshness proof.
- Missing `PROD_UI_AUDIT_*` dashboard auth and `PROD_UI_AUDIT_ADMIN_*` admin
  auth for production-safe UI clickthrough.
- Missing production DB/Coolify restore context for current-day production
  restore evidence.
- Missing fresh `LIVEIMPORT-03` readback for the deployed `dd1a1faf` target.
- Missing fresh production UI clickthrough for the deployed `dd1a1faf` target.
- Missing current production restore drill evidence for 2026-05-19.
- Missing current rollback proof PASS evidence for 2026-05-19.
- Gate 2 remains `OPEN` until fresh production SLO/queue-lag evidence is
  collected and reviewed.
- Gate 4 remains `OPEN` until Engineering, Product, Operations, and RC owner
  identities are recorded and the sign-off reports `APPROVED`.
- The final release gate must be rerun without dry-run and must return
  `ready`.

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
- Optional private OPS layer, if enabled:
  - `LIVEIMPORT_READBACK_OPS_BASIC_USER` plus
    `LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD`, or
    `LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME` plus
    `LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE`
  - `ROLLBACK_GUARD_OPS_BASIC_USER` plus
    `ROLLBACK_GUARD_OPS_BASIC_PASSWORD`, or
    `ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME` plus
    `ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE`
- Gate 4 fields:
  - Engineering name
  - Product name
  - Operations name
  - RC owner name
  - RC owner contact

## Execution Order

Set one evidence date at the start of the operator run and derive the runtime
target from production build-info:

```powershell
$releaseDate = Get-Date -Format yyyy-MM-dd
$buildInfo = Invoke-RestMethod "https://soar.luckysparrow.ch/api/build-info"
$expectedSha = $buildInfo.gitSha
$expectedShaShort = $expectedSha.Substring(0, 8)
$expectedSha
```

If the operator intends to prove one exact runtime candidate, compare that
candidate with production build-info before collecting protected evidence:

```powershell
$intendedSha = "dd1a1faf79f8ac3581ca0a8c983481a3e30327ac"
if ($expectedSha -ne $intendedSha) {
  throw "Production build-info $expectedSha does not match intended $intendedSha"
}
```

### 1. Confirm No-Secret Preflight

```powershell
pnpm run ops:release:v1:preflight -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --today $releaseDate --json-output "docs/operations/_artifacts-v1-final-preflight-$expectedShaShort-$releaseDate.json" --markdown-output "docs/operations/v1-final-preflight-$expectedShaShort-$releaseDate.md"
```

Expected before protected inputs are set: `BLOCKED`. This step is a no-secret
classifier, not release approval.

### 2. Wait For Build-Info If Needed

```powershell
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 30
```

Required result: `PASS`.

### 3. Refresh Production DB Restore Evidence

```powershell
pnpm run ops:db:restore-drill:prod -- --today $releaseDate
```

Required result: a fresh current-day restore drill artifact with `Status:
**PASS**`, isolated restore target, and cleanup proof. Do not accept local DB
restore output as production restore evidence.

### 4. Collect LIVEIMPORT-03

```powershell
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$expectedShaShort-$releaseDate.json"
```

Required result: protected runtime positions payloads are collected in redacted
form for the requested symbols, including ownership, strategy provenance,
TTP/DCA context, and actionable state. Do not accept public health,
build-info, no-session output, or local tests as `LIVEIMPORT-03`.

### 5. Run Rollback Proof To PASS

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch --today $releaseDate
```

Required result: fresh rollback proof with `Status: **PASS**`,
`shouldRollback=false`, runtime freshness `PASS`, no critical reasons, and
alerts clear.

### 6. Run Gate 2 Production SLO Evidence

```powershell
pnpm run ops:rc:gates:prod-pipeline -- --base-url https://api.soar.luckysparrow.ch --duration-minutes 30 --interval-seconds 30
pnpm run ops:rc:gates:status -- --today $releaseDate
```

Required result: Gate 2 reports `PASS` from fresh production SLO/queue-lag
evidence. If the collector requires auth, provide the supported production
admin token or login options outside repository artifacts.

### 7. Build Final RC Sign-Off

```powershell
pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<email-or-contact>" --today $releaseDate
pnpm run ops:rc:gates:status -- --today $releaseDate
pnpm run ops:rc:checklist:sync -- --today $releaseDate
pnpm run ops:rc:gates:evidence:check -- --strict --require-production-gate2
```

Required result:

- RC external gates show all gates `PASS`.
- RC sign-off record reports `RC status: APPROVED`.
- Release-candidate checklist shows `G4=PASS`.
- Strict RC evidence check exits `0`.

### 8. Run Production UI Clickthrough To PASS

```powershell
pnpm run ops:ui:prod-clickthrough -- --expected-sha $expectedSha --today $releaseDate --output-json "docs/operations/_artifacts-prod-ui-module-clickthrough-$expectedShaShort-$releaseDate.json" --output-md "docs/operations/prod-ui-module-clickthrough-$expectedShaShort-$releaseDate.md"
```

Required result: status `PASS` for public, dashboard, and admin route coverage
without storing tokens, cookies, private headers, screenshots, or protected
payloads.

### 9. Rerun Final Release Gate

```powershell
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --today $releaseDate
```

Required result: readiness `ready`. If the command returns `not_ready`, keep
V1 at `NO-GO` and fix the listed blocker instead of overriding the gate.

### 10. Refresh Generated V1 State

```powershell
pnpm run ops:project:index -- --today $releaseDate
pnpm run ops:project:scan -- --today $releaseDate
pnpm run ops:project:ledger -- --today $releaseDate
pnpm run ops:project:scorecard -- --today $releaseDate
```

Required result: generated state agrees with the final release gate result.

## Stop Conditions

- Any protected route returns `401` or `403`.
- Production build-info does not match the intended runtime candidate.
- The UI clickthrough returns `BLOCKED_AUTH`, `FAIL`, or build-info mismatch.
- `LIVEIMPORT-03` has no protected runtime positions payload.
- Rollback proof reports `FAIL` or `shouldRollback=true`.
- Gate 2 remains `OPEN` or strict RC evidence check fails.
- RC sign-off remains `BLOCKED`.
- Production DB restore drill cannot prove cleanup.
- Final release gate returns `not_ready` or is run in dry-run mode.

## Acceptance Rule

V1 production readiness for the `dd1a1faf` target is accepted only when the
final release gate returns `ready` and every referenced protected artifact is
fresh for the same evidence date, redacted, and free of secret values. Public
smoke, build-info freshness, local tests, or unauthenticated redirects are not
enough.
