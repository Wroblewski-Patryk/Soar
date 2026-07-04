# LUC-6468 Runtime Worker Contract Proof Slice

## Header
- ID: LUC-6468
- Title: Runtime worker execution and market-stream contract proof slice
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: LUC-6463
- Priority: P1
- Module Confidence Rows: Runtime automation / worker execution / market-stream worker / runtime signal merge / assistant runtime foundation
- Requirement Rows: Runtime automation and AI execution API-worker contract packet
- Quality Scenario Rows: Reliability / fail-closed runtime worker startup / deterministic runtime signal merge / no-live worker proof
- Risk Rows: Production/protected proof and DB-backed runtime freshness remain separate gates
- Iteration: 2026-07-03
- Operation Mode: BUILDER
- Mission ID: LUC-6468-RUNTIME-WORKER-CONTRACT-PROOF-2026-07-03
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the scoped backend issue.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the active project state context.
- [x] `.agents/core/mission-control.md` was reviewed through the active mission context.
- [x] Missing or template-like state tables were not found in the touched scope.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by proving a parent app-completion backend slice.

## Mission Block
- Mission objective: add a second focused DB-free backend proof slice for [LUC-6468](/LUC/issues/LUC-6468) after [LUC-6930](/LUC/issues/LUC-6930) covered the first worker/assistant packet.
- Release objective advanced: app-completion proof burn-down for Runtime automation / AI execution API-worker contracts.
- Included slices: execution worker startup/failure metrics, market-stream worker lifecycle and source selection, market-stream subscription scope, runtime signal merge determinism, runtime topology defaults, runtime supervisor restart signals, telemetry, ticker/market data gateways, and bot assistant dry-run service wiring.
- Explicit exclusions: production mutation, protected smoke, secret/account readback, exchange/payment mutation, order, position, subscription mutation, live-trading action, deploy, push, restart, broad feature implementation, assistant hot-path activation.
- Checkpoint cadence: one verification checkpoint with durable state update.
- Stop conditions: DB-backed runtime freshness remains blocked by local PostgreSQL/Docker from the prior slice; production/protected claims remain separate owner gates.
- Handoff expectation: parent [LUC-6468](/LUC/issues/LUC-6468) can continue with remaining row-level proof slices or close only after packet owner confirms all required rows are verified, deferred, or blocked.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Backend proof | CBE | `docs/architecture/reference/runtime-signal-merge-contract.md`, `docs/architecture/reference/assistant-runtime-contract.md` | API worker/runtime tests | Focused no-live backend proof | Vitest focused pack | DONE |
| Documentation/Memory | CBE | `.codex/context/*`, `.agents/state/*` | Task and state records | Durable issue evidence | State update and git status | DONE |

### Lane Checks
- [x] Active mission context was refreshed from project state.
- [x] Responsibility stayed inside the core backend lane.
- [x] No two write lanes own the same runtime source files.
- [x] Missing or unclear ownership was not found in this slice.

## Context
[LUC-6468](/LUC/issues/LUC-6468) owns the Runtime automation and AI execution API/worker contract packet from the [LUC-6463](/LUC/issues/LUC-6463) app-completion proof burn-down. [LUC-6930](/LUC/issues/LUC-6930) already verified the first DB-free worker/assistant subset and isolated DB-backed runtime freshness as blocked by unavailable local PostgreSQL.

## Goal
Verify an additional no-live, DB-free backend contract subset without changing product code or crossing protected production/account/trading boundaries.

## Success Signal
- User or operator problem: runtime/AI app-completion rows need exact backend proof, not broad optimistic status.
- Expected product or reliability outcome: runtime worker and signal contract anchors have repeatable local proof.
- How success will be observed: focused Vitest pack passes and evidence is recorded against [LUC-6468](/LUC/issues/LUC-6468).
- Post-launch learning needed: no.

## Deliverable For This Stage
One evidence-backed verification packet for the second runtime worker contract slice.

