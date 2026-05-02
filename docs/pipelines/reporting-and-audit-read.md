# Pipeline: Reporting and audit read

Updated: 2026-05-03

## Trigger
User opens reports or audit logs.

## User/System Action
- UI requests read-only analytics or audit trail data.
- API returns user-scoped performance or log records.

## Involved Frontend Files
- `apps/web/src/features/reports/*`
- `apps/web/src/features/logs/*`
- `apps/web/src/app/dashboard/reports/page.tsx`
- `apps/web/src/app/dashboard/logs/page.tsx`

## Involved Backend Files
- `apps/api/src/modules/reports/*`
- `apps/api/src/modules/logs/*`
- supporting reads from backtest/trading models.

## Involved Services
- Reports service.
- Logs service.
- Auth/user-scoping middleware.

## Data Read/Write
- Reads `BacktestRun`, `BacktestTrade`, `Trade`, `Position`, `Wallet`.
- Reads `Log`.
- No user-facing mutation expected from this pipeline.

## Failure Points
- Empty analytics state.
- User-scope leak in logs.
- Missing source data from upstream runtime/backtest flows.

## Tests
- `apps/api/src/modules/reports/reports.service.test.ts`
- `apps/api/src/modules/logs/logs.e2e.test.ts`
- web reports/logs tests if present.

## Related Docs
- `docs/modules/api-reports.md`
- `docs/modules/api-logs.md`
- `docs/modules/web-reports.md`
- `docs/modules/web-logs.md`

## Known Gaps
- Exact web test coverage for reports is `UNVERIFIED / NEEDS CONFIRMATION` in
  this static pass.
