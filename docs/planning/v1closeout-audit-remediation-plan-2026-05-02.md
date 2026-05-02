# V1CLOSEOUT-AUDIT-A - V1 Closeout Audit Remediation Plan

## Header
- ID: V1CLOSEOUT-AUDIT-A
- Title: planning(release): plan remediation from full V1 closeout audits
- Task Type: release
- Current Stage: verification
- Status: IN_PROGRESS
- Owner: Planning Agent
- Depends on: V1RUNTIME-TRUST-03, V1COVER-03, V1FINAL-01
- Priority: P0
- Iteration: 2026-05-02 V1 closeout audit remediation
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected for this planning commit: convert
  the audit findings into an executable remediation queue.
- [x] Operation mode matches the audit-and-release focus.
- [x] The task is aligned with repository source-of-truth documents.

## Context
A full V1 closeout audit was executed on 2026-05-02 before planning the final
implementation work. The repository is broadly implemented, but the latest
validation pass found confirmed API/runtime regressions, release-gate evidence
blockers, one docs parity drift, and one architecture-boundary concern that
must be handled before V1 can be declared ready.

Canonical sources reviewed:
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `.agents/workflows/general.md`
- `.agents/workflows/subagent-orchestration.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `docs/planning/open-decisions.md`
- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- `docs/operations/v1-function-coverage-audit-2026-05-01.md`
- `docs/operations/v1-function-implementation-readiness-audit-2026-05-01.md`
- `DEFINITION_OF_DONE.md`
- `INTEGRATION_CHECKLIST.md`
- `DEPLOYMENT_GATE.md`
- `AI_TESTING_PROTOCOL.md`

## Goal
Define every known V1 closeout remediation task in enough detail that the next
execution runs can implement exactly one small slice at a time, verify it, and
advance toward a final V1 go/no-go without losing any audit finding.

## Scope
- Planning and context only:
  - `docs/planning/v1closeout-audit-remediation-plan-2026-05-02.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- No production code changes in this planning commit.
- No release artifact regeneration in this planning commit.

## Audit Evidence

### Passing Gates
- `pnpm run quality:guardrails` => PASS.
- `pnpm run typecheck` => PASS.
- `pnpm run build` => PASS.
- `pnpm i18n:audit:route-reachable:web` => PASS, `findings=0`.
- `pnpm --filter web run test -- --run` => PASS, `139` files and `394` tests.

### Failing Gates
- `pnpm run docs:parity:check` => FAIL because the checker looks for
  `docs/architecture/dashboard-route-map.md`, while the current canonical route
  map exists at `docs/architecture/reference/dashboard-route-map.md`.
- `pnpm --filter api run test -- --run` => FAIL.
- Focused reruns confirmed the API failures are real and not only full-suite
  parallelism noise:
  - `src/modules/wallets/wallets.crud.e2e.test.ts`
  - `src/modules/engine/lifecycleCloseParity.golden.test.ts`
  - `src/modules/bots/bots.e2e.test.ts`
  - `src/modules/orders/orders-positions.e2e.test.ts`
  - `src/modules/positions/positions.orphan-repair.e2e.test.ts`

## Execution Update - 2026-05-02
- `V1CLOSEOUT-01..06` are implemented and verified. The P0 API failures were
  resolved by aligning stale external-management fixtures to the canonical
  `Bot.manageExternalPositions` authority, fixing positive advanced TSL
  parsing parity in backtests, tightening runtime trades open-anchor scoping,
  allowing direct bot trade rows without `positionId`, and preserving pre-arm
  dynamic TSL truth.
- `V1CLOSEOUT-07` is implemented and verified. Docs parity now reads the
  canonical dashboard route map from
  `docs/architecture/reference/dashboard-route-map.md`, and the missing
  `apps/web/src/features/shared` module inventory/deep-dive entry is
  published.
- Verification evidence:
  - `pnpm --filter api run typecheck` => PASS.
  - focused API closeout pack => PASS, `8` files / `91` tests.
  - `pnpm --filter api run test -- --run` => PASS.
  - `pnpm run docs:parity:check` => PASS, API `22/22`, Web `16/16`, Routes
    `38/38`.
  - `pnpm run quality:guardrails` => PASS.
- Remaining release closeout work starts at `V1CLOSEOUT-08`: RC signoff,
  release-gate evidence, production restore drill, stage/prod evidence, and
  exchange-boundary architecture remediation remain open.

## Confirmed Findings

