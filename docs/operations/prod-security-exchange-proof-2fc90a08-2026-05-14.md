# Production Security And Exchange Proof

## Status
- Result: **PASS**
- Environment: production
- Evidence date: 2026-05-14
- Generated at (UTC): 2026-05-14T02:44:47.337Z
- Expected SHA: `2fc90a0810032f2fedb744d69505a3bd55a23779`
- Observed build-info SHA: `2fc90a0810032f2fedb744d69505a3bd55a23779`
- Raw JSON: `docs\operations\_artifacts-prod-security-exchange-proof-2fc90a08-2026-05-14.json`

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
| profile api key list redaction | PASS | 200 | items=1 |
| untrusted origin state change fail-closed | PASS | 403 | - |
| unsupported exchange probe fail-closed | PASS | 501 | COINBASE API_KEY_PROBE unsupported |
| binance futures catalog read-only | PASS | 200 | items=631 |
| gateio futures catalog canonical read-only | PASS | 200 | items=5590 |
| authenticated ops readiness details | PASS | 200 | noOrderGuard=true |

## Blockers
- none

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies that may contain secrets are not written to this
  artifact.
- Payloads are summarized only as booleans/counts/status codes.
