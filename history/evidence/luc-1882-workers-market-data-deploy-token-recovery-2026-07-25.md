# LUC-1882 Evidence

Date: 2026-07-25
Issue: `LUC-1882`
Scope: `workers-market-data` only
Mode: bounded Coolify deploy-token mutation plus read-only verification

## Context

- Wake scope:
  `[Soar][Coolify Credential Routing Repair] Recover workers-market-data with deploy token`.
- Prior DRE owner-path attempts on Saturday, July 25, 2026 ended at:
  `POST /api/v1/applications/{workers-market-data}/start -> 403 Forbidden`
  with `{"message":"Missing required permissions: deploy"}`.
- This heartbeat materially changed the auth path because
  `COOLIFY_DEPLOY_API_TOKEN` is now present by name in the runner alongside the
  existing read-only Coolify bindings.

## Pre-Mutation Readback

- Read-only Coolify application detail at `2026-07-25T21:23:04.362Z` showed:
  - `workers-market-data -> exited:unhealthy`
  - `last_online_at=2026-07-25 18:17:37`
  - `restart_count=0`
  - `updated_at=2026-07-25T18:18:36.000000Z`
  - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`

## Approved Mutation

- Presence-only env verification confirmed:
  `COOLIFY_DEPLOY_API_TOKEN`, `COOLIFY_SOAR_WORKER_MARKET_DATA_APP_ID`,
  `COOLIFY_BASE_URL`, and the read-only Coolify bindings are present by name.
- Exact action executed once:
  `POST /api/v1/applications/{workers-market-data}/start`
  using `$env:COOLIFY_DEPLOY_API_TOKEN`.
- Result at `2026-07-25T21:23:21.040Z`:
  - HTTP `200`
  - body:
    `{"message":"Deployment request queued.","deployment_uuid":"fd5ok3jdxg69lonnyeyagt9y"}`

## Deployment And App Readback

- Read-only follow-up on deployment
  `fd5ok3jdxg69lonnyeyagt9y` showed:
  - `status=in_progress` during the initial queue window;
  - `status=finished` by `2026-07-25T21:26:40.999Z`;
  - `finished_at=2026-07-25T21:25:19.000000Z`.
- Read-only application detail after deployment completion showed:
  - `workers-market-data -> running:unknown`
  - `last_online_at=2026-07-25 21:26:35`
  - `restart_count=0`
  - `updated_at=2026-07-25T21:26:35.000000Z`
  - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`

## Public Smoke

- Public smoke rechecked with `curl.exe` after the PowerShell
  `Invoke-WebRequest` path returned a false local null-reference failure in this
  runner.
- Observed results:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`

## Outcome Interpretation

- The previous blocker is resolved:
  the issue is no longer blocked on missing Coolify `deploy` permission for the
  exact `workers-market-data` start action.
- The exact bounded recovery objective is achieved:
  the deploy token accepted the mutation, the deployment finished, and the
  worker returned from `exited:unhealthy` to `running:unknown`.
- Public Soar health remained green after the targeted worker recovery.

## Conclusion

Current state after this heartbeat:

`DONE / DEPLOY_TOKEN_ROUTE_CONFIRMED / WORKERS_MARKET_DATA_RUNNING_UNKNOWN / PUBLIC_SMOKE_GREEN`

`LUC-1882` closes the credential-routing repair for the exact
`workers-market-data` mutation boundary. No unrelated Soar resource, env, team,
database, or account state was mutated in this lane.
