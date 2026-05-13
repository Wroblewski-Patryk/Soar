# V1 Current Main Promotion Deploy Lag - 457bce05 - 2026-05-14

## Task Contract

### Context

The latest local V1 candidate includes the runtime/backtest exchange adapter
fixes committed after the previously verified production target build
`00169d7f`. Production cannot be claimed current until build-info exposes the
new candidate SHA.

### Goal

Promote the verified candidate to remote Git branches and capture whether
production deploys it.

### Constraints

- Do not store Coolify, application, or exchange credentials in repository
  artifacts.
- Do not claim deployed behavior without build-info proof.
- Do not perform live trading actions.
- Treat Coolify deployment as the approved production deployment boundary.

### Definition Of Done

- Candidate branch is pushed.
- `main` is fast-forwarded to the candidate SHA.
- Production build-info is checked.
- Current deployment result is recorded as PASS or deploy lag.
- Source-of-truth docs identify the next safe action.

### Forbidden

- Treating `git push` as deployment proof.
- Bypassing Coolify/manual deploy controls with a new workflow.
- Recording secrets in artifacts.

## Result Report

Status: `verified for public deploy freshness; protected ops checks blocked on
approved admin/ops access`.

Validation:

- `git push -u origin codex/v1-proof-and-ops-evidence` -> passed.
- `git push origin HEAD:main` -> passed; `main` now points to
  `457bce05338310c198c03a973395a9176f298dc1`.
- `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 457bce05 --timeout-seconds 180 --interval-seconds 20` -> failed as expected for deploy lag; production remained on `00169d7f`.
- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers` -> passed for the currently deployed production surface.
- Later recheck:
  `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 457bce05 --timeout-seconds 60 --interval-seconds 10`
  -> passed on attempt 1; production build-info reports `457bce05`.
- Fresh public smoke for `457bce05`:
  `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
  -> passed.
- Protected ops checks without admin/ops credentials:
  - `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch`
    -> failed closed with HTTP `401`.
  - `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch`
    -> failed closed with HTTP `401` for protected runtime freshness and alerts.

Residual risk:

- Protected runtime freshness, alerts, and rollback guard evidence for
  `457bce05` still need approved admin/ops credentials.
- The next required action is rerunning protected ops checks and the target
  release gate for `457bce05`.
