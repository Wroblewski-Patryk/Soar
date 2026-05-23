# V1GATE-01 Current Target Freshness Refresh

Date: 2026-05-01
Environment: production / stage
Scope: public deploy freshness and stage availability preflight
Status: BLOCKED

## Summary

Fresh public preflight confirms production remains reachable, but stage is still
unavailable before authenticated or application-level checks can run. Production
now reports deployed commit `662ce9b48fac6a48963a62f8d3bc4ac2f645cac6` on
`main`, which is an ancestor of the current local `HEAD`
`ef37fca0c4a3c47605986a815b5323fd535a37fa`.

The newest local commits not present on production are:

- `ef37fca0 chore: add autonomous engineering loop`
- `1e20b6df fix(web-wallets): fail closed unavailable preview ledger`
- `ca430aa5 docs(governance): add reusable function coverage ledger standard`

No secrets, passwords, session cookies, or tokens were used or recorded in this
artifact.

## Production Public Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: PASS

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `200`

Production build-info:

```json
{
  "buildId": "Wt22JzaLDv05vzGvpm7HA",
  "gitSha": "662ce9b48fac6a48963a62f8d3bc4ac2f645cac6",
  "gitRef": "main",
  "metadataGeneratedAt": null,
  "metadataSource": "env-runtime",
  "checkedAt": "2026-05-01T17:43:49.730Z"
}
```

## Stage Public Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://stage-api.soar.luckysparrow.ch --web-base-url https://stage.soar.luckysparrow.ch --no-workers
```

Result: FAIL

- API `/health`: `503`
- API `/ready`: `503`
- Web `/`: `503`

Direct preflight reads also returned `503` for:

- `GET https://stage-api.soar.luckysparrow.ch/health`
- `GET https://stage.soar.luckysparrow.ch/`

## Classification

This refresh does not identify a new Soar code blocker. It confirms the active
V1 blockers remain operational and evidence-related:

- stage web/API routing is still unavailable at the target environment layer;
- production is healthy publicly but not fully fresh against local `HEAD`;
- protected production runtime, restore drill, sign-off, and manual operator
  evidence still require the existing authenticated/operator execution context.

## Next Required Operator Action

To progress final V1 release gates, provide or execute one of the following:

- restore or redeploy stage web/API services in Coolify and rerun stage smoke;
- deploy `ef37fca0c4a3c47605986a815b5323fd535a37fa` or later to production if
  the wallet-preview fail-closed slice is considered in-scope for the release
  candidate;
- provide production DB restore-drill container settings or run the restore
  drill from the VPS/Coolify execution context;
- complete or explicitly waive the remaining manual operator matrix and fill
  the release sign-off approver fields.
