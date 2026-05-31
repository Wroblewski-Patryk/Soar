# Function Journey Hotlist

Updated: 2026-05-31

This note distills the generated journey indexes into an Obsidian-readable action surface. It should be the main place to choose what to verify or clean next.

## Highest Function Chain Gaps

| Severity | Chain | Feature | Status | Start here | Next proof |
| --- | --- | --- | --- | --- | --- |
| high | CHAIN-AI-ASSISTANT-FOUNDATION | ai-assistant-foundation | verified_local | SOAR-PAGE-BOT-ASSISTANT | missing_proof:Hot-path runtime AI trading remains deferred and requires separate red-team proof; production_or_browser_proof_not_implied |
| high | CHAIN-API-PLATFORM-SAFETY | api-platform-safety | verified_local | SOAR-CONFIG-RUNTIME-EXECUTION | missing_proof:Fresh adversarial security review remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-API-SUPPORT-ROUTES | api-support-routes | verified_local | SOAR-ROUTER-API-ROOT | missing_proof:Fresh authenticated browser proof for profile/upload UI consumers remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-AUTH-SESSION-DEEP | auth-session | verified_local | SOAR-PAGE-PUBLIC-HOME; SOAR-PAGE-LOGIN; SOAR-PAGE-REGISTER | missing_proof:Fresh production auth browser proof remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-BACKTESTS | backtests | verified_local | SOAR-PAGE-BACKTESTS-LIST; SOAR-PAGE-BACKTEST-CREATE; SOAR-PAGE-BACKTEST-DETAIL | missing_proof:Fresh authenticated browser proof and heavy replay performance proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-BOT-RUNTIME-CORE | bot-runtime | verified_local | SOAR-PAGE-BOT-RUNTIME | missing_proof:Fresh authenticated production runtime readback remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-BOT-SETUP | bot-setup | verified_local | SOAR-PAGE-BOTS-LIST; SOAR-PAGE-BOT-CREATE; SOAR-PAGE-BOT-EDIT; SOAR-PAGE-BOT-PREVIEW | missing_proof:Fresh authenticated browser proof and LIVE activation proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-DASHBOARD-RUNTIME | dashboard-runtime | partially_verified | SOAR-PAGE-DASHBOARD | missing_proof:Fresh authenticated browser proof after public reachability restore; partial_chain_status |
| high | CHAIN-ENGINE-RUNTIME-CORE | engine-runtime-core | verified_local | SOAR-SERVICE-RUNTIME-SCAN-LOOP | missing_proof:Fresh end-to-end runtime journey and protected LIVE exchange mutation proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-EXCHANGE-ADAPTER-DEEP | exchange-adapter | verified_local | SOAR-FEATURE-EXCHANGE-ADAPTER | missing_proof:Fresh approved production LIVE mutation proof remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-LOGS-AUDIT | logs-audit | verified_local | SOAR-PAGE-LOGS | missing_proof:Fresh authenticated browser proof and production action-produced readback remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-MANUAL-ORDER | manual-order | verified_local | SOAR-COMP-HOME-LIVE-WIDGETS | no_page_entrypoint; missing_proof:Approval-gated LIVE mutation proof; production_or_browser_proof_not_implied |
| high | CHAIN-MANUAL-ORDER-DEEP | manual-order | verified_local | SOAR-COMP-HOME-LIVE-WIDGETS | no_page_entrypoint; missing_proof:Protected production manual/bot readback and approval-gated LIVE mutation proof; production_or_browser_proof_not_implied |
| high | CHAIN-MARKET-DATA-STREAM-ADAPTERS | market-data-stream-adapters | verified_local | SOAR-SERVICE-MARKET-DATA | missing_proof:Fresh live exchange stream proof remains separate; production_or_browser_proof_not_implied |
| high | CHAIN-MARKETS | markets | verified_local | SOAR-PAGE-MARKETS-LIST; SOAR-PAGE-MARKET-CREATE; SOAR-PAGE-MARKET-EDIT | missing_proof:Fresh authenticated browser proof and production market mutation proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-OPS-CONFIG-PIPELINE | ops-config-pipeline | verified_local | SOAR-CONFIG-ROOT-PACKAGE | missing_proof:Production Coolify stack deployment and protected proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-POSITIONS-CORE | positions | verified_local | SOAR-PAGE-POSITIONS-LEGACY; SOAR-PAGE-DASHBOARD | missing_proof:Fresh production-safe positions clickthrough and protected LIVE readback remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-PROFILE-API-KEYS | profile-api-keys | verified_local | SOAR-PAGE-PROFILE | missing_proof:Fresh authenticated browser proof and secret-bearing production probe proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-RELEASE-AUDIT-TOOLING | release-audit-tooling | verified_local | SOAR-FEATURE-RELEASE-AUDIT-TOOLING | missing_proof:Protected production input proof remains blocked by missing operator-provided environment names; production_or_browser_proof_not_implied |
| high | CHAIN-REPORTS | reports | verified_local | SOAR-PAGE-REPORTS | missing_proof:Fresh authenticated browser proof and production report readback remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-RUNTIME-DCA-PNL | runtime-dca-pnl | verified_local | SOAR-FEATURE-RUNTIME-DCA-PNL | missing_proof:Protected production readback; production_or_browser_proof_not_implied |
| high | CHAIN-RUNTIME-SUPPORT-SERVICES | runtime-support-services | verified_local | SOAR-SERVICE-BOTS-RUNTIME-READ | missing_proof:Fresh end-to-end runtime journey and protected LIVE proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-STRATEGIES | strategies | verified_local | SOAR-PAGE-STRATEGIES-LIST; SOAR-PAGE-STRATEGY-CREATE; SOAR-PAGE-STRATEGY-EDIT; SOAR-PAGE-STRATEGY-ID-ROOT | missing_proof:Fresh authenticated browser proof and production strategy mutation proof remain separate; production_or_browser_proof_not_implied |
| high | CHAIN-SUBSCRIPTIONS-ADMIN | subscriptions-admin | verified_local | SOAR-PAGE-ADMIN-ROOT; SOAR-PAGE-ADMIN-SUBSCRIPTIONS; SOAR-PAGE-ADMIN-USERS | missing_proof:Fresh authenticated browser proof checkout provider callback proof and production admin mutation proof remain separate; production_or_browser_proof_not_implied |

