# V1 Operator Unblock Packet (00169d7f / 2026-05-12)

## Status
- Result: **NO-GO**
- Production Web build-info SHA: `00169d7fdc3aff8317759137b05594b20e773c8e`
- Current final preflight:
  `docs/operations/v1-final-preflight-00169d7f-2026-05-12.md`
- Public build-info and public API/Web smoke: `PASS`
- Production DB restore context: satisfied by fresh restore drill evidence
- Remaining blockers:
  - missing `LIVEIMPORT_READBACK_*` auth
  - missing `ROLLBACK_GUARD_*` auth
  - missing `LIVEIMPORT-03` runtime readback
  - rollback proof is fresh but `FAIL`
  - RC Gate 4/sign-off/checklist are fresh but `failed`
  - final production release gate has not run without dry-run

## Required Protected Inputs
- `LIVEIMPORT_READBACK_AUTH_TOKEN`, or
  `LIVEIMPORT_READBACK_AUTH_EMAIL` plus `LIVEIMPORT_READBACK_AUTH_PASSWORD`
- `ROLLBACK_GUARD_AUTH_TOKEN`, or
  `ROLLBACK_GUARD_AUTH_EMAIL` plus `ROLLBACK_GUARD_AUTH_PASSWORD`
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

### 2. Collect LIVEIMPORT-03

```powershell
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$expectedShaShort-$releaseDate.json"
```

Required result: protected production runtime positions payload is collected in
redacted form for the expected symbols. Do not accept public health,
build-info, no-session output, or local tests as `LIVEIMPORT-03`.

### 3. Run Rollback Proof To PASS

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch --today $releaseDate
```

Required result: fresh rollback proof with `Status: **PASS**`,
`shouldRollback=false`, runtime freshness `PASS`, no critical reasons, and
alerts clear.

### 4. Refresh RC Gates And Sign-Off

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

### 5. Run Final Release Gate

```powershell
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --today $releaseDate
```

Required result: readiness `ready`. If the command returns `not_ready`, keep
V1 at `NO-GO` and fix the listed blocker instead of overriding the gate.

## Stop Conditions
- Any protected route returns `401` or `403`.
- `LIVEIMPORT-03` has no running session or no protected runtime positions
  payload.
- Rollback proof reports `FAIL` or `shouldRollback=true`.
- RC sign-off remains `BLOCKED`.
- Final release gate runs in `--dry-run` mode or returns `not_ready`.

## Acceptance Rule
V1 is achieved only when the final release gate returns `ready` and all
referenced protected artifacts are present, fresh for the same evidence date,
and free of secret values.
