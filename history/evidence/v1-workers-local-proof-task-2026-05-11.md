# Task

## Header
- ID: V1-WORKERS-LOCAL-PROOF-2026-05-11
- Title: Prove Workers local runtime contracts
- Task Type: research
- Current Stage: post-release
- Status: DONE
- Owner: QA/Test
- Depends on: V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11
- Priority: P0
- Module Confidence Rows: SOAR-WORKERS-001
- Requirement Rows: REQ-FUNC-017
- Quality Scenario Rows: QA-017
- Risk Rows: RISK-017
- Iteration: 17
- Operation Mode: BUILDER
- Mission ID: V1-WORKERS-LOCAL-PROOF-2026-05-11
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository
      sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: Move the V1 Workers row from `UNVERIFIED` to evidence-backed local status if existing worker, stream, queue, readiness, and runtime freshness contracts pass.
- Release objective advanced: V1 foundation readiness for background processing and operator-visible runtime health.
- Included slices: worker topology, worker readiness endpoints, runtime freshness, market-stream fanout/source selection, queue tuning, backtest job execution, and execution-runtime worker interaction tests.
- Explicit exclusions: production protected worker proof, live-money mutation, new worker topology, new queue infrastructure, and UI/browser proof.
- Checkpoint cadence: update this task after initial mapping, after focused validation, after any fix, and at closure.
- Stop conditions: architecture mismatch, unsafe live mutation requirement, missing local DB protocol, or focused worker tests failing in a way that needs product/runtime design input.
- Handoff expectation: durable task evidence plus updated V1 state files and next-step queue.

## Context
The V1 product action audit matrix still lists Workers as `UNVERIFIED`.
Public `/ready` is not enough because it does not prove worker ownership,
queue configuration, runtime freshness, market-stream fanout, or job-result
behavior. Existing architecture allows inline local execution and split
deployed topology as separate worker modes; this task proves the local and
contract surfaces already present in the repository.

## Goal
Prove the local Workers V1 contract through focused automated evidence and
record the remaining production-safe worker proof boundary honestly.

## Scope
- `apps/api/src/workers/*`
- `apps/api/src/router/workers-*.test.ts`
- `apps/api/src/router/health-readiness.test.ts`
- `apps/api/src/modules/market-stream/*`
- `apps/api/src/modules/engine/runtime-flow.e2e.test.ts`
- `apps/api/src/modules/engine/executionOrchestrator*.test.ts`
- `apps/api/src/modules/backtests/backtestRunJob.test.ts`
- `apps/api/src/queue/queueTuning.test.ts`
- V1 state, planning, and generated operations reports

## Implementation Plan
1. Map existing worker contracts and candidate tests.
2. Run focused API worker/runtime/stream/queue proof with local DB env loaded.
3. Fix only confirmed local regressions inside existing worker contracts if any fail.
4. Regenerate V1 project index, static scan, master ledger, and scorecard.
5. Update product action audit, module confidence, requirements, quality, risk, planning, and context files.
6. Run scoped closure gates and cleanup checks.

## Acceptance Criteria
- Worker topology and readiness tests pass locally.
- Runtime freshness tests pass locally, including fail-closed stale checks.
- Market stream worker source/fanout/subscription tests pass locally.
- Queue tuning, backtest worker job, and execution/runtime worker interaction tests pass locally.
- V1 state files record Workers as local proof only, with production-safe worker proof still open.

## Success Signal
- User or operator problem: V1 cannot claim worker readiness from public health alone.
- Expected product or reliability outcome: local proof shows workers fail closed and expose actionable readiness/freshness contracts.
- How success will be observed: focused API tests pass and V1 ledgers move Workers from `UNVERIFIED` to `PASS_LOCAL`.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verification evidence and source-of-truth updates for the existing Workers V1
contract.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Focused Workers API proof passes or a blocking failure is recorded.
- [x] Generated V1 reports are refreshed.
- [x] Affected state and planning files are synchronized.
- [x] Closure gates pass or residual risk is recorded.

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
- Tests: initial full worker pack failed on DB isolation (`2` files failed,
  `3` tests failed); focused rerun passed (`2` files, `9` tests); full API
  Workers/stream/runtime pack passed (`18` files, `88` tests); V1 index,
  scan, ledger, and scorecard regenerated; API typecheck, generator syntax
  check, guardrails, diff check, and process cleanup check passed.
- Manual checks: inspected worker topology/readiness/runtime freshness contracts and generated V1 report outputs.
- Screenshots/logs: not applicable
- High-risk checks: protected endpoint rejection, split-mode missing queue
  readiness failure, stale market data failure, stale runtime session failure,
  missing/stale decision activity failure, and inline no-demand skip behavior
  covered by focused tests.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-WORKERS-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-017
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-017
- Risk register updated: yes
- Risk rows closed or changed: RISK-017
- Reality status: partially verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`; `docs/architecture/reference/runtime-signal-merge-contract.md`; `docs/operations/service-reliability-and-observability.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected unless tests reveal drift

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
- Health-check impact: validates existing worker health/readiness contracts only
- Smoke steps updated: state files now keep production-safe protected worker proof as the next step.
- Rollback note: no runtime behavior change expected
- Observability or alerting impact: validates existing readiness/freshness signals
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Workers row is `UNVERIFIED`; public `/ready` is insufficient evidence for V1.
- Gaps: production-safe protected worker proof remains unavailable in this shell.
- Inconsistencies: none found before validation.
- Architecture constraints: reuse existing worker topology, readiness, freshness, market-stream, and queue contracts.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: `.agents/core/*`, `.agents/state/*`, `.codex/context/*`, `docs/planning/mvp-next-commits.md`, `history/audits/v1-product-action-audit-matrix-2026-05-10.md`, worker/router/market-stream tests
- Rows created or corrected: SOAR-WORKERS-001, REQ-FUNC-017, QA-017, RISK-017, SOAR-DM-018, PAA-018.
- Assumptions recorded: Local worker proof can be API-only because this row owns background runtime/process contracts, not a browser surface.
- Blocking unknowns: production protected worker access is not available.
- Why it was safe to continue: local tests exercise non-live, fail-closed contracts without external mutation.

