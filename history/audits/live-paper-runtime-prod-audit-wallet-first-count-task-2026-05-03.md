# Task

## Header
- ID: RUNTIME-AUDIT-01
- Title: Wallet-first imported LIVE position count in runtime signal guards
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: LIVEIMPORT-01, LIVEIMPORT-02
- Priority: P0
- Iteration: 2026-05-03 operator production audit follow-up
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reports that PAPER bots still do not open expected positions and
LIVE bots do not consistently show all exchange-side positions for assigned
markets. The broad audit found one confirmed local runtime drift after
`LIVEIMPORT-01`: imported-position ownership uses wallet-first API-key proof,
but the runtime signal-loop open-position counter still used legacy
`Bot.apiKeyId`.

## Goal
Make LIVE runtime max-open and external-position guard counting use the same
wallet-first API-key proof as imported-position ownership.

## Scope
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
- Runtime signal execution and live imported-position reconciliation pipeline
  docs/context references only.

## Success Signal
- User or operator problem: LIVE runtime no longer undercounts imported
  exchange-side positions for wallet-first bots.
- Expected product or reliability outcome: runtime guard behavior matches
  imported-position ownership for bots whose canonical API key lives on the
  wallet.
- How success will be observed: focused regression test proves
  `wallet.apiKeyId` is used when `bot.apiKeyId` is null.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified code and test change for the first confirmed runtime drift from the
production audit.

## Constraints
- use existing wallet-first ownership mechanisms
- do not introduce new ownership systems
- do not guess ownership by symbol
- keep ambiguous/manual-only fail-closed behavior unchanged

## Implementation Plan
1. Read runtime signal and live import pipeline docs.
2. Compare imported ownership proof with runtime signal guard counting.
3. Update the counter to resolve the effective API key from `wallet.apiKeyId`
   before legacy `Bot.apiKeyId`.
4. Add regression coverage for wallet-first LIVE bots.
5. Run focused tests and repository validation relevant to the touched scope.

## Acceptance Criteria
- [x] Runtime count uses `wallet.apiKeyId` before legacy `Bot.apiKeyId`.
- [x] External count query uses the same effective key prefix.
- [x] Existing legacy-key behavior remains covered.
- [x] Focused runtime tests pass.
- [x] API typecheck passes.
- [x] Guardrails pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` standards satisfied for the touched slice.
- [x] Validation evidence is recorded below.
- [x] Context and task board are updated.
- [x] Commit is created only after required gates pass.

## Forbidden
- new systems without approval
- duplicated ownership logic
- temporary bypasses
- production mutation during audit without explicit release step

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts --run`
    PASS (`2` files / `13` tests).
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts --run`
    PASS (`4` files / `75` tests).
  - `pnpm --filter api exec vitest run src/modules/engine/paperLiveDecisionEquivalence.test.ts --run`
    PASS (`1` file / `2` tests).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run docs:parity:check` PASS.
- Manual checks: public production `/health`, `/ready`, and web build-info were
  checked during audit; authenticated production readback remains pending.
- Screenshots/logs: not applicable
- High-risk checks: secret values were not stored or committed.

