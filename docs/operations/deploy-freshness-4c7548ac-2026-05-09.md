# Deploy Freshness - 4c7548ac

Date: 2026-05-09

## Scope

Verify that the Gate.io positions snapshot implementation batch reached
production.

## Commit

- Full SHA: `4c7548acc74295f27676c1f00d79dbf58b873942`
- Short SHA: `4c7548ac`
- Commit: `feat(exchange): enable Gate.io positions snapshot`

## Evidence

- PASS: production Web build-info exposed
  `4c7548acc74295f27676c1f00d79dbf58b873942` on wait attempt 16.
- PASS: public deploy smoke:
  - API `/health` -> HTTP 200
  - API `/ready` -> HTTP 200
  - Web `/` -> HTTP 200
- BLOCKED as expected: no-secret V1 final preflight public checks passed, but
  protected/formal evidence remains missing or failed. See
  `docs/operations/v1-final-preflight-4c7548ac-2026-05-09.md`.

## Runtime Impact

Production now contains the implementation that enables Gate.io
`POSITIONS_SNAPSHOT` for the existing positions exchange-snapshot route.

This deploy does not enable Gate.io open-orders, trade-history, wallet
cashflow history, live submit, live execution, or exchange-side cancel.
