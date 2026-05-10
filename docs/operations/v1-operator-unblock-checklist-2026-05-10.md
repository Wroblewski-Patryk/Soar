# V1 Operator Unblock Checklist (2026-05-10)

## Status

- Current deployed SHA:
  `8df3260b8453be0a39dfa75ce2be281d6571c4de`
- Latest no-secret preflight:
  `docs/operations/v1-final-preflight-8df3260b-2026-05-10.md`
- Current result: **BLOCKED / NO-GO**
- Public build-info and public API/Web smoke: **PASS**
- Production restore drill: **PASS / FRESH** for 2026-05-10 at
  `docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`
- Rollback proof: **FAIL / FRESH** for 2026-05-10 at
  `docs/operations/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md`
  until approved `ROLLBACK_GUARD_*` auth is provided.

## Exact Inputs Required

Provide these only in the operator shell or secret manager. Do not commit
values to the repository.

### LIVEIMPORT-03 Readback

Required one of:

- `LIVEIMPORT_READBACK_AUTH_TOKEN`
- `LIVEIMPORT_READBACK_AUTH_EMAIL` and `LIVEIMPORT_READBACK_AUTH_PASSWORD`

Optional if the production OPS route has an extra private layer:

- `LIVEIMPORT_READBACK_OPS_BASIC_USER` and
  `LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD`
- or `LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME` and
  `LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE`

### Rollback Proof

Required one of:

- `ROLLBACK_GUARD_AUTH_TOKEN`
- `ROLLBACK_GUARD_AUTH_EMAIL` and `ROLLBACK_GUARD_AUTH_PASSWORD`

Optional if the production OPS route has an extra private layer:

- `ROLLBACK_GUARD_OPS_BASIC_USER` and
  `ROLLBACK_GUARD_OPS_BASIC_PASSWORD`
- or `ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME` and
  `ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE`

### Production Restore Drill

Current 2026-05-10 evidence is complete. Required again only if a future
release date needs a fresh proof:

- `PROD_DB_CHECK_CONTAINER`
- `PROD_DB_CHECK_USER`
- `PROD_DB_CHECK_NAME`

Accepted aliases:

- `PRODUCTION_DB_CHECK_CONTAINER`
- `PRODUCTION_DB_CHECK_USER`
- `PRODUCTION_DB_CHECK_NAME`

Known historical production Postgres container candidate:
`x11cfnz1dd9x0yzccftqzcoe`.

### RC Sign-Off

Required:

- Engineering approver name
- Product approver name
- Operations approver name
- RC owner name
- RC owner contact

## Execution Order

Set the target once:

```powershell
$releaseDate = "2026-05-10"
$expectedSha = "8df3260b8453be0a39dfa75ce2be281d6571c4de"
```

### 1. Confirm Deploy Freshness

```powershell
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 30
```

Required result: `PASS`.

### 2. Capture LIVEIMPORT-03

```powershell
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$releaseDate.json"
```

Required result: a redacted production readback artifact exists and contains no
secret values.

### 3. Run Production Restore Drill

Current 2026-05-10 result: **PASS** at
`docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`.

For a future evidence date, rerun:

```powershell
pnpm run ops:db:restore-drill:prod -- --today $releaseDate
```

Required result: fresh production restore drill artifact reports
`Status: **PASS**`.

### 4. Run Production Rollback Proof

Current 2026-05-10 result: **FAIL** because protected rollback guard auth is
missing. For PASS evidence, rerun with approved `ROLLBACK_GUARD_*` auth:

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch --today $releaseDate
```

Required result: fresh rollback proof artifact reports `Status: **PASS**`,
`shouldRollback=false`, runtime freshness `PASS`, and no critical alerts.

### 5. Refresh RC Gates And Sign-Off

```powershell
pnpm run ops:rc:gates:status -- --today $releaseDate
pnpm run ops:rc:signoff:build -- --today $releaseDate --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<contact>"
pnpm run ops:rc:gates:status -- --today $releaseDate
pnpm run ops:rc:checklist:sync -- --today $releaseDate
```

Required result:

- RC external gates status shows all required gates `PASS`.
- RC sign-off record reports `RC status: APPROVED`.
- RC checklist latest verification shows all required release gates complete.

### 6. Run Final Preflight

```powershell
pnpm run ops:release:v1:preflight -- --expected-sha $expectedSha --today $releaseDate --json-output "docs/operations/_artifacts-v1-final-preflight-$releaseDate.json" --markdown-output "docs/operations/v1-final-preflight-$releaseDate.md"
```

Required result: no blocking prerequisites or evidence blockers remain.

### 7. Run Non-Dry-Run Release Gate

```powershell
pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --skip-local-quality
```

Required result: final production release gate reports `ready`.

## Do Not Accept

- Public health/build-info as a substitute for protected `LIVEIMPORT-03`.
- No-session or `401`/`403` output as protected evidence.
- Stale 2026-05-08 restore or rollback artifacts for the 2026-05-10 release
  date.
- Empty approver names.
- Any committed token, password, private header value, or raw protected
  payload.
