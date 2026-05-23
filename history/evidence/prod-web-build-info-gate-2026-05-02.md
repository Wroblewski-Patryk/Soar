# PROD Web Build-Info Gate

Date: 2026-05-02
Task: `DPL-PROD-BUILDINFO-01`

## Context
During `V1BOT-CONDITIONS-01` production rollout, one pushed commit did not
become the active web deployment until a follow-up empty commit retriggered
Coolify. The public `/api/build-info` endpoint showed the previous SHA while
GitHub already contained the intended fix.

## Goal
Promotion must not be considered successful until the public web build-info
endpoint exposes the promoted commit SHA.

## Contract
- `promote-prod.yml` triggers the Coolify production deploy webhook.
- Immediately after the webhook returns `2xx`, the workflow polls
  `${PROD_WEB_BASE_URL}/api/build-info`, defaulting to the canonical
  production web origin when the optional secret is unset.
- The workflow continues only when `gitSha` starts with `github.sha`.
- If the target SHA is not visible before timeout, the promotion fails and the
  existing rollback path can evaluate the failed release.

## Operator Notes
- Treat direct push-driven Coolify redeploys as convenience only, not release
  evidence.
- Use the GitHub `Promote PROD` workflow as the canonical production promotion
  path when deploy proof matters.
- If build-info remains stuck on an older SHA, inspect Coolify deployment queue
  and service logs before creating another retrigger commit.

## Validation
- Local script help:
  `pnpm run ops:deploy:wait-web-build-info -- --help`
- Local production readback:
  `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha <active-sha> --timeout-seconds 30 --interval-seconds 5`

## Rollback
Revert the workflow step and `scripts/waitForWebBuildInfo.mjs` if the
build-info endpoint is intentionally unavailable. Do not remove the endpoint
without replacing deploy-proof evidence.
