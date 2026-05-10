# Deploy Freshness - 04a4204c

Date: 2026-05-10

## Scope

Verify that the Gate.io live order submit implementation batch reached
production.

## Commit

- Full SHA: `04a4204ca9090586d49ae77b0dd8c1be048d7bdf`
- Short SHA: `04a4204c`
- Commit: `feat(exchange): enable Gate.io live order submit`

## Evidence

- PASS: production Web build-info exposed
  `04a4204ca9090586d49ae77b0dd8c1be048d7bdf` on the follow-up wait attempt 1.
- NOTE: the first bounded wait timed out while production still exposed
  `ab574e0817ff60f5af9fdc28f031537383d3b300`; the follow-up wait then passed.
- PASS: public deploy smoke:
  - API `/health` -> HTTP 200
  - API `/ready` -> HTTP 200
  - Web `/` -> HTTP 200
- BLOCKED as expected: no-secret V1 final preflight public checks passed, but
  protected/formal evidence remains missing or failed. See
  `docs/operations/v1-final-preflight-04a4204c-2026-05-10.md`.

## Runtime Impact

Production now contains the implementation that enables Gate.io
`LIVE_ORDER_SUBMIT` and shared `LIVE_EXECUTION` compatibility gating through
the canonical orders/exchange boundary.

This deploy does not perform a real live-money action and does not enable
Gate.io `LIVE_ORDER_CANCEL`.
