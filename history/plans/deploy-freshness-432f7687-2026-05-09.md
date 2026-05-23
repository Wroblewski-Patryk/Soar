# Deploy Freshness - 432f7687

Date: 2026-05-09

## Scope

Verify that the Gate.io trade-history snapshot implementation batch reached
production.

## Commit

- Full SHA: `432f768701300c7ba600fa7633532c0cc9ef4b96`
- Short SHA: `432f7687`
- Commit: `feat(exchange): enable Gate.io trade history snapshot`

## Evidence

- PASS: production Web build-info exposed
  `432f768701300c7ba600fa7633532c0cc9ef4b96` on wait attempt 18.
- PASS: public deploy smoke:
  - API `/health` -> HTTP 200
  - API `/ready` -> HTTP 200
  - Web `/` -> HTTP 200
- BLOCKED as expected: no-secret V1 final preflight public checks passed, but
  protected/formal evidence remains missing or failed. See
  `history/releases/v1-final-preflight-432f7687-2026-05-09.md`.

## Runtime Impact

Production now contains the implementation that enables Gate.io
`TRADE_HISTORY_SNAPSHOT` for the existing positions trade-history snapshot
route.

This deploy does not enable Gate.io wallet cashflow history, live submit, live
execution, or exchange-side cancel.
