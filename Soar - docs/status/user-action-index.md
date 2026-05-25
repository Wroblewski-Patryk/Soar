# User Action Evidence Index

Last generated: 2026-05-25

This generated index maps user-visible web entrypoints and explicit UI controls to API routes, function chains, backend functions, data models, tests, docs, evidence, safety boundaries, and proof gaps.

## Generated Files

- `docs/architecture/indices/user-action-index.csv`
- `docs/graphs/user-action-index.json`
- `history/artifacts/user-action-index-2026-05-25.json`

## Summary

| Metric | Count |
| --- | ---: |
| Actions | 39 |
| Route visit/read actions | 36 |
| Explicit UI actions | 3 |
| Critical gaps | 0 |
| High gaps | 37 |
| Medium gaps | 0 |

## Gap Semantics

- `critical`: the action is missing tests or a mutating action has no API mapping.
- `high`: the action is protected, money-facing, destructive, local-only, or partially verified and still needs fresh browser or production proof.
- `medium`: the action is structurally useful but needs tighter explicit UI control or chain mapping.
- `none`: no generated gap found from current records. Re-run journey proof after code changes.

## Highest Priority Gaps

| Severity | Action | Route / entrypoint | Boundary | Proof | Gaps |
| --- | --- | --- | --- | --- | --- |
| high | SOAR-ACTION-UI-MANUAL-ORDER-SUBMIT | /dashboard | protected; money_or_exchange; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-UI-PASSWORD-VISIBILITY-TOGGLE | apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx | read_or_navigation | verified_local_only | no_page_entrypoint_relation; local_only_without_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-ADMIN-ROOT | /admin | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-ADMIN-SUBSCRIPTIONS | /admin/subscriptions | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-ADMIN-USERS | /admin/users | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE | /dashboard/backtests/create | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BACKTEST-DETAIL | /dashboard/backtests/:id | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BACKTESTS-LIST | /dashboard/backtests/list | protected; destructive | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BOT-ASSISTANT | /dashboard/bots/:id/assistant | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BOT-CREATE | /dashboard/bots/create | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BOT-DETAIL-ALIAS | /dashboard/bots/:id | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BOT-EDIT | /dashboard/bots/:id/edit | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BOT-NEW-ALIAS | /dashboard/bots/new | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BOT-PREVIEW | /dashboard/bots/:id/preview | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME | /dashboard/bots/:id/runtime | protected; read_or_navigation | partially_verified | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-BOTS-LIST | /dashboard/bots | protected; destructive | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-DASHBOARD | /dashboard | protected; read_or_navigation | partially_verified | partial_registry_status; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-LOGS | /dashboard/logs | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-MARKET-CREATE | /dashboard/markets/create | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-MARKET-EDIT | /dashboard/markets/:id/edit | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-MARKETS-LIST | /dashboard/markets/list | protected; destructive | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-OFFLINE | /offline | read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-POSITIONS-LEGACY | apps/web/src/middleware.ts | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-PROFILE | /dashboard/profile | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-PUBLIC-HOME | / | public; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-REGISTER | /auth/register | public; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-REPORTS | /dashboard/reports | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-STRATEGIES-LIST | /dashboard/strategies/list | protected; destructive | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-STRATEGY-CREATE | /dashboard/strategies/create | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-STRATEGY-EDIT | /dashboard/strategies/:id/edit | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-STRATEGY-ID-ROOT | /dashboard/strategies/:id | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-WALLET-CREATE | /dashboard/wallets/create | protected; mutation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-WALLET-EDIT | /dashboard/wallets/:id/edit | protected; destructive | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-WALLET-ID-ROOT | /dashboard/wallets/:id | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-WALLET-PREVIEW | /dashboard/wallets/:id/preview | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-WALLETS-LIST | /dashboard/wallets/list | protected; destructive | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |
| high | SOAR-ACTION-VISIT-PAGE-WALLETS-ROOT | /dashboard/wallets | protected; read_or_navigation | verified_local_only | local_only_without_fresh_browser_or_production_proof; protected_or_money_path_needs_fresh_browser_or_production_proof |

## Use

When a UI change is made, locate the affected action row, inspect `api_routes`, `function_chains`, `backend_functions`, `data_models`, and `tests`, then run the listed proof path. Do not close a protected or money-facing action as verified from unit tests alone.
