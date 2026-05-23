# Task

## Header
- ID: RUNTIME-AUDIT-110
- Title: Preserve PAPER bot-scoped wallet null during manual close
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-108
- Priority: P0
- Iteration: 110
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
RUNTIME-AUDIT-108 made PAPER bot-created positions persist in bot scope with
`Position.walletId=null`. Manual dashboard close for runtime positions has a
recovery step that backfills a missing `walletId` from the bot wallet before
closing. That recovery is appropriate for LIVE imported/recovered ownership,
but it can rewrite PAPER bot-scoped positions back into wallet scope.

## Goal
Keep PAPER bot-scoped positions in the bot-scoped persistence lane during
manual dashboard close while preserving LIVE ownership recovery behavior.

## Success Signal
- User or operator problem: dashboard close must not mutate PAPER position
  ownership into the old wallet-scoped shape.
- Expected product or reliability outcome: PAPER position uniqueness, wallet
  dashboard reads, reset guards, and close history keep the same ownership
  model.
- How success will be observed: PAPER manual-close path does not issue a
  wallet backfill update for direct bot-owned positions with `walletId=null`.
- Post-launch learning needed: yes.

## Deliverable For This Stage
Implement the smallest backfill guard change and a focused unit regression for
PAPER manual close.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] PAPER manual close does not backfill `walletId` onto bot-scoped
  positions.
- [x] LIVE imported ownership recovery remains covered.
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
  - `pnpm --filter api run test -- src/modules/bots/runtimeSessionPositionCommand.service.test.ts --run` PASS (`11/11`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: code diff/self-review PASS
- Screenshots/logs: not applicable
- High-risk checks: PAPER close keeps durable `Position.walletId=null` while
  still passing bot wallet context to close orchestration; existing LIVE
  imported recovery tests still pass and verify wallet backfill remains.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
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
- Rollback note: revert this commit to restore previous manual-close backfill.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual close backfills missing `walletId` regardless of bot mode.
- Gaps: no unit regression covered direct PAPER bot-owned positions with
  `walletId=null`.
- Inconsistencies: PAPER creation and wallet reads expect bot-scoped
  persistence, while manual close could rewrite that row into wallet scope.
- Architecture constraints: manual and bot-originated entries share lifecycle
  truth; PAPER uses simulated execution but must preserve the same durable
  lifecycle semantics.

### 2. Select One Priority Task
- Selected task: restrict manual-close wallet backfill to LIVE recovery.
- Priority rationale: ownership mutation on a money-impacting close path can
  reintroduce the exact PAPER scope drift fixed in RUNTIME-AUDIT-108.
- Why other candidates were deferred: wider realized-PnL/cashflow investigation
  remains separate and should not be mixed with this ownership fix.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
  - project planning/context files
- Logic: allow missing-wallet backfill only in LIVE mode; keep PAPER
  bot-scoped rows as `walletId=null`.
- Edge cases: LIVE imported ownership claim must still backfill wallet and
  strategy; PAPER close must still orchestrate using the bot wallet context.

### 4. Execute Implementation
- Implementation notes: changed manual close missing-wallet backfill to require
  `botContext.mode === 'LIVE'`. Added a PAPER regression proving no
  `position.updateMany` ownership rewrite occurs for a direct bot-owned
  `walletId=null` position.

### 5. Verify and Test
- Validation performed: focused runtime session position command unit suite,
  API typecheck, repository guardrails, lint, and `git diff --check`.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: remove wallet backfill entirely; rejected because
  LIVE imported ownership recovery still needs it.
- Technical debt introduced: no
- Scalability assessment: fits the current approved PAPER/LIVE ownership split.
- Refinements made: test asserts close orchestration still receives bot wallet
  context so runtime execution is not deprived of wallet/capital context.

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

## Production-Grade Required Contract

### Goal
Prevent manual dashboard close from rewriting PAPER bot-scoped positions into
wallet scope.

### Scope
- API service: `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
- Unit tests: `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
- Docs/context: planning queue, task board, project state

### Implementation Plan
1. Restrict manual-close missing-wallet backfill to LIVE mode.
2. Add PAPER regression coverage for direct bot-owned `walletId=null` close.
3. Run focused tests and repository validation.
4. Update project context and planning evidence.

### Acceptance Criteria
- PAPER manual close leaves `walletId=null` on direct bot-owned positions.
- LIVE imported recovery still backfills wallet ownership.
- Close orchestration still receives wallet context from the bot.

### Definition of Done
Use `DEFINITION_OF_DONE.md`; record every applicable validation and residual
risk before closing.

### Result Report
Closed locally. Manual dashboard close now backfills missing position
`walletId` only in LIVE recovery paths, so PAPER bot-scoped positions remain
in the `Position.walletId=null` persistence lane while close orchestration
still receives wallet context from the bot. Files changed:
`apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`,
`apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`,
`.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
`docs/planning/mvp-next-commits.md`,
`docs/planning/mvp-execution-plan.md`, and this task contract. Validation PASS:
focused runtime session position command suite (`11/11`), API typecheck,
repository guardrails, lint, and diff review. Residual risk: DB-backed
end-to-end close smoke was not run in this local slice; the service-level test
covers the ownership mutation and orchestration contract without PostgreSQL.
