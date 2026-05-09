# Deploy Freshness - e8cd748e

Date: 2026-05-09

## Summary

Production Web build-info reached the pushed docs/evidence batch ending at
`e8cd748e80b8693087e01beb21b0085ace747c49`.

This batch records public UI access evidence and synchronizes source-of-truth
handoff text after `745b5f5a`. It is docs/evidence only. It does not change
runtime behavior, does not enable Gate.io paper/live/authenticated
capabilities, and does not close protected V1 evidence.

## Verification

Initial sandboxed wait:

```powershell
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha e8cd748e80b8693087e01beb21b0085ace747c49 --timeout-seconds 900 --interval-seconds 30
```

Result: timed out with repeated `fetch failed` and `lastSeenSha=n/a`. This was
classified as a sandbox/network false negative because the follow-up public
check with approved network access passed immediately.

Follow-up command:

```powershell
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha e8cd748e80b8693087e01beb21b0085ace747c49 --timeout-seconds 300 --interval-seconds 15
```

Result:

```text
[wait:web-build-info] attempt=1 status=200 gitSha=e8cd748e80b8693087e01beb21b0085ace747c49 expected=e8cd748e80b8693087e01beb21b0085ace747c49
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

The no-secret final V1 preflight for `e8cd748e` reports:

- PASS deployed Web build-info.
- PASS public API/Web smoke.
- BLOCKED protected/formal release evidence.

Command:

```powershell
node scripts\runV1FinalPreflight.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha e8cd748e80b8693087e01beb21b0085ace747c49 --today 2026-05-09 --json-output docs\operations\_artifacts-v1-final-preflight-e8cd748e-2026-05-09.json --markdown-output docs\operations\v1-final-preflight-e8cd748e-2026-05-09.md
```

Result: expected exit `1` because the preflight is correctly `BLOCKED` on
protected/formal evidence after public checks pass.

Artifacts:

- `docs/operations/_artifacts-v1-final-preflight-e8cd748e-2026-05-09.json`
- `docs/operations/v1-final-preflight-e8cd748e-2026-05-09.md`

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
