# Local MCP Grant Status

`SOAR-MCP-001A/READ-ONLY-GRANT-STATUS` is a local Node.js stdio server for
Codex or Claude MCP hosts. It advertises exactly one tool,
`get_own_grant_status`, with an empty argument schema. The tool calls the
existing `GET /external-client/grants/:id/status` and returns only its validated
`grant` object. It cannot create, change, revoke, or submit anything.

## Process configuration

Launch `node apps/mcp/src/index.mjs` from a checkout with installed workspace
dependencies (Node.js 20 or later). Pass `SOAR_MCP_GRANT_ID` and
`SOAR_MCP_GRANT_SECRET` through the host's secure process environment. Do not put
the secret in the MCP tool call, prompt, command arguments, tracked config, or
repository files. The human user obtains the one-time secret from the Soar
grant panel. Keep the secret in a local secret store and revoke it in Soar when
no longer needed.

`SOAR_MCP_API_ORIGIN` defaults to `https://api.soar.luckysparrow.ch`. The only
other runtime value accepted is `https://stage-api.soar.luckysparrow.ch`.
Arbitrary URLs, HTTP, paths, query strings, and credentials in URLs fail before
any request. Redirects are rejected without forwarding Bearer to the redirect
destination. A test-only entrypoint
allows `http://127.0.0.1:<port>` for synthetic local protocol tests; the runtime
entrypoint does not enable it.

The API decides whether a grant is active, exhausted, revoked, expired,
planless, or out of scope. The MCP server also rejects an expired or malformed
successful response. Missing configuration, denied HTTP responses, network
failure, redirects, and malformed responses produce the same generic tool
error. Raw HTTP errors, URLs, response bodies, and secrets are never copied to
MCP output or stderr. stdout is reserved for MCP JSON-RPC.

## Evidence and limits

`pnpm --filter @cryptosparrow/mcp test` performs a real legacy MCP stdio
initialize/list/call exchange against a synthetic loopback HTTP server. It
checks the sole tool and empty arguments, exact Bearer GET, missing/revoked/
expired denial, unsafe origin, redirect refusal, and no secret in process
output. This is local protocol evidence, not a Codex or Claude host integration
test and not deployed or LIVE proof. No domain-action HTTP route, exchange
adapter, CCXT call, built-in AI, or delegated order execution is present.
