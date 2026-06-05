# LUC-2292 Controlled soar-web Redeploy Evidence

Date: 2026-06-05
Owner: Ops Release Lead
Process: release/deploy gate

## Scope

Release permit [LUC-2292](/LUC/issues/LUC-2292) authorized exactly one
controlled Coolify redeploy of `Soar / production / soar-web` from pushed
`origin/main`.

Allowed mutation:

- Target: `soar-web` application only.
- Action: one redeploy from branch `main`.
- Expected source SHA: `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
- Rollback: not authorized by this issue.
- Secret handling: Paperclip/Coolify env bindings only; no secret values, raw
  resource ids, raw deployment ids, raw logs, generated database suffixes, or
  credentials recorded.

## Precheck

- `git rev-parse HEAD` -> `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
- `git ls-remote origin refs/heads/main` ->
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
- Public API `https://api.soar.luckysparrow.ch/health` -> `200`.
- Public API `https://api.soar.luckysparrow.ch/ready` -> `200`.
- Public Web `https://soar.luckysparrow.ch/` -> `503`.
- Public Web `https://soar.luckysparrow.ch/api/build-info` -> `503`.
- Coolify redacted resource readback: name `soar-web`, branch `main`, status
  `restarting:unknown`, public FQDN `https://soar.luckysparrow.ch/`.
- Focused local regression:
  `pnpm run ops:coolify-stack:env-check:test` -> PASS, 8 tests passed.

## Mutation

Command class: Coolify API `POST /api/v1/deploy` using the configured
`COOLIFY_SOAR_WEB_APP_ID` value from the approved environment binding.

Result: redeploy request accepted for `soar-web`.

No restart, rollback, env edit, database action, Redis action, worker action,
team/account setting change, protected smoke, exchange mutation, or live-trading
mutation was performed.

## Postcheck

Eight polls were run at 15-second intervals after the redeploy request:

| Poll | Web `/` | Web `/api/build-info` | build-info SHA | Coolify status |
| --- | --- | --- | --- | --- |
| 1 | 503 | 503 | n/a | running:unknown |
| 2 | 503 | 503 | n/a | restarting:unknown |
| 3 | 503 | 503 | n/a | restarting:unknown |
| 4 | 503 | 503 | n/a | restarting:unknown |
| 5 | 503 | 503 | n/a | restarting:unknown |
| 6 | 503 | 503 | n/a | restarting:unknown |
| 7 | 503 | 503 | n/a | restarting:unknown |
| 8 | 503 | 503 | n/a | restarting:unknown |

Final API regression check:

- Public API `https://api.soar.luckysparrow.ch/health` -> `200`.
- Public API `https://api.soar.luckysparrow.ch/ready` -> `200`.

## Result

Status: failed closed.

The single permitted redeploy did not recover `soar-web`. The permit stop
condition was met because Web stayed `503`, build-info did not expose the
expected SHA, and Coolify returned to `restarting:unknown`.

Next owner/action:

- Ops Release Lead may now use the approved read-only log/history path from
  [LUC-2289](/LUC/issues/LUC-2289) to retrieve redacted deployment chronology
  and choose the next recovery action under a separate permit.
- Rollback remains unauthorized until the previous stable deployment/image or
  source ref is identified from approved evidence.

