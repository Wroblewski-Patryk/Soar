# LUC-4766 Production Performance And Server Health Watch

- Checked at (UTC): 2026-06-20T02:22:45Z
- Owner: 09 DRE (Deployment & Reliability Engineer)
- Mode: read-only production performance and health watch
- Scope: Soar public web/API smoke, protected auth/session dashboard proof, and Coolify/VPS evidence availability

## Result

Status: partially verified / follow-up delegated.

Public production web/API probes were responsive and did not reproduce the
reported critical ~60s dashboard-load class in the public surfaces checked.
The protected production auth/session browser proof passed using the
pre-bound `PROD_UI_AUDIT_AUTH_EMAIL` / `PROD_UI_AUDIT_AUTH_PASSWORD` names
without printing or storing credentials, cookies, tokens, response bodies, or
screenshots.

Coolify/VPS server-health readback did not run in this heartbeat because the
current runner exposed no `COOLIFY*` binding names. This prevents a complete
server-health watch claim, so the remaining work is delegated as a narrow
binding/readback follow-up instead of reopening broad product work.

No deploy, push, restart, rollback, environment edit, database/Redis mutation,
production account mutation, trading action, secret readback, screenshot, raw
log capture, or live-money action was performed.

## Public Smoke

Command:

```bash
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

| Check | Result |
| --- | --- |
| API `/health` | PASS `200` |
| API `/ready` | PASS `200` |
| Web `/` | PASS `200` |
| Web `/api/build-info` | PASS `200` |

Observed build-info SHA: `42177530f2a2ddc22832133b545bccab6ab404eb`.

## Public Timing Samples

Each row used three no-cache read-only requests with a 15s timeout.

| Surface | Passes | Statuses | Min | Avg | Max |
| --- | ---: | --- | ---: | ---: | ---: |
| Web `/` | 3/3 | `200,200,200` | 24 ms | 90 ms | 179 ms |
| Web `/auth/login` | 3/3 | `200,200,200` | 24 ms | 25 ms | 27 ms |
| Web `/api/build-info` | 3/3 | `200,200,200` | 24 ms | 25 ms | 25 ms |
| API `/health` | 3/3 | `200,200,200` | 15 ms | 54 ms | 86 ms |
| API `/ready` | 3/3 | `200,200,200` | 20 ms | 23 ms | 28 ms |

## Protected Dashboard Proof

Command:

```bash
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof
```

with process-local mapping from `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` to the
script's `PROD_AUTH_EMAIL/PASSWORD` inputs.

Result: PASS.

Evidence:

- `history/evidence/luc-4766-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/_artifacts-luc-4766-prod-auth-session-browser-proof-2026-06-20.json`

Key protected checks:

| Check | Result |
| --- | --- |
| Build-info freshness | PASS |
| Auth token resolved by login | PASS |
| Unauthenticated `/dashboard` redirects to login | PASS |
| Authenticated `/dashboard` renders | PASS |
| Invalid token redirects to expired-session login | PASS |
| Logout API clears session | PASS |
| `/auth/me` after logout fails closed | PASS `401` |
| Dashboard after logout redirects to login | PASS |

## Coolify/VPS Readback

Status: not verified in this heartbeat.

Names-only environment scan found no `COOLIFY*` binding names in the current
runner. Required server-side evidence remains missing for this watch:

- Coolify deployment status
- service/container restart or health projection
- PostgreSQL/Redis health projection
- worker service health/backlog projection from Coolify/VPS view
- recent logs or pressure indicators

## Cleanup

The auth proof script closed the CDP client, killed the browser process it
started, and removed its temporary `.tmp/prod-auth-cdp-*` profile directory.
A post-run narrow process check for `chrome-headless-shell`, `chrome`, and
`msedge` returned no matching running process rows.

## Disposition

Public and protected app-level checks are healthy for this checkpoint. The
server-health portion remains incomplete due to missing Coolify bindings in
this runner, so a narrow follow-up is required to restore/read the read-only
Coolify/VPS health path.
