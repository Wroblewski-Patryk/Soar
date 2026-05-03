# Task

## Header
- ID: SYSFINAL-06
- Title: Audit wallets markets strategies and bot setup
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: SYSFINAL-05
- Priority: P0
- Iteration: 7
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`SYSFINAL-05` confirmed order/position workflows. This slice verifies the
configuration workflows that feed runtime: profile API keys, wallets, market
universes, strategies, and bot setup with canonical wallet-first context.

## Goal
Audit setup/config modules so invalid or stale configuration cannot silently
feed runtime execution.

## Success Signal
- User or operator problem: runtime confidence depends on wallet, market,
  strategy, and bot setup being coherent and fail-closed.
- Expected product or reliability outcome: configuration API and web form/table
  tests pass across ownership, validation, active-bot locks, indicator
  metadata, wallet-first bot writes, and runtime scope.
- How success will be observed: focused API config tests and focused web config
  tests pass.
- Post-launch learning needed: no.

## Deliverable For This Stage
Configuration workflow verification artifact with command evidence and
discrepancy classification.

## Scope
- Profile API-key create/test/list/update/rotate/revoke and Binance probe
  mapping.
- Wallet CRUD, metadata, balance preview, paper reset, cashflow classifier.
- Market universe CRUD, catalog, active-bot edit/delete guard, symbol
  composition contract.
- Strategy CRUD, import/export, indicator metadata, active-bot mutation guard.
- Bot CRUD, wallet-first create/update, market-group/strategy-link CRUD,
  duplicate active guard, subscription entitlement, selected-bot runtime scope.
- Web API-key, wallet, market, strategy, and bot form/table surfaces.

## Implementation Plan
1. Review wallet, market, and strategy module docs plus existing bot contract
   docs from prior tasks.
2. Run focused API helper/service tests for config logic.
3. Run DB-backed config e2e files, using explicit API-key encryption env where
   needed.
4. Run focused web config form/table tests.
5. Classify failures before creating fix tasks.
6. Sync queue/context and run guardrails.

## Acceptance Criteria
- Wallet/API-key setup tests pass.
- Market universe and symbol contract tests pass.
- Strategy and indicator metadata tests pass.
- Bot wallet-first and runtime-scope setup tests pass.
- Web configuration form/table tests pass.
- Any confirmed discrepancy becomes a scoped `SYSFIX-*` task.

## Constraints
- Do not implement fixes during audit before classification.
- Do not introduce new config systems.
- Keep wallet-first bot context authoritative.
- Keep LIVE API-key checks test-only/local; no production mutation.

## Definition of Done
- [x] Focused API configuration pack passes.
- [x] Focused web configuration pack passes.
- [x] No `SYSFIX-*` task is needed, or any needed task is explicitly queued.
- [x] Context and planning files are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Legacy bot fields overriding wallet/market/strategy canonical truth.
- Runtime scope expanding from inactive or paused market groups.
- Strategy/market mutation while active bot guards should block it.
- API-key secret leakage in docs or output.

## Validation Evidence
- Tests:
  - `$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'; $env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'; pnpm --filter api run test -- --run src/modules/wallets/walletCashflowClassifier.service.test.ts src/modules/bots/botOwnership.service.test.ts src/modules/bots/botStrategyProjectionDrift.service.test.ts src/modules/strategies/indicators/indicators.service.test.ts src/modules/profile/apiKey/binanceApiKeyProbe.service.test.ts` PASS (`5` files, `11` tests).
  - `$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'; $env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'; pnpm --filter api run test -- --run src/modules/profile/apiKey/apiKey.e2e.test.ts` PASS (`15` tests).
  - `$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'; $env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'; pnpm --filter api run test -- --run src/modules/wallets/wallets.crud.e2e.test.ts` PASS (`11` tests).
  - `$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'; $env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'; pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts` PASS (`14` tests).
  - `pnpm --filter api run test -- --run src/modules/markets/markets.e2e.test.ts` PASS (`15` tests).
  - `pnpm --filter api run test -- --run src/modules/strategies/strategies.e2e.test.ts` PASS (`11` tests).
  - `$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'; $env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'; pnpm --filter api run test -- --run src/modules/bots/bots.e2e.test.ts` PASS (`26` tests).
  - `$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'; $env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'; pnpm --filter api run test -- --run src/modules/bots/bots.wallet-contract.e2e.test.ts src/modules/bots/bots.market-universe-contract.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts` PASS (`5` files, `27` tests).
  - `pnpm --filter web run test -- --run src/features/profile/components/ApiKeyForm.test.tsx src/features/profile/components/ApiKeysList.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletPreviewPanel.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/markets/components/MarketUniverseForm.test.tsx src/features/markets/components/MarketUniversesTable.test.tsx src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/components/StrategyPresetPicker.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx src/features/bots/components/BotsListTable.test.tsx` PASS (`11` files, `52` tests).
  - `pnpm run quality:guardrails` PASS after docs/context sync.
- Manual checks:
  - Reviewed `docs/modules/api-wallets.md`.
  - Reviewed `docs/modules/api-markets.md`.
  - Reviewed `docs/modules/api-strategies.md`.
  - Confirmed API-key test encryption env was test-only.
- Screenshots/logs: terminal command output in this execution session.
- High-risk checks:
  - No production LIVE mutation performed.
  - API-key secret values were not recorded in docs.

