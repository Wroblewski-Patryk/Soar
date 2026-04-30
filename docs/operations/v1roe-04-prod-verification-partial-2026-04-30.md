# V1ROE-04 Production Verification Partial Evidence - 2026-04-30

## Summary

Status: **BLOCKED - protected auth missing**

The current production deployment is fresh enough for `V1ROE-04` verification,
and public smoke checks pass. The protected runtime evidence required to close
`V1ROE-04` could not be collected from this environment because no production
auth token/session cookie is available and protected endpoints return
`401 Missing token`.

## Target

- Web: `https://soar.luckysparrow.ch`
- API: `https://api.soar.luckysparrow.ch`
- Local timestamp: `2026-04-30T21:51:01.8345725+02:00`

## Deployment Freshness

Public build-info confirms production web is running the current `main`
candidate:

```json
{
  "gitSha": "522e1d95e2612e280ca36eacb825358a3d26f19c",
  "gitRef": "main",
  "metadataSource": "env-runtime",
  "checkedAt": "2026-04-30T19:50:44.559Z"
}
```

This satisfies the deployment-freshness prerequisite for `V1ROE-04`.

## Public Smoke Evidence

Command:

```bash
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

```text
[deploy-smoke] summary
- PASS API /health -> 200
- PASS API /ready -> 200
- PASS WEB / -> 200
[deploy-smoke] all checks passed
```

## Protected Runtime Evidence Attempt

Command:

```bash
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Result:

```text
[ops:deploy:runtime-freshness] failed: runtime freshness request failed with HTTP 401
```

Direct unauthenticated protected probes:

```text
https://api.soar.luckysparrow.ch/dashboard/bots/runtime-sessions -> 401
{"error":{"message":"Missing token"}}

https://api.soar.luckysparrow.ch/workers/runtime-freshness -> 401
{"error":{"message":"Missing token"}}
```

## V1ROE-04 Acceptance Status

- Production candidate freshness: **PASS**
- Public API/web smoke: **PASS**
- Protected `DOGEUSDT` runtime-session positions payload: **BLOCKED**
- Protected `DOGEUSDT` symbol-stats payload: **BLOCKED**
- Dashboard/browser parity evidence: **BLOCKED**
- Closure status: **not closable**

## Required Next Step

Rerun the protected probes with one of:

- `SMOKE_AUTH_TOKEN` / `DEPLOY_FRESHNESS_AUTH_TOKEN`
- `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD`
- `DEPLOY_FRESHNESS_AUTH_EMAIL` + `DEPLOY_FRESHNESS_AUTH_PASSWORD`
- an authenticated browser/API session cookie that can access dashboard runtime
  endpoints

After auth is available, collect the exact `DOGEUSDT` runtime-session
positions, symbol-stats, and dashboard parity evidence defined in
`docs/planning/v1roe-04-production-verification-task-2026-04-30.md`.
