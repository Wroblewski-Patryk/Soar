# Task

## Header
- ID: RUNTIME-AUDIT-69
- Title: Scope LIVE exchange-synced open-order upsert by owner
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-68
- Priority: P1
- Iteration: 69
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After read-path hardening for botless LIVE open orders, the adjacent write path
still searched existing synced open orders by `userId + exchangeOrderId` only.
Exchange order IDs are not guaranteed to be globally unique across every
wallet/API-key context in the application, and the runtime dashboard relies on
bot/wallet ownership staying stable.

## Goal
Prevent LIVE open-order reconciliation from updating or blocking rows outside
the owning bot/wallet context when exchange order IDs collide.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: LIVE dashboard should show all exchange-owned
  orders for assigned markets without stale/colliding order rows stealing the
  update.
- Expected product or reliability outcome: reconciliation writes open orders to
  the deterministic bot/wallet owner only.
- How success will be observed: regression proves a global botless colliding
  order remains untouched and a new owner-scoped synced order is created.
- Post-launch learning needed: yes

## Deliverable For This Stage
Implement the owner-scoped open-order upsert and focused regression.

## Constraints
- Reuse existing Prisma order model and reconciliation dependency shape.
- Do not add migrations or new ownership systems in this slice.
- Keep the production service under repository guardrail budgets.
- Do not change position reconciliation behavior.

## Implementation Plan
1. Add focused test coverage for the default open-order upsert dependency.
2. Scope the existing-order lookup to same bot or same botless wallet owner.
3. Verify with live reconciliation tests, typecheck, guardrails, lint, and diff
   review.
4. Sync source-of-truth docs and task context.

## Acceptance Criteria
- A colliding botless `EXCHANGE_SYNC` order with `walletId = null` is not
  updated for a different bot/wallet owner.
- The correct owner receives its own `EXCHANGE_SYNC` order row.
- Existing same-bot rows can still be updated.
- Non-`EXCHANGE_SYNC` rows in the same owner context still block takeover
  updates.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` applicable items are satisfied with evidence.
- [x] Focused reconciliation regression passes.
- [x] API typecheck, guardrails, lint, and diff review pass.
- [x] Source-of-truth docs are updated.

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
  - `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` => PASS (`27/27`)
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run lint` => PASS
  - `git diff --check` => PASS
- Manual checks: code review of owner-scoped order lookup and default-deps
  Prisma regression
- Screenshots/logs: not applicable
- High-risk checks: fail-closed collision regression for exchange order ID
  reuse outside the owning bot/wallet context

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous broad order lookup.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: default open-order upsert searched by `userId + exchangeOrderId`
  without owner scope.
- Gaps: `Order` has no API-key or market-type discriminator, so bot/wallet
  scope is the available deterministic persisted owner boundary.
- Inconsistencies: read path is now wallet-proofed for botless rows, but write
  path could still mutate a wallet-null row outside the owner context.
- Architecture constraints: runtime lifecycle guardrails require ownership
  checks after strategy merge.

### 2. Select One Priority Task
- Selected task: owner-scope synced open-order upsert.
- Priority rationale: money-impacting LIVE management state and dashboard
  truthfulness.
- Why other candidates were deferred: broader schema-level exchange-order
  identity can be evaluated after V1 if needed.

### 3. Plan Implementation
- Files or surfaces to modify: reconciliation service, focused service test,
  source-of-truth docs.
- Logic: existing-order lookup accepts same `botId` rows or botless rows with
  the same `walletId`; unrelated wallet-null/botless collisions are ignored.
- Edge cases: same-owner non-exchange rows still block update; same-bot legacy
  wallet-null rows remain updatable.

### 4. Execute Implementation
- Implementation notes: the default open-order upsert now looks up existing
  rows within the same bot or same botless wallet context before updating or
  blocking. The default dependency object is exported directly for regression
  coverage without adding another production line.

### 5. Verify and Test
- Validation performed: focused live reconciliation suite, API typecheck,
  repository guardrails, lint, and diff whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: always create a new order row, but that would
  duplicate same-owner reconciliation updates.
- Technical debt introduced: no
- Scalability assessment: sufficient for current schema; API-key-scoped order
  identity remains a possible future schema hardening.
- Refinements made: kept `livePositionReconciliation.service.ts` at 999 lines
  after guardrails caught the first 1001-line draft.

### 7. Update Documentation and Knowledge
- Docs updated: this task, MVP next commits queue.
- Context updated: task board and project state.
- Learning journal updated: not applicable

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
This is intentionally a write-path owner-scope fix only.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: persisted DB write/read path
- Regression check performed: focused service test covers owner-scope collision

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE bot operator reading dashboard order state
- Existing workaround or pain: missing or misattributed exchange-synced order
  rows on dashboard
- Smallest useful slice: owner-scoped upsert lookup
- Success metric or signal: focused reconciliation regression and validation
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: observe production dashboard after deploy

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: LIVE open-order reconciliation into dashboard
- SLI: order reconciliation owner correctness
- SLO: no cross-owner mutation on exchange-order ID collision
- Error budget posture: not applicable
- Health/readiness check: not affected
- Logs, dashboard, or alert route: not affected
- Smoke command or manual smoke: focused service regression
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user trading/order metadata
- Trust boundaries: authenticated user DB data, exchange snapshot ingestion
- Permission or ownership checks: bot/wallet owner scope in upsert lookup
- Abuse cases: colliding order ID mutates another owner context
- Secret handling: no secrets touched
- Security tests or scans: focused ownership regression
- Fail-closed behavior: unrelated collisions are ignored for update and do not
  block owner row creation
- Residual risk: schema does not yet persist API-key/market-type on orders

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: LIVE open-order reconciliation no longer updates or blocks on
  unrelated order rows when `exchangeOrderId` collides outside the owning
  bot/wallet context.
- Files changed:
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-69-open-order-upsert-owner-scope-task-2026-05-04.md`
- How tested: focused reconciliation suite (`27/27`), API typecheck,
  guardrails, lint, and diff check all passed.
- What is incomplete: orders still do not persist API-key/market-type identity;
  current fix uses existing bot/wallet owner boundaries.
- Next steps: continue auditing LIVE/PAPER dashboard write/read parity around
  stale order lifecycle and imported trade attribution.
- Decisions made: same-bot legacy rows and botless same-wallet rows are valid
  update candidates; unrelated wallet-null collisions are ignored.
