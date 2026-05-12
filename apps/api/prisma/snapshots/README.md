# Paper Runtime Snapshot

`paper-runtime-snapshot.json` is a local representative test-data snapshot for:

- strategies
- bot configuration
- bot to market to strategy links
- open positions

The import also creates deterministic local runtime sessions for active PAPER
bots when the snapshot contains their open positions:

- one `RUNNING` PAPER session with current open-position/stat readback
- one `COMPLETED` PAPER session with stopped-event/stat readback

This lets Dashboard Home and Bot Runtime consume representative data through the
existing runtime API contracts, especially
`/dashboard/bots/:id/runtime-monitoring/aggregate`, instead of relying on
manual database edits or fake frontend data.

## Export Current State

```bash
pnpm --filter api run snapshot:paper:export
```

Optional environment variables:

- `SNAPSHOT_EMAIL` - exported user email, defaults to
  `wroblewskipatryk@gmail.com`
- `SNAPSHOT_OUTPUT` - output file path

## Import After Database Reset

```bash
pnpm --filter api run snapshot:paper:import
```

Optional environment variables:

- `SNAPSHOT_INPUT` - snapshot file path
- `SNAPSHOT_USER_PASSWORD` - password for the created user when it does not
  already exist

Recommended order after `prisma migrate reset`:

1. Standard seed: `pnpm --filter api exec prisma db seed`
2. Snapshot import: `pnpm --filter api run snapshot:paper:import`
