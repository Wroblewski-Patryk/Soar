---
type: product_contract
status: canonical
area: product
last_updated: 2026-10-19
---

# Current Version Product Contract

This document owns the **required behavior and scope** of the current Soar
delivery. It records the owner's product decisions of 2026-10-17 and the
subsequent position-lifecycle clarification. It does not
certify that the code, deployment, or every user journey meets them.

Use the numbered architecture documents and their reference contracts for
implementation rules. Use fresh, environment-specific acceptance evidence to
claim that a requirement works. Older MVP/V1 plans and the dated sections of
[product.md](./product.md) are historical context where they disagree here.

## Required Product Behavior

| Area | Current requirement |
| --- | --- |
| Surfaces | A user-facing web application, a human administrator panel, an API, and an external MCP client surface are in scope. MCP is an access surface, not a built-in AI assistant. |
| Trading | PAPER and LIVE operation on Binance and Gate.io are in scope. Support must be stated for the exact `(exchange, marketType, operation)` pair; one supported operation does not imply support for every market type or operation. |
| Bot market scope | A bot has exactly one active market group at a time. Stored or historical groups do not authorize concurrent active groups. |
| Languages | English and Polish are the supported current-version languages. Other locale code or experiments do not establish a supported language. |
| Backtest recovery | After a worker failure, an unfinished backtest resumes automatically. Recovery must not create a second run, duplicate execution, trades, or report for the same run. If safe recovery cannot be established, show an explicit failure or degraded state rather than apparent progress. |
| Entry and position lifecycle | Loss of an entry signal means no new entry and never itself `EXIT`. An already open position remains open until its configured lifecycle closes it through `TP`/`SL` (simple) or `TTP`/`TSL` (advanced), or a valid manual, liquidation, or other risk close. DCA ordering remains part of that lifecycle; if a reached DCA cannot be funded and `SL` is breached, `SL` closes the position and insufficient funds is reported. A separate strategy `EXIT` signal is not required. This rule applies consistently to BACKTEST, PAPER, and LIVE. |
| Plans and roles | Account registration alone grants no plan entitlement. A human administrator assigns a user's plan and changes account roles manually in the Soar administrator panel. Plan-gated access fails closed until assignment. Users do not buy or change plans through in-app checkout. External clients cannot assign plans or change roles. |
| External domain actions | An external client may perform user-domain actions, including LIVE, only under a previously granted, limited, revocable authorization. A separate confirmation is not required for every LIVE transaction within that authorization. Every action remains subject to Soar's user ownership, entitlement, exchange, risk, consent, and audit controls. Missing, expired, exceeded, or revoked authorization fails closed. |
| Account and secrets boundary | External clients cannot change account data, roles, or plans; change passwords; add exchange API keys; or receive secrets for manual entry. Password changes and exchange-key entry remain manual user actions in Soar. A backend endpoint used by the administrator panel is not thereby an external-client capability. |

The exact authorization limits and exchange-operation matrix are architecture
contracts to be specified and verified before accepting the external MCP/LIVE
surface. This product decision does not grant unrestricted autonomous trading.

## Outside the Current Delivery

- A built-in AI assistant or autonomous assistant runtime.
- A separate native mobile application. Responsive web behavior remains in scope.
- Payments, self-service checkout, and payment-driven plan changes in Soar.

Existing code, routes, database fields, or dated plans for these areas may be
retained for compatibility or future work. Their presence is not a current
product promise or acceptance result.

## Verification Boundary as of 2026-10-17

The current version has **not** received whole-product acceptance. The ongoing
application audit distinguishes source code, automated tests, local browser
flows, authenticated production flows, and exchange-side behavior. Its private
operational report is not part of the public repository.

| Requirement | Current evidence boundary / next proof |
| --- | --- |
| Web, administrator panel, and API | Selected code tests and local/browser flows exist. Complete user and administrator journeys, permissions, and deployed behavior still require acceptance evidence. |
| MCP and delegated LIVE authorization | The local grant foundation has human-cookie-only create/list/status/revoke, password confirmation, hashed one-time opaque secrets, scoped limits, and focused `_test` evidence. An internal service can atomically bind an allowance reservation, matching durable order intent, counters, and audit; a separate transactional gate rechecks grant authority and the current LIVE pause before marking submission uncertain. No delegated `createOrder`, Order materialization, external-client domain route, MCP capability, deployed proof, or accepted LIVE client journey exists yet. Do not infer any of these from the grant lifecycle routes or binding tests. |
| Manual plan assignment | Local code leaves registration without a plan and removes the profile checkout route. A new signed human-session audience guards plan/role writes; legacy Bearer tokens cannot gain that authority by moving into Cookie. Focused API tests cover the boundary, while independent browser/deployed acceptance remains pending. Existing subscription and payment history requires a separate data review before migration. |
| Binance and Gate.io PAPER/LIVE | Exchange contracts and selected local flows exist. Verify each market type and operation against the [exchange capability matrix](../architecture/reference/exchange-access-ownership-matrix.md), then prove relevant deployed and exchange-side journeys. |
| Backtest recovery | BT-001/001b has local evidence for token-fenced ownership and atomic result writes, including a passing two-process, same-version worker proof with Redis and an isolated test database. An older worker does not honor the token: deployment must stop old workers before starting new ones. Production recovery, migrations, and the user-visible status journey remain unverified; the local proof is not whole-product acceptance. |
| Entry-signal loss and position lifecycle | The shared evaluator now treats legacy no-match `EXIT` settings as HOLD in local code. Focused evaluator, replay, and PAPER/LIVE runtime tests cover no false `EXIT`, a matching `LONG` vote, and basic SL after DCA; existing advanced-protection tests remain relevant. Stored fields and the operator summary still expose the legacy option. Full authenticated journeys and fresh deployed or exchange evidence remain pending; local tests are not whole-product acceptance. |
| EN/PL and one active market group | Existing contracts and local tests are useful implementation evidence; full current-version journey proof remains part of acceptance. |

Only fresh evidence for the applicable environment may change an acceptance
status. An index row marked `verified_local` or an old release packet is not
current production proof.

## Maintenance

Change this contract when the owner changes product behavior. In the same
change, reconcile the matching architecture, module, security, UX, operations,
planning, and graph records. Do not use a roadmap item or historical audit as
the sole source of an accepted behavior.