### 2. Select One Priority Mission Objective
- Selected task: V1 Workers local proof.
- Priority rationale: first unblocked local P0 module after Exchange Adapter.
- Why other candidates were deferred: Security/Privacy and UX/A11y/Mobile remain next local modules; Operations and Subscriptions/Admin are blocked by protected/auth evidence.

### 3. Plan Implementation
- Files or surfaces to modify: task/state/docs only unless a focused regression is discovered.
- Logic: prove existing worker readiness/freshness/queue/stream/runtime contracts.
- Edge cases: split mode missing queues, stale market data, stale runtime sessions, wrong-session decision activity, default inline mode with no demand, unsupported market-stream source.

### 4. Execute Implementation
- Implementation notes: tightened local e2e isolation in
  `workers-runtime-freshness.test.ts` by clearing `marketCandleCache`, and in
  `executionOrchestrator.owned-import.e2e.test.ts` by clearing runtime,
  signal, backtest, dedupe, and assistant/subagent dependent rows before bots
  and users.

### 5. Verify and Test
- Validation performed: focused failed-test rerun, full worker pack, V1 report
  regeneration, API typecheck, generator syntax check, guardrails, diff check,
  and validation process cleanup check.
- Result: API Workers/stream/runtime proof passed (`18` files, `88` tests).

### 6. Self-Review
- Simpler option considered: only marking the row from existing Bot Runtime worker telemetry was insufficient because Workers owns broader topology/readiness/queue/stream contracts.
- Technical debt introduced: no
- Scalability assessment: local proof increases release confidence without changing worker topology.
- Refinements made: recorded the worker e2e cleanup pitfall in
  `.codex/context/LEARNING_JOURNAL.md`.

### 7. Update Documentation and Knowledge
- Docs updated: V1 product action matrix, MVP planning files, generated V1
  reports, task artifact.
- Context updated: project state, task board, current focus, known issues,
  system health, next steps, module confidence, delivery map, requirements,
  quality, risk, regression log.
- Learning journal updated: yes.

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
Residual production risk is expected: local proof cannot replace protected
production worker endpoint, process, queue, and runtime freshness evidence.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: V1 operator/release owner
- Existing workaround or pain: public readiness was previously too weak for worker confidence.
- Smallest useful slice: local API worker contract proof.
- Success metric or signal: Workers row becomes `PASS_LOCAL`.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: production worker proof still required

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: not applicable
- Feedback item IDs: not applicable
- Feedback accepted: not applicable
- Feedback needs clarification: no
- Feedback conflicts: no
- Feedback deferred or rejected: no
- Active task changed by feedback: no
- New task created from feedback: not applicable
- Design memory updated: not applicable
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: runtime background processing, market stream, backtest jobs, and operator readiness/freshness visibility
- SLI: worker readiness and runtime freshness contracts return truthful pass/fail state
- SLO: production SLO remains governed by release/ops evidence; local proof targets correctness, not live availability
- Error budget posture: burning
- Health/readiness check: `/workers/health`, `/workers/ready`, `/workers/runtime-freshness`, `/ready`
- Logs, dashboard, or alert route: existing structured worker events and readiness/freshness responses
- Smoke command or manual smoke: focused API Vitest pack
- Rollback or disable path: no behavior change expected

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes through DB-backed tests
- Loading state verified: not applicable
- Error state verified: yes through fail-closed tests
- Refresh/restart behavior verified: partially through freshness/heartbeat contract; production process restart remains open.
- Regression check performed: focused worker pack and V1 static scan refresh.

## AI Testing Evidence

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: operational health and runtime metadata
- Trust boundaries: protected worker/admin endpoints must reject unauthenticated access
- Permission or ownership checks: admin route tests passed
- Abuse cases: unauthenticated worker endpoint access rejects with `401`
- Secret handling: no secret changes
- Security tests or scans: protected worker endpoint tests passed
- Fail-closed behavior: stale readiness/freshness paths passed
- Residual risk: production protected worker proof remains unavailable

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: Workers moved to `PASS_LOCAL` with focused local API proof and e2e isolation hardening.
- Files changed: `apps/api/src/router/workers-runtime-freshness.test.ts`; `apps/api/src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts`; `history/evidence/v1-workers-local-proof-task-2026-05-11.md`; V1 state/planning/generated report files.
- How tested: API Workers/stream/runtime pack (`18` files, `88` tests), failed-test rerun (`2` files, `9` tests), V1 report refresh, API typecheck, generator syntax check, guardrails, diff check, and process cleanup check.
- What is incomplete: production-safe protected worker proof
- Next steps: Security/Privacy local proof, then UX/A11y/Mobile local proof unless protected production evidence becomes available.
- Decisions made: local proof remains distinct from production readiness
