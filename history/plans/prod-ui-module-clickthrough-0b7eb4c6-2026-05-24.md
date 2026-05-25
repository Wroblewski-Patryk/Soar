# Production UI Module Clickthrough Audit

## Status
- Result: **PASS**
- Environment: production
- Evidence date: 2026-05-24
- Generated at (UTC): 2026-05-24T18:48:48.615Z
- Expected SHA: `0b7eb4c6e0767ce1d51b3ff68f0229f899781d31`
- Observed build-info SHA: `0b7eb4c6e0767ce1d51b3ff68f0229f899781d31`
- Dashboard auth: login:present
- Admin auth: login:present
- Raw JSON: `history\artifacts\prod-ui-module-clickthrough-0b7eb4c6-2026-05-24.json`

## Summary
- Public routes: PASS:4
- Dashboard routes: PASS:18
- Admin routes: PASS:3
- Legacy redirects: PASS:3

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
| `/dashboard/exchanges` | dashboard | PASS | 307 | `/dashboard/profile#api` | redirect matched /dashboard/profile#api |
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
| `/dashboard/orders` | legacy | PASS | 307 | `/dashboard/bots/runtime?legacy=orders` | redirect matched /dashboard/bots/runtime?legacy=orders |
| `/dashboard/positions` | legacy | PASS | 307 | `/dashboard/bots/runtime?legacy=positions` | redirect matched /dashboard/bots/runtime?legacy=positions |
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
