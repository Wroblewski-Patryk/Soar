# LUC-48 Autonomous map inventory and UI polish readiness gate

Date: 2026-05-25
Issue: `LUC-48 [Soar] Autonomous map inventory and UI polish readiness gate`
Owner lane: `Docs Memory Lead`

## Map inventory (autonomous)

- Canonical route ownership source: `docs/status/view-map-browser-workflow-ownership.md`
- Journey proof context:
  - `docs/status/user-action-index.md`
  - `docs/status/function-journey-index.md`
  - `apps/web/src/app/**/page.tsx`
- Route/feature inventory checks (local):
  - Web page files: `37` (`Get-ChildItem -Path apps/web/src/app -Recurse -Filter page.tsx -File`)
  - API router files touched by doc parity evidence: `10` (`Get-ChildItem apps/api/src/router -Recurse -Include *.routes.ts,*.ts -File`)
  - View map rows documented today: `82` (`Select-String "| /"` in `docs/status/view-map-browser-workflow-ownership.md`)

## UI polish readiness gate (state-level)

Readiness here means route-level polish can be judged only after corresponding frontend proof for states (`loading`, `empty`, `error`, `success`) and auth/path constraints.

The child proof matrix for these states is tracked in
[`LUC-48-A/browser-proof` (published as `LUC-49` child artifacts)](./luc-49-ui-state-browser-proof-matrix-2026-05-25.md).

| Surface | Map source | Polish state gate | Current status | Next owner |
| --- | --- | --- | --- | --- |
| Auth pages (`/`, `/auth/login`, `/auth/register`) | `view-map-browser-workflow-ownership.md` | loading/empty/error/success | implemented and verified (local route map + mapping contract) | Frontend + QA |
| Dashboard home and core runtime views (`/dashboard`) | same | loading/empty/error/success + API-empty fallback | implemented but not verified | Frontend |
| Bots/workflows (`/dashboard/bots*`) | same | loading/empty/error/success + destructive action guard UX | implemented but not verified | Frontend |
| Wallets/Markets/Strategies/Backtests/Reports/Logs/Profile/Admin | same | loading/empty/error/success + responsive sanity | implemented but not verified | Frontend + QA |
| Auth-gated or protected workflows | same | all state variants + auth recovery behavior | blocked by proof context | Frontend/QA + Ops/Auth owner |

## UI readiness deficits that block V1 polish

| Route surface | Blocking state deficits | Assigned owner |
| --- | --- | --- |
| `/dashboard` | Empty/error/ready-empty transitions and auth recovery states are not freshly browser-verified; local-only evidence | Frontend (`LUC-48-A/browser-proof`) |
| `/dashboard/bots*` | Loading/error/empty states not freshly re-proved; destructive confirmation and failure modes missing from fresh auth browser proof | Frontend (`LUC-48-A/browser-proof`) |
| `/dashboard/wallets*`, `/dashboard/markets*`, `/dashboard/strategies*`, `/dashboard/backtests*`, `/dashboard/reports`, `/dashboard/logs`, `/dashboard/profile` | Empty/error states are missing from matrix; responsive desktop/tablet/mobile not revalidated | Frontend (`LUC-48-A/browser-proof`) + QA (`LUC-45-C`) |
| `/admin/*` | Local-only success proof only; no fresh authenticated admin protected-state verification | Frontend (`LUC-48-A/browser-proof`) + QA (`LUC-45-C`) + Security (`LUC-45-D`) |
| Auth-gated workflows across all dashboard/admin routes | Verification blocked by missing protected auth context and non-destructive browser auth fixtures | Frontend (`LUC-48-A/browser-proof`) + QA (`LUC-45-C`) + Ops/Auth (`LUC-45-D`) |

### Cross-lane deficiency routing

The child artifact
[`LUC-49 UI state browser proof matrix`](./luc-49-ui-state-browser-proof-matrix-2026-05-25.md)
includes explicit routing rows for required owner lanes:
`Frontend`, `UX`, `Backend`, `QA`, and `Product`.

## Evidence-backed readiness rule

- For `LUC-48` today, docs state ownership and map coverage is in place; route-level UI polish proof is **not yet complete**.
- The issue is cleared for delegation/synchronization into execution lanes only when each surface above is linked to verified walkthrough artifacts.

## Required follow-up

- Run/attach browser workflow proof artifacts per surface when auth context is available. Child issue `LUC-48-A/browser-proof` now owns this block.
- Add explicit route-state checklists for at least `desktop/tablet/mobile` for the highest-risk polish surfaces.
- Feed outcome back to `LUC-45` and docs-memory lane in `LUC-48` state files; clear readiness only after `LUC-48-A/browser-proof` artifacts are merged.
- Keep map/index parity active while blocked: after each `LUC-48-A/browser-proof` refresh, rerun source-of-truth sync and confirm
  `docs/analysis/analysis-documentation.md`, `.codex/context/TASK_BOARD.md`, and `.codex/context/PROJECT_STATE.md` are still in agreement until
  authenticated/protected UI proof is attached.
- Track and close the blocking rows above in `LUC-48-A/browser-proof` output:
  - `LUC-48-A/browser-proof` matrix freshness needs refresh with explicit route-level `loading/empty/error` artifacts for protected/admin and money-flow surfaces.
  - Missing empty/error/loading proof for `/dashboard/wallets*`, `/dashboard/markets*`, `/dashboard/strategies*`, `/dashboard/backtests*`, `/dashboard/reports`, `/dashboard/logs`, `/dashboard/profile`.
  - Protected/admin state proof is still blocked on auth-context availability and ops-controlled protected-route credentials.
  - If full-matrix rerun cannot start immediately, use narrow repair lane `LUC-49-R1` (Frontend + QA) for protected `/dashboard`, `/dashboard/bots*`, `/admin/*` state-proof packet as explicit unblock bridge.
