# Task

## Header
- ID: POSDRIFT-01
- Title: Keep manual-order context aligned with canonical bot runtime scope
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder / Frontend Builder
- Depends on: DASHDRIFT-01
- Priority: P1
- Iteration: 2026-05-03 operator runtime drift audit
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration scope.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator audit found that dashboard and runtime surfaces must show and execute
the same selected bot scope after market or strategy changes. Manual order
context was still partly derived from direct compatibility projections on
`Bot.strategy` and `Bot.symbolGroup`, which can be stale after canonical
`BotMarketGroup` and `MarketGroupStrategyLink` updates.

## Goal
Manual order opening from the dashboard must use the canonical active bot market
group and enabled strategy link before any legacy direct bot projection.

## Scope
- `apps/api/src/modules/orders/orders.manualContext.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts`
- `apps/web/src/features/dashboard-home/hooks/useManualOrderController.test.tsx`

## Success Signal
- User or operator problem: dashboard manual-order options and context can drift
  from the actual bot market/strategy scope.
- Expected product or reliability outcome: PAPER and LIVE manual openings use
  the same active market/strategy context that runtime uses.
- How success will be observed: tests prove stale direct projections no longer
  override canonical active market groups.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified implementation with regression coverage and source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Make `resolveManualOrderStrategyContext` query active enabled
   `BotMarketGroup` and enabled `MarketGroupStrategyLink` rows before direct
   `Bot.strategyId` / `Bot.symbolGroupId`.
2. Keep legacy direct and `BotStrategy` paths as fallback only.
3. Make dashboard manual-order symbol options prefer active runtime graph market
   groups and exclude paused or stale groups.
4. Add stale direct-projection regression tests for API and web.

## Acceptance Criteria
- Manual-order API context for a symbol in the active canonical group uses the
  canonical strategy config, leverage, and margin/order type.
- Dashboard manual-order symbol options do not include stale direct group
  symbols when active canonical market groups exist.
- Existing manual-order, position, market-universe, and runtime-scope tests pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this focused slice.
- [x] Existing systems are reused without new architecture.
- [x] Regression tests cover the confirmed drift.
- [x] Validation evidence is attached.
- [x] Context and learning docs are updated.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts --run` PASS (`23/23`)
  - `pnpm --filter web run test -- src/features/dashboard-home/hooks/useManualOrderController.test.tsx --run` PASS (`3/3`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts src/modules/bots/bots.market-universe-contract.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts --run` PASS (`34/34`)
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx --run` PASS (`13/13`)
- Manual checks: code review of manual-order context fallback order and symbol
  option filtering.
- Screenshots/logs: not applicable.
- High-risk checks: stale direct projection fixtures included for API and web.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`,
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
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous direct-projection
  precedence.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual-order API and UI could still prefer stale direct bot
  projections.
- Gaps: no regression proved direct projections lost to canonical active graph.
- Inconsistencies: dashboard manual-order scope could differ from runtime graph.
- Architecture constraints: canonical bot topology is `BotMarketGroup` plus
  `MarketGroupStrategyLink`.

### 2. Select One Priority Task
- Selected task: POSDRIFT-01.
- Priority rationale: manual order opening is money-impacting in LIVE and
  dashboard-visible in PAPER.
- Why other candidates were deferred: broader close/TTP/import audit continues
  after this confirmed drift is closed.

### 3. Plan Implementation
- Files or surfaces to modify: API manual-context service, web hook, focused
  tests.
- Logic: canonical active groups first, direct projections fallback.
- Edge cases: paused groups, stale direct groups, runtime stats containing old
  symbols.

### 4. Execute Implementation
- Implementation notes: no new models or APIs; only precedence and filtering
  changed.

### 5. Verify and Test
- Validation performed: focused and broader manual-order/runtime packs listed
  above.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: web-only filtering was insufficient because API
  context also needed canonical precedence.
- Technical debt introduced: no
- Scalability assessment: uses existing active group and strategy link queries.
- Refinements made: runtime stats symbols are allowed only when they are inside
  active canonical graph if such a graph exists.

### 7. Update Documentation and Knowledge
- Docs updated: this planning task.
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: existing covered path unchanged
- Error state verified: existing covered path unchanged
- Refresh/restart behavior verified: manual-order context refetch tests
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user bot configuration, strategy configuration, position
  context.
- Trust boundaries: authenticated owner-scoped bot/order API.
- Permission or ownership checks: existing `userId` and bot owner filters
  preserved.
- Abuse cases: stale bot projection must not authorize or configure manual
  orders outside active canonical bot scope.
- Secret handling: no secrets touched.
- Security tests or scans: ownership tests in orders positions e2e retained.
- Fail-closed behavior: unmatched selected bot symbol returns null context.
- Residual risk: production authenticated dashboard readback still needs an
  operator session to compare live rows after deploy.

## Result Report
- Task summary: manual-order API and dashboard symbol selection are
  canonical-first across active bot market groups.
- Files changed: API manual-context service/test, web manual-order hook/test,
  planning/context docs.
- How tested: focused and broader regression packs listed above.
- What is incomplete: production authenticated readback after deployment.
- Next steps: continue the operator-requested audit through close/protection and
  imported-position display slices.
- Decisions made: direct `Bot.strategy` / `Bot.symbolGroup` are fallback-only for
  manual-order context.
