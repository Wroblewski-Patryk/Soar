# Production UI Module Clickthrough Audit Plan (2026-05-08)

## Header
- ID: `PROD-UI-AUDIT-PLAN-2026-05-08`
- Title: Plan production UI clickthrough audit for all module functions
- Task Type: planning
- Current Stage: planning
- Status: READY
- Owner: QA/Test
- Depends on:
  - current target build deployed and verified through web build-info
  - authenticated production user access for dashboard flows
  - admin production user access for `/admin/*` flows
  - explicit operator approval before any live-money or destructive action
- Priority: P0
- Iteration: V1 production hardening
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is TESTER because this is evidence-first production QA.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The user requested a production clickthrough audit after the planned backend
and exchange tasks. The goal is to verify every user-visible function from the
UI against the canonical architecture, route, module, API, and UX contracts.

Current state after the 2026-05-09 sync:
- current production target:
  `30b027b78544f76b5b638851e8e27c98f6d22ab5`
- latest observed production build-info:
  `30b027b78544f76b5b638851e8e27c98f6d22ab5`
- public production smoke: PASS for API `/health`, API `/ready`, and web `/`
- latest public/unauthenticated UI access:
  `docs/operations/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`
- protected dashboard/admin clickthrough: blocked until valid production auth
  is provided or an approved authenticated browser context is available

## Goal
Create a production audit playbook that can be executed with browser
automation/manual clickthrough to prove all module functions are reachable,
usable, correctly gated, and aligned with architecture.

## Success Signal
- User or operator problem: the user wants confidence that enabling bots/live
  behavior will not expose broken UI flows or architecture drift.
- Expected product or reliability outcome: every production UI route and major
  action is either PASS, FAIL with evidence, or BLOCKED with explicit missing
  prerequisite.
- How success will be observed: audit artifact with route manifest, screenshots,
  console/network findings, API contract notes, and prioritized fix tasks.
- Post-launch learning needed: yes

## Deliverable For This Stage
This planning artifact only. It defines the audit scope, prerequisites,
execution checklist, evidence format, and stop conditions.

## Constraints
- Use canonical route and module docs as the source of truth.
- Do not mutate production data destructively during audit.
- Do not place live-money orders without explicit operator approval.
- Do not treat public smoke or no-auth redirects as proof of protected flows.
- Keep screenshots and reports redacted when they contain user data, balances,
  API-key labels, emails, or admin records.
- Do not bypass auth, role checks, capability gates, or unsupported-exchange
  guards.

## Scope

### Public / Access Routes
- `/`
- `/auth/login`
- `/auth/register`
- `/offline`

### Dashboard Routes
- `/dashboard`
- `/dashboard/exchanges`
- `/dashboard/profile`
- `/dashboard/wallets`
- `/dashboard/wallets/list`
- `/dashboard/wallets/create`
- `/dashboard/wallets/:id/edit`
- `/dashboard/wallets/:id/preview`
- `/dashboard/markets/list`
- `/dashboard/markets/create`
- `/dashboard/markets/:id/edit`
- `/dashboard/strategies/list`
- `/dashboard/strategies/create`
- `/dashboard/strategies/:id/edit`
- `/dashboard/backtests/list`
- `/dashboard/backtests/create`
- `/dashboard/backtests/:id`
- `/dashboard/bots`
- `/dashboard/bots/create`
- `/dashboard/bots/:id/preview`
- `/dashboard/bots/:id/edit`
- `/dashboard/bots/:id/assistant`
- `/dashboard/bots/assistant`
- `/dashboard/bots/runtime`
- `/dashboard/reports`
- `/dashboard/logs`

### Admin Routes
- `/admin`
- `/admin/users`
- `/admin/subscriptions`

### Legacy Redirects
- `/dashboard/orders` -> `/dashboard/bots/runtime?legacy=orders`
- `/dashboard/positions` -> `/dashboard/bots/runtime?legacy=positions`
- `/dashboard/bots/new` -> `/dashboard/bots/create`
- `/dashboard/bots/:id` -> `/dashboard/bots/:id/preview`
- `/dashboard/bots/:id/runtime` -> `/dashboard/bots/:id/preview`
- `/dashboard/strategies/:id` -> `/dashboard/strategies/:id/edit`
- `/dashboard/wallets` -> `/dashboard/wallets/list`
- `/dashboard/wallets/:id` -> `/dashboard/wallets/:id/edit`
- `/admin` -> `/admin/subscriptions`

