# API: External Client Grants

## Status and scope

`SOAR-EXT-GRANT-001A/B` adds grant lifecycle and a callable, durable allowance
reservation service. It does not expose MCP, external-client domain execution,
or LIVE order submission. A grant secret is not accepted by any HTTP route.
The reservation is not yet connected to the domain `createOrder` path.

## Human-only routes

All routes are under `/dashboard/external-client-grants`, after `requireAuth` and
`requireHumanSession`. The latter requires a newly signed human-session cookie and
rejects any Authorization header. A legacy JWT copied into Cookie is denied. The
global trusted-origin middleware applies to state-changing cookie requests.

| Method | Path | Behavior |
| --- | --- | --- |
| POST | `/dashboard/external-client-grants` | Create with current password; response contains the opaque secret once. |
| GET | `/dashboard/external-client-grants` | List up to 100 owned grants without secret or hash. |
| GET | `/dashboard/external-client-grants/:id` | Read one owned grant without secret or hash. |
| POST | `/dashboard/external-client-grants/:id/revoke` | Revoke immediately; repeated calls are idempotent. |

Create input requires `clientLabel`, owned `botId`, exact `exchange`, `marketType`,
`symbol`, `action=PLACE_LIVE_ORDER`, decimal-string `maxActionQuoteAmount` and
`maxTotalQuoteAmount`, integer `maxActions` (1–1000), `ttlSeconds` (60–604800),
and current `password`. Amounts are positive, at most 12 integral and 8 fractional
digits, and total covers at least one action. The bot must be in LIVE mode,
the exact exchange/market type must support `LIVE_ORDER_SUBMIT` in the code
capability matrix, and the symbol must be assigned to its active market group
(or legacy primary group only when no new market-group assignment exists) with
matching market context. Creation uses the same current LIVE subscription
entitlement gate as domain order submission. A canceled, missing, or downgraded
plan makes an existing grant fail internal inspection; read errors fail closed.
The response secret has a `soar_ext_` prefix and 256 random bits; only its SHA-256
hash is stored. Logs record creation and revocation without the secret or hash.

The internal inspection service fails closed on malformed tokens, wrong owner,
bot, exchange, market type, symbol or action; a disabled/non-opted-in bot;
exceeded single, total or count limit; expiry; and revocation. Inspection does
not spend allowance and cannot authorize an order by itself.

## Atomic reservation and recovery (001B)

`reserveExternalClientGrantOrder` accepts the final venue `clientOrderId` and a
strict canonical LIMIT command. The service derives its SHA-256 command fingerprint
itself. It rejects `riskAck`, caller-supplied nominal, missing market metadata, and
quantity or price outside trusted market steps. Grant limits are currently in USDT:
the market reader must confirm `quote=USDT` from exchange metadata. Futures also
requires `settle=USDT`, a linear contract, and a verified contract size. Spot uses
the exchange `quote` field. Symbol spelling and the local market universe do not
prove currency. Missing, contradictory, duplicate, or expired market evidence
fails closed before any reservation, counter, or audit write. Futures nominal is
`quantity × limitPrice × contractSize`; Spot uses multiplier 1. The result is
rounded **up** to 8 decimal places. Missing Futures contract size or trusted
lot/price step fails closed. This is requested LIMIT nominal;
future execution must still apply venue precision, risk, and actual-fill controls.

The PostgreSQL transaction locks the grant row, rechecks the secret, current LIVE
plan, bot consent/activation, active group, exact action/scope, expiry, revocation,
single nominal, total nominal, count, and unresolved operation. The reservation,
used counters, and audit event commit together before any future submit. A global
unique `clientOrderId` matches the existing `LiveOrderIntent` identity rule; a
partial unique index permits at most one unresolved reservation per grant. An
identical ID and command returns the stored row without another charge. A changed
command conflicts. Database or audit write failure rolls back all three writes.

| State | Meaning | Next step |
| --- | --- | --- |
| `RESERVED` | Allowance committed; no submit begun. | Persist a matching `LiveOrderIntent`, then begin submission; or refund only if no intent exists. |
| `SUBMISSION_UNCERTAIN` | Dispatch gate committed; a submit may have happened. | Lookup-only recovery. No retry submit or automatic refund. |
| `SUBMITTED` | Matching durable intent and local Order with exchange identity found. | Allowance remains spent. |
| `NOT_SUBMITTED` | Pre-dispatch abort proved by `RESERVED` state and absent intent under lock. | Allowance refunded once; client ID remains terminal. |

`beginExternalClientGrantSubmission` requires a matching durable `LiveOrderIntent`
and rechecks current grant authority under the same lock before setting uncertainty.
`reconcileSubmittedExternalClientGrantReservation` needs a matching intent payload
and Order with an exchange order identity; absent or conflicting evidence stays
uncertain. A timeout, `UNKNOWN`, or venue `not found` is never refund evidence.
`SOAR-EXT-GRANT-001D` extracts `persistOrReuseLiveOrderIntent` from
`executeDurableLiveOrder`. The former persists or checks the final venue client ID
and fingerprint without contacting the venue. An existing intent remains lookup-only
in the human wrapper, including after a crash before submit. Gate.io ID canonicalization
is available before reservation through `resolveLiveClientOrderId`. The human order
path continues to use the same wrapper and order materialization.

`SOAR-EXT-GRANT-001D2` adds `bindExternalClientGrantReservationIntent`. It derives
the final venue client ID once and commits the grant reservation, matching
`LiveOrderIntent`, counters, and audit in one PostgreSQL transaction. A human
intent with the same ID, an unbound legacy reservation, or a changed command
cannot be adopted as a bound retry. The audit stores the bound intent ID as
durable proof; a rollback leaves no new reservation, intent, counter, or audit.
Exact retry returns the same bound rows without another charge.

`beginBoundExternalClientGrantSubmission` checks that binding, current grant
authority, and the shared global LIVE pause control in one transaction before
committing `SUBMISSION_UNCERTAIN`. The pause advisory lock ends at that commit.

`SOAR-EXT-GRANT-001D3` adds an internal, single-use
`withFreshBoundExternalClientGrantSubmitPermit` boundary for a mock submit
callback. It first commits `SUBMISSION_UNCERTAIN`, then locks the grant row and
shared global LIVE pause key in that order, rechecks the bound command, intent,
audit, grant authority, bot/group, plan, expiry, and absence of a local Order,
and holds both locks through the callback. A revoke or global pause that starts
while the callback runs waits for it to finish. Delegated submissions are
blocked while paused, including reduce-only Futures commands. A callback
timeout or crash leaves the reservation uncertain and the allowance spent; a
retry cannot invoke the callback again and must use venue lookup. The bot/group
and plan checks are point-in-time checks before the callback; this permit does
not hold locks on those records through it. The lock lifetime is bounded by the
120-second database transaction timeout. A future real adapter integration must
prove its submit deadline and cancellation behavior before relying on this
permit for an in-flight venue request.

There is still no delegated adapter call, Order materialization, or automatic
reconciliation. The next ticket must connect this boundary to the existing
domain risk, exchange, fill, Order, and lookup-only recovery path before any
delegated LIVE submission. No external HTTP/MCP route, real venue submit, or
deployed proof is claimed.
