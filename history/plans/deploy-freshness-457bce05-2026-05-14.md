# Deploy Freshness - 457bce05 - 2026-05-14

## Status

- Candidate SHA: `457bce05338310c198c03a973395a9176f298dc1`
- Candidate branch: `origin/codex/v1-proof-and-ops-evidence`
- Production branch: `origin/main`
- Production web build-info observed:
  `457bce05338310c198c03a973395a9176f298dc1`
- Result: `DEPLOY_FRESH_PUBLIC_SMOKE_PASS`

## Evidence

- `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 457bce05 --timeout-seconds 60 --interval-seconds 10`
  passed on attempt 1 with production build-info reporting `457bce05`.
- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
  passed:
  - API `/health` -> `200`
  - API `/ready` -> `200`
  - Web `/` -> `200`
- `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch`
  failed closed with HTTP `401` because the endpoint requires approved
  admin/ops access.
- `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch`
  failed closed with `runtime_freshness_endpoint_http_401` and
  `alerts_endpoint_http_401` because protected ops access was not provided.

## Interpretation

The latest runtime/backtest exchange-adapter candidate is deployed on the
production web surface and passes public smoke. This proves deploy freshness for
`457bce05`, but it does not replace protected runtime freshness, alerts, or
rollback guard evidence.

## Required Next Action

Use approved admin/ops credentials or a local non-repository secret source to
rerun protected ops checks, then rerun the target production release gate for
`457bce05`.
