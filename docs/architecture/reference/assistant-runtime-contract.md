# Assistant Runtime Contract (MVP Foundation)

Status: canonical foundation contract; current implementation is bot-scoped
configuration, deterministic orchestrator coverage, and dry-run diagnostics.
Hot-path BACKTEST/PAPER/LIVE assistant orchestration is later/gated scope until
implemented with fail-closed integration, persisted traces, and AI red-team
evidence.

## Scope
- Bot-scoped assistant topology: one main assistant + up to four subagents.
- Applies today to assistant configuration, isolated deterministic
  orchestration tests, and owner-scoped dry-run diagnostics.
- Future hot-path use may apply to `BACKTEST`, `PAPER`, and `LIVE` decision
  orchestration only after a separate approved implementation and validation
  package.
- Assistant output remains advisory unless execution policy allows action.

## Chain Classifications

This contract uses three chain classes; only one is implemented today:

- **Advisory chain (implemented)**  
  - `POST /dashboard/bots/:id/assistant-config/dry-run` with `mode=BACKTEST|PAPER`
  - deterministic proposal output only
  - no side effects
- **Operator-assisted chain (not implemented as a hard floor in Soar yet)**  
  - planned as trace visibility followed by an existing non-AI operator action path
  - still requires existing bot/risk/product command flows (`bot`, `orders`,
    `portfolio`, and execution command routes) to pass their own gates
- **Executable chain (deferred and not implemented)**  
  - any future auto-execution path requires separate product approval,
    persisted execution trace, and dedicated AI red-team acceptance under
    `REQ-AI-030`.

## Current Responsibilities
1. Main assistant foundation:
   - load bot-scoped assistant configuration
   - coordinate bounded subagent slots for deterministic dry-run diagnostics
   - return one structured proposal for inspection
2. Subagent foundation:
   - perform one role-limited analysis function
   - produce structured, machine-readable output
   - never bypass risk/mandate policies

## Future Hot-Path Responsibilities
1. Main assistant:
   - build decision plan for current bot/market-group/symbol window
   - dispatch bounded tasks to enabled subagents
   - merge subagent outputs deterministically
   - return one final proposal: `LONG | SHORT | EXIT | NO_TRADE`
2. Subagent:
   - perform one role-limited analysis function
   - produce structured, machine-readable output
   - never bypass risk/mandate policies

## Roles (V1 Baseline)
- `TREND`
- `MOMENTUM`
- `RISK`
- `MICROSTRUCTURE`
- `GENERAL`

## I/O Schema
Input envelope:
- `requestId`
- `userId`, `botId`, `botMarketGroupId`
- `symbol`, `intervalWindow`
- `marketSnapshot`
- `strategyContext`
- `riskContext`
- `executionMode`

Output envelope:
- `requestId`
- `agentRole`
- `proposal` (`LONG | SHORT | EXIT | NO_TRADE`)
- `confidence` (0..1)
- `rationale` (short text)
- `signals` (structured key-value payload)
- `policyFlags` (optional warnings)
- `latencyMs`

## Timeout Policy
Applies to current deterministic orchestrator behavior and remains mandatory
for any future hot-path integration:

- main assistant hard timeout: `2500ms` (configurable)
- each subagent hard timeout: `1200ms` (configurable)
- per-slot timeout is isolated (one timeout does not kill the whole orchestration)

## Failure Semantics
- fail-closed mandatory rule:
  - if policy validation fails -> final output `NO_TRADE`
  - if merge determinism cannot be guaranteed -> `NO_TRADE`
  - if main assistant timeout -> fallback to strategy-only runtime path
- partial subagent failure:
  - continue with successful slots
  - mark failed slots in trace metadata
  - keep deterministic merge order

## Safety and Mandate Boundaries
- assistant cannot disable kill switch, bypass consent, or override risk caps.
- assistant cannot issue action outside bot mode/policy permissions.
- all assistant proposals are post-validated by runtime risk/execution guards.
- `AssistantDryRunSchema` currently accepts only `mode=BACKTEST|PAPER`; `mode=LIVE`
  is rejected at API boundary.

## Tool and Context Boundaries
- Tool calls in current chain are scoped to local assistant orchestration
  internals (planner/subagent wiring), bot assistant/subagent DB lookups, and
  trace writing.
- No exchange adapter, order service, wallet transfer, subscription mutation, or
  execution command tool is called from the current dry-run path.
- Input context is user and bot scoped; bot ownership is enforced before
  orchestration.
- Prompt text and rationale are sanitized for trace persistence.

## Prompt/Data Leakage Boundaries
- The dry-run request body includes only `symbol`, `intervalWindow`, and `mode`.
- No raw secrets, keys, or credentials are loaded into or returned by dry-run trace.
- Current risk areas to keep explicit: user-controlled `mandate`/subagent role text and
  injected context if future memory/context enrichment is added; these require redaction
  and allowlist controls before enabling those inputs in executable chains.

## Audit and Explainability
For current dry-run/foundation behavior, trace data must remain structured and
sanitized. For future hot-path assistant cycles, persist trace:
- request envelope hash/id
- enabled slots and per-slot status (`ok | timeout | error | skipped`)
- raw proposals (sanitized)
- merge decision path
- final output and rejection reason (if `NO_TRADE`)

## Determinism Rules
- stable merge precedence:
  1. hard safety guards
  2. explicit `EXIT` from risk/main policy
  3. weighted directional merge
  4. tie/weak consensus => `NO_TRADE`
- deterministic tie-break keys:
  - role priority
  - confidence
  - slot index
  - lexical `agentRole` fallback

## Runtime Degradation
- assistant disabled or unavailable:
  - runtime continues in strategy-only mode
  - decision trace contains `assistantMode: degraded`

## Gate and Bypass Controls
- AI outputs are advisory only for the implemented chain.
- AI cannot bypass:
  - subscription/entitlement checks,
  - bot ownership and wallet capability checks,
  - risk pre-trade gates,
  - execution authority checks.
- Any future executable AI chain must still pass existing trading/product/security gate
  enforcement and fail closed if any gate rejects.

## Non-Goals for MVP Foundation
- autonomous model retraining in runtime hot path
- free-form unstructured assistant output contracts
- cross-user shared memory writes in synchronous execution path
