# External Client Authorization Contract

Status: required current-version target, **not accepted as implemented**.
Product owner decision: 2026-10-17. See the
[Current Version Product Contract](../../product/current-version-contract.md).

## Boundary

Soar's API remains the authority for user identity, ownership, entitlements,
trading risk, exchange capability, consent, and audit. MCP is an external
client surface over allowed user-domain actions, not an administrator panel,
built-in assistant, or independent execution authority. The presence of an API
route does not make it an MCP tool.

## Allowed and Excluded Actions

| Action family | Product authorization |
| --- | --- |
| User-domain reads and writes, including PAPER | May be exposed only with user-scoped authorization and the same domain checks as the web application. |
| LIVE domain actions | May execute without per-transaction confirmation only within a previously granted, limited, revocable authorization. Every command must be checked against the active grant and ordinary LIVE safeguards. |
| Plan assignment or account-role changes | Human administrator action in the Soar panel only; never an MCP or external-client capability. |
| Account-data or password changes, exchange API-key addition | Manual user action in Soar only; never an external-client capability. |
| Secret retrieval or manual secret entry via client | Prohibited. No raw exchange key, password, or other account secret may be returned to an external client for manual entry. |

## Grant Invariants

- A grant must be attributable to a user and a specific external client, have
  explicit limits, and be revocable. The local foundation now records a client
  label, owner, bot, exchange, market type, symbol, one allowed action, maximum
  quote amount per action and in total, maximum count, expiry, and revocation.
- Missing, expired, exceeded, or revoked grants fail closed before a domain
  mutation. Revocation must be effective for subsequent actions.
- The grant does not bypass account ownership, subscription entitlements,
  exchange-operation support, risk rules, or application audit logging.
- LIVE command evidence must identify the client, grant, user, target, action,
  policy result, and durable domain outcome without exposing secrets.
- A backend endpoint used by the human administrator panel must not be
  reachable as an external plan/role tool merely because an API route exists.

## Acceptance Boundary

This remains a target contract. `SOAR-EXT-GRANT-001A` now provides a local
human-cookie-only grant lifecycle, bounded scope, hashed one-time secret, and
revocation checks. `SOAR-EXT-GRANT-001B/001D2` adds a local transactional allowance
reservation, matching durable intent binding, and unresolved-operation state.
The local stdio MCP package now exposes only the 001L self-status GET as a
read-only tool. No external domain action, delegated order submission,
deployed revocation, or LIVE client proof exists. Acceptance needs
tests for denied account/plan/role/key actions, active and revoked grants,
ownership isolation, LIVE guardrails, audit evidence, and a real external-client
journey. Ordinary API tests or an endpoint inventory do not close this gate.

`SOAR-EXT-GRANT-001C/WEB-GRANT` adds a human-session Web panel under Profile.
It creates grants with password confirmation, shows the opaque secret only in
the create response until the owner closes that view, lists the exact scope and
limits without the secret, and requires an explicit revoke confirmation. The
panel reads current plan and active bot market-group context to display
revoked, expired, exhausted, plan-unavailable, scope-unavailable, and
unverified states. The API remains authoritative for every grant check. Local
UI tests and an isolated signed-in browser readback do not establish an
external-client execution path or production acceptance.

The local API now distinguishes newly issued human browser sessions by a signed
audience and claim. Legacy `cryptosparrow-app` tokens remain compatible with
ordinary domain routes but cannot mutate account/profile secrets, API keys, or
administrator state, even when copied into Cookie. This boundary is not a
delegated grant or proof of human presence: a compromised human session is still
a compromised credential. The new opaque grant secret is a distinct scoped
credential. `001L` accepts it only as an Authorization Bearer credential for a
read-only self-status GET. That route checks the exact grant ID, current
owner/bot scope, entitlement, expiry, and revocation without changing state.
No domain action accepts the secret yet. The execution boundary remains
unimplemented and unaccepted.
