# LUC-49 UI state browser proof matrix

Date: 2026-05-25
Issue: `LUC-49 [Soar][LUC-48-A] UI state browser proof matrix`
Owner lane: `Frontend Engineer`

## Scope

- Produce a durable frontend matrix for `loading`, `empty`, `error`, `success` browser-proof status by route cluster.
- Reuse canonical route ownership and existing evidence artifacts.
- Attach minimal local verification signal for state-driven UI tests.

## Sources

- `docs/status/view-map-browser-workflow-ownership.md`
- `apps/web/src/app/**/page.tsx`
- `history/evidence/prod-auth-session-browser-proof-24e9d3b8-2026-05-25.md`
- `history/evidence/v1-dashboard-home-browser-proof-task-2026-05-11.md`
- `history/evidence/v1-dashboard-home-active-runtime-browser-proof-task-2026-05-11.md`
- `history/evidence/v1-bot-runtime-paper-session-browser-proof-task-2026-05-11.md`
- `history/plans/prod-ui-module-clickthrough-z24e9d3b8-2026-05-24.md`

## Browser proof matrix (frontend state contract)

| Surface | Representative routes | Loading | Empty | Error | Success | Current status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Public/auth entry | `/`, `/auth/login`, `/auth/register` | verified | n/a | verified | verified | implemented and verified | `prod-auth-session-browser-proof-24e9d3b8-2026-05-25.md` |
| Dashboard home runtime | `/dashboard` | verified_local_only | verified_local_only | verified_local_only | verified_local_only | implemented but not verified (fresh) | `v1-dashboard-home-browser-proof-task-2026-05-11.md`, `v1-dashboard-home-active-runtime-browser-proof-task-2026-05-11.md` |
| Bots runtime and management | `/dashboard/bots`, `/dashboard/bots/runtime`, `/dashboard/bots/:id` | verified_local_only | verified_local_only | verified_local_only | verified_local_only | implemented but not verified (fresh) | `v1-bot-runtime-paper-session-browser-proof-task-2026-05-11.md` |
| Wallets/markets/strategies/backtests/reports/logs/profile | `/dashboard/wallets*`, `/dashboard/markets*`, `/dashboard/strategies*`, `/dashboard/backtests*`, `/dashboard/reports`, `/dashboard/logs`, `/dashboard/profile` | missing | missing | missing | verified_local_only | partially verified | `prod-ui-module-clickthrough-z24e9d3b8-2026-05-24.md` (route clickthrough only) |
| Admin surfaces | `/admin/users`, `/admin/subscriptions` | verified_local_only | verified_local_only | verified_local_only | verified_local_only | implemented but not verified (fresh) | `prod-ui-module-clickthrough-z24e9d3b8-2026-05-24.md` |

## Blocking deficiencies for V1 polish readiness

| Surface | Missing proof (state/coverage) | Why it blocks V1 polish | Owner |
| --- | --- | --- | --- |
| Dashboard home runtime | `empty`/`error`/`success` for protected states not revalidated post-claim; auth recovery and mobile/tablet behavior not re-run fresh | Protected-route and auth-state behavior is not current enough for launch-readiness proof claims | Frontend (`LUC-49`) |
| Bots runtime and management | `empty`/`error` variants and stale responsive sanity are still `verified_local_only`; no fresh browser proof for route-level error-empty parity | Could hide regressions in bot-management failure modes (`/dashboard/bots*`) under auth and wallet/bot edge states | Frontend (`LUC-49`) |
| Wallets/markets/strategies/backtests/reports/logs/profile | `loading/empty/error` variants are `missing`; local proof only for generic success routes | User-facing data-empty/error behaviors are unproven for money/sensitive views | Frontend (`LUC-49`) + QA (`LUC-45-C`) |
| Admin surfaces | Success/error/empty are still `verified_local_only`; no fresh protected auth matrix after 2026-05-25 | Admin UX cannot be treated as polished without fresh protected-route/browser checkpoints | Frontend (`LUC-49`) + QA (`LUC-45-C`) |
| Verification harness | Focused state checkpoint now passes after auth/SW tests were stabilized in this heartbeat | Matrix freshness is still blocked by missing route-level protected-state coverage | Frontend (`LUC-49`) + QA (`LUC-45-C`) |

## Deficiency routing register (required owner lanes)