## Architecture Evidence
- Architecture source reviewed: `docs/pipelines/live-imported-position-reconciliation.md`,
  `docs/pipelines/runtime-signal-execution.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, runtime signal guard counting used legacy API-key
  proof while ownership uses wallet-first proof.
- Decision required from user: no
- Follow-up architecture doc updates: task/context updates only; architecture
  behavior already required wallet-first proof.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: production authenticated readback remains in
  `LIVEIMPORT-03`
- Rollback note: revert this commit to restore prior legacy-only count behavior.
- Observability or alerting impact: existing runtime events continue to report
  max-open/pre-trade block reasons.
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production is not confirmed to include the latest local LIVE import
  provenance fix; runtime signal guard counting still used legacy bot API key.
- Gaps: authenticated production ETH/DOGE readback requires a secure live
  access path.
- Inconsistencies: imported ownership and runtime count did not share the same
  wallet-first key source.
- Architecture constraints: exact API-key plus symbol proof only.

### 2. Select One Priority Task
- Selected task: fix wallet-first LIVE imported-position count in runtime
  signal guards.
- Priority rationale: it can affect both LIVE import visibility/guardrails and
  PAPER/LIVE signal execution interpretation around max-open state.
- Why other candidates were deferred: PAPER signal parity and wallet dashboard
  balance need separate evidence-backed slices.

### 3. Plan Implementation
- Files or surfaces to modify: runtime signal defaults and focused test.
- Logic: resolve effective API key as `bot.wallet.apiKeyId ?? bot.apiKeyId`.
- Edge cases: null wallet, null API key, legacy bot API key, symbol scoping.

### 4. Execute Implementation
- Implementation notes: reused existing ownership index and symbol lister.

### 5. Verify and Test
- Validation performed: focused runtime/defaults and ownership tests,
  final-candle/reconciliation/dynamic-stop tests, paper-live equivalence, API
  typecheck, guardrails, and docs parity.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: changing only the query prefix. Rejected because
  the ownership lister also needs the effective key.
- Technical debt introduced: no
- Scalability assessment: keeps future exchange adapters behind the same
  ownership proof contract.
- Refinements made: regression covers wallet-first null legacy-key case.

### 7. Update Documentation and Knowledge
- Docs updated: this task file.
- Context updated: yes.
- Learning journal updated: yes.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Production credentials were provided by the operator for audit access. They are
treated as secrets and must not be written to repository artifacts.

## Product / Discovery Evidence
- Problem validated: partially
- User or operator affected: account owner operating LIVE and PAPER bots
- Existing workaround or pain: manual observation of missing bot rows/positions
- Smallest useful slice: align runtime count with wallet-first ownership proof
- Success metric or signal: imported LIVE positions are counted in bot scope
  even when `Bot.apiKeyId` is legacy-null.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: authenticated ETH/DOGE readback in
  `LIVEIMPORT-03`

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: LIVE/PAPER runtime signal-to-position path
- SLI: runtime decision correctness for bot-scoped open-position count
- SLO: not formally defined
- Error budget posture: burning
- Health/readiness check: production public `/health` and `/ready` passed
  during audit
- Logs, dashboard, or alert route: existing runtime events
- Smoke command or manual smoke: pending
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: trading/runtime metadata and API-key identity references
- Trust boundaries: authenticated exchange read boundary, user-owned bot/wallet
  scope
- Permission or ownership checks: unchanged userId/botId ownership filters
- Abuse cases: symbol-only ownership guessing remains forbidden
- Secret handling: no secrets stored
- Security tests or scans: pending guardrails
- Fail-closed behavior: missing effective API key returns direct count only
- Residual risk: production authenticated readback remains pending

## Result Report
- Task summary: Runtime open-position counting for LIVE bots now uses
  `wallet.apiKeyId` before legacy `Bot.apiKeyId`, matching imported-position
  ownership proof.
- Commit: `e1590d61 fix(api-runtime): count live imports with wallet key`.
- Files changed:
  - `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
  - `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
  - `history/audits/live-paper-runtime-prod-audit-wallet-first-count-task-2026-05-03.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/LEARNING_JOURNAL.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused runtime/defaults and ownership tests, final-candle/live
  reconciliation/dynamic-stop tests, paper-live equivalence, API typecheck,
  guardrails, and docs parity all passed.
- What is incomplete: authenticated production ETH/DOGE readback and release
  promotion remain separate tasks because direct SSH was blocked by
  non-interactive key/password auth.
- Next steps: promote local commits and run authenticated production readback,
  then continue `PAPERSIGNAL-01`.
- Decisions made: use wallet-first API key in runtime count.
