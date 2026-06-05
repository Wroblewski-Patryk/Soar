# LUC-2293 Controlled soar-web Rollback Evidence

Date: 2026-06-05
Owner: Ops Release Lead
Process: release/deploy gate

## Scope

Release permit [LUC-2293](/LUC/issues/LUC-2293) authorized exactly one
controlled Coolify rollback/redeploy of `Soar / production / soar-web` to the
previous finished source candidate:

`b894e5dd30614dfd2035e91e3d848c842d3ff380`

No other Soar resource or account state was in scope.

## Precheck

| Check | Result |
| --- | --- |
| `git rev-parse HEAD` | `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| `git rev-parse origin/main` | `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| Dirty tree | Existing prior release state/evidence files present; no dirty file was used as release source |
| Public API `/health` | `200` |
| Public API `/ready` | `200` |
| Public Web `/` | `503` |
| Public Web `/api/build-info` | `503` |
| Coolify `soar-web` readback before mutation | `restarting:unknown`, branch `main`, no fixed source commit override |

## Mutation

Coolify did not expose a successful app-specific deployment-list endpoint on
this instance; it returned `404`, matching earlier release evidence. The
official Coolify API surface supports authenticated application update/readback
and resource deploy requests, while Coolify application documentation describes
rollback as previous local-image rollback. Because this permit named an exact
source SHA, Ops used the safest source-specific path available from the API:

1. Update `soar-web` application `git_commit_sha` to
   `b894e5dd30614dfd2035e91e3d848c842d3ff380`.
2. Trigger one deploy for the `soar-web` application resource.

Result: update accepted; deploy request accepted for one resource. Raw resource
and deployment ids were not recorded.

No API, worker, Postgres, Redis, env, team/account, protected-smoke, exchange,
force-start, second restart, second deploy, or live-trading mutation was
performed.

## Postcheck

Eight polls were run at 15-second intervals after the deploy request:

| Poll | Web `/` | Web `/api/build-info` | build-info SHA | Coolify status | Coolify source SHA |
| --- | --- | --- | --- | --- | --- |
| 1 | 503 | 503 | n/a | restarting:unknown | b894e5dd30614dfd2035e91e3d848c842d3ff380 |
| 2 | 503 | 503 | n/a | restarting:unknown | b894e5dd30614dfd2035e91e3d848c842d3ff380 |
| 3 | 502 | 503 | n/a | restarting:unknown | b894e5dd30614dfd2035e91e3d848c842d3ff380 |
| 4 | 503 | 503 | n/a | restarting:unknown | b894e5dd30614dfd2035e91e3d848c842d3ff380 |
| 5 | 503 | 503 | n/a | restarting:unknown | b894e5dd30614dfd2035e91e3d848c842d3ff380 |
| 6 | 503 | 503 | n/a | restarting:unknown | b894e5dd30614dfd2035e91e3d848c842d3ff380 |
| 7 | 503 | 503 | n/a | restarting:unknown | b894e5dd30614dfd2035e91e3d848c842d3ff380 |
| 8 | 503 | 503 | n/a | restarting:unknown | b894e5dd30614dfd2035e91e3d848c842d3ff380 |

Final API regression check:

- Public API `https://api.soar.luckysparrow.ch/health` -> `200`.
- Public API `https://api.soar.luckysparrow.ch/ready` -> `200`.

Focused local regression:

```text
pnpm run ops:coolify-stack:env-check:test

PASS: 8/8 tests.
```

## Result

Status: failed closed.

The single permitted rollback/redeploy did not recover `soar-web`. The permit
stop condition was met because Web stayed `503`/`502`, build-info did not
expose the rollback SHA, and Coolify remained `restarting:unknown` throughout
the polling window. API health and readiness remained green.

Important residual state: Coolify `soar-web` remains pinned to
`b894e5dd30614dfd2035e91e3d848c842d3ff380`, but the service did not recover.
Do not perform another mutation under [LUC-2293](/LUC/issues/LUC-2293).

Next owner/action: CTO/Ops must approve the next explicit recovery permit,
choosing between host-level Coolify queue/runtime repair, redacted container
crash investigation, proxy/runtime repair, or another named source/image
action.

## Safety

No secret values, cookies, webhook URLs, raw resource ids, raw deployment ids,
generated database suffixes, host paths, internal IPs, unredacted logs,
screenshots, account data, exchange settings, or live-trading state were
printed or stored.
