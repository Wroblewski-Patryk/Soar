# LUC-4819 Production Performance And Server Health Watch Task

## Context

Recurring critical DRE watch for Soar production performance and server health.
The issue requires read-only public production smoke, protected dashboard proof
when safe credentials are available, and Coolify/VPS server-health evidence
without exposing secrets.

## Goal

Determine whether the current production app is responsive and whether this
runner can prove server health. Avoid duplicate incident work when the same
server-health binding blocker is already represented by active child issues.

## Scope

- Public production app/API smoke.
- Public route/API timing samples.
- Protected auth/session dashboard proof using existing audit credential names.
- Names-only Coolify/VPS binding availability check.
- Cleanup verification for browser/process artifacts started in this task.
- State/evidence updates only.

## Constraints

- Stage: verification.
- Read-only by default.
- No deploy, push, restart, rollback, env edit, DB/Redis mutation, production
  account mutation, trading action, secret readback, screenshot, raw log
  capture, or live-money action.
- Use only redaction-safe outputs.
- Do not create duplicate broad incident work when an existing blocker chain
  already owns the missing Coolify/VPS binding path.

## Implementation Plan

1. Read scoped Paperclip heartbeat context and local operational state.
2. Run public production smoke without worker/protected endpoint checks.
3. Collect three-sample public timing data for public web/API surfaces.
4. Run protected auth/session browser proof only through approved audit env
   names and redacted artifacts.
5. Check for Coolify/VPS binding names and focused checker contract health.
6. Clean validation-created browser temp profile and verify no browser process
   remains.
7. Update evidence/state and close the Paperclip issue with a clear
   disposition.

## Acceptance Criteria

- Public web/API smoke result recorded.
- Public route/API timing samples recorded.
- Protected dashboard proof result recorded without secret/cookie/token/body
  artifacts.
- Coolify/VPS server-health evidence recorded or blocker chain identified.
- Browser/process cleanup verified.
- Paperclip issue receives a durable final disposition.

## Definition Of Done

- `DEFINITION_OF_DONE.md` evidence expectations are satisfied for this
  read-only verification slice.
- Affected source-of-truth files identify status, proof, residual risk, and
  next owner/action.
- No production mutation or secret disclosure occurred.

## Forbidden

- Do not print or store credentials, cookies, tokens, private response bodies,
  account details, payment data, exchange keys, or live-trading data.
- Do not mutate production services, database/Redis, accounts, subscriptions,
  exchanges, orders, positions, or runtime settings.
- Do not create another duplicate Coolify/VPS binding issue while
  [LUC-4767](/LUC/issues/LUC-4767), [LUC-4806](/LUC/issues/LUC-4806), and
  [LUC-4811](/LUC/issues/LUC-4811) already own the blocker chain.

## Result Report

Public smoke passed:

```bash
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Public timing samples were responsive: max observed values were Web `/` 262 ms,
Web `/auth/login` 140 ms, Web `/api/build-info` 40 ms, API `/health` 104 ms,
and API `/ready` 36 ms across three samples per route.

Production build-info readback observed SHA
`42177530f2a2ddc22832133b545bccab6ab404eb` on `main`, metadata source
`env-runtime`, checked at `2026-06-20T04:30:39.367Z`.

Protected dashboard auth/session proof passed:

```bash
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof
```

with process-local mapping from `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` to the
script's `PROD_AUTH_EMAIL/PASSWORD` inputs.

Coolify/VPS server-health readback did not run because the current DRE runner
has no `COOLIFY*`, `VPS*`, `SSH*`, `SOAR_PROD*`, `PROD_DB_CHECK*`,
`PRODUCTION_DB_CHECK*`, `ROLLBACK_GUARD*`, `RC_*`, or `GATE*` binding names.
Only `LIVEIMPORT_READBACK_*` and `PROD_UI_AUDIT_*` names were present. This is
already represented by blocker chain [LUC-4767](/LUC/issues/LUC-4767) ->
[LUC-4806](/LUC/issues/LUC-4806) -> [LUC-4811](/LUC/issues/LUC-4811).

Focused checker contract passed:

```bash
pnpm run -s ops:coolify-stack:env-check:test
```

Result: PASS (`11/11`).

Post-run process check found no leftover `chrome-headless-shell`, `chrome`, or
`msedge` rows. The validation-created `.tmp/prod-auth-cdp-1781929804785`
profile directory was removed; older pre-existing temp directories were left
unchanged.

Evidence:

- `history/evidence/luc-4819-production-performance-health-watch-2026-06-20.md`
- `docs/operations/prod-auth-session-browser-proof-current-2026-06-20.md`
- `docs/operations/_artifacts-prod-auth-session-browser-proof-current-2026-06-20.json`
