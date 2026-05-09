# V1 Protected Access Readiness - 2026-05-09

## Status
- Result: **BLOCKED**
- Environment: local operator shell
- Evidence date: 2026-05-09
- Deployed code/tooling candidate:
  `30b027b78544f76b5b638851e8e27c98f6d22ab5`

## Purpose
This readiness check confirms whether the current shell has the protected
application auth and production DB/Coolify context required to finish the final
V1 evidence pack.

## Names-Only Check

Command shape:

```powershell
$names = @(
  'LIVEIMPORT_READBACK_AUTH_TOKEN',
  'LIVEIMPORT_READBACK_AUTH_EMAIL',
  'LIVEIMPORT_READBACK_AUTH_PASSWORD',
  'ROLLBACK_GUARD_AUTH_TOKEN',
  'ROLLBACK_GUARD_AUTH_EMAIL',
  'ROLLBACK_GUARD_AUTH_PASSWORD',
  'PROD_DB_CHECK_CONTAINER',
  'PROD_DB_CHECK_USER',
  'PROD_DB_CHECK_NAME',
  'PRODUCTION_DB_CHECK_CONTAINER',
  'PRODUCTION_DB_CHECK_USER',
  'PRODUCTION_DB_CHECK_NAME'
)
foreach ($name in $names) {
  $value = [Environment]::GetEnvironmentVariable($name)
  if ([string]::IsNullOrWhiteSpace($value)) { "$name=MISSING" } else { "$name=PRESENT" }
}
```

Result:

```text
LIVEIMPORT_READBACK_AUTH_TOKEN=MISSING
LIVEIMPORT_READBACK_AUTH_EMAIL=MISSING
LIVEIMPORT_READBACK_AUTH_PASSWORD=MISSING
ROLLBACK_GUARD_AUTH_TOKEN=MISSING
ROLLBACK_GUARD_AUTH_EMAIL=MISSING
ROLLBACK_GUARD_AUTH_PASSWORD=MISSING
PROD_DB_CHECK_CONTAINER=MISSING
PROD_DB_CHECK_USER=MISSING
PROD_DB_CHECK_NAME=MISSING
PRODUCTION_DB_CHECK_CONTAINER=MISSING
PRODUCTION_DB_CHECK_USER=MISSING
PRODUCTION_DB_CHECK_NAME=MISSING
```

## Impact
The current shell cannot honestly execute:
- `LIVEIMPORT-03` authenticated runtime readback
- production rollback proof
- production DB restore drill for the active evidence date
- final non-dry-run V1 release gate
- authenticated/admin production UI clickthrough

2026-05-09 refresh: production build-info and no-secret public checks are
current for `30b027b78544f76b5b638851e8e27c98f6d22ab5`. This refresh does not
change the protected access result; the required auth/context names are still
missing in this shell.

## Required Inputs

Provide one live-import auth option:
- `LIVEIMPORT_READBACK_AUTH_TOKEN`
- or `LIVEIMPORT_READBACK_AUTH_EMAIL` plus `LIVEIMPORT_READBACK_AUTH_PASSWORD`

Provide one rollback auth option:
- `ROLLBACK_GUARD_AUTH_TOKEN`
- or `ROLLBACK_GUARD_AUTH_EMAIL` plus `ROLLBACK_GUARD_AUTH_PASSWORD`

Provide production DB/Coolify restore context:
- `PROD_DB_CHECK_CONTAINER`
- `PROD_DB_CHECK_USER`
- `PROD_DB_CHECK_NAME`

Equivalent `PRODUCTION_DB_CHECK_*` names are also accepted by the tooling.

Provide RC approval identities:
- Engineering name
- Product name
- Operations name
- RC owner name
- RC owner contact

Provide production application access for UI audit:
- authenticated user access
- admin access if admin routes are in V1 audit scope

## Safety Note
No secret values were printed or written. This artifact records only whether
expected variable names were present in the current shell.
