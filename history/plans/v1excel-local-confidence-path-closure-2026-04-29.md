# V1EXCEL-02 - Local Confidence Path Closure

Status: PASS
Date: 2026-04-29
Owner: Codex Execution Agent

## Purpose

Close the remaining local reproducibility gap from `V1EXCEL-01` by proving that
the umbrella local confidence path can now run honestly on this workstation,
including the previously blocked `test:go-live:smoke` wrapper.

## What Was Blocking Earlier

- local Prisma migration-history drift on the shared dev database
- specifically failed migration history around:
  - `20260424094500_add_single_context_bot_refs`
  - `20260426003000_scope_open_position_uniqueness_by_wallet_or_bot`
  - `20260427103000_add_position_close_attribution`
  - `20260428113000_add_position_restart_continuity_state`

This was not a newly confirmed `V1` product bug. It was local migration-history
debt on a reused workstation database.

## Recovery Applied

The local database schema already contained the canonical objects, so recovery
used non-destructive Prisma history repair instead of a destructive DB reset.

Applied commands under `apps/api`:

```powershell
.\node_modules\.bin\prisma.CMD migrate resolve --applied 20260424094500_add_single_context_bot_refs
.\node_modules\.bin\prisma.CMD migrate resolve --applied 20260426003000_scope_open_position_uniqueness_by_wallet_or_bot
.\node_modules\.bin\prisma.CMD migrate resolve --applied 20260427103000_add_position_close_attribution
.\node_modules\.bin\prisma.CMD migrate resolve --applied 20260428113000_add_position_restart_continuity_state
```

## Fresh Evidence

### Umbrella local confidence path

```powershell
pnpm run test:go-live:smoke
```

Result:

- Prisma migrate deploy: `No pending migrations to apply.`
- API go-live pack: `35/35 PASS`
- Web go-live pack: `17/17 PASS`
- wrapper reused already-running local Postgres/Redis successfully

## Supporting Repository Changes

- [local-development.md](C:/Personal/Projekty/Aplikacje/Soar/docs/engineering/local-development.md)
  now documents both safe recovery paths:
  - destructive reset when local data may be discarded
  - non-destructive `migrate resolve` path when schema already matches
- [goLiveSmoke.mjs](C:/Personal/Projekty/Aplikacje/Soar/scripts/goLiveSmoke.mjs)
  now prints the exact recovery guidance instead of leaving the operator with
  opaque `P3009` noise.

## Final Result

The local umbrella confidence path is currently reproducible on this
workstation.

Residual note:

- this closure applies to the repaired local database state on this machine
- another workstation with different historical drift may still require the same
  documented `migrate resolve` recovery before the umbrella smoke turns green

