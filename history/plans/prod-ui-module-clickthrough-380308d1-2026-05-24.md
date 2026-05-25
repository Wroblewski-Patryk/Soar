# Production UI Module Clickthrough Audit

## Status
- Result: **FAIL**
- Environment: production
- Evidence date: 2026-05-24
- Generated at (UTC): 2026-05-24T18:36:07.644Z
- Expected SHA: `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`
- Observed build-info SHA: `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`
- Dashboard auth: login:present
- Admin auth: login:present
- Raw JSON: `history\artifacts\prod-ui-module-clickthrough-380308d1-2026-05-24.json`

## Summary
- Public routes: PASS:4
- Dashboard routes: PASS:17, FAIL:1
- Admin routes: PASS:3
- Legacy redirects: FAIL:2, PASS:1

## Blockers
- none

## Route Results
| Route | Area | Result | HTTP | Location | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | public | PASS | 200 | - | public route reachable |
| `/auth/login` | public | PASS | 200 | - | public route reachable |
| `/auth/register` | public | PASS | 200 | - | public route reachable |
| `/offline` | public | PASS | 200 | - | public route reachable |
| `/dashboard` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/exchanges` | dashboard | FAIL | 404 | - | expected redirect:/dashboard/profile#api, got status=404 location=none |
| `/dashboard/profile` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/wallets` | dashboard | PASS | 307 | `/dashboard/wallets/list` | redirect matched /dashboard/wallets/list |
| `/dashboard/wallets/list` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/wallets/create` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/markets/list` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/markets/create` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/strategies/list` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/strategies/create` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/backtests/list` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/backtests/create` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/bots` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/bots/create` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/bots/assistant` | dashboard | PASS | 307 | `/dashboard/bots` | redirect matched /dashboard/bots |
| `/dashboard/bots/runtime` | dashboard | PASS | 307 | `/dashboard/bots` | redirect matched /dashboard/bots |
| `/dashboard/reports` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/logs` | dashboard | PASS | 200 | - | route rendered HTML |
| `/dashboard/orders` | legacy | FAIL | 404 | - | expected redirect:/dashboard/bots/runtime?legacy=orders, got status=404 location=none |
| `/dashboard/positions` | legacy | FAIL | 404 | - | expected redirect:/dashboard/bots/runtime?legacy=positions, got status=404 location=none |
| `/dashboard/bots/new` | legacy | PASS | 307 | `/dashboard/bots/create` | redirect matched /dashboard/bots/create |
| `/admin` | admin | PASS | 200 | - | redirect resolved to authenticated page after middleware/app routing |
| `/admin/users` | admin | PASS | 200 | - | route rendered HTML |
| `/admin/subscriptions` | admin | PASS | 200 | - | route rendered HTML |

## Module Results
| Module | Route | Result | Notes |
| --- | --- | --- | --- |
| auth | `/auth/login` | PASS | public route reachable |
| dashboard-home | `/dashboard` | PASS | route rendered HTML |
| profile/exchanges | `/dashboard/profile` | PASS | route rendered HTML |
| wallets | `/dashboard/wallets/list` | PASS | route rendered HTML |
| markets | `/dashboard/markets/list` | PASS | route rendered HTML |
| strategies | `/dashboard/strategies/list` | PASS | route rendered HTML |
| backtests | `/dashboard/backtests/list` | PASS | route rendered HTML |
| bots | `/dashboard/bots` | PASS | route rendered HTML |
| runtime | `/dashboard/bots/runtime` | PASS | redirect matched /dashboard/bots |
| reports | `/dashboard/reports` | PASS | route rendered HTML |
| logs | `/dashboard/logs` | PASS | route rendered HTML |
| admin/users | `/admin/users` | PASS | route rendered HTML |
| admin/subscriptions | `/admin/subscriptions` | PASS | route rendered HTML |

## Safety Notes
- This audit never writes production data and never submits live-money actions.
- Auth tokens, passwords, cookies, private headers, protected row payloads, and
  screenshots are not written to this artifact.
- BLOCKED_AUTH is not a pass; it means valid production app/admin auth is
  required before protected module clickthrough can be accepted as V1 evidence.
