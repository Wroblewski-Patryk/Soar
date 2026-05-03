# Task

## Header
- ID: SYSFINAL-2026-05-03
- Title: Final system functionality audit and remediation master plan
- Task Type: planning
- Current Stage: planning
- Status: READY
- Owner: Planning Agent
- Depends on: RUNTIME-SIGNAL-VOTES-01 production smoke closure, current V1 prod-only release scope
- Priority: P0
- Iteration: 2026-05-03 final system-function confidence pass
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected for the current planning slice.
- [x] Operation mode matches the architecture/planning nature of this iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The repository has a production-only V1 release path and a large amount of
closed hardening work across runtime signals, dashboard truth, LIVE imported
position ownership, DCA-first protection, exchange-boundary ownership,
operator surfaces, dependency hardening, and release evidence.

The newest source-of-truth review found three kinds of remaining work:

1. Fresh runtime signal work is implemented and production-smoked, but some
   queue/checklist artifacts still show `RUNTIME-SIGNAL-VOTES-01` as waiting
   for production smoke.
2. Several historical planning files still contain unchecked acceptance or
   template boxes. Most are not active execution work, but the active queue
   must be synchronized before saying the system is fully planned or fully
   closed.
3. Post-V1 `BOTMULTI-*` remains a deferred pipeline wave, not a V1 blocker.
   It must not be mixed into the final V1 functionality remediation loop until
   the current single-bot production system is proven stable.

This master plan consolidates all currently relevant planned work into one
execution sequence for verifying and fixing every user-facing system function
without creating parallel plans or workaround paths.

## Goal
Produce one canonical execution plan that can be followed to prove the current
V1 system works correctly across UI, API, runtime, exchange boundaries,
persistence, security, operations, and production smoke, then queue only the
fixes that are actually supported by audit evidence.

## Success Signal
- User or operator problem: planned work is fragmented across many historical
  files, and the operator wants one clear route to final confidence.
- Expected product or reliability outcome: every current V1 user function has
  audit evidence, any discrepancy becomes a small implementation task, and
  stale planning state no longer hides real priorities.
- How success will be observed: one ordered queue drives sync, audit, fixes,
  validation, production smoke, and closure; no active task remains ambiguous.
- Post-launch learning needed: yes, only when a recurring pitfall is confirmed.

## Deliverable For This Stage
This planning artifact: one ordered, implementation-ready plan with task
boundaries, acceptance criteria, validation gates, and explicit deferrals.

## Scope
- Planning/context truth:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/LEARNING_JOURNAL.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - current task plans under `docs/planning/`
- Product/user journeys:
  - auth/session
  - dashboard home
  - bots list/detail/monitoring/runtime
  - manual orders
  - positions/orders/history
  - wallets/API keys/exchange connection test
  - markets/symbol groups
  - strategies
  - backtests/reports
  - logs/audit trail
  - language/routing/responsive state
- Runtime/system layers:
  - runtime signal ingestion and final-candle decisions
  - pre-trade and guardrail blocking
  - paper order/position lifecycle
  - LIVE imported position ownership
  - LIVE DCA/TTP/TSL/SL protection
  - exchange adapter boundaries
  - Redis market-stream fanout and readiness
  - database persistence and migrations
  - production deploy/smoke evidence

## Implementation Plan
Execute these tasks in order. Each implementation task must be a tiny,
single-purpose commit with its own focused validation and source-of-truth sync.

### SYSFINAL-00 - Synchronize Active Planning Truth
- Status: DONE 2026-05-03.
- Evidence: `docs/planning/sysfinal-00-planning-truth-sync-task-2026-05-03.md`.
- Stage: implementation.
- Priority: P0.
- Goal: remove false active/open signals before running more audits.
- Actions:
  - Mark `RUNTIME-SIGNAL-VOTES-01` closed in `mvp-next-commits`,
    `TASK_BOARD`, `PROJECT_STATE`, and its task plan if production smoke
    evidence is already present.
  - Reconcile duplicate/stale `V1BOT-SIGNALS-02`, `V1FINAL-01`, and
    `V1EXCEL-*` open-looking entries against current V1 production-only `GO`
    evidence.
  - Keep stage work explicitly deferred to V2, per operator decision.
  - Keep `BOTMULTI-*` in deferred pipeline, not V1 final remediation.
