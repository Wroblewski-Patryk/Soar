# API: External Client Grants

## Status and scope

`SOAR-EXT-GRANT-001A` adds the grant lifecycle foundation. It does not expose MCP,
external-client domain execution, or LIVE order submission. A grant secret is not
accepted by any HTTP route. Internal scope inspection is read-only; later execution
work must add an atomic allowance reservation together with domain intent creation.

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
