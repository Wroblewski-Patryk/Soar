# Deploy Freshness - 30b027b7

Date: 2026-05-09

## Summary

Production Web build-info reached the pushed protected-backlog sync batch
ending at `30b027b78544f76b5b638851e8e27c98f6d22ab5`.

This batch is docs/runbook synchronization only. It records the `ba3d852d`
deploy evidence and retargets protected V1 backlog/runbook instructions to the
current deployed SHA. It does not change runtime behavior, does not enable
Gate.io paper/live/authenticated capabilities, and does not close protected V1
evidence.

## Verification

```powershell
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 30b027b78544f76b5b638851e8e27c98f6d22ab5 --timeout-seconds 240 --interval-seconds 15
```

Result: timed out after 16 attempts with production still on
`ba3d852d5126b625a8cf702ab647d5c644d86f9c`.

Follow-up command:

```powershell
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 30b027b78544f76b5b638851e8e27c98f6d22ab5 --timeout-seconds 180 --interval-seconds 15
```

Result:

```text
[wait:web-build-info] attempt=11 status=200 gitSha=30b027b78544f76b5b638851e8e27c98f6d22ab5 expected=30b027b78544f76b5b638851e8e27c98f6d22ab5
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

The no-secret final V1 preflight for `30b027b7` reports:

- PASS deployed Web build-info.
- PASS public API/Web smoke.
- BLOCKED protected/formal release evidence.

Artifacts:

- `history/artifacts/_artifacts-v1-final-preflight-30b027b7-2026-05-09.json`
- `history/releases/v1-final-preflight-30b027b7-2026-05-09.md`

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
