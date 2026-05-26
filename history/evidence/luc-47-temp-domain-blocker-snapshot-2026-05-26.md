# LUC-47 Temp-Domain Blocker Snapshot (2026-05-26)

Date: 2026-05-26  
Issue: `LUC-47`  
Lane: Ops Release Lead  
Expected SHA: `3fedb7a9170097b40accb6ccea1915064f383f11`

## Read-Only Coolify Snapshot
- Source: Coolify API read-only inventory through existing Paperclip env bindings.
- Soar app UUIDs currently visible:
  - `soar-api`: `k126p7vqxs5cly2zc4y4g4rq` (`running:unknown`)
  - `soar-web`: `ato4fqkncd6t38wzlle2m0rv` (`running:unknown`)
  - `workers-market-data`: `sj0bh3pirqq1jf41bijaf77y` (`running:unknown`)
  - `workers-market-stream`: `d2oo1wwy8i55q27e5mdky0i4` (`exited:unhealthy`)
  - `workers-backtest`: `gktawk85w6826z2bs8z123mz` (`running:unknown`)
  - `workers-execution`: `s2qz86w8c9hc5anajdtl5d8r` (`running:unknown`)
- Temp-domain/parallel Soar app discovery:
  - no temp/parallel/candidate Soar application entry was returned in current applications inventory.
- Service inventory:
  - only `n8n` service is visible; no Soar temp stack service object found.

## Public Expected-SHA Gate (Current Production)
- Command:
  - `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`
- Result: PASS (`API /health`, `API /ready`, `WEB /`, `WEB /api/build-info` with matching SHA).

## Acceptance Impact
- Temp-domain acceptance packet still cannot be completed from current resource inventory because:
  1. no temp-domain parallel Soar stack resource is discoverable, and
  2. `workers-market-stream` is currently `exited:unhealthy` in the visible Soar runtime set.

## Exact Unblock Owner / Action
- Owner: local-board release controller + scheduled Coolify operator.
- Action:
  1. create or expose the temp-domain parallel Soar stack resources in Coolify,
  2. deploy SHA `3fedb7a9170097b40accb6ccea1915064f383f11` to that temp stack,
  3. recover/verify `workers-market-stream` readiness on the temp stack,
  4. attach required temp evidence (`temp-api /health`, `temp-api /ready`, `temp-web /`, `temp-web /api/build-info` SHA match, four workers readiness, rollback/cutover note).

## Disposition
- `blocked`
