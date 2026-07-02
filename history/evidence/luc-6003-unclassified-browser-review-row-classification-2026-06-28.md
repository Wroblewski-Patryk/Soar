# LUC-6003 Unclassified Browser-Review Row Classification

## Status

- Result: `DONE / VERIFIED_DOCS_CLASSIFICATION / 147_ROWS_CLASSIFIED / NO_RUNTIME_MUTATION`
- Issue: [LUC-6003](/LUC/issues/LUC-6003)
- Parent: [LUC-5998](/LUC/issues/LUC-5998)
- Source index: `docs/status/app-completion-index.json` generated `2026-06-28T12:20:40.798Z`
- Source graph: `docs/graphs/architecture-awareness.json`
- Evidence artifact: `history/artifacts/luc-6003-unclassified-browser-review-row-classification-2026-06-28.json`

## Scope

Docs/PM classification only. No product code, runtime, deploy, push, restart,
protected smoke, secret/account readback, production mutation, exchange
mutation, subscription/payment mutation, order, position, or live-trading action
occurred.

## Classification Summary

All `147` `Unclassified user workflow` rows with `needs_browser_review` were
extracted from the architecture graph using the same app-completion algorithm
as `build-app-completion-index.mjs`, then mapped into named journeys or support
lanes.

| Classified journey or lane | Rows | Expected proof lane | Representative paths/entities |
| --- | ---: | --- | --- |
| Platform/API operations support | 39 | taxonomy repair or API contract proof | `apps/api/src/index.ts`; `apps/api/src/middleware/errorHandler.ts`; `apps/api/src/observability/runtimeFreshness.ts`; `apps/api/src/workers/workerHeartbeat.ts` |
| Runtime automation and AI execution | 27 | API/worker contract proof | `apps/api/src/modules/engine/runtimeScanLoop.service.ts`; `assistantOrchestrator.service.ts`; `runtimeSignalMerge.ts`; `simulator.service.ts` |
| Shared UI system and form states | 26 | component state proof | `apps/web/src/ui/components/DataTable.tsx`; `ConfirmModal.tsx`; `ViewState.tsx`; `apps/web/src/ui/forms/FormSectionCard.tsx` |
| Backtest run lifecycle | 21 | browser or API journey proof | `apps/api/src/modules/backtests/backtests.routes.ts`; `BacktestCreateForm.tsx`; `BacktestsListView.tsx`; `BacktestRunDetails.tsx` |
| Support utilities, audit logs, and reports | 12 | browser or API journey proof | `apps/api/src/modules/logs/logs.routes.ts`; `reports.routes.ts`; `AuditTrailView.tsx`; `PerformanceReportsView.tsx` |
| Public shell, legal, build-info, and PWA | 12 | browser or route proof | `apps/web/src/app/(public)/page.tsx`; `privacy/page.tsx`; `terms/page.tsx`; `app/api/build-info/route.ts`; `manifest.ts` |
| Strategy management | 9 | browser or API journey proof | `apps/api/src/modules/strategies/strategies.routes.ts`; `indicators.routes.ts`; `StrategiesList.tsx` |
| Account access and public user projection | 1 | API contract proof | `apps/api/src/modules/users/publicUser.ts` |

## Reclassification Decision

- Existing flow reclassification:
  - `Backtest run lifecycle`, `Strategy management`, and `Support utilities,
    audit logs, and reports` are real product journeys that should not remain
    under a generic Unclassified bucket.
  - `Public shell, legal, build-info, and PWA` is a public-route/browser proof
    lane, not Account/Subscription/Exchange/Admin proof.
  - `Account access and public user projection` should be linked to Account
    access/API contract evidence if the generator taxonomy is refined later.
- Existing duplicate-lane guard:
  - Do not create new Account, Subscription, Exchange, Admin, protected-smoke,
    stale-token, build-provenance, or host-level proof lanes from this child.
  - Account/Subscription/Exchange/Admin remain on their existing owner paths
    unless a future proof run finds a concrete defect.
- Taxonomy repair candidates:
  - `39` Platform/API operations support rows are scanner taxonomy artifacts:
    backend support files were typed as `route` and therefore marked as browser
    review rows. They need graph taxonomy repair or API/worker contract proof,
    not browser screenshots.

## Validation

- Parsed `docs/status/app-completion-index.json` successfully.
- Re-derived Unclassified `needs_browser_review` rows from
  `docs/graphs/architecture-awareness.json`.
- Count matched parent acceptance source: `147` rows.
- Classification artifact covers all `147` rows with `0` manual remainder.

## Next Owner / Action

- Docs/PM can treat [LUC-6003](/LUC/issues/LUC-6003) as complete.
- Future QA/Docs burn-down should open narrow children from the classified
  journeys above, starting with real browser/API journeys rather than the
  Platform/API taxonomy artifact bucket.
