# Operations, Release, And Deployment Audit - 2026-05-19

Audit ID: `AUD-19`
Status: current local / historical production release gate
Environment: local

## Scope

This audit refreshes local release safety evidence for type contracts, lint,
production build, go-live smoke, local database restore check, cleanup, and
runbook parity. It also records the boundary to the historical production gate
for deployed `457bce05`.

No production journey, production deploy, production database mutation, LIVE
order/cancel/close, exchange-side mutation, or existing production data mutation
was performed.

## Evidence Run

| Check | Result | Evidence |
| --- | --- | --- |
| Typecheck | PASS | `corepack pnpm run typecheck`; API `tsc --noEmit`, Web `tsc --noEmit` |
| Lint | PASS | `corepack pnpm run lint`; Web lint reported no warnings or errors |
| Build | PASS | `corepack pnpm run build`; mobile scaffold echo, API `tsc`, Web Next production build with `30` static pages generated |
| Local go-live smoke | PASS | `corepack pnpm run test:go-live:smoke`; API `4` files / `45` tests, Web `3` files / `18` tests; local infra was started and stopped by the script |
| Local DB backup/restore check without infra | FAIL_EXPECTED_FINDING | `corepack pnpm run ops:db:backup-restore:check-local` failed because no Postgres container was running |
| Local DB backup/restore check with infra | PASS | After `corepack pnpm run go-live:infra:up`, `corepack pnpm run ops:db:backup-restore:check-local` produced `docs/operations/v1-db-restore-check-2026-05-19T01-30-47-200Z.md` and `_artifacts-db-restore-check-2026-05-19T01-30-47-200Z.txt`; infra was then stopped |
| Cleanup | PASS | Docker services stopped; ports `5432`/`6379` and `chrome-headless-shell` were checked in closure validation |

## Current Truth

- Local release safety is green for typecheck, lint, build, go-live smoke, and
  local backup/restore check when the required local Postgres container exists.
- `ops:db:backup-restore:check-local` is container-dependent; running it after
  infra shutdown is an expected operational failure, not database evidence.
- 2026-05-19 post-push readback for commit `36ff999d` found production
  build-info still on `1586f59261cef94d7c513d71bbfcfb697d11ca59` (`gitRef:
  main`) after a 60-second wait. Public smoke passed for the currently deployed
  production service, but `36ff999d` is not production-ready by build-info.
- 2026-05-19 follow-up confirmed production tracks `main`: `origin/main`
  matched `1586f59261cef94d7c513d71bbfcfb697d11ca59`, while the audit branch
  was ahead. A fast-forward push promoted `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`
  to `origin/main`; production build-info reached that SHA on attempt `8`, and
  public API/Web smoke passed.
- Production release readiness remains historical for the 2026-05-14
  `457bce05` target. Any new production deploy needs fresh build-info, smoke,
  protected runtime, rollback, backup/restore, and sign-off evidence.

## Findings

| ID | Severity | Status | Finding | Evidence / Next Action |
| --- | --- | --- | --- | --- |
| AUD-OPS-001 | P0 | passed | Local typecheck/lint/build release gates pass. | `corepack pnpm run typecheck`, `lint`, and `build` passed. |
| AUD-OPS-002 | P0 | passed | Local go-live smoke passes and cleans up its local infra. | API `45/45`, Web `18/18`; Docker down after script. |
| AUD-OPS-003 | P1 | passed with precondition | Local backup/restore check passes only when local Postgres container is running. | First run failed with no container; rerun after `go-live:infra:up` passed and produced a dated restore report. |
| AUD-OPS-004 | P1 | open freshness follow-up | Production release gate was not rerun for a new deployment target. | Keep 2026-05-14 `457bce05` as historical production evidence only; rerun production gates before any new release claim. |
| AUD-OPS-005 | P2 | observation | Mobile build remains scaffold-only. | Root build prints `Mobile scaffold only. Build not enabled yet.`; tracked under `AUD-21`. |
| AUD-OPS-006 | P1 | blocked by stale target build-info | Post-push production build-info did not expose `36ff999d`; it stayed on `1586f59261cef94d7c513d71bbfcfb697d11ca59` while public smoke passed for the deployed service. | `docs/operations/post-push-build-info-readback-36ff999d-2026-05-19.md`; promote/deploy the intended target or wait for the correct production pipeline, then rerun build-info and release-gate checks. |
| AUD-OPS-007 | P1 | public deploy freshness passed / protected gate still open | Production tracks `main`; after fast-forwarding `origin/main` to `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`, build-info freshness and public API/Web smoke passed. | `docs/operations/main-promotion-build-info-dd1a1faf-2026-05-19.md`; rerun protected runtime, rollback, backup/restore, and sign-off evidence before any full production readiness claim. |

## Result

`AUD-19` is current for local release safety. Production deployment readiness is
not newly claimed by this audit; it remains tied to the historical
`457bce05` production gate and must be refreshed for any future deploy.
