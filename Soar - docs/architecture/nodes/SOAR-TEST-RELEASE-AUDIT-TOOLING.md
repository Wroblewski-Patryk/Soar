---
id: SOAR-TEST-RELEASE-AUDIT-TOOLING
name: "Release and audit tooling tests"
type: test
status: verified_local
layer: testing
module: release
feature: release-audit-tooling
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Release and audit tooling tests

| Field | Value |
| --- | --- |
| Description | Focused tests and aggregate audit checks for V1 preflight release gate operator unblock packet reusable audit validators and repository path resolution. |
| File path | scripts/checkOperatorUnblockPacket.test.mjs |
| Related files | scripts/resolveRepositoryPath.test.mjs, scripts/runV1ReleaseGate.test.mjs, scripts/runV1FinalPreflight.test.mjs, history/tasks/operator-unblock-default-current-packet-2026-05-24-task.md, history/tasks/reusable-audit-history-path-resolver-2026-05-24-task.md |
| Parent | [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] |
| Children |  |
| Depends on | [[SOAR-TOOL-V1-FINAL-PREFLIGHT]], [[SOAR-TOOL-V1-RELEASE-GATE]], [[SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK]], [[SOAR-TOOL-REUSABLE-AUDIT-CHECKERS]], [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]] |
| Used by | [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-GUARDRAILS]] |
| Docs related | [[SOAR-DOC-TESTING]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Validated with preflight/release gate tests operator packet tests reusable audit verify guardrails docs parity and diff whitespace checks. |

## Relations

- verifies -> [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]] (verified_local)
- verified_by <- [[SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK]] (verified_local)
- verified_by <- [[SOAR-TOOL-REUSABLE-AUDIT-CHECKERS]] (verified_local)
- verified_by <- [[SOAR-TOOL-V1-FINAL-PREFLIGHT]] (verified_local)
- verified_by <- [[SOAR-TOOL-V1-RELEASE-GATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
