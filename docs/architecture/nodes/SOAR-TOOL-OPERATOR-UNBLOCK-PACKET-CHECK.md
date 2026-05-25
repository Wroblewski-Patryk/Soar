---
id: SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK
name: "Operator unblock packet validator"
type: validator
status: verified_local
layer: tooling
module: release
feature: release-audit-tooling
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validator, tooling, verified_local]
---

# Operator unblock packet validator

| Field | Value |
| --- | --- |
| Description | Fail-closed validator for latest V1 operator unblock packet and protected input readiness consistency. |
| File path | scripts/checkOperatorUnblockPacket.mjs |
| Related files | history/artifacts/v1-operator-unblock-packet-380308d1-2026-05-24.json, history/artifacts/v1-protected-input-readiness-380308d1-2026-05-24.json |
| Parent | [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] |
| Children |  |
| Depends on | [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]] |
| Used by | [[SOAR-WORKFLOW-RELEASE-AUDIT-TOOLING-CHAIN]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] |
| Docs related | [[SOAR-DOC-TESTING]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Default command now selects latest dated packet unless an explicit packet is supplied. |

## Relations

- uses -> [[SOAR-TOOL-REPOSITORY-PATH-RESOLVER]] (verified_local)
- verified_by -> [[SOAR-TEST-RELEASE-AUDIT-TOOLING]] (verified_local)
- uses -> [[SOAR-TOOL-V1-FINAL-PREFLIGHT]] (verified_local)
- contains <- [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
