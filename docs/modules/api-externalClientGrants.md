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
| POST | `/dashboard/external-client-grants/:id/revoke` | Revoke under the grant row lock; repeated calls are idempotent. An unresolved delegated submission marker returns 409 until explicit reconciliation. |

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

`SOAR-EXT-GRANT-001D3/TIMEOUT-ABORT` disables the internal
`withFreshBoundExternalClientGrantSubmitPermit` callback seam. It always returns
`DELEGATED_SUBMIT_PERMIT_DISABLED` before `beginBound`, so a rejected attempt
neither invokes a callback nor advances the reservation to uncertainty. The
earlier implementation held grant and pause locks in an interactive Prisma
transaction, but a transaction timeout can release both locks while its awaited
callback still runs. A concurrent revoke and pause can then commit before that
callback finishes. The `_test` regression reproduces this with a no-op callback
and proves the disabled seam never starts a submit. The separated
`beginBoundExternalClientGrantSubmission` remains a durable point-in-time gate,
not authority to call an exchange adapter. Existing uncertain reservations stay
lookup-only and cannot be automatically refunded.

`SOAR-EXT-GRANT-001E/DURABLE-ADMISSION` records a delegated admission in one
transaction. It locks the grant row, rechecks the bound command, intent, audit,
secret, current grant/bot/group/plan/expiry and trusted market nominal, then
acquires the shared global pause key and rechecks scope. It commits a
`LiveCreateOrderSubmission` marker linked by database foreign keys to the grant,
reservation, and intent, the reservation's `SUBMISSION_UNCERTAIN` transition,
and an audit event together. The marker has no TTL. A process restart or exact
retry returns only the existing marker identity as `lookupOnly`; it does not
spend allowance again or authorize a second submit. A marker blocks the global
pause, human grant revoke, and a second allowance reservation for that grant,
even after the first reservation reaches `SUBMITTED`. A unique database index
allows at most one marker per grant. If pause or revoke commits first,
admission fails before creating a marker. Existing human markers retain null
delegated links.
At the 001E stage no callback or adapter consumed the admission result.
Market metadata and plan/group checks are current
point-in-time gates, not locks held through a future venue call. The marker
requires explicit authoritative reconciliation before it may be cleared;
there is no automatic timeout cleanup.

`SOAR-EXT-GRANT-001F/DELEGATED-DISPATCH-MOCK` adds the internal
`prepareBoundExternalClientGrantAdapterSeam`. It runs the same read-only
bot/consent/strategy/position-conflict/plan gate used by human `openOrder`
before calling durable admission. It requires the domain's canonical payload
to match the reserved LIMIT command and the stored `LiveOrderIntent` payload
fingerprint. A mismatch leaves the reservation `RESERVED` with no marker or
Order; the already bound allowance and intent remain durable. A retry of an
uncertain admission returns only lookup identity, without another risk pass,
market fetch, allowance charge, or submit. The result explicitly has
`dispatchEnabled: false` and contains no grant secret. The previous
`DELEGATED_SUBMIT_PERMIT_DISABLED` callback remains closed.

`SOAR-EXT-GRANT-001G/MOCK-EXECUTION` adds an internal executor restricted at
runtime to `NODE_ENV=test` and a database whose name ends exactly `_test`.
It accepts only plain data (`reservationId`, `secret`, and a fixed scenario);
unknown, functional, accessor, or extra-argument inputs are rejected before
admission. The local transport has no exchange adapter, CCXT, network, or
caller-supplied callback. It supports a certain fill, a fixed delayed fill,
UNKNOWN, and an inconsistent fill for negative proof. The durable marker stays
throughout the transport delay and local persistence.
For a certain, complete mock fill with a `mock-` exchange identity, it uses the
same Order/fill/position materialization as human `openOrder`, reconciles the
reservation from that Order, and clears the matching marker only after both
steps succeed. Allowance is charged once at reservation. An UNKNOWN scenario,
inconsistent fill, or process crash leaves `SUBMISSION_UNCERTAIN`
and the marker; a retry never invokes another mock submit.
Tests cover Binance and Gate.io mocked fills, transport-time pause/revoke,
UNKNOWN, invalid input/fill, and a worker-process crash. Domain risk checks
are point-in-time and require a stronger execution permit for real LIVE.

`SOAR-EXT-GRANT-001H/MOCK-ORPHAN-FINALIZE` adds only `_test` recovery for the
fixed mock. A worker can stop in the controlled window after durable Order,
fill, position, and `SUBMITTED` reservation but before marker deletion. The
finalizer takes the grant row and shared pause lock, then reads the command
fingerprint, grant/intent/marker links, stored intent payload fingerprint,
deterministic mock Order/fill and linked position, allowance state, and
admission/transport/reconciliation audits in one serializable transaction.
It deletes that exact marker with a finalization audit only when every check
agrees. Repeating finalization reads back that audit and returns the same
result without changing allowance or calling the transport. Early crashes,
UNKNOWN, missing fills, tampered fingerprints, and ambiguous local Orders
leave the marker and fail closed for pause/revoke. No TTL or automatic cleanup
is added. Recovery from a real venue still requires authoritative lookup and
a separately proven LIVE execution permit.
An existing marker requires zero finalization audit rows; a retry without a
marker requires exactly one row with matching metadata. Duplicate or malformed
finalization audits are ambiguous and fail closed.

`SOAR-EXT-GRANT-001I/MOCK-UNKNOWN-LOOKUP` covers the crash after the fixed
mock returns but before `Order` persistence. Previously the marker and
transport-start audit recorded only the client ID and scenario; neither was
proof that a result existed. The executor now commits the returned, validated
fill to the unique linked marker with a hash and result audit before it writes
the Order. A missing, partial, or conflicting snapshot remains UNKNOWN and
keeps the marker. Test-only recovery looks up the reservation by its unique
`clientOrderId`, validates the stored result against the grant, intent, command,
marker, and audit, then uses the existing Order/fill/position and reservation
reconciliation path. It calls no transport or venue adapter. The existing
orphan finalizer checks the completed records before deleting the marker;
normal success uses that finalizer too, and repeat lookup reads its audit.
The fixed transport computes fill notional with decimal arithmetic. Tests on a dedicated
`_test` database cover both sides of the result commit, tampered result hash,
pause/revoke blocking, one fill, and unchanged allowance usage. This remains
local mock proof, not delegated LIVE authority.

Before any delegated LIVE submit, the next ticket must provide a lock lifetime
that covers the entire venue call, enforce a deadline, confirm that the call has
ended or been canceled before releasing authority, and integrate the existing
domain risk, fill, Order, and lookup-only recovery path. A Promise race or abort
signal without confirmed adapter termination does not satisfy that requirement.
There is still no delegated real adapter call, external HTTP/MCP route, real
venue submit, or deployed proof. The mock executor is not LIVE readiness.
