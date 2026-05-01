# V1EXCEL-04 Stage And Coolify Access Refresh

Date: 2026-05-01
Environment: stage / Coolify
Scope: stage restore preflight, deploy freshness blocker classification
Status: BLOCKED

## Summary

Fresh follow-up verification confirms the stage target is still unavailable
before any protected-route or application-level checks can run. Public stage
web/API requests return `503 no available server`.

Production remains healthy at public health/readiness endpoints, but the
production web build-info still reports commit `8db496373763d3a1fa58b15dc1dffa8268f3fe5f`,
not the newer `V1DCA-02` fix commit `8580ea4e`. The DOGEUSDT post-deploy DCA
verification is therefore blocked until production deploy freshness catches up.

No secrets, passwords, session cookies, or tokens are recorded in this
artifact.

## Stage Public Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers
```

Result: FAIL

- API `/health`: `503`
- API `/ready`: `503`
- Web `/`: `503`

Direct preflight reads:

- `GET https://stage-api.soar.luckysparrow.ch/health` => `503`, `no available server`
- `GET https://stage-api.soar.luckysparrow.ch/ready` => `503`, `no available server`
- `GET https://stage.soar.luckysparrow.ch/` => `503`, `no available server`
- `GET https://stage.soar.luckysparrow.ch/api/build-info` => `503`, `no available server`

## Production Freshness Preflight

Public production preflight:

- `GET https://api.soar.luckysparrow.ch/health` => `200`
- `GET https://api.soar.luckysparrow.ch/ready` => `200`
- `GET https://soar.luckysparrow.ch/api/build-info` => `200`

Build-info result:

```json
{
  "gitSha": "8db496373763d3a1fa58b15dc1dffa8268f3fe5f",
  "gitRef": "main"
}
```

Expected for the latest DOGEUSDT DCA fix:

```text
8580ea4e
```

## Coolify Access Check

The Coolify web login succeeds with the provided Coolify operator account and
opens the Coolify dashboard, but the visible project/environment does not expose
the Soar application resources needed to restart stage or trigger production
deploys. The visible project is `My first project`, environment `production`,
and the rendered resource list exposes no Soar applications.

The Coolify API endpoints remain unavailable without a bearer API token:

- `GET /api/v1/applications` => `401`
- `GET /api/v1/resources` => `401`

The production application login credentials are not valid Coolify credentials.

## Classification

This is not a Soar code blocker. The current blocker is environment ownership:

- stage service routing is still unavailable at the proxy/Coolify layer
- production deploy freshness has not reached the latest pushed `main` commit
- the available Coolify login is insufficient to identify and operate the Soar
  resources through HTTP/API automation from this session

## Next Required Operator Action

Provide one of the following:

- a Coolify API bearer token with read/deploy access to the actual Soar
  applications, or
- Coolify team/resource access for the operator account that exposes the Soar
  web/API/stage/prod resources, or
- manually trigger the production deploy for `8580ea4e` and restore/redeploy
  the stage web/API services.

After deploy freshness is confirmed on production, rerun protected DOGEUSDT
runtime positions verification and expect the current lifecycle to show both
persisted DCA fills.
