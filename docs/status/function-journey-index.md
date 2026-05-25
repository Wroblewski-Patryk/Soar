# Function Journey Evidence Index

Last generated: 2026-05-25

This index connects user-visible entrypoints, graph function chains, API routes, tests, docs, evidence artifacts, and explicit gaps. It is generated from the architecture graph CSV source of truth and is meant to answer: what works, what is only locally proven, and what still lacks browser or production proof.

## Generated Files

- `docs/architecture/indices/function-chain-evidence-index.csv`
- `docs/architecture/indices/web-journey-index.csv`
- `docs/architecture/indices/api-surface-evidence-index.csv`
- `docs/graphs/function-journey-index.json`
- `history/artifacts/function-journey-index-2026-05-25.json`

## Summary

| Index | Rows |
| --- | ---: |
| Function chains | 27 |
| Web journeys / pages | 36 |
| API surfaces | 96 |
| Critical gaps | 0 |
| High gaps | 28 |

## Gap Semantics

- `critical`: missing chain node, missing tests, missing API route, or another defect that prevents confidence.
- `high`: proof is local-only, browser/production/protected evidence is missing, or a chain is partially verified.
- `medium`: docs, consumers, chain membership, or explicit not-applicable evidence should be tightened.
- `none`: no generated gap found from current graph records. This does not replace fresh real journey proof after changes.

## Highest Priority Gaps

| Severity | ID | Feature | Status | Gaps |
| --- | --- | --- | --- | --- |
| high | CHAIN-DASHBOARD-RUNTIME | dashboard-runtime | partially_verified | missing_proof:Fresh authenticated browser proof after public reachability restore; partial_chain_status |
| high | CHAIN-MANUAL-ORDER | manual-order | verified_local | no_page_entrypoint; missing_proof:Approval-gated LIVE mutation proof; production_or_browser_proof_not_implied |
| high | CHAIN-RUNTIME-DCA-PNL | runtime-dca-pnl | verified_local | missing_proof:Protected production readback; production_or_browser_proof_not_implied |
| high | CHAIN-MANUAL-ORDER-DEEP | manual-order | verified_local | no_page_entrypoint; missing_proof:Protected production manual/bot readback and approval-gated LIVE mutation proof; production_or_browser_proof_not_implied |
| high | CHAIN-POSITIONS-CORE | positions | verified_local | missing_proof:Fresh production-safe positions clickthrough and protected LIVE readback remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-BOT-RUNTIME-CORE | bot-runtime | verified_local | missing_proof:Fresh authenticated production runtime readback remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-RELEASE-AUDIT-TOOLING | release-audit-tooling | verified_local | missing_proof:Protected production input proof remains blocked by missing operator-provided environment names; production_or_browser_proof_not_implied |
| high | CHAIN-EXCHANGE-ADAPTER-DEEP | exchange-adapter | verified_local | missing_proof:Fresh approved production LIVE mutation proof remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-WALLETS-CORE | wallets | verified_local | missing_proof:Fresh authenticated browser proof and approved LIVE mutation/readback remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-PROFILE-API-KEYS | profile-api-keys | verified_local | missing_proof:Fresh authenticated browser proof and secret-bearing production probe proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-BOT-SETUP | bot-setup | verified_local | missing_proof:Fresh authenticated browser proof and LIVE activation proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-STRATEGIES | strategies | verified_local | missing_proof:Fresh authenticated browser proof and production strategy mutation proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-MARKETS | markets | verified_local | missing_proof:Fresh authenticated browser proof and production market mutation proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-BACKTESTS | backtests | verified_local | missing_proof:Fresh authenticated browser proof and heavy replay performance proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-REPORTS | reports | verified_local | missing_proof:Fresh authenticated browser proof and production report readback remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-LOGS-AUDIT | logs-audit | verified_local | missing_proof:Fresh authenticated browser proof and production action-produced readback remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-SUBSCRIPTIONS-ADMIN | subscriptions-admin | verified_local | missing_proof:Fresh authenticated browser proof checkout provider callback proof and production admin mutation proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-AI-ASSISTANT-FOUNDATION | ai-assistant-foundation | verified_local | missing_proof:Hot-path runtime AI trading remains deferred and requires separate red-team proof; production_or_browser_proof_not_implied |
| high | CHAIN-OPS-CONFIG-PIPELINE | ops-config-pipeline | verified_local | missing_proof:Remote CI run status and protected production deployment proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-API-SUPPORT-ROUTES | api-support-routes | verified_local | missing_proof:Fresh authenticated browser proof for profile/upload UI consumers remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-RUNTIME-SUPPORT-SERVICES | runtime-support-services | verified_local | missing_proof:Fresh end-to-end runtime journey and protected LIVE proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-API-PLATFORM-SAFETY | api-platform-safety | verified_local | missing_proof:Fresh adversarial security review remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-WEB-RUNTIME-SURFACES | web-runtime-surfaces | verified_local | missing_proof:Fresh authenticated browser runtime journey remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-AUTH-SESSION-DEEP | auth-session | verified_local | missing_proof:Fresh production auth browser proof remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-ENGINE-RUNTIME-CORE | engine-runtime-core | verified_local | missing_proof:Fresh end-to-end runtime journey and protected LIVE exchange mutation proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-MARKET-DATA-STREAM-ADAPTERS | market-data-stream-adapters | verified_local | missing_proof:Fresh live exchange stream proof remains separate; production_or_browser_proof_not_implied |
| high | SOAR-PAGE-DASHBOARD | dashboard-runtime | partially_verified | page_status:partially_verified |
| high | SOAR-API-BOT-RUNTIME-POSITIONS | dashboard-runtime | partially_verified | api_status:partially_verified |
| medium | SOAR-PAGE-BOT-NEW-ALIAS | bot-setup | verified_local | not_in_function_chain |
| medium | SOAR-PAGE-BOT-DETAIL-ALIAS | bot-setup | verified_local | not_in_function_chain |
| medium | SOAR-PAGE-OFFLINE | web-residual-surfaces | verified_local | not_in_function_chain |
| medium | SOAR-API-ORDER-LIST | manual-order | verified | not_in_function_chain |
| medium | SOAR-API-ORDER-GET | manual-order | verified | not_in_function_chain |
| medium | SOAR-API-ORDER-CANCEL | manual-order | verified | not_in_function_chain |
| medium | SOAR-API-ORDER-CLOSE | manual-order | verified | not_in_function_chain |
| medium | SOAR-API-POSITION-MANAGEMENT-MODE | positions | verified_local | not_in_function_chain |
| medium | SOAR-API-STRATEGY-INDICATORS | strategies | verified_local | no_data_or_explicit_na |
| medium | SOAR-API-MARKET-CATALOG | markets | verified_local | no_data_or_explicit_na |
| medium | SOAR-API-ICON-LOOKUP | api-support-routes | verified_local | no_data_or_explicit_na |
| medium | SOAR-API-MARKET-STREAM-EVENTS | api-support-routes | verified_local | no_data_or_explicit_na |

## Use

Before fixing a user-reported failure, look up the route/action in `web-journey-index.csv`, follow the linked chain in `function-chain-evidence-index.csv`, then inspect API consumers and proof in `api-surface-evidence-index.csv`. If a path is marked local-only, do not claim production behavior until a matching browser or protected proof exists.