## Architecture Sources
- `docs/architecture/reference/dashboard-route-map.md`
- `docs/architecture/traceability-matrix.md`
- `docs/modules/index.md`
- `docs/modules/system-modules.md`
- `docs/ux/evidence-driven-ux-review.md`
- `docs/ux/screen-quality-checklist.md`
- `docs/ux/experience-quality-bar.md`
- `docs/architecture/reference/stream-transport-contract.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`

## Audit Matrix

| Area | UI module | Main API/module contract | Required checks |
| --- | --- | --- | --- |
| Auth | `web-auth` | `api-auth` | login, register, session redirect, invalid credentials, logout |
| Dashboard home | `dashboard-home` | bots, market-stream, icons, orders | widgets, manual order context, runtime stale states, SSE connection |
| Profile/API keys | `profile`, `exchanges` | profile, exchange probe, upload | profile save, password/security, API-key add/test/delete, avatar upload |
| Wallets | `wallets` | wallets, exchange metadata | list, create, edit, preview, validation, balance/ledger states |
| Markets | `markets` | markets, exchange catalog | catalog load, universe create/edit, active-bot edit lock |
| Strategies | `strategies` | strategies, indicators | list, create, edit, indicator metadata, validation |
| Bots | `bots` | bots, engine, assistant config | list, create, edit, preview, assistant config, runtime views |
| Backtests | `backtest` | backtests, reports | create run, list, details, timeline/report, failure states |
| Reports | `reports` | reports, backtests | performance report load, empty/error states |
| Logs | `logs` | logs | filters, pagination, user-scoped audit rows |
| Admin | `admin` | admin users/subscriptions | role gate, user list/actions, plan list/actions |
| Runtime stream | dashboard/bots | market-stream, engine | SSE connects, ticker/candle events visible, stale/degraded handling |

## Required Test Accounts / Inputs
- Public unauthenticated browser context.
- Authenticated production dashboard user with:
  - at least one wallet
  - at least one market universe/symbol group
  - at least one strategy
  - at least one PAPER bot
  - representative backtest run data
  - logs/report data where available
- Admin production user for `/admin/*`.
- Optional read-only/live-import evidence user for LIVE surfaces.
- Explicit user/operator approval before any live exchange write.

If these accounts are unavailable, record affected flows as `BLOCKED_AUTH` or
`BLOCKED_DATA`, not `PASS`.

## Execution Plan
1. Verify production freshness:
   - confirm `/api/build-info` exposes the current expected SHA.
   - run public deploy smoke with workers disabled.
2. Start unauthenticated route pass:
   - visit public routes.
   - confirm protected routes redirect to login or return proper auth state.
3. Start authenticated dashboard pass:
   - log in through UI.
   - visit every dashboard route and legacy redirect.
   - capture desktop screenshots and console/network errors.
4. Execute module-function pass:
   - click primary list/detail/create/edit/read actions.
   - verify loading, empty, error, and success states where they are safely
     reachable.
   - avoid destructive submits unless they use explicit test records.
5. Execute responsive pass:
   - desktop: 1440x900
   - tablet: 768x1024
   - mobile: 390x844
6. Execute keyboard/a11y pass:
   - tab through auth, navigation, forms, modals, menus, and destructive
     confirmations.
   - verify visible focus and accessible button/link labels.
7. Execute admin pass:
   - verify non-admin is denied.
   - verify admin routes and safe read actions.
8. Produce findings:
   - classify each route/action as `PASS`, `FAIL`, `BLOCKED_AUTH`,
     `BLOCKED_DATA`, `BLOCKED_DEPLOY`, or `NOT_APPLICABLE`.
   - group issues by severity and architecture module.
9. Create follow-up repair tasks:
   - one small task per P0/P1 issue.
   - update route/module docs if architecture drift is confirmed.

## Evidence Output
Create a dated evidence pack under `docs/operations/`, for example:
- `docs/operations/prod-ui-clickthrough-audit-2026-05-08.md`
- `docs/operations/_artifacts-prod-ui-clickthrough-audit-2026-05-08.json`
- screenshot directory under a local temp path, with referenced filenames in
  the Markdown report.

Report format:
- build-info SHA and smoke status
- auth context used, redacted
- route manifest
- per-route result table
- per-module action result table
- console errors and network failures
- screenshots list
- accessibility/responsive notes
- severity-ranked findings
- next repair tasks

