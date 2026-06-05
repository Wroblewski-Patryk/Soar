# LUC-2291 Soar API Node Heap OOM Root-Cause Evidence

Date: 2026-06-05
Owner: Backend API Engineer

## Result

Status: partially verified.

The May 31 crash is confirmed as a Node/V8 heap out-of-memory failure. The most
likely API path is authenticated Bot Runtime monitoring aggregate read traffic,
specifically nested runtime positions/trades readers that still materialize
large session-window trade sets in memory before slicing visible output.

## Evidence

| Check | Result |
| --- | --- |
| [LUC-2279](/LUC/issues/LUC-2279) host evidence | V8 heap pressure near ~2044 MB, fatal `JavaScript heap out of memory`, then normal API restart |
| API startup wrapper | `start-with-migrate.mjs` only runs Prisma migrate deploy then spawns `dist/index.js`; host evidence shows migration succeeded after restart |
| API server entrypoint | Express setup and `server_started`; no boot-time bulk load found |
| Existing risk source truth | `RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25` ties production OOM/500s to `/dashboard/bots/:id/runtime-monitoring/aggregate` |
| First mitigation ancestry | `287e77a1` is ancestor of deployed crash SHA `6839cd6b`, so the May 31 crash happened after initial fanout limit mitigation |
| Aggregate service | limits sessions/per-session rows, adds cache/inflight, bounded session concurrency, and skips failed per-session rows |
| Nested positions reader | visible positions are limited, but lifecycle trades are fetched for the session window without `take` and grouped in memory |
| Nested trades reader | scoped trades are fetched without `take`, enriched/sorted/reduced in memory, then sliced for the visible page |

## Classification

Likely root cause:

- Runtime aggregate endpoint receives authenticated dashboard polling or proof
  traffic.
- Aggregate fans into per-session symbol stats, positions, and trades.
- Positions/trades subqueries can return production-sized session history into
  Node memory even when visible output is limited.
- Repeated aggregate requests plus non-cancelled Prisma work can push the Node
  process to the default ~2 GB V8 heap ceiling.

Ruled down:

- Startup crash: not supported.
- Prisma migration failure: not supported.
- Coolify healthcheck loop: not supported by prior metadata.
- Web-only outage: separate issue family.

Unknown:

- The exact authenticated request id/user/bot/session at `2026-05-31T21:07:45Z`
  is not available from retained redacted logs.
- Exact row counts in the production session window were not queried in this
  backend heartbeat to avoid protected production data access.

## Required Follow-Up

Create and execute a backend implementation lane to bound runtime aggregate
trade/position materialization while preserving totals:

- use DB `count`/`aggregate` for totals and fees;
- fetch only visible rows for response pages;
- cap supplemental lifecycle trade materialization around visible positions;
- add a regression proving a large hidden trade history does not require loading
  all rows into Node.

## Validation

- `git merge-base --is-ancestor 287e77a1 HEAD` -> pass.
- `git merge-base --is-ancestor 287e77a1 6839cd6b8884e26eca735ce32cea98c1dadccfbe` -> pass.
- No production mutation, secret readback, account access, deploy, restart,
  database mutation, protected smoke, or live-trading action occurred.