- Acceptance criteria:
  - active NOW queue contains only genuinely executable current work;
  - historical unchecked boxes are either classified as superseded/deferred or
    left inside historical files with no active-queue authority;
  - `quality:guardrails` passes.

### SYSFINAL-01 - Build Current Function Inventory And Route/API Matrix
- Status: DONE 2026-05-03.
- Evidence:
  `docs/planning/sysfinal-01-current-function-inventory-task-2026-05-03.md`.
- Stage: analysis.
- Priority: P0.
- Goal: freeze the exact current user-facing surface before testing.
- Actions:
  - Derive route inventory from web app routes and canonical dashboard route
    map.
  - Derive API inventory from controllers/routes and module docs.
  - Map every route to required API calls, auth state, loading/empty/error/
    success states, and data ownership.
  - Mark unsupported or V2-only surfaces explicitly.
- Acceptance criteria:
  - one matrix lists every current function, owner module, backing API, data
    source, and validation method;
  - no route is tested without knowing its backend contract;
  - no historical or deferred function is accidentally treated as V1 current.

### SYSFINAL-02 - Run Repository Baseline Gates
- Status: DONE 2026-05-03.
- Evidence:
  `docs/planning/sysfinal-02-repository-baseline-gates-task-2026-05-03.md`.
- Stage: verification.
- Priority: P0.
- Goal: prove the codebase is locally coherent before browser/product smoke.
- Actions:
  - Run repository guardrails.
  - Run docs parity if planning/architecture docs changed.
  - Run lint.
  - Run API and web typechecks.
  - Run full API and web tests, using known environment guardrails from the
    learning journal.
  - Run build.
- Acceptance criteria:
  - green baseline, or every failure is classified as product bug, test
    harness issue, local infra issue, or external dependency issue;
  - no implementation fix starts before classification;
  - any confirmed product failure becomes a dedicated `SYSFIX-*` task.

### SYSFINAL-03 - Audit Auth, Session, Security, And Permissions
- Status: DONE 2026-05-03.
- Evidence:
  `docs/planning/sysfinal-03-auth-session-security-audit-task-2026-05-03.md`.
- Stage: verification.
- Priority: P0.
- Goal: prove private app access, ownership isolation, and failure behavior.
- Actions:
  - Test login/logout, failed login, expired/invalid session, protected route
    redirect, and cross-user ownership denial.
  - Verify API-key masking/encryption behavior and connection-test error
    states.
  - Verify LIVE write entitlement and consent gates remain fail-closed.
  - Run security-relevant focused tests and `pnpm audit` if dependencies
    changed.
- Acceptance criteria:
  - no unauthorized data access;
  - no secret leakage in API or UI;
  - LIVE trading writes remain gated by subscription/consent/API-key context.

### SYSFINAL-04 - Audit Dashboard And Bot Runtime Truth End-To-End
- Status: DONE 2026-05-03.
- Evidence:
  `docs/planning/sysfinal-04-dashboard-bot-runtime-truth-audit-task-2026-05-03.md`.
- Stage: verification.
- Priority: P0.
- Goal: prove the dashboard displays the same truth the runtime executes.
- Actions:
  - Verify Dashboard Home and Bot Monitoring against the same selected bot,
    symbols, sessions, runtime stats, open positions, history, and signal
    cards.
  - Confirm indicator values never render misleading raw `n/a` math.
  - Confirm matched conditions either produce accepted runtime signal context
    or show a concrete guardrail block reason.
  - Confirm Redis market-stream SSE emits real candle/ticker events and API
    `/ready` fails closed if required Redis is unavailable.
  - Verify PAPER and read-only LIVE runtime rows separately.
- Acceptance criteria:
  - no `matched=true` plus unexplained `No votes` contradiction;
  - no `configured_fallback` is used when a current runtime block exists;
  - live prices/PnL/protection displays refresh honestly and reset on context
    changes.

### SYSFINAL-05 - Audit Trading Workflows
- Status: DONE 2026-05-03.
- Evidence:
  `docs/planning/sysfinal-05-order-position-workflows-audit-task-2026-05-03.md`.
- Stage: verification.
- Priority: P0.
- Goal: prove order and position workflows are safe and explainable.
- Actions:
  - PAPER manual market order open/fill/position visibility.
  - PAPER runtime signal path through pre-trade, order, position, history.
  - Manual close, bot close, cancel order, and history attribution.
  - LIVE read-only imported-position ownership and protection state.
  - Guardrail explanations for max positions, existing symbol position,
    external/manual-managed position, funds, and minimum order constraints.
