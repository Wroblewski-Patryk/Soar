# LUC-5310 Runtime DCA/PnL PAPER-First Proof Triage

## Status

- Result: `PARTIALLY_VERIFIED / LOCAL_RUNTIME_CONTRACTS_PASS / PROTECTED_PRODUCTION_PROOF_NOT_RUN / READBACK_PERFORMANCE_FOLLOW_UP_ROUTED`
- Issue: [LUC-5310](/LUC/issues/LUC-5310)
- Evidence date: 2026-06-20
- Owner: 09 QVE (QA & Verification Engineer)

## Scope

Follow-up from [LUC-5307](/LUC/issues/LUC-5307) to reproduce and classify the
risk that runtime DCA/PnL behavior is not working correctly. This heartbeat was
bounded to PAPER-first/local-safe verification and triage. No production or LIVE
mutation was authorized by the wake payload.

## Proof Summary

Local runtime correctness contracts passed:

- DCA thresholds use exchange PnL truth for imported runtime positions.
- Submitted/pending DCA prevents premature close.
- TP remains blocked while profit-side DCA is pending.
- SL can proceed after loss-side DCA when remaining levels are profit-side only.
- Runtime positions API readback returns canonical margin, mark price,
  unrealized PnL, PnL percent, DCA counts, planned levels, executed levels,
  and stale-DCA fail-closed behavior.
- Exchange-order boundary and runtime execution dedupe checks passed.

Protected production proof was not run because the wake did not include a fresh
approval fact for protected production action/readback, secret/account use, or
fixture mutation.

## Commands And Results

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts --run --sequence.concurrent=false` | TIMEOUT | Combined command exceeded 180s before returning output. Not treated as a product failure. |
| `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts --run --sequence.concurrent=false` | TIMEOUT | Smaller `pnpm run test` wrapper still exceeded 120s without output. Superseded by direct `vitest run` commands below. |
| `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts --sequence.concurrent=false --reporter=verbose` | PASS | `1` file, `2` tests. |
| `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts --sequence.concurrent=false --reporter=verbose` | PASS | `1` file, `2` tests. |
| `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts --sequence.concurrent=false --reporter=verbose` | FAIL | Default 5000ms test budget timed out after first LIVE-shaped positions route returned `200` in `4209 ms`; second test still passed. |
| `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts --sequence.concurrent=false --reporter=verbose --testTimeout=15000` | PASS | `1` file, `2` tests. Slow path: positions `4204 ms`, symbol-stats `3169 ms`, test `9693 ms`. |
| `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts --sequence.concurrent=false --reporter=verbose --testTimeout=15000` | PASS | `1` file, `7` tests. Slow first positions readback `6968 ms`; remaining cases `43-59 ms`. |
| `pnpm --filter api exec vitest run src/modules/engine/runtimeExchangeOrderGuard.service.test.ts src/modules/engine/runtimeExecutionDedupe.service.test.ts --sequence.concurrent=false --reporter=verbose` | PASS | `2` files, `18` tests. |

## Findings

1. Product correctness is locally verified for the focused DCA/PnL runtime
   contracts covered by this issue.
2. The default route-level PnL proof is not deterministic under the current
   `5000 ms` Vitest budget. The same product assertions pass with
   `--testTimeout=15000`, but the observed route timings are high enough to
   require backend/runtime performance or test-harness classification.
3. Fresh production protected proof remains unexecuted and unauthorized in this
   heartbeat.

## Follow-Up

- Created backend child issue [LUC-5319](/LUC/issues/LUC-5319) for the slow
  runtime positions/symbol-stats readback and default-test-budget failure
  classification.
- No runtime code repair was made by QVE in this heartbeat.

## Safety Boundary

No deploy, push, restart, rollback, env edit, secret/account readback, raw
account artifact, production fixture mutation, database/Redis mutation outside
local tests, exchange action, order, position, payment/subscription mutation, or
live-trading action occurred.

## Cleanup

- Browser/headless process check found no validation-created browser rows.
- Recent `node.exe` rows inspected through `Win32_Process` were Paperclip,
  Codex, or MCP processes, not Vitest worker leftovers from this proof; none
  were terminated.
