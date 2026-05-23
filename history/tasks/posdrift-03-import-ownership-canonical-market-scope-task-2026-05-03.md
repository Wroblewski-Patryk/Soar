# Task

## Header
- ID: POSDRIFT-03
- Title: Keep imported-position ownership scoped to canonical bot markets
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-01, POSDRIFT-01
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
The operator reported that LIVE bots should scan all assigned markets for
manual exchange positions, but not stale markets from earlier bot configuration.
The imported-position ownership index still merged direct legacy
`Bot.symbolGroup` scope with active canonical `BotMarketGroup` scope.

## Goal
Imported-position ownership must use active canonical bot market groups as the
selected bot market scope when they exist, and use direct `Bot.symbolGroup` only
as legacy fallback when no canonical group exists.

## Scope
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Success Signal
- User or operator problem: imported LIVE ownership can include stale direct bot
  market projections after market changes.
- Expected product or reliability outcome: exchange-synced positions are
  imported or adopted only for the bot's current active canonical market scope.
- How success will be observed: tests prove stale direct symbols are not owned
  when active canonical groups exist, while canonical symbols still are owned.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified canonical-first imported-position ownership implementation with
regression evidence and source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Build imported-position symbol scope from active canonical bot market groups
   when they exist.
2. Preserve direct `Bot.symbolGroup` as fallback only for legacy bots without
   active canonical groups.
3. Update ownership-index regression to prove stale direct scope is ignored.
4. Validate reconciliation, takeover status, runtime scope, and order/position
   packs.

## Acceptance Criteria
- A stale direct symbol is not marked owned when active canonical market groups
  exist.
- An active canonical symbol is marked owned for the same wallet API key.
- Existing takeover ambiguity and manual-only behavior remain intact.
- LIVE reconciliation and runtime scope tests pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this focused slice.
- [x] Existing ownership-index mechanism is reused.
- [x] No new architecture or parallel ownership system is introduced.
- [x] Validation evidence is attached.
- [x] Context and learning docs are updated.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts --run` PASS (`8/8`)
  - `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts --run` PASS (`34/34`)
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.market-universe-contract.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts --run` PASS (`34/34`)
  - `pnpm --filter api run typecheck` PASS
- Manual checks: reviewed ownership key construction and direct fallback order.
- Screenshots/logs: not applicable.
- High-risk checks: ambiguity and manual-only ownership tests remain covered.

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
- Rollback note: revert this commit to restore merged direct+canonical imported
  ownership scope.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: ownership index merged legacy direct market scope with canonical active
  market groups.
- Gaps: no regression proved stale direct scope is ignored when canonical groups
  exist.
- Inconsistencies: runtime/manual order scopes had moved canonical-first, but
  imported ownership still merged both scopes.
- Architecture constraints: canonical market scope is active `BotMarketGroup`.

### 2. Select One Priority Task
- Selected task: POSDRIFT-03.
- Priority rationale: imported LIVE ownership determines whether manual exchange
  positions become bot-managed and dashboard-actionable.
- Why other candidates were deferred: protection display and production readback
  continue after ownership scope is corrected.

### 3. Plan Implementation
- Files or surfaces to modify: external-position ownership index and focused
  test.
- Logic: active canonical scopes first, direct projection fallback only.
- Edge cases: stale direct symbols, wallet-first API key ownership, ambiguity,
  manual-only takeover disabled.

### 4. Execute Implementation
- Implementation notes: no schema/API changes; only source precedence changed.

### 5. Verify and Test
- Validation performed: focused and broader regression packs listed above.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: keeping merged scopes preserves stale imports and
  contradicts canonical runtime graph behavior.
- Technical debt introduced: no
- Scalability assessment: same symbol resolution work, smaller effective scope
  when canonical groups exist.
- Refinements made: regression now covers stale direct symbol as `UNOWNED`.

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
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: unresolved ownership remains fail-closed/drifted
- Refresh/restart behavior verified: reconciliation tests
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user bot configuration, wallet API-key ownership proof,
  exchange-synced positions.
- Trust boundaries: server-side authenticated ownership resolution.
- Permission or ownership checks: wallet API key, bot owner, active market scope,
  takeover flag.
- Abuse cases: stale bot projection must not claim a position outside the active
  configured market scope.
- Secret handling: no secrets touched.
- Security tests or scans: ownership ambiguity and wallet-key isolation tests.
- Fail-closed behavior: stale direct symbol becomes `UNOWNED` when canonical
  active scope exists.
- Residual risk: authenticated production readback is still required after
  deployment for reported ETH/DOGE rows.

## Result Report
- Task summary: imported-position ownership now follows active canonical bot
  market groups before direct legacy fallback.
- Files changed: external ownership service/test and context docs.
- How tested: focused and broader regression packs listed above.
- What is incomplete: production authenticated readback after deployment.
- Next steps: continue protection-display audit and production readback.
- Decisions made: active canonical market groups replace, not supplement, direct
  `Bot.symbolGroup` for imported ownership scope.
