# LUC-2287 Soar Web Deploy Queue Cleared, Runtime Still Crashing

- Date: 2026-06-05
- Owner: Ops Release Lead
- Resource: `Soar / production / soar-web`
- Expected source SHA: `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- Secret handling: bound Coolify/Paperclip secrets were used; no secret values
  were printed or persisted.

## Source Ref

- Local `HEAD`: `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- `origin/main`: contains `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- Deploy source branch: `main`
- Dirty tree note: pre-existing state/evidence/task files were present before
  this issue; no product-code change was used as deployment source.

## Pre-Action State

- `soar-web` Coolify metadata readback succeeded.
- App status: `restarting:unknown`
- Repository: `Wroblewski-Patryk/Soar`
- Branch: `main`
- Commit setting: `HEAD`
- Last restart type: `crash`
- Deployment queue showed:
  - four stale `b894e5dd30614dfd2035e91e3d848c842d3ff380` rows, including
    `in_progress` and `queued` states;
  - six queued rows for `6e31d814046b640ad529d1cd57f968ba6f67b05e`;
  - three queued `HEAD` rows created after prior recovery attempts.

## Actions Performed

Exactly one bounded production recovery sequence was performed against
`soar-web` only:

1. Cancelled four stale `b894e5dd...` deployment rows with Coolify's
   deployment-cancel API.
2. Rechecked queue: no row advanced to successful runtime; API stayed healthy
   and Web stayed `503`.
3. Cancelled nine stale duplicate queued target/`HEAD` rows for the same
   `soar-web` resource.
4. Triggered exactly one fresh `soar-web` deploy with `force=false`.

No API app, worker, Postgres, Redis, environment variable, team/account,
secret, protected-smoke, rollback, exchange, live-trading, or user-data
mutation was performed.

## Deployment Readback

- Fresh deploy was accepted by Coolify and advanced to `in_progress` for
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
- During the wait window, Coolify continued reporting `soar-web` as
  `restarting:unknown`.
- Final app readback:
  - status: `restarting:unknown`
  - last restart type: `crash`
  - last restart time: `2026-06-05T20:58:25Z`
  - restart count: `5`
- Final deployments list endpoint returned no active deployment rows for the
  app.

## Verification

Build-info wait:

```text
node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814046b640ad529d1cd57f968ba6f67b05e --timeout-seconds 240 --interval-seconds 15 --request-timeout-ms 15000
```

Result: failed. All 16 attempts returned `503`; no `gitSha`,
`metadataSource`, or `buildId` was observed.

Focused Ops regression:

```text
pnpm run ops:coolify-stack:env-check:test
```

Result: passed, `8/8`.

Final public probes:

| Probe | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `200` |
| Web `/api/build-info` | `503` |
| Web `/` | `503` |

## Resume Verification After Blocker Resolution

`LUC-2287` resumed after the blocker chain resolved. The original target SHA
`6e31d814046b640ad529d1cd57f968ba6f67b05e` did not recover production Web; the
redacted runtime evidence later classified that image as failing because the
Web runtime image was missing the production start wrapper. `LUC-2304` fixed
that packaging defect and pushed
`a70d7881b69e605c537af5f81cbeb74dc81e9329` to `origin/main`.

Read-only production verification after the fix:

| Probe | Result |
| --- | --- |
| `git rev-parse HEAD` | `a70d7881b69e605c537af5f81cbeb74dc81e9329` |
| `git ls-remote --heads origin main` | `a70d7881b69e605c537af5f81cbeb74dc81e9329 refs/heads/main` |
| Coolify `soar-web` app state | `running:unknown`, branch `main`, no restart signal |
| Web `/api/build-info` | `200`, `gitSha=a70d7881b69e605c537af5f81cbeb74dc81e9329`, `metadataSource=github-branch` |
| Web `/` | `200` |
| API `/ready` | `200` |
| Coolify active deployment rows | `0` after final stale duplicate `a70d7881...` queue cleanup |

Resume validation commands:

```text
node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha a70d7881b69e605c537af5f81cbeb74dc81e9329 --timeout-seconds 60 --interval-seconds 10 --request-timeout-ms 15000
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Both passed. Final queue cleanup cancelled four stale duplicate `a70d7881...`
Coolify deployment rows that stayed `in_progress`/`queued` after public Web was
already healthy. No additional deploy, restart, rollback, environment edit,
database action, account action, protected smoke, secret readback, exchange
mutation, or live-trading action occurred in the resume verification.

## Disposition

Done for the queue-recovery issue. The stale deployment queue was cleared, the
original `6e31d814` deployment failure was diagnosed as a Web runtime-image
packaging defect, and production Web later recovered on pushed fix commit
`a70d7881b69e605c537af5f81cbeb74dc81e9329`. Final Coolify readback showed
`soar-web` running with zero active deployment rows.

The requested `6e31d814` build-info verification did not pass and should remain
classified as a failed runtime candidate, not as the recovered production
state.
