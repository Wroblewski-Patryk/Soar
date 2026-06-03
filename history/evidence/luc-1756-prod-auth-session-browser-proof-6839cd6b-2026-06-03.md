# Production Auth Session Browser Proof

## Status

- Result: **FAIL**
- Environment: production
- Evidence date: 2026-06-03
- Generated at (UTC): 2026-06-03T13:34:27.167Z
- Expected SHA: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- Observed build-info SHA: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- Raw JSON: `history/artifacts/luc-1756-prod-auth-session-browser-proof-6839cd6b-2026-06-03.json`

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
| auth token resolved | PASS | - | source=provided |
| unauthenticated dashboard redirects to login | PASS | - | path=/auth/login |
| authenticated dashboard renders | FAIL | - | path=/auth/login; text=331 |
| invalid token redirects to expired-session login | PASS | - | path=/auth/login; search=?session=expired |
| logout API clears session | PASS | 200 | - |
| auth me after logout fails closed | PASS | 401 | - |
| dashboard after logout redirects to login | PASS | - | path=/auth/login |

## Blockers

- authenticated dashboard renders

## Redaction Notes

- Auth tokens, passwords, cookies, private headers, and response bodies are not
  written to this artifact.
- Browser evidence stores only route/status summaries and text lengths.
