---
id: CHAIN-DASHBOARD-RUNTIME
type: function_chain
status: partially_verified
feature: dashboard-runtime
risk_level: high
last_verified_at: 2026-05-23
tags: [soar-map, function-chain, partially_verified]
---

# Dashboard runtime monitoring chain

- Feature: dashboard-runtime
- Trigger: [[SOAR-PAGE-DASHBOARD]]
- Tests: [[SOAR-TEST-DASHBOARD-RUNTIME]]
- Docs: [[SOAR-DOC-TRACEABILITY]], [[SOAR-DOC-WEB-DASHBOARD-HOME]], [[SOAR-DOC-API-BOTS]]
- Evidence: apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx
- Missing links: Fresh authenticated browser proof after public reachability restore

## Execution Chain

1. [[SOAR-PAGE-DASHBOARD]]
2. [[SOAR-COMP-HOME-LIVE-WIDGETS]]
3. [[SOAR-API-BOT-RUNTIME-POSITIONS]]
4. [[SOAR-DB-RUNTIME-SESSION]]
5. [[SOAR-DB-POSITION]]
6. [[SOAR-TEST-DASHBOARD-RUNTIME]]
7. [[SOAR-DOC-WEB-DASHBOARD-HOME]]
8. [[SOAR-DOC-API-BOTS]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
