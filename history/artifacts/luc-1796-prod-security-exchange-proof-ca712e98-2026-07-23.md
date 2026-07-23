# Production Security And Exchange Proof

## Status
- Result: **PARTIAL**
- Environment: production
- Evidence date: 2026-07-23
- Generated at (UTC): 2026-07-23T14:02:02.333Z
- Expected SHA: `ca712e98b70e157b643db4f57726a02821a140bc`
- Observed build-info SHA: `ca712e98b70e157b643db4f57726a02821a140bc`
- Raw JSON: `history\artifacts\luc-1796-prod-security-exchange-proof-ca712e98-2026-07-23.json`

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
| profile api key list redaction | PASS | 200 | items=0 |
| untrusted origin state change fail-closed | PASS | 403 | - |
| unsupported exchange probe fail-closed | PASS | 501 | COINBASE API_KEY_PROBE unsupported |
| binance futures catalog read-only | PASS | 200 | items=675 |
| gateio futures catalog canonical read-only | PASS | 200 | items=852 |
| proof execution stopped | FAIL | - | authenticated ops readiness details expected HTTP 200 but got 403 |

## Blockers
- authenticated ops readiness details expected HTTP 200 but got 403

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies that may contain secrets are not written to this
  artifact.
- Payloads are summarized only as booleans/counts/status codes.
