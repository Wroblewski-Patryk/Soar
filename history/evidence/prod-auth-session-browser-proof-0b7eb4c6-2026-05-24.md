# Production Auth Session Browser Proof

## Status

- Result: **PASS**
- Environment: production
- Evidence date: 2026-05-24
- Generated at (UTC): 2026-05-24T18:49:05.651Z
- Expected SHA: `0b7eb4c6e0767ce1d51b3ff68f0229f899781d31`
- Observed build-info SHA: `0b7eb4c6e0767ce1d51b3ff68f0229f899781d31`
- Raw JSON: `history/artifacts/prod-auth-session-browser-proof-0b7eb4c6-2026-05-24.json`

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
