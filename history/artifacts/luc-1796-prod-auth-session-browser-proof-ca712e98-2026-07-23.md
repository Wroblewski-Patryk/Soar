# Production Auth Session Browser Proof

## Status

- Result: **PASS**
- Environment: production
- Evidence date: 2026-07-23
- Generated at (UTC): 2026-07-23T14:02:02.051Z
- Expected SHA: `ca712e98b70e157b643db4f57726a02821a140bc`
- Observed build-info SHA: `ca712e98b70e157b643db4f57726a02821a140bc`
- Raw JSON: `history/artifacts/luc-1796-prod-auth-session-browser-proof-ca712e98-2026-07-23.json`

## Scope

This proof verifies production auth browser and API session boundaries without
writing credentials, cookies, tokens, or response bodies to artifacts.

Covered:

- unauthenticated protected route fail-closed redirect
- authenticated protected route rendering
- invalid-token protected route redirect to `session=expired`
- logout API fail-closed readback with trusted-origin request shape
- stale cookie and bearer token rejection after logout
- protected route redirect after logout

## Steps

| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
| build-info freshness | PASS | 200 | deployed build matches expected SHA |
| auth token resolved | PASS | - | source=login |
| unauthenticated dashboard redirects to login | PASS | - | path=/auth/login |
| authenticated dashboard renders | PASS | - | path=/dashboard; text=679 |
| invalid token redirects to expired-session login | PASS | - | path=/auth/login; search=?session=expired |
| logout API clears session | PASS | 200 | - |
| auth me after logout fails closed for cookie token | PASS | 401 | - |
| auth me after logout fails closed for bearer token | PASS | 401 | - |
| dashboard after logout redirects to login | PASS | - | path=/auth/login |

## Blockers

- none

## Redaction Notes

- Auth tokens, passwords, cookies, private headers, and response bodies are not
  written to this artifact.
- Browser evidence stores only route/status summaries and text lengths.
