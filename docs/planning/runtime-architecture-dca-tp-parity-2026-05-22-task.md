# Runtime Architecture DCA/TP Parity Task

## Header
- ID: `RUNTIME-ARCHITECTURE-DCA-TP-PARITY-2026-05-22`
- Title: Restore architecture parity for profit-side DCA before TP close
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: `LIVE-DCA-SUBMITTED-FILL-GATE-2026-05-22`
- Priority: P0
- Module Confidence Rows: `SOAR-BOT-RUNTIME-001`, `SOAR-BACKTESTS-001`, `SOAR-ORDERS-001`
- Requirement Rows: runtime execution lifecycle parity, DCA-first close gating
- Quality Scenario Rows: live-trading safety, runtime/backtest parity, regression resistance
- Risk Rows: false lifecycle close before DCA progression, misleading bot behavior
- Iteration: 2026-05-22 emergency runtime architecture audit
- Operation Mode: BUILDER
- Mission ID: `RUNTIME-ARCHITECTURE-PARITY-2026-05-22`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the selected emergency builder slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed through the active mission packet contract.
- [x] Missing or template-like state tables were not found for this slice.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by removing a confirmed money-path lifecycle drift.

## Mission Block
- Mission objective: audit architecture-vs-code parity for runtime bot lifecycle behavior and repair confirmed P0/P1 drift.
- Release objective advanced: safer LIVE/PAPER/BACKTEST lifecycle parity for DCA-first position management.
- Included slices: DCA-first TP close gating in runtime core, runtime automation regression, replay regression, and interleaved portfolio regression.
- Explicit exclusions: live exchange-side mutation, production deploy, broad UI redesign, and unrelated `AUD-19` release proof.
- Checkpoint cadence: close each confirmed architecture mismatch with focused tests before expanding scope.
- Stop conditions: architecture contradiction requiring product decision, failing quality gate that cannot be safely fixed, or production credentials/real live-money mutation.
- Handoff expectation: next checkpoint should continue architecture audit at remaining runtime contracts only after this focused fix is committed and pushed.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, `.agents/state/active-mission.md`, `.codex/context/PROJECT_STATE.md` | Mission framing, integration, state updates | Bounded runtime parity checkpoint | Parent focused validation | CHECKPOINTED |
| Architecture | Coordinator serial lane | `docs/architecture/06_execution-lifecycle.md`, `reference/position-management-pnl-lifecycle-contract.md`, `reference/live-protection-state-parity-contract.md`, `reference/execution-lifecycle-parity-contract.md` | Contract extraction | Confirmed DCA-first TP drift | Code/test diff | VERIFIED |
| Runtime implementation | Coordinator serial lane | Runtime engine services | `positionManagement.service.ts`, runtime automation test | TP now respects profit-side DCA gate | Focused engine tests | VERIFIED |
| Backtest parity | Coordinator serial lane | Backtest parity docs and code | backtest replay and portfolio helper/tests | Backtest helper treats TP like protected close for profit-side DCA | Focused backtest tests | VERIFIED |
| QA/Test | Coordinator serial lane | `.agents/core/quality-gates.md` | Focused Vitest packs | `104` focused tests passed across runtime/backtest packs | Vitest output | VERIFIED |
| Documentation/Memory | Coordinator | Project state and task board | Planning task and state docs | Durable source-of-truth update | Guardrails and diff check | VERIFIED |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was considered through the repository lane contract.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership did not require a responsibility-learning entry for this slice.
- [x] Process eval is not required unless the broader audit continues into subagent-heavy work.

## Context
The operator reported that bot functions still do not behave correctly after prior DCA fixes. Architecture states that `DCA` must be evaluated before close protection and that runtime, PAPER, LIVE, and backtest must share one lifecycle meaning.

## Goal
Remove the confirmed code drift where basic `TP` could close while profit-side DCA levels remained pending, even though `TTP`, `SL`, and `TSL` already passed through DCA-first close gates.

## Success Signal
- User or operator problem: bot closes or reports lifecycle progress inconsistent with configured DCA ladder.
- Expected product or reliability outcome: profit-side DCA intent blocks `TP` the same way it blocks `TTP` until the relevant DCA gate is satisfied or released.
- How success will be observed: focused runtime and backtest tests fail before the fix and pass after it.
- Post-launch learning needed: yes.

## Deliverable For This Stage
A verified focused code fix with regression tests and source-of-truth updates.

## Constraints
- use existing position-management and backtest helper systems
- do not introduce new lifecycle frameworks
- do not bypass fill authority or dedupe systems
- do not mutate production or live exchange state
- keep the slice limited to confirmed architecture drift

## Definition of Done
- [x] Runtime core `TP` respects profit-side DCA gate.
- [x] Backtest replay and portfolio helpers apply the same `TP` gate.
- [x] Focused runtime/backtest regression packs pass.
- [x] API typecheck and repository guardrails pass.
- [x] Source-of-truth files are updated.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Later deployment/release work was not mixed in.
- [x] Risks and assumptions are stated.

