# Task

## Header
- ID: RUNTIME-AUDIT-108
- Title: Align PAPER position persistence with bot-scoped DB uniqueness
- Task Type: fix
- Current Stage: implementation
- Status: IN_PROGRESS
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-107
- Priority: P1
- Iteration: 108
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-107` made PAPER order fill lookup bot-scoped, but the database
partial unique index still treats any open position with `walletId IS NOT NULL`
as wallet-scoped. Therefore a PAPER position created with both `botId` and
`walletId` can still collide at the wallet uniqueness layer, or remain
semantically inconsistent with PAPER bot-scoped runtime reads.

## Goal
Make PAPER position persistence match bot-scoped DB uniqueness while preserving
wallet attribution through orders/trades and wallet read models.

## Scope
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/orders/orders.positionScope.test.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- `apps/api/src/modules/wallets/wallets.service.ts`
- Source-of-truth planning/context docs.

## Success Signal
- User or operator problem: PAPER bot can receive a valid signal/fill but still
  not get a visible open position.
- Expected product or reliability outcome: PAPER positions persist in the DB's
  bot-scoped uniqueness lane, while wallet/capital summaries still include
  those bot positions.
- How success will be observed: focused unit tests for PAPER position wallet
  persistence and wallet/capital query scopes.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement the mode-aware PAPER position persistence rule and update read-model
scope helpers that need to continue seeing paper wallet bot positions.

## Constraints
- do not change LIVE wallet-scoped semantics
- do not add a new position model or schema migration in this slice
- do not remove wallet attribution from orders/trades
- reuse existing bot relation and scope helpers
- keep the change small and reversible

## Implementation Plan
1. Add a small helper for created-position wallet attribution.
2. Persist new PAPER bot positions with `walletId=null` so they use the
   existing bot-scoped partial unique index.
3. Adjust PAPER capital open/closed position reads to use `botId` instead of
   `walletId+botId`.
4. Adjust wallet open-PnL reads so PAPER wallets include positions via
   `position.bot.walletId`.
5. Add DB-free unit coverage for the new helper and query-shape helpers.
6. Run focused tests, typecheck, guardrails, lint, and diff review.

## Acceptance Criteria
- PAPER bot-created positions use the bot-scoped DB uniqueness lane.
- LIVE position persistence remains wallet-scoped.
- PAPER runtime capital still counts the active bot's positions.
- PAPER wallet open-PnL can still include positions owned by bots on that
  wallet.
- Relevant focused tests pass.

## Definition of Done
- [x] PAPER persistence helper is implemented and covered.
- [x] PAPER capital query scope is aligned with bot-scoped positions.
- [x] PAPER wallet PnL query scope is aligned with bot-scoped positions.
- [x] Relevant validation passes.
- [x] Source-of-truth docs/context are synchronized.

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
- Tests: `pnpm --filter api run test -- src/modules/orders/orders.positionScope.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/wallets/wallets.service.test.ts --run` PASS (`23/23`).
- Manual checks: diff reviewed; DB-backed `orders.service.test.ts` regression
  updated but local execution remains blocked by unavailable PostgreSQL on
  `localhost:5432`.
- Screenshots/logs: not applicable
- High-risk checks: LIVE wallet path must remain unchanged

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/06_execution-lifecycle.md`,
  `docs/architecture/07_modes-parity-and-data.md`,
  `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, between PAPER bot-scoped intent and DB wallet
  uniqueness when `Position.walletId` is set.
- Decision required from user: no, because this restores approved mode parity
  without introducing a new system.
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: not applicable
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: not applicable
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: not applicable
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: API tests

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this small persistence/read-scope slice
- Observability or alerting impact: PAPER positions should become visible via
  existing dashboard reads
- Staged rollout or feature flag: not needed

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: PAPER positions with `walletId` enter wallet-scoped DB uniqueness.
- Gaps: RUNTIME-AUDIT-107 aligned lookup scope but not create persistence.
- Inconsistencies: runtime reads are bot-scoped for PAPER, DB uniqueness is
  wallet-scoped when `walletId` is stored.
- Architecture constraints: PAPER internal fill simulation is authority and
  should be bot-scoped; LIVE exchange balance/position authority remains
  wallet-scoped.

### 2. Select One Priority Task
- Selected task: align PAPER position persistence with bot-scoped DB uniqueness.
- Priority rationale: directly follows the PAPER open-position failure path and
  closes an architecture mismatch found in RUNTIME-AUDIT-107 review.
- Why other candidates were deferred: broader production log checks can follow
  after this internal contradiction is removed.

### 3. Plan Implementation
- Files or surfaces to modify: order lifecycle, capital context, wallet
  analytics helper, focused tests, docs/context.
- Logic: PAPER bot positions store `walletId=null`, while order/trade wallet
  attribution remains intact; wallet reads include them through bot relation.
- Edge cases: LIVE unchanged; botless paper orders keep existing wallet/unowned
  behavior.

### 4. Execute Implementation
- Implementation notes: added `resolveCreatedPositionWalletId`, persisted PAPER
  bot positions with `walletId=null`, aligned runtime capital owner scope to
  bot for PAPER, and expanded wallet open-PnL scope to include PAPER positions
  through `position.bot.walletId`.

### 5. Verify and Test
- Validation performed: focused unit pack, API typecheck, guardrails, lint, and
  diff check.
- Result: PASS for available local checks. DB-backed regression remains
  infra-blocked by local PostgreSQL unavailability.

### 6. Self-Review
- Simpler option considered: schema migration for mode-specific uniqueness was
  rejected for this slice because `Position` does not currently carry mode and
  the existing bot-scoped index already supports the intended PAPER lane.
- Technical debt introduced: no
- Scalability assessment: uses existing relation ownership instead of a new
  attribution table.
- Refinements made: updated the DB-backed shared-wallet PAPER regression to
  expect `Position.walletId=null` and wallet visibility through bot relation.

### 7. Update Documentation and Knowledge
- Docs updated: task doc, MVP execution plan, MVP next commits.
- Context updated: project state and task board.
- Learning journal updated: not applicable

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

## Result Report

- Task summary: PAPER bot positions now persist in the DB bot-scoped uniqueness
  lane while wallet/capital reads still include them through existing bot
  ownership.
- Files changed: `orders.lifecycle.service.ts`,
  `orders.positionScope.test.ts`, `runtimeCapitalContext.service.ts`,
  `runtimeCapitalContext.service.test.ts`, `wallets.service.ts`,
  `wallets.service.test.ts`, `orders.service.test.ts`, and planning/context
  docs.
- How tested: focused API unit pack (`23/23`), API typecheck, guardrails, lint,
  and diff check.
- What is incomplete: DB-backed `orders.service.test.ts` cannot run locally
  until PostgreSQL is available on `localhost:5432`.
- Next steps: after deploy, observe PAPER bot position creation and run the
  DB-backed regression in a DB-enabled environment.
- Decisions made: keep order/trade wallet attribution, but store PAPER bot
  positions with `Position.walletId=null` to use the existing bot-scoped unique
  index.
