# Code To Docs Atlas

Updated: 2026-05-31

This atlas summarizes the generated graph surface. It is meant for fast orientation before editing code, writing docs, or delegating cleanup to an autonomous agent.

## Canonical Inputs

| Input | Role |
| --- | --- |
| [[architecture/registry/nodes.csv|nodes.csv]] | Source registry for features, pages, APIs, services, data models, tests, docs, and agents. |
| [[architecture/relations/dependencies.csv|dependencies.csv]] | Directed relation map between graph nodes. |
| [[architecture/chains/chains.csv|chains.csv]] | End-to-end function chains. |
| [[architecture/indices/function-chain-evidence-index.csv|function-chain-evidence-index.csv]] | Generated chain proof index. |
| [[architecture/indices/user-action-index.csv|user-action-index.csv]] | Generated user action proof index. |
| [[architecture/indices/web-journey-index.csv|web-journey-index.csv]] | Generated page/route journey index. |
| [[architecture/indices/api-surface-evidence-index.csv|api-surface-evidence-index.csv]] | Generated API evidence index. |

## Feature Atlas

| Feature | Nodes | Chains | Actions | Pages | APIs |
| --- | --- | --- | --- | --- | --- |
| auth-session | 39 | 2 | 5 | 3 | 4 |
| backtests | 39 | 1 | 3 | 3 | 7 |
| runtime-support-services | 39 | 1 | 0 | 0 | 0 |
| subscriptions-admin | 38 | 1 | 3 | 3 | 6 |
| api-support-routes | 35 | 1 | 0 | 0 | 8 |
| exchange-adapter | 35 | 1 | 0 | 0 | 0 |
| wallets | 34 | 1 | 6 | 6 | 11 |
| strategies | 33 | 1 | 4 | 4 | 8 |
| manual-order | 32 | 2 | 1 | 0 | 6 |
| bot-setup | 30 | 1 | 6 | 6 | 8 |
| positions | 27 | 1 | 1 | 1 | 9 |
| profile-api-keys | 26 | 1 | 1 | 1 | 8 |
| markets | 25 | 1 | 3 | 3 | 6 |
| ai-assistant-foundation | 24 | 1 | 1 | 1 | 5 |
| bot-runtime | 24 | 1 | 1 | 1 | 7 |
| web-runtime-surfaces | 24 | 1 | 0 | 0 | 0 |
| api-platform-safety | 21 | 1 | 0 | 0 | 0 |
| ops-config-pipeline | 16 | 1 | 0 | 0 | 0 |
| dashboard-runtime | 15 | 1 | 1 | 1 | 1 |
| engine-runtime-core | 15 | 1 | 0 | 0 | 0 |
| logs-audit | 13 | 1 | 1 | 1 | 1 |
| reports | 13 | 1 | 1 | 1 | 1 |
| market-data-stream-adapters | 11 | 1 | 0 | 0 | 0 |
| architecture-map | 10 | 0 | 0 | 0 | 0 |
| release-audit-tooling | 8 | 1 | 0 | 0 | 0 |
| web-residual-surfaces | 8 | 0 | 1 | 1 | 0 |
| profile-basic | 4 | 0 | 0 | 0 | 0 |
| runtime-dca-pnl | 4 | 1 | 0 | 0 | 0 |
| profile-security | 2 | 0 | 0 | 0 | 0 |
| data-model | 1 | 0 | 0 | 0 | 0 |

## Useful Commands

| Command | Use |
| --- | --- |
| `pnpm run architecture:graph:generate` | Rebuild architecture graph source files. |
| `pnpm run architecture:graph:drift` | Check graph drift against the repo. |
| `pnpm run architecture:journey:index` | Regenerate function and user-action indexes. |
| `pnpm run docs:parity:check` | Check docs parity. |
| `pnpm run ops:project:index` | Generate a broad project index in history. |

## How To Navigate

1. Start from a feature in this atlas.
2. Open the matching chain in [[architecture/chains/README.md|Architecture Chains]].
3. Use [[obsidian/function-journey-hotlist.md|Function Journey Hotlist]] to see proof gaps.
4. Open linked module docs under [[modules/README.md|Modules]].
5. Touch code only after identifying the owner doc and test/proof path.
