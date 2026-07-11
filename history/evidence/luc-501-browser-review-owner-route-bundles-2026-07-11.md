# LUC-501 Browser-Review Owner Route Bundles

Date: 2026-07-11
Issue: [LUC-501](/LUC/issues/LUC-501)
Parent: [LUC-497](/LUC/issues/LUC-497)

## Context

[LUC-501](/LUC/issues/LUC-501) asked Frontend Web Engineering to split the
browser-review backlog into owner-usable route bundles. This packet uses the
current generated status indexes and route source of truth, and reuses the
protected runtime/trading proof path already prepared by [LUC-172](/LUC/issues/LUC-172).

Source readback:

- `docs/status/app-completion-index.md` generated 2026-07-10 reports `3557`
  items, `8` user flows, `452` browser/screenshot review rows, and `0`
  blocked rows.
- `docs/status/user-action-index.md` reports `41` actions, including `39`
  high gaps requiring fresh browser or production proof for protected,
  money-facing, destructive, local-only, or partially verified actions.
- `docs/architecture/reference/dashboard-route-map.md` lists `39` canonical
  V1 web routes across Dashboard, Admin, and Public/Access groups.
- `history/evidence/luc-244-route-browser-review-slice-checklist-2026-07-10.md`
  is the predecessor FEW slice checklist and remains consistent with this
  packet.

## Route Bundle Register

| Bundle | Routes / actions | Owner lane | Gate | Proof type | Can run without protected auth? | Follow-up route |
| --- | --- | --- | --- | --- | --- | --- |
| Public shell and legal | `/`, `/offline`, `/privacy`, `/terms`, public layout/header/footer | Frontend Web Engineer + QA/Test Automation | none | public browser smoke, responsive screenshots, console/network error check | yes | ready for a public/access browser refresh issue when current deploy evidence is requested |
| Account access | `/auth/login`, `/auth/register`, password visibility toggle, unauthenticated protected-route redirects, authenticated-session redirects | Frontend Web Engineer + QA/Test Automation; Backend Auth consulted for session assertions | public page plus auth/session boundary | public form-state browser proof, local auth/session test readback, production-safe redirect proof when protected session exists | public form and unauthenticated redirect proof yes; authenticated session claims no | bundle with public/access refresh; production authenticated claims require protected session proof |
| Dashboard runtime and trading controls | `/dashboard`, manual order submit, runtime positions/orders readback, bot runtime summaries | QA/Test Automation + Frontend Web Engineer; Integration Trading for LIVE boundary review | protected auth, money/exchange, LIVE mutation forbidden unless separately approved | protected authenticated browser proof, local fixture/helper proof, read-only production proof when bindings exist | no | already routed through [LUC-172](/LUC/issues/LUC-172); do not create duplicate runtime/trading proof |
| Setup and configuration | `/dashboard/wallets*`, `/dashboard/markets*`, `/dashboard/strategies*`, `/dashboard/profile` exchange/API-key/security panels | Frontend Web Engineer + QA/Test Automation; Backend module owners consulted per API contract | protected auth, configuration mutation, some destructive route states | local fixture route/action proof, fail-closed mutation checks, protected browser proof only with approved session | local fixture proof yes; production protected claims no | recommended separate setup/configuration protected-local proof issue |
| Reports and backtests | `/dashboard/backtests/list`, `/dashboard/backtests/create`, `/dashboard/backtests/:id`, `/dashboard/reports` | Frontend Web Engineer + QA/Test Automation; Backend Backtests/Reports consulted for data contracts | protected auth, backtest mutation/destructive states | local fixture list/create/detail/report proof, protected read-only proof when approved session exists | local fixture proof yes; production protected claims no | protected reports/backtests are included in [LUC-172](/LUC/issues/LUC-172); create only state-specific local follow-up if needed |
| Bots management and assistant | `/dashboard/bots`, `/dashboard/bots/create`, `/dashboard/bots/new`, `/dashboard/bots/:id`, `/dashboard/bots/:id/edit`, `/dashboard/bots/:id/preview`, `/dashboard/bots/:id/assistant`, bot aliases/redirects | Frontend Web Engineer + QA/Test Automation; AI Runtime for assistant behavior; Integration Trading for LIVE activation boundaries | protected auth, configuration mutation, AI assistant boundary, LIVE activation consent | local fixture CRUD/redirect proof, assistant authorization/prompt-boundary proof if assistant behavior changes, protected browser proof when approved | local fixture proof yes; production protected claims no | optional bots CRUD/assistant slice; exclude runtime trading proof already routed through [LUC-172](/LUC/issues/LUC-172) |
| Admin and subscription | `/admin`, `/admin/users`, `/admin/subscriptions`, `/dashboard/profile` subscription panel | Frontend Web Engineer + QA/Test Automation; Security/Backend Admin consulted for role gates | protected auth, admin role, subscription entitlement mutation | local admin fixture proof, role fail-closed proof, protected admin browser proof with approved admin session | local fixture/fail-closed proof yes; production admin claims no | recommended separate admin/subscription protected-local proof issue |
| Logs and observability | `/dashboard/logs` | Frontend Web Engineer + QA/Test Automation; Backend Logs/Ops consulted for data contract | protected auth, read-only audit data | local route/state proof, protected read-only proof when approved session exists | local fixture proof yes; production protected claims no | can be bundled with setup/configuration or kept as a small read-only route slice |

