# LUC-4833 Authenticated Production Acceptance And Performance Sweep Task

## Context

Recurring authenticated production acceptance and performance sweep for Soar.
The issue requires production-level confidence for auth, route transitions,
critical pages, public API/Web timing, backend/deploy state visibility, and
safe worker/server-health signals without exposing secrets or mutating
production.

## Goal

Run the smallest safe production acceptance sweep that proves current app
health and records any residual release blocker with a named owner/action.

## Scope

- Public production Web/API smoke.
- Public timing samples for key Web/API routes.
- Authenticated route/module clickthrough with existing redaction-safe runner.
- Protected auth/session browser proof with stored Paperclip audit secret refs.
- Names-only Coolify/VPS binding availability check.
- Focused local checker contract proof.
- Evidence/state updates only.

## Constraints

- Stage: verification.
- QA verification lane only; no implementation ownership.
- Read-only production checks only.
- Never print or store secret values, cookies, tokens, response bodies,
  screenshots, account passwords, API keys, exchange credentials, payment data,
  or live-trading data.
- Do not deploy, push, restart, rollback, edit environment, mutate DB/Redis,
  change subscriptions, change exchange settings, submit/cancel orders, change
  positions, or perform live-trading actions.

## Implementation Plan

1. Read scoped Paperclip context and current Soar state.
2. Run public production smoke without worker/protected endpoint mutation.
3. Collect three-sample route/API timing data and build-info readback.
4. Run protected auth/session proof with `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD`
   mapped process-locally to the proof runner.
5. Run production UI module clickthrough with the current production SHA.
6. Check Coolify/VPS binding-name availability and local env-check tests.
7. Verify no validation-created browser process remains.
8. Update evidence/state and close the Paperclip issue with disposition.

## Acceptance Criteria

- Public API/Web smoke recorded.
- Current production build-info SHA recorded.
- Timing samples recorded for public routes.
- Auth/session proof passed or records a concrete blocker.
- Route/module clickthrough passed or records a concrete blocker.
- Coolify/VPS health readback is either recorded or blocked with owner/action.
- Cleanup evidence recorded.
- Paperclip issue receives a durable final disposition.

## Definition Of Done

- Evidence files identify status, proof, residual risk, and next owner/action.
- Source-of-truth state is updated for the Soar production acceptance result.
- No production mutation or secret disclosure occurred.

## Forbidden

- Do not print or persist credentials, cookies, tokens, private response
  bodies, account details, payment data, exchange keys, or live-trading data.
- Do not mutate production services, data, accounts, subscriptions, exchanges,
  orders, positions, or runtime settings.
- Do not create duplicate broad incidents for the existing Coolify/VPS binding
  blocker chain.

## Result Report

Status: `PARTIALLY_VERIFIED / APP_HEALTHY / COOLIFY_VPS_BINDINGS_BLOCKED`.

Public smoke passed:

```bash
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Production build-info readback observed SHA
`42177530f2a2ddc22832133b545bccab6ab404eb` on `main`, metadata source
`env-runtime`, checked at `2026-06-20T04:38:31.031Z`.

Public timing maxes across three samples were Web `/` `227 ms`, Web
`/auth/login` `62 ms`, Web `/api/build-info` `35 ms`, API `/health` `87 ms`,
and API `/ready` `32 ms`.

Protected auth/session browser proof passed:

```bash
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-4833-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-4833-prod-auth-session-browser-proof-2026-06-20.md
```

Authenticated production UI module clickthrough passed:

```bash
pnpm run -s ops:ui:prod-clickthrough -- --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-20 --output-json history/evidence/_artifacts-luc-4833-prod-ui-module-clickthrough-2026-06-20.json --output-md history/evidence/luc-4833-prod-ui-module-clickthrough-2026-06-20.md
```

Coolify/VPS server-health readback did not run because the current runner has
no `COOLIFY*`, `VPS*`, `SSH*`, `SOAR_PROD*`, `PROD_DB_CHECK*`,
`PRODUCTION_DB_CHECK*`, `ROLLBACK_GUARD*`, `RC_*`, or `GATE*` binding names.
Only `LIVEIMPORT_READBACK_*` and `PROD_UI_AUDIT_*` names were present. Existing
blocker chain remains [LUC-4767](/LUC/issues/LUC-4767) ->
[LUC-4806](/LUC/issues/LUC-4806) -> [LUC-4811](/LUC/issues/LUC-4811).

Focused checker contract passed:

```bash
pnpm run -s ops:coolify-stack:env-check:test
```

Result: PASS (`11/11`).

Post-run process check found no leftover `chrome-headless-shell`, `chrome`, or
`msedge` rows.

Evidence:

- `history/evidence/luc-4833-authenticated-production-acceptance-performance-sweep-2026-06-20.md`
- `history/evidence/luc-4833-prod-auth-session-browser-proof-2026-06-20.md`
- `history/evidence/_artifacts-luc-4833-prod-auth-session-browser-proof-2026-06-20.json`
- `history/evidence/luc-4833-prod-ui-module-clickthrough-2026-06-20.md`
- `history/evidence/_artifacts-luc-4833-prod-ui-module-clickthrough-2026-06-20.json`
