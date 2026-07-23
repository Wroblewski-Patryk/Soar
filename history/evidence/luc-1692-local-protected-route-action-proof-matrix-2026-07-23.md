# LUC-1692 Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-07-23
- Generated at (UTC): 2026-07-23T00:27:36.457Z
- Raw JSON: `history\artifacts\luc-1692-local-protected-route-action-proof-matrix-2026-07-23.json`
- Dynamic fixtures: disabled
- Fixture API interception: enabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-PROFILE | `/dashboard/profile` | PASS | `/auth/login` | unauthenticated protected profile list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-PROFILE | `/dashboard/profile` | PASS | `/dashboard/profile` | route reached expected profile route with local cookie gate |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/profile/page.tsx` | present |
| `apps/web/src/app/dashboard/profile/page.test.tsx` | present |
| `apps/web/src/features/profile/pages/ProfilePage.tsx` | present |
| `apps/web/src/features/profile/components/ApiKeysList.test.tsx` | present |
| `apps/web/src/features/profile/components/ApiKeyForm.test.tsx` | present |
| `docs/modules/web-profile.md` | present |
| `docs/modules/api-profile.md` | present |

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| profile | 1 | `GET /dashboard/profile/basic`<br>`PUT /dashboard/profile/basic`<br>`GET /dashboard/profile/apiKeys`<br>`POST /dashboard/profile/apiKeys`<br>`POST /dashboard/profile/apiKeys/:id/test`<br>`GET /dashboard/profile/subscription` | `docs/modules/web-profile.md`<br>`docs/modules/api-profile.md` |

## Existing Focused Tests

- profile: `app/dashboard/profile/page.test.tsx`, `ApiKeysList.test.tsx`, `ApiKeyForm.test.tsx`, `apps/api/src/modules/profile/apiKeys.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `none`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
