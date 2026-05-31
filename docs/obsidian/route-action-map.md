# Route Action Map

Updated: 2026-05-31

This map connects web/page journeys to generated user action proof data. It is the fastest way to inspect what a screen or route is supposed to prove.

## Routes And Actions

| Route | Page | Feature | Status | Chains | Actions | Gap severity | Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx | SOAR-PAGE-BOT-ASSISTANT | ai-assistant-foundation | verified_local | CHAIN-AI-ASSISTANT-FOUNDATION | 1 | none | none |
| apps/web/src/features/auth/components/LoginForm.tsx | SOAR-PAGE-LOGIN | auth-session | verified | CHAIN-AUTH-SESSION; CHAIN-AUTH-SESSION-DEEP | 5 | none | none |
| apps/web/src/app/(public)/page.tsx | SOAR-PAGE-PUBLIC-HOME | auth-session | verified_local | CHAIN-AUTH-SESSION-DEEP | 5 | none | none |
| apps/web/src/app/(public)/auth/register/page.tsx | SOAR-PAGE-REGISTER | auth-session | verified_local | CHAIN-AUTH-SESSION-DEEP | 5 | none | none |
| apps/web/src/app/dashboard/backtests/create/page.tsx | SOAR-PAGE-BACKTEST-CREATE | backtests | verified_local | CHAIN-BACKTESTS | 3 | none | none |
| apps/web/src/app/dashboard/backtests/[id]/page.tsx | SOAR-PAGE-BACKTEST-DETAIL | backtests | verified_local | CHAIN-BACKTESTS | 3 | none | none |
| apps/web/src/app/dashboard/backtests/list/page.tsx | SOAR-PAGE-BACKTESTS-LIST | backtests | verified_local | CHAIN-BACKTESTS | 3 | none | none |
| apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx | SOAR-PAGE-BOT-RUNTIME | bot-runtime | verified_local | CHAIN-BOT-RUNTIME-CORE | 3 | none | none |
| apps/web/src/app/dashboard/bots/create/page.tsx | SOAR-PAGE-BOT-CREATE | bot-setup | verified_local | CHAIN-BOT-SETUP | 6 | none | none |
| apps/web/src/app/dashboard/bots/[id]/page.tsx | SOAR-PAGE-BOT-DETAIL-ALIAS | bot-setup | verified_local | none | 6 | medium | not_in_function_chain |
| apps/web/src/app/dashboard/bots/[id]/edit/page.tsx | SOAR-PAGE-BOT-EDIT | bot-setup | verified_local | CHAIN-BOT-SETUP | 6 | none | none |
| apps/web/src/app/dashboard/bots/new/page.tsx | SOAR-PAGE-BOT-NEW-ALIAS | bot-setup | verified_local | none | 6 | medium | not_in_function_chain |
| apps/web/src/app/dashboard/bots/[id]/preview/page.tsx | SOAR-PAGE-BOT-PREVIEW | bot-setup | verified_local | CHAIN-BOT-SETUP | 6 | none | none |
| apps/web/src/app/dashboard/bots/page.tsx | SOAR-PAGE-BOTS-LIST | bot-setup | verified_local | CHAIN-BOT-SETUP | 6 | none | none |
| apps/web/src/app/dashboard/page.tsx | SOAR-PAGE-DASHBOARD | dashboard-runtime | partially_verified | CHAIN-DASHBOARD-RUNTIME; CHAIN-POSITIONS-CORE; CHAIN-WEB-RUNTIME-SURFACES | 4 | high | page_status:partially_verified |
| apps/web/src/app/dashboard/logs/page.tsx | SOAR-PAGE-LOGS | logs-audit | verified_local | CHAIN-LOGS-AUDIT | 1 | none | none |
| apps/web/src/app/dashboard/markets/create/page.tsx | SOAR-PAGE-MARKET-CREATE | markets | verified_local | CHAIN-MARKETS | 3 | none | none |
| apps/web/src/app/dashboard/markets/[id]/edit/page.tsx | SOAR-PAGE-MARKET-EDIT | markets | verified_local | CHAIN-MARKETS | 3 | none | none |
| apps/web/src/app/dashboard/markets/list/page.tsx | SOAR-PAGE-MARKETS-LIST | markets | verified_local | CHAIN-MARKETS | 3 | none | none |
| apps/web/src/middleware.ts | SOAR-PAGE-POSITIONS-LEGACY | positions | verified_local | CHAIN-POSITIONS-CORE | 3 | none | none |
| apps/web/src/app/dashboard/profile/page.tsx | SOAR-PAGE-PROFILE | profile-api-keys | verified_local | CHAIN-PROFILE-API-KEYS | 1 | none | none |
| apps/web/src/app/dashboard/reports/page.tsx | SOAR-PAGE-REPORTS | reports | verified_local | CHAIN-REPORTS | 1 | none | none |
| apps/web/src/app/dashboard/strategies/list/page.tsx | SOAR-PAGE-STRATEGIES-LIST | strategies | verified_local | CHAIN-STRATEGIES | 4 | none | none |
| apps/web/src/app/dashboard/strategies/create/page.tsx | SOAR-PAGE-STRATEGY-CREATE | strategies | verified_local | CHAIN-STRATEGIES | 4 | none | none |
| apps/web/src/app/dashboard/strategies/[id]/edit/page.tsx | SOAR-PAGE-STRATEGY-EDIT | strategies | verified_local | CHAIN-STRATEGIES | 4 | none | none |
| apps/web/src/app/dashboard/strategies/[id]/page.tsx | SOAR-PAGE-STRATEGY-ID-ROOT | strategies | verified_local | CHAIN-STRATEGIES | 4 | none | none |
| apps/web/src/app/admin/page.tsx | SOAR-PAGE-ADMIN-ROOT | subscriptions-admin | verified_local | CHAIN-SUBSCRIPTIONS-ADMIN | 3 | none | none |
| apps/web/src/app/admin/subscriptions/page.tsx | SOAR-PAGE-ADMIN-SUBSCRIPTIONS | subscriptions-admin | verified_local | CHAIN-SUBSCRIPTIONS-ADMIN | 3 | none | none |
| apps/web/src/app/admin/users/page.tsx | SOAR-PAGE-ADMIN-USERS | subscriptions-admin | verified_local | CHAIN-SUBSCRIPTIONS-ADMIN | 3 | none | none |
| apps/web/src/app/dashboard/wallets/create/page.tsx | SOAR-PAGE-WALLET-CREATE | wallets | verified_local | CHAIN-WALLETS-CORE | 6 | none | none |
| apps/web/src/app/dashboard/wallets/[id]/edit/page.tsx | SOAR-PAGE-WALLET-EDIT | wallets | verified_local | CHAIN-WALLETS-CORE | 6 | none | none |
| apps/web/src/app/dashboard/wallets/[id]/page.tsx | SOAR-PAGE-WALLET-ID-ROOT | wallets | verified_local | none | 6 | none | none |
| apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx | SOAR-PAGE-WALLET-PREVIEW | wallets | verified_local | CHAIN-WALLETS-CORE | 6 | none | none |
| apps/web/src/app/dashboard/wallets/list/page.tsx | SOAR-PAGE-WALLETS-LIST | wallets | verified_local | CHAIN-WALLETS-CORE | 6 | none | none |
| apps/web/src/app/dashboard/wallets/page.tsx | SOAR-PAGE-WALLETS-ROOT | wallets | verified_local | CHAIN-WALLETS-CORE | 6 | none | none |
| apps/web/src/app/offline/page.tsx | SOAR-PAGE-OFFLINE | web-residual-surfaces | verified_local | none | 1 | medium | not_in_function_chain |

## Use

- If a user reports a UI issue, start with the route row.
- Follow its chain IDs into [[architecture/indices/function-chain-evidence-index.csv|function-chain-evidence-index.csv]].
- Check user actions in [[architecture/indices/user-action-index.csv|user-action-index.csv]].
- Run or add proof before changing the status.
