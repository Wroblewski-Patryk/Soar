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
  explicit limits, and be revocable. Exact limit fields and values need a
  separate implementation decision; do not invent unlimited defaults.
- Missing, expired, exceeded, or revoked grants fail closed before a domain
  mutation. Revocation must be effective for subsequent actions.
- The grant does not bypass account ownership, subscription entitlements,
  exchange-operation support, risk rules, or application audit logging.
- LIVE command evidence must identify the client, grant, user, target, action,
  policy result, and durable domain outcome without exposing secrets.
- A backend endpoint used by the human administrator panel must not be
  reachable as an external plan/role tool merely because an API route exists.

## Acceptance Boundary

This is a target contract. There is no accepted MCP capability, limited-grant,
revocation, or LIVE client proof in the current documentation. Acceptance needs
tests for denied account/plan/role/key actions, active and revoked grants,
ownership isolation, LIVE guardrails, audit evidence, and a real external-client
journey. Ordinary API tests or an endpoint inventory do not close this gate.
