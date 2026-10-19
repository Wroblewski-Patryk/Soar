# API: External Client Grants

## Status and scope

`SOAR-EXT-GRANT-001A/B` adds grant lifecycle and a callable, durable allowance
reservation service. `001L` adds one external-client, read-only self-status GET.
`001N2` adds a separate, explicitly issued `READ_BOT_STATUS` grant foundation.
`001P` adds one external-client GET for persisted bot configuration status.
The local stdio MCP package calls only the 001L grant self-status GET; it has no
bot-status tool. There is no delegated LIVE order submission. The reservation
is not connected to the domain `createOrder` path.

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

`001N2` adds four separate human-only routes under
`/dashboard/external-client-read-grants` with the same signed human cookie,
current-password confirmation for create, user-scoped rate limits, and a
60-second to 7-day expiry window:

| Method | Path | Behavior |
| --- | --- | --- |
| POST | `/dashboard/external-client-read-grants` | Requires explicit `READ_BOT_STATUS`, one owned `botId`, client label, TTL, current password, and the same active LIVE-trading plan entitlement used to issue order grants. Returns a distinct `soar_read_` secret once. |
| GET | `/dashboard/external-client-read-grants` | Lists up to 100 owned read grants without secret or hash. |
| GET | `/dashboard/external-client-read-grants/:id` | Reads one owned read grant without secret or hash. |
| POST | `/dashboard/external-client-read-grants/:id/revoke` | Immediately marks the read grant revoked; repeat calls are idempotent. |

The read grant stores no symbol, exchange, quote amount, reservation, or lifetime
read count. It may name an owned PAPER or LIVE bot, regardless of current bot
mode. The existing `PLACE_LIVE_ORDER` table and secret format do not acquire
read authority; either action is rejected by the other create route. The 001P
reader checks the exact bot, current owner and entitlement, expiry, and
revocation on every request. The current 001L grant-self-status route and its
30/minute IP limit are unchanged.

Local `001N2` proof used a fresh `soar_ext_grant_001n2_8b07c543_test`
database. After the earlier migrations, a pre-existing `PLACE_LIVE_ORDER`
record was inserted; the new migration preserved its action, symbol, quote
limits, count, and label, and left the order-action enum unchanged. The three
new read-grant HTTP tests and nine existing order-grant HTTP tests passed.
API typecheck, repository guardrails, and API endpoint documentation parity
passed. The temporary database was removed. This is local API evidence only.

## External-client bot configuration status route (001P)

`GET /external-client/bots/:botId/status` accepts exactly one
`Authorization: Bearer soar_read_...` header. A cookie, session JWT, query or
body credential, and the old `soar_ext_` order-grant secret are denied. The
read grant must be unexpired, unrevoked, explicitly `READ_BOT_STATUS`, and bound
to that exact currently owned bot. Each request reads the current active plan
entitlement without seeding or changing the subscription catalog. Invalid,
foreign, revoked, expired, and plan-ineligible scopes return the same 401 body.

The response allowlist is only `bot.id`, `bot.mode`, and `bot.isActive`; these
are persisted configuration fields, not proof that a worker is currently
running. It omits owner/account data, client label, secret/hash, API keys,
orders, and positions. It uses no-store headers. The existing rate-limiter
mechanism uses the same 30/minute per-IP Redis bucket as grant self-status and enforces
at most 60/minute per read-grant secret across IPs, without a lifetime read quota;
the latter is a conservative value
for owner confirmation before release. Redis failure denies in production.
The route performs no domain, audit, subscription-catalog, or CCXT write and
does not expose an MCP tool.

Local `001P` proof used the fresh `soar_ext_grant_001p_6ed6cff2_test`
database with all migrations. The bot-status HTTP suite, existing grant
self-status suite, and rate-limiter suite passed (15/15), including FREE-plan
denial and shared-store failure with local fallback configured. API typecheck,
repository guardrails, and API endpoint documentation parity passed (121/121). The GET
test compared bot, grant, subscription, audit, plan, Order, and Position state
before and after the call. This is local proof only; the 60/minute per-grant
policy still needs owner confirmation before release.

