# V1EXCEL-04 Stage Refresh Evidence

Date: 2026-05-01
Environment: stage
Scope: stage public smoke and deploy freshness preflight
Status: BLOCKED

## Summary

Fresh stage verification on 2026-05-01 cannot proceed to authenticated release
or runtime gates because the stage web and API targets currently return
`503 no available server`.

No secrets, tokens, or credentials are recorded in this artifact.

## Commands

Public smoke:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers
```

Result: FAIL

- API `/health`: `503`
- API `/ready`: `503`
- Web `/`: `503`

Direct preflight reads:

- `GET https://stage.soar.luckysparrow.ch/api/build-info` => `503`,
  `no available server`
- `GET https://stage-api.soar.luckysparrow.ch/health` => `503`,
  `no available server`
- `GET https://stage-api.soar.luckysparrow.ch/ready` => `503`,
  `no available server`

## Classification

The blocker is not application-level authentication or a protected OPS route.
The stage deployment target is unavailable before protected routes are reached.

## Next Required Operator Action

Restore or redeploy the stage web/API services in Coolify, then rerun:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers
```

After public stage smoke is green, rerun authenticated runtime freshness and
rollback guard checks for the stage target.