## Highest User Action Gaps

| Severity | Action | Route | Boundary | Proof status |
| --- | --- | --- | --- | --- |
| high | SOAR-ACTION-UI-MANUAL-ORDER-SUBMIT | /dashboard | protected; money_or_exchange; mutation | verified_local_only |
| high | SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE | apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx | read_or_navigation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-ADMIN-ROOT | /admin | protected; read_or_navigation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-ADMIN-SUBSCRIPTIONS | /admin/subscriptions | protected; mutation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-ADMIN-USERS | /admin/users | protected; mutation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE | /dashboard/backtests/create | protected; mutation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BACKTEST-DETAIL | /dashboard/backtests/:id | protected; read_or_navigation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BACKTESTS-LIST | /dashboard/backtests/list | protected; destructive | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BOT-ASSISTANT | /dashboard/bots/:id/assistant | protected; read_or_navigation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BOT-CREATE | /dashboard/bots/create | protected; mutation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BOT-DETAIL-ALIAS | /dashboard/bots/:id | protected; read_or_navigation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BOT-EDIT | /dashboard/bots/:id/edit | protected; mutation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BOT-NEW-ALIAS | /dashboard/bots/new | protected; mutation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BOT-PREVIEW | /dashboard/bots/:id/preview | protected; read_or_navigation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME | /dashboard/bots/:id/runtime | protected; read_or_navigation | partially_verified |
| high | SOAR-ACTION-VISIT-PAGE-BOTS-LIST | /dashboard/bots | protected; destructive | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-DASHBOARD | /dashboard | protected; read_or_navigation | partially_verified |
| high | SOAR-ACTION-VISIT-PAGE-LOGS | /dashboard/logs | protected; read_or_navigation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-MARKET-CREATE | /dashboard/markets/create | protected; mutation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-MARKET-EDIT | /dashboard/markets/:id/edit | protected; mutation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-MARKETS-LIST | /dashboard/markets/list | protected; destructive | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-OFFLINE | /offline | read_or_navigation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-POSITIONS-LEGACY | apps/web/src/middleware.ts | protected; read_or_navigation | verified_local_only |
| high | SOAR-ACTION-VISIT-PAGE-PROFILE | /dashboard/profile | protected; mutation | verified_local_only |

## Interpretation

- Critical or high gaps do not mean the app is broken. They mean the current graph cannot safely prove the behavior at the level claimed.
- Protected, destructive, money-facing, exchange-facing, and production-only paths need stronger proof than local unit tests.
- When a row is fixed, update the graph registry or chain source first, then regenerate indexes.

## Dataview: Related Status Notes

```dataview
TABLE file.mtime AS Updated
FROM "status"
SORT file.mtime DESC
```
