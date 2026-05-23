# V1 Restore Drill Evidence (prod)

- Generated at (UTC): 2026-05-10T03:39:56Z
- Status: **PASS**
- Execution path: Coolify terminal for production Postgres resource
- Container: `x11cfnz1dd9x0yzccftqzcoe`
- DB user: `postgres`
- DB name: `postgres`
- Restore database: `postgres_restore_check_20260510033956`
- Raw JSON: `history/artifacts/_artifacts-restore-drill-prod-coolify-2026-05-10T03-39-56Z.json`

## Contract Checks
- coolifyTerminalConnected: PASS
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
Log,46495
Order,3555
Position,4601
User,4
```

## Terminal Evidence Summary
```text
SOAR_RESTORE_START stamp=20260510033956 db=postgres user=postgres restore=postgres_restore_check_20260510033956
BACKUP_CREATED /tmp/postgres_backup_20260510033956.dump
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
SOAR_RESTORE_20260510033956_PASS
```

Cleanup verification after the drill returned `0` matching
`postgres_restore_check_%` databases and no `/tmp/postgres_backup_*.dump`
files.

## Safety Notes
- This was executed through approved Coolify operator access because local
  Docker cannot reach the VPS production container.
- No password, token, connection string, API key, user record, bot record,
  order payload, position payload, or log payload is included in this artifact.
- The drill used the existing isolated restore-proof contract: create backup,
  restore to temporary database, validate aggregate counts, drop temporary
  database, remove backup.
