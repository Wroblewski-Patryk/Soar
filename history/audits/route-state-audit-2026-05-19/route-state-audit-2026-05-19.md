# Route State Audit - 2026-05-19

Scope: local authenticated route-state proof against seeded admin data. No production, LIVE, exchange-side, or existing production data mutation was performed.

Routes checked: 53
PASS: 53
CHECK: 0
Console warning/error routes: 0

## Screenshots

- dashboard-desktop: `C:\Personal\Projekty\Aplikacje\Soar\history\audits\route-state-audit-2026-05-19\dashboard-desktop.png`
- bots-desktop: `C:\Personal\Projekty\Aplikacje\Soar\history\audits\route-state-audit-2026-05-19\bots-desktop.png`
- profile-desktop: `C:\Personal\Projekty\Aplikacje\Soar\history\audits\route-state-audit-2026-05-19\profile-desktop.png`
- admin-users-desktop: `C:\Personal\Projekty\Aplikacje\Soar\history\audits\route-state-audit-2026-05-19\admin-users-desktop.png`
- dashboard-mobile: `C:\Personal\Projekty\Aplikacje\Soar\history\audits\route-state-audit-2026-05-19\dashboard-mobile.png`
- bots-mobile: `C:\Personal\Projekty\Aplikacje\Soar\history\audits\route-state-audit-2026-05-19\bots-mobile.png`

## Redirects Observed

| Viewport | Requested Path | Final URL |
| --- | --- | --- |
| desktop-1440x900 | `/dashboard/exchanges` | `/dashboard/profile#api` |
| desktop-1440x900 | `/dashboard/strategies/e81a8561-b955-4835-ae6b-3608901497ef` | `/dashboard/strategies/e81a8561-b955-4835-ae6b-3608901497ef/edit` |
| desktop-1440x900 | `/dashboard/bots/assistant` | `/dashboard/bots` |
| desktop-1440x900 | `/dashboard/bots/new` | `/dashboard/bots/create` |
| desktop-1440x900 | `/dashboard/bots/runtime` | `/dashboard/bots` |
| desktop-1440x900 | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0` | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/preview` |
| desktop-1440x900 | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/runtime` | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/preview` |
| desktop-1440x900 | `/dashboard/wallets` | `/dashboard/wallets/list` |
| desktop-1440x900 | `/dashboard/wallets/3c26c9e1-7f88-4d21-a9c6-20dae4936802` | `/dashboard/wallets/3c26c9e1-7f88-4d21-a9c6-20dae4936802/edit` |
| desktop-1440x900 | `/admin` | `/admin/subscriptions` |
| desktop-1440x900 | `/dashboard/orders` | `/dashboard/bots` |
| desktop-1440x900 | `/dashboard/positions` | `/dashboard/bots` |

## Results

