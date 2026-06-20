# LUC-4766 Production Performance And Server Health Watch Task

## Context

Recurring critical DRE watch for Soar production performance and server health.
The issue requires read-only public production smoke, protected dashboard proof
when safe credentials are available, and Coolify/VPS server-health evidence
without exposing secrets.

## Goal

Determine whether the current production app is responsive and whether the
runner can prove server health. Create exactly one narrow follow-up if a
regression or evidence gap remains.

## Constraints

- Stage: verification.
- Read-only by default.
- No deploy, push, restart, rollback, env edit, DB/Redis mutation, production
  account mutation, trading action, secret readback, screenshot, raw log
  capture, or live-money action.
- Use only redaction-safe outputs.

## Definition Of Done

- Public web/API smoke result recorded.
- Public route/API timing samples recorded.
- Protected dashboard proof run only if safe protected inputs are present.
- Coolify/VPS server-health evidence recorded or a concrete blocker/follow-up
  is created.
- Browser/process cleanup verified.
- Paperclip issue receives a durable final disposition.

## Forbidden

- Do not print or store credentials, cookies, tokens, private response bodies,
  account details, payment data, exchange keys, or live-trading data.
- Do not mutate production services or accounts.
- Do not create duplicate broad incident work when one narrow follow-up is
  enough.

## Result Report

Public smoke passed:

```bash
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Public timing samples were responsive: max observed values were Web `/` 179 ms,
Web `/auth/login` 27 ms, Web `/api/build-info` 25 ms, API `/health` 86 ms, and
API `/ready` 28 ms across three samples per route.

Protected dashboard auth/session proof passed:

```bash
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof
```

Evidence:

- `history/evidence/luc-4766-production-performance-health-watch-2026-06-20.md`
- `history/evidence/luc-4766-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/_artifacts-luc-4766-prod-auth-session-browser-proof-2026-06-20.json`

Coolify/VPS server-health readback did not run because the current runner has
no `COOLIFY*` binding names. Follow-up is required for read-only Coolify/VPS
health evidence.

Post-run browser process check found no leftover `chrome-headless-shell`,
`chrome`, or `msedge` rows.
