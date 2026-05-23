# Post-V1 Strategy Snapshot History - 2026-05-14

## Header
- ID: POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14
- Title: Preserve immutable backtest strategy and market-universe context
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder + QA/Test
- Depends on: POSTV1-OPERATOR-FEEDBACK-INTAKE-2026-05-14
- Priority: P1
- Module Confidence Rows: SOAR-BACKTESTS-001, SOAR-STRATEGIES-001, SOAR-MARKETS-001
- Requirement Rows: REQ-FUNC-027
- Quality Scenario Rows: QA-024
- Risk Rows: RISK-027
- Iteration: 27
- Operation Mode: ARCHITECT
- Mission ID: POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the active AGENTS context.
- [x] `.agents/core/mission-control.md` was reviewed through the active AGENTS context.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: make new backtest history audit-stable across strategy and market-universe edits/deletes.
- Release objective advanced: post-V1 architecture confidence for simulation history.
- Included slices: backtest context snapshot persistence; snapshot-first replay/timeline/list strategy truth; strategy and market-universe delete guards for historical backtest references.
- Explicit exclusions: bot history/versioned bot context; per-symbol best-parameter comparison; UI history views.
- Checkpoint cadence: close after focused API proof and source-of-truth updates.
- Stop conditions: architecture mismatch, failing focused e2e, or unsafe data deletion behavior.
- Handoff expectation: remaining history work is queued as separate bounded slices.

## Context

Operator feedback called out that strategy/market history is a repeated model,
not one symbol or one record. Backtests are historical artifacts; after a run is
created, later edits to a strategy or market universe must not silently change
what that historical run means.

## Goal

Persist immutable creation-time strategy and market-universe snapshots for new
backtest runs, use that snapshot for historical read/replay behavior, and block
deletion of mutable source records while owned backtest history still references
them.

## Scope

- `apps/api/src/modules/backtests/backtests.service.ts`
- `apps/api/src/modules/backtests/backtestRunJob.ts`
- `apps/api/src/modules/backtests/backtestRange.service.ts`
- `apps/api/src/modules/backtests/backtests.repository.ts`
- `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- `apps/api/src/modules/strategies/strategies.service.ts`
- `apps/api/src/modules/markets/markets.service.ts`
- `apps/api/src/modules/markets/markets.e2e.test.ts`
- architecture/module/state documentation listed in the result report

## Implementation Plan

1. Capture strategy and market-universe snapshots when creating a backtest run.
2. Prefer snapshot strategy config and wallet risk during async job execution and timeline replay.
3. Prefer snapshot strategy name in backtest run list projections.
4. Block strategy delete when owned backtest history references the strategy.
5. Block market-universe delete when owned backtest history references `seedConfig.marketUniverseId`.
6. Add focused e2e coverage and update source-of-truth artifacts.

## Acceptance Criteria

- New backtest runs include `seedConfig.contextSnapshot.version=1`.
- Snapshot includes strategy identity/config/risk and market-universe venue/symbol-scope fields.
- Backtest list keeps the original strategy name after strategy edits.
- Strategy delete returns `409` while owned backtest history references it.
- Market-universe delete returns `409` while owned backtest history references it.
- Focused API e2e passes for backtests, strategies, and markets.

## Constraints

- Use existing seedConfig and repository patterns.
- Do not introduce a new versioning subsystem in this slice.
- Do not bypass ownership checks.
- Do not mutate production data or perform exchange-side actions.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` intent satisfied for this bounded backend slice.
- [x] Runtime behavior is implemented through existing API/DB contracts.
- [x] Focused e2e evidence is captured.
- [x] Architecture/module/state docs are updated.
- [x] Residual work is explicitly listed instead of claimed complete.

## Forbidden

- New parallel snapshot framework.
- Temporary delete bypasses.
- Fake history data.
- Production or live-money mutation.

## Validation Evidence