| Viewport | Requested Path | Final URL | Status | Console Warn/Error Count |
| --- | --- | --- | --- | --- |
| desktop-1440x900 | `/` | `/` | PASS | 0 |
| desktop-1440x900 | `/auth/login` | `/auth/login` | PASS | 0 |
| desktop-1440x900 | `/auth/register` | `/auth/register` | PASS | 0 |
| desktop-1440x900 | `/offline` | `/offline` | PASS | 0 |
| desktop-1440x900 | `/dashboard` | `/dashboard` | PASS | 0 |
| desktop-1440x900 | `/dashboard/exchanges` | `/dashboard/profile#api` | PASS | 0 |
| desktop-1440x900 | `/dashboard/markets/list` | `/dashboard/markets/list` | PASS | 0 |
| desktop-1440x900 | `/dashboard/markets/create` | `/dashboard/markets/create` | PASS | 0 |
| desktop-1440x900 | `/dashboard/markets/62384753-537c-49f2-a1fa-9f46f37e4d36/edit` | `/dashboard/markets/62384753-537c-49f2-a1fa-9f46f37e4d36/edit` | PASS | 0 |
| desktop-1440x900 | `/dashboard/strategies/list` | `/dashboard/strategies/list` | PASS | 0 |
| desktop-1440x900 | `/dashboard/strategies/create` | `/dashboard/strategies/create` | PASS | 0 |
| desktop-1440x900 | `/dashboard/strategies/e81a8561-b955-4835-ae6b-3608901497ef` | `/dashboard/strategies/e81a8561-b955-4835-ae6b-3608901497ef/edit` | PASS | 0 |
| desktop-1440x900 | `/dashboard/strategies/e81a8561-b955-4835-ae6b-3608901497ef/edit` | `/dashboard/strategies/e81a8561-b955-4835-ae6b-3608901497ef/edit` | PASS | 0 |
| desktop-1440x900 | `/dashboard/backtests/list` | `/dashboard/backtests/list` | PASS | 0 |
| desktop-1440x900 | `/dashboard/backtests/create` | `/dashboard/backtests/create` | PASS | 0 |
| desktop-1440x900 | `/dashboard/backtests/00000000-0000-4000-8000-000000000000` | `/dashboard/backtests/00000000-0000-4000-8000-000000000000` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots` | `/dashboard/bots` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots/assistant` | `/dashboard/bots` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots/create` | `/dashboard/bots/create` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots/new` | `/dashboard/bots/create` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots/runtime` | `/dashboard/bots` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0` | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/preview` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/assistant` | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/assistant` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/edit` | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/edit` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/preview` | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/preview` | PASS | 0 |
| desktop-1440x900 | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/runtime` | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/preview` | PASS | 0 |
| desktop-1440x900 | `/dashboard/reports` | `/dashboard/reports` | PASS | 0 |
| desktop-1440x900 | `/dashboard/logs` | `/dashboard/logs` | PASS | 0 |
| desktop-1440x900 | `/dashboard/profile` | `/dashboard/profile` | PASS | 0 |
| desktop-1440x900 | `/dashboard/wallets` | `/dashboard/wallets/list` | PASS | 0 |
| desktop-1440x900 | `/dashboard/wallets/create` | `/dashboard/wallets/create` | PASS | 0 |
| desktop-1440x900 | `/dashboard/wallets/list` | `/dashboard/wallets/list` | PASS | 0 |
| desktop-1440x900 | `/dashboard/wallets/3c26c9e1-7f88-4d21-a9c6-20dae4936802` | `/dashboard/wallets/3c26c9e1-7f88-4d21-a9c6-20dae4936802/edit` | PASS | 0 |
| desktop-1440x900 | `/dashboard/wallets/3c26c9e1-7f88-4d21-a9c6-20dae4936802/edit` | `/dashboard/wallets/3c26c9e1-7f88-4d21-a9c6-20dae4936802/edit` | PASS | 0 |
| desktop-1440x900 | `/dashboard/wallets/3c26c9e1-7f88-4d21-a9c6-20dae4936802/preview` | `/dashboard/wallets/3c26c9e1-7f88-4d21-a9c6-20dae4936802/preview` | PASS | 0 |
| desktop-1440x900 | `/admin` | `/admin/subscriptions` | PASS | 0 |
| desktop-1440x900 | `/admin/users` | `/admin/users` | PASS | 0 |
| desktop-1440x900 | `/admin/subscriptions` | `/admin/subscriptions` | PASS | 0 |
| desktop-1440x900 | `/dashboard/orders` | `/dashboard/bots` | PASS | 0 |
| desktop-1440x900 | `/dashboard/positions` | `/dashboard/bots` | PASS | 0 |
| mobile-390x844 | `/` | `/` | PASS | 0 |
| mobile-390x844 | `/auth/login` | `/auth/login` | PASS | 0 |
| mobile-390x844 | `/auth/register` | `/auth/register` | PASS | 0 |
| mobile-390x844 | `/dashboard` | `/dashboard` | PASS | 0 |
| mobile-390x844 | `/dashboard/bots` | `/dashboard/bots` | PASS | 0 |
| mobile-390x844 | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/preview` | `/dashboard/bots/0d5fb1f2-a940-4c69-abea-3147d7115ad0/preview` | PASS | 0 |
| mobile-390x844 | `/dashboard/wallets/list` | `/dashboard/wallets/list` | PASS | 0 |
| mobile-390x844 | `/dashboard/markets/list` | `/dashboard/markets/list` | PASS | 0 |
| mobile-390x844 | `/dashboard/strategies/list` | `/dashboard/strategies/list` | PASS | 0 |
| mobile-390x844 | `/dashboard/backtests/list` | `/dashboard/backtests/list` | PASS | 0 |
| mobile-390x844 | `/dashboard/profile` | `/dashboard/profile` | PASS | 0 |
| mobile-390x844 | `/admin/users` | `/admin/users` | PASS | 0 |
| mobile-390x844 | `/admin/subscriptions` | `/admin/subscriptions` | PASS | 0 |