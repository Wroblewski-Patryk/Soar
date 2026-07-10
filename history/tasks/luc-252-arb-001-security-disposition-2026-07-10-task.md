# LUC-252 - ARB-001 Security Disposition

## Header
- ID: LUC-252-ARB-001-SECURITY-DISPOSITION-2026-07-10
- Title: [Soar][ARB-001] Security disposition for assistant hot-path orchestration
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Security
- Priority: P1
- Mission ID: LUC-252-ARB-001-SECURITY-DISPOSITION-2026-07-10
- Mission Status: VERIFIED_FOR_CURRENT_SCOPE

## Context
[LUC-252](/LUC/issues/LUC-252) is a materialized ARB-001 implementation issue
for gated hot-path assistant orchestration with persisted traces and
fail-closed boundaries.

Current Soar source truth already says the V1 assistant scope is
foundation/dry-run only:
- `DEC-AUD-002` defers hot-path assistant trading orchestration.
- `DEC-ARB-001` records V1 non-activation for BACKTEST/PAPER/LIVE runtime
  decision loops.
- [LUC-2773](/LUC/issues/LUC-2773) confirms `SOAR-ASSISTANT-AI-001` remains
  accepted deferred scope for V1.

## Goal
Recheck the security/privacy boundary for the assigned ARB-001 issue and avoid
leaving a stale implementation issue active when current Product/CTO source
truth does not authorize hot-path activation.

## Scope
- `docs/architecture/11_assistant-runtime.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `.agents/state/decision-register.md`
- `apps/api/src/modules/engine/assistantOrchestrator.service.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.service.test.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.protocol.test.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.parity.test.ts`
- `apps/api/src/modules/bots/botAssistant.service.ts`
- `apps/api/src/modules/bots/bots.types.ts`

## Result
The current assistant foundation remains fail-closed for the approved scope:
- dry-run API schema accepts only `BACKTEST|PAPER`;
- bot ownership is checked before assistant config and dry-run execution;
- default `LIVE` input to the orchestrator returns `strategy_only` /
  `NO_TRADE` unless a separate hot-path flag is enabled;
- planner failures, empty slots, circuit-open state, ties, weak consensus, and
  forbidden/mandate-rejected outputs degrade to `NO_TRADE`;
- trace text/metadata is sanitized before write;
- no current dry-run path calls exchange adapters, order services, wallet
  mutation, subscription mutation, or execution command tools.

The full [LUC-252](/LUC/issues/LUC-252) implementation contract is not active
for V1. Persisted immutable runtime assistant traces and executable
BACKTEST/PAPER/LIVE hot-path orchestration remain future gated scope, not a
current security implementation task.

## Validation Evidence
- `corepack pnpm --filter api exec vitest run src/modules/engine/assistantOrchestrator.service.test.ts src/modules/engine/assistantOrchestrator.protocol.test.ts src/modules/engine/assistantOrchestrator.parity.test.ts src/modules/bots/botAssistant.service.test.ts src/modules/bots/bots.types.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
- Result: PASS, `5` files / `15` tests.

## Security / Privacy Evidence
- Data classification: bot-scoped assistant config and structured dry-run
  traces; no raw secrets or credentials.
- Trust boundaries: user -> API schema -> bot ownership -> assistant config
  read -> deterministic orchestrator; no external model/tool/exchange boundary
  in the current foundation path.
- Permission or ownership checks: `getOwnedBot(userId, botId)` gates config and
  dry-run service access.
- Abuse cases checked: LIVE-mode activation pressure, prompt/role-break
  strings, forbidden action, mandate mismatch, confidence abuse, planner
  failure, subagent timeout, circuit-open degradation.
- Secret handling: no secret value readback, no secret writes, no production
  account/session access.
- Fail-closed behavior: verified by focused assistant tests and protocol
  scenarios.
- Residual risk: future hot-path activation still requires Product+CTO
  approval, persisted immutable traces, AI Runtime implementation, QA/Test
  runtime integration proof, and Security red-team evidence before any runtime
  trading claim.

## Disposition
Security recommends closing [LUC-252](/LUC/issues/LUC-252) as superseded by the
accepted V1 non-activation decision, not as an implemented hot-path feature.

Future activation should be opened as a new post-V1 parent/child set only after
Product+CTO explicitly reopen `ARB-001`.

## Result Report
- Task summary: revalidated current assistant security boundary and confirmed
  [LUC-252](/LUC/issues/LUC-252) is stale/deferred for V1 implementation.
- Files changed: this task packet and context board state.
- How tested: focused assistant API test pack passed.
- What is incomplete: persisted hot-path runtime traces and executable
  assistant orchestration are intentionally not implemented.
- Next steps: no implementation child from this heartbeat; reopen through
  Product+CTO only if post-V1 hot-path assistant activation is desired.