## Recommended Execution Split

1. Public/access browser refresh.
   Owner: Frontend Web Engineer with QA/Test Automation review.
   Scope: public shell, legal/offline, login/register form states, password
   visibility toggle, unauthenticated protected redirects.
   Gate: no protected production auth required.

2. Setup/configuration protected-local proof.
   Owner: Frontend Web Engineer with QA/Test Automation review.
   Scope: wallets, markets, strategies, profile exchange/API-key/security
   panels, logs if bundled.
   Gate: local fixture proof can proceed; production protected claims require
   approved session bindings.

3. Admin/subscription protected-local proof.
   Owner: Frontend Web Engineer with QA/Test Automation and Security/Backend
   Admin consultation.
   Scope: admin root redirect, admin users, admin subscriptions, subscription
   profile states, role fail-closed behavior.
   Gate: local fixture/fail-closed proof can proceed; production admin proof
   requires approved admin session.

4. Optional bots CRUD/assistant route proof.
   Owner: Frontend Web Engineer with QA/Test Automation and AI Runtime
   consultation if assistant behavior changes.
   Scope: bot list/create/edit/preview/assistant and alias redirects only.
   Gate: exclude runtime trading proof already covered by [LUC-172](/LUC/issues/LUC-172).

Do not create another Dashboard runtime, Manual Orders, Positions/Orders, or
Backtests/Reports protected runtime issue from this backlog. That proof path is
already packaged in [LUC-172](/LUC/issues/LUC-172).

## QA Acceptance Criteria For Follow-Up Proof

- **Given** a public route bundle, **when** the route is opened on desktop and
  mobile, **then** the page renders without console errors, blocked network
  requests, overlapping text, or broken navigation.
- **Given** an unauthenticated browser session, **when** the user opens a
  protected dashboard or admin route, **then** the app redirects or fails closed
  without exposing protected data.
- **Given** a local fixture account, **when** configuration routes are opened
  with empty, loading, success, and error fixture states, **then** each route
  shows the expected state without requiring production credentials.
- **Given** a non-admin local fixture account, **when** admin routes are opened,
  **then** admin data and mutation controls remain inaccessible.
- **Given** any protected or money-facing route, **when** production proof is
  requested, **then** execution stops unless approved protected session/input
  bindings are present and the proof is explicitly read-only.

## Validation

Validated by source readback and duplicate search only:

- `docs/status/app-completion-index.md`
- `docs/status/user-action-index.md`
- `docs/architecture/reference/dashboard-route-map.md`
- `history/evidence/luc-244-route-browser-review-slice-checklist-2026-07-10.md`
- `history/tasks/luc-6890-app-completion-browser-review-packet-2026-07-02-task.md`
- Paperclip issue search for duplicate follow-up titles returned no active
  matches for public/access, setup/configuration, admin/subscription,
  bots/assistant, or logs route-proof slices.

No UI/code change, protected browser execution, production smoke, secret or
account readback, deploy, restart, rollback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, or LIVE trading action
occurred.

## Residual Risk

- Runtime behavior is unchanged; this is a planning/evidence packet.
- Planning accuracy must be refreshed if the route map or generated indexes
  change before a follow-up proof issue starts.
- Protected production claims remain gated by approved protected session/input
  bindings and cannot be closed from this packet alone.
