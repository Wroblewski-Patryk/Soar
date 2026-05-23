# V1 Production Auth Session Proof - 457bce05 - 2026-05-14

## Task Contract

### Context

- Stage: verification
- Operation mode: TESTER
- Auth was locally verified, but the V1 product action matrix still marked it
  as `PASS_LOCAL`.
- Production build-info for this release line is
  `457bce05338310c198c03a973395a9176f298dc1`.

### Goal

Verify the production auth session lifecycle for the current deployed
candidate without storing credentials, cookies, tokens, or response bodies.

### Scope

- Production login.
- Authenticated `/auth/me`.
- Logout.
- Fail-closed `/auth/me` after logout.
- No account mutation.

### Implementation Plan

1. Use approved temporary credentials in process environment only.
2. Call production `/auth/login`.
3. Reuse only the in-memory cookie for `/auth/me`.
4. Call `/auth/logout`.
5. Confirm `/auth/me` fails closed after logout.
6. Record only HTTP status evidence.

### Acceptance Criteria

- Login returns `200`.
- `/auth/me` before logout returns `200`.
- Logout returns `200`.
- `/auth/me` after logout returns `401`.
- No token, password, cookie, or response body is written to repo artifacts.

### Definition Of Done

- Status-only result is recorded.
- Product action matrix is updated.
- Scorecard is regenerated.
- Secret scan passes.

### Forbidden

- Do not persist raw credentials, cookies, tokens, or full response bodies.
- Do not mutate profile/account data.

## Result Report

Status: `verified`.

Validation:

- PASS: production auth session lifecycle status-only probe:
  - `/auth/login` -> `200`
  - `/auth/me` before logout -> `200`
  - `/auth/logout` -> `200`
  - `/auth/me` after logout -> `401`
  - token/cookie/body printed or stored: `false`
