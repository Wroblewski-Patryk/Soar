# Task

## Header
- ID: RUNTIME-AUDIT-109
- Title: Block PAPER wallet reset on bot-scoped open positions
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-108
- Priority: P0
- Iteration: 109
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
RUNTIME-AUDIT-108 moved PAPER bot-created positions into the bot-scoped DB
uniqueness lane by persisting `Position.walletId=null` and `Position.botId`.
The PAPER wallet reset guard still counted only `Position.walletId=<wallet>`,
so it could miss active bot-scoped PAPER positions attached to the wallet
through `Bot.walletId`.

## Goal
Ensure PAPER wallet reset is fail-closed whenever the wallet has active
`IN_SYNC` open positions, including positions owned through bots that use the
wallet.

## Success Signal
- User or operator problem: dashboard/runtime capital cannot be reset while a
  paper bot still owns an active position.
- Expected product or reliability outcome: wallet reset truth matches runtime
  position ownership after bot-scoped PAPER persistence.
- How success will be observed: reset guard query includes both direct wallet
  positions and bot-owned positions for the wallet.
- Post-launch learning needed: yes.

## Deliverable For This Stage
Implement the smallest safe reset-guard query change and a focused unit test
for the PAPER bot-owned position scope.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] PAPER reset open-position guard includes bot-owned positions through
  `bot.walletId`.
- [x] Existing direct wallet-position reset behavior remains covered.
- [x] Focused tests, API typecheck, guardrails, lint, and diff review pass or
  any unavailable checks are explicitly recorded.

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
  - `pnpm --filter api run test -- src/modules/wallets/wallets.service.test.ts --run` PASS (`3/3`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: code diff/self-review PASS
- Screenshots/logs: not applicable
- High-risk checks: reset query remains fail-closed for `OPEN` + `IN_SYNC`
  direct wallet and bot-owned positions; stale `ORPHAN_LOCAL` rows remain
  ignored by the unchanged sync-state guard.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/reference/position-lifecycle-parity-matrix.md`
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
- Rollback note: revert this commit to restore previous reset guard behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: PAPER bot positions now persist without direct `walletId`, while
  `resetPaperWallet` still counts only direct wallet positions.
- Gaps: no unit-level reset query helper test covered bot-owned PAPER
  positions.
- Inconsistencies: wallet open-PnL was already updated to include bot-owned
  PAPER positions, but reset safety was not.
- Architecture constraints: PAPER and LIVE share lifecycle semantics, but
  PAPER execution may differ in fill model and account balance authority.

### 2. Select One Priority Task
- Selected task: align PAPER reset open-position guard with bot-scoped PAPER
  positions.
- Priority rationale: money/runtime safety; reset must fail closed while active
  business truth exists.
- Why other candidates were deferred: wider dashboard/runtime audits continue
  after this one high-impact guard is closed.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.service.test.ts`
  - project planning/context files
- Logic: introduce/reuse a reset open-position where helper that matches direct
  wallet positions and PAPER bot-owned positions through `bot.walletId`.
- Edge cases: stale `ORPHAN_LOCAL` rows must remain ignored; direct
  wallet-scoped open positions must remain blocking.

### 4. Execute Implementation
- Implementation notes: exported `buildPaperResetOpenPositionsWhere` and used
  it in `resetPaperWallet` so the position count checks direct wallet
  ownership and bot ownership through `bot.walletId`.

### 5. Verify and Test
- Validation performed: focused wallet service unit test, API typecheck,
  repository guardrails, lint, and `git diff --check`.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: inline the `OR` directly in `resetPaperWallet`;
  rejected because the exported helper gives stable unit coverage without a DB.
- Technical debt introduced: no
- Scalability assessment: sufficient for current direct-wallet plus bot-wallet
  PAPER ownership contract.
- Refinements made: kept order reset guard unchanged because PAPER orders still
  retain wallet attribution.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - this task contract
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
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
This task follows the ownership contract established by RUNTIME-AUDIT-108:
PAPER bot position rows may be bot-scoped for uniqueness while wallet-level
operator actions must still see them through the bot-wallet relation.

## Production-Grade Required Contract

### Goal
Prevent PAPER wallet reset from ignoring bot-scoped open positions.

### Scope
- API service: `apps/api/src/modules/wallets/wallets.service.ts`
- Unit tests: `apps/api/src/modules/wallets/wallets.service.test.ts`
- Docs/context: planning queue, task board, project state

### Implementation Plan
1. Add a shared where-builder for paper reset open-position checks.
2. Use it in `resetPaperWallet`.
3. Add focused unit coverage for direct wallet and bot-owned PAPER positions.
4. Run focused tests and repository validation.
5. Update project context and planning evidence.

### Acceptance Criteria
- PAPER reset open-position query matches direct wallet positions.
- PAPER reset open-position query matches bot-owned positions via
  `bot.walletId`.
- Query still requires `status=OPEN` and `syncState=IN_SYNC`.

### Definition of Done
Use `DEFINITION_OF_DONE.md`; record every applicable validation and residual
risk before closing.

### Result Report
Closed locally. PAPER wallet reset now counts active `OPEN` + `IN_SYNC`
positions directly assigned to the wallet and positions owned by bots using the
wallet. This preserves the reset fail-closed contract after PAPER bot positions
became bot-scoped in persistence. Files changed:
`apps/api/src/modules/wallets/wallets.service.ts`,
`apps/api/src/modules/wallets/wallets.service.test.ts`,
`.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
`docs/planning/mvp-next-commits.md`,
`docs/planning/mvp-execution-plan.md`, and this task contract. Validation PASS:
focused wallet service unit suite (`3/3`), API typecheck, repository
guardrails, lint, and diff review. Residual risk: DB-backed reset e2e was not
run in this slice because the existing local PostgreSQL dependency has been
unavailable in this environment; helper-level query coverage is reproducible
without DB.
