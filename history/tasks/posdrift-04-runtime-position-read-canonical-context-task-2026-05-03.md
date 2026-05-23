# Task

## Header
- ID: POSDRIFT-04
- Title: Keep runtime position reads aligned with canonical bot context
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: POSDRIFT-01, POSDRIFT-03
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
The operator asked to continue auditing LIVE/PAPER position management and
dashboard truth. Previous slices made manual orders and imported ownership
canonical-first. Runtime position reads still inherited venue from direct
`Bot.symbolGroup.marketUniverse` and allowed direct `Bot.strategyId` to make a
position actionable even when the position lacked canonical strategy provenance.

## Goal
Runtime positions read by the dashboard must use canonical active bot
market-group venue before direct legacy venue, and protection/actionable display
must require position or canonical single-strategy provenance.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Success Signal
- User or operator problem: dashboard positions can disappear or show protection
  actionability from stale direct bot projections.
- Expected product or reliability outcome: dashboard position rows use the same
  canonical market/strategy context as runtime protection automation.
- How success will be observed: tests prove stale direct venue no longer blocks
  runtime positions and missing canonical strategy context remains non-actionable.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified implementation with regression tests and source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Load active canonical market-group venue context for runtime position reads.
2. Resolve inherited runtime execution context from the single canonical venue
   when available, falling back to direct symbol-group venue only for legacy
   bots without canonical groups.
3. Remove direct `Bot.strategyId` fallback from runtime position protection
   context; keep position strategy or single canonical strategy only.
4. Add e2e coverage for stale direct SPOT venue plus canonical FUTURES group.
5. Re-run position, runtime scope, dynamic-stop, automation, and web history
   regressions.

## Acceptance Criteria
- Runtime positions endpoint returns bot-managed positions when direct
  `Bot.symbolGroup` venue is stale but active canonical venue matches wallet.
- Position rows without position strategy and without canonical strategy context
  remain non-actionable and do not surface DCA/trailing fallback plans.
- Dynamic-stop visibility and runtime automation regressions continue to pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this focused slice.
- [x] Existing canonical bot topology is reused.
- [x] No new architecture or direct-projection workaround is introduced.
- [x] Validation evidence is attached.
- [x] Context and learning docs are updated.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-strategy-context.e2e.test.ts --run` PASS (`2/2`)
  - `pnpm --filter api exec vitest run src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`42/42`)
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/bots/bots.market-universe-contract.e2e.test.ts --run` PASS (`34/34`)
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx --run` PASS (`13/13`)
  - `pnpm --filter api run typecheck` PASS
- Manual checks: reviewed inherited execution context source and protection
  strategy fallback.
- Screenshots/logs: not applicable.
- High-risk checks: fail-closed strategy context test retained.

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
- Rollback note: revert this commit to restore direct runtime position venue and
  strategy fallback behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime position reads still inherited direct bot venue and direct
  bot strategy fallback.
- Gaps: no test covered stale direct venue blocking canonical runtime positions.
- Inconsistencies: import/manual-order/runtime automation were canonical-first,
  but position reads still had direct projection paths.
- Architecture constraints: active `BotMarketGroup` plus enabled strategy links
  are canonical.

### 2. Select One Priority Task
- Selected task: POSDRIFT-04.
- Priority rationale: dashboard positions are the operator's primary evidence
  surface for open/protected positions.
- Why other candidates were deferred: production readback and further close
  protection checks continue after this local drift is closed.

### 3. Plan Implementation
- Files or surfaces to modify: runtime position repository/service and e2e test.
- Logic: canonical venue first, direct venue fallback only; no direct strategy
  fallback for protection/actionable.
- Edge cases: stale direct SPOT group, canonical FUTURES group, missing
  position strategy, missing canonical strategy context.

### 4. Execute Implementation
- Implementation notes: added canonical venue selection from existing
  `botMarketGroups` relation and reused existing runtime execution context
  validation.

### 5. Verify and Test
- Validation performed: focused and broader regression packs listed above.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only changing venue would leave protection display
  able to drift through direct strategy fallback.
- Technical debt introduced: no
- Scalability assessment: adds one small selected relation to an existing bot
  context query.
- Refinements made: repeated DB-backed e2e packs sequentially after parallel
  cleanup collisions.

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
- Loading state verified: not changed
- Error state verified: unresolved strategy context remains non-actionable
- Refresh/restart behavior verified: runtime position read endpoint regression
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user bot, wallet, position, and strategy metadata.
- Trust boundaries: authenticated owner-scoped dashboard runtime read API.
- Permission or ownership checks: existing owned runtime session and bot
  filters preserved.
- Abuse cases: stale direct venue or strategy projection must not make runtime
  positions invisible or falsely actionable.
- Secret handling: no secrets touched.
- Security tests or scans: owner-scoped e2e route tests retained.
- Fail-closed behavior: ambiguous/missing canonical strategy context does not
  surface protection automation fallback.
- Residual risk: production authenticated readback still required after deploy.

## Result Report
- Task summary: runtime position reads now use canonical active market-group
  venue and protection/actionable context before direct fallback.
- Files changed: API runtime position read repo/service/test and context docs.
- How tested: focused and broader regression packs listed above.
- What is incomplete: production authenticated ETH/DOGE readback after deploy.
- Next steps: continue production readback and remaining protection/import
  parity checks.
- Decisions made: direct `Bot.strategyId` is not sufficient to make a runtime
  position protection-actionable when canonical/position provenance is missing.
