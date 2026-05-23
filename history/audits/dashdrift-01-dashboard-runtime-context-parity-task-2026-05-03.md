# Task

## Header
- ID: DASHDRIFT-01
- Title: Keep dashboard sidebar runtime context canonical-first
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: operator dashboard/runtime drift audit
- Priority: P0
- Iteration: 2026-05-03 operator follow-up
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked for a broad dashboard drift audit: every displayed dashboard
value should reflect the function that actually drives PAPER/LIVE runtime. The
first confirmed drift after `PAPERSIGNAL-01` was the dashboard sidebar strategy
and market context.

## Goal
Make the dashboard sidebar show the canonical runtime graph market/strategy
context before legacy bot projections, including strategy leverage.

## Scope
- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- `apps/web/src/features/bots/types/bot.type.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Success Signal
- User or operator problem: dashboard sidebar no longer shows stale strategy or
  market context after bot strategy/market changes.
- Expected product or reliability outcome: displayed context matches the
  runtime graph used by execution and monitoring.
- How success will be observed: regression tests with stale direct projections
  still render canonical graph values.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified API/web fix, regression evidence, and source-of-truth updates.

## Constraints
- Reuse existing `runtime-graph` and dashboard sidebar components.
- Do not add a new runtime context endpoint.
- Do not remove legacy fallback; keep it only for old rows without canonical
  graph data.
- Keep UI copy and layout unchanged.

## Implementation Plan
1. Audit dashboard sidebar context derivation against runtime graph.
2. Add strategy leverage to `runtime-graph` API payload.
3. Update web runtime graph type contract.
4. Prefer canonical runtime graph context in the sidebar before direct legacy
   bot projections.
5. Add API and web regressions for leverage and stale direct projections.
6. Run focused dashboard/runtime parity tests plus typechecks and guardrails.

## Acceptance Criteria
- `runtime-graph` strategy payload includes `leverage`.
- Sidebar renders canonical market group, strategy, interval, and leverage
  when direct `bot.strategy` or `bot.symbolGroup` is stale.
- Legacy direct projections remain fallback when canonical graph is absent.
- Focused API/web dashboard/runtime tests pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` constraints are satisfied for the touched slice.
- [x] API contract test covers canonical strategy leverage.
- [x] Web component test covers stale direct projection drift.
- [x] API and web typechecks pass.
- [x] Repository guardrails and docs parity pass.

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
- Tests:
  - `pnpm --filter web run test -- src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx --run` => PASS, 8/8.
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-scope.e2e.test.ts --run` => PASS, 10/10.
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx --run` => PASS, 11/11.
  - `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts --run` => PASS, 14/14.
  - `pnpm --filter web run typecheck` => PASS.
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm run docs:parity:check` => PASS.
- Manual checks: inspected dashboard controller, sidebar presenters, runtime
  aggregate service, runtime graph service, and symbol-stats read model.
- Screenshots/logs: not applicable.
- High-risk checks: no trading behavior changed; display contract now follows
  runtime graph.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`,
  `docs/modules/system-modules.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not required
- Rollback note: revert API graph leverage select and sidebar precedence
  change.
- Observability or alerting impact: dashboard operator context becomes more
  accurate after deploy.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: sidebar could prefer direct legacy `bot.strategy` / `bot.symbolGroup`
  over canonical `runtimeGraph`.
- Gaps: `runtime-graph` omitted strategy `leverage`, so canonical context could
  not fully explain the runtime strategy in the sidebar.
- Inconsistencies: execution and symbol-stats were canonical-first, while this
  dashboard panel could still show stale projections.
- Architecture constraints: dashboard must explain runtime truth, not stale
  compatibility projections.

### 2. Select One Priority Task
- Selected task: `DASHDRIFT-01`.
- Priority rationale: direct operator request for dashboard/runtime drift audit.
- Why other candidates were deferred: authenticated production ETH/DOGE
  readback still depends on fresh deploy and auth evidence.

### 3. Plan Implementation
- Files or surfaces to modify: runtime graph API payload, web type, sidebar
  derivation, API/web tests.
- Logic: canonical graph first, direct projections as legacy fallback.
- Edge cases: stale direct projection, missing strategy id, leverage display.

### 4. Execute Implementation
- Implementation notes: no new endpoint or UI layout; only source precedence
  and missing field were corrected.

### 5. Verify and Test
- Validation performed: focused API/web regression, aggregate/symbol-stats
  parity packs, typechecks, guardrails, docs parity.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: frontend-only precedence change; rejected because
  canonical graph also lacked leverage.
- Technical debt introduced: no
- Scalability assessment: adding one scalar to runtime graph keeps the existing
  contract explicit and avoids browser-side guessing.
- Refinements made: preserved fallback for legacy rows with no canonical graph.

### 7. Update Documentation and Knowledge
- Docs updated: this task record.
- Context updated: task board and project state.
- Learning journal updated: yes.

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
Production build-info was still on `a6ea854f` during this local task, so this
fix requires promotion before operator verification.

## Production-Grade Required Contract

- `Goal`: keep dashboard sidebar runtime context canonical-first.
- `Scope`: listed above.
- `Implementation Plan`: listed above.
- `Acceptance Criteria`: listed above.
- `Definition of Done`: listed above.
- `Result Report`: listed below.

Runtime task vertical slice: API contract, web type contract, UI display
derivation, API tests, web tests, typechecks, guardrails, and docs/context.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard users reviewing selected bot runtime
  context.
- Existing workaround or pain: stale displayed context after bot market or
  strategy changes.
- Smallest useful slice: runtime graph field and sidebar precedence fix.
- Success metric or signal: stale direct projection fixture renders canonical
  graph context.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: production dashboard readback after
  deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: dashboard selected bot context review.
- SLI: displayed runtime context matches runtime graph.
- SLO: canonical graph data wins over legacy projection whenever present.
- Error budget posture: not applicable.
- Health/readiness check: unchanged.
- Logs, dashboard, or alert route: dashboard sidebar.
- Smoke command or manual smoke: authenticated dashboard readback after deploy.
- Rollback or disable path: revert the commit.

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: existing tests cover aggregate/dashboard load paths.
- Error state verified: existing aggregate error tests remain available; no
  error-state behavior changed.
- Refresh/restart behavior verified: selected bot snapshot tests run.
- Regression check performed: yes

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: bot configuration metadata.
- Trust boundaries: existing authenticated dashboard bot ownership route.
- Permission or ownership checks: unchanged.
- Abuse cases: no new access path.
- Secret handling: unchanged.
- Security tests or scans: existing runtime graph ownership tests remain in
  `bots.e2e.test.ts`; no auth behavior changed.
- Fail-closed behavior: legacy fallback remains only when canonical graph is
  unavailable.
- Residual risk: production verification needs fresh deploy.

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: dashboard sidebar now uses canonical runtime graph context
  before legacy direct bot projections, and runtime graph includes strategy
  leverage.
- Files changed:
  - `apps/api/src/modules/bots/botsCommand.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `apps/web/src/features/bots/types/bot.type.ts`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
  - `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/LEARNING_JOURNAL.md`
  - `history/audits/dashdrift-01-dashboard-runtime-context-parity-task-2026-05-03.md`
- How tested: listed in validation evidence.
- What is incomplete: production deploy/readback.
- Next steps: continue drift audit with authenticated production readback after
  newest build is active.
- Decisions made: fix only the first confirmed drift, keep broader audit
  continuing as separate slices.
