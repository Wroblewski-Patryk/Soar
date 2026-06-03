# LUC-1769 Source Read-Only App Smoke Auth Approval

## Context

- Issue: LUC-1769
- Date: 2026-06-03
- Role: Security Review Lead
- Scope: source secret-ref class approval for QA binding only
- Secret handling: no secret values printed, copied, read back, or stored

## Names-Only Readback

| Name | Present |
| --- | --- |
| `SMOKE_AUTH_TOKEN` | yes |
| `SMOKE_AUTH_EMAIL` | yes |
| `SMOKE_AUTH_PASSWORD` | yes |
| `PROD_UI_AUDIT_AUTH_TOKEN` | no |
| `PROD_UI_AUDIT_AUTH_EMAIL` | no |
| `PROD_UI_AUDIT_AUTH_PASSWORD` | no |
| `SOAR_PROD_AUTH_TOKEN` | no |
| `SOAR_PROD_AUTH_EMAIL` | no |
| `SOAR_PROD_AUTH_PASSWORD` | no |
| `PROD_UI_AUDIT_ADMIN_TOKEN` | yes |
| `PROD_UI_AUDIT_ADMIN_EMAIL` | yes |
| `PROD_UI_AUDIT_ADMIN_PASSWORD` | yes |

Redacted shape check:

| Check | Result |
| --- | --- |
| `SMOKE_AUTH_TOKEN` present and non-empty | pass |
| `SMOKE_AUTH_TOKEN` JWT-shaped | no, token is opaque |
| `SMOKE_AUTH_EMAIL` present | pass |
| `SMOKE_AUTH_EMAIL` email-shaped | fail |
| `SMOKE_AUTH_PASSWORD` present and non-empty | pass |

## Security Disposition

Approved source secret-ref class:

- `SMOKE_AUTH_TOKEN` may be bound by Portfolio/Ops as `PROD_UI_AUDIT_AUTH_TOKEN` for one read-only production app/dashboard smoke principal or session.

Not approved from this evidence:

- `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD` must not be bound as `PROD_UI_AUDIT_AUTH_EMAIL` + `PROD_UI_AUDIT_AUTH_PASSWORD` from this run because the redacted email-shape check did not validate the email ref.
- `PROD_UI_AUDIT_ADMIN_*` remains limited to non-mutating admin-route proof and is not approved as the app/dashboard smoke class.

Permitted QA scope:

- Read-only authenticated production app/dashboard route/state proof for `LUC-1756` and parent `LUC-1766`.
- Allowed actions are page/login/session establishment as needed by the smoke harness, route reachability, visible state classification, redirect/auth-state proof, responsive/accessibility observation, and redacted status metadata.

Forbidden:

- Subscription mutation.
- API-key mutation.
- Trading/live setting mutation.
- Exchange setting mutation.
- External service state mutation.
- User real account mutation.
- Cookie/session export.
- Secret value print/readback.
- Protected response-body capture beyond redacted status/shape metadata.
- Deploy, restart, rollback, database mutation, or live-trading action.

## Revocation And Cleanup

- Revocation owner: Portfolio/credential owner for the `SMOKE_AUTH_TOKEN` source ref and the bound `PROD_UI_AUDIT_AUTH_TOKEN` target ref.
- Cleanup expectation: remove or rotate the bound app smoke token after the ARB-006 protected QA proof window, or immediately on suspected exposure, failed scope control, or accidental mutation attempt.
- QA evidence must mention only env names and redacted verdicts, never token values, cookies, protected payloads, user private data, or screenshots containing secrets.

## Result

`LUC-1769` is approved for the source-token binding path above. The downstream binding/proof issue remains owned by Portfolio/QA; Security does not perform the binding or protected browser run in this lane.
