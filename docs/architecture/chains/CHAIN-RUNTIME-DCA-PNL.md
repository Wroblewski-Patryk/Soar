---
id: CHAIN-RUNTIME-DCA-PNL
type: function_chain
status: verified_local
feature: runtime-dca-pnl
risk_level: critical
last_verified_at: 2026-05-23
tags: [soar-map, function-chain, verified_local]
---

# Runtime DCA exchange PnL chain

- Feature: runtime-dca-pnl
- Trigger: [[SOAR-FEATURE-RUNTIME-DCA-PNL]]
- Tests: [[SOAR-TEST-RUNTIME-DCA-PNL]]
- Docs: [[SOAR-DOC-POSITION-PNL-LIFECYCLE]]
- Evidence: history/tasks/runtime-dca-exchange-pnl-threshold-2026-05-23-task.md
- Missing links: Protected production readback

## Execution Chain

1. [[SOAR-FEATURE-RUNTIME-DCA-PNL]]
2. [[SOAR-SERVICE-RUNTIME-AUTOMATION]]
3. [[SOAR-FEATURE-EXCHANGE-ADAPTER]]
4. [[SOAR-DB-POSITION]]
5. [[SOAR-TEST-RUNTIME-DCA-PNL]]
6. [[SOAR-DOC-POSITION-PNL-LIFECYCLE]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
