# Task

## Header
- ID: SYSFINAL-01
- Title: Build current route API function inventory
- Task Type: qa
- Current Stage: analysis
- Status: DONE
- Owner: QA/Test
- Depends on: SYSFINAL-00
- Priority: P0
- Iteration: 2
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`SYSFINAL-00` synchronized active planning truth and made
`SYSFINAL-01` the next executable slice. Before running repository, browser,
API, security, runtime, trading, configuration, and UX audits, the current V1
surface needs one route/API/function inventory so later checks test real
current behavior rather than historical or deferred scope.

## Goal
Freeze the current user-facing route and API matrix for V1 final system
functionality audit execution.

## Success Signal
- User or operator problem: the operator asked to execute all planned tasks,
  but the next safe step needs a precise current function inventory.
- Expected product or reliability outcome: every audit task can target known
  route, API, data, state, auth, and validation contracts.
- How success will be observed: `SYSFINAL-02..07` can use this artifact as
  the route/API checklist and avoid treating deferred V2 or legacy redirects
  as current functional blockers.
- Post-launch learning needed: no.

## Deliverable For This Stage
This planning artifact: a repository-grounded current function inventory and
route/API matrix for the next audit tasks.

## Scope
- Web route inventory from `apps/web/src/app`.
- API route inventory from `apps/api/src/router` and `apps/api/src/modules`.
- Current canonical maps:
  - `docs/architecture/reference/dashboard-route-map.md`
  - `docs/architecture/codebase-map.md`
  - `docs/architecture/traceability-matrix.md`