## Acceptance Criteria
- Every canonical public, dashboard, admin, and legacy redirect route is
  visited or explicitly blocked with reason.
- Every module in `docs/modules/index.md` with a UI entry has an audit result.
- Protected routes are not marked PASS without authenticated evidence.
- No live-money or destructive production action is performed without explicit
  approval.
- Findings include reproducible route/action steps.
- P0/P1 findings are converted into small implementation tasks.

## Definition of Done
- [x] Audit plan exists and references canonical route/module docs.
- [x] Prerequisites and blockers are explicit.
- [x] Evidence shape is defined.
- [x] Stop conditions for auth/live/destructive actions are explicit.
- [x] Active queue/context references the future audit task.

## Stage Exit Criteria
- [x] The output matches planning stage.
- [x] Execution was not mixed into planning without credentials or deployed
  freshness.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- treating redirects to login as protected-flow PASS
- using Coolify or server shell access as a substitute for app UI auth
- bypassing role gates
- using fake data in production evidence
- destructive admin/user/subscription changes without explicit approval
- live exchange submit/cancel without explicit approval

## Validation Evidence
- Tests:
  - `node scripts/repoGuardrails.mjs` => PASS
  - `node scripts/checkDocsParity.mjs` => PASS
  - `git diff --check` => PASS
- Manual checks:
  - public deploy smoke during latest 2026-05-09 recheck for `55469cdc` => PASS
  - build-info freshness for current target `55469cdc` => PASS
  - authenticated/admin production app access => BLOCKED
- Screenshots/logs:
  - not applicable for planning stage
- High-risk checks:
  - live-money and destructive actions are forbidden unless separately
    approved

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/dashboard-route-map.md`
  - `docs/architecture/traceability-matrix.md`
  - `docs/modules/index.md`
  - `docs/ux/evidence-driven-ux-review.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no for planning; yes before destructive/live
  execution

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: canonical route/module/UX docs
- Canonical visual target: production UI as deployed, checked against UX
  quality docs
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: no, not needed for planning
- Existing shared pattern reused: evidence-driven UX review
- New shared pattern introduced: no
- Design-memory update required: no for planning
- Required states: loading, empty, error, success
- Responsive checks: desktop, tablet, mobile
- Input-mode checks: touch, pointer, keyboard
- Accessibility checks: focus visibility, label/name, modal and form keyboard
  paths

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: docs-only planning commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: current target `30b027b7` is deployed, but authenticated/admin app
  access is not available in this shell.
- Gaps: no single production UI clickthrough playbook covers all module
  functions.
- Inconsistencies: historical route/task evidence exists, but not a fresh
  authenticated production-wide UI audit after current changes.
- Architecture constraints: route/module contracts are canonical source of
  truth.

### 2. Select One Priority Task
- Selected task: production UI clickthrough audit plan.
- Priority rationale: user explicitly requested this future audit after planned
  tasks.
- Why other candidates were deferred: actual protected clickthrough requires
  authenticated/admin app auth.

### 3. Plan Implementation
- Files or surfaces to modify: planning docs and context queue only.
- Logic: build route/module/action audit matrix from canonical docs.
- Edge cases: auth blockers, admin role blockers, destructive/live actions,
  target build-info drift after future deploys.

### 4. Execute Implementation
- Implementation notes: created this audit plan.

### 5. Verify and Test
- Validation performed: repository guardrails, docs parity, and diff
  whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: immediately click public routes only.
- Technical debt introduced: no
- Scalability assessment: the plan can be reused for later full-production UI
  audits.
- Refinements made: separated public, dashboard, admin, legacy redirect, module
  action, responsive, and a11y passes.

### 7. Update Documentation and Knowledge
- Docs updated: this planning artifact and active queue/context state.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to task risk.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Result Report
- Task summary: planned the production UI clickthrough audit for all
  user-visible module functions.
- Files changed: this planning document plus queue/context state.
- How tested: repository guardrails, docs parity, and diff check passed.
- What is incomplete: actual production clickthrough requires
  authenticated/admin app access.
- Next steps: after authenticated/admin app access is available, execute this
  audit against current production build-info and produce the evidence pack.
- Decisions made: protected flows cannot pass from public-only checks; live and
  destructive actions require explicit approval.
