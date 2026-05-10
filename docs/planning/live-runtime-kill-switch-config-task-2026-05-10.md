# Task

## Header
- ID: LIVE-RUNTIME-KILL-SWITCH-CONFIG-2026-05-10
- Title: Add environment-controlled LIVE runtime kill switch
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PROD-API-RUNTIME-READINESS-8CD5C1B3-2026-05-10
- Priority: P0
- Iteration: 53
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Production key readiness now passes. The remaining proof lane is a controlled
LIVE runtime/session readback. Activating a LIVE bot without an environment
kill switch could submit real exchange orders if a strategy emits an entry.

## Goal
Add an environment-controlled LIVE runtime kill switch that is applied at the
final-candle pre-trade gate before order orchestration.

## Success Signal
- User or operator problem: a LIVE runtime session proof needs a hard no-order
  safety mechanism.
- Expected product or reliability outcome: operators can set an env flag that
  allows runtime/session observation while fail-closing all LIVE entries before
  exchange order submission.
- How success will be observed: tests prove `globalKillSwitch` and
  `emergencyStop` are passed into pre-trade and block orchestration.
- Post-launch learning needed: yes

## Deliverable For This Stage
Runtime config, final-candle decision wiring, tests, and docs/state updates.

## Constraints
- do not activate production LIVE bot in this task
- do not submit exchange orders
- preserve default behavior when env flags are unset
- reuse existing pre-trade guardrails
- no new parallel runtime system

## Scope
- `apps/api/src/config/runtimeExecution.ts`
- `apps/api/src/config/runtimeExecution.test.ts`
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.ts`
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.test.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.service.ts`
- `docs/operations/bot-module-operator-runbook.md`
- state/context docs

## Implementation Plan
1. Add `liveGlobalKillSwitch` and `liveEmergencyStop` booleans to runtime loop
   config.
2. Pass those flags from runtime signal loop into final-candle decision.
3. Forward the flags into `analyzePreTradeFn` only for LIVE decisions.
4. Add tests that prove LIVE kill switch blocks before signal creation/order
   orchestration.
5. Document the safe activation proof sequence.
6. Run focused tests, API typecheck, guardrails, docs parity, and diff check.

## Acceptance Criteria
- Env defaults are false.
- Env overrides parse booleans.
- LIVE final-candle decisions pass kill-switch flags into pre-trade.
- When pre-trade blocks due kill switch, no signal is created and orchestration
  is not called.
- PAPER behavior is unaffected.

## Definition of Done
- [x] Focused runtime config and final-candle tests pass.
- [x] API typecheck passes.
- [ ] Guardrails/docs parity pass.
- [x] Docs/state updated.
- [ ] Changes committed and pushed.

## Forbidden
- production LIVE activation
- exchange order submission
- hidden bypasses
- fake readback evidence

## Validation Evidence
- Tests:
  - `apps/api .\node_modules\.bin\vitest.CMD run src\config\runtimeExecution.test.ts src\modules\engine\runtimeFinalCandleDecision.service.test.ts` PASS 14 tests.
  - `apps/api .\node_modules\.bin\tsc.CMD --noEmit` PASS.
- Manual checks: reviewed runtime final-candle flow to confirm the guard is
  passed before signal creation and `orchestrateFn`.
- Screenshots/logs: not applicable
- High-risk checks: no production writes or live-money operations.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/modules/api-engine.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, kill-switch contract existed conceptually but was
  not env-controlled in the runtime final-candle path.
- Decision required from user: no
- Approval reference if architecture changed: user asked to keep working until
  V1 is correct.
- Follow-up architecture doc updates: operations runbook update only.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: optional new env flags:
  - `RUNTIME_LIVE_GLOBAL_KILL_SWITCH`
  - `RUNTIME_LIVE_EMERGENCY_STOP`
- Health-check impact: none
- Smoke steps updated: controlled runtime proof notes added to runbook.
- Rollback note: revert the single commit if runtime guard behavior regresses.
- Observability or alerting impact: blocked decisions are already emitted as
  `PRETRADE_BLOCKED` events.
- Staged rollout or feature flag: env flags default off.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: LIVE runtime session proof would require bot activation, which could
  submit real orders without a hard pre-trade kill switch.
- Gaps: env-level kill switch not wired into final-candle pre-trade call.
- Inconsistencies: architecture mentions kill switch, runtime path did not
  expose an operator env control for it.
- Architecture constraints: reuse pre-trade guardrails and runtime telemetry.

### 2. Select One Priority Task
- Selected task: env-controlled LIVE runtime kill switch.
- Priority rationale: it is the safest prerequisite for controlled live session
  proof.
- Why other candidates were deferred: production activation/readback must wait
  for hard no-order guard.

### 3. Plan Implementation
- Files or surfaces to modify: runtime config, final-candle decision, signal
  loop, focused tests, ops docs, state.
- Logic: flags default false; when true and bot mode is LIVE, pre-trade sees
  `globalKillSwitch`/`emergencyStop`.
- Edge cases: PAPER must not inherit LIVE kill switch.

### 4. Execute Implementation
- Implementation notes: added optional runtime LIVE kill-switch config,
  forwarded it to final-candle pre-trade, and documented controlled session
  proof sequence.

### 5. Verify and Test
- Validation performed: focused runtime tests and API typecheck.
- Result: PASS.
- Production release evidence: after push, production build-info reached
  `f00080842ea59289e8d683ac298939a23b522e67`; public deploy smoke passed for
  API `/health`, API `/ready`, and Web `/`; Coolify showed Soar services
  running after the queued deploy completed.

### 6. Self-Review
- Simpler option considered: operator-only manual caution was rejected because
  runtime safety should be enforced in code.
- Technical debt introduced: no
- Scalability assessment: env flags reuse existing pre-trade reasons and
  telemetry without introducing a parallel guard.
- Refinements made: tests prove PAPER does not inherit LIVE kill-switch flags.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/operations/bot-module-operator-runbook.md`
  - `.agents/state/*`
  - `.codex/context/*`
  - `docs/planning/mvp-next-commits.md`
- Context updated: yes
- Learning journal updated: yes

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

## Result Report
LIVE runtime now has optional environment-controlled no-order guards. When
enabled, final-candle LIVE decisions pass kill-switch flags to pre-trade and
block before signal creation/order orchestration. This creates a safer
precondition for controlled production session/readback proof. The change is
deployed on production at
`f00080842ea59289e8d683ac298939a23b522e67`, with public API/Web smoke passing.
