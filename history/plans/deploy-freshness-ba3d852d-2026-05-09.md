# Deploy Freshness - ba3d852d

Date: 2026-05-09

## Summary

Production Web build-info reached the pushed docs/source-of-truth batch ending
at `ba3d852d5126b625a8cf702ab647d5c644d86f9c`.

This batch is docs/evidence/status synchronization only. It records the
`010b4f8b` deploy freshness, closes the historical `1f1d9c12` deploy-lag queue
entry, and syncs the stale historical `V1TRUTH-01` checkbox. It does not enable
Gate.io paper/live/authenticated capabilities and does not change runtime code.

## Verification

```powershell
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha ba3d852d5126b625a8cf702ab647d5c644d86f9c --timeout-seconds 180 --interval-seconds 15
```

Result:

```text
[wait:web-build-info] attempt=1 status=200 gitSha=010b4f8b6abfaf4c24d26550eb4761215d119f21 expected=ba3d852d5126b625a8cf702ab647d5c644d86f9c
[wait:web-build-info] attempt=2 status=200 gitSha=ba3d852d5126b625a8cf702ab647d5c644d86f9c expected=ba3d852d5126b625a8cf702ab647d5c644d86f9c
[wait:web-build-info] PASS
```

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

## Final V1 Preflight

The no-secret final V1 preflight for `ba3d852d` reports:

- PASS deployed Web build-info.
- PASS public API/Web smoke.
- BLOCKED protected/formal release evidence.

Artifacts:

- `history/artifacts/_artifacts-v1-final-preflight-ba3d852d-2026-05-09.json`
- `history/releases/v1-final-preflight-ba3d852d-2026-05-09.md`

Remaining blockers:

- missing live-import auth
- missing rollback guard auth
- missing production DB restore context for current-date evidence
- failed/open RC evidence
- missing `LIVEIMPORT-03` runtime readback
- stale 2026-05-08 backup/restore drill evidence for the 2026-05-09 evidence date
- stale 2026-05-08 rollback proof pack for the 2026-05-09 evidence date

## Release Posture

This deploy is public-smoke healthy but not V1-release ready. Protected V1
readiness still requires operator-supplied authenticated application access,
rollback auth, production DB/Coolify restore context, real RC approval
identities, and authenticated/admin UI access.
