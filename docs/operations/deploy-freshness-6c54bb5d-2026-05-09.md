# Deploy Freshness Evidence - 6c54bb5d (2026-05-09)

## Status
- Result: **PASS**
- Environment: production
- Candidate SHA: `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`
- Web base URL: `https://soar.luckysparrow.ch`
- API base URL: `https://api.soar.luckysparrow.ch`
- Evidence date: 2026-05-09

## Build Info Freshness

Command:

```powershell
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 6c54bb5d --timeout-seconds 900 --interval-seconds 15
```

Accepted result:

```text
[wait:web-build-info] attempt=1 status=200 gitSha=6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623 expected=6c54bb5d
[wait:web-build-info] PASS
```

Notes:
- The first sandboxed network attempt returned repeated `fetch failed` results
  and is rejected as environment-blocked evidence.
- The accepted result above was rerun with approved network access and
  immediately confirmed the deployed SHA.

## Public Smoke

Command:

```powershell
node scripts\deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

```text
[deploy-smoke] summary
- PASS API /health -> 200
- PASS API /ready -> 200
- PASS WEB / -> 200
[deploy-smoke] all checks passed
```

## No-Secret Final Preflight

Command:

```powershell
node scripts\runV1FinalPreflight.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623 --today 2026-05-09 --json-output docs\operations\_artifacts-v1-final-preflight-6c54bb5d-2026-05-09.json --markdown-output docs\operations\v1-final-preflight-6c54bb5d-2026-05-09.md
```

Result:
- Build-info: PASS
- Public smoke: PASS
- Final V1 status: `BLOCKED`
- Blocking families: missing live-import auth, missing rollback auth, missing
  production DB restore context, failed RC evidence, missing `LIVEIMPORT-03`,
  stale restore evidence, and stale rollback proof.

## Scope

This evidence confirms that the pushed source-of-truth/protected-backlog
synchronization batch ending at `6c54bb5d` is deployed on the production Web
build-info endpoint and that public API/Web smoke checks pass.

This does not prove authenticated dashboard/admin flows, protected runtime
readback, `LIVEIMPORT-03`, production restore drill, rollback proof, RC
approval, or the final non-dry-run V1 release gate.

## Residual Blockers
- Protected production app/operator auth is still required for `LIVEIMPORT-03`
  runtime readback and rollback proof.
- Approved production DB/Coolify context is still required for current restore
  drill evidence.
- RC Gate 4 still requires real approver identities and final approval.
- Full production UI module clickthrough still requires authenticated/admin
  production app access.
