# LUC-47 Temp-Domain Blocker Re-Snapshot (2026-05-26T03:15Z)

Date (UTC): 2026-05-26T03:15Z  
Issue: `LUC-47`  
Expected SHA: `3fedb7a9170097b40accb6ccea1915064f383f11`

## Coolify Re-Check (Read-Only)
- Temp-domain / parallel Soar resources: not present in current applications inventory.
- Soar runtime inventory remains:
  - `soar-api` (`k126p7vqxs5cly2zc4y4g4rq`) `running:unknown`
  - `soar-web` (`ato4fqkncd6t38wzlle2m0rv`) `running:unknown`
  - `workers-market-data` (`sj0bh3pirqq1jf41bijaf77y`) `running:unknown`
  - `workers-market-stream` (`d2oo1wwy8i55q27e5mdky0i4`) `exited:unhealthy`
  - `workers-backtest` (`gktawk85w6826z2bs8z123mz`) `running:unknown`
  - `workers-execution` (`s2qz86w8c9hc5anajdtl5d8r`) `running:unknown`

## Public Expected-SHA Smoke Re-Check
- Command:
  - `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`
- Result: PASS (`API /health`, `API /ready`, `WEB /`, `WEB /api/build-info` with matching SHA).

## Disposition
- `blocked`

## Unblock Owner / Action
- Owner: local-board release controller + scheduled Coolify operator.
- Action: create/expose temp-domain parallel Soar stack, deploy expected SHA, recover/verify `workers-market-stream` readiness on temp stack, then attach full temp acceptance packet (API/Web/build-info/workers + rollback/cutover note).
