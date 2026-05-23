# Task

## Header
- ID: PAPERSIGNAL-01
- Title: Canonical runtime symbol-stats context for PAPER/LIVE parity
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: BOTMULTI-05, BOTMULTI-07
- Priority: P0
- Iteration: 2026-05-03 operator runtime audit follow-up
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reports that PAPER bots still show incorrect signal data and do
not open expected positions. During the audit, runtime execution was found to
use canonical `BotMarketGroup` + `MarketGroupStrategyLink` topology, while the
symbol-stats read model still loaded only legacy `Bot.symbolGroup` and
`Bot.strategy` projections.

## Goal
Make runtime symbol-stats display use the same canonical market scope and
strategy-link context as PAPER/LIVE runtime execution.

## Scope
- `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts`
- canonical context docs and task board updates

## Success Signal
- User or operator problem: dashboard signal rows no longer describe stale
  legacy strategy/market context when runtime evaluates canonical links.
- Expected product or reliability outcome: PAPER and LIVE monitoring reflects
  the same bot market and strategy graph used by execution.
- How success will be observed: regression test proves canonical active
  `BotMarketGroup` strategy links are preferred over legacy projections.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified code and test change for symbol-stats display-to-execution topology
parity.

## Constraints
- reuse canonical BOTMULTI topology
- keep legacy fallback for old rows without canonical groups
- do not change execution semantics in this slice
- do not introduce a parallel strategy assignment system

## Implementation Plan
1. Compare runtime execution topology with runtime symbol-stats read model.
2. Extend bot context query to load active canonical market group and enabled
   strategy links.
3. Prefer canonical symbol group, strategy links, and strategy configs when
   composing symbol-stats configured context.
4. Keep legacy `Bot.strategy` / `Bot.symbolGroup` fallback.
5. Add focused regression coverage and run runtime parity validation.

## Acceptance Criteria
- [x] Symbol-stats configured symbols come from active canonical market group
  when present.
- [x] Symbol-stats configured strategies come from enabled canonical strategy
  links when present.
- [x] Legacy fallback remains available when canonical groups are absent.
- [x] Focused symbol-stats and final-candle tests pass.
- [x] API typecheck passes.
- [x] Guardrails pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` standards satisfied for the touched slice.
- [x] Validation evidence is recorded below.
- [x] Context and task board are updated.
- [ ] Commit is created only after required gates pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated runtime topology logic
- temporary bypasses
- production mutation during audit

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts --run`
    PASS (`4` files / `18` tests).
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.market-universe-contract.e2e.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts --run`
    PASS (`4` files / `60` tests).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run docs:parity:check` PASS.
- Manual checks: production deployment remains on `535706e3`, so this local
  fix is not production-smoked yet.
- Screenshots/logs: not applicable
- High-risk checks: no exchange writes or live order actions.

## Architecture Evidence
- Architecture source reviewed: `docs/pipelines/runtime-signal-execution.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`,
  `docs/modules/api-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, symbol-stats read model used legacy projections
  after runtime execution moved to canonical BOTMULTI topology.
- Decision required from user: no
- Follow-up architecture doc updates: task/context updates only; canonical
  behavior was already defined.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: production readback remains pending after deployment
- Rollback note: revert this commit to restore previous legacy-only read model.
- Observability or alerting impact: dashboard monitoring data only
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: PAPER/LIVE execution topology and symbol-stats display topology could
  diverge after BOTMULTI.
- Gaps: production authenticated readback is pending because latest commits are
  not deployed.
- Inconsistencies: symbol-stats used legacy `Bot.strategy` and
  `Bot.symbolGroup`; execution uses `BotMarketGroup.strategyLinks`.
- Architecture constraints: one active market group and ordered enabled
  strategy links are canonical.

### 2. Select One Priority Task
- Selected task: align symbol-stats configured context with canonical runtime
  topology.
- Priority rationale: it directly addresses reported PAPER signal display
  mismatch and reduces false conclusions about why positions did not open.
- Why other candidates were deferred: LIVE production readback is blocked until
  deploy; wallet balance is separate UI/API chain.

### 3. Plan Implementation
- Files or surfaces to modify: runtime bot read repository, symbol-stats
  service, focused test, docs/context.
- Logic: prefer active canonical market group and enabled strategy links, keep
  legacy fallback.
- Edge cases: no canonical group, multi-strategy links, stale signal strategy,
  configured fallback mode.

### 4. Execute Implementation
- Implementation notes: added a small exported resolver so topology preference
  is directly testable without duplicating service I/O.

### 5. Verify and Test
- Validation performed: focused tests and API typecheck.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: changing only `configuredStrategyBySymbol`.
  Rejected because symbols, venue, snapshots, and strategies all need the same
  canonical source.
- Technical debt introduced: no
- Scalability assessment: aligns monitoring with the core topology needed for
  future exchange adapters.
- Refinements made: legacy fallback preserved.

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
This slice fixes monitoring/display parity. It does not claim that every
reported PAPER non-open is solved without production/session readback; the next
audit step is to inspect current `PRETRADE_BLOCKED`, merge, and orchestration
events after deploy access is available.

## Product / Discovery Evidence
- Problem validated: partially
- User or operator affected: account owner operating PAPER and LIVE bots
- Existing workaround or pain: manual comparison of dashboard conditions and
  missing positions
- Smallest useful slice: align displayed configured context with execution
  topology
- Success metric or signal: signal cards refer to canonical bot market/strategy
  graph
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: authenticated runtime readback

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: runtime monitoring and signal-to-position diagnosis
- SLI: symbol-stats configured context parity with runtime topology
- SLO: not formally defined
- Error budget posture: burning
- Health/readiness check: production public health/readiness passed before this
  task; latest commits not deployed
- Logs, dashboard, or alert route: runtime monitoring dashboard
- Smoke command or manual smoke: pending production deployment
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: runtime bot/strategy metadata
- Trust boundaries: user-owned bot/session reads
- Permission or ownership checks: unchanged
- Abuse cases: no cross-user reads introduced
- Secret handling: no secrets stored
- Security tests or scans: pending guardrails
- Fail-closed behavior: missing canonical context falls back to existing legacy
  behavior
- Residual risk: production session-specific cause of non-open still needs
  readback.

## Result Report
- Task summary: Runtime symbol-stats now uses canonical active bot market
  group and enabled strategy links before legacy bot projections.
- Files changed:
  - `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/LEARNING_JOURNAL.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/papersignal-01-canonical-symbol-stats-parity-task-2026-05-03.md`
- How tested: focused symbol-stats/final-candle/paper-live pack, broader
  bot-runtime pack, API typecheck, guardrails, and docs parity passed.
- What is incomplete: production/session-specific PAPER non-open evidence
  still needs authenticated readback after deploy.
- Next steps: deploy latest commits, then inspect live runtime events for
  `PRETRADE_BLOCKED`, merge, dedupe, and orchestration outcomes.
- Decisions made: symbol-stats configured context must prefer canonical active
  market group and enabled strategy links.
