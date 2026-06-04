# Testing Memory

Last updated: 2026-06-04

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

## Focused Regression Packs

| Pack | Command | Scope | Latest Evidence | Boundary |
| --- | --- | --- | --- | --- |
| API platform and assistant adversarial pack | `pnpm run test:adversarial:api-assistant` | Rate-limit fail-closed/redacted logging, trusted-origin cookie write guard, JWT/session candidate rejection, assistant protocol/fail-closed behavior, assistant dry-run `LIVE` schema rejection | 2026-06-04 PASS (`8` files / `29` tests), `history/tasks/luc-1945-adversarial-api-assistant-regression-proof-2026-06-04-task.md` | Local no-protected-smoke regression proof only; not DB-backed route e2e, protected production auth, account mutation, or LIVE assistant hot-path parity. |

## Related Sources

| Need | Source |
| --- | --- |
| Local development tests | [Engineering testing](../engineering/testing.md) |
| Module-specific tests | [Module docs](../modules/module-documentation.md) |
| Release and smoke tests | [Operations docs](../operations/operations-documentation.md) |