- Queue/context synchronization:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/plans/system-functionality-final-remediation-master-plan-2026-05-03.md`

## Implementation Plan
1. Read canonical planning/context and architecture maps.
2. Inventory current web route files and current API route files.
3. Map each current function to web route, API contract, backend owner, data
   source, UI state coverage, auth boundary, and validation method.
4. Mark redirects, public routes, ops/admin routes, and V2/deferred exclusions.
5. Synchronize task board and planning files after the artifact is complete.
6. Run docs-focused repository guardrails.

## Acceptance Criteria
- Every current web route family is represented by a user-facing function row.
- Every current dashboard/admin/API family has an explicit auth boundary.
- Each row names backend owner, data source, expected UI states, and validation
  method for later audits.
- Legacy redirects and deferred V2 surfaces are explicitly excluded from V1
  blocker scope.
- Source-of-truth queue files mark `SYSFINAL-01` done and advance to
  `SYSFINAL-02`.

## Constraints
- Use existing route maps and module docs as the source of truth.
- Do not create a new architecture contract.
- Do not implement product fixes during this analysis stage.
- Do not promote historical, legacy, or V2 deferred functionality into current
  V1 scope.

## Definition of Done
- [x] Current function inventory is documented in this task artifact.
- [x] Route/API/auth/data/validation matrix is present.
- [x] Deferred and redirect-only surfaces are classified.
- [x] Context and planning files are synchronized.
- [x] Repository guardrails pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated route/API contracts that conflict with existing architecture docs.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping into browser smoke or remediation fixes.

## Current Web Route Inventory
Source: `apps/web/src/app` page and route files.

| Area | Current routes | V1 classification |
|---|---|---|
| Public/access | `/`, `/auth/login`, `/auth/register`, `/offline`, `/api/build-info` | Current public/access surface. |
| Dashboard home | `/dashboard` | Current authenticated operator surface. |
| Profile/exchanges | `/dashboard/profile`, `/dashboard/exchanges` | Profile is current; exchanges route redirects to profile API-key surface. |
| Wallets | `/dashboard/wallets`, `/dashboard/wallets/list`, `/dashboard/wallets/create`, `/dashboard/wallets/:id`, `/dashboard/wallets/:id/edit`, `/dashboard/wallets/:id/preview` | Current, with list/edit redirects preserved. |
| Markets | `/dashboard/markets/list`, `/dashboard/markets/create`, `/dashboard/markets/:id/edit` | Current. |
| Strategies | `/dashboard/strategies/list`, `/dashboard/strategies/create`, `/dashboard/strategies/:id`, `/dashboard/strategies/:id/edit` | Current, with detail redirect to edit. |
| Bots | `/dashboard/bots`, `/dashboard/bots/create`, `/dashboard/bots/new`, `/dashboard/bots/runtime`, `/dashboard/bots/assistant`, `/dashboard/bots/:id`, `/dashboard/bots/:id/edit`, `/dashboard/bots/:id/preview`, `/dashboard/bots/:id/runtime`, `/dashboard/bots/:id/assistant` | Current single-bot V1 surfaces plus assistant config surface; `new`, detail, and `:id/runtime` are redirect/compat routes. |
| Backtests | `/dashboard/backtests/list`, `/dashboard/backtests/create`, `/dashboard/backtests/:id` | Current. |
| Reports/logs | `/dashboard/reports`, `/dashboard/logs` | Current read-only operator surfaces. |
| Admin | `/admin`, `/admin/users`, `/admin/subscriptions` | Current admin-only surfaces. |

## Current API Family Inventory
Source: `apps/api/src/router/index.ts`, `dashboard.routes.ts`,
`admin.routes.ts`, and module `*.routes.ts` files.

| API family | Mounted routes | Auth boundary | Backend owner |
|---|---|---|---|
| Public API health | `/`, `/health`, `/ready` | Public health/readiness; readiness can fail closed on dependencies. | `api/router`, config readiness services. |
| Ops API | `/ready/details`, `/metrics`, `/alerts`, `/workers/health`, `/workers/ready`, `/workers/runtime-freshness` | `requireAuth + requireRole('ADMIN') + requireOpsNetwork`. | `api/router`, observability, worker ownership. |
| Auth | `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout` | Public login/register with limiters; current user/logout require valid session semantics. | `api/auth`. |
| Upload | `/upload/avatar` | `requireAuth` plus upload limiter and MIME/size validation. | `api/upload`. |
| Dashboard shell | `/dashboard` | `requireAuth`. | `api/router/dashboard`. |
| Profile/basic | `/dashboard/profile/basic` | `requireAuth`. | `api/profile`. |
| Profile/security | `/dashboard/profile/security/password`, `/dashboard/profile/security/account` | `requireAuth`, password/account limiters. | `api/profile`. |
| Profile API keys | `/dashboard/profile/apiKeys`, `/dashboard/profile/apiKeys/test`, `/dashboard/profile/apiKeys/:id/test`, `/dashboard/profile/apiKeys/:id`, `/dashboard/profile/apiKeys/:id/rotate`, `/dashboard/profile/apiKeys/:id/revoke` | `requireAuth`, API-key test limiter, secret masking/encryption contract. | `api/profile`, `api/exchange`. |
| Profile subscription | `/dashboard/profile/subscription`, `/dashboard/profile/subscription/checkout-intents` | `requireAuth`. | `api/profile`, `api/subscriptions`. |
| Wallets | `/dashboard/wallets`, `/dashboard/wallets/metadata`, `/dashboard/wallets/preview-balance`, `/dashboard/wallets/:id`, `/dashboard/wallets/:id/performance-summary`, `/dashboard/wallets/:id/equity-timeline`, `/dashboard/wallets/:id/cashflow-events`, `/dashboard/wallets/:id/reset-paper` | `requireAuth`, wallet read/write/preview limiters. | `api/wallets`, `api/exchange`. |
| Markets | `/dashboard/markets/universes`, `/dashboard/markets/universes/:id`, `/dashboard/markets/catalog` | `requireAuth`, market read/write limiters. | `api/markets`, exchange catalog boundary. |
| Strategies | `/dashboard/strategies`, `/dashboard/strategies/import`, `/dashboard/strategies/:id`, `/dashboard/strategies/:id/export`, `/dashboard/strategies/indicators` | `requireAuth`, trading read/write and market limiters. | `api/strategies`, indicator registry. |
| Bots | `/dashboard/bots`, `/dashboard/bots/:id`, `/dashboard/bots/strategy-drift`, `/dashboard/bots/strategy-drift/repair` | `requireAuth`, trading read/write limiters. | `api/bots`, `api/engine`. |
| Bot runtime reads/actions | `/dashboard/bots/:id/runtime-graph`, `/dashboard/bots/:id/portfolio-history`, `/dashboard/bots/:id/runtime-monitoring/aggregate`, `/dashboard/bots/:id/runtime-sessions`, `/dashboard/bots/:id/runtime-sessions/:sessionId`, `/dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats`, `/dashboard/bots/:id/runtime-sessions/:sessionId/positions`, `/dashboard/bots/:id/runtime-sessions/:sessionId/trades`, runtime position close action | `requireAuth`, trading limiters, ownership checks. | `api/bots`, `api/engine`, runtime read models. |
| Bot market groups and strategies | `/dashboard/bots/:id/market-groups`, `/dashboard/bots/:id/market-groups/:groupId`, `/dashboard/bots/:id/market-groups/:groupId/strategies`, reorder/update/delete strategy links | `requireAuth`, trading limiters, ownership checks. | `api/bots`. |
| Assistant config | `/dashboard/bots/:id/assistant-config`, subagent slot routes, `/dashboard/bots/:id/assistant-config/dry-run` | `requireAuth`, trading limiters, ownership checks. | `api/bots`, assistant orchestrator. |
| Orders | `/dashboard/orders`, `/dashboard/orders/manual-context`, `/dashboard/orders/:id`, `/dashboard/orders/open`, `/dashboard/orders/:id/cancel`, `/dashboard/orders/:id/close` | `requireAuth`, trading limiters, risk/consent guardrails. | `api/orders`, `api/engine`, `api/exchange`. |
| Positions | `/dashboard/positions`, `/dashboard/positions/:id`, `/dashboard/positions/live-status`, `/dashboard/positions/exchange-snapshot`, `/dashboard/positions/takeover-status`, `/dashboard/positions/takeover-rebind`, `/dashboard/positions/orphan-repair`, management update routes | `requireAuth`, trading read limiter in current route file, ownership and fail-closed repair rules. | `api/positions`, `api/exchange`, `api/engine`. |
| Backtests | `/dashboard/backtests/runs`, `/dashboard/backtests/runs/:id`, `/dashboard/backtests/runs/:id/trades`, `/dashboard/backtests/runs/:id/report`, `/dashboard/backtests/runs/:id/timeline` | `requireAuth`, trading read/write limiters, ownership checks. | `api/backtests`, backtest worker, engine kernel. |
| Reports | `/dashboard/reports/cross-mode-performance` | `requireAuth`, trading read limiter. | `api/reports`, `api/backtests`. |
| Logs | `/dashboard/logs` | `requireAuth`, logs read limiter, user-scoped audit reads. | `api/logs`. |
| Market stream | `/dashboard/market-stream/events` | `requireAuth` via dashboard mount; SSE stream. | `api/market-stream`, Redis fanout, market stream worker. |
| Icons | `/dashboard/icons/lookup` | `requireAuth` via dashboard mount; lookup limiter. | `api/icons`. |
| Admin subscription plans | `/admin/subscriptions/plans`, `/admin/subscriptions/plans/:code` | `requireAuth + requireRole('ADMIN')`. | `api/admin`. |
| Admin users | `/admin/users`, `/admin/users/:userId` | `requireAuth + requireRole('ADMIN')`. | `api/admin`. |

## Current Function Matrix For Audit Execution
Use this table as the checklist for `SYSFINAL-02..07`.

| Function | Web entry | Primary API contract | Data source | Required UI states | Auth boundary | Validation method |
|---|---|---|---|---|---|---|
| Public landing and offline access | `/`, `/offline` | none, optional client build info | Static app shell | success, offline/degraded | Public | route render smoke, web build. |
| Authentication and session | `/auth/login`, `/auth/register` | `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout` | `User`, session cookie/JWT | loading, error, success, redirect | Public entry; authenticated session for `/me` and logout | auth e2e, route redirect smoke, invalid/deleted-session checks. |
| Dashboard overview/runtime summary | `/dashboard` | `/dashboard/bots*`, `/dashboard/market-stream/events`, `/dashboard/icons/lookup` | `Bot`, runtime sessions/events/stats, positions/trades, Redis stream | loading, empty, error, success, stale/degraded | `requireAuth` | dashboard component tests, authenticated browser smoke, SSE real-event smoke. |
| Profile basics and avatar | `/dashboard/profile` | `/dashboard/profile/basic`, `/upload/avatar` | `User`, avatar upload storage | loading, empty, error, success | `requireAuth` | profile e2e, upload e2e, UI smoke. |
| API-key and exchange connection setup | `/dashboard/profile`, `/dashboard/exchanges` redirect | `/dashboard/profile/apiKeys*` | `ApiKey`, exchange API-key probe | loading, empty, error, success, masked-secret | `requireAuth`, rate limits | API-key e2e, secret masking/encryption checks, exchange-probe tests. |
| Subscription profile | `/dashboard/profile` | `/dashboard/profile/subscription`, checkout intents | `UserSubscription`, `SubscriptionPlan`, payment intent | loading, empty, error, success | `requireAuth` | subscription route tests, entitlement checks around LIVE writes. |
| Wallet setup and ledger | `/dashboard/wallets*` | `/dashboard/wallets*`, metadata, preview balance, performance/equity/cashflow/reset | `Wallet`, `WalletBalanceSnapshot`, `WalletCashflowEvent`, `ApiKey` | loading, empty, error, success, destructive confirm | `requireAuth`, ownership checks | wallets e2e, balance preview tests, paper reset tests, browser form smoke. |
| Market universe setup | `/dashboard/markets*` | `/dashboard/markets/universes*`, `/dashboard/markets/catalog` | `MarketUniverse`, `SymbolGroup`, exchange catalog | loading, empty, error, success, active-bot locked edit | `requireAuth`, ownership checks | markets e2e, route UI smoke, active-bot delete/edit guard checks. |
| Strategy builder | `/dashboard/strategies*` | `/dashboard/strategies*`, `/dashboard/strategies/indicators` | `Strategy`, indicator registry, strategy links | loading, empty, validation error, success, active-bot lock | `requireAuth`, ownership checks | strategies e2e, indicator registry parity tests, route form tests. |
| Bot create/edit/list | `/dashboard/bots`, `/dashboard/bots/create`, `/dashboard/bots/:id/edit` | `/dashboard/bots*`, market-group and strategy-link endpoints | `Bot`, `Wallet`, `BotMarketGroup`, `MarketGroupStrategyLink`, `Strategy` | loading, empty, validation error, success, LIVE consent/blocked | `requireAuth`, ownership and LIVE entitlement/consent checks | bots e2e, subscription entitlement tests, browser setup smoke. |
| Bot runtime monitoring | `/dashboard/bots/runtime`, `/dashboard/bots/:id/preview` | runtime sessions, symbol stats, positions, trades, aggregate, portfolio history | `BotRuntimeSession`, `BotRuntimeEvent`, `BotRuntimeSymbolStat`, `Position`, `Trade`, `Signal` | loading, empty, error, success, stale/degraded, guardrail-blocked | `requireAuth`, ownership checks | runtime read-model tests, bots monitoring tests, authenticated browser smoke. |
| Manual order execution | Dashboard manual-order panel and bot runtime views | `/dashboard/orders/manual-context`, `/dashboard/orders/open`, cancel/close order routes | `Order`, `OrderFill`, `Position`, `Trade`, `Wallet`, `Bot` | loading, validation error, blocked, success | `requireAuth`, risk ack, ownership, LIVE consent/entitlement | orders e2e, manual-order context tests, PAPER smoke; LIVE read-only unless approved. |
| Position ownership and management | Bot runtime positions and legacy positions redirect surface | `/dashboard/positions*`, takeover/rebind/orphan repair, management updates | `Position`, `Trade`, `Order`, `Bot`, `Wallet`, `ApiKey` | loading, empty, error, success, non-actionable/degraded | `requireAuth`, ownership, fail-closed repair | positions e2e, takeover/orphan repair tests, read-only LIVE ownership smoke. |
| Market stream | Dashboard runtime cards and live price hooks | `/dashboard/market-stream/events` | Redis fanout, market stream worker, exchange websocket | connected, ping/heartbeat, event, degraded/error | `requireAuth` via dashboard mount | SSE smoke requiring real ticker/candle event, readiness tests. |
| Backtest create/list/detail | `/dashboard/backtests*` | `/dashboard/backtests/runs*`, trades/report/timeline | `BacktestRun`, `BacktestTrade`, `BacktestReport`, candle cache, backtest worker | loading, empty, error, pending/degraded report, success | `requireAuth`, ownership checks | backtests e2e, backtest worker/gateway tests, SPOT/FUTURES smoke. |
| Reports | `/dashboard/reports` | `/dashboard/reports/cross-mode-performance`, backtest reads | backtest and runtime lifecycle data | loading, empty, error, success | `requireAuth` | reports tests, route smoke. |
| Logs/audit trail | `/dashboard/logs` | `/dashboard/logs` | `Log` | loading, empty, error, success, filtered | `requireAuth`, user-scoped reads | logs e2e, filter/ownership smoke. |
| Admin subscriptions | `/admin/subscriptions` | `/admin/subscriptions/plans*` | `SubscriptionPlan` | loading, empty, error, success | `requireAuth + ADMIN` | admin subscription e2e, non-admin denial. |
| Admin users | `/admin/users` | `/admin/users*` | `User`, `UserSubscription` | loading, empty, error, success, self-demotion blocked | `requireAuth + ADMIN` | admin users e2e, role denial and self-demotion tests. |
| Ops health/readiness/metrics | no normal dashboard page; operator scripts/probes | `/health`, `/ready`, `/ready/details`, `/metrics`, `/alerts`, `/workers/*` | readiness config, Redis dependency, metrics store, worker topology | ready, not_ready, degraded | public health/ready; details and metrics require admin ops access | health/readiness tests, ops smoke, production API freshness checks. |
| Assistant config and dry-run | `/dashboard/bots/assistant`, `/dashboard/bots/:id/assistant` | `/dashboard/bots/:id/assistant-config*` | `BotAssistantConfig`, `BotSubagentConfig`, runtime assistant trace | loading, empty, validation error, success, degraded dry-run | `requireAuth`, ownership checks | assistant e2e/orchestrator tests; not part of BOTMULTI V2 expansion. |

## Redirect And Compatibility Surfaces
These routes must be checked for redirect behavior, but they are not separate
current V1 product functions:

| Route | Current target |
|---|---|
| `/dashboard/orders` | `/dashboard/bots/runtime?legacy=orders` |
| `/dashboard/positions` | `/dashboard/bots/runtime?legacy=positions` |
| `/dashboard/exchanges` | `/dashboard/profile#api` |
| `/dashboard/bots/new` | `/dashboard/bots/create` |
| `/dashboard/bots/:id` | `/dashboard/bots/:id/preview` |
| `/dashboard/bots/:id/runtime` | `/dashboard/bots/:id/preview` |
| `/dashboard/strategies/:id` | `/dashboard/strategies/:id/edit` |
| `/dashboard/wallets` | `/dashboard/wallets/list` |
| `/dashboard/wallets/:id` | `/dashboard/wallets/:id/edit` |
| `/admin` | `/admin/subscriptions` |

## Explicit V2 Or Deferred Exclusions
- Stage environment is deferred to V2 by operator decision; production-only V1
  evidence remains the current release path.
- `BOTMULTI-*` and broad multi-agent bot expansion remain deferred until the
  current single-bot V1 production system is fully re-audited.
- Mobile app traceability is acknowledged as `UNVERIFIED / NEEDS CONFIRMATION`
  in the codebase map and is not part of the current V1 web/API audit.
- Standalone `/dashboard/exchanges` write behavior is not a separate current
  contract; profile API-key management remains canonical.
- Legacy `/dashboard/orders` and `/dashboard/positions` are redirect surfaces,
  not active top-level IA destinations.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` PASS.
- Manual checks:
  - Read canonical context, task board, MVP queue, execution plan, master plan,
    route map, codebase map, and traceability matrix.
  - Enumerated current web page/route files with PowerShell because `rg.exe`
    returned `Odmowa dostepu` in this shell.
  - Enumerated API route declarations from current `*.routes.ts` files and
    router mounts.
- Screenshots/logs: not applicable for analysis-stage docs.
- High-risk checks:
  - LIVE production mutations are excluded from this inventory task.
  - Later LIVE audits must remain read-only unless the operator explicitly
    approves a mutation.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/dashboard-route-map.md`
  - `docs/architecture/codebase-map.md`
  - `docs/architecture/traceability-matrix.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/modules/system-modules.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: approved_snapshot.
- Design source reference: current production dashboard plus canonical route
  and UX docs.
- Canonical visual target: current dashboard design system.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: not applicable for this analysis artifact;
  required in `SYSFINAL-07`.
- Visual-direction brief reviewed: not applicable for this analysis artifact.
- Existing shared pattern reused: existing route/module docs.
- New shared pattern introduced: no.
- Design-memory entry reused: no new UI pattern.
- Design-memory update required: no.
- Visual gap audit completed: no, planned in `SYSFINAL-07`.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: no, planned only if UI findings appear.
- Remaining mismatches: unknown until browser audits.
- Required states: loading, empty, error, success.
- Responsive checks: desktop, tablet, mobile in `SYSFINAL-07`.
- Input-mode checks: touch, pointer, keyboard in `SYSFINAL-07`.
- Accessibility checks: route/action keyboard and accessible-name checks in
  `SYSFINAL-07`.
- Parity evidence: to be produced during execution audits.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no; this artifact identifies smoke targets for
  `SYSFINAL-09`.
- Rollback note: docs-only analysis can be reverted by reverting this artifact
  and queue sync.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable; stage remains V2.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: final audits needed an explicit current route/API/function map.
- Gaps: endpoint-level route inventory is still manual; generated route parity
  remains a future traceability gap already named in the traceability matrix.
- Inconsistencies: no new route mismatch found in this slice.
- Architecture constraints: route map remains canonical; dashboard/admin
  routes require middleware/API auth; current V1 excludes stage and BOTMULTI.

### 2. Select One Priority Task
- Selected task: `SYSFINAL-01`.
- Priority rationale: it is the only open NOW task and it unblocks every later
  audit.
- Why other candidates were deferred: `SYSFINAL-02..09` depend on this
  inventory so they can target known current contracts.

### 3. Plan Implementation
- Files or surfaces to modify: this planning artifact plus queue/context docs.
- Logic: derive current function rows from route files and canonical maps, then
  classify redirects and deferred scope.
- Edge cases: compatibility routes, assistant config current surface versus
  deferred BOTMULTI expansion, ops/admin auth boundaries, LIVE mutation safety.

### 4. Execute Implementation
- Implementation notes: created the inventory matrix and synchronized
  source-of-truth task status.

### 5. Verify and Test
- Validation performed: repository guardrails and manual route/API inventory.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: rely only on the existing dashboard route map.
- Technical debt introduced: no.
- Scalability assessment: adequate for current audit execution; generated
  endpoint parity can be added later as a separate traceability hardening task.
- Refinements made: redirect and V2/deferred surfaces are separate from
  current function rows.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact, MVP queue, execution plan, master plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- `rg.exe` was unavailable in this shell with access denied, so route and API
  inventory used PowerShell enumeration.
- No product code changed.

## Production-Grade Required Contract

### Goal
Build the current route/API/function inventory for final audit execution.

### Scope
Planning/context docs and current route/API inventory only.

### Implementation Plan
Read route/API sources, build matrix, classify exclusions, sync queue/context,
run guardrails.

### Acceptance Criteria
Satisfied by the matrix, exclusions, context sync, and guardrail evidence above.

### Definition Of Done
`DEFINITION_OF_DONE.md` expectations are represented for this docs-only stage:
defined goal, scope, validation, review, result report, and no temporary
solutions.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: represented by route/API mapping.
- Real API/service path used: route files were read; no runtime calls were made.
- Endpoint and client contract match: mapped for later audit; not browser-smoked
  in this stage.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable in this stage.
- Error state verified: not applicable in this stage.
- Refresh/restart behavior verified: not applicable in this stage.
- Regression check performed: guardrails.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: Patryk/operator.
- Existing workaround or pain: planned work needed one current surface map.
- Smallest useful slice: one inventory artifact.
- Success metric or signal: later audits have a complete checklist.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable to docs-only inventory.
- Critical user journey: authenticated dashboard to runtime/trading truth.
- SLI: not changed.
- SLO: not changed.
- Error budget posture: not applicable.
- Health/readiness check: mapped for later audits.
- Logs, dashboard, or alert route: mapped for later audits.
- Smoke command or manual smoke: planned in later tasks.
- Rollback or disable path: revert docs-only changes.

## AI Testing Evidence
Not applicable. This task did not change AI behavior.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable to
  docs-only inventory; security audit is `SYSFINAL-03`.
- Data classification: user profile, API keys, wallets, strategies, bots,
  orders, positions, logs, admin data.
- Trust boundaries: browser, API, DB, Redis, exchange adapters, ops network.
- Permission or ownership checks: mapped per API family.
- Abuse cases: deferred to `SYSFINAL-03`.
- Secret handling: API-key surfaces mapped for `SYSFINAL-03`.
- Security tests or scans: planned in `SYSFINAL-03`.
- Fail-closed behavior: mapped for LIVE, Redis readiness, exchange failures,
  and repair workflows.
- Residual risk: audit evidence still pending in `SYSFINAL-02..07`.

## Result Report
- Task summary: built the current V1 route/API/function inventory and marked
  redirect/deferred surfaces so later audits can execute against the right
  contracts.
- Files changed: this artifact plus queue/context docs.
- How tested: `pnpm run quality:guardrails` PASS.
- What is incomplete: repository baseline gates and product/runtime/browser
  audits remain queued as `SYSFINAL-02..07`.
- Next steps: run `SYSFINAL-02` repository baseline gates and classify any
  failures before browser or API product audits.
- Decisions made: no new architecture decisions; stage and BOTMULTI remain
  deferred as already documented.
