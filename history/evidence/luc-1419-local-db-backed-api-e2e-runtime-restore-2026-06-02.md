# LUC-1419 Local DB-Backed API E2E Runtime Restore

Date: 2026-06-02

## Scope

Restore and verify the local DB-backed API e2e runtime needed by parent
`LUC-1196` for the close-authority route proof.

## Runtime Readback

- `Test-NetConnection 127.0.0.1 -Port 5432` -> `TcpTestSucceeded: True`
- `docker version --format '{{.Server.Version}}'` -> `28.3.2`
- `docker compose ps` -> `soar-postgres-1` and `soar-redis-1` running on
  `127.0.0.1:5432` and `127.0.0.1:6379`

No production system, Coolify resource, environment variable, database content,
or secret was mutated.

## Focused Proof

Command:

```powershell
pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts --reporter=verbose
```

Result:

- Test file reached authenticated route execution and endpoint assertions.
- `2/3` tests passed.
- `1/3` failed in the DCA-first pending-order assertion.

Failure classification:

- Infrastructure blocker resolved.
- Current failure is not PostgreSQL reachability, Docker availability, or API
  bootstrap.
- Remaining failure is backend behavior/test-contract drift: the pending DCA
  close-authority case receives response status `closed` where the route pack
  expects `submitted`.

## Cleanup Check

- `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` -> no rows.
- No new browser, Playwright, dev-server, production, or Coolify process was
  started by this heartbeat.
- Existing local compose services were reused for verification and left running
  because they pre-existed this heartbeat and are the active local DB-backed
  test dependency.

## Disposition

`LUC-1419` is complete for Ops: local DB-backed API e2e runtime is restored and
the parent route pack now reaches endpoint assertions. Remaining work belongs to
the `LUC-1196` Backend/QA close-authority lane.
