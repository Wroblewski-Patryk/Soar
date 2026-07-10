# LUC-174 Protected Trading Readback vs LIVE Mutation Approval Packet

## Status

- Result: `READY_FOR_READ_ONLY_PROOF / LIVE_MUTATION_REQUIRES_SEPARATE_APPROVAL / NO_PROTECTED_RUN`
- Issue: [LUC-174](/LUC/issues/LUC-174)
- Parent: [LUC-169](/LUC/issues/LUC-169)
- Date: 2026-07-10
- Role: Security and Privacy Auditor

## Scope

This packet separates protected production trading readback from LIVE
exchange-side mutation for Soar. It is a non-secret approval and execution
boundary, not a protected production run.

The 2026-07-10 wake selected a local repair/source-control lane and explicitly
forbade push, deploy, production restart, protected smoke/live account
mutation, and secret disclosure until protected gate evidence exists. This
heartbeat therefore did not authenticate to production, read protected account
state, access raw secrets, mutate app state, mutate exchange state, or run any
LIVE trading action.

## Source Contracts Reviewed

| Source | Security conclusion |
| --- | --- |
| `docs/product/capability-map.md` CAP-003 | Strategy/risk configuration is local-proofed and can be referenced as context, but production strategy mutation is outside this readback packet. |
| `docs/product/capability-map.md` CAP-008 | Monitoring and operation safety telemetry supports read-only observation, audit trail review, and risk/consent boundary inspection. |
| `docs/architecture/capability-to-implementation-map.csv` CAP-026 | Market data and stream adapters are verified locally; fresh live exchange stream proof remains separate. |
| `docs/architecture/reference/exchange-access-ownership-matrix.md` | Authenticated reads and write-side execution are separate operation families; consumers must not infer LIVE submit/cancel from catalog, probe, balance, position, or open-order read support. |
| `docs/security/secure-development-lifecycle.md` | Money-impacting behavior must fail closed when identity, ownership, payment, or policy is uncertain, and secrets must stay out of code/logs/artifacts. |
| `scripts/runProdSecurityExchangeProof.mjs` | Existing helper encodes a read-only/fail-closed production security/exchange proof shape and redacts tokens, cookies, passwords, private headers, API secrets, and response bodies that may contain secrets. |

## Allowed Protected Readback Scope

Allowed only after an approved protected session/principal is available through
secret refs or transient runner bindings, with redacted artifacts:

| Capability / chain | Allowed readback | Required evidence | Stop condition |
| --- | --- | --- | --- |
| Auth/session and security headers | Build-info, `/health`, `/ready`, unauthenticated fail-closed checks, authenticated profile read with no-store headers | HTTP status codes, build SHA, header booleans, redacted summary | Token/cookie capture would be needed; protected route does not fail closed; response exposes key material |
| Profile API-key stewardship | `GET /dashboard/profile/apiKeys` list summary and unsupported exchange probe fail-closed | Count/status only, redaction check result, unsupported capability detail without submitted key values | Raw API key/secret appears in response/artifact; probe would require storing or printing secret values |
| Exchange market catalogs | Read-only market catalog for supported exchanges/market types | Item counts, canonical-symbol checks, status codes | Catalog call requires exchange credential value or returns non-canonical/misleading symbols |
| Authenticated ops readiness | `/ready/details` readback with approved protected principal | Status code and selected booleans only, such as no-order guard active/inactive | Diagnostics expose secrets or require DB/Redis/env mutation |
| Wallet/balance preview | Existing authenticated read route only, if principal owns the wallet/API-key context | Masked status/count/currency summary; no raw account identifiers beyond approved masked labels | Requires API-key setting change, exchange credential disclosure, or write-side permission expansion |
| Positions/open orders/trade history snapshots | Existing authenticated snapshot routes through canonical exchange read boundaries | Row counts, masked symbol/status summaries, ownership/user match, no exchange mutation | Snapshot endpoint attempts cancel/close/submit, mutates local state, or needs broader account authority |
| Runtime/bot monitoring | Dashboard/runtime read-only status, logs, and audit trace | Route/status summaries, row counts, active/inactive state labels | Requires enabling a bot, changing live opt-in, assistant hot-path action, order, close, cancel, or settings mutation |

## Forbidden Actions Under Read-Only Proof

These actions require a separate LIVE mutation proposal and approval. They are
not authorized by this packet:

- LIVE order submit, including manual order open or runtime automated open.
- LIVE order cancel or position close, even when the UI/API path has local
  confirmation fields.
- Bot activation, LIVE opt-in, runtime start/stop, strategy risk change, market
  group change, wallet exchange setting change, or subscription/payment change.
- API-key create/update/delete/probe with real raw secret values captured in
  logs, comments, files, screenshots, or artifacts.
- Exchange-side transfers, deposits, withdrawals, leverage/margin changes,
  position mode changes, or any account setting mutation.
- Deploy, production restart, rollback, DB/Redis mutation, migration, or
  Coolify mutation.
