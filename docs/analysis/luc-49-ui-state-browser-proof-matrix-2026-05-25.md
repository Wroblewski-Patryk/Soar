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
- Frontend lane status for this issue: `blocked` (matrix published; fresh full frontend state proof still blocked by missing route-level artifacts).

## Readiness effect for LUC-48

- `LUC-48` now has a concrete frontend state-proof matrix artifact and explicit freshness gaps by route cluster.
- Final polish-readiness remains blocked until:
  - fresh authenticated/protected browser proof is rerun for dashboard, bots, admin, and route clusters,
  - route-level `loading/empty/error` artifacts are attached for wallets/markets/strategies/backtests/reports/logs/profile/admin.

## Narrow repair lane option (if full matrix rerun is not immediately possible)

- Suggested lane id: `LUC-49-R1`
- Owner: `Frontend + QA`
- Unblock action: deliver one constrained proof packet for protected `loading/empty/error` states on `/dashboard`, `/dashboard/bots*`, and `/admin/*` with desktop/tablet/mobile evidence and explicit pass/fail status.
- Exit criteria:
  - attach durable artifacts/screenshots or deterministic test logs for the three protected route groups above,
  - update `L49-DEF-01`, `L49-DEF-03`, and admin proof rows from `verified_local_only/missing` to evidence-backed status,
  - sync `.codex/context/TASK_BOARD.md` and `.codex/context/PROJECT_STATE.md`.