## Discrepancy Classification
| Finding | Classification | Follow-up |
|---|---|---|
| API configuration helper/e2e pack | PASS. | No `SYSFIX-*`. |
| Web configuration form/table pack | PASS. | No `SYSFIX-*`. |

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-wallets.md`
  - `docs/modules/api-markets.md`
  - `docs/modules/api-strategies.md`
  - `docs/modules/api-bots.md` from `SYSFINAL-04`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: approved_snapshot.
- Design source reference: current dashboard config forms and tables.
- Canonical visual target: current dashboard design system.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: partially through form/table tests; broader
  UX state/responsive audit remains `SYSFINAL-07`.
- Visual-direction brief reviewed: not applicable.
- Existing shared pattern reused: current shared form/table systems.
- New shared pattern introduced: no.
- Design-memory entry reused: no new pattern.
- Design-memory update required: no.
- Visual gap audit completed: no, planned in `SYSFINAL-07`.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: no.
- Remaining mismatches: none found by focused tests.
- Required states: validation/error/success states covered where existing tests
  assert them.
- Responsive checks: planned in `SYSFINAL-07`.
- Input-mode checks: planned in `SYSFINAL-07`.
- Accessibility checks: planned in `SYSFINAL-07`.
- Parity evidence: focused config form/table tests pass.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none; test-only encryption env used locally.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: docs-only closure can be reverted.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: configuration workflows needed focused validation before product UX
  and closure tasks.
- Gaps: no local automated config gap found.
- Inconsistencies: none found.
- Architecture constraints: wallet-first bot context, shared market universe
  symbol formula, active-bot mutation guards.

### 2. Select One Priority Task
- Selected task: `SYSFINAL-06`.
- Priority rationale: it is the next active queue item and validates runtime
  inputs before remaining product audits.
- Why other candidates were deferred: backtest/report/log/UX audit depends on
  setup workflows already being coherent.

### 3. Plan Implementation
- Files or surfaces to modify: docs/context only after validation.
- Logic: test API helpers/e2e and web forms/tables for configuration modules.
- Edge cases: API-key env, active-bot guards, wallet-first bot contracts,
  runtime symbol scope.

### 4. Execute Implementation
- Implementation notes: no product implementation changes; executed
  verification commands and documented results.

### 5. Verify and Test
- Validation performed: focused API configuration pack, focused web config
  pack, guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: relying only on full baseline from `SYSFINAL-02`.
- Technical debt introduced: no.
- Scalability assessment: enough to proceed to product/UX audit.
- Refinements made: API-key encryption env set for API-key/bot tests.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact, MVP queue, execution plan, master plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

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
No product code changed and no `SYSFIX-*` task was produced.

## Production-Grade Required Contract

### Goal
Audit wallets, markets, strategies, and bot setup workflows.

### Scope
Focused API/web configuration validation and docs/context sync.

### Implementation Plan
Review module docs, run focused API tests, run focused web tests, classify
discrepancies, sync queue/context.

### Acceptance Criteria
All focused configuration workflow checks pass or confirmed discrepancies are
queued as `SYSFIX-*`. Satisfied: all checks pass.

### Definition Of Done
`DEFINITION_OF_DONE.md` expectations are satisfied for this verification
stage: goal, scope, validation evidence, review, and result report are present.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: represented by API/web config packs.
- Real API/service path used: automated API e2e/unit tests.
- Endpoint and client contract match: API workflows and web forms/tables tested.
- DB schema and migrations verified: indirectly through DB-backed e2e tests.
- Loading state verified: covered where existing web tests assert it.
- Error state verified: validation/guard tests cover failure states.
- Refresh/restart behavior verified: not primary in this slice.
- Regression check performed: focused API/web configuration packs.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: Patryk/operator configuring runtime inputs.
- Existing workaround or pain: configuration drift can become runtime drift.
- Smallest useful slice: focused configuration workflow audit.
- Success metric or signal: all focused checks pass.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: production smoke later.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  separately required for this local config audit.
- Critical user journey: configure wallet/market/strategy/bot then runtime
  consumes canonical truth.
- SLI: focused configuration workflow test pass rate.
- SLO: all focused checks pass.
- Error budget posture: healthy.
- Health/readiness check: covered in previous baseline/runtime audits.
- Logs, dashboard, or alert route: not changed.
- Smoke command or manual smoke: not run in this local verification slice.
- Rollback or disable path: revert docs-only changes.

## AI Testing Evidence
Not applicable. This task did not change AI behavior.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: covered in
  `SYSFINAL-03`; this task includes API-key and LIVE setup guard evidence.
- Data classification: API keys, wallets, market universes, strategies, bots,
  runtime configuration.
- Trust boundaries: browser, API, DB, exchange API-key probe.
- Permission or ownership checks: API-key/wallet/market/strategy/bot e2e tests
  passed.
- Abuse cases: cross-user API-key/wallet access, active-bot mutation drift,
  LIVE bot without entitlement/consent, legacy bot field override.
- Secret handling: API-key tests used test-only env; no secrets recorded.
- Security tests or scans: inherited from `SYSFINAL-03`; config ownership and
  entitlement tests passed here.
- Fail-closed behavior: active-bot guards, wallet mismatch, subscription
  entitlement, API-key ownership checks passed.
- Residual risk: production manual smoke remains later.

## Result Report
- Task summary: audited configuration workflows and found no confirmed
  discrepancy requiring `SYSFIX-*`.
- Files changed: this artifact plus queue/context docs.
- How tested: API config pack (`16` files / `130` tests), web config pack
  (`11` files / `52` tests), and guardrails all passed.
- What is incomplete: backtests/reports/logs/i18n/UX state audit and production
  closure tasks remain queued.
- Next steps: execute `SYSFINAL-07`.
- Decisions made: no new product or architecture decisions.
