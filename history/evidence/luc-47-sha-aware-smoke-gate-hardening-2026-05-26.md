# LUC-47 SHA-Aware Smoke Gate Hardening (2026-05-26)

Date: 2026-05-26  
Issue: `LUC-47`  
Lane: Ops Release Lead

## Goal
Reduce acceptance-packet ambiguity by making deploy smoke verify web build-info SHA directly.

## Change
- Updated `scripts/deploySmokeCheck.mjs`:
  - added `--expected-sha <sha>` (or `SMOKE_EXPECTED_SHA`) support,
  - added mandatory `WEB /api/build-info` smoke check,
  - when `--expected-sha` is provided, the check now fails unless
    `build-info.gitSha === expectedSha`.

## Verification
- Command:
  - `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`
- Result:
  - `PASS` API `/health` (`200`)
  - `PASS` API `/ready` (`200`)
  - `PASS` WEB `/` (`200`)
  - `PASS` WEB `/api/build-info` with `gitSha=3fedb7a9170097b40accb6ccea1915064f383f11`

## Operator Use For Temp-Domain Packet
- Public + SHA proof (no protected endpoints):
  - `corepack pnpm run ops:deploy:smoke -- --api-base-url https://<temp-api-host> --web-base-url https://<temp-web-host> --expected-sha <candidate_sha> --skip-workers`
- Protected worker readiness still requires ops auth context and remains a separate acceptance step.

## Lane Disposition
- `blocked` (external deploy-control dependency unchanged: temp-domain stack + protected worker readiness evidence still pending).
