# Task

## Header
- ID: V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11
- Title: Bot Runtime worker telemetry live-loop proof
- Task Type: release
- Current Stage: implementation
- Status: DONE
- Owner: QA/Test
- Depends on: V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11; V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11
- Priority: P0
- Module Confidence Rows: SOAR-BOT-RUNTIME-001
- Requirement Rows: REQ-FUNC-003
- Quality Scenario Rows: QA-003
- Risk Rows: RISK-003
- Iteration: V1-2026-05-11-07
- Operation Mode: BUILDER
- Mission ID: V1-RUNTIME-LOCAL-PROOF
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed in the active V1 mission context.
- [x] `.agents/core/mission-control.md` was reviewed in the active V1 mission context.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: Prove Bot Runtime local truth from the live runtime signal loop through persisted telemetry and authenticated read APIs.
- Release objective advanced: Move Bot Runtime from partial local evidence toward local release proof.
- Included slices: runtime signal loop e2e telemetry assertions, API readbacks for sessions, detail, symbol stats, aggregate, and source-of-truth updates.
- Explicit exclusions: Production-safe clickthrough and live exchange integration.
- Checkpoint cadence: After implementation and after validation.
- Stop conditions: Failing worker telemetry readback, architecture mismatch, or required workaround.
- Handoff expectation: Document the evidence and remaining production proof gap.

## Context
Bot Runtime already has authenticated browser proof for representative PAPER `RUNNING` and `COMPLETED` sessions. The V1 audit matrix still keeps the module at `PARTIAL_LOCAL` because worker telemetry/live-loop readback has not yet been proven through the same runtime API surface.

## Goal
Extend the existing runtime flow e2e proof so the real runtime signal loop writes telemetry that is read back through the Bot Runtime API.

## Success Signal
- User or operator problem: Operators must trust that runtime screens reflect data produced by the worker loop, not manually seeded telemetry only.
- Expected product or reliability outcome: Runtime sessions, events, symbol stats, positions, trades, and aggregate reads agree after the live-loop lifecycle.
- How success will be observed: Focused API e2e test passes and source-of-truth files record the proof.
- Post-launch learning needed: yes

## Deliverable For This Stage
Implementation and verification of a focused worker telemetry readback proof.

## Scope
- `apps/api/src/modules/engine/runtime-flow.e2e.test.ts`
- `history/audits/v1-product-action-audit-matrix-2026-05-10.md`
- V1 project state, task board, module confidence, requirement, quality, risk, and next-step source-of-truth files
- Regenerated V1 project index, static scan, master ledger, and scorecard

## Constraints
- Use existing runtime signal loop, telemetry service, and Bot Runtime read APIs.
- Do not introduce new telemetry systems or test-only runtime paths.
- Do not fake worker output with manually inserted session rows.
- Keep the proof local and production-safe; do not touch live exchange credentials.

## Implementation Plan
1. Extend the existing runtime flow e2e test after the paper lifecycle closes.
2. Poll persisted telemetry produced by the runtime loop.
3. Read the same data through authenticated Bot Runtime API endpoints.
4. Run focused API validation.
5. Update source-of-truth and regenerate V1 reports from pinned inputs.

## Acceptance Criteria
- Runtime flow e2e proves a `RUNNING` PAPER session produced by the signal loop.
- Runtime session detail reports events and tracked symbols.
- Runtime symbol stats include `BTCUSDT` counters and latest runtime price.
- Aggregate monitoring readback sees the same `RUNNING` session and symbol.
- No temporary bypass, mock-only proof, or new parallel telemetry mechanism is introduced.

## Definition of Done
- [ ] Focused API e2e validation passes.
- [ ] Repository guardrails pass after docs/state updates.
- [ ] Bot Runtime source-of-truth status and remaining proof gap are updated.

