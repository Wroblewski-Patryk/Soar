# Task

## Header
- ID: V1UI-18
- Title: Dashboard Trade Fee Parity
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-17
- Priority: P1
- Iteration: 18
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime trade payloads include fee amount and reconciliation metadata:
`fee`, `feeSource`, `feePending`, and `feeCurrency`. Bot monitoring already
rendered this money-impacting truth, but the primary dashboard trade-history
table showed margin and realized PnL without the fee/finality signal.

## Goal
Render runtime trade fee amount and reconciliation metadata on `/dashboard`
trade history, using the same Web runtime fee formatter as bot monitoring.

## Scope
- `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`
- `apps/web/src/features/shared/runtimeMonitoringFormatters.test.ts`
- `apps/web/src/features/bots/components/bots-management/formatters.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- `docs/modules/web-dashboard-home.md`
- Canonical context and planning queue files for this iteration.

## Success Signal
- User or operator problem: operators should not need to leave dashboard home to see whether trade fees are estimated, exchange-final, or pending.
- Expected product or reliability outcome: dashboard and bot monitoring expose the same backend trade fee truth.
- How success will be observed: focused presenter/UI tests assert the dashboard trade-history fee column and metadata.
- Post-launch learning needed: no

## Deliverable For This Stage
Ship and verify one ARCHITECT-mode backend-to-Web runtime-trade parity fix for dashboard fee visibility.

## Constraints
- Reuse existing runtime table presenters and route-owned dashboard i18n keys.
- Do not change backend API contracts, database schema, fee calculation, or reconciliation behavior.
- Do not introduce duplicate fee-formatting logic.
- Do not add workaround paths or mock-only behavior.

## Implementation Plan
1. Move runtime trade fee metadata formatting into the shared Web runtime formatter module.
2. Keep bot monitoring wired through that shared formatter.
3. Add a sortable dashboard trade-history `Fee` column showing amount and metadata.
4. Update focused shared formatter, presenter, and dashboard component regressions.
5. Update source-of-truth docs and context.
6. Run focused tests, web/repo gates, build, and rendered dashboard smoke.

## Acceptance Criteria
- Dashboard trade history renders backend `fee` values.
- Dashboard trade history renders `PENDING`, `EXCHANGE`, or `EST.` metadata with optional currency.
- Bot monitoring fee metadata continues to use the same semantics.
- Focused tests, typecheck, lint, i18n audit, guardrails, build, and rendered `/dashboard` smoke pass.

## Definition of Done
- [x] Implementation is complete.
- [x] Tests cover fee amount and reconciliation metadata.
- [x] Relevant docs and context are updated.
- [x] No architecture mismatch, duplicate logic, or workaround is introduced.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: shared runtime formatter plus dashboard presenter tests (`20/20`), dashboard widget regression pack (`20/20`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, and full workspace build.
- Manual checks: authenticated rendered `/dashboard` smoke passed on `http://localhost:3002/dashboard` with no console or page errors.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui18-dashboard-1778119089825.png`.
- High-risk checks: no live-money mutation, order placement, fee reconciliation write, or position close was executed.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`, `docs/modules/system-modules.md`, `docs/modules/web-dashboard-home.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: dashboard module records trade-fee parity with bot monitoring.

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard trade-history DataTable and bot monitoring fee cell.
- Canonical visual target: structurally faithful parity with existing runtime tables.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused: runtime DataTable presenter and compact metadata sublabel.
- New shared pattern introduced: no
- Design-memory entry reused: no new pattern
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: local rendered smoke used empty dashboard state because no seeded bot/trade data existed.
- Required states: loading | empty | error | success
- Responsive checks: desktop rendered route smoke; DataTable remains horizontally scrollable.
- Input-mode checks: pointer/keyboard table behavior unchanged.
- Accessibility checks: existing table header/cell semantics preserved.
- Parity evidence: dashboard now renders fee amount and reconciliation metadata already visible in bot monitoring.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert dashboard fee column and shared formatter export wiring.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: dashboard trade history hid backend fee and fee-finality metadata.
- Gaps: bot monitoring showed fee metadata while dashboard home did not.
- Inconsistencies: the same runtime trade payload had different operator visibility across Web surfaces.
- Architecture constraints: money-impacting runtime truth must be visible and must reuse existing shared mechanisms.

