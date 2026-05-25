---
id: CHAIN-RELEASE-AUDIT-TOOLING
type: function_chain
status: verified_local
feature: release-audit-tooling
risk_level: critical
last_verified_at: 2026-05-24
tags: [soar-map, function-chain, verified_local]
---

# Release audit tooling evidence chain

- Feature: release-audit-tooling
- Trigger: [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]]
- Tests: [[SOAR-TEST-RELEASE-AUDIT-TOOLING]]
- Docs: [[SOAR-DOC-LOCAL-DEVELOPMENT]], [[SOAR-DOC-TESTING]], [[SOAR-DOC-ARCHITECTURE-GRAPH-SYSTEM]]
- Evidence: history/tasks/operator-unblock-default-current-packet-2026-05-24-task.md;history/tasks/reusable-audit-history-path-resolver-2026-05-24-task.md;history/releases/v1-preflight-production-no-secret-refresh-2026-05-24.md
- Missing links: Protected production input proof remains blocked by missing operator-provided environment names

## Execution Chain

1. [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]]
2. [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]]
3. [[SOAR-TOOL-V1-FINAL-PREFLIGHT]]
4. [[SOAR-TOOL-V1-RELEASE-GATE]]
5. [[SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK]]
6. [[SOAR-TOOL-REUSABLE-AUDIT-CHECKERS]]
7. [[SOAR-TEST-RELEASE-AUDIT-TOOLING]]
8. [[SOAR-WORKFLOW-RELEASE-AUDIT-TOOLING-CHAIN]]
9. [[SOAR-DOC-LOCAL-DEVELOPMENT]]
10. [[SOAR-DOC-TESTING]]
11. [[SOAR-DOC-ARCHITECTURE-GRAPH-SYSTEM]]

## Systemic Analysis Rule

When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.
