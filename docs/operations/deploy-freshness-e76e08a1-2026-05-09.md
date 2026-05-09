# Deploy Freshness - e76e08a1

Date: 2026-05-09

## Scope

Verify that the Gate.io API-key probe implementation batch reached production.

## Commit

- Full SHA: `e76e08a1a20b12abaeabf4edc44a38ba37619005`
- Short SHA: `e76e08a1`
- Commit: `feat(exchange): enable Gate.io api key probe`

## Evidence

- PASS: production Web build-info exposed
  `e76e08a1a20b12abaeabf4edc44a38ba37619005` on the second bounded wait
  attempt, after production initially stayed on `e9ad2aee`.
- PASS: public deploy smoke:
  - API `/health` -> HTTP 200
  - API `/ready` -> HTTP 200
  - Web `/` -> HTTP 200
- BLOCKED as expected: no-secret V1 final preflight public checks passed, but
  protected/formal evidence remains missing or failed. See
  `docs/operations/v1-final-preflight-e76e08a1-2026-05-09.md`.

## Runtime Impact

Production now contains the implementation that enables Gate.io
`API_KEY_PROBE` for provided and stored profile API-key connection tests.

This deploy does not enable Gate.io balance preview, positions/open-orders,
trade-history, live submit, or exchange-side cancel.
