# Deploy Freshness - 15dfacb9

Date: 2026-05-09

## Scope

Verify that the Gate.io balance preview implementation batch reached
production.

## Commit

- Full SHA: `15dfacb9882fc4904a2bfcd91d8b58c05d3ac5dd`
- Short SHA: `15dfacb9`
- Commit: `feat(exchange): enable Gate.io balance preview`

## Evidence

- PASS: production Web build-info exposed
  `15dfacb9882fc4904a2bfcd91d8b58c05d3ac5dd` on wait attempt 17.
- PASS: public deploy smoke:
  - API `/health` -> HTTP 200
  - API `/ready` -> HTTP 200
  - Web `/` -> HTTP 200
- BLOCKED as expected: no-secret V1 final preflight public checks passed, but
  protected/formal evidence remains missing or failed. See
  `history/releases/v1-final-preflight-15dfacb9-2026-05-09.md`.

## Runtime Impact

Production now contains the implementation that enables Gate.io
`BALANCE_PREVIEW` for the existing wallet balance preview route.

This deploy does not enable Gate.io positions/open-orders/trade-history, live
submit, live execution, or exchange-side cancel.
