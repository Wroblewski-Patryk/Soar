# LUC-1437 Workers Ready Smoke Principal Refresh Gate

- Issue: `LUC-1437`
- Parent: `LUC-1435`
- Date: 2026-06-02
- Owner: Security Review Lead
- Stage: verification
- Status: blocked by `LUC-1438`

## Context

`LUC-1435` verified that public production API/Web smoke is green and that
production build-info SHA `6839cd6b8884e26eca735ce32cea98c1dadccfbe`
contains the required DCA-before-close fix SHA
`2dc983ced4a4c66e31e7f37264710c124955e57b`.

Protected `GET /workers/ready` remains unverified. Ops observed:

- current `SMOKE_AUTH_TOKEN` binding present, but `/workers/ready` returned
  `401`;
- login fallback with current `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD`
  bindings failed with `400 Validation failed`;
- no secret values were stored.

## Security Decision

Decision: `BLOCKED_PENDING_CREDENTIAL_REFRESH`.

The existing `LUC-1190` gate remains valid: protected smoke is allowed only
with an authenticated Soar session, `ADMIN` role, ops-network path, and
read-only readiness scope. The current runner does not have a validated
principal/session artifact satisfying that class.

## Redacted Binding Shape Evidence

Command class: environment binding presence/shape check only. Secret values
were not printed.

Result:

| Binding | Present | Length | Shape result |
| --- | --- | ---: | --- |
| `SMOKE_AUTH_TOKEN` | yes | 36 | not JWT-shaped |
| `SMOKE_AUTH_EMAIL` | yes | 36 | not email-shaped |
| `SMOKE_AUTH_PASSWORD` | yes | 39 | present; value not inspected |

Interpretation:

- Token presence does not prove a usable API bearer/session token.
- Email/password fallback cannot be approved from this runner because the
  email binding is not email-shaped and Ops already observed API validation
  failure.
- Re-running the protected smoke with the same bindings would repeat the known
  failed condition rather than refresh the principal.

## Follow-Up Created

Created first-class blocker:

- `LUC-1438` `[QA][Soar] Refresh production smoke auth binding for protected workers/ready`
- Assignee: QA Regression Lead
- Required action: provide or refresh a valid approved read-only production
  smoke binding/session for Ops, without exposing secret values.

## Allowed Rerun After Unblock

After `LUC-1438` confirms a fresh approved binding/session, Ops may rerun:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Expected closure condition: public checks remain green and protected
`API /workers/ready` is no longer blocked by `401`/`403`; readiness result then
reflects runtime truth.

## Safety Boundary

- No production deploy, restart, rollback, environment edit, database action,
  account mutation, live trading, exchange setting, subscription, payment,
  API-key, or user-account mutation was performed.
- No token, cookie, password, session, secret, payment, exchange API key, or
  private account value was printed or persisted.
- The user's real account remains disallowed for this smoke unless explicitly
  approved for this exact narrow check.