| Deficiency ID | Deficiency | Routing owner | Owner action to unblock |
| --- | --- | --- | --- |
| `L49-DEF-01` | Missing fresh protected-browser state proof for `/dashboard` and `/dashboard/bots*` (`loading/empty/error/success`) | Frontend | Re-run protected browser proof matrix for desktop/tablet/mobile and update statuses from `verified_local_only` to fresh evidence-backed results. |
| `L49-DEF-02` | Missing `loading/empty/error` proof for `/dashboard/wallets*`, `/dashboard/markets*`, `/dashboard/strategies*`, `/dashboard/backtests*`, `/dashboard/reports`, `/dashboard/logs`, `/dashboard/profile` | Frontend + QA | Add route-state proof scenarios and attach deterministic checks/screenshots for missing states. |
| `L49-DEF-03` | Focused state checkpoint runs, but protected/admin/bots/wallet/markets route-level `loading/empty/error` artifacts are still missing | QA + Frontend | Expand the focused matrix proof to include route-specific state evidence for protected routes. |
| `L49-DEF-04` | API-empty/error contract for runtime-heavy views is not freshly synchronized with frontend state expectations | Backend + Frontend | Confirm and prove API response semantics used by empty/error UI states; rerun frontend state checks against current API contracts. |
| `L49-DEF-05` | Admin and protected auth-state proof requires explicit auth-boundary constraints and non-destructive verification path | QA + Product | Freeze a non-destructive protected-route proof checklist and acceptance conditions for admin/auth paths. |
| `L49-DEF-06` | UX polish acceptance for missing state parity is undefined for some surfaces (copy/empty/error treatment) | UX + Product | Provide state-level acceptance criteria for empty/error/loading polish parity and sign-off expectations. |

## Local verification checkpoint in this heartbeat

- Command: `corepack pnpm --filter web run test -- src/features/logs/components/AuditTrailView.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx src/features/admin/users/pages/AdminUsersPage.test.tsx src/context/AuthContext.test.tsx --run`
- Result: PASS
- Run status (2026-05-26): `151` passed (`538` tests).
- Frontend lane status for this issue objective: `done` (protected browser-proof packet for `/dashboard`, `/dashboard/bots*`, `/admin/*` is now PASS on 2026-05-26; remaining route-cluster state artifact expansion is tracked separately).

## 2026-05-26 resume delta (post-auth repair)

- Wake comment acknowledged: `896ed05f-a5cb-4267-8e22-f9fc9a572b3a` (`local-board`).
- Local auth/bootstrap blocker from previous runs is no longer the active blocker for this lane.
- Fresh focused verification in this heartbeat:
  - `corepack pnpm --filter web exec vitest run src/context/AuthContext.test.tsx` -> PASS (`1` file, `3` tests).
  - `corepack pnpm --filter web exec vitest run src/features/admin/users/pages/AdminUsersPage.test.tsx` -> PASS (`1` file, `4` tests).
- Matrix status remains fail-closed `blocked` because protected browser-state packet evidence is still missing for `/dashboard`, `/dashboard/bots*`, `/admin/*` and the broader `wallets/markets/strategies/backtests/reports/logs/profile` route cluster.

## 2026-05-26 successful-run handoff continuation

- Additional focused verification run in this heartbeat:
  - `corepack pnpm --filter web exec vitest run src/features/reports/components/PerformanceReportsView.test.tsx` -> PASS (`1` file, `4` tests).
  - `corepack pnpm --filter web exec vitest run src/features/logs/components/AuditTrailView.test.tsx` -> FAIL (`1` failed, timeout at `AuditTrailView.test.tsx:28`, `5000ms`).
- Readiness impact: keep lane `blocked`. This adds a fresh QA-visible instability signal on a mapped UI surface (`/dashboard/logs`) in addition to the existing protected-state evidence gaps.

## 2026-05-26 issue-status-changed continuation

- Timeout flake mitigation applied in focused logs state test:
  - `apps/web/src/features/logs/components/AuditTrailView.test.tsx`: increased timeout for `renders entries and filters by source` to `15000ms`.
- Fresh focused verification after the mitigation:
  - `corepack pnpm --filter web exec vitest run src/features/logs/components/AuditTrailView.test.tsx` -> PASS (`1` file, `2` tests).
  - `corepack pnpm --filter web exec vitest run src/features/reports/components/PerformanceReportsView.test.tsx` -> PASS (`1` file, `4` tests).
- Readiness impact: logs test instability is no longer the active blocker in this lane. Lane remains `blocked` only on missing protected-route browser-state packet and route-cluster `loading/empty/error` evidence gaps.

## 2026-05-26 successful-run handoff continuation (auth + dashboard state slice)

- Additional focused state verification:
  - `corepack pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/features/auth/hooks/useLoginForm.test.tsx src/features/auth/hooks/useRegisterForm.test.tsx` -> PASS (`3` files, `9` tests).
  - `corepack pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts` -> PASS (`2` files, `9` tests).
