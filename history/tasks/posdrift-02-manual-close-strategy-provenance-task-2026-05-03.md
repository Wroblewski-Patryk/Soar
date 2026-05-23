# Task

## Header
- ID: POSDRIFT-02
- Title: Preserve strategy provenance when manually closing imported bot positions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: LIVEIMPORT-02, POSDRIFT-01
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
The operator asked for continued LIVE/PAPER position-management drift hardening.
Previous slices recovered imported-position strategy provenance for runtime
automation and made manual opening canonical-first. Manual dashboard close still
had a provenance gap for imported `EXCHANGE_SYNC` bot-managed positions that
could be claimed by bot and wallet but closed without a strategy id.

## Goal
When a dashboard manual close claims an imported bot-managed position and the
selected bot has exactly one active canonical strategy link, the close path must
recover and persist that strategy provenance before orchestration.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Success Signal
- User or operator problem: imported LIVE rows can be actionable yet lose
  strategy provenance during manual dashboard close.
- Expected product or reliability outcome: close orders, close trades, and
  position history retain the same strategy ownership used by protection
  automation when it is unambiguous.
- How success will be observed: tests prove strategy provenance is recovered for
  single-strategy bots and still avoids guessing for ambiguous cases.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified implementation with focused and broader regression evidence plus
source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Load active enabled `BotMarketGroup` and enabled `MarketGroupStrategyLink`
   ids in the manual close command context.
2. Resolve an effective strategy id from the position first, then from exactly
   one active canonical strategy link.
3. Persist the recovered strategy id together with imported ownership claim
   updates.
4. Pass the recovered strategy id to runtime close orchestration.
5. Add a regression test for imported `EXCHANGE_SYNC` manual close provenance.

## Acceptance Criteria
- Imported bot-managed positions with missing `strategyId` recover the selected
  bot's single active canonical strategy during manual close.
- Manual close orchestration receives the recovered strategy id.
- Existing ambiguous imported ownership behavior remains fail-closed.
- Order/position, dynamic-stop, runtime automation, and web history/manual close
  regression packs pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this focused slice.
- [x] Existing runtime ownership and strategy-link topology are reused.
- [x] No new architecture or fallback guessing is introduced.
- [x] Validation evidence is attached.
- [x] Context and learning docs are updated.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts --run` PASS (`8/8`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`62/62`)
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx --run` PASS (`13/13`)
- Manual checks: code review of manual close ownership claim, strategy recovery,
  and orchestration payload.
- Screenshots/logs: not applicable.
- High-risk checks: imported ownership ambiguity regression remains covered.

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
- Rollback note: revert this commit to restore previous manual close provenance
  behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual close could claim imported ownership without recovering
  strategy provenance.
- Gaps: no regression covered strategy id propagation for imported manual close.
- Inconsistencies: runtime automation and read models could recover provenance,
  but close orchestration still received `undefined`.
- Architecture constraints: single-strategy recovery is allowed; multi-strategy
  missing provenance remains fail-closed.

### 2. Select One Priority Task
- Selected task: POSDRIFT-02.
- Priority rationale: manual close is a money-impacting LIVE action and writes
  order/trade/history state.
- Why other candidates were deferred: broader protection display and production
  readback continue after this confirmed close-path drift is closed.

### 3. Plan Implementation
- Files or surfaces to modify: manual close command service and focused tests.
- Logic: position strategy first, single canonical strategy fallback only.
- Edge cases: imported ownership claim, missing wallet, ambiguous ownership,
  multi-strategy bots.

### 4. Execute Implementation
- Implementation notes: reused active `BotMarketGroup` and enabled
  `MarketGroupStrategyLink`; no schema changes.

### 5. Verify and Test
- Validation performed: focused and broader regression packs listed above.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: passing `position.strategyId` only leaves imported
  recovered rows without provenance.
- Technical debt introduced: no
- Scalability assessment: small selected relation loaded only for manual close.
- Refinements made: persisted recovered provenance before orchestration.

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
- Error state verified: ambiguous ownership remains fail-closed
- Refresh/restart behavior verified: provenance persisted on claim
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading positions, bot ownership, strategy ids.
- Trust boundaries: authenticated owner-scoped runtime session close command.
- Permission or ownership checks: existing session, bot, wallet, ownership, and
  continuity checks preserved.
- Abuse cases: ambiguous imported ownership or multi-strategy missing provenance
  must not guess a strategy.
- Secret handling: no secrets touched.
- Security tests or scans: ownership ambiguity regression retained.
- Fail-closed behavior: no single canonical strategy means no recovered
  strategy fallback.
- Residual risk: authenticated production readback is still needed after deploy
  for the exact operator ETH/DOGE rows.

## Result Report
- Task summary: manual dashboard close now preserves single-strategy canonical
  provenance for imported bot-managed positions.
- Files changed: API manual close command service/test and context docs.
- How tested: focused and broader regression packs listed above.
- What is incomplete: production authenticated readback after deployment.
- Next steps: continue auditing protection display and imported position
  synchronization completeness.
- Decisions made: recover strategy only when exactly one active canonical
  strategy link exists.
