# V1 Restore Drill Evidence (prod)

- Generated at (UTC): 2026-05-12T15:21:38Z
- Status: **PASS**
- Execution path: SSH/VPS Docker exec for production Postgres resource
- Container: `x11cfnz1dd9x0yzccftqzcoe`
- DB user: `postgres`
- DB name: `postgres`
- Restore database: `postgres_restore_check_20260512152138`
- Raw JSON: `history/artifacts/_artifacts-restore-drill-prod-coolify-2026-05-12T15-21-38Z.json`

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
Log,52740
Order,3981
Position,4787
User,4
```

## Terminal Evidence Summary
```text
SOAR_RESTORE_START stamp=20260512152138 db=postgres user=postgres restore=postgres_restore_check_20260512152138
PREFLIGHT_RESTORE_DATABASES=0
PREFLIGHT_BACKUPS=0
BACKUP_CREATED /tmp/postgres_backup_20260512152138.dump
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
SOAR_RESTORE_20260512152138_PASS
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
- An earlier 2026-05-12 attempt completed backup/restore/count/cleanup with
  zero leftovers but exited `1` because of a shell-wrapper footer syntax error;
  this artifact records the corrected successful run.
