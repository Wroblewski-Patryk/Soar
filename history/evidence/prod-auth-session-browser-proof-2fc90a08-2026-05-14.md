# Production Auth Session Browser Proof

## Status

- Result: **FAIL**
- Environment: production
- Evidence date: 2026-05-14
- Generated at (UTC): 2026-05-14T14:45:16.698Z
- Expected SHA: `2fc90a0810032f2fedb744d69505a3bd55a23779`
- Observed build-info SHA: `2fc90a0810032f2fedb744d69505a3bd55a23779`
- Raw JSON: `history\artifacts\_artifacts-prod-auth-session-browser-proof-2fc90a08-2026-05-14.json`

## Scope

This proof verifies production auth browser and API session boundaries without
writing credentials, cookies, tokens, or response bodies to artifacts.

Covered:

- unauthenticated protected route fail-closed redirect
- authenticated protected route rendering
- invalid-token protected route redirect to `session=expired`
- logout API fail-closed readback
- protected route redirect after logout

## Steps

| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
| build-info freshness | PASS | 200 | deployed build matches expected SHA |
| auth token resolved | PASS | - | source=login |
| unauthenticated dashboard redirects to login | PASS | - | path=/auth/login |
| authenticated dashboard renders | PASS | - | path=/dashboard; text=143 |
| invalid token redirects to expired-session login | PASS | - | path=/auth/login; search=?session=expired |
| logout API clears session | PASS | 200 | - |
| auth me after logout fails closed | FAIL | 200 | - |
| dashboard after logout redirects to login | PASS | - | path=/auth/login |

## Blockers

- auth me after logout fails closed

## Redaction Notes

- Auth tokens, passwords, cookies, private headers, and response bodies are not
  written to this artifact.
- Browser evidence stores only route/status summaries and text lengths.
