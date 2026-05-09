# Deploy Freshness - 8ea7f33b

Date: 2026-05-09

## Scope

Verify that the Gate.io wallet cashflow history implementation batch reached
production.

## Commit

- Full SHA: `8ea7f33b581ec0f3cf7d653168b160c31cbb23a8`
- Short SHA: `8ea7f33b`
- Commit: `feat(exchange): enable Gate.io wallet cashflow history`

## Evidence

- PASS: production Web build-info exposed
  `8ea7f33b581ec0f3cf7d653168b160c31cbb23a8` on wait attempt 16.
- PASS: public deploy smoke:
  - API `/health` -> HTTP 200
  - API `/ready` -> HTTP 200
  - Web `/` -> HTTP 200
- BLOCKED as expected: no-secret V1 final preflight public checks passed, but
  protected/formal evidence remains missing or failed. See
  `docs/operations/v1-final-preflight-8ea7f33b-2026-05-09.md`.

## Runtime Impact

Production now contains the implementation that enables Gate.io
`WALLET_CASHFLOW_HISTORY` through the existing exchange adapter boundary.

This deploy does not enable Gate.io live submit, live execution, or
exchange-side cancel.
