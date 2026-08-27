# AI Assistant Foundation Protocol Harness Task

## Header

- ID: `AI-ASSISTANT-FOUNDATION-PROTOCOL-HARNESS-2026-05-23`
- Title: Add reproducible AI protocol harness for assistant foundation scope
- Task Type: test/docs
- Current Stage: verification
- Status: DONE
- Owner: Active coordinator
- Depends on: `DEC-AUD-002`, `AI_TESTING_PROTOCOL.md`, `SOAR-ASSISTANT-AI-001`
- Priority: P1
- Module Confidence Rows: `SOAR-ASSISTANT-AI-001`
- Requirement Rows: `REQ-AI-030`
- Quality Scenario Rows: AI safety, regression resistance, operator truthfulness
- Risk Rows: `RISK-030`
- Iteration: 2026-05-23
- Operation Mode: BUILDER
- Mission ID: `REPO-SOT-FUNCTION-PARITY-2026-05-23`
- Mission Status: CHECKPOINTED

## Context

`SOAR-ASSISTANT-AI-001` was still marked `PARTIAL` because full runtime AI
red-team proof is not implemented. Explorer review confirmed this is not a
current architecture-code mismatch: `DEC-AUD-002` narrows current assistant
truth to bot-scoped configuration, deterministic orchestration foundation, and
owner-scoped dry-run diagnostics. BACKTEST/PAPER/LIVE hot-path assistant
orchestration is future/gated scope.

## Goal

Add a reproducible, non-secret, non-production AI protocol harness for the
current assistant foundation scope, while preserving the explicit boundary that
full runtime AI behavior is not complete.

## Scope

- Add structured foundation-scope AI protocol scenarios.
- Add an API Vitest harness that validates scenario coverage and executes
  foundation-applicable deterministic scenarios against
  `orchestrateAssistantDecision`.
- Add an operations report that records what the harness proves and what it
  does not prove.
- Update module confidence and risk state for `SOAR-ASSISTANT-AI-001` and
  `RISK-030`.

## Implementation Plan

1. Review `AI_TESTING_PROTOCOL.md`, `DEC-AUD-002` evidence, assistant docs,
   and current orchestrator tests.
2. Represent all AI protocol risk areas in JSON.
3. Execute only deterministic foundation-applicable scenarios in code.
4. Classify memory, multi-turn context, and memory corruption scenarios as
   `not_applicable_foundation_only`.
5. Record residual runtime AI limits and update source-of-truth state.

## Acceptance Criteria

- All seven `AI_TESTING_PROTOCOL.md` risk areas are represented.
- Harness does not require secrets, live model access, database, production, or
  browser automation.
- Harness does not claim runtime AI behavior complete.
- Existing assistant foundation tests still pass.
- State files keep hot-path assistant orchestration future/gated.

## Definition of Done

- [x] Scenario JSON added.
- [x] Protocol harness test added.
- [x] Operations report added.
- [x] Existing assistant foundation tests rerun.
- [x] Module confidence and risk register updated.

## Forbidden

- Do not call live AI providers.
- Do not add BACKTEST/PAPER/LIVE hot-path assistant execution.
- Do not mutate production, live trading, exchange state, or existing data.
- Do not claim full `AI_TESTING_PROTOCOL.md` runtime behavior proof.

## Validation Evidence

- `pnpm --filter api exec vitest run src/modules/engine/assistantOrchestrator.protocol.test.ts --run --reporter=dot` => PASS, `1` file / `3` tests.
- `pnpm --filter api exec vitest run src/modules/engine/assistantOrchestrator.service.test.ts src/modules/engine/assistantOrchestrator.parity.test.ts --run --reporter=dot` => PASS, `2` files / `6` tests.
- `pnpm --filter web exec vitest run 'src/app/dashboard/bots/[id]/assistant/page.test.tsx' src/app/dashboard/bots/assistant/page.test.tsx --run --reporter=dot` => PASS, `2` files / `3` tests.

## Architecture Evidence

- Architecture source reviewed:
  - `docs/architecture/11_assistant-runtime.md`
  - `docs/architecture/reference/assistant-runtime-contract.md`
  - `docs/modules/api-engine.md`
  - `docs/modules/api-bots.md`
  - `AI_TESTING_PROTOCOL.md`
- Fits approved architecture: yes. Current assistant scope remains
  foundation/dry-run only under `DEC-AUD-002`.
- Mismatch discovered: no current mismatch. Residual runtime hot-path AI is
  future/gated scope, not implemented scope.

## Result Report

The assistant foundation now has a repeatable protocol harness for current
scope. `RISK-030` remains mitigating, because full runtime AI trading behavior
still requires a separate future implementation with persisted traces,
fail-closed integration, model/runtime assumptions, and red-team evidence.
