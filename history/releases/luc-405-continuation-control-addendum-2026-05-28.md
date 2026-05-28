# LUC-405 Continuation Control Addendum (2026-05-28)

## Purpose
Reduce low-yield heartbeat churn while keeping ARB-006 fail-closed and auditable.

## Effective policy (Ops lane)
- Do not rerun repetitive protected checks on every generic continuation wake when no new input signal exists.
- Treat `issue_children_completed` wakes without new protected-input/auth evidence as `state-sync only`.
- Trigger a new dual-check (`ops:operator-unblock:check` + `ops:protected-inputs:check`) only when at least one condition is true:
  1. Security/Test confirms approved read-only principal/session for protected `GET /workers/ready`.
  2. Credential owner confirms protected input families were restored in the active runner context.
  3. Board/parent issue requests an explicit revalidation run for a named SHA/date window.

## Blocked posture
- Until a trigger condition appears, keep `LUC-405` disposition `blocked` with unchanged unblock owners/actions.
- No deploy/push/restart/protected smoke/production mutation/secret access.

## Next executable step when triggered
1. Run dual-check in the same runner context.
2. Record result in task + board + project state.
3. If readiness is stable and complete, publish parent `LUC-402` unblock update; otherwise keep blocked with first-class blocker delta.