## Stage Exit Criteria
- [ ] The output matches the declared `Current Stage`.
- [ ] Work from later stages was not mixed in without explicit approval.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtime-flow.e2e.test.ts --sequence.concurrent=false --pool=forks --poolOptions.forks.singleFork=true --testTimeout=30000` passed (`1/1`).
  - `pnpm run ops:project:index -- --today 2026-05-11` passed; matrix counts now `UNVERIFIED: 16`, `BLOCKED_AUTH: 2`, `PASS_LOCAL: 3`.
  - `pnpm run ops:project:scan -- --today 2026-05-11 --index history/artifacts/project-index-2026-05-11.json` passed; findings now 59 (`P0: 10`, `P1: 16`, `P2: 33`).
  - `pnpm run ops:project:ledger -- --today 2026-05-11 --index history/artifacts/project-index-2026-05-11.json --scan history/artifacts/v1-static-issue-scan-2026-05-11.json` passed.
  - `pnpm run ops:project:scorecard -- --today 2026-05-11 --ledger history/artifacts/v1-master-state-ledger-2026-05-11.json` passed; V1 remains `NO-GO` at implementation `51.6%`, evidence `11.2%`, release readiness `7.8%`.
  - `pnpm --filter api run typecheck` passed.
  - `node --check scripts/buildProjectIndex.mjs` passed.
  - `pnpm run quality:guardrails` passed.
  - `git diff --check` passed with line-ending warnings only.
- Manual checks: reviewed generated reports and source-of-truth rows for stale worker-telemetry gap text.
- Screenshots/logs: not applicable
- High-risk checks: local PAPER-only proof; no live exchange credentials or live mutations used; no `chrome-headless-shell` or Vitest node processes remained after validation.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-BOT-RUNTIME-001
- Requirements matrix updated: yes
- Requirement rows closed or changed: REQ-FUNC-003
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: QA-003
- Risk register updated: yes
- Risk rows closed or changed: RISK-003
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: docs/architecture/reference/runtime-signal-merge-contract.md; docs/architecture/architecture-source-of-truth.md
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: Revert the focused e2e assertions and documentation updates if needed.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Bot Runtime local UI/API fixture proof exists, but live-loop worker telemetry proof remains open.
- Gaps: No existing e2e assertion ties runtimeSignalLoop output to Bot Runtime API readbacks.
- Inconsistencies: V1 reports correctly keep Bot Runtime below full local proof.
- Architecture constraints: Runtime telemetry must flow through the approved RuntimeTelemetryService and Bot Runtime read APIs.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: V1 audit matrix, runtime flow e2e, runtime signal loop, telemetry service, Bot Runtime route tests
- Rows created or corrected: pending
- Assumptions recorded: The existing e2e database is safe for local deterministic runtime proof.
- Blocking unknowns: none
- Why it was safe to continue: The work is test and documentation scoped.

### 2. Select One Priority Mission Objective
- Selected task: Bot Runtime worker telemetry live-loop proof.
- Priority rationale: It is the next Bot Runtime blocker in the V1 master ledger.
- Why other candidates were deferred: Production-safe clickthrough should follow after local worker proof is closed.

### 3. Plan Implementation
- Files or surfaces to modify: runtime flow e2e and V1 state/docs.
- Logic: Assert telemetry rows and API projections after the existing live-loop lifecycle.
- Edge cases: Debounced symbol-stat flush requires polling.

### 4. Execute Implementation
- Implementation notes: Extended the existing runtime flow e2e after the paper position lifecycle closes. The test now polls for runtime-loop-created session/stat/event rows and verifies authenticated Bot Runtime session list, session detail, symbol-stats, and aggregate readbacks. Cleanup now clears `runtimeExecutionDedupe` before deleting users.

### 5. Verify and Test
- Validation performed: focused API e2e, API typecheck, project-index syntax check, guardrails, diff check, process cleanup check, regenerated V1 project index, static scan, master ledger, and scorecard with pinned inputs.
- Result: focused API e2e passed; Bot Runtime product action row is now `PASS_LOCAL`; V1 remains `NO-GO`.

### 6. Self-Review
- Simpler option considered: Manual DB seeding was rejected because it would not prove worker output.
- Technical debt introduced: no
- Scalability assessment: Focused e2e increases confidence without adding runtime surface area.
- Refinements made: Removed over-specific list-summary assertions and asserted long/exit counters through detail and symbol-stats API contracts.

### 7. Update Documentation and Knowledge
- Docs updated: V1 action matrix, planning queue, execution plan, generated V1 reports.
- Context updated: project state, task board, module confidence, requirements matrix, quality scenarios, risk register, delivery map, next steps, known issues, regression log, system health.
- Learning journal updated: yes.

## Review Checklist (mandatory)
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

## Notes
Remaining production-safe clickthrough is deliberately out of scope for this local worker proof.

## Result Report
- Changed `apps/api/src/modules/engine/runtime-flow.e2e.test.ts` to prove live-loop Bot Runtime telemetry readback.
- Updated V1 source-of-truth docs and regenerated reports.
- Bot Runtime local audit status moved to `PASS_LOCAL`.
- Remaining gap: production-safe/non-local Bot Runtime clickthrough before module verification/release readiness.

## Integration Evidence
`runtime-flow.e2e.test.ts` proves the integration from runtime signal loop to persisted telemetry to authenticated Bot Runtime API readbacks.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Bot Runtime operator
- Existing workaround or pain: Runtime screen proof was fixture-backed, while worker telemetry proof remained unverified.
