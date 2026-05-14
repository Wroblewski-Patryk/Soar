# Task

## Header
- ID: V1-PRODUCTION-POSITIONS-PROOF-2FC90A08-2026-05-14
- Title: Prove Positions on production with PAPER-only lifecycle and fail-closed close guard
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test + Frontend Builder + Ops/Release
- Depends on: V1-PRODUCTION-FIXTURE-ACTION-PROOF-PLAN-2026-05-14
- Priority: P0
- Module Confidence Rows: SOAR-POSITIONS-001
- Requirement Rows: REQ-FUNC-011, REQ-FUNC-024
- Quality Scenario Rows: QA-011
- Risk Rows: RISK-011, RISK-024
- Iteration: 2026-05-14 production Positions proof
- Operation Mode: BUILDER
- Mission ID: V1-LITERAL-100-PRODUCTION-FIXTURE-PROOF
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: reduce remaining V1 `PASS_LOCAL` rows through approved production-safe proof.
- Release objective advanced: Positions moved from local-only proof to production-safe PASS evidence.
- Included slices: build-info freshness, auth token resolution, unauthenticated fail-closed Positions access, active PAPER runtime candidate selection, position list/read, PAPER market open, management-mode update/restore, manual TP/SL update, live-status read, takeover-status read, exchange-snapshot boundary, runtime close fail-closed without `riskAck`, runtime close with `riskAck`, terminal closed readback, OPEN-list cleanup.
- Explicit exclusions: LIVE order submit/cancel/close, LIVE position mutation, exchange-side mutation, existing LIVE data mutation, raw credential persistence.
- Checkpoint cadence: update proof artifact, product action matrix, module confidence, requirements, quality scenarios, risk, and regenerated scorecard.
- Stop conditions: build mismatch, no safe PAPER candidate, no free symbol, live mutation requirement, failed cleanup, or secret artifact hit.
- Handoff expectation: continue remaining V1 row after source-of-truth refresh.

## Context
The V1 product action matrix still had Positions as `PASS_LOCAL`. Local API and
Web tests were strong, but the row needed a production-safe action proof before
it could be represented as verified for the current deployed build.

## Goal
Prove deployed production build `2fc90a08` satisfies the implemented Positions
V1 contracts using a controlled PAPER-only lifecycle and fail-closed checks.

## Scope
- Script: `scripts/runProdPositionsProof.mjs`
- Package command: `pnpm run ops:prod-positions:proof`
- Proof artifacts:
  - `docs/operations/prod-positions-proof-2fc90a08-2026-05-14.md`
  - `docs/operations/_artifacts-prod-positions-proof-2fc90a08-2026-05-14.json`
- Source-of-truth rows:
  - `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/requirements-verification-matrix.md`
  - `.agents/state/quality-attribute-scenarios.md`
  - `.agents/state/risk-register.md`

## Implementation Plan
1. Add a production proof script that records only summarized statuses and IDs.
2. Select an existing active PAPER runtime bot with a free symbol.
3. Run a PAPER-only position lifecycle through existing API contracts.
4. Confirm fail-closed close behavior without `riskAck`.
5. Close and verify terminal state, then update source-of-truth docs.

## Acceptance Criteria
- Production build-info matches `2fc90a0810032f2fedb744d69505a3bd55a23779`.
- Production proof returns `PASS`.
- Proof artifact contains no raw credentials, tokens, cookies, or API secrets.
- The proof-created position is terminal `CLOSED` and absent from the OPEN list.
- Positions state rows reference the production proof.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` evidence expectations are represented by runnable proof and durable artifacts.
- [x] Production proof completed without LIVE or exchange-side mutation.
- [x] Cleanup/terminal-state evidence is attached.
- [x] Affected module confidence, requirement, quality scenario, risk, and product action rows are updated.

## Validation Evidence
- Tests: `node --check scripts/runProdPositionsProof.mjs` passed.
- Tests: `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/positions/positions.list.e2e.test.ts src/modules/positions/positions.service.test.ts src/modules/positions/positions-live-status.e2e.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts --run` passed (`46/46`).
- Manual checks: `pnpm run ops:prod-positions:proof -- --expected-sha 2fc90a0810032f2fedb744d69505a3bd55a23779 --today 2026-05-14 --i-understand-production-positions-proof` returned `status=PASS`.
- Screenshots/logs: not applicable; API-level production proof.
- High-risk checks: no LIVE order/cancel/close, no LIVE position mutation, no exchange-side mutation, close without `riskAck` returned `400`, close with `riskAck` returned `200`, and cleanup readback returned terminal `CLOSED`.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: SOAR-POSITIONS-001.
- Requirements matrix updated: yes.
- Requirement rows closed or changed: REQ-FUNC-011.
- Quality scenarios updated: yes.
- Quality scenario rows closed or changed: QA-011.
- Risk register updated: yes.
- Risk rows closed or changed: RISK-011, RISK-024.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-positions.md`, `docs/architecture/architecture-source-of-truth.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: production proof artifact added for Positions.
- Rollback note: no rollback required; proof script exercises deployed behavior only.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Positions had local API/Web proof but no current production-safe action proof.
- Production had active PAPER runtime data that allowed a controlled proof without LIVE mutation.

### 2. Select One Priority Mission Objective
- Selected task: production-safe Positions proof.
- Priority rationale: Positions was the remaining P0 row in the generated scorecard.

### 3. Plan Implementation
- Use existing authenticated APIs and the existing runtime close route.
- Persist only summarized statuses, counts, and IDs.

### 4. Execute Implementation
- Added `ops:prod-positions:proof` and `scripts/runProdPositionsProof.mjs`.
- The proof opened one PAPER position, updated it, checked read boundaries, and closed it.

### 5. Verify and Test
- Local syntax and focused API contract tests passed.
- Production proof passed on deployed `2fc90a08`.

### 6. Self-Review
- Simpler option considered: mark the row from local proof only.
- Technical debt introduced: no.
- Scalability assessment: proof helper is reusable for future deployed SHAs.
- Refinements made: proof fails before mutation if no safe PAPER candidate exists.

### 7. Update Documentation and Knowledge
- Docs updated: product action matrix, module confidence ledger, requirements matrix, quality scenario ledger, risk register, proof artifacts.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.

## Result Report
Production Positions proof is verified for deployed `2fc90a08`. The proof is
PAPER-only, records no raw secrets, closes its proof position, and does not
prove LIVE money mutation.