- Tests: `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts src/modules/strategies/strategies.e2e.test.ts src/modules/markets/markets.e2e.test.ts --run` PASS (`44/44`).
- Manual checks: architecture alignment checked against `docs/architecture/07_modes-parity-and-data.md`.
- Screenshots/logs: not applicable; API/backend slice.
- High-risk checks: delete paths fail closed with `409`; ownership remains scoped by existing module queries.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: SOAR-BACKTESTS-001, SOAR-STRATEGIES-001, SOAR-MARKETS-001.
- Requirements matrix updated: yes.
- Requirement rows closed or changed: REQ-FUNC-027.
- Quality scenarios updated: yes.
- Quality scenario rows closed or changed: QA-024.
- Risk register updated: yes.
- Risk rows closed or changed: RISK-027.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: `docs/architecture/07_modes-parity-and-data.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: operator feedback follow-up queue.
- Follow-up architecture doc updates: backtest immutable snapshot contract added to `07_modes-parity-and-data.md`.

## Deployment / Ops Evidence

- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not needed for local backend slice.
- Rollback note: revert commit restores previous mutable-history behavior.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: historical backtest meaning could drift after mutable strategy/universe edits.
- Gaps: strategy/universe delete guards did not account for backtest history.
- Inconsistencies: architecture said immutable snapshot but implementation did not preserve enough context.
- Architecture constraints: backtests must store immutable context snapshots.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: architecture, module docs, state ledgers, and focused API modules.
- Rows created or corrected: REQ-FUNC-027, QA-024, RISK-027.
- Assumptions recorded: bot history and best-parameter comparison are separate slices.
- Blocking unknowns: none.
- Why it was safe to continue: behavior is internal API/data integrity and uses existing contracts.

### 2. Select One Priority Mission Objective
- Selected task: immutable backtest context snapshot history.
- Priority rationale: it directly addresses repeated strategy/market history drift behind operator feedback.
- Why other candidates were deferred: dashboard polish, bot history, and best-parameter comparison require separate UI/schema/product slices.

### 3. Plan Implementation
- Files or surfaces to modify: backtests, strategies, markets services and focused e2e.
- Logic: capture snapshot at create time, read snapshot first, guard deletes.
- Edge cases: legacy runs without snapshots still fall back to live strategy records.

### 4. Execute Implementation
- Implementation notes: reused `seedConfig` JSON and existing domain error paths; no new subsystem.

### 5. Verify and Test
- Validation performed: focused API e2e across backtests, strategies, and markets.
- Result: PASS (`44/44`).

### 6. Self-Review
- Simpler option considered: only block deletes.
- Technical debt introduced: no.
- Scalability assessment: snapshot payload is small JSON and scoped to run creation.
- Refinements made: market-universe delete guard added after strategy guard to close both halves of the model.

### 7. Update Documentation and Knowledge
- Docs updated: architecture/module docs and state ledgers.
- Context updated: yes.
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
- [x] No logic duplication was introduced beyond local pure snapshot helpers needed to avoid cross-module coupling.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes

This slice closes immutable backtest context for strategy and market universe.
Bot history/versioned bot context and per-symbol best-parameter comparison stay
queued because they need their own product/API/UI acceptance criteria.

## Production-Grade Required Contract

- Goal: historical backtests remain audit-stable.
- Scope: backend API/data behavior and source-of-truth docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: see above.
- Result Report: see below.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes.
- Endpoint and client contract match: yes for existing API surfaces.
- DB schema and migrations verified: no schema change.
- Loading state verified: not applicable.
- Error state verified: yes via delete `409` assertions.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: focused e2e pack.

## Security / Privacy Evidence

- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: user-owned trading configuration and simulation history.
- Trust boundaries: dashboard auth and user ownership queries.
- Permission or ownership checks: existing owned queries remain in place.
- Abuse cases: cross-user deletion remains out of scope and protected by existing tests.
- Secret handling: no secrets touched.
- Security tests or scans: touched-file credential scan ran; only existing test fixtures and known public project URLs appeared, with no operator secrets added.
- Fail-closed behavior: referenced strategy/universe deletion returns `409`.
- Residual risk: bot-history/versioned bot context remains a separate slice.

## Result Report

- Task summary: new backtest runs persist immutable strategy and market-universe context snapshots; list/timeline/replay prefer snapshot strategy truth; strategy and market-universe deletion now fail closed when owned backtest history references those records.
- Files changed: backtests services/repository/tests, strategies service, markets service/tests, architecture/module/source-of-truth docs.
- How tested: focused API e2e PASS (`44/44`).
- What is incomplete: bot history/versioned bot context, per-symbol best-parameter comparison, and UI history views.
- Next steps: run a separate bounded slice for bot history snapshots or per-symbol best-parameter comparison.
- Decisions made: reuse existing `seedConfig.contextSnapshot` instead of adding a new versioning table in this slice.