- Any broad screenshot or artifact that reveals credentials, cookies, tokens,
  private headers, API keys, payment data, exchange identifiers beyond approved
  masked labels, or raw account balances when not needed for the proof claim.

## Required Principal / Session Class

Read-only proof can proceed only with one of these approved session classes:

1. `SOAR_PROD_TEST_EMAIL` + `SOAR_PROD_TEST_PASSWORD` for a production test
   account that is approved for non-mutating readback.
2. A transient `PROD_SECURITY_EXCHANGE_AUTH_TOKEN` or equivalent
   Paperclip-provided protected auth token, injected at runtime and never
   written to repo files or issue comments.
3. A scoped owner-approved account session only when the requested readback
   requires that account's connected exchange context, with the exact routes
   and evidence fields predeclared.

The principal must have the minimum required access for the readback. Admin,
owner, deploy, Coolify, database, or exchange credential access must not be
used unless that access family is explicitly required and approved for the
proof.

## Protected Input Families

Acceptable names are binding names only. Values must never be printed,
committed, attached, or pasted into comments.

| Purpose | Accepted binding families |
| --- | --- |
| Production app URLs | `SOAR_PROD_BASE_URL`, `SOAR_API_BASE_URL`, `PROD_SECURITY_EXCHANGE_WEB_BASE_URL`, `PROD_SECURITY_EXCHANGE_API_BASE_URL` |
| Build freshness | `PROD_SECURITY_EXCHANGE_EXPECTED_SHA` |
| Protected session | `SOAR_PROD_TEST_EMAIL`, `SOAR_PROD_TEST_PASSWORD`, `PROD_SECURITY_EXCHANGE_AUTH_TOKEN`, `PROD_SECURITY_EXCHANGE_AUTH_EMAIL`, `PROD_SECURITY_EXCHANGE_AUTH_PASSWORD` |
| Read-only output paths | `PROD_SECURITY_EXCHANGE_OUTPUT_JSON`, `PROD_SECURITY_EXCHANGE_OUTPUT_MD` |
| LIVE mutation approver identity, if later proposed | Named Paperclip board/owner approval, linked issue, and exact parameter packet; no secret values |

## Evidence Artifacts Allowed

- Markdown and JSON summaries with route names, status codes, timestamps, build
  SHA, counts, booleans, and masked labels only.
- Redaction checks proving no token, cookie, private header, API secret, API
  key, or raw credential appeared in captured payloads.
- Command lines that use env vars or secret refs by name only.
- Failure summaries that stop before protected or mutation boundaries.

Evidence artifacts must not include raw request/response bodies for protected
exchange/account routes unless a reviewer confirms the body shape is
non-sensitive and redacted.

## LIVE Mutation Proposal Boundary

Any LIVE mutation proposal must be a separate Paperclip issue or approval
packet owned by Integration Trading with Security, QA/Test Automation, and Ops
review. The packet must include:

| Required field | Minimum content |
| --- | --- |
| Exact action | Exchange, market type, symbol, side, order type, quantity/notional, reduce-only/close-only status, and target route/helper |
| Account and principal | Test or owner account class, why read-only proof is insufficient, and why the principal is allowed |
| Safety gates | Entitlement, `riskAck`, consent text/version, no-order guard status, min-notional/contract-size check, fail-closed handling |
| Rollback/cleanup | How to deactivate bots, cancel stale orders if approved, and verify final state without escalating mutation scope |
| Evidence | Redacted request metadata, exchange response classification, local Soar state readback, exchange state readback if approved |
| Stop conditions | Missing auth/session, build mismatch, unsupported capability, ambiguous ownership, stale order/position, no explicit approval, unexpected open exposure, or any request to reveal a secret |

Approval must be explicit for the exact mutation and size. Approval for
protected readback, fixture proof, public smoke, or API-key probe does not
authorize LIVE submit/cancel/close.

## Disposition

- Protected read-only proof: can proceed when approved protected session/input
  bindings are present and the run stays inside the allowed readback scope.
- Board approval: required before any LIVE exchange-side mutation or any
  production app/account setting mutation.
- Current heartbeat: no protected input/session binding was consumed, so this
  packet is ready but no production readback is claimed.

## Validation

- `git diff --check`
  - Result: PASS, no whitespace errors.
- `node --test scripts/runProdSecurityExchangeProof.test.mjs`
  - Result: PASS, `4/4` tests.

## Regression Risk

- Low runtime risk: no product runtime code changed.
- Medium process risk: future operators may confuse read-only protected
  exchange proof with approval for LIVE order submit/cancel/close. This packet
  mitigates that by separating the principal/session class, allowed evidence,
  forbidden actions, and owner path for LIVE mutation proposals.

## Follow-Up Gap

Create or resume a separate Integration Trading / QA / Ops execution issue
only after a specific read-only proof run or LIVE mutation proposal exists.
Read-only proof can use `scripts/runProdSecurityExchangeProof.mjs` with
approved protected bindings and redacted output. LIVE mutation must not use
this issue as approval.
