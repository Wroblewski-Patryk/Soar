# Production Auth Session Browser Proof

## Status

- Result: **PASS**
- Environment: production
- Evidence date: 2026-06-21
- Generated at (UTC): 2026-06-21T00:06:01.848Z
- Expected SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`
- Observed build-info SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`
- Raw JSON: `history/artifacts/luc-4929-prod-auth-session-browser-proof-2026-06-21.json`

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
| auth me after logout fails closed | PASS | 401 | - |
| dashboard after logout redirects to login | PASS | - | path=/auth/login |

## Blockers

- none

## Redaction Notes

- Auth tokens, passwords, cookies, private headers, and response bodies are not
  written to this artifact.
- Browser evidence stores only route/status summaries and text lengths.