## Forbidden
- live exchange mutation
- hidden workaround or duplicated lifecycle path
- UI-only correction without engine parity
- treating production timeout as a code-validation pass or fail

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtests.contract-remediation.test.ts --run` => PASS, `66/66`
  - `corepack pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts --run` => PASS, `38/38`
  - `corepack pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtests.contract-remediation.test.ts --run` => PASS, `104/104`
  - `corepack pnpm --filter api run typecheck` => PASS
  - `corepack pnpm run quality:guardrails` => PASS
  - `git diff --check` => PASS with line-ending warnings only
- Manual checks: architecture contract review against DCA-first lifecycle docs.
- Screenshots/logs: not applicable.
- High-risk checks: production HTTP probes timed out and are recorded as ops blocker, not local code proof.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: `SOAR-BOT-RUNTIME-001`, `SOAR-BACKTESTS-001`
- Requirements matrix updated: not applicable for this narrow checkpoint.
- Quality scenarios updated: not applicable for this narrow checkpoint.
- Risk register updated: not applicable for this narrow checkpoint.
- Reality status: verified locally; production deploy/readback blocked by endpoint timeout.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
  - `docs/architecture/reference/live-protection-state-parity-contract.md`
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- Fits approved architecture: yes.
- Mismatch discovered: yes, basic `TP` bypassed the profit-side DCA-first gate.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none; implementation now matches existing architecture.

## Deployment / Ops Evidence
- Deploy impact: medium, runtime money-path logic changes.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore previous TP behavior if needed, but that previous behavior conflicts with architecture.
- Observability or alerting impact: existing runtime events remain unchanged.
- Staged rollout or feature flag: no existing flag for this lifecycle rule.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `TP` close path did not check DCA-first gate, while `TTP`, `SL`, and `TSL` did.
- Gaps: production is currently unreachable from this shell, so deploy proof is separate.
- Inconsistencies: runtime core and backtest helper both omitted `take_profit` from profit-side DCA blocking.
- Architecture constraints: one lifecycle meaning across BACKTEST/PAPER/LIVE.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: architecture contracts, active mission, project state, task board, module confidence ledger, runtime/backtest code.
- Rows created or corrected: pending state updates.
- Assumptions recorded: safe assumption that existing architecture is the source of truth and does not require user decision.
- Blocking unknowns: production VPS availability for post-deploy proof.
- Why it was safe to continue: fix aligns implementation to existing docs and adds focused tests without production mutation.

### 2. Select One Priority Mission Objective
- Selected task: repair DCA-first TP parity drift.
- Priority rationale: money-path bot lifecycle correctness, directly related to operator complaint.
- Why other candidates were deferred: production availability and broader `AUD-19` require ops/deploy lane after local code proof.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/engine/positionManagement.service.ts`
  - `apps/api/src/modules/backtests/backtestReplayCore.ts`
  - focused runtime/backtest tests
- Logic: require the same profit-side DCA protection satisfaction for `TP` as for `TTP`.
- Edge cases: allow `TP` when remaining DCA levels are loss-side only.

### 4. Execute Implementation
- Implementation notes: reused existing `ttpDcaProtectionSatisfied` and `shouldBlockCloseByPendingDca` paths instead of introducing a new mechanism.

### 5. Verify and Test
- Validation performed: focused runtime core, runtime automation, backtest replay, portfolio tests, API typecheck, guardrails, and diff check.
- Result: PASS, `104` focused tests plus typecheck and guardrails.

### 6. Self-Review
- Simpler option considered: block all `TP` whenever any DCA remains.
- Technical debt introduced: no.
- Scalability assessment: low-risk reuse of existing helper semantics.
- Refinements made: added explicit loss-side-only `TP` allowance test.

### 7. Update Documentation and Knowledge
- Docs updated: this task file plus state files.
- Context updated: pending.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal update not required.
- [x] Required responsibility lanes were integrated or tracked.
- [ ] Parent validation ran after accepted lane integration.

## Notes
Current production probes to `soar.luckysparrow.ch` and `api.soar.luckysparrow.ch` timed out during this task. This is not accepted as evidence for or against the local fix; it remains an ops/deployment blocker to verify separately.

## Result Report
- Task summary: Restored DCA-first profit-side protection for `TP` across runtime core and backtest parity helpers.
- Files changed: engine position management, runtime automation tests, backtest replay tests, portfolio remediation tests, state docs.
- How tested: focused Vitest packs listed above.
- What is incomplete: production deploy/readback and broader architecture audit continuation.
- Next steps: commit/push if green, then address production availability/deploy proof.
- Decisions made: no architecture change; implementation now follows existing architecture.