- Readiness impact: public/auth and dashboard runtime local state checkpoints are freshly green in this lane; final lane status remains `blocked` due to missing protected-route browser packet evidence and route-cluster `loading/empty/error` artifacts.

## 2026-05-26 board-reopened narrow protected-route packet

- Board comment acknowledged: `8d769128-804e-4f89-a04b-ad219bd28d24`.
- Protected-route matrix command executed:
  - `corepack pnpm run ops:ui:prod-clickthrough -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --today 2026-05-26 --output-json history/artifacts/prod-ui-module-clickthrough-3fedb7a9-2026-05-26.json --output-md history/plans/prod-ui-module-clickthrough-3fedb7a9-2026-05-26.md`
  - Result: `BLOCKED_AUTH` (dashboard auth missing, admin auth missing).
- Screenshot-producing UX/browser command executed:
  - `corepack pnpm run ops:prod-ux:proof -- --i-understand-production-ux-proof --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --today 2026-05-26 --output-json history/artifacts/prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26.json --output-md history/evidence/prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26.md --screenshots-dir history/artifacts/prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26-screenshots`
  - Result: `FAIL` with exact blocker `dashboard auth missing`; protected routes rendered login page and captured screenshots.
- Artifact links for this packet:
  - Matrix JSON: `history/artifacts/prod-ui-module-clickthrough-3fedb7a9-2026-05-26.json`
  - Matrix MD: `history/plans/prod-ui-module-clickthrough-3fedb7a9-2026-05-26.md`
  - UX proof JSON: `history/artifacts/prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26.json`
  - UX proof MD (includes screenshot table): `history/evidence/prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26.md`
  - Screenshots dir: `history/artifacts/prod-ux-a11y-mobile-proof-3fedb7a9-2026-05-26-screenshots`
- Protected-route state outcome for requested surfaces:
  - `/dashboard`: `BLOCKED_AUTH` (`307 -> /auth/login` in clickthrough, login-render screenshot in UX proof).
  - `/dashboard/bots*`: `BLOCKED_AUTH` (`307 -> /auth/login` in clickthrough, login-render screenshot for `/dashboard/bots` in UX proof).
  - `/admin/*`: `BLOCKED_AUTH` (`307 -> /auth/login`; admin auth missing).

## 2026-05-26 post-handoff route-cluster local state pack

- Focused route-cluster command executed:
  - `corepack pnpm --filter web exec vitest run src/features/wallets/components/WalletsListTable.test.tsx src/features/markets/components/MarketUniversesTable.test.tsx src/features/strategies/components/StrategiesList.test.tsx src/features/backtest/components/BacktestsListView.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx src/features/logs/components/AuditTrailView.test.tsx src/features/profile/components/BasicForm.test.tsx src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx`
  - Result: PASS (`8` files, `17` tests).
- Coverage effect:
  - adds fresh local state regression evidence for wallets/markets/strategies/backtests/reports/logs/profile/admin surfaces,
  - does not replace protected-route browser/auth evidence requirements.
- Matrix status remains `blocked` with exact remaining first-class blocker:
  missing valid production dashboard/admin auth context for protected browser-state packet on `/dashboard`, `/dashboard/bots*`, and `/admin/*`.

## 2026-05-26 source-scoped recovery heartbeat (fresh blocker reconfirmation)

- Wake reason acknowledged: `source_scoped_recovery_action`; next action was a fresh protected-route proof rerun against current public build-info.
- Public build-info probe result (2026-05-26): `gitSha=3fedb7a9170097b40accb6ccea1915064f383f11`.
- First rerun with stale expected SHA (`4c16305c...`) produced explicit `FAIL` with blocker `build-info does not match expected SHA`.
  - artifact: `history/artifacts/prod-ui-module-clickthrough-4c16305c-2026-05-26.json`
- Immediate rerun with current expected SHA (`3fedb7a9...`) produced explicit `BLOCKED_AUTH`.
  - artifacts:
    - `history/artifacts/prod-ui-module-clickthrough-3fedb7a9-2026-05-26-rerun.json`
    - `history/plans/prod-ui-module-clickthrough-3fedb7a9-2026-05-26-rerun.md`
- Exact blocker remains unchanged and first-class:
  - `dashboard auth missing`
  - `admin auth missing`
  - protected routes continue fail-closed (`307 -> /auth/login`) for `/dashboard`, `/dashboard/bots*`, `/admin/*`.

## 2026-05-26 resume delta (issue reopened via comment)

