# Production Auth Session Browser Proof

## Status

- Result: **FAIL**
- Environment: production
- Evidence date: 2026-06-29
- Generated at (UTC): 2026-06-28T22:36:39.663Z
- Expected SHA: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- Observed build-info SHA: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- Raw JSON: `history/artifacts/luc-6109-prod-auth-session-browser-proof-2026-06-29.json`

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
| logout API clears session | FAIL | 502 | - |
| auth me after logout fails closed | FAIL | 200 | - |
| dashboard after logout redirects to login | PASS | - | path=/auth/login |

## Blockers

- logout API clears session
- auth me after logout fails closed

## Redaction Notes

- Auth tokens, passwords, cookies, private headers, and response bodies are not
  written to this artifact.
- Browser evidence stores only route/status summaries and text lengths.
