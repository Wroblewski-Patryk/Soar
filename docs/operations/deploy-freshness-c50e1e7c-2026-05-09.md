# Deploy Freshness Evidence - c50e1e7c (2026-05-09)

## Status
- Result: **PASS**
- Environment: production
- Candidate SHA: `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`
- Web base URL: `https://soar.luckysparrow.ch`
- API base URL: `https://api.soar.luckysparrow.ch`
- Evidence date: 2026-05-09

## Build Info Freshness

Command:

```powershell
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha c50e1e7c --timeout-seconds 900 --interval-seconds 15
```

Accepted result:

```text
[wait:web-build-info] attempt=27 status=200 gitSha=c50e1e7cf1e37d9c799031cacbb30a834f57e81d expected=c50e1e7c
[wait:web-build-info] PASS
```

Notes:
- Attempts 1 through 26 still reported the previous deployed SHA
  `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`.
- Attempt 27 is the accepted production freshness evidence for `c50e1e7c`.

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
node scripts\runV1FinalPreflight.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha c50e1e7cf1e37d9c799031cacbb30a834f57e81d --today 2026-05-09 --json-output docs\operations\_artifacts-v1-final-preflight-c50e1e7c-2026-05-09.json --markdown-output docs\operations\v1-final-preflight-c50e1e7c-2026-05-09.md
```

Result:
- Build-info: PASS
- Public smoke: PASS
- Final V1 status: `BLOCKED`
- Blocking families: missing live-import auth, missing rollback auth, missing
  production DB restore context, failed RC evidence, missing `LIVEIMPORT-03`,
  stale restore evidence, and stale rollback proof.

## Scope

This evidence confirms that the pushed protected-operator-pack/source-of-truth
batch ending at `c50e1e7c` is deployed on the production Web build-info
endpoint and that public API/Web smoke checks pass.

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
