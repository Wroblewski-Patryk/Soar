# Feature Index

Updated: 2026-05-31

This index groups Soar by product/architecture feature and shows how much graph, route, API, action, and proof surface each feature has.

## Feature Matrix

| Feature | Nodes | Chains | Actions | Pages | APIs | Proof gaps | Worst chain | Worst severity |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| auth-session | 39 | 2 | 5 | 3 | 4 | 4 | CHAIN-AUTH-SESSION-DEEP | high |
| backtests | 39 | 1 | 3 | 3 | 7 | 4 | CHAIN-BACKTESTS | high |
| runtime-support-services | 39 | 1 | 0 | 0 | 0 | 1 | CHAIN-RUNTIME-SUPPORT-SERVICES | high |
| subscriptions-admin | 38 | 1 | 3 | 3 | 6 | 4 | CHAIN-SUBSCRIPTIONS-ADMIN | high |
| api-support-routes | 35 | 1 | 0 | 0 | 8 | 1 | CHAIN-API-SUPPORT-ROUTES | high |
| exchange-adapter | 35 | 1 | 0 | 0 | 0 | 1 | CHAIN-EXCHANGE-ADAPTER-DEEP | high |
| wallets | 34 | 1 | 6 | 6 | 11 | 7 | CHAIN-WALLETS-CORE | high |
| strategies | 33 | 1 | 4 | 4 | 8 | 5 | CHAIN-STRATEGIES | high |
| manual-order | 32 | 2 | 1 | 0 | 6 | 3 | CHAIN-MANUAL-ORDER | high |
| bot-setup | 30 | 1 | 6 | 6 | 8 | 7 | CHAIN-BOT-SETUP | high |
| positions | 27 | 1 | 1 | 1 | 9 | 2 | CHAIN-POSITIONS-CORE | high |
| profile-api-keys | 26 | 1 | 1 | 1 | 8 | 2 | CHAIN-PROFILE-API-KEYS | high |
| markets | 25 | 1 | 3 | 3 | 6 | 4 | CHAIN-MARKETS | high |
| ai-assistant-foundation | 24 | 1 | 1 | 1 | 5 | 2 | CHAIN-AI-ASSISTANT-FOUNDATION | high |
| bot-runtime | 24 | 1 | 1 | 1 | 7 | 2 | CHAIN-BOT-RUNTIME-CORE | high |
| web-runtime-surfaces | 24 | 1 | 0 | 0 | 0 | 1 | CHAIN-WEB-RUNTIME-SURFACES | high |
| api-platform-safety | 21 | 1 | 0 | 0 | 0 | 1 | CHAIN-API-PLATFORM-SAFETY | high |
| ops-config-pipeline | 16 | 1 | 0 | 0 | 0 | 1 | CHAIN-OPS-CONFIG-PIPELINE | high |
| dashboard-runtime | 15 | 1 | 1 | 1 | 1 | 2 | CHAIN-DASHBOARD-RUNTIME | high |
| engine-runtime-core | 15 | 1 | 0 | 0 | 0 | 1 | CHAIN-ENGINE-RUNTIME-CORE | high |
| logs-audit | 13 | 1 | 1 | 1 | 1 | 2 | CHAIN-LOGS-AUDIT | high |
| reports | 13 | 1 | 1 | 1 | 1 | 2 | CHAIN-REPORTS | high |
| market-data-stream-adapters | 11 | 1 | 0 | 0 | 0 | 1 | CHAIN-MARKET-DATA-STREAM-ADAPTERS | high |
| architecture-map | 10 | 0 | 0 | 0 | 0 | 0 | none | none |
| release-audit-tooling | 8 | 1 | 0 | 0 | 0 | 1 | CHAIN-RELEASE-AUDIT-TOOLING | high |
| web-residual-surfaces | 8 | 0 | 1 | 1 | 0 | 1 | none | none |
| profile-basic | 4 | 0 | 0 | 0 | 0 | 0 | none | none |
| runtime-dca-pnl | 4 | 1 | 0 | 0 | 0 | 1 | CHAIN-RUNTIME-DCA-PNL | high |
| profile-security | 2 | 0 | 0 | 0 | 0 | 0 | none | none |
| data-model | 1 | 0 | 0 | 0 | 0 | 0 | none | none |

## Use

1. Pick the feature you are about to touch.
2. Open the matching chains from [[architecture/chains/README.md|Architecture Chains]].
3. Check [[obsidian/proof-gap-register.md|Proof Gap Register]] before claiming behavior is complete.
4. Update the graph source rows if routes, APIs, tests, or docs changed.