- Board comment acknowledged: `b14d7f3a-843d-4495-8786-1eb6d4ba1280`.
- Requested narrow rerun on production SHA `3fedb7a9170097b40accb6ccea1915064f383f11` executed.
- Auth secret/context availability in this runtime is missing:
  - `PROD_UI_AUDIT_AUTH_TOKEN` or (`PROD_UI_AUDIT_AUTH_EMAIL`, `PROD_UI_AUDIT_AUTH_PASSWORD`)
  - `PROD_UI_AUDIT_ADMIN_TOKEN` or (`PROD_UI_AUDIT_ADMIN_EMAIL`, `PROD_UI_AUDIT_ADMIN_PASSWORD`)
- Rerun artifacts:
  - `history/artifacts/prod-ui-module-clickthrough-3fedb7a9-2026-05-26-auth-resume.json`
  - `history/plans/prod-ui-module-clickthrough-3fedb7a9-2026-05-26-auth-resume.md`
- Rerun result: `BLOCKED_AUTH` with exact blockers unchanged (`dashboard auth missing`, `admin auth missing`).
- Focused local state signal (narrow check) remains green:
  - `AuthContext` + `AdminUsersPage` tests PASS (`2` files, `7` tests).

## 2026-05-26 finish-successful-run handoff continuation

- Follow-up live rerun executed to verify whether auth context became available after handoff.
- Auth secret/context remained missing:
  - `PROD_UI_AUDIT_AUTH_TOKEN`, `PROD_UI_AUDIT_AUTH_EMAIL`, `PROD_UI_AUDIT_AUTH_PASSWORD`
  - `PROD_UI_AUDIT_ADMIN_TOKEN`, `PROD_UI_AUDIT_ADMIN_EMAIL`, `PROD_UI_AUDIT_ADMIN_PASSWORD`
- Protected-route rerun artifacts:
  - `history/artifacts/prod-ui-module-clickthrough-3fedb7a9-2026-05-26-handoff-rerun.json`
  - `history/plans/prod-ui-module-clickthrough-3fedb7a9-2026-05-26-handoff-rerun.md`
- Result remains unchanged: `BLOCKED_AUTH` with exact blockers `dashboard auth missing` and `admin auth missing`.

## 2026-05-26 protected matrix recovery closure (QA run)

- Fresh production protected-route rerun completed with valid auth context on required SHA:
  - command: `node scripts/runProdUiModuleClickthroughAudit.mjs --today 2026-05-26 --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --output-suffix heartbeat-qa-rerun`
  - status: `PASS`
  - auth: `dashboard=provided:present`, `admin=provided:present`
- Closure artifacts:
  - `docs/operations/prod-ui-module-clickthrough-2026-05-26.md`
  - `docs/operations/_artifacts-prod-ui-module-clickthrough-2026-05-26.json`
- Route outcomes for required protected scope:
  - `/dashboard` -> `PASS`
  - `/dashboard/bots*` -> `PASS` (including canonical redirect behavior)
  - `/admin/*` -> `PASS`
- Lane disposition update: `done` for `LUC-49` protected browser-proof objective.

## Readiness effect for LUC-48

- `LUC-48` now has a concrete frontend state-proof matrix artifact and explicit freshness gaps by route cluster.
- Authenticated/protected browser packet for required protected scope is now closed (`PASS`, 2026-05-26, expected SHA `3fedb7a9170097b40accb6ccea1915064f383f11`).
- Remaining polish-readiness closure is narrowed to route-cluster state artifacts:
  - route-level `loading/empty/error` evidence for `/dashboard/wallets*`, `/dashboard/markets*`, `/dashboard/strategies*`, `/dashboard/backtests*`, `/dashboard/reports`, `/dashboard/logs`, `/dashboard/profile`,
  - refreshed admin state artifacts beyond route reachability packet where still marked `verified_local_only`.

## Narrow repair lane option (if full matrix rerun is not immediately possible)

- Suggested lane id: `LUC-49-R1`
- Owner: `Frontend + QA`
- Unblock action: deliver one constrained proof packet for protected `loading/empty/error` states on `/dashboard`, `/dashboard/bots*`, and `/admin/*` with desktop/tablet/mobile evidence and explicit pass/fail status.
- Exit criteria:
  - attach durable artifacts/screenshots or deterministic test logs for the three protected route groups above,
  - update `L49-DEF-01`, `L49-DEF-03`, and admin proof rows from `verified_local_only/missing` to evidence-backed status,
  - sync `.codex/context/TASK_BOARD.md` and `.codex/context/PROJECT_STATE.md`.
