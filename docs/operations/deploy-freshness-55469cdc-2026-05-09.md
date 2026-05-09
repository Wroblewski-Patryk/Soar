# Deploy Freshness Evidence - 55469cdc (2026-05-09)

## Status
- Result: **PASS**
- Environment: production
- Candidate SHA: `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`
- Web base URL: `https://soar.luckysparrow.ch`
- API base URL: `https://api.soar.luckysparrow.ch`
- Evidence date: 2026-05-09

## Build Info Freshness

Command:

```powershell
node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 55469cdc2ad888b822c8cdbd86660c4ed5166e1c --timeout-seconds 900 --interval-seconds 15
```

Result:

```text
[wait:web-build-info] attempt=21 status=200 gitSha=55469cdc2ad888b822c8cdbd86660c4ed5166e1c expected=55469cdc2ad888b822c8cdbd86660c4ed5166e1c
[wait:web-build-info] PASS
```

Notes:
- Attempts 1 through 20 returned HTTP 200 with the previous deployed SHA
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`.
- Attempt 21 returned the expected candidate SHA.

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

## No-Secret Final Preflight

Command:

```powershell
node scripts/runV1FinalPreflight.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 55469cdc2ad888b822c8cdbd86660c4ed5166e1c --today 2026-05-09 --json-output docs/operations/_artifacts-v1-final-preflight-55469cdc-2026-05-09.json --markdown-output docs/operations/v1-final-preflight-55469cdc-2026-05-09.md
```

Result:
- Build-info: PASS
- Public smoke: PASS
- Final V1 status: `BLOCKED`
- Blocking families: missing live-import auth, missing rollback auth, missing
  production DB restore context, failed RC evidence, missing `LIVEIMPORT-03`,
  stale restore evidence, and stale rollback proof.

Notes:
- An earlier sandboxed preflight attempt produced network `fetch failed`
  results and `EPERM` while writing the JSON artifact. That output is rejected
  as environment-blocked evidence. The accepted preflight evidence above was
  rerun with approved escalated access and wrote the JSON/Markdown artifacts.

## Scope

This evidence confirms that the pushed source-of-truth synchronization batch
ending at `55469cdc` is deployed on the production Web build-info endpoint and
that the public API/Web smoke checks pass.

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
