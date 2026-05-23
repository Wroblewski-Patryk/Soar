# Deploy Freshness Evidence - 4792fbca (2026-05-09)

## Status
- Result: **PASS**
- Environment: production
- Candidate SHA: `4792fbca9ab3ca44d08c312f219f70d648707886`
- Web base URL: `https://soar.luckysparrow.ch`
- API base URL: `https://api.soar.luckysparrow.ch`
- Evidence date: 2026-05-09

## Build Info Freshness

Command:

```powershell
node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 4792fbca --timeout-seconds 900 --interval-seconds 30
```

Result:

```text
[wait:web-build-info] attempt=14 status=200 gitSha=4792fbca9ab3ca44d08c312f219f70d648707886 expected=4792fbca
[wait:web-build-info] PASS
```

Notes:
- Attempts 1 through 13 returned HTTP 200 with the previous deployed SHA
  `633968716255eded3bf068201f4d96d8e2b43c1e`.
- Attempt 14 returned the expected candidate SHA.

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

This evidence confirms that the pushed batch ending at `4792fbca` is deployed
on the production Web build-info endpoint and that the public API/Web smoke
checks pass. It does not prove authenticated dashboard/admin flows,
`LIVEIMPORT-03`, production restore drill, rollback proof, RC approval, or the
final non-dry-run V1 release gate.

## Residual Blockers
- Protected production app/operator auth is still required for `LIVEIMPORT-03`
  runtime readback and rollback proof.
- Approved production DB/Coolify context is still required for the current
  restore drill evidence date.
- RC Gate 4 still requires real approver identities and final approval.
- Full production UI module clickthrough still requires authenticated/admin
  production app access.
