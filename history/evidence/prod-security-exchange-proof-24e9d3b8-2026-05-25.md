# Production Security And Exchange Proof

## Status
- Result: **PASS**
- Environment: production
- Evidence date: 2026-05-25
- Generated at (UTC): 2026-05-25T01:24:22.145Z
- Expected SHA: `24e9d3b8d51b4b4c4f1b25cad920096f2223b0ec`
- Observed build-info SHA: `24e9d3b8d51b4b4c4f1b25cad920096f2223b0ec`
- Raw JSON: `history\artifacts\prod-security-exchange-proof-24e9d3b8-2026-05-25.json`

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
| gateio futures catalog canonical read-only | PASS | 200 | items=717 |
| authenticated ops readiness details | PASS | 200 | noOrderGuard=true |

## Blockers
- none

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies that may contain secrets are not written to this
  artifact.
- Payloads are summarized only as booleans/counts/status codes.
