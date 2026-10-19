# Local MCP Status Reads

`SOAR-MCP-001A/READ-ONLY-GRANT-STATUS` is a local Node.js stdio server for
Codex or Claude MCP hosts. Its `get_own_grant_status` tool calls the existing
`GET /external-client/grants/:id/status` and returns only its validated `grant`
object. `SOAR-MCP-001C/READ-BOT-STATUS-TOOL` adds `get_own_bot_status`, which
calls `GET /external-client/bots/:botId/status` and returns only `bot.id`,
`bot.mode`, and `bot.isActive`. Both tools have empty argument schemas. Neither
can create, change, revoke, or submit anything. Bot status describes persisted
configuration, not worker liveness.

## Process configuration

Launch `node apps/mcp/src/index.mjs` from a checkout with installed workspace
dependencies (Node.js 20 or later). Pass `SOAR_MCP_GRANT_ID` and
`SOAR_MCP_GRANT_SECRET` through the host's secure process environment. Do not put
the secret in the MCP tool call, prompt, command arguments, tracked config, or
repository files. The human user obtains the one-time secret from the Soar
grant panel. Keep the secret in a local secret store and revoke it in Soar when
no longer needed.

For bot status, pass one `SOAR_MCP_BOT_ID` and its `SOAR_MCP_BOT_READ_SECRET`
through the same secure process environment. This secret must be a distinct
`soar_read_` read grant explicitly scoped to `READ_BOT_STATUS` for that bot.
The old `soar_ext_` order grant cannot read bot status, and the read grant
cannot call `get_own_grant_status`. Each tool remains available when only its
own configuration is present; the other returns a generic error. Tool calls
cannot select a bot, grant, secret, URL, or transport.

`SOAR_MCP_API_ORIGIN` defaults to `https://api.soar.luckysparrow.ch`. The only
other runtime value accepted is `https://stage-api.soar.luckysparrow.ch`.
Arbitrary URLs, HTTP, paths, query strings, and credentials in URLs fail before
any request. Redirects are rejected without forwarding Bearer to the redirect
destination. A test-only entrypoint
allows `http://127.0.0.1:<port>` for synthetic local protocol tests; the runtime
entrypoint does not enable it.

The API decides whether a grant is active, exhausted, revoked, expired,
planless, or out of scope. For bot status, the API verifies the exact bot,
current owner, action, expiry, revocation, and plan on every request. The MCP
server also rejects expired grant status and malformed or mismatched successful
responses. Missing or crossed configuration, denied HTTP responses, network
failure, redirects, and malformed responses produce generic tool errors. Raw
HTTP errors, URLs, response bodies, and secrets are never copied to MCP output
or stderr. stdout is reserved for MCP JSON-RPC.

## Evidence and limits

`pnpm --filter @cryptosparrow/mcp test` performs real MCP stdio
initialize/list/call exchanges against a synthetic loopback HTTP server. It
checks both tools and empty arguments, exact Bearer GETs, separate secret
formats, missing/crossed configuration, denied or malformed responses, unsafe
origin, redirect refusal, and no secrets in process output. This is local
protocol evidence, not a Codex or Claude host integration test and not deployed
or LIVE proof. No domain-action HTTP route, exchange adapter, CCXT call,
built-in AI, or delegated order execution is present.
