# LUC-2475 Deploy Smoke Abort Handling Evidence

Date: 2026-06-06

## Scope

Read-only Test Automation stabilization for `scripts/deploySmokeCheck.mjs`.

## What Changed

- Added `SMOKE_TRANSIENT_RETRIES` with default `1`.
- Retries only transient fetch abort/timeout/fetch-failed exceptions.
- Does not retry HTTP status failures, readiness degradation, missing build
  SHA, or build SHA mismatch.
- Prints retry diagnostics in the final PASS/FAIL row when a transient retry
  was involved.

## Verification

- `node --check scripts/deploySmokeCheck.mjs` -> PASS.
- `node --check scripts/deploySmokeCheck.test.mjs` -> PASS.
- `node --test scripts/deploySmokeCheck.test.mjs` -> PASS (`2/2`).
- `node --test scripts/releaseOpsScriptContracts.test.mjs scripts/deploySmokeCheck.test.mjs`
  -> PASS (`4/4`).
- `pnpm run architecture:graph:drift:strict` -> PASS (`837/837`, `0`
  missing) after explicit graph relation coverage for the six existing API
  test paths reported by strict drift and the new deploy smoke test relation.
- `pnpm run quality:guardrails` -> PASS.
- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers`
  -> PASS:
  - API `/health` `200`
  - API `/ready` `200`
  - Web `/` `200`
  - Web `/api/build-info` `200` with expected `gitSha`

## Classification For LUC-2456

The prior moving abort symptom is best classified as runner/network instability
unless the hardened script reports exhausted transient retries for the same
endpoint. Future output with `transient retry: attempt 1: timeout after ...`
and final PASS should be treated as recovered runner instability. Future output
with exhausted retries remains a product-health smoke failure until direct
endpoint probes prove otherwise.

## Boundaries

No deploy, restart, rollback, env/database/account mutation, secret value
readback, protected smoke, exchange action, or live-trading action occurred.