## Constraints
- Use existing tests and approved architecture contracts.
- Do not introduce new runtime systems or duplicate harnesses.
- Do not mutate production, accounts, subscriptions, exchanges, orders, positions, DB/Redis, env, or secrets.
- Do not claim DB-backed or protected production proof from this DB-free local slice.

## Definition of Done
- [x] Focused DB-free worker/runtime/assistant contract tests pass.
- [x] Verified scope and residual gates are separated.
- [x] Project state, task board, module confidence, next steps, and system health are updated.

## Stage Exit Criteria
- [x] The output matches verification stage.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping.

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/workers/execution.worker.test.ts src/workers/marketStream.worker.test.ts src/workers/marketStreamWorkerConfig.test.ts src/workers/marketStreamSubscriptions.service.test.ts src/modules/engine/runtimeSignalMerge.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimeSignalLoopSupervisor.test.ts src/modules/engine/runtimeTelemetry.service.test.ts src/modules/engine/runtimeTickerStore.test.ts src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/bots/botAssistant.service.test.ts src/modules/bots/bots.types.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
  - Result: PASS, `12` files / `51` tests.
- Manual checks: prior [LUC-6930](/LUC/issues/LUC-6930) DB-backed freshness blocker remains separate and was not rerun in this slice.
- Screenshots/logs: test output in current heartbeat transcript.
- High-risk checks: no production, protected smoke, secret/account, exchange, payment, subscription, order, position, deploy, restart, rollback, DB/Redis mutation, or live-trading action performed.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: Runtime automation / worker execution / market-stream worker / runtime signal merge / assistant runtime foundation.
- Requirements matrix updated: no; parent issue state remains the requirement tracker for this proof-only slice.
- Requirement rows closed or changed: runtime automation and AI execution API-worker contract packet advanced, not fully closed.
- Quality scenarios updated: no.
- Quality scenario rows closed or changed: reliability/fail-closed proof advanced by evidence.
- Risk register updated: no.
- Risk rows closed or changed: residual DB-backed and protected proof gates remain open.
- Reality status: verified for this DB-free slice.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/architecture/reference/assistant-runtime-contract.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none, no behavior changed.

## UX/UI Evidence
- Design source type: not applicable.
- Design source reference: not applicable.
- Required states: not applicable.
- Responsive checks: not applicable.
- Accessibility checks: not applicable.
- Parity evidence: not applicable.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: existing runtime metrics tests verified only.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: parent [LUC-6468](/LUC/issues/LUC-6468) still needs more API/worker contract proof after [LUC-6930](/LUC/issues/LUC-6930).
- Gaps: DB-backed runtime freshness remains blocked by local Postgres/Docker; protected production proof remains outside this lane.
- Inconsistencies: none found in scoped contracts.
- Architecture constraints: assistant hot-path execution remains deferred/fail-closed; current assistant scope is dry-run/foundation.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: active project state, task board, module confidence ledger, runtime/assistant architecture references, focused API test inventory.
- Rows created or corrected: one task record and top-of-ledger state entries.
- Assumptions recorded: no-live DB-free proof is safe to continue under CBE ownership.
- Blocking unknowns: none for this slice.
- Why it was safe to continue: scope used existing deterministic local tests and avoided protected boundaries.

### 2. Select One Priority Mission Objective
- Selected task: second DB-free runtime worker contract proof slice under [LUC-6468](/LUC/issues/LUC-6468).
- Priority rationale: it is the currently actionable backend owner path and does not wait on local Postgres/protected credentials.
- Why other candidates were deferred: DB-backed freshness, browser proof, production protected smoke, source/build provenance, and ops gates belong to separate owner paths.

### 3. Plan Implementation
- Files or surfaces to modify: documentation/state only.
- Logic: no runtime logic change.
- Edge cases: avoid treating DB-free proof as full runtime/protected acceptance.

### 4. Execute Implementation
- Implementation notes: no product code changed; focused test pack selected from existing API worker/runtime/assistant tests.

### 5. Verify and Test
- Validation performed: focused API Vitest command listed above.
- Result: PASS, `12` files / `51` tests.

