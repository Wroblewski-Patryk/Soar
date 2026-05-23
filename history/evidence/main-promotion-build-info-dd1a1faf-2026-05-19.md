# Main Promotion Build-Info Checkpoint - 2026-05-19

## Scope

Target commit: `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`

Target branch: `main`

This is a read-only `AUD-19` follow-up after confirming that production tracks
`main`, not `codex/v1-proof-and-ops-evidence`, and after fast-forward pushing
the current audit branch HEAD to `origin/main`.

## Safety

- No production data mutation.
- No LIVE order submit/cancel/close.
- No exchange-side mutation.
- No existing production data mutation.
- No protected authenticated production journey.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Remote branch comparison | `PASS` | `origin/main` was an ancestor of `HEAD`; `origin/main` moved from `1586f59261cef94d7c513d71bbfcfb697d11ca59` to `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`. |
| Web build-info wait for `dd1a1faf` | `PASS` | `ops:deploy:wait-web-build-info` passed on attempt `8`; production build-info exposed `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`. |
| Direct build-info readback | `PASS` | `gitSha` is `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`, `gitRef` is `main`, `buildId` is `9ArCoaW6DPdlInYuCZfH_`. |
| Public deploy smoke, no workers | `PASS` | API `/health` `200`, API `/ready` `200`, Web `/` `200`. |

## Commands

```bash
git merge-base --is-ancestor origin/main HEAD
git push origin HEAD:main
corepack pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha dd1a1faf --timeout-seconds 900 --interval-seconds 30
corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers
```

## Conclusion

Production now exposes the audit/decision-sync branch content through
`origin/main` at `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`, and public
API/Web smoke passes for that target.

This does not complete the full protected `AUD-19` release gate. Full
production readiness still requires protected runtime evidence, rollback
proof, backup/restore proof, RC/sign-off evidence, and any approved protected
journey evidence for the exact target environment.
