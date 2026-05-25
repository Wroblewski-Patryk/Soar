# Production Security And Exchange Proof

## Status
- Result: **PARTIAL**
- Environment: production
- Evidence date: 2026-05-24
- Generated at (UTC): 2026-05-24T18:34:09.299Z
- Expected SHA: `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`
- Observed build-info SHA: `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`
- Raw JSON: `history\artifacts\prod-security-exchange-proof-380308d1-2026-05-24.json`

## Scope

This proof is read-only or fail-closed only. It does not submit LIVE orders,
cancel LIVE orders, close positions, mutate exchange-side state, or persist raw
credentials in artifacts.

Covered modules in this slice: Exchange Adapter and Security/Privacy.

## Steps
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
| build-info freshness | PASS | 200 | deployed build matches expected SHA |
| auth token resolved | PASS | - | login:present |
| security headers present | PASS | 200 | - |
| public readiness minimal response | PASS | 200 | - |
| unauthenticated protected route fail-closed | PASS | 401 | - |
| unauthenticated ops diagnostics fail-closed | PASS | 401 | - |
| unauthenticated metrics fail-closed | PASS | 401 | - |
| authenticated no-store profile read | PASS | 200 | - |
| profile api key list redaction | PASS | 200 | items=2 |
| untrusted origin state change fail-closed | PASS | 403 | - |
| unsupported exchange probe fail-closed | PASS | 501 | COINBASE API_KEY_PROBE unsupported |
| binance futures catalog read-only | PASS | 200 | items=581 |
| proof execution stopped | FAIL | - | gateio market catalog expected HTTP 200 but got 500 |

## Blockers
- gateio market catalog expected HTTP 200 but got 500

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies that may contain secrets are not written to this
  artifact.
- Payloads are summarized only as booleans/counts/status codes.
