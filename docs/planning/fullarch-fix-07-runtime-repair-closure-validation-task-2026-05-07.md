# Task

## Header
- ID: FULLARCH-FIX-07
- Title: Validate runtime repair closure pack after import fixes
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: FULLARCH-FIX-06
- Priority: P1
- Iteration: 53
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The full architecture conformance audit required a focused runtime validation
pass after imported-position visibility, six-position readback, diagnostics,
Web harness, API topology, and Binance futures normalization repairs. This
task records the local runtime/pre-trade/order/position-automation closure
evidence. It does not replace authenticated production readback for
`LIVEIMPORT-03`.

## Goal
Prove that the local runtime repair chain remains green across signal merge,
final-candle execution, pre-trade/risk gates, execution orchestration, order
lifecycle, exchange events, imported-position DCA visibility, takeover
readback, and runtime position automation.

## Scope
- Validation only against existing API test suites.
- `.agents/state/known-issues.md`
- `.agents/state/system-health.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- This task evidence file.

## Implementation Plan
1. Select existing focused suites that cover runtime signal, pre-trade/risk,
   order lifecycle, exchange events, imported-position readback, and position
   automation.
2. Run them sequentially to avoid shared DB cleanup false reds.
3. Record evidence and sync source-of-truth docs.

## Acceptance Criteria
- Focused runtime/pre-trade/order/position pack passes.
- Validation is run with `--sequence.concurrent=false` for DB-backed suites.
- No code changes are introduced by this evidence-only task.
- `LIVEIMPORT-03` remains open for authenticated production evidence.

## Success Signal
- User or operator problem: the team needs confidence that local runtime safety
  did not regress while fixing exchange import/readback.
- Expected product or reliability outcome: local closure evidence is explicit
  before moving to protected production readback.
- How success will be observed: focused pack passes and evidence is recorded.
- Post-launch learning needed: no

## Deliverable For This Stage
Validation evidence and synchronized context docs.

## Constraints
- Use existing tests only.
- Do not introduce new runtime behavior or new validation tooling.
- Do not run production writes, deployments, live-money actions, or destructive
  operations.
- Do not close `LIVEIMPORT-03` without authenticated redacted production
  readback evidence.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed and applicable validation-only items are
  met.
- [x] Focused runtime repair closure pack passes.
- [x] Source-of-truth docs are updated.
- [x] Production readback blocker remains explicit.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated validation paths that pretend to replace production readback.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalMerge.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTradeRisk.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts src/modules/engine/positionManagement.service.test.ts src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --run --sequence.concurrent=false`
    PASS (`16/16` files, `240/240` tests).
- Manual checks:
  - Test stderr contained expected mocked fail-closed/cache-fallback logs from
    covered scenarios, not suite failures.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No production credentials, production writes, exchange writes, deploys, or
    live-money actions were used.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/planning/full-architecture-conformance-audit-task-2026-05-07.md`
  - `.agents/core/execution-loop.md`
  - `.agents/state/next-steps.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
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
- Remaining mismatches: none
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: docs/evidence only; revert docs if needed.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: local runtime closure evidence was still a follow-up after import
  repairs.
- Gaps: authenticated production `LIVEIMPORT-03` readback remains missing.
- Inconsistencies: none found.
- Architecture constraints: imported rows must be visible but fail-closed
  unless ownership, strategy, continuity, and risk gates are satisfied.

### 2. Select One Priority Task
- Selected task: `FULLARCH-FIX-07`.
- Priority rationale: it is the remaining local evidence task from the full
  architecture audit before production readback.
- Why other candidates were deferred: production readback and BOTMULTI release
  gates require authenticated/protected production access that is not present.

### 3. Plan Implementation
- Files or surfaces to modify: docs/context only.
- Logic: run existing focused tests sequentially and record evidence.
- Edge cases: avoid parallel DB cleanup false failures; do not overclaim
  production readiness from local tests.

### 4. Execute Implementation
- Implementation notes: no code changes. Ran one focused validation pack.

### 5. Verify and Test
- Validation performed: `16/16` focused files, `240/240` tests.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: rely on earlier root-suite evidence. Rejected
  because the audit explicitly requested focused post-repair runtime evidence.
- Technical debt introduced: no
- Scalability assessment: evidence uses existing suites and known sequential
  DB-backed pattern.
- Refinements made: production readback remains clearly separated from local
  validation.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `docs/planning/mvp-next-commits.md`
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/known-issues.md`
  - `.agents/state/system-health.md`
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
This task closes local runtime repair validation only. It does not close
authenticated production readback.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: operators relying on imported positions and
  runtime automation/readback.
- Existing workaround or pain: repeated partial fixes without a focused
  post-repair validation pack.
- Smallest useful slice: validation-only evidence with no code changes.
- Success metric or signal: focused runtime pack passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: production readback remains required.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: runtime signal -> risk gate -> order/position
  lifecycle -> imported-position readback/automation.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not changed
- Logs, dashboard, or alert route: not changed
- Smoke command or manual smoke: focused test pack.
- Rollback or disable path: not applicable for validation-only docs.

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: yes for covered e2e paths
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: fail-closed runtime/test scenarios covered
- Refresh/restart behavior verified: runtime loop fallback/restart scenarios
  covered by existing tests
- Regression check performed: focused runtime repair closure pack.

## AI Testing Evidence

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: local test data only.
- Trust boundaries: production systems not accessed.
- Permission or ownership checks: covered by focused e2e readback/order tests.
- Abuse cases: imported position becoming actionable without valid ownership or
  strategy continuity.
- Secret handling: no secrets used.
- Security tests or scans: not applicable
- Fail-closed behavior: covered by pre-trade, risk, automation, and runtime
  readback tests.
- Residual risk: production readback still requires authenticated evidence.

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: ran and recorded focused runtime repair closure evidence after
  the import/readback/normalization fixes.
- Files changed:
  - `.agents/state/known-issues.md`
  - `.agents/state/system-health.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/fullarch-fix-07-runtime-repair-closure-validation-task-2026-05-07.md`
- How tested: focused runtime/pre-trade/order/position/import readback pack
  (`16/16` files, `240/240` tests).
- What is incomplete: authenticated `LIVEIMPORT-03` production runtime
  readback.
- Next steps: run `LIVEIMPORT-03` with authenticated read-only production
  access and capture redacted evidence.
- Decisions made: no architecture or product decision changed.
