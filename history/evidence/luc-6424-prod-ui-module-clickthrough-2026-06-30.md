# Production UI Module Clickthrough Audit

## Status
- Result: **FAIL**
- Environment: production
- Evidence date: 2026-06-30
- Generated at (UTC): 2026-06-30T17:17:35.162Z
- Expected SHA: `not provided`
- Observed build-info SHA: `n/a`
- Dashboard auth: login:present
- Admin auth: login:present
- Raw JSON: `history\artifacts\luc-6424-prod-ui-module-clickthrough-2026-06-30.json`

## Summary
- Public routes: FAIL:4
- Dashboard routes: FAIL:18
- Admin routes: FAIL:3
- Legacy redirects: FAIL:3

## Blockers
- build-info does not match expected SHA

## Route Results
| Route | Area | Result | HTTP | Location | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | public | FAIL | 503 | - | expected HTTP 200, got 503 |
| `/auth/login` | public | FAIL | 503 | - | expected HTTP 200, got 503 |
| `/auth/register` | public | FAIL | 503 | - | expected HTTP 200, got 503 |
| `/offline` | public | FAIL | 503 | - | expected HTTP 200, got 503 |
| `/dashboard` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/exchanges` | dashboard | FAIL | 503 | - | expected redirect:/dashboard/profile#api, got status=503 location=none |
| `/dashboard/profile` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/wallets` | dashboard | FAIL | 503 | - | expected redirect:/dashboard/wallets/list, got status=503 location=none |
| `/dashboard/wallets/list` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/wallets/create` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/markets/list` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/markets/create` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/strategies/list` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/strategies/create` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/backtests/list` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/backtests/create` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/bots` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/bots/create` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/bots/assistant` | dashboard | FAIL | 503 | - | expected redirect:/dashboard/bots, got status=503 location=none |
| `/dashboard/bots/runtime` | dashboard | FAIL | 503 | - | expected redirect:/dashboard/bots, got status=503 location=none |
| `/dashboard/reports` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/logs` | dashboard | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/dashboard/orders` | legacy | FAIL | 503 | - | expected redirect:/dashboard/bots/runtime?legacy=orders, got status=503 location=none |
| `/dashboard/positions` | legacy | FAIL | 503 | - | expected redirect:/dashboard/bots/runtime?legacy=positions, got status=503 location=none |
| `/dashboard/bots/new` | legacy | FAIL | 503 | - | expected redirect:/dashboard/bots/create, got status=503 location=none |
| `/admin` | admin | FAIL | 503 | - | expected redirect:/admin/subscriptions, got status=503 location=none |
| `/admin/users` | admin | FAIL | 503 | - | expected protected HTML route, got status=503 |
| `/admin/subscriptions` | admin | FAIL | 503 | - | expected protected HTML route, got status=503 |

## Module Results
| Module | Route | Result | Notes |
| --- | --- | --- | --- |
| auth | `/auth/login` | FAIL | expected HTTP 200, got 503 |
| dashboard-home | `/dashboard` | FAIL | expected protected HTML route, got status=503 |
| profile/exchanges | `/dashboard/profile` | FAIL | expected protected HTML route, got status=503 |
| wallets | `/dashboard/wallets/list` | FAIL | expected protected HTML route, got status=503 |
| markets | `/dashboard/markets/list` | FAIL | expected protected HTML route, got status=503 |
| strategies | `/dashboard/strategies/list` | FAIL | expected protected HTML route, got status=503 |
| backtests | `/dashboard/backtests/list` | FAIL | expected protected HTML route, got status=503 |
| bots | `/dashboard/bots` | FAIL | expected protected HTML route, got status=503 |
| runtime | `/dashboard/bots/runtime` | FAIL | expected redirect:/dashboard/bots, got status=503 location=none |
| reports | `/dashboard/reports` | FAIL | expected protected HTML route, got status=503 |
| logs | `/dashboard/logs` | FAIL | expected protected HTML route, got status=503 |
| admin/users | `/admin/users` | FAIL | expected protected HTML route, got status=503 |
| admin/subscriptions | `/admin/subscriptions` | FAIL | expected protected HTML route, got status=503 |

## Safety Notes
- This audit never writes production data and never submits live-money actions.
- Auth tokens, passwords, cookies, private headers, protected row payloads, and
  screenshots are not written to this artifact.
- BLOCKED_AUTH is not a pass; it means valid production app/admin auth is
  required before protected module clickthrough can be accepted as V1 evidence.
