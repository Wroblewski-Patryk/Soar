# DASHBOARD-ROUTE-CONTEXT-TEST-SIGNAL-CLEANUP

## Context

- A broader `web` test pass stays green, but some dashboard tests still emit
  avoidable i18n missing-key noise because they render under the default `/`
  route instead of the real dashboard route that owns the expected namespace
  set.
- The auth incident follow-up already proved that route-accurate test context
  matters for trustworthy signal quality.

## Goal

- Remove avoidable dashboard i18n warning noise by making the touched wallets
  page test render under its real route context.

## Constraints

- Do not change runtime i18n behavior.
- Keep the scope limited to the wallets page test that is currently noisy
  because of route context drift.
- Preserve existing assertions and business behavior.

## Definition of Done

- The wallets list page test sets the correct dashboard route before rendering.
- Focused web validation passes without changing production code.
- `.codex/context/PROJECT_STATE.md` and `.codex/context/TASK_BOARD.md` record
  the signal-cleanup task.

## Forbidden

- No namespace registry changes.
- No translation-content edits.
- No broad test-helper rewrite in this slice.
