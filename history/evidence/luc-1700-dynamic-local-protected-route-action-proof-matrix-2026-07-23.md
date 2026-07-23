# LUC-1700-dynamic Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-07-23
- Generated at (UTC): 2026-07-23T00:38:44.726Z
- Raw JSON: `history\artifacts\luc-1700-dynamic-local-protected-route-action-proof-matrix-2026-07-23.json`
- Dynamic fixtures: enabled
- Fixture API interception: enabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-WALLETS-LIST | `/dashboard/wallets/list` | PASS | `/auth/login` | unauthenticated protected wallets list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-WALLET-ID-ROOT | `/dashboard/wallets/luc-2188-wallet` | PASS | `/dashboard/wallets/luc-2188-wallet/edit` | redirect reached expected route through local HTTP fixture-id proof |
| SOAR-ACTION-VISIT-PAGE-WALLET-EDIT | `/dashboard/wallets/luc-2188-wallet/edit` | PASS | `/dashboard/wallets/luc-2188-wallet/edit` | route reached expected route through local HTTP fixture-id proof |
| SOAR-ACTION-VISIT-PAGE-WALLET-PREVIEW | `/dashboard/wallets/luc-2188-wallet/preview` | PASS | `/dashboard/wallets/luc-2188-wallet/preview` | route reached expected route through local HTTP fixture-id proof |
| SOAR-ACTION-VISIT-PAGE-WALLET-CREATE | `wallets list-page add action` | PASS | `/dashboard/wallets/create` | clicked create/add action (Create), expected create route |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/wallets/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/list/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/create/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/edit/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx` | present |
| `apps/web/src/features/wallets/components/WalletPreviewPanel.tsx` | present |
| `apps/web/src/features/wallets/components/WalletsListTable.test.tsx` | present |
| `apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/edit/page.test.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/preview/page.test.tsx` | present |
| `docs/modules/web-wallets.md` | present |
| `docs/modules/api-wallets.md` | present |

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| wallets | 3 | `GET /dashboard/wallets`<br>`POST /dashboard/wallets`<br>`GET /dashboard/wallets/metadata`<br>`GET /dashboard/wallets/:id`<br>`PUT /dashboard/wallets/:id`<br>`DELETE /dashboard/wallets/:id`<br>`POST /dashboard/wallets/:id/reset-paper` | `docs/modules/web-wallets.md`<br>`docs/modules/api-wallets.md` |

## Existing Focused Tests

- wallets: `WalletsListTable.test.tsx`, `WalletCreateEditForm.test.tsx`, `app/dashboard/wallets/[id]/edit/page.test.tsx`, `app/dashboard/wallets/[id]/preview/page.test.tsx`, `wallet route page tests`, `apps/api/src/modules/wallets/wallets.e2e.test.ts`, `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `luc-2188-wallet`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
