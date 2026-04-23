# AUTH-NAVIGATION-FALLBACK-REGRESSION

## Context

- Production auth recovery already relies on `navigateWithFallback()` to retry
  the route transition when the browser remains on `/auth/login` or
  `/auth/register` after an auth success path.
- The helper currently has no direct regression coverage, so a future refactor
  could silently remove the delayed retry or broaden it into unintended routes.

## Goal

- Add a focused regression pack for `apps/web/src/lib/navigation.ts` that
  proves:
  - auth-route fallback retries once when the browser still sits on the auth
    route after the delay
  - no retry happens once the browser already left the fallback route
  - test-mode execution skips browser fallback retries to keep hook tests
    deterministic

## Constraints

- Do not change production navigation behavior unless a test exposes a real
  contract bug.
- Keep the scope limited to the shared navigation helper and canonical context
  sync only.
- Use fake timers so the regression remains deterministic and fast.

## Definition of Done

- `apps/web/src/lib/navigation.test.ts` exists and locks the fallback contract.
- Focused web validation passes for the new navigation test plus the existing
  auth regression pack.
- `.codex/context/PROJECT_STATE.md` and `.codex/context/TASK_BOARD.md` mention
  the new regression lock.

## Forbidden

- No auth-flow redesigns.
- No router abstraction rewrite.
- No opportunistic cleanup outside the touched helper/test surface.
