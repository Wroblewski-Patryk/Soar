# Deploy Freshness - 1b351a51

Date: 2026-05-22
Environment: production
Target SHA: `1b351a51dab491525777ad340a5c1e290c55eb61`
Status: `BLOCKED_ON_VPS_ROUTE`

## Scope

Record the post-push deployment proof attempt for the public web route
hardening commit.

## Local Proof Before Push

- Targeted auth cache contract: `2/2 PASS`.
- `pnpm --filter web run build`: PASS.
- Next build route output marked `/auth/login`, `/auth/register`, and
  `/api/build-info` as `Static`.
- `pnpm --filter web run typecheck`: PASS after build completed.
- `pnpm run quality:guardrails`: PASS.
- `git diff --check`: PASS with line-ending warnings only.
- Local production HTTP smoke through `next start`: `200` for `/auth/login`,
  `/auth/register`, and `/api/build-info`.

## Git Proof

- `git push origin main`: PASS.
- Remote `main` now resolves to
  `1b351a51dab491525777ad340a5c1e290c55eb61`.

## Production Readback Attempt

Command:

```text
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 1b351a51 --timeout-seconds 180 --interval-seconds 15 --request-timeout-ms 8000
```

Result: FAIL, all attempts aborted by timeout. No production build-info payload
was observed.

Direct local public probes:

- `GET https://soar.luckysparrow.ch/`: timeout.
- `GET https://soar.luckysparrow.ch/auth/login`: timeout.
- `GET https://soar.luckysparrow.ch/auth/register`: timeout.
- `GET https://soar.luckysparrow.ch/api/build-info`: timeout.

External reader/proxy route from Cloudflare Zurich:

- `https://r.jina.ai/https://soar.luckysparrow.ch/` returned
  `ERR_ADDRESS_UNREACHABLE`.
- `https://r.jina.ai/https://vps.luckysparrow.ch/` returned
  `ERR_ADDRESS_UNREACHABLE`.

## Classification

The application code and local production route behavior are verified, and the
target SHA is pushed to `main`. Current production proof is blocked at the VPS
or public routing layer before application readback can happen.

This is not enough to claim production freshness or end-to-end app health.

## Required Recovery

1. Restore VPS/public network reachability for `141.227.149.67` and the
   `soar.luckysparrow.ch`, `api.soar.luckysparrow.ch`, and
   `vps.luckysparrow.ch` hostnames.
2. Open Coolify from an operator context that can access the Soar production
   resources.
3. Confirm or trigger deploy of SHA
   `1b351a51dab491525777ad340a5c1e290c55eb61`.
4. Rerun build-info wait and deploy smoke:

```text
node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 1b351a51 --timeout-seconds 900 --interval-seconds 30
node scripts\deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

No secrets, passwords, cookies, or tokens are recorded in this artifact.
