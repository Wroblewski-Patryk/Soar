# Task

## Header
- ID: `EXCHANGE2-23-GATEIO-PAPER-PRICING-ENABLE-2026-05-09`
- Title: Enable Gate.io PAPER pricing through shared capability contract
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on:
  - `EXCHANGE2-21-GATEIO-MARKET-STREAM-SOURCE-SMOKE-2026-05-09`
  - `EXCHANGE2-22-GATEIO-PUBLIC-SYMBOL-RULES-2026-05-09`
- Priority: P0
- Iteration: 40
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Gate.io is already registered through the exchange adapter boundaries, has
public market catalog/symbol rules, and has a public polling market-stream
source with real ticker and final-candle smoke evidence. The remaining narrow
paper-runtime gap is the shared compatibility flag and dependent UI/API gates.

## Goal
Enable only `GATEIO` `PAPER_PRICING_FEED` through the existing shared
capability matrix so Gate.io PAPER wallets and PAPER bot activation can use the
approved public market-data path. Keep Gate.io `LIVE_EXECUTION`,
`API_KEY_PROBE`, authenticated reads, live submit, and exchange-side cancel
fail-closed.

## Scope
- `libs/shared/index.js`
- API wallet/bot/runtime capability tests
- Web exchange/wallet/bot capability tests
- exchange architecture and module docs
- task board, project state, and next-step planning docs

## Implementation Plan
1. Flip only `GATEIO.PAPER_PRICING_FEED` to `true` in the shared matrix.
2. Update API and Web regressions from paper-blocked to paper-supported.
3. Preserve placeholder exchange and Gate.io LIVE/authenticated fail-closed
   tests.
4. Update architecture/module/planning docs to record the new truth.
5. Run focused API/Web tests plus guardrails/typecheck where feasible.

## Acceptance Criteria
- `supportsExchangeCapability('GATEIO', 'PAPER_PRICING_FEED')` returns `true`.
- Gate.io PAPER wallet create/update succeeds through the normal API path.
- Gate.io PAPER bot activation succeeds through the normal API path.
- Gate.io LIVE/authenticated capability contracts remain unsupported.
- Unsupported placeholder exchanges still fail closed for PAPER activation.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Code builds without errors for touched packages or an explicit validation
  limitation is recorded.
- [x] Focused API/Web tests prove the new paper support and preserved
  fail-closed behavior.
- [x] Architecture and source-of-truth docs match the delivered capability.

## Forbidden
- enabling Gate.io `LIVE_EXECUTION`
- enabling Gate.io `API_KEY_PROBE` or authenticated reads
- adding direct `ccxt` or exchange access in wallets, bots, or runtime
- silently falling back to Binance data for Gate.io
- treating public paper support as live trading readiness

## Validation Evidence
- Tests:
  - PASS: `apps/web` package-local Vitest for
    `exchangeCapabilities.test.ts`, `BotCreateEditForm.test.tsx`, and
    `WalletCreateEditForm.test.tsx` (`19/19`).
  - PASS: `apps/api` package-local Vitest for
    `runtimeSignalLoop.service.test.ts` (`47/47`).
  - PASS: `apps/api` package-local Vitest for
    `wallets.e2e.test.ts` and `wallets.crud.e2e.test.ts` with explicit local
    `DATABASE_URL` (`34/34`).
  - PASS: focused `apps/api` bots e2e filter for Gate.io PAPER and
    placeholder gating with explicit local `DATABASE_URL` (`3/3`, 24 skipped).
  - INFO: full `bots.e2e.test.ts` run passed the new Gate.io PAPER and
    placeholder tests but still has an unrelated pre-existing runtime close
    assertion failure (`409` instead of `200`) in
    `closes open runtime position from dashboard endpoint...`.
  - PASS: API typecheck via package-local `tsc.CMD --noEmit`.
  - PASS: Web typecheck via package-local `tsc.CMD --noEmit`.
  - PASS: `node scripts/repoGuardrails.mjs`.
  - PASS: `node scripts/checkDocsParity.mjs`.
  - PASS: `git diff --check`.
- Manual checks: static self-review of shared capability matrix and exact
  live/authenticated contracts.
- Screenshots/logs: not applicable
- High-risk checks: Gate.io live/authenticated capabilities remain false.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: user selected Gate.io and asked
  to continue implementing the missing V1 work.
