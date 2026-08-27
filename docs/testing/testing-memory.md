# Testing Memory

Last updated: 2026-05-07

Canonical testing workflow lives in [engineering/testing.md](../engineering/testing.md).

This folder exists for durable testing strategy notes, validation maps, and
agent-readable regression pack indexes that do not fit the engineering guide.

## Baseline Commands

```powershell
pnpm run quality:guardrails
pnpm run lint
pnpm run typecheck
pnpm --filter api run test -- --run
pnpm --filter web run test -- --run
pnpm run build
pnpm i18n:audit:route-reachable:web
pnpm run test:go-live:smoke
```

Use `.agents/core/quality-gates.md` to decide which commands are required for
a given scope.

## Related Sources

| Need | Source |
| --- | --- |
| Local development tests | [Engineering testing](../engineering/testing.md) |
| Module-specific tests | [Module docs](../modules/module-documentation.md) |
| Release and smoke tests | [Operations docs](../operations/operations-documentation.md) |