### 2. Select One Priority Task
- Selected task: dashboard trade fee parity.
- Priority rationale: fees directly affect realized money truth and reconciliation confidence.
- Why other candidates were deferred: backend fee calculation already had coverage; this slice only needed UI/presenter parity.

### 3. Plan Implementation
- Files or surfaces to modify: shared runtime formatter, bot monitoring formatter bridge, dashboard trade presenter, tests, docs/context.
- Logic: format fee metadata once in shared runtime formatter; render amount plus metadata in dashboard trade history.
- Edge cases: pending fee metadata remains visible as `PENDING`; missing currency omits suffix.

### 4. Execute Implementation
- Implementation notes: added `formatRuntimeTradeFeeMeta`, reused it from bot monitoring, and added the dashboard `fee` column.

### 5. Verify and Test
- Validation performed: focused Web tests, dashboard component test, Web typecheck, Web lint, route-reachable i18n audit, repository guardrails, full workspace build, and authenticated rendered dashboard smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: importing the bot-management local formatter directly into dashboard; rejected because it would create cross-feature ownership drift.
- Technical debt introduced: no
- Scalability assessment: shared formatter can support additional runtime trade surfaces without duplicating semantics.
- Refinements made: kept route-owned labels while sharing only raw metadata formatting.

### 7. Update Documentation and Knowledge
- Docs updated: this task file and `docs/modules/web-dashboard-home.md`.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
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
Iteration 18 is `ARCHITECT` by the canonical rotation rules. The Browser plugin
bootstrap was attempted first, but `node_repl` resolved local Node `v22.13.0`
and requires `>=22.22.0`; rendered validation used bundled Codex Node plus
Playwright fallback.

## Production-Grade Required Contract
- Goal: expose existing backend trade fee and reconciliation metadata on dashboard trade history.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: use `DEFINITION_OF_DONE.md` standards through focused tests, docs, and validation evidence.
- Result Report: dashboard trade history now renders fee amount and fee-finality metadata via a shared Web runtime formatter; validation passed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing runtime trade payload contract.
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: unchanged existing route state.
- Error state verified: unchanged existing route state.
- Refresh/restart behavior verified: authenticated rendered route smoke passed after local API/Web restart.
- Regression check performed: focused formatter, presenter, and dashboard component tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: runtime operator reviewing trade history and realized result quality.
- Existing workaround or pain: operator had to use detailed bot monitoring to see fee-finality metadata.
- Smallest useful slice: one dashboard trade-history column for existing backend fields.
- Success metric or signal: focused presenter/UI regression plus rendered dashboard smoke.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: inspect runtime trade history on primary dashboard.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: authenticated rendered `/dashboard` smoke via bundled Codex Node and Playwright.
- Rollback or disable path: revert the dashboard fee column and shared formatter export wiring.

## AI Testing Evidence (required for AI features)
- Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: authenticated operator runtime trade data.
- Trust boundaries: existing authenticated dashboard API contract.
- Permission or ownership checks: unchanged backend route ownership checks.
- Abuse cases: no new command or mutation path added.
- Secret handling: no secrets added; local smoke used existing dev-only env names.
- Security tests or scans: repository guardrails and authenticated route smoke.
- Fail-closed behavior: unchanged.
- Residual risk: rendered smoke did not seed a live trade row; UI/presenter tests cover fee row rendering.

## Result Report
- Task summary: dashboard trade history now shows runtime fee amount and fee reconciliation metadata through shared Web semantics.
- Files changed: listed in Scope.
- How tested: listed in Validation Evidence.
- What is incomplete: no known implementation gap; production/live-money evidence remains outside this UI-only slice.
- Next steps: iteration 19 should continue the V1 backend-to-Web parity audit in BUILDER mode.
- Decisions made: fee metadata formatting belongs in shared Web runtime formatter, not in bot-monitoring feature-local ownership.
