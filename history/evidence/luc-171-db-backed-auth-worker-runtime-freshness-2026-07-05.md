# LUC-171 DB-Backed Auth And Worker Runtime Freshness Proof

- Date: 2026-07-05
- Owner: 09 QVE (QA & Verification Engineer)
- Status: VERIFIED_LOCAL
- Scope: local DB-backed API route verification only.

## Environment

- Workspace: `C:/Personal/Projekty/Aplikacje/Soar`
- Docker status before proof: Docker Desktop available.
- Local infra before proof:
  - `soar-postgres-1` up, `127.0.0.1:5432->5432/tcp`
  - `soar-redis-1` up, `127.0.0.1:6379->6379/tcp`
- Infra ownership: containers were already running before this heartbeat; QVE did not start them.

## Commands

```powershell
corepack pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/middleware/requireTrustedOrigin.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000
```

Result: PASS, 2 files / 16 tests.

```powershell
corepack pnpm --filter api exec vitest run src/router/workers-runtime-freshness.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000
```

Result: PASS, 1 file / 7 tests.

## Coverage Confirmed

- DB-backed auth route proof:
  - register success and validation failures
  - duplicate email rejection
  - login cookie TTL variants
  - `/auth/me` user deletion fail-closed behavior
  - logout invalidation and stale bearer/cookie rejection
  - expired JWT rejection
  - duplicate token cookie precedence
- Trusted-origin proof:
  - trusted state-changing cookie request accepted
  - untrusted state-changing cookie request rejected
  - same-site missing-origin behavior covered
- Worker runtime freshness route proof:
  - unauthenticated access rejected
  - PASS for healthy worker/market freshness
  - FAIL for stale market data
  - FAIL for stale running sessions
  - FAIL when active runtime session has no fresh decision activity
  - PASS when active running session has fresh `SIGNAL_DECISION`
  - PASS in inline mode with no active runtime demand

## Boundaries

- No source code change.
- No commit, push, deploy, restart, rollback, env edit, migration, production access, secret value readback, account mutation, exchange/payment/subscription mutation, order, position, or live-trading action.
- No cleanup stop was run because the local Postgres/Redis containers pre-existed this heartbeat and may be shared by other agents.

## Disposition

[LUC-171](/LUC/issues/LUC-171) can close as `DONE / VERIFIED_LOCAL / DB_BACKED_AUTH_PASS / WORKER_RUNTIME_FRESHNESS_PASS / NO_RUNTIME_MUTATION`.