- Acceptance criteria:
  - no silent no-op on trading actions;
  - every blocked action has a visible and persisted reason;
  - no LIVE mutation is performed during audit unless explicitly approved.

### SYSFINAL-06 - Audit Configuration Workflows
- Status: DONE 2026-05-03.
- Evidence:
  `docs/planning/sysfinal-06-configuration-workflows-audit-task-2026-05-03.md`.
- Stage: verification.
- Priority: P0.
- Goal: prove setup/config modules feed runtime correctly.
- Actions:
  - Wallet create/edit, API-key attach/test, LIVE/PAPER mode constraints.
  - Market universe and symbol-group create/edit/delete guards.
  - Strategy create/edit, indicator metadata, condition thresholds, DCA,
    TTP/TSL/SL, and validation errors.
  - Bot create/edit/start/stop with wallet-first context, active market groups,
    strategy link, runtime scope, and import ownership.
- Acceptance criteria:
  - no stale legacy bot fields override canonical wallet/market/strategy
    truth;
  - bot runtime scope matches active canonical market groups only;
  - invalid configuration fails before runtime starts.

### SYSFINAL-07 - Audit Backtests, Reports, Logs, And I18n/UX States
- Status: DONE 2026-05-03.
- Evidence:
  `docs/planning/sysfinal-07-backtests-reports-logs-i18n-ux-audit-task-2026-05-03.md`.
- Stage: verification.
- Priority: P1.
- Goal: prove non-runtime product functions are still coherent.
- Actions:
  - Backtest create/list/detail for SPOT and FUTURES, including futures candle
    fallback.
  - Reports and parity diagnostics states.
  - Logs/audit filtering and empty/error states.
  - EN/PL/PT/DE-CH route-reachable copy where supported.
  - Responsive desktop/tablet/mobile dashboard checks for key workflows.
- Acceptance criteria:
  - backtests do not silently run with empty candle data;
  - all route-reachable copy is localized or intentionally deferred;
  - no critical layout overlap on dashboard operational surfaces.

### SYSFINAL-08 - Convert Findings Into Tiny Fix Tasks
- Status: DONE 2026-05-03.
- Evidence:
  `docs/planning/sysfinal-08-empty-sysfix-queue-task-2026-05-03.md`.
- Stage: planning.
- Priority: P0/P1 based on finding severity.
- Goal: prevent broad “fix everything” implementation drift.
- Actions:
  - For each confirmed bug, create one `SYSFIX-*` task using the repository
    task template.
  - Include exact reproduction, expected behavior, affected files, validation,
    deployment impact, rollback path, and acceptance criteria.
  - Prioritize money-impacting/runtime/auth failures first.
  - Do not fix V2/deferred features unless they block current V1 behavior.
- Acceptance criteria:
  - every fix task has evidence, scope lock, and validation plan;
  - no speculative cleanup enters the implementation queue;
  - no task mixes UI, API, DB, and runtime changes unless required for one
    vertical slice.

### SYSFINAL-09 - Execute Fixes, Full Regression, Production Smoke, Closure
- Status: DONE 2026-05-03.
- Evidence:
  `docs/planning/sysfinal-09-final-regression-production-smoke-closure-task-2026-05-03.md`.
- Stage: implementation -> verification -> release -> post-release.
- Priority: P0.
- Goal: close the system-confidence loop after fixes.
- Actions:
  - Implement each `SYSFIX-*` task in order.
  - Run focused tests per task, then broader baseline after the fix wave.
  - Deploy production-impacting changes through Coolify.
  - Verify API freshness directly, not only web build-info.
  - Run production smoke for health, readiness, auth, dashboard, runtime
    signals, market-stream SSE, and affected workflows.
  - Publish final closure evidence and update context.
- Acceptance criteria:
  - all P0 findings are fixed or explicitly blocked by external dependency;
  - production smoke proves the affected functions work;
  - task board and planning docs have no false active entries;
  - final result report names residual risks and next deferred V2 work.

## Acceptance Criteria
- One current master plan exists and is linked by context docs.
- Active queues distinguish current V1 work from historical/superseded/deferred
  work.
- Every current user-facing function is covered by either automated validation,
  browser/API smoke, or explicit deferral.
- Every confirmed discrepancy becomes a scoped implementation task before code
  changes begin.
- Money-impacting and LIVE flows are tested fail-closed and without
  unauthorized production mutation.
