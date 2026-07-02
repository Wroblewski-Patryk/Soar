# LUC-6105 Local PostgreSQL/Docker Runtime Proof

Date: 2026-06-29

## Scope

DRE local runtime restoration for [LUC-6097](/LUC/issues/LUC-6097) User
configuration DB-backed proof. Scope was limited to local Docker Desktop,
local Compose `postgres` / `redis`, loopback reachability, and focused API
profile route proof.

No production deploy, push, restart, protected production smoke, env edit,
secret/account readback, production DB/Redis mutation, exchange mutation,
order, position, subscription/payment mutation, or live-trading action
occurred.

## Runtime Restoration

- Docker client available: `Docker version 28.3.2`.
- Docker Compose available: `Docker Compose version v2.38.2-desktop.1`.
- Initial Soar compose state: no running services.
- Command run: `pnpm run go-live:infra:up`.
- Compose services started:
  - `soar-postgres-1`, image `postgres:15`, port
    `127.0.0.1:5432->5432/tcp`.
  - `soar-redis-1`, image `redis:7`, port
    `127.0.0.1:6379->6379/tcp`.
- TCP probes:
  - `Test-NetConnection 127.0.0.1 -Port 5432`:
    `TcpTestSucceeded=True`.
  - `Test-NetConnection 127.0.0.1 -Port 6379`:
    `TcpTestSucceeded=True`.

## Focused DB-Backed Proof

Command:

```powershell
$env:DATABASE_URL='postgresql://postgres:password@localhost:5432/cryptosparrow?schema=public'
$env:REDIS_URL='redis://localhost:6379'
pnpm --filter api exec vitest run src/modules/profile/basic/basic.e2e.test.ts src/modules/profile/security/security.e2e.test.ts --reporter=verbose
```

Result:

- `apps/api/src/modules/profile/basic/basic.e2e.test.ts`: PASS.
- `apps/api/src/modules/profile/security/security.e2e.test.ts`: PASS.
- Total: `2` files / `7` tests passed.

Covered DB-backed User configuration/profile behaviors:

- delete current profile user only;
- legacy DELETE route returns `404`;
- valid `uiPreferences.timeZonePreference` persists;
- invalid `uiPreferences.timeZonePreference` is rejected;
- unauthenticated profile security access is rejected;
- password changes require valid current password;
- account deletion requires valid password confirmation.

## Disposition

Local Docker/PostgreSQL runtime availability is restored for the
User configuration DB-backed proof path. The [LUC-6097](/LUC/issues/LUC-6097)
DB-backed `basic.e2e.test.ts` / `security.e2e.test.ts` blocker is cleared from
the DRE side.

The local `postgres` and `redis` containers were intentionally left running for
the immediate CBE/User configuration follow-up proof. This is not treated as a
leaked validation process because [LUC-6105](/LUC/issues/LUC-6105) explicitly
restores local runtime availability.

## Residual Risk

- The local database uses an existing Docker volume (`soar_postgres_data`), so
  future tests remain coupled to local migration/schema state if another lane
  mutates it.
- Full User configuration row closure still depends on the CBE/Docs follow-up
  from [LUC-6097](/LUC/issues/LUC-6097) and [LUC-6106](/LUC/issues/LUC-6106);
  this DRE issue closes only the local runtime blocker and focused route proof.
