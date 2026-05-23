# Production UI Public Access Audit - 6c54bb5d

## Status
- Result: **PASS**
- Environment: production
- Evidence date: 2026-05-09
- Expected SHA: `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`
- Observed build-info SHA: `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`
- Raw JSON:
  `history/artifacts/_artifacts-prod-ui-public-access-clickthrough-6c54bb5d-2026-05-09.json`

## Checks

| Surface | URL | Result |
| --- | --- | --- |
| API health | `https://api.soar.luckysparrow.ch/health` | PASS HTTP 200 |
| API readiness | `https://api.soar.luckysparrow.ch/ready` | PASS HTTP 200 |
| Web home | `https://soar.luckysparrow.ch/` | PASS HTTP 200 |
| Login | `https://soar.luckysparrow.ch/auth/login` | PASS HTTP 200 |
| Register | `https://soar.luckysparrow.ch/auth/register` | PASS HTTP 200 |
| Offline | `https://soar.luckysparrow.ch/offline` | PASS HTTP 200 |
| Build info | `https://soar.luckysparrow.ch/api/build-info` | PASS HTTP 200, expected SHA |

## Unauthenticated Protected Routes

| Route | Result |
| --- | --- |
| `/dashboard` | PASS HTTP 307 to `/auth/login` |
| `/dashboard/profile` | PASS HTTP 307 to `/auth/login` |
| `/dashboard/wallets/list` | PASS HTTP 307 to `/auth/login` |
| `/dashboard/markets/list` | PASS HTTP 307 to `/auth/login` |
| `/dashboard/strategies/list` | PASS HTTP 307 to `/auth/login` |
| `/dashboard/backtests/list` | PASS HTTP 307 to `/auth/login` |
| `/dashboard/bots` | PASS HTTP 307 to `/auth/login` |
| `/dashboard/reports` | PASS HTTP 307 to `/auth/login` |
| `/dashboard/logs` | PASS HTTP 307 to `/auth/login` |
| `/admin` | PASS HTTP 307 to `/auth/login` |
| `/admin/users` | PASS HTTP 307 to `/auth/login` |
| `/admin/subscriptions` | PASS HTTP 307 to `/auth/login` |

## Scope

This is a public/unauthenticated route and auth-gate audit only. It confirms
that the current deployed batch exposes the expected build-info SHA, public
routes are reachable, and protected dashboard/admin routes fail closed to the
login page without a session.

It does not prove authenticated dashboard/admin functionality, module-level
clickthrough behavior, live-import runtime readback, rollback proof, restore
drill, RC approval, or final V1 release readiness.

## Residual Blockers
- Full production UI module clickthrough still requires authenticated/admin
  production app access and representative production test data.
- Live-money or destructive actions still require explicit operator approval.
- Protected V1 release evidence remains blocked on operator auth, DB/Coolify
  context, `LIVEIMPORT-03`, restore/rollback proof, and RC approval.
