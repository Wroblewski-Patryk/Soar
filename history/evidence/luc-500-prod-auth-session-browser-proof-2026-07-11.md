# Production Auth Session Browser Proof

## Status

- Result: **PASS**
- Environment: production
- Evidence date: 2026-07-11
- Generated at (UTC): 2026-07-11T17:23:58.398Z
- Expected SHA: `not provided`
- Observed build-info SHA: `afb7a974911e1a8376ba27bc3bf90fbdadf3e57d`
- Raw JSON: `history/artifacts/luc-500-prod-auth-session-browser-proof-2026-07-11.json`

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