- Production closure includes API freshness, `/health`, `/ready`, auth, and
  affected workflow evidence.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are represented in the plan.
- [x] `INTEGRATION_CHECKLIST.md` expectations are represented in the plan.
- [x] `NO_TEMPORARY_SOLUTIONS.md` constraints are represented in the plan.
- [x] `DEPLOYMENT_GATE.md` production evidence expectations are represented in
  the plan.
- [x] Current V1 prod-only stage deferral is respected.
- [x] Deferred `BOTMULTI-*` is not mixed into current V1 fixes.
- [x] `SYSFINAL-01..09` are executed with evidence.
- [x] Final closure report is published after execution.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Treating old unchecked historical checklist boxes as active work without
  canonical queue confirmation.
- Starting `BOTMULTI-*` while current single-bot V1 runtime truth is still
  under final audit.
- Creating UI-only fixes for runtime truth issues.
- Creating runtime shortcuts that bypass pre-trade, wallet, max-position,
  exchange-min-order, no-flip, or orchestration guardrails.
- Performing LIVE production mutations during audit without explicit operator
  approval.
- Adding temporary bypasses, mock-only behavior, fake data, or duplicated
  indicator/exchange logic.

## Validation Evidence
- Tests: not run in this planning slice.
- Manual checks:
  - reviewed canonical context, task board, learning journal, MVP queue,
    execution plan, open decisions, and latest planning artifacts.
  - current open decisions file reports zero active unresolved architecture
    decisions.
