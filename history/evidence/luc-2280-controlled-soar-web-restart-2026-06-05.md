# LUC-2280 Controlled soar-web Restart Evidence

- Issue: [LUC-2280](/LUC/issues/LUC-2280)
- Timestamp window: `2026-06-05T20:40:02Z` to `2026-06-05T20:42:55Z`
- Target: Soar / production / `soar-web`
- Action allowed: exactly one controlled restart.
- Action performed: one restart request.
- Final disposition: restart failed to restore Web readiness; Paperclip later
  reconciled [LUC-2280](/LUC/issues/LUC-2280) to `done` with failed-recovery
  disposition. The valid rollback/redeploy follow-up path is
  [LUC-2282](/LUC/issues/LUC-2282).

## Permit Check

The issue description named all required mutation-permit fields:

- Coolify project/environment: `Soar / production`.
- Exact resource: `soar-web` application resource.
- Exact action: one controlled restart only after final precheck.
- Expected source state: `main`, local `HEAD` and `origin/main` at
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
- Expected outcome: public Web `/` and `/api/build-info` return `200`, and
  Coolify no longer reports `soar-web` restarting.
- Rollback/stop condition: if restart does not recover readiness within the
  smoke window, stop mutation and request a separate rollback/deploy permit.
- Required smoke: `ops:deploy:smoke --no-workers`, direct Web/API reads, and
  read-only Coolify status.
- Secret handling: Paperclip/Coolify env bindings only; no secret values or raw
  Coolify objects persisted.

## Pre-State

Source check:

- `HEAD=6e31d814046b640ad529d1cd57f968ba6f67b05e`
- `origin/main=6e31d814046b640ad529d1cd57f968ba6f67b05e`
- Dirty tree contained one pre-existing task artifact outside deploy source:
  `history/tasks/luc-1160-soar-production-stability-diagnose-coolify-restart-loop-and-runtime-crash-cause-2026-05-31-task.md`.

Public smoke at `2026-06-05T20:40:02Z`:

| Check | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `200` |
| Web `/` | `503` |
| Web `/api/build-info` | `503` |
| `ops:deploy:smoke --no-workers` | FAIL: Web checks only |

Read-only Coolify `soar-web` projection:

| Field | Value |
| --- | --- |
| status | `running:unknown` |
| branch | `main` |
| gitCommitSha | `HEAD` |
| restartCount | `54` |
| lastRestartType | `crash` |
| lastRestartAt | `2026-06-05T20:36:37Z` |

## Restart Attempt

At `2026-06-05T20:40:31Z`, Ops sent one restart request to the Coolify
application restart endpoint for `soar-web`.

Result:

```text
Deployment already queued for this commit.
```

No second restart was attempted.

## Poll Window

Nine poll cycles over roughly 90 seconds showed no recovery:

| Poll | Coolify status | Web `/` | Web `/api/build-info` |
| --- | --- | --- | --- |
| 1 | `restarting:unknown` | `503` | `503` |
| 2 | `restarting:unknown` | `503` | `503` |
| 3 | `restarting:unknown` | `503` | `503` |
| 4 | `restarting:unknown` | `503` | `503` |
| 5 | `restarting:unknown` | `503` | `503` |
| 6 | `restarting:unknown` | request error | `503` |
| 7 | `restarting:unknown` | `503` | `503` |
| 8 | `restarting:unknown` | `503` | `503` |
| 9 | `restarting:unknown` | `503` | `503` |

The `restartCount`, `lastRestartType`, and `lastRestartAt` values did not move
during this poll window.

## Final State

Final public smoke at `2026-06-05T20:42:55Z`:

| Check | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `200` |
| Web `/` | `503` |
| Web `/api/build-info` | `503` |
| `ops:deploy:smoke --no-workers` | FAIL: Web checks only |

Final read-only Coolify projection:

| Resource | Status | restartCount | lastRestartType | lastRestartAt |
| --- | --- | --- | --- | --- |
| `soar-web` | `restarting:unknown` | `54` | `crash` | `2026-06-05T20:36:37Z` |
| `soar-api` | `running:unknown` | `5` | `crash` | `2026-06-01T16:14:03Z` |

`soar-api` remained publicly healthy during this checkpoint.

Redacted log/deployment endpoint attempts for `soar-web` failed:

- app logs endpoint -> HTTP `400`
- deployments endpoint -> HTTP `404`

## Stop Condition

The restart failed to restore readiness, so the [LUC-2280](/LUC/issues/LUC-2280)
permit is exhausted. Paperclip later reconciled the parent to `done` with
failed-recovery disposition. Follow-up [LUC-2282](/LUC/issues/LUC-2282) owns
any next rollback or redeploy permit. Duplicate [LUC-2284](/LUC/issues/LUC-2284)
was created before refreshed board state showed [LUC-2282](/LUC/issues/LUC-2282)
and could not be cancelled from this run because it is locked to another
execution run; treat it as cleanup-only. Obsolete recovery issue
[LUC-2288](/LUC/issues/LUC-2288) was cancelled.

No deploy, rollback, additional restart, env edit, database action, team/account
mutation, protected smoke, secret readback, or live-trading action occurred.

## Closure Checkpoint

At `2026-06-05T20:49:01Z`, after the [LUC-2282](/LUC/issues/LUC-2282)
blocker reached `done`, Ops rechecked the public endpoints:

| Check | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `200` |
| Web `/` | `503` |
| Web `/api/build-info` | `503` |

Command:

```text
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: expected failure on Web only (`WEB / -> 503`, `WEB /api/build-info ->
503`); API checks remained healthy. No second restart or other production
mutation was performed. With the single permitted restart already used and the
required redeploy-permit follow-up prepared in [LUC-2282](/LUC/issues/LUC-2282),
this issue's release-permit work is complete.
