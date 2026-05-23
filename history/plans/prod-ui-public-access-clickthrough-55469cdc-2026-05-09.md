# Production UI Public Access Audit - 55469cdc

Date: 2026-05-09

## Result

PASS for the public/unauthenticated slice.

This audit refresh verifies the currently deployed source-of-truth synchronization batch:

- Expected SHA:
  `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`
- Observed Web build-info SHA:
  `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`
- Build freshness: PASS
- API health/readiness: PASS
- Public Web routes: PASS
- Unauthenticated dashboard/admin routes: PASS as fail-closed auth redirects

## Scope

The check used public HTTPS requests only. No authenticated session, admin
session, write operation, live-money operation, exchange order, or protected
runtime readback was used.

## API Checks

| Route | Status | Result |
| --- | ---: | --- |
| `https://api.soar.luckysparrow.ch/health` | 200 | PASS |
| `https://api.soar.luckysparrow.ch/ready` | 200 | PASS |

## Public Web Routes

| Route | Status | Result |
| --- | ---: | --- |
| `/` | 200 | PASS |
| `/auth/login` | 200 | PASS |
| `/auth/register` | 200 | PASS |
| `/offline` | 200 | PASS |
| `/api/build-info` | 200 | PASS |

## Protected Route Auth Gates

All checked protected routes returned HTTP `307` to `/auth/login` without an
authenticated session:

- `/dashboard`
- `/dashboard/profile`
- `/dashboard/wallets/list`
- `/dashboard/markets/list`
- `/dashboard/strategies/list`
- `/dashboard/backtests/list`
- `/dashboard/bots`
- `/dashboard/reports`
- `/dashboard/logs`
- `/admin`
- `/admin/users`
- `/admin/subscriptions`

## Limitations

This is not the full production UI module clickthrough audit. It confirms that
the public site is reachable, the deployed build matches the expected pushed
batch, and protected modules fail closed for unauthenticated users. The full
dashboard/admin module audit remains blocked until a valid authenticated/admin
production app session is available.

Machine-readable artifact:
`history/artifacts/_artifacts-prod-ui-public-access-clickthrough-55469cdc-2026-05-09.json`.
