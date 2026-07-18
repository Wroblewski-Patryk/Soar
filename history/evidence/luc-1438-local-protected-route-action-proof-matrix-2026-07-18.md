# LUC-1438 Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-07-18
- Generated at (UTC): 2026-07-18T17:05:05.461Z
- Raw JSON: `history\artifacts\luc-1438-local-protected-route-action-proof-matrix-2026-07-18.json`
- Dynamic fixtures: enabled
- Fixture API interception: disabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-BOTS-LIST | `/dashboard/bots` | PASS | `/auth/login` | unauthenticated protected bots list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-BOTS-LIST | `/dashboard/bots` | PASS | `/dashboard/bots` | route reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-CREATE | `/dashboard/bots/create` | PASS | `/dashboard/bots/create` | route reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-NEW-ALIAS | `/dashboard/bots/new` | PASS | `/dashboard/bots/create` | redirect reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-ASSISTANT | `/dashboard/bots/assistant` | PASS | `/dashboard/bots` | redirect reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME | `/dashboard/bots/runtime` | PASS | `/dashboard/bots` | redirect reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-DETAIL-ALIAS | `/dashboard/bots/luc-2188-bot` | PASS | `/dashboard/bots/luc-2188-bot/preview` | redirect reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-EDIT | `/dashboard/bots/luc-2188-bot/edit` | PASS | `/dashboard/bots/luc-2188-bot/edit` | route reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-PREVIEW | `/dashboard/bots/luc-2188-bot/preview` | PASS | `/dashboard/bots/luc-2188-bot/preview` | route reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME | `/dashboard/bots/luc-2188-bot/runtime` | PASS | `/dashboard/bots/luc-2188-bot/preview` | redirect reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-ASSISTANT | `/dashboard/bots/luc-2188-bot/assistant` | PASS | `/dashboard/bots/luc-2188-bot/assistant` | route reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-CREATE | `bots list-page add action` | PASS | `/dashboard/bots/create` | clicked create/add action (Create bot), expected create route |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/bots/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/create/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/new/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/assistant/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/runtime/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/edit/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/preview/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/_components/BotFormPageContent.tsx` | present |
| `apps/web/src/features/bots/components/BotsListTable.tsx` | present |
| `apps/web/src/features/bots/components/BotCreateEditForm.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/create/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/assistant/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/runtime/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/edit/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/preview/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/runtime/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/assistant/page.test.tsx` | present |
| `docs/modules/web-bots.md` | present |
| `docs/modules/api-bots.md` | present |
| `docs/architecture/reference/assistant-runtime-contract.md` | present |

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| bots | 10 | `GET /dashboard/bots`<br>`POST /dashboard/bots`<br>`GET /dashboard/bots/:id`<br>`PUT /dashboard/bots/:id`<br>`DELETE /dashboard/bots/:id`<br>`GET /dashboard/bots/:id/market-groups` | `docs/modules/web-bots.md`<br>`docs/modules/api-bots.md` |

## Existing Focused Tests

- bots: `app/dashboard/bots/create/page.test.tsx`, `app/dashboard/bots/new/page.test.tsx`, `app/dashboard/bots/assistant/page.test.tsx`, `app/dashboard/bots/runtime/page.test.tsx`, `app/dashboard/bots/[id]/page.test.tsx`, `app/dashboard/bots/[id]/edit/page.test.tsx`, `app/dashboard/bots/[id]/preview/page.test.tsx`, `app/dashboard/bots/[id]/runtime/page.test.tsx`, `app/dashboard/bots/[id]/assistant/page.test.tsx`, `BotCreateEditForm.test.tsx`, `BotsManagement.test.tsx`, `apps/api/src/modules/bots/bots.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `luc-2188-bot`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