- Screenshots/logs: not applicable for planning.
- High-risk checks:
  - plan keeps LIVE mutation out of audit by default;
  - plan requires API freshness and Redis readiness evidence for runtime
    changes;
  - plan requires every confirmed bug to become a scoped task before
    implementation.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/README.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/architecture/reference/assistant-runtime-contract.md`
  - `docs/planning/open-decisions.md`
- Fits approved architecture: yes.
- Mismatch discovered: no active architecture mismatch found in this planning
  slice.
- Decision required from user: no for planning. User approval is required only
  before any LIVE production mutation or before pulling deferred V2 scope into
  V1.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: only if execution finds a real contract
  mismatch.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: current production dashboard and canonical UX docs.
- Canonical visual target: current dashboard design system.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: planned in `SYSFINAL-07`.
- Visual-direction brief reviewed: planned only if broad UI change is needed.
- Existing shared pattern reused: required by plan.
- New shared pattern introduced: no.
- Design-memory entry reused: current design-memory only.
- Design-memory update required: only if execution approves a new pattern.
- Visual gap audit completed: planned in `SYSFINAL-07`.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: planned for UI findings.
- Remaining mismatches: unknown until audit execution.
- Required states: loading, empty, error, success.
- Responsive checks: desktop, tablet, mobile.
- Input-mode checks: touch, pointer, keyboard.
- Accessibility checks: route/action keyboard and accessible-name checks.
- Parity evidence: to be produced during execution.

## Deployment / Ops Evidence
- Deploy impact: none for this planning slice; high for later runtime fixes.
- Env or secret changes: none.
- Health-check impact: none in this plan.
- Smoke steps updated:
  - API build-info/freshness directly for backend changes;
  - `/health`;
  - `/ready`;
  - authenticated login;
  - dashboard and bot-monitoring readback;
  - runtime signal/guardrail explanation;
  - market-stream SSE real event delivery.
- Rollback note: each implementation task must define its own rollback or
  disable path.
- Observability or alerting impact: runtime findings must preserve or improve
  diagnostic events.
- Staged rollout or feature flag: stage remains V2; production-only smoke is
  required for V1.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: fragmented planning state, stale-looking open entries, need for one
  end-to-end confidence plan.
- Gaps: current audits/fixes are spread across multiple historical docs; final
  runtime smoke closure must be synchronized.
- Inconsistencies: `RUNTIME-SIGNAL-VOTES-01` still appears open in active queue
  docs even though production smoke evidence exists from the deployed fix.
- Architecture constraints: single current V1 production system, stage deferred
  to V2, no workaround paths, no duplicated runtime/read-model truth.

### 2. Select One Priority Task
- Selected task: `SYSFINAL-2026-05-03`.
- Priority rationale: before fixing “all functions,” the repository needs one
  authoritative execution sequence and a clean distinction between current,
  historical, and deferred work.
- Why other candidates were deferred: implementation fixes must wait until the
  audit evidence identifies exact bugs.

### 3. Plan Implementation
- Files or surfaces to modify later: planning/context docs, then tested
  product/runtime modules based only on findings.
- Logic: sync truth first, audit every current function, convert findings into
  tiny tasks, execute and smoke.
- Edge cases: stale historical checkboxes, deferred V2 stage/BOTMULTI scope,
  production-only validation, Redis/exchange dependency drift, LIVE mutation
  safety.

### 4. Execute Implementation
- Implementation notes: no product code changed in this planning slice.

### 5. Verify and Test
- Validation performed: source-of-truth review and planning classification.
- Result: one master plan created; validations will run during execution
  tasks.

### 6. Self-Review
- Simpler option considered: start executing the first open checkbox from
  `mvp-next-commits`.
- Technical debt introduced: no.
- Scalability assessment: the plan reduces duplicate audit tracks and forces
  future fixes through scoped tasks.
- Refinements made: deferred `BOTMULTI-*` and stage work are explicitly
  separated from current V1 final remediation.

### 7. Update Documentation and Knowledge
- Docs updated: this master plan.
- Context updated: pending in `SYSFINAL-00`.
- Learning journal updated: not applicable for planning; no new recurring
  pitfall confirmed.

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
- [x] Definition of Done expectations are attached.
- [ ] Relevant validations will be run during execution tasks.
- [ ] Docs or context update will be completed in `SYSFINAL-00`.
- [x] Learning journal update is not applicable.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: Patryk/operator using production dashboard and
  runtime bot flows.
- Existing workaround or pain: planned work is spread across many queue and
  audit files, making it hard to know what remains to fix.
- Smallest useful slice: planning truth sync and final audit matrix.
- Success metric or signal: no unexplained active task remains; every current
  function has evidence or a fix task.
- Feature flag, staged rollout, or disable path: stage remains V2; bot active
  flags and runtime recovery flags remain operational controls.
- Post-launch feedback or metric check: production smoke and operator readback.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: planned
  before runtime/ops implementation tasks.
- Critical user journey: authenticated dashboard -> bot runtime -> signal or
  guardrail explanation -> order/position truth.
- SLI: production API readiness, authenticated workflow success, runtime event
  freshness, market-stream event delivery.
- SLO: use current project SLO docs during execution.
- Error budget posture: not assessed in planning slice.
- Health/readiness check: `/health` and `/ready`.
- Logs, dashboard, or alert route: runtime events, audit logs, Coolify deploy
  logs, API readiness.
- Smoke command or manual smoke: defined in `SYSFINAL-09`.
- Rollback or disable path: per implementation task.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: represented in this plan.
- Real API/service path used: required during execution.
- Endpoint and client contract match: required in `SYSFINAL-01`.
- DB schema and migrations verified: required before closure.
- Loading state verified: required in UI audit.
- Error state verified: required in UI/API audit.
- Refresh/restart behavior verified: required in runtime audit.
- Regression check performed: planned.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: required for
  `SYSFINAL-03` and any auth/LIVE/secret fix.
- Data classification: user account, API keys, trading configuration, orders,
  positions, runtime events.
- Trust boundaries: browser, API, DB, Redis, exchange adapters, Coolify/VPS,
  Binance.
- Permission or ownership checks: required for every private route and entity.
- Abuse cases: auth bypass, cross-user read/write, API-key leakage, LIVE write
  without entitlement/consent.
- Secret handling: masked UI/API responses and encrypted key storage.
- Security tests or scans: focused auth/security tests and `pnpm audit` when
  dependency scope changes.
- Fail-closed behavior: required for LIVE writes, Redis readiness, exchange
  failures, unavailable indicator input, and guardrail blocks.
- Residual risk: unknown until execution audit.

## Result Report
- Task summary: created a single master plan to synchronize planned work,
  audit every current V1 user-facing function, convert evidence-backed
  discrepancies into small fix tasks, validate locally, deploy when needed,
  and smoke production.
- Files changed: this planning artifact.
- How tested: planning source-of-truth review only; no code validations run.
- What is incomplete: execution of `SYSFINAL-00..09`.
- Next steps: start with `SYSFINAL-00` planning truth synchronization, then
  `SYSFINAL-01` function inventory.
- Decisions made: stage remains deferred to V2; `BOTMULTI-*` remains deferred
  pipeline and is not part of current V1 final remediation.