- Follow-up architecture doc updates: pending in this task.

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none expected
- Smoke steps updated: no new smoke command required for this slice
- Rollback note: revert the shared `GATEIO.PAPER_PRICING_FEED` flag and
  dependent tests/docs to re-disable Gate.io PAPER.
- Observability or alerting impact: none
- Staged rollout or feature flag: existing `MARKET_STREAM_EXCHANGE=GATEIO`
  controls the Gate.io polling source selection.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Gate.io public market-data source exists but shared capability still
  blocks PAPER wallets and bot activation.
- Gaps: API/Web tests still assert unsupported paper behavior.
- Inconsistencies: architecture/planning docs say paper pricing remains
  unsupported despite real source evidence now existing.
- Architecture constraints: exchange access must flow through existing exchange
  module boundaries and must not infer live/authenticated support.

### 2. Select One Priority Task
- Selected task: enable Gate.io public PAPER pricing capability.
- Priority rationale: it is the first unblocked implementation gap from the V1
  completion report and directly improves second-exchange usability.
- Why other candidates were deferred: protected production evidence requires
  operator auth; Gate.io authenticated/live support requires separate exact
  operation adapters.

### 3. Plan Implementation
- Files or surfaces to modify: shared capability matrix, focused API/Web tests,
  architecture/module/planning docs, source-of-truth context.
- Logic: use the existing capability contract; no new runtime path.
- Edge cases: placeholder exchanges still unsupported; Gate.io LIVE remains
  unsupported; Gate.io authenticated reads remain unsupported.

### 4. Execute Implementation
- Implementation notes: enabled only `GATEIO.PAPER_PRICING_FEED` in the
  shared matrix, updated API/Web wallet/bot/runtime tests to permit Gate.io
  PAPER, kept placeholder exchange tests and Gate.io LIVE/authenticated
  contracts fail-closed, and synchronized architecture/module/source-of-truth
  docs.

### 5. Verify and Test
- Validation performed: focused Web/API tests, typecheck for API/Web,
  repository guardrails, docs parity, and diff whitespace check.
- Result: PASS for the selected scope. One broader bots e2e test remains
  red outside this task scope and is recorded as residual risk.

### 6. Self-Review
- Simpler option considered: only flipping the flag. Rejected as insufficient
  without API/Web regression and docs parity.
- Technical debt introduced: no.
- Scalability assessment: compatible with the current staged exact-operation
  migration.
- Refinements made: recorded the Corepack signature-verification guardrail and
  used package-local binaries for validation.

### 7. Update Documentation and Knowledge
- Docs updated: architecture exchange matrix, second-exchange readiness plan,
  API/Web module docs, V1 completion gap report, and planning queues.
- Context updated: task board, project state, current focus, next steps.
- Learning journal updated: yes, existing local Vitest/Corepack guardrail.

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
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not changed
- Error state verified: existing unsupported LIVE/auth states preserved
- Refresh/restart behavior verified: capability is static shared config
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: public market data and user-owned wallet/bot config
- Trust boundaries: no secrets or authenticated exchange operations added
- Permission or ownership checks: existing wallet/bot ownership checks reused
- Abuse cases: Gate.io public paper support must not enable live submit or
  authenticated reads.
- Secret handling: no secrets introduced
- Security tests or scans: focused capability tests pending
- Fail-closed behavior: Gate.io LIVE/authenticated paths remain unsupported
- Residual risk: production deployment and authenticated UI clickthrough still
  need separate evidence.

## Result Report
- Task summary: Gate.io public PAPER pricing is enabled through the existing
  shared capability contract; Gate.io PAPER wallet create/update and PAPER bot
  activation now use the normal API/UI paths.
- Files changed: shared capability matrix, API/Web tests, architecture/module
  docs, V1 gap report, planning/context files, and learning journal.
- How tested: see Validation Evidence above.
- What is incomplete: production deploy freshness and authenticated UI
  clickthrough are still required before claiming production-proven Gate.io
  PAPER. Gate.io authenticated reads, live submit, and exchange-side cancel
  remain unimplemented and unsupported.
- Next steps: commit/push this batch, wait for production build-info, then run
  public smoke and plan the next exact Gate.io operation slice or protected V1
  evidence step.
- Decisions made: enable only `GATEIO` `PAPER_PRICING_FEED`; leave every
  money/auth/live operation fail-closed.
