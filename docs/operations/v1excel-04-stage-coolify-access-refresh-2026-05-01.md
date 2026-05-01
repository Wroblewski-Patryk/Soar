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
production web build-info now reports commit
`fbeae8f08926bc838141d53397fc142f52945356` on `main`, matching the current
local V1 candidate. Production deploy freshness is no longer the blocker in
this artifact; stage availability and release evidence remain the blockers.

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

Latest recheck on the deploy-fresh production candidate returned the same
result:

- `pnpm run ops:deploy:smoke -- --api-base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers` => FAIL
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

Build-info result after the latest deploy refresh:

```json
{
  "gitSha": "fbeae8f08926bc838141d53397fc142f52945356",
  "gitRef": "main"
}
```

## Coolify Access Check

The Coolify web login succeeds with the provided Coolify operator account and
opens the Coolify dashboard, but the visible project/environment does not expose
the Soar application resources needed to restart stage or trigger production
deploys. The visible project is `My first project`, environment `production`,
and the rendered resource list exposes no Soar applications.

Follow-up inspection found two available team options in the Coolify UI:
`luckysparrow's Team` and `Root Team`. The active session remains on
`luckysparrow's Team`. Attempting to switch to `Root Team` through the rendered
Livewire `switch-team` component returned `500`, so no automated stage restore
or deploy action was attempted from this session.

The Coolify API endpoints remain unavailable without a bearer API token:

- `GET /api/v1/applications` => `401`
- `GET /api/v1/resources` => `401`

The production application login credentials are not valid Coolify credentials.

## Classification

This is not a Soar code blocker. The current blocker is environment ownership:

- stage service routing is still unavailable at the proxy/Coolify layer
- the available Coolify login is insufficient to identify and operate the Soar
  resources through HTTP/API automation from this session

## Next Required Operator Action

Provide one of the following:

- a Coolify API bearer token with read/deploy access to the actual Soar
  applications, or
- Coolify team/resource access for the operator account that exposes the Soar
  web/API/stage/prod resources, or
- manual restoration/redeployment of the stage web/API services from an
  account/session that can access the Soar resources.

After stage public availability is restored, rerun stage public smoke and then
the authenticated stage release gates.