`001P3` bounds each Redis connection wait and `eval` for the bot-status IP and
grant limiters to 1 second. A timeout returns 503 without using an in-memory
counter; a delayed Redis command may still consume quota later, conservatively.
Deterministic pending-connect and pending-eval tests prove bounded refusal and
recovery on a later request. HTTP recovery and the existing grant self-status
regression passed on a fresh `soar_ext_grant_001p3_460a4023_test` database
(18/18). The test database was removed. A real Redis restart remains for the
independent exact-SHA acceptance check.

## External-client self-status route (001L)

`GET /external-client/grants/:id/status` accepts exactly one
`Authorization: Bearer <opaque grant secret>` header. It does not accept a cookie,
human or legacy JWT, query credential, or request body. A valid secret must hash
to that exact grant ID. Missing, invalid, foreign-ID, revoked, expired, planless,
or scope-unavailable grants receive the same 401 response. Database failure
returns a generic 503. The GET never creates a grant, reservation, audit, or
subscription catalog entry. It returns only `id`, `ACTIVE` or `EXHAUSTED` status,
bot/exchange/market/symbol/action scope, limits, usage, and expiry. It omits
owner/account data, client label, secret/hash, and exchange keys. Responses use
no-store headers. A fixed, IP-scoped 30/minute bucket covers all requested grant
IDs and fails closed if Redis is unavailable in production. Request logging
uses only the declared route pattern and never records a client-supplied path or
query. Requests denied before a route is reached and unknown routes log `[UNMATCHED]`.
The route has no domain action or CCXT call. The local MCP package wraps this
GET as its sole read-only tool; the HTTP route remains the authority.

Local 001L proof used a fresh `soar_ext_grant_001l_accept_d7c2_test` database
with 73 applied migrations. The two grant HTTP suites plus rate-limit and
request-logger suites passed (18/18); API typecheck, repository guardrails,
strict architecture drift (880/880), docs parity, and API endpoint parity passed.
The HTTP tests read back zero leftover test users, grants, and reservations.
These results do not establish deployed behavior or an accepted external-client
domain-action journey.

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
The fixed transport computes fill notional with decimal arithmetic and rejects
amounts that cannot round-trip through its numeric fill field before admission.
Tests on a dedicated
`_test` database cover both sides of the result commit, tampered result hash,
pause/revoke blocking, one fill, and unchanged allowance usage. This remains
local mock proof, not delegated LIVE authority.

`SOAR-EXT-GRANT-001J/MOCK-JOURNAL-RACE-PROOF` covers two concurrent
lookup-only recoveries while the original fixed-mock executor is held after
the journal commit. A serializable finalization can return PostgreSQL `P2034`
after another finalizer wins. The internal finalizer now retries that conflict
up to three times with a fresh transaction and readback. It never retries the
transport or allowance writer. The isolated race test requires one Order, one
fill, one finalization audit, one mock transport start, one allowance charge,
and a reusable finalized lookup after the marker is removed. Missing or
conflicting journal proof still keeps the marker and returns UNKNOWN.

`SOAR-EXT-GRANT-001K/RETRY-EXHAUSTION-FAIL-CLOSED` exercises three consecutive
PostgreSQL `P2034` conflicts at the finalizer's marker DELETE on a fresh,
dedicated `_test` database. A test-only trigger raises SQLSTATE `40001`; a
nontransactional sequence proves that all three serializable attempts ran.
The trigger and sequence are removed by the test. The fixed mock result journal,
Order, fill, position, and `SUBMITTED` reservation with `DURABLE_ORDER` proof
were committed before finalization, so failed finalization cannot roll them
back. After retry exhaustion the marker remains, no finalization audit is
committed, pause and grant revocation stay blocked, and transport and allowance
counts remain one. This is local fixed-mock evidence only.

Before any delegated LIVE submit, the next ticket must provide a lock lifetime
that covers the entire venue call, enforce a deadline, confirm that the call has
ended or been canceled before releasing authority, and integrate the existing
domain risk, fill, Order, and lookup-only recovery path. A Promise race or abort
signal without confirmed adapter termination does not satisfy that requirement.
There is still no delegated real adapter call, external domain-action HTTP/MCP route, real
venue submit, or deployed proof. The mock executor is not LIVE readiness.
