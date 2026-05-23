# Production Security And Exchange Proof

## Status
- Result: **PARTIAL**
- Environment: production
- Evidence date: 2026-05-14
- Generated at (UTC): 2026-05-14T02:30:40.904Z
- Expected SHA: `457bce05338310c198c03a973395a9176f298dc1`
- Observed build-info SHA: `457bce05338310c198c03a973395a9176f298dc1`
- Raw JSON: `history\artifacts\_artifacts-prod-security-exchange-proof-457bce05-2026-05-14.json`

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
| proof execution stopped | FAIL | - | untrusted origin state change expected HTTP 403 but got 500 |

## Blockers
- untrusted origin state change expected HTTP 403 but got 500

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies that may contain secrets are not written to this
  artifact.
- Payloads are summarized only as booleans/counts/status codes.
