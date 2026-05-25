# LUC-21 Visual Quality Audit — Primary Workflow Known-State

## Context
- Issue: LUC-21 `[Soar][UX] Primary workflow visual quality audit`
- Date: 2026-05-25
- Scope: Dashboard, auth, and admin primary workflows (`apps/web/src/app/**`), with supporting
  architecture route/source contracts.
- Owner: UX Visual Lead (visualAndMedia lane)

## Sources read
- `docs/ux/*`
- `docs/architecture/reference/dashboard-route-map.md`
- `docs/modules/system-modules.md`
- `docs/ux/dashboard-accessibility-baseline.md`
- `docs/product/overview.md`
- `docs/product/product.md`
- `package.json` scripts

## Current known-state: primary screens / workflows

### Public entry
1. `/` — landing / entry.
2. `/auth/login` — authentication entry.
3. `/auth/register` — registration flow.
4. `/offline` — network fallback page.

### Authenticated dashboard IA (wallet-first order)
5. `/dashboard` — control center and runtime overview.
6. `/dashboard/wallets` (legacy alias → `/dashboard/wallets/list`) — wallet overview.
7. `/dashboard/wallets/list` — wallet list.
8. `/dashboard/wallets/create` — wallet create.
9. `/dashboard/wallets/:id` (alias → `/dashboard/wallets/:id/edit`) — wallet edit path.
10. `/dashboard/wallets/:id/edit` — wallet edit.
11. `/dashboard/wallets/:id/preview` — wallet preview.
12. `/dashboard/markets/list` — market universe list.
13. `/dashboard/markets/create` — add/edit universe.
14. `/dashboard/markets/:id/edit` — universe edit.
15. `/dashboard/strategies/list` — strategy list.
16. `/dashboard/strategies/create` — strategy create.
17. `/dashboard/strategies/:id/edit` — strategy edit.
18. `/dashboard/bots` — bot management and high-level runtime context.
19. `/dashboard/bots/create` — bot create.
20. `/dashboard/bots/:id/edit` — bot edit.
21. `/dashboard/bots/:id/preview` — bot runtime/profile preview.
22. `/dashboard/bots/:id/runtime` (alias from `/dashboard/bots/:id` and `/dashboard/bots/:id/runtime`) — bot runtime.
23. `/dashboard/bots/:id/assistant` — assistant/decision context.
24. `/dashboard/bots/new` (alias → `/dashboard/bots/create`) — bot create alias.
25. `/dashboard/bots/assistant` (alias behavior depends on botId) — assistant context.
26. `/dashboard/bots/runtime` (alias behavior depends on botId) — runtime context.
27. `/dashboard/backtests/list` — backtest runs list.
28. `/dashboard/backtests/create` — run creation.
29. `/dashboard/backtests/:id` — run details.
30. `/dashboard/reports` — reporting dashboard.
31. `/dashboard/logs` — operational logs/audit feed.
32. `/dashboard/profile` — profile + exchange/API key integration surface.
33. `/admin/subscriptions` — subscription plans.
34. `/admin/users` — user management.

## Canonical evidence plan

### Primary render command paths
- Local dev stack:
  - `docker compose up -d`
  - `pnpm run backend/dev`
  - `pnpm run frontend/dev`
- Production-like local check:
  - `pnpm run prod-like:start`
- UX proof pipeline (from README/package scripts):
  - `pnpm run ops:prod-ux:proof`
  - script: `scripts/runProdUxA11yMobileProof.mjs`

### Required visual evidence matrix
For each route in the known-state list above (or canonical representative route for route families), capture:
- desktop viewport (`screenshot + baseline assertions`)
- tablet viewport (layout density + content prioritization)
- mobile viewport (single dominant flow, menu/controls)
- route-specific assertions for core states:
  - `loading`
  - `empty`
  - `error`/`degraded`
  - `success`

Recommended proof order:
1. `/dashboard` → `/dashboard/wallets/list` → `/dashboard/wallets/:id/preview`
2. `/dashboard/markets/list` → `/dashboard/strategies/list` → `/dashboard/bots`
3. `/dashboard/bots/create` (form + validation path)
4. `/dashboard/backtests/list` → `/dashboard/backtests/:id`
5. `/dashboard/reports` → `/dashboard/logs` → `/dashboard/profile`
6. `/admin/subscriptions` → `/admin/users`
7. `/auth/login`, `/auth/register`, `/offline`

## Reproducible UX risks / known gaps (with evidence status)

1. No dedicated Figma or approved screenshot source is declared in architecture/UX docs for
   all listed routes.
   - Status: `implemented but not verified` (documentation-level)

2. Accessibility smoke baseline is explicitly complete only for:
   - `/dashboard`
   - `/dashboard/bots`
   - `/dashboard/wallets/list`
   and `PageTitle` a11y contract.
   Deep views (`/dashboard/backtests/:id`, `/dashboard/reports`, `/dashboard/logs`, `/dashboard/profile`, admin routes) are still listed as follow-up.
   - Status: `implemented but not verified`

3. Visual state coverage currently lacks explicit audited evidence for all deep dashboard routes in one
   consistent full-route pass; evidence is available for some representative routes but not the complete matrix.
   - Status: `implemented but not verified`

4. Route mapping has many legacy/alias routes (`/dashboard/bots/new`, `/dashboard/bots/runtime`,
   `/dashboard/admin`, `/dashboard/wallets`, `/dashboard/bots/:id`) resolved by route redirects.
   UX regression risk: users on legacy links can lose intended context if redirect timing or copy is weak.
   - Status: `present in code, behavior unknown`

5. No full run of `ops:prod-ux:proof`/screenshot evidence is attached to this issue heartbeat.
   - Status: `blocked by process` (command not executed in this heartbeat)

## Immediate next checks before verification

1. Run `pnpm run ops:prod-ux:proof` against a reachable backend/frontend pair and save generated JSON/PNG artifacts.
2. Capture a desktop/tablet/mobile matrix for:
   - `/dashboard`, `/dashboard/wallets/list`, `/dashboard/bots`, `/dashboard/markets/list`,
     `/dashboard/strategies/list`, `/dashboard/profile`, `/admin/subscriptions`
3. Run state probes for aliases/redirects on:
   - `/dashboard/bots/new`, `/dashboard/bots/assistant`, `/dashboard/bots/runtime`, `/admin`
4. Add any confirmed reusable findings into:
   - `docs/ux/design-memory.md` (approved reusable visual-structure rules)
   - issue task record when visual debt is accepted or blocked.

## Evidence state
- Known-state artifact: present in code
- Process evidence (commands/screenshot files): missing for this heartbeat
- UX regression list: present and prioritized
