# LUC-2628 No-Stall Queue Expeditor

## Context

Issue [LUC-2628](/LUC/issues/LUC-2628) woke the Soar Product Manager for the
strict no-stall queue loop. The wake payload had `fallbackFetchNeeded=false`,
no pending comments, and checkout was already claimed by the harness.

## Goal

Inspect the current Soar queue, preserve protected fail-closed gates, avoid
duplicate PM/status-sync churn, and create the next smallest safe lane if no
unblocked implementation lane exists.

## Constraints

- Do not implement code from this PM issue.
- Use [LUC-244](/LUC/issues/LUC-244) as the canonical PM no-stall lane while
  it exists.
- Do not touch deploy, push, restart, rollback, env, account, secret,
  protected smoke, exchange, database, or live-trading behavior.
- Use child issues for delegated work instead of polling.

## Definition Of Done

- Queue and canonical blocker posture read back.
- Any new work is narrow, owner-scoped, and non-duplicative.
- Paperclip issue has a terminal disposition with evidence.

## Verification

- Paperclip heartbeat-context readback succeeded for
  [LUC-2628](/LUC/issues/LUC-2628).
- `pnpm softwarehouse:control-tick` failed because the command is not exposed
  in this checkout; this matches recent Soar PM checkpoints.
- Direct readback of [LUC-244](/LUC/issues/LUC-244) shows it remains
  `blocked` with first-class blockers [LUC-47](/LUC/issues/LUC-47) and
  [LUC-241](/LUC/issues/LUC-241); both terminally depend on
  [LUC-2619](/LUC/issues/LUC-2619).
- Current architecture-awareness report was generated
  `2026-06-07T01:03:05.613Z`; immediately preceding top Web UI/form/layout
  anchors are already covered by [LUC-2624](/LUC/issues/LUC-2624).
- Duplicate search found no existing issue for the Web PWA/service-worker
  missing-test family.

## Disposition

Created [LUC-2631](/LUC/issues/LUC-2631) for `09 FEW (Frontend Web Engineer)`
to cover the Web PWA/service-worker missing-test family:
`checkBuildVersion`, `handleControllerChange`, `handleVisibilityChange`,
`handleWindowFocus`, `purgePwaCaches`, and `requestUpdateCheck`.

The child was immediately checked out by the Frontend Web lane. A one-line
identifier typo remains in the child description's Definition of Done
(`LUC-2629` instead of `LUC-2631`) because PM could not patch it after FEW
checkout. The parent issue records [LUC-2631](/LUC/issues/LUC-2631) as the
authoritative child identifier.

## Result Report

- Files changed: this task artifact plus source-of-truth status files.
- Tests run: not applicable; PM coordination only.
- Deploy impact: none.
- Residual risk: protected production proof remains fail-closed through
  [LUC-2619](/LUC/issues/LUC-2619), [LUC-241](/LUC/issues/LUC-241), and
  [LUC-47](/LUC/issues/LUC-47).
- Next owner: `09 FEW (Frontend Web Engineer)` on
  [LUC-2631](/LUC/issues/LUC-2631).
