# Post-Push Build-Info Readback - 2026-05-19

## Scope

Target commit: `36ff999d`

Target branch: `codex/v1-proof-and-ops-evidence`

This is a read-only `AUD-19` follow-up after pushing the reusable audit and
decision-sync commit. It checks whether public production build-info exposes the
pushed commit and whether the currently deployed public endpoints are healthy.

## Safety

- No production data mutation.
- No LIVE order submit/cancel/close.
- No exchange-side mutation.
- No existing production data mutation.
- No protected authenticated production journey.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Web build-info wait for `36ff999d` | `FAIL_STALE_SHA` | `ops:deploy:wait-web-build-info` polled `6` times over `60s`; last seen SHA stayed `1586f59261cef94d7c513d71bbfcfb697d11ca59`. |
| Direct build-info readback | `STALE_FOR_TARGET` | `gitSha` is `1586f59261cef94d7c513d71bbfcfb697d11ca59`, `gitRef` is `main`, `buildId` is `PoxMXEACiCr5Aeb3f-lev`. |
| Public deploy smoke, no workers | `PASS` | API `/health` `200`, API `/ready` `200`, Web `/` `200`. |

## Commands

```bash
corepack pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 36ff999d --timeout-seconds 60 --interval-seconds 10
corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers
```

## Conclusion

Production public smoke is healthy for the currently deployed `main` SHA, but
production does not expose the pushed audit commit `36ff999d`.

Do not claim `36ff999d` is deployed or production-ready from this readback. A
fresh `AUD-19` production release gate still requires the target SHA to appear
in build-info plus the approved protected runtime, rollback, backup/restore,
and sign-off evidence.
