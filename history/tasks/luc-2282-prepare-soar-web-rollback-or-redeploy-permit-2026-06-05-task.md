# LUC-2282 Prepare Soar Web Rollback Or Redeploy Permit

Date: 2026-06-05
Owner: Ops Release Lead
Stage: release

## Context

[LUC-2280](/LUC/issues/LUC-2280) permitted exactly one controlled `soar-web`
restart for the production web `503` / restarting state. That restart did not
restore web readiness. [LUC-2282](/LUC/issues/LUC-2282) was assigned to prepare
the next legal rollback or redeploy permit without performing another
production mutation.

## Goal

Prepare a redacted, evidence-backed permit for the next production action on
`soar-web`: rollback, redeploy, or block with the exact missing owner/action.

## Constraints

- No deploy, rollback, second restart, env edit, database action, team setting
  change, protected smoke, account action, live-trading action, or secret
  disclosure under this preparation issue.
- Use read-only public smoke and read-only Coolify evidence only.
- Do not store token values, cookies, raw resource ids, generated database
  suffixes, or unredacted logs.
- Target only `Soar / production / soar-web`; API, DB, Redis, and workers are
  outside the mutation scope.

## Definition Of Done

- Current `soar-web` failure is rechecked with read-only evidence.
- Source commit and remote branch state are verified.
- Permit fields are complete: target resource, action, expected source/image,
  rollback path, stop condition, smoke plan, and secret handling rule.
- Residual risk and next owner are explicit.

## Forbidden

- Do not mutate production in this issue.
- Do not use a dirty local tree as deploy source.
- Do not print or persist Coolify credentials, cookies, secret values, raw
  resource ids, generated database suffixes, or raw logs.

## Evidence

| Check | Result |
| --- | --- |
| Wake payload | consumed scoped [LUC-2282](/LUC/issues/LUC-2282); `fallbackFetchNeeded=no`; checkout already claimed by harness |
| Source ref | `main` at `6e31d814046b640ad529d1cd57f968ba6f67b05e`; `origin/main` resolves to the same SHA |
| Dirty tree triage | existing state/evidence/task files from prior issue; no deployable product-code edit used as release source |
| Public smoke | `API /health` pass `200`; `API /ready` pass `200`; `WEB /` fail `503`; `WEB /api/build-info` fail `503` |
| Coolify `soar-web` metadata | read-only app metadata pass; name `soar-web`; status `restarting:unknown`; `last_restart_type=crash`; `last_restart_at=2026-06-05T20:36:37Z`; `restart_count=54`; health check disabled; exposed port `3002`; branch `main`; commit setting `HEAD` |
| Coolify `soar-web` app logs endpoint | read-only request returned `400` with message `Application is not running.` |

## Release Interpretation

The failure is web-only from the public edge perspective: API health and
readiness are green, while both the web root and web build-info endpoint return
`503`. Coolify metadata shows `soar-web` is crash-restarting rather than merely
serving a bad route. Because `/api/build-info` is also `503`, deployed SHA
freshness cannot be proven from the running web container.

The safest next mutation is a single `soar-web` redeploy from the pushed
`main` source ref at exact SHA `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
This is narrower than stack-wide rollback and avoids API, database, Redis, and
worker changes while attempting to restore the broken web container from a
known pushed source ref.

## Prepared Redeploy Permit

| Field | Permit |
| --- | --- |
| Coolify project/environment | `Soar` / `production` |
| Target resource | `soar-web` application only |
| Action | one controlled redeploy from branch `main` |
| Expected source | exact pushed SHA `6e31d814046b640ad529d1cd57f968ba6f67b05e` on `origin/main` |
| Expected outcome | `soar-web` exits crash loop, serves `/`, and exposes `/api/build-info` with the expected SHA |
| Exclusions | no API, DB, Redis, worker, env, team, account, secret, protected-smoke, exchange, or live-trading mutation |
| Secret handling | use existing Paperclip/Coolify bindings only; never print token, cookie, env secret, raw resource id, or generated database suffix |
| Stop condition | stop after one redeploy attempt if `soar-web` remains `503`, Coolify returns to `restarting:unknown`, or build-info does not match the expected SHA after eight 15-second polls |
| Required smoke | public `API /health`, public `API /ready`, public `WEB /`, public `WEB /api/build-info`, then `pnpm run ops:coolify-stack:env-check:test` locally |
| Rollback path | if redeploy worsens or does not recover, do not perform a second mutation under the same permit; block the parent gate and require Security/Ops-approved host/Coolify deployment log export plus a new explicit rollback permit naming the previous stable deployment/image selected from Coolify deployment history |

## Result Report

Status: done as preparation. No production mutation was performed.

Recommended next owner/action: Ops may execute exactly one `soar-web` redeploy
under the prepared permit above. If the redeploy fails the stop condition,
fail closed and route host/Coolify deployment log export through Security/Ops
before any rollback or second recovery mutation.

Residual risk: previous stable deployment/image could not be named from the
read-only endpoints used in this heartbeat; therefore this permit authorizes
redeploy only, not rollback execution.
