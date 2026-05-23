# Production UI Public Access Clickthrough (2026-05-08)

Generated: 2026-05-08T19:24:51.725Z

Expected SHA prefix: `373a0ceb`
Observed build-info SHA: `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`
Build freshness: **BLOCKED**

Public API/Web smoke subset: **PASS**
Protected unauthenticated gate: **PASS**

## Scope
This is a public/unauthenticated production route audit only. It does not prove authenticated dashboard/admin module functions.

## API Checks
| Route | Status | HTTP | Detail |
| --- | --- | --- | --- |
| `/health` | PASS | 200 | https://api.soar.luckysparrow.ch/health |
| `/ready` | PASS | 200 | https://api.soar.luckysparrow.ch/ready |

## Public Routes
| Route | Status | HTTP | Detail |
| --- | --- | --- | --- |
| `/` | PASS | 200 | https://soar.luckysparrow.ch/ |
| `/auth/login` | PASS | 200 | https://soar.luckysparrow.ch/auth/login |
| `/auth/register` | PASS | 200 | https://soar.luckysparrow.ch/auth/register |
| `/offline` | PASS | 200 | https://soar.luckysparrow.ch/offline |
| `/api/build-info` | PASS | 200 | https://soar.luckysparrow.ch/api/build-info |

## Protected Routes Without Session
| Route | Status | HTTP | Redirect / detail |
| --- | --- | --- | --- |
| `/dashboard` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/dashboard/profile` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/dashboard/wallets/list` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/dashboard/markets/list` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/dashboard/strategies/list` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/dashboard/backtests/list` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/dashboard/bots` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/dashboard/reports` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/dashboard/logs` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/admin` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/admin/users` | PASS_AUTH_REDIRECT | 307 | /auth/login |
| `/admin/subscriptions` | PASS_AUTH_REDIRECT | 307 | /auth/login |

## Findings
- Public routes and API health/readiness are reachable.
- Protected dashboard/admin routes fail closed for unauthenticated users.
- Latest pushed main is not deployed: build-info remains stale versus expected SHA.
- Full module-function clickthrough remains blocked until latest deploy plus authenticated/admin app access.
