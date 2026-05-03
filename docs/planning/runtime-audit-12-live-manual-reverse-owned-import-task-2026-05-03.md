# Task

## Header
- ID: RUNTIME-AUDIT-12
- Title: Fail closed manual LIVE reverse opens against owned imported positions
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-11
- Priority: P0
- Iteration: 30
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator-reported LIVE/PAPER dashboard and runtime drifts continue to center on
selected-bot position ownership. Previous slices aligned runtime reads,
pre-trade counting, and final-candle guards with deterministic external
position ownership. Manual LIVE open still has its own reverse-open guard in
the orders module.

## Goal
Make manual LIVE order opening fail closed when the selected bot already owns an
exchange-synced imported open position on the same symbol with the opposite
side, even when reconciliation persisted that imported row as `botId=null` and
`walletId=null`.

## Scope
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `docs/modules/api-orders.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: LIVE bot should not be able to open an implicit
  opposite position because an owned imported exchange position was hidden from
  the order guard.
- Expected product or reliability outcome: manual dashboard order opens use the
  same selected-bot ownership proof as runtime/imported-position reads.
- How success will be observed: regression test blocks the reverse open and
  validations pass.
- Post-launch learning needed: no.

## Deliverable For This Stage
Implement the smallest orders-module guard change, add a regression test, and
record validation evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Reuse `resolveExternalPositionOwnershipIndex` and
   `getExternalPositionOwnership` from the existing bot ownership service.
2. Extend canonical order bot context with wallet-bound API-key id so the
   guard can use wallet-first ownership proof without another bot query.
3. Keep the current direct scoped-position guard unchanged.
4. For LIVE selected-bot opens, additionally check owned imported
   `EXCHANGE_SYNC` / `BOT_MANAGED` rows keyed by API key and symbol, accepting
   both wallet-bound and legacy wallet-null imported rows.
5. Add a DB-backed regression proving a wallet/API-key-owned imported LONG row
   blocks a selected-bot manual LIVE SELL open.

## Acceptance Criteria
- Manual LIVE open with selected bot fails with
  `OPEN_POSITION_SIDE_CONFLICT` against an owned imported opposite-side row.
- Same-side and unrelated wallet/bot scopes remain governed by existing guards.
- The solution reuses deterministic external-position ownership proof.

## Definition of Done
- [x] Relevant tests pass.
- [x] Typecheck, guardrails, lint, and diff check pass.
- [x] Docs and context files record the completed slice and evidence.

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
  - `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts --sequence.concurrent=false`
    PASS (`27/27`).
  - `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts --sequence.concurrent=false`
    PASS (`69/69`).
- Manual checks:
  - reviewed diff for scope lock and ownership-proof reuse.
- Screenshots/logs: not applicable.
- High-risk checks:
  - regression proves selected-bot manual `LIVE` SELL fails before exchange
    submission when the same bot/wallet owns an imported LONG position.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-orders.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: orders module contract update only.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the orders service/test/doc commit.
- Observability or alerting impact: existing typed error and audit behavior.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual LIVE reverse-open guard checked direct wallet/bot scope only.
- Gaps: owned imported LIVE positions persisted as `botId=null/walletId=null`
  were invisible to this guard.
- Inconsistencies: runtime, pre-trade, and final-candle paths already use
  deterministic external-position ownership proof.
- Architecture constraints: command paths must fail closed for money-impacting
  ownership conflicts and reuse existing ownership services.

### 2. Select One Priority Task
- Selected task: close the manual LIVE reverse-open guard drift.
- Priority rationale: P0 money-impacting order command guard.
- Why other candidates were deferred: dashboard presentation and additional
  runtime audits remain queued, but this write-path guard has higher risk.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: direct scoped guard first, owned-imported LIVE guard second.
- Edge cases: no API key, unowned/ambiguous/manual-only imports, different
  wallet, PAPER mode, same-side adds.

### 4. Execute Implementation
- Implementation notes:
  - added wallet API-key id to canonical order bot context.
  - added ownership-proof lookup for manual `LIVE` selected-bot open commands.
  - kept direct scoped position guard unchanged and added owned-import check as
    an additional fail-closed guard.
  - stabilized the existing manual-context PAPER price test timeout after it
    consistently exceeded the default 5-second Vitest limit during this pack.

### 5. Verify and Test
- Validation performed:
  - focused orders service pack.
  - broader orders/pre-trade/final-candle/defaults pack.
  - repository typecheck, guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: widening wallet scope to include `walletId=null`;
  rejected because it can false-block another bot or wallet.
- Technical debt introduced: no.
- Scalability assessment: single ownership-index lookup on manual LIVE command
  path only.
- Refinements made:
  - fail-open for no API key, unowned, ambiguous, manual-only, or other-wallet
    imports so selected-bot command scope is not overblocked.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/modules/api-orders.md`
  - this planning task
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes, `openOrder`.
- Endpoint and client contract match: yes, unchanged.
- DB schema and migrations verified: yes, no schema change.
- Loading state verified: not applicable.
- Error state verified: typed-error regression returns
  `OPEN_POSITION_SIDE_CONFLICT`.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: pending.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: trading command and exchange-account metadata.
- Trust boundaries: authenticated user, selected bot, wallet/API-key ownership,
  exchange-synced imported positions.
- Permission or ownership checks: deterministic API-key + symbol owner proof.
- Abuse cases: selected bot attempts opposite-side open while exchange already
  has owned imported exposure.
- Secret handling: no secret reads or writes; API-key ids only.
- Security tests or scans: regression test pending.
- Fail-closed behavior: implemented and covered by regression test.
- Residual risk: exchange may still reject or fill orders asynchronously after
  passing local guards; existing exchange boundary remains authority.

## Result Report
- Task summary: manual selected-bot `LIVE` opens now fail closed against owned
  imported opposite-side exchange positions before exchange submission.
- Files changed:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `docs/modules/api-orders.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - this planning task
- How tested:
  - focused orders pack (`27/27`)
  - broader orders/pre-trade/final-candle/defaults pack (`69/69`)
  - typecheck, guardrails, lint, diff check
- What is incomplete: nothing for this slice.
- Next steps: continue the operator-requested audit with the next smallest
  LIVE/PAPER dashboard/runtime drift.
- Decisions made: use ownership proof rather than widening wallet scope.
