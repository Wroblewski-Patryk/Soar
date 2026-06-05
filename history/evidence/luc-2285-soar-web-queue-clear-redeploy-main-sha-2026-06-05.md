# LUC-2285 Soar Web Queue Clear And Redeploy Evidence

Date: 2026-06-05
Owner: Ops Release Lead
Scope: production `soar-web` queue cleanup/readiness verification and one
controlled redeploy path for `main`.

## Permit

The issue permit authorized only this production mutation:

- target: Coolify `Soar / production / soar-web`
- resource UUID observed from prior evidence: `ato4fqkncd6t38wzlle2m0rv`
- source: `main` at `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- action: clear stale queued/in-progress `soar-web` deployments, then run one
  controlled redeploy of the same source SHA
- forbidden: API, worker, database, Redis, env, DNS, team/account, protected
  smoke credential, secret, exchange, and live-trading mutation

## Source And Worktree

- `git rev-parse HEAD`:
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- `git rev-parse origin/main`:
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- branch: `main`
- dirty worktree: pre-existing state/history evidence files only; not used as
  deploy input

## Pre-State

- Coolify API health/version readback succeeded:
  - `/api/v1/health` -> `200 OK`
  - `/api/v1/version` -> `4.0.0-beta.473`
- `GET /api/v1/applications/ato4fqkncd6t38wzlle2m0rv` -> `200`, name
  `soar-web`
- `GET /api/v1/applications/ato4fqkncd6t38wzlle2m0rv/deployments` -> `404`
  in this API scope
- `GET /api/v1/deployments` initially showed one active `soar-web`
  deployment:
  - deployment UUID `z56ei43f8101s7q7th86z2vg`
  - status `in_progress`
  - commit `6e31d814046b640ad529d1cd57f968ba6f67b05e`
  - `is_api=true`, `is_webhook=false`
  - created at `2026-06-05T20:53:02Z`
- no stale queued `soar-web` rows remained visible through the global
  deployments endpoint at the time this heartbeat inspected it
- public smoke before convergence wait:
  - API `/health` -> `200`
  - API `/ready` -> `200`
  - Web `/` -> `503`
  - Web `/api/build-info` -> `503`

## Verification

Command:

```text
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814 --timeout-seconds 360 --interval-seconds 20 --request-timeout-ms 15000
```

Result: failed after 18 attempts over six minutes.

- attempts 1-8, 10, and 12-18 returned `503`
- attempt 9 aborted by request timeout
- attempt 11 returned `502`
- no `gitSha`, `metadataSource`, or `buildId` was observed

Final public smoke:

```text
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814046b640ad529d1cd57f968ba6f67b05e --no-workers
```

Result:

- API `/health` -> PASS `200`
- API `/ready` -> PASS `200`
- Web `/` -> FAIL `503`
- Web `/api/build-info` -> FAIL `503`

Final Coolify readback:

- `soar-web` app status: `restarting:unknown`
- `last_restart_type`: `crash`
- `last_restart_at`: `2026-06-05T20:58:25Z`
- `restart_count`: `5`
- git branch: `main`
- git commit setting: `HEAD`
- `GET /api/v1/deployments` -> `200`, `0` visible `soar-web` deployment rows
- app logs endpoint -> `400`, `Application is not running.`

Reusable Ops env-contract regression:

```text
pnpm run ops:coolify-stack:env-check:test
```

Result: PASS, `8/8`.

## Disposition

Blocked. The stale visible queue is gone and the permitted SHA entered a
`soar-web` deployment path, but production Web did not recover. The stop
condition fired because Web remained `503` and Coolify reports
`restarting:unknown` with a fresh crash timestamp.

No rollback, second redeploy, restart, env edit, database action, API/worker
action, protected smoke, account action, secret readback, exchange mutation, or
live-trading action was performed.

Next legal owner/action: a fresh rollback or host-level recovery permit must
name the exact previous stable `soar-web` deployment/image or authorize
Coolify/VPS host-level inspection for the crash-start failure. Do not chain
another mutation from this permit.
