# AI Assistant Runtime Truth Audit - 2026-05-19

## Scope

Audit ID: `AUD-20`

Purpose: verify the discrepancy between assistant architecture language and the
implementation that currently exists in code.

This audit inspected:

- assistant runtime architecture docs
- AI testing protocol requirements
- backend assistant orchestrator service and tests
- bot assistant config and dry-run service
- Web assistant routes and tests
- code call sites for `orchestrateAssistantDecision`

## Result

Status: `current foundation / hot-path assistant scope deferred`

The project has a tested assistant foundation:

- bot-scoped assistant config exists
- one main assistant plus up to four subagent slots exists at the API contract
  level
- deterministic orchestrator exists
- fail-closed planner failure behavior exists
- partial subagent timeout/error behavior exists
- output sanitization before trace writing exists
- mandate and forbidden-action policy gates exist
- assistant circuit breaker exists
- dry-run HTTP flow exists and is owner-scoped
- Web assistant routes have focused route tests

The project does not currently prove hot-path assistant integration into the
BACKTEST/PAPER/LIVE trading decision loop. `DEC-AUD-002` resolved this by
making current architecture truth foundation/dry-run only and deferring
hot-path orchestration to later gated work.

## Architecture Claim Checked

`docs/architecture/11_assistant-runtime.md` and
`docs/architecture/reference/assistant-runtime-contract.md` now describe the
assistant as current bot-scoped configuration, deterministic orchestration
contracts, and owner-scoped dry-run diagnostics. BACKTEST/PAPER/LIVE hot-path
assistant orchestration is future/gated scope.

`docs/modules/api-engine.md` also lists assistant orchestration under the
engine runtime flow.

## Code Truth Checked

Observed call sites for `orchestrateAssistantDecision`:

- `apps/api/src/modules/engine/assistantOrchestrator.service.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.service.test.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.parity.test.ts`
- `apps/api/src/modules/bots/botAssistant.service.ts`

The production service call site in `botAssistant.service.ts` is
`runAssistantDryRun`. It loads assistant config and subagent rows, then calls
the orchestrator with a `dryrun:*` request id and `botMarketGroupId:
"dry-run"`.

No audited call site was found in the runtime signal loop, execution
orchestrator, backtest execution path, PAPER decision loop, or LIVE decision
loop.

## Validation Run

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm --filter api exec vitest run src/modules/engine/assistantOrchestrator.service.test.ts src/modules/engine/assistantOrchestrator.parity.test.ts` | PASS | `2` files, `6` tests. Covers fail-closed planner failure, partial timeout, trace sanitization, circuit breaker, policy gate, and deterministic BACKTEST/PAPER/LIVE parity for the isolated orchestrator. |
| `pnpm --filter web exec vitest run 'src/app/dashboard/bots/[id]/assistant/page.test.tsx' src/app/dashboard/bots/assistant/page.test.tsx` | PASS | `2` files, `3` tests. Covers focused assistant route behavior. |
| `pnpm --filter api exec vitest run src/modules/bots/bots.orchestration.e2e.test.ts` | BLOCKED, then PASS | First run failed because local Postgres was unavailable at `localhost:5432`. After `pnpm run go-live:infra:up`, the same e2e file passed: `1` file, `3` tests. Infra was stopped with `pnpm run go-live:infra:down`. |

## AI Testing Protocol Status

`AI_TESTING_PROTOCOL.md` was reviewed.

Full protocol status: `not passed / not executed as runtime AI behavior proof`.

Reason:

- the active implementation uses deterministic scaffolding and dry-run
  orchestration
- there is no audited model-backed runtime assistant in BACKTEST/PAPER/LIVE hot
  paths
- there is no reproducible multi-turn AI red-team report for deployed or
  deployable assistant behavior

Required before claiming AI behavior complete:

- memory consistency scenarios
- multi-step context scenarios
- adversarial contradiction scenarios
- role break / prompt-injection scenarios
- memory corruption scenarios
- malformed and mixed-language edge scenarios
- data leakage and unauthorized-access scenarios
- model/runtime configuration record
- transcripts or redacted reproducible excerpts

## Discrepancies

| ID | Severity | Discrepancy | Evidence | Required Decision |
| --- | --- | --- | --- | --- |
| AUD-AI-003 | P1 | No current hot-path runtime/backtest call site exists; architecture is now narrowed so this is future/gated scope instead of a current overclaim. | `botAssistant.service.ts` calls `orchestrateAssistantDecision` only from `runAssistantDryRun`; `rg` found no hot-path runtime/backtest call site. | Plan hot-path assistant orchestration separately if/when product scope requires it. |
| AUD-AI-004 | P1 | AI testing protocol is required before any complete deployable AI trading behavior claim, but current scope is deterministic foundation/dry-run only. | `AI_TESTING_PROTOCOL.md` requires multi-turn scenarios; current validation only covers deterministic service tests, e2e config/dry-run, and Web route tests. | Add an AI red-team scenario harness/report before any deployable AI behavior claim. |

## Safety Notes

- No production journey was run.
- No LIVE order, cancel, close, or exchange-side mutation was run.
- No existing production data was mutated.
- Local Postgres/Redis were started only for the e2e proof and then stopped.
- No `chrome-headless-shell` validation process was left running.

## Current Reusable Audit State

`AUD-20` is current for the accepted foundation/dry-run scope. Hot-path
assistant orchestration remains future/gated work until implemented with
fail-closed risk/execution guards, persisted traces, and AI red-team evidence.
