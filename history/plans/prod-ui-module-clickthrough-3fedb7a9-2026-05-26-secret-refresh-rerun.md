# Production UI Module Clickthrough Audit

## Status
- Result: **BLOCKED_AUTH**
- Environment: production
- Evidence date: 2026-05-26
- Generated at (UTC): 2026-05-26T02:28:55.094Z
- Expected SHA: `not provided`
- Observed build-info SHA: `3fedb7a9170097b40accb6ccea1915064f383f11`
- Dashboard auth: missing
- Admin auth: missing
- Raw JSON: `history\artifacts\prod-ui-module-clickthrough-3fedb7a9-2026-05-26-secret-refresh-rerun.json`

## Summary
- Public routes: PASS:4
- Dashboard routes: BLOCKED_AUTH:18
- Admin routes: BLOCKED_AUTH:3
- Legacy redirects: BLOCKED_AUTH:3

## Blockers
- dashboard auth missing
- admin auth missing

## Route Results
| Route | Area | Result | HTTP | Location | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | public | PASS | 200 | - | public route reachable |
| `/auth/login` | public | PASS | 200 | - | public route reachable |
| `/auth/register` | public | PASS | 200 | - | public route reachable |
| `/offline` | public | PASS | 200 | - | public route reachable |
| `/dashboard` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/exchanges` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/profile` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/wallets` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/wallets/list` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/wallets/create` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/markets/list` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/markets/create` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/strategies/list` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/strategies/create` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/backtests/list` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/backtests/create` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/bots` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/bots/create` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/bots/assistant` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/bots/runtime` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/reports` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/logs` | dashboard | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; unauthenticated route fails closed to login |
| `/dashboard/orders` | legacy | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; legacy route fails closed before redirect audit |
| `/dashboard/positions` | legacy | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; legacy route fails closed before redirect audit |
| `/dashboard/bots/new` | legacy | BLOCKED_AUTH | 307 | `/auth/login` | dashboard auth missing; legacy route fails closed before redirect audit |
| `/admin` | admin | BLOCKED_AUTH | 307 | `/auth/login` | admin auth missing; unauthenticated route fails closed to login |
| `/admin/users` | admin | BLOCKED_AUTH | 307 | `/auth/login` | admin auth missing; unauthenticated route fails closed to login |
| `/admin/subscriptions` | admin | BLOCKED_AUTH | 307 | `/auth/login` | admin auth missing; unauthenticated route fails closed to login |

## Module Results
| Module | Route | Result | Notes |
| --- | --- | --- | --- |
| auth | `/auth/login` | PASS | public route reachable |
| dashboard-home | `/dashboard` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| profile/exchanges | `/dashboard/profile` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| wallets | `/dashboard/wallets/list` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| markets | `/dashboard/markets/list` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| strategies | `/dashboard/strategies/list` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| backtests | `/dashboard/backtests/list` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| bots | `/dashboard/bots` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| runtime | `/dashboard/bots/runtime` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| reports | `/dashboard/reports` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| logs | `/dashboard/logs` | BLOCKED_AUTH | dashboard auth missing; unauthenticated route fails closed to login |
| admin/users | `/admin/users` | BLOCKED_AUTH | admin auth missing; unauthenticated route fails closed to login |
| admin/subscriptions | `/admin/subscriptions` | BLOCKED_AUTH | admin auth missing; unauthenticated route fails closed to login |

## Safety Notes
- This audit never writes production data and never submits live-money actions.
- Auth tokens, passwords, cookies, private headers, protected row payloads, and
  screenshots are not written to this artifact.
- BLOCKED_AUTH is not a pass; it means valid production app/admin auth is
  required before protected module clickthrough can be accepted as V1 evidence.
