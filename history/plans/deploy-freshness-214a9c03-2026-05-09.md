# Deploy Freshness - 214a9c03

Date: 2026-05-09

## Scope

Verify that the Gate.io open-orders snapshot implementation batch reached
production.

## Commit

- Full SHA: `214a9c034d38ab8670fd4b43d0f8ed692d78d90c`
- Short SHA: `214a9c03`
- Commit: `feat(exchange): enable Gate.io open orders snapshot`

## Evidence

- PASS: production Web build-info exposed
  `214a9c034d38ab8670fd4b43d0f8ed692d78d90c` on wait attempt 1.
- PASS: public deploy smoke:
  - API `/health` -> HTTP 200
  - API `/ready` -> HTTP 200
  - Web `/` -> HTTP 200
- BLOCKED as expected: no-secret V1 final preflight public checks passed, but
  protected/formal evidence remains missing or failed. See
  `history/releases/v1-final-preflight-214a9c03-2026-05-09.md`.

## Runtime Impact

Production now contains the implementation that enables Gate.io
`OPEN_ORDERS_SNAPSHOT` for the existing positions open-orders snapshot route.

This deploy does not enable Gate.io trade-history, wallet cashflow history,
live submit, live execution, or exchange-side cancel.