### 6. Self-Review
- Simpler option considered: comment-only evidence. Rejected because repo source-of-truth requires durable task/state evidence for meaningful progress.
- Technical debt introduced: no.
- Scalability assessment: existing test surfaces remain sufficient for this proof slice.
- Refinements made: scope explicitly excludes the known DB-backed freshness blocker to avoid duplicate failed evidence.

### 7. Update Documentation and Knowledge
- Docs updated: this task record, module confidence ledger, system health, task board, project state, next steps.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to scoped backend lane.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal update was not required.
- [x] Required responsibility lanes were integrated.
- [x] Parent validation remains open until packet owner closes all rows.

## Notes
This task advances [LUC-6468](/LUC/issues/LUC-6468) but does not close the full 27-row Runtime automation and AI packet by itself.

## Production-Grade Required Contract

Every required section is represented above. This is a verification slice, not a runtime implementation slice; no UI, API, DB, or deployment behavior changed.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: Soar release operator needs exact runtime worker proof.
- Existing workaround or pain: broad app-completion rows were not sufficiently burn-down precise.
- Smallest useful slice: DB-free runtime worker/market-stream/signal/assistant test pack.
- Success metric or signal: focused API pack passed.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: no.

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: not applicable.
- Feedback item IDs: none.
- Feedback accepted: none.
- Feedback needs clarification: none.
- Feedback conflicts: none.
- Feedback deferred or rejected: none.
- Active task changed by feedback: no.
- New task created from feedback: not applicable.
- Design memory updated: not applicable.
- Learning journal updated: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable.
- Critical user journey: runtime worker execution and market-stream health contracts.
- SLI: local contract tests pass.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: worker readiness was covered by [LUC-6930](/LUC/issues/LUC-6930); this slice covers worker lifecycle and runtime telemetry.
- Logs, dashboard, or alert route: runtime metric/telemetry tests only.
- Smoke command or manual smoke: focused Vitest command above.
- Rollback or disable path: no behavior changed.

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable.
- Real API/service path used: existing service/unit contract tests.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: worker startup failure metrics covered.
- Refresh/restart behavior verified: market-stream worker lifecycle and runtime supervisor tests covered.
- Regression check performed: focused API pack passed.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable for this no-behavior-change proof slice.
- Memory consistency scenarios: not applicable.
- Multi-step context scenarios: not applicable.
- Adversarial or role-break scenarios: not applicable.
- Prompt injection checks: not applicable.
- Data leakage and unauthorized access checks: assistant dry-run service wiring only; no prompt/model behavior changed.
- Result: no new AI behavior introduced.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for this no-behavior-change proof slice.
- Data classification: local test data only.
- Trust boundaries: no production/protected boundary crossed.
- Permission or ownership checks: assistant dry-run service test keeps main assistant disabled behavior bounded.
- Abuse cases: no new behavior introduced.
- Secret handling: no secret values read or written.
- Security tests or scans: not applicable.
- Fail-closed behavior: execution worker failure metrics and assistant dry-run disabled-main behavior covered by focused tests.
- Residual risk: DB-backed route and production/protected acceptance remain open.

## Result Report

- Task summary: Verified a second DB-free runtime worker contract slice for [LUC-6468](/LUC/issues/LUC-6468), covering execution worker startup/failure metrics, market-stream lifecycle/subscriptions, runtime merge/defaults/supervisor/telemetry/ticker/market-data, and bot assistant dry-run service wiring.
- Files changed: documentation/state only.
- How tested: focused API Vitest pack passed (`12` files / `51` tests).
- What is incomplete: full [LUC-6468](/LUC/issues/LUC-6468) packet closure; DB-backed runtime freshness remains blocked by local Postgres/Docker; protected production proof remains separate.
- Next steps: continue remaining [LUC-6468](/LUC/issues/LUC-6468) row-level proof or delegate DB-backed freshness to infra/QA after local Docker/Postgres restoration.
- Decisions made: no backend repair child is warranted from this slice.
