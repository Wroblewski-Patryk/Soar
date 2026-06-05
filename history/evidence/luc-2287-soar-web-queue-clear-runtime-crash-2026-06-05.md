# LUC-2287 Soar Web Queue Clear And Runtime Crash Evidence

- Date: 2026-06-05
- Owner: Ops Release Lead
- Resource: `soar-web`
- Coolify resource UUID: `ato4fqkncd6t38wzlle2m0rv`
- Expected source SHA: `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- Secret handling: Coolify/Paperclip secret values were not printed or stored.

## Scope

This heartbeat consumed the scoped wake for `LUC-2287` and inspected only the
`soar-web` Coolify application/deployment state plus public Soar smoke
endpoints. No API, worker, PostgreSQL, Redis, environment, account, secret,
exchange, rollback, or live-data mutation was performed.

## Source Ref

- Local `HEAD`: `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- `origin/main`: `6e31d814046b640ad529d1cd57f968ba6f67b05e`

## Coolify Queue Readback

Initial readback during the heartbeat showed the stale older queue had changed
from the wake payload:

- `GET /api/v1/applications/ato4fqkncd6t38wzlle2m0rv` returned `soar-web` with
  status `restarting:unknown`.
- `GET /api/v1/deployments?application_uuid=ato4fqkncd6t38wzlle2m0rv` showed a
  single active deployment row for
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`, status `in_progress`,
  deployment UUID `neeolrzllw05x3xewgdlbrw1`.

After polling, final readback showed no active deployment rows:

- `GET /api/v1/deployments?application_uuid=ato4fqkncd6t38wzlle2m0rv` returned
  zero active rows.
- `GET /api/v1/deployments?uuid=ato4fqkncd6t38wzlle2m0rv` returned zero active
  rows.
- `GET /api/v1/deployments/applications/ato4fqkncd6t38wzlle2m0rv?take=10`
  showed recent `6e31d814...` deployment rows `5536` and `5537` as
  `finished`, plus stale queue rows as `cancelled-by-user`.

## Runtime Readback

Final application metadata still showed a runtime crash loop:

- Coolify app status: `restarting:unknown`
- Coolify `last_restart_type`: `crash`
- Coolify `last_restart_at`: `2026-06-05T20:58:25Z`
- Coolify restart count in final readback: `5`
- Coolify app logs endpoint remained unavailable: `400 Bad Request`

## Public Smoke

Build-info wait:

```text
node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814046b640ad529d1cd57f968ba6f67b05e --timeout-seconds 300 --interval-seconds 15 --request-timeout-ms 15000
```

Result: failed after 20 attempts. Every poll returned `503`; no `gitSha` was
observed.

Deploy smoke:

```text
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814046b640ad529d1cd57f968ba6f67b05e --no-workers
```

Result: failed only Web checks.

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `503`
- Web `/api/build-info`: `503`

Env contract regression:

```text
pnpm run ops:coolify-stack:env-check:test
```

Result: pass, `8/8`.

## Disposition

Blocked. The stuck deploy queue is no longer visible and target-SHA web
deployments have finished, but `soar-web` remains crash-restarting and public
Web still returns `503`. The next unblock action is redacted `soar-web`
deployment/app/host log retrieval for the `2026-06-05T20:52Z` to
`2026-06-05T20:59Z` window, focused on deployment rows `5536` and `5537` and
the crash at `2026-06-05T20:58:25Z`, followed by a separate remediation or
rollback permit.