### P0 Runtime And API Contract Failures
1. LIVE wallet creation does not persist the external-position management flag
   expected by the current contract.
2. `advanced-tsl` lifecycle close parity is broken in the backtest path; the
   golden fixture expects `trailing_stop`, but backtest produces no close
   reason.
3. Runtime monitoring trades totals and symbol filters are not stable in
   `bots.e2e.test.ts`.
4. Runtime position serialization exposes a dynamic TSL stop before the
   trailing stop is armed.
5. Manual LIVE MARKET order visibility through exchange-synced adoption is not
   truthful in the runtime read model.
6. `EXCHANGE_SYNC BOT_MANAGED` LIVE positions can disappear from the selected
   bot runtime surface when a PAPER bot shares the same symbol.
7. Closing an exchange-synced bot-managed LIVE runtime position from the
   dashboard flow returns `ignored` instead of `closed`.
8. Orphan repair re-imports exchange truth without restoring canonical
   `botId` and `walletId`.
9. The first `orders-positions` test can fail because expected seeded users are
   unavailable, so the fixture setup or cleanup contract needs review while
   fixing the runtime failures.

### P0 Release Gate Failures
1. The latest release gate artifact remains `not_ready` because activation
   audit evidence is stale.
2. The activation plan evidence is stale.
3. The production backup/restore drill wrapper failed because the production DB
   container configuration is unavailable in the current execution context.
4. Stage remains an external blocker until the stage API and web services are
   restored or an explicit V1 decision records stage as waived.

### P0 RC Evidence Drift
1. `docs/operations/v1-rc-signoff-record.md` says `RC status: BLOCKED`.
2. Checklist/status artifacts still imply Gate 4 approval.
3. The signoff/checklist/status toolchain must be regenerated or fixed from the
   current signoff truth before release.

### P1 Architecture Boundary Concern
The architecture states that feature modules outside `modules/exchange` must
not import exchange SDKs or embed exchange REST endpoints directly. Static
audit found direct Binance endpoint or `ccxt` usage outside the exchange
boundary in:
- `apps/api/src/modules/backtests/backtestDataGateway.ts`
- `apps/api/src/modules/bots/runtimeMarketDataFallback.service.ts`
- `apps/api/src/modules/engine/runtimeSignalMarketDataGateway.ts`
- `apps/api/src/modules/profile/apiKey/binanceApiKeyProbe.service.ts`

This is a conformance finding. The next run must either refactor those seams
into approved exchange adapters or stop for an explicit architecture exception
decision.

### P2 Cleanup Debt
- Production code still has a small amount of `any` and local eslint disables.
- These are not current V1 release blockers unless touched by the P0 fixes.

## Remediation Queue

