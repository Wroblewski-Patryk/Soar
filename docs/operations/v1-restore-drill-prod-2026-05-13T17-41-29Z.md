# V1 Restore Drill Evidence (prod)

- Generated at (UTC): 2026-05-13T17:41:29Z
- Status: **PASS**
- Execution path: Coolify production PostgreSQL resource terminal
- Container: `x11cfnz1dd9x0yzccftqzcoe`
- DB user: `postgres`
- DB name: `postgres`
- Restore database: `postgres_restore_check_20260513174129`
- Raw JSON:
  `docs/operations/_artifacts-restore-drill-prod-coolify-2026-05-13T17-41-29Z.json`

## Contract Checks

- preflightRestoreDatabaseCount: PASS (`0`)
- preflightBackupDumpCount: PASS (`0`)
- backupCreated: PASS
- restoreDatabaseCreated: PASS
- backupRestored: PASS
- keyTableValidationCountsCompleted: PASS
- restoreDatabaseDropped: PASS
- backupRemoved: PASS
- leftoverRestoreDatabaseCount: PASS (`0`)
- leftoverBackupDumpCount: PASS (`0`)

## Validation Counts

```text
Bot,6
Log,55573
Order,4168
Position,4866
User,4
```

## Terminal Evidence Summary

```text
SOAR_RESTORE_START stamp=20260513174129 db=postgres user=postgres restore=postgres_restore_check_20260513174129
PREFLIGHT_RESTORE_DATABASES=0
PREFLIGHT_BACKUPS=0
BACKUP_CREATED /tmp/postgres_backup_20260513174129.dump
DROP DATABASE
CREATE DATABASE
RESTORE_DB_CREATED
RESTORE_COMPLETED
VALIDATION_COUNTS_DONE
RESTORE_DB_DROPPED
BACKUP_REMOVED
LEFTOVER_RESTORE_DATABASES=0
LEFTOVER_BACKUPS=0
RESULT: PASS
SOAR_RESTORE_20260513174129_PASS
```

Cleanup verification after the drill returned `0` matching
`postgres_restore_check_%` databases and no `/tmp/postgres_backup_*.dump`
files.

## Safety Notes

- This used the existing isolated restore-proof contract: create backup,
  restore to temporary database, validate aggregate counts, drop temporary
  database, remove backup.
- No password, token, connection string, API key, user record, bot record,
  order payload, position payload, or log payload is included in this artifact.
