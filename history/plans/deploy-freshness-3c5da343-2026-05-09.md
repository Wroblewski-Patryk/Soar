# Deploy Freshness Evidence - 3c5da343 (2026-05-09)

## Status
- Result: **PASS**
- Environment: production
- Candidate SHA: `3c5da34371e22aecb1a7aff0a185018870d35cec`
- Web base URL: `https://soar.luckysparrow.ch`
- API base URL: `https://api.soar.luckysparrow.ch`
- Evidence date: 2026-05-09

## Build Info Freshness

Command:

```powershell
node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 3c5da34371e22aecb1a7aff0a185018870d35cec --timeout-seconds 900 --interval-seconds 15
```

Result:

```text
[wait:web-build-info] attempt=25 status=200 gitSha=3c5da34371e22aecb1a7aff0a185018870d35cec expected=3c5da34371e22aecb1a7aff0a185018870d35cec
[wait:web-build-info] PASS
```

Notes:
- Attempts 1 through 24 returned HTTP 200 with the previous deployed SHA
  `4792fbca9ab3ca44d08c312f219f70d648707886`.
- Attempt 25 returned the expected candidate SHA.

## Public Smoke

Command:

```powershell
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

## Scope

This evidence confirms that the pushed batch ending at `3c5da343` is deployed
on the production Web build-info endpoint and that the public API/Web smoke
checks pass. This batch includes the dashboard runtime aggregate current-state
fix and focused dashboard rendering regression coverage.

This does not prove authenticated dashboard/admin flows, protected runtime
readback, `LIVEIMPORT-03`, production restore drill, rollback proof, RC
approval, or the final non-dry-run V1 release gate.

## Residual Blockers
- Protected production app/operator auth is still required for `LIVEIMPORT-03`
  runtime readback and rollback proof.
- Approved production DB/Coolify context is still required for current restore
  drill evidence if existing restore evidence is stale for the target release
  date.
- RC Gate 4 still requires real approver identities and final approval.
- Full production UI module clickthrough still requires authenticated/admin
  production app access.