### V1CLOSEOUT-01 - Fix LIVE External Management Ownership Persistence
- Type: fix
- Priority: P0
- Owner: Backend Builder
- Current Stage: READY
- Scope:
  - `apps/api/src/modules/wallets/*`
  - `apps/api/src/modules/bots/*` only if ownership authority currently lives
    on `Bot.manageExternalPositions`
  - `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
- Goal: resolve the contract mismatch where the LIVE wallet test expects
  `manageExternalPositions=true`, while current singular-bot architecture may
  intentionally hold that authority on the bot.
- Implementation Plan:
  1. Review the current architecture decision from `V1TAKE-10`.
  2. Decide whether the failing test is stale or the API response contract is
     wrong.
  3. If the test is stale, update it to assert the bot-level authority and
     ensure wallet responses do not imply control they no longer own.
  4. If the code is wrong, persist and expose the field through the approved
     owner without duplicating authority.
- Acceptance Criteria:
  - The contract has one source of truth for external-position management.
  - The focused wallet test passes.
  - No wallet/bot authority duplication is introduced.
- Validation:
  - `pnpm --filter api run test -- src/modules/wallets/wallets.crud.e2e.test.ts --run`
  - Related bot takeover/runtime tests if ownership semantics change.
  - `pnpm --filter api run typecheck`

### V1CLOSEOUT-02 - Restore Backtest Advanced TSL Close Parity
- Type: fix
- Priority: P0
- Owner: Backend Builder
- Current Stage: READY
- Scope:
  - `apps/api/src/modules/engine/*`
  - `apps/api/src/modules/backtests/*`
  - `apps/api/src/modules/engine/lifecycleCloseParity.golden.test.ts`
- Goal: restore identical close-reason sequences for advanced TSL across
  BACKTEST, PAPER, and LIVE.
- Implementation Plan:
  1. Inspect the `advanced-tsl` golden fixture and current shared lifecycle
     stop calculation.
  2. Identify whether the backtest path skips trailing-stop arming, stop
     evaluation, or close-reason mapping.
  3. Reuse the existing shared lifecycle engine; do not add a backtest-only
     workaround.
  4. Add or update focused regression coverage if the golden test is too broad
     to explain the root cause.
- Acceptance Criteria:
  - `advanced-tsl` backtest returns `trailing_stop` when PAPER and LIVE do.
  - No divergence is introduced for `TP`, `SL`, `TTP`, or DCA cases.
- Validation:
  - `pnpm --filter api run test -- src/modules/engine/lifecycleCloseParity.golden.test.ts --run`
  - Focused replay/runtime lifecycle tests touched by the fix.
  - `pnpm --filter api run typecheck`

### V1CLOSEOUT-03 - Repair Runtime Monitoring Trades And Dynamic TSL Serialization
- Type: fix
- Priority: P0
- Owner: Backend Builder
- Current Stage: READY
- Scope:
  - `apps/api/src/modules/bots/*runtime*`
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
- Goal: restore deterministic runtime monitoring totals, symbol filters, and
  pre-arm dynamic TSL truth.
- Implementation Plan:
  1. Inspect monitoring read filters for session window, ownership, status,
     symbol, and limit handling.
  2. Verify whether test data setup creates overlapping trades or if the read
     query includes rows outside the selected session.
  3. Fix the read model to apply one canonical scope and deterministic ordering.
  4. Inspect dynamic TTP/TSL serialization and ensure TSL is `null` before the
     runtime trailing state is actually armed.
  5. Reuse the existing runtime protection state contract; do not reintroduce
     display-only sticky fallback stops.
- Acceptance Criteria:
  - Monitoring summary ownership isolation returns the expected trade total.
  - Symbol filters report correct `total` while respecting `limit`.
  - `dynamicTslStopLoss` is `null` before arm and populated after arm.
- Validation:
  - `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts --run`
  - Related runtime position serialization tests.
  - `pnpm --filter api run typecheck`

### V1CLOSEOUT-04 - Restore Exchange-Synced LIVE Position Visibility And Close Flow
- Type: fix
- Priority: P0
- Owner: Backend Builder
- Current Stage: READY
- Scope:
  - `apps/api/src/modules/orders/*`
  - `apps/api/src/modules/positions/*`
  - `apps/api/src/modules/bots/*runtime*`
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- Goal: make selected-bot LIVE runtime truth stable for manual LIVE MARKET
  adoption, exchange-synced bot-managed visibility, and dashboard close
  actions.
- Implementation Plan:
  1. Inspect selected-bot runtime position ownership resolution for
     `EXCHANGE_SYNC BOT_MANAGED` rows.
  2. Verify paper/live same-symbol scoping uses canonical wallet, bot, and
     mode context instead of broad `userId + symbol`.
  3. Ensure manual LIVE MARKET submitted orders remain visible until exchange
     adoption and do not duplicate or disappear.
  4. Ensure dashboard close command chooses the exchange-synced position
     deterministically and returns `closed` only after the approved command
     path succeeds.
  5. Fix the seeded-user setup issue in the same file if it is part of the
     fixture contract.
- Acceptance Criteria:
  - Manual LIVE order visibility stays truthful before and after exchange sync.
  - LIVE bot-managed exchange-synced positions remain visible when PAPER shares
    the symbol.
  - Dashboard close of selected exchange-synced LIVE position returns `closed`.
  - Test setup is deterministic.
- Validation:
  - `pnpm --filter api run test -- src/modules/orders/orders-positions.e2e.test.ts --run`
  - Related bot runtime/takeover tests.
  - `pnpm --filter api run typecheck`

### V1CLOSEOUT-05 - Restore Orphan Repair Canonical Rebinding
- Type: fix
- Priority: P0
- Owner: Backend Builder
- Current Stage: READY
- Scope:
  - `apps/api/src/modules/positions/*`
  - `apps/api/src/modules/positions/positions.orphan-repair.e2e.test.ts`
- Goal: ensure repair re-imports exchange truth with restored canonical
  `botId` and `walletId` when evidence is sufficient.
- Implementation Plan:
  1. Inspect current orphan repair candidate selection and exchange-truth import
     path.
  2. Verify whether the reimport path bypasses the existing deterministic bot
     owner resolver.
  3. Reuse the approved recovery/rebinding mechanism from restart continuity
     work.
  4. Keep fail-closed behavior when canonical ownership evidence is ambiguous.
- Acceptance Criteria:
  - Canonical local orphans are rebound.
  - Detached blockers are closed only through approved repair semantics.
  - Reimported exchange truth restores `botId` and `walletId` when evidence is
    deterministic.
- Validation:
  - `pnpm --filter api run test -- src/modules/positions/positions.orphan-repair.e2e.test.ts --run`
  - Related restart continuity tests if touched.
  - `pnpm --filter api run typecheck`

### V1CLOSEOUT-06 - Restore Full API Suite Green
- Type: test
- Priority: P0
- Owner: QA/Test
- Current Stage: READY
- Depends on: V1CLOSEOUT-01, V1CLOSEOUT-02, V1CLOSEOUT-03, V1CLOSEOUT-04,
  V1CLOSEOUT-05
- Scope:
  - API test suite and any fixture cleanup touched by previous tasks.
- Goal: prove the P0 runtime fixes are not only focused-green but also
  suite-green.
- Implementation Plan:
  1. Rerun every previously failing focused file.
  2. Run the full API suite.
  3. If new failures appear, classify them as product regression, test fixture
     isolation, or environment issue before changing code.
  4. Capture exact validation evidence in the task file and context.
- Acceptance Criteria:
  - All previously failing focused files pass.
  - `pnpm --filter api run test -- --run` passes.
  - API typecheck passes after all fixes.
- Validation:
  - `pnpm --filter api run test -- --run`
  - `pnpm --filter api run typecheck`

### V1CLOSEOUT-07 - Fix Docs Parity Route-Map Drift
- Type: fix
- Priority: P0
- Owner: Product Docs Agent
- Current Stage: READY
- Scope:
  - docs parity script/config
  - `docs/architecture/reference/dashboard-route-map.md`
  - any canonical docs that still reference the old route-map path
- Goal: make docs parity resolve the canonical dashboard route map path.
- Implementation Plan:
  1. Inspect the parity checker source and route-map path assumptions.
  2. Update the checker or canonical doc reference to the approved
     `docs/architecture/reference/dashboard-route-map.md` path.
  3. Avoid creating a duplicate route-map file unless architecture docs approve
     that location.
- Acceptance Criteria:
  - `pnpm run docs:parity:check` passes.
  - There is one canonical dashboard route-map source.
- Validation:
  - `pnpm run docs:parity:check`
  - `pnpm run quality:guardrails`

### V1CLOSEOUT-08 - Resolve RC Signoff And Release-Gate Evidence Drift
- Type: release
- Priority: P0
- Owner: Ops/Release
- Current Stage: READY
- Depends on: V1CLOSEOUT-06, V1CLOSEOUT-07
- Scope:
  - `docs/operations/v1-rc-signoff-record.md`
  - `docs/operations/v1-rc-external-gates-status.md`
  - `docs/operations/v1-release-candidate-checklist.md`
  - release-gate and signoff scripts if their generated output is stale
- Goal: ensure RC status, checklist, external gate status, and release-gate
  artifacts all reflect the current blocked or approved truth consistently.
- Implementation Plan:
  1. Start from the current signoff record and treat `BLOCKED` as canonical
     until fresh evidence says otherwise.
  2. Regenerate checklist and external-gate status with the existing tools.
  3. Fix any parser/checklist bug that marks Gate 4 approved while signoff is
     blocked.
  4. Do not mark V1 ready unless release gate evidence is fresh and green.
- Acceptance Criteria:
  - RC signoff, checklist, and external gate status agree.
  - Gate 4 is not marked approved unless `RC status: APPROVED` is present in
    the current signoff artifact.
  - Release-gate blockers are explicit.
- Validation:
  - Existing RC gate/checklist/signoff commands.
  - `pnpm run quality:guardrails`

### V1CLOSEOUT-09 - Refresh Production Restore Drill And Activation Evidence
- Type: release
- Priority: P0
- Owner: Ops/Release
- Current Stage: READY
- Depends on: V1CLOSEOUT-08
- Scope:
  - production backup/restore drill wrapper configuration
  - activation audit and activation plan evidence
  - `docs/operations/v1-release-gate-*` artifacts
  - `docs/operations/post-deploy-smoke-checklist.md` if smoke steps are stale
- Goal: remove the current release-gate `not_ready` blockers with fresh
  production evidence or explicit documented launch decisions.
- Implementation Plan:
  1. Provide or configure the production DB container variable required by the
     restore drill wrapper.
  2. Rerun the production backup/restore drill and capture fresh evidence.
  3. Refresh activation audit and activation plan evidence.
  4. Rerun final release-gate classification.
  5. Keep stage blocker explicit unless stage is restored or explicitly waived.
- Acceptance Criteria:
  - Backup/restore drill artifact is PASS for the production target.
  - Activation audit and activation plan evidence are fresh.
  - Release-gate artifact no longer reports stale/failed blockers, or the
    remaining blockers are explicitly accepted as release decisions.
- Validation:
  - production restore drill command with target container config.
  - release gate command.
  - public and authenticated production smoke relevant to the changed evidence.

### V1CLOSEOUT-10 - Decide And Remediate Exchange Boundary Direct Access
- Type: refactor
- Priority: P1
- Owner: Backend Builder + Architecture
- Current Stage: READY
- Depends on: V1CLOSEOUT-06
- Scope:
  - `apps/api/src/modules/backtests/backtestDataGateway.ts`
  - `apps/api/src/modules/bots/runtimeMarketDataFallback.service.ts`
  - `apps/api/src/modules/engine/runtimeSignalMarketDataGateway.ts`
  - `apps/api/src/modules/profile/apiKey/binanceApiKeyProbe.service.ts`
  - `apps/api/src/modules/exchange/*`
  - exchange architecture docs if an exception is approved
- Goal: bring direct exchange access back into alignment with the approved
  exchange boundary or record an explicit architecture decision.
- Implementation Plan:
  1. Review `XVENUE-A` closure and current architecture wording.
  2. For each direct endpoint/import, classify whether it is an approved
     boundary adapter, historical leak, or intentional temporary exception.
  3. Refactor leaks into `modules/exchange` services where possible.
  4. If a leak cannot be safely refactored before V1, stop and request an
     explicit architecture decision.
- Acceptance Criteria:
  - No unapproved direct Binance REST or `ccxt` access remains outside
    `modules/exchange`, or the exception is explicitly documented.
  - Existing backtest, runtime market-data, signal, and API-key probe tests
    remain green.
- Validation:
  - Focused exchange/backtest/runtime/profile tests.
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`

### V1CLOSEOUT-11 - Final V1 Go/No-Go Closure Pack
- Type: release
- Priority: P0
- Owner: QA/Test + Ops/Release
- Current Stage: READY
- Depends on: V1CLOSEOUT-01 through V1CLOSEOUT-09
- Scope:
  - final validation commands
  - V1 function coverage ledger status
  - release candidate checklist
  - project state and task board closure sync
- Goal: make a final evidence-backed V1 go/no-go call after P0 code and
  release evidence are green.
- Implementation Plan:
  1. Run the complete validation baseline.
  2. Rerun the production/stage smokes required by release gates.
  3. Update the function coverage ledger statuses for rows touched by this
     remediation wave.
  4. Publish final go/no-go report with exact blockers or approval evidence.
- Acceptance Criteria:
  - Guardrails, docs parity, typecheck, API tests, web tests, build, and
    required go-live smoke pass.
  - RC artifacts agree.
  - Function coverage ledger has no hidden P0 non-green item for V1 launch
    scope.
  - V1 is either explicitly GO with evidence or explicitly NO-GO with the
    remaining blocker list.
- Validation:
  - `pnpm run quality:guardrails`
  - `pnpm run docs:parity:check`
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm --filter api run test -- --run`
  - `pnpm --filter web run test -- --run`
  - `pnpm run build`
  - `pnpm run test:go-live:smoke` when target access is available

## Delivery Order
1. `V1CLOSEOUT-01`
2. `V1CLOSEOUT-02`
3. `V1CLOSEOUT-03`
4. `V1CLOSEOUT-04`
5. `V1CLOSEOUT-05`
6. `V1CLOSEOUT-06`
7. `V1CLOSEOUT-07`
8. `V1CLOSEOUT-08`
9. `V1CLOSEOUT-09`
10. `V1CLOSEOUT-11`
11. `V1CLOSEOUT-10`, unless P1 architecture conformance is promoted to a
    launch blocker by user decision.

## Constraints
- Use existing systems and approved mechanisms.
- Do not introduce new runtime systems without approval.
- Do not implement workaround-only release gates.
- Do not duplicate exchange, runtime, or position ownership logic.
- Stay within the declared task stage for each execution slice.
- For live-money flows, include adversarial and fail-closed validation before
  closure.

## Definition of Done
- [x] Audit findings are translated into named executable tasks.
- [x] Every P0 finding has an owner, scope, implementation plan, acceptance
  criteria, and validation command.
- [x] The plan preserves architecture decision mode for the exchange-boundary
  mismatch.
- [x] Source-of-truth planning and context files are synchronized.
- [ ] Implementation tasks are complete and verified. Not applicable to this
  planning-stage commit.

## Stage Exit Criteria
- [x] The output matches the declared `planning` stage.
- [x] Work from implementation or release stages was not mixed in.
- [x] Risks and assumptions for the next stages are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` => PASS during audit.
  - `pnpm run typecheck` => PASS during audit.
  - `pnpm run build` => PASS during audit.
  - `pnpm --filter web run test -- --run` => PASS during audit.
  - `pnpm --filter api run test -- --run` => FAIL during audit, with focused
    failures listed above.
  - `pnpm run docs:parity:check` => FAIL during audit.
- Manual checks:
  - Static architecture and release-artifact review.
  - Focused reruns of every failing API file.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No live trading action executed during audit or planning.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/modules/system-modules.md`
- Fits approved architecture: partial.
- Mismatch discovered: yes, direct exchange access outside `modules/exchange`.
- Decision required from user: yes, if the direct access cannot be refactored
  safely in `V1CLOSEOUT-10`.
- Approval reference if architecture changed: none.
- Follow-up architecture doc updates: required only if an exception or new
  exchange-boundary shape is approved.

## Deployment / Ops Evidence
- Deploy impact: none for this planning commit; high for later P0 runtime and
  release-gate tasks.
- Env or secret changes: none in this planning commit; production restore drill
  likely needs target container configuration.
- Health-check impact: none in this planning commit.
- Smoke steps updated: planned in `V1CLOSEOUT-09` if stale.
- Rollback note: planning-only commit can be reverted without runtime impact.
- Observability or alerting impact: none in this planning commit.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: API suite red, docs parity red, release gate not ready, RC artifacts
  inconsistent, exchange boundary drift found.
- Gaps: final V1 task queue did not yet reflect the fresh audit failures.
- Inconsistencies: signoff/checklist disagreement and route-map path drift.
- Architecture constraints: exchange-owned behavior must stay inside the
  approved exchange module boundary.

### 2. Select One Priority Task
- Selected task: publish a complete remediation plan before implementation.
- Priority rationale: the user requested all audits first and then a plan to
  execute; implementation before planning would skip the current stage.
- Why other candidates were deferred: all code fixes are represented as
  follow-up tasks.

### 3. Plan Implementation
- Files or surfaces to modify: planning and context files only.
- Logic: convert every confirmed finding into a named execution slice with
  dependencies and validation.
- Edge cases: avoid duplicating already closed tasks and preserve P1
  architecture decision mode.

### 4. Execute Implementation
- Implementation notes: planning artifact and source-of-truth queue updates
  only.

### 5. Verify and Test
- Validation performed: audit validation evidence is recorded; guardrails must
  be rerun after this planning commit.
- Result: pending after edits.

### 6. Self-Review
- Simpler option considered: only add a short checklist to `mvp-next-commits`.
- Technical debt introduced: no.
- Scalability assessment: named tasks support one-slice autonomous execution.
- Refinements made: split runtime failures into focused remediation tasks
  instead of one large API-fix bundle.

### 7. Update Documentation and Knowledge
- Docs updated: this plan, MVP queue, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable; no new recurring pitfall is being
  recorded in this planning commit.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the audit/release focus.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment risks are identified.
- [x] Existing systems are reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached for the planning stage.
- [ ] Relevant validations were run after this planning edit.
- [x] Docs and context were updated because repository truth changed.
- [x] Learning journal update is not applicable.

## Result Report
- Task summary: planned the full V1 closeout remediation queue from the latest
  audit findings.
- Files changed: this planning file plus queue/context source-of-truth files.
- How tested: audit evidence recorded; post-edit guardrails required.
- What is incomplete: implementation tasks and release evidence refresh are
  intentionally not executed in this planning commit.
- Next steps: start with `V1CLOSEOUT-01` and complete exactly one task per
  execution run unless the user approves a larger grouped fix.
- Decisions made: P0 runtime/API failures and release-gate evidence blockers
  must precede final V1 go/no-go; exchange-boundary conformance remains P1
  unless promoted by user decision.
