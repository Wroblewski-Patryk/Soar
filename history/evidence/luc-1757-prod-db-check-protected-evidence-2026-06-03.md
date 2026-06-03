# LUC-1757 PROD_DB_CHECK Protected Evidence

Issue: `LUC-1757 [Soar][ARB-006][Data] Produce PROD_DB_CHECK protected evidence`
Date: 2026-06-03
Checked UTC: `2026-06-03T13:13:16.3230993Z`
Target SHA: `d182a9e1d6c9fe129f4567cacb0bfd35fb3c3458`
Owner lane: Data Persistence Engineer
Stage: verification
Reality status: blocked

## Scope

This heartbeat attempted the smallest redaction-safe production DB restore-readiness proof for the ARB-006 data lane.

Included:
- names-only protected input presence check for `PROD_DB_CHECK_*` and `PRODUCTION_DB_CHECK_*`;
- native production backup verification profile contract check;
- redaction-safe result packet.

Explicitly excluded:
- schema changes;
- migrations;
- data writes;
- restore execution;
- credential, token, cookie, or secret value disclosure;
- deploy, restart, rollback, Coolify mutation, or live trading action.

## Data Source And Account Class

Data source class: production DB restore-check profile expected by repository runbooks.

Expected protected input families:
- `PROD_DB_CHECK_CONTAINER`, `PROD_DB_CHECK_USER`, `PROD_DB_CHECK_NAME`
- `PRODUCTION_DB_CHECK_CONTAINER`, `PRODUCTION_DB_CHECK_USER`, `PRODUCTION_DB_CHECK_NAME`

Account/credential class: protected production DB/Coolify runner context. No secret values were read back or written into artifacts.

## Protected Input Readback

Names-only readback result:

| Family | Container | User | Database |
| --- | --- | --- | --- |
| `PROD_DB_CHECK_*` | missing | missing | missing |
| `PRODUCTION_DB_CHECK_*` | missing | missing | missing |

Redaction handling:
- Only variable names and presence/missing status were recorded.
- No values were printed or persisted.
- No database connection was attempted because required production profile inputs were absent.

## Command Evidence

Command:

```powershell
pnpm run ops:db:backup-verify:prod
```

Result: `FAIL`, fail-closed before DB access.

Relevant output:

```text
[ops:db:backup-verify] failed: Missing container for profile "prod". Set --container or one of: PROD_DB_CHECK_CONTAINER, PRODUCTION_DB_CHECK_CONTAINER. For production restore drill, also verify DB user/name with: PROD_DB_CHECK_USER, PRODUCTION_DB_CHECK_USER and PROD_DB_CHECK_NAME, PRODUCTION_DB_CHECK_NAME.
```

## Result

The production DB restore-readiness check could not be completed in this runner because neither accepted protected input family is present. This is a protected-input availability blocker, not a failed restore-readiness result.

No production DB access, restore, mutation, migration, or secret readback occurred.

## Blocker

Blocked owner/action:
- Owner: Security Review Lead via `LUC-1762`, with Ops Release Lead coordination if Coolify/VPS runner configuration is needed.
- Action: provide a protected runner/session with either complete `PROD_DB_CHECK_CONTAINER`, `PROD_DB_CHECK_USER`, `PROD_DB_CHECK_NAME` or complete `PRODUCTION_DB_CHECK_CONTAINER`, `PRODUCTION_DB_CHECK_USER`, `PRODUCTION_DB_CHECK_NAME`, then rerun `pnpm run ops:db:backup-verify:prod`.

Downstream impact:
- `LUC-1758` and `LUC-1759` remain blocked for final protected release evidence until this data-lane input gate is resolved.

First-class blocker:
- `LUC-1762 [Soar][ARB-006][Security/Ops] Provide protected PROD_DB_CHECK runner inputs`
