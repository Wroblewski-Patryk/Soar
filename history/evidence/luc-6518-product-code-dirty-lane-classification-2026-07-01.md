# LUC-6518 Product-Code Dirty Lane Classification

## Summary

[LUC-6518](/LUC/issues/LUC-6518) classified the product-code dirty lane reported
by the [LUC-6516](/LUC/issues/LUC-6516) control tick. The current app/script
dirty cluster is not one coherent product feature; it is a source-control
batching problem made of already-documented specialist lanes.

## Scope

Repository: `C:/Personal/Projekty/Aplikacje/Soar`

Inspected app/script dirty files:

- `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- `apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx`
- `apps/web/src/app/dashboard/page.tsx`
- `apps/web/src/context/AuthContext.test.tsx`
- `apps/web/src/context/AuthContext.tsx`
- `apps/web/src/features/admin/layout/AdminLayoutShell.test.tsx`
- `apps/web/src/features/admin/layout/AdminLayoutShell.tsx`
- `apps/web/src/features/backtest/components/BacktestsList.test.tsx`
- `scripts/checkProtectedInputReadiness.mjs`
- `scripts/checkProtectedInputReadiness.test.mjs`

## Classification

| Cluster | Files | Existing owner path | Classification | Release/source action |
| --- | --- | --- | --- | --- |
| Auth/session expired redirect preservation | `AuthContext.tsx`, `AuthContext.test.tsx`, `dashboard/page.tsx`, `dashboard.a11y.smoke.test.tsx`, `AdminLayoutShell.tsx`, `AdminLayoutShell.test.tsx` | [LUC-6134](/LUC/issues/LUC-6134) | Product-code fix with focused Web proof already recorded in the task packet. | Batch only through release/source-control provenance after dirty tree is split; do not discard. |
| Backtests API e2e harness stabilization | `apps/api/src/modules/backtests/backtests.e2e.test.ts` | [LUC-6164](/LUC/issues/LUC-6164) | Test-harness reliability repair, no product behavior change. | Batch with backend test-harness proof; do not combine with auth fix as one feature commit unless release owner intentionally creates a provenance bundle. |
| Backtests Web grouped proof isolation | `BacktestsList.test.tsx` | [LUC-6479](/LUC/issues/LUC-6479) | Test-harness isolation hardening; no FEW product repair required. | Batch with QA/Test proof closure. |
| Protected input/account-access gate checker | `checkProtectedInputReadiness.mjs`, `checkProtectedInputReadiness.test.mjs` | [LUC-6416](/LUC/issues/LUC-6416), also consumed by [LUC-6382](/LUC/issues/LUC-6382) / [LUC-6387](/LUC/issues/LUC-6387) controller checks | Security/Ops no-secret gate-classification logic. | Batch with protected-input gate evidence; keep fail-closed semantics. |

## Verification

- `git status --short` confirmed the broader workspace is heavily dirty with
  unrelated docs, evidence, generated architecture/status files, and historical
  artifacts.
- `git diff --name-only -- apps api packages scripts` narrowed product/script
  dirty files to the ten files listed above.
- `git diff --stat -- <product/script files>` showed `191` insertions and `22`
  deletions across those ten files.
- Existing task packets were read for [LUC-6134](/LUC/issues/LUC-6134),
  [LUC-6164](/LUC/issues/LUC-6164), [LUC-6416](/LUC/issues/LUC-6416),
  [LUC-6382](/LUC/issues/LUC-6382), and [LUC-6479](/LUC/issues/LUC-6479).
- No tests, builds, commits, pushes, deploys, restarts, protected smoke, secret
  readback, DB/Redis mutation, account/payment/exchange mutation, order,
  position, subscription mutation, or live-trading action were performed by
  this classification heartbeat.

## Disposition

The dirty product-code lane is classified and can close as `done` for
[LUC-6518](/LUC/issues/LUC-6518). Remaining source-control closure belongs to
the release/source-control owner, who should split or intentionally bundle the
clusters above into coherent commits only after validating the relevant owner
packets and ensuring the unrelated docs/evidence/generated artifacts are not
accidentally swept into product commits.

Residual risk: production Web and backtest-worker restoration remain blocked on
[LUC-6331](/LUC/issues/LUC-6331); this classification does not authorize push,
deploy, restart, rollback, or production mutation.
