# V1 Restore Drill Evidence (prod)

- Generated at (UTC): 2026-05-08T15:16:24Z
- Status: **PASS**
- Execution path: Coolify terminal for production Postgres resource
- Container: `x11cfnz1dd9x0yzccftqzcoe`
- DB user: `postgres`
- DB name: `postgres`
- Restore database: `postgres_restore_check_20260508151624`
- Raw JSON: `docs/operations/_artifacts-restore-drill-prod-coolify-2026-05-08T15-16-24Z.json`

## Contract Checks
- coolifyTerminalConnected: PASS
- backupCreated: PASS
- restoreDatabaseCreated: PASS
- backupRestored: PASS
- keyTableValidationCountsCompleted: PASS
- restoreDatabaseDropped: PASS
- backupRemoved: PASS
- leftoverRestoreDatabaseCount: PASS (`0`)

## Validation Counts
```text
User,4
Bot,6
Order,3395
Position,4516
Log,42886
```

## Terminal Evidence Summary
```text
SOAR_RESTORE_START stamp=20260508151624 db=postgres user=postgres restore=postgres_restore_check_20260508151624
BACKUP_CREATED /tmp/postgres_backup_20260508151624.dump
DROP DATABASE
CREATE DATABASE
RESTORE_DB_CREATED
RESTORE_COMPLETED
VALIDATION_COUNTS_DONE
RESTORE_DB_DROPPED
BACKUP_REMOVED
RESULT: PASS
SOAR_RESTORE_1778253381011_PASS
```

Cleanup verification after the drill returned `0` matching
`postgres_restore_check_%` databases and no `/tmp/postgres_backup_*.dump`
files.

## Safety Notes
- This was executed through approved Coolify operator access because local
  Docker cannot reach the VPS production container.
- No password, token, connection string, API key, user record, bot record,
  order payload, position payload, or log payload is included in this artifact.
- A previous terminal-script attempt restored successfully but had invalid SQL
  quoting for validation counts and was not accepted as evidence; this report
  records the corrected `set -eu` run.
