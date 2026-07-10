# LUC-244 Route Browser-Review Slice Checklist

Date: 2026-07-10
Issue: [LUC-244](/LUC/issues/LUC-244)
Parent: [LUC-240](/LUC/issues/LUC-240)

## Context

`docs/status/app-completion-index.md` reports `452` browser/screenshot review
items across `8` user flows. `docs/status/user-action-index.md` reports `41`
actions, including `39` high gaps that mostly need fresh browser or production
proof for protected and money-facing routes. `docs/architecture/reference/dashboard-route-map.md`
is the route-to-feature/API source of truth.

This packet is a frontend triage artifact only. It does not claim protected
production browser proof, mutate accounts, capture secrets/tokens/cookies, or
replace the protected proof packet in [LUC-172](/LUC/issues/LUC-172).

## Bundle Checklist

| Bundle | Routes / actions | Primary owner | Gate | Proof type | Can run without protected auth? | Current routing |
| --- | --- | --- | --- | --- | --- | --- |
| Public shell and legal | `/`, `/offline`, `/privacy`, `/terms`, public layout/header/footer | Frontend Web + QA/Test Automation | none | public route browser smoke, responsive screenshot, console/error check | yes | create/assign a public-route refresh slice when current deploy needs fresh evidence; no protected gate needed |
| Account access | `/auth/login`, `/auth/register`, password visibility toggle, authenticated-session redirect behavior | Frontend Web + QA/Test Automation, with Backend Auth for API/session assertions | public page plus auth/session boundary | browser smoke for public form states, local auth tests, production-safe redirect checks when auth context exists | public form rendering yes; authenticated redirect/session claims no | separate from [LUC-172](/LUC/issues/LUC-172); recommended follow-up slice if fresh production auth-page browser evidence is required |
| Dashboard runtime and trading controls | `/dashboard`, manual order submit, runtime position/order readbacks, bot runtime summaries | QA/Test Automation + Frontend Web, Integration Trading for LIVE boundaries | protected auth, money/exchange, LIVE mutation forbidden unless separately approved | protected authenticated browser proof, fixture/local helper proof, read-only production proof when bindings exist | no | covered by [LUC-172](/LUC/issues/LUC-172); do not duplicate |
| Setup and configuration | `/dashboard/wallets*`, `/dashboard/markets*`, `/dashboard/strategies*`, profile exchange/API-key and security panels | Frontend Web + QA/Test Automation, Backend owners per module | protected auth, configuration, some destructive/mutating UI states | local fixture route/action proof, protected authenticated browser proof, API fail-closed tests for mutation gates | local fixture proof yes; production protected claims no | not fully covered by [LUC-172](/LUC/issues/LUC-172); recommend one setup/configuration route bundle slice |
| Reports and backtests | `/dashboard/backtests/list`, `/dashboard/backtests/create`, `/dashboard/backtests/:id`, `/dashboard/reports` | Frontend Web + QA/Test Automation, Backend Backtests/Reports for data contracts | protected auth, backtest mutation/destructive actions | local fixture route/action proof for list/create/detail/report states; protected production read-only proof only with approved session | local fixture proof yes; production protected claims no | protected reports/backtests are included in [LUC-172](/LUC/issues/LUC-172); avoid duplicate protected packet, add only local state-specific follow-up if needed |
| Bots management and assistant | `/dashboard/bots`, `/dashboard/bots/create`, `/dashboard/bots/new`, `/dashboard/bots/:id`, `/dashboard/bots/:id/edit`, `/dashboard/bots/:id/preview`, `/dashboard/bots/:id/assistant`, aliases/redirects | Frontend Web + QA/Test Automation, AI Runtime for assistant behavior | protected auth, configuration, AI assistant boundary, LIVE activation consent | local fixture route/action proof, redirect proof, protected authenticated browser proof, AI prompt/authorization proof if assistant behavior changes | local fixture proof yes; production protected claims no | runtime pieces covered by [LUC-172](/LUC/issues/LUC-172); recommend separate assistant/CRUD route slice only if not already covered by current local proof |
| Admin and subscription | `/admin`, `/admin/users`, `/admin/subscriptions`, profile subscription panel | Frontend Web + QA/Test Automation, Security/Backend Admin for role gates | protected auth, admin role, subscription entitlement mutation | local admin fixture proof, role fail-closed proof, protected admin browser proof with approved admin session | local fixture/fail-closed yes; production admin claims no | not covered by [LUC-172](/LUC/issues/LUC-172); recommend admin/subscription route bundle slice |
| Logs and observability | `/dashboard/logs` | Frontend Web + QA/Test Automation, Backend Logs/Ops for data contract | protected auth, read-only audit data | local route/state proof, protected read-only proof when approved auth exists | local fixture proof yes; production protected claims no | can be included with setup/configuration or a small read-only protected route slice; no duplicate trading runtime lane |

## Follow-Up Recommendation

Do not create another protected runtime/trading issue from this backlog. Use
[LUC-172](/LUC/issues/LUC-172) for Dashboard runtime, Bots runtime, Manual
Orders, Positions/Orders readback, and Backtests/Reports protected proof.

Recommended owner-usable slices not already fully covered by [LUC-172](/LUC/issues/LUC-172):

1. Public/access browser refresh: public shell, legal/offline, login/register,
   password visibility, unauthenticated protected redirect checks.
2. Setup/configuration protected-local proof: wallets, markets, strategies,
   profile exchange/API-key/security panels, with production claims gated.
3. Admin/subscription protected-local proof: admin redirects, users,
   subscriptions, role fail-closed behavior, and profile subscription panel.

Optional only if fresh evidence is specifically requested:

4. Bots CRUD/assistant route proof excluding runtime trading proof already
   routed through [LUC-172](/LUC/issues/LUC-172).
5. Logs/read-only observability route proof, which can be bundled with the
   setup/configuration slice if scope pressure matters.

## Validation

This packet was validated by source readback only:

- `docs/status/app-completion-index.md`
- `docs/status/user-action-index.md`
- `docs/architecture/reference/dashboard-route-map.md`
- `history/tasks/luc-6890-app-completion-browser-review-packet-2026-07-02-task.md`

No route was opened in a protected browser session and no production protected
smoke was attempted.

## Regression Risk

- Low for runtime behavior: docs/evidence/context only.
- Medium for planning accuracy if route inventory changes before follow-up
  execution; rerun route parity and user-action index generation before any
  implementation or browser-proof child closes.
- Protected production claims remain gated by approved session/input bindings.
